<template>
  <div class="app-container">
    <div class="page_zone" v-loading="loading">
      <div class="reporting-title">
        <h2>{{ $route.meta.title }}</h2>
      </div>
      <div class="content">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="160px"
          label-position="top"
        >
          <el-row :gutter="60">
            <el-col :span="24">
              <el-form-item label="警情名称">
                <div class="police_name">{{ruleForm.jqmc || '接警日期 + 城市 + 区县 + 单位名称 + 警情类型'}}</div>
                <input type="hidden" v-model="ruleForm.jqmc"/>
              </el-form-item>
            </el-col>

            <!-- <el-col :xs="24" :sm="12" :lg="8" :span="8">
              <el-form-item label="是否出动" prop="isYdwcd">
                <el-radio-group v-model="ruleForm.isYdwcd">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>-->
          </el-row>

          <el-row :gutter="60">
            <el-col :xs="24" :sm="12" :lg="8" :span="8">
              <el-form-item label="接警时间" prop="jjsj">
                <el-date-picker
                  disabled
                  type="datetime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="年月日时分"
                  v-model="ruleForm.jjsj"
                  :picker-options="pickerOptions"
                  @change="timeOnchage"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="8" :span="8">
              <el-form-item label="119案件编号" prop="caseNbr">
                <el-input disabled v-model="ruleForm.caseNbr" placeholder="请输入119案件编号" clearable/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="60">
            <!-- <el-col :xs="24" :sm="12" :lg="8" :span="8">
              <el-form-item label="接警时间" prop="jjsj">
                <el-date-picker
                  type="datetime"
                  format="yyyy-MM-dd HH:mm"
                  value-format="yyyy-MM-dd HH:mm"
                  placeholder="年月日时分"
                  v-model="ruleForm.jjsj"
                  :picker-options="pickerOptions"
                ></el-date-picker>
              </el-form-item>
            </el-col>-->

            <el-col :xs="24" :sm="12" :lg="8" :span="8" style="height: 76px;">
              <el-form-item label="警情类型" prop="sjlbdm">
                <el-cascader
                  disabled
                  @change="cascaderChange('sjlbdm')"
                  ref="cascader"
                  :props="props"
                  v-model="ruleForm.sjlbdm"
                  placeholder="请选择"
                ></el-cascader>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :lg="8" :span="8" v-if="isText || ruleForm.qtsjlbsm!=''">
              <el-form-item label="其他说明" prop="qtsjlbsm">
                <el-input disabled v-model="ruleForm.qtsjlbsm" placeholder="请输入说明"/>
              </el-form-item>
            </el-col>

            <!-- 火灾扑救可以选择五个等级；抢险救援可以选择四个等级；其他情况默认等级为1，值为 "1"，不显示下拉选择框 -->
            <el-col
              :xs="24"
              :sm="12"
              :lg="8"
              :span="8"
              v-if="ruleForm.sjlbdm === '010000000000' || ruleForm.sjlbdm.substr(0,3) === '020'"
            >
              <el-form-item label="警情等级" prop="jqdj">
                <el-select disabled v-model="ruleForm.jqdj" placeholder="请选择" @change="setShowValue('jqdj')">
                  <el-option
                    v-for="item in options.jqdj"
                    :key="item.dictCode"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                    v-if="!(ruleForm.sjlbdm.substr(0,3) === '020' && item.dictCode === 1251)"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="60" v-if="ruleForm.sjlbdm==='010000000000'">
            <el-col :xs="24" :sm="12" :lg="8" :span="8" style="height: 76px;">
              <el-form-item label="起火场所类型">
                <el-select disabled v-model="Options.qhcsType" placeholder="请选择" clearable>
                  <el-option
                    v-for="item in Options.qhcslb"
                    :key="item.dictValue"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" v-if="Options.qhcsType" :sm="12" :lg="8" :span="8" style="height: 76px;">
              <el-form-item label="起火场所">
                <el-input disabled :value="Options.qhcs.name"
                          @focus="$refs.qhcsSelect.toggle()"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <fire-space-mul ref="qhcsSelect" :qhcsType="Options.qhcsType" @setMulVals="setQhcs"/>
          <el-row :gutter="60" v-if="ruleForm.isYdwcd == '1'">
            <el-col :xs="24" :sm="12" :lg="8" :span="8">
              <el-form-item label="出动队伍" prop="setOff">
                <el-input
                  v-model="showValue.setOff"
                  placeholder="请选择"
                  :readonly="true"
                  ref="mulInput"
                  clearable
                  @focus="openMulModal"
                >
                  <!-- TODO: 注释看不懂的逻辑先 -->
                  <!-- v-if="!(ruleForm.setOff.length !== 0 && (ruleForm.sjlbdm =='010000000000'||(ruleForm.sjlbdm >='020000000000' && ruleForm.sjlbdm <'030000000000')))" -->
                  <i slot="suffix" class="iconfont icon-icon-test" @click="openMulModal"></i>
                </el-input>
                <input type="hidden" v-model="ruleForm.setOff"/>
              </el-form-item>
            </el-col>

            <!-- 需求变更：所有的警情类型都有 主战和增援 2020.1.4 sxc
               v-if="ruleForm.sjlbdm === '010000000000' || ruleForm.sjlbdm.substr(0,3) === '020'"
            -->
            <el-col :xs="24" :sm="12" :lg="8" :span="8" v-if="ruleForm.setOff.length !== 0&&this.$route.query.hasmain">
              <el-form-item label="主战中队">
                <el-radio-group v-model="zzxfd">
                  <el-radio
                    v-for="(item,index) in ruleForm.setOff"
                    :label="item"
                    :key="item"
                  >{{ showValue.setOff.split(',')[index] }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :lg="8" :span="8" v-if="ruleForm.setOff.length !== 0&&this.$route.query.hasmain">
              <el-form-item label="首到中队">
                <el-radio-group v-model="sdxfd">
                  <el-radio
                    v-for="(item,index) in ruleForm.setOff"
                    :label="item"
                    :key="item"
                  >{{ showValue.setOff.split(',')[index] }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="60">


<!--            <el-col :xs="24" :sm="12" :lg="8" :span="8" v-if="ruleForm.sfzrqzz == 'N'">-->
<!--              <el-form-item label="主战队站" prop="mainTeam">-->
<!--                <el-input-->
<!--                  v-model="showValue.mainTeamName"-->
<!--                  placeholder="请选择"-->
<!--                  :readonly="true"-->
<!--                >-->
<!--                  <i slot="suffix" class="iconfont icon-icon-test" @click="openMulMainTermModal"></i>-->
<!--                </el-input>-->
<!--                <input type="hidden" v-model="ruleForm.mainTeam"/>-->
<!--              </el-form-item>-->
<!--            </el-col>-->

              <el-col :xs="24" :sm="12" :lg="12" :span="12">
                <el-form-item label="增援总队（外省）" prop="zyzd">
                  <el-input
                    disabled
                    :value="adminTeam"
                    placeholder="请选择"
                    :readonly="true"
                    @focus="openAdminSelet"
                  >
                  </el-input>
                </el-form-item>
              </el-col>

            <el-col :xs="24" :sm="12" :lg="8" :span="8">
              <el-form-item label="行政区域" prop="xzqydmSj">
                <el-input
                  disabled
                  v-model="showValue.provName"
                  placeholder="请选择"
                  :readonly="true"
                  ref="provInput"
                  @focus="openProvModal()"
                >
                </el-input>
                <input type="hidden" name v-model="ruleForm.xzqydmSj"/>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :lg="8" :span="8">
              <el-form-item label="警情地址" prop="jqfsdd">
                <el-input  disabled v-model="ruleForm.jqfsdd" placeholder="请填写"></el-input>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :lg="8" :span="8">
              <el-form-item label="单位名称/户主名" prop="dwmcHzm">
                <el-input disabled v-model="ruleForm.dwmcHzm" placeholder="没有请填写无"></el-input>
              </el-form-item>
            </el-col>
            <!-- 只有【警情类型】选择的是 火灾扑救，才会有这个选择框 -->
            <el-col :xs="24" :sm="12" :lg="8" :span="8" v-if="ruleForm.sjlbdm === '010000000000'">
              <el-form-item label="责任区大队" prop="zrqdddm">
                <el-input
                  disabled
                  v-model="showValue.duty"
                  placeholder="请选择"
                  :readonly="true"
                  ref="dutyInput"
                >
                </el-input>
                <input type="hidden" v-model="ruleForm.zrqdddm"/>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="备注">
                <el-input
                  disabled
                  type="textarea"
                  v-model="ruleForm.bz"
                  maxlength="300"
                  show-word-limit
                  resize="none"
                  style="width:100%"
                  :autosize="{ minRows: 3, maxRows: 3 }"
                  placeholder="请填写备注信息"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="submit-button">
          <el-button type="primary" size="medium" @click="confirm">发 送</el-button>
        </div>
      </div>

      <!-- 模态框 -->
      <!-- 责任区大队 -->
      <modal ref="modal" @setVal="setDutyValue"></modal>

      <!-- 主战战队 -->
      <mainTeamModal ref="mainTeamModal" :depth="1" @setVal="setMainTeamValue"></mainTeamModal>

      <!-- 出动队伍名称 -->
      <mulModal ref="mulModal" @setMulVal="setMulValue"></mulModal>

      <!-- 行政区域 -->
      <provModal ref="provModal" @setProv="setProvValue"></provModal>

      <!-- 确认信息 -->
      <confirm ref="confirmModal" @onSubmit="onSubmit" :data="ruleForm" :labels="showValue"></confirm>
      <!-- 总队选择 -->
      <select-admin @setAdminTeam="setAdminTeam" ref="selectAdmin"/>
    </div>

  </div>
</template>

<script>
import { init } from '@/api/data/entry/jqsjxz'

let id = 0;
import { getOptions, getJqcdlb, jqxxUpdateInfo, jqxxKqyUpdateInfo, jqxxKyqAdd } from '@/api/data/entry/jqxx'
// 责任区大队
import modal from "./components/modal";
// 出动队伍
import mulModal from "./components/mulModal";
// 主战战队
import mainTeamModal from "./components/dataSeach";
// 地区选择
import provModal from "./components/provModal";
// 确认信息
import confirm from "./components/confirm";
import { getCslx } from '@/api/data/entry/hzdj'
//场所类别
import FireSpaceMul from './components/qhcs'
import moment from 'moment'
import selectAdmin from './components/selectAdmin'


export default {
  name: "alarmentry",
  components: {modal, mulModal, mainTeamModal, provModal, confirm,FireSpaceMul,selectAdmin},
  computed:{
    adminTeam(){
      return this.ruleForm.jqxxKqyDepts.map(r=>r.deptName).join('、');
    }
  },
  data() {
    const that = this;
    return {
      // 警情类型级联懒加载
      props: {
        lazy: true,
        lazyLoad: this.getJqlxOption,
        children: "children",
        label: "dictLabel",
        value: "dictValue",
        isLeaf: "isLeaf",
        // 是否返回由该节点所在的各级菜单的值所组成的数组
        emitPath: false
      },
      isText: false,
      //警情时间限制
      jqsjxz:{
        jjsjBeginTime:'2020.1.1',
        jjsjEndTime:''
      },
      //主战首到
      sdxfd: "0",
      zzxfd: "0",
      //selectOptions
      options: {
        jqdj: [],
        xczh: [],
        jqcjlb: [],
        zqdj: []
      },
      //显示的三条中文input值(责任区大队，出动队伍，行政区)
      showValue: {
        duty: "",
        setOff: "",
        provName: "",
        // 缩写 行政区：市 + 区县
        shortProvName: ""
      },
      ruleForm: {
        // 警情编号
        jqbh: '',
        // 警情名称
        jqmc: "",
        // 119案件编号
        caseNbr: "",
        //警情等级
        jqdj: "",
        //接警时间
        jjsj: "",
        //现场指挥
        xczh: "",
        //带队领导
        ddld: "",
        //指挥长
        zhz: "",
        //警情类型
        sjlbdm: "",
        // 其他说明
        qtsjlbsm: "",
        //火警类型
        zqdjdm: "",
        //是否为轻微火灾
        ifqwhz: "0",
        //责任区大队
        zrqdddm: "",
        //是否有队伍出动
        isYdwcd: "1",
        //出动队伍名称 & 集合
        setOff: "",
        jqxxCdxfdws: [],
        // 是否责任区主战
        sfzrqzz: "N",
        // 主战队站
        mainTeam: "",
        //行政区域
        xzqydmSj: "",
        //警情地址
        jqfsdd: "",
        //单位名称/户主名
        dwmcHzm: "",
        //联系电话
        lxdh: "",
        //单位统一社会信用代码
        dwtyshxydm: "",
        //增援总队
        jqxxKqyDepts:[],
        //备注
        bz: ""
      },
      pickerOptions: {
        disabledDate(time) {
          // const now = Date.now();
          // let three = 365 * 24 * 3600 * 1000;
          // let threeMonths = now - three;
          // return time.getTime() > now || time.getTime() < threeMonths;
          const start = new Date(that.jqsjxz.jjsjBeginTime).getTime();
          const end = new Date(that.jqsjxz.jjsjEndTime).getTime();
          if(that.jqsjxz.jjsjEndTime){
            return time.getTime() > end || time.getTime() < start;
          }else {
            return time.getTime() > Date.now() || time.getTime() < start;
          }

        }
      },

      rules: {
        setOff: [
          {
            required: true,
            message: "请填写出动队伍名称",
            trigger: "blur",
            type: "array"
          }
        ]
      },
      //避免重复提交
      ifSubmit: true,
      //loading层
      loading: false,
      targetList: [],
      selectTargetList:[], //添加标签列表
      //起火场所分类
      Options: {
        qhcslb: [],
        qhcs:{
          name:'',
          value:''
        },
        qhcsType:''
      },
    };
  },
  created() {
    this.getJqsjxz();
    this.getCslb();
    this.ruleForm.jqbh = this.$route.query.jqbh;
    this.ruleForm.sfzrqzz = this.$route.query.hasmain?"N":"Y";
    this.getSelectOption();
    this.getJqxxInfo(this.$route.query.jqbh)
  },
  methods: {
    async getJqxxInfo(jqbh) {
      this.loading = true;

      const res = await jqxxUpdateInfo(jqbh);
      const zdList = await jqxxKqyUpdateInfo(jqbh);
      this.loading = false;
      if (res.code == 200) {
        const arr = res.data.jqmc.split(" ");
        // this.showValue.shortProvName = arr[5] + " " + arr[6];
        this.showValue.shortProvName = res.data.cityName + " " + res.data.countyName;
        this.showValue.eventType = res.data.sjlbmc;

        this.ruleForm.jjsj = new Date(res.data.jjsj);
        this.ruleForm.sjlbdm = res.data.sjlbdm;
        this.showValue.sjlbdm = res.data.sjlbmc;
        //
        this.ruleForm.qtsjlbsm = res.data.qtsjlbsm || "";
        this.ruleForm.jqxxKqyDepts = zdList.rows;
        this.$refs.cascader.inputValue = res.data.sjlbmc;
        this.ruleForm.caseNbr = res.data.caseNbr;
        this.ruleForm.jqdj = res.data.jqdj;
        this.showValue.provName = res.data.xzqymc;
        this.ruleForm.xzqydmSj = res.data.xzqydmSj;
        this.ruleForm.jqfsdd = res.data.jqfsdd;
        this.ruleForm.dwmcHzm = res.data.dwmcHzm;
        this.ruleForm.bz = res.data.bz;
        // 责任区大队
        this.showValue.duty = res.data.zrqddmc;
        this.ruleForm.zrqdddm = res.data.zrqdddm;
        // 出动队伍
        // this.setMulValue(res.data.jqxxCdxfdws, 1);

        // 主战队站
        // this.showValue.mainTeamName = res.data.mainTeamMc;
        // this.ruleForm.mainTeam = res.data.mainTeam;
        //场所类别
        this.Options.qhcsType = res.data.qhcslb
        this.Options.qhcs.name = res.data.qhcsmc
        this.Options.qhcs.value = res.data.qhcsdm
        this.$watch('Options.qhcsType',(val)=>{
          this.Options.qhcs= {
            name:'',
            value:''
          }
        })
        //
        this.setShowValue('jqdj');
      }
    },
    //总队确认选择
    setAdminTeam(checked){
      this.ruleForm.jqxxKqyDepts = checked;
    },
    openAdminSelet(){
      this.$refs.selectAdmin.setCheckedList(this.ruleForm.jqxxKqyDepts);
    },
    cascaderChange(name) {
      //场所类型置空
      this.Options.qhcsType = ''
      this.Options.qhcs = {
        name:'',
        value: ''
      }
      // 每次改变警情类型之后将其他说明重置为空
      this.ruleForm.qtsjlbsm = "";

      let arr = [],
        text = "",
        code = "";
      if (this.$refs.cascader.getCheckedNodes()[0] == undefined) {
        text = this.ruleForm.sjlbdm;
      } else {
        arr = this.$refs.cascader.getCheckedNodes()[0].pathNodes;
        arr.forEach((item, index) => {
          text = index == 0 ? item.label : text + "/" + item.label;
        });
      }
      this.showValue[name] = text;
      this.isText = text.includes("其他");
      this.showValue["jqlx"] = this.ruleForm.sjlbdm;

      // 清空 责任区大队
      this.ruleForm.zrqdddm = this.showValue.duty = "";
      // 【警情等级】判断：火灾扑救可以选择五个等级；抢险救援可以选择四个等级；其他情况默认等级为1，值为 "1"
      if (
        this.ruleForm.sjlbdm !== "010000000000" ||
        this.ruleForm.sjlbdm.substr(0, 3) !== "020"
      ) {
        this.ruleForm.jqdj = "1";
        this.showValue["jqdj"] = "一级";
      } else {
        this.ruleForm.jqdj = this.showValue["jqdj"] = "";
      }
    },
    setShowValue(name) {
      let value = this.ruleForm[name],
        option = this.options[name],
        text = option.filter(item => {
          return item.dictValue == value;
        })[0].dictLabel;
      this.showValue[name] = text;
    },
    getJqlxOption(node, resolve) {
      const parentValue = node.level === 0 ? '0' : node.value;
      getJqcdlb({dictType: 'jqcjlb', parentValue: parentValue}).then(response => {
        if (response.code === 200) {
          resolve(this.handle(response.data));
        } else {
          this.$message.error(response.msg);
          resolve([]);
        }
      }).catch(e => {
        this.$message.error(e);
        resolve([]);
      });
    },
    //设置叶子节点
    handle(arr) {
      // console.log(arr);
      arr.forEach(item => {
        if (item.isLast == "1") {
          item["leaf"] = true;
        }
      });
      return arr;
    },
    getSelectOption() {
      //警情等级
      getOptions("tb_dic_jqdj").then(res => {
        if (res.code !== 200) {
          return;
        }
        this.options.jqdj = res.data;
      });
      //现场指挥
      getOptions("tb_dic_xczh").then(res => {
        if (res.code !== 200) {
          return;
        }
        this.options.xczh = res.data;
      });
      //火警类型
      getOptions("tb_dic_zqdj").then(res => {
        if (res.code !== 200) {
          return;
        }
        this.options.zqdj = res.data;
      });
    },
    //打开责任大区模态框 并 回显
    openDutyModal() {
      this.$refs.modal.echo(this.ruleForm.zrqdddm);
      this.$refs.modal.toggle();
    },
    //打开多选框 并 回显
    openMulModal(type) {
      this.$refs.mulModal.echo(this.ruleForm.setOff);
      this.$refs.mulModal.toggle();
    },
    //打开多选框 并 回显
    openMulMainTermModal(type) {
      this.$refs.mainTeamModal.echo(this.ruleForm.mainTeam);
      this.$refs.mainTeamModal.toggle();
    },
    // 将树形中的值赋值给责任大区 input id 付给hidden input
    setDutyValue(data) {
      this.ruleForm.zrqdddm = data.deptId;
      this.showValue.duty = data.deptName;
      this.$refs.dutyInput.focus();
      this.$refs.dutyInput.blur();
    },
    //将多选框的值赋给input
    setMulValue(arr, state = 0) {
      let nameArr = [],
        idArr = [];
      arr.forEach(item => {
        nameArr.push(item.deptName || item.xfdwmc);
        idArr.push(item.deptId || item.xfdwdm);
      });
      this.ruleForm.setOff = idArr;
      this.showValue.setOff = nameArr.join(",");
      //给队伍设置默认主战和首到
      if (!state&&this.$route.query.hasmain) {
        this.sdxfd = idArr[0];
        this.zzxfd = idArr[0];
      }
      this.$refs.mulInput.focus();
      this.$refs.mulInput.blur();
    },
    //将多选框的值赋给input
    setMainTeamValue(data) {
      if (5 != data.deptLevel) {
        this.$message.error('必须选择中队或站');
        return;
      }
      this.ruleForm.mainTeam = data.deptId;
      this.showValue.mainTeamName = data.deptName;
    },
    //打开行政区域的模态框
    openProvModal() {
      this.$refs.provModal.toggle();
    },
    // 行政区域赋值
    setProvValue(obj, {first, second, third, last}) {
      // console.log(name, obj.id);
      this.showValue.provName = `${first} ${second} ${third} ${last}`;
      this.showValue.shortProvName = `${second} ${third}`;
      this.ruleForm.xzqydmSj = obj.id;
      this.$refs.provInput.focus();
      this.$refs.provInput.blur();
    },
    // 预览
    confirm() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.showValue.caseNbr = this.ruleForm.caseNbr;
          this.showValue.qtsjlbsm = this.ruleForm.qtsjlbsm;
          if (this.ruleForm.isYdwcd == "1") {
            // 提交之前组装消防队（首到主战）列表
            let arr = [];
            this.ruleForm.setOff.forEach(item => {
              let obj = {
                jqbh: this.ruleForm.jqbh,
                xfdwdm: item,
                sfsddw: "N",
                sfzzxfd: "N",
                sfzrqzz:"N"
              };
              arr.push(obj);
            });
            if(this.ruleForm.sfzrqzz==='N'){
              arr.forEach(item => {
                if (item.xfdwdm == this.sdxfd) {
                  item.sfsddw = "Y";
                }
                if (item.xfdwdm == this.zzxfd) {
                  item.sfzzxfd = "Y";
                }
                // 是否责任区主战
                if (item.xfdwdm == this.zzxfd && this.ruleForm.sfzrqzz === "Y") {
                  item.sfzrqzz = "Y";
                }
              });
            }
            this.ruleForm.jqxxCdxfdws = arr;
          }
          if(this.Options.qhcsType){
            if(!this.Options.qhcs.value){
              this.$message.warning('起火场所不能为空！');
              return ;
            }else {
              this.ruleForm.qhcslb = this.Options.qhcsType;
              this.ruleForm.qhcsdm = this.Options.qhcs.value;
              this.ruleForm.qhcsmc = this.Options.qhcs.name
            }
          }else {
            this.ruleForm.qhcslb = this.Options.qhcsType;
            this.ruleForm.qhcsdm = this.Options.qhcs.value;
            this.ruleForm.qhcsmc = this.Options.qhcs.name
          }
          this.$refs.confirmModal.toggle();
        } else {
          return false;
        }
      });
    },
    //右上角提交
    async onSubmit() {
      //避免重复提交
      if (this.ifSubmit == false) {
        return;
      }
      this.ifSubmit = false;
      this.loading = true;

      const res = await jqxxKyqAdd({jqbh:this.ruleForm.jqbh,jqxxCdxfdws:this.ruleForm.jqxxCdxfdws});
      if (res.code === 200) {
        this.ifSubmit = true;
        this.loading = false;
        // this.resetForm("ruleForm");
        this.showValue.setOff = this.showValue.provName = this.ruleForm.setOff =
          "";
        this.$message({
          message: "提交成功！",
          type: "success"
        });
        this.$store
          .dispatch("tagsView/delView", this.$route)
          .then(({visitedViews}) => {
            if (this.isActive(this.$route)) {
              this.toLastView(visitedViews, this.$route);
            }
          });
        this.$router.push({
          path: "/data/entry/kqyjqlrnewlist"
        });

      } else {
        this.ifSubmit = true;
        this.loading = false;
        this.$message.error("修改失败！");
      }

    },
    handleName() {
      this.ruleForm.jjsj = moment(this.ruleForm.jjsj).format('YYYY-MM-DD HH:mm:ss');
      let startingTime = !this.ruleForm.jjsj
        ? "接警时间"
        : moment(this.ruleForm.jjsj).format('YYYY年MM月DD日'),
        shortProvName = this.showValue.shortProvName || "城市 + 区县",
        companyName = this.ruleForm.dwmcHzm
          ? `【${this.ruleForm.dwmcHzm}】`
          : "单位名称",
        eventType = "警情类型";
      // 向上找到所有的父节点
      if (this.ruleForm.sjlbdm !== "") {
        // console.log(this.$refs.cascader.getCheckedNodes());
        if (this.$refs.cascader.getCheckedNodes()[0] == undefined) {
          eventType = this.showValue.eventType;
        } else {
          eventType =
            this.$refs.cascader.getCheckedNodes()[0].pathLabels[1] ||
            this.$refs.cascader.getCheckedNodes()[0].pathLabels[0];
        }
      }
      this.ruleForm.jqmc = `${startingTime} ${shortProvName} ${companyName} ${eventType}`;
    },
    //获取警情时间限制
    getJqsjxz(){
      init().then(r=>{
        r.jjsjBeginTime?this.jqsjxz.jjsjBeginTime=r.jjsjBeginTime:''
        r.jjsjEndTime?this.jqsjxz.jjsjEndTime=r.jjsjEndTime:''
      })
    },
    timeOnchage(){
      if(this.jqsjxz.jjsjEndTime){
        new Date(this.ruleForm.jjsj).getTime()>new Date(this.jqsjxz.jjsjEndTime).getTime()
          ?this.ruleForm.jjsj = this.jqsjxz.jjsjEndTime:''
      }
    },
    getCslb() {
      getCslx().then(r => {
        this.Options.qhcslb = r.data
      })
    },
    setQhcs(arr) {
      this.Options.qhcs.value = arr.map(r=>r.dictValue).join(',');
      this.Options.qhcs.name = arr.map(r => r.dictLabel).join('/');
    },
    cslbWatch(){
      this.Options.qhcs= {
        name:'',
        value:''
      }
    }

  },
  watch: {
    /**
     * 监测值的变化，如果是 "0" 需要将之前选中一系列值清空掉
     */
    "ruleForm.isYdwcd"(val) {
      if (val === "0") {
        this.ruleForm.setOff = this.showValue.setOff = "";
        // 给队伍设置默认主战和首到
        this.sdxfd = this.zzxfd = "0";

        this.ruleForm.jqxxCdxfdws = [];
      }
    },
    /**
     * 一系列转换 警情名称 的回调
     */
    "ruleForm.jjsj"(val) {
      this.handleName();
    },
    "ruleForm.jqfsdd"(val) {
      this.handleName();
    },
    "showValue.provName"(val) {
      this.handleName();
    },
    "ruleForm.dwmcHzm"(val) {
      this.handleName();
    },
    "ruleForm.sjlbdm"(val) {
      this.handleName();
    }
  }
};
</script>

