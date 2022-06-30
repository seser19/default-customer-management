<template>
  <div class="djList app-container">
    <div class="reporting-title">
      <h2>{{$route.meta.title}}</h2>
    </div>
    <!--    <el-dialog-->
    <!--      title="火灾现场情况登记表"-->
    <!--      :visible.sync="xcdjsh"-->
    <!--      width="90%"-->
    <!--      center-->
    <!--    >-->
    <!--      <div class="xcdjyl">-->
    <!--        <table-->
    <!--          border="1"-->
    <!--          bordercolor="#a0c6e5"-->
    <!--          style="border-collapse:collapse;"-->
    <!--        >-->
    <!--          <tr>-->
    <!--            <td class="td4-1">报警时间</td>-->
    <!--            <td class="td4-2">{{ xcdjdata.bjsj }}</td>-->
    <!--            <td class="td4-1">起火单位/户主</td>-->
    <!--            <td class="td4-2">{{ xcdjdata.qhdw }}</td>-->
    <!--          </tr>-->
    <!--          <tr>-->
    <!--            <td class="td2">起火地址</td>-->
    <!--            <td colspan="3">{{ xcdjdata.qhdz }}</td>-->
    <!--          </tr>-->
    <!--          <tr>-->
    <!--            <td>联系人</td>-->
    <!--            <td>{{ xcdjdata.lxr }}</td>-->
    <!--            <td>联系电话</td>-->
    <!--            <td>{{ xcdjdata.lxdh }}</td>-->
    <!--          </tr>-->
    <!--          <tr>-->
    <!--            <td>场所类型</td>-->
    <!--            <td>{{ xcdjdata.cslx }}</td>-->
    <!--            <td>起火物</td>-->
    <!--            <td>{{ xcdjdata.qhw }}</td>-->
    <!--          </tr>-->
    <!--          <tr>-->
    <!--            <td>过火面积</td>-->
    <!--            <td>{{ xcdjdata.ghmj }}</td>-->
    <!--            <td>直接财产损失</td>-->
    <!--            <td>{{ xcdjdata.zjccss }}</td>-->
    <!--          </tr>-->
    <!--          <tr>-->
    <!--            <td>火灾发生经过</td>-->
    <!--            <td colspan="3">{{ xcdjdata.hzfsjg }}</td>-->
    <!--          </tr>-->
    <!--          <tr>-->
    <!--            <td>烧损物品</td>-->
    <!--            <td colspan="3">{{ xcdjdata.shwp }}</td>-->
    <!--          </tr>-->
    <!--          <tr>-->
    <!--            <td>火灾原因</td>-->
    <!--            <td>{{ xcdjdata.hzyy }}</td>-->
    <!--            <td>受灾户数</td>-->
    <!--            <td>{{ xcdjdata.szhs }}</td>-->
    <!--          </tr>-->
    <!--          <tr>-->
    <!--            <td>情况说明</td>-->
    <!--            <td>人员伤亡:{{ xcdjdata.sfrysw === 1 ? '是' : '否' }}</td>-->
    <!--            <td>保险情况:{{ xcdjdata.sfbx === 1 ? '是' : '否' }}</td>-->
    <!--            <td>纠纷情况:{{ xcdjdata.sfjf === 1 ? '是' : '否' }}</td>-->
    <!--          </tr>-->
    <!--          <tr>-->
    <!--            <td>当事人签名</td>-->
    <!--            <td><img :src="xcdjdata.dsrqmAfImage"/></td>-->
    <!--            <td>签名时间</td>-->
    <!--            <td>{{ xcdjdata.dsrQmsjAfDate }}</td>-->
    <!--          </tr>-->
    <!--          <tr>-->
    <!--            <td>登记人签名（消防站指挥员）</td>-->
    <!--            <td><img :src="xcdjdata.djrqmAfImage"/></td>-->
    <!--            <td>登记时间</td>-->
    <!--            <td>{{ xcdjdata.djsjAfDate }}</td>-->
    <!--          </tr>-->
    <!--          <tr>-->
    <!--            <td>大队长签名</td>-->
    <!--            <td><img :src="xcdjdata.ddzqmAfImage"/></td>-->
    <!--            <td>签名时间</td>-->
    <!--            <td>{{ xcdjdata.ddzQmsjAfDate }}</td>-->
    <!--          </tr>-->
    <!--        </table>-->
    <!--      </div>-->
    <!--      <div class="ddshtj">-->
    <!--        <el-radio-group v-model="xcshRadio">-->
    <!--          <el-radio :label="2">-->
    <!--            <el-tag type="success">通过</el-tag>-->
    <!--          </el-radio>-->
    <!--          <el-radio :label="4">-->
    <!--            <el-tag type="danger">驳回</el-tag>-->
    <!--          </el-radio>-->
    <!--        </el-radio-group>-->
    <!--        <p>-->
    <!--          <el-button type="success" @click="()=>{submit('xcdj')}">审核提交</el-button>-->
    <!--        </p>-->
    <!--      </div>-->
    <!--    </el-dialog>-->
    <el-dialog title="火灾移送登记表" @close="ysColse" :visible.sync="ysgzsh" width="90%" center>
      <div class="ysgzyl">
        <table
          border="1"
          bordercolor="#a0c6e5"
          style="border-collapse:collapse;"
          v-if="ysgzData.tshzpd"
        >
          <tr>
            <td class="td4-1">报警时间</td>
            <td class="td4-2">{{ ysgzData.bjsj }}</td>
            <td class="td4-1">起火单位/户主</td>
            <td class="td4-2">{{ ysgzData.qhdw }}</td>
          </tr>
          <tr>
            <td class="td2">起火地址</td>
            <td colspan="3">{{ ysgzData.qhdz }}</td>
          </tr>
          <tr>
            <td>联系人</td>
            <td>{{ ysgzData.lxr }}</td>
            <td>联系电话</td>
            <td>{{ ysgzData.lxdh }}</td>
          </tr>
          <tr>
            <td rowspan="5">特殊火灾判断</td>
            <td style="text-align: left;padding-left: 5%;">
              <el-checkbox :value="!!ysgzData.tshzpd ['1']"
              >属军铁交航森等
              </el-checkbox
              >
            </td>
            <td style="text-align: left;padding-left: 5%;">
              <el-checkbox :value="!!ysgzData.tshzpd ['6']">电缆井</el-checkbox>
            </td>
            <td style="text-align: left;padding-left: 5%;">
              <el-checkbox :value="!!ysgzData.tshzpd ['11']"
              >有人员伤亡
              </el-checkbox
              >
            </td>
          </tr>
          <tr>
            <td style="text-align: left;padding-left: 5%;">
              <el-checkbox :value="!!ysgzData.tshzpd ['2']">中途返回</el-checkbox>
            </td>
            <td style="text-align: left;padding-left: 5%;">
              <el-checkbox :value="!!ysgzData.tshzpd ['7']">地下建筑</el-checkbox>
            </td>
            <td style="text-align: left;padding-left: 5%;">
              <el-checkbox :value="!!ysgzData.tshzpd ['12']"
              >有放火嫌疑
              </el-checkbox
              >
            </td>
          </tr>
          <tr>
            <td style="text-align: left;padding-left: 5%;">
              <el-checkbox :value="!!ysgzData.tshzpd ['3']"
              >非大队辖区
              </el-checkbox
              >
            </td>
            <td style="text-align: left;padding-left: 5%;">
              <el-checkbox :value="!!ysgzData.tshzpd ['8']"
              >大型综合体
              </el-checkbox
              >
            </td>
            <td style="text-align: left;padding-left: 5%;">
              <el-checkbox :value="!!ysgzData.tshzpd ['13']"
              >损失超5000元
              </el-checkbox
              >
            </td>
          </tr>
          <tr>
            <td style="text-align: left;padding-left: 5%;">
              <el-checkbox :value="!!ysgzData.tshzpd ['4']"
              >大队重点单位
              </el-checkbox
              >
            </td>
            <td style="text-align: left;padding-left: 5%;">
              <el-checkbox :value="!!ysgzData.tshzpd ['9']">化工场所</el-checkbox>
            </td>
            <td style="text-align: left;padding-left: 5%;">
              <el-checkbox :value="!!ysgzData.tshzpd ['14']"
              >有赔偿纠纷
              </el-checkbox
              >
            </td>
          </tr>
          <tr>
            <td style="text-align: left;padding-left: 5%;">
              <el-checkbox :value="!!ysgzData.tshzpd ['5']"
              >支队重点单位
              </el-checkbox
              >
            </td>
            <td style="text-align: left;padding-left: 5%;">
              <el-checkbox :value="!!ysgzData.tshzpd ['10']"
              >当事人不在场
              </el-checkbox
              >
            </td>
            <td style="text-align: left;padding-left: 5%;">
              <el-checkbox :value="!!ysgzData.tshzpd ['15']"
              >当事人有异议
              </el-checkbox
              >
            </td>
          </tr>
          <tr>
            <td rowspan="3">13类重点场所火灾判断</td>
            <td colspan="3" style="text-align: left;">
              <el-checkbox
                :value="rymjcs"
                border
                style="margin:10px;"
              >人员密集场所
              </el-checkbox
              >
              (
              <el-checkbox
                v-for="item in mjcs7"
                :key="item.title"
                :value="!!ysgzData.mjcs7[item.value]"
                style="margin:10px;"
              >{{ item.title }}
              </el-checkbox
              >
              )
            </td>
          </tr>
          <tr>
            <td style="text-align: left;padding-left: 5%;">
              <el-checkbox :value="!!ysgzData.qtcs6['8']"
              >“多合一”场所
              </el-checkbox
              >
            </td>
            <td style="text-align: left;padding-left: 5%;">
              <el-checkbox :value="!!ysgzData.qtcs6['9']">群租房</el-checkbox>
            </td>
            <td style="text-align: left;padding-left: 5%;">
              <el-checkbox :value="!!ysgzData.qtcs6['10']"
              >公共高层建筑
              </el-checkbox
              >
            </td>
          </tr>
          <tr>
            <td style="text-align: left;padding-left: 5%;">
              <el-checkbox :value="!!ysgzData.qtcs6['11']">文博单位</el-checkbox>
            </td>
            <td style="text-align: left;padding-left: 5%;">
              <el-checkbox :value="!!ysgzData.qtcs6['12']">园区企业</el-checkbox>
            </td>
            <td style="text-align: left;padding-left: 5%;">
              <el-checkbox :value="!!ysgzData.qtcs6['13']">施工工地</el-checkbox>
            </td>
          </tr>
          <tr>
            <td>移送告知记录</td>
            <td colspan="3" style="text-align: left;padding: 10px;">
              <h5>
                支队指挥中心，我是<span>{{ ysgzData.zdName }}</span
              >消防站指挥员，经核实， <span>{{ ysgzData.qhdw }}</span
              >火灾不属于我站<span>{{
                  ysgzData.fzdfw === 1 ? '登记' : '调查'
                }}</span
              >范围，请通知{{ ysgzData.ddName }}大队派人按程序<span>{{
                  ysgzData.ddfw === 1 ? '登记' : '调查'
                }}</span>
              </h5>
            </td>
          </tr>
          <tr>
            <td>移送告知人签名</td>
            <td><img class="qm" :src="ysgzData.zdzhyqmAfImage"/></td>
            <td>移送告知时间</td>
            <td>{{ ysgzData.ysgzAfDate }}</td>
          </tr>
          <tr>
            <td>备 注</td>
            <td colspan="3">{{ ysgzData.bz }}</td>
          </tr>
          <tr v-if="ysgzData.imgs.length">
            <td>照片</td>
            <td colspan="3">
              <div class="picYl">
                <div class="box" v-for="(item,index) in ysgzData.imgs" :key="item+index">
                  <el-image :preview-src-list="ysgzData.imgs" :src="item"/>
                  <p v-if="ysgzData.imgsDesc[index]">图片说明：{{ ysgzData.imgsDesc[index] }}</p>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>审核</td>
            <td colspan="3" class="left">
              <el-radio-group v-model="ysshRadio">
                <el-radio :label="2">
                  <el-tag type="success">通过</el-tag>
                </el-radio>
                <el-radio :label="4">
                  <el-tag type="danger">驳回</el-tag>
                </el-radio>
              </el-radio-group>
            </td>
          </tr>
          <tr>
            <td>审核选项</td>
            <td colspan="3" class="left">
              <el-radio-group v-if="ysshRadio===2&&!isZd" v-model="ysshRadioItem">
                <el-radio :label="666">
                  <el-tag>现场登记</el-tag>
                </el-radio>
                <el-radio :label="2">
                  <el-tag>调查</el-tag>
                </el-radio>
              </el-radio-group>
              <el-radio v-if="ysshRadio===2&&isZd" :label="2" v-model="ysshRadioItem">
                <el-tag>调查</el-tag>
              </el-radio>
              <el-form v-if="ysshRadio===4">
                <el-form-item label="驳回问题类型:" :rules="[{ required: true, message: '问题类型不能为空'}]">
                  <el-select v-model="issue.issue_type">
                    <el-option v-for="item in issue_type" :value="item" :key="item"/>
                  </el-select>
                </el-form-item>
                <el-form-item label="驳回问题描述:" :rules="[{ required: true, message: '问题描述不能为空'}]">
                  <el-input style="width: 400px" type="textarea" v-model="issue.issue_desc"/>
                </el-form-item>
              </el-form>
            </td>
          </tr>
        </table>
      </div>
      <div slot="footer" style="text-align: center;">
        <el-button type="success" @click="()=>{submit('ysgz')}">提交</el-button>
      </div>
    </el-dialog>
    <el-row :gutter="24">
      <el-form label-position="left" :model="sx">
        <el-col :span="8">
          <el-form-item>
            <el-input placeholder="编号" v-model="sx.jqbh" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-input placeholder="地址" v-model="sx.adress" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-input placeholder="发送单位" v-model="sx.fsdw" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <date-time-range ref="dateTimeRange" :format="`date`" @selectTime="dateChange"></date-time-range>
          </el-form-item>
        </el-col>
        <el-col :span="3" :offset="4">
          <el-button @click="cx" type="primary" style="width: 100%;">查询</el-button>
        </el-col>
      </el-form>
    </el-row>
    <el-tabs v-model="activeName" type="card" style="width:100%">
      <!--      <el-tab-pane label="火灾现场情况登记表" name="first">-->
      <!--        <el-table :data="tableData01" border v-loading="xcdjLoading">-->
      <!--          <el-table-column prop="djbh" label="填报编号"></el-table-column>-->
      <!--          <el-table-column prop="bjsj" label="填报时间"></el-table-column>-->
      <!--          <el-table-column prop="qhdz" label="登记地址"></el-table-column>-->
      <!--          <el-table-column prop="zdDeptid" label="中队名称"></el-table-column>-->
      <!--          <el-table-column width="90" label="操作">-->
      <!--            <template slot-scope="scope">-->
      <!--              <el-button @click="xcdjClick(scope.row)" type="text" size="small"-->
      <!--              >审核-->
      <!--              </el-button-->
      <!--              >-->
      <!--            </template>-->
      <!--          </el-table-column>-->
      <!--        </el-table>-->
      <!--        <div class="page">-->
      <!--          <el-pagination-->
      <!--            @current-change="CurrentChange01"-->
      <!--            :page-size="pageSize01"-->
      <!--            layout="prev, pager, next, jumper"-->
      <!--            :total="total01"-->
      <!--          >-->
      <!--          </el-pagination>-->
      <!--        </div>-->
      <!--      </el-tab-pane>-->
      <el-tab-pane label="火灾移送告知记录表" name="second">
        <el-table :data="tableData02" v-loading="ysgzLoading">
          <el-table-column prop="ysbh" width="150" label="移送编号"></el-table-column>
          <el-table-column prop="bjsj" width="200" label="移送时间"></el-table-column>
          <el-table-column prop="qhdz" show-overflow-tooltip label="详细地址"></el-table-column>
          <el-table-column prop="zdName" show-overflow-tooltip label="中队名称"></el-table-column>
          <el-table-column width="90" label="操作">
            <template slot-scope="scope">
              <el-button @click="ysgzClick(scope.row)" type="text" size="small"
              >审核
              </el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="page">
          <el-pagination
            @current-change="CurrentChange02"
            :page-size="pageSize02"
            layout="prev, pager, next"
            :total="total02"
            background
          >
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {
  postXcdjSh,
  postYsgzSh,
  getXcdjCxData,
  getYsgzCxData,
  sfzd
} from '@/api/data/entry/hzdj'
import dateTimeRange from "@/views/components/dateTime/dateTimeRange.vue";
import Time from 'moment'

