<template>
  <div class="test">
      <div class="top">
        <div class="login">
          <el-input type="password" v-model="password"/>
        </div>
        <el-input :rows="7" type="textarea" v-model="testCode"/>
        <el-button class="btn" @click="send" v-loading="isloading">发送</el-button>
      </div>
      <div class="botton" v-loading="isloading">
        <json :value="res"></json>
      </div>
    </div>
</template>

<script>
import request from "@/utils/request";
import json from 'vue-json-viewer'
export default {
  name: "test",
  components:{json},
  data(){
    return {
      testCode:'',
      res:'',
      is:false,
      password:'',
      isloading:false
    }
  },
  methods:{
    send(){
      this.isloading = true
      request({
        url: '/simple/registration/custom',
        method: "post",
        data: {sql:this.testCode,pwd:this.password},
      }).then(r=>{
        this.res = r
        this.isloading = false
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.test{
  width: 100vw;
  height: 100vh;
  .top{
    padding: 20px;
    text-align: center;
    .btn{
      width: 300px;
      margin: 20px;
    }
  }
  .botton{
    margin: 20px;
    min-height: 300px;
    border: 1px solid #1c84c6;
    box-shadow: 0px 0px 5px #1c84c6;
  }
    .login{
      width: 500px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 20px;
  }
}
</style>
