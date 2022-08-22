import {reqGoodsInfo, reqAddOrUpdateShopCart} from "@/api"
import { Promise } from "core-js"
//封装游客临时身份模块uuid--->生辰一个随机的字符串,不能在变
import {getUUID} from '@/utils/uuid_token'
const state = {
    goodInfo: {},
    //游客的临时身份
    uuid_token:getUUID()
}
const mutations = {
    GETGOODINFO(state,goodInfo) {
        state.goodInfo=goodInfo
    }
}
const actions = {
    //获取产品信息的action
    async getGoodsInfo({commit},skuId) {
        let result= await reqGoodsInfo(skuId)
        if (result.code==200) {
            commit('GETGOODINFO',result.data)
        }
    },
    //将产品添加到购物车中
    //这里有个注意点:actions里面函数携带参数,第一个commit,后面如果要携带多个参数,要以对象的形式传入,然后解构
    async addOrUpdateShopCart({ commit }, { skuId, skuNum }) {
        //点击加入购物车之后(发请求),前台将参数带给服务器
        //服务器写入数据成功,并不会返回其他的数据,只是返回code=200,代表这次操作成功
        //因为服务器没有返回数据,只做存储作用,因此不需要后续commit进行处理数据处理了
        let result = await reqAddOrUpdateShopCart(skuId, skuNum)
        //async 后面这个函数执行后，返回的是一个promise对象
        if (result.code == 200) {
            return 'ok'
        } else {
            return Promise.reject(new Error('fail'))
        }
    }
}
const getters = {
    //路径导航简化数据
    categoryView(state) {
        //返回数据这里,state.goodInfo初始状态是个空对象,空对象的categoryView属性值是undefined,后面组件用的时候,获取undefined里面的属性值就会报错,后面要加个空对象
        return state.goodInfo.categoryView||{}
    },
    //简化产品信息数据
    skuInfo(state) {
        return state.goodInfo.skuInfo||{}
    },
    //产品售卖属性简化数据
    spuSaleAttrList(state) {
        return state.goodInfo.spuSaleAttrList||[]
    }
}
export default {
    state,
    mutations,
    actions,
    getters
}