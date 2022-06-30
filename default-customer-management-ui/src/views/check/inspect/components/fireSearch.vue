<template>
  <div class="fireSearch">
    <header>
      <h2 class="title">稽查条件</h2>
      <span class="hide"  @click="policeHide = !policeHide">{{policeHide?'收起':'展开'}}
        <i :class="policeHide?'el-icon-arrow-down':'el-icon-arrow-up'"></i>
      </span>
    </header>
    <section>
      <div class="search-content">
        <div class="search-container">
          <el-row v-for="o,index in searchData" :key="index" class="container-item">
            <el-row v-show="index == 0 || index == 1 || index === 2">
              <el-col :span="4"><span class="search-label">{{o.lvl1Name}}:</span></el-col>
              <el-col :span="20">
                <el-checkbox class="main-text" v-for="a in o.items" v-model="a.selected" :key="a.value"  @change="toggleSelect(a)"><span v-html="getShowText(a)"></span></el-checkbox>
              </el-col>
            </el-row>
            <el-row v-show="index > 2 && policeHide">
              <el-col :span="4"><span class="search-label">{{o.lvl1Name}}:</span></el-col>
              <el-col :span="20">
                <el-checkbox class="main-text" v-for="a in o.items" v-model="a.selected" :key="a.value"  @change="toggleSelect(a)"><span v-html="getShowText(a)"></span></el-checkbox>
              </el-col>
            </el-row>
          </el-row>
        </div>
        <el-row>
          <el-col class="btn-area">
            <el-button type="primary" @click="submitCheck">稽查</el-button>
            <el-button @click="restBtn">重置</el-button>
          </el-col>
        </el-row>
      </div>
    </section>
    <section>
      <div class="detail-container">
        <el-carousel trigger="click" height="90px" :autoplay="false" @change="" v-show="cardLength>0">
          <el-carousel-item v-for="item in cardLength" :key="item">
            <div class="carousel-item">
              <div class="cardContainer" v-for="(o,index) in showCheckData" :key="index" :class="curIndex === index ? 'active' : ''" @click="handleCardClick(index,o)">
                <el-row>
                  <el-col class="cardTitle">{{o.lvl1Name}}</el-col>
                </el-row>
                <el-row>
                  <el-col class="cardContent">{{o.lvl2Name}}</el-col>
                </el-row>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
        <el-row>
          <el-col class="total-info">
            共稽查<span>{{total}}</span>起火灾记录；其中<span>{{fallTotal}}</span>条出动队伍不符合规则
          </el-col>
        </el-row>
        <div class="table_zone">
          <el-table
            v-loading="loading"
            :data="tableData"
            style="width: 100%;"
            @sort-change="tableSortChangeHandle"
            :default-sort="{prop: 'tbsj', order: 'descending'}"
          >
            <el-table-column
              prop="zqbh"
              label="火灾编号"
              width="150"
              sortable
              show-overflow-tooltip
            />
            <el-table-column
              prop="jqbh"
              label="警情编号"
              width="150"
              sortable
              show-overflow-tooltip
            />
            <!--  :formatter="dateFormat" -->
            <el-table-column
              prop="zqsj"
              label="起火时间"
              sortable
              width="150"
              show-overflow-tooltip
            />
            <el-table-column
              prop="xzqydmSj"
              label="行政区域"
              width="140"
              sortable
              show-overflow-tooltip
            />
            <el-table-column prop="jqfsdd" label="警情地址" width="140" show-overflow-tooltip>
              <template slot-scope="scope">
                <div>{{ scope.row.jqfsdd || '-' }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="qwhz" label="轻微火灾" width="100" sortable>
              <template slot-scope="scope">
                <div v-if="scope.row.qwhz == 0" class="pic">否</div>
                <div v-if="scope.row.qwhz == 1" class="pic">是</div>
              </template>
            </el-table-column>
            <el-table-column prop="qhcslb" label="起火场所" show-overflow-tooltip>
              <template slot-scope="scope">
                <div>{{ scope.row.qhcslb || '-' }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="qhwfldm" label="起火物" show-overflow-tooltip/>
            <el-table-column prop="hzyyfldm" label="起火原因" show-overflow-tooltip>
              <template slot-scope="scope">
                <div>{{ scope.row.hzyyfldm || '-' }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="num" label="伤亡情况" width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                <div>{{ scope.row.swnum }}死{{ scope.row.ssnum }}伤</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="tbsj"
              label="填报时间"
              sortable
              width="150"
              show-overflow-tooltip
            />
            <el-table-column
              prop="zrqddName"
              label="责任区大队"
              width="100"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              prop="shzt"
              label="报告状态"
              width="100"
              sortable
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <div v-if="scope.row.shzt == 0" class="pic">
                  <img src="@/views/icons/weisongshen.svg"/>待填报
                </div>
                <div v-if="scope.row.shzt == 1" class="pic">
                  <img src="@/views/icons/shenpizhong.svg"/>审核中
                </div>
                <div v-if="scope.row.shzt == 2" class="pic">
                  <img src="@/views/icons/yishenpi.svg"/>已审核
                </div>
                <div v-if="scope.row.shzt == -1" class="pic">
                  <img src="@/views/icons/beizhongzhi.svg"/>待修改
                </div>
                <div v-if="scope.row.shzt == -2" class="pic">
                  <img src="@/views/icons/tuihui.svg"/>被退回
                </div>
                <div v-if="scope.row.shzt == -3" class="pic">
                  <img src="@/views/icons/daiwanshan.svg"/>待完善
                </div>
                <div v-if="scope.row.shzt == 99" class="pic">
                  <img src="@/views/icons/yiguidang.svg"/>已归档
                </div>
                <div v-if="scope.row.shzt == 4" class="pic">
                  <img src="@/views/icons/bohui.svg"/>被驳回
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="130">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="checkDetail(scope.row)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination_zone" v-if="tableData.length>0 ">
            <el-pagination
              background
              :current-page="pageNum"
              :page-sizes="pageSizes"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import { querytermlist,jqAuditList } from '@/api/check/inspect'
  export default {
    name:'fireSearch',
    data(){
      return{
        // 新增 审核状态字典 列表数据
        auditStatusListData: [],
        policeHide:false,
        searchData:[], //稽查条件查询
        loading:false,
        checksearchData:[], //选中的选项searchData
        showCheckData:[], //展示选择的tab
        curIndex:0, //当前所选滑块序号
        pageNum:1, //分页数据
        pageSize: 10,
        total:0,
        fallTotal:0,
        params:{
          // 依据排序的属性名称（从 table 返回的数据中获取）
          sortField: "",
          sortOrder: ""
        },
        // 每页显示条数
        pageSizes: [10, 20, 30, 50],
        tableData:[], //查询数据
        selectedOption:{} //当前选择数据
      };
    },
    computed:{
      cardLength() {
        return Math.ceil(this.showCheckData.length / 6);
      },
    },
    methods:{
      handleChange(){
        console.log(this.form.type)
      },
      getShowText(data){
        if(data != null){
          let dataText = data.lvl2Name;
          if(dataText.indexOf("（") > -1){
            let dictValueRed = "";
            let strIndex = dataText.indexOf("（");
            let endNum = dataText.indexOf("）");
            if(data.selected){
              dictValueRed = dataText.substring(0,strIndex) + '<span style="color: #1890ff">' + dataText.substring(strIndex,endNum+1) + '</span>';
            }else {
              dictValueRed = dataText.substring(0,strIndex) + '<span style="color: #999999">' + dataText.substring(strIndex,endNum+1) + '</span>';
            }
            return dictValueRed;
          }else{
            return dataText;
          }
        }else {
          return '';
        }
      },
      toggleSelect(option){
        console.log(option);
        if (option.selected) {
          // 该项被选中,向面包屑中加入该选项
          if (this.checksearchData.every(b => b.lvl2 !== option.lvl2)) {
            this.checksearchData.push(option);
          }
          // 更新已选
          this.selectedOption = option;
        } else {
          // 将取消选择的项目移出面包屑
          const breadcrumbIndex = this.checksearchData.findIndex(b => b.lvl2 === option.lvl2);
          if (breadcrumbIndex > -1) {
            this.checksearchData.splice(breadcrumbIndex, 1);
          }
          if(this.selectedOption != null){
            if (this.selectedOption.lvl2 === option.lvl2) {
              this.selectedOption = null;
            }
          }
        }
      },
      /**
       * 稽查
       */
      submitCheck(){
        this.showCheckData = JSON.parse(JSON.stringify(this.checksearchData));
        if(this.showCheckData[0]){
          this.initParams = this.showCheckData[0];
          this.getList(this.showCheckData[0]);
        }else{
          this.initParams = {};
          this.getList(this.initParams);
        }
      },
      handleCardClick(index,data){
        this.curIndex = index;
        this.initParams = data;
        this.getList(data);
      },
      restBtn(){
        this.searchData.map(o =>{
          o.items.map(i =>{
            i.selected = false;
          })
        })
      },
      /*
      * 获取表格数据
      * */
      getList(data){
        let params = {
          pageNum:this.pageNum,
          pageSize:10,
          params: `{'beginTime':'','endTime':'','sortField':'${this.params.sortField}','sortOrder':'${this.params.sortOrder}'}`,
          type: 2
        };
        if(data){
          params.jsrq = '';
          params.ksrq = '';
          params.lvl1 = data.lvl1;
          params.lvl2 = data.lvl2;
        }
        this.loading = true;
        jqAuditList(params).then(response =>{
          if(response.code == 200){
            this.tableData = response.data.rows;
            this.total = response.data.allTotal;
            this.fallTotal = response.data.total;
          }
        }).finally(() =>{
          this.loading = false;
        })
      },
      formatter(row, column) {
        return row.address;
      },
      checkType(text) {
        let className = "";
        if (text == "主战") {
          className = "tag tag_primary";
        } else if (text == "增援") {
          className = "tag tag_info";
        } else if (text == "火灾报告") {
          className = "tag tag_warning";
        }
        return className;
      },
      formatShzt(val) {
        const filterData = this.auditStatusListData.find(
          element => element.dictValue == val
        );
        return filterData ? filterData.dictLabel : "-";
      },
      // 分页
      handleSizeChange(val) {
        this.pageSize = val;
        this.getList(this.initParams);
      },
      // 翻页
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getList(this.initParams);
      },
      // 查看详情
      checkDetail(data) {
        this.$router.push({
          path: "/showDetail/jqxxShowDetail",
          query: {
            jqbh: data.jqbh
          }
        });
      },
      /**
       * 表格 单列排序改变回调
       */
      tableSortChangeHandle(){

      }
    },
    created(){
      /*
      * 查询稽查条件
      * */
      querytermlist({type:2}).then(response =>{
        if(response.code === 200){
          this.searchData = response.data;
        }
      });
      this.getDicts("audit_status").then(response => {
        this.auditStatusListData = response.data;
      });
    }
  }
</script>

<style lang="scss" scoped>
  .fireSearch{
    header{
      width: 100%;
      height: 35px;
      border-bottom: 1px solid #DFE6ED;
      .title{
        display: inline-block;
        font-size: 15px;
        height: 18px;
        line-height: 18px;
        color: #333333;
        border-left: 2px solid #437FDF;
        text-indent: 10px;
      }
      .hide{
        right: 0;
        cursor: pointer;
        color: #437fdf;
        position: absolute;
      }
    }
    .search-content{
      border-bottom: 2px solid #F1F2F4;
      .search-container{
        width: 100%;
        padding: 10px 0;
        border-bottom: 1px dashed #DFDFDF;
        .container-item{
          padding: 5px 0;
        }
        .search-label{
          color: #000000;
          font-weight: 400;
        }
        .main-text{
          margin-bottom: 5px;
          color: #666666;
        }
        .tip-text{
          color: #999999;
        }
      }
      .btn-area{
        padding: 15px 0;
      }
    }
    .detail-container{
      .carousel-item{
        display:flex;
        justify-content:start;
        border-bottom:2px solid #437FDF;
      }
      .cardContainer {
        width:195px;
        height:60px;
        background:#FFFFFF;
        border-radius:4px 4px 0px 0px;
        border:1px solid #DBDEE0;
        border-bottom:none;
        padding: 10px 5px 0;
        margin: 8px 8px 0px 0px;
        cursor:pointer;
        text-align: center;
        .cardTitle{
          font-size:14px;
          font-weight:500;
          color:#333333;
          line-height: 20px;
        }
        .cardContent{
          font-size: 12px;
          color: #666666;
          line-height: 17px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .cardContainer.active{
        background :#437FDF;
        border:none;
        box-shadow:5px 1px 7px -2px rgba(0, 0, 0, 0.3);
        .el-col {color :#fff;}
      }  >>>.el-carousel__arrow {
           top:25%;
           display : block !important;
         }  >>>.el-carousel__indicators{
              display:none;
            } >>>.el-carousel__item{
                padding: 0;  }
      .total-info{
        font-size: 12px;
        font-weight:400;
        color: #777777;
        padding: 0 0 10px 0;
        span{
          color: #F77006;
          font-weight: 500;
        }
      }
      .table_zone{
        font-size:14px;
        thead{
          background: rgba(240, 244, 247, 1)
        }
        .tag{
          display: inline-block;
          width: 58px;
          border-radius: 3px;
          font-weight: 500;
          line-height: 20px;
          text-align: center;
        }
        .tag_primary{
          color: #2296F3;
          background: rgba(34, 150, 243, 0.2);
          border: 1px solid rgba(34, 150, 243, 1);
        }
        .tag_info{
          color: #01BCD5;
          background: rgba(1, 188, 213, 0.2);
          border: 1px solid rgba(1, 188, 213, 1);
        }
        .tag_warning{
          color: #FF9802;
          background: rgba(255, 152, 2, 0.2);
          border: 1px solid rgba(255, 152, 2, 1);
        }
        .dot:before{
          content:'●';
          display:inline-block;
          margin-right:10px;
          font-size:16px;
        }
        .dot_success:before{
          color: #27CA3F;
        }
        .dot_error:before{
          color: #F54336;
        }
        .pagination_zone{
          margin-top: 20px;
          text-align: right;
        }
      }
    }
  }
</style>
