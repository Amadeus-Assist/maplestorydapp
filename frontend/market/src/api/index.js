import contract from '../contract';

import store from '../store'

import Big from 'bignumber.js'
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
        var allequips = []
        for (var i of response) {
            var weapon = await myContract.methods.getEquipment(i).call()
            console.log(weapon)
            if (weapon["onsell"]) {
                allequips.push(weapon)
            }
        }
        return allequips;
    },
    async getAllMyOnsellEquipment() {
        const options = {
            host: "18.182.45.18",
            port: "8765"
        }
        const user = store.state.dapp.account
        let mcp = new Mcp(options)
        mcp.Contract.setProvider('http://18.182.45.18:8765/')
        let myContract = new mcp.Contract(abi, '0xcd55c2b7E1A4273876353DB9f780a56b6d139374')
        const response = await myContract.methods.equipmentOfOwner(user).call()
        // console.log(response);
        var allequips = []
        for (var i of response) {
            var weapon = await myContract.methods.getEquipment(i).call()
            weapon["id"] = i
            if (weapon["onSell"] == true) {
                allequips.push(weapon)
            }
        }
        console.log("This is my the onsell equipments: ", allequips)
        return allequips;
    },
    async getAllMyNotOnsellEquipment() {
        const options = {
            host: "18.182.45.18",
            port: "8765"
        }
        const user = store.state.dapp.account
        let mcp = new Mcp(options)
        mcp.Contract.setProvider('http://18.182.45.18:8765/')
        let myContract = new mcp.Contract(abi, '0xcd55c2b7E1A4273876353DB9f780a56b6d139374')
        const response = await myContract.methods.equipmentOfOwner(user).call()
        // console.log(response);
        var allequips = []
        for (var i of response) {
            var weapon = await myContract.methods.getEquipment(i).call()
            weapon["id"] = i
            if (weapon["onSell"] == false) {
                allequips.push(weapon)
            }
        }
        console.log("This is my not onsell equipments: ", allequips)
        return allequips;
    },
    async getAllOnsellEquipment() {
        const options = {
            host: "18.182.45.18",
            port: "8765"
        }
        let mcp = new Mcp(options)
        mcp.Contract.setProvider('http://18.182.45.18:8765/')
        let myContract = new mcp.Contract(abi, '0xcd55c2b7E1A4273876353DB9f780a56b6d139374')
        const response = await myContract.methods.allOnSellEquipments().call()
        // console.log(response);
        var allequips = []
        for (var i of response) {
            var weapon = await myContract.methods.getEquipment(i).call()
            weapon["id"] = i
            allequips.push(weapon)
            // console.log(weapon)
        }
        console.log("This is all onsell equipments: ", allequips)
        return allequips;
    },
    async SellEquipment(id, price) {
        const approveAmount = new Big(price).times('1e15');

        const options = {
            host: "18.182.45.18",
            port: "8765"
        }
        let mcp = new Mcp(options)
        mcp.Contract.setProvider('http://18.182.45.18:8765/')
        let myContract = new mcp.Contract(abi, '0xcd55c2b7E1A4273876353DB9f780a56b6d139374')
        console.log("account is ", store.state.dapp.account)
        const response = await myContract.methods.sellEquipment(id, approveAmount.toString()).sendToBlock({
            from: store.state.dapp.account,
            amount: new Big(0).toString()
        });

        console.log(response);
        return response;
    },
    async BuyEquipment(id, price) {
        const options = {
            host: "18.182.45.18",
            port: "8765"
        }
        let mcp = new Mcp(options)
        mcp.Contract.setProvider('http://18.182.45.18:8765/')
        let myContract = new mcp.Contract(abi, '0xcd55c2b7E1A4273876353DB9f780a56b6d139374')
        console.log("account is ", store.state.dapp.account)
        const response = await myContract.methods.purchaseEquipment(id).sendToBlock({
            from: store.state.dapp.account,
            amount: price
        });

        console.log(response);
        return response;
    },
    async CancelSellEquipment(id) {
        const options = {
            host: "18.182.45.18",
            port: "8765"
        }
        let mcp = new Mcp(options)
        mcp.Contract.setProvider('http://18.182.45.18:8765/')
        let myContract = new mcp.Contract(abi, '0xcd55c2b7E1A4273876353DB9f780a56b6d139374')
        console.log("account is ", store.state.dapp.account)
        const response = await myContract.methods.cancelOnSell(id).sendToBlock({
            from: store.state.dapp.account,
            amount: new Big(0).toString()
        });

        console.log(response);
        return response;
    },
}