<template>
  <div class="detail_page">
    <div class="title" v-if="showTitle&&showData">
      <div>{{ detalTitle }}</div>
    </div>
    <div class="detail_content" v-if="showData">
      <el-carousel trigger="click" height="106px" :autoplay="false" @change="changePageHandler">
        <el-carousel-item v-for="item in cardLength" :key="item">
          <div style="display:flex;justify-content:start;border-bottom:2px solid #437FDF;">
            <div v-for="(card,index) in cardList.slice((item-1)*6,(item-1)*6+6)" :key="index" class="cardContainer" :class="curIndex === index ? 'active' : ''" @click="handleCardClick(index,card)">
              <el-row>
                <el-col class="cardTitle" :class="(card.shzt != 2 && card.shzt != 99 && card.shzt !='all')?'dot_error':'dot_success'">{{ card.title || '-'}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="12" class="cardContent" :title="card.dwVal">
                  {{ card.dw || '-'}}:
                  <span> {{ card.dwVal || '-' }}</span>
                </el-col>
                <!-- <el-col :span="12" class="cardContent" :title="card.time">
                  {{ card.time || '-'}}
                </el-col> -->
              </el-row>
              <el-row>
                <!-- <el-col :span="12" class="cardContent" :title="card.dwVal">
                  {{ card.dwVal || '-' }}
                </el-col> -->
                <el-col :span="12" class="cardContent" :title="card.timeVal">
                  {{ card.time || '-'}}:
                  <span> {{ card.timeVal || '-' }}</span>
                </el-col>
              </el-row>
              <el-row v-if="card.title !='警情信息' ">
              <!-- <el-row v-if="card.title =='火灾信息' "> -->
                <el-col :span="12" class="cardContent">
                  {{card.status || '-'}}:
                  <span v-if="card.shzt == 0&&card.type!==3">待填报</span>
                  <span v-if="card.shzt == 0&&card.type===3">待选择队伍</span>
                  <span v-if="card.shzt == 1&&card.type!==3">审核中</span>
                  <span v-if="card.shzt == 1&&card.type===3">已填报</span>
                  <span v-if="card.shzt == 2">已审核</span>
                  <span v-if="card.shzt == -1">待修改</span>
                  <span v-if="card.shzt == -2">被退回</span>
                  <span v-if="card.shzt == -3">待完善</span>
                  <span v-if="card.shzt == 99">已归档</span>
                  <span v-if="card.shzt == 4">被驳回</span>
                  <!-- <span>{{card.jjss}}元</span>
                </el-col>
              </el-row>
              <el-row v-if="card.title !=='火灾信息' && card.title !=='警情信息'">
                <el-col :span="12" class="cardContent">
                  {{card.status || '-'}}:
                  <span>{{card.ccqk}}</span> -->
                </el-col>
              </el-row>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
      <!-- //- 警情信息详情组件 -->
      <top-detail v-if="showJqFlag" v-loading="loading" :isShow="true" :jq-top-data="jqxxData" />
      <!-- 火灾详情 -->
      <fire-info v-if="showHzFlag" :propfrom="propfrom" />

      <cdDetail v-if="showCdFlag" :querycdbh="querycdbh" />
      <div v-if="showNoData" style="text-align:center;padding:100px 0px;">
        <img width="318" height="233" src="../../../../assets/image/icon-noData.png"/>
        <h4 style="width:100%">暂无{{name||''}}填报数据</h4>
      </div>
    </div>
    <div v-if="!showData" style="text-align:center;padding:200px 0px;">
        <img width="318" height="233" src="../../../../assets/image/noData.png"/>
        <h4 style="width:100%">该大队还未填报</h4>
    </div>
  </div>
</template>

<script>
import { jqxxDatilInfo, jqxxListDatails, jqxxZdTab } from '@/api/data/entry/jqxx'
import fireInfo from '@/views/data/entry/zqxx/components/fireInfo'
import disasterSituationReport from '@/views/data/entry/zqxx/components/disasterInfomation'
import cdDetail from '@/views/eqw/dataSearch/components/cdDetail'
// 顶部 警情信息 组件
import topDetail from '@/views/data/entry/zqxx/components/topDetail.vue'

export default {
  name: 'jqxxDetail',
  components: {
    topDetail,
    disasterSituationReport,
    cdDetail,
    fireInfo
  },
  data() {
    return {
      showTitle:false,
      jqxxData: {},
      loading: false,
      cardList: [],
      name:'',
      showData:true,
      showHzFlag: false, // 火灾详情显示flag
      showJqFlag: false, // 警情详情显示flag
      showCdFlag: false, // 出动详情显示flag
      showNoData: false,
      propfrom: {
        state: false, // 是否显示警情头部信息
        jqbh: '', // 警情编号
        zqlbdm: '', // 火灾编号
        zqbh: '',
        jqfsdd: '', // 警情发生地点
        // 类型 0填报 1审核 2草稿修改
        type: '1',
        qwhz: '1',
        isNotEdit: true // 判断当前是否是编辑态
      },
      sjlbmc:'', // 判断是否是 火灾扑救 或者 抢险救援
      querycdbh: '',
      curIndex: 0 // 标识当前那个card被点击
    }
  },
  computed: {
    cardLength() {
      return Math.ceil(this.cardList.length / 6)
    },
    detalTitle() {
      let content = ''
      this.$route.query.jqmc ? content += this.$route.query.jqmc + `(${this.$route.query.jqbh})` : content += `警情编号：(${this.$route.query.jqbh})`
      return content
    }
  },
  created() {
    this.loading = true
    // this.getDeail()
    this.getCardList()
  },
  methods: {
    handleCardClick(index, card) {
      // 清空无数据时显示的图片
      this.showNoData && (this.showNoData = false)
      if (card.type === 0 && card.shzt != 0) {
        this.getJqDeail(card.jqbh)
      } else if (card.type === 1 && card.shzt != 0) {
        this.getCdDetail(card.cdbh)
      } else if (card.type === 2 && card.shzt != 0) {
        this.getHzDetail(card.cdbh, card.jqbh, card.qwhz)
      }else{
        this.showHzFlag = false;
        this.showJqFlag = false;
        this.showCdFlag = false;
        this.showNoData = true;
        this.name = card.name;
      }
      this.curIndex = index
    },
    getCardList() { // 查询某条警情下的出动和火灾信息
      const jqbh = this.$route.query.jqbh
      const param = { jqbh: jqbh  }
      const cardArr = []
      jqxxListDatails(param)
        .then(res => {
          //判断是否
          if (res.rows == null) {
            this.showData = false;
            return;
          }
          if (res.rows[0]) {
            this.showTitle = !res.rows[0].isYdwcd;
            this.showData = true;
            if (res.rows[0].cdxxtb != "0/0"||res.rows[0].isKqy!=='0') {
              this.sjlbmc = res.rows[0].sjlbmc.substr(0, 4) || '';
              cardArr.push({
                title: '警情信息',
                dw: '派发单位',
                time: '填报时间',
                dwVal: res.rows[0].tbzh,
                timeVal: res.rows[0].tbsj||"-",
                type: 0, // 0:表示警情1:表示出动2:表示火灾
                jqbh: res.rows[0].jqbh,
              })
            }
            if (res.rows[0].jlist && res.rows[0].jlist.length > 0 && res.rows[0].isCorps !== '1') {
              res.rows[0].jlist.forEach(element =>{
                // console.log("xxx",element)
                if(element.xfdwlx === '火灾报告') { cardArr.push({
                  title: '火灾信息',
                  name:'火灾信息',
                  dw: '填报单位',
                  time: '填报时间',
                  status: '报告状态',
                  dwVal: element.tbzh || element.xfdwmc,
                  // timeVal: element.qwhz?'轻微火灾':"非轻微火灾",
                  timeVal: element.shzt?element.tbsj:"-",
                  type: 2, // 0:表示警情1:表示出动2:表示火灾
                  cdbh: element.cdbh,
                  qwhz: element.qwhz,
                  jqbh: element.jqbh,
                  shzt: element.shzt,
                  // jjss:element.zjjjss,
                })};
              })
            };
            if (res.rows[0].jlist && res.rows[0].jlist.length > 0) {
              res.rows[0].jlist.forEach(element =>{
                if(element.xfdwlx !== '火灾报告'){
                cardArr.push({
                  title: `出动信息` + `${element.xfdwlx ? '('+element.xfdwlx+')' : ''}`,
                  name:'出动信息',
                  dw: '填报单位',
                  time: '填报时间',
                  status: '报告状态',
                  dwVal: element.tbzh  || element.xfdwmc,
                  timeVal: element.shzt?element.tbsj:"-",
                  type: 1, // 0:表示警情1:表示出动2:表示火灾
                  cdbh: element.cdbh,
                  shzt: element.shzt,
                  // ccqk:element.czqkdm,
                })};
              })
            }
          }
          jqbh?
          jqxxZdTab(jqbh).then(r=>{
            if(r.code===200){
              r.rows.forEach(s=>{
                cardArr.push({
                  title: '增援总队',
                  name:'增援总队',
                  dw: '队伍名称',
                  time: '填报时间',
                  status: '状态',
                  dwVal: s.deptName||'-',
                  timeVal: "-",
                  type: 3, // 0:表示警情1:表示出动2:表示火灾
                  shzt: s.zt
                })
              })
            }
          }):''
          this.cardList = cardArr
          console.log("====",this.cardList)
          this.loading = false
          // this.handleCardClick(0, this.cardList[0])
        })
        .catch(res => {
          this.loading = false;
          this.showData = false;
        })
    },
    getJqDeail(jqbh) { // 查询警情信息
      jqxxDatilInfo({ jqbh: jqbh })
        .then(res => {
          if (res.code === 200) {
            if (res.data == undefined) {
              this.showHzFlag = false;
              this.showJqFlag = false;
              this.showCdFlag = false;
              this.showNoData = true;
              this.name = "警情信息";
              this.loading = false;
              this.cardList[0].shzt = false;
              return;
            }
            res.data.jqxxCdxfdws = res.data.jqxxCdxfdws.filter(r=>r.xfdwdm||r.xfdwmc)
            this.jqxxData = res.data;
            this.cardList[0].shzt = 'all';
            this.loading = false;
          }
        })
        .catch(res => {
          this.loading = false
        })
      this.showHzFlag = false
      this.showJqFlag = true
      this.showCdFlag = false
    },
    getCdDetail(cdbh) {
      this.querycdbh = cdbh
      this.showHzFlag = false
      this.showJqFlag = false
      this.showCdFlag = true
    },
    getHzDetail(cdbh, jqbh, qwhz) {
      if (!jqbh || !cdbh) {
        this.showHzFlag = false
        this.showJqFlag = false
        this.showCdFlag = false
        this.showNoData = true
        return;
      }
      this.propfrom.jqbh = jqbh
      this.propfrom.zqbh = cdbh
      this.propfrom.qwhz = qwhz
      this.showHzFlag = true
      this.showJqFlag = false
      this.showCdFlag = false
    },
    changePageHandler(index) {
      this.handleCardClick(index * 6, this.cardList[index * 6])
      this.curIndex = 0
    }
  }
}
</script>
<style lang='stylus' scoped>
@import '~@/assets/styles/mixin.styl'
.detail_page>>>.el-form-item__label
  // display: flex;
  // align-items: center;
  // justify-content: flex-end;
  // text-align: right;
  // height 32px
  // padding 10px 0 0
.detail_page
  background #F1F2F4
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
    margin: 0px 15px
    img
      width 26px
      margin-right 15px
    div
      flex 1
      text-align left
  .content
    padding 22px 60px
    .item
      color #37394C
  .cardContainer {
    width:180px;
    height:86px;
    background:rgba(255,255,255,1);
    border-radius:4px 4px 0px 0px;
    border:1px solid rgba(219,222,224,1);
    border-bottom:none;
    padding: 0px 5px;
    margin: 8px 8px 0px 0px;
    cursor:pointer;

  }
  .cardContainer.active{
    background :#437FDF;
    border:none;
    box-shadow:5px 1px 7px -2px rgba(0, 0, 0, 0.3);
    // box-shadow:3px 5px 5px 0px rgba(0,0,0,0.2);
    span{
      color :#fff;
    }
  }
  >>>.el-carousel__arrow {
    top:35%;
    display : block !important;
  }
  >>>.el-carousel__indicators{
    display:none;
  }
  .cardTitle {
    text-align: center;
    height: 20px;
    font-size: 14px;
    line-height: 20px;
    font-weight: 500;
    color: rgba(51,51,51,1);
    margin: 5px 0;
  }
  .cardTitle:before
    content '●'
    display inline-block
    margin-right 3px
    font-size 16px
  .dot_success
    &:before
      color #27CA3F
  .dot_error
    &:before
      color #F54336
  .active .cardTitle,.active .cardContent {
    color :#FFFFFF;
  }

  .cardContent {
    height: 17px;
    font-size: 12px;
    font-weight: 500;
    width:100%;
    color: rgba(153,153,153,1);
    line-height: 17px;
    // text-align: center;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    span{
      color:#666;
    }
  }
.detail_content {
  background: #fff;
  margin: 10px 15px;
}
</style>
<style lang="scss">
.detail_page{
  .el-carousel__arrow{
    background-color: rgba(0,0,0,0.45);
  }
}

</style>
