import contract from '../contract';

import store from '../store'

import Big from 'bignumber.js'

export default {
    async getName() {
        return await contract.Instance.methods.name().call();
    },
    async getSymbol() {
        return await contract.Instance.methods.symbol().call();
    },
    async approve(limit) {
        const approveAmount = new Big(limit).times('1e16').toString();
        const response = await contract.Instance.methods.depositMoney(store.state.dapp.account).sendToBlock({
            from: store.state.dapp.account,
            amount: approveAmount
        });

        if (response.success) {
            console.log('transaction success: ', response);
        } else {
            console.log('transaction failed: ', response);
        }

        return response;
    }
}