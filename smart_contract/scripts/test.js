require('dotenv').config();
const API_URL = process.env.HUYGENS_DEV_URL;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const alchemyWeb3 = createAlchemyWeb3(API_URL);
const contract = require("../artifacts/contracts/MaplesotryNFT.sol/MaplestoryDappNFT.json");
const contractAddress = "0x3762C9E19b3aD2E0808C667f34dEEE03335D4E2E";
const operatorAddress = process.env.OPERATOR_ADDRESS;
const operatorKey = process.env.OPERATOR_PRIVATE_KEY;
const nftContract = new alchemyWeb3.eth.Contract(contract.abi, contractAddress);

async function createEquipmentNFT(receiver, name, attack, defense, magic_defense, power_hit, drop_time, cost) {
    // get the nonce - nonce is needed for security reasons. It keeps track of the number of
    // transactions sent from our address and prevents replay attacks.
    const nonce = await alchemyWeb3.eth.getTransactionCount(operatorAddress, 'latest');
    const tx = {
        from: operatorKey, // our MetaMask public key
        to: contractAddress, // the smart contract address we want to interact with
        nonce: nonce, // nonce with the no of transactions from our account
        gas: 154920, // fee estimate to complete the transaction
        data: nftContract.methods
            .createEquipmentNFT(receiver, name, attack, defense, magic_defense, power_hit, drop_time, cost)
            .encodeABI(), // call the createNFT function from our OsunRiverNFT.sol file and pass the account that should receive the minted NFT.
    };

    const signPromise = alchemyWeb3.eth.accounts.signTransaction(
        tx,
        operatorKey
    );
    signPromise
        .then((signedTx) => {
            alchemyWeb3.eth.sendSignedTransaction(
                signedTx.rawTransaction,
                function (err, hash) {
                    if (!err) {
                        console.log(
                            "The hash of our transaction is: ",
                            hash,
                            "\nCheck Alchemy's Mempool to view the status of our transaction!"
                        );
                    } else {
                        console.log(
                            "Something went wrong when submitting our transaction:",
                            err
                        );
                    }
                }
            );
        })
        .catch((err) => {
            console.log(" Promise failed:", err);
        });
}

createEquipmentNFT("0x4135E35Bb807f8e7eD4daAD179Cb9c5f17f326bc", "blade", 100, 100, 100,100, 12130, 154920*50*2).catch((err) =>{
    console.log(" Promise failed:", err);
});

