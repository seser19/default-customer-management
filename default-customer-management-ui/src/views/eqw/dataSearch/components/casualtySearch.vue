<template lang="pug">
  .policeSentimentSearch
    .police_information
      h2(class="title") 警情信息
        span.hide(@click="showSelect(1)") {{policeHide?'收起':'展开'}}
          i(:class="policeHide?'el-icon-arrow-down':'el-icon-arrow-right'")
      el-row
        el-col(:span="8")
          span.text 警情编码
          el-input(v-model="formData.jqbh" placeholder="请输入" clearable)
        el-col(:span="16")
          span.text 接警起止时间
          .divIncludeTime
            el-date-picker(v-model="formData.paramJjsjFrom"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
              @change="paramJjsjTimeChange"
            placeholder="接警起始时间"
            default-time="['00:00:00']"
              :clearable="true")
            span.connect -
            el-date-picker(v-model="formData.paramJjsjTo"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
              @change="paramJjsjTimeChange"
            placeholder="接警结束时间"
            default-time="['23:59:59']"
              :clearable="true")

        el-col(:span="8")
          span.text 行政区域
          el-input(v-model="xzqyName" placeholder="请选择" readonly @focus="openProvModal()")
            i(slot="suffix" class="iconfont icon-icon-test" @click="openProvModal()" style="line-height:32px;")
          input(v-model="formData.xzqydmSj" type="hidden")

        el-col(:span="8")
          span.text 警情地址
          el-input(v-model="formData.jqfsdd" placeholder="请输入" clearable)
        el-col(:span="8")
          span.text 警情类型
          el-cascader(
          ref="cascader"
            :props="props"
          v-model="formData.sjlbdm"
          placeholder="请选择"
            @change="jqlxChange"
          clearable)
      el-row(v-show="policeHide")
        el-col(:span="8")
          span.text 发送单位
          el-input(v-model="formData.sender" placeholder="请输入" readonly)
            i(slot="suffix" class="iconfont icon-icon-test" style="line-height:32px;"  @click="openSenderMulModal")
            i(slot="suffix" class="el-icon-circle-close" style="line-height:30px; cursor: pointer;" @click="cleanSenderMulValue"  v-show="formData.sender")
        el-col(:span="8")
          span.text 119案件编号
          el-input(v-model="formData.caseNbr" placeholder="请输入" clearable)
        el-col(:span="8")
          span.text 出动队伍
          el-input(v-model="xfdwdmName" placeholder="请选择" readonly)
            i(slot="suffix" class="iconfont icon-icon-test" @click="openMulModal()" style="line-height:32px;")
            i(slot="suffix" class="el-icon-circle-close" style="line-height:30px; cursor: pointer;" @click="cleanMulModal"  v-show="xfdwdmName")
        el-col(:span="8")
          span.text 责任区大队
          el-input(v-model="zrqdddmName" placeholder="请选择" readonly)
            i(slot="suffix" class="iconfont icon-icon-test" @click="openDutyMulModal()" style="line-height:32px;")
            i(slot="suffix" class="el-icon-circle-close" style="line-height:30px; cursor: pointer;" @click="cleanDutyMulModal"  v-show="zrqdddmName")
        el-col(:span="8")
          span.text 主战队伍
          el-input(v-model="zzdwName" placeholder="请选择" readonly)
            i(slot="suffix" class="iconfont icon-icon-test" @click="openZzMulModal()" style="line-height:32px;")
            i(slot="suffix" class="el-icon-circle-close" style="line-height:30px; cursor: pointer;" @click="cleanZzMulModal"  v-show="zzdwName")
    .casualty_information
      h2(class="title") 伤亡信息
        span.hide(@click="showSelect(2)") {{casualtyHide?'收起':'展开'}}
          i(:class="casualtyHide?'el-icon-arrow-down':'el-icon-arrow-right'")
      el-row
        el-col(:span="8")
          span.text 人员伤亡情况
          el-select(v-model="formData.swfl" placeholder="请选择" clearable)
            el-option(label="死亡" value="0")
            el-option(label="轻伤" value="1")
            el-option(label="重伤" value="2")
        el-col(:span="8")
          span.text 人员姓名
          el-input(v-model="formData.xm" placeholder="请输入" clearable)
        el-col(:span="8")
          span.text 人员性别
          el-select(v-model="formData.xb" placeholder="请选择" clearable)
            el-option( v-for="(item, index) in casualtyOptionsList.sys_user_sex"
              :key="index"
                :label="item.dictLabel"
                :value="item.dictValue")
      el-row(v-show="casualtyHide")
        el-col(:span="8")
          span.text 身份证号
          el-input(v-model="formData.sfzhm" placeholder="请输入")
        el-col(:span="8")
          span.text 人员年龄范围
          .divInclude
            el-input(v-model="formData.nlFrom" placeholder="请输入")
            span.connect -
            el-input(v-model="formData.nlTo" placeholder="请输入")
        el-col(:span="8")
          span.text 职业
          el-select(v-model="formData.zydm" placeholder="请选择" clearable)
            el-option( v-for="(item, index) in casualtyOptionsList.tb_dic_ryzy"
              :key="index"
                :label="item.dictLabel"
                :value="item.dictValue")
        el-col(:span="8")
          span.text 健康状况
          el-select(v-model="formData.jkzkdm" placeholder="请选择" clearable)
            el-option( v-for="(item, index) in casualtyOptionsList.tb_dic_ryjkzk"
              :key="index"
                :label="item.dictLabel"
                :value="item.dictValue")
        el-col(:span="8")
          span.text 致死伤原因
          el-select(v-model="formData.swyydm" placeholder="请选择" clearable)
            el-option( v-for="(item, index) in casualtyOptionsList.tb_dic_swyy"
              :key="index"
                :label="item.dictLabel"
                :value="item.dictValue")
        el-col(:span="8")
          span.text 来源
          el-select(v-model="formData.rklydm" placeholder="请选择" clearable)
            el-option( v-for="(item, index) in casualtyOptionsList.tb_dic_ryly"
              :key="index"
                :label="item.dictLabel"
                :value="item.dictValue")
        el-col(:span="8")
          span.text 受教育程度
          el-select(v-model="formData.sjycddm" placeholder="请选择" clearable)
            el-option( v-for="(item, index) in casualtyOptionsList.tb_dic_rysjycd"
              :key="index"
                :label="item.dictLabel"
                :value="item.dictValue")
    el-row
      el-col(:span="14")
        el-button(type="primary" @click="searchBtn") 查&nbsp;询
        el-button(@click="resetBtn") 重&nbsp;置
        el-button(type="primary" @click="toReport") 生成报表
        el-button(v-if="showDownBtn" @click="searchBtn(this, true)") 下载表格

      el-col(:span="10")
        .synchronizeTime(v-if="deptLevel != '1'" style="text-align:right;")
          span 数据统计时间截止至&nbsp;
            span(style="color:red; margin-right:5px;") {{synchronizationTime || '-'}}
            el-button(v-if="deptLevel == '2'" class="btn_orange" @click.prevent="dataSynchronize()" :loading="btnLoading") 数据同步
    .list-box(v-loading="listLoading")
      .query-resule
        p.resule-title 查询结果：
        .resule-box 共查询到 #[span {{resultData.jqxx || 0 }}] 起火灾调查报告，死亡 #[span {{resultData.swrs || 0 }}] 人，受伤 #[span {{resultData.ssrs || 0 }}] 人，直接财产损失 #[span {{resultData.ccss || 0 }}] 元，过火面积 #[span {{resultData.ghmj || 0 }}] 平方米。
      el-table(:data="tableData" style="width: 100%")
        //- el-table-column(type="index" label="序号" width="50")
        el-table-column(prop="zqbh" label="火灾编号" sortable width="130" show-overflow-tooltip)
        el-table-column(prop="zqsj" label="起火时间" sortable width="130" )
        el-table-column(prop="xzqy" label="行政区域" width="150")
        el-table-column(prop="zqdd" label="警情地址" width="250")
          template(slot-scope="scope")
            el-tooltip(v-show="scope.row.zqdd.length>15" class="item" effect="dark" :content="scope.row.zqdd" placement="top-start")
              div {{(scope.row.zqdd.substring(0,15))}}...
            el-tooltip(v-show="scope.row.zqdd.length<=15" class="item" effect="dark" :content="scope.row.zqdd" placement="top-start")
              div {{(scope.row.zqdd.substring(0,15))}}
        el-table-column(prop="qwhz" label="轻微火灾" width="75")
          template(slot-scope="scope") {{scope.row.qwhz==0?'否':'是'}}
        el-table-column(prop="qhcsms" label="起火场所")
          template(slot-scope="scope") {{scope.row.qhcsms || '-'}}
        el-table-column(prop="hzyyms" label="起火原因" show-overflow-tooltip)
          template(slot-scope="scope") {{scope.row.hzyyms || '-'}}
        el-table-column(label="伤亡情况")
          template(slot-scope="scope") {{scope.row.swrs+'死'+scope.row.ssrs+'伤'}}
        el-table-column(prop="deptname" label="责任区大队" show-overflow-tooltip)
          template(slot-scope="scope") {{scope.row.deptname || '-'}}
        el-table-column(prop="shzt" label="报告状态")
          template(slot-scope="scope")
            .pic(v-if="scope.row.shzt == 0")
              img(src="../../../icons/weisongshen.svg")
              span 未送审
            .pic(v-if="scope.row.shzt == 1")
              img(src="../../../icons/shenpizhong.svg")
              span 审核中
            .pic(v-if="scope.row.shzt == 2")
              img(src="../../../icons/yishenpi.svg")
              span 已审核
            .pic(v-if="scope.row.shzt == 3")
              img(src="../../../icons/guaqi.svg")
              span 被挂起
            .pic(v-if="scope.row.shzt == -1")
              img(src="../../../icons/beizhongzhi.svg")
              span 待修改
            .pic(v-if="scope.row.shzt == -2")
              img(src="../../../icons/tuihui.svg")
              span 被退回
            .pic(v-if="scope.row.shzt == -3")
              img(src="../../../icons/daiwanshan.svg")
              span 待完善
        el-table-column(label="操作" width="50")
          template(slot-scope="scope")
            el-button(type="text" @click="toDetailClick(scope.row)") 查看
      .pagination_zone(v-show="tableData.length>0")
        pagination(:total="formData.total" :page.sync="formData.pageNum" :limit.sync="formData.pageSize" @pagination="getList")

    //- 行政区域
    provModal(ref="provModal" @setProv="setProvValue")
      //- <!-- 出动队伍名称 -->
    cdMulModal(ref="mulModal" @setMulVal="setMulValue")
    mulModal(ref="zzMulModal" @setMulVal="setZzMulVal")
    dutyModal(ref="dutyModal" @setMulVal="setDutyMulValue")
    // 发送单位多选
    sender-mul-modal(ref="senderMulModal" @setMulVal="setSenderMulValue")
