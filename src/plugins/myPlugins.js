//Vue插件向外暴漏一个对象
let myPlugins = {}
 
myPlugins.install = function (Vue,options) {
    // console.log(Vue,options);
    //Vue.prototype.$bus:任何组件都可以使用
    //Vue.directive---自定义指令(全局指令)
    //Vue.component---全局组件
    //Vue.filter---全局的过滤器
    Vue.directive(options.name, (element, params) => {
        //element---绑定自定义指令的DOM元素
        element.innerHTML = params.value.toUppercase()
    })
}

export default myPlugins