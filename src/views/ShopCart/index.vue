<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul class="cart-list" v-for="cart in cartInfoList" :key="cart.id">
          <li class="cart-list-con1">
            <input
              type="checkbox"
              name="chk_list"
              :checked="cart.isChecked == 1"
              @change="updateChecked(cart, $event)"
            />
          </li>
          <li class="cart-list-con2">
            <img :src="cart.imgUrl" />
            <div class="item-msg">
              {{ cart.skuName }}
            </div>
          </li>
          <li class="cart-list-con4">
            <span class="price">{{ cart.skuPrice }}.00</span>
          </li>
          <li class="cart-list-con5">
            <a
              href="javascript:void(0)"
              class="mins"
              @click="handler('minus', -1, cart)"
              >-</a
            >
            <!-- 在DOM事件的回调函数中传入参数$event，可以获取到该事件的事件对象 -->
            <input
              autocomplete="off"
              type="text"
              minnum="1"
              class="itxt"
              :value="cart.skuNum"
              @change="handler('change', $event.target.value * 1, cart)"
            />
            <a
              href="javascript:void(0)"
              class="plus"
              @click="handler('add', 1, cart)"
              >+</a
            >
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{ cart.skuNum * cart.skuPrice }}</span>
          </li>
          <li class="cart-list-con7">
            <a class="sindelet" @click="deleteCartById(cart)">删除</a>
            <br />
            <a href="#none">移到收藏</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input
          class="chooseAll"
          type="checkbox"
          :checked="isAllCheck && cartInfoList.length > 0"
          @change="updateAllCartChecked"
        />
        <span>全选</span>
      </div>
      <div class="option">
        <a @click="deleteAllCheckedCart">删除选中的商品</a>
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择 <span>0</span>件商品</div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{ totalPrice }}</i>
        </div>
        <div class="sumbtn">
          <a class="sum-btn" target="_blank" @click="$router.push('/trade')"
            >结算</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import throttle from "lodash/throttle";
export default {
  name: "ShopCart",
  mounted() {
    this.getData();
  },
  computed: {
    ...mapGetters(["cartInfoList"]),
    //计算购买所有产品的总价
    totalPrice() {
      let sum = 0;
      if (!this.cartInfoList.length == 0) {
        let arr = this.cartInfoList.filter((item) => item.isChecked == 1);
        sum = arr.reduce((sum, item) => {
          sum += item.skuPrice * item.skuNum;
          return sum;
        }, 0);
      }
      return sum;
    },
    //判断底部的复选框是否勾选【全部产品都选中---勾选】
    isAllCheck() {
      //数组every方法,数组中的元素只要有一个为假,就返回false
      return this.cartInfoList.every((item) => item.isChecked == 1);
    },
  },
  methods: {
    getData() {
      //获取个人的购物车数据
      this.$store.dispatch("getCartList");
    },
    //修改某一个产品的个数---这里建议节流,不然点的快了，减号会出现负数或者零---建议节流---自己加的,测试后可解决Bug
    //使用节流函数throttle,不要忘记通过lodash插件引入
    handler: throttle(async function (type, disNum, cart) {
      //typr:用来区分这三个元素
      //目前disNum形参:  + 变化量(1) - 变化量(-1)  input 传递的是输入的值,而不是变化量,要计算一下
      //cart:点击的产品对象【所传入的对象带有产品的所有信息,可以用来获取产品的id】
      //向服务器发请求,修改数量
      switch (type) {
        //加号
        case "add":
          //带给服务器变化量
          disNum = 1;
          break;
        case "minus":
          //判断产品个数大于1,才可以传递给服务器-1
          /* if (cart.skuNum > 1) {
            disNum = -1;
          } else {
            //产品的个数小于等于1
            disNum = 0;
          } */
          disNum = cart.skuNum > 1 ? -1 : 0;
          break;
        case "change":
          /* //用户输入进来的最值是非法的(带有汉字和字符),
          if (isNaN(disNum) || disNum < 1) {
            disNum = 0;
          } else {
            //输入正常情况,小数向下取整---parseInt,然后求出变化的量
            disNum = parseInt(disNum) - cart.skuNum;
          } */
          disNum =
            isNaN(disNum) || disNum < 1 ? 0 : parseInt(disNum) - cart.skuNum;
      }

      //派发action
      try {
        //代表的是修改成功
        await this.$store.dispatch("addOrUpdateShopCart", {
          skuId: cart.skuId,
          skuNum: disNum,
        });
        //再一次获取服务器最新的数据进行展示
        this.getData();
      } catch (error) {
        alert(error.message);
      }
    }, 700),
    //删除某个产品的操作
    //try-catch 语句，作为 JavaScript 中处理异常的一种标准方式
    //如果 try 块中的任何代码发生了错误，就会立即退出代码执行过程，然后接着执行 catch 块。此时，catch 块会接收到一个包含错误信息的对象.即使你不想使用这个错误对象，也要给它起个名字。这个对象中包含一个保存着错误消息的 message 属性和一个保存错误类型的 name 属性
    async deleteCartById(cart) {
      try {
        //如果删除成功,就再次发请求获取新的数据进行展示
        await this.$store.dispatch("deleteCartListBySkuId", cart.skuId);
        this.getData();
      } catch (error) {
        alert(error.message);
      }
    },
    //修改购物车中商品的选中状态
    async updateChecked(cart, event) {
      // console.log(event.target.checked);//属性值为true或者false
      try {
        let isChecked = event.target.checked ? "1" : "0";
        await this.$store.dispatch("updateCheckedById", {
          skuId: cart.skuId,
          isChecked,
        });
        //如果修改成功,再次获取服务器数据(购物车数据)
        //这里再次发请求,购物车中的总价和复选框才会更新
        this.getData();
      } catch (error) {
        //如果失败,弹窗提示
        alert(error.message);
      }
    },
    //删除全部选中的商品
    //这里要注意:删除全部选中商品的a标签和商品信息不在一个结构内,a标签没办法获取到商品信息属性,无法通过cart进行传参
    async deleteAllCheckedCart() {
      //利用仓库中删除单个商品的函数
      try {
        //派发action
        await this.$store.dispatch("deleteAllCheckedCart");
        //再次发请求获取购物车列表
        this.getData();
      } catch (error) {
        alert(error.message);
      }
    },
    //修改全部商品选中的状态
    async updateAllCartChecked(event) {
      try {
        let isChecked = event.target.checked ? 1 : 0;
        //派发action
        await this.$store.dispatch("updateAllCartIsChecked", isChecked);
        this.getData();
      } catch (error) {
        alert(error.message);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      & > div {
        float: left;
      }

      .cart-th1 {
        width: 25%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 25%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;
      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        & > li {
          float: left;
        }

        .cart-list-con1 {
          width: 15%;
        }

        .cart-list-con2 {
          width: 35%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }

        .cart-list-con4 {
          width: 10%;
        }

        .cart-list-con5 {
          width: 15%;

          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 33px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }
        }

        .cart-list-con6 {
          width: 12.5%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 12.5%;

          a {
            color: #666;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
      }
    }

    .money-box {
      float: right;

      .chosed {
        line-height: 26px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 22px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: "Microsoft YaHei";
          background: #e1251b;
          overflow: hidden;
        }
      }
    }
  }
}
</style>