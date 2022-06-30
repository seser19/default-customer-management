<template>
  <div v-loading="loading" class="page_zone disasterInfomation">
    <div class="title">
      <img src="@/views/data/entry/zqxx/image/zqxx.png">

      <div v-if="propfrom.type == '1' && propfrom.isNotEdit">火灾信息详情<span v-if="propfrom.zqbh !== undefined " style="font-size: 12px;margin-left: 6px;">(火灾编号：{{propfrom.zqbh}})</span></div>
      <div v-else>{{ $route.meta.title }}{{propfrom.jqbh == "" ? "（草稿）" : (form.qwhz == '1' ? "（轻微）" : "")}} <span v-if="propfrom.zqbh !== undefined " style="font-size: 12px;padding-left: 6px">(火灾编号：{{propfrom.zqbh}})</span>
      </div>
      <el-button v-if="!propfrom.isNotEdit" @click="back">返&nbsp;回</el-button>
      <el-button v-if="propfrom.type == '0'" type="primary" @click="submitForm('ruleForm')">
        {{propfrom.jqbh == "" ? "保&nbsp;存" : "送&nbsp;审"}}
      </el-button>
      <el-button v-if="propfrom.type == '1' && !propfrom.isNotEdit" type="primary"
                 @click="submitAudit('ruleForm')">审&nbsp;核
      </el-button>
      <el-button v-if="propfrom.type == '2'" type="primary" @click="submitEdit('ruleForm')">修&nbsp;改</el-button>
      <el-button v-if="propfrom.type == '3'" type="primary" @click="submitAudit('ruleForm')">修&nbsp;改</el-button>
    </div>
    <div class="content">
      <topDetail v-if="content_kv_show" :jq-top-data="jqTopData" :cd-top-data="cdTopData"/>
      <div v-if="propfrom.type == '1'" class="audit_top">
        <div>
          <img src="../../../aduit/image/person.png"/>
          <span>
            创建人：
            <b>{{deptname || '-'}}</b>
          </span>
        </div>
        <div>
          <img src="../../../aduit/image/time.png"/>
          <span>
            创建时间：
            <b>{{tbsj || '-'}}</b>
          </span>
        </div>
      </div>
      <div class="info_description">
        <div class="fire_building_describe">
          <h2 class="title">简要情况</h2>
          <el-row :gutter="20">
            <el-col :span="24">
              <!-- 行政区域 单位名称 户主名 起火场所 起火物 过火面积 人员伤亡情况死亡数 直接经济损失 起火原因 -->
              {{ easyMessage }}
            </el-col>
          </el-row>
        </div>
        <!-- :rules="rules" -->
        <el-form
          id="fireForm"
          ref="ruleForm"
          :model="form"
          :rules="rules"
          :validate-on-rule-change="false"
          class="demo-ruleForm"
        >
          <div class="fire_building_describe">
            <h2 class="title">基本信息</h2>
            <el-row :gutter="50">
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="是否正在调查">
                  <el-select v-model="form.sfdcz" @change="toggleDcz()" placeholder="请选择"
                             :disabled="propfrom.isNotEdit">
                    <el-option label="正在调查，待完善" value="1"></el-option>
                    <el-option label="调查完毕，全部完成" value="0"></el-option>
                  </el-select>
                  <!-- <el-radio-group v-model="form.sfdcz">
										<el-radio label="1" value="1">是</el-radio>
										<el-radio label="0" value="0">否</el-radio>
									</el-radio-group> -->
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="起火时间" prop="zqsj">
                  <el-date-picker
                    :picker-options="pickerOptions"
                    v-model="form.zqsj"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm"
                    value-format="yyyy-MM-dd HH:mm"
                    placeholder="年月日时分"
                    :disabled="propfrom.isNotEdit"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="起火地点" prop="zqdd">
                  <el-input v-model="form.zqdd" placeholder clearable :disabled="propfrom.isNotEdit"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="50">
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item v-if="form.qwhz == '0'" label="火灾等级(自动判定)" prop="zqlbdm">
                    <el-select v-model="form.zqlbdm" placeholder="请选择" disabled>
                      <el-option
                        v-for="item in Options.tb_dic_zqdj"
                        :key="item.dictValue"
                        :label="item.dictLabel"
                        :value="item.dictValue"
                      />
                    </el-select>
                    <el-tooltip class="item" effect="dark" placement="right-start">
                      <div slot="content">根据生产安全事故(以下简称事故)造成的人员伤亡或者直接经济损失，事故一般分为以下等级：<br/>(1)特别重大事故，是指造成30人以上死亡，或者100人以上重伤(包括急性工业中毒，下同)或者1亿元以上直接经济损失的事故。<br/>(2)
                      重大事故，是指造成10人以上30人以下死亡，或者50人以上100人以下重伤，或者5000万元以上1亿元以下直接经济损失的事故。<br/>(3)较大事故，是指造成3人以上10人以下死亡，或者10人以上50人以下重伤，或者1000万元以上5000万元以下直接经济损失的事故。<br/>
                      (4)一般事故，是指造成3人以下死亡，或者10人以下重伤，或者1000万元以下直接经济损失的事故。<br/>本条第一款所称的“以上”包括本数，所称的“以下”不包括本数</div>
                      <img class="tip-class" src="../../../../icons/tip.svg">
                    </el-tooltip>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="失火单位/户主联系电话" prop="lxdh">
                  <el-input v-model="form.lxdh" placeholder clearable :disabled="propfrom.isNotEdit"/>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="单位统一社会信用代码">
                  <el-input v-model="form.dwtyshxydm" placeholder clearable
                            :disabled="propfrom.isNotEdit"/>
                </el-form-item>
              </el-col>
              <!-- 暂时去掉，后期需要释放即可 -->
              <!--  <el-col :xs="24" :sm="12" :lg="8" :span="8" v-if="form.qwhz=='1'">
                               <el-form-item label="是否成灾">
                                 <el-select v-model="form.sfcz" placeholder="请选择">
                                   <el-option label="否" value="0"/>
                                   <el-option label="是" value="1"/>
                                 </el-select>
                               </el-form-item>
                             </el-col> -->
            </el-row>
            <el-row :gutter="50">
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="区域" prop="qydm">
                  <el-select v-model="form.qydm" @change="qydmChange"  placeholder="请选择" clearable :disabled="propfrom.isNotEdit">
                    <el-option
                      v-for="item in Options.qydm"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="form.qydm == '1' || form.qydm == '2'" :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item v-if="form.qydm == '1' || form.qydm == '2'" label=" ">
                  <el-checkbox v-model="form.czc" true-label="1" false-label="0"
                               :disabled="propfrom.isNotEdit">城中村
                  </el-checkbox>
                </el-form-item>
              </el-col>
              <el-col v-if="form.qydm == '6'" :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label=" ">
                  <el-select v-model="form.qydmItem2" placeholder="请选择"
                             :disabled="propfrom.isNotEdit">
                    <el-option
                      v-for="item in Options.qydmItem2"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="50">
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="监督检查情况">
                  <el-select v-model="form.jdjcqk" placeholder clearable :disabled="propfrom.isNotEdit"
                             @change="loadNext">
                    <el-option
                      v-for="item in Options.jdjcqk"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="form.jdjcqk == '1'" :xs="24" :sm="12" :lg="10" :span="10">
                <el-form-item label=" ">
                  <el-select v-model="form.jdjcqkItems" multiple placeholder
                             :disabled="propfrom.isNotEdit" @change="loadNext_1">
                    <el-option
                      v-for="item in Options.jdjcqkItem1"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="form.jdjcqk == '1' && form.jdjcqkItem1.indexOf('5')!=-1" :span="6">
                <el-form-item label=" ">
                  <el-select v-model="form.jdjcqkItem2" placeholder clearable :disabled="propfrom.isNotEdit">
                    <el-option
                      v-for="item in Options.jdjcqkItem2"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="form.qwhz == '0'" :gutter="50">
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="是否保险">
                  <el-select v-model="form.sfbx" placeholder="请选择" clearable :disabled="propfrom.isNotEdit" @change="sfbxChange">
                    <el-option label="是" value="0">是</el-option>
                    <el-option label="否" value="1">否</el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label=" ">
                  <el-select
                    v-if="form.sfbx == '0'"
                    v-model="form.sfbxItems"
                    placeholder="请选择"
                    multiple
                    :disabled="propfrom.isNotEdit"
                    @change="sfbxItemChange"
                  >
                    <el-option label="人身保险" value="人身保险">人身保险</el-option>
                    <el-option label="财产保险" value="财产保险">财产保险</el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="form.qwhz == '0'" :gutter="50">
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="是否单方火灾事故">
                  <el-select v-model="form.sfdfhzsh" placeholder="请选择" clearable :disabled="propfrom.isNotEdit">
                    <el-option label="是" value="1">是</el-option>
                    <el-option label="否" value="2">否</el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="50">
              <el-col v-if="form.qwhz == '0'" :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="事故调查牵头部门" prop="sgqtdcbm">
                  <el-select v-model="form.sgqtdcbm" @change="sgqtdcbmChange" placeholder="请选择" clearable :disabled="propfrom.isNotEdit">
                    <el-option
                      v-for="item in Options.sgqtdcbm"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item v-if="form.sgqtdcbm == '6'" label=" ">
                  <el-input v-model="form.sgqtdcbmItem1" placeholder clearable :disabled="propfrom.isNotEdit"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="50">
              <el-col v-if="form.qwhz == '0'" :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="所属行业">
                  <el-select v-model="form.hylbdm" placeholder="请选择" clearable :disabled="propfrom.isNotEdit">
                    <el-option
                      v-for="item in Options.tb_dic_hylb"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="form.qwhz == '0'" :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="经济类型" prop="jjlxdm">
                  <el-select v-model="form.jjlxdm" placeholder="请选择" clearable :disabled="propfrom.isNotEdit">
                    <el-option
                      v-for="item in Options.tb_dic_jjlx"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div class="fire_building_describe">
            <h2 class="title">起火场所信息</h2>
            <el-row :gutter="50">
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="起火场所类型" prop="qhcslb">
                  <el-select v-model="form.qhcslb" placeholder="请选择" clearable :disabled="propfrom.isNotEdit"
                             @change="reset">
                    <el-option
                      v-for="item in Options.tb_dic_qhcslb"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="form.qhcslb" :span="16">
                <el-form-item label="起火场所" prop="qhcsms">
                  <el-input v-model="form.qhcsms" placeholder="请选择" readonly @focus="openQhcsMul" :disabled="propfrom.isNotEdit">
                    <i slot="suffix" class="iconfont icon-icon-test" :disabled="propfrom.isNotEdit"
                       @click="openQhcsMul"/>
                    <i slot="suffix" class="el-icon-circle-close closeBtnMar" @click="clearQhcsMul()" v-show="form.qhcsms"></i>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="form.qwhz == '0'" :gutter="50">
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="是否属于世界遗产">
                  <el-select v-model="form.sfyc" placeholder="请选择" clearable :disabled="propfrom.isNotEdit">
                    <el-option label="是" value="1">是</el-option>
                    <el-option label="否" value="0">否</el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="form.sfyc == '1'" :xs="24" :sm="12" :lg="8" :span="8" prop="sfsjycdm">
                <el-form-item label=" ">
                  <el-select v-model="form.sfsjycdm" placeholder="请选择" clearable :disabled="propfrom.isNotEdit">
                    <el-option
                      v-for="item in Options.tb_dic_sjyc"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="form.qwhz == '0' && form.qhcslb =='3'" :gutter="50">
              <el-col :xs="24" :sm="12" :lg="8" :span="8" prop="jzsyyt">
                <el-form-item label="建筑使用用途">
                  <el-select v-model="form.jzsyyt" placeholder="请选择" clearable :disabled="propfrom.isNotEdit">
                    <el-option
                      v-for="item in Options.jzsyyt"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="form.jzsyyt == '2'" :span="6" prop="jzsyytItem1">
                <el-form-item label=" ">
                  <el-select v-model="form.jzsyytItem1" placeholder="请选择" clearable
                             :disabled="propfrom.isNotEdit">
                    <el-option
                      v-for="item in Options.jzsyytItem1"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="form.qwhz == '0' && form.qhcslb =='3'" :gutter="50">
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="建筑类别" prop="jzlbdm">
                  <el-select v-model="form.jzlbdm" placeholder="请选择" clearable :disabled="propfrom.isNotEdit" @change="jzlbChange">
                    <el-option
                      v-for="item in Options.tb_dic_jzlb"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="form.qhcslb =='3'" :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label=" ">
                  <el-checkbox v-model="form.dxzht" true-label="1" false-label="0"
                               :disabled="propfrom.isNotEdit">大型综合体
                  </el-checkbox>
                </el-form-item>
              </el-col>
              <el-col v-if="form.qhcslb =='3'" :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="建筑耐火等级" prop="jznhdjdm">
                  <el-select v-model="form.jznhdjdm" placeholder="请选择" clearable :disabled="propfrom.isNotEdit">
                    <el-option
                      v-for="item in Options.tb_dic_jzwnhdj"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="form.qhcslb =='3'" :gutter="50">
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="建筑结构" prop="jzjgdm">
                  <el-select v-model="form.jzjgdm" placeholder="请选择" clearable :disabled="propfrom.isNotEdit">
                    <el-option
                      v-for="item in gcjzjgList"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                      v-if="form.jzlbdm == '010000'"
                    />
                    <el-option
                      v-for="item in Options.tb_dic_jzjg"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                      v-if="form.jzlbdm != '010000'"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div v-if="form.qwhz == '0'&&form.qhcslb==3" class="fire_building_describe">
            <h2 class="title">火灾及失火建筑情况描述</h2>
            <el-row :gutter="50">
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="火灾蔓延到邻近建筑" prop="hzsfmydljjz">
                  <el-radio-group v-model="form.hzsfmydljjz" :disabled="propfrom.isNotEdit">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="发生轰然" prop="sffshr">
                  <el-radio-group v-model="form.sffshr" :disabled="propfrom.isNotEdit">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="失火建筑门窗在火灾过程中开启" prop="shjzmcsfkq" label-width="200px">
                  <el-radio-group v-model="form.shjzmcsfkq" :disabled="propfrom.isNotEdit">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="50">
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="建筑总楼层数" prop="jzzlcs">
                  <el-input v-model="form.jzzlcs" type="number" placeholder clearable :disabled="propfrom.isNotEdit" @blur="jzlcBlur" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="失火楼层" prop="shlc">
                  <el-input v-model="form.shlc" placeholder clearable :disabled="propfrom.isNotEdit"/>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="房屋属性" prop="jzjgdm2">
                  <el-select v-model="form.jzjgdm2" placeholder="请选择" clearable :disabled="propfrom.isNotEdit">
                    <el-option
                      v-for="item in gcjzjgList2"
                      :key="item.value+item.key"
                      :label="item.key"
                      :value="item.value"
                    />
                    
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="房屋建筑年份" prop="fwjznf">
                  <el-input v-model="form.fwjznf" placeholder clearable :disabled="propfrom.isNotEdit"/>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div v-if="form.qwhz == '0'&&form.qhcslb==3" class="fire_building_describe">
            <h2 class="title">消防设施</h2>
            <el-row :gutter="50">
              <el-col :span="6">
                <el-form-item label="自动报警系统(含独立报警)" label-width="200px">
                  <el-select
                    v-model="form.zdbjxtsfaz"
                    placeholder="请选择"
                    clearable
                    :disabled="propfrom.isNotEdit"
                    @change="nextItem('1','bj',form.zdbjxtsfaz)"
                  >
                    <el-option
                      v-for="item1 in Options.zdbjxtsfaz"
                      :key="item1.dictValue"
                      :label="item1.dictLabel"
                      :value="item1.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="form.zdbjxtsfaz" :span="6">
                <el-form-item label=" ">
                  <el-select
                    v-model="form.zdbjxtsfazItem1"
                    placeholder="请选择"
                    clearable
                    :disabled="propfrom.isNotEdit"
                    @change="nextItem('2','bj',form.zdbjxtsfazItem1)"
                  >
                    <el-option
                      v-for="item in Options.zdbjxtsfazItem1"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col
                v-if="form.zdbjxtsfazItem1 == '3' || form.zdbjxtsfazItem1 == '4'"
                :span="6"
              >
                <el-form-item label=" ">
                  <el-select
                    v-model="form.zdbjxtsfazItem2"
                    placeholder="请选择"
                    clearable
                    :disabled="propfrom.isNotEdit"
                    @change="nextItem('3','bj',form.zdbjxtsfazItem2)"
                  >
                    <el-option
                      v-for="item in Options.zdbjxtsfazItem2"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="form.zdbjxtsfazItem2 >= 7" :span="6">
                <el-form-item label=" ">
                  <el-select v-model="form.zdbjxtsfazItem3" placeholder="请选择" clearable
                             :disabled="propfrom.isNotEdit">
                    <el-option
                      v-for="item in Options.zdbjxtsfazItem3"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="50">
              <el-col :span="6">
                <el-form-item label="自动灭火系统(含简易喷淋)" label-width="200px">
                  <el-select
                    v-model="form.zdmhxtsfaz"
                    placeholder="请选择"
                    clearable
                    :disabled="propfrom.isNotEdit"
                    @change="nextItem('1','mh',form.zdmhxtsfaz)"
                  >
                    <el-option
                      v-for="item1 in Options.zdmhxtsfaz"
                      :key="item1.dictValue"
                      :label="item1.dictLabel"
                      :value="item1.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="form.zdmhxtsfaz" :span="6">
                <el-form-item label=" ">
                  <el-select
                    v-model="form.zdmhxtsfazItem1"
                    placeholder="请选择"
                    clearable
                    :disabled="propfrom.isNotEdit"
                    @change="nextItem('2','mh',form.zdmhxtsfazItem1)"
                  >
                    <el-option
                      v-for="item1 in Options.zdmhxtsfazItem1"
                      :key="item1.dictValue"
                      :label="item1.dictLabel"
                      :value="item1.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col
                v-if="form.zdmhxtsfazItem1 == '3' || form.zdmhxtsfazItem1 == '4'"
                :span="6"
              >
                <el-form-item label=" ">
                  <el-select
                    v-model="form.zdmhxtsfazItem2"
                    placeholder="请选择"
                    clearable
                    :disabled="propfrom.isNotEdit"
                    @change="nextItem('3','mh',form.zdmhxtsfazItem2)"
                  >
                    <el-option
                      v-for="item1 in Options.zdmhxtsfazItem2"
                      :key="item1.dictValue"
                      :label="item1.dictLabel"
                      :value="item1.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="form.zdmhxtsfazItem2 >= 7 " :span="6" prop="zdmhxtsfazItem3">
                <el-form-item label=" ">
                  <el-select v-model="form.zdmhxtsfazItem3" placeholder="请选择" clearable
                             :disabled="propfrom.isNotEdit">
                    <el-option
                      v-for="item1 in Options.zdmhxtsfazItem3"
                      :key="item1.dictValue"
                      :label="item1.dictLabel"
                      :value="item1.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="50">
              <el-col :span="6">
                <el-form-item label="防排烟系统" label-width="200px">
                  <el-select
                    v-model="form.fpyxtsfaz"
                    placeholder="请选择"
                    clearable
                    :disabled="propfrom.isNotEdit"
                    @change="nextItem('1','py',form.fpyxtsfaz)"
                  >
                    <el-option
                      v-for="item1 in Options.fpyxtsfaz"
                      :key="item1.dictValue"
                      :label="item1.dictLabel"
                      :value="item1.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="form.fpyxtsfaz" :span="6">
                <el-form-item label=" ">
                  <el-select
                    v-model="form.fpyxtsfazItem1"
                    placeholder="请选择"
                    clearable
                    :disabled="propfrom.isNotEdit"
                    @change="nextItem('2','py',form.fpyxtsfazItem1)"
                  >
                    <el-option
                      v-for="item1 in Options.fpyxtsfazItem1"
                      :key="item1.dictValue"
                      :label="item1.dictLabel"
                      :value="item1.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col
                v-if="form.fpyxtsfazItem1 == '3' || form.fpyxtsfazItem1 == '4'"
                :span="6"

              >
                <el-form-item label=" ">
                  <el-select
                    v-model="form.fpyxtsfazItem2"
                    placeholder="请选择"
                    clearable
                    :disabled="propfrom.isNotEdit"
                    @change="nextItem('3','py',form.fpyxtsfazItem2)"
                  >
                    <el-option
                      v-for="item1 in Options.fpyxtsfazItem2"
                      :key="item1.dictValue"
                      :label="item1.dictLabel"
                      :value="item1.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="form.fpyxtsfazItem2 >= 7" :span="6">
                <el-form-item label=" ">
                  <el-select v-model="form.fpyxtsfazItem3" placeholder="请选择" clearable
                             :disabled="propfrom.isNotEdit">
                    <el-option
                      v-for="item1 in Options.fpyxtsfazItem3"
                      :key="item1.dictValue"
                      :label="item1.dictLabel"
                      :value="item1.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="50">
              <el-col :span="6">
                <el-form-item label="防火卷帘" label-width="200px">
                  <el-select
                    v-model="form.fhjl"
                    placeholder="请选择"
                    clearable
                    :disabled="propfrom.isNotEdit"
                    @change="nextItem('1','jl',form.fhjl)"
                  >
                    <el-option
                      v-for="item1 in Options.fhjl"
                      :key="item1.dictValue"
                      :label="item1.dictLabel"
                      :value="item1.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="form.fhjl" :span="6">
                <el-form-item label=" ">
                  <el-select
                    v-model="form.fhjlItem1"
                    placeholder="请选择"
                    clearable
                    :disabled="propfrom.isNotEdit"
                    @change="nextItem('2','jl',form.fhjlItem1)"
                  >
                    <el-option
                      v-for="item1 in Options.fhjlItem1"
                      :key="item1.dictValue"
                      :label="item1.dictLabel"
                      :value="item1.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col
                v-if="form.fhjlItem1 == '3' || form.fhjlItem1 == '4'"
                :span="6"

              >
                <el-form-item label=" ">
                  <el-select
                    v-model="form.fhjlItem2"
                    placeholder="请选择"
                    clearable
                    :disabled="propfrom.isNotEdit"
                    @change="nextItem('3','jl',form.fhjlItem2)"
                  >
                    <el-option
                      v-for="item1 in Options.fhjlItem2"
                      :key="item1.dictValue"
                      :label="item1.dictLabel"
                      :value="item1.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="form.fhjlItem2 >= 7" :span="6">
                <el-form-item label=" ">
                  <el-select v-model="form.fhjlItem3" placeholder="请选择" clearable
                             :disabled="propfrom.isNotEdit">
                    <el-option
                      v-for="item1 in Options.fhjlItem3"
                      :key="item1.dictValue"
                      :label="item1.dictLabel"
                      :value="item1.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="50">
              <el-col :span="6">
                <el-form-item label="室内消火栓系统" label-width="200px">
                  <el-select
                    v-model="form.snxhsxtsfaz"
                    placeholder="请选择"
                    clearable
                    :disabled="propfrom.isNotEdit"
                    @change="nextItem('1','xhs',form.snxhsxtsfaz)"
                  >
                    <el-option
                      v-for="item1 in Options.snxhsxtsfaz"
                      :key="item1.dictValue"
                      :label="item1.dictLabel"
                      :value="item1.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="form.snxhsxtsfaz" :span="6">
                <el-form-item label=" ">
                  <el-select
                    v-model="form.snxhsxtsfazItem1"
                    placeholder="请选择"
                    clearable
                    :disabled="propfrom.isNotEdit"
                    @change="nextItem('2','xhs',form.snxhsxtsfazItem1)"
                  >
                    <el-option
                      v-for="item1 in Options.snxhsxtsfazItem1"
                      :key="item1.dictValue"
                      :label="item1.dictLabel"
                      :value="item1.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col
                v-if="form.snxhsxtsfazItem1 == '3' || form.snxhsxtsfazItem1 == '4' && form.snxhsxtsfaz == '1'"
                :span="6"
              >
                <el-form-item label=" ">
                  <el-select
                    v-model="form.snxhsxtsfazItem2"
                    placeholder="请选择"
                    clearable
                    :disabled="propfrom.isNotEdit"
                    @change="nextItem('3','xhs',form.snxhsxtsfazItem2)"
                  >
                    <el-option
                      v-for="item1 in Options.snxhsxtsfazItem2"
                      :key="item1.dictValue"
                      :label="item1.dictLabel"
                      :value="item1.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="form.snxhsxtsfazItem2 >= 7 && form.snxhsxtsfaz == '1'" :span="6">
                <el-form-item label=" ">
                  <el-select v-model="form.snxhsxtsfazItem3" placeholder="请选择" clearable
                             :disabled="propfrom.isNotEdit">
                    <el-option
                      v-for="item1 in Options.snxhsxtsfazItem3"
                      :key="item1.dictValue"
                      :label="item1.dictLabel"
                      :value="item1.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="form.qwhz == '0'" :gutter="50">
              <el-col :span="6">
                <el-form-item label="防火分区">
                  <el-select v-model="form.fhfq" placeholder="请选择" clearable :disabled="propfrom.isNotEdit">
                    <el-option
                      v-for="(item, index) in Options.tb_dic_fhty"
                      :key="index"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label=" ">
                  <el-input v-model="form.fhfqIiem1" type="number" min="0" clearable
                            :disabled="propfrom.isNotEdit">
                    <template slot="append">平米</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="1">
                <el-form-item label="防火间距">
                  <el-select v-model="form.fhjj" placeholder="请选择" clearable :disabled="propfrom.isNotEdit">
                    <el-option
                      v-for="(item, index) in Options.tb_dic_fhty"
                      :key="index"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label=" ">
                  <el-input v-model="form.fhjjItem1" type="number" min="0" clearable
                            :disabled="propfrom.isNotEdit">
                    <template slot="append">米</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="form.qwhz == '0'" :gutter="50">
              <el-col :span="6">
                <el-form-item label="疏散通道">
                  <el-select v-model="form.sstd" placeholder="请选择" clearable :disabled="propfrom.isNotEdit">
                    <el-option
                      v-for="(item, index) in Options.sstd"
                      :key="index"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="form.sstd == '2'" :span="6">
                <el-form-item label=" ">
                  <el-select v-model="form.sstdItem1" placeholder="请选择" clearable
                             :disabled="propfrom.isNotEdit">
                    <el-option
                      v-for="(item, index) in Options.sstdItem1"
                      :key="index"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="form.sstd == '2'? 0 : 6">
                <el-form-item label="紧急出口">
                  <el-select v-model="form.yjck" placeholder="请选择" clearable :disabled="propfrom.isNotEdit">
                    <el-option
                      v-for="(item, index) in Options.yjck"
                      :key="index"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="form.yjck == '2'" :span="6">
                <el-form-item label=" ">
                  <el-select v-model="form.yjckItem1" placeholder="请选择" clearable
                             :disabled="propfrom.isNotEdit">
                    <el-option
                      v-for="(item, index) in Options.yjckItem1"
                      :key="index"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="form.qwhz == '0'" :gutter="50">
              <el-col :span="6">
                <el-form-item label="应急疏散照明">
                  <el-select v-model="form.yjsszm" placeholder="请选择" clearable :disabled="propfrom.isNotEdit">
                    <el-option
                      v-for="item in Options.yjsszm"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="form.yjsszm == '2'" :span="6">
                <el-form-item label=" ">
                  <el-select v-model="form.yjsszmItem1" placeholder="请选择" clearable
                             :disabled="propfrom.isNotEdit">
                    <el-option
                      v-for="(item, index) in Options.yjsszmItem1"
                      :key="index"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="form.qwhz == '0'" :gutter="50">
              <el-col :span="6">
                <el-form-item label="联网情况">
                  <el-select v-model="form.sflw" placeholder="请选择" clearable :disabled="propfrom.isNotEdit">
                    <el-option
                      v-for="(item, index) in Options.sflw"
                      :key="index"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label=" ">
                  <el-select
                    v-if="form.sflw == '1'"
                    v-model="form.sflwItem1"
                    placeholder="请选择"
                    clearable
                    :disabled="propfrom.isNotEdit"
                  >
                    <el-option
                      v-for="(item, index) in Options.sflwItem1"
                      :key="index"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="form.qwhz == '0'" :gutter="50">
              <!--<el-col :span="6">-->
              <!--<el-form-item label="是否保险">-->
              <!--<el-select v-model="form.sfbx" placeholder="请选择" :disabled="propfrom.isNotEdit">-->
              <!--<el-option label="是" value="0">是</el-option>-->
              <!--<el-option label="否" value="1">否</el-option>-->
              <!--</el-select>-->
              <!--</el-form-item>-->
              <!--</el-col>-->
              <!--<el-col :span="6">-->
              <!--<el-form-item label=" ">-->
              <!--<el-select-->
              <!--v-if="form.sfbx == '0'"-->
              <!--v-model="form.sfbxItems"-->
              <!--placeholder="请选择"-->
              <!--multiple-->
              <!--:disabled="propfrom.isNotEdit"-->
              <!--@change="sfbxItemChange"-->
              <!--&gt;-->
              <!--<el-option label="人身保险" value="人身保险">人身保险</el-option>-->
              <!--<el-option label="财产保险" value="财产保险">财产保险</el-option>-->
              <!--</el-select>-->
              <!--</el-form-item>-->
              <!--</el-col>-->
            </el-row>
            <!--  <el-row v-if="form.qwhz == '0'" :gutter="50">
              <el-col :span="6">
                <el-form-item label="是否单方火灾事故" >
                  <el-select v-model="form.sfdfhzsh" placeholder="请选择" :disabled="propfrom.isNotEdit">
                    <el-option label="是" value="1">是</el-option>
                    <el-option label="否" value="2">否</el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row> -->
          </div>
          <div class="fire_building_describe">
            <h2 class="title">起火物</h2>
            <el-row :gutter="50">
              <el-col :span="12">
                <el-form-item label="起火物" prop="qhwmsItem1">
                  <el-input v-model="form.qhwmsItem1" clearable :disabled="propfrom.isNotEdit"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="起火物分类" v-if="form.qhwmsItem1" prop="qhwms">
                  <el-input v-model="form.qhwms" placeholder="请选择" readonly
                            :disabled="propfrom.isNotEdit" @focus="openQhwMul">
                    <i slot="suffix" class="iconfont icon-icon-test" @click="openQhwMul"/>
                    <i slot="suffix" class="el-icon-circle-close closeBtnMar" @click="clearQhwMul()" v-show="form.qhwms"></i>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- <el-row :gutter="50">
							<el-col :span="12">
								<el-form-item label="起火原因" prop="hzyyms">
									<el-input placeholder="请选择" v-model="form.hzyyms" readonly>
										<i slot="suffix" class="iconfont icon-icon-test" @click="openQhyyMul"></i>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12" v-if="form.hzyyfldm == '9900000000'" prop="bpchzyymc">
								<el-form-item label="不排除原因" prop>
									<el-input placeholder="请选择" v-model="form.bpchzyymc" readonly>
										<i slot="suffix" class="iconfont icon-icon-test" @click="openBpcMul"></i>
									</el-input>
								</el-form-item>
							</el-col>
						</el-row> -->
          </div>

          <div class="fire_building_describe">
            <h2 class="title">火灾原因</h2>
            <el-row :gutter="50">
              <el-col :xs="24" :sm="24" :lg="24" :span="8">
                <el-row :gutter="50">
                  <el-col :span="12">
                    <el-form-item label="起火原因" prop="hzyyms">
                      <el-input v-model="form.hzyyms" placeholder="请选择" readonly
                                :disabled="propfrom.isNotEdit" @focus="openQhyyMul">
                        <i slot="suffix" class="iconfont icon-icon-test" @click="openQhyyMul"/>
                        <i slot="suffix" class="el-icon-circle-close closeBtnMar" @click="clearQhyyMul()" v-show="form.hzyyms"></i>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col v-if="form.hzyyfldm == '9900000000'" :span="12">
                    <el-form-item label="不排除原因" prop="bpchzyymc">
                      <el-input v-model="form.bpchzyymc" placeholder="请选择" readonly
                                :disabled="propfrom.isNotEdit">
                        <i slot="suffix" class="iconfont icon-icon-test" @click="openBpcMul"/>
                        <i slot="suffix" class="el-icon-circle-close closeBtnMar" @click="clearBpcMul()" v-show="form.bpchzyymc"></i>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" v-if="form.hzyyms =='其他'">
                    <el-form-item label="其他说明" prop="hzyymsItem1">
                      <el-input v-model="form.hzyymsItem1" clearable :disabled="propfrom.isNotEdit"/>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
              <el-col v-if="form.qwhz == '0'" :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="引起火灾人员年龄">
                  <el-input-number
                    v-model="form.zqxxYqhzry.nl"
                    :min="0"
                    :max="Infinity"
                    label
                    :disabled="propfrom.isNotEdit"
                    @change="handleChange"
                  />
                </el-form-item>
              </el-col>
              <el-col v-if="form.qwhz == '0'" :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="受教育程度">
                  <el-select v-model="form.zqxxYqhzry.sjycddm" placeholder="请选择"
                             :disabled="propfrom.isNotEdit" clearable>
                    <el-option
                      v-for="(item, index) in Options.tb_dic_yqhzrysjycd"
                      :key="index"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="form.qwhz == '0'" :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="健康状况">
                  <el-select v-model="form.zqxxYqhzry.jkzkdm" placeholder="请选择"
                             :disabled="propfrom.isNotEdit" clearable>
                    <el-option
                      v-for="(item, index) in Options.tb_dic_yqhzryjkzk"
                      :key="index"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div class="fire_building_describe">
            <h2 class="title">直接经济损失</h2>
            <el-row :gutter="50">
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="调查方式" prop="dcfs">
                  <el-select v-model="form.dcfs" placeholder="请选择" clearable :disabled="propfrom.isNotEdit">
                    <el-option
                      v-for="(item, index) in Options.tb_dic_dcfs"
                      :key="index"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col class="zjjssBox" :xs="24" :sm="12" :lg="8" :span="8">
                <el-button class="zjjss" type="text" v-if="eventList.length" size="medium" @click="$refs.zjccss.toggleShow()">财产损失参考数据</el-button>
                <el-form-item label="直接财产损失（元) " prop="zjccss">
                  <el-input-number
                    v-model="form.zjccss"
                    :min="0"
                    :max="Infinity"
                    label
                    placeholder="请输入"
                    :disabled="propfrom.isNotEdit"
                    @change="propertyEvent"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="火灾现场处置费用（元) " prop="hzxcczfy">
                  <el-input-number
                    v-model="form.hzxcczfy"
                    :min="0.00"
                    :max="Infinity"
                    label
                    placeholder="请输入"
                    :disabled="propfrom.isNotEdit"
                    @change="handleChange"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="50">
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="人身伤亡支出（元)" prop="ryswzc">
                  <el-input-number
                    v-model="form.ryswzc"
                    :min="0"
                    :max="Infinity"
                    label
                    placeholder="请输入"
                    :disabled="propfrom.isNotEdit"
                    @change="handleChange"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="损失来源" prop="ssly">
                  <el-select v-model="form.ssly" placeholder="请选择" clearable :disabled="propfrom.isNotEdit"
                             clearable>
                    <el-option
                      v-for="(item, index) in Options.tb_dic_ssly"
                      :key="index"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <!-- <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="保护财产价值" prop="protectPropVal">
                  <el-input-number
                    v-model="form.protectPropVal"
                    :min="0"
                    :max="Infinity"
                    label
                    placeholder="请输入"
                    :disabled="propfrom.isNotEdit"
                  />
                </el-form-item>
              </el-col> -->
            </el-row>
            <el-row :gutter="50">
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="过火面积（平方米）" prop="ghmj">
                  <el-input-number
                    v-model="form.ghmj"
                    :min="0"
                    :max="Infinity"
                    label
                    :disabled="propfrom.isNotEdit"
                    @change="handleChange"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="受灾户数（户）" prop="szhs">
                  <el-input-number
                    v-model="form.szhs"
                    :min="0"
                    :max="Infinity"
                    label
                    :disabled="propfrom.isNotEdit"
                    @change="handleChange"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="直接受灾人数（人）" prop="szrs">
                  <el-input-number
                    v-model="form.szrs"
                    :min="0"
                    :max="Infinity"
                    label
                    :disabled="propfrom.isNotEdit"
                    @change="handleChange"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!-- 人员伤亡情况信息表 -->
          <div v-if="form.qwhz == '0'" class="fire_building_describe">
            <h2 class="title">人员伤亡情况</h2>
            <el-row :gutter="50">
              <el-col :span="21">
                <el-form-item label="是否有人员伤亡" prop="ishurt">
                  <el-radio-group v-model="ishurt" :disabled="propfrom.isNotEdit"
                                  @change="resetIshurt">
                    <el-radio label="1" value="1">有</el-radio>
                    <el-radio label="0" value="0">无</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="轻伤人数" prop="qsrs">
                  <el-input-number
                    v-model="form.qsrs"
                    :min="0"
                    :max="Infinity"
                    label
                    :disabled="propfrom.isNotEdit"
                    @change="handleChange"
                  />
                </el-form-item>
              </el-col>
              <!-- <el-col :span="3" style="text-align:right;">
                                              <el-dropdown @command="impotHurtPeople" v-if="ishurt == 1" trigger="click">
                                                  <span class="el-dropdown-link">
                                                      添加
                                                      <i class="el-icon-arrow-down el-icon--right"></i>
                                                  </span>
                                                  <el-dropdown-menu slot="dropdown">
                                                      <el-dropdown-item command="0">受伤</el-dropdown-item>
                                                      <el-dropdown-item command="1">死亡</el-dropdown-item>
                                                  </el-dropdown-menu>
                                              </el-dropdown>
                                          </el-col> -->
            </el-row>

            <div v-if="ishurt == 1" class="casualties_zone">
              <div class="hurt_zone">
                <h2 class="title">
                  <span>
                    受伤人员
                     <span>（轻伤共<span style="padding: 0 3px;">{{hurtQsNumber}}</span>人 重伤共<span style="padding: 0 3px;">{{hurtZsNumber}}</span>人）</span>
                  </span>
                  <i v-if="!propfrom.isNotEdit" class="el-icon-circle-plus-outline icon-plus"
                     @click="impotHurtPeople('0')"/>
                </h2>

                <div
                  v-for="(element,index) in form.ssryList"
                  :key="index"
                  class="swfl_hurt_info_body"
                >
                  <el-row :gutter="50">
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <span class="swfl_peop">1人</span>
                      <el-form-item label="伤情" :prop="`ssryList.${index}.swfl`">
                        <el-select v-model="element.swfl" placeholder="请选择" clearable
                                   :disabled="propfrom.isNotEdit" @change="isZsTotal(index)">
                          <el-option label="轻伤" value="1">轻伤</el-option>
                          <el-option label="重伤" value="2">重伤</el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="2" :offset="14" style="text-align: right;">
                      <i v-if="!propfrom.isNotEdit" class="el-icon-remove-outline"
                         @click="delectHurt(index,'0')"/>
                    </el-col>
                  </el-row>
                  <el-row :gutter="50" v-if="element.swfl == 2">
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="人员姓名" :prop="`ssryList.${index}.xm`" :required="!!rules[`ssryList.${index}.xm`]">
                        <el-input v-model="element.xm" placeholder clearable
                                  :disabled="propfrom.isNotEdit"/>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="人员性别" :prop="`ssryList.${index}.xb`" :required="!!rules[`ssryList.${index}.xb`]">
                        <el-select v-model="element.xb" placeholder="请选择" clearable
                                   :disabled="propfrom.isNotEdit">
                          <el-option
                            v-for="(item, index) in Options.sys_user_sex"
                            :key="index"
                            :label="item.dictLabel"
                            :value="item.dictValue"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="民族" :prop="`ssryList.${index}.nation`">
                        <el-select v-model="element.nation" filterable clearable placeholder="请选择民族" :disabled="propfrom.isNotEdit">
                          <el-option
                            v-for="item in nation"
                            :key="item.id+item.name"
                            :label="item.name"
                            :value="item.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="50" v-if="element.swfl == 2">
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="证件类型" :prop="`ssryList.${index}.idType`">
                        <el-select v-model="element.idType" clearable>
                          <el-option v-for="item in zjlx" :key="item.value+item.key" :label="item.key" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="证件号码" :prop="`ssryList.${index}.sfzhm`">
                        <el-input v-model="element.sfzhm" placeholder :disabled="propfrom.isNotEdit" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="50" v-if="element.swfl == 2">
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="人员年龄" :prop="`ssryList.${index}.nl`" :required="!!rules[`ssryList.${index}.nl`]">
                        <el-input-number
                          v-model="element.nl"
                          :min="0"
                          :max="Infinity"
                          label
                          :disabled="propfrom.isNotEdit"
                          @change="handleChange"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="健康状况" :prop="`ssryList.${index}.jkzkdm`" :required="!!rules[`ssryList.${index}.jkzkdm`]">
                        <el-select v-model="element.jkzkdm" placeholder="请选择" clearable
                                   :disabled="propfrom.isNotEdit" clearable>
                          <el-option
                            v-for="item in Options.tb_dic_ryjkzk"
                            :key="item.dictValue"
                            :label="item.dictLabel"
                            :value="item.dictValue"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="致伤原因" :prop="`ssryList.${index}.swyydm`" :required="!!rules[`ssryList.${index}.swyydm`]">
                        <el-select v-model="element.swyydm" placeholder="请选择" clearable
                                   :disabled="propfrom.isNotEdit">
                          <el-option
                            v-for="(item, index) in Options.tb_dic_swyy"
                            :key="index"
                            :label="item.dictLabel"
                            :value="item.dictValue"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="50" v-if="element.swfl == 2">
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="来源" :prop="`ssryList.${index}.rklydm`" :required="!!rules[`ssryList.${index}.rklydm`]">
                        <el-select v-model="element.rklydm" placeholder="请选择" clearable
                                   :disabled="propfrom.isNotEdit">
                          <el-option
                            v-for="(item, index) in Options.tb_dic_ryly"
                            :key="index"
                            :label="item.dictLabel"
                            :value="item.dictValue"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="来源详情" :prop="`ssryList.${index}.rklydm2`" :required="!!rules[`ssryList.${index}.rklydm2`]">
                        <el-select v-model="element.rklydm2" placeholder="请选择" clearable
                                   :disabled="propfrom.isNotEdit">
                          <el-option
                            v-for="(item, index) in Options.tb_dic_ryly2"
                            :key="index"
                            :label="item.dictLabel"
                            :value="item.dictValue"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="50" v-if="element.swfl == 2">
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="职业" :prop="`ssryList.${index}.zydm`" :required="!!rules[`ssryList.${index}.zydm`]">
                        <el-select v-model="element.zydm" placeholder="请选择" clearable
                                   :disabled="propfrom.isNotEdit">
                          <el-option
                            v-for="(item, index) in Options.tb_dic_ryzy"
                            :key="index"
                            :label="item.dictLabel"
                            :value="item.dictValue"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="受教育程度" :prop="`ssryList.${index}.sjycddm`" :required="!!rules[`ssryList.${index}.sjycddm`]">
                        <el-select v-model="element.sjycddm" placeholder="请选择" clearable
                                   :disabled="propfrom.isNotEdit" clearable>
                          <el-option
                            v-for="(item, index) in Options.tb_dic_rysjycd"
                            :key="index"
                            :label="item.dictLabel"
                            :value="item.dictValue"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </div>
              <el-divider/>
              <div class="dead_zone">
                <h2 class="title">
                  <span>死亡人员（共<span style="padding: 0 3px;">{{deadNumber}}</span>人）</span>
                  <i v-if="!propfrom.isNotEdit" class="el-icon-circle-plus-outline icon-plus"
                     @click="impotHurtPeople('1')"/>
                </h2>
                <div
                  v-for="(unit,index) in form.swryList"
                  :key="index"
                  class="swfl_dead_info_body"
                >
                  <el-row :gutter="50">
                    <el-col :span="2" :offset="22" style="text-align:right;">
                      <i v-if="!propfrom.isNotEdit" class="el-icon-remove-outline"
                         @click="delectHurt(index,'1')"/>
                    </el-col>
                  </el-row>
                  <el-row :gutter="50">
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="人员姓名" :prop="`swryList.${index}.xm`">
                        <el-input v-model="unit.xm" placeholder clearable :disabled="propfrom.isNotEdit"/>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="人员性别" :prop="`swryList.${index}.xb`">
                        <el-select v-model="unit.xb" placeholder="请选择" clearable
                                   :disabled="propfrom.isNotEdit">
                          <el-option
                            v-for="(item, index) in Options.sys_user_sex"
                            :key="index"
                            :label="item.dictLabel"
                            :value="item.dictValue"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="民族" :prop="`swryList.${index}.nation`">
                        <el-select v-model="unit.nation" filterable clearable placeholder="请选择民族" :disabled="propfrom.isNotEdit">
                          <el-option
                            v-for="item in nation"
                            :key="item.id+item.name"
                            :label="item.name"
                            :value="item.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="50">
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="证件类型" :prop="`swryList.${index}.idType`">
                        <el-select v-model="unit.idType" :disabled="propfrom.isNotEdit" clearable>
                          <el-option v-for="item in zjlx" :key="item.value+item.key" :label="item.key" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="证件号码" :prop="`swryList.${index}.sfzhm`">
                        <el-input v-model="unit.sfzhm" placeholder :disabled="propfrom.isNotEdit" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="50">
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="人员年龄" :prop="`swryList.${index}.nl`">
                        <el-input-number
                          v-model="unit.nl"
                          :max="Infinity"
                          :disabled="propfrom.isNotEdit"
                          label
                          @change="handleChange"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="健康状况" :prop="`swryList.${index}.jkzkdm`">
                        <el-select v-model="unit.jkzkdm" placeholder="请选择" clearable
                                   :disabled="propfrom.isNotEdit" clearable>
                          <el-option
                            v-for="(item, index) in Options.tb_dic_ryjkzk"
                            :key="index"
                            :label="item.dictLabel"
                            :value="item.dictValue"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="致死原因" :prop="`swryList.${index}.swyydm`">
                        <el-select v-model="unit.swyydm" placeholder="请选择" clearable
                                   :disabled="propfrom.isNotEdit">
                          <el-option
                            v-for="(item, index) in Options.tb_dic_swyy"
                            :key="index"
                            :label="item.dictLabel"
                            :value="item.dictValue"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="50">
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="来源" :prop="`swryList.${index}.rklydm`">
                        <el-select v-model="unit.rklydm" placeholder="请选择" clearable
                                   :disabled="propfrom.isNotEdit">
                          <el-option
                            v-for="(item, index) in Options.tb_dic_ryly"
                            :key="index"
                            :label="item.dictLabel"
                            :value="item.dictValue"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="来源详情" :prop="`swryList.${index}.rklydm2`">
                        <el-select v-model="unit.rklydm2" placeholder="请选择" clearable
                                   :disabled="propfrom.isNotEdit">
                          <el-option
                            v-for="(item, index) in Options.tb_dic_ryly2"
                            :key="index"
                            :label="item.dictLabel"
                            :value="item.dictValue"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row :gutter="50">
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="职业" :prop="`swryList.${index}.zydm`">
                        <el-select v-model="unit.zydm" placeholder="请选择" clearable
                                   :disabled="propfrom.isNotEdit">
                          <el-option
                            v-for="(item, index) in Options.tb_dic_ryzy"
                            :key="index"
                            :label="item.dictLabel"
                            :value="item.dictValue"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="受教育程度" :prop="`swryList.${index}.sjycddm`">
                        <el-select v-model="unit.sjycddm" placeholder="请选择" clearable
                                   :disabled="propfrom.isNotEdit" clearable>
                          <el-option
                            v-for="(item, index) in Options.tb_dic_rysjycd"
                            :key="index"
                            :label="item.dictLabel"
                            :value="item.dictValue"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row v-if="unit.hasOwnProperty('swwzdm')" :gutter="50">
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="发现尸体位置" :prop="`swryList.${index}.swwzdm`">
                        <el-select v-model="unit.swwzdm" placeholder="请选择" clearable
                                   :disabled="propfrom.isNotEdit">
                          <el-option
                            v-for="(item, index) in Options.tb_dic_swwz"
                            :key="index"
                            :label="item.dictLabel"
                            :value="item.dictValue"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="死亡时间" :prop="`swryList.${index}.swsjdm`">
                        <el-select v-model="unit.swsjdm" placeholder="请选择" clearable
                                   @change="swsjSelect(index,unit.swsjdm)" :disabled="propfrom.isNotEdit">
                          <el-option
                            v-for="(item, index) in Options.swsj"
                            :key="index"
                            :label="item.dictLabel"
                            :value="item.dictValue"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col v-if="unit.swsjdm==='1000'||unit.swsjdm==='2000'" :xs="24" :sm="12"
                            :lg="8" :span="8">
                      <el-form-item label="死亡时间详细信息" :prop="`swryList.${index}.swsjdmItem1`">
                        <el-select v-model="unit.swsjdmItem1" placeholder="请选择" clearable :disabled="propfrom.isNotEdit">
                          <el-option
                            v-for="(item, index) in  unit.swsjItem1"
                            :key="index"
                            :label="item.dictLabel"
                            :value="item.dictValue"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
          </div>

          <div v-if="form.qwhz == '0'" class="fire_building_describe">
            <h2 class="title">处理情况 - 两案处理</h2>
            <el-row :gutter="50">
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="是否立案">
                  <el-select v-model="form.sfla" placeholder="请选择" clearable :disabled="propfrom.isNotEdit" @change="sflaChange">
                    <el-option label="是" value="0">是</el-option>
                    <el-option label="否" value="1">否</el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="form.sfla=='0'" :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="追究人数">
                  <el-input-number
                    v-model="form.zjrs"
                    :min="0"
                    :max="Infinity"
                    label
                    :disabled="propfrom.isNotEdit"
                    @change="handleChange"
                  />
                </el-form-item>
              </el-col>
              <el-col v-if="form.sfla=='0'" :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="建议处理人数">
                  <el-input-number
                    v-model="form.jyclrs"
                    :min="0"
                    :max="Infinity"
                    label
                    :disabled="propfrom.isNotEdit"
                    @change="handleChange"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div v-if="form.qwhz == '0'" class="fire_building_describe">
            <h2 class="title">处理情况 - 火灾处罚情况</h2>
            <el-row :gutter="50">
              <el-col v-if="form.qwhz == '0'" :span="21">
                <el-form-item label="是否立案">
                  <el-radio-group v-model="isRegister" :disabled="propfrom.isNotEdit"
                                  @change="resetHzcfqkItem">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="3" style="text-align:right;">
								<el-dropdown @command="addHzcfqkItem" v-if="isRegister == 1" trigger="click">
									<span class="el-dropdown-link">
										添加
										<i class="el-icon-arrow-down el-icon--right"></i>
									</span>
									<el-dropdown-menu slot="dropdown">
										<el-dropdown-item command="1">单位</el-dropdown-item>
										<el-dropdown-item command="2">个人</el-dropdown-item>
									</el-dropdown-menu>
								</el-dropdown>
							</el-col> -->
            </el-row>
            <!-- 单位或个人列表 -->
            <div v-if="isRegister == 1">
              <div class="dw_zone">
                <h2 class="title">处罚单位列表
                  <i v-if="!propfrom.isNotEdit" class="el-icon-circle-plus-outline icon-plus"
                     @click="addHzcfqkItem('1')"/>
                </h2>
                <el-row v-for="(item,index) in form.zqxxDwclList" :key="index" :gutter="50">
                  <el-col :span="7">
                    <el-form-item label="单位名称">
                      <el-input v-model="form.zqxxDwclList[index].dwmc" placeholder clearable
                                :disabled="propfrom.isNotEdit"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item label="法人代表">
                      <el-input v-model="form.zqxxDwclList[index].frdb" placeholder clearable
                                :disabled="propfrom.isNotEdit"/>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="12" :lg="8" :span="8">
                    <el-form-item label="行政处罚">
                      <el-select v-model="form.zqxxDwclList[index].dwxzcfdm" placeholder="请选择" clearable @change="xzcfSelect(index)">
                        <el-option
                          v-for="(item, index) in Options.tb_dic_grxzcf"
                          :key="index"
                          :label="item.dictLabel"
                          :value="item.dictValue"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="2" style="text-align: center;">
                    <el-form-item label=" ">
                      <i v-if="!propfrom.isNotEdit" class="el-icon-remove-outline"
                         @click="delectHzcfqkItem(index, '1')"/>
                    </el-form-item>
                  </el-col>
                  <!-- <el-col :xs="24" :sm="12" :lg="8" :span="8" v-if="form.zqxxDwclList[index].dwxzcfdm == '02'">
                    <el-form-item label="罚款金额(元)">
                      <el-input type="text" v-model="form.zqxxDwclList[index].fkje" placeholder="输入金额" />
                    </el-form-item>
                  </el-col> -->
                </el-row>
              </div>
              <el-divider/>
              <div class="gr_zone">
                <h2 class="title">处罚个人列表
                  <i v-if="!propfrom.isNotEdit" class="el-icon-circle-plus-outline icon-plus"
                     @click="addHzcfqkItem('2')"/>
                </h2>
                <el-row v-for="(item,index) in form.zqxxGrclList" :key="index" :gutter="50">
                  <el-col :span="7">
                    <el-form-item label="姓名">
                      <el-input v-model="form.zqxxGrclList[index].xm" placeholder clearable
                                :disabled="propfrom.isNotEdit"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item label="性别">
                      <el-select v-model="form.zqxxGrclList[index].xb" placeholder="请选择" clearable
                                 :disabled="propfrom.isNotEdit">
                        <el-option
                          v-for="(item, index) in Options.sys_user_sex"
                          :key="index"
                          :label="item.dictLabel"
                          :value="item.dictValue"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="12" :lg="8" :span="8">
                    <el-form-item label="行政处罚">
                      <el-select v-model="form.zqxxGrclList[index].grxzcfdm" placeholder="请选择" clearable
                                 :disabled="propfrom.isNotEdit" @change="grxzcfSelect(index)">
                        <el-option
                          v-for="(item, index) in Options.tb_dic_grxzcf"
                          :key="index"
                          :label="item.dictLabel"
                          :value="item.dictValue"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="2" style="text-align: center;">
                    <el-form-item label=" ">
                      <i v-if="!propfrom.isNotEdit" class="el-icon-remove-outline"
                         @click="delectHzcfqkItem(index, '2')"/>
                    </el-form-item>
                  </el-col>
                  <!-- <el-col :xs="24" :sm="12" :lg="8" :span="8" v-if="form.zqxxGrclList[index].grxzcfdm == '02'">
                    <el-form-item label="罚款金额(元)">
                      <el-input type="text" v-model="form.zqxxGrclList[index].fkje" palaceholder="请输入"/>
                    </el-form-item>
                  </el-col> -->
                </el-row>
              </div>
            </div>
          </div>

          <div v-if="form.qwhz == '0' && form.sfxsfh == '1'" class="fire_building_describe">
            <h2 class="title">刑事放火</h2>
            <!-- <el-row :gutter="50">
								<el-col :span="24">
									<el-form-item label="是否属于刑事放火" prop="sfxsfh">
										<el-radio-group v-model="form.sfxsfh">
											<el-radio label="1" value="1">是</el-radio>
											<el-radio label="0" value="0">否</el-radio>
										</el-radio-group>
									</el-form-item>
								</el-col>
							</el-row> -->
            <el-row v-if="form.sfxsfh == '1'" :gutter="50">
              <el-col :span="24">
                <el-form-item label="移交资料">
                  <el-input v-model="form.zqxxXsfh.yjzlName" placeholder="请上传文件" readonly
                            :disabled="propfrom.isNotEdit">
                    <div slot="suffix">
                      <div class="upload">
                        <i class="iconfont icon-shangchuan"/>
                      </div>
                      <el-upload
                        class="upload-demo"
                        action="string"
                        :show-file-list="false"
                        :disabled="propfrom.isNotEdit"
                        :http-request="uploadImg"
                      >
                        <el-button type="primary">
                          上传
                          <i class="el-icon-upload el-icon--right"/>
                        </el-button>
                      </el-upload>
                    </div>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="移交资料描述">
                  <el-input v-model="form.zqxxXsfh.yjzlRemark" placeholder="请输入描述信息" clearable
                            :disabled="propfrom.isNotEdit"/>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="案件结果">
                  <el-input v-model="form.zqxxXsfh.ajjgName" placeholder="请上传文件" readonly
                            :disabled="propfrom.isNotEdit">
                    <div slot="suffix">
                      <div class="upload">
                        <i class="iconfont icon-shangchuan"/>
                      </div>
                      <el-upload
                        class="upload-demo"
                        action="string"
                        :show-file-list="false"
                        :disabled="propfrom.isNotEdit"
                        :http-request="uploadajjg"
                      >
                        <el-button type="primary">
                          上传
                          <i class="el-icon-upload el-icon--right"/>
                        </el-button>
                      </el-upload>
                    </div>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="案件结果描述">
                  <el-input v-model="form.zqxxXsfh.ajjgRemark" placeholder="请输入描述信息" clearable
                            :disabled="propfrom.isNotEdit"/>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="现场情况报告">
                  <el-input v-model="form.zqxxXsfh.xcqkbgName" placeholder="请上传文件" readonly
                            :disabled="propfrom.isNotEdit">
                    <div slot="suffix">
                      <div class="upload">
                        <i class="iconfont icon-shangchuan"/>
                      </div>
                      <el-upload
                        class="upload-demo"
                        action="string"
                        :http-request="uploadxcqkbg"
                        :show-file-list="false"
                      >
                        <el-button type="primary">
                          上传
                          <i class="el-icon-upload el-icon--right"/>
                        </el-button>
                      </el-upload>
                    </div>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="现场情况报告描述">
                  <el-input v-model="form.zqxxXsfh.xcqkbgRemark" placeholder="请输入描述信息" clearable
                            :disabled="propfrom.isNotEdit"/>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div v-if="form.qwhz == '0'" class="fire_building_describe">
            <h2 class="title">安全生产事故</h2>
            <el-row :gutter="50">
              <el-col :span="24">
                <el-form-item label="是否属于安全事故" prop="sfaqscsg">
                  <el-radio-group v-model="form.sfaqscsg" :disabled="propfrom.isNotEdit">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="form.sfaqscsg == '1'" :gutter="50">
              <el-col :span="24">
                <el-form-item label="有关政府文件">
                  <el-input v-model="form.zqxxAqscsg.ygzfwjName" style="width:90%" placeholder="请上传文件"
                            readonly :disabled="propfrom.isNotEdit">
                    <div slot="suffix">
                      <div class="upload">
                        <i class="iconfont icon-shangchuan"/>
                      </div>
                      <el-upload
                        class="upload-demo"
                        action="string"
                        :http-request="uploadzfwj"
                        :show-file-list="false"
                        :disabled="propfrom.isNotEdit"
                      >
                        <el-button type="primary">
                          上传
                          <i class="el-icon-upload el-icon--right"/>
                        </el-button>
                      </el-upload>
                    </div>
                  </el-input>
                  <el-button v-if="form.zqxxAqscsg.ygzfwjName" type="primary"
                             @click="downloadFires(form.zqxxAqscsg.ygzfwj, form.zqxxAqscsg.ygzfwjName)">
                    下载
                  </el-button>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="有关政府文件描述">
                  <el-input v-model="form.zqxxAqscsg.ygzfwjRemark"   style="width:90%"
                            placeholder="请输入描述信息" clearable :disabled="propfrom.isNotEdit"/>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="现场情况报告">
                  <el-input v-model="form.zqxxAqscsg.xcqkbgName" style="width:90%" placeholder="请上传文件"
                            readonly :disabled="propfrom.isNotEdit">
                    <div slot="suffix">
                      <div class="upload">
                        <i class="iconfont icon-shangchuan"/>
                      </div>
                      <el-upload
                        class="upload-demo"
                        action="string"
                        :http-request="uploadxcbg1"
                        :show-file-list="false"
                        :limit="3"
                      >
                        <el-button type="primary">
                          上传
                          <i class="el-icon-upload el-icon--right"/>
                        </el-button>
                      </el-upload>
                    </div>
                  </el-input>
                  <el-button v-if="form.zqxxAqscsg.xcqkbgName" type="primary"
                             @click="downloadFires(form.zqxxAqscsg.xcqkbg, form.zqxxAqscsg.xcqkbgName)">
                    下载
                  </el-button>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="现场情况报告描述">
                  <el-input v-model="form.zqxxAqscsg.xcqkbgRemark" style="width:90%"
                            placeholder="请输入描述信息" clearable :disabled="propfrom.isNotEdit"/>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="24">
								<el-form-item label="火场图片">
									<el-input placeholder="请上传文件" v-model="form.zqxxAqscsg.hctp" readonly>
										<div slot="suffix">
											<div class="upload">
												<i class="iconfont icon-shangchuan"></i>
											</div>
											<el-upload
												class="upload-demo"
												action="string"
												multiple
												:http-request="uploadgcpic"
												:show-file-list="false"
											>
												<el-button type="primary">
													上传
													<i class="el-icon-upload el-icon--right"></i>
												</el-button>
											</el-upload>
										</div>
									</el-input>
								</el-form-item>
							</el-col>-->
            </el-row>
          </div>

          <div class="fire_building_describe">
            <h2 class="title">火场图片</h2>
            <el-row :gutter="50">
              <!-- <el-col :span="24">
								<el-form-item label="火场图片">
									<el-input placeholder="请上传图片" v-model="form.hctp" readonly>
										<div slot="suffix">
											<div class="upload">
												<i class="iconfont icon-shangchuan"></i>
											</div>
											<el-upload
												class="upload-demo"
												action="string"
												:http-request="uploadhcpic1"
												:show-file-list="false"
												:limit="3"
											>
												<el-button type="primary">
													上传
													<i class="el-icon-upload el-icon--right"></i>
												</el-button>
											</el-upload>
										</div>
									</el-input>
								</el-form-item>
							</el-col> -->
              <el-col :span="24">
                <el-upload
                  ref="imageUpload"
                  action=""
                  :auto-upload="true"
                  list-type="picture-card"
                  multiple
                  :limit="9"
                  accept=".jpg,.png,.jpeg"
                  :file-list="picUploadList"
                  :before-upload="beforeAvatarUpload"
                  :http-request="uploadImage"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove"
                  :on-exceed="picLimitAlert"
                  :disabled="propfrom.isNotEdit"
                >
                  <i class="el-icon-plus"/>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
              </el-col>
            </el-row>
          </div>

          <div v-if="form.qwhz == '0'" class="fire_building_describe">
            <h2 class="title">其他</h2>
            <el-row :gutter="50">
              <el-col :span="24">
                <el-form-item label="其他说明">
                  <el-input v-model="form.qtsm" type="textarea" resize="none"
                            :disabled="propfrom.isNotEdit"/>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="相关附件上传">
                  <el-input v-model="form.ygfjscName" style="width:90%" placeholder="请上传文件" readonly
                            :disabled="propfrom.isNotEdit">
                    <div slot="suffix">
                      <div class="upload">
                        <i class="iconfont icon-shangchuan"/>
                      </div>
                      <el-upload
                        class="upload-demo"
                        action="string"
                        :http-request="uploadxgfj"
                        :show-file-list="false"
                        :limit="3"
                        :disabled="propfrom.isNotEdit"
                      >
                        <el-button type="primary">
                          上传
                          <i class="el-icon-upload el-icon--right"/>
                        </el-button>
                      </el-upload>
                    </div>
                  </el-input>
                  <el-button v-if="form.ygfjscName" type="primary"
                             @click="downloadFires(form.ygfjsc, form.ygfjscName)">下载
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!--起火经过-->
          <div class="fire_building_describe">
            <h2 class="title">起火经过</h2>
            <el-row :gutter="50">
              <el-col :span="24">
                <el-form-item  label="火灾经过" v-if="!fireEdit" prop="fireProcess">
                  <el-input v-model="fireProcess" type="textarea" resize="none" disabled v-if="propfrom.type == 0 && !useHistory" />
                  <el-input v-model="form.fireProcess" type="textarea" resize="none" disabled v-if="propfrom.type == 0 && useHistory"  />
                  <el-input v-model="form.fireProcess" type="textarea" resize="none" disabled v-if="propfrom.type != 0" />
                </el-form-item>
                <el-form-item  label="火灾经过" v-else-if="fireEdit" prop="fireProcess">
                  <el-input v-model="form.fireProcess" type="textarea" resize="none"  />
                </el-form-item>
              </el-col>
              <el-col class="btn-center">
                <el-button type="primary" icon="el-icon-edit" @click="writeFile" v-if="!propfrom.isNotEdit" >完善起火经过</el-button>
              </el-col>
            </el-row>
          </div>

          <!-- 火灾标签 -->
          <div class="fire_building_describe" v-if="targetShowFlag">
            <h2 class="title">火灾标签</h2>
            <el-row :gutter="50">
              <el-col :span="24" >
                <el-form-item prop="fireProcess">
                  <el-row :gutter="10">
                    <el-col :span="24" style="border: 1px solid rgba(0,0,0,0.2);min-height: 70px;border-radius: 4px;">
                      <el-row :gutter="10" class="mb8">
                      	<el-col style="cursor: pointer;" :span="1.5" v-for="(t, index) in selectTargetList" :key="index">
                          <el-tag size="medium"  :type="t.type" effect="dark" closable @close="handleClose(index,t)">{{ t.tagName }}</el-tag>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-col>
              <el-col class="btn-center">
                <el-button type="primary" icon="el-icon-icon" @click="addTarget">添加标签</el-button>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </div>
    </div>
    <audit v-if="propfrom.type == 1 || propfrom.type == 3" :propfrom="propfrom" @auditData="auditData"/>

    <!-- 起火场所 -->
    <fireSpaceMul ref="Mulmodel" :qhcs-type="form.qhcslb ? form.qhcslb : ''" @setMulVals="setMulVals"/>
    <!-- 起火物 -->
    <fireObjectMul ref="fireObjecMul" @setFireMulVal="setFireMulVal"/>
    <!-- 起火原因 -->
    <fireReasonMul ref="fireReasonMul" @setFireReasonMulVal="setFireReasonMulVal"/>
    <!-- 不排除起火原因 -->
    <fireBpcMul ref="bpcModel" @setMulVal="setbpcVal"/>
    <div class="bottom-btnGroup">
      <el-button v-if="!propfrom.isNotEdit" size="medium" @click="back">返&nbsp;回</el-button>
      <el-button v-if="propfrom.type == '0'" type="primary" size="medium" @click="submitForm('ruleForm')">{{propfrom.jqbh==""?"保&nbsp;存":"送&nbsp;审"}}</el-button>
      <el-button v-if="propfrom.type == '1' && !propfrom.isNotEdit" type="primary" size="medium" @click="submitAudit('ruleForm')">审&nbsp;核</el-button>
      <el-button v-if="propfrom.type == '2'" type="primary" size="medium" @click="submitEdit('ruleForm')">修&nbsp;改</el-button>
      <el-button v-if="propfrom.type == '3'" type="primary" size="medium" @click="submitAudit('ruleForm')">修&nbsp;改</el-button>
    </div>
    <el-dialog title="添加标签" :visible.sync="targetFlag">
      <el-row :gutter="10">
      	<el-col style="cursor: pointer;" :span="1.5" v-for="(t, index) in targetList" :key="index">
          <el-tag size="medium" @click="selectTag(index,t)"  :type="t.type" effect="dark">{{ t.tagName }}</el-tag>
        </el-col>
      </el-row>
    </el-dialog>
    <zjccss :list="eventList" @total="setZjccss" ref="zjccss"/>
  </div>