export default {
  name: 'xcdjlist',
  components:{dateTimeRange},
  mounted() {
    this.cx();
    sfzd().then(r=>{
      this.isZd = !!r.data
      if(this.isZd){
        this.ysshRadioItem = 2
        console.log(this.ysshRadioItem)
      }
    })
  },
  watch: {
    activeName() {
      this.cx();
    }
  },
  computed: {
    rymjcs() {
      return Object.keys(this.ysgzData.mjcs7).length ? true : false
    }
  },
  methods: {
    xcdjClick(row) {
      this.xcdjsh = true
      this.xcdjdata = row
    },
    ysgzClick(row) {
      this.ysgzsh = true
      this.ysgzData = row
    },
    dateChange(data) {
      this.sx.startTime = data.ksrq;
      this.sx.endTime = data.jsrq;
    },
    cx() {
      if (Object.keys(this.sx).length !== 0) {
        if (this.sx['startTime']) {
          if (!this.sx['endTime']) {
            this.open()
            return
          }
        } else if (this.sx['endTime']) {
          if (!this.sx['startTime']) {
            this.open()
            return
          }
        }
        const ruselt = {
          djbh: this.sx.jqbh || '',
          qhdz: this.sx.adress || '',
          zdDeptid: this.sx.fsdw || '',
          params: {
            beginTime: this.sx.startTime,
            endTime: this.sx.endTime
          }
        }
        if (this.activeName === 'first') {
          this.getCxData('xcdj', ruselt)
        } else if (this.activeName === 'second') {
          delete ruselt.djbh
          ruselt.ysbh = this.sx.jqbh || ''
          this.getCxData('ysgz', ruselt)
        }
      }
    },
    open() {
      this.$alert('时间不能只输入一个', '警告', {
        confirmButtonText: '确定',
        callback: () => {
        }
      })
    },
    CurrentChange01(v) {
      this.currentPage01 = v
      this.cx()
    },
    CurrentChange02(v) {
      this.currentPage02 = v
      this.cx()
    },
    getCxData(type, ruselt) {
      if (type === 'xcdj') {
        this.xcdjLoading = true
        getXcdjCxData(ruselt).then(r => {
          this.pageSize01 = r.total
          this.total01 = r.total
          this.tableData01 = this.clData('xcdj', r.rows)
          this.xcdjLoading = false
        })
      } else {
        this.ysgzLoading = true
        getYsgzCxData(ruselt).then(r => {
          this.pageSize02 = r.total
          this.total02 = r.total
          this.tableData02 = this.clData('ysgz', r.rows)
          this.ysgzLoading = false
        })
      }

    },
    clData(type, item) {
      const result = JSON.parse(JSON.stringify(item))
      const format = 'YYYY年MM月DD日 HH时mm分'
      if (type === 'xcdj') {
        result.map(item => {
          item.bjsj = Time(item.bjsj).format(format)
          item.ddzQmsjAfDate = Time(item.ddzQmsjAfDate).format(format)
          item.djsjAfDate = Time(item.djsjAfDate).format(format)
          item.dsrQmsjAfDate = Time(item.dsrQmsjAfDate).format(format)
          item.imgs = item.imgs ? item.imgs.split(',').map(i => process.env.VUE_APP_BASE_API + i) : []
          item.imgsDesc = item.imgsDesc ? item.imgsDesc.split('||') : []
          return item
        })
        return result
      } else if (type === 'ysgz') {
        result.map(item => {
          const tshzpdObj = {},
            qtcs6Obj = {},
            mjcs7Obj = {}
          item.bjsj = Time(item.bjsj).format(format)
          item.ysgzAfDate = Time(item.ysgzAfDate).format(format)
          item.tshzpd ? item.tshzpd.split(',').forEach(r => {
            tshzpdObj[r] = true
          }) : item.tshzpd = []
          item.tshzpd = tshzpdObj
          item.qtcs6 ? item.qtcs6.split(',').forEach(r => {
            qtcs6Obj[r] = true
          }) : item.qtcs6 = []
          item.qtcs6 = qtcs6Obj
          item.mjcs7 ? item.mjcs7.split(',').forEach(r => {
            mjcs7Obj[r] = true
          }) : item.mjcs7 = []
          item.mjcs7 = mjcs7Obj
          item.imgs = item.imgs ? item.imgs.split(',').map(i => process.env.VUE_APP_BASE_API + i) : []
          item.imgsDesc = item.imgsDesc ? item.imgsDesc.split('||') : []
          return item
        })
        return result
      }
    },
    submit(type) {
      if (type === 'xcdj') {
        postXcdjSh({ djbh: this.xcdjdata.djbh, shzt: this.xcshRadio }).then(r => {
          this.$message({
            message: r.msg,
            type: 'success'
          })
          this.xcdjsh = false
          this.cx()
        })
      } else {
        let result = this.ysshRadio === 2 ? this.ysshRadioItem : this.ysshRadio
        let data = { ysbh: this.ysgzData.ysbh, shzt: result }
        if (result === 4) {
          if (!this.issue.issue_type || !this.issue.issue_desc) {
            this.$message.warning('驳回原因不能为空！')
            return
          }
          data = { ...data, ...this.issue }
        }
        postYsgzSh(data).then(r => {
          this.$message({
            message: r.msg,
            type: 'success'
          })
          this.ysgzsh = false
          this.cx()
        })
      }
    },
    ysColse() {
      this.ysshRadio = 2
      this.issue = {
        issue_type: '数据不准确',
        issue_desc: ''
      }
    }
  },

  data() {
    return {
      tableData01: [],
      tableData02: [],
      activeName: 'second',
      sx: {},
      pageSize01: 10,
      pageSize02: 10,
      currentPage01: 1,
      currentPage02: 1,
      total01: 0,
      total02: 0,
      xcdjsh: false,
      ysgzsh: false,
      xcdjLoading: false,
      ysgzLoading: false,
      xcdjdata: {},
      ysgzData: {},
      xcshRadio: 2,
      ysshRadio: 2,
      ysshRadioItem: 666,
      mjcs7: [
        {
          title: '商场市场',
          value: '1'
        },
        {
          title: '公共娱乐场所',
          value: '2'
        },
        {
          title: '宾馆饭店',
          value: '3'
        },
        {
          title: '养老院',
          value: '4'
        },
        {
          title: '医院',
          value: '5'
        },
        {
          title: '寄宿制学校和幼儿园',
          value: '6'
        },
        {
          title: '劳动密集型企业',
          value: '7'
        }
      ],
      issue_type: ['数据不准确', '数据错误', '信息不全'],
      issue: {
        issue_type: '数据不准确',
        issue_desc: ''
      },
      isZd:false
    }
  }
}
</script>

