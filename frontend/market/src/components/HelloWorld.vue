<template>
  <div>
    <div class="place-holder"></div>
    <h1 v-show="isConnected" class="account-info"><b>Account:</b> {{ account }}</h1>
    <button v-show="!isConnected" @click="connect" class="btn btn-success">Connect Ale</button>
    <button v-show="isConnected" @click="approveMoney" ref="btnToggle" class="btn btn-success">See All the Items In
      the Market
    </button>

    <div class="market" v-show="seemarket">
      <div class='list-group list-group-local all-on-market'>
        <b>This is the list of all onsell equipments.</b>
        <a v-for='(product, idx) in allonsell' :key="idx" class='list-group-item-local list-group-item '
           v-on:click='toggleActiveIndex(allonsell, idx)'
           :class="{'active': idx == activeIndex && allonsell == activeList}">

          <p class="item-content" v-show="product[0] == '刮胡刀' ">
            <img src="../assets/guahudao.png">
            {{ product.id._hex }} <b>name:</b> {{ product[0] }} <b>attack:</b> {{ product.attack }} <b>power hit:</b>
            {{ product.power_hit }}% <b>price: </b>{{ (parseInt(product.price._hex, 16)) / (1e18) }} cnn
            <br> <b> seller:</b> {{ product.seller }}
          </p>
          <p class="item-content" v-show="product[0] == '凤凰刃' "><img src="../assets/fenghuangren.png"> {{ product.id._hex }} <b>name:</b>
            {{ product[0] }} <b>attack:</b> {{ product.attack }} <b>power hit:</b> {{ product.power_hit }}%
            <b>price: </b>{{ (parseInt(product.price._hex, 16)) / (1e18) }} cnn<br> <b> seller:</b>
            {{ product.seller }}</p>
          <p class="item-content" v-show="product[0] == '枫叶刃' "><img src="../assets/fengyeren.png"> {{ product.id._hex }} <b>name:</b>
            {{ product[0] }} <b>attack:</b> {{ product.attack }} <b>power hit:</b> {{ product.power_hit }}%
            <b>price: </b>{{ (parseInt(product.price._hex, 16)) / (1e18) }} cnn <br> <b> seller:</b>
            {{ product.seller }}</p>
          <p class="item-content" v-show="product[0] == '双翼刃' "><img src="../assets/shuangyiren.png"> {{ product.id._hex }} <b>name:</b>
            {{ product[0] }} <b>attack:</b> {{ product.attack }} <b>power hit:</b> {{ product.power_hit }}%
            <b>price: </b>{{ (parseInt(product.price._hex, 16)) / (1e18) }} cnn <br> <b> seller:</b>
            {{ product.seller }}</p>

          <p class="item-content" v-show="product[0] == '黑唐衫'">
            <img src="../assets/heitangshan.png">
            {{ product.id._hex }} <b>name: </b> {{ product[0] }} <b> defense: </b>{{ product.defense }} <b>magic
            defense: </b>{{ product.magic_defense }}% <b>price:</b> {{ (parseInt(product.price._hex, 16)) / (1e18) }}
            cnn
            <br> <b>seller:</b> {{ product.seller }}
          </p>
          <p class="item-content" v-show="product[0] == '青梦'"><img src="../assets/qingmeng.png"> {{ product.id._hex }} <b>name: </b>
            {{ product[0] }} <b> defense: </b>{{ product.defense }} <b>magic defense: </b>{{ product.magic_defense }}%
            <b>price:</b> {{ (parseInt(product.price._hex, 16)) / (1e18) }} cnn <br> <b>seller:</b>
            {{ product.seller }} </p>
        </a>
      </div>
      <div>
        <div class='list-group list-group-local self-on'>
          <b>This is the list of all of YOUR onsell equipments.</b>
          <a v-for='(product, idx) in youronsell' :key="idx" class='list-group-item-local list-group-item'
             v-on:click='toggleActiveIndex(youronsell, idx)'
             :class="{'active': idx == activeIndex && youronsell == activeList}">
            <p class="item-content" v-show="product[0] == '刮胡刀'">
              <img src="../assets/guahudao.png">
              {{ product.id._hex }} <b>name:</b> {{ product[0] }} <b>attack:</b> {{ product.attack }} <b>power
              hit:</b> {{ product.power_hit }}% <b>price: </b>{{ (parseInt(product.price._hex, 16)) / (1e18) }} cnn
            </p>
            <p class="item-content" v-show="product[0] == '凤凰刃' "><img src="../assets/fenghuangren.png"> {{ product.id._hex }} <b>name:</b>
              {{ product[0] }} <b>attack:</b> {{ product.attack }} <b>power hit:</b> {{ product.power_hit }}%
              <b>price: </b>{{ (parseInt(product.price._hex, 16)) / (1e18) }}
              cnn </p>
            <p class="item-content" v-show="product[0] == '枫叶刃' "><img src="../assets/fengyeren.png"> {{ product.id._hex }} <b>name:</b>
              {{ product[0] }} <b>attack:</b> {{ product.attack }} <b>power hit:</b> {{ product.power_hit }}%
              <b>price: </b>{{ (parseInt(product.price._hex, 16)) / (1e18) }}
              cnn</p>
            <p class="item-content" v-show="product[0] == '双翼刃' "><img src="../assets/shuangyiren.png"> {{ product.id._hex }} <b>name:</b>
              {{ product[0] }} <b>attack:</b> {{ product.attack }} <b>power hit:</b> {{ product.power_hit }}%
              <b>price: </b>{{ (parseInt(product.price._hex, 16)) / (1e18) }}
              cnn </p>

            <p class="item-content" v-show="product[0] == '黑唐衫'">
              <img src="../assets/heitangshan.png">
              {{ product.id._hex }} <b>name: </b> {{ product[0] }} <b> defense: </b>{{ product.defense }} <b>magic
              defense: </b>{{ product.magic_defense }}% <b>price:</b>
              {{ (parseInt(product.price._hex, 16)) / (1e18) }} cnn
            </p>

            <p class="item-content" v-show="product[0] == '青梦'"><img src="../assets/qingmeng.png"> {{ product.id._hex }} <b>name: </b>
              {{ product[0] }} <b> defense: </b>{{ product.defense }} <b>magic
                defense: </b>{{ product.magic_defense }}% <b>price:</b>
              {{ (parseInt(product.price._hex, 16)) / (1e18) }} cnn </p>
          </a>
        </div>

        <div class='list-group list-group-local self-other'>
          <b>This is the list of all of YOUR other equipments.</b>
          <a v-for='(product, idx) in yourother' :key="idx" class='list-group-item-local list-group-item'
             v-on:click='toggleActiveIndex(yourother, idx)'
             :class="{'active': idx == activeIndex && yourother == activeList}">
            <p class="item-content" v-show="product[0] == '刮胡刀'">
              <img src="../assets/guahudao.png">
              {{ product.id._hex }} <b>name:</b> {{ product[0] }} <b>attack:</b> {{ product.attack }} <b>power
              hit:</b> {{ product.power_hit }}%
            </p>
            <p class="item-content" v-show="product[0] == '凤凰刃' "><img src="../assets/fenghuangren.png"> {{ product.id._hex }} <b>name:</b>
              {{ product[0] }} <b>attack:</b> {{ product.attack }} <b>power hit:</b> {{ product.power_hit }}% </p>
            <p class="item-content" v-show="product[0] == '枫叶刃' "><img src="../assets/fengyeren.png"> {{ product.id._hex }} <b>name:</b>
              {{ product[0] }} <b>attack:</b> {{ product.attack }} <b>power hit:</b> {{ product.power_hit }}% </p>
            <p v-show="product[0] == '双翼刃' "><img src="../assets/shuangyiren.png"> {{ product.id._hex }} <b>name:</b>
              {{ product[0] }} <b>attack:</b> {{ product.attack }} <b>power hit:</b> {{ product.power_hit }}% </p>

            <p class="item-content" v-show="product[0] == '黑唐衫' ">
              <img src="../assets/heitangshan.png">
              {{ product.id._hex }} <b>name: </b> {{ product[0] }} <b> defense: </b>{{ product.defense }} <b>magic
              defense: </b>{{ product.magic_defense }}%
            </p>
            <p class="item-content" v-show="product[0] == '青梦'"><img src="../assets/qingmeng.png"> {{ product.id._hex }} <b>name: </b>
              {{ product[0] }} <b> defense: </b>{{ product.defense }} <b>magic
                defense: </b>{{ product.magic_defense }}% </p>

          </a>
        </div>

        <div class="buttons">
          <button @click="buyequipment" class="btn btn-success buy-btn">Buy</button>
          <button @click="cancelsell" class="btn btn-success can-btn">Cancel the Sell</button>
          <input class="price-input" v-model="sellprice" placeholder="Your Price in mCCN">
          <button @click="sellequipment" class="btn btn-success sell-btn">Sell</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import services from "@/api";


