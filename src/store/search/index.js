import {reqGetSearchInfo} from "@/api"
//search模块的小仓库
const state = {
    searchList:{}
}
const mutations = {
    GETSEARCHLIST(state, searchList) {
        state.searchList=searchList
    }
}
const actions = {
    //获取search模块数据
    async getSearchList({ commit },params={}) {
        //当前这个reqGetSearchInfo调用获取服务器数据的时候,至少要传一个空对象
        //params形参，是当用户派发action的时候,第二个参数传递过来params={}表示默认参数是一个空对象
        let result = await reqGetSearchInfo(params)
        if (result.code == 200) {
            commit('GETSEARCHLIST',result.data)
        }
    }
}
//计算属性,在项目当中,为了简化仓库数据而生
const getters = {
    //这里的形参state,是当前仓库中的state,并非大仓库中的state
    goodsList(state) {
        //state.searchList.goodsList 服务器数据正常返回，结果就是一个数组
        //假如网络不给力,或者服务器返回数据为空对象,那么state.searchList.goodsList的结果就是undefined,然后用v-for遍历就会报错
        return state.searchList.goodsList || []
    },
    trademarkList(state) {
        return state.searchList.trademarkList
    },
    attrsList(state) {
        return state.searchList.attrsList
    }
}
export default {
    state,
    mutations,
    actions,
    getters
}