<template>
  <!-- 商品分类导航 -->
  <div class="type-nav">
    <div class="container">
      <!-- 事件的委派(事件的代理) 利用了事件冒泡的机制-->
      <div @mouseleave="leaveShow" @mouseenter="enterShow">
        <h2 class="all">全部商品分类</h2>
        <!-- 过渡动画 -->
        <transition name="sort">
          <!-- 三级联动 -->
          <div class="sort" v-show="show">
            <!-- 编程式导航 + 事件委派 -->
            <div class="all-sort-list2" @click="goSearch">
              <div
                class="item"
                v-for="(c1, index) in categoryList"
                :key="c1.categoryId"
                :class="{ cur: currentIndex == index }"
              >
                <h3 @mouseenter="changIndex(index)">
                  <a
                    :data-categoryName="c1.categoryName"
                    :data-category1Id="c1.categoryId"
                    >{{ c1.categoryName }}
                  </a>
                  <!-- <router-link to="/search">{{ c1.categoryName }}</router-link> -->
                </h3>
                <!-- 二级、三级分类的地方 -->
                <div
                  class="item-list clearfix"
                  :style="{ display: currentIndex == index ? 'block' : 'none' }"
                >
                  <div
                    class="subitem"
                    v-for="c2 in c1.categoryChild"
                    :key="c2.categoryId"
                  >
                    <dl class="fore">
                      <dt>
                        <a
                          :data-categoryName="c2.categoryName"
                          :data-category2Id="c2.categoryId"
                          >{{ c2.categoryName }}</a
                        >
                        <!-- <router-link to="/search">{{c2.categoryName}}</router-link> -->
                      </dt>
                      <dd>
                        <em v-for="c3 in c2.categoryChild" :key="c3.categoryId">
                          <a
                            :data-categoryName="c3.categoryName"
                            :data-category3Id="c3.categoryId"
                            >{{ c3.categoryName }}</a
                          >
                          <!-- <router-link to="/search">{{c3.categoryName}}</router-link> -->
                        </em>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <nav class="nav">
        <a href="###">服装城</a>
        <a href="###">美妆馆</a>
        <a href="###">尚品汇超市</a>
        <a href="###">全球购</a>
        <a href="###">闪购</a>
        <a href="###">团购</a>
        <a href="###">有趣</a>
        <a href="###">秒杀</a>
      </nav>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
//这种引入方式把所有的lodash所有的函数功能引入
// import _ from "lodash";
//按需引入,注意这里封装函数向外暴漏采用的是默认暴漏的形式,所以throttle不能加{},否则会报错
import throttle from "lodash/throttle";
export default {
  name: "TypeNav",
  data() {
    return {
      //存储用户鼠标移上哪一个一级分类
      currentIndex: -1,
      show: true,
    };
  },
  //组件挂载完毕，可以向服务器发请求
  mounted() {
    //当组件挂载完毕,让组件show属性变为false
    //如果不是Home路由组件，将typeNav隐藏
    if (this.$route.path != "/home") {
      this.show = false;
    }
  },
  computed: {
    ...mapState({
      //右侧需要一个函数,当使用categoryList计算属性的时候,右侧函数会立即执行一次
      //注入一个参数state,即为大仓库中的数据(包含home和search)
      categoryList: (state) => {
        return state.home.categoryList;
      },
    }),
  },
  methods: {
    //鼠标进入修改响应式数据currentIndex属性
    //throttle回调函数别用箭头函数,可能出现上下文this问题
    changIndex: throttle(function (index) {
      //鼠标所在的一级分类元素的索引值
      //正常情况(用户慢慢操作)：鼠标进入，每一个一级分类h3，都会触发鼠标进入事件
      //非正常情况:(用户操作很快):本身全部的一级分类都应该触发鼠标进入事件，经过测试发现，只有部分h3触发了
      //原因；浏览器反应不过来。如果当前回调函数中有大量的业务,有可能出现卡顿现象
      this.currentIndex = index;
    }, 50),
    /* leaveIndex() {
      //鼠标移除currentIndex 变为-1
      this.currentIndex = -1;
    }, */
    //进行路由跳转的方法
    goSearch(event) {
      //进行路由跳转的最好的解决方案：编程式导航 + 事件委派
      //利用事件的委派也存在一些问题(1)如何知道点击的是哪个a标签跳转的?(2)如何获取参数【1,2,3级分类的产品名字、ID】

      //解决方案:(1)把子节点当中a标签,加上自定义属性data-categoryName,其余的子节点是没有的
      let node = event.target;
      //获取到当前触发事件的节点【h3,a,dt,dl】,需要带有data-categoryname这样的节点,一定是a标签
      // console.log(element.nodeName)//使用element.nodeName只能判断点击的是不是a标签,无法判断点击的是几级分类的a标签
      //节点有一个属性dataset属性,可以获取到节点的自定义属性与属性值
      let { categoryname, category1id, category2id, category3id } =
        node.dataset;
      //如果标签身上拥有categoryname一定是a标签
      if (categoryname) {
        //整理路由跳转的参数
        let location = { name: "search" };
        let query = { categoryName: categoryname };
        //区分一级分类、二级分类、三级分类的a标签
        if (category1id) {
          query.category1Id = category1id;
        } else if (category2id) {
          query.category2Id = category2id;
        } else {
          query.category3Id = category3id;
        }
        //判断:如果路由跳转的时候带有params参数,要加上params参数传递
        location.params = this.$route.params;
        //动态给location配置对象添加query属性
        location.query = query;
        //路由的跳转
        this.$router.push(location);
      }
    },
    //当鼠标移入的时候，让商品分类列表进行展示
    enterShow() {
      //鼠标进入这个if判断可加可不加
      if (this.$route.path != "/home") {
        this.show = true;
      }
    },
    //当鼠标离开的时候，让商品分类列表进行隐藏
    leaveShow() {
      this.currentIndex = -1;
      //判断如果是Home组件无法执行这个事件
      if (this.$route.path != "/home") {
        this.show = false;
      }
    },
  },
};
</script>

