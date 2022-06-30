<template>
  <div class="warningSearch">
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
        <el-carousel trigger="click" height="90px" :autoplay="false" @change="" v-show="cardLength>0" indicator-position="outside">
          <el-carousel-item v-for="item in cardLength" :key="item">
            <div class="carousel-item">
              <div class="cardContainer" v-for="(o,index) in showCheckData.slice((item-1)*6,(item-1)*6+6)" :key="index" :class="curIndex === index ? 'active' : ''" @click="handleCardClick(index,o)">
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
            共稽查<span>{{total}}</span>起警情记录；其中<span>{{fallTotal}}</span>条出动队伍不符合规则
          </el-col>
        </el-row>
        <div class="table_zone">
          <el-table
            v-loading="loading"
            :data="tableData"
            style="width: 100%"
            @sort-change="tableSortChangeHandle"
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-table :data="props.row.jlist" style="width: 100%" :show-header="false">
                  <el-table-column prop="xfdwlx" label="出动队伍伍类型">
                    <template slot-scope="scope">
                      <div :class="checkType(scope.row.xfdwlx)">{{ scope.row.xfdwlx }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="xfdwmc" label="出动队伍伍名称"/>
                  <el-table-column prop="zjxgsj" label="完成时间" width="200">
                    <template slot-scope="scope">
                      <div>{{ scope.row.zjxgsj || '完成时间：-'}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="trll" label="投入力量"/>
                  <el-table-column prop="shzt" label="报告状态">
                    <template slot-scope="scope">
                      <!-- 判断状态码 除了 2 和 99 其他全部是红色标记 -->
                      <div
                        :class="(scope.row.shzt != 2 && scope.row.shzt != 99) ? 'dot dot_error' : 'dot dot_success'"
                      >{{ formatShzt(scope.row.shzt) }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                      <el-link
                        v-if="scope.row.cdbh"
                        type="primary"
                        @click="handleEdit(scope.row)"
                      >详情
                      </el-link>
                       <!--<el-link type="primary" disabled>删除</el-link>-->
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column prop="jqbh" label="警情编码" width="150" sortable/>
            <el-table-column
              prop="jjsj"
              label="接警时间"
              sortable
              :show-overflow-tooltip="true"
            />
            <el-table-column
              prop="xzqydm"
              label="行政区域"
              sortable
              :show-overflow-tooltip="true"
            />
            <el-table-column prop="jqfsdd" label="警情地址" :show-overflow-tooltip="true"/>
            <el-table-column
              prop="sjlbmc"
              label="警情类型"
              sortable
              :show-overflow-tooltip="true"
            />
            <!-- <el-table-column prop="zzxfdw" label="主战队伍" align="left" /> -->
            <el-table-column prop="trll" label="投入力量" :show-overflow-tooltip="true"/>
            <el-table-column
              prop="tbsj"
              label="发送时间"
              width="140"
              sortable
              show-overflow-tooltip
            />
            <el-table-column prop="tbDeptName" label="派发单位" width="100"  :show-overflow-tooltip="true" />
            <!-- <el-table-column prop="jqmc" label="警情名称" width="500" align="left" show-overflow-tooltip /> -->
            <el-table-column label="出动报告" width="110" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <!--<div-->
                  <!--:class="!scope.row.cdxxtb.includes('全部')? 'dot dot_error':'dot dot_success'"-->
                <!--&gt;{{ scope.row.cdxxtb }}-->
                <!--</div>-->
              </template>
            </el-table-column>
            <el-table-column prop="zqxxtb" label="火灾报告" width="110" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <!-- 首先判断是否为 火灾扑救 类型，其次状态的文本是否是 未完成 -->
                <!--<div-->
                  <!--v-if="scope.row.sjlbdm.slice(0,2) == '01'"-->
                  <!--:class="scope.row.zqxxtb.includes('未完成') ? 'dot dot_error':'dot dot_success'"-->
                <!--&gt;{{ scope.row.zqxxtb }}-->
                <!--</div>-->
              </template>
            </el-table-column>
            <el-table-column label="操作" width="130">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="checkDetail(scope.row)">查看</el-button>
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
      name:'warningSearch',
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
          total:0, //总条数
          fallTotal:0,
          params:{
            // 依据排序的属性名称（从 table 返回的数据中获取）
            sortField: "tbsj",
            sortOrder: "desc"
          },
          // 每页显示条数
          pageSizes: [10, 20, 30, 50],
          tableData:[], //查询数据
          selectedOption:{}, //当前选择数据
        };
      },
      computed:{
        cardLength() {
          return Math.ceil(this.showCheckData.length / 6);
        },
      },
      methods:{
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
          if (option.selected) {
            // 该项被选中,向面包屑中加入该选项
            if (this.checksearchData.every(b => b.difCode !== option.difCode)) {
              this.checksearchData.push(option);
            }
            // 更新已选
            this.selectedOption = option;
          } else {
            // 将取消选择的项目移出面包屑
            const breadcrumbIndex = this.checksearchData.findIndex(b => b.difCode === option.difCode);
            if (breadcrumbIndex > -1) {
              this.checksearchData.splice(breadcrumbIndex, 1);
            }
            if(this.selectedOption != null){
              if (this.selectedOption.difCode === option.difCode) {
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
          this.pageNum = 1;
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
            type: 0
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
          });
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
              jqbh: data.jqbh,
              jqmc: data.jqmc
            }
          });
        },
        handleEdit(item) {
          const {xfdwlx, cdbh, jqbh, qwhz, shzt} = item;
          if (xfdwlx === "火灾报告") {
            // this.propfrom.zqbh = item.zqbh
            // this.propfrom.jqbh = item.jqbh
            // this.hzToggle()
            this.$router.push({
              path: "/dataEntry/lshzxq",
              query: {
                zqbh: cdbh,
                jqbh: jqbh,
                qwhz: qwhz
              }
            });
          } else {
            this.$router.push({
              // path: '/dataEntry/lscdxq',
              name: "出动信息详情",
              query: {
                cdbh: cdbh,
                shzt: shzt
              }
            });
          }
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
        querytermlist({type:0}).then(response =>{
          if(response.code === 200){
            response.data.map(o =>{
              o.items.map(b =>{
                b.difCode = `${b.lvl1}${b.lvl2}`;
              })
            });
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
  .warningSearch{
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
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
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
