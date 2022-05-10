<template>
  <div class="controller" v-show="!seemarket">
    <h1 v-show="isConnected">Account: {{ account }}</h1>
    <button v-show="!isConnected" @click="connect">Connect Ale</button>
    <button v-show="isConnected" @click="approveMoney" ref="btnToggle">See All the Items In the Market</button>
  </div>

  <div class="market" v-show="seemarket">
    <div class='list-group list-group-local all-on-market'>
      This is the list of all onsell equipments.
        <a v-for='(product, idx) in allonsell' :key="idx" class='list-group-item-local list-group-item'
           v-on:click='toggleActiveIndex(allonsell, idx)'
           :class="{'list-group-item aria-current': idx == activeIndex && allonsell == activeList}">
          {{ product }}
        </a>
    </div>

    <div class='list-group list-group-local self-on'>
      This is the list of all of YOUR onsell equipments.
      <a v-for='(product, idx) in youronsell' :key="idx" class='list-group-item-local list-group-item'
         v-on:click='toggleActiveIndex(youronsell, idx)'
         :class="{'active': idx == activeIndex && youronsell == activeList}">
        {{ product }}
      </a>
    </div>

    <div class='list-group list-group-local self-other'>
      This is the list of all of YOUR other equipments.
      <a v-for='(product, idx) in yourother' :key="idx" class='list-group-item-local list-group-item'
         v-on:click='toggleActiveIndex(yourother, idx)'
         :class="{'active': idx == activeIndex && yourother == activeList}">
        {{ product }}
      </a>
    </div>

    <div class="buttons">
      <button @click="buyequipment">Buy</button>
      <button @click="cancelsell">Cancel the Sell</button>
      <input v-model="sellprice" placeholder="Your Price">
      <button @click="sellequipment">Sell</button>
    </div>
  </div>
</template>

<script>

import services from "@/api";

export default {
  data() {
    return {
      account: "",
      isConnected: false,
      seemarket: false,

      activeIndex: null,
      activeList: null,
      allonsell: [],
      youronsell: [],
      yourother: [],

      sellprice: ""
    };
  },
  watch: {
    "$store.state.dapp": {
      handler(val) {
        this.account = val.account;
        this.isConnected = val.isConnected;
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    connect() {
      window["aleereum"] && window["aleereum"].connect();
    },
    approveMoney() {
      // services.getAllMyNotOnsellEquipment().then((res) => {
      //   console.log(res)
      // });
      services.getAllMyOnsellEquipment().then((res) => {
        this.youronsell = res
      });
      services.getAllOnsellEquipment().then((res) => {
        this.allonsell = res
      });
      services.getAllMyNotOnsellEquipment().then((res) => {
        this.yourother = res
      });
      this.$refs.btnToggle.innerText = "Refresh the Market List"
      this.seemarket = true
    },
    toggleActiveIndex: function (list, index) {
      this.activeIndex = index;
      this.activeList = list;
    },

    buyequipment() {
      console.log("buy the onsell equipment")
      var id = this.allonsell[this.activeIndex].id
      var price = this.allonsell[this.activeIndex].price
      console.log("id is ", id)
      console.log("price is ", price)
      services.BuyEquipment(id, price).then(() => {
        // refresh the list
        services.getAllMyOnsellEquipment().then((res) => {
          this.youronsell = res
        });
        services.getAllOnsellEquipment().then((res) => {
          this.allonsell = res
        });
        services.getAllMyNotOnsellEquipment().then((res) => {
          this.yourother = res
        });
        this.sellprice = ""
      })
    },
    cancelsell() {
      console.log("cancel the onsell equipment")
      var id = this.youronsell[this.activeIndex].id
      console.log("id is ", id)
      services.CancelSellEquipment(id).then(() => {
        // refresh the list
        services.getAllMyOnsellEquipment().then((res) => {
          this.youronsell = res
        });
        services.getAllOnsellEquipment().then((res) => {
          this.allonsell = res
        });
        services.getAllMyNotOnsellEquipment().then((res) => {
          this.yourother = res
        });
        this.sellprice = ""
      })
    },
    sellequipment() {
      console.log("sell my equipment")
      if (this.sellprice === "") {
        alert("Please set the price!")
      } else {
        console.log(this.sellprice)

        console.log(this.yourother[this.activeIndex])
        var id = this.yourother[this.activeIndex].id
        console.log("id is ", id)
        services.SellEquipment(id, this.sellprice).then(() => {
          // refresh the list
          services.getAllMyOnsellEquipment().then((res) => {
            this.youronsell = res
          });
          services.getAllOnsellEquipment().then((res) => {
            this.allonsell = res
          });
          services.getAllMyNotOnsellEquipment().then((res) => {
            this.yourother = res
          });
          this.sellprice = ""
        })
      }
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

/*ul {*/
/*  list-style-type: none;*/
/*  padding: 0;*/
/*}*/

/*li {*/
/*  display: inline-block;*/
/*  margin: 0 10px;*/
/*}*/

a {
  color: #42b983;
}

body {
  background: #20262E;
  padding: 20px;
  font-family: Helvetica;
}

#app {
  background: #fff;
  border-radius: 4px;
  padding: 20px;
  transition: all 0.2s;
}

li {
  margin: 8px 0;
}

h2 {
  font-weight: bold;
  margin-bottom: 15px;
}

del {
  color: rgba(0, 0, 0, 0.3);
}

.market {
  width: 95vw;
  height: 85vh;
  padding: 2.5vw;
}

.all-on-market {
  width: 50%;
  height: 100%;
  float: left;
}

.self-on {
  width: 45%;
  height: 40%;
  float: right;
}

.self-other {
  width: 45%;
  height: 40%;
  float: right;
  margin-top: 10px;
}

.list-group-local {
  border: 1px solid black;
  padding: 5px;
}

.list-group-item-local {
  float: right;
  display: block;
  transition: all .3s ease-in;
}

.list-group-item:hover {
  background: lightgray;
}

.list-group-item.active {
  background: black;
  color: white;
}

.buttons {
  width: 45%;
  float: right;
  margin-top: 10px;
}

</style>
