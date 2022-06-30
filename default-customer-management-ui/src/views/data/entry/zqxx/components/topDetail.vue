<template>
  <div class="content_kv">
    <el-row :gutter="15">
      <el-col :xs="24" :sm="24" :lg="24" :span="24" class="first_col">
        <div class="item_content">
          <div>
            <span class="name">警情名称</span>
            <span class="text">{{ jqTopData.jqmc || '-' }}</span>
            <span style="padding-left:10px">
              <el-tooltip class="item" effect="dark" content="点击关注" placement="top" v-if="isCollect == '0'">
              <i v-if="isCollect == '0'" class="offStar el-icon-star-off " @click="changeFocus(1)"></i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="取消关注" placement="top" v-if="isCollect == '1'">
                <i v-if="isCollect == '1'" class="onStar el-rate__icon el-icon-star-on" @click="changeFocus(0)"></i>
              </el-tooltip>
            </span>
          </div>
          <el-button type="primary" class="btn" @click="printf">打印</el-button>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="8" :span="8" class="item_col" v-show="isShowJqbh">
        <div class="item_content">
          <span class="name">警情编号</span>
          <span class="text">{{ jqTopData.jqbh || '-'}}</span>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="16" :span="16" class="item_col">
        <div class="item_content">
          <span class="name">119编号</span>
          <span class="text">{{ jqTopData.caseNbr || '-'}}</span>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="8" :span="8" class="item_col" v-show="isShowJqbh">
        <div class="item_content">
          <span class="name">接警时间</span>
          <span class="text">{{ jqTopData.jjsj||"-" }}</span>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="16" :span="16" class="item_col">
        <div class="item_content">
          <span class="name">行政区域</span>
          <span class="text">{{ jqTopData.xzqydmSj||"-" }}</span>
        </div>
      </el-col>
      <!-- 抢险救援(020101000000,020501000000)没有责任区大队，出动详情中不要显示责任区大队。只有火灾扑救显示010000000000 -->
      <el-col :xs="24" :sm="12" :lg="8" :span="8" class="item_col" v-if = "jqTopData.sjlbdm=='010000000000'">
        <div class="item_content">
          <span class="name">责任区大队</span>
          <span class="text">{{ jqTopData.zrqdddm ||"-" }}</span>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="16" :span="16" class="item_col">
        <div class="item_content">
          <span class="name">警情类型</span>
          <span class="text">{{ jqTopData.sjlbmc ||"-" }}{{jqTopData.qhcsmc?"/"+jqTopData.qhcsmc:""}}</span>
          <span class="text" style="margin-left:50px" v-if="jqTopData.isCorps == '1'">兵团火灾扑救</span>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="8" :span="8" class="item_col"  v-if = "jqTopData.sjlbdm=='010000000000'  || jqTopData.sjlbdm.substr(0,3)=='020'">
        <div class="item_content">
          <span class="name">警情等级</span>
          <span class="text">{{ jqTopData.jqdj||"-" }}</span>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="24" :span="24" class="item_col">
        <div class="item_content">
          <span class="name">单位名称/户主名</span>
          <span class="text">{{ jqTopData.dwmcHzm||"-" }}</span>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="24" :span="24" class="item_col">
        <div class="item_content">
          <span class="name">警情地址</span>
          <span class="text">{{ jqTopData.jqfsdd||"-" }}</span>
        </div>
      </el-col>
      <!-- <el-col :xs="24" :sm="12" :lg="8" :span="8">
        <div class="name">现场指挥 :</div>
        <div class="text">{{ jqTopData.xczh||"-" }}</div>
      </el-col>-->

      <!-- <el-col :xs="24" :sm="12" :lg="8" :span="8">
        <div class="name">联系电话 ：</div>
        <div class="text">{{ jqTopData.lxdh||"-" }}</div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="8" :span="8">
        <div class="name">单位统一社会信用代码 :</div>
        <div class="text">{{ jqTopData.dwtyshxydm||"-" }}</div>
      </el-col>-->
    </el-row>
    <el-row>
      <el-col :xs="24" :sm="24" :lg="24" :span="24">
          <div class="item_content">
              <span class="name">合计力量:</span>
              <span class="text" v-if="countCar > 0 && countPeople > 0">共{{ countTeam || "-"}}队{{ countCar || "-"}}车{{ countPeople || "-" }}人</span>
              <span class="text" v-else-if="countTeam > 0 & countCar === 0">共{{ countTeam || "-"}}队{{ countCar }}车{{ countPeople }}人</span>
              <span class="text" v-else>{{"-"}}</span>
          </div>
      </el-col>
    </el-row>
    <!-- ++++++++++ -->
    <!-- 判断是使用 jqTopData.jqxxCdxfdws（出动填报相关页面使用） ，还是 cdTopData（火灾填报相关页面使用）  -->
    <div v-if="cdTopData.length">
      <el-row v-for="(item,index) in cdTopData" :key="index" :gutter="15">
        <el-col
          :xs="24"
          :sm="24"
          :lg="24"
          :span="24"
          :class="index === cdTopData.length -1 ? 'item_col' : ''"
        >
          <div class="item_content">
            <span class="name">{{ 0 === index ? '出动队伍' : '' }}</span>
            <span class="text">{{ item.xfdwdm||"-" }}</span>
            <span :class="item.respondType=='主战' ? 'tip_one' : 'tip_ones'">{{ item.respondType }}</span>
            <span v-if="item.isFirstarrive=='Y'" class="tip_second">首到</span>
            <span
              v-if="item.respondType=='主战'"
              class="tip_third"
            >{{item.sfzrqzz == '是'?'责任区':'非责任区'}}</span>
            <!-- 警情信息中添加每个队伍出动的具体几车几人 -->
            <span class="tip_four">{{item.trll||"0车0人"}}</span>
          </div>
        </el-col>
      </el-row>
    </div>
    <div v-else>
      <el-row v-for="(item,index) in jqTopData.jqxxCdxfdws" :key="index" :gutter="15">
        <el-col
          :xs="24"
          :sm="24"
          :lg="24"
          :span="24"
          :class="index === jqTopData.jqxxCdxfdws.length -1 ? 'item_col' : ''"
        >
          <div class="item_content">
            <span class="name">{{ 0 === index ? '出动队伍' : '' }}</span>
            <span class="text">{{ item.xfdwmc||"-" }}</span>
            <!-- 需求变更：所有的警情类型都有 主战和增援 2020.1.4 sxc
               v-if="jqTopData.sjlbdm === '010000000000' ||
        jqTopData.sjlbdm.substr(0, 3) === '020'"
            -->
            <span
              :class="item.sfzzxfd=='是' ? 'tip_one' : 'tip_ones'"
            >{{ item.sfzzxfd=='是' ? '主战' : '增援' }}</span>
            <span v-if="item.sfsddw=='是'" class="tip_second">首到</span>
            <span v-if="item.mainTeam=='Y'" class="top_five">辖区队站</span>
            <span v-if="item.sfzzxfd=='是'" class="tip_third">{{item.sfzrqzz == '是'?'责任区':'非责任区'}}</span>
            <!-- 警情信息中添加每个队伍出动的具体几车几人 -->
            <span class="tip_four">{{`${item.carCount}车${item.trrys}人`}}</span>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-row :gutter="15" class="item_col" v-if="! zzhzjg == true">
      <el-col :xs="24" :sm="24" :lg="24" :span="24">
        <div class="item_content">
          <span class="name">备注 :</span>
          <span class="text remark">{{ jqTopData.bz||"-" }}</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="15" class="item_col" v-if="zzhzjg == true">
      <el-col :xs="24" :sm="24" :lg="24" :span="24">
        <div class="item_content">
          <span class="name">警情说明 :</span>
          <span class="text remark">{{ jqTopData.bz||"-" }}</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="15" class="item_col" v-if="jqTopData.zt == 4">
      <el-col :xs="6" :sm="6" :lg="6" :span="6">
        <div class="item_content">
          <span class="name">要求完成时间 :</span>
          <span class="text remark">{{ jqTopData.finishDate||"-" }}</span>
        </div>
      </el-col>
      <el-col :xs="6" :sm="6" :lg="6" :span="6">
        <div class="item_content">
          <span class="name">问题类型 :</span>
          <span class="text remark" v-if="jqTopData.issueType == 1">数据不准确</span>
          <span class="text remark" v-else-if="jqTopData.issueType == 2">数据错误</span>
          <span class="text remark" v-else-if="jqTopData.issueType == 3">信息不全</span>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="12" :span="12">
        <div class="item_content">
          <span class="name">问题描述 :</span>
          <span class="text remark">{{ jqTopData.issueDesc||"-" }}</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="15" class="item_col">
      <el-col :xs="24" :sm="24" :lg="24" :span="24">
        <div class="item_content">
          <span class="name">警情标签 :</span>
          <span class="text remark" v-if="selectTargetList.length > 0">
            <el-col style="cursor: pointer;" :span="1.5" v-for="(t, index) in selectTargetList" :key="index">
              <el-tag size="medium"  :type="t.type" effect="dark" closable @close="handleClose(index,t)">{{ t.tagName }}</el-tag>
            </el-col>
          </span>
          <span class="text remark" v-else>-</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="15" class="item_col">
      <el-col :xs="24" :sm="24" :lg="24" :span="24" style="text-align: center;">
        <el-button type="primary" icon="el-icon-icon" @click="addTarget">添加标签</el-button>
      </el-col>
    </el-row>
      <div style="margin: 12px 0 30px;">
          <timeLine v-if="timeLineData.length>0&&isShow" :timeLineData="timeLineData"/>
      </div>
    <!-- 标签弹框 -->
    <el-dialog title="添加标签" :visible.sync="targetFlag">
      <el-row :gutter="10">
      	<el-col style="cursor: pointer;" :span="1.5" v-for="(t, index) in targetList" :key="index">
          <el-tag size="medium" @click="selectTag(index,t)"  :type="t.type" effect="dark">{{ t.tagName }}</el-tag>
        </el-col>
      </el-row>
    </el-dialog>


      <!-- 添加新内容 -->
  <!-- <div class="fireNumber">
    <el-row :gutter="15" style="margin-bottom: 20px;">
      <el-col :xs="24" :sm="24" :lg="24" :span="24" >
        <div class="line"></div>
        <span class="box">一般火灾(火灾编号: {{ zqbh }} )</span>
      </el-col>
    </el-row>

    <el-row :gutter="15">
      <div class="item_content">
        <el-col style="display:flex">
          <img src="../image/hz.png" height="27" width="27" style="margin-top:3px"/>
          <span class="name_2">火灾概况</span>
        </el-col>
      </div>
    </el-row>

    <el-row :gutter="15">
      <el-col :xs="24" :sm="12" :lg="12" :span="12">
        <div  class="item_content">
          <span class="name">起火场所类型</span>
          <span class="text">{{ qhcslb||"-" }}</span>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="12" :span="12">
        <div class="item_content">
          <span class="name">起火场所</span>
          <span class="text">{{ qhcslb||"-" }}</span>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="12" :span="12">
        <div class="item_content">
          <span class="name">起火物</span>
          <span class="text"> {{ qhwmsItem1||"-" }} </span>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="12" :span="12">
        <div class="item_content">
          <span class="name">起火物类型</span>
          <span class="text"> {{ qhwfldm||"-" }} </span>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="12" :span="12">
        <div class="item_content">
          <span class="name">直接经济损失</span>
          <span class="text"> {{ zjccss||"-" }} </span>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="12" :span="12">
        <div class="item_content">
          <span class="name">过火面积(平方米)</span>
          <span class="text">{{ ghmj||"-" }}</span>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="15">
      <div class="item_content">
        <el-col :xs="24" :sm="24" :lg="24" :span="24"  style="display:flex">
          <img src="../image/hz.png" height="27" width="27" style="margin-top:3px"/>
          <span class="name_2">起火经过</span>
        </el-col>
      </div>
      <div class="item_content">
        <el-col  :xs="24" :sm="24" :lg="24" :span="24">
           <span>{{ fireProcess||"-" }}</span>
        </el-col>
      </div>
    </el-row>
    <div class="box3"></div>
  </div>

  <div class="fireNumber" v-for="(item,index) in DispatchSituation" :key="index">
    <el-row :gutter="15" style="margin-bottom: 20px;" >
      <el-col :xs="24" :sm="24" :lg="24" :span="24" style="position:relative;" class="first_col">
        <div class="line_2"></div>
        <span  class="box">主战出动情况</span>

        <div v-if="item.weather == 100" style="font-weight:600;position:absolute;top:0px;left:200px;">
              <img src="../image/阴天.png" height="27" width="27" />
              <span class="weathertext">阴天</span>
        </div>
        <div v-else-if="item.weather == 1" style="font-weight:600;position:absolute;top:0px;left:200px;">
              <img src="../image/晴天.png" height="27" width="27" />
              <span class="weathertext">晴天</span>
        </div>
        <div v-else-if="item.weather == 2" style="font-weight:600;position:absolute;top:0px;left:200px;">
              <img src="../image/多云.png" height="27" width="27" />
              <span>多云</span>
        </div>
        <div v-else-if="item.weather == 3" style="font-weight:600;position:absolute;top:0px;left:200px;">
              <img src="../image/大雨.png" height="27" width="27" />
              <span>大雨</span>
        </div>
        <div v-else-if="item.weather == 11" style="font-weight:600;position:absolute;top:0px;left:200px;">
              <img src="../image/小雨.png" height="27" width="27" />
              <span>小雨</span>
        </div>
        <div v-else-if="item.weather == 4" style="font-weight:600;position:absolute;top:0px;left:200px;">
              <img src="../image/雪.png" height="27" width="27"/>
              <span>雪</span>
        </div>
        <div v-else-if="item.weather == 5" style="font-weight:600;position:absolute;top:0px;left:200px;">
              <img src="../image/霜.png" height="27" width="27" />
              <span>霜</span>
        </div>
        <div v-else-if="item.weather == 6" style="font-weight:600;position:absolute;top:0px;left:200px;">
              <img src="../image/打雷.png" height="27" width="27" />   
              <span>打雷</span>
        </div>
        <div  v-else-if="item.weather == 7" style="font-weight:600;position:absolute;top:0px;left:200px;">
              <img src="../image/冰雹.png" height="27" width="27"/>
              <span>冰雹</span>
        </div>
        <div v-else-if="item.weather == 8" style="font-weight:600;position:absolute;top:0px;left:200px;">
              <img src="../image/霾.png" height="27" width="27" />
              <span>霾</span>
        </div>
        <div v-else-if="item.weather == 9" style="font-weight:600;position:absolute;top:0px;left:200px;">
              <img src="../image/雾.png" height="27" width="27" />
              <span>雾</span>
        </div>

      </el-col>
      <el-col :xs="24" :sm="24" :lg="24" :span="24">
        <div class="item_content" style="margin-top:10px">
          <img src="../image/xfc.png" height="27" width="27" style="margin-top:0px"/>
          <span style="font-weight:600;margin-left:20px;">{{ item.xfdwdm }}</span>
          <span style="margin-left:100px">{{item.czqkdm}}</span>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="24" :span="24">
        <div style="margin: 12px 0 30px;padding-left 10px;">
          <timeLine v-if="timeLineData.length>0&&isShow" :timeLineData="timeLineData" />
        </div>
      </el-col>
      <el-col  :xs="24" :sm="24" :lg="24" :span="24" class="item_content">
        <span>出动车辆 {{  item.carCount  }} 辆，出动警力 {{ item.trrys }} 人，抢救被困人员 {{ item.rescueNum }}人，
          疏散被困人员 {{ item.ssrs }} 人，抢救财产价值 {{ item.qjccjz }} 元，保护财产价值 {{ item.protectPropVal }} 元，
          参战人员死亡 {{ item.swdys }} 人,受伤人数 {{ item.ssdys }} 人。
        </span>
      </el-col>
    </el-row>
  </div> -->


  </div>
