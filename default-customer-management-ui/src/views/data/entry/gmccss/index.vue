<template>
  <div class="app-container">
    <div class="reporting-title">
      <h2>{{$route.meta.title}}（{{!check?'已检查':'待检查'}}列表）</h2>
      <el-button type="primary" @click="changeCheck">切换{{check?'已检查':'待检查'}}列表</el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%">
      <el-table-column
        width="160"
        label="事件编号"
        prop="eventId">
      </el-table-column>
      <el-table-column
        width="80"
        label="姓名"
        prop="name">
      </el-table-column>
      <el-table-column
        width="160"
        label="申报时间"
        prop="tbsj">
      </el-table-column>
      <el-table-column
        width="160"
        label="身份证号码"
        prop="idCard">
      </el-table-column>
      <el-table-column
        label="地址"
        prop="address">
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.shzt==='1'">待检查</el-tag>
          <el-tag type="success" v-if="scope.row.shzt==='2'">通过</el-tag>
          <el-tag type="danger" v-if="scope.row.shzt==='-1'">作废</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80">
        <template slot-scope="scope">
          <el-button type="text" @click="()=>onSh(scope.row.eventId)" v-if="scope.row.shzt==='1'">检查</el-button>
          <el-button type="text" @click="()=>onSh(scope.row.eventId)" v-else>查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <gmccss-sh :id.sync="eventId"/>
  </div>
</template>

<script>
import {checkList,passList} from '@/api/data/entry/gmccss'
import GmccssSh from '@/views/data/entry/gmccss/components/gmccssSh'

export default {
  name: 'gmccss',
  components: { GmccssSh },
  created() {
    this.getData();
  },
  watch:{
    eventId(e){
      if(!e) this.getData();
    }
  },
  data(){
    return{
      tableData:[],
      eventId:undefined,
      check:true,
      loading:false
    }
  },
  methods:{
    getData(){
      this.loading = true;
      if(this.check){
        checkList().then(r=>{
          this.tableData = r.data
          this.loading = false;
        })
      }else {
        passList().then(r=>{
          this.tableData = r.data
          this.loading = false;
        })
      }

    },
    onSh(id){
      this.eventId = id;
    },
    changeCheck(){
      this.check = !this.check;
      this.getData();
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
