<style lang="stylus" scoped>
  .app-container
    // background-color #F4F6F8
    // padding 10px
    // min-height calc(100vh - 84px)
    .page_zone
      // background rgba(255, 255, 255, 1)
      // border-radius 3px
      // border 1px solid rgba(218, 226, 237, 1)
      // padding 0px 22px 15px 22px
      font-size 14px
      font-weight 400
      color rgba(55, 57, 76, 1)
      .title
        font-size 18px
        font-weight 400
        display flex
        height 60px
        align-items center
        justify-content space-between
        border-bottom 1px solid rgba(218, 226, 237, 1)
        margin 0 0 18px 0
        img
          width 26px
          margin-right 15px
        div
          flex 1
          text-align left
      .content
        .search
          h4
            font-size 16px
          .row
            display flex
            justify-content space-between
            .btn_orange, .btn_back
              padding 0 30px
            .el-form-item
              flex 1
              margin-right 20px
              width 30%
              .el-select, .el-input, .el-range-editor, .el-cascader
                width 85%
            .hidden
              visibility hidden
    .pic
      position relative
      padding-left 18px
    .pic img
      width 14px
      height 14px
      position absolute
      left 0px
      top 4px
    .pagination_zone
      margin-top 20px
      text-align right
    .none
      cursor not-allowed
</style>
<style lang="scss">
  .table-d {
    width: 97%;
    min-height: 200px;
    overflow: auto;
    margin: 10px auto 0;
    p {
      margin: 0;
      table {
        border-collapse: collapse;
        margin: 0 auto;
        text-align: center;
        tr:nth-child(2) {
          text-align: right;
        }
        th {
          word-break: keep-all;
          white-space:nowrap;
        }
        td {
          padding: 7px 12px;
          border: solid 1px #c6c6c6;
          word-break: keep-all;
          white-space: nowrap;
        }
      }
    }
  }
  .synchronize-timestamp {
    display: inline-block;
    margin: 0 15px 0 0;
    font-size: 13px;
    span {
      color: #e1374c;
    }
  }
</style>

<template>
  <div class="app-container">
    <div class="page_zone">
      <div class="title">
        <img src="../image/icon-tjbb.png"  />
        <div>{{ $route.meta.title }}</div>
      </div>
      <div  class="content">
        <div class="search">
          <el-form :inline="true" label-width="100px">
            <el-form-item label="报表类型">
              <el-select v-model="selectItemType" placeholder="请选择" @change="reportTypeChange">
                <el-option v-for="a in typeList" :key="a.id" :label="a.name" :value="a.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="报表名称" v-if="selectItemType=='2'">
              <el-select v-model="selectedTemplateCustom" filterable  placeholder="请选择" @change="toggleCustomTemplate()">
                
                <el-option v-for="o in templateOptionCustom" :key="o.tempId" :label="o.tempName" :value="o.tempId"/>
                <div class="text-center">
                  <!--
                  <el-pagination
                    v-show="total>0"
                    small
                    layout="prev, pager, next"
                    :current-page="listParams.pageNum"
                    :page-size="listParams.pageSize"
                    :total="total"
                    @current-change="handleCurrentChange"
                  >
                  </el-pagination>
                  -->
                </div>
                
              </el-select>
              
            </el-form-item>

            <el-form-item label="报表名称" v-else>
              <el-select v-model="selectedTemplate" @change="toggleTemplate()" placeholder="请选择">
                <el-option v-for="o in templateOption" :key="o.rptId" :label="o.rptName" :value="o.code"/>
              </el-select>
            </el-form-item>
            <el-form-item label="选择年份" v-if="isShowYear">
              <el-date-picker v-model="selectYear" type="year" :clearable="false" style="width: 100%"  @change="changeDateType" >></el-date-picker>
            </el-form-item>
            <el-form-item label="选择年月" v-else-if="isShowMonth">
              <el-date-picker v-model="selectMonth" type="month" :clearable="false" style="width: 100%"  @change="changeDateType" >></el-date-picker>
            </el-form-item>
            <el-form-item label="报表范围">
              <el-select v-model="selectedSubdivision" placeholder="请选择" :disabled="selectItemType=='2'">
                <el-option v-for="o in subdivisionOption" :key="o.rptId" :label="o.rptName" :value="o.code"/>
              </el-select>
            </el-form-item>
            <el-form-item style="margin-left: 10px;">
              <el-button type="primary" size="mini" @click="makeSureTitle()">生成</el-button>
              <el-button type="primary" size="mini" @click="downloadReport()">导出</el-button>
            </el-form-item>
            <el-form-item label="是否有效">
              <el-checkbox v-model="isValid">不查失效单位和地区</el-checkbox>
            </el-form-item>
            <!-- <el-form-item style="float: right; margin-right: 50px;">
              <p class="synchronize-timestamp">数据统计时间截止至&nbsp;<span>{{synchronizationTime || '-'}}</span></p>
              <el-button type="primary" icon="el-icon-refresh" size="mini" @click="dataSynchronize()">数据同步</el-button>
            </el-form-item> -->
          </el-form>
        </div>
        <div>
        </div>
        <div class="table-d" v-loading="loading">
          <p ref="message"> </p>
        </div>
      </div>
      <!--名称修改框-->
      <el-dialog title="生成报表的名称" :visible.sync="dialogFormVisible" width="300px">
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
  </div>