</template>

<script>
import timeLine from "@/views/components/timeLine/timeLine.vue";
import { getTimeAxis,jqxxDatilInfo4Zq,jqxxDatilInfo4Cd } from "@/api/data/entry/jqxx.js"
import { collect, updateStatus } from "@/api/system/user.js"
//标签接口
import {
  listTarget, targetNameTarget, addBusinessTags, deleteBusinessTags, queryBusinessTags
} from "@/api/system/dict/target";
export default {
  name: "topDetail",
  components: { timeLine },
  props: {
    /* 警情数据 */
    jqTopData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    /* 出动队伍伍列表数据 */
    cdTopData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    /* 出动队伍伍列表数据 */
    isShow: {
      // type: ,
      default: () => {
        return false;
      }
    }
  },
  data() {
    return {
      zzhzjg: false,
      timeLineData:[],
      countPeople: 0,
      countCar: 0,
      countTeam: 0,
      isCollect:undefined, //是否关注
      collectId:'', //关注id
      targetFlag:false, //标签弹框展示
      targetList: [],
      selectTargetList:[], //添加标签列表
      isShowJqbh: true,
      fireProcess:"",  //起火经过
      ghmj:0,   //过火面积
      qhcslb: "", //起火场所
      qhwfldm:"", //起火物类型
      qhcslb:"", //起火场所
      zqbh:"", //火灾编号
      qhwmsItem1:"", // 起火物
      zjccss:"", //直接经济损失
      qhcslb: "", //起火场所类型
      // DispatchSituation:[],
      minDcsj:"",
      sddwIndex: -1,
      sddw: false,
      sddwCount: -1
    };
  },
  watch:{
    jqTopData:function(newVal, oldVal){
      if (this.jqTopData.jqbh == undefined) {
        this.timeLineData = [];
      }else{
        setTimeout(() => {
          this.getTimeLineData(this.jqTopData.jqbh);
          this.queryTag(()=>{
            this.getTagList();
          });
        }, 200)
      }
      this.getTotalPower();
      if(this.$route.name == 'fireauditing' && this.jqTopData.isYdwcd == 0){
          this.isShowJqbh = false;
      }else{
          this.isShowJqbh = true;
      }
    },
    cdTopData:function(newval, oldVal) {
      if(this.cdTopData){
          this.getTotalPower();
      }
    }
  },
  created() {
    this.hideAreaId();
    // this.gettextsegment();
    if (this.jqTopData.jqbh == undefined) {
      this.timeLineData = [];
    }else{
      setTimeout(() => {
        this.getTimeLineData(this.jqTopData.jqbh);
        this.queryTag(()=>{
          this.getTagList();
        });
      }, 200)
    }
  },
  methods:{
    // gettextsegment(){
    //   const jqbh = this.jqTopData.jqbh;
    //   // const jqbh = 'J20215101137162';
    //   jqxxDatilInfo4Zq(jqbh).then(
    //     res => {
    //       if(res.code === 200){
    //         this.fireProcess = res.data.fireProcess;
    //         this.ghmj = res.data.ghmj;
    //         this.qhcslb = res.data.qhcslb;
    //         this.qhwfldm = res.data.qhwfldm;
    //         this.qhcslb = res.data.qhcslb;
    //         this.zqbh = res.data.zqbh;
    //         this.qhwmsItem1 = res.data.qhwmsItem1;
    //         this.zjccss = res.data.zjccss
    //         // console.log('-----',res)
    //         return 
    //       } else {
    //         this.msgError(res.msg);
    //       }
    //     }
    //   );
    //   jqxxDatilInfo4Cd(jqbh).then(
    //     res => {
    //       console.log('wqeqwe',res)
    //         this.DispatchSituation = res.data;
    //     }
    //   );
    // },

    //判断浙江ID为33开头
      hideAreaId(){
        //  console.log( "______",this.$store.state.user.deptId) 
        if(this.$store.state.user.deptId){
          let hideArr = (this.$store.state.user.deptId).toString().split('');
        //  console.log(hideArr)
         if(hideArr[0] == '3' && hideArr[1] == '3'){
           this.zzhzjg = true;
           this.fireEdit = false;
         }
        }
      },

    printf(){
        let subOutputRankPrint = document.getElementsByClassName('content_kv')[0];
        console.log(subOutputRankPrint.innerHTML);
        let newContent =subOutputRankPrint.innerHTML;
        let oldContent = document.body.innerHTML;
        document.body.innerHTML = newContent;
        window.print();
        window.location.reload();
        document.body.innerHTML = oldContent;
        return false;
    },
    getTimeLineData(jqbh){
      getTimeAxis(jqbh)
      .then(res =>{
        if (res.code == 200) {
          this.timeLineData = res.data;
          this.getTotalPower();
        }else{
          this.timeLineData = [];
        }
      })
      collect(jqbh).then(res => {
        if(res.code == 200){
          if(res.data){
            if(res.data.iscollect == '1'){
              this.isCollect = true;
            }else{
              this.isCollect = false;
            }
            this.collectId = res.data.id;
          }
        }
      })
    },
    getTotalPower(){
        this.countCar = 0;
        this.countPeople = 0;
        this.countTeam = 0;
        if(this.jqTopData && this.jqTopData.jqxxCdxfdws && this.jqTopData.jqxxCdxfdws.length > 0 ){
            this.jqTopData.jqxxCdxfdws.map(item =>{
                this.countCar +=  parseInt(item.carCount);
                this.countPeople += parseInt(item.trrys);
                this.sddwCount++;
                console.log(item.sfsddw)
                if(item.dcsj!==null){
                  if(this.minDcsj==""){
                    this.minDcsj=item.dcsj;
                    this.sddwIndex=this.sddwCount;
                    this.sddw=true;
                  }else if(this.minDcsj>item.dcsj){
                    this.minDcsj=item.dcsj;
                    this.sddwIndex=this.sddwCount;
                    this.sddw=true;
                  }
                }
            });
            this.sddwCount=-1;
            this.jqTopData.jqxxCdxfdws.map(item =>{
                this.sddwCount++;
                if(this.sddw){
                  if(this.sddwCount === this.sddwIndex){
                    item.sfsddw = '是';
                  }
                  else if(this.sddwCount !== this.sddwIndex){
                    item.sfsddw = '否';
                  }
                }
            });
            this.countTeam = this.jqTopData.jqxxCdxfdws.length;
            console.log(this.jqTopData.jqxxCdxfdws)
        }
        if(this.cdTopData && this.cdTopData.length > 0){
            this.cdTopData.map(item =>{
                if(item.trll){
                  let carNum = parseInt(item.trll.match(/(\S*)车/)[1]);
                  let peopNum = parseInt(item.trll.match(/车(\S*)人/)[1]);
                  this.countCar += carNum;
                  this.countPeople += peopNum;
                  this.sddwCount++;
                  console.log(item.xfdwdm + item.dcsj)
                  if(item.dcsj!==null){
                    if(this.minDcsj==""){
                      this.minDcsj=item.dcsj;
                      this.sddwIndex=this.sddwCount;
                      this.sddw=true;
                    }else if(this.minDcsj>item.dcsj){
                      this.minDcsj=item.dcsj;
                      this.sddwIndex=this.sddwCount;
                      this.sddw=true;
                    }
                  }
                }
            });
            this.sddwCount=-1;
            this.cdTopData.map(item =>{
              if(item.trll){
                this.sddwCount++;
                if(this.sddw){
                  if(this.sddwCount === this.sddwIndex){
                    item.isFirstarrive = 'Y';
                  }else if(this.sddwCount !== this.sddwIndex){
                    item.isFirstarrive = 'N';
                  }
                }
              }
            });
            this.countTeam = this.cdTopData.length;
            console.log(this.cdTopData)
        }
    },
    // 关注警情
    changeFocus(val) {
      let params = {
        type:1,
        serialNum: this.jqTopData.jqbh,
        status:val
      }
      if(val == 0){
        params.id = this.collectId;
      }
      updateStatus(params).then(res => {
        if(res.code == 200){
          this.isCollect = !this.isCollect;
          this.collectId = res.data;
        }
      })
    },
    //  获取标签
    getTagList() {
      setTimeout(()=>{
      },3000);

      let _params = {
        tagName: "",
        tagType: "J"
      }
      targetNameTarget(_params).then(
        response => {
          this.loading = false;
          if (response.code === 200) {
            let typeList = response.data;

            let _list = [];
            let _tmap = [];
            for(var i=0;i< this.selectTargetList.length;i++) {
              _tmap[this.selectTargetList[i].tagId] = true;
            }

            for(var i=0;i< typeList.length;i++) {
              typeList[i].sortNum = i;
              if (!_tmap[typeList[i].tagId]) {
                  _list.push(typeList[i]);
              }
            }
            this.targetList = _list;
          } else {
            this.msgError(response.msg);
          }

        }
      );
    },
    // 关闭按钮
    handleClose(num, node) {
      let _params = {
        "relId": node.relId
      }
      deleteBusinessTags(_params).then(res=>{
        this.changeTag(num, node, this.selectTargetList, this.targetList);
      });
    },
    changeTag(num, node, list1, list2) {
      list1.splice(num,1);
      list2.push(node);
    },
    // 点击添加标签事件
    addTarget() {
      this.targetFlag = true;
    },
    // 查询业务标签
    queryTag(callback) {
      let _params = {
        "businessId": this.jqTopData.jqbh
      }
      // this.gettextsegment();
      queryBusinessTags(_params).then(res => {
        if(res.code == 200) {
          this.selectTargetList = res.data;
          if(callback) {
            callback();
          }
        } else {
          this.msgError(res.msg);
        }
      });
    },
    // 选择标签
    selectTag(num, node) {
      let _params = {
        "tagId": node.tagId,
        "tagName": node.tagName,
        "businessId": this.jqTopData.jqbh,
        "sortNum": node.sortNum,
        "tagType": "J"
      }
      this.loading = true;
      addBusinessTags(_params).then((res) => {
        this.loading = false;
        if(res.code == 200) {
          this.sortNum ++;
          this.queryTag();
          this.changeTag(num, node, this.targetList, this.selectTargetList);
        } else {
          this.msgError(res.msg);
        }
      });
    }
  }
};
</script>
<style lang='stylus' scoped>
.content_kv
  width 100%
  border-bottom 1px dashed #DAE2ED
  text-align left
  padding 15px 30px 0px 30px
  // line-height 28px
  .item_col
    border-bottom 1px dashed #E8E8E8
  .first_col
    border-bottom 1px solid #E8E8E8
  .item_content
    // height 37px
    line-height 37px
    padding-left 10px
    display flex
    align-items center
    position relative
    .btn
      position absolute
      right 0
      top 0
  .name
    color #999999
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
    width 122px
    display inline-block
    font-size 14px
  .name_2
    color #000000
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
    width 122px
    display inline-block
    font-size 14px
  .text
    color #333333
    font-size 14px
    vertical-align top
  .remark
    line-height initial
    padding 10px 0px
  .tip_one
    font-size 12px
    color #fb3e2d
    border-radius 12px
    display inline-block
    height 20px
    border 1px solid #fb3e2d
    line-height 18px
    padding 0 8px
    margin-left 20px
  .tip_ones
    font-size 12px
    color #7ED321
    border-radius 12px
    display inline-block
    height 20px
    border 1px solid #7ED321
    line-height 18px
    padding 0 8px
    margin-left 20px
  .tip_second
    font-size 12px
    color #437FDF
    border-radius 12px
    display inline-block
    height 20px
    border 1px solid #437FDF
    line-height 18px
    padding 0 8px
    margin-left 12px
  .tip_third
    font-size 12px
    color #6C0AAB
    border-radius 12px
    display inline-block
    height 20px
    border 1px solid #6C0AAB
    line-height 18px
    padding 0 8px
    margin-left 12px
  .tip_four
    font-size 12px
    color orange
    border-radius 12px
    display inline-block
    height 20px
    border 1px solid orange
    line-height 18px
    padding 0 8px
    margin-left 12px
  .top_five
    font-size 12px
    color #d442f5
    border-radius 12px
    display inline-block
    height 20px
    border 1px solid #d442f5
    line-height 18px
    padding 0 8px
    margin-left 12px
  .offStar
    font-size 18px
    margin-right 6px
    color rgb(198, 209, 222) !important;
    cursor  pointer
  .onStar
    color rgb(247, 186, 42) !important;
    cursor pointer
    font-size 18px
    margin-right 6px
  .el-rate__icon
    font-size 18px;
    margin-right 6px;
    color #c0c4cc;
    transition .3s;
    cursor: pointer;
  .fireNumber
    margin-top 30px;
  .line
    background: #fb5938
    border:1px solid 	#CCCCCC;
    display:inline-block;
    height:30px;
    width :6px;
  .line_2
    background: #0000FF
    border:1px solid 	#CCCCCC;
    display:inline-block;
    height:30px;
    width :6px;
  .box
    font-size:20px;
    margin-left 20px;
  img
    margin-top: 5px;
  .box3
    border-bottom 2px solid #E8E8E8
  .weathertext
    font-size:20px;

</style>
