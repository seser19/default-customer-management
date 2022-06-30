<template lang="pug">
.policeSentimentSearch
  .police_information
    h2.title 警情信息
      span.hide(@click='showSelect(1)') {{ policeHide ? "收起" : "展开" }}
        i(:class='policeHide ? "el-icon-arrow-down" : "el-icon-arrow-right"')
    el-row
      el-col(:span='8')
        span.text 警情编码
        el-input(v-model='formData.jqbh', placeholder='请输入')
      el-col(:span='16')
        span.text_date 接警起止时间
        .form-item-ctrl-date
          el-date-picker(
            v-model='formData.paramJjsjFrom',
            type='datetime',
            format='yyyy-MM-dd HH:mm:ss',
            value-format='yyyy-MM-dd HH:mm:ss',
            @change='paramJjsjTimeChange',
            placeholder='接警起始时间',
            default-time='[\'00:00:00\']',
            :clearable='false'
          )
          span.connect -
          el-date-picker(
            v-model='formData.paramJjsjTo',
            type='datetime',
            format='yyyy-MM-dd HH:mm:ss',
            value-format='yyyy-MM-dd HH:mm:ss',
            @change='paramJjsjTimeChange',
            placeholder='接警结束时间',
            default-time='[\'00:00:00\']',
            :clearable='false'
          )
          el-select(
            v-model='selectDate',
            placeholder='请选择',
            @change='dateRangeBtn(selectDate)',
            style='margin-left: 2%; width: 20%'
          )
            el-option(
              v-for='item in dateList',
              :key='item.value',
              :label='item.name',
              :value='item.value'
            )
              span(
                @click='dateRangeBtn(selectDate)',
                style='display: inline-block'
              ) {{ item.name }}
    el-row
      el-col(:span='8')
        span.text 行政区域
        el-input(
          v-model='xzqyName',
          placeholder='请选择',
          readonly,
          @focus='openProvModal()'
        )
          i.iconfont.icon-icon-test(
            slot='suffix',
            @click='openProvModal()',
            style='line-height: 32px'
          )
          i.el-icon-circle-close(
            slot='suffix',
            style='margin-left: 5px; cursor: pointer',
            @click='clearArea()',
            v-show='xzqyName'
          )
        input(v-model='formData.xzqydmSj', type='hidden')
      el-col(:span='8')
        span.text 警情地址
        el-input(v-model='formData.jqfsdd', placeholder='请输入')
      el-col(:span='8')
        span.text 警情类型
        el-cascader(
          ref='cascader',
          v-model='formData.sjlbdm',
          :props='props',
          placeholder='警情类型',
          @change='jqlxChange',
          clearable,
          multiple,
          collapse-tags
        )
    el-row(v-show='policeHide')
      el-col(:span='8')
        span.text 发送单位
        el-input(
          v-model='formData.sender',
          placeholder='请输入',
          readonly,
          @focus='openSenderMulModal'
        )
          i.iconfont.icon-icon-test(
            slot='suffix',
            style='line-height: 32px',
            @click='openSenderMulModal'
          )
          i.el-icon-circle-close(
            slot='suffix',
            style='line-height: 30px; cursor: pointer',
            @click='cleanSenderMulValue',
            v-show='formData.sender'
          )
      el-col(:span='8')
        span.text 单位名称/户主名
        el-input(v-model='formData.hzm', placeholder='请输入')
      el-col(:span='8')
        span.text 119案件编号
        el-input(v-model='formData.caseNbr', placeholder='请输入', clearable)
      el-col(:span='8')
        span.text 出动队伍
        el-input(
          v-model='xfdwdmName',
          placeholder='请选择',
          readonly,
          @focus='openMulModal()'
        )
          i.iconfont.icon-icon-test(
            slot='suffix',
            @click='openMulModal()',
            style='line-height: 32px'
          )
          i.el-icon-circle-close(
            slot='suffix',
            style='line-height: 30px; cursor: pointer',
            @click='cleanMulModal',
            v-show='xfdwdmName'
          )
      el-col(:span='8')
        span.text 责任区大队
        el-input(
          v-model='zrqdddmName',
          placeholder='请选择',
          readonly,
          @focus='openDutyMulModal()'
        )
          i.iconfont.icon-icon-test(
            slot='suffix',
            @click='openDutyMulModal()',
            style='line-height: 32px'
          )
          i.el-icon-circle-close(
            slot='suffix',
            style='line-height: 30px; cursor: pointer',
            @click='cleanDutyMulModal',
            v-show='zrqdddmName'
          )
      el-col(:span='8')
        span.text 主战队伍
        el-input(
          v-model='zzdwName',
          placeholder='请选择',
          readonly,
          @focus='openZzMulModal()'
        )
          i.iconfont.icon-icon-test(
            slot='suffix',
            @click='openZzMulModal()',
            style='line-height: 32px'
          )
          i.el-icon-circle-close(
            slot='suffix',
            style='line-height: 30px; cursor: pointer',
            @click='cleanZzMulModal',
            v-show='zzdwName'
          )
  .dispatch_information
    h2.title 出动信息
      span.hide(@click='showSelect(2)') {{ dispatchHide ? "收起" : "展开" }}
        i(:class='dispatchHide ? "el-icon-arrow-down" : "el-icon-arrow-right"')
    el-row
      el-col(:span='8')
        span.text 出动编号
        el-input(v-model='formData.cdbh', placeholder='请输入')

      el-col(:span='8')
        span.text 参战形式
        el-select(v-model='formData.respondType', placeholder='请选择', @change="czxszy()" clearable)
          el-option(label='主战', value='010000')
          el-option(label='增援', value='020000')
      el-col(:span='8')
        span.text 处置情况
        el-select(v-model='formData.czqkdm', placeholder='请输入', clearable)
          el-option(
            v-for='item in Options.tb_dic_czqk',
            :key='item.dictValue',
            :label='item.dictLabel',
            :value='item.dictValue'
          )

    el-row(v-show='dispatchHide')
      el-col(:span='8')
        span.text 到场时火灾情况
        el-select(v-model='formData.dcshzqkdm', placeholder='请输入', clearable)
          el-option(
            v-for='item in Options.tb_dic_hzqk',
            :key='item.dictValue',
            :label='item.dictLabel',
            :value='item.dictValue'
          )
      el-col(:span='8')
        span.text 行业主管部门
        el-select(v-model='formData.hyzgbm', placeholder='请选择', clearable)
          el-option(
            v-for='item in Options.tb_dic_hyzgbm',
            :key='item.dictValue',
            :label='item.dictLabel',
            :value='item.dictValue'
          )
      el-col(:span='8')
        span.text 距离现场
        .divInclude
          el-input(v-model='formData.jlxcjldmMin', placeholder='请输入')
          span.connect -
          el-input(v-model='formData.jlxcjldmMax', placeholder='请输入')
      el-col(:span='8')
        span.text 现场人员被困
        .divInclude
          el-input(v-model='formData.xcrybkqkdmMin', placeholder='请输入')
          span.connect -
          el-input(v-model='formData.xcrybkqkdmMax', placeholder='请输入')
      el-col(:span='8')
        span.text 是否采用公用消防栓供水
        el-select(v-model='formData.useHydrant', placeholder='请选择', clearable)
          el-option(label='是', value='1')
          el-option(label='否', value='0')
      el-col(:span='8')
        span.text 带队指挥员姓名
        el-input(v-model='formData.zhy', placeholder='请输入')
      el-col(:span='8')
        span.text 带队指挥员职务
        el-select(v-model='formData.zhyzw', placeholder='请选择', clearable)
          el-option(
            v-for='item in Options.tb_dic_ddzhzw',
            :key='item.dictValue',
            :label='item.dictLabel',
            :value='item.dictValue'
          )
      el-col(:span='8')
        span.text 全勤指挥部
        el-select(v-model='formData.qqzhbZhcddm', placeholder='请选择', clearable)
          el-option(
            v-for='item in Options.tb_dic_xczh',
            :key='item.dictValue',
            :label='item.dictLabel',
            :value='item.dictValue'
          )
      el-col(:span='8')
        span.text 是否有联动单位
        el-select(v-model='formData.isLddw', placeholder='请选择', clearable)
          el-option(label='是', value='1')
          el-option(label='否', value='0')
      el-col(:span='8')
        span.text 气温
        .divInclude
          el-input(v-model='formData.qwMin', placeholder='请输入')
          span.connect -
          el-input(v-model='formData.qwMax', placeholder='请输入')
      el-col(:span='8')
        span.text 风向
        el-select(v-model='formData.fxdm', placeholder='请选择', clearable)
          el-option(
            v-for='item in Options.tb_dic_fx',
            :key='item.dictValue',
            :label='item.dictLabel',
            :value='item.dictValue'
          )
      el-col(:span='8')
        span.text 风力
        el-input(v-model='formData.windForce', placeholder='请输入')
      el-col(:span='8')
        span.text 天气
        el-select(v-model='formData.weather', placeholder='请选择', clearable)
          el-option(
            v-for='item in Options.tb_dic_qh',
            :key='item.dictValue',
            :label='item.dictLabel',
            :value='item.dictValue'
          )
      el-col(:span='8')
        span.text 是否内攻
        el-select(
          v-model='formData.insideAttack',
          placeholder='请选择',
          clearable
        )
          el-option(label='是', value='1')
          el-option(label='否', value='0')
      el-col(:span='8')
        span.text 火灾技战术措施
        el-input(v-model='formData.hzJzscsdm', placeholder='请输入')
      el-col(:span='8')
        span.text 抢险救援战术措施
        el-input(v-model='formData.qxjyJzscsdm', placeholder='请输入')
      el-col(:span='8')
        span.text 投入车辆数
        .divInclude
          el-input(v-model='formData.carCountMin', placeholder='请输入')
          span.connect -
          el-input(v-model='formData.carCountMax', placeholder='请输入')
      el-col(:span='8')
        span.text 投入人员数
        .divInclude
          el-input(v-model='formData.trrysMin', placeholder='请输入')
          span.connect -
          el-input(v-model='formData.trrysMax', placeholder='请输入')
      el-col(:span='8')
        span.text 其他消防力量单位性质
        el-select(v-model='formData.deptNature', placeholder='请选择', clearable)
          el-option(label='志愿队', value='7')
          el-option(label='专职队', value='3')
      el-col(:span='8')
        span.text 志愿队名称
        el-input(v-model='formData.mjjydMc', placeholder='请输入')
      el-col(:span='8')
        span.text 专职队名称
        el-input(v-model='formData.qyzzdMc', placeholder='请输入')
      el-col(:span='8')
        span.text 是否有人员伤亡
        el-select(v-model='formData.isCzrysw', placeholder='请选择', clearable)
          el-option(label='是', value='1')
          el-option(label='否', value='2')
      el-col(:span='8')
        span.text 报告状态
        el-select(
          v-model='shztArr',
          placeholder='请选择',
          clearable,
          multiple,
          collapse-tags
        )
          el-option(label='被退回', value='-2')
          el-option(label='被终止', value='-1')
          el-option(label='待填报', value='0')
          el-option(label='审核中', value='1')
          el-option(label='已审核', value='2')
          el-option(label='已归档', value='99')
          el-option(label='被驳回', value='4')
      el-col(:span='8')
        span.text 疏散人数
        .divInclude
          el-input(v-model='formData.ssrsMin', placeholder='请输入')
          span.connect -
          el-input(v-model='formData.ssrsMax', placeholder='请输入')
      el-col(:span='8')
        span.text 抢救人数
        .divInclude
          el-input(v-model='formData.rescueNumMin', placeholder='请输入')
          span.connect -
          el-input(v-model='formData.rescueNumMax', placeholder='请输入')
      el-col(:span='8')
        span.text 保护财产价值(元)
        .divInclude
          el-input(v-model='formData.protectPropValMin', placeholder='请输入')
          span.connect -
          el-input(v-model='formData.protectPropValMax', placeholder='请输入')
      el-col(:span='8' v-if="formData.respondType !== '020000'")
        span.text 抢救财产价值(元)
        .divInclude
          el-input(v-model='formData.qjccjzMin', placeholder='请输入')
          span.connect -
          el-input(v-model='formData.qjccjzMax', placeholder='请输入')
      el-col(:span='8')
        span.text 生还人数
        .divInclude
          el-input(v-model='formData.shrsMin', placeholder='请输入')
          span.connect -
          el-input(v-model='formData.shrsMax', placeholder='请输入')
      el-col(:span='8')
        span.text 死亡人数
        .divInclude
          el-input(v-model='formData.deadNumMin', placeholder='请输入')
          span.connect -
          el-input(v-model='formData.deadNumMax', placeholder='请输入')

      el-col(:span='8')
        span.text 处置时长（秒）
        .divInclude
          el-input(v-model='formData.czscMin', placeholder='请输入')
          span.connect -
          el-input(v-model='formData.czscMax', placeholder='请输入')

      el-col(:span='8')
        span.text 处置经过
        el-input(v-model='formData.czjg', placeholder='请输入')

      el-col(:span='8')
        span.text 是否超时
        el-select(v-model='formData.isTimeoutCd', placeholder='请选择', clearable)
          el-option(label='是', value='1')
          el-option(label='否', value='0')

      el-col(:span='17')
        span.text_date 出动时间
        .form-item-ctrl-date
          el-date-picker(
            v-model='formData.cdsjMin',
            type='datetime',
            format='yyyy-MM-dd HH:mm:ss',
            value-format='yyyy-MM-dd HH:mm:ss',
            @change='paramJjsjTimeChange',
            placeholder='出动起始时间',
            default-time='[\'00:00:00\']',
            :clearable='false'
          )
          span.connect -
          el-date-picker(
            v-model='formData.cdsjMax',
            type='datetime',
            format='yyyy-MM-dd HH:mm:ss',
            value-format='yyyy-MM-dd HH:mm:ss',
            @change='paramJjsjTimeChange',
            placeholder='出动结束时间',
            default-time='[\'00:00:00\']',
            :clearable='false'
          )
      el-col(:span='17')
        span.text_date 到场时间
        .form-item-ctrl-date
          el-date-picker(
            v-model='formData.dcsjMin',
            type='datetime',
            format='yyyy-MM-dd HH:mm:ss',
            value-format='yyyy-MM-dd HH:mm:ss',
            @change='paramJjsjTimeChange',
            placeholder='到场起始时间',
            default-time='[\'00:00:00\']',
            :clearable='false'
          )
          span.connect -
          el-date-picker(
            v-model='formData.dcsjMax',
            type='datetime',
            format='yyyy-MM-dd HH:mm:ss',
            value-format='yyyy-MM-dd HH:mm:ss',
            @change='paramJjsjTimeChange',
            placeholder='到场结束时间',
            default-time='[\'00:00:00\']',
            :clearable='false'
          )
      el-col(:span='17')
        span.text_date 归队时间
        .form-item-ctrl-date
          el-date-picker(
            v-model='formData.fdsjMin',
            type='datetime',
            format='yyyy-MM-dd HH:mm:ss',
            value-format='yyyy-MM-dd HH:mm:ss',
            @change='paramJjsjTimeChange',
            placeholder='归队起始时间',
            default-time='[\'00:00:00\']',
            :clearable='false'
          )
          span.connect -
          el-date-picker(
            v-model='formData.fdsjMax',
            type='datetime',
            format='yyyy-MM-dd HH:mm:ss',
            value-format='yyyy-MM-dd HH:mm:ss',
            @change='paramJjsjTimeChange',
            placeholder='归队结束时间',
            default-time='[\'00:00:00\']',
            :clearable='false'
          )


  el-row(v-if='!isCheckNewTask')
    el-col(:span='14')
      el-button(type='primary', @click='searchBtn' :loading="querying") 查&nbsp;询
      el-button(@click='resetBtn') 重&nbsp;置
      el-button(type='primary', @click='toReport' :loading="downloading") 生成报表
      el-button(
        type='primary',
        v-if='showDownBtn',
        @click='searchBtn(this, true)'
      ) 清单导出
    el-col(:span='10')
      //.synchronizeTime(v-if="deptLevel != '1'" style="text-align:right;")
        span 数据统计时间截止至&nbsp;
          span(style="color:red; margin-right:5px;") {{synchronizationTime || '-'}}
          el-button(v-if="deptLevel == '2'" class="btn_orange" @click.prevent="dataSynchronize()" :loading="btnLoading") 数据同步
  .list-box(v-if='!isCheckNewTask', v-loading='listLoading')
    .query-resule
      p.resule-title 查询结果：
      .resule-box 共查询到 #[span {{ resultData.cdcsjl || 0 }}] 次出动记录，出动车辆 #[span {{ resultData.cdcl || 0 }}] 辆，出动警力 #[span {{ resultData.cdjl || 0 }}] 人，抢救被困人员 #[span {{ resultData.qjbkry || 0 }}] 人，疏散被困人员 #[span {{ resultData.ssbkry || 0 }}] 人，抢救财产价值 #[span {{ resultData.qqccjz || 0 }}] 元，保护财产价值#[span {{ resultData.bhccjz || 0 }}] 元，参战人员死亡 #[span {{ resultData.czrysw || 0 }}] 人，受伤 #[span {{ resultData.czryss || 0 }}] 人。
    el-table(:data='tableData', style='width: 100%', v-loading='querying')
      el-table-column(
        prop='cdbh',
        label='出动编号',
        sortable,
        show-overflow-tooltip
      )
      el-table-column(
        prop='jqbh',
        label='警情编号',
        sortable,
        show-overflow-tooltip
      )
      el-table-column(
        prop='jjsj',
        label='接警时间',
        sortable,
        show-overflow-tooltip
      )
      el-table-column(prop='xzqydmSj', label='行政区域', sortable, width='150')
      el-table-column(prop='jqfsdd', label='接警地址', width='250', sortable)
        template(slot-scope='scope')
          el-tooltip.item(
            v-show='scope.row.jqfsdd.length>15',
            effect='dark',
            :content='scope.row.jqfsdd',
            placement='top-start'
          )
            div {{ scope.row.jqfsdd.substring(0, 15) }}...
          el-tooltip.item(
            v-show='scope.row.jqfsdd.length<=15',
            effect='dark',
            :content='scope.row.jqfsdd',
            placement='top-start'
          )
            div {{ scope.row.jqfsdd.substring(0, 15) }}
      el-table-column(
        prop='sjlbmc',
        label='警情类型',
        sortable,
        show-overflow-tooltip
      )
      el-table-column(
        prop='zrqddmc',
        label='出动队伍',
        sortable,
        show-overflow-tooltip
      )
      el-table-column(
        prop='respondType',
        label='参战形式',
        sortable,
        show-overflow-tooltip
      )
      el-table-column(
        prop='',
        label='投入力量',
        width='80',
        sortable,
        show-overflow-tooltip
      )
        template(slot-scope='scope')
          div {{ scope.row.carCount }} 车 {{ scope.row.trrys }} 人
      el-table-column(
        prop='shzt',
        label='审批状态',
        sortable,
        show-overflow-tooltip
      )
        template(slot-scope='scope')
          .pic(v-if='scope.row.shzt == 0')
            img(src='../../../icons/weisongshen.svg')
            span 待填报
          .pic(v-if='scope.row.shzt == 1')
            img(src='../../../icons/shenpizhong.svg')
            span 审核中
          .pic(v-if='scope.row.shzt == 2')
            img(src='../../../icons/yishenpi.svg')
            span 已审核
          .pic(v-if='scope.row.shzt == 3')
            img(src='../../../icons/guaqi.svg')
            span 被挂起
          .pic(v-if='scope.row.shzt == -1')
            img(src='../../../icons/beizhongzhi.svg')
            span 待修改
          .pic(v-if='scope.row.shzt == -2')
            img(src='../../../icons/tuihui.svg')
            span 被退回
          .pic(v-if='scope.row.shzt == -3')
            img(src='../../../icons/daiwanshan.svg')
            span 待完善
          .pic(v-if='scope.row.shzt == 4')
            img(src='../../../icons/tuihui.svg')
            span 被驳回
          .pic(v-if='scope.row.shzt == 99')
            img(src='../../../icons/yishenpi.svg')
            span 已归档
      el-table-column(prop='', label='操作', width='80')
        template(slot-scope='scope')
          el-button(type='text', @click='toDetailClick(scope.row)') 查看
    .pagination_zone(v-show='total > 0')
      pagination(
        :total='total',
        :page.sync='formData.pageNum',
        :limit.sync='formData.pageSize',
        @pagination='getList'
      )
  //- 行政区域
  provModal(ref='provModal', @setProv='setProvValue')
    //- <!-- 出动队伍名称 -->
  cdMulModal(ref='mulModal', @setMulVal='setMulValue')
  mulModal(ref='zzMulModal', @setMulVal='setZzMulVal')
  dutyModal(ref='dutyModal', @setMulVal='setDutyMulValue')
  // 发送单位多选
  sender-mul-modal(ref='senderMulModal', @setMulVal='setSenderMulValue')
