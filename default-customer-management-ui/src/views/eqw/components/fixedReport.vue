<template>
  <div class="custom-report">
    <div class="search">
      <el-form label-width="110px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="报表类型">
              <el-select v-model="selectedTemplateType" @change="toggleTemplateType()" placeholder="请选择" style="width: 100%">
                <el-option v-for="o in templateTypeList" :key="o.value" :label="o.text" :value="o.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报表名称">
              <el-select v-model="selectedTemplate" @change="toggleTemplate()" placeholder="请选择" style="width: 100%">
                <el-option v-for="o in templateOptionList" :key="o.rptId" :label="o.rptName" :value="o.code"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="报表范围">
              <el-select v-model="selectedSubdivision" placeholder="请选择" style="width: 100%;"
                         :disabled="selectedTemplate==''" @change="subdivisionChange">
                <el-option v-for="o in subdivisionOption" :key="o.rptId" :label="o.rptName" :value="o.code"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="isShowYear">
            <el-form-item label="选择年份">
              <el-date-picker v-model="selectYear" type="year" :clearable="false" style="width: 100%"  @change="changeDateType" ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-else-if="isShowMonth">
            <el-form-item label="选择年月">
              <el-date-picker v-model="selectMonth" type="month" :clearable="false" style="width: 100%"  @change="changeDateType" ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-else>
            <el-form-item label="统计时间">
              <el-date-picker style="float: left;width: 30%;" v-model="dateRange[0]" value-format="yyyyMMdd" type="date"
                               :clearable="false">
              </el-date-picker>
              <span style="float: left;width: 5%;text-align: center;">-</span>
              <el-date-picker style="float: left;width: 30%;" v-model="dateRange[1]" value-format="yyyyMMdd" type="date"
                               :clearable="false" >
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
                <i v-show="states=='1'" slot="suffix" class="iconfont icon-icon-test" @click="openAreaSelect()"/>
                <i slot="suffix" class="el-icon-circle-close" style="margin-left:5px; cursor: pointer;"
                   @click="clearArea()" v-show="selectedAreaName"/>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="消防队伍">
              <!-- <el-input v-model="selectedOrgNames" readonly placeholder="请选择">
                <i slot="suffix" class="iconfont icon-icon-test" @click="openOrgSelect()"></i>
                <i slot="suffix" class="el-icon-circle-close" style="margin-left:5px; cursor: pointer;" @click="clearOrg()"  v-show="selectedOrgNames" />
              </el-input> -->
              <treeselect
                style="height: 32px;"
                :disabled="!(states=='2')"
                v-model="selectedOrgIds"
                :options="zdForm"
                @select="nodeClick"
                :normalizer="normalizer"
                :load-options="loadOptions"
                placeholder="选择消防队伍"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12" v-if="selectedTemplateType != 'jq'">
            <el-form-item label="审核状态">
              <el-select v-model="selectedStatus" multiple placeholder="请选择" style="width: 100%">
                <el-option v-for="o in statusOption" :key="o.value" :label="o.label" :value="o.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否有效">
              <el-checkbox v-model="isValid">不查失效单位和地区</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24" style="text-align: right">
            <button class="btn_back" @click.prevent="resetFilter()">重置</button>
            <button class="btn_orange" @click.prevent="getReportNew()">生成</button>
            <button class="btn_orange" @click.prevent="downloadReport()">导出</button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div v-loading="loading" >
      <div class="table-d" >
          <p ref="message" class="my-table-box"></p>
          <!-- <div ref="message" class="my-table-box"></div> -->
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
import { getInfo } from '@/api/login';
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { formatterDate } from "@/utils/index";
import { getInitTime, getNearlyRecentDays } from "@/utils/dateTimeUtils.js"
import {
  getReportTemplateLv1,
  getReportTemplateLv2,
  getFireReport,
  synchronizeData,
  getSynchronizeDataTime,
  getLastEtlTime,
  getCombinationAreaName
} from '@/api/report/report';