</template>
<script>
  import axios from "axios";
  import {getJqcdlb} from "@/api/data/entry/jqxx";
  import dataSearch from "@/api/data/eqw/dataSearch.js";
  import {downloadFile} from "@/utils/download-file.js";
  import {getNearlyRecentDays} from "@/utils/dateTimeUtils.js";
  import {casualty, casualtyOptionsList} from "./option.js";
  import {synchronizeData, getSynchronizeDataTime, getLastEtlTime} from '@/api/report/report';
  import provModal from "@/views/eqw/customSearch/components/multiProvModal";
  import senderMulModal from '@/views/components/dataSeach/senderMulModal.vue';
  // 出动队伍
  import cdMulModal from "@/views/components/dataSeach/cdMulModal";
  // 责任区大队
  import dutyModal from "@/views/components/dataSeach/dutyModal";
  // 主战
  import mulModal from "@/views/components/dataSeach/mulModal";

  export default {
    name: "CasualtySearch",
    components: {
      provModal,
      senderMulModal,
      mulModal,
      cdMulModal,
      dutyModal
    },
    data() {
      return {
        listLoading: false,
        synchronizationTime: '',
        deptLevel: '',
        /* 查询信息显示隐藏 */
        policeHide: true, // 警情信息筛选展示隐藏
        casualtyHide: true, // 伤亡信息筛选展示隐藏
        props: {
          multiple: true,
          lazy: true,
          lazyLoad: this.lazyLoad,
          children: "children",
          label: "dictLabel",
          value: "dictValue",
          isLeaf: "isLeaf",
          // 是否返回由该节点所在的各级菜单的值所组成的数组
          emitPath: false,
          checkStrictly: true
        },
        //
        //
        xfdwdmId: [],
        xfdwdmName: '',// 出动队伍
        zrqdddmId: [],
        zrqdddmName: '',// 责任区大队
        zzdwId: [],
        zzdwName: '',   // 主战队伍
        xzqyName: "", // 行政区域显示名称
        // 提交查询信息
        formData: {
          sfyrsw: 1,
          /** ************** 警情信息字段 */
          jqbh: "", // 警情编码
          Jjsj: [],
          paramJjsjFrom: "", // 接警起止时间（请求参数 接警时间）
          paramJjsjTo: "", // 接警起止时间（请求参数 接警时间）
          xzqyName: "",
          xzqydmSj: "", // 行政区域（所属行政区）
          jqfsdd: "", // 警情地址（事件地点）
          sjlbdm: "", // 警情类型（出警类别）
          duty: "",
          jqtbzh: "", // 发送单位
          sender: '', // 发送单位名称
          caseNbr: '',
          xfdwdm: '',   // 出动队伍
          zrqdddm: '',   // 责任区大队
          zzdw: '',       // 主战队伍
          /** ************** 伤亡信息字段 */
          swfl: "", // 人员伤亡情况
          xm: "", // 姓名
          xb: "", // 性别
          sfzhm: "", // 身份证号
          nlFrom: "", // 年龄起始
          nlTo: "", // 年龄结束
          zydm: "", // 职业代码
          jkzkdm: "", // 健康状况代码
          swyydm: "", // 受伤或死亡原因代码
          rklydm: "", // 人口来源代码
          sjycddm: "", // 受教育程度代码
          /** ************** 分页数据 */
          total: 0,
          pageNum: 1,
          pageSize: 20
        },
        selectedAreaInfo: {},
        casualtyOptionsList,
        resultData: {},
        tableData: [],
        showDownBtn: false,
        btnLoading: false
      };
    },
    created() {
      //this.getLastTime();
      this.getOptionList();
      this.deptLevel = this.$store.state.user.deptLevel;
      // this.formData.Jjsj = getNearlyRecentDays(30);
      // this.formData.paramJjsjFrom = getNearlyRecentDays(30)[0]; // 接警起止时间
      // this.formData.paramJjsjTo = getNearlyRecentDays(30)[1]; // 接警截止时间
    },
    methods: {
      /** 出动队伍*/
      //打开多选框 并 回显
      openMulModal(type) {
        this.$refs.mulModal.echo(this.xfdwdmId);
        this.$refs.mulModal.toggle();
      },
      //将多选框的值赋给input
      setMulValue(arr) {
        let nameArr = [],
          idArr = [];
        arr.forEach(item => {
          nameArr.push(item.deptName);
          idArr.push(item.deptId);
        });
        this.xfdwdmId = idArr;
        this.formData.xfdwdm = idArr.join(",");
        this.xfdwdmName = nameArr.join(",");
      },
      // 清空出动队伍
      cleanMulModal() {
        this.xfdwdmId = [];
        this.formData.xfdwdm = "";
        this.xfdwdmName = ""
      },
      /** 主战队伍 */
      // openCdMulModa
      openZzMulModal(type) {
        this.$refs.zzMulModal.echo(this.zzdwId);
        this.$refs.zzMulModal.toggle();
      },
      //将多选框的值赋给input
      setZzMulVal(arr) {
        let nameArr = [],
          idArr = [];
        arr.forEach(item => {
          nameArr.push(item.deptName);
          idArr.push(item.deptId);
        });
        this.zzdwId = idArr;
        this.formData.zzdw = idArr.join(",");
        this.zzdwName = nameArr.join(",");
      },
      // 清空主战队伍
      cleanZzMulModal() {
        this.zzdwId = [];
        this.formData.zzdw = "";
        this.zzdwName = ""
      },
      /** 责任区队伍 */
      openDutyMulModal() {
        this.$refs.dutyModal.toggle();
      },
      setDutyMulValue(arr) {
        let nameArr = [],
          idArr = [];
        arr.forEach(item => {
          nameArr.push(item.deptName);
          idArr.push(item.deptId);
        });
        this.zrqdddmId = idArr;
        this.formData.zrqdddm = idArr.join(",");
        this.zrqdddmName = nameArr.join(",");
      },
      // 清空责任区队伍
      cleanDutyMulModal() {
        this.zrqdddmId = [];
        this.formData.zrqdddm = "";
        this.zrqdddmName = ""
      },


      // 同步数据
      async dataSynchronize() {
        this.btnLoading = true;
        const res1 = await synchronizeData().finally(() => {
          this.btnLoading = false;
        });
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
      getLastTime() {
        getLastEtlTime().then(res => {
          if (res.code == 200) this.synchronizationTime = res.data.cdtime || '';
        })
      },

      // 查询
      searchBtn(event, download = false) {
        // 查询之前隐藏筛选条件
        this.policeHide = this.casualtyHide = false;
        this.formData.total = 0;
        this.formData.pageNum = 1;
        this.formData.pageSize = 20;

        if (download) {
          this.downloadData();
          return;
        } else {
          this.showDownBtn = false;
        }

        this.getData();
      },
      resetBtn() {
        this.zzdwId = [];
        this.zzdwName = '';  // 主战队伍
        this.zrqdddmId = [];
        this.zrqdddmName = '';// 责任区大队
        this.xfdwdmId = [];
        this.xfdwdmName = '';// 出动队伍
        this.formData = {
          sfyrsw: 1,
          /** ************** 警情信息字段 */
          jqbh: "", // 警情编码
          Jjsj: [],
          paramJjsjFrom: "", // 接警起止时间（请求参数 接警时间）
          paramJjsjTo: "", // 接警起止时间（请求参数 接警时间）
          xzqyName: "",
          xzqydmSj: "", // 行政区域（所属行政区）
          jqfsdd: "", // 警情地址（事件地点）
          sjlbdm: "", // 警情类型（出警类别）
          duty: "",
          jqtbzh: "", // 发送单位
          sender: '', // 发送单位名称
          caseNbr: '',
          xfdwdm: '',   // 出动队伍
          zrqdddm: '',   // 责任区大队
          zzdw: '',       // 主战队伍
          /** ************** 伤亡信息字段 */
          swfl: "", // 人员伤亡情况
          xm: "", // 姓名
          xb: "", // 性别
          sfzhm: "", // 身份证号
          nlFrom: "", // 年龄起始
          nlTo: "", // 年龄结束
          zydm: "", // 职业代码
          jkzkdm: "", // 健康状况代码
          swyydm: "", // 受伤或死亡原因代码
          rklydm: "", // 人口来源代码
          sjycddm: "", // 受教育程度代码
          /** ************** 分页数据 */
          total: 0,
          pageNum: 1,
          pageSize: 20
        };
        this.resultData = {};
        this.tableData = [];
        // 重置数据值之后展开筛选条件
        this.policeHide = this.casualtyHide = true;
      },
      /**
       * 分页
       * @param
       * param{page: 2, limit: 20}
       * page 当前页数
       * limit 每页多少条数据
       */
      getList(param) {
        const {page: pageNum, limit: pageSize} = param;
        this.getData();
      },
      //数据下载
      downloadData() {
        let excelTitle = '人员伤亡查询-';
        this.listLoading = true;
        dataSearch.queryRyswDataDownload(this.formData)
          .then(response => {
            if (response.code == 200) {
              downloadFile(excelTitle, response.data.stream);
            }
          })
          .finally(() => {
            this.listLoading = false;
          });
      },
      /**
       * 查询条件展开显示
       * @params val
       * val==1 警情信息 val==2 伤亡信息
       */
      showSelect(val) {
        val === 1
          ? (this.policeHide = !this.policeHide)
          : (this.casualtyHide = !this.casualtyHide);
      },
      // 接警起止时间修改分别传参
      // paramJjsjChange(val) {
      //   if (val == null) {
      //     this.formData.paramJjsjFrom = ''
      //     this.formData.paramJjsjTo = ''
      //     return
      //   }
      //   this.formData.paramJjsjFrom = val[0]
      //   this.formData.paramJjsjTe = val[1]
      // },
      paramJjsjTimeChange(val) {
        let nowChangeGettime = new Date(val).getTime();
        if (this.formData.paramJjsjFrom && this.formData.paramJjsjTo) {
          let paramJjsjFromGettime = new Date(this.formData.paramJjsjFrom).getTime();
          let paramJjsjToGettime = new Date(this.formData.paramJjsjTo).getTime();
          if (paramJjsjFromGettime > paramJjsjToGettime) {
            this.$message.warning("接警开始时间不能大于接警结束时间");
            if (nowChangeGettime == paramJjsjFromGettime) {
              //如果当前选的是开始时间，开始时间恢复到初始时间
              this.formData.paramJjsjFrom = "";
              // this.formData.paramJjsjFrom = getNearlyRecentDays(30)[0]; // 接警起止时间
            } else if (nowChangeGettime == paramJjsjToGettime) {
              //如果当前选的是结束时间，结束时间恢复到初始时间
              this.formData.paramJjsjTo = "";
              // this.formData.paramJjsjTo = getNearlyRecentDays(30)[1]; // 接警截止时间
            }
          }
        }
      },

      // 打开行政区域的模态框
      openProvModal() {
        this.$refs.provModal.toggle();
      },
      setProvValue(area, fullPaths) {
        var areaId = [];
        area.forEach(item => {
          areaId.push(item.areaId)
        });
        this.formData.xzqydmSj = areaId.join(',');
        this.selectedAreaInfo = area;
        this.xzqyName = fullPaths;
      },
      // 报表按钮
      toReport() {
        //if (this.formData.paramJjsjTo == "" || this.formData.paramJjsjFrom == "") {
        //	this.$message.warning("请选择接警时间！！！");
        //	return;
        //}
        const params = this.formData;
        params.selectedAreaInfo = this.selectedAreaInfo;
        sessionStorage.setItem('dataSearch_to_dataReport_params', JSON.stringify(params));
        this.$router.push({path: '/eqw/dataReport', query: {rptSource: 'hz'}});
      },
      jqlxChange(val) {
        let node = this.$refs['cascader'].getCheckedNodes();
        this.checkNodeLabel = [];
        let checkVals = [];
        node.forEach(item => {
          let label = '';
          this.getLabel(item,label);
          checkVals.push(item.value);
        });
        this.formData.sjlbdm = checkVals.join(',');
        // console.log(this.sjlbdm);
        // console.log(this.$refs['cascader'].getCheckedNodes()[0]);
      },
      getLabel(node,label) {
        if(node.parent != null || (node.parent == null && node.level == 1)) {
          if(label == '') {
            label = node.label
          } else {
            label = node.label + '/' + label
          }
          if(node.parent != null){
            this.getLabel(node.parent,label);
            return
          }
        }
        this.checkNodeLabel = label
      },
      // 打开发送单位选择
      openSenderMulModal() {
        this.$refs.senderMulModal.toggle();
      },
      // 选中发送单位
      setSenderMulValue(data) {
        const senderMulLabel = [];
        const senderMulValue = [];
        data.map(d => {
          senderMulLabel.push(d.deptName);
          senderMulValue.push(d.deptId);
        });
        this.formData.jqtbzh = senderMulValue.join(','); // 查询入参
        this.formData.sender = senderMulLabel.join('，'); // 展示名称
      },
      // 清除已选的发送单位
      cleanSenderMulValue() {
        this.formData.jqtbzh = '';
        this.formData.sender = '';
      },
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
      // 设置叶子节点
      handle(arr) {
        // console.log(arr);
        arr.forEach(item => {
          if (item.isLast === "1") {
            item["leaf"] = true;
          }
        });
        return arr;
      },

      // 获取下拉列表数据
      getOptionList() {
        casualty.forEach(item => {
          this.getDicts(item).then(res => {
            if (res.code == 200) {
              this.casualtyOptionsList[item] = res.data;
            }
          });
        });
      },
      // 获取查询数据
      getData() {
        //if (this.formData.paramJjsjTo == "" || this.formData.paramJjsjFrom == "") {
        //	this.$message.warning("请选择接警时间！！！");
        //	return;
        //}
        this.listLoading = true;
        axios
          .all([
            dataSearch.queryRyswData(this.formData),
            dataSearch.queryZqxxDataCommon(this.formData)
          ])
          .then(
            axios.spread((res1, res2) => {
              if (res1.code == 200) {
                this.formData.total = res1.total;
                this.tableData = res1.rows;
                this.listLoading = false;
              }
              if (res2.code == 200) {
                this.resultData = res2.data[0];
                this.listLoading = false;
              }
            })
          )
          .finally(() => {
            this.listLoading = false;
            this.showDownBtn = true;
          });
      },
      toDetailClick(data) {
        this.$router.push({
          path: "/showDetail/jqxxShowDetail",
          query: {
            jqbh: data.jqbh
          }
        });
      }
    }
  };
</script>
<style lang="scss" scoped>
  .policeSentimentSearch {
    .el-row {
      .el-col {
        margin: 5px 0px;
        .divInclude, .divIncludeTime {
          width: 50%;
          height: 32px;
          position: relative;
          display: inline-block;
          .el-input {
            width: 46%;
          }
          .connect {
            width: 8%;
            text-align: center;
            display: inline-block;
          }
        }
        .divIncludeTime {
          width: 75%;
        }
      }
    }
    .text {
      display: inline-block;
      line-height: 32px;
      width: 160px;
    }
    .el-input,
    .el-select,
    .el-cascader {
      width: 50%;
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
    .list-box {
      margin-top: 15px;
      .query-resule {
        margin-bottom: 10px;
        p {
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 5px;
          color: rgba(67, 127, 223, 1);
        }
        .resule-box {
          font-size: 12px;
          color: #777777;
          span {
            color: #f77006;
          }
        }
      }
    }
    .police_information,
    .casualty_information {
      padding-bottom: 10px;
      margin-bottom: 10px;
      border-bottom: 1px dashed #dfdfdf;
      .title {
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        padding-left: 10px;
        margin-bottom: 10px;
        position: relative;
        border-left: 2px solid #437fdf;
        .hide {
          right: 0px;
          cursor: pointer;
          color: #437fdf;
          position: absolute;
        }
      }
    }
  }
</style>
