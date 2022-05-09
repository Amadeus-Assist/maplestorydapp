import { createStore } from 'vuex'

export default createStore({
    state: {
        dapp: {
            isAle: false,
            isAleEnabled: false,
            networkId: 3,
            account: "",
            isConnected: false
        },
    },
    getters: {
        usingAle: state => state.dapp.isAle,
    },
    mutations: {
        M_SET_DAPP_NETWORK(state, networkId) {
            state.dapp.networkId = networkId;
        },
        M_SET_DAPP_CONNECT(state, connect) {
            state.dapp.isConnected = connect;
        },
        M_SET_DAPP_ENABLE(state, isAleEnabled) {
            state.dapp.isAleEnabled = isAleEnabled;
        },
        M_SET_DAPP_ACCOUNT(state, dappAccount) {
            state.dapp.account = dappAccount;
        },
        IS_ALE(state, isAle) {
            state.dapp.isAle = isAle;
        },
        IS_ALE_ENABLED(state, isEnabled) {
            state.dapp.isAleEnabled = isEnabled;
        },
    }
})