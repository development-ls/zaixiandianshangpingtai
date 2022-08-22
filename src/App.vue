<template>
  <div>
    <Header></Header>
    <!-- 路由组件出口 -->
    <router-view></router-view>
    <!-- Footer组件在Home、Search显示 在登录、注册 隐藏-->
    <Footer v-show="$route.meta.show"></Footer>
  </div>
</template>

<script>
//引入
import Header from "./components/Header";
import Footer from "./components/Footer";
export default {
  name: "",
  components: {
    Header,
    Footer,
  },
  mounted() {
    //通知Vuex发送请求,获取数据,存储到仓库当中
    //获取商品分类的三级列表.放在根组件这里派发actions只会执行一次,向服务器发请求只有一次,避免了频繁的发请求
    this.$store.dispatch("categoryList");
  },
};
</script>

<style>
</style>