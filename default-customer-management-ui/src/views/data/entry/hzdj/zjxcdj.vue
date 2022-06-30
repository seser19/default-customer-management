<template>
  <div class="djList app-container">
    <div class="reporting-title">
      <h2>{{$route.meta.title}}</h2>
    </div>
    <el-dialog
      title="火灾现场情况登记表"
      :visible.sync="xcdjsh"
      width="90%"
      center
    >
      <div class="xcdjyl">
        <table
          border="1"
          bordercolor="#a0c6e5"
          style="border-collapse:collapse;"
          v-if="Object.keys(xcdjdata).length"
        >
          <tr>
            <td class="td2">起火时间</td>
            <td colspan="3">{{ xcdjdata.bjsj }}</td>
          </tr>
          <tr>
            <td class="td2">起火地址</td>
            <td colspan="3">{{ xcdjdata.qhdz }}</td>
          </tr>
          <tr>
            <td class="td2">起火单位</td>
            <td colspan="3">{{ xcdjdata.qhdw }}</td>
          </tr>
          <tr>
            <td class="td4-1">联系人</td>
            <td class="td4-2">{{ xcdjdata.lxr }}</td>
            <td class="td4-1">联系电话</td>
            <td class="td4-2">{{ xcdjdata.lxdh }}</td>
          </tr>
          <tr>
            <td>场所类型</td>
            <td>{{ xcdjdata.cslx }}</td>
            <td>起火物</td>
            <td>{{ xcdjdata.qhw }}</td>
          </tr>
          <tr>
            <td>过火面积</td>
            <td>{{ xcdjdata.ghmj }}</td>
            <td>直接经济损失</td>
            <td>{{ xcdjdata.zjccss }}</td>
          </tr>
          <tr>
            <td class="td2">保险情况</td>
            <td colspan="3">{{ xcdjdata.sfbx === 1 ? '是' : '否' }}</td>
          </tr>
          <tr>
            <td>当事人签名</td>
            <td><img class="qm" :src="xcdjdata.dsrqmAfImage"/></td>
            <td>签名时间</td>
            <td>{{ xcdjdata.dsrQmsjAfDate }}</td>
          </tr>
          <tr>
            <td>统计人签名（消防站指挥员）</td>
            <td><img class="qm" :src="xcdjdata.djrqmAfImage"/></td>
            <td>统计时间</td>
            <td>{{ xcdjdata.djsjAfDate }}</td>
          </tr>
          <tr>
            <td>大队长签名</td>
            <td><img class="qm" :src="xcdjdata.ddzqmAfImage"/></td>
            <td>签名时间</td>
            <td>{{ xcdjdata.ddzQmsjAfDate }}</td>
          </tr>
          <tr v-if="xcdjdata.imgs.length">
            <td>照片</td>
            <td colspan="3">
              <div class="picYl">
                <div class="box" v-for="(item,index) in xcdjdata.imgs" :key="item+index">
                  <el-image :preview-src-list="xcdjdata.imgs" :src="item"/>
                  <p v-if="xcdjdata.imgsDesc[index]">图片说明：{{ xcdjdata.imgsDesc[index] }}</p>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td class="td2">备注</td>
            <td colspan="3">{{ xcdjdata.bz }}</td>
          </tr>
          <tr v-if="xcdjdata.shzt===4">
            <td>驳回问题类型</td>
            <td colspan="3">{{ issue_type }}</td>
          </tr>
          <tr v-if="xcdjdata.shzt===4">
            <td>驳回问题描述</td>
            <td colspan="3">{{ issue_desc }}</td>
          </tr>
        </table>
      </div>
      <div class="ddshtj">
        <p>
          <el-button type="success" @click="()=>{submit('xcdj')}">完成</el-button>
        </p>
      </div>
    </el-dialog>
    <el-dialog title="火灾移送登记表" :visible.sync="ysgzsh" width="90%" center>
      <div class="ysgzyl">
        <table
          border="1"
          bordercolor="#a0c6e5"
          style="border-collapse:collapse;"
          v-if="Object.keys(ysgzData).length"
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
              </el-checkbox>
            </td>
            <td style="text-align: left;padding-left: 5%;">
              <el-checkbox :value="!!ysgzData.tshzpd ['6']">电缆井</el-checkbox>
            </td>
            <td style="text-align: left;padding-left: 5%;">
              <el-checkbox :value="!!ysgzData.tshzpd ['11']"
              >有人员伤亡
              </el-checkbox>
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
              </el-checkbox>
            </td>
          </tr>
          <tr>
            <td style="text-align: left;padding-left: 5%;">
              <el-checkbox :value="!!ysgzData.tshzpd ['3']"
              >非大队辖区
              </el-checkbox>
            </td>
            <td style="text-align: left;padding-left: 5%;">
              <el-checkbox :value="!!ysgzData.tshzpd ['8']"
              >大型综合体
              </el-checkbox>
            </td>
            <td style="text-align: left;padding-left: 5%;">
              <el-checkbox :value="!!ysgzData.tshzpd ['13']"
              >损失超5000元
              </el-checkbox>
            </td>
          </tr>
          <tr>
            <td style="text-align: left;padding-left: 5%;">
              <el-checkbox :value="!!ysgzData.tshzpd ['4']"
              >大队重点单位
              </el-checkbox>
            </td>
            <td style="text-align: left;padding-left: 5%;">
              <el-checkbox :value="!!ysgzData.tshzpd ['9']">化工场所</el-checkbox>
            </td>
            <td style="text-align: left;padding-left: 5%;">
              <el-checkbox :value="!!ysgzData.tshzpd ['14']"
              >有赔偿纠纷
              </el-checkbox>
            </td>
          </tr>
          <tr>
            <td style="text-align: left;padding-left: 5%;">
              <el-checkbox :value="!!ysgzData.tshzpd ['5']"
              >支队重点单位
              </el-checkbox>
            </td>
            <td style="text-align: left;padding-left: 5%;">
              <el-checkbox :value="!!ysgzData.tshzpd ['10']"
              >当事人不在场
              </el-checkbox>
            </td>
            <td style="text-align: left;padding-left: 5%;">
              <el-checkbox :value="!!ysgzData.tshzpd ['15']"
              >当事人有异议
              </el-checkbox>
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
              </el-checkbox>
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
          <tr v-if="ysgzData.shzt===4">
            <td>驳回问题类型</td>
            <td colspan="3">{{ issue_type }}</td>
          </tr>
          <tr v-if="ysgzData.shzt===4">
            <td>驳回问题描述</td>
            <td colspan="3">{{ issue_desc }}</td>
          </tr>
        </table>
      </div>
      <div class="ddshtj">
        <p>
          <el-button type="success" @click="()=>{submit('ysgz')}">完成</el-button>
        </p>
      </div>
    </el-dialog>
    <el-form :model="sx" label-position="right">
      <el-row :gutter="24">
        <el-col :span="6">
          <el-form-item>
            <el-input placeholder="编号" v-model="sx.jqbh"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-input placeholder="地址" v-model="sx.adress"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-select style="width: 100%;" v-model="sx.shzt" placeholder="审核状态">
              <el-option
                v-for="item in shzt"
                :key="item.value"
                :label="item.title"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item v-if="selectDD.length">
            <el-cascader
              placeholder="队伍名称"
              v-model="sx.ddDeptId"
              :options="selectDD"
              :props="selectProps"
              clearable
              style="width: 100%;"
            ></el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="6">
          <el-form-item v-if="activeName === 'first'">
            <el-input placeholder="火灾原因" :value="sx.hzyy.name" @focus="$refs.fireReasonMul.toggle()"/>
            <fireReasonMul ref="fireReasonMul" :multiple="true" @setFireReasonMulVal="setFireReasonMulVal"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-input placeholder="地区选择" :value="sx.area.name" @focus="$refs.areaSelect.toggle()"/>
            <area-select ref="areaSelect" @setProv="selectArea"></area-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item v-if="activeName === 'first'">
            <el-select style="width: 100%;" v-model="qhcsType" placeholder="起火场所" clearable>
              <el-option
                v-for="item in Options.qhcslb"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
            <fire-space-mul ref="qhcsSelect" :qhcsType="qhcsType" @setMulVals="setQhcs"/>
        </el-col>
        <el-col :span="6" v-if="qhcsType">
          <el-input :value="sx.qhcs.name"
                    @focus="$refs.qhcsSelect.toggle()"
                    placeholder="地区选择"
                    clearable
          />
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item>
            <date-time-range ref="dateTimeRange" :format="`date`" @selectTime="dateChange"></date-time-range>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-button @click="cxBtn" type="primary" style="width: 100%;">查询</el-button>
        </el-col>
        <el-col :span="3">
          <el-button @click="init" style="width: 100%;">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-tabs v-model="activeName" type="card" style="width:100%">
      <el-tab-pane label="火灾现场情况登记表" name="first">
        <el-table :data="tableData01" v-loading="xcdjLoading">
          <el-table-column prop="djbh" width="140" label="编号"></el-table-column>
          <el-table-column prop="bjsj" width="180" label="报警时间"></el-table-column>
          <el-table-column prop="qhdz" show-overflow-tooltip label="登记地址"></el-table-column>
          <!-- <el-table-column prop="hzyy" show-overflow-tooltip label="火灾原因"></el-table-column> -->
          <el-table-column prop="cslx" show-overflow-tooltip label="场所类型"></el-table-column>
          <el-table-column prop="xzqy" show-overflow-tooltip label="行政区域"></el-table-column>
          <el-table-column prop="zdDeptid" show-overflow-tooltip label="队伍名称"></el-table-column>
          <el-table-column width="80" prop="shzt" label="审核状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.shzt===2" type="success">已审核</el-tag>
              <el-tag v-else-if="scope.row.shzt===1">待审核</el-tag>
              <el-tag v-else-if="scope.row.shzt===4" type="danger">已驳回</el-tag>
            </template>
          </el-table-column>
          <el-table-column width="260" label="操作">
            <template slot-scope="scope" >
              <el-button @click="xcdjClick(scope.row)" type="text" size="small"
              >查看
              </el-button
              >
              <el-button v-if="scope.row.shzt === 2" @click="xzPDF(scope.row)" type="text" size="small"
              >下载PDF
              </el-button
              >
              <el-button v-if="scope.row.shzt === 2&&scope.row.imgs.length" @click="xzPic(scope.row)" type="text"
                         size="small"
              >导出图片
              </el-button
              >
              <el-button v-if="scope.row.shzt === 2" @click="djxxbh(scope.row)" v-hasRole="['djxxbh']" type="text"
                         size="small"
              >驳回
              </el-button
              >
              <el-button @click="djxxsc(scope.row)" v-hasRole="['djxxsc']" type="text" size="small">删除
              </el-button
              >
              <el-button
                size="mini"
                type="text"
                @click="confirmReset(scope.row,1)"
                v-hasPermi="['jydj:xqbg:reset']"        
              >重置</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page">
          <el-pagination
            @current-change="CurrentChange01"
            :page-size="pageSize01"
            layout="total,prev, pager, next"
            :total="total01"
            :current-page="currentPage01"
            background
          >
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="火灾移送告知记录表" name="second">
        <el-table :data="tableData02" v-loading="ysgzLoading">
          <el-table-column prop="ysbh" width="150" label="编号"></el-table-column>
          <el-table-column prop="bjsj" width="200" label="移送时间"></el-table-column>
          <el-table-column prop="xzqy" show-overflow-tooltip label="行政区域"></el-table-column>
          <el-table-column prop="qhdz" show-overflow-tooltip label="详细地址"></el-table-column>
          <el-table-column prop="zdName" show-overflow-tooltip label="队伍名称"></el-table-column>
          <el-table-column width="100" prop="shzt" label="审核状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.shzt===2" type="success">已审核</el-tag>
              <el-tag v-else-if="scope.row.shzt===1">待审核</el-tag>
              <el-tag v-else-if="scope.row.shzt===4" type="danger">已驳回</el-tag>
            </template>
          </el-table-column>
          <el-table-column width="200" label="操作">
            <template slot-scope="scope">
              <el-button @click="ysgzClick(scope.row)" type="text" size="small"
              >查看
              </el-button
              >
              <el-button v-if="scope.row.shzt === 2" @click="xzPDF(scope.row)" type="text" size="small"
              >下载PDF
              </el-button
              >
              <el-button v-if="scope.row.shzt === 2&&scope.row.imgs.length" @click="xzPic(scope.row)" type="text"
                         size="small"
              >导出图片
              </el-button
              >
              <el-button
                  size="mini"
                  type="text"
                  @click="confirmReset(scope.row,2)"
                  v-hasPermi="['jydj:xqbg:reset']"
                
                >重置</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page">
          <el-pagination
            @current-change="CurrentChange02"
            :page-size="pageSize02"
            layout="prev, pager, next"
            :total="total02"
            :current-page="currentPage02"
            background
          >
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :visible="bhShow" @close="bhColose" v-loading="bhLoading">
      <el-form>
        <el-form-item label="驳回问题类型:" :rules="[{ required: true, message: '问题类型不能为空'}]">
          <el-select v-model="issue.issue_type">
            <el-option v-for="item in issue_typeArr" :value="item" :key="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="驳回问题描述:" :rules="[{ required: true, message: '问题描述不能为空'}]">
          <el-input style="width: 400px" type="textarea" v-model="issue.issue_desc"/>
        </el-form-item>
        <el-form-item style="text-align: center;">
          <el-button type="primary" @click="bhSumit">提交</el-button>
          <el-button @click="bhShow = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  djxxbh,
  getCslx,
  getDownLoad, getDownLoadPic,
  getXcCxData,
  getYsCxData,
  djDelet
} from '@/api/data/entry/hzdj'
import Time from 'moment'
import { getUserProfile } from '@/api/system/user'
import { checkDeptList,getResetFill } from '@/api/common'
import qhcs from '@/views/data/entry/hzdj/component/qhcs'
import areaSelect from '@/views/data/entry/hzdj/component/areaSelect'
import hzyy from '@/views/data/entry/hzdj/component/hzyy'
import dateTimeRange from "@/views/components/dateTime/dateTimeRange.vue"


