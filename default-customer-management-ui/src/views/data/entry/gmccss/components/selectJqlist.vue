<template>
  <div>
    <el-dialog :visible="show"  title="请选择警情" :before-close="channel">
      <div class="seach" :class="{autoHeight:!searHide}">
        <el-row>
          <el-col :span="18">
            <date-time-range ref="dateTimeRange" :format="`date`" @selectTime="dateChange"></date-time-range>
          </el-col>
          <el-col :span="6">
            <el-button type="text" @click="searHide=!searHide">{{searHide?'展开':'收起'}}</el-button>
            <el-button type="primary" @click="getData">查找</el-button>
            <el-button @click="rest">重置</el-button>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px;" :gutter="24">
          <el-col :span="8">
            <el-input v-model="form.jqbh" placeholder="警情编号" clearable></el-input>
          </el-col>
          <el-col :span="8">
            <el-cascader
                ref="cascader"
                v-model="form.sjlbdm"
                :props="props"
                placeholder="警情类型"
                clearable
            />
          </el-col>
          <el-col :span="8">
            <el-input
              v-model="form.jqfsdd"
              placeholder="警情地址"
              clearable
            />
          </el-col>
        </el-row>

      </div>
      <p>已选择：{{seletItem}}</p>
      <el-table
        ref="table"
        :data="data"
        highlight-current-row
        @current-change="handleCurrentChange"
        v-loading="loading"
        style="width: 100%">
        <el-table-column
          width="130"
          property="jqbh"
          label="警情编号"
          fixed
        >
        </el-table-column>
        <el-table-column
          property="jjsj"
          label="接警时间"
          width="130"
        />
        <el-table-column
          property="xzqydm"
          label="行政区域"
          width="150"
        />
        <el-table-column property="jqfsdd" label="警情地址"/>
        <el-table-column property="sjlbmc" label="警情类型"/>
        <el-table-column property="tbsj" label="发送时间" width="140"/>
        <el-table-column property="tbDeptName" label="派发单位" width="100"/>
      </el-table>
      <div style="text-align: right">
        <el-pagination
          layout="prev, pager, next"
          :current-page.sync="form.pageNum"
          :total="total"
          :page-size="10"
          @current-change="getData"
        >
        </el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="channel">取 消</el-button>
        <el-button type="primary" @click="sub">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import { getJqcdlb, jqxxUpList } from '@/api/data/entry/jqxx'
import DateTimeRange from '@/views/components/dateTime/dateTimeRange'
import { getNearlyRecentDays } from '@/utils/dateTimeUtils'
export default {
  name: 'selectJqlist',
  components: { DateTimeRange },
  created() {
    this.form.params.beginTime = getNearlyRecentDays(30)[0].substr(0,10);
    this.form.params.endTime = getNearlyRecentDays(30)[1].substr(0,10);
    this.getData();
  },
  computed:{
    seletItem(){
      if(this.jqItem){
        return `${this.jqItem.jqbh} ${this.jqItem.jjsj} ${this.jqItem.xzqydm} ${this.jqItem.jqfsdd}`
      }else {
        return ''
      }
    }
  },
  data(){
    return {
      show:false,
      loading:false,
      data:[],
      searHide:true,
      // 总条数
      total: 0,
      form: {
        sjlbdm:'',
        jqbh:'',
        // 主战队伍
        zzxfdw: "",
        // 行政区域编号
        xzqydmSj: "",
        // 行政区域名称
        xzqyName: "",
        pageNum: 1,
        pageSize: 10,
        params: {
          beginTime: "",
          endTime: "",
        },
      },
      props: {
        lazy: true,
        checkStrictly: true,
        lazyLoad: this.lazyLoad,
        children: "children",
        label: "dictLabel",
        value: "dictValue",
        isLeaf: "isLeaf",
        // 是否返回由该节点所在的各级菜单的值所组成的数组
        emitPath: false
      },
    }
  },
  props:{
    jqItem:{
      default:undefined
    }
  },
  methods:{
    lazyLoad(node, resolve) {
      if (node.level === 0) {
        getJqcdlb({
          dictType: "jqcjlb",
          parentValue: "0"
        })
          .then(res => {
            if (res.code !== 200) {
              return;
            }
            resolve(this.handle(res.data));
          })
          .catch(res => {
            resolve([]);
          });
      } else {
        getJqcdlb({
          dictType: "jqcjlb",
          parentValue: node.value
        })
          .then(res => {
            if (res.code !== 200) {
              return;
            }
            resolve(this.handle(res.data));
          })
          .catch(res => {
            resolve([]);
          });
      }
      // 通过调用resolve将子节点数据返回，通知组件数据加载完成
    },
    handle(arr) {
      // console.log(arr);
      arr.forEach(item => {
        if (item.isLast == "1") {
          item["leaf"] = true;
        }
      });
      return arr;
    },
    getData(){
      this.loading = true;
      jqxxUpList(this.form).then(r=>{
        this.data = r.rows;
        this.total = r.total;
        this.loading = false;
        console.log(r)
      })
    },
    dateChange(data) {
      this.form.params.beginTime = data.ksrq;
      this.form.params.endTime = data.jsrq;
    },
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    handleCurrentChange(val) {
      this.$emit('update:jqItem',val)
    },
    sub() {
      if(this.jqItem){
        this.$emit('sub');
        this.channel();
      }else {
        this.$message.warning('请选择警情！');
        return;
      }
    },
    channel(){
      this.show = false;
      this.$emit('update:jqItem',undefined);
    },
    rest(){
      this.form={
        jqbh:'',
          // 主战队伍
          zzxfdw: "",
          // 行政区域编号
          xzqydmSj: "",
          // 行政区域名称
          xzqyName: "",
          pageNum: 1,
          pageSize: 10,
          params: {
          beginTime: "",
            endTime: "",
        }
      }
      this.total = 0
      this.$refs.dateTimeRange.clear();
      this.searHide = true;
    },
    toggle(){
      this.show = true;
    }
  }
}
</script>

<style lang="scss" scoped>
.seach{
  height: 40px;
  overflow: hidden;
  transition: all .5s ease-in-out;
}
.autoHeight{
  height: auto;
}
</style>