</template>

<script>
  import {listDept, getDept, treeselect, delDept, addDept, updateDept} from "@/api/system/dept";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import { getUserProfile } from "@/api/system/user";
  import provModal from '@/views/data/entry/jqxx/components/provModal';
  import mulModal from '@/views/data/entry/jqxx/components/mulModal';
  import XLSX from 'xlsx';
  import { getInfo } from '@/api/login';
  import { formatterDate } from "@/utils/index";
  import {getReportTemplateLv1, getReportTemplateLv2, getFireReport, synchronizeData, getSynchronizeDataTime, getLastEtlTime,getCustomReportTemplateList,getReportInfos,getCombinationAreaName} from '@/api/report/report';
  export default {
    components: {provModal, mulModal},
    prop:["rptSource"],
    data() {
      return {
        isLyao:'',
        // this.$route.query.id

        areaId: '',
        areaLevel:'',
        rptSource:'',
        deptId: '',
        synchronizationTime:'',
        dateRange:[],
        loading: false,
        queryParams: {},
        // 可选报表模板
        templateOption: [],
        templateOptionCustom:[],
        // 已选报表模板
        selectedTemplate: '',
        selectedTemplateCustom:'',
        subdivisionParams: {
          deptLevel: 0,
          parentId: null,
          type: 0,
          rptSource:'',
        },
        // 可选细分类型
        subdivisionOption: [],
        // 已选细分类型
        selectedSubdivision: '',
        selectedSubdivisions:'',
        // 下载参数
        downloadParams: {},
        //已选报表类型
        selectItemType:'1',
        //可选报表类型
        typeList:[
          {
            id:1,
            name:"固定报表",
            value:'1'
          },
          {
            id:2,
            name:"自定义报表",
            value:'2'
          }
        ],
        
        listParams:{
          tempName:'',
          flag:'2',
          pageNum:1,
          pageSize:10,
          isFilter:1
        },
        
        total: 0,
        jsonBs64:'',
        templeteCode:null,
        //自定义查询参数
        customQueryParams:'',
        isCustomize:false,
        excelTitle:'',
        dialogFormVisible:false,
        tableAreaName:'',
        belongType:0,
        unitName: '', //单位名称
        selectedSubName:'', // 细分名称
        selectYear:'', //选择年份
        selectMonth:'', //选择月份
        isShowYear:false,
        isShowMonth:false,
        yearList:[2400,3000], //选择年的报表
        monthList:[4000], //选择月的报表
        initParamJjsjFrom:'',//初始接警开始时间
        initParamJjsjTo:'', //初始接警结束时间
        initParamZqsjFrom:'',//初始起火开始时间
        initParamZqsjTo:'', //初始起火结束时间
        isValid:true //是否有效
      };
    },
    methods: {
      //选择年月初始化
      changeDateType(){
        if(this.isShowYear){
          let firstDay = new Date(this.selectYear);
          firstDay.setMonth(0);
          firstDay.setDate(1);
          let lastDay = new Date(this.selectYear);
          lastDay.setMonth(11);
          lastDay.setDate(31);
          this.queryParams.paramJjsjFrom = formatterDate(firstDay,"YYYYMMDD");
          this.queryParams.paramJjsjTo = formatterDate(lastDay,"YYYYMMDD");
          if(this.rptSource == 'hz'){
            this.queryParams.paramZqsjFrom = formatterDate(firstDay,"YYYYMMDD");
            this.queryParams.paramZqsjTo = formatterDate(lastDay,"YYYYMMDD");
          }
        }else if(this.isShowMonth){
          let firstDay = new Date(this.selectMonth);
          firstDay.setMonth(0);
          firstDay.setDate(1);
          let lastDay = new Date(this.selectMonth);
          lastDay.setMonth(lastDay.getMonth() + 1);
          lastDay.setDate(0);
          this.queryParams.paramJjsjFrom = formatterDate(firstDay,"YYYYMMDD");
          this.queryParams.paramJjsjTo = formatterDate(lastDay,"YYYYMMDD");
          if(this.rptSource == 'hz'){
            this.queryParams.paramZqsjFrom = formatterDate(firstDay,"YYYYMMDD");
            this.queryParams.paramZqsjTo = formatterDate(lastDay,"YYYYMMDD");
          }
        }else {
          // 初始化时间范围
          this.queryParams.paramJjsjFrom = this.initParamJjsjFrom;
          this.queryParams.paramJjsjTo = this.initParamJjsjTo;
          if(this.rptSource == 'hz'){
            this.queryParams.paramZqsjFrom = this.initParamZqsjFrom;
            this.queryParams.paramZqsjTo = this.initParamZqsjTo;
          }
          this.selectYear = new Date();
          this.selectMonth = new Date();
        }
      },
      // 切换报表模板时联动切换细分类型
      toggleTemplate() {
        const selectedTemplateObj = this.templateOption.filter(o => o.code === this.selectedTemplate)[0];
        this.subdivisionParams.parentId = selectedTemplateObj.rptId;
        this.isShowYear = this.yearList.includes(selectedTemplateObj.rptId);
        this.isShowMonth = this.monthList.includes(selectedTemplateObj.rptId);
        this.changeDateType();
        this.getSubdivision();
      },
      // 获取报表范围
      getSubdivision() {
        this.selectedSubdivision = '';
        this.selectedSubdivisions = "";
        getReportTemplateLv2(this.subdivisionParams).then(response => {
          if (response.code === 200) {
            // response.data.forEach((item, index) => {
            //   //删除 rptId == 1300 | 1400 的账号
            //   if (item.rptId == '1701') {
            //     response.data.splice(index, 1);
            //   }
            // })
            this.subdivisionOption = response.data || [];
            if(response.data.length == 1){
              this.selectedSubdivisions = response.data[0].rptId ;
            }else{this.selectedSubdivision = "";}
          } else {
            this.$message.error(response.msg);
          }
        });
      },
      //确认报表标题
      makeSureTitle(){
        if(this.selectItemType == '1'){
          if (!this.selectedTemplate) {
            this.$message({ message: '请选择报表名称',  type: 'error' });
            return;
          }
          if(this.isShowYear){
            if(!this.selectYear){
              this.$message({ message: '请选择年份',  type: 'error' });
              return;
            }
          }else if(this.isShowMonth){
            if(!this.selectMonth){
              this.$message({ message: '请选择年月',  type: 'error' });
              return;
            }
          }
          if (this.subdivisionOption.some(o => o.code)) {
            if (!this.selectedSubdivision) {
              this.$message({ message: '请选择报表范围',  type: 'error' });
              return;
            }
          }
          this.templateSelectName = this.templateOption.filter(o => o.code === this.selectedTemplate)[0].rptName;
          this.selectedSubName = this.subdivisionOption.filter(o => o.code === this.selectedSubdivision)[0].rptName;
//          this.excelTitle = `${this.unitName}(${this.selectedSubName})${this.templateSelectName}`;
          if(this.selectedSubName.indexOf(this.templateSelectName) > -1){
            this.excelTitle = this.tableAreaName + this.selectedSubName;
          }else{
            this.excelTitle = this.tableAreaName  + this.templateSelectName + `(${this.selectedSubName})`;
          }
          this.dialogFormVisible = true;

        }else{
          //自定义模版
          if (!this.selectedTemplateCustom) {
            this.$message({ message: '请选择报表名称',  type: 'error' });
            return;
          }
          this.dialogFormVisible = true;
        }
        this.isCustomize = this.$route.query.isCustomize;
      },
      // 执行报表查询
      getReport() {
        if(this.selectItemType == '1'){
          if (!this.selectedTemplate) {
            this.$message({ message: '请选择报表名称',  type: 'error' });
            return;
          }
          if (this.subdivisionOption.some(o => o.code)) {
            if (!this.selectedSubdivision) {
              this.$message({ message: '请选择报表范围',  type: 'error' });
              return;
            }
          }
          this.loading = true;
          const params = {
            reportTemplete: this.selectedTemplate,
            // beginTime: this.queryParams.paramJjsjFrom.replace(/-/g, '').substr(0,8),
            // endTime: this.queryParams.paramJjsjTo.replace(/-/g, '').substr(0,8),
            queryType: 0,
            excelTitle: this.excelTitle,
            filter_status: ''
          };
          if(this.isValid){
            params.filter_status = '0';
          }
          switch (this.subdivisionParams.deptLevel) {
            case 2:
              params.lvl2Id = this.deptId;
              break;
            case 3:
              params.lvl3Id = this.deptId;
              break;
            case 4:
              params.lvl4Id = this.deptId;
              break;
            case 5:
              params.lvl5Id = this.deptId;
              break;
          }
          // 通过用户信息表里的 areaLevel 来判断区域信息
          if(this.areaLevel == 2){
            params.proviceId = this.areaId;
          }else if(this.areaLevel == 3){
            params.cityId = this.areaId;
          }else if(this.areaLevel == 4){
            params.countyId = this.areaId;
          }
          if(!this.isCustomize){
            if(this.queryParams.paramJjsjFrom || this.queryParams.paramJjsjTo){
              params.beginTime = this.queryParams.paramJjsjFrom.replace(/-/g, '').substr(0,8);
              params.endTime = this.queryParams.paramJjsjTo.replace(/-/g, '').substr(0,8);
            }else if(this.queryParams.paramZqsjFrom && this.queryParams.paramZqsjTo){
                params.beginTime = this.queryParams.paramZqsjFrom.replace(/-/g, '').substr(0,8);
                params.endTime = this.queryParams.paramZqsjTo.replace(/-/g, '').substr(0,8);
            }
          }
          if(this.queryParams.xzqydmSj && !this.isCustomize){
            if (this.queryParams.xzqydmSj.toString().includes("00000000") ) {
              // 起火场所简表单独处理
              if (this.selectedTemplate === 'TEMPLATE_TYPE_FIVE') {
                params.queryType = 1
              }
            }else if(this.queryParams.xzqydmSj.toString().includes("000000")){
              // 起火场所简表单独处理
              if (this.selectedTemplate === 'TEMPLATE_TYPE_FIVE') {
                params.queryType = 2
              }
            }else if(this.queryParams.xzqydmSj.toString().includes("0000")){
              if (this.selectedTemplate === 'TEMPLATE_TYPE_FIVE') {
                params.queryType = 3
              }
            }
          }
          if(this.isCustomize && this.customQueryParams){
            if(this.customQueryParams.tableSql){
              params.extCondition = this.customQueryParams.tableSql;
            }
            if(this.customQueryParams.beginTime){
              params.beginTime = this.customQueryParams.beginTime.replace(/-/g, '').substr(0,8);
              params.endTime = this.customQueryParams.endTime.replace(/-/g, '').substr(0,8);
            }
            if(this.customQueryParams.bgzt){
              let statusSession = this.customQueryParams.bgzt.split(",");
              params.statusCd = statusSession;
            }
          }
          if (this.selectedSubdivision) {
            params.queryType = this.selectedSubdivision;
          }
          if(this.queryParams.shzts){
            params.statusCd = this.queryParams.shzts.split(",");
          }
          //遍历之前先清空 total pageNum pageSize
          this.queryParams.total = "";
          this.queryParams.pageNum = "";
          this.queryParams.pageSize = "";
          if(!this.isCustomize){
            for (const k in this.queryParams) {
              if (this.queryParams[k] && (typeof this.queryParams[k] === 'number' || typeof this.queryParams[k] === 'string')) {
                params[k] = this.queryParams[k];
              }
            }
          }
          getFireReport(params).then(response => {
            this.loading =false;
            if (response.code === 200) {
              if (response.data.stream == "生成报表出错") {
                this.$message.warning(`暂未查询到报表数据，请修改报表生成条件，重新生成`);
              }else if (response.data.stream) {
                const workbook = XLSX.read(response.data.stream, { type: 'base64' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                this.$refs.message.innerHTML = XLSX.utils.sheet_to_html(worksheet);
                // 每次成功查询后保存该次查询条件作为下载参数
                this.downloadParams = params;
                this.jsonBs64 = response.data.stream;
              } else {
                this.$message.warning("暂无数据或筛选条件与报表类型不匹配！");
                // this.$message.warning("暂无数据");
              }
              if (response.data.stream == null){
                for(let item of this.subdivisionOption){
                  if (item.code == this.selectedSubdivision) {

                    this.$message.warning(`${item.rptRequired.includes('队')?'消防队伍' :'行政区域'}应为 “XX${item.rptRequired},请检查！！！”`);
                    return;
                  }
                }
              }
            } else {
              this.$message.error("抱歉，该报表未能成功生成，稍后重试或联系管理员");
            }
          });
        }else {
          //自定义模版
          if (!this.selectedTemplateCustom) {
            this.$message({ message: '请选择报表名称',  type: 'error' });
            return;
          }
          this.dialogFormVisible = true;
        }

      },
      getReportNew(){
        //自定义模版
        if (!this.selectedTemplateCustom) {
          this.$message({ message: '请选择报表名称',  type: 'error' });
          return;
        }

        this.loading = true;
        this.templeteCode = this.templateOptionCustom.filter(o => o.tempId === this.selectedTemplateCustom)[0].tempCode;
        const params = {
          templeteCode : this.templeteCode,
          excelTitle : this.excelTitle,
          filter_status : ''
        };
        if(this.isValid){
          params.filter_status = '0';
        }
        if(Object.keys(this.queryParams).length > 0){
          if(!this.isCustomize){
            if(this.queryParams.paramJjsjFrom || this.queryParams.paramJjsjTo){
              params.beginTime = this.queryParams.paramJjsjFrom.replace(/-/g, '').substr(0,8);
                params.endTime = this.queryParams.paramJjsjTo.replace(/-/g, '').substr(0,8);
            }else {
                params.beginTime = this.queryParams.paramZqsjFrom.replace(/-/g, '').substr(0,8);
                params.endTime = this.queryParams.paramZqsjTo.replace(/-/g, '').substr(0,8);
            }
            if(this.queryParams.shzts){
              params.statusCd = this.queryParams.shzts.split(",");
            }
          }
        }
        switch (this.subdivisionParams.deptLevel) {
          case 2:
            params.lvl2Id = this.deptId;
            break;
          case 3:
            params.lvl3Id = this.deptId;
            break;
          case 4:
            params.lvl4Id = this.deptId;
            break;
          case 5:
            params.lvl5Id = this.deptId;
            break
        }
        // 通过用户信息表里的 areaLevel 来判断区域信息
        if(this.areaLevel == 2){
          params.proviceId = this.areaId;
        }else if(this.areaLevel == 3){
          params.cityId = this.areaId;
        }else if(this.areaLevel == 4){
          params.countyId = this.areaId;
        }
        if(this.isCustomize && this.customQueryParams){
          if(this.customQueryParams.tableSql){
            params.extCondition = this.customQueryParams.tableSql;
          }
          if(this.customQueryParams.beginTime){
            params.beginTime = this.customQueryParams.beginTime.replace(/-/g, '').substr(0,8);
            params.endTime = this.customQueryParams.endTime.replace(/-/g, '').substr(0,8);
          }
          if(this.customQueryParams.bgzt){
            let statusSession = this.customQueryParams.bgzt.split(",");
            params.statusCd = statusSession;
          }
        }
        //遍历之前先清空 total pageNum pageSize
        this.queryParams.total = "";
        this.queryParams.pageNum = "";
        this.queryParams.pageSize = "";
        if(!this.isCustomize){
          for (const k in this.queryParams) {
            if (this.queryParams[k] && (typeof this.queryParams[k] === 'number' || typeof this.queryParams[k] === 'string')) {
              params[k] = this.queryParams[k];
            }
          }
        }
        getReportInfos(params).then(response => {
          this.loading =false;
          if (response.code === 200) {
            if (response.data.stream == "生成报表出错") {
              this.$message.warning(`暂未查询到报表数据，请修改报表生成条件，重新生成`);
            }else if (response.data.stream) {
              const workbook = XLSX.read(response.data.stream, { type: 'base64' });
              const firstSheetName = workbook.SheetNames[0];
              const worksheet = workbook.Sheets[firstSheetName];
              this.$refs.message.innerHTML = XLSX.utils.sheet_to_html(worksheet);
              // 每次成功查询后保存该次查询条件作为下载参数
              this.downloadParams = params;
              this.jsonBs64 = response.data.stream;
            } else {
              this.$message.warning("暂无数据或筛选条件与报表类型不匹配！");
              // this.$message.warning("暂无数据");
            }
          } else {
            this.$message.warning(`抱歉，该报表未能成功生成，稍后重试或联系管理员`);
          }
        }).catch(e => {
          this.loading = false;
        });
      },
      // 下载
      downloadReport() {
        if(this.selectItemType == '1'){
          if (!this.downloadParams.reportTemplete) {
            this.$message.warning("请先进行查询");
            return;
          }
        }else {
          if (!this.downloadParams.templeteCode) {
            this.$message.warning("请先进行查询");
            return;
          }
        }
        //时间戳
        let timestamp=new Date().getTime();
        //解码 base-64 编码的字符串
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
          window.navigator.msSaveOrOpenBlob(blob.getBlob(), this.excelTitle + timestamp + '.xlsx');
        } else {
          // 其他浏览器
          const dataFile = new File([u8arr], '文件名', {type: 'xlsx'});
          const trigger = document.createElement('a');
          trigger.href = window.URL.createObjectURL(dataFile);
          trigger.download = trigger.download = this.excelTitle + timestamp + '.xlsx';
          trigger.click();
        }
      },
      // 同步数据
      async dataSynchronize() {
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
      getLastTime(){
        getLastEtlTime().then(res =>{
          if(res.code == 200) this.synchronizationTime = res.data.cdtime || '';
        })
      },
      //切换模版类型
      reportTypeChange(){
        if(this.selectItemType == '2'){
          this.selectedSubdivision = ''
        }
        this.$refs.message.innerHTML = '';
        this.selectedSubdivision = undefined;
        this.isShowYear = false;
        this.isShowMonth = false;
        this.changeDateType();
      },
      getList() {
        this.loading = true;
        getCustomReportTemplateList(this.listParams).then(response => {
          this.loading = false;
          if (response.code === 200) {
            this.templateOptionCustom = response.data.resultList;
            this.total = response.data.totalNum;
          } else {
            this.$message.error(response.msg);
          }
        }).catch(e => {
          this.loading = false;
        });
      },
      handleCurrentChange(val){
        this.listParams.pageNum = val;
        this.getList();
      },
      editCustomName(){
        if(this.selectItemType == '2'){
          this.getReportNew();
          this.dialogFormVisible = false;
        }else {
          this.getReport();
          this.dialogFormVisible = false;
        }
      },
      toggleCustomTemplate(){
        this.templateSelectName = this.templateOptionCustom.filter(o => o.tempId === this.selectedTemplateCustom)[0].tempName;
        this.excelTitle = this.tableAreaName + this.templateSelectName;
        if(this.queryParams.paramJjsjFrom && this.queryParams.paramJjsjTo){
          this.excelTitle = this.tableAreaName + this.templateSelectName+ '(' + this.queryParams.paramJjsjFrom.replace(/-/g, '').substr(0,8) + '-' + this.queryParams.paramJjsjTo.replace(/-/g, '').substr(0,8) + ')';
        }
        if(this.isCustomize && this.customQueryParams){
          if(this.customQueryParams.beginTime){
            this.excelTitle = this.tableAreaName + this.templateSelectName + '(' + this.customQueryParams.beginTime.replace(/-/g, '').substr(0,8) + '-' + this.customQueryParams.endTime.replace(/-/g, '').substr(0,8) + ')';
          }
        }
      }
    },
    async created() {
      this.areaId = this.$store.state.user.areaId;
      this.areaLevel = this.$store.state.user.areaLevel;
      this.rptSource = this.subdivisionParams.rptSource = this.$route.query.rptSource;
      this.isCustomize = this.$route.query.isCustomize;
      this.isLyao = this.$store.state.user.name;
      // this.getLastTime();
      // 数据查询带过来的参数
      this.queryParams = JSON.parse(sessionStorage.getItem('dataSearch_to_dataReport_params')) || {};
      this.initParamJjsjFrom = this.queryParams.paramJjsjFrom;
      this.initParamJjsjTo = this.queryParams.paramJjsjTo;
      console.log(JSON.stringify(this.queryParams));
      //自定义查询带过来的参数
      this.customQueryParams = JSON.parse(sessionStorage.getItem('customSearch_to_dataReport_params')) || {};
      console.log(this.customQueryParams );
      switch (this.rptSource){
        case 'jq':
          this.belongType = 1;
          break;
        case 'cd':
          this.belongType = 2;
          if(this.$route.query.isCzrysw){
            this.queryParams.isCzrysw = 1;
          }
          break;
        case 'hz':
          this.belongType = 3;
          this.initParamZqsjFrom = this.queryParams.paramZqsjFrom;
          this.initParamZqsjTo = this.queryParams.paramZqsjTo;
          if(this.$route.query.sfyrsw){
            this.queryParams.sfyrsw = 1;
          }
          break;
      }
      // if(this.isCustomize){
      //   this.typeList = [
      //     {
      //       id:2,
      //       name:"自定义报表",
      //       value:'2'
      //     }
      //   ];
      //   this.selectItemType = "2";
      // }
      // 获取用户所属组织层级
      let deptLevel = 0;
      const res1 = await getInfo();
      if (res1.code === 200) {
        this.deptId = res1.user.deptId;
        this.unitName = res1.user.dept.deptName;
        deptLevel = res1.user.dept.deptLevel;
        this.subdivisionParams.deptLevel = deptLevel;
      } else {
        this.$message.error(res1.msg);
      }
      // 获取可选报表大类
      const res2 = await getReportTemplateLv1({deptLevel,rptSource:this.rptSource});
      if (res2.code === 200) {
        //判断时候是部局 test@xf 账号
        if (this.isLyao === "test@xf") {
          res2.data.forEach((item, index) => {
            //删除 rptId == 1300 | 1400 的账号
            if (item.rptId == '1300') {
              res2.data.splice(index, 2);
            }
          });
          res2.data.forEach((item, index) => {
            //删除 rptId == 1300 | 1400 的账号
            if (item.rptId == '1200') {
              res2.data.splice(index, 1);
            }
          })
        }

        this.templateOption = res2.data || [];
      } else {
        this.$message.error(res2.msg);
      }
      this.listParams.belongType = this.belongType;
      this.listParams.deptLevel = deptLevel;
      //获取自定义报表列表
      await getCustomReportTemplateList(this.listParams).then(response =>{
        this.loading = false;
        if(response.code === 200){
          this.templateOptionCustom = response.data.resultList;
          this.total = response.data.totalNum;
        }else {
          this.$message.error("列表查询失败");
        }
      }).catch(e => {
        this.loading = false;
      }); //捕获异常;;
      //获取地区名称
      let areaParmas = {
        areaId : res1.area.areaId
      };
      await getCombinationAreaName(areaParmas).then(response =>{
        if(response.code === 200){
          if(response.data && response.data.subName){
            this.tableAreaName = response.data.subName;
          }
        }else {
          this.$message.error(response.msg);
        }
      });

      // 处理之前用户所选地区
      let selectedAreaInfo = this.queryParams.selectedAreaInfo || {};
      if (selectedAreaInfo.type != undefined) {
        this.subdivisionParams.type = selectedAreaInfo.type > 2 ? 2 : selectedAreaInfo.type;
      } else {
        this.subdivisionParams.type = 0;
      }
      // 初始化时间范围
      const end = new Date();
      const start = new Date(end.getTime() - 365 * 24 * 60 * 60 * 1000);
      const startY = start.getFullYear();
      const startM = (start.getMonth() + 1).toString().padStart(2, '0');
      const startD = start.getDate().toString().padStart(2, '0');
      this.dateRange.push(startY + startM + startD);
      const endY = end.getFullYear();
      const endM = (end.getMonth() + 1).toString().padStart(2, '0');
      const endD = end.getDate().toString().padStart(2, '0');
      this.dateRange.push(endY + endM + endD);
    }
  };
</script>
