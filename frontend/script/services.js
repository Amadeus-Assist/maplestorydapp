
import store from './store'

import Big from 'bignumber.js'

const Mcp = require('./mcp.js')
const abi = require('./abi.json')

export default {
    async deposit(limit) {
        const options = {
            host: "18.182.45.18",
            port: "8765"
        }
        let mcp = new Mcp(options)
        mcp.Contract.setProvider('http://18.182.45.18:8765/')
        let myContract = new mcp.Contract(abi, '0x7afE6C2596A434AdB04802d103e6BCfe452864De')

        // const operator = "0xD296cfEd720f30b48A6EF91EBad782E3042ffbA0"
        const receiver = "0x4135E35Bb807f8e7eD4daAD179Cb9c5f17f326bc"
        console.log(await mcp.request.accountBalance(receiver))

        const approveAmount = new Big(limit).times('1e16').toString();
        console.log('from: '+store.state.dapp.account, 'amount: '+ approveAmount);
        const response = await myContract.methods.depositMoney(receiver).sendToBlock({
            from: store.state.dapp.account,
            amount: approveAmount
        });
        return response;
    }
}