</template>

<script>
// 获取下拉框数据
import {
  getSelectOptions,
  getTreeOptions,
  getFirePlaceOptions,
  saveWrite,
  UploadFile,
  UploadPicFile,
  getJqxxList,
  getCdxxList,
  lszqDetailList,
  getFireHistoryFormInfo,
  doAduit,
  getHisDataPic,
  updateCaogao,
  deletePicByAvater, // 删除火场图片
  getHisCaogaoDataDetail,
  repprtFill
} from '@/api/data/entry/zqxx';
import {
  listTarget, targetNameTarget, addBusinessTags, deleteBusinessTags, queryBusinessTags
} from "@/api/system/dict/target";
import { formatterDate } from "@/utils/index";
import { getCreateDeptAndDate } from "@/api/data/aduit/zqxx";
import fireSpaceMul from './fireSpaceMul.vue'
import fireObjectMul from './fireObjectMul'
import fireReasonMul from './fireReasonMul'
import fireBpcMul from './fireBpcMul'
import topDetail from './topDetail'
import { options, treeOptions } from './options'
import { formList, rulesList, echoCheckData } from './form'
import { fileDownload } from '@/utils/fileDownload'
import audit from '@/views/data/aduit/zqxx/components/audit'
import { nation } from '@/utils/nation'
import zjccss from '@/views/data/entry/zqxx/components/zjccss'
import { getEvent } from '@/api/data/entry/gmccss'

