import { v4 as uuidv4 } from 'uuid';
//要实现生成一个随机字符串，并且每次执行不能发生变化,还要持续存储(LocalStorage)
export const getUUID = () => {
    //先从本地存储获取uuid(看一下本地存储里面是否已经存在)
    let uuid_token = localStorage.getItem('UUIDTOKEN')
    //如果没有就生成游客临时身份
    if (!uuid_token) {
        //调用函数生成游客临时身份
        uuid_token = uuidv4()
        //本地存储一次
        localStorage.setItem('UUIDTOKEN',uuid_token)
    }
    return uuid_token
}