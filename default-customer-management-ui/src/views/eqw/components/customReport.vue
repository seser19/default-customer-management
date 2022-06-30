<template>
  <div class="custom-report">
    <div class="search">
      <el-form label-width="110px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="自定义报表列表">
              <el-select v-model="selectedTemplate" filterable @change="toggleTemplate()" placeholder="请选择" style="width: 100%">
                <el-option v-for="o in templateOption" :key="o.tempId" :label="o.tempName" :value="o.tempId"/>
                <div class="text-center">
                  <!-- <el-pagination
                    v-show="total>0"
                    small
                    layout="prev, pager, next"
                    :current-page="listParams.pageNum"
                    :page-size="listParams.pageSize"
                    :total="total"
                    @current-change="handleCurrentChange"
                  >
                  </el-pagination> -->
                </div>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="统计时间">
              <el-date-picker style="float: left;width: 30%;" v-model="dateRange[0]" value-format="yyyyMMdd" type="date" :clearable="false">
              </el-date-picker>
              <span style="float: left;width: 5%;text-align: center;">-</span>
              <el-date-picker style="float: left;width: 30%;" v-model="dateRange[1]" value-format="yyyyMMdd" type="date" :clearable="false">
              </el-date-picker>
              <el-select v-model="selectDate" placeholder="请选择" @change="dateRangeBtn(selectDate)" style="float: right;width: 30%;">
                  <el-option
                    v-for="item in dateList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                  </el-option>
               </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="行政区域">
              <el-input v-model="selectedAreaName" readonly placeholder="请选择" :disabled="!(states=='1')" @focus="openAreaSelect()">
                <i v-show="states=='1'" slot="suffix" class="iconfont icon-icon-test" @click="openAreaSelect()" />
                <i slot="suffix" class="el-icon-circle-close" style="margin-left:5px; cursor: pointer;" @click="clearArea()"  v-show="selectedAreaName" />
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="消防队伍">
              <treeselect
                style="height: 32px;"
                :disabled="!(states=='2')"
                v-model="selectedOrgIds"
                :options="zdForm"
                @select="nodeClick"
                :normalizer="normalizer"
                :load-options="loadOptions"
                placeholder="选择消防队伍" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="审核状态">
              <el-select v-model="selectedStatus" multiple placeholder="请选择" style="width: 100%">
                <el-option v-for="o in statusOption" :key="o.value" :label="o.label" :value="o.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报表范围">
              <el-input v-model="segmentReportName" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="是否有效">
              <el-checkbox v-model="isValid">不查失效单位和地区</el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="text-align: right;">
            <button class="btn_back" @click.prevent="resetFilter()">重置</button>
            <button class="btn_orange" @click.prevent="getReportNew()">生成</button>
            <button class="btn_orange" @click.prevent="downloadReport()">导出</button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div v-loading="loading">
      <div class="table-d" >
        <p ref="message"> </p>
        <el-col v-if="anniuShow != '0'" style="text-align: center;margin-top: 15px;">
          <button  class="btn_orange" @click.prevent="downloadReport()">导出</button>
        </el-col>
      </div>
    </div>

    <!-- 行政区域弹出层 -->
    <provModal ref="areaSelect" :depth="3" @setProv="setSelectedArea"></provModal>
    <!-- 消防单位弹出层 -->
    <mulModal ref="orgSelect" @setMulVal="setSelectedOrg"></mulModal>
    <!--名称修改框-->
    <el-dialog title="生成报表的名称" :visible.sync="dialogFormVisible" width="400px">
      <el-form>
        <el-form-item label="报表标题(可修改)">
          <el-input v-model="excelTitle" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editCustomName">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listDept, getDept, treeselect, delDept, addDept, updateDept } from "@/api/system/dept";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { getUserProfile } from "@/api/system/user";
