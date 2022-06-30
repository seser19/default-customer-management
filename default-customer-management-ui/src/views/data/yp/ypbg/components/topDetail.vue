<template>
  <div class="content_kv">
    <el-row :gutter="15">
      <el-col :xs="24" :sm="24" :lg="24" :span="24" class="first_col">
        <div class="item_content">
          <span class="name">警情名称</span>
          <span class="text">{{ jqTopData.jqmc || '-' }}</span>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="24" :span="24" class="item_col">
        <div class="item_content">
          <span class="name">警情编号</span>
          <span class="text">{{ jqTopData.jqbh || '-'}}</span>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="8" :span="8" class="item_col">
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
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="8" :span="8" class="item_col">
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
    <el-row :gutter="15" class="item_col">
      <el-col :xs="24" :sm="24" :lg="24" :span="24">
        <div class="item_content">
          <span class="name">备注 :</span>
          <span class="text remark">{{ jqTopData.bz||"-" }}</span>
        </div>
      </el-col>
    </el-row>

    <timeLine v-if="timeLineData.length>0&&isShow" :timeLineData="timeLineData"/>
  </div>
</template>

<script>
import timeLine from "@/views/components/timeLine/timeLine.vue";
import { getTimeAxis } from "@/api/data/entry/jqxx.js"
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
      timeLineData:[],
      countPeople: 0,
      countCar: 0,
      countTeam: 0
    };
  },
  watch:{
    jqTopData:function(newVal, oldVal){
      if (this.jqTopData.jqbh == undefined) {
        this.timeLineData = [];
      }else{
        setTimeout(() => {
          this.getTimeLineData(this.jqTopData.jqbh);
        }, 200)
      }
      this.getTotalPower();
    },
    cdTopData:function(newval, oldVal) {
       if(this.cdTopData){
         this.getTotalPower();
       }
    }
  },
  created() {
    if (this.jqTopData.jqbh == undefined) {
      this.timeLineData = [];
    }else{
      setTimeout(() => {
        this.getTimeLineData(this.jqTopData.jqbh);
      }, 200)
    }

  },
  methods:{
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
    },
    getTotalPower(){
        this.countCar = 0;
        this.countPeople = 0;
        this.countTeam = 0;
        if(this.jqTopData && this.jqTopData.jqxxCdxfdws && this.jqTopData.jqxxCdxfdws.length > 0 ){
            this.jqTopData.jqxxCdxfdws.map(item =>{
                this.countCar +=  parseInt(item.carCount);
                this.countPeople += parseInt(item.trrys);
            });
            this.countTeam = this.jqTopData.jqxxCdxfdws.length;
        }
        if(this.cdTopData && this.cdTopData.length > 0){
            this.cdTopData.map(item =>{
                if(item.trll){
                  let carNum = parseInt(item.trll.match(/(\S*)车/)[1]);
                  let peopNum = parseInt(item.trll.match(/车(\S*)人/)[1]);
                  this.countCar += carNum;
                  this.countPeople += peopNum;
                }
            });
            this.countTeam = this.cdTopData.length;
        }
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
    display flex
    align-items center
  .name
    color #999999
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
</style>