export default {
  name: 'DisasterSituationReport',
  components: {
    fireSpaceMul,
    fireObjectMul,
    fireReasonMul,
    fireBpcMul,
    topDetail,
    audit,
    zjccss
  },
  props: ['propfrom'],
  data () {
    return {
      imgState: false,
      picUploadList: [], // 已上传的火场照片文件列表
      dialogImageUrl: '',
      dialogVisible: false,
      name: '', // 起火物选择其他的时候，自定义名称
      content_kv_show: true, // 警情信息
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now();
        },
      },
      rules: rulesList, // 表单验证
      date: [
        {
          type: 'date',
          required: true,
          message: '请选择日期',
          trigger: 'change'
        }
      ],
      //头部显示创建人和创建时间
      tbsj: '',
      deptname: '',


      xzqydmSj: '', // 行政区域
      xzqydm: '', // 行政区域代码
      zqbh: '', // 火灾编号
      loading: '', // 加载
      hurtDeathNum: '',
      isdisappear: true,
      ishurt: '0', // 人员是否伤亡
      deadNumber: 0, // 死亡人数
      hurtNumber: 0, // 受伤人数
      hurtZsNumber: 0, //重伤人数
      hurtQsNumber: 0, //轻伤人数
      isLast: false, // 是否有下一项
      jqTopData: {}, // 警情头部信息
      cdTopData: [], // 出动信息
      isRegister: '0', // 处理情况 - 火灾处罚情况 是否立案
      form: {
        zqbh: '', // 火灾编号
        xzqydm: '', // 行政区域代码
        jqbh: '', // 警情编号
        qwhz: '', // 轻微火灾
        // 基本信息
        sfdcz: '0', // 是否正在调查
        zqlbdm: '', // 火灾等级
        zqsj: '', // 起火时间
        zqdd: '', // 起火地点
        lxdh: '', // 失火单位/户主联系电话
        sfcz: '0', // 是否成灾
        dwtyshxydm: '', // 单位统一社会信用代码
        qydm: '', // 区域
        czc: '', // 城中村
        qydmItem2: '', // 区域2
        jdjcqk: '', // 监督检查情况
        jdjcqkItems: '',
        jdjcqkItem1: '', // 监督检查情况2
        jdjcqkItem2: '', // 监督检查情况3
        sgqtdcbm: '', // 事故调查牵头部门
        sgqtdcbmItem1: '', // 事故调查牵头部门2
        hylbdm: '', // 所属行业
        jjlxdm: '', // 经济类型

        // 起火场所信息
        qhcslb: '', // 起火场所类型+++++++++++
        qhcsms: '', // 起火场所名称
        zqxxQhcsList: [], // 起火场所列表
        qhcsdm: '', // 起火场所代码

        sfyc: '0', // 是否属于世界遗产
        sfsjycdm: '', // 世界遗产2
        jzsyyt: '', // 建筑使用用途
        jzsyytItem1: '', // 建筑使用用途2
        jzlbdm: '', // 建筑类别
        dxzht: '', // 大型综合体
        jznhdjdm: '', // 建筑耐火等级
        jzjgdm: '', // 建筑结构
        jzjgdm2: '',//房屋属性

        // 火灾及失火建筑情况描述
        hzsfmydljjz: '0', // 火灾蔓延到邻近建筑
        sffshr: '0', // 发生轰然
        shjzmcsfkq: '0', // 失火建筑门窗在火灾过程中开启
        jzzlcs: '', // 建筑总楼层数
        shlc: '', // 失火楼层
        fwjznf: '',//房屋建筑年份

        // 消防设施
        zdbjxtsfaz: '', // 自动报警系统(含独立报警)
        zdbjxtsfazItem1: '',
        zdbjxtsfazItem2: '',
        zdbjxtsfazItem3: '',
        zdmhxtsfaz: '', // 自动灭火系统(含简易喷淋)
        zdmhxtsfazItem1: '',
        zdmhxtsfazItem2: '',
        zdmhxtsfazItem3: '',
        fpyxtsfaz: '', // 防排烟系统
        fpyxtsfazItem1: '',
        fpyxtsfazItem2: '',
        fpyxtsfazItem3: '',
        fhjl: '', // 防火卷帘
        fhjlItem1: '',
        fhjlItem2: '',
        fhjlItem3: '',
        snxhsxtsfaz: '', // 室内消火栓系统
        snxhsxtsfazItem1: '',
        snxhsxtsfazItem2: '',
        snxhsxtsfazItem3: '',
        fhfq: '', // 防火分区
        fhfqIiem1: '0', // 米
        fhjj: '', // 防火间距
        fhjjItem1: '0', // 米
        sstd: '', // 疏散通道
        sstdItem1: '',
        yjck: '', // 紧急出口
        yjckItem1: '',
        yjsszm: '', // 应急疏散照明
        yjsszmItem1: '',
        sflw: '', // 联网情况
        sflwItem1: '', //
        sfbx: '', // 是否保险
        sfbxItem1: '',
        sfdfhzsh: '', // 是否单方火灾事故

        // 起火原因
        qhwms: '', // 起火物名称
        qhwfldm: '', // 起火物代码
        qhwmsItem1: '', // 起火物其他
        hzyyms: '', // 起火原因名称
        hzyymsItem1: '',//起火原因其他
        hzyyfldm: '', // 起火原因代码
        bpchzyymc: '', // 不排除原因名称
        zqxxBpchzyyList: [], // 不排除火灾原因列表

        // 引起火灾原因人员情况 //
        zqxxYqhzry: {
          // 年龄
          nl: '',
          // 受教育情况
          sjycddm: '',
          // 健康状况
          jkzkdm: ''
        },

        // 直接经济损失
        dcfs: '', // 调查方式
        zjccss: undefined, // 直接财产损失（元)
        hzxcczfy: undefined, // 火灾现场处置费用（元)
        ryswzc: undefined, // 人身伤亡支出（元)
        ssly: '', // 损失来源
        // protectPropVal: undefined, //保护财产价值
        ghmj: undefined, // 过火面积（平方米）
        szhs: undefined, // 受灾户数（户）
        szrs: undefined, // 直接受灾人数（人）
        qsrs: undefined,//轻伤人数

        // 人员伤亡情况
        ssryList: [], // 受伤人员名单
        swryList: [], // 死亡人员名单

        zqxxRyswList: [], // 人员受伤名单

        // 处理情况 - 两案处理
        sfla: '1', // 是否立案
        zjrs: '', // 追究人数
        jyclrs: '', // 建议处理人数

        // 处理情况 - 火灾处罚情况
        zqxxDwclList: [], // 单位列表
        zqxxGrclList: [], // 个人列表
        // 刑事放火
        sfxsfh: '0', // 是否属于刑事放火
        zqxxXsfh: {
          yjzl: '', // 移交资料
          yjzlName: '', // 移交资料名
          yjzlRemark: '', // 移交资料描述
          ajjg: '', // 案件结果
          ajjgName: '', // 案件结果名
          ajjgRemark: '', // 案件结果描述
          xcqkbg: '', // 现场情况报告
          xcqkbgName: '', // 现场情况报告名
          xcqkbgRemark: '' // 现场情况报告描述
        },
        // 安全生产事故
        sfaqscsg: '0', // 是否属于安全事故
        zqxxAqscsg: {
          ygzfwj: '', // 有关政府文件
          ygzfwjName: '', // 有关政府文件名
          ygzfwjRemark: '', // 有关政府文件描述
          xcqkbg: '', // 现场情况报告
          xcqkbgName: '', // 现场情况报告名称
          xcqkbgRemark: '' // 现场情况报告描述
        },

        // 火场图片
        hctp: '',

        // 其他
        qtsm: '', // 其他说明
        ygfjscName: '', // 相关附件名称
        ygfjsc: '', // 相关附件上传

        issueFlag: '',//提交标志状态
        fireProcess: '' //火灾经过
      },
      // select数据
      Options: {
        dcfs: [], hylbdm: [], jjlxdm: [], qhcslb: [], sfsjycdm: [], jzlbdm: [],
        jznhdjdm: [], jzjgdm: [], jzjgdm2: [], fhfq: [], fhjj: [], sstd: [], sflw: [], sflwItem1: [],
        zdbjxtsfaz: [], zdbjxtsfazItem1: [], zdbjxtsfazItem2: [], zdbjxtsfazItem3: [],
        zdmhxtsfaz: [], zdmhxtsfazItem1: [], zdmhxtsfazItem2: [], zdmhxtsfazItem3: [],
        fpyxtsfaz: [], fpyxtsfazItem1: [], fpyxtsfazItem2: [], fpyxtsfazItem3: [],
        snxhsxtsfaz: [], snxhsxtsfazItem1: [], snxhsxtsfazItem2: [], snxhsxtsfazItem3: [],
        fhjlItem1: [], fhjlItem2: [], fhjlItem3: [], jjck: [], yjsszm: [], yjsszmItem1: [],
        sjycddm: [], jkzkdm: [], ssly: [], xb: [], nl: [], swyydm: [], rklydm: [], rklydm2: [],
        zydm: [], swwzdm: [], swsjdm: [], dwxzcfdm: [],
        grxzcfdm: [], qydm: [], jdjcqk: [], jdjcqkItem1: [], jdjcqkItem2: [], sgqtdcbm: [],
        sstdItem1: [], jjckItem1: [], qydmItem2: [], jzsyyt: [], jzsyytItem1: [], swsjItem1: [],
        jzzlcs: '', // 建筑总楼层数
        shlc: '', // 失火楼层
        fwjznf: '',//房屋建筑年份
        lxdh: '', // 电话
        dwtyshxydm: '' // 单位统一社会信用代码
      },
      // 消防设备列表
      xfsb: {
        bj: 'zdbjxtsfazItem',
        mh: 'zdmhxtsfazItem',
        py: 'fpyxtsfazItem',
        jl: 'fhjlItem',
        xhs: 'snxhsxtsfazItem'
      },
      // 拿三个flag来标记请求是否结束
      optionsDone: false,
      treeOptionsDone: false,
      detailDone: false,
      // 暂存的详情
      formData: {},
      /**
       * 审核需要传的参数
       */
      comment: '',
      level: '',
      isEnd: false,
      flag: true,
      zjLevel: 0, // 存储火灾等级1一般 2较大 3重大 4特大
      swLevel: 0,
      zsLevel: 0,
      fireEdit: false, //是否填写火灾经过
      useHistory: false,
      shlcArr: '', //失火楼层,
      shlcArrList: [], //失火楼层列表
      targetFlag: false,
      targetList: [],
      selectTargetList: [],
      sortNum: 0,
      targetShowFlag: false,
      gcjzjgList: [], //高层建筑结构列表
      gcjzjgList2: [
        { key: '商品房', value: '1' },
        { key: '已购公房', value: '2' },
        { key: '经济适用房', value: '3' },
        { key: '小产权房', value: '4' },
      ],//房屋属性
      zjlx: [          //证件类型 1.身份证 2.出生证 3.军官证 4.士兵证 5.港澳通行证 6.台湾通行证 7.护照
        { key: '身份证', value: '1' },
        { key: '出生证', value: '2' },
        { key: '军官证', value: '3' },
        { key: '士兵证', value: '4' },
        { key: '港澳通行证', value: '5' },
        { key: '台湾通行证', value: '6' },
        { key: '护照', value: '7' }
      ],
      nation,
      eventList: []
    }
  },
  computed: {
    easyMessage: function () {
      let qhw = '(起火物)';
      if (this.form.qhwms !== '' && this.form.qhwms !== null) {
        qhw = this.form.qhwms
      }
      let ghmj = '0';
      if (this.form.ghmj !== 0 && this.form.ghmj !== undefined) {
        ghmj = this.form.ghmj
      }
      let zjccss = '0';
      if (this.form.zjccss != undefined || this.form.hzxcczfy != undefined || this.form.ryswzc != undefined) {
        zjccss = this.sum([this.form.zjccss, this.form.hzxcczfy, this.form.ryswzc]);
      }
      // const deadNum = this.deadNumber == 0 ? '0' : this.deadNumber
      // const hurtNum = this.hurtNumber == 0 ? '0' : this.hurtNumber

      const cddw = this.cdTopData.map(item => {
        return `${item.xfdwdm}站${item.trll}${item.respondType}`
      }).join('、')
      const dcsj = this.cdTopData.map(item => {
        if (item.dcorzfsj) {
          return `${item.dcorzfsj}，${item.xfdwdm}到场，`
        } else {
          return `${item.xfdwdm + '未填写到场时间，'}`
        }
      }).join('')
      const kzsj = this.cdTopData.length && (
        this.cdTopData[0].kzsj ?
          this.cdTopData[0].kzsj + '，现场情况得到控制'
          : ''
      )
      const jssj = this.cdTopData.length && this.cdTopData[0].jssj
      const jyxx = this.form.qwhz !== 1
        ? `起火建筑简要情况:楼层数：${this.form.jzzlcs
        || 'xx'}，失火楼层：${this.form.shlc || 'xx'}，`
        : ''
      return `${this.form.zqsj || '(起火时间)'}，${this.xzqydmSj
        || '(行政区域)'}、${this.dwmcHzm
        || '(单位名/户主名)'}发生火灾，调派${cddw
        || '(出动队伍)'}，${dcsj || ('队伍到达时间')}${kzsj || ('控制时间无')}。${jssj
        || ('结束时间')}，处置完毕。${jyxx}过火面积 ${ghmj || 'xx'} 平方米，燃烧物质为${qhw}:${this.form.qhwmsItem1
        || 'xx'}，火灾原因：${this.form.hzyyms
        || '(起火原因)'}。造成 ${this.form.swryList.length || 0} 人死亡、${this.form.ssryList.length || 0} 人受伤。`
    },
    fireProcess: {
      get: function () {
        return this.form.fireProcess = this.easyMessage;
      }
    }
  },
  watch: {
    "form.ssryList": {
      handler (val) {
        val.length &&
          val.forEach((element, index) => {
            this.rules[`ssryList.${index}.swfl`] = [
              {
                required: true,
                message: "受伤人员伤情不能为空",
                trigger: "change"
              }
            ];
          });
      },
      immediate: true
    },
    "form.swryList": {
      handler (val) {
        val.length &&
          val.forEach((element, index) => {
            this.rules[`swryList.${index}.xm`] = [
              {
                required: true,
                message: "死亡人员姓名不能为空",
                trigger: "blur"
              }
            ];
            this.rules[`swryList.${index}.xb`] = [
              {
                required: true,
                message: "死亡人员性别不能为空",
                trigger: "blur"
              }
            ];
            this.rules[`swryList.${index}.sfzhm`] = [
              {
                required: true,
                trigger: 'blur',
                validator: this.zjhmswpd
              }
            ];
            this.rules[`swryList.${index}.idType`] = [
              {
                required: true,
                message: "证件类型不能为空",
                trigger: ['blur', 'change']
              }
            ];
            this.rules[`swryList.${index}.nation`] = [
              {
                required: false,
                message: "民族不能为空",
                trigger: ['blur', 'change']
              }
            ];
            this.rules[`swryList.${index}.nl`] = [
              {
                required: true,
                message: "死亡人员年龄不能为空",
                trigger: ['blur', 'change']
              }
            ];
            this.rules[`swryList.${index}.zydm`] = [
              {
                required: true,
                message: "死亡人员职业不能为空",
                trigger: ['blur', 'change']
              }
            ];
            this.rules[`swryList.${index}.sjycddm`] = [
              {
                required: true,
                message: "死亡人员受教育程度不能为空",
                trigger: ['blur', 'change'],
              }
            ];
            this.rules[`swryList.${index}.jkzkdm`] = [
              {
                required: true,
                message: "死亡人员健康状况不能为空",
                trigger: ['blur', 'change']
              }
            ];
            this.rules[`swryList.${index}.swyydm`] = [
              {
                required: true,
                message: "死亡人员致死原因不能为空",
                trigger: ['blur', 'change']
              }
            ];
            this.rules[`swryList.${index}.rklydm`] = [
              {
                required: true,
                message: "死亡人员来源不能为空",
                trigger: ['blur', 'change']
              }
            ];
            this.rules[`swryList.${index}.rklydm2`] = [
              {
                required: true,
                message: "死亡人员来源详情不能为空",
                trigger: ['blur', 'change']
              }
            ];
            this.rules[`swryList.${index}.swwzdm`] = [
              {
                required: true,
                message: "死亡人员发现尸体位置不能为空",
                trigger: ['blur', 'change']
              }
            ];
            this.rules[`swryList.${index}.swsjdm`] = [
              {
                required: true,
                message: "死亡人员死亡时间不能为空",
                trigger: ['blur', 'change']
              }
            ];
            this.rules[`swryList.${index}.swsjdmItem1`] = [
              {
                required: true,
                message: "死亡人员死亡时间详细信息不能为空",
                trigger: ['blur', 'change']
              }
            ];
          });
      },
      immediate: true
    },
    "form.zqlbdm": function (newZqlb, oldZqlb) {
      let hzdjTxt = "";
      switch (newZqlb) {
        case '10001':
          hzdjTxt = '一般';
          break;
        case '10002':
          hzdjTxt = '较大';
          break;
        case '10003':
          hzdjTxt = '重大';
          break;
        case '10004':
          hzdjTxt = '特大';
          break;
        default:
          hzdjTxt = '无';
          break
      }
      if (this.form.qwhz == '0') {
        if (newZqlb != oldZqlb) {
          if (this.$route.query.isReject != '1') {
            this.$message({
              duration: 3000,
              showClose: true,
              message: `您填写的条件火灾等级判定为${hzdjTxt}`,
              type: 'warning'
            });
          }
        }
      }
    }
    // "form.zqsj"(val) {
    // 	this.handleName();
    // },
    // optionsDone(val) {
    // 	this.echo();
    // },
    // treeOptionsDone(val) {
    // 	this.echo();
    // },
    // detailDone(val) {
    // 	this.echo();
    // }
  },
  created () {
    this.content_kv_show = this.propfrom.state || this.$route.query.state;
    // this.form.zqlbdm = this.propfrom.qwhz == 1 ? '10000' : '10001';
    this.form.qwhz = this.propfrom.qwhz;
    this.form.zqdd = this.propfrom.jqfsdd;
    this.form.jqbh = this.propfrom.jqbh;
    this.form.issueFlag = this.propfrom.type;
    this.form.zqsj = this.propfrom.jjsj;
    this.form.secondarySlightly = this.propfrom.secondarySlightly;
    this.getEventList(this.form.jqbh);
    if (this.propfrom.qwhz == 1) {
      this.form.zqlbdm = '10000';
    } else {
      if (this.propfrom.type == '0') {
        this.form.zqlbdm = '10001';
      }
    }
    if (this.propfrom.state) {
      // 获取警情头部信息
      getJqxxList({
        jqbh: this.form.jqbh
      })
        .then(res => {
          //todo
          // console.log(res.data);
          this.dwmcHzm = res.data.dwmcHzm;
          this.xzqydmSj = res.data.xzqydmSj;
          this.xzqydm = res.data.xzqydm; //行政区域代码
          this.form.xzqydm = res.data.xzqydm; // 获取行政区域代码
          this.jqTopData = res.data
          res.data.qhcslb && (this.form.qhcslb = res.data.qhcslb)
          res.data.qhcsms && (this.form.qhcsms = res.data.qhcsms)
          res.data.qhcsdm && (this.form.qhcsdm = res.data.qhcsdm)
        })
        .catch(res => {
          console.error(res)
        });
      // 头部出动查询
      getCdxxList({
        jqbh: this.form.jqbh
      })
        .then(res => {
          this.cdTopData = res.data
        })
        .catch(res => {
          console.error(res)
        });
      this.form.fireProcess = this.easyMessage;
    }
    // 获取下拉框的数据
    this.setSelectInfo();
    // },
    // mounted() {
    //查询头部显示创建人和创建时间
    if (this.propfrom.type == '1') {
      getCreateDeptAndDate({ zqbh: this.propfrom.zqbh })
        .then(res => {
          if (res.code == 200) {
            this.tbsj = res.data.tbsj;
            this.deptname = res.data.deptname;
          }
        })
    }
    // 如果是修改 就请求数据来回显
    if (this.propfrom.type == '1' || this.propfrom.type == '3') {
      this.loading = true;
      this.getImageList();// 获取图片列表展示
      lszqDetailList({ zqbh: this.propfrom.zqbh })
        .then(res => {
          // console.log("回显", res.data);
          this.formData = res.data[0];
          // 根据是否调查中初始化表单校验项
          this.initFormValidate(this.formData.sfdcz);
          this.echoGetTreeOptions(); // 回显数据获取消防设施数据
          this.formData.zqxxDwclList.length > 0 || this.formData.zqxxGrclList.length > 0 ? this.isRegister = '1' : this.isRegister = '0';
          this.formData.zqxxRyswList.length > 0 ? this.ishurt = '1' : this.ishurt = '0';
          if (this.formData.swryList != null || this.formData.swryList != []) {
            this.formData.swryList.forEach((item, index) => {
              getTreeOptions({
                dictType: "swsj",
                parentValue: item.swsjdm
              })
                .then(res => {
                  if (res.code == 200) {
                    item.swsjItem1 = res.data;
                  }
                })
            })
          }
          setTimeout(() => {
            this.form = Object.assign(this.form, echoCheckData(this.formData));
            if (this.propfrom.type == '3') {
              this.form.qwhz = this.propfrom.qwhz;
              this.form.zqlbdm = this.propfrom.qwhz == 1 ? '10000' : '10001';
              if (this.form.qwhz == 1) {
                this.form.swryList = [];
                this.form.ssryList = [];
              }
            }
            //火灾等级判定
            this.isSwTotal();
          }, 500);

          this.form.issueFlag = this.propfrom.type;

          this.loadNext(this.formData.jdjcqk);
          this.loadNext_1(this.formData.jdjcqkItems);
          this.loading = false
        })
        .catch(res => {
          this.loading = false
        })
        .finally(() => {
        })
    }
    if (this.propfrom.type == '2') {
      this.loading = true;
      this.getImageList();// 获取图片列表展示
      getHisCaogaoDataDetail({ zqbh: this.propfrom.zqbh })
        .then(res => {
          // console.log('haixiang', res.data[0]);
          this.formData = res.data[0];
          // 根据是否调查中初始化表单校验项
          this.initFormValidate(this.formData.sfdcz);
          this.echoGetTreeOptions(); // 回显数据获取消防设施数据
          // console.log(this.formData)
          this.formData.zqxxDwclList.length > 0 || this.formData.zqxxGrclList.length > 0 ? this.isRegister = '1' : this.isRegister = '0';
          this.formData.zqxxRyswList.length > 0 ? this.ishurt = '1' : this.ishurt = '0';
          if (this.formData.swryList != null || this.formData.swryList != []) {
            this.formData.swryList.forEach((item, index) => {
              getTreeOptions({
                dictType: "swsj",
                parentValue: item.swsjdm
              })
                .then(res => {
                  if (res.code == 200) item.swsjItem1 = res.data;
                })
            })
          }
          setTimeout(() => {
            this.form = echoCheckData(this.formData)
            this.form.qwhz = this.propfrom.qwhz;
            //火灾等级判定
            this.isSwTotal();
          }, 500);
          this.loadNext(this.formData.jdjcqk);
          this.loadNext_1(this.formData.jdjcqkItems);
          this.detailDone = true;
          this.loading = false;
        })
        .catch(res => {
          this.loading = false
        })
        .finally(() => {
        })
    }
    // 火灾填报时尝试使用历史数据
    if (this.propfrom.type === '0' && this.propfrom.jqbh) {
      this.loading = true;
      getFireHistoryFormInfo({ jqbh: this.propfrom.jqbh }).then(response1 => {
        if (response1.data) {
          if (response1.data[0].fireProcess) {
            this.useHistory = true;
          }
          const historyData = response1.data[0];
          // 回填图片
          getHisDataPic({ bh: historyData.zqbh }).then(response2 => {
            response2.data.forEach(el => {
              el.url = `${process.env.VUE_APP_FTP_API}${el.avatar}`;
            });
            this.picUploadList = response2.data
          });
          // 去掉会干扰当前填单逻辑的历史单信息
          delete historyData.zqbh;
          delete historyData.xzqydm;
          delete historyData.tbzh;
          delete historyData.tbr;
          delete historyData.tbsj;
          delete historyData.sfbjcg;
          delete historyData.xzqydmSj;
          if (this.form.xzqydm) {
            historyData.xzqydm = this.form.xzqydm;
            historyData.xzqydmSj = this.form.xzqydm.substring(0, 2);
          }
          /** 是否轻微火灾和火灾等级的特殊处理 **/
          if (this.propfrom.qwhz == 1) {
            // 选择了轻微火灾，则将火灾等级置成轻微等级
            historyData.zqlbdm = '10000';
          } else {
            // 选择的是非轻微火灾
            if (historyData.qwhz == 1) {
              // 若历史数据是轻微火灾，则需要给火灾等级设置一个非轻微等级的默认值
              historyData.zqlbdm = '10001';
            }
          }
          // 是否轻微火灾使用之前选择的值
          historyData.qwhz = this.propfrom.qwhz;
          // 开始表单初始化
          this.formData = historyData;
          // 根据是否调查中初始化表单校验项
          this.initFormValidate(this.formData.sfdcz);
          this.echoGetTreeOptions(); // 回显数据获取消防设施数据
          this.formData.zqxxDwclList.length > 0 || this.formData.zqxxGrclList.length > 0 ? this.isRegister = '1' : this.isRegister = '0';
          this.formData.zqxxRyswList.length > 0 ? this.ishurt = '1' : this.ishurt = '0';
          if (this.formData.swryList) {
            this.formData.swryList.forEach((item, index) => {
              getTreeOptions({ dictType: "swsj", parentValue: item.swsjdm }).then(res => {
                if (res.code === 200) {
                  item.swsjItem1 = res.data;
                }
              });
            });
          }
          setTimeout(() => {
            this.form = Object.assign(this.form, echoCheckData(this.formData));
            //火灾等级判定
            this.isSwTotal();
          }, 500);

          this.form.issueFlag = this.propfrom.type;

          this.loadNext(this.formData.jdjcqk);
          this.loadNext_1(this.formData.jdjcqkItems);
        }
      }).catch(error => {
      }).finally(() => {
        this.loading = false;
      });
    }
    if (this.propfrom.zqbh) {
      this.form.zqbh = this.propfrom.zqbh;
      this.targetShowFlag = true;
      this.queryTag(() => {
        this.getTagList();
      });
    }
  },
  methods: {
    createType (_type) {
      let _t = _type % 4;
      switch (_t) {
        case 0:
          return ""
          break;
        case 1:
          return "success"
          break;
        case 2:
          return "warning"
          break;
        case 3:
          return "danger"
          break;
        default:
          return ""
          break;
      }
    },
    //  获取标签
    getTagList () {
      setTimeout(() => {
      }, 3000);

      let _params = {
        tagName: "",
        tagType: "Z"
      }
      targetNameTarget(_params).then(
        response => {
          this.loading = false;
          if (response.code === 200) {
            let typeList = response.data;

            let _list = [];
            let _tmap = [];
            for (var i = 0; i < this.selectTargetList.length; i++) {
              _tmap[this.selectTargetList[i].tagId] = true;
            }

            for (var i = 0; i < typeList.length; i++) {
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
    handleClose (num, node) {
      let _params = {
        "relId": node.relId
      }
      deleteBusinessTags(_params).then(res => {
        this.changeTag(num, node, this.selectTargetList, this.targetList);
      });

    },
    // 查询业务标签
    queryTag (callback) {
      let _params = {
        "businessId": this.propfrom.zqbh
      }
      queryBusinessTags(_params).then(res => {
        if (res.code == 200) {
          this.selectTargetList = res.data;
          if (callback) {
            callback();
          }
        } else {
          this.msgError(res.msg);
        }
      });
    },
    // 选择标签
    selectTag (num, node) {
      let _params = {
        "tagId": node.tagId,
        "tagName": node.tagName,
        "businessId": this.propfrom.zqbh,
        "sortNum": node.sortNum,
        "tagType": "Z"
      }
      this.loading = true;
      addBusinessTags(_params).then((res) => {
        this.loading = false;
        if (res.code == 200) {
          this.sortNum++;
          this.queryTag();
          this.changeTag(num, node, this.targetList, this.selectTargetList);
        } else {
          this.msgError(res.msg);
        }

      });

    },
    changeTag (num, node, list1, list2) {
      list1.splice(num, 1);
      list2.push(node);
    },
    // 点击添加标签事件
    addTarget () {
      this.targetFlag = true;
    },
    downloadFires (url, name) {
      let $url = `${process.env.VUE_APP_BASE_API}${url}`;
      fileDownload($url, name);
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true
    },
    beforeAvatarUpload (file) {
      // console.log(file)
      const isJPG = (file.type === 'image/jpeg') || (file.type === 'image/jpg') || (file.type === 'image/png');
      const isLt2M = file.size / 1024 / 1024 < 6;

      if (!isJPG) {
        this.imgState = false;
        this.$message.error('上传图片只能是 JPG, JPEG, PNG 格式!');
      }
      if (!isLt2M) {
        this.imgState = false;
        this.$message.error('上传图片大小不能超过 6MB!');
      } else {
        this.imgState = true;
      }

      return isJPG && isLt2M;
    },
    /**
     * 上传火场照片
     * 上传单张不可大于10M
     */
    uploadImage (params) {
      if (this.imgState) {
        const formData = new FormData();
        formData.append('file', params.file); // 上传的文件
        formData.append('remark', ''); // 图片描述，当前传空，后期修改添加
        formData.append('zqbh', this.form.zqbh); // zqbh火灾编号
        // 调用上传接口
        UploadPicFile(formData).then(res => {
          this.picUploadList.push({
            uid: params.file.uid, // 已上传数组的唯一标识
            name: res.data.name, // 文件名称(应该没啥用)
            url: `${process.env.VUE_APP_BASE_API}${res.data.avatar}`, // 图片预览展示用的url
            avatar: res.data.avatar // 图片保存入库的url
          });
          this.form.zqbh = res.data.zqbh;
          this.$message({ message: '上传成功', type: 'success' });
        }).catch(err => {
          console.log(err, 'error')
        });
      }
    },
    // 达到照片上传上限时的提示
    picLimitAlert () {
      this.$message({ message: '最多上传9张照片', type: 'info' });
    },
    // 删除已上传的照片
    handleRemove (file, fileList) {
      deletePicByAvater({ avatar: file.avatar }).then(res => {
        this.$message({ message: '删除成功', type: 'success' });
        this.picUploadList = this.picUploadList.filter(f => f.uid !== file.uid);
      });
    },
    /**
     * 获取图片列表数据
     */
    getImageList () {
      getHisDataPic({ bh: this.propfrom.zqbh })
        .then(res => {
          res.data.forEach(el => {
            el.url = `${process.env.VUE_APP_FTP_API}${el.avatar}`
            // el.url = `http://10.19.11.35:8080${el.avatar}`;
          });
          this.picUploadList = res.data
          // console.log(res);
        })
        .finally(() => {
        })
    },
    // 获取审核数据
    auditData (val) {
      // 审核意见
      this.form.comment = val.comment;
      // 是否终止
      this.isEnd = val.isEnd;
      // 检查通过或退回
      // true 检查通过
      // false 退回
      this.flag = val.flag
    },
    // 回显
    echo () {
      if (this.propfrom.type == 0) {
        // 填报
        if (this.optionsDone && this.treeOptionsDone) {
          this.loading = false
        }
      } else {
        this.loading = false;
        // 修改
        if (this.optionsDone && this.treeOptionsDone && this.detailDone) {
          // this.form = this.formData;

          // this.form.jdjcqkItems = this.formData.jdjcqkItem1.split(',')
          // this.form.jdjcqkItems = this.formData.jdjcqkItem1.split(',')

          // this.loadNext(this.formData.jdjcqk);
          // this.loadNext_1(this.form.jdjcqkItems);
          // this.form.sfdcz = "0";
          this.loading = false
        }
      }
    },
    sfbxItemChange (val) {
      let arr = '';
      val.map(item => {
        arr += item + ','
      });
      this.form.sfbxItem1 = arr.substring(0, arr.lastIndexOf(','))
    },
    /**
     * 删除受伤人员
     * isdeadType伤亡人员类型
     * 0 受伤人员 1 死亡人员
     * index 删除受伤人员序号
     */
    delectHurt (index, isdeadType) {
      if (isdeadType == '0') {
        this.form.ssryList.splice(index, 1);
        this.hurtNumber--;
      } else {
        this.form.swryList.splice(index, 1);
        this.deadNumber--;
      }
      // this.form.zqxxRyswList.splice(index, 1);
      //火灾等级
      this.isSwTotal();
    },
    /**
     * 重置受伤人员
     * 1 有受伤人员
     * 0 无受伤人员
     */
    resetIshurt (val) {
      if (val == 0) {
        this.form.swryList = [];
        this.form.ssryList = [];
      }
      this.deadNumber = 0;
      this.hurtNumber = 0;
      this.swLevel = 0;
      this.zsLevel = 0;
      this.propertyEvent();
    },

    // 起火物
    openQhwMul () {
      if (this.propfrom.isNotEdit) {
        return
      }
      this.$refs.fireObjecMul.toggle();
      this.$refs.fireObjecMul.echo(this.form.qhwfldm)
    },
    // 起火原因
    openQhyyMul () {
      if (this.propfrom.isNotEdit) {
        return
      }
      this.$refs.fireReasonMul.toggle()
      // this.$refs.Mulmodel.echo();
    },
    // 起火场所
    openQhcsMul () {
      if (this.propfrom.isNotEdit) {
        return
      }
      this.$refs.Mulmodel.toggle();
      this.$refs.Mulmodel.echo(this.form.zqxxQhcsList)
    },
    // 不排除原因
    openBpcMul () {
      if (this.propfrom.isNotEdit) {
        return
      }
      this.$refs.bpcModel.toggle();
      this.$refs.bpcModel.echo(this.form.zqxxBpchzyyList)
    },
    reset (val) {
      if (val != '5') {
        this.form.jzjgdm = ''; // 建筑结构
        // this.form.sfyc = "";//是否属于世界遗产
        this.form.sfsjycdm = '';//
        this.form.jzsyyt = '';// 建筑使用用途
        this.form.jzsyytItem1 = '';
        this.form.jzlbdm = '';// 建筑类别
        this.form.dxzht = 0;// 大型综合体
        this.form.jznhdjdm = ''// 建筑耐火等级
      }
      this.form.qhcsms = '';
      this.form.qhcsdm = '';
      this.form.zqxxQhcsList = []
    },
    // 接收起火场所数据
    setMulVals (arr) {
      this.form.qhcsms = '';
      this.form.qhcsdm = '';
      this.form.zqxxQhcsList = [];
      this.form.zqxxQhcsList = arr;
      this.form.qhcsms = arr[0].dictLabel;
      this.form.qhcsdm = arr[0].dictValue
    },
    //清除起火场所数据
    clearQhcsMul () {
      this.form.qhcsms = '';
      this.form.qhcsdm = '';
      this.form.zqxxQhcsList = [];
    },
    // 接受起火物数据
    setFireMulVal (arr) {
      this.form.qhwfldm = '';
      this.form.qhwms = '';
      arr.forEach(element => {
        this.form.qhwms = element.dictLabel;
        this.form.qhwfldm = element.dictValue
      });
      if (this.form.qhwms == '其他') {
        // console.log(1);
      }
    },
    //清除起火物数据
    clearQhwMul () {
      this.form.qhwfldm = '';
      this.form.qhwms = '';
    },
    // 接受起火原因数据
    setFireReasonMulVal (arr) {
      this.form.zqxxBpchzyyList = [];
      // 判断是否是刑事放火 是刑事放火，则展示刑事放火，否则隐藏刑事放火
      arr[0].dictValue == '0101000000' ? this.form.sfxsfh = '1' : this.form.sfxsfh = '0';
      // 如果起火原因!='不排除原因'，则清空不排除原因数据
      if (arr[0].dictValue != '9900000000') {
        this.form.bpchzyymc = '';
        this.form.zqxxBpchzyyList = []
      }
      this.form.hzyyms = arr[0].dictLabel;
      this.form.hzyyfldm = arr[0].dictValue;
    },
    //清除起火原因数据
    clearQhyyMul () {
      this.form.hzyyms = '';
      this.form.hzyyfldm = '';
      this.form.zqxxBpchzyyList = []
      this.form.zqxxXsfh = {
        yjzl: '', // 移交资料
        yjzlName: '', // 移交资料名
        yjzlRemark: '', // 移交资料描述
        ajjg: '', // 案件结果
        ajjgName: '', // 案件结果名
        ajjgRemark: '', // 案件结果描述
        xcqkbg: '', // 现场情况报告
        xcqkbgName: '', // 现场情况报告名
        xcqkbgRemark: '' // 现场情况报告描述
      }
    },
    // 接收不排除原因
    setbpcVal (arr) {
      this.form.bpchzyymc = '';
      this.form.zqxxBpchzyyList = [];
      // 遍历arr数据拼接全部数据展示
      arr.forEach(element => {
        // 拼接展示的数据
        this.form.bpchzyymc = this.form.bpchzyymc + element.dictLabel + ' ';
        // 判断是否是刑事放火 是刑事放火，则展示刑事放火，否则隐藏刑事放火
        element.dictValue == '0101000000' ? this.form.sfxsfh = '1' : this.form.sfxsfh = '0';
        // 存储排除原因数据
        this.form.zqxxBpchzyyList.push({
          hzyydm: element.dictValue,
          hzyymc: element.dictLabel
        })
      });
      this.$forceUpdate()// 强制页面更新，解决在数据回显情况下修改下拉列表数据时数据不及时更新
    },
    //清除不排除原因
    clearBpcMul () {
      this.form.bpchzyymc = '';
      this.form.zqxxBpchzyyList = [];
    },
    // 处理时间格式
    handleName () {
      this.form.zqsj == null || this.form.zqsj == ''
        ? '接警时间'
        : this.form.zqsj.slice(0, 10)
    },
    // 形式犯罪
    /**
     * 移交资料图片上传
     */
    uploadImg (item) {
      // file转换为2进制
      const formData = new FormData();
      formData.append('file', item.file);
      formData.append('zqbh', this.form.zqbh);
      // 调用上传接口
      UploadFile(formData)
        .then(res => {
          this.form.zqbh = res.data.zqbh;
          // 存储文件名称
          this.form.zqxxXsfh.yjzlName = res.data.name;
          this.form.zqxxXsfh.yjzl = res.data.avatar;
          this.$message({
            message: '成功上传',
            type: 'success'
          })
        })
        .catch(err => {
          console.log(err, 'error')
        })
    },
    // 案件结果图片上传
    uploadajjg (item) {
      const formData = new FormData();
      formData.append('file', item.file);
      formData.append('zqbh', this.form.zqbh);
      // 调用上传接口
      UploadFile(formData)
        .then(res => {
          this.form.zqbh = res.data.zqbh;
          this.form.zqxxXsfh.ajjgName = res.data.name;
          this.form.zqxxXsfh.ajjg = res.data.avatar;
          this.$message({
            message: '成功上传',
            type: 'success'
          })
        })
        .catch(err => {
          console.log(err, 'error')
        })
    },
    // 现场情况报告图片上传
    uploadxcqkbg (item) {
      const formData = new FormData();
      formData.append('file', item.file);
      formData.append('zqbh', this.form.zqbh);
      // 调用上传接口
      UploadFile(formData)
        .then(res => {
          this.form.zqbh = res.data.zqbh;
          this.form.zqxxXsfh.xcqkbgName = res.data.name;
          this.form.zqxxXsfh.xcqkbg = res.data.avatar;
          this.$message({
            message: '成功上传',
            type: 'success'
          })
        })
        .catch(err => {
          console.log(err, 'error')
        })
    },
    // 安全事故 有关政府文件
    uploadzfwj (item) {
      const formData = new FormData();
      formData.append('file', item.file);
      formData.append('zqbh', this.form.zqbh);
      // 调用上传接口
      UploadFile(formData)
        .then(res => {
          this.form.zqbh = res.data.zqbh;
          this.form.zqxxAqscsg.ygzfwjName = res.data.name;
          this.form.zqxxAqscsg.ygzfwj = res.data.avatar;
          this.$message({
            message: '成功上传',
            type: 'success'
          })
        })
        .catch(err => {
          console.log(err, 'error')
        })
    },
    // 现场情况报告1
    uploadxcbg1 (item) {
      const formData = new FormData();
      formData.append('file', item.file);
      formData.append('zqbh', this.form.zqbh);
      // 调用上传接口
      UploadFile(formData)
        .then(res => {
          this.form.zqbh = res.data.zqbh;
          this.form.zqxxAqscsg.xcqkbgName = res.data.name;
          this.form.zqxxAqscsg.xcqkbg = res.data.avatar;
          this.$message({
            message: '成功上传',
            type: 'success'
          })
        })
        .catch(err => {
          console.log(err, 'error')
        })
    },
    // 附件火场图片
    uploadhcpic1 (item) {
      const formData = new FormData();
      // let arr = [];
      // arr.push(item.file);
      // console.log(arr);
      // console.log(item.file);

      formData.append('file', item.file);
      formData.append('zqbh', this.form.zqbh);
      // console.log(formData);
      // 调用上传接口
      UploadPicFile(formData)
        .then(res => {
          this.form.zqbh = res.data.zqbh;
          // this.form.hctp = res.msg;
          this.$message({
            message: '成功上传',
            type: 'success'
          })
        })
        .catch(err => {
          console.log(err, 'error')
        })
    },
    // 相关附件上传
    uploadxgfj (item) {
      const formData = new FormData();
      formData.append('file', item.file);
      formData.append('zqbh', this.form.zqbh);
      // 调用上传接口
      UploadFile(formData)
        .then(res => {
          this.form.ygfjscName = res.data.name;
          this.form.zqbh = res.data.zqbh;
          this.form.ygfjsc = res.data.avatar;
          this.$message({
            message: '成功上传',
            type: 'success'
          })
        })
        .catch(err => {
          console.log(err, 'error')
        })
    },
    // 消防设备集联菜单
    nextItem (index, type, val) {
      const name = this.xfsb[type] + index;
      for (let x = parseInt(index); x <= 3; x++) {
        this.Options[this.xfsb[type] + x] = [];
        this.form[this.xfsb[type] + x] = ''
      }
      getTreeOptions({
        dictType: 'xfssqk',
        parentValue: val
      }).then(res => {
        this.Options[name] = res.data
      })
    },
    getNextOption (index, type, val) {
      const name = this.xfsb[type] + index;
      getTreeOptions({
        dictType: 'xfssqk',
        parentValue: val
      }).then(res => {
        this.Options[name] = res.data
      })
    },
    /**
     *
     */
    swsjSelect (index, val) {
      this.form.swryList[index].swsjdmItem1 = '';
      getTreeOptions({
        dictType: "swsj",
        parentValue: val
      }).then(res => {
        if (res.code == 200) {
          this.form.swryList[index].swsjItem1 = res.data;
          this.$forceUpdate();
        }
      });
    },
    /**
     * 重置火灾处罚情况
     * 选择0时重置
     * 1 立案
     * 0 没有立案
     */
    resetHzcfqkItem (val) {
      if (val == 0) this.form.zqxxDwclList = this.form.zqxxGrclList = []
    },
    /**
     * 删除处罚列表
     * @param index 删除列表的位置信息
     * @param type 删除类型 1 单位， 2 个人
     */
    delectHzcfqkItem (index, type) {
      type == 1 ? this.form.zqxxDwclList.splice(index, 1) : this.form.zqxxGrclList.splice(index, 1)
    },
    // 删除个人信息
    // delectPeo(index) {
    // 	this.form.zqxxDwclList.splice(index, 1);
    // },
    // delectUnit(index) {
    // 	this.form.zqxxGrclList.splice(index, 1);
    // },
    //   计数器
    handleChange (value) {
    },
    //   返回
    back () {
      this.$emit('back', false)
    },
    //   树型结构数据
    loadNext (val) {
      if (val != '1') {
        this.form.jdjcqkItem1 = '';
        this.form.jdjcqkItem2 = '';
        this.form.jdjcqkItems = ''
      }
      getTreeOptions({
        dictType: 'jdjcqk',
        parentValue: 1
      }).then(res => {
        this.Options.jdjcqkItem1 = res.data
      })
    },
    /**
     * 监督检查情况
     * 下级菜单
     */
    loadNext_1 (val) {
      this.form.jdjcqkItem1 = val.join(',');
      if (val.indexOf('5') != '-1') {
        //
        getTreeOptions({
          dictType: 'jdjcqk',
          parentValue: 5
        }).then(res => {
          this.Options.jdjcqkItem2 = res.data
        })
      } else {
        this.form.jdjcqkItem2 = ''
        // this.form.jdjcqkItems = "";
      }
    },
    /**
     *  添加受伤伤亡人员
     *    @param val
     *    1 添加死亡人员
     *  0 添加受伤人员
     */
    impotHurtPeople (val) {
      if (val === '1') {
        this.deadNumber++;
        this.form.swryList.push({
          swfl: '0', xm: '', xb: '', sfzhm: '', nl: '', jkzkdm: '', swyydm: '', rklydm: '', rklydm2: '',
          zydm: '', sjycddm: '', swwzdm: '', swsjdm: '', swsjdmItem1: '', swsjItem1: [], nation: '', idType: ''
        });
      } else {
        this.hurtNumber++;
        this.form.ssryList.push({
          swfl: '', xm: '', xb: '', sfzhm: '', nl: '', jkzkdm: '', swyydm: '', rklydm: '', rklydm2: '',
          zydm: '', sjycddm: '', nation: '', idType: ''
        });
      }
      //火灾等级判定
      this.isSwTotal();
    },
    /**
     * 添加火灾处罚情况
     * 1 添加单位
     * 2 添加个人
     * */
    addHzcfqkItem (val) {
      val == '1'
        ? this.form.zqxxDwclList.push({ dwmc: '', frdb: '', grxzcfdm: '', fkje: '' })
        : this.form.zqxxGrclList.push({ xm: '', xb: '', grxzcfdm: '', fkje: '' })
    },
    //  提交表单
    reportForm () {
      //   调用提交接口
      if (this.xzqydm) {
        this.form.xzqydm = this.xzqydm;
        this.form.xzqydmSj = this.xzqydm.substring(0, 2);
      } else if (this.propfrom.jqbh && this.xzqydm == "") {
        this.$message({
          showClose: true,
          message: '警情信息里没有行政区域',
          type: 'warning'
        });
        this.loading = false;
        return true;
      }
      console.log(this.form);
      // saveWrite(this.form).then(res => {
      //   this.loading = false;
      //   // this.loading.close();
      //   this.$message({
      //     showClose: true,
      //     message: '成功提交',
      //     type: 'success'
      //   });
      //   this.back();
      //   if (this.propfrom.jqbh) {
      //     this.$router.push({
      //       path: '/data/entry/lszqxx'
      //     })
      //   }
      // })
      //   .finally(() => {
      //     this.loading = false
      //   })
    },
    dayin (formname) {
      console.log(formname)
    },
    //  表单验证
    submitForm (formName) {
      console.log(this.form);
      this.$refs[formName].validate(valid => {
        if (valid) {
          let isRuleMessage = this.validatorDate();
          if (isRuleMessage) {
            this.$message.warning(isRuleMessage);
            return;
          }
          /**验证人员伤亡情况**/
          // if (this.ishurt == '1') {
          //   if (this.form.swryList.length == 0 && this.form.ssryList.length == 0) {
          //     this.$message({
          //       showClose: true,
          //       message: '请填写伤亡情况',
          //       type: 'warning'
          //     });
          //     return;
          //   }
          // }
          this.loading = true;
          // this.loading = this.$loading({
          //   lock: true,
          //   text: "正在提交",
          //   background: "rgba(0, 0, 0, 0.7)"
          // });
          if (!this.fireEdit && this.propfrom.type == 0) {
            this.form.fireProcess = this.easyMessage;
          }
          // this.fillingStatistic(); //  填报完成度统计
          // this.reportForm();
        }
        // else {
        //   this.$message({
        //     showClose: true,
        //     message: '请填写相应信息',
        //     type: 'warning'
        //   });
        //   return false
        // }
      })
    },
    submitAudit (formName) {
      //todo
      //当为轻微火灾时去除楼层
      if (this.propfrom.qwhz == 1) {
        this.form.jzzlcs = '';
        this.form.shlc = '';
        this.form.sgqtdcbm = '';
      }
      switch (this.form.zqlbdm) {
        case '10000':
          this.level = '0';
          break;
        case '10001':
          this.level = '0';
          break;
        case '10002':
          this.level = '1';
          break;
        case '10003':
          this.level = '3';
          break;
        case '10004':
          this.level = '5';
          break
      }
      this.form.varJsonStr = JSON.stringify({
        isEnd: this.isEnd,
        flag: this.flag,
        level: this.level,
        hasNull: this.form.sfdcz == 1
      });
      this.form.businessKey = 'disaster.' + this.form.zqbh;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let isRuleMessage = this.validatorDate();
          if (isRuleMessage) {
            this.$message.warning(isRuleMessage);
            return;
          }
          this.loading = true;
          doAduit(this.form).then(res => {
            this.loading = false;
            this.$message({
              showClose: true,
              message: '操作成功',
              type: 'success'
            });
            this.back()
          })
            .finally(() => {
              this.loading = false
            })
        } else {
          this.$message({
            showClose: true,
            message: '请填写相应信息',
            type: 'warning'
          });
          return false
        }
      })
    },
    // 提交修改
    submitEdit (formName) {
      //当为轻微火灾时去除楼层
      if (this.propfrom.qwhz == 1) {
        this.form.jzzlcs = '';
        this.form.shlc = '';
        this.form.sgqtdcbm = '';
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          updateCaogao(this.form).then(res => {
            this.loading = false;
            this.$message({
              showClose: true,
              message: '成功提交',
              type: 'success'
            });
            this.back()
          })
            .finally(() => {
              this.loading = false
            })
        } else {
          this.$message({
            showClose: true,
            message: '请填写相应信息',
            type: 'warning'
          });
          return false
        }
      })
    },
    //   设置数据传入
    setSelectInfo () {
      // 简单的option 请求
      options.forEach((item, index) => {
        // console.log(item)
        getSelectOptions(item)
          .then(res => {
            this.Options[item] = res.data;
            // 调查方式默认使用概要统计
            if (item === 'tb_dic_dcfs') {
              this.form.dcfs = '1';
            }
            if (index == options.length - 1) {
              this.optionsDone = true
            }
            if (item == 'tb_dic_jzjg') {
              //高层建筑结构列表
              if (this.Options.tb_dic_jzjg) {
                //高层建筑结构列表
                this.gcjzjgList = this.Options.tb_dic_jzjg.filter(item => {
                  return item.dictValue == '04' || item.dictValue == '05';
                })
              }
            }
          })
          .catch(res => {
            console.error(res)
          })
      });
      // 树形的option请求
      treeOptions.forEach((item, index) => {
        getTreeOptions({
          dictType: item.dictType,
          parentValue: item.parentValue
        })
          .then(res => {
            this.Options[item.resName] = res.data;
            if (index == treeOptions.length - 1) {
              this.treeOptionsDone = true
            }
          })
          .catch(res => {
            console.error(res)
          })
      });
      // 设备消防
      getTreeOptions({
        dictType: 'xfssqk'
      }).then(res => {
        this.Options.zdbjxtsfaz = res.data;
        this.Options.zdmhxtsfaz = res.data;
        this.Options.fpyxtsfaz = res.data;
        this.Options.fhjl = res.data;
        this.Options.snxhsxtsfaz = res.data
      })
    },
    /**
     * 回显数据获取消防设施数据
     */
    echoGetTreeOptions () {
      const arr = ['zdbjxtsfaz', 'zdbjxtsfazItem1', 'zdbjxtsfazItem2', 'zdbjxtsfazItem3', // 自动报警系统
        'zdmhxtsfaz', 'zdmhxtsfazItem1', 'zdmhxtsfazItem2', 'zdmhxtsfazItem3', // 自动灭火系统
        'fpyxtsfaz', 'fpyxtsfazItem1', 'fpyxtsfazItem2', 'fpyxtsfazItem3', // 防排烟系统
        'fhjl', 'fhjlItem1', 'fhjlItem2', 'fhjlItem3', // 防火卷帘
        'snxhsxtsfaz', 'snxhsxtsfazItem1', 'snxhsxtsfazItem2', 'snxhsxtsfazItem3'// 室内消火栓系统
      ];
      const arrs = {
        zdbjxtsfaz: 'zdbjxtsfazItem1',
        zdbjxtsfazItem1: 'zdbjxtsfazItem2',
        zdbjxtsfazItem2: 'zdbjxtsfazItem3', // 自动报警系统
        zdmhxtsfaz: 'zdmhxtsfazItem1',
        zdmhxtsfazItem1: 'zdmhxtsfazItem2',
        zdmhxtsfazItem2: 'zdmhxtsfazItem3', // 自动灭火系统
        fpyxtsfaz: 'fpyxtsfazItem1',
        fpyxtsfazItem1: 'fpyxtsfazItem2',
        fpyxtsfazItem2: 'fpyxtsfazItem3', // 防排烟系统
        fhjl: 'fhjlItem1',
        fhjlItem1: 'fhjlItem2',
        fhjlItem2: 'fhjlItem3', // 防火卷帘
        snxhsxtsfaz: 'snxhsxtsfazItem1',
        snxhsxtsfazItem1: 'snxhsxtsfazItem2',
        snxhsxtsfazItem2: 'snxhsxtsfazItem3'// 室内消火栓系统
      };
      for (const item of arr) {
        if (item == '') {
          continue
        }
        getTreeOptions({
          dictType: 'xfssqk',
          parentValue: this.formData[item]
        })
          .then(res => {
            this.Options[arrs[item]] = res.data;
            this.detailDone = true
          })
      }
    },
    // 切换是否调查中-切换表单校验
    toggleDcz () {
      if (this.form.sfdcz === '1') {
        this.rules = {
          zqlbdm: [{ required: true, message: "请输入", trigger: "change" }] // 火灾等级
        };
      } else {
        this.rules = rulesList;
      }
      this.$refs.ruleForm.clearValidate();
    },
    // 修改业务初始化表单校验项目
    initFormValidate (sfdcz) {
      if (sfdcz === '1') {
        this.rules = {
          zqlbdm: [{ required: true, message: "请输入", trigger: "change" }] // 火灾等级
        };
      } else {
        this.rules = rulesList;
      }
      this.$refs.ruleForm.clearValidate();
    },
    //经济损失填报获取火灾等级
    propertyEvent (val) {
      if (this.form.qwhz == '0') {
        let zjccss = parseFloat(this.form.zjccss);
        if (zjccss < 10000000) {
          this.zjLevel = 1;
        } else if (zjccss >= 10000000 && zjccss < 50000000) {
          this.zjLevel = 2;
        } else if (zjccss >= 50000000 && zjccss < 100000000) {
          this.zjLevel = 3;
        } else if (zjccss >= 100000000) {
          this.zjLevel = 4;
        } else if (isNaN(zjccss)) {
          this.zjLevel = 0;
        }
        let levelMax = this.zjLevel > this.zsLevel ? this.zjLevel : this.zsLevel;
        levelMax = levelMax > this.swLevel ? levelMax : this.swLevel;
        switch (levelMax) {
          case 0:
            this.form.zqlbdm = this.Options.tb_dic_zqdj.filter(o => o.dictLabel == '一般')[0].dictValue;
            break;
          case 1:
            this.form.zqlbdm = this.Options.tb_dic_zqdj.filter(o => o.dictLabel == '一般')[0].dictValue;
            break;
          case 2:
            this.form.zqlbdm = this.Options.tb_dic_zqdj.filter(o => o.dictLabel == '较大')[0].dictValue;
            break;
          case 3:
            this.form.zqlbdm = this.Options.tb_dic_zqdj.filter(o => o.dictLabel == '重大')[0].dictValue;
            break;
          case 4:
            this.form.zqlbdm = this.Options.tb_dic_zqdj.filter(o => o.dictLabel == '特大')[0].dictValue;
            break
        }
      }
    },
    isZsTotal (index) {
      if (this.form.qwhz == '0') {
        this.hurtZsNumber = this.form.ssryList.filter(o => o.swfl == '2').length;
        this.hurtQsNumber = parseInt(this.form.ssryList.filter(o => o.swfl == '1').length);
        let hurtZsNumber = parseInt(this.hurtZsNumber);
        if (hurtZsNumber > 0 && hurtZsNumber < 10) {
          this.zsLevel = 1;
        } else if (hurtZsNumber >= 10 && hurtZsNumber < 50) {
          this.zsLevel = 2;
        } else if (hurtZsNumber >= 50 && hurtZsNumber < 100) {
          this.zsLevel = 3;
        } else if (hurtZsNumber >= 100) {
          this.zsLevel = 4;
        } else if (hurtZsNumber === 0) {
          this.zsLevel = 0;
        }
        //比较三个值
        let levelMax = this.zjLevel > this.zsLevel ? this.zjLevel : this.zsLevel;
        levelMax = levelMax > this.swLevel ? levelMax : this.swLevel;
        switch (levelMax) {
          case 0:
            this.form.zqlbdm = this.Options.tb_dic_zqdj.filter(o => o.dictLabel == '一般')[0].dictValue;
            break;
          case 1:
            this.form.zqlbdm = this.Options.tb_dic_zqdj.filter(o => o.dictLabel == '一般')[0].dictValue;
            break;
          case 2:
            this.form.zqlbdm = this.Options.tb_dic_zqdj.filter(o => o.dictLabel == '较大')[0].dictValue;
            break;
          case 3:
            this.form.zqlbdm = this.Options.tb_dic_zqdj.filter(o => o.dictLabel == '重大')[0].dictValue;
            break;
          case 4:
            this.form.zqlbdm = this.Options.tb_dic_zqdj.filter(o => o.dictLabel == '特大')[0].dictValue;
            break
        }
      }
      // 重伤时其他信息项必填
      if (this.form.ssryList[index].swfl === '2') {
        this.rules[`ssryList.${index}.xm`] = [
          {
            required: true,
            message: "受伤人员姓名不能为空",
            trigger: "blur"
          }
        ];
        this.rules[`ssryList.${index}.xb`] = [
          {
            required: true,
            message: "受伤人员性别不能为空",
            trigger: "blur"
          }
        ];
        this.rules[`ssryList.${index}.sfzhm`] = [
          {
            required: true,
            trigger: 'blur',
            validator: this.zjhmsspd
          }
        ];
        this.rules[`ssryList.${index}.idType`] = [
          {
            required: true,
            message: "证件类型不能为空",
            trigger: ['blur', 'change']
          }
        ];
        this.rules[`ssryList.${index}.nation`] = [
          {
            required: false,
            message: "民族不能为空",
            trigger: ['blur', 'change']
          }
        ];
        this.rules[`ssryList.${index}.nl}`] = [
          {
            required: true,
            message: "受伤人员年龄不能为空",
            trigger: ['blur', 'change'],
          }
        ];
        this.rules[`ssryList.${index}.jkzkdm`] = [
          {
            required: true,
            message: "受伤人员健康状况不能为空",
            trigger: ['blur', 'change'],
          }
        ];
        this.rules[`ssryList.${index}.swyydm`] = [
          {
            required: true,
            message: "受伤人员致伤原因不能为空",
            trigger: ['blur', 'change'],
          }
        ];
        this.rules[`ssryList.${index}.rklydm`] = [
          {
            required: true,
            message: "受伤人员来源不能为空",
            trigger: ['blur', 'change'],
          }
        ];
        this.rules[`ssryList.${index}.rklydm2`] = [
          {
            required: true,
            message: "受伤人员来源详情不能为空",
            trigger: ['blur', 'change'],
          }
        ];
        this.rules[`ssryList.${index}.zydm`] = [
          {
            required: true,
            message: "受伤人员职业不能为空",
            trigger: ['blur', 'change'],
          }
        ];
        this.rules[`ssryList.${index}.sjycddm`] = [
          {
            required: true,
            message: "受伤人员受教育程度不能为空",
            trigger: ['blur', 'change'],
          }
        ];
      } else {
        delete this.rules[`ssryList.${index}.xm`];
        delete this.rules[`ssryList.${index}.xb`];
        delete this.rules[`ssryList.${index}.sfzhm`];
        delete this.rules[`ssryList.${index}.idType`];
        delete this.rules[`ssryList.${index}.nation`];
        delete this.rules[`ssryList.${index}.nl}`];
        delete this.rules[`ssryList.${index}.jkzkdm`];
        delete this.rules[`ssryList.${index}.swyydm`];
        delete this.rules[`ssryList.${index}.rklydm`];
        delete this.rules[`ssryList.${index}.rklydm2`];
        delete this.rules[`ssryList.${index}.zydm`];
        delete this.rules[`ssryList.${index}.sjycddm`];
        this.$refs.ruleForm.clearValidate([
          `ssryList.${index}.xm`,
          `ssryList.${index}.xb`,
          `ssryList.${index}.sfzhm`,
          `ssryList.${index}.idType`,
          `ssryList.${index}.nation`,
          `ssryList.${index}.nl}`,
          `ssryList.${index}.jkzkdm`,
          `ssryList.${index}.swyydm`,
          `ssryList.${index}.rklydm`,
          `ssryList.${index}.rklydm2`,
          `ssryList.${index}.zydm`,
          `ssryList.${index}.sjycddm`
        ]);
      }
    },
    isSwTotal () {
      this.hurtZsNumber = this.form.ssryList.filter(o => o.swfl == '2').length;
      this.hurtQsNumber = parseInt(this.form.ssryList.filter(o => o.swfl == '1').length);
      this.deadNumber = this.form.swryList.length;
      if (this.form.qwhz == '0') {
        let deadNumber = parseInt(this.deadNumber);
        let hurtZsNumber = parseInt(this.hurtZsNumber);
        //重伤判定
        if (hurtZsNumber > 0 && hurtZsNumber < 10) {
          this.zsLevel = 1;
        } else if (hurtZsNumber >= 10 && hurtZsNumber < 50) {
          this.zsLevel = 2;
        } else if (hurtZsNumber >= 50 && hurtZsNumber < 100) {
          this.zsLevel = 3;
        } else if (hurtZsNumber >= 100) {
          this.zsLevel = 4;
        } else if (hurtZsNumber === 0) {
          this.zsLevel = 0;
        }
        //死亡判定
        if (deadNumber > 0 && deadNumber < 3) {
          this.swLevel = 1;
        } else if (deadNumber >= 3 && deadNumber < 10) {
          this.swLevel = 2;
        } else if (deadNumber >= 10 && deadNumber < 30) {
          this.swLevel = 3;
        } else if (deadNumber >= 30) {
          this.swLevel = 4;
        } else if (deadNumber === 0) {
          this.swLevel = 0;
        }
        //经济判定
        let zjccss = parseFloat(this.form.zjccss);
        if (zjccss < 10000000) {
          this.zjLevel = 1;
        } else if (zjccss >= 10000000 && zjccss < 50000000) {
          this.zjLevel = 2;
        } else if (zjccss >= 50000000 && zjccss < 100000000) {
          this.zjLevel = 3;
        } else if (zjccss >= 100000000) {
          this.zjLevel = 4;
        } else if (isNaN(zjccss)) {
          this.zjLevel = 0;
        }
        //比较三个值
        let levelMax = this.zjLevel > this.zsLevel ? this.zjLevel : this.zsLevel;
        levelMax = levelMax > this.swLevel ? levelMax : this.swLevel;
        switch (levelMax) {
          case 0:
            this.form.zqlbdm = this.Options.tb_dic_zqdj.filter(o => o.dictLabel == '一般')[0].dictValue;
            break;
          case 1:
            this.form.zqlbdm = this.Options.tb_dic_zqdj.filter(o => o.dictLabel == '一般')[0].dictValue;
            break;
          case 2:
            this.form.zqlbdm = this.Options.tb_dic_zqdj.filter(o => o.dictLabel == '较大')[0].dictValue;
            break;
          case 3:
            this.form.zqlbdm = this.Options.tb_dic_zqdj.filter(o => o.dictLabel == '重大')[0].dictValue;
            break;
          case 4:
            this.form.zqlbdm = this.Options.tb_dic_zqdj.filter(o => o.dictLabel == '特大')[0].dictValue;
            break
        }
      }
    },
    writeFile () {
      this.fireEdit = true;
      if (this.propfrom.type == '0') {
        this.form.fireProcess = this.easyMessage;
      }
    },
    //校验时间不早于12小时
    validatorDate () {
      let curDate = this.propfrom.jjsj;
      let preDate = new Date(curDate).getTime();
      let hours = Math.floor((preDate - (new Date(this.form.zqsj).getTime())) / (1000 * 60 * 60));
      if (hours > 12) {
        return "起火时间不能早于接警时间12小时";
      }
    },
    // 统计表单填报情况
    fillingStatistic () {
      /*** 获取input和textarea元素 ***/
      const formEl = document.getElementById('fireForm');
      const inputs = formEl.getElementsByTagName('input');
      const textareas = formEl.getElementsByTagName('textarea');
      /*** 获取input和textarea的value有值的数量 (笼统统计) ***/
      let totalFormItemNum = inputs.length + textareas.length;
      let filledCount = 0;
      for (const input of inputs) {
        if (input.value) {
          filledCount++;
        }
      }
      for (const textarea of textareas) {
        if (textarea.value) {
          filledCount++;
        }
      }

      /**
       * 处理radio控件
       * 2个radio是一个表单项
       * radio无论勾选value都是有值的，需要根据checked属性判断是否勾选
       * 计算已填报的表单项数量时应减去radio数量再加上已勾选的radio数量
       **/
      let radioNum = 0; // 所有radio控件数量
      let checkedRadioNum = 0; // 所有勾选的radio控件数量
      for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].className.includes('el-radio__original')) {
          radioNum++;
          if (inputs[i].checked) {
            checkedRadioNum++;
          }
        }
      }
      // 总表单项数量应减去radio数量的一半 (2个radio是一个表单项)
      totalFormItemNum = totalFormItemNum - radioNum / 2;
      // 已填报的表单项数量应减去radio数量再加上已勾选的radio数量
      filledCount = filledCount - radioNum + checkedRadioNum;;

      /*
      * 处理上传附件控件
      * 2个input 是一个表单项
      **/
      let upload = document.getElementsByClassName('upload-demo');
      let fileNum = upload.length;
      // 总表单项数量应减去所有文件附件上传控件数量 (2个input是一个表单项)
      totalFormItemNum = totalFormItemNum - fileNum;

      /**
       * 处理多选控件
       * 多选控件无论是否已选value都没有值
       * 需要校验表单数据中的字段值是否为空
       * 注意控件的联动情况
       */
      // 监督检查情况 - 值为消防救援机构监督范围时校验表单字段
      if (this.form.jdjcqk == '1') {
        if (this.form.jdjcqkItems) {
          filledCount++;
        }
      }
      //是否保险-值为是时校验
      if (this.form.sfbx == '0') {
        if (this.form.sfbxItems) {
          filledCount++;
        }
      }
      /**
       * 处理照片上传表单项
       * 判断控件的联动状态
       * 当控件被激活时只要上传了一张照片即认为该表单项已填
       * 照片的说明文字不计入统计，需要额外减少数量
       */
      //火场照片
      if (this.picUploadList.length > 0) {
        filledCount++;
      }

      let initTime = formatterDate(new Date(), "YYYY-MM-DD");
      let params = {
        "zqbh": this.form.zqbh,
        "cdbh": "",
        "createTime": initTime,
        "fillOptional": 0,
        "fillRate": 0,
        "fillReport": filledCount,
        "id": 0,
        "jqbh": this.propfrom.jqbh,
        "pageName": "DisasterSituationReport",
        "remark": "",
        "reportType": "Z",
        "tbzh": this.deptname,
        "totalOptional": 0,
        "totalReport": totalFormItemNum,
        "totalRequire": 0,
        "unfillReport": 0,
        "updateTime": initTime
      };
      repprtFill(params).then(response => { })
    },
    //处罚单位行政处罚类型不是罚款时，清空罚款金额
    xzcfSelect (index) {
      if (this.form.zqxxDwclList[index].dwxzcfdm != '02') {
        this.form.zqxxDwclList[index].fkje = '';
      }
    },
    //个人行政处罚
    grxzcfSelect (index) {
      if (this.form.zqxxGrclList[index].grxzcfdm == '02') {
        this.form.zqxxGrclList[index].fkje = '';
      }
    },
    //区域选择
    qydmChange (val) {
      this.form.qydmItem2 = '';
      this.form.czc = 0;
    },
    //是否保险
    sfbxChange (val) {
      if (val == 1) {
        this.form.sfbxItems = [];
        this.form.sfbxItem1 = '';
      }
    },
    //事故调查牵头部门
    sgqtdcbmChange (val) {
      if (val != 6) {
        this.form.sgqtdcbmItem1 = '';
      }
    },
    //是否立案
    sflaChange (val) {
      if (val == 1) {
        this.form.zjrs = 0;
        this.form.jyclrs = 0;
      }
    },
    jzlcChange (val) {
      if (val) {
        let data = parseInt(val);
        let dataArr = new Array();
        for (let i = 0; i < parseInt(val); i++) {
          dataArr[i] = i + 1;
        }
        this.shlcArrList = dataArr;
        // console.log(this.shlcArrList)
      }
    },
    jzlcBlur () {
      if (this.form.jzzlcs && this.form.jzzlcs < 8 && this.form.jzlbdm == "010000") {
        this.$message.warning("8层以下的居住类建筑不应属于高层建筑");
        this.form.jzzlcs = "";
        return;
      }
    },
    jzlbChange (val) {
      if (this.form.jzzlcs && this.form.jzzlcs < 8 && val == "010000") {
        this.$message.warning("8层以下的居住类建筑不应属于高层建筑");
        this.form.jzlbdm = "";
      }
      this.form.jzjgdm = "";
    },
    sum (arg) {
      var total = 0;
      for (var i = 0; i < arg.length; i++) {
        var val = Number(arg[i]);
        if (!isNaN(val)) {
          total += val;
        }
      }
      return total;
    },
    //证件号码判断
    zjhmswpd (rule, value, callback) {
      const index = rule.field.split('.')[1]
      let reg = undefined
      this.form.swryList[index].idType || callback(new Error('请选择证件类型'));
      if (!value) {
        callback(new Error('请输入证件号码'));
      } else {
        switch (this.form.swryList[index].idType) {
          case '1':
            reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
            reg.test(value) || callback(new Error('请输入正确的身份证号码'));
            break;
          case '2':
            reg = /^[a-zA-Z0-9]{5,21}$/;
            reg.test(value) || callback(new Error('请输入正确的出生证'));
            break;
          case '3':
            reg = /^[a-zA-Z0-9]{7,21}$/;
            reg.test(value) || callback(new Error('请输入正确的军官证'));
            break;
          case '4':
            reg = /^[a-zA-Z0-9]{7,21}$/;
            reg.test(value) || callback(new Error('请输入正确的士兵证'));
            break;
          case '5':
            reg = /^[CW]\d{8}$/;
            reg.test(value) || callback(new Error('请输入正确的港澳通行证'));
            break;
          case '6':
            reg = /^[a-zA-Z][0-9]{9}$/;
            reg.test(value) || callback(new Error('请输入正确的台湾通行证'));
            break;
          case '7':
            reg = /^[a-zA-Z0-9]{5,17}$/;
            reg.test(value) || callback(new Error('请输入正确的护照'));
            break;
        }
        callback();
      }
    },
    zjhmsspd (rule, value, callback) {
      const index = rule.field.split('.')[1]
      let reg = undefined
      this.form.ssryList[index].idType || callback(new Error('请选择证件类型'));
      if (!value) {
        callback(new Error('请输入证件号码'));
      } else {
        switch (this.form.ssryList[index].idType) {
          case '1':
            reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
            reg.test(value) || callback(new Error('请输入正确的身份证号码'));
            break;
          case '2':
            reg = /^[a-zA-Z0-9]{5,21}$/;
            reg.test(value) || callback(new Error('请输入正确的出生证'));
            break;
          case '3':
            reg = /^[a-zA-Z0-9]{7,21}$/;
            reg.test(value) || callback(new Error('请输入正确的军官证'));
            break;
          case '4':
            reg = /^[a-zA-Z0-9]{7,21}$/;
            reg.test(value) || callback(new Error('请输入正确的士兵证'));
            break;
          case '5':
            reg = /^[CW]\d{8}$/;
            reg.test(value) || callback(new Error('请输入正确的港澳通行证'));
            break;
          case '6':
            reg = /^[a-zA-Z][0-9]{9}$/;
            reg.test(value) || callback(new Error('请输入正确的台湾通行证'));
            break;
          case '7':
            reg = /^[a-zA-Z0-9]{5,17}$/;
            reg.test(value) || callback(new Error('请输入正确的护照'));
            break;
        }
        callback();
      }
    },
    getEventList (jqbh) {
      if (!jqbh) return;
      getEvent(jqbh).then(r => {
        if (r.code === 200) {
          this.eventList = r.data;
        }
      })
    },
    setZjccss (total) {
      this.form.zjccss = total;
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../style/style.styl';

.bottom-btnGroup {
  text-align: center;
}

.zjjssBox {
  position: relative;
}

.zjjss {
  position: absolute;
  right: 20px;
}
</style>
<style lang="stylus">
.disasterInfomation {
  .el-form-item__label {
    // text-align:left;
    float: none;
    min-height: 32px;
    font-size: 14px;
    font-weight: 500;
    color: #333333;
    white-space: nowrap;
  }

  .btn-center {
    text-align: center;
  }

  .tip-class {
    position: absolute;
    top: -1.7rem;
    left: 8.2rem;
  }

  .swfl_hurt_info_body, .swfl_dead_info_body {
    background-color: #f8f8f9;
    padding: 10px;

    .swfl_peop {
      position: absolute;
      left: 32%;
      top: 45%;
    }
  }

  .closeBtnMar {
    margin-left: 5px;
    cursor: pointer;
  }
}
</style>
