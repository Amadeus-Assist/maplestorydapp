import contract from '../contract';

// import store from '../store'

// import Big from 'bignumber.js'
const Mcp = require('mcp.js')
const abi = require('../abi.json')
export default {
    async getName() {
        return await contract.Instance.methods.name().call();
    },
    async getSymbol() {
        return await contract.Instance.methods.symbol().call();
    },
    async approve() {
        // const approveAmount = new Big(limit).times('1e16').toString();
        // const response = await contract.Instance.methods.depositMoney(store.state.dapp.account).sendToBlock({
        //     from: store.state.dapp.account,
        //     amount: approveAmount
        // });
        const options = {
            host: "18.182.45.18",
            port: "8765"
        }
        const user = "0x090d314F311be6c0D3CEd452730251eCF45e6Cb6"
        let mcp = new Mcp(options)
        mcp.Contract.setProvider('http://18.182.45.18:8765/')
        let myContract = new mcp.Contract(abi, '0xcd55c2b7E1A4273876353DB9f780a56b6d139374')
        const response = await myContract.methods.equipmentOfOwner(user).call()
        console.log(response);

        return response;
    }
}