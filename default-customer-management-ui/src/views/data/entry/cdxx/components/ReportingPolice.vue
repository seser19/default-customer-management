<template lang="pug">
.reporting-police
    .reporting-title
      h2 {{ $route.meta.title }}
        span(v-if="draft.cdbh") (出动编号：{{draft.cdbh}})
      el-button(@click="back") 返&nbsp;回
      el-button(v-if="isNew" type="primary" @click="commitData") 提&nbsp;交
      el-button(v-else type="primary" @click="preservationInfo") 保&nbsp;存
    //- 警情信息详情组件
    top-detail(v-if="isNew" v-loading="jqxxLoading" :jq-top-data="jqxxData")

    .reporting-body(v-loading="jqxxLoading")
      .audit_top(v-if="draft.reviewing" v-loading="auditTopLoading")
        div
          img(src="../../../aduit/image/person.png")
          span 创建人：
            b {{deptname || '-'}}
        div
          img(src="../../../aduit/image/time.png")
          span 创建时间：
            b {{tbsj || '-'}}
      el-form(id="dispatchForm" ref="writeForm" :model="formData" :rules="formRules" label-position="top")
        el-row(:gutter="60")

          el-col(:span="24")
            .shadow-box
              .display_flex
                .shadow-title 简要情况
                .title_right
                  span 点击{{value1?'显示':'隐藏'}}非必选项&nbsp;
                  el-switch(v-model="value1")
              el-row(:gutter="60")
                el-col(:xs="24" :sm="12" :lg="8" :span="8")
                  el-form-item(label="处置情况" prop="cdxx.czqkdm")
                    el-select(v-model="formData.cdxx.czqkdm" @change="changeCzqk" placeholder="--请选择--" clearable style="width:100%")
                      el-option(v-for="(item, index) in dicCzqk" :label="item.dictLabel" :value="item.dictValue" :key="index")
                el-col(:span="24")
                  el-row(:gutter="60")
                    el-col(:xs="24" :sm="12" :lg="8" :span="8" v-if="formData.cdxx.czqkdm")
                      el-form-item(label="出动时间" prop="cdxx.cdsj")
                        el-date-picker(v-model="formData.cdxx.cdsj" type="datetime" placeholder="选择日期时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" style="width:100%")
                    el-col(:xs="24" :sm="12" :lg="8" :span="8" v-if="formData.cdxx.czqkdm==1")
                      el-form-item(label="中返时间" prop="cdxx.zlsj")
                        el-date-picker(v-model="formData.cdxx.zlsj" type="datetime" placeholder="选择日期时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" style="width:100%")
                    el-col(:xs="24" :sm="12" :lg="8" :span="8" v-if="formData.cdxx.czqkdm!=1&&formData.cdxx.czqkdm!=''")
                      el-form-item(label="到场时间" prop="cdxx.dcsj")
                        el-date-picker(v-model="formData.cdxx.dcsj" type="datetime" placeholder="选择日期时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions"  style="width:100%" )
                    el-col(:xs="24" :sm="12" :lg="8" :span="8" v-if="formData.cdxx.czqkdm==3")
                      el-form-item(label="展开时间")
                        el-date-picker(v-model="formData.cdxx.zksj" type="datetime" placeholder="选择日期时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" style="width:100%")
                    el-col(:xs="24" :sm="12" :lg="8" :span="8" v-if="formData.cdxx.czqkdm==3")
                      el-form-item(label="出水时间" prop="cdxx.cssj")
                        el-date-picker(v-model="formData.cdxx.cssj" type="datetime" placeholder="选择日期时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" style="width:100%")
                    el-col(:xs="24" :sm="12" :lg="8" :span="8" v-if="formData.cdxx.czqkdm==3 && formData.cdxx.respondType=='010000'")
                      el-form-item(label="控制时间" prop="cdxx.kzsj")
                        el-date-picker(v-model="formData.cdxx.kzsj" type="datetime" placeholder="选择日期时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" style="width:100%")

                    //- 处置情况 为 "到场实施处置" 且 警情类型为 火灾扑救 时才显示
                    el-col(:xs="24" :sm="12" :lg="8" :span="8" v-if="formData.cdxx.czqkdm==3 && isFireFighting &&　formData.cdxx.respondType=='010000'")
                      el-form-item(label="熄灭时间" prop="cdxx.xmsj")
                        el-date-picker(v-model="formData.cdxx.xmsj" type="datetime" placeholder="选择日期时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" style="width:100%")

                    //- 处置情况 为 "到场实施处置" 且 警情类型为 抢险救援/危险化学品事故 时才显示
                    el-col(:xs="24" :sm="12" :lg="8" :span="8" v-if="formData.cdxx.czqkdm==3 && formData.cdxx.sjlbdm.substr(0,3) === '020'")
                      el-form-item(label="洗消时间" prop="cdxx.xxsj")
                        el-date-picker(v-model="formData.cdxx.xxsj" type="datetime" placeholder="选择日期时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" style="width:100%")
                    el-col(:xs="24" :sm="12" :lg="8" :span="8" v-if="formData.cdxx.czqkdm==3")
                      el-form-item(label="结束时间" prop="cdxx.jssj")
                        el-date-picker(v-model="formData.cdxx.jssj" type="datetime" placeholder="选择日期时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" style="width:100%")
                    el-col(:xs="24" :sm="12" :lg="8" :span="8" v-if="formData.cdxx.czqkdm!=1&&formData.cdxx.czqkdm!=''")
                      el-form-item(label="撤离时间" prop="cdxx.clsj")
                        el-date-picker(v-model="formData.cdxx.clsj" type="datetime" placeholder="选择日期时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" style="width:100%")
                    el-col(:xs="24" :sm="12" :lg="8" :span="8" v-if="formData.cdxx.czqkdm!=''")
                      el-form-item(label="归队时间" prop="cdxx.fdsj")
                        el-date-picker(v-model="formData.cdxx.fdsj" type="datetime" placeholder="选择日期时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" style="width:100%")

          el-col(:span="24")
            .shadow-box
              .shadow-title 基本信息
              el-row(:gutter="60")
                //- el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="是否正在核实")
                        el-radio(v-model="formData.cdxx.isChecked" label="1") 是
                        el-radio(v-model="formData.cdxx.isChecked" label="2") 否

                //- el-col(:xs="24" :sm="12" :lg="8" :span="8" v-if="formData.cdxx.isFirstarrive=='Y'")
                    el-form-item(label="首到时间" prop="cdxx.arriveTime")
                        el-date-picker(v-model="formData.cdxx.arriveTime" type="datetime" placeholder="选择日期时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" style="width:100%")

                //- 警情类型为 火灾扑救 ，且 处置情况 不是 中途返回 时才显示
                el-col(:xs="24" :sm="12" :lg="8" :span="8" v-if="isFireFighting && formData.cdxx.czqkdm !== '01'")
                  el-form-item(label="到场时火灾情况" prop="cdxx.dcshzqkdm")
                    el-select(v-model="formData.cdxx.dcshzqkdm" placeholder="--请选择--" clearable style="width:100%" )
                      el-option(v-for="(item, index) in dicHzqk" :label="item.dictLabel" :value="item.dictValue" :key="index")

              el-row(:gutter="60")
                el-col(:xs="24" :sm="12" :lg="8" :span="8" v-if="formData.cdxx.respondType=='010000'" )
                  el-form-item(label="行业主管部门" prop="cdxx.hyzgbm")
                    el-select(v-model="formData.cdxx.hyzgbm" placeholder="--请选择--" clearable style="width:100%")
                      el-option(v-for="(item, index) in dicHyzgbm" :label="item.dictLabel" :value="item.dictValue" :key="index")
                el-col(:xs="24" :sm="12" :lg="8" :span="8")
                  el-form-item(label="距离现场" prop="cdxx.sjlc")
                    //- el-input(v-model="formData.cdxx.sjlc" type="number" min="0" placeholder="" style="width:100%" suffix-icon="iconfont icon-juli")
                    el-input-number.iconfont.icon-juli(style="width:87%" v-model="formData.cdxx.sjlc" :min="0" placeholder="请输入" :controls="false")


                //- 处置情况 是 到场实施处置 时才显示
                el-col(:xs="24" :sm="12" :lg="8" :span="8"  v-if="formData.cdxx.respondType=='010000' && formData.cdxx.czqkdm === '03'")
                  el-form-item(label="现场人员被困人数"  required prop="cdxx.xcrybkqkdm")
                    //- el-input(v-model="formData.cdxx.xcrybkqkdm" type="number" min="0" placeholder="" style="width:100%" suffix-icon="iconfont icon-people")
                    el-input-number.iconfont.icon-people(style="width:92%" v-model="formData.cdxx.xcrybkqkdm" :min="0" :precision="0" :step="1" placeholder="请输入" :controls="false")
                el-col(:xs="24" :sm="12" :lg="8" :span="8"  v-if="formData.cdxx.respondType=='010000' && formData.cdxx.czqkdm === '03'")
                  el-form-item(label="是否采用公用消防栓供水"  required prop="cdxx.useHydrant")
                    el-radio(v-model="formData.cdxx.useHydrant" @change="idHydrant" label="1") 是
                    el-radio(v-model="formData.cdxx.useHydrant" @change="idHydrant" label="0") 否
                el-col(:xs="24" :sm="12" :lg="8" :span="8" v-if="formData.cdxx.useHydrant==1&&formData.cdxx.respondType=='010000' && formData.cdxx.czqkdm === '03'")
                  el-form-item(label="公用消防栓供水情况" prop="cdxx.hydrantSupply")
                    el-select(v-model="formData.cdxx.hydrantSupply" placeholder="--请选择--" clearable style="width:100%")
                      el-option(v-for="(item, index) in dicGgxhs" :label="item.dictLabel" :value="item.dictValue" :key="index")
                el-col(:xs="24" :sm="12" :lg="8" :span="8" v-if="formData.cdxx.useHydrant==0&&formData.cdxx.respondType=='010000' && formData.cdxx.czqkdm === '03'")
                  el-form-item(label="不使用公用消防栓原因" prop="cdxx.hydrantNotuse")
                    el-select(v-model="formData.cdxx.hydrantNotuse" placeholder="--请选择--" clearable style="width:100%")
                      el-option(v-for="(item, index) in dicBsyyy" :label="item.dictLabel" :value="item.dictValue" :key="index")
                el-col(:xs="24" :sm="12" :lg="8" :span="8"  v-if="formData.cdxx.useHydrant === '1'")
                  el-form-item(label="固定消防设施使用情况")
                    el-select(v-model="formData.cdxx.gdxfssyyqkdm" placeholder="--请选择--" clearable style="width:100%")
                      el-option(v-for="(item, index) in dicGdxfss" :label="item.dictLabel" :value="item.dictValue" :key="index")

                el-col(:xs="24" :sm="12" :lg="8" :span="8"  v-if="isFireFighting")
                  el-form-item(label="消防车道是否堵塞")
                    el-select(v-model="formData.cdxx.isBlock" @change="xfcdChangeEvent" placeholder="--请选择--" clearable style="width:100%")
                      el-option(label="是" value="1")
                      el-option(label="否" value="2")
                el-col(:xs="24" :sm="12" :lg="8" :span="8"  v-if="formData.cdxx.isBlock === '1'")
                  el-form-item(label="疏通耗时" prop="cdxx.dredgeTime")
                    el-input-number.iconfont.icon-time(style="width:92%" v-model="formData.cdxx.dredgeTime" :min="0" :precision="0" :step="1" placeholder="请输入" :controls="false")
                    //- el-input(type="number" min="0" v-model="formData.cdxx.dredgeTime" placeholder="请输入" suffix-icon="iconfont icon-time")

              //- 带队指挥员 列表
              el-row(:gutter="60" v-if="formData.cdxx.respondType=='010000'")
                el-col(:span="24" v-for="(form,index) in formData.ddzhy" :key="index")
                  .people-box
                    el-row(:gutter="60")
                      el-col(:xs="24" :sm="12" :lg="8" :span="8")
                        el-form-item(:label="`带队指挥员姓名${index + 1}`" :prop="`ddzhy.${index}.zhy`")
                          el-input(v-model="form.zhy" placeholder="" :maxlength="20" clearable style="width:100%")
                      el-col(:xs="24" :sm="12" :lg="8" :span="8")
                        el-form-item(label="带队指挥员职务"  :prop="`ddzhy.${index}.zhyzw`")
                          el-select(v-model="form.zhyzw" placeholder="--请选择--" clearable style="width:70%")
                            el-option(v-for="(item, index) in dicDdzhzw" :label="item.dictLabel" :value="item.dictValue" :key="index")
                          i(class="el-icon-circle-plus-outline icon-plus" @click="ddzhyAddOrRemove(true)")
                          i(class="el-icon-remove-outline icon-plus" v-if="formData.ddzhy.length > 1" @click="ddzhyAddOrRemove(false, index)")

              //- 全勤指挥部 列表
              el-row(:gutter="60" v-if="formData.cdxx.respondType=='010000'")
                el-col(:span="24" v-for="(form,index) in formData.qqzhb" :key="index")
                  .people-box(v-show="!value1")
                    el-row(:gutter="60")
                      el-col(:xs="24" :sm="12" :lg="8" :span="8" v-show="!value1")
                        el-form-item(:label="`全勤指挥部${index + 1}`")
                          el-select(v-model="form.qqzhbZhcddm" placeholder="--请选择--" clearable style="width:100%" @change="form.ddld = form.zhz = ''")
                            el-option(v-for="(item, i) in xczh" :label="item.dictLabel" :value="item.dictValue" :key="i")
                      //- 全勤指挥部 选择的不是无("5")，才显示
                      el-col(:xs="24" :sm="12" :lg="8" :span="8" v-if="form.qqzhbZhcddm !== '5' && form.qqzhbZhcddm !== ''")
                        el-form-item(label="带队领导" :prop="`qqzhb.${index}.ddld`")
                          el-input(v-model="form.ddld" :maxlength="20" placeholder="" clearable style="width:100%")

                      //- 全勤指挥部 选择的是 总队 或者 支队才显示
                      el-col(:xs="24" :sm="12" :lg="5" :span="5" v-if="form.qqzhbZhcddm === '1' || form.qqzhbZhcddm === '2'")
                        el-form-item(label="指挥长" :prop="`qqzhb.${index}.zhz`")
                          el-input(v-model="form.zhz" :maxlength="20" placeholder="" clearable style="width:100%")
                      el-col(:xs="24" :sm="12" :lg="3" :span="3")
                        el-form-item(label="操作")
                          i(class="el-icon-circle-plus-outline icon-plus" @click="qqzhbAddOrRemove(true)")
                          i(class="el-icon-remove-outline icon-plus" v-if="formData.qqzhb.length > 1" @click="qqzhbAddOrRemove(false, index)")

          el-col(:span="24")
            .shadow-box
              .shadow-title 本队投入力量
              el-row(:gutter="60")
                el-col(:xs="24" :sm="12" :lg="4" :span="4")
                  el-form-item(label="车辆(车)")
                    span 共 {{ formData.cdxx.fireEngine.length }} 车
                el-col(:xs="24" :sm="12" :lg="4" :span="4")
                  el-form-item(label="人员(人)")
                    span 共 {{ (formData.cdxx.inCommander || 0) + (formData.cdxx.inFireman || 0) }} 人
                el-col(:xs="24" :sm="12" :lg="8" :span="8")
                  el-form-item(label="指挥员(人)" prop="cdxx.inCommander")
                    el-input-number(style="width:100%" v-model="formData.cdxx.inCommander" :min="0" placeholder="请输入指挥员人数")
                el-col(:xs="24" :sm="12" :lg="8" :span="8")
                  el-form-item(label="消防员(人)" prop="cdxx.inFireman")
                    el-input-number(style="width:100%" v-model="formData.cdxx.inFireman" :min="1" placeholder="请输入消防员人数，必须大于0")
                el-col(:span="24" v-show="!value1")
                  el-form-item(label="有车辆出动")
                    el-checkbox(v-model="fireEngineShow")
                el-col(:xs="24" :sm="24" :lg="16" :span="16")
                  el-form-item(label="消防车辆信息" :prop="fireEngineShow?'cdxx.fireEngine':''")
                    el-select( v-model="formData.cdxx.fireEngine" :disabled='!fireEngineShow' multiple style="width:100%" placeholder="请选择")
                      el-option(v-for="(item, index) in syscar" :label="`${item.carName} (${item.carTypeName})`" :disabled="item.status==='1'" :value="item.carId" :key="item.carId")
                el-col(:xs="24" :sm="12" :lg="8" :span="8" v-show="!value1")
                  el-form-item(label="艇（艘）")
                    el-input-number(style="width:100%" v-model="formData.cdxx.trcts" :min="0" placeholder="请输入")
                el-col(:xs="24" :sm="12" :lg="8" :span="8" v-show="!value1")
                  el-form-item(label="消防直升机（架）")
                    el-input-number(style="width:100%" v-model="formData.cdxx.trxfzsjs" :min="0" placeholder="请输入")
                el-col(:xs="24" :sm="12" :lg="8" :span="8" v-show="!value1")
                  el-form-item(label="搜救犬（只）")
                    el-input-number(style="width:100%" v-model="formData.cdxx.inDog" :min="0" placeholder="请输入")
                el-col(:xs="24" :sm="12" :lg="8" :span="8" v-show="!value1")
                  el-form-item(label="无人机（架）")
                    el-input-number(style="width:100%" v-model="formData.cdxx.inUav" :min="0" placeholder="请输入")

          el-col(:span="24" v-if="formData.cdxx.respondType=='010000'")
            .shadow-box
              .shadow-title 联动单位
              el-row(:gutter="60")
                el-col(:span="24")
                  el-form-item(label="是否有联动单位")
                    el-radio(v-model="formData.cdxx.isLddw" @change="lddw" label="1") 是
                    el-radio(v-model="formData.cdxx.isLddw" @change="lddw" label="2") 否

              el-row(v-if="formData.cdxx.isLddw == '1'" :gutter="60" v-for="(item, index) in formData.lddw" :key="index")
                el-col(:xs="24" :sm="12" :lg="8" :span="8")
                  el-form-item(:label="`联动单位名称${index + 1}`" :prop="`lddw.${index}.lddwmc`")
                    el-input(v-model="formData.lddw[index].lddwmc" :maxlength="20" placeholder=""  clearable style="width:100%")
                el-col(:xs="24" :sm="12" :lg="8" :span="8")
                  el-form-item(label="所属行业部门" :prop="`lddw.${index}.belongDept`")
                    el-select(v-model="formData.lddw[index].belongDept" placeholder="请选择" clearable style="width:100%")
                      el-option(v-for="(item, index) in dicHybm" :label="item.dictLabel" :value="item.dictValue" :key="index")
                el-col(:xs="24" :sm="12" :lg="8" :span="8")
                  el-form-item(label="联动单位所属等级" :prop="`lddw.${index}.belongLevel`")
                    el-select(v-model="formData.lddw[index].belongLevel" placeholder="请选择" clearable style="width:70%")
                      el-option(v-for="(item, index) in dicSsdj" :label="item.dictLabel" :value="item.dictValue" :key="index")

                    i(class="el-icon-circle-plus-outline icon-plus" @click="lddwNums(true)")
                    i(class="el-icon-remove-outline icon-plus"  v-if="formData.lddw.length > 1" @click="lddwNums(false, index)")

          //- 处置情况 是 到场实施处置；且 警情类型 是 火灾扑救 或者 抢险救援 时才显示
          el-col(:span="24" v-if="formData.cdxx.czqkdm === '03' && (isFireFighting || formData.cdxx.sjlbdm.substr(0,3) === '020')")
            .shadow-box
              .shadow-title 主要战术措施
              el-row(:gutter="60")
                el-col(:xs="24" :sm="12" :lg="8" :span="8" v-show="!value1")
                  el-form-item(label="内攻情况")
                    el-radio(v-model="formData.cdxx.insideAttack" label="1") 是
                    el-radio(v-model="formData.cdxx.insideAttack" label="0") 否
                el-col(:xs="24" :sm="12" :lg="8" :span="8" v-if="isFireFighting")
                  el-form-item(label="火灾技战术措施" prop="cdxx.hzJzscsdm")
                    el-select(v-model="formData.cdxx.hzJzscsdm" multiple placeholder="--请选择--" style="width:900px")
                      el-option(v-for="(item, index) in dicHzjzscs" :label="item.dictLabel" :value="item.dictValue" :key="index")
                el-col(:xs="24" :sm="12" :lg="8" :span="8" v-else)
                  el-form-item(label="抢险救援技战术措施" prop="cdxx.qxjyJzscsdm")
                    el-select(v-model="formData.cdxx.qxjyJzscsdm" multiple placeholder="--请选择--" style="width:900px")
                      el-option(v-for="(item, index) in dicQxjyjzscs" :label="item.dictLabel" :value="item.dictValue" :key="index")

          el-col(:span="24"  v-if="formData.cdxx.respondType=='010000'")
            .shadow-box
              .shadow-title 当日气象
              el-row(:gutter="60")
                el-col(:xs="24" :sm="12" :lg="8" :span="8" v-show="!value1")
                  el-form-item(label="气温" prop="cdxx.qw")
                    el-input-number.iconfont.icon-wendu(style="width:90%" v-model="formData.cdxx.qw" placeholder="请输入" :controls="false" )
                el-col(:xs="24" :sm="12" :lg="8" :span="8" v-show="!value1")
                  el-form-item(label="风向")
                    el-select(v-model="formData.cdxx.fxdm" placeholder="--请选择--" clearable style="width:100%")
                      el-option(v-for="(item, index) in dicFx" :label="item.dictLabel" :value="item.dictValue" :key="index")
                el-col(:xs="24" :sm="12" :lg="8" :span="8" v-show="!value1")
                  el-form-item(label="风力")
                    el-select(v-model="formData.cdxx.windForce" placeholder="--请选择--" clearable style="width:100%")
                      el-option(v-for="(item, index) in fenglidj" :label="item.name" :value="item.val" :key="index")
                el-col(:xs="24" :sm="12" :lg="8" :span="8")
                  el-form-item(label="天气" prop="cdxx.weather")
                    el-select(v-model="formData.cdxx.weather" placeholder="--请选择--" clearable style="width:100%")
                      el-option(v-for="(item, index) in qihou"  :label="item.dictLabel" :value="item.dictValue" :key="index")

          el-col(:span="24" v-if="formData.cdxx.respondType=='010000'")
            .shadow-box
              .shadow-title 政府指挥
              el-row(:gutter="60" v-for="(item, index) in formData.gov" :key="index")
                el-col(:xs="24" :sm="12" :lg="8" :span="8" v-show="!value1")
                  el-form-item(label="姓名")
                    el-input(v-model="formData.gov[index].name" :maxlength="20" placeholder=""  clearable style="width:100%")
                el-col(:xs="24" :sm="12" :lg="8" :span="8" v-show="!value1")
                  el-form-item(label="职务")
                    el-input(v-model="formData.gov[index].position" :maxlength="20" placeholder=""  clearable style="width:100%")
                el-col(:xs="24" :sm="12" :lg="8" :span="8" v-show="!value1")
                  el-form-item(label="所属分类")
                    el-select(v-model="formData.gov[index].classify" placeholder="--请选择--" clearable style="width:70%")
                      el-option(v-for="(item, index) in dicLdzhcd"  :label="item.dictLabel" :value="item.dictValue" :key="index")
                    i(class="el-icon-circle-plus-outline icon-plus" @click="zfzhNums(true)")
                    i(class="el-icon-remove-outline icon-plus" @click="zfzhNums(false,index)" v-if="formData.gov.length > 1")

          el-col(:span="24" v-if="formData.cdxx.respondType=='010000'")
            .shadow-box
              .shadow-title 其他消防救援力量

              el-row
                .people-box(v-for="(item, index) in formData.mjjyd" :key="index" v-show="!value1")
                  el-row(:gutter="60")
                    el-col(:xs="24" :sm="12" :lg="8" :span="8" v-show="!value1")
                      el-form-item(label="志愿队类型")
                        el-cascader(v-model="item.qtxfjyllFlBranch" style="width:100%" :options="deptNatureOption[1]" @change="validateOtherRescueForcesFormItem(item)" clearable :props="{emitPath:false}")
                    el-col(:xs="24" :sm="12" :lg="8" :span="8" v-show="!value1")
                      el-form-item(label="志愿队名称")
                        el-input(placeholder="" :maxlength="20" v-model="item.qtxfjyllMc" clearable style="width:100%" @blur="validateOtherRescueForcesFormItem(item)")
                  el-row(:gutter="60")
                    el-col(:xs="24" :sm="12" :lg="8" :span="8" v-show="!value1")
                      el-form-item(label="车（辆）")
                        el-input-number(style="width:100%" v-model="item.cheSl" :min="0" placeholder="请输入")
                    el-col(:xs="24" :sm="12" :lg="8" :span="8" v-show="!value1")
                      el-form-item(label="艇（艘）")
                        el-input-number(style="width:100%" v-model="item.tingSl" :min="0" placeholder="请输入")
                    el-col(:xs="24" :sm="12" :lg="8" :span="8" v-show="!value1")
                      el-form-item(label="人（人）" :class="{'is-error': item.invalid}")
                        el-input-number(style="width:70%" v-model="item.renSl" :min="0" placeholder="请输入" @change="validateOtherRescueForcesFormItem(item)")
                        i(class="el-icon-circle-plus-outline icon-plus" @click="otherRescueForces('mjjyd',true)")
                        i(class="el-icon-remove-outline icon-plus" v-if="formData.mjjyd.length > 1" @click="otherRescueForces('mjjyd',false, index)")
                      span.qtxfjyll-warn(v-show="item.invalid") 请填写出动人数
              el-row
                .people-box(v-for="(item, index) in formData.qyzzd" :key="index" v-show="!value1" )
                  el-row(:gutter="60")
                    el-col(:xs="24" :sm="12" :lg="8" :span="8" v-show="!value1")
                      el-form-item(label="专职队类型")
                        el-cascader(v-model="item.qtxfjyllFlBranch" style="width:100%" :options="deptNatureOption[0]" @change="validateOtherRescueForcesFormItem(item)" clearable :props="{emitPath:false}")
                    el-col(:xs="24" :sm="12" :lg="8" :span="8" v-show="!value1")
                      el-form-item(label="专职队名称")
                        el-input(placeholder="" :maxlength="20" v-model="item.qtxfjyllMc" clearable style="width:100%" @blur="validateOtherRescueForcesFormItem(item)")
                  el-row(:gutter="60")
                    el-col(:xs="24" :sm="12" :lg="8" :span="8" v-show="!value1")
                      el-form-item(label="车（辆）")
                        el-input-number(style="width:100%" v-model="item.cheSl" :min="0" placeholder="请输入")
                    el-col(:xs="24" :sm="12" :lg="8" :span="8" v-show="!value1") 
                      el-form-item(label="艇（艘）")
                        el-input-number(style="width:100%" v-model="item.tingSl" :min="0" placeholder="请输入")
                    el-col(:xs="24" :sm="12" :lg="8" :span="8" v-show="!value1")
                      el-form-item(label="人（人）" :class="{'is-error': item.invalid}")
                        el-input-number(style="width:70%" v-model="item.renSl" :min="0" placeholder="请输入" @change="validateOtherRescueForcesFormItem(item)")
                        i(class="el-icon-circle-plus-outline icon-plus" @click="otherRescueForces('qyzzd',true)")
                        i(class="el-icon-remove-outline icon-plus" v-if="formData.qyzzd.length > 1" @click="otherRescueForces('qyzzd',false, index)")
                      span.qtxfjyll-warn(v-show="item.invalid") 请填写出动人数
          el-col(:span="24")
            .shadow-box
              .shadow-title 参战人员伤亡情况
              el-row(:gutter="60")
                el-col(v-show="!value1")
                  el-form-item(label="参战人员伤亡情况")
                    el-radio(v-model="formData.cdxx.isCzrysw" @change="isczryswChangeHandle" label="1") 有
                    el-radio(v-model="formData.cdxx.isCzrysw" @change="isczryswChangeHandle" label="2") 无

          //-  受伤人员 列表
          el-col(:span="24" v-if="formData.cdxx.isCzrysw==1")
            .shadow-box
              .shadow-title 受伤人员
                .button-list
                  i(class="el-icon-circle-plus-outline icon-plus" @click="peopleLists('czryswInjured',true)")
              .people-box(v-for="(item, index) in formData.czryswInjured")
                el-row(:gutter="60")
                  el-col(:span="24" v-show="!value1")
                    el-form-item(:label="`人员伤亡情况 ${index + 1}`" )
                      //- el-radio(v-model="item.swfl" label="1") 受伤
                      span.item 受伤
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="人员姓名" :prop="`czryswInjured.${index}.xm`")
                      el-input(v-model="item.xm" placeholder="" clearable style="width:100%" :prop="`czryswInjured.${index}.xm`")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="人员性别" :prop="`czryswInjured.${index}.sex`")
                      el-select(v-model="item.sex" placeholder="--请选择--" clearable style="width:100%")
                        el-option(v-for="(item, index) in userSex" :label="item.dictLabel" :value="item.dictValue" :key="index")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="人员年龄" :prop="`czryswInjured.${index}.age`")
                      //- el-input(v-model="item.age" type="number" placeholder="" style="width:100%")
                      el-input-number(style="width:100%" v-model="item.age" :min="0" placeholder="请输入" :controls="false")
                      //- el-select(v-model="item.age" placeholder="--请选择--" style="width:100%")
                          el-option(v-for="(item, index) in dicRynl" :label="item.dictLabel" :value="item.dictValue" :key="index")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8" )
                    el-form-item(label="人员身份" :prop="`czryswInjured.${index}.rylbdm`")
                      el-select(v-model="item.rylbdm" placeholder="--请选择--" clearable style="width:100%")
                        el-option(v-for="(item, index) in dicRysfxx" :label="item.dictLabel" :value="item.dictValue" :key="index")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="身份证号" :prop="`czryswInjured.${index}.personalId`")
                      el-input(v-model="item.personalId" placeholder="" clearable style="width:100%" @blur="validatorCdCard(item.personalId,index,'czryswInjured')")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8" v-show="!value1")
                    el-form-item(label="人员编号")
                      el-input(v-model="item.personalCode" placeholder="" clearable style="width:100%")
                  //- el-col(:xs="24" :sm="12" :lg="8" :span="8")
                      el-form-item(label="入伍年月")
                          el-date-picker(v-model="item.rwny" type="date" placeholder="选择日期" style="width:100%" format="yyyy-MM-dd" value-format="yyyy-MM-dd")
                  //- el-col(:xs="24" :sm="12" :lg="8" :span="8")
                      el-form-item(label="入职年月")
                          el-date-picker(v-model="item.rzny" type="date" placeholder="选择日期" style="width:100%" format="yyyy-MM-dd" value-format="yyyy-MM-dd")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8" v-show="!value1")
                    el-form-item(label="衔级")
                      el-input(v-model="item.ryxj" placeholder="" clearable style="width:100%")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="职级" v-show="!value1")
                      el-input(v-model="item.ryzj" placeholder="" clearable style="width:100%")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="职务" :prop="`czryswInjured.${index}.position`")
                      el-input(v-model="item.position" placeholder="" clearable style="width:100%")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="受伤部位" :prop="`czryswInjured.${index}.ssbwdm`")
                      el-select(v-model="item.ssbwdm" placeholder="--请选择--" clearable style="width:100%")
                        el-option(v-for="(item, index) in dicSsbw" :label="item.dictLabel" :value="item.dictValue" :key="index")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="事发位置" :prop="`czryswInjured.${index}.location`")
                      el-input(v-model="item.location" placeholder="" clearable style="width:100%")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="事发时段" style="width:100%" :prop="`czryswInjured.${index}.swdddm`")
                      el-select(v-model="item.swdddm" placeholder="--请选择--" clearable style="width:100%" )
                        el-option(v-for="(item, index) in dicSwdd" :label="item.dictLabel" :value="item.dictValue" :key="index")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="受伤原因" :prop="`czryswInjured.${index}.swyydm`")
                      el-select(v-model="item.swyydm" placeholder="--请选择--" clearable style="width:100%" )
                        el-option(v-for="(item, index) in dicSwyy" :label="item.dictLabel" :value="item.dictValue" :key="index")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="防护装备" :prop="`czryswInjured.${index}.equipt`")
                      el-select(v-model="item.equipt" placeholder="--请选择--" clearable style="width:70%")
                        el-option(v-for="(item, index) in dicFhzb" :label="item.dictLabel" :value="item.dictValue" :key="index")

                      i(class="el-icon-circle-plus-outline icon-plus" @click="peopleLists('czryswInjured', true)")

                      i(class="el-icon-remove-outline icon-plus" v-if="formData.czryswInjured.length" @click="peopleLists('czryswInjured', false,index)")

          //-  死亡人员 列表
          el-col(:span="24" v-if="formData.cdxx.isCzrysw==1")
            .shadow-box
              .shadow-title 死亡人员
                .button-list
                  i(class="el-icon-circle-plus-outline icon-plus" @click="peopleLists('czryswDead',true)")

              .people-box(v-for="(item, index) in formData.czryswDead")
                el-row(:gutter="60")
                  el-col(:span="24" v-show="!value1")
                    el-form-item(:label="`人员伤亡情况 ${index + 1}`" )
                      //- el-radio(v-model="item.swfl" label="0") 死亡
                      span.item 死亡
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="人员姓名" :prop="`czryswDead.${index}.xm`")
                      el-input(v-model="item.xm" placeholder="" clearable style="width:100%")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="人员性别" :prop="`czryswDead.${index}.sex`")
                      el-select(v-model="item.sex" placeholder="--请选择--" clearable style="width:100%")
                        el-option(v-for="(item, index) in userSex" :label="item.dictLabel" :value="item.dictValue" :key="index")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="人员年龄" :prop="`czryswDead.${index}.age`")
                      //- el-input(v-model="item.age" type="number" placeholder="" style="width:100%")
                      el-input-number(style="width:100%" v-model="item.age" :min="0" placeholder="请输入" :controls="false")
                      //- el-select(v-model="item.age" placeholder="--请选择--" style="width:100%")
                          el-option(v-for="(item, index) in dicRynl" :label="item.dictLabel" :value="item.dictValue" :key="index")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8" )
                    el-form-item(label="人员身份" :prop="`czryswDead.${index}.rylbdm`")
                      el-select(v-model="item.rylbdm" placeholder="--请选择--" clearable style="width:100%")
                        el-option(v-for="(item, index) in dicRysfxx" :label="item.dictLabel" :value="item.dictValue" :key="index")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="身份证号" :prop="`czryswDead.${index}.personalId`")
                      el-input(v-model="item.personalId" placeholder="" clearable style="width:100%" @blur="validatorCdCard(item.personalId,index,'czryswDead')")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8" v-show="!value1")
                    el-form-item(label="人员编号" )
                      el-input(v-model="item.personalCode" placeholder="" clearable style="width:100%")
                  //- el-col(:xs="24" :sm="12" :lg="8" :span="8")
                      el-form-item(label="入伍年月")
                          el-date-picker(v-model="item.rwny" type="date" placeholder="选择日期" style="width:100%" format="yyyy-MM-dd" value-format="yyyy-MM-dd")
                  //- el-col(:xs="24" :sm="12" :lg="8" :span="8")
                      el-form-item(label="入职年月")
                          el-date-picker(v-model="item.rzny" type="date" placeholder="选择日期" style="width:100%" format="yyyy-MM-dd" value-format="yyyy-MM-dd")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8" v-show="!value1")
                    el-form-item(label="衔级")
                      el-input(v-model="item.ryxj" placeholder="" clearable style="width:100%")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8" v-show="!value1")
                    el-form-item(label="职级")
                      el-input(v-model="item.ryzj" placeholder="" clearable style="width:100%")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8" v-show="!value1")
                    el-form-item(label="职务" :prop="`czryswDead.${index}.position`")
                      el-input(v-model="item.position" placeholder="" clearable style="width:100%")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="致命伤部位" :prop="`czryswDead.${index}.ssbwdm`")
                      el-select(v-model="item.ssbwdm" placeholder="--请选择--" clearable style="width:100%")
                        el-option(v-for="(item, index) in dicSsbw" :label="item.dictLabel" :value="item.dictValue" :key="index")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="事发位置" :prop="`czryswDead.${index}.location`")
                      el-input(v-model="item.location" placeholder="" clearable style="width:100%")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="事发时段" :prop="`czryswDead.${index}.swdddm`")
                      el-select(v-model="item.swdddm" placeholder="--请选择--" clearable style="width:100%")
                        el-option(v-for="(item, index) in dicSwdd" :label="item.dictLabel" :value="item.dictValue" :key="index")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="死亡原因" :prop="`czryswDead.${index}.swyydm`")
                      el-select(v-model="item.swyydm" placeholder="--请选择--" clearable style="width:100%")
                        el-option(v-for="(item, index) in dicSwyy" :label="item.dictLabel" :value="item.dictValue" :key="index")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="防护装备" :prop="`czryswDead.${index}.equipt`")
                      el-select(v-model="item.equipt" placeholder="--请选择--" clearable style="width:100%")
                        el-option(v-for="(item, index) in dicFhzb" :label="item.dictLabel" :value="item.dictValue" :key="index")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="当场死亡" :prop="`czryswDead.${index}.sceneDead`")
                      el-select(v-model="item.sceneDead" placeholder="--请选择--" clearable style="width:70%")
                        el-option(v-for="option in booleanOption" :label="option.text" :value="option.value" :key="option.value")

                      i(class="el-icon-circle-plus-outline icon-plus" @click="peopleLists('czryswDead',true)")

                      i(class="el-icon-remove-outline icon-plus" v-if="formData.czryswDead.length" @click="peopleLists('czryswDead',false,index)")


          el-col(:span="24" v-if="formData.cdxx.czqkdm === '03'")
            .shadow-box
              .shadow-title 战斗结果
              el-row(:gutter="60")
                el-col(:xs="24" :sm="12" :lg="8" :span="8" v-show="!value1")
                  el-form-item(label="抢救（人）")
                    el-input-number(style="width:100%" v-model="formData.cdxx.rescueNum" :min="0" placeholder="请输入" @change="calcDeadNum")
                el-col(:xs="24" :sm="12" :lg="8" :span="8" v-show="!value1")
                  el-form-item(label="生还（人）")
                    el-input-number(style="width:100%" v-model="formData.cdxx.shrs" :min="0" :max="formData.cdxx.rescueNum * 1" placeholder="请输入" @change="calcDeadNum")
                el-col(:xs="24" :sm="12" :lg="8" :span="8" v-show="!value1")
                  el-form-item(label="死亡（人）")
                    span.item 共 {{ formData.cdxx.deadNum }} 人（抢救 - 生还）
                el-col(:xs="24" :sm="12" :lg="8" :span="8" v-show="!value1")
                  el-form-item(label="疏散（人）")
                    el-input-number(style="width:100%" v-model="formData.cdxx.ssrs" :min="0" placeholder="请输入")
                el-col(:xs="24" :sm="12" :lg="8" :span="8")
                  el-form-item(label="抢救财产（元）" prop="cdxx.qjccjz")
                    el-input-number(style="width:100%" v-model="formData.cdxx.qjccjz" @change="handleChange" :min="0" :step="100" :precision="0" placeholder="请输入")
                el-col(:xs="24" :sm="12" :lg="8" :span="8" v-if="formData.cdxx.respondType=='010000'")
                  el-form-item(label="保护财产价值（元）" prop="cdxx.protectPropVal")
                    el-input-number(style="width:100%" v-model="formData.cdxx.protectPropVal" :precision="0" :min="0" placeholder="请输入")

          //- el-col(:span="24")
              .shadow-box
                  .shadow-title 车辆损耗
                  el-row(:gutter="60")
                      el-col(:xs="24" :sm="12" :lg="8" :span="8")
                          el-form-item(label="损耗车辆信息")
                              el-select(v-model="formData.cdxx.damageEngine" multiple style="width:100%" placeholder="请选择")
                                  el-option(v-for="(item, index) in syscar" :label="item.carInfo" :value="item.carId" :key="item.carId")

          el-col(:span="24")
            .shadow-box
              .shadow-title 战斗消耗
                span.arrowBtn(@click="consumablesShow=!consumablesShow") {{consumablesShow?'收起':'展开'}} #[i(:class="consumablesShow?'el-icon-arrow-down':'el-icon-arrow-right'")]
              .show-body(v-show="consumablesShow")

                .h4 —— 车辆损耗 ——
                el-row.consumables(:gutter="60" v-show="!value1")
                  el-col(:xs="24" :sm="24" :lg="24" :span="24")
                    el-form-item(label="损耗车辆信息")
                      el-select(v-model="formData.cdxx.damageEngine" multiple style="width:100%" placeholder="请选择")
                        el-option(v-for="(item, index) in syscar" :label="item.carInfo" :value="item.carId" :key="item.carId")

                .h4 —— 灭火器材 ——
                el-row.consumables(:gutter="60" v-show="!value1")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="机动消防泵(含浮艇泵)（台）")
                      el-input-number(style="width:100%" v-model="formData.cdxx.xhjdxfb" :min="0" placeholder="请输入")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="移动式水带卷盘或水带槽（个）")
                      el-input-number(style="width:100%" v-model="formData.cdxx.xhydssdjp" :min="0" placeholder="请输入")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="移动式消防炮（个）")
                      el-input-number(style="width:100%" v-model="formData.cdxx.xhydsxfp" :min="0" placeholder="请输入")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="空气泡沫枪（个）")
                      el-input-number(style="width:100%" v-model="formData.cdxx.xhkqpmq" :min="0" placeholder="请输入")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="泡沫液桶（个）")
                      el-input-number(style="width:100%" v-model="formData.cdxx.xhpmyt" :min="0" placeholder="请输入")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="梯子（把）")
                      el-input-number(style="width:100%" v-model="formData.cdxx.xhtz" :min="0" placeholder="请输入")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="水带（米）")
                      el-input-number(style="width:100%" v-model="formData.cdxx.xhsd" :min="0" placeholder="请输入")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="消防栓扳手（把）")
                      el-input-number(style="width:100%" v-model="formData.cdxx.xhxfsbs" :min="0" placeholder="请输入")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="水枪（个）")
                      el-input-number(style="width:100%" v-model="formData.cdxx.xhsq" :min="0" placeholder="请输入")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="分水器（只）")
                      el-input-number(style="width:100%" v-model="formData.cdxx.xhfsq" :min="0" placeholder="请输入")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="破拆工具（个）")
                      el-input-number(style="width:100%" v-model="formData.cdxx.xhpcgj" :min="0" placeholder="请输入")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="灭火机（只）")
                      el-input-number(style="width:100%" v-model="formData.cdxx.xhmhq" :min="0" placeholder="请输入")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="手抬泵（个）")
                      el-input-number(style="width:100%" v-model="formData.cdxx.xhstb" :min="0" placeholder="请输入")

                  el-col(:span="24" v-for="(item, index) in formData.mhqcOther" :key="index")
                    el-form-item(:label="`其他物品${index + 1}`")
                      el-input(v-model="item.content" placeholder="请输入内容" clearable style="width:30%")
                      el-input-number(style="width:60%" v-model="item.num" :min="0" :max="10" placeholder="请输入")
                      i(class="el-icon-circle-plus-outline icon-plus" @click="xhypNum('mhqcOther', true)")
                      i(class="el-icon-remove-outline icon-plus" v-if="formData.mhqcOther.length > 1" @click="xhypNum('mhqcOther', false, index)")

                .h4 —— 个人装备 ——
                el-row.consumables(:gutter="60" v-show="!value1")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="消防头盔（个）")
                      el-input-number(style="width:100%" v-model="formData.cdxx.xhxftk" :min="0" placeholder="请输入")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="消防员灭火防护服（套）")
                      el-input-number(style="width:100%" v-model="formData.cdxx.xhxfymhfhf" :min="0" placeholder="请输入")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="消防手套（副）")
                      el-input-number(style="width:100%" v-model="formData.cdxx.xhxfst" :min="0" placeholder="请输入")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="消防安全腰带（根）")
                      el-input-number(style="width:100%" v-model="formData.cdxx.xhxfaqyd" :min="0" placeholder="请输入")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="消防员灭火防护靴（双）")
                      el-input-number(style="width:100%" v-model="formData.cdxx.xhxfymhfhx" :min="0" placeholder="请输入")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="双正式压消防空气呼吸器（个）")
                      el-input-number(style="width:100%" v-model="formData.cdxx.xhzysxfkqhxq" :min="0" placeholder="请输入")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="佩戴式防爆照灯（个）")
                      el-input-number(style="width:100%" v-model="formData.cdxx.xhpdsfbzmd" :min="0" placeholder="请输入")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="消防员呼救器（个）")
                      el-input-number(style="width:100%" v-model="formData.cdxx.xhxfyhxq" :min="0" placeholder="请输入")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="方位灯（个）")
                      el-input-number(style="width:100%" v-model="formData.cdxx.xhfwd" :min="0" placeholder="请输入")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="消防安全绳（根）")
                      el-input-number(style="width:100%" v-model="formData.cdxx.xhxfqxaqs" :min="0" placeholder="请输入")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="消防腰斧（个）")
                      el-input-number(style="width:100%" v-model="formData.cdxx.xhxfyf" :min="0" placeholder="请输入")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="通信装备（个）")
                      el-input-number(style="width:100%" v-model="formData.cdxx.xhtxsb" :min="0" placeholder="请输入")
                  el-col(:span="24" v-for="(item, index) in formData.grzbOther" :key="index")
                    el-form-item(:label="`其他物品${index + 1}`")
                      el-input(v-model="item.content" placeholder="请输入内容" clearable style="width:30%")
                      el-input-number(style="width:60%" v-model="item.num" :min="0" :max="10" placeholder="请输入")
                      i(class="el-icon-circle-plus-outline icon-plus" @click="xhypNum('grzbOther', true)")
                      i(class="el-icon-remove-outline icon-plus" v-if="formData.grzbOther.length > 1" @click="xhypNum('grzbOther', false, index)")

                .h4 —— 灭火药剂 ——
                el-row.consumables(:gutter="60" v-show="!value1")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="泡沫液（千克）")
                      el-input-number(style="width:100%" v-model="formData.cdxx.xhpmy" :min="0" placeholder="请输入")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="干粉（千克）")
                      el-input-number(style="width:100%" v-model="formData.cdxx.xhgf" :min="0" placeholder="请输入")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="二氧化碳（千克）")
                      el-input-number(style="width:100%" v-model="formData.cdxx.xheyht" :min="0" placeholder="请输入")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="卤代烷（升）")
                      el-input-number(style="width:100%" v-model="formData.cdxx.xhldw" :min="0" placeholder="请输入")
                  el-col(:span="24" v-for="(item, index) in  formData.mhyjOther" :key="index")
                    el-form-item(:label="`其他物品${index + 1}`")
                      el-input(v-model="item.content" placeholder="请输入内容" clearable style="width:30%")
                      el-input-number(style="width:60%" v-model="item.num" :min="0" :max="10" placeholder="请输入")
                      i(class="el-icon-circle-plus-outline icon-plus" @click="xhypNum('mhyjOther', true)")
                      i(class="el-icon-remove-outline icon-plus" v-if="formData.mhyjOther.length > 1" @click="xhypNum('mhyjOther', false, index)")

                .h4 —— 消防用水量情况 ——
                el-row.consumables(:gutter="60" v-show="!value1")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="总流量（升/秒）")
                      el-input-number(style="width:100%" v-model="formData.cdxx.zll" :min="0" placeholder="请输入")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="灭火用水（吨）")
                      el-input-number(style="width:100%" v-model="formData.cdxx.mhys" :min="0" placeholder="请输入")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="冷却水（吨）")
                      el-input-number(style="width:100%" v-model="formData.cdxx.lqs" :min="0" placeholder="请输入")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="用水总量（吨）")
                      el-input-number(style="width:100%" v-model="formData.cdxx.yszl" :min="0" placeholder="请输入")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="无故供水中断（次）")
                      el-input-number(style="width:100%" v-model="formData.cdxx.gszd" :min="0" placeholder="请输入")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="水渍损失")
                      el-select(v-model="formData.cdxx.szss" placeholder="--请选择--" clearable style="width:100%")
                        el-option(v-for="(item, index) in dicSzss" :label="item.dictLabel" :value="item.dictValue" :key="index")

          //- 处置情况 是 到场实施处置 时才显示
          el-col(:span="24" v-if="formData.cdxx.czqkdm === '03'")
            .shadow-box
              .shadow-title 处置（执勤）经过
              el-row(:gutter="60")
                el-col(:span="24")
                  el-form-item(label="处置（执勤）经过" prop="cdxx.czjg")
                    el-input(v-model="formData.cdxx.czjg" type="textarea" :placeholder="textArea"  resize="none" maxlength="1000" show-word-limit :autosize="{ minRows: 3, maxRows: 3}" style="width:100%")

          //- 处置情况 不是 中途返回 时才显示
          el-col(:span="24" v-if="formData.cdxx.czqkdm !== '01'" v-loading="uploadProcess" element-loading-text="请稍等，文件上传中")
            .shadow-box
              .shadow-title 现场照片
              el-row(:gutter="60" v-show="!value1")
                el-col(:span="24" )
                  el-form-item.show-images(label="出动现场照片")
                    //- 多选属性 multiple
                    el-upload.upload-images-component(
                    ref="imageUpload"
                      :action="imgPostUrl"
                        :headers="imgPostHeaders"
                    accept=".jpg,.png"
                    list-type="picture-card"
                      :limit="9"
                        :before-upload="beforeUploadImage"
                        :on-success="successUploadImage"
                        :on-preview="handleImagePreview"
                        :on-remove="handleImageRemove"
                        :on-error="errmasage"
                        :file-list="formData.imgs"
                        :disabled="formData.imgs && formData.imgs.length === 9"
                    )
                      //- i.el-icon-plus
                      //- el-button(slot="trigger" size="small" type="primary") 选取文件
                      //- el-button(style="margin-left: 10px;" size="small" type="success" @click="submitImageUpload") 上传
                      i.el-icon-plus(slot="default")
                      div(slot="file" slot-scope="{file}")
                        img.el-upload-list__item-thumbnail(:src="file.url" alt="")
                        span.el-upload-list__item-actions
                          span.el-upload-list__item-preview(@click="handleImagePreview(file)")
                            i.el-icon-zoom-in
                          //- span.el-upload-list__item-delete(@click="handleDownload(data.file)")
                              i.el-icon-download
                          span.el-upload-list__item-delete(@click="handleImageRemove(file)")
                            i.el-icon-delete
                        input(v-model="file.depict" placeholder="请输入说明文字" @keydown.stop="resetDeleteHandle")
                      .el-upload__tip(slot="tip")  只能上传 jpg/png 文件，最多9张且每个不能超过 10MB

          el-col(:span="24")
            .shadow-box
              .shadow-title 其他
              el-row(:gutter="60" v-show="!value1")
                el-col(:span="24")
                  el-form-item(label="相关附件上传")
                    el-upload(
                    ref="upload"
                    action=""
                      :limit="1"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :http-request="uploadImport"
                        :auto-upload="true"
                        :file-list="fileDataList"
                    )
                      el-button(slot="trigger" size="small" type="primary") 选取文件
                      //- el-button(style="margin-left: 10px;" size="small" type="success" @click="submitUpload") 上传

          //- 审核专用
          audit(v-if="draft.reviewing" :propfrom="propfrom" @auditData="auditData")
      //- 图片列表 单个图片预览弹窗
      el-dialog(:visible.sync="dialogVisible")
        img(width="100%" :src="dialogImageUrl" alt="")
      //- 底部操作按钮
      .operating-button-list
        el-button(@click="back" size="medium") 返&nbsp;回
        el-button(v-if="isNew" type="primary" size="medium" @click="commitData") 提&nbsp;交
        el-button(v-else type="primary" size="medium" @click="preservationInfo") 保&nbsp;存
