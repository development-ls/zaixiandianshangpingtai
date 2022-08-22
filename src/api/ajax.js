//对于axios的二次封装
import axios from "axios";
import nprogress from "nprogress";
//start:进度条开始  done:进度条结束
//引入进度条的样式
import "nprogress/nprogress.css"
import store from '@/store'

//1.利用axios对象的方法create,去创建一个axios实例
//2.这里的requests就是axios，只不过稍微配置一下
const requests = axios.create({
    //配置对象
    //基础路径,发请求的时候,路径当中会出现api(不用手动书写)
    baseURL: '/api',
    //代表请求超时的时间5s
    timeout:5000
})

//请求拦截器:在发请求之前,请求拦截器可以检测,可以在请求发出去之前做一些事情
requests.interceptors.request.use((config) => {
    //config：配置对象,对象里面有一个属性很重要,header请求头
    //进度条开始
    if (store.state.detail.uuid_token) {
        //请求头添加一个字段:这里一般和后台商量好,KV一致,方便获取
        // config.headers['userTempId']=store.state.detail.uuid_token
        config.headers.userTempId=store.state.detail.uuid_token
    }
    //需要携带token带给服务器
    if (store.state.user.token) {
        config.headers.token=store.state.user.token
    }
    nprogress.start()
    return config
})

//响应拦截器:
requests.interceptors.response.use((res) => {
    //成功的回调函数:服务器响应数据回来以后,响应拦截器可以检测到,做一些处理
    //进度条结束
    nprogress.done()
    return res.data
}, (error) => {
    //响应失败的回调函数
    console.log("响应失败"+error);
    return Promise.reject(new Error('fail'))
})

export default requests