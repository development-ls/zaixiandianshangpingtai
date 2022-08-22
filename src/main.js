import Vue from 'vue'
import App from './App.vue'
//三级联动组件---全局组件
import TypeNav from "@/components/TypeNav"
import Carousel from "@/components/Carousel"
import Pagination from "@/components/Pagination"
import {Button,MessageBox} from 'element-ui'
//第一个参数:全局组件的名字  第二个参数:哪一个组件
Vue.component(TypeNav.name,TypeNav)
Vue.component(Carousel.name,Carousel)
Vue.component(Pagination.name,Pagination)
Vue.component(Button.name, Button)
//ElementUI注册组件的时候，还有一种写法,挂载在原型上
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
//引入路由
import router from "@/router"
import store from "@/store"
//引入MockServer.js----mock数据
import "@/mock/mockServe"
//引入swiper样式(原因:用到轮播图得地方样式是相同得,所以在入口文件处引入一次,都能用)
import "swiper/css/swiper.css"
//统一引入api文件夹里面的全部请求函数
import * as API from '@/api'
//测试
/* import { reqCategoryList } from '@/api'
reqCategoryList() */
//引入插件---图片懒加载
import VueLazyload from 'vue-lazyload'
import loading from '@/assets/loading.gif'
//注册插件
Vue.use(VueLazyload, {
  loading: loading,
})

//引入自定义插件
import myPlugins from '@/plugins/myPlugins'
Vue.use(myPlugins, {
  name:'upper'
})

//引入表单验证插件
import '@/plugins/validate'


new Vue({
  render: h => h(App),
  //全局事件总线$bus的配置
  beforeCreate() {
    Vue.prototype.$bus=this
    Vue.prototype.$API = API
  },
  //注册路由:下面的写法KV一致省略V 注意router小写
  //注册路由信息:当这里注册router之后，组件组件身上都拥有$route,$router属性
  router,
  //注册仓库:组件实例化的身上会多一个属性$store
  store
}).$mount('#app')