export default {
  data() {
    return {
      account: "",
      isConnected: false,
      // seemarket: false,

      activeIndex: null,
      activeList: null,
      allonsell: [],
      youronsell: [],
      yourother: [],

      sellprice: "",


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
    },
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

.place-holder{
  height: 5vh;
}

body, html {
  width: 100vw;
  height: 100vh;
  margin: 0;
  /*padding: 20px;*/
  font-family: Dekko;
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

.account-info {
  font-size: 25px;
}

.market {
  width: 95vw;
  height: 80vh;
  padding: 2.5vw;
}

.all-on-market {
  width: 50%;
  height: 100%;
  float: left;
  overflow-y: scroll;
}

.self-on {
  width: 45%;
  height: 35vh;
  float: right;
  overflow-y: scroll;
}

.self-other {
  width: 45%;
  height: 35vh;
  float: right;
  margin-top: 10px;
  overflow-y: scroll;
}

.list-group-local {
  border: 1px solid black;
  padding: 5px;
}

.item-content{
  margin-bottom: 0;
}

.list-group-item-local {
  float: right;
  display: block;
  transition: all .3s ease-in;
  background-color: rgba(239,248,255,0);
  border-image: linear-gradient(to right, #8f41e9, rgba(10,24,247,0)) 1;
  border-bottom: 4px solid;
  border-top: 0;
  border-left: 0;
  border-right: 0;
}

.list-group-item:hover {
  background: lightgray;
}

.list-group-item.active {
  background: #eff8ff;
  color: black;
}


.buttons {
  width: 100%;
  float: right;
  margin-top: 10px;
}

.buy-btn {
  margin-right: 20px;
}

.can-btn {
  margin-right: 40px;
  margin-left: 20px;
}

.sell-btn {
  margin-left: 10px;
}

.price-input{
  background-color: rgba(26,46,87,0);
  color: rgba(240,247,209,0.94);
}

/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey;
  border-radius: 5px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: black;
  border-radius: 5px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: rgba(26,46,87,0.81);
}

</style>