</template>
<script>
import { getJqcdlb } from "@/api/data/entry/jqxx";
import { cdOptions, cdOptionsList } from "./option";
import { getSelectOptions } from "@/api/data/entry/zqxx";
import provModal from "@/views/eqw/customSearch/components/multiProvModal";
import { cdxxCommomSearch, cdxxCommomDownload, cdxxCommomCountSearch } from "@/api/data/aduit/cdxx";
import { getInitTime, getNearlyRecentDays, formdate } from "@/utils/dateTimeUtils.js";
import { downloadFile } from "@/utils/download-file.js";
import {
  synchronizeData,
  getSynchronizeDataTime,
  getLastEtlTime
} from "@/api/report/report";
// 出动队伍
import cdMulModal from "@/views/components/dataSeach/cdMulModal";
// 责任区大队
import dutyModal from "@/views/components/dataSeach/dutyModal";
// 主战
import mulModal from "@/views/components/dataSeach/mulModal";
import senderMulModal from '@/views/components/dataSeach/senderMulModal.vue';

export default {
  name: "DispatchSentimentSearch",
  components: {
    provModal,
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
    }
  },
  data () {
    return {
      listLoading: false,
      querying: false, //是否正在查询
      downloading: false, // 是否正在下载
      synchronizationTime: "",
      deptLevel: "",
      /* 查询信息显示隐藏 */
      policeHide: true, // 警情信息筛选展示隐藏
      dispatchHide: true, // 出动信息筛选展示隐藏
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
      paramJjsj: [],
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
        isTimeoutCd: "",//是否超时
        czscMin: "", //处置时长最小值
        czscMax: "", //处置时长最大值
        cdbh: "", //出动编号
        jqbh: "", // 警情编码
        paramJjsjFrom: "", // 接警开始时间
        paramJjsjTo: "", // 接警结束时间
        cdsjMin: "", //出动时间
        cdsjMax: "", // 出动时间
        dcsjMin: "", //到场时间
        dcsjMax: "", // 到场时间
        fdsjMin: "", //归队时间
        fdsjMax: "", // 归队时间
        xzqydmSj: "", // 行政区域（所属行政区）
        jqfsdd: "", // 警情地址（事件地点）
        sjlbdm: "", // 警情类型（出警类别）
        jqtbzh: "", // 发送单位
        sender: '', // 发送单位名称
        hzm: "", // 单位名称/户主名
        caseNbr: "",
        xfdwdm: '',   // 出动队伍
        zrqdddm: '',   // 责任区大队
        zzdw: '',       // 主战队伍
        /** *************** 出动信息字段 */
        czjg: '', //处置经过
        respondType: "", // 参战形式
        czqkdm: "", // 处置情况
        dcshzqkdm: "", // 到场时火灾情况
        hyzgbm: "", // 行业主管部门
        jlxcjldmMin: "", // 距离现场开始值
        jlxcjldmMax: "", // 距离现场结束值
        xcrybkqkdmMin: "", // 现场人员被困数1
        xcrybkqkdmMax: "", // 现场人员被困数2
        useHydrant: "", // 是否采用公用消防栓供水
        zhy: "", // 带队指挥员姓名
        zhyzw: "", // 带队指挥员职务
        qqzhbZhcddm: "", // 全勤指挥部
        isLddw: "", // 是否联动单位
        qwMin: "", // 气温min
        qwMax: "", // 气温max
        fxdm: "", // 风向
        windForce: "", // 风力
        weather: "", // 天气
        insideAttack: "", // 是否内攻
        hzJzscsdm: "", // 火灾技战术措施
        qxjyJzscsdm: "", // 抢险救援技战术措施
        carCountMin: "", // 投入总车辆数-下限
        carCountMax: "", // 投入总车辆数-上限
        trrysMin: "", // 投入总人员数-下限
        trrysMax: "", // 投入总人员数-上限
        isCzrysw: "", // 是否有人员伤亡
        deptNature: "", //队伍性质
        mjjydMc: "", // 民间救援队
        // 民间救援队数量
        qyzzdMc: "", // 企业专职队名称
        // 企业专职队数量
        pageNum: 1,
        pageSize: 20,
        rescueNumMin: "", //抢救人数-下限
        rescueNumMax: "",//抢救人数-上限
        ssrsMin: "", //疏散人数-下限
        ssrsMax: "", //疏散人数-上限
        protectPropValMin: undefined, //保护财产价值（起）
        protectPropValMax: undefined, //保护财产价值（止）
        qjccjzMin: undefined, //抢救财产价值（起）
        qjccjzMax: undefined, //抢救财产价值（止）
        shrsMin: "",//生还人数-下限
        shrsMax: "",//生还人数-上限
        deadNumMin: "",//死亡人数-下限
        deadNumMax: ""//死亡人数-下限
      },
      selectedAreaInfo: {},
      Options: cdOptionsList,
      total: 0,
      tableData: [],
      resultData: {
        cdcsjl: '-',
        cdcl: '-',
        cdjl: '-',
        qjbkry: '-',
        ssbkry: '-',
        qqccjz: '-',
        czrysw: '-',
        czryss: '-',
        bhccjz: '-'
      },
      shztArr: [], //报告状态（2：已审核；1：审核中；-1：被终止；-2：被退回；-3：待完善）
      showDownBtn: false,
      btnLoading: false,
      dateList: [{
        value: 1,
        name: '最近一周'
      }, {
        value: 2,
        name: '最近一个月'
      }, {
        value: 3,
        name: '本月'
      }, {
        value: 4,
        name: '本年'
      }, {
        value: 5,
        name: '上个月'
      }, {
        value: 6,
        name: '上年'
      }],
      selectDate: 2
    };
  },
  created () {
    //this.getLastTime();
    this.getSelectInfo();
    this.deptLevel = this.$store.state.user.deptLevel;
    // this.paramJjsj = getNearlyRecentDays(30);
    this.formData.paramJjsjFrom = getNearlyRecentDays()[0]; // 接警起止时间
    this.formData.paramJjsjTo = getNearlyRecentDays()[1]; // 接警截止时间
  },
  methods: {
    /** 出动队伍*/
    //打开多选框 并 回显
    openMulModal (type) {
      this.$refs.mulModal.echo(this.xfdwdmId);
      this.$refs.mulModal.toggle();
    },
    //将多选框的值赋给input
    setMulValue (arr) {
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
    cleanMulModal () {
      this.xfdwdmId = [];
      this.formData.xfdwdm = "";
      this.xfdwdmName = ""
    },
    /** 主战队伍 */
    // openCdMulModa
    openZzMulModal (type) {
      this.$refs.zzMulModal.echo(this.zzdwId);
      this.$refs.zzMulModal.toggle();
    },
    //将多选框的值赋给input
    setZzMulVal (arr) {
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
    cleanZzMulModal () {
      this.zzdwId = [];
      this.formData.zzdw = "";
      this.zzdwName = ""
    },
    /** 责任区队伍 */
    openDutyMulModal () {
      this.$refs.dutyModal.toggle();
    },
    setDutyMulValue (arr) {
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
    cleanDutyMulModal () {
      this.zrqdddmId = [];
      this.formData.zrqdddm = "";
      this.zrqdddmName = ""
    },


    // 同步数据
    async dataSynchronize () {
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
    getLastTime () {
      getLastEtlTime().then(res => {
        if (res.code == 200) this.synchronizationTime = res.data.cdtime || "";
      });
    },

    lazyLoad (node, resolve) {
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
    handle (arr) {
      // console.log(arr);
      arr.forEach(item => {
        if (item.isLast === "1") {
          item["leaf"] = true;
        }
      });
      return arr;
    },
    //参战形式为增援，清空抢救财产价值(元)
    czxszy(){
      if(this.formData.respondType =='020000' ){
        this.formData.qjccjzMin = "";
        this.formData.qjccjzMax = "";
      };
    },
    // 查询
    searchBtn (event, download = false) {
      if (!download) {
        this.showDownBtn = false;
      }
      // 查询之前隐藏筛选条件
      this.policeHide = this.dispatchHide = false;
      this.formData.pageNum = 1;
      this.formData.pageSize = 20;
      if (this.shztArr.length != 0) {
        this.formData.shzts = this.shztArr.join(",");
      } else {
        this.formData.shzts = '';
      }
      if (download) {
        this.downloadData();
        return;
      }
      this.getTabList();
      this.getCdxxCommomCountSearch();
    },
    resetBtn () {
      this.zzdwId = [];
      this.zzdwName = '';  // 主战队伍
      this.zrqdddmId = [];
      this.zrqdddmName = '';// 责任区大队
      this.xfdwdmId = [];
      this.xfdwdmName = '';// 出动队伍
      this.formData = {
        /** ************** 警情信息字段 */
        isTimeoutCd: "",//是否超时
        czscMin: "", //处置时长最小值
        czscMax: "", //处置时长最大值
        cdbh: "", //出动编号
        jqbh: "", // 警情编码
        paramJjsjFrom: "", // 接警开始时间
        paramJjsjTo: "", // 接警结束时间
        cdsjMin: "", //出动时间
        cdsjMax: "", // 出动时间
        dcsjMin: "", //到场时间
        dcsjMax: "", // 到场时间
        fdsjMin: "", //归队时间
        fdsjMax: "", // 归队时间
        xzqydmSj: "", // 行政区域（所属行政区）
        jqfsdd: "", // 警情地址（事件地点）
        sjlbdm: "", // 警情类型（出警类别）
        jqtbzh: "", // 发送单位
        sender: '', // 发送单位名称
        hzm: "", // 单位名称/户主名
        caseNbr: "",
        xfdwdm: '',   // 出动队伍
        zrqdddm: '',   // 责任区大队
        zzdw: '',       // 主战队伍
        /** *************** 出动信息字段 */
        czjg: '', //处置经过
        respondType: "", // 参战形式
        czqkdm: "", // 处置情况
        dcshzqkdm: "", // 到场时火灾情况
        hyzgbm: "", // 行业主管部门
        jlxcjldmMin: "", // 距离现场开始值
        jlxcjldmMax: "", // 距离现场结束值
        xcrybkqkdmMin: "", // 现场人员被困数1
        xcrybkqkdmMax: "", // 现场人员被困数2
        useHydrant: "", // 是否采用公用消防栓供水
        zhy: "", // 带队指挥员姓名
        zhyzw: "", // 带队指挥员职务
        qqzhbZhcddm: "", // 全勤指挥部
        isLddw: "", // 是否联动单位
        qwMin: "", // 气温min
        qwMax: "", // 气温max
        fxdm: "", // 风向
        windForce: "", // 风力
        weather: "", // 天气
        insideAttack: "", // 是否内攻
        hzJzscsdm: "", // 火灾技战术措施
        qxjyJzscsdm: "", // 抢险救援技战术措施
        carCountMin: "", // 投入总车辆数-下限
        carCountMax: "", // 投入总车辆数-上限
        trrysMin: "", // 投入总人员数-下限
        trrysMax: "", // 投入总人员数-上限
        isCzrysw: "", // 是否有人员伤亡
        deptNature: "", //队伍性质
        mjjydMc: "", // 民间救援队
        // 民间救援队数量
        qyzzdMc: "", // 企业专职队名称
        // 企业专职队数量
        pageNum: 1,
        pageSize: 20,
        rescueNumMin: "", //抢救人数-下限
        rescueNumMax: "", //抢救人数-上限
        ssrsMin: "", //疏散人数-下限
        ssrsMax: "", //疏散人数-上限
        protectPropValMin: undefined, //保护财产价值（起）
        protectPropValMax: undefined, //保护财产价值（止）
        qjccjzMin: undefined, //抢救财产价值（起）
        qjccjzMax: undefined, //抢救财产价值（止）
        shrsMin: "",//生还人数-下限
        shrsMax: "",//生还人数-上限
        deadNumMin: "",//死亡人数-下限
        deadNumMax: ""//死亡人数-下限
      };
      this.shztArr = [];
      this.xzqyName = ""; // 行政区域显示名称
      this.paramJjsj = "";
      this.total = 0;
      this.tableData = [];
      this.resultData = {
        cdcsjl: '-',
        cdcl: '-',
        cdjl: '-',
        qjbkry: '-',
        ssbkry: '-',
        qqccjz: '-',
        czrysw: '-',
        czryss: '-',
        bhccjz: '-'
      };
      this.selectDate = 2;
      this.formData.paramJjsjFrom = getNearlyRecentDays()[0]; // 接警起止时间
      this.formData.paramJjsjTo = getNearlyRecentDays()[1]; // 接警截止时间
      // 重置数据值之后展开筛选条件
      this.policeHide = this.dispatchHide = true;
    },
    /**
     * 分页
     * @param
     * param{page: 2, limit: 20}
     * page 当前页数
     * limit 每页多少条数据
     */
    getList (param) {
      const { page: pageNum, limit: pageSize } = param;
      if (this.shztArr.length != 0) {
        this.formData.shzts = this.shztArr.join(",");
      } else {
        this.formData.shzts = '';
      }
      this.getTabList();
      this.getCdxxCommomCountSearch();
    },
    /**
     * 查询条件展开显示
     * @params val
     * val==1 警情信息 val==2 出动信息
     */
    showSelect (val) {
      val === 1
        ? (this.policeHide = !this.policeHide)
        : (this.dispatchHide = !this.dispatchHide);
    },
    getSelectInfo () {
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
    },
    // 打开行政区域的模态框
    openProvModal () {
      this.$refs.provModal.toggle();
    },
    setProvValue (area, fullPaths) {
      var areaId = [];
      area.forEach(item => {
        areaId.push(item.areaId)
      });
      this.formData.xzqydmSj = areaId.join(',');
      this.selectedAreaInfo = area;
      this.xzqyName = fullPaths;
    },
    // 报表按钮
    toReport () {
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
        query: { rptSource: "cd" }
      });
    },
    //数据下载
    downloadData () {
      this.downloading = true;
      let excelTitle = '出动查询-';
      this.listLoading = true;
      if (this.formData.selectedAreaInfo) {
        delete this.formData.selectedAreaInfo
      };
      cdxxCommomDownload(this.addDateRange(this.formData, this.paramJjsj))
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
    // 将日期加到form中
    addDateRange (obj, arr) {
      /**
       * 选择时间，点击查询，时间会自动跳到当前时间
       */
      // if (arr) {
      // 	obj.paramJjsjFrom = arr[0];
      // 	obj.paramJjsjTo = arr[1];
      // }
      return obj;
    },
    getTabList () {
      // console.log(this.formData, this.paramJjsj, '---');
      //if (this.formData.paramJjsjTo == "" || this.formData.paramJjsjFrom == "") {
      //	this.$message.warning("请选择接警时间！！！");
      //	return;
      //}
      this.querying = true;
      // this.total = 0;
      this.tableData = [];
      this.resultData = {};
      if (this.formData.selectedAreaInfo) {
        delete this.formData.selectedAreaInfo
      };
      cdxxCommomSearch(this.addDateRange(this.formData, this.paramJjsj))
        .then(res => {
          // this.loading = false
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
    getCdxxCommomCountSearch () {
      // console.log(this.formData, this.paramJjsj, '+++');
      this.listLoading = true;
      if (this.formData.selectedAreaInfo) {
        delete this.formData.selectedAreaInfo
      };
      cdxxCommomCountSearch(this.addDateRange(this.formData, this.paramJjsj))
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
    toDetailClick (data) {
      this.$router.push({
        path: "/showDetail/jqxxShowDetail",
        query: {
          jqbh: data.jqbh
        }
      });
    },
    paramJjsjTimeChange (val) {
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
            this.formData.paramJjsjFrom = "";
            // this.formData.paramJjsjFrom = getNearlyRecentDays(30)[0]; // 接警起止时间
          } else if (nowChangeGettime == paramJjsjToGettime) {
            //如果当前选的是结束时间，结束时间恢复到初始时间
            this.formData.paramJjsjTo = "";
            // this.formData.paramJjsjTo = getNearlyRecentDays(30)[1]; // 接警截止时间
          }
        }
      }
    },
    jqlxChange (val) {
      setTimeout(f => {
        let node = this.$refs['cascader'].getCheckedNodes();
        this.checkNodeLabel = [];
        let checkVals = [];
        node.forEach(item => {
          let label = '';
          this.getLabel(item, label);
          checkVals.push(item.value);
        });
        this.formData.sjlbdm = checkVals.join(',');
      }, 0)
    },
    getLabel (node, label) {
      if (node.parent != null || (node.parent == null && node.level == 1)) {
        if (label == '') {
          label = node.label
        } else {
          label = node.label + '/' + label
        }
        if (node.parent != null) {
          this.getLabel(node.parent, label);
          return
        }
      }
      this.checkNodeLabel = label
    },
    // 打开发送单位选择
    openSenderMulModal () {
      this.$refs.senderMulModal.toggle();
    },
    // 选中发送单位
    setSenderMulValue (data) {
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
    cleanSenderMulValue () {
      this.formData.jqtbzh = '';
      this.formData.sender = '';
    },
    clearArea () {
      this.xzqyName = '';
      this.formData.xzqydmSj = '';
      this.$refs.provModal.clear();
    },
    dateRangeBtn (date) {
      this.dateRange = [];
      let end = new Date();
      let start = new Date();
      start.setHours(0, 0, 0, 0);
      end.setHours(23,59,59,0);
      let year = new Date().getFullYear();
      let month = new Date().getMonth();
      switch (date) {
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
          if (month == 0) {
            month = 12;
            year = year - 1;
          } else if (month < 10) {
            month = '0' + month;
          }
          let myDate = new Date(year, month, 0);
          start = new Date(year + '-' + month + "-" + "01").setHours(0, 0, 0, 0);
          end = new Date(year + '-' + month + '-' + myDate.getDate()).setHours(23, 59, 59, 0);
          break;
        case 6:
          let yearNew = new Date().getFullYear() - 1;
          start = new Date(yearNew + '-01-01').setHours(0, 0, 0, 0);
          end = new Date(yearNew + '-12-31').setHours(23, 59, 59, 0);
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
      .form-item {
        display: flex;
      }
    }
  }
  .text {
    display: inline-block;
    line-height: 32px;
    width: 160px;
  }
  .text_date {
    display: inline-flex;
    line-height: 32px;
    width: 160px;
    flex-shrink: 0;
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
  .el-date-editor {
    width: 26%;
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
  .dispatch_information {
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
