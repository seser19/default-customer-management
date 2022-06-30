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
          <!-- <el-row :gutter="60">
            <el-col :span="24">
              <el-form-item label="警情名称">
                <div class="police_name">{{ruleForm.jqmc || '接警日期 + 城市 + 区县 + 单位名称 + 警情类型'}}</div>
                <input type="hidden" v-model="ruleForm.jqmc"/>
              </el-form-item>
            </el-col>
          </el-row> -->

          <el-row :gutter="60" v-if="zt == 3">
            <el-col :span="8">
              <el-form-item label="挂起原因">
                <div class="police_name">
                  <span v-if="issueType == 1">未归队</span>
                  <span v-else-if="issueType == 2">结案中</span>
                  <span v-else-if="issueType == 3">已派发</span>
                  <span v-else-if="issueType == 4">信息有误</span>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="补充说明">
                <div class="police_name">{{issueDesc}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="附件图片" v-if="avatars.length != 0">
                <!-- <div class="police_name">{{'图片'}}</div> -->
                <el-image
                style="width: 200px; height: 200px"
                :src="imgUrl"
                :fit="['contain',]"></el-image>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="60" v-if="zt == -1">
            <el-col :span="8">
              <el-form-item label="终止原因">
                <div class="police_name">
                  <span v-if="issueType2 == 1">测试警</span>
                  <span v-else-if="issueType2 == 2">非消防事务警</span>
                  <span v-else-if="issueType2 == 3">已派发</span>
                  <span v-else-if="issueType2 == 4">其他</span>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="补充说明">
                <div class="police_name">{{issueDesc2}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="附件图片" v-if="avatars.length != 0">
                <!-- <div class="police_name">{{'图片'}}</div> -->
                <el-image
                style="width: 100px; height: 100px"
                :src="imgUrl"
                :fit="['fill', 'contain', 'cover', 'none', 'scale-down']"></el-image>
              </el-form-item>
            </el-col>
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
                <el-input v-model="ruleForm.caseNbr" clearable ref="oon" :disabled="true"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="60">
            <el-col :xs="24" :sm="12" :lg="8" :span="8" style="height: 76px;">
              <el-form-item label="警情类型" prop="sjlbdm">
                <el-cascader
                  @change="cascaderChange('sjlbdm')"
                  ref="cascader"
                  :props="props"
                  v-model="ruleForm.sjlbdm"
                  clearable
                  disabled
                ></el-cascader>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :lg="8" :span="8" v-if="isText">
              <el-form-item label="其他说明" prop="qtsjlbsm">
                <el-input v-model="ruleForm.qtsjlbsm" clearable disabled/>
              </el-form-item>
            </el-col>

            <!-- 火灾扑救可以选择五个等级；抢险救援可以选择四个等级；其他情况默认等级为1，值为 "1"，不显示下拉选择框 -->
            <!-- <el-col
              :xs="24"
              :sm="12"
              :lg="8"
              :span="8"
              v-if="ruleForm.sjlbdm"
            >
              <el-form-item label="警情等级" prop="jqdj" v-if="allFireJq.includes(ruleForm.sjlbdm) || ruleForm.sjlbdm.substr(0,3) === '020'">
                <el-select v-model="ruleForm.jqdj" placeholder="请选择" @change="setShowValue('jqdj')">
                  <el-option
                    v-for="item in options.jqdj"
                    :key="item.dictCode"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                    v-if="!(ruleForm.sjlbdm.substr(0,3) === '020' && item.dictCode === 1251)"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col> -->
          </el-row>
          <el-row :gutter="60" v-if="ruleForm.sjlbdm==='010000000000'">
            <el-col :xs="24" :sm="12" :lg="8" :span="8" style="height: 76px;">
              <el-form-item label="起火场所类型">
                <el-select v-model="Options.qhcsType" clearable disabled placeholder="">
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
                <el-input :value="Options.qhcs.name"
                          @focus="$refs.qhcsSelect.toggle()"
                          disabled
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
                  :readonly="true"
                  ref="mulInput"
                  @focus="openMulModal()"
                  disabled
                >
                  <!-- TODO: 注释看不懂的逻辑先 -->
                  <!-- v-if="!(ruleForm.setOff.length !== 0 && (ruleForm.sjlbdm =='010000000000'||(ruleForm.sjlbdm >='020000000000' && ruleForm.sjlbdm <'030000000000')))" -->
                  <!-- <i slot="suffix" class="iconfont icon-icon-test" @click="openMulModal()"></i>
                  <i slot="suffix" class="el-icon-circle-close closeBtnMar" @click="clearMulModal()" v-show="showValue.setOff"></i> -->
                </el-input>
                <input type="hidden" v-model="ruleForm.setOff"/>
              </el-form-item>
            </el-col>

            <!-- 需求变更：所有的警情类型都有 主战和增援 2020.1.4 sxc
               v-if="ruleForm.sjlbdm === '010000000000' || ruleForm.sjlbdm.substr(0,3) === '020'"
            -->
            <el-col :xs="24" :sm="12" :lg="8" :span="8" v-if="ruleForm.setOff.length !== 0">
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

            <el-col :xs="24" :sm="12" :lg="8" :span="8" v-if="ruleForm.setOff.length !== 0">
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
            <el-col :xs="24" :sm="12" :lg="8" :span="8" v-if="ruleForm.setOff.length !== 0">
              <el-form-item label="是否责任区主战">
                <el-radio v-model="ruleForm.sfzrqzz" label="Y">是</el-radio>
                <el-radio v-model="ruleForm.sfzrqzz" label="N">否</el-radio>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="8" :span="8" v-if="ruleForm.sfzrqzz == 'N'">
              <el-form-item label="责任队站" prop="mainTeam">
                <el-input
                  v-model="showValue.mainTeamName"
                  :readonly="true"
                  @focus="openMulMainTermModal"
                  disabled
                >
                  <!-- <i slot="suffix" class="iconfont icon-icon-test" @click="openMulMainTermModal"></i>
                  <i slot="suffix" class="el-icon-circle-close closeBtnMar" @click="clearMulMainTermModal()" v-show="showValue.mainTeamName"></i> -->
                </el-input>
                <input type="hidden" v-model="ruleForm.mainTeam"/>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="8" :span="8" v-if="allFireJq.includes(ruleForm.sjlbdm)">
              <el-form-item label="责任区大队" prop="zrqdddm">
                <el-input
                  v-model="showValue.duty"
                  :readonly="true"
                  ref="dutyInput"
                  @focus="openDutyModal"
                  disabled
                >
                  <!-- <i slot="suffix" class="iconfont icon-icon-test" @click="openDutyModal"></i>
                  <i slot="suffix" class="el-icon-circle-close closeBtnMar" @click="clearDutyModal()" v-show="showValue.duty"></i> -->
                </el-input>
                <input type="hidden" v-model="ruleForm.zrqdddm"/>
                <!-- <el-input type="text" v-model="ruleForm.zrqdddm" /> -->
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="60">
            <el-col :xs="24" :sm="12" :lg="8" :span="8">
              <el-form-item label="行政区域" prop="xzqydmSj">
                <el-input
                  v-model="showValue.provName"
                  :readonly="true"
                  ref="provInput"
                  @focus="openProvModal()"
                  disabled
                >
                  <!-- <i slot="suffix" class="iconfont icon-icon-test" @click="openProvModal()"></i>
                  <i slot="suffix" class="el-icon-circle-close closeBtnMar" @click="clearProvValue()" v-show="showValue.provName"></i> -->
                </el-input>
                <input type="hidden" name v-model="ruleForm.xzqydmSj"/>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :lg="8" :span="8">
              <el-form-item label="警情地址" prop="jqfsdd">
                <el-input v-model="ruleForm.jqfsdd" clearable disabled></el-input>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :lg="8" :span="8">
              <el-form-item label="单位名称/户主名" prop="dwmcHzm">
                <el-input v-model="ruleForm.dwmcHzm" clearable disabled></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="备注">
                <el-input
                  type="textarea"
                  v-model="ruleForm.bz"
                  maxlength="300"
                  show-word-limit
                  resize="none"
                  style="width:100%"
                  :autosize="{ minRows: 3, maxRows: 3 }"
                  clearable
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        
        <div class="submit-button">
          <!-- <el-button type="primary" @click="confirm" size="medium">发&nbsp;送</el-button> -->
          <el-button type="primary" v-if="state" @click="handleDelete()" v-hasPermi="['data:entry:jjxx-xq:delete']" size="medium">审&nbsp;核&nbsp;通&nbsp;过</el-button>
          <el-button type="primary" v-if="state" @click="back();" size="medium">退&nbsp;&nbsp;&nbsp;回</el-button>
        </div>
      </div>

      <!-- 模态框 -->
      <!-- 责任区大队 -->
      <modal ref="modal" @setVal="setDutyValue"></modal>

      <!-- 出动队伍名称 -->
      <mulModal ref="mulModal" @setMulVal="setMulValue"></mulModal>

      <!-- 主战战队 -->
      <mainTeamModal ref="mainTeamModal" :depth="1" @setVal="setMainTeamValue"></mainTeamModal>

      <!-- 行政区域 -->
      <provModal ref="provModal" @setProv="setProvValue"></provModal>

      <!-- 确认信息 -->
      <confirm ref="confirmModal" @onSubmit="onSubmit" :data="ruleForm" :labels="showValue"></confirm>
    </div>
  </div>
</template>

<script>
  import {getOptions, getJqcdlb, jqxxAdd,getMappedJqxxDetail,updateZtByIdBatch} from "@/api/data/entry/jqxx";
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
  import { init } from '@/api/data/entry/jqsjxz'
  import { getCslx } from '@/api/data/entry/hzdj'
  import FireSpaceMul from './components/qhcs'
  import {checkDwmc, noticeDwmc, checkZrdz,noticeZrdz,check} from './components/notice'

  export default {
    name: "alarmentry",
    components: { FireSpaceMul, modal, mulModal, mainTeamModal, provModal, confirm},
    data() {
      var checkTel = (rule, value, callback) => {
        if (!value) {
          return callback(new Error("请填写联系电话"));
        }
        setTimeout(() => {
          if (!/^1[3456789]\d{9}$/.test(value)) {
            callback(new Error("请输入正确的联系方式"));
          } else {
            callback();
          }
        }, 1000);
      };
      let $caseNbr = (rule, value, callback) => {
        let reg = new RegExp(/^[a-zA-Z0-9]{1,50}$/);
        if (value == "") {
          callback();
        } else if (!reg.test(value)) {
          callback(new Error("请正确输入119案件编号(限定字母和数字)"));
        } else {
          callback();
        }
      };
      const that = this;
      return {
        imgUrl:'',
        state:false,
        avatars:[],
        zt:'',
        issueType:'',
        issueType2:'',
        issueDesc:'',
        issueDesc2:'',
        oonBl:false,
        areaLvl:"",
        startXzqydmSj:"",//一开始接口拿的值，行政区域
        startSjlbdm:"",//一开始接口拿的值，警情类型
        // jqlxChange:false,//判断警情类型是否改过
        // xzqyChange:false,//判断行政区域是否改过
        // 警情类别 火灾扑救
        fireJq: '010000000000',
        // 警情类别 其它/轻微火灾
        lightFireJq: '070400000000',
        allFireJq: '010000000000,070400000000',
        //警情时间限制
        jqsjxz:{
          jjsjBeginTime:'2020.1.1',
          jjsjEndTime:''
        },

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
          shortProvName: "",
          mainTeamName: ""
        },
        ruleForm: {
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
          sfzrqzz: "Y",
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
          //备注
          bz: ""
        },
        //起火场所分类
        Options: {
          qhcslb: [],
          qhcs:{
            name:'',
            value:''
          },
          qhcsType:''
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
          jqmc: [{required: true}],
          caseNbr: [
            {
              validator: $caseNbr,
              trigger: "blur"
            }
          ],
          qtsjlbsm: [
            {required: true, message: "请填写其他说明", trigger: "blur"}
          ],
          jqdj: [
            {required: true, message: "请填写警情等级", trigger: "change"}
          ],
          jjsj: [{required: true, message: "请填写接警时间", trigger: "blur"}],
          mainTeam: [{required: true, message: "请填写主战队站", trigger: "change"}],
          xczh: [
            {required: true, message: "请填写现场指挥", trigger: "change"}
          ],
          ddld: [{required: true, message: "请填写带队领导", trigger: "blur"}],
          zhz: [{required: true, message: "请填写指挥长", trigger: "blur"}],
          sjlbdm: [
            {required: true, message: "请填写警情类型", trigger: "change"}
          ],
          zqdjdm: [
            {required: true, message: "请填写火警类型", trigger: "change"}
          ],
          zrqdddm: [
            {required: true, message: "请填写责任区大队", trigger: "blur"}
          ],
          isYdwcd: [
            {required: true, message: "请填写警情等级", trigger: "change"}
          ],
          setOff: [
            {
              required: true,
              message: "请填写出动队伍名称",
              trigger: "blur",
              type: "array"
            }
          ],
          xzqydmSj: [
            {required: true, message: "请填写行政区域", trigger: "blur"}
          ],
          jqfsdd: [
            {required: true, message: "请填写警情地址", trigger: "blur"}
          ],
          dwmcHzm: [
            {required: true, message: "请填写单位名称/户主名", trigger: "blur"}
          ],
          lxdh: [
            {
              validator: checkTel,
              trigger: "blur",
              required: true
            }
          ]
        },
        //避免重复提交
        ifSubmit: true,
        //loading层
        loading: false
      };
    },
    created() {
      this.getSelectOption();
      this.getJqsjxz();
      this.getCslb();
      this.initt();
      this.buttonShow();
    },
    methods: {
      buttonShow(){
        console.log(this.$route.query.type)
        if(this.$route.query.type == 2){
           this.state = true
        }
      },
      // 返回
      back() {
       window.history.go(-1);
      },
      // 确认删除
      handleDelete() {
          // const { id } = item;
          this.$confirm(
            "确定通过该条警情吗？",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
            .then(() => {
              updateZtByIdBatch({
                ids:[this.$route.query.id +''],
                zt:'-99'
              }).then(res => {
                console.log('sss')
                 if(res.code == 200){
              //       this.$confirm("通过成功", "提示", {
              //   confirmButtonText: "返回上一页",
              //   cancelButtonText: "留在本页",
              //   type: "success"
              // }).then(()=>{
                window.history.go(-1);
              // })
                 }
                })
            })
            .catch(function() {
            });
      },
      initt(){
          getMappedJqxxDetail(this.$route.query.id).then(res => {
              console.log(res);
              const data = res.data
              if(data.areaLvl){
                this.areaLvl = data.areaLvl
              }
              if(data.isLast){
                this.isLast = data.isLast
              }
              if(data.jjsj){
                  this.ruleForm.jjsj = data.jjsj
              }
              if(data.caseNbr){
                  this.ruleForm.caseNbr = data.caseNbr
                  this.oonBl = true
              }
              if(data.zrqdddm){
                  this.ruleForm.zrqdddm = parseInt(data.zrqdddm) 
              }
              if(data.jqfsdd){
                  this.ruleForm.jqfsdd = data.jqfsdd
              }
              if(data.dwmcHzm){
                  this.ruleForm.dwmcHzm = data.dwmcHzm
              }
              if(data.bz){
                  this.ruleForm.bz = data.bz
              }
              if(data.zrqddmc){
                  this.showValue.duty = data.zrqddmc
              }
              if(data.xzqydm){
                  this.ruleForm.xzqydmSj = data.xzqydm
                  this.startXzqydmSj = data.xzqydm
              }
              if(data.xzqymc){
                  this.showValue.provName = data.xzqymc
              }
              if(data.sjlbdm){
                  this.ruleForm.sjlbdm = data.sjlbdm
                  this.showValue.jqlx = data.sjlbdm
                  this.startSjlbdm = data.sjlbdm
              }
              if(data.sjlbmc){
                  this.showValue.sjlbdm = data.sjlbmc
                  this.$refs.cascader.inputValue = res.data.sjlbmc;
              }
              if(data.issueType){
                  this.issueType = data.issueType
              }
              if(data.issueType2){
                  this.issueType2 = data.issueType2
              }
              if(data.issueDesc){
                  this.issueDesc = data.issueDesc
              }
              if(data.issueDesc2){
                  this.issueDesc2 = data.issueDesc2
              }
              if(data.zt){
                  this.zt = data.zt
              }
              if(data.avatars.length != 0){
                  this.avatars = data.avatars
                  this.imgUrl = `${process.env.VUE_APP_BASE_API}${data.avatars[0].avatar}`
              }
              this.$forceUpdate()
          })
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
        console.log(this.ruleForm.sjlbdm)
        if(this.ruleForm.sjlbdm){
           let arr = this.$refs.cascader.getCheckedNodes()[0].pathNodes,
             text = "",
             code = "";
           arr.forEach((item, index) => {
             code = item.value;
             text = index == 0 ? item.label : text + "/" + item.label;
           });
           this.showValue[name] = text;
           this.isText = text.includes("其他") && code != this.lightFireJq;
           this.showValue["jqlx"] = this.ruleForm.sjlbdm;

           // 清空 责任区大队
           this.ruleForm.zrqdddm = this.showValue.duty = "";
           // 【警情等级】判断：火灾扑救可以选择五个等级；抢险救援可以选择四个等级；其他情况默认等级为1，值为 "1"
           if (this.ruleForm.sjlbdm !== this.fireJq || this.ruleForm.sjlbdm.substr(0, 3) !== "020") {
             this.ruleForm.jqdj = "1";
             this.showValue["jqdj"] = "一级";
           } else {
             this.ruleForm.jqdj = this.showValue["jqdj"] = "";
           }
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
            // 警情录入 警情类型 组件数据忽略 其它/轻微火灾类型
            let data = response.data.filter(d => {
              return '070400000000' != d.dictValue;
            });
            resolve(this.handle(data));
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
      //清空选中的责任区大队
      clearDutyModal() {
        this.ruleForm.zrqdddm = '';
        this.showValue.duty = '';
      },
      //将多选框的值赋给input
      setMulValue(arr) {
        let nameArr = [],
          idArr = [];
        arr.forEach(item => {
          nameArr.push(item.deptName);
          idArr.push(item.deptId);
        });
        this.ruleForm.setOff = idArr;
        this.showValue.setOff = nameArr.join(",");
        //给队伍设置默认主战和首到
        this.sdxfd = idArr[0];
        this.zzxfd = idArr[0];
        this.$refs.mulInput.focus();
        this.$refs.mulInput.blur();
      },
      //清空选中的出动队伍
      clearMulModal() {
        this.ruleForm.setOff = '';
        this.showValue.setOff = '';
        this.sdxfd = '';
        this.zzxfd = '';
        this.ruleForm.sfzrqzz = 'Y';
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
      //清空责任站
      clearMulMainTermModal() {
        this.ruleForm.mainTeam = '';
        this.showValue.mainTeamName = '';
      },
      //打开行政区域的模态框
      openProvModal() {
        this.$refs.provModal.toggle();
      },
      // 行政区域赋值
      setProvValue(obj, {first, second, third, last}) {
        this.showValue.provName = `${first} ${second} ${third} ${last}`;
        this.showValue.shortProvName = `${second} ${third}`;
        this.ruleForm.xzqydmSj = obj.id;
        this.$refs.provInput.focus();
        this.$refs.provInput.blur();
      },
      clearProvValue() {
        this.showValue.provName = '';
        this.showValue.shortProvName = '';
        this.ruleForm.xzqydmSj = '';
      },
      // 预览
      confirm() {
        if(this.isLast != 1 && this.ruleForm.sjlbdm == this.startSjlbdm){
          this.$message({
            type:'warning',
            message:'请完善警情类型信息'
          })
          return
        }
        if(this.areaLvl != 4 && this.areaLvl != 5 && this.ruleForm.xzqydmSj == this.startXzqydmSj){
          this.$message({
            type:'warning',
            message:'完善行政区域信息'
          })
          return
        }
        this.$refs["ruleForm"].validate(valid => {
          if (valid) {
            this.showValue.caseNbr = this.ruleForm.caseNbr;
            this.showValue.qtsjlbsm = this.ruleForm.qtsjlbsm;
            if (this.ruleForm.isYdwcd == "1") {
              // 提交之前组装消防队（首到主战）列表
              let arr = [];
              this.ruleForm.setOff.forEach(item => {
                let obj = {
                  xfdwdm: item,
                  sfsddw: "N",
                  sfzzxfd: "N"
                };
                arr.push(obj);
              });
              // 需求变更：所有的警情类型都有 主战和增援 2020.1.4 sxc
              // if (
              //   this.ruleForm.sjlbdm === "010000000000" ||
              //   this.ruleForm.sjlbdm.substr(0, 3) === "020"
              // ) {
              //   arr.forEach(item => {
              //     if (item.xfdwdm == this.sdxfd) {
              //       item.sfsddw = "Y";
              //     }
              //     if (item.xfdwdm == this.zzxfd) {
              //       item.sfzzxfd = "Y";
              //     }
              //     // 是否责任区主战
              //     if (
              //       item.xfdwdm == this.zzxfd &&
              //       this.ruleForm.sfzrqzz === "Y"
              //     ) {
              //       item.sfzrqzz = "Y";
              //     }
              //   });
              // }

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
              this.ruleForm.jqxxCdxfdws = arr;
            }
            //if(this.ruleForm.jqfsdd == this.ruleForm.dwmcHzm){
            //  this.$message.warning('单位名称/户主名不能和警情地址一致');
            //  return;
            //}
            if (this.ruleForm.jjsj) {
              let ksrqGettime = new Date(this.ruleForm.jjsj).getTime();
              let now = new Date().getTime();
              if (ksrqGettime > now) {
                this.$message.warning("接警时间不能大于系统当前时间");
                return;
              }
            }
            if(this.Options.qhcsType){
              if(!this.Options.qhcs.value){
                this.$message.warning('起火场所不能为空！');
                return ;
              }else {
                this.ruleForm.qhcslb = this.Options.qhcsType;
                this.ruleForm.qhcsdm = this.Options.qhcs.value;
                this.ruleForm.qhcsmc = this.Options.qhcs.name;
              }
            }else {
              this.ruleForm.qhcslb = this.Options.qhcsType;
              this.ruleForm.qhcsdm = this.Options.qhcs.value;
              this.ruleForm.qhcsmc = this.Options.qhcs.name;
            }
            if(checkDwmc(this.ruleForm)){
              noticeDwmc();
              return;
            }
            if(checkZrdz(this.showValue,this.ruleForm)){
              noticeZrdz();
              return;
            }
            check();
            this.$refs.confirmModal.toggle();
          } else {
            return false;
          }
        });
      },
      //右上角提交
      onSubmit() {
        this.$refs.provModal.clear();
        //避免重复提交
        if (this.ifSubmit == false) {
          return;
        }
        this.ifSubmit = false;
        this.loading = true;
        this.ruleForm.XXLY = 'I';
        jqxxAdd(this.ruleForm)
          .then(res => {
            if (res.code == "200") {
              this.ifSubmit = true;
              this.loading = false;
              // this.$message({
              //   message: "提交成功！",
              //   type: "success"
              // });
              this.resetForm("ruleForm");
              this.showValue.setOff = this.showValue.provName = this.ruleForm.setOff =
                "";
              this.$confirm("已经派发成功", "提示", {
                confirmButtonText: "录入新警情",
                cancelButtonText: "查看已派发",
                type: "success"
              })
                .then(() => {

                })
                .catch(() => {
                  this.$router.push({
                    path: "/data/entry/lsjqxx"
                  });
                });
            }
          })
          .catch(res => {
            this.ifSubmit = true;
            this.loading = false;
            this.$message.error("提交失败！");
          });
      },
      handleName() {
        let startingTime = !this.ruleForm.jjsj
          ? "接警时间"
          : this.ruleForm.jjsj.slice(0, 10).split("-"),
          shortProvName = this.showValue.shortProvName || "城市 + 区县",
          companyName = this.ruleForm.dwmcHzm
            ? `【${this.ruleForm.dwmcHzm}】`
            : "单位名称",
          eventType = "警情类型";
        startingTime !== "接警时间" &&
        (startingTime = `${startingTime[0]} 年${startingTime[1]} 月${startingTime[2]} 日 `);
        //向上找到所有的父节点
        // if (this.ruleForm.sjlbdm && this.ruleForm.sjlbdm !== "") {
        //   eventType =
        //     this.$refs.cascader.getCheckedNodes()[0].pathLabels[1] ||
        //     this.$refs.cascader.getCheckedNodes()[0].pathLabels[0];
        // }
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
    },
    watch: {
      // "ruleForm.sjlbdm": {
      //   handler(newName, oldName) {
      //     this.jqlxChange ++
      //     // console.log(this.jqlxChange);
      //   },
      // },
      // "showValue.provName": {
      //   handler(newName, oldName) {
      //     this.xzqyChange ++
      //     // console.log(this.xzqyChange);
      //   },
      // },
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
      },
      "Options.qhcsType"(){
        this.Options.qhcs= {
            name:'',
            value:''
          }
      }
    }
  };
</script>

<style lang="stylus" scoped>
  .app-container
    // background-color #F4F6F8
    // padding 10px
    // min-height calc(100vh - 84px)
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
      .closeBtnMar
        margin-left 5px
        cursor pointer

  .
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
