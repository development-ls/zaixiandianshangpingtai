//配置路由
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from "./routes"
//使用插件
Vue.use(VueRouter)

//引入store
import store from '@/store'

//先把VueRouter原型对象的push方法保存一份
let originPush = VueRouter.prototype.push
let originReplace = VueRouter.prototype.replace

//重写push
//第一个参数:告诉原来的push方法，往那里跳转(传递哪些参数)
//第二个参数:成功的回调
//第三个参数:失败的回调
VueRouter.prototype.push = function (location,resolve,reject) {
    if (resolve && reject) {
        //call和apply区别；相同点，都可以篡改函数的上下文一次(改变this的指向)
        //不同点:call与apply传递参数的方面,call传递参数用逗号隔开,apply方法执行,传递数组
        originPush.call(this,location,resolve.reject)
    } else {
        originPush.call(this,location,()=>{},()=>{})
    }
}

//重写replace
VueRouter.prototype.replace = function (location,resolve,reject) {
    if (resolve && reject) {
        //call和apply区别；相同点，都可以篡改函数的上下文一次(改变this的指向)
        //不同点:call与apply传递参数的方面,call传递参数用逗号隔开,apply方法执行,传递数组
        originReplace.call(this,location,resolve.reject)
    } else {
        originReplace.call(this,location,()=>{},()=>{})
    }
}

let router= new VueRouter({
    //配置路由
    routes,
    //配置路由切换的滚动行为
    scrollBehavior (to, from, savedPosition) {
    // return 期望滚动到哪个的位置
    // 始终滚动到顶部 vue2用y  vue3用top
    return { y: 0 }
  }
})

//全局守卫:前置守卫(在路由跳转之前进行判断)
router.beforeEach(async(to,from,next) => {
    //to:可以获取到你要跳转到哪个路由信息
    //from:可以获取到你从哪个路由而来的信息
    //next:放行函数 next()---全部放行  next(path)---放行到指定路由  next(false)---重置到from路由对应的地址
    // next()
    //用户登录了，才会有token----用户没有登录获取不到token
    let token = store.state.user.token
    //用户信息
    let name=store.state.user.userInfo.name
    //用户已经登录
    if (token) {
        //禁止用户跳转login页面---停留在首页
        if (to.path=='/login') {
            next('/home')
        } else {
            //登录之后跳转的不是login---其他路由
            if (name) {
                //用户名已经有了
                next()
            } else {
                //没有用户信息---派发action让仓库存储用户信息,在跳转
                try {
                    //获取用户信息成功然后展示
                    await store.dispatch("getUserInfo");
                    next()
               } catch (error) {
                    //后端提供的token失效了,获取不到用户信息---重新登录
                    //清除token
                   await store.dispatch('userLogout')
                   next('/login')
               }
            }
        }
    } else {
        //未登录---不能跳转交易相关、支付相关、个人中心
        //实现没有登录去上面这些页面,要跳转到登录页面---其他页面放行()
        let toPath = to.path
        if (toPath.indexOf('/trade') != -1 || toPath.indexOf('/pay') != -1 || toPath.indexOf('/center') != -1) {
            //把未登录的时候想要跳转的路由的信息,存储于地址栏中
            next('/login?redirect='+toPath)
        } else {
            next()
        }
    }
})

export default router