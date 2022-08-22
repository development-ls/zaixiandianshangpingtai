import {reqAddressInfo,reqOrderInfo} from '@/api'
const state = {
    adress: [],
    orderInfo:{}
}
const mutations = {
    GETUSERADDRESS(state,adress) {
        state.adress = adress
        state.adress[2].isDefault = 1;
    },
    GETORDERINFO(state,orderInfo) {
        state.orderInfo=orderInfo
    }
}
const actions = {
    //获取用户地址信息
    async getUserAddress({commit}) {
        let result = await reqAddressInfo()
        // console.log(result.data);
        if (result.code==200) {
            commit('GETUSERADDRESS',result.data)
        }
    },
    //获取商品清单的数据
    async getOrderInfo({commit}) {
        let result = await reqOrderInfo()
        if (result.code == 200) {
            commit("GETORDERINFO",result.data)
        }
    }
}
const getters = {}
export default {
    state,
    mutations,
    actions,
    getters
}