import { listDeptCheck } from "@/api/system/dept";
import provModal from '@/views/data/entry/jqxx/components/provModal';
import mulModal from '@/views/data/entry/jqxx/components/mulModal';
import XLSX from 'xlsx';
import { formatterDate } from "@/utils/index";
import { getInitTime, getNearlyRecentDays } from "@/utils/dateTimeUtils.js"
import { getInfo } from '@/api/login';
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { getCustomReportTemplateList, getReportTemplateLv2, synchronizeData, getSynchronizeDataTime, getLastEtlTime, getReportInfos, getCustomReportRestrictValue, getCombinationAreaName } from '@/api/report/report';
export default {
  name: "CustomReport",
  components: { provModal, mulModal, Treeselect },
  data () {
    return {
      anniuShow: '0',
      isLyao: '',
      isBJ: false,
      loading: false,
      // 可选报表模板
      templateOption: [],
      selectInfo: '',
      providerNameAndPhone2: '',
      name: '',
      supplierList: '',
      // 已选报表模板
      selectedTemplate: '',
      subdivisionParams: {
        deptLevel: 0,
        parentId: null,
        type: 0
      },
      listParams: {
        tempName: '',
        flag: '2',
        pageNum: 1,
        pageSize: 10,
        isFilter: 2
      },
      zdForm: [],
      normalizer (node) {
        return {
          id: node.deptId,
          label: node.deptName,
          children: node.children
        };
      },
      synchronizationTime: '',
      states: 'N',
      lvl2Id: '', //总队
      lvl3Id: '',//支队
      lvl4Id: '', //大队
      lvl5Id: '',//中队
      // 可选细分类型
      subdivisionOption: [],
      // 已选细分类型
      selectedSubdivision: '',
      // 已选地区编码（省）
      selectedProvId: null,
      // 已选地区编码（市）
      selectedCityId: null,
      // 已选地区编码（区）
      selectedCountyId: null,
      // 已选地区名称
      selectedAreaName: '',
      // 所选消防单位id集合
      selectedOrgIds: undefined,
      // 所选消防单位名称集合
      selectedOrgNames: undefined,
      // 可选状态
      statusOption: [{
        value: '0',
        label: '待填报'
      }, {
        value: '2',
        label: '已审核'
      }, {
        value: '1',
        label: '审核中'
      }, {
        value: '-1',
        label: '被终止'
      }, {
        value: '-2',
        label: '被退回'
      }, {
        value: '-3',
        label: '待完善'
      }, {
        value: "4",
        label: "被驳回",
      }, {
        value: "99",
        label: "已归档",
      }],
      // 所选状态
      selectedStatus: '',
      // 日期选择控件配置
      dateList: [{
        value: 1,
        name: '最近一周'
      }, {
        value: 2,
        name: '最近一个月'
      }, {
        value: 3,
        name: '本月'
      }, {
        value: 4,
        name: '本年'
      }, {
        value: 5,
        name: '上个月'
      }, {
        value: 6,
        name: '上年'
      }],
      selectDate: 2,
      // 统计时间
      dateRange: [],
      // 下载参数
      downloadParams: {},
      jsonBs64: '',
      //选中报表名称
      templateSelectName: '',
      total: 0,
      templeteCode: null,
      //弹框是否隐藏
      dialogFormVisible: false,
      //生成自定义报表的标题
      excelTitle: '',
      //表格地区标题
      tableAreaName: '',
      //报表范围
      segmentReportName: '',
      //细分等级
      segmentReportLevel: undefined,
      //选择地区等级
      areaTypeLevel: undefined,
      //选择消防队等级
      selectOrgsLevel: undefined,
      initAreaTableName: '', //存储初始行政区名称
      isValid: true
    };
  },
  methods: {
    nodeClick (node, instanceId) {
      this.lvl2Id = '';
      this.lvl3Id = '';
      this.lvl4Id = '';
      this.lvl5Id = '';
      switch (node.deptLevel) {
        case 2:
          this.lvl2Id = node.deptId;
          break;
        case 3:
          this.lvl3Id = node.deptId;
          break;
        case 4:
          this.lvl4Id = node.deptId;
          break;
        case 5:
          this.lvl5Id = node.deptId;
          break
      }
      this.selectOrgsLevel = node.deptLevel;
    },
    getFireUnitt () {
      // 制空防止数字代码
      this.zdForm = [];
      // 获取当前中队中队信息
      let queryParams = {};
      /**
       * [获取用户的行政区域信息，查询单位列表]
       * @param  {Function} ).then(response [description]
       * @return {[type]}                   [description]
       */
      getUserProfile().then(response => {
        queryParams.deptRoots = response.deptRoots;
        if (response.data.admin) {
          queryParams.deptRoots = 1000000000;
        }
        queryParams.deptLevel = response.data.dept.deptLevel;
        listDept(queryParams)
          .then(res => {
            res.data.forEach(item => {
              item.children = null;
            });
            this.zdForm = res.data;
          })
          .catch(res => { });
      });
      // getMiddleInfo().then(res => {
      //  this.zdForm = res.data
      // })
    },
    loadOptions ({ action, parentNode, callback }) {
      if (action === "LOAD_CHILDREN_OPTIONS") {
        listDept({
          parentId: parentNode.deptId,
          deptLevel: parentNode.deptId.deptLevel
        }).then(res => {
          let treeList = res.data;
          /**
           * [for description]
           * 循环遍历数据，判断是否有下级列表
           * if hasChildren == true
           * 将 children = null 点击触发加载下级列表动作
           * if  hasChildren == false 则将 children = undefined
           * 没有下级列表为叶子结点，点击时不会触发加载动作
           *
           * @Author       Miliky
           * @DateTime     2020-01-10T10:29:58+0800
           * @Description: [一行代码一行诗]
           */
          for (var index in treeList) {
            if (treeList[index].hasChildren === true) {
              treeList[index].children = null;
            } else {
              treeList[index].children = undefined;
            }
          }
          parentNode.children = treeList;
          callback();
        });
      } else {
        callback();
      }
    },
    // 切换报表模板时重置禁用状态
    toggleTemplate () {
      this.selectedAreaName = '';
      this.selectedProvId = '';
      this.selectedCityId = '';
      this.$refs.areaSelect.clear();
      this.selectedOrgNames = undefined;
      this.selectedOrgIds = undefined;
      this.lvl2Id = '';
      this.lvl3Id = '';
      this.lvl4Id = '';
      this.lvl5Id = '';
      this.isValid = false;
      this.tableAreaName = this.initAreaTableName;
      let tempParams = {
        tempId: this.selectedTemplate
      };
      getCustomReportRestrictValue(tempParams).then(response => {
        if (response.code === 200) {
          if (response.data.restrictValue) {
            this.states = response.data.restrictValue;
            this.segmentReportName = response.data.confName;
            this.segmentReportLevel = response.data.subdivisionLevel;
          } else { this.states = 0; }
        } else {
          this.$message.error(response.msg);
        }
      });
      this.templateSelectName = this.templateOption.filter(o => o.tempId === this.selectedTemplate)[0].tempName;
      this.excelTitle = this.tableAreaName + this.templateSelectName;
    },
    getReportSelection () {
      /**
       * 遍历报表范围获取 rptType
       * rptType == 0 禁用行政区域和消防队伍
       * rptType == 1 禁用消防队伍
       * rptType == 2 禁用行政区域
       * @Author      Miliky
       * @DateTime    2020-02-10T21:16:31+0800
       * @Description [一行代码一行诗，一个系统一座城]
       */

      this.subdivisionOption.forEach((item) => {
        if (this.selectedSubdivision == item.code) { this.states = item.rptType; }
      })
    },
    // 打开行政区域的模态框
    openAreaSelect () {
      this.$refs.areaSelect.toggle();
    },
    // 设置所选地区
    setSelectedArea (obj, { first, second, third, last }) {
      console.log(first, second, third, last);
      console.log(obj)
      if (obj.type === 1) {
        this.selectedCityId = "";
        this.selectedCountyId = "";
        this.selectedProvId = obj.id;
      } else if (obj.type === 2) {
        this.selectedProvId = "";
        this.selectedCountyId = "";
        this.selectedCityId = obj.id;
      } else if (obj.type === 3) {
        this.selectedProvId = "";
        this.selectedCityId = "";
        this.selectedCountyId = obj.id;
      }
      this.subdivisionParams.type = obj.type > 2 ? 2 : obj.type;
      this.selectedAreaName = `${first} ${second} ${third} ${last}`;
      this.areaTypeLevel = obj.type;
      if (first == second) {
        this.tableAreaName = first + third + last;
      } else {
        this.tableAreaName = first + second + third + last;
      }
      this.excelTitle = this.tableAreaName + this.templateSelectName;
    },
    // 清空所选地区
    clearArea () {
      this.selectedAreaName = '';
      this.selectedProvId = '';
      this.selectedCityId = '';
      this.$refs.areaSelect.clear();
      this.subdivisionParams.type = 0;
      this.areaTypeLevel = undefined;
      // this.getSubdivision();
    },
    // 打开消防单位的模态框
    openOrgSelect () {
      this.$refs.orgSelect.echo(this.selectedOrgIds);
      this.$refs.orgSelect.toggle();
    },
    // 设置所选消防单位
    setSelectedOrg (result) {
      const selectedOrgIds = [];
      const selectedOrgNames = [];
      for (const r of result) {
        selectedOrgIds.push(r.deptId);
        selectedOrgNames.push(r.deptName);
      }
      this.selectedOrgIds = selectedOrgIds;
      this.selectedOrgNames = selectedOrgNames.join(', ');
    },
    // 清空所选消防单位
    clearOrg () {
      this.selectedOrgNames = undefined;
      this.selectedOrgIds = undefined;
      this.selectOrgsLevel = undefined;
      this.$refs.orgSelect.clear();
    },
    // 报表查询
    getReport () {
      if (!this.selectedTemplate) {
        this.$message({ message: '请选择报表名称', type: 'error' });
        return;
      }
      if (this.states != '0') {
        if (this.states == '1') {
          if (this.selectedTemplate != 'TEMPLATE_TYPE_FIVE' || !this.isBJ) {   // 起火场所简表单独处理
            if (this.selectedAreaName == "") {
              this.$message({ message: '请选择行政区域', type: 'error' });
              return;
            }
          }
        } else if (this.states == '2') {
          if (this.selectedOrgIds == '' || this.selectedOrgIds == undefined) {
            this.$message({ message: '请选择消防队伍', type: 'error' });
            return;
          }
        }
      }
      this.loading = true;
      this.templeteCode = this.templateOption.filter(o => o.tempId === this.selectedTemplate)[0].tempCode;
      const params = {
        templeteCode: this.templeteCode, //模板编号参数
        beginTime: this.dateRange[0].replace(/-/g, ''),
        endTime: this.dateRange[1].replace(/-/g, ''),
        excelTitle: this.excelTitle,
        filter_status: '',
        only_report: '1' // 默认报表查询
        //            queryType: 0,  // 起火场所简默认值,
      };
      if (this.isValid) {
        params.filter_status = '0';
      }
      if (this.selectedSubdivision) {
        params.queryType = this.selectedSubdivision;
      }
      if (this.selectedProvId) {
        params.proviceId = this.selectedProvId;
      }
      if (this.selectedCityId) {
        params.cityId = this.selectedCityId;
      }
      if (this.selectedCountyId) {
        params.countyId = this.selectedCountyId;
      }
      if (this.selectedStatus) {
        params.statusCd = this.selectedStatus;
      }
      if (this.lvl2Id) {
        params.lvl2Id = this.lvl2Id;
      } else if (this.lvl3Id) {
        params.lvl3Id = this.lvl3Id;
      } else if (this.lvl4Id) {
        params.lvl4Id = this.lvl4Id;
      } else if (this.lvl5Id) {
        params.lvl5Id = this.lvl5Id;
      }
      //行政区域和消防单位都禁用时，传参需要给默认值
      if (this.states !== '1') {
        if (this.subdivisionParams.deptLevel == 2) {
          //新疆兵团特殊处理
          params.proviceId = this.deptId == '6600000000' ? '6500000000' : this.deptId;
        }
        if (this.subdivisionParams.deptLevel == 3) {
          // params.cityId = this.deptId;
        }
      }
      if (this.states !== '2') {
        if (this.subdivisionParams.deptLevel == 2) {
          params.lvl2Id = this.deptId;
        }
        if (this.subdivisionParams.deptLevel == 3) {
          params.lvl3Id = this.deptId;
        }
      }
      this.$refs.message.innerHTML = "";
      getReportInfos(params).then(response => {
        this.$refs.message.innerHTML = "";
        this.loading = false;
        if (response.code === 200) {
          if (response.data.stream == "生成报表出错") {
            this.$message.warning(`暂未查询到报表数据，请修改报表生成条件，重新生成`);
          } else if (response.data.stream) {
            const workbook = XLSX.read(response.data.stream, { type: 'base64' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            this.$refs.message.innerHTML = XLSX.utils.sheet_to_html(worksheet);
            //保存文件流
            this.jsonBs64 = response.data.stream;
            // 每次成功查询后保存该次查询条件作为下载参数
            this.downloadParams = params;
            this.anniuShow = '1';
          } else {
            this.$message.warning("暂无数据或筛选条件与报表类型不匹配！");
          }
        } else {
          this.$message.warning(`抱歉，该报表未能成功生成，稍后重试或联系管理员`);
        }
      }).catch(e => {
        this.loading = false;
      });
    },
    // 下载报表
    downloadReport () {
      if (!this.downloadParams.templeteCode) {
        this.$message.warning("请先进行查询");
        return;
      }
      //bs64转化blob
      const decodedData = atob(this.jsonBs64);
      let n = decodedData.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = decodedData.charCodeAt(n);
      }
      if (window.navigator.msSaveOrOpenBlob) {
        // IE浏览器
        const blob = new MSBlobBuilder();
        blob.append(u8arr);
        window.navigator.msSaveOrOpenBlob(blob.getBlob(), this.excelTitle + '.xlsx');
      } else {
        // 其他浏览器
        const dataFile = new File([u8arr], '文件名', { type: 'xlsx' });
        const trigger = document.createElement('a');
        trigger.href = window.URL.createObjectURL(dataFile);
        trigger.download = trigger.download = this.excelTitle + '.xlsx';
        trigger.click();
      }
    },
    // 重置筛选
    resetFilter () {
      this.selectedTemplate = '';
      this.selectedSubdivision = '';
      this.clearArea();
      // this.clearOrg();
      this.states = '0';
      this.selectedOrgNames = undefined;
      this.selectedOrgIds = undefined;
      this.selectedStatus = '';
      this.$refs.message.innerHTML = "";
      this.jsonBs64 = '';
      this.segmentReportName = '';
      this.segmentReportLevel = undefined;
      this.selectOrgsLevel = undefined;
    },
    // 同步数据
    async dataSynchronize () {
      const res1 = await synchronizeData();
      if (res1.code === 200) {
        this.$message.success('数据同步成功！');
        const res2 = await getSynchronizeDataTime();
        if (res2.code === 200) {
          this.synchronizationTime = res2.data.cdtime;
          // TODO 将返回的同步时间填到页面上
        } else {
          this.$message.error(res2.msg);
        }
      } else {
        this.$message.error(res1.msg);
      }
    },
    /**
     * [getLastTime 获取最后一次同步时间]
     * @Author       Miliky
     * @DateTime     2020-01-21T23:31:45+0800
     * @Description: [一行代码一行诗]
     * @return       {void}
     */
    getLastTime () {
      getLastEtlTime().then(res => {
        if (res.code == 200) this.synchronizationTime = res.data.cdtime || '';
      })
    },
    getList () {
      this.loading = true;
      getCustomReportTemplateList(this.listParams).then(response => {
        this.loading = false;
        if (response.code === 200) {
          this.templateOption = response.data.resultList;
          this.total = response.data.totalNum;
        } else {
          this.$message.error(response.msg);
        }
      }).catch(e => {
        this.loading = false;
      });
    },
    handleCurrentChange (val) {
      this.listParams.pageNum = val;
      this.getList();
    },
    getReportNew () {
      if (!this.selectedTemplate) {
        this.$message({ message: '请选择报表名称', type: 'error' });
        return;
      }
      if (this.states == '1') {
        if (!this.selectedAreaName) {
          this.$message({ message: '请选择行政区', type: 'error' });
          return;
        }
        if (this.areaTypeLevel < this.segmentReportLevel - 1) {
          this.$message.error('请选择到正确的行政区级别');
          return;
        }
      } else if (this.states == '2') {
        if (this.selectedOrgIds == '' || this.selectedOrgIds == undefined) {
          this.$message({ message: '请选择消防队伍', type: 'error' });
          return;
        }
        if (this.selectOrgsLevel < this.segmentReportLevel) {
          this.$message.error('请选择到正确的消防队伍');
          return;
        }
      }
      this.excelTitle = (this.states === '1' ? this.selectedAreaName.trim() + '-' : '') + this.templateSelectName + '(' + this.dateRange[0] + '-' + this.dateRange[1] + ')';
      this.dialogFormVisible = true;
    },
    editCustomName () {
      this.getReport();
      this.dialogFormVisible = false;
    },
    dateRangeBtn (date) {
      this.dateRange = [];
      let end = new Date();
      let start = new Date();
      start.setHours(0,0,0,0);
      end.setHours(23,59,59,0);
      let year = new Date().getFullYear();
      let month = new Date().getMonth();
      switch (date) {
        case 1:
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
          break;
        case 2:
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
          break;
        case 3:
          start.setDate(1);
          break;
        case 4:
          start.setMonth(0);
          start.setDate(1);
          break;
        case 5:
          if(month == 0){
            month = 12;
            year = year -1;
          }else if(month < 10){
            month = '0' + month;
          }
          let myDate = new Date(year, month, 0);
          start = new Date(year + '-' + month + "-" + "01").setHours(0,0,0,0);
          end = new Date(year + '-' + month + '-' +  myDate.getDate()).setHours(23,59,59,0);
          break;
        case 6:
          let yearNew = new Date().getFullYear()-1;
          start = new Date(yearNew + '-01-01').setHours(0,0,0,0);
          end = new Date(yearNew + '-12-31').setHours(23,59,59,0);
          break;
      };
      this.dateRange.push(formatterDate(start, "YYYYMMDD"));
      this.dateRange.push(formatterDate(end, "YYYYMMDD"));
    }
  },
  watch: {
    '$route' (to, from) {
      // 对路由变化作出响应...
      let srt = to["name"];
      if (srt) {
        if (srt.indexOf("fixedstatement") != -1) {
          this.getList();
        }
      }
    }
  },
  async created () {
    this.isLyao = this.$store.state.user.name;
    this.isBJ = this.$store.state.user.deptId === 1000000000;
    this.getFireUnitt();
    let deptLevel = 0;
    // 获取用户所属组织层级
    const res1 = await getInfo();
    if (res1.code === 200) {
      deptLevel = res1.user.dept.deptLevel;
      this.deptId = res1.user.dept.deptId;
      this.subdivisionParams.deptLevel = deptLevel;
      if (this.deptId === 1000000000) {
        this.tableAreaName = '全国';
        this.initAreaTableName = '全国';
      }
    } else {
      this.$message.error(res1.msg);
    }
    //获取自定义报表列表
    this.listParams.deptLevel = deptLevel;
    getCustomReportTemplateList(this.listParams).then(response => {
      this.loading = false;
      if (response.code === 200) {
        this.templateOption = response.data.resultList;
        this.total = response.data.totalNum;
      } else {
        this.$message.error("列表查询失败");
      }
    }).catch(e => {
      this.loading = false;
    }); //捕获异常;
    //获取地区名称
    let areaParmas = {
      areaId: res1.area.areaId
    };
    await getCombinationAreaName(areaParmas).then(response => {
      if (response.code === 200) {
        if (response.data && response.data.subName) {
          this.tableAreaName = response.data.subName;
          this.initAreaTableName = response.data.subName;
        }
      } else {
        this.$message.error(response.msg);
      }
    });
    // 初始化时间范围1个月
    const start = getNearlyRecentDays(30)[0].substr(0, 10);
    const end = getNearlyRecentDays(30)[1].substr(0, 10);
    this.dateRange.push(formatterDate(start, "YYYYMMDD"));
    this.dateRange.push(formatterDate(end, "YYYYMMDD"));
  }
}
</script>
