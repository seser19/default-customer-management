<template>
  <div class="inspect-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="警情录入数据稽查" name="warning">
        <warning-search></warning-search>
      </el-tab-pane>
      <el-tab-pane label="出动报告数据稽查" name="dispatch">
        <dispatch-search></dispatch-search>
      </el-tab-pane>
      <el-tab-pane label="火灾报告数据稽查" name="fire">
        <fire-search></fire-search>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import warningSearch from './components/warning.vue'
  import dispatchSearch from './components/dispatchSearch.vue'
  import fireSearch from './components/fireSearch.vue'
  export default {
    name:'inspectSearch',
    components:{
      warningSearch,
      dispatchSearch,
      fireSearch
    },
    data(){
      return{
        activeName:'warning'
      };
    },
    methods:{
      handleClick(){

      }
    }
  }
</script>

<style lang="scss" scoped>
  .inspect-container{
    margin: 15px 22px;
    padding: 20px;
    background-color: #fff;
  }
</style>
