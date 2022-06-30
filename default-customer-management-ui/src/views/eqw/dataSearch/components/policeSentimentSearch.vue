<template lang="pug">
  .policeSentimentSearch
    .police_information
      h2(class="title") 警情信息
        span.hide(@click="showSelect(1)") {{policeHide?'收起':'展开'}}
          i(:class="policeHide?'el-icon-arrow-down':'el-icon-arrow-right'")
      el-row
        el-col(:span="8")
          span.text 警情编码
          el-input(v-model="formData.jqbh" placeholder="请输入")
        el-col(:span="16")
          span.text_date 接警起止时间
          div.form-item-ctrl-date
            el-date-picker(v-model="formData.paramJjsjFrom"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
              @change="paramJjsjTimeChange"
            placeholder="接警起始时间"
            default-time="['00:00:00']"
              :clearable="false")
            span.connect -
            el-date-picker(v-model="formData.paramJjsjTo"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
              @change="paramJjsjTimeChange"
            placeholder="接警结束时间"
            default-time="23:59:59"
              :clearable="false")
            el-select(v-model="selectDate" placeholder="请选择" @change="dateRangeBtn(selectDate)" style="margin-left:2%;width:20%")
              el-option(v-for="item in dateList"
                                  :key="item.value"
                                  :label="item.name"
                                  :value="item.value")
                span(@click="dateRangeBtn(selectDate)" style="display: inline-block;") {{item.name}}
      el-row
        el-col(:span="8")
          span.text 行政区域
          el-input(v-model="xzqyName" placeholder="请选择" readonly @focus="openProvModal()")
            i(slot="suffix" class="iconfont icon-icon-test" @click="openProvModal()" style="line-height:32px;")
            i(slot="suffix" class="el-icon-circle-close" style="margin-left:5px; cursor: pointer;" @click="clearArea()" v-show="xzqyName")
          input(v-model="formData.xzqydmSj" type="hidden")
        el-col(:span="8")
          span.text 警情地址
          el-input(v-model="formData.jqfsdd" placeholder="请输入" clearable)
        el-col(:span="8")
          span.text 警情类型
          el-cascader(ref="cascader"
          v-model="formData.sjlbdm"
            :props="props"
          placeholder="警情类型"
            @change="jqlxChange"
          clearable
          multiple collapse-tags)
      el-row(v-show="policeHide")
        el-col(:span="8")
          span.text 警情等级
          el-select(v-model="formData.jqdj" placeholder="请选择" clearable)
            el-option(v-for="o in jqdj" :key="o.dictValue" :value="o.dictValue" :label="o.dictLabel")
        el-col(:span="8")
          span.text 发送单位
          el-input(v-model="formData.sender" placeholder="请选择" readonly @focus="openSenderMulModal")
            i(slot="suffix" class="iconfont icon-icon-test" style="line-height:32px;"  @click="openSenderMulModal")
            i(slot="suffix" class="el-icon-circle-close" style="line-height:30px; cursor: pointer;" @click="cleanSenderMulValue"  v-show="formData.sender")
        el-col(:span="8")
          span.text 单位名称/户主名
          el-input(v-model="formData.dwmcHzm" placeholder="请输入" clearable)
        el-col(:span="8")
          span.text 119案件编号
          el-input(v-model="formData.caseNbr" placeholder="请输入" clearable)
        el-col(:span="8")
          span.text 出动队伍
          el-input(v-model="xfdwdmName" placeholder="请选择" readonly @focus="openMulModal()")
            i(slot="suffix" class="iconfont icon-icon-test" @click="openMulModal()" style="line-height:32px;")
            i(slot="suffix" class="el-icon-circle-close" style="line-height:30px; cursor: pointer;" @click="cleanMulModal"  v-show="xfdwdmName")
        el-col(:span="8")
          span.text 责任区大队
          el-input(v-model="zrqdddmName" placeholder="请选择" readonly @focus="openDutyMulModal()")
            i(slot="suffix" class="iconfont icon-icon-test" @click="openDutyMulModal()" style="line-height:32px;")
            i(slot="suffix" class="el-icon-circle-close" style="line-height:30px; cursor: pointer;" @click="cleanDutyMulModal"  v-show="zrqdddmName")
        el-col(:span="8")
          span.text 主战队伍
          el-input(v-model="zzdwName" placeholder="请选择" readonly @focus="openZzMulModal()")
            i(slot="suffix" class="iconfont icon-icon-test" @click="openZzMulModal()" style="line-height:32px;")
            i(slot="suffix" class="el-icon-circle-close" style="line-height:30px; cursor: pointer;" @click="cleanZzMulModal"  v-show="zzdwName")
        el-col(:span="8")
          span.text 投入人员总数
          .divInclude
            el-input(v-model="formData.allTrrysMin" clearable :controls="false" :precision="0"  placeholder="请输入")
            span.connect -
            el-input(v-model="formData.allTrrysMax" clearable :controls="false" :precision="0"  placeholder="请输入")
        el-col(:span="8")
          span.text 投入车辆总数
          .divInclude
            el-input(v-model="formData.allCarCountMin" clearable :controls="false" :precision="0"  placeholder="请输入")
            span.connect -
            el-input(v-model="formData.allCarCountMax" clearable :controls="false" :precision="0"  placeholder="请输入")
          //- <el-col :span="8">
          //-                       <el-form-item>
          //-                           <el-select
          //-                               v-model="tagValue"
          //-                               multiple
          //-                               filterable
          //-                               default-first-option
          //-                               placeholder="请选择警情标签">
          //-                               <el-option
          //-                                 v-for="item in tagOptions"
          //-                                 :key="item.value"
          //-                                 :label="item.label"
          //-                                 :value="item.value">
          //-                               </el-option>
          //-                             </el-select>
          //-                       </el-form-item>
          //-                   </el-col>
        el-col(:span="8")
          span.text 是否包含警情标签
          el-select(v-model="formData.tagContains" placeholder="请选择" clearable)
            //- el-option(v-for="o in tagContainsOption" :key="o.value" :value="o.value" :label="o.label")
            el-option(label="包含" value=1)
            el-option(label="不包含" value=0)
        el-col(:span="8")
          span.text 警情标签
          el-select(v-model="formData.tagIds" placeholder="请选择" clearable)
           el-option(v-for="o in jqbqList" :key="o.value" :value="o.value" :label="o.label")
        el-col(:span="8")
          span.text 是否超时
          el-select(v-model="formData.isJqTimeout" placeholder="请选择" clearable)
            el-option(label="超时" value="1")
            el-option(label="未超时" value="0")
        el-col(:span="8" v-if="xjID == true") 
          span.text 是否兵团火灾扑救
          el-select(v-model="formData.isCorps" placeholder="请选择")
                el-option(label="是" value="1")
                el-option(label="否" value="0")
        el-col(:span="8" v-if="zzhzjg == true")
          span.text 是否接处警同步
          el-select(v-model="formData.xxly" placeholder="请选择" clearable)
            el-option(label="是" value=" ")
            el-option(label="否" value="M")

      el-form( ref="formData" :model="formData" )
        el-row(v-show="policeHide")
          el-col(:span="24" v-if=" ! zzhzjg == true")
            span.text 备注
            el-input(
                    v-model="formData.bz"
                    show-word-limit
                    resize="none"
                    :autosize="{ minRows: 3, maxRows: 3 }"
                    placeholder="请填写备注信息"
                    clearable)

          el-col(:span="24" )
           el-form-item( prop="bz" v-if="zzhzjg == true")
            span.text 警情说明
            el-input(
                    v-model="formData.bz"
                    show-word-limit
                    resize="none"
                    placeholder="请填写警情说明"
                    clearable)

    .dispatch_information(v-if="isAllSearch")
      h2(class="title") 出动信息
        span.hide(@click="showSelect(2)") {{dispatchHide?'收起':'展开'}}
          i(:class="dispatchHide?'el-icon-arrow-down':'el-icon-arrow-right'")
      el-row
        el-col(:span="8")
          span.text 参战形式
          el-select(v-model="formData.respondType" placeholder="请选择" clearable)
            el-option(label="主战" value="010000")
            el-option(label="增援" value="020000")
        el-col(:span="8")
          span.text 处置情况
          el-select(v-model="formData.czqkdm" placeholder="请输入" clearable)
            el-option(v-for="item in Options.tb_dic_czqk"
              :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue")
        el-col(:span="8")
          span.text 到场时火灾情况
          el-select(v-model="formData.dcshzqkdm" placeholder="请输入" clearable)
            el-option(v-for="item in Options.tb_dic_hzqk"
              :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue")
      el-row(v-show="dispatchHide")
        el-col(:span="8")
          span.text 行业主管部门
          el-select(v-model="formData.hyzgbm" placeholder="请选择" clearable)
            el-option(v-for="item in Options.tb_dic_hyzgbm"
              :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue")
        el-col(:span="8")
          span.text 距离现场
          .divInclude
            el-input(v-model="formData.jlxcjldmMin" placeholder="请输入")
            span.connect -
            el-input(v-model="formData.jlxcjldmMax" placeholder="请输入")
        el-col(:span="8")
          span.text 现场人员被困
          .divInclude
            el-input(v-model="formData.xcrybkqkdmMin" placeholder="请输入")
            span.connect -
            el-input(v-model="formData.xcrybkqkdmMax" placeholder="请输入")
        el-col(:span="8")
          span.text 是否采用公用消防栓供水
          el-select(v-model="formData.useHydrant" placeholder="请选择" clearable)
            el-option(label="是" value="1")
            el-option(label="否" value="0")
        el-col(:span="8")
          span.text 带队指挥员姓名
          el-input(v-model="formData.zhy" placeholder="请输入")
        el-col(:span="8")
          span.text 带队指挥员职务
          el-select(v-model="formData.zhyzw" placeholder="请选择" clearable)
            el-option(v-for="item in Options.tb_dic_ddzhzw"
              :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue")
        el-col(:span="8")
          span.text 全勤指挥部
          el-select(v-model="formData.qqzhbZhcddm" placeholder="请选择" clearable)
            el-option(v-for="item in Options.tb_dic_xczh"
              :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue")
        el-col(:span="8")
          span.text 是否有联动单位
          el-select(v-model="formData.isLddw" placeholder="请选择" clearable)
            el-option(label="是" value="1")
            el-option(label="否" value="0")
        el-col(:span="8")
          span.text 气温
          .divInclude
            el-input(v-model="formData.qwMin" placeholder="请输入")
            span.connect -
            el-input(v-model="formData.qwMax" placeholder="请输入")
        el-col(:span="8")
          span.text 风向
          el-select(v-model="formData.fxdm" placeholder="请选择" clearable)
            el-option(v-for="item in Options.tb_dic_fx"
              :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue")
        el-col(:span="8")
          span.text 风力
          el-input(v-model="formData.windForce" placeholder="请输入")
        el-col(:span="8")
          span.text 天气
          el-select(v-model="formData.weather" placeholder="请选择" clearable)
            el-option(v-for="item in Options.tb_dic_qh"
              :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue")
        el-col(:span="8")
          span.text 是否内攻
          el-select(v-model="formData.insideAttack" placeholder="请选择" clearable)
            el-option(label="是" value="1")
            el-option(label="否" value="0")
        el-col(:span="8")
          span.text 火灾技战术措施
          el-input(v-model="formData.hzJzscsdm" placeholder="请输入")
        el-col(:span="8")
          span.text 抢险救援战术措施
          el-input(v-model="formData.qxjyJzscsdm" placeholder="请输入")
        el-col(:span="8")
          span.text 投入车辆数
          .divInclude
            el-input(v-model="formData.carCountMin" placeholder="请输入")
            span.connect -
            el-input(v-model="formData.carCountMax" placeholder="请输入")
        el-col(:span="8")
          span.text 投入人员数
          .divInclude
            el-input(v-model="formData.trrysMin" placeholder="请输入")
            span.connect -
            el-input(v-model="formData.trrysMax" placeholder="请输入")
        el-col(:span="8")
          span.text 微型消防站名称
          el-input(v-model="formData.wxxfzMc" placeholder="请输入")
        //- el-col(:span="8")
        //- 	span.text 微型消防站数量
        //- 	el-input(v-model="formData.wxxfzMc" placeholder="请输入")
        el-col(:span="8")
          span.text 民间救援队
          el-input(v-model="formData.mjjydMc" placeholder="请输入")
        //- el-col(:span="8")
        //- 	span.text 民间救援队数量
        //- 	el-input(v-model="formData.mjjydMc" placeholder="请输入")
        el-col(:span="8")
          span.text 企业专职队名称
          el-input(v-model="formData.qyzzdMc" placeholder="请输入")
        //- el-col(:span="8")
        //- 	span.text 企业专职队数量
        //- 	el-input(v-model="formData.qyzzdMc" placeholder="请输入")
        el-col(:span="8")
          span.text 是否有人员伤亡
          el-select(v-model="formData.isCzrysw" placeholder="请选择" clearable)
            el-option(label="是" value="1")
            el-option(label="否" value="0")
        el-col(:span="8")
          span.text 报告状态
          el-select(v-model="shztArr" placeholder="请选择" clearable multiple collapse-tags)
            el-option(label="待完善" value="-3")
            el-option(label="被退回" value="-2")
            el-option(label="待修改" value="-1")
            el-option(label="未送审" value="0")
            el-option(label="审核中" value="1")
            el-option(label="已审核" value="2")
            el-option(label="被挂起" value="3")
            el-option(label="已归档" value="99")
            el-option(label="被驳回" value="4")
    .fire_information(v-if="isAllSearch")
      h2(class="title") 火灾信息
        span.hide(@click="showSelect(3)") {{fireHide?'收起':'展开'}}
          i(:class="fireHide?'el-icon-arrow-down':'el-icon-arrow-right'")
      el-row
        el-col(:span="8")
          span.text 是否正在调查
          el-select(v-model="formData.sfzzdc" placeholder="请选择" clearable)
            el-option(label="是" value="1")
            el-option(label="否" value="0")
        el-col(:span="16")
          span.text 起火时间
          .divIncludeTime
            el-date-picker(v-model="formData.paramZqsjFrom"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="['00:00:00']"
              @change="paramZqsjTimeChange"
                :clearable="true")
            span.connect -
            el-date-picker(v-model="formData.paramZqsjTo"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="['23:59:59']"
              @change="paramZqsjTimeChange"
                :clearable="true")
        el-col(:span="8")
          span.text 起火地点
          el-input(v-model="formData.zqdd" placeholder="请输入" clearable)
        el-col(:span="8")
          span.text 火灾等级
          el-select(v-model="formData.zqlbdm" placeholder="请选择" clearable)
            el-option( v-for="(item, index) in options.tb_dic_zqdj"
              :key="index"
                :label="item.dictLabel"
                :value="item.dictValue")
        el-col(:span="8")
          span.text 是否轻微火灾
          el-select(v-model="formData.qwhz" placeholder="请选择" clearable)
            el-option(label="是" value="1")
            el-option(label="否" value="0")
      el-row(v-show="fireHide")
        el-col(:span="8")
          span.text 失火单位/户主联系电话
          el-input(v-model="formData.lxdh" placeholder="请输入" clearable)
        el-col(:span="8")
          span.text 单位统一社会信用代码
          el-input(v-model="formData.dwtyshxydm" placeholder="请输入" clearable)
        el-col(:span="8")
          span.text 区域
          el-select(v-model="formData.qydm" placeholder="请选择" clearable)
            el-option( v-for="(item, index) in options.qydm"
              :key="index"
                :label="item.dictLabel"
                :value="item.dictValue")
        el-col(:span="8")
          span.text 监督检查情况
          el-select(v-model="formData.jdjcqk" placeholder="请选择" clearable)
            el-option( v-for="(item, index) in options.jdjcqk"
              :key="index"
                :label="item.dictLabel"
                :value="item.dictValue")
        el-col(:span="8")
          span.text 事故调查牵头部门
          el-select(v-model="formData.sgqtdcbm" placeholder="请选择" clearable)
            el-option( v-for="(item, index) in options.sgqtdcbm"
              :key="index"
                :label="item.dictLabel"
                :value="item.dictValue")
        el-col(:span="8")
          span.text 经济类型
          el-select(v-model="formData.jjlxdm" placeholder="请选择" clearable)
            el-option( v-for="(item, index) in options.tb_dic_jjlx"
              :key="index"
                :label="item.dictLabel"
                :value="item.dictValue")
        el-col(:span="8")
          span.text 所属行业
          el-input(v-model="formData.hylbdm" placeholder="请输入" clearable)
        el-col(:span="8")
          span.text 起火场所类型
          el-select(v-model="formData.qhcslb" placeholder="请选择" clearable @change="fireTypeChange")
            el-option( v-for="(item, index) in options.tb_dic_qhcslb"
              :key="index"
                :label="item.dictLabel"
                :value="item.dictValue")
        el-col(:span="8")
          span.text 起火场所
          el-input(v-model="formData.qhcsms" placeholder="请输入" readonly)
            i(slot="suffix" class="iconfont icon-icon-test" style="line-height:32px;" @click="openQhcsMul")
            i(slot="suffix" class="el-icon-circle-close" style="line-height:30px; cursor: pointer;" @click="cleanQhcsMul"  v-show="formData.qhcsms")
        el-col(:span="8")
          span.text 是否属世界遗产
          el-select(v-model="formData.sfsjycdm" placeholder="请选择" clearable)
            el-option(label="是" value="1")
            el-option(label="否" value="0")
        el-col(:span="8")
          span.text 建筑使用用途
          el-select(v-model="formData.jzsyyt" placeholder="请选择" clearable)
            el-option( v-for="(item, index) in options.jzyt"
              :key="index"
                :label="item.dictLabel"
                :value="item.dictValue")
        el-col(:span="8")
          span.text 建筑类别
          el-select(v-model="formData.jzlbdm" placeholder="请选择" clearable)
            el-option( v-for="(item, index) in options.tb_dic_jzlb"
              :key="index"
                :label="item.dictLabel"
                :value="item.dictValue")
        el-col(:span="8")
          span.text 建筑耐火等级
          el-select(v-model="formData.jznhdjdm" placeholder="请选择" clearable)
            el-option( v-for="(item, index) in options.tb_dic_jzwnhdj"
              :key="index"
                :label="item.dictLabel"
                :value="item.dictValue")
        el-col(:span="8")
          span.text 建筑结构
          el-select(v-model="formData.jzjgdm" placeholder="请选择" clearable)
            el-option( v-for="(item, index) in options.tb_dic_jzjg"
              :key="index"
                :label="item.dictLabel"
                :value="item.dictValue")
        el-col(:span="8")
          span.text 火灾是否蔓延到临近建筑
          el-select(v-model="formData.hzsfmydljjz" placeholder="请选择" clearable)
            el-option(label="是" value="1")
            el-option(label="否" value="0")
        el-col(:span="8")
          span.text 是否发生轰燃
          el-select(v-model="formData.sffshr" placeholder="请选择" clearable)
            el-option(label="是" value="1")
            el-option(label="否" value="0")
        el-col(:span="8")
          span.text 门窗是否开启
          el-select(v-model="formData.shjzmcsfkq" placeholder="请选择" clearable)
            el-option(label="是" value="1")
            el-option(label="否" value="0")
        el-col(:span="8")
          span.text 自动报警系统
          el-select(v-model="formData.zdbjxtsfaz" placeholder="请选择" clearable)
            el-option( v-for="(item, index) in options.xfssqk"
              :key="index"
                :label="item.dictLabel"
                :value="item.dictValue")
        el-col(:span="8")
          span.text 自动灭火系统
          el-select(v-model="formData.zdmhxtsfaz" placeholder="请选择" clearable)
            el-option( v-for="(item, index) in options.xfssqk"
              :key="index"
                :label="item.dictLabel"
                :value="item.dictValue")
        el-col(:span="8")
          span.text 防排烟系统
          el-select(v-model="formData.fpyxtsfaz" placeholder="请选择" clearable)
            el-option( v-for="(item, index) in options.xfssqk"
              :key="index"
                :label="item.dictLabel"
                :value="item.dictValue")
        el-col(:span="8")
          span.text 防火卷帘
          el-select(v-model="formData.fhjl" placeholder="请选择" clearable)
            el-option( v-for="(item, index) in options.xfssqk"
              :key="index"
                :label="item.dictLabel"
                :value="item.dictValue")
        el-col(:span="8")
          span.text 室内消火栓系统
          el-select(v-model="formData.snxhsxtsaz" placeholder="请选择" clearable)
            el-option( v-for="(item, index) in options.xfssqk"
              :key="index"
                :label="item.dictLabel"
                :value="item.dictValue")
        el-col(:span="8")
          span.text 防火分区
          el-select(v-model="formData.fhfq" placeholder="请选择" clearable)
            el-option( v-for="(item, index) in options.tb_dic_fhty"
              :key="index"
                :label="item.dictLabel"
                :value="item.dictValue")
        el-col(:span="8")
          span.text 防火间距
          el-select(v-model="formData.fhjj" placeholder="请选择" clearable)
            el-option( v-for="(item, index) in options.tb_dic_fhty"
              :key="index"
                :label="item.dictLabel"
                :value="item.dictValue")
        el-col(:span="8")
          span.text 疏散通道
          el-select(v-model="formData.sstd" placeholder="请选择" clearable)
            el-option( v-for="(item, index) in options.sstd"
              :key="index"
                :label="item.dictLabel"
                :value="item.dictValue")
        el-col(:span="8")
          span.text 紧急出口
          el-select(v-model="formData.yjck" placeholder="请选择" clearable)
            el-option( v-for="(item, index) in options.yjck"
              :key="index"
                :label="item.dictLabel"
                :value="item.dictValue")
        el-col(:span="8")
          span.text 应急疏散照明
          el-select(v-model="formData.yjsszm" placeholder="请选择" clearable)
            el-option( v-for="(item, index) in options.yjsszm"
              :key="index"
                :label="item.dictLabel"
                :value="item.dictValue")
        el-col(:span="8")
          span.text 联网情况
          el-select(v-model="formData.sflw" placeholder="请选择" clearable)
            el-option( v-for="(item, index) in options.sflw"
              :key="index"
                :label="item.dictLabel"
                :value="item.dictValue")
        el-col(:span="8")
          span.text 是否保险
          el-select(v-model="formData.sfbx" placeholder="请选择" clearable)
            el-option(label="是" value="1")
            el-option(label="否" value="0")
        el-col(:span="8")
          span.text 是否单方火灾事故
          el-select(v-model="formData.sfdfhzsh" placeholder="请选择" clearable)
            el-option(label="是" value="1")
            el-option(label="否" value="0")
        el-col(:span="8")
          span.text 起火物
          el-input(v-model="formData.qhwms" placeholder="请输入" readonly)
            i(slot="suffix" class="iconfont icon-icon-test" style="line-height:32px;"  @click="openQhwMul")
            i(slot="suffix" class="el-icon-circle-close" style="line-height:30px; cursor: pointer;" @click="cleanQhwMul"  v-show="formData.qhwms")
        el-col(:span="8")
          span.text 火灾原因
          el-input(v-model="formData.hzyyms" placeholder="请输入" readonly)
            i(slot="suffix" class="iconfont icon-icon-test" style="line-height:32px;" @click="openQhyyMul")
            i(slot="suffix" class="el-icon-circle-close" style="line-height:30px; cursor: pointer;" @click="cleanQhyyMul"  v-show="formData.hzyyms")
        el-col(:span="8")
          span.text 调查方式
          el-select(v-model="formData.dcfs" placeholder="请选择" clearable)
            el-option( v-for="(item, index) in options.tb_dic_dcfs"
              :key="index"
                :label="item.dictLabel"
                :value="item.dictValue")
        el-col(:span="8")
          span.text 是否有人员伤亡
          el-select(v-model="formData.sfyrsw" placeholder="请选择" clearable)
            el-option(label="有" value="1")
            el-option(label="无" value="0")
        el-col(:span="8")
          span.text 是否立案
          el-select(v-model="formData.sfla" placeholder="请选择" clearable)
            el-option(label="是" value="1")
            el-option(label="否" value="0")
        el-col(:span="8")
          span.text 是否刑事放火
          el-select(v-model="formData.sfxsfh" placeholder="请选择" clearable)
            el-option(label="是" value="1")
            el-option(label="否" value="0")
        el-col(:span="8")
          span.text 是否属安全生产事故
          el-select(v-model="formData.sfaqscsg" placeholder="请选择" clearable)
            el-option(label="是" value="1")
            el-option(label="否" value="0")
        el-col(:span="8")
          span.text 报告状态
          el-select(v-model="tbZqxxQueryVoshzt" placeholder="请选择" clearable multiple collapse-tags)
            el-option(label="已审核" value="2")
            el-option(label="审核中" value="1")
            el-option(label="被终止" value="-1")
            el-option(label="被退回" value="-2")
            el-option(label="待完善" value="-3")
    el-row(v-if="!isCheckNewTask")
      el-col(:span="14")
        el-button(type="primary" @click="searchBtn" :loading="querying") 查&nbsp;询
        el-button(@click="resetBtn") 重&nbsp;置
        el-button(type="primary" @click="toReport") 生成报表
        el-button(type="primary" v-if="showDownBtn" @click="searchBtn(this, true)" :loading="downloading") 清单导出

      el-col(:span="10" )
        //.synchronizeTime(v-if="deptLevel != '1'" style="text-align:right;")
          span 数据统计时间截止至&nbsp;
            span(style="color:red; margin-right:5px;") {{synchronizationTime || '-'}}
            el-button(v-if="deptLevel == '2'"  class="btn_orange" @click.prevent="dataSynchronize()" :loading="btnLoading") 数据同步
    .list-box(v-if="!isCheckNewTask" v-loading="listLoading")
      .query-resule
        p.resule-title 查询结果：
        .resule-box 共查询到 #[span {{resultData.总警情数 || 0}}] 起警情记录，其中火灾扑救 #[span {{resultData.火灾扑救 || 0}}] 起，抢险救援 #[span {{resultData.抢险救援 || 0}}] 起，社会救助 #[span {{resultData.社会救助 || 0}}] 起，公务执勤 #[span {{resultData.公务执勤 || 0}}] 起，反恐排爆 #[span {{resultData.反恐排爆 || 0}}] 起，其他 #[span {{resultData.其他出动 || 0}}] 起，共出动队伍 #[span {{resultData.出动次数 || 0}}] 队次，共出动车辆 #[span {{resultData.出动车辆次 || 0}}] 辆次，出动人员 #[span {{resultData.出动人次 || 0}}] 人次。
      el-table(:data="tableData" style="width: 100%" v-loading="querying")
        el-table-column(type="index" label="序号" width="50")
        el-table-column(prop="jqbh" label="警情编码" show-overflow-tooltip)
        el-table-column(prop="jjsj" label="接警时间" show-overflow-tooltip)
        el-table-column(prop="xzqydmSj" label="行政区域" width="150")
        el-table-column(prop="jqfsdd" label="警情地址" width="250")
          template(slot-scope="scope")
            el-tooltip(v-show="scope.row.jqfsdd.length > 15" class="item" effect="dark" :content="scope.row.jqfsdd" placement="top-start")
              div {{(scope.row.jqfsdd.substring(0,15))}}...
            el-tooltip(v-show="scope.row.jqfsdd.length <= 15" class="item" effect="dark" :content="scope.row.jqfsdd" placement="top-start")
              div {{(scope.row.jqfsdd.substring(0,15))}}
        el-table-column(prop="sjlbmc" label="警情类型" show-overflow-tooltip)
        el-table-column(prop="" label="投入力量" width="80")
          template(slot-scope="scope")
            div {{scope.row.carCount}} 车 {{scope.row.trrys}} 人

        el-table-column(prop="xfdwdm" label="派发单位" show-overflow-tooltip)
        el-table-column(prop="" label="操作" width="60")
          template(slot-scope="scope")
            el-button(type="text" @click="toDetailClick(scope.row)") 查看
      .pagination_zone(v-show="total > 0")
        pagination(:total="total" :page.sync="formData.pageNum" :limit.sync="formData.pageSize" @pagination="getList")
    //- 行政区域
    provModal(ref="provModal" @setProv="setProvValue")
    //- 起火场所
    fireSpaceMul(ref="Mulmodel" :qhcs-type="formData.qhcslb ? formData.qhcslb : ''" @setMulVals="setMulVals")
    //- 起火物
    fireObjectMul(ref="fireObjecMul" @setFireMulVal="setFireMulVal")
    //- 起火原因
    fireReasonMul(ref="fireReasonMul" :multiple="true" @setFireReasonMulVal="setFireReasonMulVal")
    //- <!-- 出动队伍名称 -->
    cdMulModal(ref="mulModal" @setMulVal="setMulValue")
    mulModal(ref="zzMulModal" @setMulVal="setZzMulVal")
    // 责任区大队多选
    dutyModal(ref="dutyModal" @setMulVal="setDutyMulValue")
    // 发送单位多选
    sender-mul-modal(ref="senderMulModal" @setMulVal="setSenderMulValue")
</template>
<script>
  import {getJqcdlb, getOptions} from "@/api/data/entry/jqxx";
  import {
    fireOption,
    fireTreeOption,
    optionsList,
    cdOptions,
    cdOptionsList
  } from "./option";
  import {getSelectOptions, getTreeOptions} from "@/api/data/entry/zqxx";
  import provModal from "@/views/eqw/customSearch/components/multiProvModal";
  import fireSpaceMul from "@/views/eqw/customSearch/components/fireSpaceModal";
  import fireObjectMul from "@/views/eqw/customSearch/components/fireObjectModal";
  import fireReasonMul from "@/views/data/entry/zqxx/components/fireReasonMul";
  import {downloadFile} from "@/utils/download-file.js";
  // 出动队伍
  import cdMulModal from "@/views/components/dataSeach/cdMulModal";
  // 责任区大队
  import dutyModal from "@/views/components/dataSeach/dutyModal";
  // 主战
  import mulModal from "@/views/components/dataSeach/mulModal";
  import {getNearlyRecentDays,formdate} from "@/utils/dateTimeUtils.js";
  import {getInitTime} from "@/utils/dateTimeUtils.js";
  import {jqxxCommomSearch, jqxxCommomDownload, selectJqxxCommonCount} from "@/api/data/entry/jqxx";
    import { targetNameTarget } from "@/api/system/dict/target";

  import {
    synchronizeData,
    getSynchronizeDataTime,
    getLastEtlTime
  } from "@/api/report/report";
  import senderMulModal from '@/views/components/dataSeach/senderMulModal.vue';

  export default {
    name: "PoliceSentimentSearch",
    components: {
      provModal,
      fireSpaceMul,
      fireObjectMul,
      fireReasonMul,
      mulModal,
      cdMulModal,
      dutyModal,
      senderMulModal
    },
    props: {
      // 是否是 发起监督 - 新建检查任务 页面使用的
      isCheckNewTask: {
        type: Boolean,
        default: false
      },
      // 是否是 综合查询 的条件
      isAllSearch: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        xjID: false,
        // tagContainsOption:[
        //   {label:"包含", value:1},
        //   {label:"不包含", value:0}
        // ],
        zzhzjg: false,
        listLoading: false,
        querying: false, //是否正在查询
        downloading: false, // 是否正在下载
        synchronizationTime: "",
        deptLevel: "",
        /* 查询信息显示隐藏 */
        policeHide: true, // 警情信息筛选展示隐藏
        dispatchHide: true, // 出动信息筛选展示隐藏
        fireHide: true, // 火灾信息筛选展示隐藏
        props: {
          // 警情类型级联懒加载
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
        xzqyName: "", // 行政区域显示名称
        jjsj: [], // 接警起止时间（请求参数 接警时间）
        paramZqsj: "", // 起火时间
        caseNbr: "",
        //
        //
        //
        xfdwdmId: [],
        xfdwdmName: '',// 出动队伍
        zrqdddmId: [],
        zrqdddmName: '',// 责任区大队
        zzdwId: [],
        zzdwName: '',   // 主战队伍
        // 提交查询信息
        formData: {
          /** ************** 警情信息字段 */
          isCorps: "0",//是否兵团火灾扑救
          bz: '', //备注
          isJqTimeout:'',//是否超时
          tagContains:'',//是否包含警情标签
          xxly: '', //是否接处警同步
          jqbh: "", // 警情编码
          xzqydmSj: "", // 行政区域（所属行政区）
          paramJjsjFrom: "", // 接警开始时间
          paramJjsjTo: "", // 接警结束时间
          jqfsdd: "", // 警情地址（事件地点）
          sjlbdm: "", // 警情类型（出警类别）
          jqtbzh: "", // 发送单位
          sender: '', // 发送单位名称
          dwmcHzm: "", // 单位名称/户主名
          caseNbr: "",
          xfdwdm: '',   // 出动队伍
          zrqdddm: '',   // 责任区大队
          zzdw: '',       // 主战队伍
          jqdj: '', //警情等级
          jqbq: '', //警情标签
          tagIds: '', //警情标签
          allTrrysMin:undefined,//投入人员总数最少
          allTrrysMax:undefined,//投入人员总数最大
          /** *************** 出动信息字段 */
          // respondType: "", // 参战形式
          // czqkdm: "", // 处置情况
          // dcshzqkdm: "", // 到场时火灾情况
          // hyzgbm: "", // 行业主管部门
          // jlxcjldmMin: "", // 距离现场开始值
          // jlxcjldmMax: "", // 距离现场结束值
          // xcrybkqkdmMin: "", // 现场人员被困数1
          // xcrybkqkdmMax: "", // 现场人员被困数2
          // useHydrant: "", // 是否采用公用消防栓供水
          // zhy: "", // 带队指挥员姓名
          // zhyzw: "", // 带队指挥员职务
          // qqzhbZhcddm: "", // 全勤指挥部
          // isLddw: "", // 是否联动单位
          // qwMin: "", // 气温min
          // qwMax: "", // 气温max
          // fxdm: "", // 风向
          // windForce: "", // 风力
          // weather: "", // 天气
          // insideAttack: "", // 是否内攻
          // hzJzscsdm: "", // 火灾技战术措施
          // qxjyJzscsdm: "", // 抢险救援技战术措施
          // carCountMin: "", // 投入总车辆数-下限
          // carCountMax: "", // 投入总车辆数-上限
          // trrysMin: "", // 投入总人员数-下限
          // trrysMax: "", // 投入总人员数-上限
          // isCzrysw: "", // 是否有人员伤亡
          // wxxfzMc: "", // 微型消防站名称
          // // 微型消防站数量
          // mjjydMc: "", // 民间救援队
          // // 民间救援队数量
          // qyzzdMc: "", // 企业专职队名称
          // // 企业专职队数量

          // /** *************** 火灾（灾情）信息字段 */
          // sfzzdc: "", // 是否正在调查
          // zqlbdm: "", // 火灾等级
          // qwhz: "", // 是否轻微火灾，1是0否
          // paramZqsjFrom: "", // 起火开始时间
          // paramZqsjTo: "", // 起火结束时间
          // zqdd: "", // 起火地点
          // lxdh: "", // 失火单位/户主联系电话
          // dwtyshxydm: "", // 单位统一社会信用代码
          // qydm: "", // 区域
          // jdjcqk: "", // 消防救援机构监督检查范围
          // sgqtdcbm: "", // 事故调查牵头部门
          // jjlxdm: "", // 经济类型
          // hylbdm: "", // 所属行业
          // qhcslb: "", // 起火场所类型
          // qhcsms: "",
          // qhcsdm: "", // 起火场所
          // sfsjycdm: "", // 是否属世界遗产
          // jzsyyt: "", // 建筑使用用途
          // jzlbdm: "", // 建筑类别
          // jznhdjdm: "", // 建筑耐火等级
          // jzjgdm: "", // 建筑结构
          // hzsfmydljjz: "", // 火灾是否蔓延到邻近建筑
          // sffshr: "", // 是否发生轰燃
          // shjzmcsfkq: "", // 门窗是否开启
          // zdbjxtsfaz: "", // 自动报警系统
          // zdmhxtsfaz: "", // 自动灭火系统
          // fpyxtsfaz: "", // 防排烟系统
          // fhjl: "", // 防火卷帘
          // snxhsxtsaz: "", // 室内消火栓系统
          // fhfq: "", // 防火分区
          // fhjj: "", // 防火间距
          // sstd: "", // 疏散通道
          // yjck: "", // 紧急出口
          // yjsszm: "", // 应急疏散照明
          // sflw: "", // 联网情况
          // sfbx: "", // 是否保险
          // sfdfhzsh: "", // 是否单方火灾事故
          // qhwms: "",
          // qhwfldm: "", // 起火物
          // hzyyms: "",
          // hzyydm: "", // 火灾原因
          // dcfs: "", // 调查方式
          // sfla: "", // 是否立案
          // sfxsfh: "", // 是否属刑事放火
          // sfaqscsg: "", // 是否属安全生产事故
          // sfyrsw: "", // 是否有人员伤亡  是1 否0
          pageNum: 1,
          pageSize: 20,
          dataQueryTypeCx: 1 ,//警情类型区分综合警情查询
          allCarCountMin:undefined,//投入车辆数最小值
          allCarCountMax:undefined,//投入车辆数最大值
        },
        shztArr: [], // 出动报告状态（-3：待完善；-2：被退回；-1：审核终止；0：未送审；1：审核中；2：审批通过；3：被挂起；99：归档；4：被驳回）
        tbZqxxQueryVoshzt: [], // 报告状态（2：已审核；1：审核中；-1：被终止；-2：被退回；-3：待完善）
        selectedAreaInfo: {},
        total: 0,
        Options: cdOptionsList,
        options: optionsList,
        tableData: [],
        resultData: {
          总警情数: '-',
          火灾扑救: '-',
          抢险救援: '-',
          社会救助: '-',
          公务执勤: '-',
          反恐排爆: '-',
          其他出动: '-',
          出动次数: '-',
          出动车辆次: '-',
          出动人次: '-'
        },
        btnLoading: false,
        showDownBtn: false,
        zqxxQhcsList: [], //起火场所类型
        // 日期选择控件配置
        dateList:[{
          value:1,
          name:'最近一周'
        },{
          value:2,
          name:'最近一个月'
        },{
          value:3,
          name:'本月'
        },{
          value:4,
          name:'本年'
        },{
          value:5,
          name:'上个月'
        },{
          value:6,
          name:'上年'
        }],
        selectDate:2,
        jqdj:[], //警情等级
        jqbqList:[], //警情标签
      };
    },
    created() {
      // this.formData.tagContains = this.tagContainsOption[0].value;
      this.hideAreaId();
      this.hideAreaId3();
      //this.getLastTime();
      this.getSelectInfo();
      this.getAllTag();
      this.jjsj = getNearlyRecentDays(30);
      this.deptLevel = this.$store.state.user.deptLevel;

      this.formData.paramJjsjFrom = getNearlyRecentDays(30)[0]; // 接警起止时间
      this.formData.paramJjsjTo = getNearlyRecentDays(30)[1]; // 接警截止时间
      // this.formData.paramZqsjFrom = getNearlyRecentDays(30)[0];
      // this.formData.paramZqsjTo = getNearlyRecentDays(30)[1];
    },
    methods: {
      //判断新疆ID为65开头
      hideAreaId3(){
        //  console.log( "______",this.$store.state.user.deptId) 
        if(this.$store.state.user.deptId){
          let hideArr = (this.$store.state.user.deptId).toString().split('');
        //  console.log(1111,hideArr)
         if(hideArr[0] == '6' && hideArr[1] == '5'){
           this.xjID = true;
         }
        }
      },
      //判断浙江ID为33开头
      hideAreaId(){
        //  console.log( "______",this.$store.state.user.deptId) 
        if(this.$store.state.user.deptId){
          let hideArr = (this.$store.state.user.deptId).toString().split('');
        //  console.log(hideArr)
         if(hideArr[0] == '3' && hideArr[1] == '3'){
           this.zzhzjg = true;
         }
        }
      },
      /** 出动队伍*/
      getAllTag() {
        let _params = {
          "tagName": "",
          "tagType": "J"
        }
        targetNameTarget(_params).then(res => {
          this.jqbqList = res.data.map(item => {
            return {
              label: item.tagName,
              value: item.tagId
            }
          });
          //  console.log("-------",this.jqbqList)
        });
      },
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
          this.$message.success("数据同步成功！");
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
          if (res.code == 200) this.synchronizationTime = res.data.cdtime || "";
        });
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
      // 查询
      searchBtn(event, download = false) {
        if(this.formData.tagContains == "" && this.formData.tagIds !==""){
            this. $message.error(" ‘是否包含警情标签’为必填")
            return;
        }
        if(this.formData.tagContains !== "" && this.formData.tagIds ==""){
            this. $message.error(" ‘警情标签’为必填")
            return;
        }
        if (!download) {
          this.showDownBtn = false;
        }
        //if (this.formData.paramJjsjTo == "" || this.formData.paramJjsjFrom == "") {
        //	this.$message.warning("请选择接警时间！！！");
        //	return;
        //}
        // 查询之前隐藏筛选条件
        this.policeHide = this.dispatchHide = this.fireHide = false;
        this.formData.pageNum = 1;
        this.formData.pageSize = 20;
        if (this.shztArr.length != 0) {
          this.formData.cdShzts = this.shztArr.join(",");
        }
        if (this.tbZqxxQueryVoshzt.length != 0) {
          this.formData.zqShtzs = this.tbZqxxQueryVoshzt.join(",");
        }
        if (download) {
          this.downloadData();
          return;
        }
        this.getTabList();
        this.getSelectJqxxCommonCount();
      },
      resetBtn() {
        this.zzdwId = [];
        this.zzdwName = '';  // 主战队伍
        this.zrqdddmId = [];
        this.zrqdddmName = '';// 责任区大队
        this.xfdwdmId = [];
        this.xfdwdmName = '';// 出动队伍
        this.formData = {
          /** ************** 警情信息字段 */
          isCorps: "0",//是否兵团火灾扑救
          bz: '', //备注
          // tagContains : this.tagContainsOption[0].value,//是否包含警情标签
          tagContains :'',//是否包含警情标签
          isJqTimeout:'',//是否超时
          xxly: '', //是否接处警同步
          jqbh: "", // 警情编码
          xzqydmSj: "", // 行政区域（所属行政区）
          paramJjsjFrom: "", // 接警开始时间
          paramJjsjTo: "", // 接警结束时间
          jqfsdd: "", // 警情地址（事件地点）
          sjlbdm: "", // 警情类型（出警类别）
          jqtbzh: "", // 发送单位
          sender: '', // 发送单位名称
          dwmcHzm: "", // 单位名称/户主名
          caseNbr: "",
          xfdwdm: '',   // 出动队伍
          zrqdddm: '',   // 责任区大队
          zzdw: '',       // 主战队伍
          jqdj: '', //警情等级
          jqbq: '', //警情标签
          tagIds: '', //警情标签
          allTrrysMin:undefined,//投入人员总数最少
          allTrrysMax:undefined,//投入人员总数最大
          /** *************** 出动信息字段 */
          // respondType: "", // 参战形式
          // czqkdm: "", // 处置情况
          // dcshzqkdm: "", // 到场时火灾情况
          // hyzgbm: "", // 行业主管部门
          // jlxcjldmMin: "", // 距离现场开始值
          // jlxcjldmMax: "", // 距离现场结束值
          // xcrybkqkdmMin: "", // 现场人员被困数1
          // xcrybkqkdmMax: "", // 现场人员被困数2
          // useHydrant: "", // 是否采用公用消防栓供水
          // zhy: "", // 带队指挥员姓名
          // zhyzw: "", // 带队指挥员职务
          // qqzhbZhcddm: "", // 全勤指挥部
          // isLddw: "", // 是否联动单位
          // qwMin: "", // 气温min
          // qwMax: "", // 气温max
          // fxdm: "", // 风向
          // windForce: "", // 风力
          // weather: "", // 天气
          // insideAttack: "", // 是否内攻
          // hzJzscsdm: "", // 火灾技战术措施
          // qxjyJzscsdm: "", // 抢险救援技战术措施
          // carCountMin: "", // 投入总车辆数-下限
          // carCountMax: "", // 投入总车辆数-上限
          // trrysMin: "", // 投入总人员数-下限
          // trrysMax: "", // 投入总人员数-上限
          // isCzrysw: "", // 是否有人员伤亡
          // wxxfzMc: "", // 微型消防站名称
          // // 微型消防站数量
          // mjjydMc: "", // 民间救援队
          // // 民间救援队数量
          // qyzzdMc: "", // 企业专职队名称
          // // 企业专职队数量

          // /** *************** 火灾（灾情）信息字段 */
          // sfzzdc: "", // 是否正在调查
          // zqlbdm: "", // 火灾等级
          // qwhz: "", // 是否轻微火灾，1是0否
          // paramZqsjFrom: "", // 起火开始时间
          // paramZqsjTo: "", // 起火结束时间
          // zqdd: "", // 起火地点
          // lxdh: "", // 失火单位/户主联系电话
          // dwtyshxydm: "", // 单位统一社会信用代码
          // qydm: "", // 区域
          // jdjcqk: "", // 消防救援机构监督检查范围
          // sgqtdcbm: "", // 事故调查牵头部门
          // jjlxdm: "", // 经济类型
          // hylbdm: "", // 所属行业
          // qhcslb: "", // 起火场所类型
          // qhcsms: "",
          // qhcsdm: "", // 起火场所
          // sfsjycdm: "", // 是否属世界遗产
          // jzsyyt: "", // 建筑使用用途
          // jzlbdm: "", // 建筑类别
          // jznhdjdm: "", // 建筑耐火等级
          // jzjgdm: "", // 建筑结构
          // hzsfmydljjz: "", // 火灾是否蔓延到邻近建筑
          // sffshr: "", // 是否发生轰燃
          // shjzmcsfkq: "", // 门窗是否开启
          // zdbjxtsfaz: "", // 自动报警系统
          // zdmhxtsfaz: "", // 自动灭火系统
          // fpyxtsfaz: "", // 防排烟系统
          // fhjl: "", // 防火卷帘
          // snxhsxtsaz: "", // 室内消火栓系统
          // fhfq: "", // 防火分区
          // fhjj: "", // 防火间距
          // sstd: "", // 疏散通道
          // yjck: "", // 紧急出口
          // yjsszm: "", // 应急疏散照明
          // sflw: "", // 联网情况
          // sfbx: "", // 是否保险
          // sfdfhzsh: "", // 是否单方火灾事故
          // qhwms: "",
          // qhwfldm: "", // 起火物
          // hzyyms: "",
          // hzyydm: "", // 火灾原因
          // dcfs: "", // 调查方式
          // sfla: "", // 是否立案
          // sfxsfh: "", // 是否属刑事放火
          // sfaqscsg: "", // 是否属安全生产事故
          // sfyrsw: "", // 是否有人员伤亡  是1 否0
          pageNum: 1,
          pageSize: 20,
          dataQueryTypeCx: 1 ,//警情类型区分综合警情查询
          allCarCountMin:undefined,//投入车辆数最小值
          allCarCountMax:undefined,//投入车辆数最大值
        };
        this.formData.paramJjsjFrom = getNearlyRecentDays(30)[0]; // 接警起止时间
        this.formData.paramJjsjTo = getNearlyRecentDays(30)[1]; // 接警截止时间
        this.selectDate = 2;
        (this.shztArr = []), // 出动报告状态
          (this.tbZqxxQueryVoshzt = []), // 报告状态（-3：待完善；-2：被退回；-1：审核终止；0：未送审；1：审核中；2：审批通过；3：被挂起；99：归档；4：被驳回）
          (this.total = 0);
        this.tableData = [];
        this.xzqyName = ""; // 行政区域显示名称
        this.jjsj = ""; // 接警起止时间（请求参数 接警时间）
        this.paramZqsj = ""; // 起火时间
        this.resultData = {
          总警情数: '-',
          火灾扑救: '-',
          抢险救援: '-',
          社会救助: '-',
          公务执勤: '-',
          反恐排爆: '-',
          其他出动: '-',
          出动次数: '-',
          出动车辆次: '-',
          出动人次: '-'
        };
        // 重置数据值之后展开筛选条件
        this.policeHide = this.dispatchHide = this.fireHide = true;
        this.zqxxQhcsList = [];
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
        if (this.shztArr.length != 0) {
          this.formData.cdShzts = this.shztArr.join(",");
        }
        if (this.tbZqxxQueryVoshzt.length != 0) {
          this.formData.zqShtzs = this.tbZqxxQueryVoshzt.join(",");
        }
        this.getTabList();
      },
      /**
       * 查询条件展开显示
       * @params val
       * val==1 警情信息 val==2 出动信息 val==3 火灾信息
       */
      showSelect(val) {
        switch (val) {
          case 1:
            this.policeHide = !this.policeHide;
            break;
          case 2:
            this.dispatchHide = !this.dispatchHide;
            break;
          case 3:
            this.fireHide = !this.fireHide;
            break;
        }
      }, //   设置数据传入
      getSelectInfo() {
        // 简单的option 请求
        const _this = this;
        cdOptions.forEach((item, index) => {
          getSelectOptions(item)
            .then(res => {
              _this.Options[item] = res.data;
            })
            .catch(res => {
              console.error(res);
            });
        });
        fireOption.forEach(item => {
          getSelectOptions(item).then(res => {
            if (res.code === 200) {
              _this.options[item] = res.data;
            }
          });
        });
        fireTreeOption.forEach(item => {
          getTreeOptions({
            dictType: item.dictType,
            parentValue: item.parentValue
          }).then(res => {
            if (res.code === 200) {
              _this.options[item.dictType] = res.data;
            }
          });
        });
        //警情等级
        getOptions("tb_dic_jqdj").then(res => {
          if (res.code !== 200) {
            return;
          }
          this.jqdj = res.data;
        });
         //警情标签
          
        },

      // 打开行政区域的模态框
      openProvModal() {
        this.$refs.provModal.toggle();
      },
      /*setProvValue(obj, {first, second, third, last}) {
          this.formData.xzqydmSj = obj.id;
          this.selectedAreaInfo = obj;
          this.xzqyName = `${first} ${second} ${third} ${last}`;
      },*/
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
        sessionStorage.setItem(
          "dataSearch_to_dataReport_params",
          JSON.stringify(params)
        );
        this.$router.push({
          path: "/eqw/dataReport",
          query: {rptSource: "jq"}
        });
      },

      //数据下载
      downloadData() {
        this.downloading = true;
        let excelTitle = '综合查询-';
        this.listLoading = true;
        jqxxCommomDownload(this.formData)
          .then(response => {
            if (response.code == 200) {
              downloadFile(excelTitle, response.data.stream);
            }
          })
          .finally(() => {
            this.listLoading = false;
             this.downloading = false;
          });
      },

      // 打开起火场所选择框
      openQhcsMul() {
        if (this.formData.qhcslb == "") {
          this.$message.warning("请先选择起火场所类型");
          return;
        }
        this.$refs.Mulmodel.toggle();
        this.$refs.Mulmodel.echo(this.zqxxQhcsList);
      },
      // 接收起火场所数据
      setMulVals(arr) {
        this.qhcsms = '';
        this.qhcsdm = '';
        this.zqxxQhcsList = [];
        this.zqxxQhcsList = arr;
        var arrLabel = [];
        var arrVal = [];
        arr.forEach(item => {
          arrLabel.push(item.dictLabel);
          arrVal.push(item.dictValue);
        });
        this.formData.qhcsms = arrLabel.join(',');
        this.formData.qhcsdm = arrVal.join(',');
      },
      // 清空起火场所数据
      cleanQhcsMul() {
        this.formData.qhcsms = "";
        this.formData.qhcsdm = "";
        this.zqxxQhcsList = [];
      },

      // 打开起火物选择框
      openQhwMul() {
        this.$refs.fireObjecMul.toggle();
        this.$refs.fireObjecMul.echo(this.formData.qhwfldm);
      },
      // 接受起火物数据
      setFireMulVal(arr) {
        // this.formData.qhwfldm = "";
        // this.formData.qhwms = "";
        // this.formData.qhwms = arr[0].dictLabel;
        // this.formData.qhwfldm = arr[0].dictValue;
        var arrLabel = [];
        var arrDm = [];
        arr.forEach(item => {
          arrLabel.push(item.dictLabel);
          arrDm.push(item.dictValue);
        });
        this.formData.qhwfldm = '';
        this.formData.qhwms = '';
        this.formData.qhwms = arrLabel.join(',');
        this.formData.qhwfldm = arrDm.join(',');
      },
      // 清空起火物数据
      cleanQhwMul() {
        this.formData.qhwfldm = "";
        this.formData.qhwms = "";
      },
      // 打开起火原因选择框
      openQhyyMul() {
        this.$refs.fireReasonMul.toggle();
        this.$refs.Mulmodel.echo(this.formData.hzyydm);
      },
      // 接受起火原因数据
      setFireReasonMulVal(arr) {
        const fireReasonLabels = [];
        const fireReasonValues = [];
        arr.map(r => {
          fireReasonLabels.push(r.dictLabel);
          fireReasonValues.push(r.dictValue);
        });
        this.formData.hzyyms = fireReasonLabels.join('，'); // 控件展示的文本
        this.formData.hzyydm = fireReasonValues.join(','); // 查询提交的入参
      },
      // 清空起火原因数据
      cleanQhyyMul() {
        this.formData.hzyyms = "";
        this.formData.hzyydm = "";
      },
      getTabList() {
        this.querying = true;
        if(this.formData.selectedAreaInfo){
          delete this.formData.selectedAreaInfo
        };
        jqxxCommomSearch(this.formData)
          .then(res => {
            if (res.code == 200) {
              this.total = res.data.table == undefined ? 0 : res.data.table.total;
              this.tableData =
                res.data.table == undefined ? [] : res.data.table.rows;
              this.querying = false;
            }
          })
          .finally(() => {
            this.querying = false;
          });
      },
      downloadTabList() {
        this.listLoading = true;
        if(this.formData.selectedAreaInfo){
          delete this.formData.selectedAreaInfo
        };
        jqxxCommomDownload(this.formData)
          .then(res => {
            if (res.code == 200) {
              this.total = res.data.table == undefined ? 0 : res.data.table.total;
              this.tableData =
                res.data.table == undefined ? [] : res.data.table.rows;
              this.listLoading = false;
            }
          })
          .finally(() => {
            this.listLoading = false;
          });
      },
      getSelectJqxxCommonCount() {
        this.listLoading = true;
        if(this.formData.selectedAreaInfo){
          delete this.formData.selectedAreaInfo
        };
        selectJqxxCommonCount(this.formData)
          .then(res => {
            if (res.code == 200) {
              this.resultData = res.data[0];
              this.listLoading = false;
              this.showDownBtn = true;
            }
          })
          .finally(() => {
            this.listLoading = false;
          });
      },
      toDetailClick(data) {
        this.$router.push({
          path: "/showDetail/jqxxShowDetail",
          query: {
            jqbh: data.jqbh,
            jqmc: data.jqmc
          }
        });
      },
      paramJjsjTimeChange(val) {
        let nowChangeGettime = new Date(val).getTime();
        if (this.formData.paramJjsjFrom && this.formData.paramJjsjTo) {
          let paramJjsjFromGettime = new Date(
            this.formData.paramJjsjFrom
          ).getTime();
          let paramJjsjToGettime = new Date(this.formData.paramJjsjTo).getTime();
          if (paramJjsjFromGettime > paramJjsjToGettime) {
            this.$message.warning("接警开始时间不能大于接警结束时间");
            if (nowChangeGettime == paramJjsjFromGettime) {
              //如果当前选的是开始时间，开始时间恢复到初始时间
              this.formData.paramJjsjFrom = getNearlyRecentDays(30)[0]; // 接警起止时间
            } else if (nowChangeGettime == paramJjsjToGettime) {
              //如果当前选的是结束时间，结束时间恢复到初始时间
              this.formData.paramJjsjTo = getNearlyRecentDays(30)[1]; // 接警截止时间
            }
          }
        }
      },
      paramZqsjTimeChange(val) {
        let nowChangeGettime = new Date(val).getTime();
        if (this.formData.paramZqsjFrom && this.formData.paramZqsjTo) {
          let paramZqsjFromGettime = new Date(
            this.formData.paramZqsjFrom
          ).getTime();
          let paramZqsjToGettime = new Date(this.formData.paramZqsjTo).getTime();
          if (paramZqsjFromGettime > paramZqsjToGettime) {
            this.$message.warning("起火开始时间不能大于起火结束时间");
            if (nowChangeGettime == paramZqsjFromGettime) {
              //如果当前选的是开始时间，开始时间置空
              this.formData.paramZqsjFrom = "";
              // this.formData.paramZqsjFrom = getNearlyRecentDays(30)[0]; // 起火起止时间
            } else if (nowChangeGettime == paramZqsjToGettime) {
              //如果当前选的是结束时间，结束时间置空
              this.formData.paramZqsjTo = "";
              // this.formData.paramZqsjTo = getNearlyRecentDays(30)[1]; // 起火截止时间
            }
          }
        }
      },
      jqlxChange(val) {
        setTimeout( f => {
          let node = this.$refs['cascader'].getCheckedNodes();
          this.checkNodeLabel = [];
          let checkVals = [];
          node.forEach(item => {
            let label = '';
            this.getLabel(item,label);
            checkVals.push(item.value);
          });
          this.formData.sjlbdm = checkVals.join(',');
          console.log(this.sjlbdm);
          console.log(this.$refs['cascader'].getCheckedNodes());
        }, 0);
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
      fireTypeChange()  {
        this.cleanQhcsMul();
      },
      clearArea(){
        this.xzqyName = '';
        this.formData.xzqydmSj = '';
        this.$refs.provModal.clear();
      },
      dateRangeBtn(date){
        this.dateRange = [];
        let end = new Date();
        let start = new Date();
        start.setHours(0,0,0,0);
        end.setHours(23,59,59,0);
        let year = new Date().getFullYear();
        let month = new Date().getMonth();
        switch(date) {
          case 1:
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            end.setTime(end.getTime() - 3600 * 1000 * 24 );
            break;
          case 2:
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            end.setTime(end.getTime() - 3600 * 1000 * 24 );
            break;
          case 3:
            start.setDate(1);
            break;
          case 4:
            start.setMonth(0);
            start.setDate(1);
            break;
          case 5:
            if(month == 0){
              month = 12;
              year = year -1;
            }else if(month < 10){
              month = '0' + month;
            }
            let myDate = new Date(year, month, 0);
            start = new Date(year + '-' + month + "-" + "01").setHours(0,0,0,0);
            end = new Date(year + '-' + month + '-' +  myDate.getDate()).setHours(23,59,59,0);
            break;
          case 6:
            let yearNew = new Date().getFullYear()-1;
            start = new Date(yearNew + '-01-01').setHours(0,0,0,0);
            end = new Date(yearNew + '-12-31').setHours(23,59,59,0);
            break;
        }
        this.formData.paramJjsjFrom = formdate(new Date(start));
        this.formData.paramJjsjTo = formdate(new Date(end));
      }
    }
  };
</script>
<style lang="scss" scoped>
  .policeSentimentSearch {
    .el-row {
      .el-col {
        margin: 5px 0px;
        .divInclude,
        .divIncludeTime {
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
        .form-item{
          display: flex;
        }
      }
    }
    .text {
      display: inline-block;
      line-height: 32px;
      width: 160px;
    }
    .text_date{
      display: inline-block;
      line-height: 32px;
      width: 160px;
      // flex-shrink: 0;
    }
    .form-item-ctrl-date {
      display: inline-flex;
      height: 32px;
      flex-grow: 1;
      width: 75%;
      .el-date-editor {
        width: 37%;
        height: 32px;
      }
    }
    .connect {
      width: 4%;
      text-align: center;
      display: inline-block;
      line-height: 32px;
    }
    .el-input,
    .el-select,
    .el-cascader {
      width: 50%;
      height: 32px;
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
    .police_information,
    .dispatch_information,
    .fire_information {
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
