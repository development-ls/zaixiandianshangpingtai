//对外暴漏函数
//存储token
export const setToken = (token) => {
    localStorage.setItem('TOKEN',token)
}
//获取token
export const getToken = () => {
    //这里不要忘记return,不然拿不到存储的token
    return localStorage.getItem('TOKEN')
}
//清除本地存储的token
export const removeToken=() => {
    localStorage.removeItem('TOKEN')
}