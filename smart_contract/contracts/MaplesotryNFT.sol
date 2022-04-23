//Contract based on https://docs.openzeppelin.com/contracts/3.x/erc721
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

// implements the ERC721 standard
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// keeps track of the number of tokens issued
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Accessing the Ownable method ensures that only the creator of the smart contract can interact with it
contract MaplestoryDappNFT is ERC721, Ownable {
    //    using Counters for Counters.Counter;
    //    Counters.Counter private _tokenIds;
    Weapon[] weapons;
    address public operatorAddress;
    //    bool public paused = false;
    //    mapping(address => uint256) ownershipWeaponCount;
    //    mapping(uint256 => address) weaponIndexToOwner;

    struct Weapon {
        string weapon_type;
        string name;
        uint64 drop_time;
        uint32 attack;
    }

    // @dev Access modifier for operator-only functionality
    modifier onlyOperator(){
        require(msg.sender == operatorAddress);
        _;
    }

    //    modifier whenPaused(){
    //        require(paused);
    //        _;
    //    }
    //
    //    modifier whenNotPaused(){
    //        require(!paused);
    //        _;
    //    }

    // the name and symbol for the NFT
    constructor() public ERC721("MaplestoryDappNFT", "MSD") {
        operatorAddress = msg.sender;
    }

    // Create a function to mint/create the NFT
    // receiver takes a type of address. This is the wallet address of the user that should receive the NFT minted using the smart contract
    // tokenURI takes a string that contains metadata about the NFT

    function createWeaponNFT(address receiver, string memory weapon_type, string memory name, uint256 drop_time,
        uint256 attack)
    public onlyOperator
    returns (uint256)
    {
        //        _tokenIds.increment();

        require(drop_time == uint256(uint64(drop_time)));
        require(drop_time == uint256(uint32(attack)));

        Weapon memory _weapon = Weapon({
        weapon_type : weapon_type,
        name : name,
        drop_time : uint64(drop_time),
        attack : uint32(attack)
        });

        weapons.push(_weapon);
        uint256 newWeaponId = weapons.length - 1;
        require(newWeaponId == uint256(uint32(newWeaponId)));

        //        uint256 newItemId = _tokenIds.current();
        _mint(receiver, newWeaponId);
        //        _setTokenURI(newItemId, tokenURI);

        // returns the id for the newly created token
        return newWeaponId;
    }

    function totalSupply() public view returns (uint) {
        return weapons.length - 1;
    }

    function weaponsOfOwner(address _owner) external view returns (uint256[] memory ownerTokens) {
        uint256 weaponsCount = balanceOf(_owner);

        if (weaponsCount == 0) {
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](weaponsCount);
            uint256 totalWeapons = totalSupply();
            uint256 resultIndex = 0;

            uint256 weaponId;

            for (weaponId = 1; weaponId <= totalWeapons; weaponId++) {
                if (ownerOf(weaponId) == _owner) {
                    result[resultIndex] = weaponId;
                    resultIndex++;
                }
            }
            return result;
        }
    }

    function getWeapon(uint256 _id) external view returns (
        string memory weapon_type,
        string memory name,
        uint64 drop_time,
        uint32 attack
    ){
        Weapon storage weapon = weapons[_id];
        weapon_type = weapon.weapon_type;
        name = weapon.name;
        drop_time = weapon.drop_time;
        attack = weapon.attack;
    }
}