<style lang="scss" scoped>
  .page {
    margin: 10px;
    text-align: right;
  }

.xcdjyl, .ysgzyl {
  table {
    width: 100%;
    height: 100%;
    text-align: center;
    table-layout: fixed;
    word-wrap: break-word;

    .td4-1 {
      width: 20%;
    }

    .td4-2 {
      width: 30%;
    }

    .td3 {
      width: 33.3%;
    }

    tr {
      td {
        height: 50px;
        padding: 10px;
      }
    }

    .left {
      text-align: left;
      padding-left: 70px;
    }
  }
}

.issue {
  text-align: left;
  width: 600px;
  margin-left: 200px;
}

.ysgzyl {

  .ysgzjl {
    display: block;
    border: 1px dashed #8d8d8da6;
    padding: 10px;
    margin: 10px 0;

    h4 {
      text-align: center;
      margin: 10px 0;
    }

    h5 {
      color: #00000077;

      span {
        margin: 0 5px;
        color: #000;
      }
    }
  }
}

.picYl {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  padding: 10px;

  .box {
    width: 30%;
    border: 1px solid #1c84c6;
    padding: 10px;

    p {
      text-align: left;
      font-size: 15px;
    }
  }
}

.qm {
  height: 150px;
  transform: rotate(-90deg);
}
</style>
