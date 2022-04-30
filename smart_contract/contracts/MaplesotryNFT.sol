//Contract based on https://docs.openzeppelin.com/contracts/3.x/erc721
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

// implements the ERC721 standard
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// keeps track of the number of tokens issued
import "@openzeppelin/contracts/utils/Counters.sol";

// Accessing the Ownable method ensures that only the creator of the smart contract can interact with it
contract MaplestoryDappNFT is ERC721 {
    //    using Counters for Counters.Counter;
    //    Counters.Counter private _tokenIds;
    Equipment[] equipments;
    address payable public operatorAddress;
    mapping(address => uint256) deposit;
    mapping(uint256 => OnSell) tokenIdToOnSell;
    uint256 totalOnSell;
    uint256 remainBalance;
    //    bool public paused = false;
    //    mapping(address => uint256) ownershipWeaponCount;
    //    mapping(uint256 => address) weaponIndexToOwner;

    struct Equipment {
        string name;
        uint32 attack;
        uint32 defense;
        uint32 magic_defense;
        uint32 power_hit;
        uint32 drop_time;
    }

    struct OnSell {
        address seller;
        uint128 price;
    }

    // @dev Access modifier for operator-only functionality
    modifier onlyOperator(){
        require(msg.sender == operatorAddress);
        _;
    }

    // the name and symbol for the NFT
    constructor() ERC721("MaplestoryDappNFT", "MSD") {
        operatorAddress = payable(msg.sender);
        Equipment memory _initEmptyEquipment = Equipment({
        name : "init",
        attack : 0,
        defense : 0,
        magic_defense : 0,
        power_hit : 0,
        drop_time : 0
        });
        equipments.push(_initEmptyEquipment);
    }

    // Create a function to mint/create the NFT
    // receiver takes a type of address. This is the wallet address of the user that should receive the NFT minted using the smart contract
    // tokenURI takes a string that contains metadata about the NFT
    function createEquipmentNFT(address receiver, string memory name, uint256 attack, uint256 defense, uint256
        magic_defense, uint256 power_hit, uint256 drop_time, uint256 cost)
    public onlyOperator
    returns (uint256)
    {
        //        _tokenIds.increment();
        require(deposit[receiver] >= cost, "Insufficient deposit");
        require(drop_time == uint256(uint32(drop_time)));
        require(attack == uint256(uint32(attack)));
        require(defense == uint256(uint32(defense)));
        require(magic_defense == uint256(uint32(magic_defense)));
        require(power_hit == uint256(uint32(power_hit)));

        Equipment memory _equipment = Equipment({
        name : name,
        attack : uint32(attack),
        defense : uint32(defense),
        magic_defense : uint32(magic_defense),
        power_hit : uint32(power_hit),
        drop_time : uint32(drop_time)
        });

        equipments.push(_equipment);
        uint256 newEquipmentId = equipments.length - 1;
        require(newEquipmentId == uint256(uint32(newEquipmentId)));

        //        uint256 newItemId = _tokenIds.current();
        deposit[receiver] -= cost;
        _safeMint(receiver, newEquipmentId);
        //        _setTokenURI(newItemId, tokenURI);

        // returns the id for the newly created token
        return newEquipmentId;
    }

    function totalSupply() public view returns (uint) {
        return equipments.length - 1;
    }

    function equipmentOfOwner(address _owner) external view returns (uint256[] memory ownerTokens) {
        uint256 equipmentCount = balanceOf(_owner);

        if (equipmentCount == 0) {
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](equipmentCount);
            uint256 totalEquipment = totalSupply();
            uint256 resultIndex = 0;

            uint256 equipmentId;

            for (equipmentId = 1; equipmentId <= totalEquipment; equipmentId++) {
                if (ownerOf(equipmentId) == _owner) {
                    result[resultIndex] = equipmentId;
                    resultIndex++;
                }
            }
            return result;
        }
    }

    function getEquipment(uint256 _id) external view returns (
        string memory name,
        uint32 attack,
        uint32 defense,
        uint32 magic_defense,
        uint32 power_hit,
        uint32 drop_time,
        bool onSell
    ){
        Equipment storage equipment = equipments[_id];
        name = equipment.name;
        attack = equipment.attack;
        defense = equipment.defense;
        magic_defense = equipment.magic_defense;
        power_hit = equipment.power_hit;
        drop_time = equipment.drop_time;
        onSell = tokenIdToOnSell[_id].seller != address(0);
    }

    event SuccessDeposit(uint256 amount, address receiver, address sender);

    function depositMoney(address _receiver) payable public {
        deposit[_receiver] += msg.value;
        require(operatorAddress.send(msg.value));
        emit SuccessDeposit(msg.value, _receiver, msg.sender);
    }

    function getDeposit(address _owner) external view returns (uint256){
        return deposit[_owner];
    }

    event PlaceOnMarket(uint256 tokenId, uint256 price, address seller);
    event EquipmentSoldOut(uint256 tokenId, uint256 price, address seller, address buyer);
    event CancelOnSell(uint256 tokenId, uint256 price, address seller);

    function sellEquipment(uint256 _id, uint256 price) public {
        require(price == uint256(uint128(price)));
        require(tokenIdToOnSell[_id].seller == address(0), "equipment already on sell");
        require(ownerOf(_id) == msg.sender, "only owner can sell his equipment");

        OnSell memory _newOnSell = OnSell({
        seller : msg.sender,
        price : uint128(price)
        });
        tokenIdToOnSell[_id] = _newOnSell;
        totalOnSell++;
        emit PlaceOnMarket(_id, price, msg.sender);
    }

    function purchaseEquipment(uint256 _id) payable public {
        require(msg.value == uint256(uint128(msg.value)));
        require(tokenIdToOnSell[_id].seller != address(0), "equipment not on sell");
        require(msg.value >= tokenIdToOnSell[_id].price, "insufficient money");

        uint128 price = tokenIdToOnSell[_id].price;
        address payable seller = payable(tokenIdToOnSell[_id].seller);
        address payable buyer = payable(msg.sender);
        uint128 excessMoney = uint128(msg.value) - price;

        require(seller.send(price));
        require(buyer.send(excessMoney));
        _safeTransfer(seller, msg.sender, _id, "");
        delete tokenIdToOnSell[_id];
        totalOnSell--;

        emit EquipmentSoldOut(_id, price, seller, msg.sender);
    }

    function cancelOnSell(uint256 _id) public {
        require(tokenIdToOnSell[_id].seller != address(0), "equipment not on sell");
        require(ownerOf(_id) == msg.sender, "only owner can cancel on-sell his equipment");

        uint128 price = tokenIdToOnSell[_id].price;
        delete tokenIdToOnSell[_id];
        totalOnSell--;
        emit CancelOnSell(_id, price, msg.sender);
    }

    function allOnSellEquipments() external view returns (uint256[] memory onSellTokens){
        if (totalOnSell == 0) {
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](totalOnSell);
            uint256 totalEquipment = totalSupply();
            uint256 resultIndex = 0;

            uint256 equipmentId;

            for (equipmentId = 1; equipmentId <= totalEquipment; equipmentId++) {
                if (tokenIdToOnSell[equipmentId].seller != address(0)) {
                    result[resultIndex] = equipmentId;
                    resultIndex++;
                }
            }
            return result;
        }
    }

    function sendToContract() public payable {
        remainBalance += msg.value;
    }

    function getContractBalance() external view returns (uint256){
        return remainBalance;
    }

    function withdrawBalance(uint256 amount) onlyOperator public {
        require(amount <= remainBalance, "insufficient balance");
        require(operatorAddress.send(amount));
        remainBalance -= amount;
    }

    function withdrawAllBalance() onlyOperator public {
        require(operatorAddress.send(remainBalance));
        remainBalance = 0;
    }
}