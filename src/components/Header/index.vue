<template>
  <!-- 头部 -->
  <header class="header">
    <!-- 头部的第一行 -->
    <div class="top">
      <div class="container">
        <div class="loginList">
          <p>尚品汇欢迎您！</p>
          <!-- 没有用户名---未登录 -->
          <p v-if="!userName">
            <span>请</span>
            <!-- 声明式导航：务必要添加to属性 -->
            <router-link to="/login">登录</router-link>
            <router-link class="register" to="/register">免费注册</router-link>
          </p>
          <!-- 有用户名---成功登录 -->
          <p v-else>
            <a>{{ userName }}</a>
            <a class="register" @click="logout">退出登录</a>
          </p>
        </div>
        <div class="typeList">
          <router-link to="/center/myorder">我的订单</router-link>
          <router-link to="/shopcart">我的购物车</router-link>
          <a href="###">我的尚品汇</a>
          <a href="###">尚品汇会员</a>
          <a href="###">企业采购</a>
          <a href="###">关注尚品汇</a>
          <a href="###">合作招商</a>
          <a href="###">商家后台</a>
        </div>
      </div>
    </div>
    <!--头部第二行 搜索区域-->
    <div class="bottom">
      <h1 class="logoArea">
        <router-link class="logo" to="/home">
          <img src="./images/logo.png" alt="" />
        </router-link>
      </h1>
      <div class="searchArea">
        <form action="###" class="searchForm">
          <input
            type="text"
            id="autocomplete"
            class="input-error input-xxlarge"
            v-model="keyword"
          />
          <button
            class="sui-btn btn-xlarge btn-danger"
            type="button"
            @click="goSearch"
          >
            搜索
          </button>
        </form>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      keyword: "",
    };
  },
  //搜索按钮的回调函数:需要向search路由进行跳转
  methods: {
    goSearch() {
      //路由传递参数
      //1.字符串形式
      /* this.$router.push(
        "/search/" + this.keyword + "?k=" + this.keyword.toUpperCase()
      ); */
      //这里单独跳转不传参的时候,使用/search   需要传参的时:使用/search/ 然后在加上需要传入的参数   注意search后面多了一个 /
      //2.模板字符串
      /* this.$router.push(
        `/search/${this.keyword}?k=${this.keyword.toUpperCase()}`
      ); */
      //3.对象写法
      /* this.$router.push({
        name: "search",
        params: { keyword: this.keyword },
        query: { k: this.keyword.toUpperCase() },
      }); */
      //错误写法 亲测:路径可以跳转，但是无法传params参数,并且应该显示的Footer组件也无法显示(好像是通过v-show无法获取到meta中的show属性值)
      /* this.$router.push({
        path: "/search", //猜测是覆盖掉了路由配置中的占位符
        params: { keyword: this.keyword },
        query: { k: this.keyword.toUpperCase() },
      }); */
      //4.指定params参数可传可不传(配置路由后面占位时加?)
      /* this.$router.push({
        name: "search",
        query: { k: this.keyword.toUpperCase() },
      }); */
      //5.params参数可以传递也可以不传递，但是如果传递是空串，如何解决？
      /* this.$router.push({
        name: "search",
        params: { keyword: "" || undefined },
        query: { k: this.keyword.toUpperCase() },
      }); */
      //6.路由组件能不能传递props数据?--可以传递
      //三种写法
      let location = {
        name: "search",
        params: { keyword: this.keyword || undefined },
      };
      location.query = this.$route.query;
      this.$router.push(location);
    },
    //退出登录
    //1.发请求，通知服务器退出登录【清除一些数据:token】
    //2.清除项目中的数据【userInfo,token】
    async logout() {
      try {
        //如果退出成功
        await this.$store.dispatch("userLogout");
        //跳转回到首页
        this.$router.push("/home");
      } catch (error) {}
    },
  },
  mounted() {
    //通过全局事件总线清除关键字
    this.$bus.$on("clear", () => {
      this.keyword = "";
    });
  },
  computed: {
    //用户信息从仓库捞取
    userName() {
      return this.$store.state.user.userInfo.name;
    },
  },
};
</script>

<style scoped lang="less">
.header {
  & > .top {
    background-color: #eaeaea;
    height: 30px;
    line-height: 30px;

    .container {
      width: 1200px;
      margin: 0 auto;
      overflow: hidden;

      .loginList {
        float: left;

        p {
          float: left;
          margin-right: 10px;

          .register {
            border-left: 1px solid #b3aeae;
            padding: 0 5px;
            margin-left: 5px;
          }
        }
      }

      .typeList {
        float: right;

        a {
          padding: 0 10px;

          & + a {
            border-left: 1px solid #b3aeae;
          }
        }
      }
    }
  }

  & > .bottom {
    width: 1200px;
    margin: 0 auto;
    overflow: hidden;

    .logoArea {
      float: left;

      .logo {
        img {
          width: 175px;
          margin: 25px 45px;
        }
      }
    }

    .searchArea {
      float: right;
      margin-top: 35px;

      .searchForm {
        overflow: hidden;

        input {
          box-sizing: border-box;
          width: 490px;
          height: 32px;
          padding: 0px 4px;
          border: 2px solid #ea4a36;
          float: left;

          &:focus {
            outline: none;
          }
        }

        button {
          height: 32px;
          width: 68px;
          background-color: #ea4a36;
          border: none;
          color: #fff;
          float: left;
          cursor: pointer;

          &:focus {
            outline: none;
          }
        }
      }
    }
  }
}
</style>