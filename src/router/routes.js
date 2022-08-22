/* 
当打包构建应用时，JavaScript 包会变得非常大，影响页面加载。如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样就会更加高效。
*/
/* //引入路由组件
import Home from "@/views/Home"
import Search from "@/views/Search"
import Login from "@/views/Login"
import Register from "@/views/Register"
import Detail from "@/views/Detail"
import AddCartSuccess from '@/views/AddCartSuccess'
import ShopCart from '@/views/ShopCart'
import Trade from '@/views/Trade'
import Pay from '@/views/Pay'
import PaySuccess from '@/views/PaySuccess'
import Center from '@/views/Center'
//引入二级路由
import MyOrder from '@/views/Center/myOrder'
import GroupOrder from '@/views/Center/groupOrder' */
// 路由配置信息
export default [
        {
            path: '/center',
            component: ()=>import('@/views/Center'),
            meta:{show:true},
            name: 'center',
            children: [
                {
                    path: 'myorder',
                    component:()=>import('@/views/Center/myOrder')
                },
                {
                    path: 'grouporder',
                    component:()=>import('@/views/Center/groupOrder') 
                },
                // 二级路由的重定向
                {
                    path: "/center",
                    redirect:'/center/myorder'
                }
            ]
        },
        {
            path: '/paysuccess',
            component: ()=>import('@/views/PaySuccess'),
            meta:{show:true},
            name:'paysuccess'
        },
        {
            path: '/pay',
            component: ()=>import('@/views/Pay'),
            meta:{show:true},
            name: 'pay',
            beforeEnter: (to, from, next) => {
                if (from.path == '/trade') {
                    next()
                } else {
                    next(false)
                }
            }
        },
        {
            path: '/trade',
            component: ()=>import('@/views/Trade'),
            meta:{show:true},
            name: 'trade',
            //路由独享守卫
            beforeEnter: (to, from, next) => {
                //去交易页面,必须是从购物车跳转
                if (from.path == '/shopcart') {
                    next()
                } else {
                    //从其他路由跳转过来,停留在当前路由
                    next(false)
                }
            }
        },
        {
            path: '/shopcart',
            component: ()=>import('@/views/ShopCart'),
            meta:{show:true},
            name:'shopcart'
        },
        {
            path: '/addcartsuccess',
            component: ()=>import('@/views/AddCartSuccess'),
            meta:{show:true},
            name:'addcartsuccess'
        },
        {
            //点击商品图片需要携带params参数,要进行占位
            path: '/detail/:skuid',
            component: ()=>import('@/views/Detail'),
            meta:{show:true}
        },
        {
            path: '/home',
            component: ()=>import('@/views/Home'),
            meta:{show:true}
        },
        {
            path: "/search/:keyword?",
            component: ()=>import('@/views/Search'),
            meta: { show: true },
            name: "search",
            //路由传递props数据三种写法
            //布尔值写法(可以把params参数作为路由组件身上的属性)
            // props:true
            //对象写法:额外的给路由组件传递一些props
            // props:{a:1,b:2}
            //函数写法:可以把params参数、query参数，通过props传递给路由组件
            /* props: ($route) => {
                return {keyword:$route.params.keyword,k:$route.query.k}
            } */
            props: ($route) =>({keyword:$route.params.keyword})
        },
        {
            path: "/login",
            component: ()=>import('@/views/Login'),
            // meta:{show:false}//此处不写默认的就是false
        },
        {
            path: "/register",
            component: ()=>import('@/views/Register'),
            // meta:{show:false}
        },
        //重定向,当项目跑起来的时候，访问 / ,立马让他定向到首页
        {
            path: '/',//这里使用 / 或者 * 都可以
            redirect:'/home'
        }
    ]