<style scoped lang="less">
.type-nav {
  border-bottom: 2px solid #e1251b;

  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    position: relative;

    .all {
      width: 210px;
      height: 45px;
      background-color: #e1251b;
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    .nav {
      a {
        height: 45px;
        margin: 0 22px;
        line-height: 45px;
        font-size: 16px;
        color: #333;
      }
    }

    .sort {
      position: absolute;
      left: 0;
      top: 45px;
      width: 210px;
      height: 461px;
      position: absolute;
      background: #fafafa;
      z-index: 999;
      //滚动条隐藏
      ::-webkit-scrollbar {
        display: none;
      }
      .all-sort-list2 {
        //返回的数据比原本数据多，设置多余部分数据形成滚动条
        height: 455px;
        overflow: auto;
        .item {
          h3 {
            line-height: 30.6px;
            font-size: 14px;
            font-weight: 400;
            overflow: hidden;
            padding: 0 20px;
            margin: 0;
            a {
              color: #333;
            }
          }

          .item-list {
            display: none;
            position: absolute;
            width: 734px;
            min-height: 460px;
            background: #f7f7f7;
            left: 210px;
            border: 1px solid #ddd;
            top: 0;
            z-index: 9999 !important;

            .subitem {
              float: left;
              width: 650px;
              padding: 0 4px 0 8px;

              dl {
                border-top: 1px solid #eee;
                padding: 6px 0;
                overflow: hidden;
                zoom: 1;

                &.fore {
                  border-top: 0;
                }

                dt {
                  float: left;
                  width: 54px;
                  line-height: 22px;
                  text-align: right;
                  padding: 3px 6px 0 0;
                  font-weight: 700;
                }

                dd {
                  float: left;
                  width: 415px;
                  padding: 3px 0 0;
                  overflow: hidden;

                  em {
                    float: left;
                    height: 14px;
                    line-height: 14px;
                    padding: 0 8px;
                    margin-top: 5px;
                    border-left: 1px solid #ccc;
                  }
                }
              }
            }
          }
          //&含义:设置上一层css样式
          /* &:hover {
            .item-list {
              display: block;
            }
          } */
        }
        /* .item:hover {
          background-color: skyblue;
        } */
        .cur {
          background-color: skyblue;
        }
      }
    }
    //过渡动画的样式
    //过渡动画开始状态(进入)
    .sort-enter {
      height: 0px;
    }
    //过渡动画的结束状态(进入结束)
    .sort-enter-to {
      height: 461px;
    }
    //定义动画时间、速率
    .sort-enter-active {
      transition: all 0.5s linear;
    }
  }
}
</style>