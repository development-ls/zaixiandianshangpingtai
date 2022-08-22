import {reqCategoryList, reqGetBannerList,reqFloorList} from '@/api/index'
//home模块的小仓库
const state = {
    //state中的数据默认初始值别乱写,请求之后服务器返回的是一个对象,默认值也要是个对象形式,返回的是一个数组,默认值也要是个数组,不然在组件中使用的时候会出问题(根据接口的返回值初始化)
    categoryList: [],
    //轮播图得数据
    bannerList: [],
    //floor组件的数据
    floorList:[]
}
const mutations = {
    CATEGORYLIST(state, categoryList) {
        state.categoryList = categoryList
    },
    GETBANNERLIST(state, bannerList) {
        state.bannerList=bannerList
    },
    GETFLOORLIST(state, floorList) {
        state.floorList=floorList
    }
}
const actions = {
    //通过API里面的接口函数调用,向服务器发请求,获取服务器的数据
    async categoryList({commit}) {
        let result = await reqCategoryList()
        if (result.code == 200) {
            commit('CATEGORYLIST',result.data)
        }
    },
    //获取首页轮播图得数据
    async getBannerList({commit}) {
        let result = await reqGetBannerList()
        if (result.code == 200) {
            commit('GETBANNERLIST',result.data)
        }
    },
    //获取floor数组
    async getFloorList({commit}) {
        let result = await reqFloorList()
        if (result.code == 200) {
            //调用mutations
            commit('GETFLOORLIST',result.data)
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