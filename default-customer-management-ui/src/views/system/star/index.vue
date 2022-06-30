<template>
  <div class="app-container">
    <div class="page_zone">
      <div class="reporting-title">
          <h2>{{ $route.meta.title }}</h2>
      </div>
    </div>
    <div class="content">
      <el-form :inline="true">
        <el-form-item label="关注类型">
          <el-select
            v-model="queryParams.type"
            placeholder=""
            clearable
            size="small"
            style="width: 240px"
            placeholder="请选择"
          >
            <el-option
              v-for="dict in typeList"
              :key="dict.value"
              :label="dict.text"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="关注时间">
          <el-date-picker
            v-model="dateRange"
            size="small"
            style="width: 240px"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :clearable="false"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchData">查询</el-button>
          <el-button @click="rest">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="loading" :data="collectData">
        <el-table-column label="序号"  type="index" :index="indexMethod" width="80" />
        <el-table-column label="类型">
          <template slot-scope="scope">
            <div>
              <span v-if="scope.row.type == 1">警情</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="编号" prop="serialNum" />
        <el-table-column label="关注时间" prop="collectTime"  />
        <el-table-column label="操作" align="center" class-name="small-padding">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleWatch(scope.row)"
            >查看详情</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDataScope(scope.row)"
            >取消关注</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
          v-if="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
    </div>
  </div>
</template>
<script>
import { collectList,updateStatus } from '@/api/system/user.js'
  export default{
    name:'myStar',
    data() {
      return {
        typeList:[{
          text:'警情',
          value:'1'
        }],
        dateRange:[], //时间范围
        loading:false,
        collectData:[], //关注列表数据
        total: 0,
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          type: "", //关注类型
        }
      }
    },
    methods:{
      indexMethod(index) {
        return index + 1;
      },
      getList(){
        this.queryParams.collectTimeStart = this.dateRange[0];
        this.queryParams.collectTimeEnd = this.dateRange[1];
        collectList(this.queryParams).then(res => {
          if(res.code == 200){
            this.collectData = res.rows
            this.total = res.total
          }
        })
      },
      handleWatch(data) {
        this.$router.push({
              // path: '/dataEntry/lsjqxq',
              path: "/showDetail/jqxxShowDetail",
              query: {
                  jqbh: data.serialNum,
                  jqmc: data.jqmc
              }
          });
      },
      handleDataScope(data) {
        let params = {
          type: data.type,
          serialNum: data.serialNum,
          status: 0,
          id: data.id
        }
        updateStatus(params).then(res => {
          if(res.code == 200){
            this.getList();
          }
        })
      },
      searchData(){
        this.queryParams.pageNum = 1;
        this.getList()
      },
      rest(){
        this.queryParams.type = "";
        this.dateRange = [];
      }
    },
    created() {
      this.getList()
    }
  }
</script>
<style lang="stylus" scoped>
  .app-container{
    .page_zone{
      .reporting-title{
        h2 {
          background-image: url('~@/views/system/star/img/mystar.png');
          background-repeat: no-repeat;
          background-position: 0 50%;
          background-size: 23px;
        }
      }
      .title{
        font-size: 18px;
        font-weight: 400;
        display: flex;
        height: 60px;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #dae2ed;
        margin: 0 0 18px 0;
        img{
          width:26px;
          margin-right:15px;
        }
        div{
          flex: 1;
          text-align:left;
        }
      }
    }
  }
</style>
