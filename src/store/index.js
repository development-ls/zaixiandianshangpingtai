//vuex是Vue里面的插件，必须先引入Vue在引入vuex才能使用
import Vue from 'vue'
import Vuex from 'vuex'
//需要使用插件一次
Vue.use(Vuex)

//引入小仓库
import home from './home'
import search from './search'
import detail from './detail'
import shopcart from './shopcart'
import user from './user'
import trade from './trade/'


/* //state:仓库存储数据的地方
const state = {
    count:1
}
//mutations:修改state的唯一手段
const mutations = {
    ADD(state, count) {
        state.count++
    }
}
//action:处理action,可以书写自己的业务逻辑,也可以处理异步
const actions = {
    //这里可以书写业务逻辑,但是不能修改state
    //action函数接收一个与store实例具有相同属性和方法的context对象,所以可以通过context.state来获取store中的状态,通过context.commit来提交更改(调用mutations)
    add({ commit }) {
        commit('ADD')
    }
}
//getters:理解为计算属性,用于简化仓库的数据，让组件获取仓库的数据更加方便
const getters={} */



//对外暴漏Store类的一个实例
export default new Vuex.Store({
    /* state,
    mutations,
    actions,
    getters */
    //实现Vuex仓库模块式开发存储数据
    modules: {
        home,
        search,
        detail,
        shopcart,
        user,
        trade
    }
})