export default {
  name: 'zjxcdj',
  components: { FireSpaceMul: qhcs, areaSelect, fireReasonMul: hzyy,dateTimeRange },

  data() {
    const that = this
    return {
    
      downNum: 0,
      tableData01: [],
      tableData02: [],
      activeName: 'first',
      sx: {
        ddDeptId: [],
        area: {
          name: '',
          value: []
        },
        qhcs: {
          name: '',
          value: []
        },
        hzyy: {
          name: '',
          value: []
        }
      },
      tabSelect: [],
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
      root: {},
      selectDD: [],
      selectProps: {
        multiple: true,
        checkStrictly: true,
        filterable: true,
        lazy: true,
        async lazyLoad(node, reslove) {
          const res = await checkDeptList({ deptLevel: node.data.level, parentId: node.data.value })
          reslove(that.setChildren(res.data))
        }
      },
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
      shzt: [
        { title: '被驳回', value: 4 },
        { title: '已审核', value: 2 }
      ],
      qhcsType: '',
      Options: {
        qhcslb: []
      },
      issue_typeArr: ['数据不准确', '数据错误', '信息不全'],
      issue: {
        issue_type: '数据不准确',
        issue_desc: ''
      },
      bhShow: false,
      djbh: '',
      bhLoading: false
      }
  },
  created() {
    this.getRoot();
    this.getCslb();
    // this.hideAreaId();
  },
  mounted() {
    this.cx();
  },
  computed: {
    rymjcs() {
      return Object.keys(this.ysgzData.mjcs7).length ? true : false
    },
    issue_type() {
      if (this.activeName === 'first') {
        return this.xcdjdata.issue_type ? this.xcdjdata.issue_type : '数据不准确'
      } else {
        return this.ysgzData.issue_type ? this.ysgzData.issue_type : '数据不准确'
      }
    },
    issue_desc() {
      if (this.activeName === 'first') {
        return this.xcdjdata.issue_desc ? this.xcdjdata.issue_desc : '无'
      } else {
        return this.ysgzData.issue_desc ? this.ysgzData.issue_desc : '无'
      }
    }
  },
  watch: {
    activeName() {
      this.currentPage01 = 1
      this.currentPage02 = 1
      this.sx.ddDeptId = [];
      this.sx.area = {
        name: '',
        value: []
      };
      this.sx.qhcs = {
        name: '',
        value: []
      };
      this.sx.hzyy = {
        name: '',
        value: []
      };
      this.cx()
    },
    qhcsType() {
      this.sx.qhcs = {
        name: '',
        value: []
      }
    }
  },
  methods: {
    resetbutton(row,type){
      let obj = {};
      if(type == 1){
        obj = {
          bh:row.djbh
        }
      }else if(type == 2){
        obj = {
          bh:row.ysbh
        }
      }
      // console.log('sdasdasdad',row.djbh)
      getResetFill(obj).then(res => {
        if(res.code == 200){
          this.$message.success(res.msg);
          this.cx()
        }else{
          this.$message.error(res.msg)

        }
      })
    },

    confirmReset(row,type) {
        this.$confirm('此操作将重置, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
         this.resetbutton(row,type);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },


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
    getRoot() {
      getUserProfile().then(r => {
        this.root = {
          rootId: r.deptRoots,
          level: r.data.areaLevel
        }
        checkDeptList({ deptLevel: this.root.level, deptRoots: this.root.rootId }).then(r => {
          this.selectDD = r.data.filter(i => i.deptId === this.root.rootId).map(i => {
            return { label: i.deptName, value: i.deptId, level: i.deptLevel }
          })
        })
      })
    },
    setChildren(data) {
      return data.map(i => {
        return {
          label: i.deptName,
          value: i.deptId,
          level: i.deptLevel,
          leaf: !i.hasChildren
        }
      })
    },
    cxBtn() {
      this.currentPage01 = 1
      this.currentPage02 = 1
      this.cx()
    },
    cx() {
      const format = 'YYYY-MM-DD'
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
        shzt: this.sx.shzt || 0,
        pageSize: 10,
        params: {
          beginTime: this.sx.startTime && Time(this.sx.startTime).format(format),
          endTime: this.sx.endTime && Time(this.sx.endTime).format(format)
        }
      }
      if (this.sx.area.value.length) {
        ruselt.xzqy = this.sx.area.value.join(',')
      }
      if (this.sx.hzyy.value.length) {
        ruselt.hzyy = this.sx.hzyy.value.join(',')
      }
      if (this.activeName === 'first') {
        if (this.qhcsType) {
          ruselt.cslx = this.qhcsType
          if (this.sx.qhcs.value.length) {
            ruselt.cslx_mc = this.sx.qhcs.value.map(s => s.dictValue).join(',')
          }
        }
        ruselt.ddDeptId = this.sx.ddDeptId.length ? this.sx.ddDeptId.map(r => r[r.length - 1]).join(',') : 0
        ruselt.pageNum = this.currentPage01
        this.getCxData('xcdj', ruselt)
      } else if (this.activeName === 'second') {
        ruselt.ddDeptid = this.sx.ddDeptId.length ? this.sx.ddDeptId.map(r => r[r.length - 1]).join(',') : 0
        delete ruselt.djbh
        ruselt.shzt = this.sx.shzt || 0
        ruselt.ysbh = this.sx.jqbh || ''
        ruselt.pageNum = this.currentPage02
        this.getCxData('ysgz', ruselt)
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
        getXcCxData(ruselt).then(r => {
          this.total01 = r.total
          this.tableData01 = this.clData('xcdj', r.rows)
          this.xcdjLoading = false
        })
      } else {
        this.ysgzLoading = true
        getYsCxData(ruselt).then(r => {
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
          }) : ''
          item.tshzpd = tshzpdObj

          item.qtcs6 ? item.qtcs6.split(',').forEach(r => {
            qtcs6Obj[r] = true
          }) : ''
          item.qtcs6 = qtcs6Obj
          item.mjcs7 ? item.mjcs7.split(',').forEach(r => {
            mjcs7Obj[r] = true
          }) : ''
          item.mjcs7 = mjcs7Obj
          item.imgs = item.imgs ? item.imgs.split(',').map(i => process.env.VUE_APP_BASE_API + i) : []
          item.imgsDesc = item.imgsDesc ? item.imgsDesc.split('||') : []
          return item
        })
        return result
      }
    },
    submit(type) {
      type === 'xcdj' ?
        this.xcdjsh = false
        :
        this.ysgzsh = false
    },
    xzPDF(item) {
      const bh = item.djbh || item.ysbh
      const loading = this.$loading({ fullscreen: true })
      getDownLoad(bh).then(res => {
        if ('download' in document.createElement('a')) {
          let url = window.URL.createObjectURL(res)
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', bh + '.pdf')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        } else {
          navigator.msSaveBlob(res, bh + '.pdf')
        }
        loading.close()
      })
    },
    xzPic(item) {
      const bh = item.djbh || item.ysbh
      const loading = this.$loading({ fullscreen: true })
      this.downNum++
      getDownLoadPic(bh).then(res => {
        if (res.size === 0) {
          if (this.downNum > 5) {
            loading.close()
            this.$message.warning('下载失败，请重试！')
            return
          }
          this.xzPic(item)
          return
        }
        this.downNum = 0
        if ('download' in document.createElement('a')) {
          let url = window.URL.createObjectURL(res)
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', `${item.qhdz}+${item.qhdw}+${item.bjsj}` + '.doc')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        } else {
          navigator.msSaveBlob(res, bh + '.doc')
        }
        loading.close()
      })
    },
    init() {
      this.sx = {
        ddDeptId: [],
        area: {
          name: '',
          value: []
        },
        qhcs: {
          name: '',
          value: []
        },
        hzyy: {
          name: '',
          value: []
        }
      }
      this.currentPage01 = 1
      this.currentPage02 = 1
      this.qhcsType = ''
      this.$refs.dateTimeRange.clear();
      this.cx()
    },
    getCslb() {
      getCslx().then(r => {
        this.Options.qhcslb = r.data
      })
    },
    setQhcs(arr) {
      this.sx.qhcs.value = arr
      this.sx.qhcs.name = arr.map(r => r.dictLabel).join('/')
    },
    selectArea(area) {
      this.sx.area.name = area.map(r => r.areaName).join('/')
      this.sx.area.value = area.map(r => r.areaId)
    },
    setFireReasonMulVal(e) {
      this.sx.hzyy.name = e.map(i => i.dictLabel).join(',')
      this.sx.hzyy.value = e.map(i => i.dictValue)
    },
    djxxbh(e) {
      this.djbh = e.djbh
      this.bhShow = true
    },
    bhSumit() {
      if (!this.issue.issue_type || !this.issue.issue_desc) {
        this.$message.warning('驳回原因不能为空！')
        return
      }
      this.bhLoading = true
      djxxbh({ djbh: this.djbh, ...this.issue }).then(r => {
        this.$message.success('驳回成功！')
        this.bhLoading = false
        this.bhShow = false
        this.cx()
      })
    },
    bhColose() {
      this.bhShow = false
      this.issue = {
        issue_type: '数据不准确',
        issue_desc: ''
      }
    },
    djxxsc({ djbh }) {
      this.$prompt('此操作将永久删除该警情, 请输入删除原因（可为空）', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(({ value }) => {
        console.log(djbh, value)
        const loading = this.$loading({ fullscreen: true })
        djDelet({ djbh, scyy: value }).then(r => {
          if (r.code !== 200) {
            loading.close()
            this.$message.error('删除失败！')
            return
          }
          loading.close()
          this.$message.success('删除成功！')
          this.cx()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })

    }
  },

}
</script>

<style lang="scss" scoped>
  .page {
    margin: 10px;
    text-align: right;
  }


.ddshtj {
  text-align: center;

  .el-tag {
    margin: 10px;
  }
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
      }
    }
  }
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
