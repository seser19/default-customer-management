<template>
  <el-dialog :visible.sync="show" title="请选择总队" @close="close">
    <div v-loading="loading" class="selectBox">
      <div class="list">
        <h3 style="margin-bottom: 10px;">总队列表：</h3>
        <div class="search"><el-input placeholder="搜索" size="small" v-model="filterStr" clearable/></div>
        <el-checkbox-group v-model="checkList">
          <el-checkbox class="checkbox" v-for="item in filterList" :key="item.deptId" :label="item">{{ item.deptName }}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="checked">
        <h3>已选择：</h3>
        <el-tag class="checkbox" @close="()=>delChecked(index)" v-for="(item,index) in checkList" closable :key="item.deptId">{{item.deptName}}</el-tag>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="toggle">取 消</el-button>
      <el-button type="warning" @click="close">清空</el-button>
      <el-button type="primary" @click="setAdminTeam">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {getSelelctAdmin} from '@/api/data/entry/jqxx'

export default {
  name: 'selectAdmin',
  computed:{
    filterList(){
      return this.list.filter(r=> new RegExp(this.filterStr,"g").test(r.deptName)&&r.deptId!=this.areaId)
    },
    areaId(){
      return (this.$store.state.user.deptId+'').substr(0,2)+'00000000'
    }
  },
  data(){
    return{
      show:false,
      loading:false,
      list:[],
      checkList:[],
      filterStr:''
    }
  },
  created() {
    this.getAdminList();
  },
  methods:{
    getAdminList(){
      this.loading = true;
      getSelelctAdmin().then(r=>{
        if(r.code===200){
          this.list = r.data;
          this.loading = false;
        }else {
          this.$message.error('数据加载失败！');
        }
      })
    },
    toggle(){
      this.show = !this.show;
    },
    close(){
      this.checkList = [];
    },
    setCheckedList(list){
      if(!this.list.length) return;
      this.checkList = list.reduce((t,r)=>{
        return t.concat(this.list.filter(s=>s.deptId===r.deptId))
      },[])
      this.toggle();
    },
    setAdminTeam(){
      this.$emit('setAdminTeam',this.checkList.slice());
      this.toggle();
    },
    delChecked(index){
      this.checkList.splice(index,1);
    }
  }
}
</script>

<style lang="scss" scoped>
.selectBox{
  min-height: 250px;
  padding: 0 10px;
  overflow: auto;
  display: flex;
  justify-content: space-between;
  .list{
    max-height: 250px;
    overflow: auto;
    width: 45%;
    position: relative;
  }
  .checked{
    max-height: 250px;
    overflow: auto;
    width: 45%;
  }
}
.checkbox{
  display: block;
  margin: 5px;
}
.search{
  width: 200px;
  padding: 10px;
  position: absolute;
  top: -10px;
  right: 5px;
}
</style>