export default {
  name: 'FixedReport',
  components: { provModal, mulModal, Treeselect },
  data () {
    return {
      anniuShow: '0',
      isLyao: '',
      isBJ: false,
      loading: false,
      // 可选报表模板
      templateOption: [],
      // 已选报表模板
      selectedTemplate: '',
      subdivisionParams: {
        deptLevel: 0,
        parentId: null,
        type: 0
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
      lvl2Id: '',
      lvl3Id: '',
      lvl4Id: '',
      lvl5Id: '',
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
      jsonTest: '',
      templateSelectName: '',
      unitName: '', //单位名称
      selectedSubName: '', //细分名称
      //表格地区标题
      tableAreaName: '',
      excelTitle: '', //报表标题
      initAreaTableName: '', //存储初始行政区名称
      //弹框是否隐藏
      dialogFormVisible: false,
      selectYear: '', //选择年份
      selectMonth: '', //选择月份
      isShowYear: false,
      isShowMonth: false,
      yearList: ["TEMPLATE_SHEET_THIRTY", "TEMPLATE_SHEET_CUSTOMEXCEL_6", "TEMPLATE_SHEET_THIRTYSEVEN"], //选择年的报表
      monthList: ["TEMPLATE_SHEET_REGIONS_FIRE"], //选择月的报表
      selectedTemplateType: 'jq', //选择的报表类型
      templateTypeList: [{
        text: '警情',
        value: 'jq'
      }, {
        text: '出动',
        value: 'cd'
      }, {
        text: '火灾',
        value: 'hz'
      }],
      templateOptionList: [],
      isValid: true //是否有效
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
          break;
      }
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
          .catch(res => {
          });
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
    // 切换报表模板时重置报表范围
    toggleTemplate () {
      const selectedTemplateObj = this.templateOption.filter(o => o.code === this.selectedTemplate)[0];
      this.subdivisionParams.parentId = selectedTemplateObj.rptId;
      // this.clearArea();
      this.selectedAreaName = '';
      this.selectedProvId = '';
      this.selectedCityId = '';
      this.$refs.areaSelect.clear();
      this.subdivisionParams.type = 0;
      this.selectedOrgNames = undefined;
      this.selectedOrgIds = undefined;
      this.tableAreaName = this.initAreaTableName;
      this.lvl2Id = '';
      this.lvl3Id = '';
      this.lvl4Id = '';
      this.lvl5Id = '';
      // this.clearOrg();
      this.getSubdivision();
      this.isShowYear = this.yearList.includes(selectedTemplateObj.code);
      this.isShowMonth = this.monthList.includes(selectedTemplateObj.code);
      // this.changeDateType();
      // this.getReportSelection();
    },
    changeDateType () {
      this.dateRange = [];
      if (this.isShowYear) {
        let firstDay = new Date(this.selectYear);
        firstDay.setMonth(0);
        firstDay.setDate(1);
        let lastDay = new Date(this.selectYear);
        lastDay.setMonth(11);
        lastDay.setDate(31);
        this.dateRange.push(formatterDate(firstDay, "YYYYMMDD"));
        this.dateRange.push(formatterDate(lastDay, "YYYYMMDD"));
      } else if (this.isShowMonth) {
        let firstDay = new Date(this.selectMonth);
        firstDay.setMonth(0);
        firstDay.setDate(1);
        let lastDay = new Date(this.selectMonth);
        lastDay.setMonth(lastDay.getMonth() + 1);
        lastDay.setDate(0);
        this.dateRange.push(formatterDate(firstDay, "YYYYMMDD"));
        this.dateRange.push(formatterDate(lastDay, "YYYYMMDD"));
      } else {
        // 初始化时间范围
        const start = getNearlyRecentDays(30)[0].substr(0, 10);
        const end = getNearlyRecentDays(30)[1].substr(0, 10);
        this.dateRange.push(formatterDate(start, "YYYYMMDD"));
        this.dateRange.push(formatterDate(end, "YYYYMMDD"));
        this.selectYear = new Date();
        this.selectMonth = new Date();
        this.selectDate = 2;
      }
    },
    subdivisionChange (val) {
      this.clearArea();
      this.selectedAreaName = '';
      this.selectedProvId = '';
      this.selectedCountyId = '';
      this.selectedCityId = '';
      this.$refs.areaSelect.clear();
      this.subdivisionParams.type = 0;
      this.selectedOrgNames = undefined;
      this.selectedOrgIds = undefined;
      this.tableAreaName = this.initAreaTableName;
      this.lvl2Id = '';
      this.lvl3Id = '';
      this.lvl4Id = '';
      this.lvl5Id = '';
      this.getReportSelection();
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
        if (this.selectedSubdivision == item.code) {
          this.states = item.rptType;
        }
      })
    },
    // 获取报表范围
    getSubdivision () {
      this.selectedSubdivision = '';
      getReportTemplateLv2(this.subdivisionParams).then(response => {
        if (response.code === 200) {
          // response.data.forEach((item, index) => {
          //   //删除 rptId == 1300 | 1400 的账号
          //   if (item.rptId == '1701') {
          //     response.data.splice(index, 1);
          //   }
          // })
          this.subdivisionOption = response.data || [];
          if (response.data.length == 1) {
            this.states = response.data[0].rptType;
          } else {
            this.states = 0;
          }
        } else {
          this.$message.error(response.msg);
        }
      });
    },
    // 打开行政区域的模态框
    openAreaSelect () {
      this.$refs.areaSelect.toggle();
    },
    // 设置所选地区
    setSelectedArea (obj, { first, second, third, last }) {
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
      // this.getSubdivision();
      this.selectedAreaName = `${first} ${second} ${third} ${last}`;
      if (first == second) {
        this.tableAreaName = `${first}${third}${last}`;
      } else {
        this.tableAreaName = `${first}${second}${third}${last}`;
      }
    },
    // 清空所选地区
    clearArea () {
      this.selectedAreaName = '';
      this.selectedProvId = '';
      this.selectedCityId = '';
      this.$refs.areaSelect.clear();
      this.subdivisionParams.type = 0;
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
      this.$refs.orgSelect.clear();
    },
    // 报表查询
    getReport () {
      this.loading = true;
      const params = {
        reportTemplete: this.selectedTemplate,
        beginTime: this.dateRange[0].replace(/-/g, ''),
        endTime: this.dateRange[1].replace(/-/g, ''),
        queryType: 0,  // 起火场所简默认值
        excelTitle: this.excelTitle,
        filter_status: '',
        only_report: '1' // 默认报表查询
      };
      if (this.isValid) {
        params.filter_status = '0';
      }
      if (this.selectedSubdivision) {
        params.queryType = this.selectedSubdivision;
      }
      if (this.selectedProvId) {
        params.proviceId = this.selectedProvId;
        // 起火场所简表单独处理
        if (this.selectedTemplate === 'TEMPLATE_TYPE_FIVE') {
          params.queryType = 1
        }
      }
      if (this.selectedCityId) {
        params.cityId = this.selectedCityId;
        // 起火场所简表单独处理
        if (this.selectedTemplate === 'TEMPLATE_TYPE_FIVE') {
          params.queryType = 2
        }
      }
      if (this.selectedCountyId) {
        params.countyId = this.selectedCountyId;
        // 起火场所简表单独处理
        if (this.selectedTemplate === 'TEMPLATE_TYPE_FIVE') {
          params.queryType = 3
        }
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
      getFireReport(params).then(response => {
        this.$refs.message.innerHTML = "";
        this.loading = false;
        if (response.code === 200) {
          if (response.data.stream == "生成报表出错") {
            this.$message.warning(`暂未查询到报表数据，请修改报表生成条件，重新生成`);
          } else if (response.data.stream) {
            const workbook = XLSX.read(response.data.stream, { type: 'base64' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            // this.$nextTick(()=>{
              this.$refs.message.innerHTML = XLSX.utils.sheet_to_html(worksheet);
            // })
            // this.$refs.message.innerHTML = XLSX.utils.sheet_to_html(worksheet);
            this.jsonTest = response.data.stream;
            // 每次成功查询后保存该次查询条件作为下载参数
            this.downloadParams = params;
            this.anniuShow = '1';
          }
          if (response.data.stream == null) {
            for (let item of this.subdivisionOption) {
              if (item.code == this.selectedSubdivision) {

                this.$message.warning(`${item.rptRequired.includes('队') ? '消防队伍' : '行政区域'}应为 “XX${item.rptRequired},请检查！！！”`);
                return;
              }
            }
          }


        } else {
          this.$message.error("查询失败");
        }
      });
    },
    // 下载报表
    downloadReport () {
      if (!this.downloadParams.reportTemplete) {
        this.$message.warning("请先进行查询");
        return;
      }
      const decodedData = atob(this.jsonTest);
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
      this.isValid = true;
      // this.clearOrg();
      this.states = '0';
      this.selectedOrgNames = undefined;
      this.selectedOrgIds = undefined;
      this.selectedStatus = '';
      this.$refs.message.innerHTML = "";
      this.jsonTest = '';
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
    getReportNew () {
      if (!this.selectedTemplate) {
        this.$message({ message: '请选择报表名称', type: 'error' });
        return;
      }
      if (this.subdivisionOption.some(o => o.code)) {
        if (!this.selectedSubdivision) {
          this.$message({ message: '请选择报表范围', type: 'error' });
          return;
        }
      }
      if (this.states != '0') {
        if (this.states == '1') {
          if (this.selectedTemplate != 'TEMPLATE_TYPE_FIVE' || !this.isBJ) {   // 起火场所简表单独处理
            if (this.selectedAreaName == "") {
              this.$message({ message: '请选择行政区域', type: 'error' });
              return;
            }
          }
        } else {
          if (this.selectedOrgIds == '' || this.selectedOrgIds == undefined) {
            this.$message({ message: '请选择消防队伍', type: 'error' });
            return;
          }
        }
      }
      this.dialogFormVisible = true;
      this.templateSelectName = this.templateOption.filter(o => o.code === this.selectedTemplate)[0].rptName || '';
      this.selectedSubName = this.subdivisionOption.filter(o => o.code === this.selectedSubdivision)[0].rptName || '';
      if (this.selectedSubName.indexOf(this.templateSelectName) > -1) {
        this.excelTitle = this.tableAreaName + this.selectedSubName + '(' + this.dateRange[0] + '-' + this.dateRange[1] + ')';
      } else {
        this.excelTitle = this.tableAreaName + this.templateSelectName + `(${this.selectedSubName})` + '(' + this.dateRange[0] + '-' + this.dateRange[1] + ')';
      }
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
    },
    toggleTemplateType () {
      let templateOptionList = this.templateOption.filter(ele => {
        return ele.rptSource == this.selectedTemplateType;
      })
      this.templateOptionList = templateOptionList;
      this.resetFilter();
      if (this.selectedTemplateType == 'jq') {
        this.statusOption = [];
        this.statusOption = [{
          value: '1',
          label: '已派发'
        }, {
          value: "4",
          label: "被驳回",
        }, {
          value: "99",
          label: "已归档",
        }];

      } else {
        this.statusOption = [];
        this.statusOption = [{
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
        }];
      }
    }
  },
  async created () {
    this.isLyao = this.$store.state.user.name;
    this.isBJ = this.$store.state.user.deptId === 1000000000;
    this.getFireUnitt();
    //      this.getLastTime();
    //获取用户账号

    let deptLevel = 0;
    // 获取用户所属组织层级
    const res1 = await getInfo();
    if (res1.code === 200) {
      deptLevel = res1.user.dept.deptLevel;
      this.deptId = res1.user.dept.deptId;
      this.unitName = res1.user.dept.deptName;
      this.subdivisionParams.deptLevel = deptLevel;
      if (this.deptId === 1000000000) {
        this.tableAreaName = '全国';
        this.initAreaTableName = '全国';
      }
    } else {
      this.$message.error(res1.msg);
    }
    // 获取可选报表大类
    const res2 = await getReportTemplateLv1({ deptLevel });
    if (res2.code === 200) {
      //判断时候是部局 test@xf 账号
      if (this.isLyao === "test@xf") {
        res2.data.forEach((item, index) => {
          //删除 rptId == 1300 | 1400 的账号
          if (item.rptId == '1300') {
            res2.data.splice(index, 2);
          }
        })
        res2.data.forEach((item, index) => {
          //删除 rptId == 1300 | 1400 的账号
          if (item.rptId == '1200') {
            res2.data.splice(index, 1);
          }
        })
      }

      this.templateOption = res2.data || [];
      this.toggleTemplateType();
    } else {
      this.$message.error(res2.msg);
    }
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
    // 初始化时间范围
    const start = getNearlyRecentDays(30)[0].substr(0, 10);
    const end = getNearlyRecentDays(30)[1].substr(0, 10);
    this.dateRange.push(formatterDate(start, "YYYYMMDD"));
    this.dateRange.push(formatterDate(end, "YYYYMMDD"));
    this.selectYear = new Date();
    this.selectMonth = new Date();
  }
};
</script>

<style lang="stylus" scoped>
.app-container {
  // background-color #F4F6F8
  // padding 10px
  // min-height calc(100vh - 84px)
  .page_zone {
    // background rgba(255, 255, 255, 1)
    // border-radius 3px
    // border 1px solid rgba(218, 226, 237, 1)
    // padding 0px 22px 15px 22px
    font-size: 14px;
    font-weight: 400;
    color: rgba(55, 57, 76, 1);

    .title {
      font-size: 18px;
      font-weight: 400;
      display: flex;
      height: 60px;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(218, 226, 237, 1);
      margin: 0 0 18px 0;

      img {
        width: 26px;
        margin-right: 15px;
      }

      div {
        flex: 1;
        text-align: left;
      }
    }

    .content {
      .search {
        h4 {
          font-size: 16px;
        }

        .row {
          display: flex;
          justify-content: space-between;

          .btn_orange, .btn_back {
            padding: 0 30px;
          }

          .el-form-item {
            flex: 1;
            margin-right: 20px;
            width: 30%;

            .el-select, .el-input, .el-range-editor, .el-cascader {
              width: 100%;
            }
          }

          .hidden {
            visibility: hidden;
          }
        }
      }
    }
  }

  .pic {
    position: relative;
    padding-left: 18px;
  }

  .pic img {
    width: 14px;
    height: 14px;
    position: absolute;
    left: 0px;
    top: 4px;
  }

  .pagination_zone {
    margin-top: 20px;
    text-align: right;
  }

  .none {
    cursor: not-allowed;
  }
  .table-d{
    min-height:200px;
    // background: red
  }
}
</style>
