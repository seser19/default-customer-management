<template>
  <div class="selectDwId">
    <el-input :value="deptNames" @focus="openSelect"></el-input>
    <el-dialog :visible.sync="selectShow">
      <div class="selectBox">
        <div class="selected" v-if="deptNames">
          <h3>修改前:</h3>
          <div class="selectedBox">
            <el-tag v-for="item in deptNames.split(',')" :key="item">{{ item }}</el-tag>
          </div>
        </div>
        <div class="selected" v-if="selected.length">
          <h3>已选择:</h3>
          <div class="selectedBox">
            <el-tag v-for="(item,i) in selected" closable :key="item.deptId" @close="selected.splice(i,1)">{{ item.deptName }}</el-tag>
          </div>
        </div>
        <div class="selectList" v-loading="loading">
          <el-transfer
            style="text-align: left; display: inline-block"
            :value="value"
            filterable
            :titles="['列表', '已选择']"
            :button-texts="['删除', '增加']"
            :props="{
              key: 'deptId',
              label: 'deptName'
            }"
            @change="handleChange"
            :data="list"
          >
            <div slot-scope="{ option }" class="listItem">
              <span >{{ option.deptName }}</span>
              <el-button v-if="!option.isLeaf" @click="checkDeptList(option.deptId, option.deptLevel);" type="text" icon="el-icon-s-unfold" size="large"></el-button>
            </div>
            <el-button v-show="history.length>1" type="text" class="footer-btn"  slot="left-footer" size="small" @click="backTo">返回上一级</el-button>
<!--            <el-button type="text" class="footer-btn"  slot="right-footer" size="small">清空</el-button>-->
          </el-transfer>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="selected = []">清 空</el-button>
        <el-button @click="selectShow = false">取 消</el-button>
        <el-button type="primary" @click="setData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { checkDeptList } from '@/api/common'

export default {
  name: 'selectDwId',
  props: {
    deptNames: {
      default: '',
      type: String
    }
  },
  data() {
    return {
      selectShow: false,
      list: [],
      loading: false,
      selected:[],
      history:[]
    }
  },
  computed:{
    value(){
      return this.selected.map(r=>r.deptId);
    }
  },
  methods: {
    openSelect() {
      this.selected = []
      this.history = []
      this.list = [{
          deptId:this.$store.state.user.deptId,
          deptName:this.$store.state.user.deptName||this.$store.state.user.deptName,
          isLeaf:false,
          deptLevel:this.$store.state.user.deptLevel,
        }]
      this.history.push(this.list);
      // this.checkDeptList(this.$store.state.user.deptId, this.$store.state.user.deptLevel);
      this.selectShow = true
    },
    handleChange(value,pos){
      if(pos==='right'){
        value.forEach(r=>{
          const s = this.list.find(s=>s.deptId===r);
          const n = this.selected.find(s=>s.deptId===r)
          if(s&&!n){
            this.selected.push(s);
          }
        })
      }else {
        this.selected = this.selected.filter(r=>value.filter(s=>s===r.deptId).length)
      }
    },
    checkDeptList(id = '', level = '') {
      this.loading = true
      checkDeptList({
        parentId: id,
        deptLevel: level
      }).then(res => {
        let saveData = res.data
        saveData.forEach(element => {
          element.isLeaf = element.deptLevel > 4
        })
        this.list = saveData
        this.history.push(this.list);
        this.loading = false
      })
    },
    backTo(){
      this.history.pop();
      this.list = this.history[this.history.length-1];
    },
    setData(){
      if(!this.selected.length)
        this.$confirm('您没有选择任何队伍，请确认！').then(()=>{
          this.$emit('selectList',this.selected);
          this.selectShow = false;
        })
      else {
        this.$emit('selectList',this.selected);
        this.selectShow = false;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-transfer-panel{
    width: 320px;
  }
  .el-transfer-panel__body{
    height: 280px;
  }
  .is-filterable{
    overflow-x: hidden;
  }
}
.selected {
  margin-bottom: 10px;
  .selectedBox {
    box-shadow: 0px 0px 2px 1px slategrey;
    border-radius: 3px;
    margin-top: 10px;
    padding: 10px;

    .el-tag {
      margin-top: 5px;
      margin-left: 10px;
    }
  }
}

.selectList {
  text-align: center;
}
.footer-btn{
  margin-left: 10px;
}
.listItem{
  display: flex;
  justify-content: space-between;
  width: 250px;
}

</style>
