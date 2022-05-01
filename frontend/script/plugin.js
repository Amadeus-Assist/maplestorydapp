import store from "./store";

window.onload = function () {
    if (typeof window.aleereum !== "undefined") {
        const provider = window["aleereum"];

        if (provider.isAle) {
            store.commit("IS_ALE", true);
            store.commit("M_SET_DAPP_ACCOUNT", provider.account);
            store.commit("M_SET_DAPP_CONNECT", provider.isConnected);
            store.commit("M_SET_DAPP_NETWORK", provider.networkId);
            store.commit("IS_ALE_ENABLED", !provider.islocked);

        } else {
            store.commit("HAS_ALE", false);
        }
    } else {
        store.commit("IS_ALE", false);
    }
};