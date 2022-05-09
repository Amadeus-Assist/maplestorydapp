<template>
  <div class="hello">
    <h1 v-show="isConnected">{{ account }}</h1>
    <button v-show="!isConnected" @click="connect">Connect Ale</button>
    <div style="color: #f00" v-show="isConnected">Connect Success!</div>
    <button v-show="isConnected" @click="approveMoney">approve $100</button>

  <div class='list-group'>
    This is the list of all onsell equipments.
  <a v-for='(product, idx) in allonsell' :key="idx" class='list-group-item'
     v-on:click='toggleActiveIndex(allonsell, idx)' 
     :class="{'active': idx == activeIndex && allonsell == activeList}" >
  {{product}}
  </a>
  </div>
  <button  @click="buyequipment">Buy</button>

  <div class='list-group'>
    This is the list of all of YOUR onsell equipments.
     <a v-for='(product, idx) in youronsell' :key="idx" class='list-group-item'
        v-on:click='toggleActiveIndex(youronsell, idx)' 
        :class="{'active': idx == activeIndex && youronsell == activeList}" >
     {{product}} 
     </a>
  </div>
  <button  @click="cancelsell">Cancel the Sell</button>

  <div class='list-group'>
    This is the list of all of YOUR other equipments.
     <a v-for='(product, idx) in yourother' :key="idx" class='list-group-item'
        v-on:click='toggleActiveIndex(yourother, idx)' 
        :class="{'active': idx == activeIndex && yourother == activeList}" >
     {{product}} 
     </a>
  </div>
  <input v-model="sellprice" placeholder="Your Price">
  <button  @click="sellequipment">Sell</button>
  </div>
</template>

<script>

import services from "@/api";

export default {
  data() {
    return {
      account: "",
      isConnected: false,

      activeIndex: null,
      activeList: null,
      allonsell: ['a', 'b', 'c'],
      youronsell: ['1244', '125215', '02150'],
      yourother: ['1244', '125215', '02150'],

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
      services.getName().then(res => {
        console.log(res);
      });
      services.approve(1).then((res) => {
        console.log(res);
      });
    },
    toggleActiveIndex: function(list,index){
     this.activeIndex = index;
     this.activeList = list;
   },
    buyequipment() {
      console.log("buy the onsell equipment")
    },
    cancelsell() {
      console.log("cancel the onsell equipment")
    },
    sellequipment() {
      if (this.sellprice === "") {
        alert("Please set the price!")
      } else {
        console.log("Sell the equipment")
        console.log(this.sellprice)
        this.sellprice = ""
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
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
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

.list-group {
  border: 1px solid black;
  padding: 5px;
  margin-top: 5px;
}

.list-group-item {
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
</style>
