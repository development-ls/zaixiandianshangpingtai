import {reqCartList,reqDeleteCartById,reqUpdateCheckedById} from "@/api"
const state = {
    carList:[]
}
const mutations = {
    GETCARTLIST(state,carList) {
        state.carList = carList
    }
}
const actions = {
    //获取购物车列表的数据
    async getCartList({commit}) {
        let result = await reqCartList()
        if (result.code==200) {
            commit('GETCARTLIST',result.data)
        }
    },
    //删除购物车中某个产品
    async deleteCartListBySkuId({commit},skuId) {
        let result = await reqDeleteCartById(skuId)
        if (result.code) {
            return 'ok'
        } else {
            return Promise.reject(new Error('fail'))
        }
    },
    //切换购物车商品选中状态
    async updateCheckedById({commit},{skuId,isChecked}) {
        let result = await reqUpdateCheckedById(skuId, isChecked)
        if (result.code == 200) {
            return 'ok'
        } else {
            return Promise.reject(new Error('fail'))
        }
    },
    //删除全部勾选的产品
    deleteAllCheckedCart({dispatch,getters}) {
        // console.log(context);//这里的context上下文,里面有很多属性---小仓库:commit【提交mutations修改state中的数据】  getters【简化数据时的计算属性】  dispatch【派发action】  state【当前仓库的数据】
        //这里直接将context解构了,方便下面使用
        //通过getters获取购物车当中的全部商品(数组)
        let PromiseAll=[]
        getters.cartInfoList.forEach(item => {
            let promise = item.isChecked == 1 ? dispatch('deleteCartListBySkuId', item.skuId) : ''
            //Promise.all([])函数,以数组形式传入,每一个数组元素都是promise对象,只要有一个失败，返回结果为失败,全部结果为成功,返回成功
            //将每一次返回的promise添加到数组当中
            PromiseAll.push(promise)
        });
        //Promise.all---处理返回结果多个promise对象的方法
        return Promise.all(PromiseAll)
    },
    //修改全部产品的状态
    updateAllCartIsChecked({ dispatch, getters }, isChecked) {
        let PromiseAll=[]
        getters.cartInfoList.forEach(item => {
            let promise = dispatch('updateCheckedById', { skuId: item.skuId, isChecked })
            PromiseAll.push(promise)
        })
        return Promise.all(PromiseAll)
    }
}
const getters = {
    /* cartList() {
        return  state.carList[0]||{}
    }, */
    //计算出来购物车的数据
    cartInfoList() {
        if (state.carList[0]) {
            return state.carList[0].cartInfoList||[]
        } else {
            return []
        }
    }
}
export default {
    state,
    mutations,
    actions,
    getters
}