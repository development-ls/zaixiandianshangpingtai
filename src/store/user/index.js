//登录、注册模块
import { reqGetCode, reqUserRegister, reqUserLogin, reqUserLoginInfo ,reqLogout} from '@/api'
import {setToken,getToken,removeToken} from '@/utils/token'
const state = {
    code: '',
    token: getToken(),
    userInfo:{}
}
const mutations = {
    GETCODE(state,code) {
        state.code=code
    },
    USERLOGIN(state,token) {
        state.token=token
    },
    GETUSERINFO(state,userInfo) {
        state.userInfo=userInfo
    },
    //清除用户数据
    CLEAR(state) {
        //1.清除仓库数据
        state.token = '',
        state.userInfo = {},
        //2.清除本地存储数据
        removeToken()
    }
}
const actions = {
    //获取验证码
    async getCode({ commit }, phone) {
        //获取验证码这个接口:把验证码返回,但是正常情况应该是后台把验证码发到用户手机上---收费
        let result = await reqGetCode(phone)
        //正常情况这里不需要处理---在后台实现验证码发送
        if (result.code == 200) {
            commit('GETCODE', result.data)
            return 'ok'
        } else {
            return Promise.reject(new Error('fail'))
        }
    },
    //用户注册
    async reqUserRegister({commit},user) {
        let result = await reqUserRegister(user)
        // console.log(result);//这里服务器返回233时,表示账号已经被注册,也会弹出错误信息
        console.log(result);
        if (result.code==200) {
            return 'ok'
        } else {
            return Promise.reject(new Error('fail'))
        }
    },
    //登录业务---token--令牌
    async userLogin({ commit }, data) {
        let result = await reqUserLogin(data)
        //服务器下发token,用户唯一标识
        //后面会经常通过带token找服务器要用户信息进行展示
        if (result.code == 200) {
            //用户已经登录成功并且获取到token
            commit('USERLOGIN', result.data.token)
            //持久化存储---避免刷新之后token丢失,获取不到用户信息
            setToken(result.data.token)
            return 'ok'
        } else {
            return Promise.reject(new Error('fail'))
        }
    },
    //获取用户信息
    async getUserInfo({commit}) {
        let result = await reqUserLoginInfo()
        if (result.code == 200) {
            //提交用户信息
            commit('GETUSERINFO', result.data)
            return 'ok'
        }else {
            return Promise.reject(new Error('fail'))
        }
    },
    //退出登录
    async userLogout({commit}) {
        //向服务器发起一次请求,通知服务器清除服务器token
        let result = await reqLogout()
        if (result.code==200) {
            commit('CLEAR')
            return 'ok'
        } else {
            return Promise.reject(new Error('fail'))
        }
    },
}
const getters = {}
export default {
    state,
    mutations,
    actions,
    getters
}