</template>

<script>
import { getToken } from "@/utils/auth";
import { fileDownload } from "@/utils/fileDownload";
import { picUploadAddWatermarkUrl } from "@/api/common";
import { cdxxApi } from "@/api/data/entry/cdxx";
import { getRecord } from "@/api/data/aduit/zqxx";
import { repprtFill, checkSlightFire } from "@/api/data/entry/zqxx";
import { formatterDate } from "@/utils/index";
// 顶部 警情信息 组件
import topDetail from "@/views/data/entry/zqxx/components/topDetail.vue";
// 审核组件
import audit from "@/views/data/aduit/zqxx/components/audit";
import {check} from '@/views/data/entry/jqxx/components/notice'

export default {
  name: "ReportingPolice",
  components: {
    // mulFireFightingVehicle
    audit,
    topDetail
  },
  props: ["draft", "tableRow"],
  data() {
    var validateNum = (rule, value, callback) => {
      let reg = /^\d+(\.\d+)?$/;
      if (value === "") {
        callback(new Error("请输入内容"));
      } else if (!reg.test(value)) {
        callback(new Error("仅可输入数字"));
      } else {
        callback();
      }
    };
    var qwNum = (rule, value, callback)=> {
      if (value < -50 || value > 50) {
        callback(new Error('气温不能超过-50~50摄氏度'));
      } else {
        callback();
      }
    };
    var checkCdTime = (rule, value, callback) => {
      if(this.jqxxData.jjsj > value){
        callback(new Error('出动时间不能早于接警时间'))
      } else {
        callback()
      }
    };
    var checkDcqk = (rule, value, callback) =>{
      if(this.formData.cdxx.xmsj < this.formData.cdxx.dcsj){
        if(value!='050000'){
          callback(new Error('熄灭时间早于到场时间，火灾情况只能选择火已熄灭'))
        }
      } else {
        callback()
      }
    };
    var checkXmTime = (rule, value, callback) =>{
      if(this.jqxxData.jjsj < value){
        callback()
      }else{
        callback(new Error('熄灭时间不能早于起火时间'))
      }
    };
    return {
      value1:false,
      pickerOptions: {
        disabledDate(time) {
          // const now = Date.now();
          // let timeLimit = 366 * 24 * 3600 * 1000;
          // let limit = now - timeLimit;
          // return time.getTime() > Date.now() || time.getTime() < limit;
          const timeLimit = new Date('2020.1.1').getTime();
          return time.getTime() > Date.now() || time.getTime() < timeLimit;
        }
      },
      fireEngineShow: false,
      /***************************通用的下拉选项 */
      booleanOption: [
        {
          value: "1",
          text: "是"
        },
        {
          value: "0",
          text: "否"
        }
      ],
      textArea: "",
      jqxxLoading: false,

      //头部显示创建人和创建时间
      tbsj: "",
      deptname: "",
      auditTopLoading: false,

      // lddwNum: 0, //联动单位添加数量
      // zfzhNum:1, //政府指挥 - 各级党政领导添加数量
      // carNum:1, // 本队投入力量 - 非消防车辆 （地方救援）添加数量
      // peopleList:0,//伤亡情况添加数量
      // mhqcNum:1,//灭火器材-其他物品添加数量
      // grzbNum:1,//个人装备-其他物品添加数量
      // mhyjNum:1,//灭火药剂-其他物品添加数量
      consumablesShow: false, // 消耗用品展示
      consumptionShow: false, // 消防用水量情况展示

      jqxxData: {}, //警情信息表

      isNew: false,
      listData: {},
      /**
       * 下拉框信息
       */
      // 全勤指挥部
      xczh: [],
      dicDdzhzw: [], //带队指挥职务
      dicFx: [], //风向
      dicHybm: [], //所属行业部门
      dicSsdj: [], //所属等级
      dicHyzgbm: [], //-行业主管部门
      dicLdzhcd: [], //-政府领导指挥出动
      dicHzjzscs: [], //-火灾技战术措施
      dicQxjyjzscs: [], //-抢险救援技战术措施
      dicCzqk: [], //-处置情况
      dicHzqk: [], //-火灾情况
      dicGgxhs: [], //-公共消火栓使用情况
      dicBsyyy: [], //-不使用公用消防栓原因
      dicGdxfss: [], //-固定消防设施使用情况
      dicDfjycllx: [], //-车辆类型（地方救援）
      dicRysfxx: [], //-人员身份
      userSex: [], //-用户性别
      dicRynl: [], //-人员年龄
      dicSsbw: [], //-受伤部位
      dicSwdd: [], //-事发位置
      dicSwyy: [], //-伤亡原因
      dicFhzb: [], //-防护装备
      dicSzss: [], //-水渍损失
      syscar: [], //
      fenglidj: [
        { name: "1级", val: "1" },
        { name: "2级", val: "2" },
        { name: "3级", val: "3" },
        { name: "4级", val: "4" },
        { name: "5级", val: "5" },
        { name: "6级", val: "6" },
        { name: "7级", val: "7" },
        { name: "8级", val: "8" },
        { name: "9级", val: "9" },
        { name: "10级", val: "10" },
        { name: "11级", val: "11" },
        { name: "12级", val: "12" },
        { name: "13级", val: "13" },
        { name: "14级", val: "14" },
        { name: "15级", val: "15" },
        { name: "16级", val: "16" }
      ],
      qihou: [],

      czryswInjuredJson: {
        // 受伤分类
        swfl: "1",
        // 姓名
        xm: "",
        // 性别
        sex: "",
        // 人员年龄
        age: "",
        // 人员身份
        rylbdm: "",
        // 身份证号
        personalId: "",
        // 人员编号
        personalCode: "",
        // 入伍年月
        rwny: "",
        // 入职年月
        rzny: "",
        // 衔级
        ryxj: "",
        // 职级
        ryzj: "",
        // 职务
        position: "",
        // 受伤部位
        ssbwdm: "",
        // 事发位置
        location: "",
        // 事发时段
        swdddm: "",
        // 受伤原因
        swyydm: "",
        // 防护装备
        equipt: ""
      },
      czryswDeadJson: {
        // 受伤分类
        swfl: "0",
        // 姓名
        xm: "",
        // 性别
        sex: "",
        // 人员年龄
        age: "",
        // 人员身份
        rylbdm: "",
        // 身份证号
        personalId: "",
        // 人员编号
        personalCode: "",
        // 入伍年月
        rwny: "",
        // 入职年月
        rzny: "",
        // 衔级
        ryxj: "",
        // 职级
        ryzj: "",
        // 职务
        position: "",
        // 致命伤部位
        ssbwdm: "",
        // 事发位置
        location: "",
        // 事发时段
        swdddm: "",
        // 死亡原因
        swyydm: "",
        // 防护装备
        equipt: "",
        // 当场死亡
        sceneDead: ""
      },
      isFireFighting: false, // 是否是火灾扑救
      formData: {
        cdxx: {
          //参战人员伤亡情况 1 有  2 无
          isCzrysw: "2",
          /***************************附件 */
          // 路径
          annex: "",
          // 名称
          annexName: "",

          cdbh: "",
          sjlbdm: "",
          isFirstarrive: "N", //是否首到（0：不是；1：是）
          respondType: "", //出动类型代码（主战，增援）

          isChecked: "2", // 是否正在核实
          arriveTime: "",
          isLddw: "2", // 是否有联动单位
          //当日气象
          qw: undefined, //气温
          fxdm: "", //风向
          windForce: "", //风力
          // 天气
          weather: "",

          hyzgbm: "", //行业主管部门

          //主要战术措施
          insideAttack: "2", //内攻情况
          hzJzscsdm: [], //火灾技战术措施
          qxjyJzscsdm: [], //抢险救援技战术措施

          /**********************处置情况 */
          // 处置（执勤）经过
          czjg: "",
          // 处置情况
          czqkdm: "",
          // 中返时间
          zlsj: "",
          // 出动时间
          cdsj: "",
          // 到场时间
          dcsj: "",
          // 展开时间
          zksj: "",
          // 出水时间
          cssj: "",
          // 控制时间
          kzsj: "",
          // 熄灭时间
          xmsj: "",
          // 洗消时间
          xxsj: "",
          // 结束时间
          jssj: "",
          // 撤离时间
          clsj: "",
          // 归队时间
          fdsj: "",

          sjlc: undefined, //距离现场距离
          dcshzqkdm: "", //到场时火灾情况
          xcrybkqkdm: undefined, //现场人员被困人数
          useHydrant: "0", //是否采用公用消防栓供水
          hydrantSupply: "", //公用消防栓供水情况
          hydrantNotuse: "", //不使用公用消防栓原因
          gdxfssyyqkdm: "", //固定消防设施使用情况

          isBlock: "2", // 消防车通道是否堵塞
          dredgeTime: "", // 疏通耗时

          /**********************本队投入力量 */
          // 车辆总数
          carCount: "0",
          trrys: "0", //人员总数(人)
          inCommander: undefined, //指挥员
          inFireman: undefined, //消防员
          inOther: "0", //其他救援力量
          inSociety: "0", //社会力量

          //本队投入力量 - 消防车辆
          fireEngine: [], //消防车辆信息
          //本队投入力量 - 其他
          trcts: "0", //艇（艘）
          trxfzsjs: "0", //消防直升机（架）
          inDog: "0", // 搜救犬（只）
          // 无人机
          inUav: "0",

          //战斗结果
          rescueNum: "0", //抢救（人）
          shrs: "0", //生还（人）
          deadNum: "0", //死亡（人）
          ssrs: "0", //疏散（人）
          qjccjz: "0.00", //抢救财产（万元）
          protectPropVal: "0",
          //损耗车辆信息
          damageEngine: [], //损耗车辆信息

          // 灭火器材
          xhjdxfb: "0", //机动消防泵
          xhydssdjp: "0", //移动式水带卷盘或水带槽（个）
          xhydsxfp: "0", //移动式消防炮（个）
          xhkqpmq: "0", //空气泡沫枪（个）
          xhpmyt: "0", //泡沫液桶（个）
          xhtz: "0", //梯子（把）
          xhsd: "0", //水带（米）
          xhxfsbs: "0", //消防栓扳手（把）
          xhsq: "0", //水枪（个）
          xhfsq: "0", //分水器（只）
          xhpcgj: "0", //破拆工具（个）
          xhmhq: "0", //灭火机（只）
          xhstb: "0", //手抬泵（个）

          // 个人装备
          xhxftk: "0", //消防头盔（个）
          xhxfymhfhf: "0", //消防员灭火防护服（套）
          xhxfst: "0", //消防手套（副）
          xhxfaqyd: "0", //消防安全腰带（根）
          xhxfymhfhx: "0", //消防员灭火防护靴（双）
          xhzysxfkqhxq: "0", //双正式压消防空气呼吸器（个）
          xhpdsfbzmd: "0", //佩戴式防爆照灯（个）
          xhxfyhxq: "0", //消防员呼救器（个）,
          xhfwd: "0", //方位灯（个）
          xhxfqxaqs: "0", //消防安全绳（根）
          xhxfyf: "0", //消防腰斧（个）
          xhtxsb: "0", //通信装备（个）

          // 灭火药剂
          xhpmy: "0", //泡沫液（千克）
          xhgf: "0", //干粉（千克）
          xheyht: "0", //二氧化碳（千克）
          xhldw: "0", //卤代烷（升）
          //消防用水量情况
          zll: "0", //总流量（升/秒）
          mhys: "0", //灭火用水（吨
          lqs: "0", //冷却水（吨）
          yszl: "0", //用水总量（吨）
          gszd: "0", //供水中断（次）
          szss: "", //水渍损失
          //情况说明
          other: "" //现场人员被困人数
        },
        // 基本信息 - 带队指挥员 列表
        ddzhy: [
          {
            // 带队指挥员姓名
            zhy: "",
            // 带队指挥员职务
            zhyzw: ""
          }
        ],
        // 基本信息 - 全勤指挥部 列表
        qqzhb: [
          {
            // 全勤指挥部
            qqzhbZhcddm: "5",
            // 带队领导
            ddld: "",
            // 指挥长
            zhz: ""
          }
        ],
        // 灭火器材其他物品列表
        mhqcOther: [
          {
            content: "",
            num: "0"
          }
        ],
        // 个人装备其他物品列表
        grzbOther: [
          {
            content: "",
            num: "0"
          }
        ],
        // 灭火药剂其他物品列表
        mhyjOther: [
          {
            content: "",
            num: "0"
          }
        ],

        //联动单位
        lddw: [
          // {
          // 	lddwmc:'',//联动单位名称
          // 	belongDept:'',//所属行业部门
          // 	belongLevel:'',//联动单位所属等级
          // }
        ],

        // 政府指挥 - 各级党政领导
        gov: [
          {
            name: "", //各级党政领导 姓名
            position: "", //各级党政领导 职务
            classify: "" //所属分类
          }
        ],

        /**********************其他消防救援力量 */
        // 志愿队
        mjjyd: [
          {
            qtxfjyllFl: 2,
            qtxfjyllMc: "",
            cheSl: 0,
            tingSl: 0,
            renSl: 0,
            qtxfjyllFlBranch:""
          }
        ],
        // 专职队
        qyzzd: [
          {
            qtxfjyllFl: 3,
            qtxfjyllMc: "",
            cheSl: 0,
            tingSl: 0,
            renSl: 0,
            qtxfjyllFlBranch:""
          }
        ],

        /**********************参战人员受伤情况 */
        czryswInjured: [],
        /**********************参战人员死亡情况 */
        czryswDead: [],

        /**********************参战人员受伤 && 死亡情况合并列表 */
        czrysw: [],

        /**
         * 消防用水量情况
         */
        zll: "0", //总流量（升/秒）
        mhys: "0", //灭火用水（吨
        lqs: "0", //冷却水（吨）
        yszl: "0", //用水总量（吨）
        gszd: "0", //供水中断（次）
        szss: "1", //水渍损失
        /**
         * 现场人员被困人数
         */
        other: "", //现场人员被困人数

        /**********************出动现场照片列表 */
        imgs: []
      },
      formRules: {
        "cdxx.arriveTime": [
          {
            required: true,
            message: "首到时间不能为空",
            trigger: "blur"
          }
        ],
        "cdxx.qqzhbZhcddm": [
          {
            required: true,
            message: "全勤指挥部不能为空",
            trigger: "blur"
          }
        ],
        "cdxx.ddld": [
          {
            required: true,
            message: "带队领导不能为空",
            trigger: "blur"
          }
        ],
        "cdxx.sjlc": [
          { required: true, message: "距离现场不能为空", trigger: "blur" }
        ],
        "cdxx.dcshzqkdm": [
          {
            required: true,
            message: "到场时火灾情况不能为空",
            trigger: ["blur", "change"]
          },
          {
            validator:checkDcqk,
            trigger:["blur","change"]
          }
        ],
        "cdxx.xcrybkqkdm": [
          {
            required: true,
            message: "现场人员被困人数不能为空",
            trigger: ["blur", "change"]
          }
        ],
        "cdxx.useHydrant": [
          {
            required: true,
            message: "是否采用公用消防栓供水不能为空",
            trigger: "blur"
          }
        ],
        "cdxx.hydrantSupply": [
          {
            required: true,
            message: "公用消防栓供水情况不能为空",
            trigger: ["blur", "change"]
          }
        ],
        "cdxx.hydrantNotuse": [
          {
            required: true,
            message: "不使用公用消防栓原因不能为空",
            trigger: ["blur", "change"]
          }
        ],
        "cdxx.gdxfssyyqkdm": [
          {
            required: true,
            message: "固定消防设施使用情况不能为空",
            trigger: ["blur", "change"]
          }
        ],
        "cdxx.dredgeTime": [
          {
            required: true,
            message: "疏通时间不能为空",
            trigger: ["blur", "change"]
          }
        ],
        "cdxx.inCommander": [
          {
            required: true,
            message: "指挥员人数不能为空",
            trigger: ["change", "blur"]
          }
        ],
        "cdxx.inFireman": [
          {
            required: true,
            message: "消防员人数不能为空",
            trigger: ["change", "blur"]
          }
        ],
        "cdxx.fireEngine": [
          {
            required: true,
            message: "消防车辆信息不能为空",
            trigger: ["change", "blur"]
          }
        ],
        "cdxx.qw": [
          // { required: true, message: "气温不能为空", trigger: "blur" },
          // { required: false, validator: validateNum, trigger: "blur" },
          { required: false, validator: qwNum, trigger: "blur" },
        ],
        "cdxx.fxdm": [
          {
            required: true,
            message: "风向不能为空",
            trigger: ["blur", "change"]
          }
        ],
        "cdxx.windForce": [
          {
            required: true,
            message: "风力不能为空",
            trigger: ["blur", "change"]
          }
        ],
        "cdxx.weather": [
          {
            required: true,
            message: "天气不能为空",
            trigger: ["blur", "change"]
          }
        ],
        "cdxx.hzJzscsdm": [
          {
            required: true,
            message: "火灾技战术措施不能为空",
            trigger: ["blur", "change"]
          }
        ],
        "cdxx.qxjyJzscsdm": [
          {
            required: true,
            message: "抢险救援技战术措施不能为空",
            trigger: ["blur", "change"]
          }
        ],
        "cdxx.czjg": [
          {
            required: true,
            message: "处置（执勤）经过不能为空",
            trigger: "blur"
          }
        ],
        "cdxx.czqkdm": [
          {
            required: true,
            message: "处置情况不能为空",
            trigger: ["blur", "change"]
          }
        ],
        "cdxx.zlsj": [
          {
            required: true,
            message: "中返时间不能为空",
            trigger: "change"
          }
        ],
        "cdxx.cdsj": [
          {
            required: true,
            message: "出动时间不能为空",
            trigger: "change"
          },
          {
            validator:checkCdTime,trigger: "change"
          }
        ],
        "cdxx.dcsj": [
          {
            required: true,
            message: "到场时间不能为空",
            trigger: "blur"
          }
        ],
        "cdxx.zksj": [
          {
            required: true,
            message: "展开时间不能为空",
            trigger: "blur"
          }
        ],
        "cdxx.xmsj": [
          {
            required: true,
            message: "熄灭时间不能为空",
            trigger: "blur"
          },
          {
            validator: checkXmTime,
            trigger: "blur"
          }
        ],
        "cdxx.jssj": [
          {
            required: true,
            message: "结束时间不能为空",
            trigger: "blur"
          }
        ],
        "cdxx.clsj": [
          {
            required: true,
            message: "撤离时间不能为空",
            trigger: "blur"
          }
        ],
        "cdxx.fdsj": [
          {
            required: true,
            message: "归队时间不能为空",
            trigger: "blur"
          }
        ],
        "cdxx.qjccjz": [
          {
            required: true,
            message: "抢救财产价值不能为空",
            trigger: ["blur","change"]
          }
        ],
        "cdxx.protectPropVal": [
          {
            required: true,
            message: "保护财产价值不能为空",
            trigger: ["blur","change"]
          }
        ]
      },

      /**********************出动现场照片列表 */
      // 上传 url
      imgPostUrl: `${process.env.VUE_APP_BASE_API}${picUploadAddWatermarkUrl}`,
      // 设置请求头
      imgPostHeaders: {
        Authorization: `Bearer ${getToken()}`
      },
      uploadProcess:false,
      // 单个图片预览弹窗
      dialogVisible: false,
      dialogImageUrl: "",

      /**********************附件上传 */
      // 列表
      fileDataList: [],
      // 临时存储上传的文件
      fileData: null,
      /***************************审核组件专用 */
      propfrom: {
        // 出动编号
        cdbh: "",
        type: ""
      },

      fireTreatment: null,
      deptNatureOption: [[{
        value: '3',
        label: '专职队',
        children:[
          {
            value:'301',
            label:'城区县城政府专职消防队'
          },
          {
            value:'302',
            label:'乡镇政府专职消防队'
          },
          {
            value:'303',
            label:'企事业单位专职消防队'
          }
        ]
      }], [{
        value: '7',
        label: '志愿队',
        children: [
          {
            value:'701',
            label:'城区县城志愿消防队'
          },
          {
            value:'702',
            label:'乡镇志愿消防队'
          },
          {
            value:'703',
            label:'单位志愿消防队'
          },
          {
            value:'704',
            label:'民间志愿消防队'
          }
        ]
      }]],
    };
  },
  watch: {
    fireEngineShow() {
      this.fireEngineShow ? "" : (this.formData.cdxx.fireEngine = []);
    },
    // 动态添加 带队指挥员 列表 的必填规则
    "formData.ddzhy": {
      handler(val) {
        val.length &&
          val.forEach((element, index) => {
            this.formRules[`ddzhy.${index}.zhy`] = [
              {
                required: true,
                message: "带队指挥员姓名不能为空",
                trigger: "blur"
              }
            ];
            this.formRules[`ddzhy.${index}.zhyzw`] = [
              {
                required: true,
                message: "带队指挥员职务不能为空",
                trigger: ["blur", "change"]
              }
            ];
          });
      },
      immediate: true
    },
    // 动态添加 全勤指挥部 列表 的必填规则
    "formData.qqzhb": {
      handler(val) {
        val.length &&
          val.forEach((element, index) => {
            this.formRules[`qqzhb.${index}.ddld`] = [
              {
                required: true,
                message: "带队领导不能为空",
                trigger: "blur"
              }
            ];
            this.formRules[`qqzhb.${index}.zhz`] = [
              {
                required: true,
                message: "指挥长不能为空",
                trigger: "blur"
              }
            ];
          });
      },
      immediate: true
    },
    // 动态添加 联动单位 列表 的必填规则
    "formData.lddw": {
      handler(val) {
        val.length &&
          val.forEach((element, index) => {
            this.formRules[`lddw.${index}.lddwmc`] = [
              {
                required: true,
                message: `联动单位名称${index + 1}不能为空`,
                trigger: "blur"
              }
            ];
            this.formRules[`lddw.${index}.belongDept`] = [
              {
                required: true,
                message: "所属行业部门不能为空",
                trigger: "blur"
              }
            ];
            this.formRules[`lddw.${index}.belongLevel`] = [
              {
                required: true,
                message: "联动单位所属等级不能为空",
                trigger: "blur"
              }
            ];
          });
      },
      immediate: true
    },
    // 动态添加 受伤人员 列表 的必填规则
    "formData.czryswInjured": {
      handler(val) {
        val.length &&
          val.forEach((element, index) => {
            this.formRules[`czryswInjured.${index}.xm`] = [
              {
                required: true,
                message: "人员姓名不能为空",
                trigger: "blur"
              }
            ];
            this.formRules[`czryswInjured.${index}.sex`] = [
              {
                required: true,
                message: "人员性别不能为空",
                trigger: ["blur", "change"]
              }
            ];
            this.formRules[`czryswInjured.${index}.age`] = [
              {
                required: true,
                message: "人员年龄不能为空",
                trigger: "blur"
              }
            ];
            this.formRules[`czryswInjured.${index}.rylbdm`] = [
              {
                required: true,
                message: "人员身份不能为空",
                trigger: ["blur", "change"]
              }
            ];
            this.formRules[`czryswInjured.${index}.personalId`] = [
              {
                required: true,
                message: "身份证号不能为空",
                trigger: "blur"
              }
            ];
            this.formRules[`czryswInjured.${index}.personalCode`] = [
              {
                required: true,
                message: "人员编号不能为空",
                trigger: "blur"
              }
            ];
            this.formRules[`czryswInjured.${index}.position`] = [
              {
                required: true,
                message: "职务不能为空",
                trigger: "blur"
              }
            ];
            this.formRules[`czryswInjured.${index}.ssbwdm`] = [
              {
                required: true,
                message: "受伤部位不能为空",
                trigger: ["blur", "change"]
              }
            ];
            this.formRules[`czryswInjured.${index}.location`] = [
              {
                required: true,
                message: "事发位置不能为空",
                trigger: "blur"
              }
            ];
            this.formRules[`czryswInjured.${index}.swdddm`] = [
              {
                required: true,
                message: "事发时段不能为空",
                trigger: ["blur", "change"]
              }
            ];
            this.formRules[`czryswInjured.${index}.swyydm`] = [
              {
                required: true,
                message: "受伤原因不能为空",
                trigger: ["blur", "change"]
              }
            ];
            this.formRules[`czryswInjured.${index}.equipt`] = [
              {
                required: true,
                message: "防护装备不能为空",
                trigger: ["blur", "change"]
              }
            ];
          });
      },
      immediate: true
    },
    // 动态添加 死亡人员 列表 的必填规则
    "formData.czryswDead": {
      handler(val) {
        val.length &&
          val.forEach((element, index) => {
            this.formRules[`czryswDead.${index}.xm`] = [
              {
                required: true,
                message: "人员姓名不能为空",
                trigger: "blur"
              }
            ];
            this.formRules[`czryswDead.${index}.sex`] = [
              {
                required: true,
                message: "人员性别不能为空",
                trigger: ["blur", "change"]
              }
            ];
            this.formRules[`czryswDead.${index}.age`] = [
              {
                required: true,
                message: "人员年龄不能为空",
                trigger: "blur"
              }
            ];
            this.formRules[`czryswDead.${index}.rylbdm`] = [
              {
                required: true,
                message: "人员身份不能为空",
                trigger: ["blur", "change"]
              }
            ];
            this.formRules[`czryswDead.${index}.personalId`] = [
              {
                required: true,
                message: "身份证号不能为空",
                trigger: "blur"
              }
            ];
            this.formRules[`czryswDead.${index}.personalCode`] = [
              {
                required: true,
                message: "人员编号不能为空",
                trigger: "blur"
              }
            ];
            this.formRules[`czryswDead.${index}.position`] = [
              {
                required: true,
                message: "职务不能为空",
                trigger: "blur"
              }
            ];
            this.formRules[`czryswDead.${index}.ssbwdm`] = [
              {
                required: true,
                message: "致命伤部位不能为空",
                trigger: ["blur", "change"]
              }
            ];
            this.formRules[`czryswDead.${index}.location`] = [
              {
                required: true,
                message: "事发位置不能为空",
                trigger: "blur"
              }
            ];
            this.formRules[`czryswDead.${index}.swdddm`] = [
              {
                required: true,
                message: "事发时段不能为空",
                trigger: ["blur", "change"]
              }
            ];
            this.formRules[`czryswDead.${index}.swyydm`] = [
              {
                required: true,
                message: "死亡原因不能为空",
                trigger: ["blur", "change"]
              }
            ];
            this.formRules[`czryswDead.${index}.equipt`] = [
              {
                required: true,
                message: "防护装备不能为空",
                trigger: ["blur", "change"]
              }
            ];
            this.formRules[`czryswDead.${index}.sceneDead`] = [
              {
                required: true,
                message: "当场死亡不能为空",
                trigger: ["blur", "change"]
              }
            ];
          });
      },
      immediate: true
    }
  },
  created() {
    this.isNew = this.draft.isNew;
    // 判断是否有出动编号
    if (this.draft.cdbh) {
      this.formData.cdxx.cdbh = this.propfrom.cdbh = this.draft.cdbh;
      this.propfrom.type = this.draft.isBox; // 退回不显示审核的状态信息
      this.getJqxx();
    } else {
      this.formData.cdxx.cdbh = "";
      this.formData.cdxx.isFirstarrive = this.draft.isFirstarrive ? "Y" : "N";
      this.formData.cdxx.respondType = this.draft.respondType;
      // 警情类型
      this.formData.cdxx.sjlbdm = this.draft.sjlbdm;
      // 判断是否火灾扑救
      this.checkFireFighting(this.formData.cdxx.sjlbdm);
      // 草稿名称
      this.formData.cdxx.title = this.draft.title;
      // 判断如果有草稿箱编号，是修改页面数据
      if (this.draft.cgbh) {
        this.formData.cdxx.cgbh = this.draft.cgbh;
        this.getDispatchDraftDetails(this.formData.cdxx.cgbh);
      }
    }
    this.getDictsData();
    this.addNewInit();
    // console.log(this.draft);
    // textArea
    //处置（执勤）经过显示内容
    this.draft.respondType == "010000"
      ? (this.textArea =
          "X年X月X日X时X分，XXXX地方发生火灾，X中队共X车X人出动前往扑救，X时X分，XX中队到达现场，现场火势XXX，起火建筑为X层的XX（场所），着火楼层位于X层，着火部位位于XXX，现场水源充足/不足；X时X分，现场火势得到控制，X时X分，火灾扑灭。过火面积X平方米，燃烧物质为XXX，无（X名）人员受伤，无（X名）人员死亡。")
      : (this.textArea =
          "X年X月X日X时X分，XXXX地方发生火灾，X中队共X车X人出动前往扑救，X时X分，XX中队到达现场，现场火势XXX，中队主要负责供水/进攻/堵截东南西北侧火势蔓延。X时X分，火灾扑灭；X时X分，中队返回。");
  },
  methods: {
    errmasage(err){
      uploadProcess = false
    },
    // 判断是否火灾扑救
    checkFireFighting(sjlbdm) {
      if (sjlbdm.startsWith("01")) {
        this.isFireFighting = true;
      } else {
        checkSlightFire()
          .then(response => {
            this.isFireFighting = sjlbdm === "070400000000" && response.data;
          })
          .catch(error => {
            this.isFireFighting = false;
          });
      }
    },
    /**
     * 重置 现场照片 -  说明文字输入框的键盘删除事件
     */
    resetDeleteHandle(e) {
      if (e.keyCode === 8 || e.keyCode === 46) {
        return false;
      }
    },
    /**
     * 如果是审核的话，查询出动详情
     */
    getReviewingDetails(data) {
      this.jqxxLoading = true;
      cdxxApi
        .getReviewingDetails(data)
        .then(res => {
          let saveData = res.data;
          /***************************转换数据 */
          this.formData = this.transformPageShowData(saveData);
        })
        .finally(() => {
          this.jqxxLoading = false;
        });
    },

    /**
     * 拉取填报信息
     */
    getJqxx() {
      const $this = this;
      $this.jqxxLoading = true;
      cdxxApi
        .getJqxx(this.draft.cdbh, this.draft.useHistory)
        .then(res => {
          $this.jqxxData = res.data.jqxx || {};
          $this.formData.cdxx.isFirstarrive = res.data.cdxx.isFirstarrive
            ? "Y"
            : "N";
          $this.formData.cdxx.respondType = res.data.cdxx.respondType;
          $this.formData.cdxx.sjlbdm = res.data.cdxx.sjlbdm;
          $this.formData.cdxx.dcsj = res.data.cdxx.dcsj;
          // 判断是否火灾扑救
          this.checkFireFighting($this.formData.cdxx.sjlbdm);
          // 出动表单回填
          $this.formData = $this.transformPageShowData(res.data);
          $this.formData.cdxx.isCzrysw = $this.formData.cdxx.isCzrysw || "2"; // 参战人员伤亡情况重新赋值
          $this.formData.cdxx.fireEngine.length === 0
            ? ""
            : ($this.fireEngineShow = true);
          // 判断是否是审核
          if ($this.draft.reviewing) {
            // 添加一个退回修改的标志
            if ($this.draft.isBox == "3") {
              $this.formData.instVar.issueFlag = $this.draft.isBox;
            }
          }else {
            this.fireEngineShow = true;
          }
        })
        .catch(e => {
          this.$message.error(e);
        })
        .finally(() => {
          $this.jqxxLoading = false;
        });

      // 判断是否是审核
      if ($this.draft.reviewing) {
        $this.auditTopLoading = true;
        // 获取头部填报人信息
        getRecord({
          businessEventId: "respond." + this.draft.cdbh
        })
          .then(res => {
            if (res.code == 200) {
              let arr = res.data;
              this.tbsj = arr[0] && arr[0].startTime;
              this.deptname = arr[0] && arr[0].approveUserName;
            }
          })
          .finally(() => {
            $this.auditTopLoading = false;
          });
      }
    },
    /**
     * 如果是修改的话，查询出动草稿箱详情
     */
    getDispatchDraftDetails(data) {
      this.jqxxLoading = true;
      cdxxApi
        .getDispatchDraftDetails(data)
        .then(res => {
          let saveData = res.data;
          /***************************转换数据 */
          this.formData = this.transformPageShowData(saveData);
          this.formData.cdxx.fireEngine.length === 0
            ? ""
            : (this.fireEngineShow = true);
        })
        .finally(() => {
          this.jqxxLoading = false;
        });
    },
    /**
     * 抢救财产 监测判断
     */
    handleChange(value) {
      if (value >= 1000000) {
        this.$confirm("检测到您输入金额超过100万,请您再次确认金额?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {})
          .catch(() => {
            this.formData.cdxx.qjccjz = 0;
          });
      }
    },
    /**
     * 返回列表页面
     */
    back() {
      this.$emit("back", false);
    },
    /**
     * 联动单位
     * 1 有联动单位    无联动单位
     */
    lddw(val) {
      if (val == 2) {
        //清空数据信息
        // this.lddwNum=0;
        this.formData.lddw = [];
      } else {
        // this.lddwNum=1;
        this.formData.lddw.push({
          lddwmc: "", //联动单位名
          belongDept: "", //所属行业部门
          belongLevel: "" //联动单位所属等级
        });
      }
    },
    /**
     * 是否采用公用消防栓供水
     */
    idHydrant(val) {
      if (val === "1") {
        this.formData.cdxx.hydrantSupply = "";
      } else {
        this.formData.cdxx.hydrantNotuse = this.formData.cdxx.gdxfssyyqkdm = "";
      }
    },
    /**
     * 参战人员伤亡情况
     */
    isczryswChangeHandle(val) {
      // console.log(val);
      this.formData.czryswInjured = [];
      this.formData.czryswDead = [];
      // if (val == 1) {
      //   this.formData.czrysw.push(cdxxFnc.addSwqk());
      // } else {
      //   this.formData.czrysw = [];
      // }
    },
    /**
     * 添加减少伤员
     * name
     *    czryswInjured 受伤
     *    czryswDead 死亡
     * val Boolean
     * index 索引值
     */
    peopleLists(name, val, index) {
      if (val) {
        this.formData[name].push({ ...this[`${name}Json`] });
      } else {
        this.formData[name].splice(index, 1);
      }
    },
    /**
     * 战斗结果 - 动态计算 死亡 人数
     */
    calcDeadNum() {
      this.formData.cdxx.deadNum =
        this.formData.cdxx.rescueNum - this.formData.cdxx.shrs;
    },

    /*******************************************出动现场照片上传 */
    /**
     * 出动现场照片 上传之前验证
     */
    beforeUploadImage(file) {
      const fileType = file.name.split(".")[1];
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        this.$message.warning("上传图片大小不能超过 10MB");
        return false;
      }
      this.uploadProcess = true;
    },
    /**
     * 出动现场照片 上传成功回调
     */
    successUploadImage(response, file, fileList) {
      let { code, data } = response;
      if (code === 200) {
        this.formData.imgs.push({
          uid: file.uid, // 已上传数组的唯一标识
          name: file.name, // 文件名称(应该没啥用)
          url: `${process.env.VUE_APP_BASE_API}${response.data.avatar}`, // 图片预览展示用的url
          avatar: response.data.avatar, // 图片保存入库的url
          depict: "" // 说明文字
        });
      }else{
        this.$message.error('上传失败');
        fileList.splice(-1)
      }
      this.uploadProcess = false;
    },
    /**
     * 出动现场照片 文件点击回调
     */
    handleImagePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    /**
     * 出动现场照片 删除文件回调
     */
    handleImageRemove(file) {
      const fileIndex = this.formData.imgs.findIndex(element => {
        return element.avatar === file.avatar;
      });
      fileIndex !== -1 && this.formData.imgs.splice(fileIndex, 1);
    },

    /*******************************************附件上传 */
    uploadImport(params) {
      let { file } = params;
      this.fileData = file;
      const fileType = file.name.split(".")[1];
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        this.$message.warning("上传文件大小不能超过 10MB!");
        this.$refs.upload.clearFiles();
        return false;
      }
      this.formData.cdxx.annexName = file.name;

      this.submitUpload();
      return false; // 返回false不会自动上传
    },
    handleRemove(file, fileList) {
      this.formData.cdxx.annex = this.formData.cdxx.annexName = "";
    },
    /**
     * 相关附件 - 单个文件点击回调 下载
     */
    handlePreview(file) {
      const { url, name } = file;
      fileDownload(url, name);
    },
    submitUpload() {
      const $this = this;
      if (this.formData.cdxx.annexName == "") {
        this.$message.warning("请选择要上传的文件！");
        return false;
      }
      let fileFormData = new FormData();
      fileFormData.append("file", this.fileData);
      cdxxApi.uploadFile(fileFormData).then(res => {
        if (res.code == 200) {
          $this.formData.cdxx.annex = res.data.avatar;
          this.$message.success("文件上传成功！");
        } else {
          this.$message.warning("文件上传失败！");
        }
      });
    },

    /**
     * 初始化车辆信息
     */
    addNewInit() {
      const $this = this;
      cdxxApi.addNewInit().then(res => {
        if (res.code == 200) {
          for (let item of res.data.syscar) {
            item.carInfo = (item.carTypeName || "") + " " + item.carName;
          }
          this.syscar = res.data.syscar;
        }
      });
    },
    /**
     * 提交数据之前进行验证
     */
    commitData() {
      if(this.uploadProcess){
        this.$message.warning('请等待现场图片上传完成！');
        return;
      }
      this.$refs["writeForm"].validate(valid => {
        if (valid) {
          //校验时间范围是否符合规则
          let isRuleMessage = this.validatorDate();
          if (isRuleMessage) {
            this.$message.warning(isRuleMessage);
            return;
          }
          // 验证主要战术措施
          if (
            this.formData.cdxx.czqkdm === "03" &&
            (this.isFireFighting ||
              this.formData.cdxx.sjlbdm.substr(0, 3) === "020")
          ) {
            if (this.isFireFighting) {
              if (this.formData.cdxx.hzJzscsdm.length === 0) {
                this.$message.warning("请填写火灾技战术措施");
                return;
              }
            } else {
              if (this.formData.cdxx.qxjyJzscsdm.length === 0) {
                this.$message.warning("请填写抢险救援技战术措施");
                return;
              }
            }
          }
          // 处置情况选择中途返回或者未处置，清空战斗结果数据
          if(this.formData.cdxx.czqkdm === '01' || this.formData.cdxx.czqkdm === '02'){
            this.formData.cdxx.rescueNum = "0", //抢救（人）
            this.formData.cdxx.shrs = "0", //生还（人）
            this.formData.cdxx.deadNum = "0", //死亡（人）
            this.formData.cdxx.ssrs =  "0", //疏散（人）
            this.formData.cdxx.qjccjz = "0.00", //抢救财产（万元）
            this.formData.cdxx.protectPropVal = "0"//损耗车辆信息
          }
          /**验证人员伤亡**/
          if(this.formData.cdxx.isCzrysw == '1'){
            if(this.formData.czryswInjured.length == 0 && this.formData.czryswDead.length == 0){
              this.$message({
                showClose: true,
                message: '请填写伤亡情况',
                type: 'warning'
              });
              return;
            }
          }
          /***** 验证“其他消防救援力量” *****/
          let otherRescueForcesFormValid = true;

          // 民间救援队
          for (const mjjyd of this.formData.mjjyd) {
            if (mjjyd.qtxfjyllMc && !mjjyd.renSl) {
              mjjyd.invalid = true;
              otherRescueForcesFormValid = false;
            } else {
              mjjyd.invalid = false;
            }
          }
          // 企业专职队
          for (const qyzzd of this.formData.qyzzd) {
            if (qyzzd.qtxfjyllMc && !qyzzd.renSl) {
              qyzzd.invalid = true;
              otherRescueForcesFormValid = false;
            } else {
              qyzzd.invalid = false;
            }
          }
          this.$forceUpdate();
          if (!otherRescueForcesFormValid) {
            this.$message.warning("其他消防救援力量表单信息缺失");
            return;
          }
          // 现场照片
          if (this.formData.cdxx.czqkdm === "03") {
            if (this.formData.imgs.length === 0) {
              this.$message.warning("到场实施处置须提供现场照片");
              return;
            }
          }
          // 提交接口
          if (!this.fireEngineShow) {
            this.formData.cdxx.fireEngine = "";
          } else if (
            this.fireEngineShow &&
            this.formData.cdxx.fireEngine.length === 0
          ) {
            this.$message.warning("消防车辆信息缺失");
            return;
          }
          if(this.formData.cdxx.deadNum){
            this.$confirm(`您录入数据中有${this.formData.cdxx.deadNum}人死亡，请确认`, "提示", {
              confirmButtonText: "确认提交",
              cancelButtonText: "取消提交",
              type: "warning"
            })
              .then(() => {
                this.updateAndSendToActiviti(this.formData);
              })
              .catch(() => {
                this.$message.warning("取消提交");
              });
          }else {
            this.updateAndSendToActiviti(this.formData);
          }
        } else {
          this.$message.warning("表单信息缺失");
        }
      });
      check();
      //let isError = document.getElementsByClassName('is-error')   // 适用于element
      //isError[0].querySelector('input').focus()  // 只定位到第一个必填项位置
    },
    /**
     * 保存信息之前进行验证
     */
    preservationInfo() {
      if(this.uploadProcess){
        this.$message.warning('请等待现场图片上传完成！');
        return;
      }
      this.$refs["writeForm"].validate(valid => {
        if (valid) {
          //校验时间范围是否符合规则
          let isRuleMessage = this.validatorDate();
          if (isRuleMessage) {
            this.$message.warning(isRuleMessage);
            return;
          }
          // 单独验证主要战术措施
          if (
            this.formData.cdxx.czqkdm === "03" &&
            (this.isFireFighting ||
              this.formData.cdxx.sjlbdm.substr(0, 3) === "020")
          ) {
            if (this.isFireFighting) {
              if (this.formData.cdxx.hzJzscsdm.length === 0) {
                this.$message.warning("请填写火灾技战术措施");
                return;
              }
            } else {
              if (this.formData.cdxx.qxjyJzscsdm.length === 0) {
                this.$message.warning("请填写抢险救援技战术措施");
                return;
              }
            }
          }
          /**验证人员伤亡**/
          if(this.formData.cdxx.isCzrysw == '1'){
            if(this.formData.czryswInjured.length == 0 && this.formData.czryswDead.length == 0){
              this.$message({
                showClose: true,
                message: '请填写伤亡情况',
                type: 'warning'
              });
              return;
            }
          }
          /***** 验证“其他消防救援力量” *****/
          let otherRescueForcesFormValid = true;
          // 民间救援队
          for (const mjjyd of this.formData.mjjyd) {
            if (mjjyd.qtxfjyllMc && !mjjyd.renSl) {
              mjjyd.invalid = true;
              otherRescueForcesFormValid = false;
            } else {
              mjjyd.invalid = false;
            }
          }
          // 企业专职队
          for (const qyzzd of this.formData.qyzzd) {
            if (qyzzd.qtxfjyllMc && !qyzzd.renSl) {
              qyzzd.invalid = true;
              otherRescueForcesFormValid = false;
            } else {
              qyzzd.invalid = false;
            }
          }
          this.$forceUpdate();
          if (!otherRescueForcesFormValid) {
            this.$message.warning("其他消防救援力量表单信息缺失");
            return;
          }
          // 判断是修改还是新增
          if (this.draft.cgbh) {
            // 修改
            this.modifyDraft();
          } else {
            // 新增
            this.addNewDraft();
            this.fillingStatistic();
          }
        } else {
          this.$message.warning("表单信息缺失");
        }
      });
    },
    /**
     * 转换一些修改页面需要的数据
     */
    transformPageShowData(saveData) {
      // 修复 el-input-number 会将 "" 或者 null 转换为 0 的 bug
      saveData.cdxx.qw = saveData.cdxx.qw || undefined;
      //出动审核特殊处理
      if(this.$route.path!=='/data/aduit/cdxx'){
        saveData.cdxx.protectPropVal = saveData.cdxx.protectPropVal || undefined;
        saveData.cdxx.qjccjz = Math.floor(saveData.cdxx.qjccjz) || undefined;
      }


      // 逗号分隔的字符串转换为页面使用的数组，还有需要转换为 number 的
      saveData.cdxx.damageEngine = saveData.cdxx.damageEngine
        ? saveData.cdxx.damageEngine.split(",").map(element => {
            return element * 1;
          })
        : [];
      saveData.cdxx.fireEngine = saveData.cdxx.fireEngine
        ? saveData.cdxx.fireEngine.split(",").map(element => {
            return element * 1;
          })
        : [];
      saveData.cdxx.hzJzscsdm = saveData.cdxx.hzJzscsdm
        ? saveData.cdxx.hzJzscsdm.split(",")
        : [];
      saveData.cdxx.qxjyJzscsdm = saveData.cdxx.qxjyJzscsdm
        ? saveData.cdxx.qxjyJzscsdm.split(",")
        : [];

      // 需要设置默认值的数组字段

      // 基本信息 - 带队指挥员 列表
      !saveData.ddzhy.length &&
        (saveData.ddzhy = [
          {
            // 带队指挥员姓名
            zhy: "",
            // 带队指挥员职务
            zhyzw: ""
          }
        ]);
      // 基本信息 - 全勤指挥部 列表
      !saveData.qqzhb.length &&
        (saveData.qqzhb = [
          {
            // 全勤指挥部
            qqzhbZhcddm: "5",
            // 带队领导
            ddld: "",
            // 指挥长
            zhz: ""
          }
        ]);
      // 灭火器材其他物品列表
      !saveData.mhqcOther.length &&
        (saveData.mhqcOther = [
          {
            content: "",
            num: "0"
          }
        ]);
      // 个人装备其他物品列表
      !saveData.grzbOther.length &&
        (saveData.grzbOther = [
          {
            content: "",
            num: "0"
          }
        ]);
      // 灭火药剂其他物品列表
      !saveData.mhyjOther.length &&
        (saveData.mhyjOther = [
          {
            content: "",
            num: "0"
          }
        ]);
      // 政府指挥 - 各级党政领导
      !saveData.gov.length &&
        (saveData.gov = [
          {
            name: "", //各级党政领导 姓名
            position: "", //各级党政领导 职务
            classify: "" //所属分类
          }
        ]);
      // 民间救援队名称
      !saveData.mjjyd.length &&
        (saveData.mjjyd = [
          {
            qtxfjyllFl: 2,
            qtxfjyllMc: "",
            cheSl: 0,
            tingSl: 0,
            renSl: 0
          }
        ]);
      // 企业专职队名称
      !saveData.qyzzd.length &&
        (saveData.qyzzd = [
          {
            qtxfjyllFl: 3,
            qtxfjyllMc: "",
            cheSl: 0,
            tingSl: 0,
            renSl: 0
          }
        ]);

      // 需要手动赋值的字段
      saveData.imgs.forEach(element => {
        element.url = `${process.env.VUE_APP_FTP_API + element.avatar}`;
      });
      saveData.cdxx.annex &&
        this.fileDataList.push({
          url: `${process.env.VUE_APP_FTP_API + saveData.cdxx.annex}`,
          name: saveData.cdxx.annexName
        });

      // 审核专用
      if (this.draft.reviewing) {
        const dictionary = {
          一级: "1",
          二级: "2",
          三级: "3",
          四级: "4",
          五级: "5"
        };
        // 审核意见
        saveData.comment = "";
        saveData.instVar = {
          // 终止
          isEnd: false,
          // true：核查通过；false：退回；
          flag: true,
          level: this.jqxxData.jqdj ? dictionary[this.jqxxData.jqdj] || "" : "",
          // 用处未知
          hasNull: false
        };
      }
      return saveData;
    },

    /**
     * 转换一些需要提交的数据
     */
    transformPostData() {
      // 需要手动计算的字段
      this.formData.cdxx.carCount = this.formData.cdxx.fireEngine.length;
      this.formData.cdxx.trrys =
        (this.formData.cdxx.inCommander || 0) +
        (this.formData.cdxx.inFireman || 0);

      this.formData.czrysw = this.formData.czryswInjured.concat(
        this.formData.czryswDead
      );

      // 页面使用的数组转换为逗号分隔的字符串
      this.formData.cdxx.damageEngine = this.formData.cdxx.damageEngine.join(
        ","
      );
      this.formData.cdxx.fireEngine = !this.fireEngineShow
        ? ""
        : this.formData.cdxx.fireEngine.join(",");
      this.formData.cdxx.hzJzscsdm = this.formData.cdxx.hzJzscsdm.join(",");
      this.formData.cdxx.qxjyJzscsdm = this.formData.cdxx.qxjyJzscsdm.join(",");
    },

    /**
     * 保存信息 - 修改草稿
     */
    modifyDraft() {
      this.transformPostData();
      this.jqxxLoading = true;
      cdxxApi
        .updateDraft(this.formData)
        .then(res => {
          if (res.code == 200) {
            this.$message({
              showClose: true,
              message: res.msg,
              type: "success"
            });
            this.$emit("back", false);
          }
        })
        .finally(() => {
          this.jqxxLoading = false;
        });
    },

    /**
     * 保存信息 - 新增草稿
     */
    addNewDraft() {
      this.transformPostData();
      this.jqxxLoading = true;
      cdxxApi
        .addNewDraft(this.formData)
        .then(res => {
          if (res.code == 200) {
            this.$message({
              showClose: true,
              message: res.msg,
              type: "success"
            });
            this.$emit("back", false);
          }
        })
        .finally(() => {
          this.jqxxLoading = false;
        });
    },

    /**
     * 提交数据
     */
    updateAndSendToActiviti(data) {
      this.transformPostData();
      this.jqxxLoading = true;
      // 判断是 审核提交 还是 待填报清单 填报 提交
      if (this.draft.reviewing) {
        cdxxApi
          .changeAuditInfo(data)
          .then(res => {
            if (res.code == 200) {
              this.$message({
                showClose: true,
                message: res.msg,
                type: "success"
              });
              this.$emit("back", false);
            }
          })
          .finally(() => {
            this.formData = this.transformPageShowData(data);
            this.jqxxLoading = false;
          });
      } else {
        this.fillingStatistic(); // 填报完成度统计
        cdxxApi
          .updateAndSendToActiviti(data)
          .then(res => {
            if (res.code == 200) {
              this.$message({
                showClose: true,
                message: res.msg,
                type: "success"
              });
              this.back();
              // 新需求：出动填报后跳转到已录出动，直接跳转 2019.12.26
              this.$router.push({
                path: "/data/entry/lscdxx"
              });
            }
          })
          .finally(() => {
            this.formData = this.transformPageShowData(data);
            this.jqxxLoading = false;
          });
      }
    },
    /**
     *
     */
    changeCzqk(val) {
      // 所有时间全部清空
      this.formData.cdxx.zlsj = this.formData.cdxx.cdsj = this.formData.cdxx.dcsj = this.formData.cdxx.zksj = this.formData.cdxx.cssj = this.formData.cdxx.kzsj = this.formData.cdxx.xmsj = this.formData.cdxx.xxsj = this.formData.cdxx.jssj = this.formData.cdxx.clsj = this.formData.cdxx.fdsj =
        "";
      switch (val) {
        case '01':
          this.formData.cdxx.dcshzqkdm = '';  //到场时火灾情况
          this.formData.imgs = [];  //出动照片
          this.formData.cdxx.xcrybkqkdm = undefined; //现场人员被困人数
          this.formData.cdxx.useHydrant = 0; //是否采用公用消防栓供水
          this.formData.cdxx.hydrantSupply = ''; //公用消防栓供水情况
          this.formData.cdxx.hydrantNotuse = ''; //不使用公用消防栓原因
          this.formData.cdxx.insideAttack = null; //内攻情况
          this.formData.cdxx.hzJzscsdm = []; //火灾技战术措施
          this.formData.cdxx.qxjyJzscsdm = []; //抢险救援技战术措施
          this.formData.cdxx.czjg = ''; //处置（执勤）经过
          this.formData.cdxx.rescueNum = '';//抢救（人）
          this.formData.cdxx.shrs = '';//生还（人）
          this.formData.cdxx.deadNum = '';//死亡（人）
          this.formData.cdxx.ssrs = '';//疏散（人）
          this.formData.cdxx.qjccjz = '';//抢救财产（元）
          this.formData.cdxx.protectPropVal = '';//保护财产价值（元）
          this.formData.cdxx.weather = '';//天气
          break;
        case '02':
          this.formData.cdxx.xcrybkqkdm = undefined; //现场人员被困人数
          this.formData.cdxx.useHydrant = 0; //是否采用公用消防栓供水
          this.formData.cdxx.hydrantSupply = ''; //公用消防栓供水情况
          this.formData.cdxx.hydrantNotuse = ''; //不使用公用消防栓原因
          this.formData.cdxx.insideAttack = null; //内攻情况
          this.formData.cdxx.hzJzscsdm = []; //火灾技战术措施
          this.formData.cdxx.qxjyJzscsdm = []; //抢险救援技战术措施
          this.formData.cdxx.czjg = ''; //处置（执勤）经过
          this.formData.cdxx.rescueNum = '';//抢救（人）
          this.formData.cdxx.shrs = '';//生还（人）
          this.formData.cdxx.deadNum = '';//死亡（人）
          this.formData.cdxx.ssrs = '';//疏散（人）
          this.formData.cdxx.qjccjz = '';//抢救财产（元）
          this.formData.cdxx.protectPropVal = '';//保护财产价值（元）
          break;
        case '03':
          break;
      }
    },
    /**
     * 带队指挥员 列表 增删
     * val Boolean
     * index 索引值
     */
    ddzhyAddOrRemove(val, index) {
      if (val) {
        this.formData.ddzhy.push({
          // 带队指挥员姓名
          zhy: "",
          // 带队指挥员职务
          zhyzw: ""
        });
      } else {
        this.formData.ddzhy.splice(index, 1);
      }
    },
    /**
     * 全勤指挥部 列表 增删
     * val Boolean
     * index 索引值
     */
    qqzhbAddOrRemove(val, index) {
      if (val) {
        this.formData.qqzhb.push({
          // 全勤指挥部
          qqzhbZhcddm: "5",
          // 带队领导
          ddld: "",
          // 指挥长
          zhz: ""
        });
      } else {
        this.formData.qqzhb.splice(index, 1);
      }
    },
    /**
     * 移除联动单位 增删
     * val Boolean
     * index 索引值
     */
    lddwNums(val, index) {
      if (val) {
        this.formData.lddw.push({
          lddwmc: "",
          belongDept: "",
          belongLevel: ""
        });
      } else {
        this.formData.lddw.splice(index, 1);
      }
    },
    /**
     * 政府指挥 - 各级党政领导 增删
     * val Boolean
     * index 索引值
     */
    zfzhNums(val, index) {
      if (val) {
        this.formData.gov.push({
          name: "",
          position: "",
          classify: ""
        });
      } else {
        this.formData.gov.splice(index, 1);
      }
    },
    /**
     * 其他消防救援力量 增删
     * name
     *    mjjyd 民间救援队名称
     *    qyzzd 企业专职队名称
     * val Boolean
     * index 索引值
     */
    otherRescueForces(name, val, index) {
      const dictionary = {
        mjjyd: 2,
        qyzzd: 3
      };
      if (val) {
        this.formData[name].push({
          qtxfjyllFl: dictionary[name],
          qtxfjyllMc: "",
          cheSl: 0,
          tingSl: 0,
          renSl: 0
        });
      } else {
        this.formData[name].splice(index, 1);
      }
    },
    // 校验其他消防救援力量
    validateOtherRescueForcesFormItem(item) {
      if (item.qtxfjyllMc&&item.qtxfjyllFlBranch) {
        item.invalid = !item.renSl;
      } else {
        item.invalid = false;
      }
      this.$forceUpdate();
    },
    /**
     * 消耗用品 增删
     * name
     * val
     * index 索引值
     */
    xhypNum(name, val, index) {
      if (val) {
        this.formData[name].push({ content: "", num: 0 });
      } else {
        this.formData[name].splice(index, 1);
      }
    },
    /**
     * 获取下拉框信息
     */
    getDictsData() {
      //全勤指挥部
      this.getDicts("tb_dic_xczh").then(res => {
        if (res.code == 200) {
          this.xczh = res.data;
        } else {
          this.xczh = [];
        }
      });

      //获取带队指挥职务
      this.getDicts("tb_dic_ddzhzw").then(res => {
        if (res.code == 200) {
          this.dicDdzhzw = res.data;
        } else {
          this.dicDdzhzw = [];
        }
      });
      //获取风向信息
      this.getDicts("tb_dic_fx").then(res => {
        if (res.code == 200) {
          this.dicFx = res.data;
        } else {
          this.dicFx = [];
        }
      });
      //行业主管部门
      this.getDicts("tb_dic_hyzgbm").then(res => {
        if (res.code == 200) {
          this.dicHyzgbm = res.data;
        } else {
          this.dicHyzgbm = [];
        }
      });
      //政府领导指挥出动
      this.getDicts("tb_dic_ldzhcd").then(res => {
        if (res.code == 200) {
          this.dicLdzhcd = res.data;
        } else {
          this.dicLdzhcd = [];
        }
      });
      //火灾技战术措施
      this.getDicts("tb_dic_hzjzscs").then(res => {
        if (res.code == 200) {
          this.dicHzjzscs = res.data;
        } else {
          this.dicHzjzscs = [];
        }
      });
      //抢险救援技战术措施
      this.getDicts("tb_dic_qxjyjzscs").then(res => {
        if (res.code == 200) {
          this.dicQxjyjzscs = res.data;
        } else {
          this.dicQxjyjzscs = [];
        }
      });
      //处置情况
      this.getDicts("tb_dic_czqk").then(res => {
        if (res.code == 200) {
          this.dicCzqk = res.data;
          console.log(this.tableRow, 'sjlbdm')
          console.log(this.dicCzqk,456)
          if (this.tableRow === '070100000000') {
            this.dicCzqk.forEach((e, i) => {
              if (e.dictCode === 95) {
                // console.log(i, '下标')
                this.dicCzqk.splice(-1, i)
              }
            })
          }
        } else {
          this.dicCzqk = [];
        }
      });
      //火灾情况
      this.getDicts("tb_dic_hzqk").then(res => {
        if (res.code == 200) {
          this.dicHzqk = res.data;
        } else {
          this.dicHzqk = [];
        }
      });
      //公共消火栓使用情况
      this.getDicts("tb_dic_ggxhs").then(res => {
        if (res.code == 200) {
          this.dicGgxhs = res.data;
        } else {
          this.dicGgxhs = [];
        }
      });
      //不使用公用消防栓原因
      this.getDicts("tb_dic_bsyyy").then(res => {
        if (res.code == 200) {
          this.dicBsyyy = res.data;
        } else {
          this.dicBsyyy = [];
        }
      });
      //固定消防设施使用情况
      this.getDicts("tb_dic_gdxfss").then(res => {
        if (res.code == 200) {
          this.dicGdxfss = res.data;
        } else {
          this.dicGdxfss = [];
        }
      });
      //车辆类型（地方救援）
      this.getDicts("tb_dic_dfjycllx").then(res => {
        if (res.code == 200) {
          this.dicDfjycllx = res.data;
        } else {
          this.dicDfjycllx = [];
        }
      });
      //人员身份
      this.getDicts("tb_dic_rysfxx").then(res => {
        if (res.code == 200) {
          this.dicRysfxx = res.data;
        } else {
          this.dicRysfxx = [];
        }
      });
      //用户性别
      this.getDicts("sys_user_sex").then(res => {
        if (res.code == 200) {
          this.userSex = res.data;
        } else {
          this.userSex = [];
        }
      });
      //人员年龄
      this.getDicts("tb_dic_rynl").then(res => {
        if (res.code == 200) {
          this.dicRynl = res.data;
        } else {
          this.dicRynl = [];
        }
      });
      //受伤部位
      this.getDicts("tb_dic_ssbw").then(res => {
        if (res.code == 200) {
          this.dicSsbw = res.data;
        } else {
          this.dicSsbw = [];
        }
      });
      //事发位置
      this.getDicts("tb_dic_swdd").then(res => {
        if (res.code == 200) {
          this.dicSwdd = res.data;
        } else {
          this.dicSwdd = [];
        }
      });
      //伤亡原因
      this.getDicts("tb_dic_swyy").then(res => {
        if (res.code == 200) {
          this.dicSwyy = res.data;
        } else {
          this.dicSwyy = [];
        }
      });
      //防护装备
      this.getDicts("tb_dic_fhzb").then(res => {
        if (res.code == 200) {
          this.dicFhzb = res.data;
        } else {
          this.dicFhzb = [];
        }
      });
      //水渍损失
      this.getDicts("tb_dic_szss").then(res => {
        if (res.code == 200) {
          this.dicSzss = res.data;
        } else {
          this.dicSzss = [];
        }
      });
      //行业部门
      this.getDicts("tb_dic_hybm").then(res => {
        if (res.code == 200) {
          this.dicHybm = res.data;
        } else {
          this.dicHybm = [];
        }
      });
      //所属等级
      this.getDicts("tb_dic_ssdj").then(res => {
        if (res.code == 200) {
          this.dicSsdj = res.data;
        } else {
          this.dicSsdj = [];
        }
      });
      // 天气
      this.getDicts("tb_dic_qh").then(res => {
        if (res.code == 200) {
          this.qihou = res.data;
        } else {
          this.qihou = [];
        }
      });
    },

    /**
     * 获取审核数据
     */
    auditData({ comment, isEnd, flag }) {
      // console.log(comment, isEnd, flag);
      // 审核意见
      this.formData.comment = comment;
      // 终止
      this.formData.instVar.isEnd = isEnd;
      // true：核查通过；false：退回；
      this.formData.instVar.flag = flag;
    },
    // 校验身份证
    validatorCdCard(value, index, flag) {
      // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
      var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (!reg.test(value)) {
        this.$message.warning("请输入正确的身份证号");
        if (flag == "czryswInjured") {
          this.formData.czryswInjured[index].personalId = "";
        } else if (flag == "czryswDead") {
          this.formData.czryswDead[index].personalId = "";
        }
      }
    },
    // 处置情况校验时间范围
    validatorDate() {
      let self = this;
      let {
        cdsj,
        dcsj,
        zlsj,
        zksj,
        cssj,
        kzsj,
        xmsj,
        xxsj,
        jssj,
        clsj,
        fdsj,
        czqkdm
      } = self.formData.cdxx;
      if (czqkdm == "01") {
        //处置情况选择中途返回，出动/指令/归队时间
        let cdsjGetTime = new Date(cdsj).getTime();
        let zlsjGetTime = new Date(zlsj).getTime();
        let fdsjGetTime = new Date(fdsj).getTime();
        let initTime = new Date("2019-01-01").getTime();
        if (cdsjGetTime > zlsjGetTime) {
          return "出动时间不能大于中返时间";
        }
        if (zlsjGetTime > fdsjGetTime) {
          return "中返时间不能大于归队时间";
        }
        if(this.jqxxData){
          let jjsjGetTime = new Date(this.jqxxData.jjsj).getTime();
          if(cdsjGetTime < jjsjGetTime) {
            return "出动时间不能小于接警时间";
          }
        }
        if (cdsjGetTime < initTime || zlsjGetTime < initTime || fdsjGetTime < initTime){
          return "时间格式错误";
        }
      } else if (czqkdm == "02") {
        //处置情况选择到场未实施处置，出动/到场/撤离/归队时间
        let cdsjGetTime = new Date(cdsj).getTime();
        let dcsjGetTime = new Date(dcsj).getTime();
        let clsjGetTime = new Date(clsj).getTime();
        let fdsjGetTime = new Date(fdsj).getTime();
        let initTime = new Date("2019-01-01").getTime();
        if (cdsjGetTime > dcsjGetTime) {
          return "出动时间不能大于到场时间";
        }
        if (dcsjGetTime > clsjGetTime) {
          return "到场时间不能大于撤离时间";
        }
        if (clsjGetTime > fdsjGetTime) {
          return "撤离时间不能大于归队时间";
        }
        if (cdsjGetTime < initTime || dcsjGetTime < initTime || clsjGetTime < initTime) {
            return "时间格式错误";
        }
        if (this.jqxxData){
          let jjsjGetTime = new Date(this.jqxxData.jjsj).getTime();
          if(cdsjGetTime < jjsjGetTime) {
            return "出动时间不能小于接警时间";
          }
        }
      } else if (czqkdm == "03") {
        //处置情况选择到场未实施处置，出动/到场/(展开)/(出水)/(控制)/熄灭或者洗消/结束/撤离/归队时间
        //- 处置情况 为 "到场实施处置" 且 警情类型为 火灾扑救 时才显示熄灭时间formData.cdxx.sjlbdm=='010000000000'"
        //- 处置情况 为 "到场实施处置" 且 警情类型为 抢险救援/危险化学品事故 时才显示洗消时间formData.cdxx.sjlbdm.substr(0,3) === '020'
        let cdsjGetTime = new Date(cdsj).getTime();
        let dcsjGetTime = new Date(dcsj).getTime();
        let jssjGetTime = new Date(jssj).getTime();
        let clsjGetTime = new Date(clsj).getTime();
        let fdsjGetTime = new Date(fdsj).getTime();
        let initTime = new Date("2019-01-01").getTime();
        if (cdsjGetTime > dcsjGetTime) {
          return "出动时间不能大于到场时间";
        }
        if(cdsjGetTime > jssjGetTime){
          return "出动时间不能大于结束时间";
        }
        if(cdsjGetTime < initTime || dcsjGetTime < initTime || jssjGetTime < initTime || clsjGetTime < initTime || fdsjGetTime < initTime){
          return "时间格式错误";
        }
        if (this.jqxxData){
          let jjsjGetTime = new Date(this.jqxxData.jjsj).getTime();
          let kzsjGetTime = new Date(kzsj).getTime();
          if(cdsjGetTime < jjsjGetTime) {
            return "出动时间不能小于接警时间";
          }
          if(this.isFireFighting && kzsjGetTime){
            if(kzsjGetTime < jjsjGetTime){
              return "控制时间不能小于接警时间";
            }
          }
        }
        if (this.isFireFighting) {
          let xmsjGetTime = new Date(xmsj).getTime();
          /*if (dcsjGetTime > xmsjGetTime) {
              return "到场时间不能大于熄灭时间";
            }*/
        } else if (self.formData.cdxx.sjlbdm.substr(0, 3) == "020") {
          //是否选择洗消时间
          if (xxsj) {
            let xxsjGetTime = new Date(xxsj).getTime();
            if (dcsjGetTime > xxsjGetTime) {
              return "到场时间不能大于洗消时间";
            }
            // if (xxsjGetTime > jssjGetTime) {
            // 	return "洗消时间不能大于结束时间";
            // }
          } else {
            if (dcsjGetTime > jssjGetTime) {
              return "到场时间不能大于结束时间";
            }
          }
        } else {
          if (dcsjGetTime > jssjGetTime) {
            return "到场时间不能大于结束时间";
          }
        }
        if (jssjGetTime > clsjGetTime) {
          return "结束时间不能大于撤离时间";
        }
        if (clsjGetTime > fdsjGetTime) {
          return "撤离时间不能大于归队时间";
        }
        //(展开)/(出水)/(控制)非必填项是否选择 判断
        if (zksj && cssj && kzsj) {
          //(展开)/(出水)/(控制)
          let zksjGetTime = new Date(zksj).getTime();
          let cssjGetTime = new Date(cssj).getTime();
          let kzsjGetTime = new Date(kzsj).getTime();
          if (dcsjGetTime > zksjGetTime) {
            return "到场时间不能大于展开时间";
          }
          if (zksjGetTime > cssjGetTime) {
            return "展开时间不能大于出水时间";
          }
          if (cssjGetTime > kzsjGetTime) {
            return "出水时间不能大于控制时间";
          }
          if (this.isFireFighting) {
            let xmsjGetTime = new Date(xmsj).getTime();
            /*if (kzsjGetTime > xmsjGetTime) {
                return "控制时间不能大于熄灭时间";
              }*/
          } else if (self.formData.cdxx.sjlbdm.substr(0, 3) == "020") {
            //是否选择洗消时间
            if (xxsj) {
              let xxsjGetTime = new Date(xxsj).getTime();
              if (kzsjGetTime > xxsjGetTime) {
                return "控制时间不能大于洗消时间";
              }
            } else {
              if (kzsjGetTime > jssjGetTime) {
                return "控制时间不能大于结束时间";
              }
            }
          } else {
            if (kzsjGetTime > jssjGetTime) {
              return "控制时间不能大于结束时间";
            }
          }
        } else if (zksj && cssj && !kzsj) {
          //(展开)/(出水)
          let zksjGetTime = new Date(zksj).getTime();
          let cssjGetTime = new Date(cssj).getTime();
          if (dcsjGetTime > zksjGetTime) {
            return "到场时间不能大于展开时间";
          }
          if (zksjGetTime > cssjGetTime) {
            return "展开时间不能大于出水时间";
          }
          if (this.isFireFighting) {
            let xmsjGetTime = new Date(xmsj).getTime();
            /*if (cssjGetTime > xmsjGetTime) {
                return "出水时间不能大于熄灭时间";
              }*/
          } else if (self.formData.cdxx.sjlbdm.substr(0, 3) == "020") {
            //是否选择洗消时间
            if (xxsj) {
              let xxsjGetTime = new Date(xxsj).getTime();
              if (cssjGetTime > xxsjGetTime) {
                return "出水时间不能大于洗消时间";
              }
            } else {
              if (cssjGetTime > jssjGetTime) {
                return "出水时间不能大于结束时间";
              }
            }
          } else {
            if (cssjGetTime > jssjGetTime) {
              return "出水时间不能大于结束时间";
            }
          }
        } else if (cssj && kzsj && !zksj) {
          //(出水)/(控制)
          let cssjGetTime = new Date(cssj).getTime();
          let kzsjGetTime = new Date(kzsj).getTime();
          if (dcsjGetTime > cssjGetTime) {
            return "到场时间不能大于出水时间";
          }
          if (cssjGetTime > kzsjGetTime) {
            return "出水时间不能大于控制时间";
          }
          if (this.isFireFighting) {
            let xmsjGetTime = new Date(xmsj).getTime();
            /*if (kzsjGetTime > xmsjGetTime) {
                return "控制时间不能大于熄灭时间";
              }*/
          } else if (self.formData.cdxx.sjlbdm.substr(0, 3) == "020") {
            //是否选择洗消时间
            if (xxsj) {
              let xxsjGetTime = new Date(xxsj).getTime();
              if (kzsjGetTime > xxsjGetTime) {
                return "控制时间不能大于洗消时间";
              }
            } else {
              if (kzsjGetTime > jssjGetTime) {
                return "控制时间不能大于结束时间";
              }
            }
          } else {
            if (kzsjGetTime > jssjGetTime) {
              return "控制时间不能大于结束时间";
            }
          }
        } else if (zksj && kzsj && !cssj) {
          //(展开)/(控制)
          let zksjGetTime = new Date(zksj).getTime();
          let kzsjGetTime = new Date(kzsj).getTime();
          if (dcsjGetTime > zksjGetTime) {
            return "到场时间不能大于展开时间";
          }
          if (zksjGetTime > kzsjGetTime) {
            return "展开时间不能大于控制时间";
          }
          if (this.isFireFighting) {
            let xmsjGetTime = new Date(xmsj).getTime();
            /*if (kzsjGetTime > xmsjGetTime) {
                return "控制时间不能大于熄灭时间";
              }*/
          } else if (self.formData.cdxx.sjlbdm.substr(0, 3) == "020") {
            //是否选择洗消时间
            if (xxsj) {
              let xxsjGetTime = new Date(xxsj).getTime();
              if (kzsjGetTime > xxsjGetTime) {
                return "控制时间不能大于洗消时间";
              }
            } else {
              if (kzsjGetTime > jssjGetTime) {
                return "控制时间不能大于结束时间";
              }
            }
          } else {
            if (kzsjGetTime > jssjGetTime) {
              return "控制时间不能大于结束时间";
            }
          }
        } else if (zksj && !cssj && !kzsj) {
          //(展开)
          let zksjGetTime = new Date(zksj).getTime();
          if (dcsjGetTime > zksjGetTime) {
            return "到场时间不能大于展开时间";
          }
          if (this.isFireFighting) {
            let xmsjGetTime = new Date(xmsj).getTime();
            /*if (zksjGetTime > xmsjGetTime) {
                return "展开时间不能大于熄灭时间";
              }*/
          } else if (self.formData.cdxx.sjlbdm.substr(0, 3) == "020") {
            //是否选择洗消时间
            if (xxsj) {
              let xxsjGetTime = new Date(xxsj).getTime();
              if (zksjGetTime > xxsjGetTime) {
                return "展开时间不能大于洗消时间";
              }
            } else {
              if (zksjGetTime > jssjGetTime) {
                return "展开时间不能大于结束时间";
              }
            }
          } else {
            if (zksjGetTime > jssjGetTime) {
              return "展开时间不能大于结束时间";
            }
          }
        } else if (!zksj && cssj && !kzsj) {
          //(出水)
          let cssjGetTime = new Date(cssj).getTime();
          if (dcsjGetTime > cssjGetTime) {
            return "到场时间不能大于出水时间";
          }
          if (this.isFireFighting) {
            let xmsjGetTime = new Date(xmsj).getTime();
            /*if (cssjGetTime > xmsjGetTime) {
                return "出水时间不能大于熄灭时间";
              }*/
          } else if (self.formData.cdxx.sjlbdm.substr(0, 3) == "020") {
            //是否选择洗消时间
            if (xxsj) {
              let xxsjGetTime = new Date(xxsj).getTime();
              if (cssjGetTime > xxsjGetTime) {
                return "出水时间不能大于洗消时间";
              }
            } else {
              if (cssjGetTime > jssjGetTime) {
                return "出水时间不能大于结束时间";
              }
            }
          } else {
            if (cssjGetTime > jssjGetTime) {
              return "出水时间不能大于结束时间";
            }
          }
        } else if (!zksj && !cssj && kzsj) {
          //(控制)
          let kzsjGetTime = new Date(kzsj).getTime();
          if (dcsjGetTime > kzsjGetTime) {
            return "到场时间不能大于控制时间";
          }
          if (this.isFireFighting) {
            let xmsjGetTime = new Date(xmsj).getTime();
            /*if (kzsjGetTime > xmsjGetTime) {
                return "控制时间不能大于熄灭时间";
              }*/
          } else if (self.formData.cdxx.sjlbdm.substr(0, 3) == "020") {
            //是否选择洗消时间
            if (xxsj) {
              let xxsjGetTime = new Date(xxsj).getTime();
              if (kzsjGetTime > xxsjGetTime) {
                return "控制时间不能大于洗消时间";
              }
            } else {
              if (kzsjGetTime > jssjGetTime) {
                return "控制时间不能大于结束时间";
              }
            }
          } else {
            if (kzsjGetTime > jssjGetTime) {
              return "控制时间不能大于结束时间";
            }
          }
        }
        // else if (!zksj && !kzsj && !cssj){
        // 	//全空
        // 	return false;
        // }
      }
    },
    // 统计表单填报情况
    fillingStatistic() {
      /*** 获取input和textarea元素 ***/
      const formEl = document.getElementById("dispatchForm");
      const inputs = formEl.getElementsByTagName("input");
      const textareas = formEl.getElementsByTagName("textarea");
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
        if (inputs[i].className.includes("el-radio__original")) {
          radioNum++;
          if (inputs[i].checked) {
            checkedRadioNum++;
          }
        }
      }
      // 总表单项数量应减去radio数量的一半 (2个radio是一个表单项)
      totalFormItemNum = totalFormItemNum - radioNum / 2;
      // 已填报的表单项数量应减去radio数量再加上已勾选的radio数量
      filledCount = filledCount - radioNum + checkedRadioNum;

      /**
       * 处理多选控件
       * 多选控件无论是否已选value都没有值
       * 需要校验表单数据中的字段值是否为空
       * 注意控件的联动情况
       */
      // 出动车辆
      if (this.formData.cdxx.fireEngine) {
        filledCount++;
      }
      // 损耗车辆
      if (this.formData.cdxx.damageEngine) {
        filledCount++;
      }
      // 火灾技战术措施 - 处置情况为到场实施处置且警情类型为火灾扑救时校验表单字段
      if (this.formData.cdxx.czqkdm === "03" && this.isFireFighting) {
        if (this.formData.cdxx.hzJzscsdm) {
          filledCount++;
        }
      }
      // 抢险救援技战术措施 - 处置情况为到场实施处置且警情类型为抢险救援时校验表单字段
      if (
        this.formData.cdxx.czqkdm === "03" &&
        this.formData.cdxx.sjlbdm.substr(0, 3) === "020"
      ) {
        if (this.formData.cdxx.qxjyJzscsdm) {
          filledCount++;
        }
      }

      /**
       * 处理照片上传表单项
       * 判断控件的联动状态
       * 当控件被激活时只要上传了一张照片即认为该表单项已填
       * 照片的说明文字不计入统计，需要额外减少数量
       */
      // 处置情况不为中途返回时照片上传控件激活
      if (this.formData.cdxx.czqkdm !== "01") {
        if (this.formData.imgs.length > 0) {
          filledCount++;
        }
        // 对照片的说明文字进行处理
        this.formData.imgs.map(img => {
          totalFormItemNum--;
          // 照片说明文字有值时会被统计为已填表单项，也需要减掉
          if (img.depict) {
            filledCount--;
          }
        });
      }

      /**
       * 处理附件上传
       */
      if (this.formData.cdxx.annex) {
        filledCount++;
      }

      this.jqxxLoading = false;
      let initTime = formatterDate(new Date(), "YYYYMMDD");
      let params = {
        zqbh: "",
        cdbh: this.formData.cdxx.cdbh,
        createTime: initTime,
        fillOptional: 0,
        fillRate: 0,
        fillReport: filledCount,
        id: 0,
        jqbh: this.jqxxData.jqbh,
        pageName: "ReportingPolice",
        remark: "",
        reportType: "C",
        tbzh: this.deptname,
        totalOptional: 0,
        totalReport: totalFormItemNum,
        totalRequire: 0,
        unfillReport: 0,
        updateTime: initTime
      };
      repprtFill(params)
        .then(response => {
          if (response.code == "200") {
          }
        })
        .finally(response => {
          this.jqxxLoading = false;
        });
    },
    //消防车道选择改变
    xfcdChangeEvent(val){
      if(val == 2){
        this.formData.cdxx.dredgeTime = "";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
.display_flex{
  display: flex;
  justify-content: space-between;
}
.loadingBox{
  overflow: hidden;
  max-height: 120px;
}
.reporting-police {
  font-size: 14px;
  .reporting-title {
    h2 {
      background-image: url("../image/icon-info.png");
      background-repeat: no-repeat;
      background-size: 20px;
      span{
        font-size: 12px;
        padding-left: 6px;
      }
    }
  }
  .reporting-info {
    padding: 22px 60px;
    margin-bottom: 15px;
    border-bottom: 1px dashed #dae2ed;
    /deep/ .el-form-item__label {
      padding: 10px 0 0;
    }
    .item {
      color: #37394c;
    }

    // .el-row {
    //   margin: 15px 0px;
    //   font-size: 14px;
    //   & > :first-child {
    //     & > :first-child {
    //       display: inline-block;
    //       text-align: right;
    //       width: 130px;
    //       color: $font-textTitle-color;
    //     }
    //   }
    //   & > :nth-child(2) {
    //     & > :first-child {
    //       display: inline-block;
    //       text-align: right;
    //       color: $font-textTitle-color;
    //     }
    //     & > :last-child {
    //       color: $font-text-color;
    //     }
    //   }
    //   & > :nth-child(3) {
    //     & > :last-child {
    //       color: $font-text-color;
    //     }
    //     & > :first-child {
    //       display: inline-block;
    //       text-align: right;
    //       width: 165px;
    //       color: $font-textTitle-color;
    //     }
    //   }
    // }
    // .cross {
    //   & > :nth-child(3) {
    //     & > :last-child {
    //       color: $font-text-color;
    //     }
    //     & > :first-child {
    //       display: inline-block;
    //       text-align: right;
    //       width: 80px;
    //       color: $font-textTitle-color;
    //     }
    //   }
    //   & > :last-child {
    //     & > :last-child {
    //       color: $font-text-color;
    //     }
    //     & > :first-child {
    //       display: inline-block;
    //       text-align: right;
    //       width: 165px;
    //       color: $font-textTitle-color;
    //     }
    //   }
  }
  .reporting-body {
    padding: 20px 30px 0px 30px;
    .start:before {
      content: "* ";
      color: red;
    }
    .audit_top {
      display: flex;
      align-items: center;
      justify-content: space-around;
      height: 62px;
      line-height: 60px;
      background: rgba(244, 246, 248, 1);
      border-radius: 3px;
      border: 1px solid rgba(196, 205, 213, 0.22);
      margin-bottom: 20px;
      div {
        display: flex;
        align-items: center;
        height: 60px;
        img {
          width: 40px;
          height: 40px;
          margin-right: 10px;
        }
      }
    }
    .icon-plus {
      font-size: 26px;
      padding-top: 4px;
      cursor: pointer;
    }
    .el-icon-circle-plus-outline {
      color: #2296f3;
      margin: 0px 10px;
    }
    .el-icon-remove-outline {
      color: red;
      margin: 0px 10px;
    }
    .text {
      display: inline-block;
      text-align: right;
      min-width: 130px;
      margin-right: 5px;
      color: $font-textTitle-color;
    }
    .shadow-title {
      font-size: 16px;
      font-weight: 600;
      padding: 0 0 0 10px;
      margin: 0 0 10px 0;
      color: $font-title-color;
      border-left: 6px solid $orgColor;
      display: flex;
      justify-content: space-between;
      height: 22px;
      .el-button {
        height: 22px;
        line-height: 22px;
        padding: 0;
      }
      .plus {
        float: right;
        font-size: 18px;
        margin-right: 20px;
        color: #2296f3;
        cursor: pointer;
      }
    }
    .el-row {
      .el-col {
        .peo {
          float: left;
          text-align: right;
          padding: 0px 5px;
        }
        span {
          color: $font-textTitle-color;
          display: inline-block;
        }
        /deep/ .el-form-item__content {
          display: flex;
          align-items: center;
        }
        .shadow-box {
          padding: 15px;
          margin-bottom: 20px;
          background: rgba(255, 255, 255, 1);
          box-shadow: 0px 3px 14px 0px $shadowColor;
          border-radius: 3px;
          border: 1px solid $borderColor;
          .shadow-body {
            margin-top: 15px;
            .item {
              display: flex;
              line-height: 36px;
              margin: 10px;
              .people {
                width: 160px;
              }
              .other {
                width: 140px;
              }
              span {
                display: inline-block;
                min-width: 100px;
                text-align: right;
                line-height: 36px;
                padding-right: 5px;
              }
              .el-input,
              .el-select {
                width: 240px;
              }
            }
          }
          .h4 {
            margin: 15px 0px;
            text-align: center;
          }
          .consumables {
            .el-col {
              margin: 5px 0px;
            }
            span {
              display: inline-block;
              width: 240px;
              padding: 0px 5px;
              text-align: right;
            }
            .el-input {
              margin-right: 28px;
            }
            button {
              margin-left: 30px;
            }
          }
          .arrowBtn {
            font-size: 14px;
            float: right;
            font-weight: 400;
            cursor: pointer;
            color: #2296f3;
          }
          .show-body {
            margin-top: 15px;
            border-top: 1px solid rgba(218, 226, 237, 1);
          }
          .item {
            .name {
              padding: 10px 0px 10px 15px;
              .el-input {
                width: 953px;
              }
              span {
                display: inline-block;
                padding-right: 5px;
              }
            }
            .sele {
              padding: 0px 0px 10px 15px;
              margin-bottom: 10px;
              border-bottom: 1px solid $borderColor;
              span {
                display: inline-block;
                padding-right: 5px;
              }
              .el-select {
                width: 100%;
              }
              & > :nth-child(3) {
                width: 180px;
                text-align: right;
              }
            }
          }
          .people-box {
            border-bottom: 1px solid $borderColor;
            margin: 0 0 15px 0;
            .people-title {
              display: flex;
              span {
                margin-right: auto;
                padding-left: 20px;
                line-height: 40px;
                font-weight: 500;
              }
            }
            .qtxfjyll-warn {
              position: relative;
              top: -19px;
              font-size: 12px;
              color: #ff4949;
            }
          }
          .show-images /deep/ .el-form-item__content {
            height: auto;
            min-height: auto !important;
            line-height: auto !important;
            .el-upload--picture-card,
            .el-upload-list__item {
              width: 176px;
              height: 120px;
              line-height: 118px;
            }
          }
        }
        .uploadTitle {
          float: left;
          width: 122px;
          padding-right: 5px;
          text-align: right;
          // display: inline-block;
        }
      }
    }
  }
}
</style>
<style lang="scss">
// @import "~@/assets/styles/variables.scss";
// .reporting-police {
//   .el-col {
//     .el-form-item {
//       .el-form-item__label {
//         color: $font-textTitle-color !important;
//         font-weight: 400 !important;
//       }
//     }
//   }
//   .timeList {
//     .el-col {
//       .el-form-item {
//         .el-form-item__label {
//           width: 150px !important;
//         }
//         .el-form-item__content {
//           margin-left: 150px !important;
//         }
//       }
//     }
//   }
//   .timeList2 {
//     .el-col {
//       .el-form-item {
//         .el-form-item__label {
//           width: 120px !important;
//         }
//         .el-form-item__content {
//           margin-left: 120px !important;
//         }
//       }
//     }
//   }
// }
//
</style>
