<template lang="pug">
.policeSentimentSearch
  .fire_information
    h2.title 火灾信息
      span.hide(@click='showSelect(3)') {{ fireHide ? "收起" : "展开" }}
        i(:class='fireHide ? "el-icon-arrow-down" : "el-icon-arrow-right"')
    el-row
    
      el-col(:span='8')
        span.text 火灾编号
        el-input(v-model='formData.zqbh', placeholder='请输入', clearable)
        
      el-col(:span='16')
        span.text_date 起火时间
        .form-item-ctrl-date
          el-date-picker(
            v-model='formData.paramZqsjFrom',
            type='datetime',
            format='yyyy-MM-dd HH:mm:ss',
            value-format='yyyy-MM-dd HH:mm:ss',
            default-time='[\'00:00:00\']',
            @change='paramZqsjTimeChange',
            :clearable='false'
          )
          span.connect -
          el-date-picker(
            v-model='formData.paramZqsjTo',
            type='datetime',
            format='yyyy-MM-dd HH:mm:ss',
            value-format='yyyy-MM-dd HH:mm:ss',
            default-time='[\'00:00:00\']',
            @change='paramZqsjTimeChange',
            :clearable='false'
          )
          el-select(
            v-model='selectDateQh',
            placeholder='请选择',
            @change='dateRangeBtn(selectDateQh, "qh")',
            style='margin-left: 2%; width: 20%'
          )
            el-option(
              v-for='item in dateList',
              :key='item.value',
              :label='item.name',
              :value='item.value'
            )
              span(
                @click='dateRangeBtn(selectDateQh, "qh")',
                style='display: inline-block'
              ) {{ item.name }}

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
        span.text 起火地点
        el-input(v-model='formData.zqdd', placeholder='请输入', clearable)

      el-col(:span='8')
        span.text 报告状态
        el-select(
          v-model='shztArr',
          placeholder='请选择',
          clearable,
          multiple,
          collapse-tags
        )
          el-option(label='待填报', value='0')
          el-option(label='已审核', value='2')
          el-option(label='审核中', value='1')
          el-option(label='被终止', value='-1')
          el-option(label='被退回', value='-2')
          el-option(label='待完善', value='-3')
          el-option(label='被驳回', value='4')
          el-option(label='已归档', value='99')

    el-row(v-show='fireHide')

      el-col(:span='8')
        span.text 失火单位/户主联系电话
        el-input(v-model='formData.lxdh', placeholder='请输入', clearable)

      el-col(:span='8')
        span.text 单位统一社会信用代码
        el-input(v-model='formData.dwtyshxydm', placeholder='请输入', clearable)

      el-col(:span='8')
        span.text 是否出动
        el-select(v-model='formData.ydwcd', placeholder='请选择', clearable  @change='sfcd'  :disabled="sfcdyc")
          el-option(label='是', value='0')
          el-option(label='否', value='1')

      el-col(:span='8')
        span.text 区域
        el-select(v-model='formData.qydm', placeholder='请选择', clearable)
          el-option(
            v-for='(item, index) in options.qydm',
            :key='index',
            :label='item.dictLabel',
            :value='item.dictValue'
          )

      el-col(:span='8' v-if="formData.qydm == '1' || formData.qydm == '2'")
         span.text 城中村
          el-checkbox(v-model="formData.czc" true-label="1" false-label="0" )

      el-col(:span="8" v-if="formData.qydm == '6'" )
         span.text 其他区域
         el-select(v-model="formData.qydmItem2" placeholder="请选择" clearable)
          el-option(
              v-for="(item, index) in options.qydmItem2",
              :key="index",
              :label="item.dictLabel",
              :value="item.dictValue"
          )

      el-col(:span='8')
        span.text 是否刑事放火
        el-select(v-model='formData.sfxsfh', placeholder='请选择', clearable)
          el-option(label='是', value='1')
          el-option(label='否', value='0')

      el-col(:span='8')
        span.text 是否属安全生产事故
        el-select(v-model='formData.sfaqscsg', placeholder='请选择', clearable)
          el-option(label='是', value='1')
          el-option(label='否', value='0')

      el-col(:span='8')
        span.text 是否正在调查
        el-select(v-model='formData.sfzzdc', placeholder='请选择', clearable)
          el-option(label='是', value='1')
          el-option(label='否', value='0')

      el-col(:span='8')
        span.text 火灾等级
        el-select(v-model='formData.zqlbdm', placeholder='请选择', clearable)
          el-option(
            v-for='(item, index) in options.tb_dic_zqdj',
            :key='index',
            :label='item.dictLabel',
            :value='item.dictValue'
          )

      el-col(:span='8')
        span.text 是否轻微火灾
        el-select(v-model='formData.qwhz', placeholder='请选择', clearable)
          el-option(label='是', value='1')
          el-option(label='否', value='0')

      el-col(:span='8')
        span.text 有无人员伤亡
        el-select(v-model='formData.sfyrsw', placeholder='请选择', clearable)
          el-option(label='有', value='1')
          el-option(label='无', value='0')

      el-col(:span='8')
        span.text 受灾户数
        .divInclude
          el-input(v-model='formData.szhsMin', placeholder='请输入', clearable)
          span.connect -
          el-input(v-model='formData.szhsMax', placeholder='请输入', clearable)

      el-col(:span='8')
        span.text 受灾人数
        .divInclude
          el-input(v-model='formData.szrsMin', placeholder='请输入', clearable)
          span.connect -
          el-input(v-model='formData.szrsMax', placeholder='请输入', clearable)

      el-col(:span='8')
        span.text 轻伤人数
        .divInclude
          el-input(v-model='formData.qsrsBegin', placeholder='请输入', clearable)
          span.connect -
          el-input(v-model='formData.qsrsEnd', placeholder='请输入', clearable)

      el-col(:span='8')
        span.text 重伤人数
        .divInclude
          el-input(v-model='formData.zsrsBegin', placeholder='请输入', clearable)
          span.connect -
          el-input(v-model='formData.zsrsEnd', placeholder='请输入', clearable)

      el-col(:span='8')
        span.text 死亡人数
        .divInclude
          el-input(v-model='formData.sirsMin', placeholder='请输入', clearable)
          span.connect -
          el-input(v-model='formData.sirsMax', placeholder='请输入', clearable)

      el-col(:span='8')
        span.text 财产损失(金额)
        .divInclude
          el-input(v-model='formData.zjccssmin', placeholder='请输入')
          span.connect -
          el-input(v-model='formData.zjccssMax', placeholder='请输入')

      el-col(:span='8')
        span.text 起火场所类型
        el-select(
          v-model='formData.qhcslb',
          placeholder='请选择',
          clearable,
          @change='fireTypeChange()'
        )
          el-option(
            v-for='(item, index) in options.tb_dic_qhcslb',
            :key='index',
            :label='item.dictLabel',
            :value='item.dictValue'
          )

      el-col(:span='8')
        span.text 起火场所
        el-input(
          v-model='formData.qhcsms',
          placeholder='请输入',
          readonly,
          @focus='openQhcsMul'
        )
          i.iconfont.icon-icon-test(
            slot='suffix',
            style='line-height: 32px',
            @click='openQhcsMul'
          )
          i.el-icon-circle-close(
            slot='suffix',
            style='line-height: 30px; cursor: pointer',
            @click='cleanQhcsMul',
            v-show='formData.qhcsms'
          )

      el-col(:span="8")
        span.text 过火面积
        .divInclude
          el-input(v-model="formData.ghmjMin" placeholder="请输入" clearable)
          span.connect -
          el-input(v-model="formData.ghmjMax" placeholder="请输入" clearable)

      el-col(:span='8')
        span.text 建筑使用用途
        el-select(v-model='formData.jzsyyt', placeholder='请选择', clearable)
          el-option(
            v-for='(item, index) in options.jzyt',
            :key='index',
            :label='item.dictLabel',
            :value='item.dictValue'
          )

      el-col(:span='8')
        span.text 建筑类别
        el-select(v-model='formData.jzlbdm', placeholder='请选择', clearable)
          el-option(
            v-for='(item, index) in options.tb_dic_jzlb',
            :key='index',
            :label='item.dictLabel',
            :value='item.dictValue'
          )

      el-col(:span='8')
        span.text 建筑耐火等级
        el-select(v-model='formData.jznhdjdm', placeholder='请选择', clearable)
          el-option(
            v-for='(item, index) in options.tb_dic_jzwnhdj',
            :key='index',
            :label='item.dictLabel',
            :value='item.dictValue'
          )

      el-col(:span='8')
        span.text 建筑结构
        el-select(v-model='formData.jzjgdm', placeholder='请选择', clearable)
          el-option(
            v-for='(item, index) in options.tb_dic_jzjg',
            :key='index',
            :label='item.dictLabel',
            :value='item.dictValue'
          )

      el-col(:span='8')
        span.text 是否属世界遗产
        el-select(v-model='formData.sfsjycdm', placeholder='请选择', clearable)
          el-option(label='是', value='1')
          el-option(label='否', value='0')

      el-col(:span='8')
        span.text 建筑总楼层数
        .divInclude
          el-input(
            v-model='formData.beginJzzlcs',
            placeholder='最低层数',
            clearable
          )
          span.connect -
          el-input(v-model='formData.endJzzlcs', placeholder='最高层数', clearable)

      el-col(:span='8')
        span.text 失火楼层数
        .divInclude
          el-input(v-model='formData.beginShlc', placeholder='最低层数', clearable)
          span.connect -
          el-input(v-model='formData.endShlc', placeholder='最高层数', clearable)

      el-col(:span='8')
        span.text 火灾是否蔓延到临近建筑
        el-select(v-model='formData.hzsfmydljjz', placeholder='请选择', clearable)
          el-option(label='是', value='1')
          el-option(label='否', value='0')

      el-col(:span='8')
        span.text 调查方式
        el-select(v-model='formData.dcfs', placeholder='请选择', clearable)
          el-option(
            v-for='(item, index) in options.tb_dic_dcfs',
            :key='index',
            :label='item.dictLabel',
            :value='item.dictValue'
          )

      el-col(:span='8')
        span.text 起火物
        el-input(
          v-model='formData.qhwms',
          placeholder='请输入',
          readonly,
          @focus='openQhwMul'
        )
          i.iconfont.icon-icon-test(
            slot='suffix',
            style='line-height: 32px',
            @click='openQhwMul'
          )
          i.el-icon-circle-close(
            slot='suffix',
            style='line-height: 30px; cursor: pointer',
            @click='cleanQhwMul',
            v-show='formData.qhwms'
          )

      el-col(:span='8')
        span.text 火灾原因
        el-input(
          v-model='formData.hzyyms',
          placeholder='请输入',
          readonly,
          @focus='openQhyyMul'
        )
          i.iconfont.icon-icon-test(
            slot='suffix',
            style='line-height: 32px',
            @click='openQhyyMul'
          )
          i.el-icon-circle-close(
            slot='suffix',
            style='line-height: 30px; cursor: pointer',
            @click='cleanQhyyMul',
            v-show='formData.hzyyms'
          )

      el-col(:span='8')
        span.text 所属行业
        el-select(v-model='formData.hylbdm', placeholder='请选择', clearable)
          el-option(
            v-for='(item, index) in options.tb_dic_hylb',
            :key='index',
            :label='item.dictLabel',
            :value='item.dictValue'
          )

      el-col(:span='8')
        span.text 经济类型
        el-select(v-model='formData.jjlxdm', placeholder='请选择', clearable)
          el-option(
            v-for='(item, index) in options.tb_dic_jjlx',
            :key='index',
            :label='item.dictLabel',
            :value='item.dictValue'
          )

      el-col(:span='8')
        span.text 是否立案
        el-select(v-model='formData.sfla', placeholder='请选择', clearable)
          el-option(label='是', value='0')
          el-option(label='否', value='1')

      el-col(:span='8')
        span.text 监督检查情况
        el-select(v-model='formData.jdjcqk', placeholder='请选择', clearable)
          el-option(
            v-for='(item, index) in options.jdjcqk',
            :key='index',
            :label='item.dictLabel',
            :value='item.dictValue'
          )

      el-col(:span='8')
        span.text 事故调查牵头部门
        el-select(v-model='formData.sgqtdcbm', placeholder='请选择', clearable)
          el-option(
            v-for='(item, index) in options.sgqtdcbm',
            :key='index',
            :label='item.dictLabel',
            :value='item.dictValue'
          )

      el-col(:span='8')
        span.text 是否发生轰燃
        el-select(v-model='formData.sffshr', placeholder='请选择', clearable)
          el-option(label='是', value='1')
          el-option(label='否', value='0')

      el-col(:span='8')
        span.text 门窗是否开启
        el-select(v-model='formData.shjzmcsfkq', placeholder='请选择', clearable)
          el-option(label='是', value='1')
          el-option(label='否', value='0')

      el-col(:span='8')
        span.text 自动报警系统
        el-select(v-model='formData.zdbjxtsfaz', placeholder='请选择', clearable)
          el-option(
            v-for='(item, index) in options.xfssqk',
            :key='index',
            :label='item.dictLabel',
            :value='item.dictValue'
          )

      el-col(:span='8')
        span.text 自动灭火系统
        el-select(v-model='formData.zdmhxtsfaz', placeholder='请选择', clearable)
          el-option(
            v-for='(item, index) in options.xfssqk',
            :key='index',
            :label='item.dictLabel',
            :value='item.dictValue'
          )

      el-col(:span='8')
        span.text 防排烟系统
        el-select(v-model='formData.fpyxtsfaz', placeholder='请选择', clearable)
          el-option(
            v-for='(item, index) in options.xfssqk',
            :key='index',
            :label='item.dictLabel',
            :value='item.dictValue'
          )

      el-col(:span='8')
        span.text 防火卷帘
        el-select(v-model='formData.fhjl', placeholder='请选择', clearable)
          el-option(
            v-for='(item, index) in options.xfssqk',
            :key='index',
            :label='item.dictLabel',
            :value='item.dictValue'
          )

      el-col(:span='8')
        span.text 室内消火栓系统
        el-select(v-model='formData.snxhsxtsaz', placeholder='请选择', clearable)
          el-option(
            v-for='(item, index) in options.xfssqk',
            :key='index',
            :label='item.dictLabel',
            :value='item.dictValue'
          )

      el-col(:span='8')
        span.text 防火分区
        el-select(v-model='formData.fhfq', placeholder='请选择', clearable)
          el-option(
            v-for='(item, index) in options.tb_dic_fhty',
            :key='index',
            :label='item.dictLabel',
            :value='item.dictValue'
          )
      el-col(:span='8')
        span.text 防火间距
        el-select(v-model='formData.fhjj', placeholder='请选择', clearable)
          el-option(
            v-for='(item, index) in options.tb_dic_fhty',
            :key='index',
            :label='item.dictLabel',
            :value='item.dictValue'
          )
      el-col(:span='8')
        span.text 疏散通道
        el-select(v-model='formData.sstd', placeholder='请选择', clearable)
          el-option(
            v-for='(item, index) in options.sstd',
            :key='index',
            :label='item.dictLabel',
            :value='item.dictValue'
          )
      el-col(:span='8')
        span.text 紧急出口
        el-select(v-model='formData.yjck', placeholder='请选择', clearable)
          el-option(
            v-for='(item, index) in options.yjck',
            :key='index',
            :label='item.dictLabel',
            :value='item.dictValue'
          )
      el-col(:span='8')
        span.text 应急疏散照明
        el-select(v-model='formData.yjsszm', placeholder='请选择', clearable)
          el-option(
            v-for='(item, index) in options.yjsszm',
            :key='index',
            :label='item.dictLabel',
            :value='item.dictValue'
          )
      el-col(:span='8')
        span.text 联网情况
        el-select(v-model='formData.sflw', placeholder='请选择', clearable)
          el-option(
            v-for='(item, index) in options.sflw',
            :key='index',
            :label='item.dictLabel',
            :value='item.dictValue'
          )
      el-col(:span='8')
        span.text 是否保险
        el-select(v-model='formData.sfbx', placeholder='请选择', clearable)
          el-option(label='是', value='0')
          el-option(label='否', value='1')
          el-option(label='未填报', value='-1')
      el-col(:span='8')
        span.text 是否单方火灾事故
        el-select(v-model='formData.sfdfhzsh', placeholder='请选择', clearable)
          el-option(label='是', value='1')
          el-option(label='否', value='0')

      el-col(:span='8')
        span.text 起火经过
        el-input(v-model='formData.fireProcess', placeholder='请输入', clearable)

      el-col(:span="8")
          span.text 是否包含火灾标签
          el-select(v-model="formData.tagContainsZq" placeholder="请选择" clearable)
              //- el-option(v-for="o in tagContainsZqOption" :key="o.value" :value="o.value" :label="o.label")
              el-option(label='包含', value='1')
              el-option(label='不包含', value='0')

      el-col(:span="14")
          span.text 火灾标签
          el-select(v-model="formData.tagIds" placeholder="请选择" clearable)
            el-option( v-for="item in jqbqList"
                :key="item.value"
                :label="item.label"
                :value="item.value")
      
      el-col(:span='8')
        span.text 是否超时
        el-select(v-model='formData.isTimeoutZq', placeholder='请选择', clearable :disabled="sfcsyc" @change="sfcs" )
          el-option(label='是', value='1')
          el-option(label='否', value='0')

  .police_information
    h2.title 警情信息
      span.hide(@click='showSelect(1)') {{ policeHide ? "收起" : "展开" }}
        i(:class='policeHide ? "el-icon-arrow-down" : "el-icon-arrow-right"')
    el-row
      el-col(:span='8')
        span.text 警情编码
        el-input(v-model='formData.jqbh', placeholder='请输入', clearable)
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
            default-time='[\'23:59:59\']',
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


      el-col(:span='8')
        span.text 警情地址
        el-input(v-model='formData.jqfsdd', placeholder='请输入', clearable)
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
      //el-col(:span="8")
        // span.text 警情类型
         el-cascader(
         ref="cascader"
           :props="props"
         v-model="formData.sjlbdm"
         placeholder="请选择"
           @change="jqlxChange"
         clearable)
    el-row(v-show='policeHide')
      el-col(:span='8')
        span.text 单位名称/户主名
        el-input(v-model='formData.hzm', placeholder='请输入', clearable)
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

  el-row(v-if='!isCheckNewTask')
    el-col(:span='14')
      el-button(type='primary', @click='searchBtn' :loading="querying") 查&nbsp;询
      el-button(@click='resetBtn') 重&nbsp;置
      el-button(type='primary', @click='toReport') 生成报表
      el-button(
        type='primary',
        v-if='showDownBtn',
        @click='searchBtn(this, true)'
        :loading="downloading"
      ) 清单导出
    el-col(:span='10')
      //.synchronizeTime(v-if="deptLevel != '1'" style="text-align:right;")
        span 数据统计时间截止至&nbsp;
          span(style="color:red; margin-right:5px;") {{synchronizationTime || '-'}}
          el-button(v-if="deptLevel == '2'" class="btn_orange" @click.prevent="dataSynchronize()" :loading="btnLoading") 数据同步
  .list-box(v-if='!isCheckNewTask', v-loading='listLoading')
    .query-resule
      p.resule-title 查询结果：
      .resule-box 共查询到 #[span {{ resultData.jqxx || 0 }}] 起火灾调查报告，死亡 #[span {{ resultData.swrs || 0 }}] 人，受伤 #[span {{ resultData.ssrs || 0 }}] 人，重伤 #[span {{ resultData.zsrs || 0 }}] 人，轻伤 #[span {{ resultData.qsrs || 0 }}] 人，直接财产损失 #[span {{ resultData.ccss || 0 }}] 元，过火面积 #[span {{ resultData.ghmj || 0 }}] 平方米，受灾户数#[span {{ resultData.szhs || 0 }}] 户，受灾人数#[span {{ resultData.szrs || 0 }}] 人。
    el-table(:data='tableData', style='width: 100%', v-loading='querying')
      //- el-table-column(type="index" label="序号" width="50")
      el-table-column(
        prop='zqbh',
        label='火灾编号',
        sortable,
        width='130',
        show-overflow-tooltip
      )
      el-table-column(prop='zqsj', label='起火时间', sortable, width='130')
      el-table-column(prop='xzqy', label='行政区域', width='150')
      el-table-column(prop='zqdd', label='警情地址', width='250')
        template(slot-scope='scope')
          el-tooltip.item(
            v-show='scope.row.zqdd != null && scope.row.zqdd != undefined && scope.row.zqdd.length>15',
            effect='dark',
            :content='scope.row.zqdd',
            placement='top-start'
          )
            div {{ scope.row.zqdd == undefined ? "" : scope.row.zqdd.substring(0, 15) }}...
          el-tooltip.item(
            v-show='scope.row.zqdd != null && scope.row.zqdd != undefined && scope.row.zqdd.length<=15',
            effect='dark',
            :content='scope.row.zqdd',
            placement='top-start'
          )
            div {{ scope.row.zqdd == undefined ? "" : scope.row.zqdd.substring(0, 15) }}
      el-table-column(prop='qwhz', label='轻微火灾', width='75')
        template(slot-scope='scope') {{ scope.row.qwhz == 0 ? "否" : "是" }}
      el-table-column(prop='qhcsms', label='起火场所', show-overflow-tooltip)
        template(slot-scope='scope') {{ scope.row.qhcsms || "" }}
      el-table-column(prop='hzyyms', label='', show-overflow-tooltip)
        template(slot-scope='scope') {{ scope.row.hzyyms || "" }}
      el-table-column(label='伤亡情况')
        template(slot-scope='scope') {{ scope.row.swrs + "死" + scope.row.ssrs + "伤" }}
      el-table-column(label='直接财产损失')
        template(slot-scope='scope') {{ scope.row.ccss }}
      el-table-column(prop='deptname', label='责任区大队', show-overflow-tooltip)
      el-table-column(prop='shzt', label='报告状态')
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
            img(src='../../../icons/bohui.svg')
            span 被驳回
      el-table-column(label='操作', width='50')
        template(slot-scope='scope')
          el-button(type='text', @click='toDetailClick(scope.row)') 查看
    .pagination_zone(v-show='tableData.length>0')
      pagination(
        :total='formData.total',
        :page.sync='formData.pageNum',
        :limit.sync='formData.pageSize',
        @pagination='getList'
      )
  //- 起火场所
  fireSpaceMul(
    ref='Mulmodel',
    :qhcs-type='formData.qhcslb ? formData.qhcslb : ""',
    @setMulVals='setMulVals'
  )
  //- 起火物
  fireObjectMul(ref='fireObjecMul', @setFireMulVal='setFireMulVal')
  //- 起火原因
  fireReasonMul(
    ref='fireReasonMul',
    :multiple='true',
    @setFireReasonMulVal='setFireReasonMulVal'
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
import axios from "axios";
import { getJqcdlb } from "@/api/data/entry/jqxx";
import dataSearch from "@/api/data/eqw/dataSearch.js";
import fireSpaceMul from "@/views/eqw/customSearch/components/fireSpaceModal";
import fireObjectMul from "@/views/eqw/customSearch/components/fireObjectModal";
import fireReasonMul from "@/views/data/entry/zqxx/components/fireReasonMul";
import provModal from "@/views/eqw/customSearch/components/multiProvModal";
import senderMulModal from '@/views/components/dataSeach/senderMulModal.vue';
import { getInitTime, getNearlyRecentDays, formdate } from "@/utils/dateTimeUtils.js"
import { downloadFile } from "@/utils/download-file.js";
import { getTreeOptions } from "@/api/data/entry/zqxx";
// 出动队伍
import cdMulModal from "@/views/components/dataSeach/cdMulModal";
// 责任区大队
import dutyModal from "@/views/components/dataSeach/dutyModal";
// 主战
import mulModal from "@/views/components/dataSeach/mulModal";
import { synchronizeData, getSynchronizeDataTime, getLastEtlTime } from '@/api/report/report';
import { fireOption, fireTreeOption, optionsList } from "./option.js";
import { targetNameTarget } from "@/api/system/dict/target";

export default {
  name: "FireSentimentSearch",
  components: {
    fireSpaceMul,
    fireObjectMul,
    fireReasonMul,
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
      // tagContainsZqOption:[
      //     {label:"包含", value:1},
      //     {label:"不包含", value:0}
      //   ],
      sfcsyc : false,
      sfcdyc : false,
      jqbqList:[], //警情标签
      tagOptions:[],
      tagValue: [],
      listLoading: false,
      querying: false, //是否正在查询
      downloading: false, // 是否正在下载
      synchronizationTime: '',
      deptLevel: '',
      /* 查询信息显示隐藏 */
      policeHide: true, // 警情信息筛选展示隐藏
      fireHide: false, // 火灾信息筛选展示隐藏
      props: {
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
      rules:{
        qydmItem2: [{required: true, message: "请填写", trigger: "blur"}],
      },
      //
      //
      xfdwdmId: [],
      xfdwdmName: '',// 出动队伍
      zrqdddmId: [],
      zrqdddmName: '',// 责任区大队
      zzdwId: [],
      zzdwName: '',   // 主战队伍
      xzqyName: "", // 行政区域显示名称
      // 提交查询信息
      formData: {
        /** ************** 警情信息字段 */
        tagContainsZq:'',//是否包含警情标签
        isTimeoutZq: "", //是否超时
        ghmjMax:"", //过火面积-最大面积
        ghmjMin:"", //过火面积-最小面积
        jqbh: "", // 警情编码
        Jjsj: [], // 接警起止时间（请求参数 接警时间）
        paramJjsjFrom: "", // 接警起止时间（请求参数 接警时间）
        paramJjsjTo: "", // 接警起止时间（请求参数 接警时间）
        xzqyName: "",
        xzqydmSj: "", // 行政区域（所属行政区）
        jqfsdd: "", // 警情地址（事件地点）
        sjlbdm: "", // 警情类型（出警类别）
        duty: "",
        jqtbzh: "", // 发送单位
        sender: '', // 发送单位名称
        hzm: "", // 单位名称/户主名
        caseNbr: '',
        xxfdwdm: '',   // 出动队伍
        zrqdddm: '',   // 责任区大队
        zzdw: '',       // 主战队伍
        /** *************** 火灾（灾情）信息字段 */
        sfzzdc: "", // 是否正在调查
        Zqsj: "", // 火灾时间
        paramZqsjFrom: "", // 火灾时间
        paramZqsjTo: "", // 火灾时间
        zqlbdm: "", // 火灾等级
        qwhz: "", // 是否轻微火灾，1是0否
        zqdd: "", // 起火地点
        lxdh: "", // 失火单位/户主联系电话
        dwtyshxydm: "", // 单位统一社会信用代码
        zqbh: "", // 火灾编号
        fireProcess: "", // 起火经过
        czc: '', // 城中村
        qydm: "", // 区域
        qydmItem2: '', // 区域2
        jdjcqk: "", // 消防救援机构监督检查范围
        sgqtdcbm: "", // 事故调查牵头部门
        jjlxdm: "", // 经济类型
        hylbdm: "", // 所属行业
        qhcslb: "", // 起火场所类型
        qhcsms: "", // 起火场所名称
        qhcsdm: "", // 起火场所代码
        zqxxQhcsList: [], // 起火场所回显列表
        sfsjycdm: "", // 是否属世界遗产
        jzsyyt: "", // 建筑使用用途
        jzlbdm: "", // 建筑类别
        jznhdjdm: "", // 建筑耐火等级
        jzjgdm: "", // 建筑结构
        hzsfmydljjz: "", // 火灾是否蔓延到邻近建筑
        sffshr: "", // 是否发生轰燃
        shjzmcsfkq: "", // 门窗是否开启
        zdbjxtsfaz: "", // 自动报警系统
        zdmhxtsfaz: "", // 自动灭火系统
        fpyxtsfaz: "", // 防排烟系统
        fhjl: "", // 防火卷帘
        snxhsxtsaz: "", // 室内消火栓系统
        fhfq: "", // 防火分区
        fhjj: "", // 防火间距
        sstd: "", // 疏散通道
        yjck: "", // 紧急出口
        yjsszm: "", // 应急疏散照明
        sflw: "", // 联网情况
        sfbx: "", // 是否保险
        sfdfhzsh: "", // 是否单方火灾事故
        qhwms: "", // 起火物名称
        qhwfldm: "", // 起火物
        hzyyms: "", // 火灾原因名称
        hzyydm: "", // 火灾原因
        dcfs: "", // 调查方式
        sfla: "", // 是否立案
        sfxsfh: "", // 是否属刑事放火
        sfaqscsg: "", // 是否属安全生产事故
        sfyrsw: "", // 是否有人员伤亡  是1 否0
        total: 0,
        pageNum: 1,
        pageSize: 20,
        dataQueryTypeCx: 3, //火灾查询区分综合火灾查询
        ydwcd: "", //是否未出动火灾
        zjccssmin: "", //财产损失-下限
        zjccssMax: "", //财产损失-上限
        beginJzzlcs: '',//建筑总楼层数头
        endJzzlcs: '',//建筑总楼层数尾
        beginShlc: '',//失火楼层头
        endShlc: '',//失火楼层尾
        qsrsBegin: "",//轻伤人数下限
        qsrsEnd: "", //轻伤人数上限
        zsrsBegin: "", //重伤人数下限
        zsrsEnd: "", //重伤人数上限
        sirsMin: '',//死亡人数
        sirsMax: '',//死亡人数
        szhsMin: '',//受灾户数
        szhsMax: '',//受灾户数
        szrsMin: '',//受灾人数
        szrsMax: '',//受灾人数
        tagIds: '', //警情标签
      },
      shztArr: [], // 报告状态（2：已审核；1：审核中；-1：被终止；-2：被退回；-3：待完善）
      selectedAreaInfo: {},
      paginationData: {
        total: 0,
        pageNum: 1,
        pageSize: 20
      },
      options: optionsList,
      resultData: {
        jqxx: '-',
        swrs: '-',
        ssrs: '-',
        ccss: '-',
        ghmj: '-',
        zsrs: '-',
        qsrs: '-',
        szhs: '-',
        szrs: '-'
      },
      tableData: [],
      btnLoading: false,
      showDownBtn: false,
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
      selectDate: '',
      selectDateQh: 2
    };
  },
  created () {
    // this.formData.tagContainsZq = this.tagContainsZqOption[0].value;
    //this.getLastTime();
    this.getAllTag();
    this.getSelectData();
    this.deptLevel = this.$store.state.user.deptLevel;
    // this.formData.Jjsj = getNearlyRecentDays(30);
    // this.formData.paramJjsjFrom = getNearlyRecentDays()[0]; // 接警起止时间
    // this.formData.paramJjsjTo = getNearlyRecentDays()[1]; // 接警截止时间
    this.formData.paramZqsjFrom = getNearlyRecentDays(30)[0]; // 起火起止时间
    this.formData.paramZqsjTo = getNearlyRecentDays(30)[1]; // 起火截止时间
  },
  methods: {
      sfcs(){
        if(this.formData.isTimeoutZq == 1 || this.formData.isTimeoutZq == 0){
          this.formData.ydwcd = '是';
          this.sfcdyc = true;
        }
        if(this.formData.isTimeoutZq == ''){
           this.sfcdyc = false;
          this.formData.ydwcd = ''
        }
      },
      sfcd(){
        // console.log('1111111', this.formData.ydwcd)
        if(this.formData.ydwcd == 1){
          this.sfcsyc = true;
        }else{
          this.sfcsyc = false;
        }
      },
    /** 出动队伍*/
      getAllTag() {
          let _params = {
            "tagName": "",
            "tagType": "Z"
          }
          targetNameTarget(_params).then(res=>{
            // console.log('--99---',res)
            this.jqbqList = res.data.map(item=> {
              return {
                label: item.tagName,
                value: item.tagId
              }
            });
            // console.log("11111",this.jqbqList)
          });
      },
            // 查询
      search() {
          this.loading = true;
          // 组装数据
          const {ksrq, jsrq} = this.form;
          this.form.params.beginTime = ksrq;
          this.form.params.endTime = jsrq;
          if(this.tagValue) {
            this.form.tagIds = this.tagValue.join(",");
          } else {
            this.form.tagIds = "";
          }
          let params = {...this.form};
          params.beginTime = ksrq;
          params.endTime = jsrq;

          // 新增一个是否是从首页跳转过来的字段 pageFlag = 1
          // params.pageFlag = this.$route.query.pageFlag;

          queryDeptHisData(params).then(res => {
              // console.log(res);
              this.loading = false;
              this.total = res.total;
              this.tableData = res.rows;
          });
      },
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
        this.$message.success('数据同步成功！');
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
        if (res.code == 200) this.synchronizationTime = res.data.cdtime || '';
      })
    },

    // 查询
    searchBtn (event, download = false) {
      if(this.formData.tagIds !== "" && this.formData.tagContainsZq == ""){
            this. $message.error(" ‘是否包含火灾标签’为必填")
            return;
      }
      if(this.formData.tagIds == "" && this.formData.tagContainsZq !== ""){
            this. $message.error(" ‘火灾标签’为必填")
            return;
      }
      if(this.formData.qydm == '3' || this.formData.qydm == '4' || this.formData.qydm == '5' || this.formData.qydm == '6'){
          this.formData.czc = '';
      }
      if(this.formData.qydmItem2 == '' && this.formData.qydm == '6'){
        this.$message.error('其他区域不能为空')
        return
      }
      if(this.formData.ydwcd == '是'){
        this.formData.ydwcd = "0";
      }
      if (!download) {
        // console.log("111111",download)
        this.showDownBtn = false;
      }
      // 查询之前隐藏筛选条件
      this.policeHide = this.fireHide = false;
      this.formData.total = 0;
      this.formData.pageNum = 1;
      this.formData.pageSize = 20;
      this.getData(download);
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
        // tagContainsZq : this.tagContainsZqOption[0].value,//是否包含警情标签
        tagContainsZq :"",//是否包含警情标签
        isTimeoutZq: "", //是否超时
        ghmjMin:"", //过火面积-最小面积
        ghmjMax:"", //过火面积-最大面积
        jqbh: "", // 警情编码
        Jjsj: [], // 接警起止时间（请求参数 接警时间）
        paramJjsjFrom: "", // 接警起止时间（请求参数 接警时间）
        paramJjsjTo: "", // 接警起止时间（请求参数 接警时间）
        xzqyName: "",
        xzqydmSj: "", // 行政区域（所属行政区）
        jqfsdd: "", // 警情地址（事件地点）
        sjlbdm: "", // 警情类型（出警类别）
        duty: "",
        jqtbzh: "", // 发送单位
        sender: '', // 发送单位名称
        hzm: "", // 单位名称/户主名
        caseNbr: '',
        xfdwdm: '',   // 出动队伍
        xxfdwdm: '',   // 出动队伍
        zrqdddm: '',   // 责任区大队
        zzdw: '',       // 主战队伍
        /** *************** 火灾（灾情）信息字段 */
        sfzzdc: "", // 是否正在调查
        Zqsj: "", // 火灾时间
        paramZqsjFrom: "", // 火灾时间
        paramZqsjTo: "", // 火灾时间
        zqlbdm: "", // 火灾等级
        qwhz: "", // 是否轻微火灾，1是0否
        zqdd: "", // 起火地点
        lxdh: "", // 失火单位/户主联系电话
        dwtyshxydm: "", // 单位统一社会信用代码
        zqbh: "", // 火灾编号
        fireProcess: "", // 起火经过
        czc: '', // 城中村
        qydm: "", // 区域
        qydmItem2: "", // 区域2
        jdjcqk: "", // 消防救援机构监督检查范围
        sgqtdcbm: "", // 事故调查牵头部门
        jjlxdm: "", // 经济类型
        hylbdm: "", // 所属行业
        qhcslb: "", // 起火场所类型
        qhcsms: "", // 起火场所名称
        qhcsdm: "", // 起火场所代码
        zqxxQhcsList: [], // 起火场所回显列表
        sfsjycdm: "", // 是否属世界遗产
        jzsyyt: "", // 建筑使用用途
        jzlbdm: "", // 建筑类别
        jznhdjdm: "", // 建筑耐火等级
        jzjgdm: "", // 建筑结构
        hzsfmydljjz: "", // 火灾是否蔓延到邻近建筑
        sffshr: "", // 是否发生轰燃
        shjzmcsfkq: "", // 门窗是否开启
        zdbjxtsfaz: "", // 自动报警系统
        zdmhxtsfaz: "", // 自动灭火系统
        fpyxtsfaz: "", // 防排烟系统
        fhjl: "", // 防火卷帘
        snxhsxtsaz: "", // 室内消火栓系统
        fhfq: "", // 防火分区
        fhjj: "", // 防火间距
        sstd: "", // 疏散通道
        yjck: "", // 紧急出口
        yjsszm: "", // 应急疏散照明
        sflw: "", // 联网情况
        sfbx: "", // 是否保险
        sfdfhzsh: "", // 是否单方火灾事故
        qhwms: "", // 起火物名称
        qhwfldm: "", // 起火物
        hzyyms: "", // 火灾原因名称
        hzyydm: "", // 火灾原因
        dcfs: "", // 调查方式
        sfla: "", // 是否立案
        sfxsfh: "", // 是否属刑事放火
        sfaqscsg: "", // 是否属安全生产事故
        sfyrsw: "", // 是否有人员伤亡  是1 否0
        total: 0,
        pageNum: 1,
        pageSize: 20,
        dataQueryTypeCx: 3, //火灾查询区分综合火灾查询
        ydwcd: "", //是否未出动火灾
        zjccssmin: "", //财产损失-下限
        zjccssMax: "", //财产损失-上限
        beginJzzlcs: '',//建筑总楼层数头
        endJzzlcs: '',//建筑总楼层数尾
        beginShlc: '',//失火楼层头
        endShlc: '',//失火楼层尾
        qsrsBegin: "",//轻伤人数下限
        qsrsEnd: "", //轻伤人数上限
        zsrsBegin: "", //重伤人数下限
        zsrsEnd: "" ,//重伤人数上限
        sirsMin: '',//死亡人数
        sirsMax: '',//死亡人数
        szhsMin: '',//受灾户数
        szhsMax: '',//受灾户数
        szrsMin: '',//受灾人数
        szrsMax: '',//受灾人数
        tagIds: '', //警情标签
      };
      this.selectDate = '';
      this.selectDateQh = 2;
      this.formData.paramZqsjFrom = getNearlyRecentDays(30)[0]; // 起火起止时间
      this.formData.paramZqsjTo = getNearlyRecentDays(30)[1]; // 起火截止时间
      this.shztArr = [], // 报告状态（0：未送审；1：审核中；2：审核通过；-1：审核终止）
        this.resultData = {
          jqxx: '-',
          swrs: '-',
          ssrs: '-',
          ccss: '-',
          ghmj: '-'
        };
      this.tableData = [];
      // 重置数据值之后展开筛选条件
      this.policeHide = this.fireHide = true;
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
      this.getData();
    },
    /**
     * 查询条件展开显示
     * @params val
     * val==1 警情信息 val==3 火灾信息
     */
    showSelect (val) {
      val === 1
        ? (this.policeHide = !this.policeHide)
        : (this.fireHide = !this.fireHide);
    },

    // 接警起止时间修改分别传参
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
    // 起火时间修改分别传参
    // paramZqsjChange(val) {
    //   if (val == null) {
    //     this.formData.paramZqsjFrom = "";
    //     this.formData.paramZqsjTo = "";
    //     return;
    //   }
    //   this.formData.paramZqsjFrom = val[0];
    //   this.formData.paramZqsjTo = val[1];
    // },
    // 获取查询数据
    getData (download) {
      // console.log(this.formData);
      // console.log(this.options);
      // console.log(download);
      // console.log(this.formData.hylbdm);
      this.downloading = true;
      if (this.formData.paramZqsjTo == null || this.formData.paramZqsjFrom == null) {
        this.$message.warning("请选择火灾时间！！！");
        return;
      }
      if (this.shztArr.length != 0) {
        this.formData.shzts = this.shztArr.join(',');
      } else {
        this.formData.shzts = '';
      }

      if (download) {

        this.downloadData();
        return;
      }
      this.listLoading = true;
      this.querying = true;
      axios
        .all([
          dataSearch.queryZqxxData(this.formData),
          dataSearch.queryZqxxDataCommon(this.formData)
        ])
        .then(
          axios.spread((res1, res2) => {
            if (res1.code == 200) {
              this.formData.total = res1.total;
              this.tableData = res1.rows;
              this.querying = false;
              this.showDownBtn = true;
            }
            if (res2.code == 200) {
              this.resultData = res2.data[0];
              this.listLoading = false;
            }
          })
        )
        .finally(() => {
          this.listLoading = false;
          this.querying = false;
          this.downloading = false;
        });
    },
    //数据下载
    downloadData () {
      let excelTitle = '火灾查询-';
      this.listLoading = true;

      let originProto = Object.getPrototypeOf(this.formData);
      let params = Object.assign(Object.create(originProto), this.formData);

      delete params['pageNum'];
      delete params['pageSize'];


      dataSearch.queryZqxxDataDownload(params)
        .then(response => {
          if (response.code == 200) {
            downloadFile(excelTitle, response.data.stream);
          }
        })
        .finally(() => {
          this.listLoading = false;
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

    // 打开起火场所选择框
    openQhcsMul () {
      if (this.formData.qhcslb == "") {
        this.$message.warning("请先选择起火场所类型");
        return;
      }
      this.$refs.Mulmodel.toggle();
      this.$refs.Mulmodel.echo(this.formData.zqxxQhcsList);
    },
    // 接收起火场所数据
    setMulVals (arr) {
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
    cleanQhcsMul () {
      this.formData.qhcsms = "";
      this.formData.qhcsdm = "";
      this.formData.zqxxQhcsList = [];
    },
    // 打开起火物选择框
    openQhwMul () {
      this.$refs.fireObjecMul.toggle();
      this.$refs.fireObjecMul.echo(this.formData.qhwfldm);
    },
    // 接受起火物数据
    setFireMulVal (arr) {
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
    cleanQhwMul () {
      this.formData.qhwfldm = "";
      this.formData.qhwms = "";
    },
    // 打开起火原因选择框
    openQhyyMul () {
      this.$refs.fireReasonMul.toggle();
      this.$refs.Mulmodel.echo(this.formData.hzyydm);
    },
    // 接受起火原因数据
    setFireReasonMulVal (arr) {
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
    cleanQhyyMul () {
      this.formData.hzyyms = "";
      this.formData.hzyydm = "";
      this.$refs.fireReasonMul.clear();
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
      //if (this.formData.paramZqsjTo == "" || this.formData.paramZqsjFrom == "") {
      //	this.$message.warning("请选择火灾时间！！！");
      //	return;
      //}
      const params = this.formData;
      params.selectedAreaInfo = this.selectedAreaInfo;
      sessionStorage.setItem('dataSearch_to_dataReport_params', JSON.stringify(params));
      this.$router.push({ path: '/eqw/dataReport', query: { rptSource: 'hz' } });
    },
    // 清空行政区域数据
    cleanProvModal () {
      this.formData.xzqydmSj = "";
      this.formData.xzqyName = "";
    },
    jqlxChange (val) {
      let node = this.$refs['cascader'].getCheckedNodes();
      this.checkNodeLabel = [];
      let checkVals = [];
      node.forEach(item => {
        let label = '';
        this.getLabel(item, label);
        checkVals.push(item.value);
      });
      this.formData.sjlbdm = checkVals.join(',');
      // console.log(this.sjlbdm);
      // console.log(this.$refs['cascader'].getCheckedNodes()[0]);
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
    // 获取下拉框数据
    getSelectData () {
      // 遍历普通字典表查询下拉列表数据
      fireOption.forEach(item => {
        this.getDicts(item).then(res => {
          if (res.code == 200) {
            this.options[item] = res.data;
          }
        });
      });
      fireTreeOption.forEach(item => {
        getTreeOptions({
          dictType: item.dictType,
          parentValue: item.parentValue
        }).then(res => {
          if (res.code == 200) {
            this.options[item.resName] = res.data;
          }
        });
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
    paramZqsjTimeChange (val) {
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
    fireTypeChange () {
      this.cleanQhcsMul();
    },
    clearArea () {
      this.xzqyName = '';
      this.formData.xzqydmSj = '';
      this.$refs.provModal.clear();
    },
    dateRangeBtn (date, type) {
      this.dateRange = [];
      let end = new Date();
      let start = new Date();
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 0);
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
      if (type == 'qh') {
        this.formData.paramZqsjFrom = formdate(new Date(start));
        this.formData.paramZqsjTo = formdate(new Date(end));
      } else {
        this.formData.paramJjsjFrom = formdate(new Date(start));
        this.formData.paramJjsjTo = formdate(new Date(end));
      }
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
  .police_information,
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