<style lang="stylus" scoped>
.app-container
  // background-color #F4F6F8
  // padding 10px
  // min-height calc(100vh - 84px)
  .btn-center
    text-align center
  .reporting-title
    h2
      background-image url('~@/views/data/entry/jqxx/image/jqxx.png')
      background-repeat no-repeat
      background-position 0 50%
      background-size 23px
  .content
    padding 0 30px 18px
    .submit-button
      padding-top 15px
      text-align center
    .shadow-box
      padding 15px
      width 100%
      margin-bottom 20px
      background rgba(255, 255, 255, 1)
      box-shadow 0px 3px 14px 0px rgba(0, 0, 0, 0.11)
      border-radius 3px
      border 1px solid rgba(196, 205, 213, 0.22)
      .shadow-title
        height none
        font-size 16px
        font-weight 600
        padding-left 10px
        color rgba(57, 60, 65, 1)
        margin-bottom 5px
        border-left 6px solid #FB5938
    .el-select, .el-input, .el-cascader
      width 100%
    .police_name
      color rgba(147, 158, 171, 1)


content > > >
.el-form-item__label
  // display: flex;
  // align-items: center;
  // justify-content: flex-end;
  // text-align: right;
  // height 32px
  line-height 16px
  font-weight normal

.tag_group
  .tag_item
    margin 5px auto
    .tag_name
      width 100px
      color #606266
      font-weight 600
      display inline-block
      margin-right 15px
</style>
