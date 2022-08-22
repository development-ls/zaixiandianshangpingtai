<template>
  <div>
    <!-- 三级联动全局组件:三级联动已经注册为全局组件,因此不需要引入 -->
    <TypeNav></TypeNav>
    <ListContainer></ListContainer>
    <Recommend></Recommend>
    <Rank></Rank>
    <Like></Like>
    <Floor v-for="floor in floorList" :key="floor.id" :list="floor"></Floor>
    <Brand></Brand>
    <!--  <button @click="add">点击加1</button>
    <span>仓库数据{{ count }}</span>
    <button>点击减1</button> -->
  </div>
</template>

<script>
//引入其余的组件
import ListContainer from "@/views/Home/ListContainer";
import Recommend from "@/views/Home/Recommend";
import Rank from "@/views/Home/Rank";
import Like from "@/views/Home/Like";
import Floor from "@/views/Home/Floor";
import Brand from "@/views/Home/Brand";
import { mapState } from "vuex";
export default {
  name: "",
  components: {
    ListContainer,
    Recommend,
    Rank,
    Like,
    Floor,
    Brand,
  },
  /*   computed: {
    ...mapState(["count"]),
  },
  methods: {
    add() {
      //派发action
      this.$store.dispatch("add");
    },
  }, */
  mounted() {
    //不在floor组件中派发action的原因:通过mock返回的数组里面包含两个不同的对象，直接遍历的话会得到两个相同的floor组件内容,无法在内容不同的情况下,实现复用
    //派发action,获取floor组件的数据
    this.$store.dispatch("getFloorList");
  },
  computed: {
    ...mapState({
      floorList: (state) => state.home.floorList,
    }),
  },
};
</script>

<style>
</style>