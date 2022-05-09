<template>
  <HelloWorld />
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";

import { mapGetters } from "vuex";

export default {
  name: "App",
  components: {
    HelloWorld,
  },
  computed: {
    ...mapGetters(["usingAle"]),
  },
  watch: {
    usingAle(val) {
      if (val) {
        this.listenDataChange();
      }
    },
  },
  methods: {
    handleNetworkChange(networkID) {
      this.$store.commit("M_SET_DAPP_NETWORK", networkID);
    },
    handleLockChange(status) {
      this.$store.commit("IS_ALE_ENABLED", !status);
    },
    handleConnectChange(status) {
      this.$store.commit("M_SET_DAPP_CONNECT", status);
    },
    handleAccountChange(account) {
      this.$store.commit("M_SET_DAPP_ACCOUNT", account);
    },
    listenDataChange() {
      window.aleereum.on("on_networkId_change", this.handleNetworkChange);
      window.aleereum.on("on_islocked_change", this.handleLockChange);
      window.aleereum.on("on_isConnected_change", this.handleConnectChange);
      window.aleereum.on("on_account_change", this.handleAccountChange);
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
