<template>
  <div v-loading="loading" class="page_zone">
    <div class="view-title">
      <div>火灾信息详情{{form.qwhz=='1'?"（轻微）":""}}<span>(火灾编号：{{propfrom.zqbh}})</span></div>
    </div>
    <div class="content fireInfo">
      <topDetail v-if="content_kv_show" :jq-top-data="jqTopData" :cd-top-data="cdTopData" />
      <div class="info_description">
        <div class="fire_building_describe">
          <h2 class="title">简要情况</h2>
          <el-row :gutter="0">
            <el-col :span="24">
              <!-- 行政区域 单位名称 户主名 起火场所 起火物 过火面积 人员伤亡情况死亡数 直接经济损失 起火原因 -->
              {{ easyMessage }}
            </el-col>
          </el-row>
        </div>
        <el-form
          ref="ruleForm"
          :model="form"
          label-width="160px"
          class="demo-ruleForm"
          label-position="right"
        >
          <div class="fire_building_describe">
            <h2 class="title">基本信息</h2>
            <el-row :gutter="0">
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="是否正在调查">
                  <span>{{ form.sfdcz == '0' ? '否' : '是' }}</span>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="起火时间">
                  <span>{{ form.zqsj || '-' }}</span>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="起火地点">
                  <span>{{ form.zqdd || '-' }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="0">
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item v-if="form.qwhz == '0'" label="火灾等级" prop="zqlbdm">
                  <span>{{ getLabel('tb_dic_zqdj', form.zqlbdm) }}</span>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="失火单位/户主联系电话">
                  <span>{{ form.lxdh || '-' }}</span>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="单位统一社会信用代码">
                  <span>{{ form.dwtyshxydm || '-' }}</span>
                </el-form-item>
              </el-col>
               <!-- 暂时去掉，后期需要释放即可 -->
              <!-- <el-col :xs="24" :sm="12" :lg="8" :span="8" v-if="form.qwhz=='1'">
                <el-form-item label="是否成灾">
                  <span>{{ form.sfcz==1?'是':'否' }}</span>
                </el-form-item>
              </el-col> -->
            </el-row>
            <el-row :gutter="0">
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="区域" prop="qydm">
                  <span>{{ getLabel('qydm', form.qydm) }}</span>
                </el-form-item>
              </el-col>
              <el-col v-if="form.qydm == '1' || form.qydm == '2'" :xs="24" :sm="12" :lg="6" :span="8">
                <el-form-item v-if="form.qydm == '1' || form.qydm == '2'" label=" ">
                  <el-checkbox v-model="form.czc" true-label="1" false-label="0" :disabled="propfrom.isNotEdit">城中村</el-checkbox>
                </el-form-item>
              </el-col>
              <el-col v-if="form.qydm == '6'" :xs="24" :sm="12" :lg="6" :span="8">
                <el-form-item label=" ">
                  <span>{{ getLabel('qydmItem2', form.qydmItem2) }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="0">
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="监督检查情况">
                  <span>{{ getLabel('jdjcqk', form.jdjcqk) }}</span>
                </el-form-item>
              </el-col>
              <el-col v-if="form.jdjcqk == '1'" :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="">
                  <span>{{ getLabel('jdjcqkItem1', form.jdjcqkItem1) }}</span>
                </el-form-item>
              </el-col>
              <el-col v-if="form.jdjcqk == '1' && form.jdjcqkItem1.indexOf('5')!=-1" :span="8">
                <el-form-item label="">
                  <span>{{ getLabel('jdjcqkItem2', form.jdjcqkItem2) }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="form.qwhz == '0'" :gutter="0">
              <el-col :xs="24" :sm="12" :lg="6" :span="8">
                <el-form-item label="是否保险">
                  <span>{{ form.sfbx == '0' ? '是' : (form.sfbx == '1'? '否' : '-') }}</span>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :lg="6" :span="8">
                <el-form-item label=" ">
                  <span>{{ form.sfbxItems ? (form.sfbxItems == '人身保险' ? '人身保险' : '财产保险') : '-' }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="form.qwhz == '0'" :gutter="0">
              <el-col :xs="24" :sm="12" :lg="6" :span="8">
                <el-form-item label="是否单方火灾事故" >
                  <span>{{ form.sfdfhzsh ? (form.sfdfhzsh == '1' ? '是' : '否') : '-' }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="0">
              <el-col v-if="form.qwhz == '0'" :xs="24" :sm="12" :lg="6" :span="8">
                <el-form-item label="事故调查牵头部门" prop="sgqtdcbm">
                  <span>{{ getLabel('sgqtdcbm', form.sgqtdcbm) }}</span>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :lg="6" :span="8">
                <el-form-item v-if="form.sgqtdcbm == '6'" label=" ">
                  <span>{{ form.sgqtdcbmItem1 || '-' }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="0">
              <el-col v-if="form.qwhz == '0'" :xs="24" :sm="12" :lg="6" :span="8">
                <el-form-item label="所属行业" prop="hylbdm">
                  <span>{{ getLabel('tb_dic_hylb', form.hylbdm) }}</span>
                </el-form-item>
              </el-col>
              <el-col v-if="form.qwhz == '0'" :xs="24" :sm="12" :lg="6" :span="8">
                <el-form-item label="经济类型" prop="jjlxdm">
                  <span>{{ getLabel('tb_dic_jjlx', form.jjlxdm) }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div class="fire_building_describe">
            <h2 class="title">起火场所信息</h2>
            <el-row :gutter="0">
              <el-col :xs="24" :sm="12" :lg="12" :span="8">
                <el-form-item label="起火场所类型" prop="qhcslb">
                  <span>{{ getLabel('tb_dic_qhcslb', form.qhcslb) }}</span>
                </el-form-item>
              </el-col>
              <el-col v-if="form.qhcslb" :span="12">
                <el-form-item label="起火场所">
                  <span>{{ form.qhcsms || '-' }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="form.qwhz == '0'" :gutter="0">
              <el-col :xs="24" :sm="12" :lg="6" :span="8">
                <el-form-item label="是否属于世界遗产">
                  <span>{{ form.sfyc == '0' ? '否' : (form.sfyc == '1' ? '是' : '-') }}</span>
                </el-form-item>
              </el-col>
              <el-col v-if="form.sfyc == '1'" :xs="24" :sm="12" :lg="6" :span="8" prop="sfsjycdm">
                <el-form-item label=" ">
                  <span>{{ getLabel('tb_dic_sjyc', form.sfsjycdm) }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="form.qwhz == '0' && form.qhcslb =='3'" :gutter="0">
              <el-col :xs="24" :sm="12" :lg="6" :span="8" prop="jzsyyt">
                <el-form-item label="建筑使用用途">
                  <span>{{ getLabel('jzsyyt', form.jzsyyt) }}</span>
                </el-form-item>
              </el-col>
              <el-col v-if="form.jzsyyt == '2'" :span="6" prop="jzsyytItem1">
                <el-form-item label=" ">
                  <span>{{ getLabel('jzsyytItem1', form.jzsyytItem1) }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="form.qwhz == '0' && form.qhcslb =='3'" :gutter="0">
              <el-col :xs="24" :sm="12" :lg="6" :span="8">
                <el-form-item label="建筑类别" prop="jzlbdm">
                  <span>{{ getLabel('tb_dic_jzlb', form.jzlbdm) }}</span>
                </el-form-item>
              </el-col>
              <el-col v-if="form.qhcslb =='3'" :xs="24" :sm="12" :lg="6" :span="8">
                <el-form-item label=" ">
                  <el-checkbox v-model="form.dxzht" true-label="1" false-label="0" :disabled="propfrom.isNotEdit">大型综合体</el-checkbox>
                </el-form-item>
              </el-col>
              <el-col v-if="form.qhcslb =='3'" :xs="24" :sm="12" :lg="6" :span="8">
                <el-form-item label="建筑耐火等级" prop="jznhdjdm">
                  <span>{{ getLabel('tb_dic_jzwnhdj', form.jznhdjdm) }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="form.qhcslb =='3'" :gutter="0">
              <el-col :xs="24" :sm="12" :lg="6" :span="8">
                <el-form-item label="建筑结构" prop="jzjgdm">
                  <span>{{ getLabel('tb_dic_jzjg', form.jzjgdm) }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div v-if="form.qwhz == '0'&&form.qhcslb==3" class="fire_building_describe">
            <h2 class="title">火灾及失火建筑情况描述</h2>
            <el-row :gutter="0">
              <el-col :xs="24" :sm="12" :lg="6" :span="8">
                <el-form-item label="火灾蔓延到邻近建筑" prop="hzsfmydljjz">
                  <span>{{ form.hzsfmydljjz == '0' ? '否' : (form.hzsfmydljjz == '1' ? '是' : '-') }}</span>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :lg="6" :span="8">
                <el-form-item label="发生轰然" prop="sffshr">
                  <span>{{ form.sffshr == '0' ? '否' : (form.sffshr == '1' ? '是' : '-') }}</span>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :lg="6" :span="8">
                <el-form-item label="失火建筑门窗在火灾过程中开启" prop="shjzmcsfkq" label-width="200px">
                  <span>{{ form.shjzmcsfkq == '0' ? '否' : (form.shjzmcsfkq == '1' ? '是' : '-') }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="0">
              <el-col :xs="24" :sm="12" :lg="6" :span="8">
                <el-form-item label="建筑总楼层数" prop="jzzlcs">
                  <span>{{ form.jzzlcs || '-' }}</span>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :lg="6" :span="8">
                <el-form-item label="失火楼层" prop="shlc">
                  <span>{{ form.shlc || '-' }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div v-if="form.qwhz == '0'" class="fire_building_describe">
            <h2 class="title">消防设施</h2>
            <el-row :gutter="0">
              <el-col :span="6">
                <el-form-item label="自动报警系统(含独立报警)" label-width="200px">
                  <span>{{ getLabel('zdbjxtsfaz', form.zdbjxtsfaz) }}</span>
                </el-form-item>
              </el-col>
              <el-col v-if="form.zdbjxtsfaz" :span="6" >
                <el-form-item label=" ">
                  <span>{{ getLabel('zdbjxtsfazItem1', form.zdbjxtsfazItem1) }}</span>
                </el-form-item>
              </el-col>
              <el-col
                v-if="form.zdbjxtsfazItem1 == '3' || form.zdbjxtsfazItem1 == '4'"
                :span="6"
              >
                <el-form-item label=" ">
                  <span>{{ getLabel('zdbjxtsfazItem2', form.zdbjxtsfazItem2) }}</span>
                </el-form-item>
              </el-col>
              <el-col v-if="form.zdbjxtsfazItem2 >= 7" :span="6" >
                <el-form-item label=" ">
                  <span>{{ getLabel('zdbjxtsfazItem3', form.zdbjxtsfazItem3) }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="0">
              <el-col :span="6">
                <el-form-item label="自动灭火系统(含简易喷淋)"  label-width="200px">
                  <span>{{ getLabel('zdmhxtsfaz', form.zdmhxtsfaz) }}</span>
                </el-form-item>
              </el-col>
              <el-col v-if="form.zdmhxtsfaz" :span="6">
                <el-form-item label=" ">
                  <span>{{ getLabel('zdmhxtsfazItem1', form.zdmhxtsfazItem1) }}</span>
                </el-form-item>
              </el-col>
              <el-col
                v-if="form.zdmhxtsfazItem1 == '3' || form.zdmhxtsfazItem1 == '4'"
                :span="6"
              >
                <el-form-item label=" ">
                  <span>{{ getLabel('zdmhxtsfazItem2', form.zdmhxtsfazItem2) }}</span>
                </el-form-item>
              </el-col>
              <el-col v-if="form.zdmhxtsfazItem2 >= 7 " :span="6" prop="zdmhxtsfazItem3">
                <el-form-item label=" ">
                  <span>{{ getLabel('zdmhxtsfazItem3', form.zdmhxtsfazItem3) }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="0">
              <el-col :span="6">
                <el-form-item label="防排烟系统">
                  <span>{{ getLabel('fpyxtsfaz', form.fpyxtsfaz) }}</span>
                </el-form-item>
              </el-col>
              <el-col v-if="form.fpyxtsfaz" :span="6" >
                <el-form-item label=" ">
                  <span>{{ getLabel('fpyxtsfazItem1', form.fpyxtsfazItem1) }}</span>
                </el-form-item>
              </el-col>
              <el-col
                v-if="form.fpyxtsfazItem1 == '3' || form.fpyxtsfazItem1 == '4'"
                :span="6"

              >
                <el-form-item label=" ">
                  <span>{{ getLabel('fpyxtsfazItem2', form.fpyxtsfazItem2) }}</span>
                </el-form-item>
              </el-col>
              <el-col v-if="form.fpyxtsfazItem2 >= 7" :span="6" >
                <el-form-item label=" ">
                  <span>{{ getLabel('fpyxtsfazItem3', form.fpyxtsfazItem3) }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="0">
              <el-col :span="6">
                <el-form-item label="防火卷帘">
                  <span>{{ getLabel('fhjl', form.fhjl) }}</span>
                </el-form-item>
              </el-col>
              <el-col v-if="form.fhjl" :span="6" >
                <el-form-item label=" ">
                  <span>{{ getLabel('fhjlItem1', form.fhjlItem1) }}</span>
                </el-form-item>
              </el-col>
              <el-col
                v-if="form.fhjlItem1 == '3' || form.fhjlItem1 == '4'"
                :span="6"
              >
                <el-form-item label=" ">
                  <span>{{ getLabel('fhjlItem2', form.fhjlItem2) }}</span>
                </el-form-item>
              </el-col>
              <el-col v-if="form.fhjlItem2 >= 7" :span="6" >
                <el-form-item label=" ">
                  <span>{{ getLabel('fhjlItem3', form.fhjlItem3) }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="0">
              <el-col :span="6">
                <el-form-item label="室内消火栓系统">
                  <span>{{ getLabel('snxhsxtsfaz', form.snxhsxtsfaz) }}</span>
                </el-form-item>
              </el-col>
              <el-col v-if="form.snxhsxtsfaz" :span="6">
                <el-form-item label=" ">
                  <span>{{ getLabel('snxhsxtsfazItem1', form.snxhsxtsfazItem1) }}</span>
                </el-form-item>
              </el-col>
              <el-col
                v-if="form.snxhsxtsfazItem1 == '3' || form.snxhsxtsfazItem1 == '4' && form.snxhsxtsfaz == '1'"
                :span="6"
              >
                <el-form-item label=" ">
                  <span>{{ getLabel('snxhsxtsfazItem2', form.snxhsxtsfazItem2) }}</span>
                </el-form-item>
              </el-col>
              <el-col v-if="form.snxhsxtsfazItem2 >= 7 && form.snxhsxtsfaz == '1'" :span="6">
                <el-form-item label=" ">
                  <span>{{ getLabel('snxhsxtsfazItem3', form.snxhsxtsfazItem3) }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="form.qwhz == '0'" :gutter="0">
              <el-col :span="8">
                <el-form-item label="防火分区" >
                  <span>{{ getLabel('tb_dic_fhty', form.fhfq) }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="">
                  <span>{{ form.fhfqIiem1 || form.fhfqIiem1 == 0 ? form.fhfqIiem1 + '平米' : '-平米' }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="防火间距" >
                  <span>{{ getLabel('tb_dic_fhty', form.fhjj) }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="">
                  <span>{{ form.fhjjItem1 || form.fhjjItem1 == 0 ? form.fhjjItem1 + '米' : '-米' }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="form.qwhz == '0'" :gutter="0">
              <el-col :span="8">
                <el-form-item label="疏散通道">
                  <span>{{ getLabel('sstd', form.sstd) }}</span>
                </el-form-item>
              </el-col>
              <el-col v-if="form.sstd == '2'" :span="4">
                <el-form-item label="">
                  <span>{{ getLabel('sstdItem1', form.sstdItem1) }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8" >
                <el-form-item label="紧急出口">
                  <span>{{ getLabel('yjck', form.yjck) }}</span>
                </el-form-item>
              </el-col>
              <el-col v-if="form.yjck == '2'" :span="4">
                <el-form-item label="">
                  <span>{{ getLabel('yjckItem1', form.yjckItem1) }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="form.qwhz == '0'" :gutter="0">
              <el-col :span="8">
                <el-form-item label="应急疏散照明">
                  <span>{{ getLabel('yjsszm', form.yjsszm) }}</span>
                </el-form-item>
              </el-col>
              <el-col v-if="form.yjsszm == '2'" :span="4" >
                <el-form-item label="">
                  <span>{{ getLabel('yjsszmItem1', form.yjsszmItem1) }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="form.qwhz == '0'" :gutter="0">
              <el-col :span="6">
                <el-form-item label="联网情况">
                  <span>{{ getLabel('sflw', form.sflw) }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label=" ">
                  <span>{{ getLabel('sflwItem1', form.sflwItem1) }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- <el-row v-if="form.qwhz == '0'" :gutter="0">、
            </el-row> -->
            <el-row v-if="form.qwhz == '0'" :gutter="0">
              <el-col :span="6">
                <el-form-item label="是否单方火灾事故" >
                  <span>{{ form.sfdfhzsh == '2' ? '否' : (form.sfdfhzsh == '1' ? '是' : '-') }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div class="fire_building_describe">
            <h2 class="title">起火物</h2>
            <el-row :gutter="0">
              <el-col :span="12">
                <el-form-item label="起火物" prop="qhwms">
                  <span>{{ form.qhwms || '-' }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item v-if="form.qhwms=='其他'" label="其他说明" prop="qhwmsItem1">
                  <span>{{ form.qhwmsItem1 || '-' }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div class="fire_building_describe">
            <h2 class="title">火灾原因</h2>
            <el-row :gutter="0">
              <el-col :xs="24" :sm="24" :lg="24" :span="8">
                <el-row :gutter="0">
                  <el-col :span="12">
                    <el-form-item label="起火原因" prop="hzyyms">
                      <span>{{ form.hzyyms || '-' }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col v-if="form.hzyyfldm == '9900000000'" :span="12" prop="bpchzyymc">
                    <el-form-item label="不排除原因" prop="bpchzyymc">
                      <span>{{ form.bpchzyymc || '-' }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
              <el-col v-if="form.qwhz == '0'" :xs="24" :sm="12" :lg="6" :span="8">
                <el-form-item label="引起火灾人员年龄">
                  <span>{{ (form.zqxxYqhzry.nl || form.zqxxYqhzry.nl == 0) ? form.zqxxYqhzry.nl : '-' }}</span>
                </el-form-item>
              </el-col>
              <el-col v-if="form.qwhz == '0'" :xs="24" :sm="12" :lg="6" :span="8">
                <el-form-item label="受教育程度">
                  <span>{{ getLabel('tb_dic_yqhzrysjycd', form.zqxxYqhzry.sjycddm) }}</span>
                </el-form-item>
              </el-col>
              <el-col v-if="form.qwhz == '0'" :xs="24" :sm="12" :lg="6" :span="8">
                <el-form-item label="健康状况">
                  <span>{{ getLabel('tb_dic_yqhzryjkzk', form.zqxxYqhzry.jkzkdm) }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div class="fire_building_describe">
            <h2 class="title">直接经济损失</h2>
            <el-row :gutter="0">
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="调查方式" prop="dcfs">
                  <span>{{ getLabel('tb_dic_dcfs', form.dcfs) }}</span>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="直接财产损失（元) ">
                  <span>{{ (form.zjccss || form.zjccs == 0) ? form.zjccss : '-' }}</span>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="火灾现场处置费用（元) ">
                  <span>{{ (form.hzxcczfy || form.hzxcczfy == 0) ? form.hzxcczfy : '-' }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="0">
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="人身伤亡支出（元)">
                  <span>{{ (form.ryswzc || form.ryswzc == 0) ? form.ryswzc : '-' }}</span>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="损失来源">
                  <span>{{ getLabel('tb_dic_ssly', form.ssly) }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="0">
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="过火面积（平方米）" prop="ghmj">
                  <span>{{ (form.ghmj || form.ghmj == 0) ? form.ghmj : '-' }}</span>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="受灾户数（户）" prop="szhs">
                  <span>{{ (form.szhs || form.szhs == 0) ? form.szhs : '-' }}</span>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :lg="8" :span="8">
                <el-form-item label="直接受灾人数（人）" prop="szrs">
                  <span>{{ (form.szrs || form.szrs == 0) ? form.szrs : '-' }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!-- 人员伤亡情况信息表 -->
          <div v-if="form.qwhz == '0'" class="fire_building_describe">
            <h2 class="title">人员伤亡情况</h2>
            <el-row :gutter="0">
              <el-col :span="21">
                <el-form-item label="是否有人员伤亡" prop="ishurt">
                  <span>{{ ishurt == '0' ? '无' : (ishurt == '1' ? '有' : '-') }}</span>
                </el-form-item>
              </el-col>
            </el-row>

            <div v-if="ishurt == 1" class="casualties_zone">
              <div class="hurt_zone">
                <h2 class="title">受伤人员
                  <i v-if="!propfrom.isNotEdit" class="el-icon-circle-plus-outline icon-plus" @click="impotHurtPeople('0')" />
                </h2>

                <div
                  v-for="(element,index) in form.ssryList"
                  :key="index"
                  class="swfl_hurt_info_body"
                >
                  <el-row :gutter="0">
                    <el-col :xs="24" :sm="12" :lg="6" :span="8">
                      <el-form-item label="伤情">
                        <span>{{ element.swfl == '1' ? '轻伤' : (element.swfl == '2' ? '重伤' : '-') }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="2" :offset="14" style="text-align: right;">
                      <i v-if="!propfrom.isNotEdit" class="el-icon-remove-outline" @click="delectHurt(index,'0')" />
                    </el-col>
                  </el-row>
                  <el-row :gutter="0">
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="人员姓名">
                        <!-- <el-input v-model="element.xm" placeholder :disabled="propfrom.isNotEdit" /> -->
                        <span>{{ element.xm || '-' }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="人员性别">
                        <span>{{ getLabel('sys_user_sex', element.xb) }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="身份证号">
                        <span>{{ element.sfzhm || '-' }}</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="0">
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="人员年龄">
                        <span>{{  element.nl || '-' }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="健康状况">
                        <span>{{ getLabel('tb_dic_ryjkzk', element.jkzkdm) }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="致伤原因">
                        <span>{{ getLabel('tb_dic_swyy', element.swyydm) }}</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="0">
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="来源">
                        <span>{{ getLabel('tb_dic_ryly', element.rklydm) }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="来源详情">
                        <span>{{ getLabel('tb_dic_ryly2', element.rklydm2) }}</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="0">
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="职业">
                        <span>{{ getLabel('tb_dic_ryzy', element.zydm) }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="受教育程度">
                        <span>{{ getLabel('tb_dic_rysjycd', element.sjycddm) }}</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </div>
              <el-divider />
              <div class="dead_zone">
                <h2 class="title">死亡人员
                  <i v-if="!propfrom.isNotEdit" class="el-icon-circle-plus-outline icon-plus" @click="impotHurtPeople('1')" />
                </h2>
                <div
                  v-for="(unit,index) in form.swryList"
                  :key="index"
                  class="swfl_dead_info_body"
                >
                  <el-row :gutter="0">
                    <el-col :span="2" :offset="22" style="text-align:right;">
                      <i v-if="!propfrom.isNotEdit" class="el-icon-remove-outline" @click="delectHurt(index,'1')" />
                    </el-col>
                  </el-row>
                  <el-row :gutter="0">
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="人员姓名">
                        <span>{{ unit.xm || '-' }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="人员性别">
                        <span>{{ getLabel('sys_user_sex', unit.xb) }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="身份证号">
                        <span>{{ unit.sfzhm || '-' }}</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="0">
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="人员年龄">
                        <span>{{ (unit.nl || unit.nl == 0) ? unit.nl : '-' }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="职业">
                        <span>{{ getLabel('tb_dic_ryzy', unit.zydm) }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="健康状况">
                        <span>{{ getLabel('tb_dic_ryjkzk', unit.jkzkdm) }}</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="0">
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="致死原因">
                        <span>{{ getLabel('tb_dic_swyy', unit.swyydm) }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="来源">
                        <span>{{ getLabel('tb_dic_ryly', unit.rklydm) }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="来源详情">
                        <span>{{ getLabel('tb_dic_ryly2', unit.rklydm2) }}</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row v-if="unit.hasOwnProperty('swwzdm')" :gutter="0">
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="发现尸体位置">
                        <span>{{ getLabel('tb_dic_swwz', unit.swwzdm) }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="死亡时间">
                        <span>{{ getLabel('swsj', unit.swsjdm) }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col v-if="unit.swsjdm==='1000'||unit.swsjdm==='2000'" :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="死亡时间详细信息">
                        <span>{{ getLabel('swsjItem1', unit.swsjdmItem1) }}</span>
                        <!-- <span>{{unit.swsjdmItem1}}</span> -->
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
          </div>

          <div v-if="form.qwhz == '0'" class="fire_building_describe">
            <h2 class="title">处理情况 - 两案处理</h2>
            <el-row :gutter="0">
              <el-col :xs="24" :sm="12" :lg="6" :span="8">
                <el-form-item label="是否立案">
                  <span>{{ form.sfla == '0' ? '是' : (form.sfla == '1' ? '否' : '-') }}</span>
                </el-form-item>
              </el-col>
              <el-col v-if="form.sfla=='0'" :xs="24" :sm="12" :lg="6" :span="8">
                <el-form-item label="追究人数">
                  <span>{{ (form.zjrs || form.zjrs == 0) ? form.zjrs : '-' }}</span>
                </el-form-item>
              </el-col>
              <el-col v-if="form.sfla=='0'" :xs="24" :sm="12" :lg="6" :span="8">
                <el-form-item label="建议处理人数">
                  <span>{{ (form.jyclrs || form.jyclrs == 0) ? form.jyclrs : '-' }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div v-if="form.qwhz == '0'" class="fire_building_describe">
            <h2 class="title">处理情况 - 火灾处罚情况</h2>
            <el-row :gutter="0">
              <el-col v-if="form.qwhz == '0'" :span="21">
                <el-form-item label="是否立案">
                  <span>{{ isRegister == '0' ? '否' : (isRegister == '1' ? '是' : '-') }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 单位或个人列表 -->
            <div v-if="isRegister == 1">
              <div class="dw_zone">
                <h2 class="title">处罚单位列表
                  <i v-if="!propfrom.isNotEdit" class="el-icon-circle-plus-outline icon-plus" @click="addHzcfqkItem('1')" />
                </h2>
                <el-row v-for="(item,index) in form.zqxxDwclList" :key="index" :gutter="0">
                  <el-col :span="7">
                    <el-form-item label="单位名称">
                      <span>{{ form.zqxxDwclList[index].dwmc || '-' }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item label="法人代表">
                      <span>{{ form.zqxxDwclList[index].frdb || '-' }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="12" :lg="6" :span="8">
                    <el-form-item label="行政处罚">
                      <span>{{ getLabel('tb_dic_grxzcf', form.zqxxDwclList[index].dwxzcfdm) }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="2" style="text-align: center;">
                    <el-form-item label=" ">
                      <i v-if="!propfrom.isNotEdit" class="el-icon-remove-outline" @click="delectHzcfqkItem(index, '1')" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
              <el-divider />
              <div class="gr_zone">
                <h2 class="title">处罚个人列表
                  <i v-if="!propfrom.isNotEdit" class="el-icon-circle-plus-outline icon-plus" @click="addHzcfqkItem('2')" />
                </h2>
                <el-row v-for="(item,index) in form.zqxxGrclList" :key="index" :gutter="0">
                  <el-col :span="7">
                    <el-form-item label="姓名">
                      <span>{{ form.zqxxGrclList[index].xm || '-' }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item label="性别">
                      <span>{{ getLabel('sys_user_sex', form.zqxxGrclList[index].xb) }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="12" :lg="6" :span="8">
                    <el-form-item label="行政处罚">
                      <span>{{ getLabel('tb_dic_grxzcf', form.zqxxGrclList[index].grxzcfdm) }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="2" style="text-align: center;">
                    <el-form-item label=" ">
                      <i v-if="!propfrom.isNotEdit" class="el-icon-remove-outline" @click="delectHzcfqkItem(index, '2')" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>

          <div v-if="form.qwhz == '0' && form.sfxsfh == '1'" class="fire_building_describe">
            <h2 class="title">刑事放火</h2>
            <el-row v-if="form.sfxsfh == '1'" :gutter="0">
              <el-col :span="24">
                <el-form-item label="移交资料">
                  <el-input v-model="form.zqxxXsfh.yjzlName" placeholder="请上传文件" readonly :disabled="propfrom.isNotEdit">
                    <div slot="suffix">
                      <div class="upload">
                        <i class="iconfont icon-shangchuan" />
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
                          <i class="el-icon-upload el-icon--right" />
                        </el-button>
                      </el-upload>
                    </div>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="移交资料描述">
                  <span>{{ form.zqxxXsfh.yjzlRemark || '-' }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="案件结果">
                  <el-input v-model="form.zqxxXsfh.ajjgName" placeholder="请上传文件" readonly :disabled="propfrom.isNotEdit">
                    <div slot="suffix">
                      <div class="upload">
                        <i class="iconfont icon-shangchuan" />
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
                          <i class="el-icon-upload el-icon--right" />
                        </el-button>
                      </el-upload>
                    </div>
                  </el-input>
                </el-form-item>
              </el-col>
              </el-col>
              <el-col :span="24">
                <el-form-item label="案件结果描述">
                  <span>{{ form.zqxxXsfh.ajjgRemark || '-' }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="现场情况报告">
                  <el-input v-model="form.zqxxXsfh.xcqkbgName" placeholder="请上传文件" readonly :disabled="propfrom.isNotEdit">
                    <div slot="suffix">
                      <div class="upload">
                        <i class="iconfont icon-shangchuan" />
                      </div>
                      <el-upload
                        class="upload-demo"
                        action="string"
                        :http-request="uploadxcqkbg"
                        :show-file-list="false"
                      >
                        <el-button type="primary">
                          上传
                          <i class="el-icon-upload el-icon--right" />
                        </el-button>
                      </el-upload>
                    </div>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="现场情况报告描述">
                  <span>{{ form.zqxxXsfh.xcqkbgRemark || '-' }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div v-if="form.qwhz == '0'" class="fire_building_describe">
            <h2 class="title">安全生产事故</h2>
            <el-row :gutter="0">
              <el-col :span="24">
                <el-form-item label="是否属于安全事故" prop="sfaqscsg">
                  <span>{{ form.sfaqscsg == '0' ? '否' : (form.sfaqscsg == '1' ? '是' : '-') }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="form.sfaqscsg == '1'" :gutter="0">
              <el-col :span="24">
                <el-form-item label="有关政府文件">
                  <el-input v-model="form.zqxxAqscsg.ygzfwjName" style="width:70%" placeholder="请上传文件" readonly :disabled="propfrom.isNotEdit">
                    <div slot="suffix">
                      <div class="upload">
                        <i class="iconfont icon-shangchuan" />
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
                          <i class="el-icon-upload el-icon--right" />
                        </el-button>
                      </el-upload>
                    </div>
                  </el-input>
                  <el-button v-if="form.zqxxAqscsg.ygzfwjName" type="primary" @click="downloadFires(form.zqxxAqscsg.ygzfwj, form.zqxxAqscsg.ygzfwjName)">下载</el-button>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="有关政府文件描述">
                  <span>{{ form.zqxxAqscsg.ygzfwjRemark || '-' }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="现场情况报告">
                  <el-input v-model="form.zqxxAqscsg.xcqkbgName" style="width:70%" placeholder="请上传文件" readonly :disabled="propfrom.isNotEdit">
                    <div slot="suffix">
                      <div class="upload">
                        <i class="iconfont icon-shangchuan" />
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
                          <i class="el-icon-upload el-icon--right" />
                        </el-button>
                      </el-upload>
                    </div>
                  </el-input>
                  <el-button v-if="form.zqxxAqscsg.xcqkbgName" type="primary" @click="downloadFires(form.zqxxAqscsg.xcqkbg, form.zqxxAqscsg.xcqkbgName)">下载</el-button>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="现场情况报告描述">
                  <span>{{ form.zqxxAqscsg.xcqkbgRemark || '-' }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div v-if="form.qwhz == '0'" class="fire_building_describe">
            <h2 class="title">火场图片</h2>
            <el-row :gutter="0">
              <el-col :span="24">
                <el-upload
                  ref="imageUpload"
                  action=""
                  :auto-upload="true"
                  list-type="picture-card"
                  multiple
                  :limit="6"
                  accept=".jpg,.png,.jpeg"
                  :file-list="fileList"
                  :http-request="uploadImage"
                  :on-preview="handlePictureCardPreview"
                  :before-remove="beforeHandleRemove"
                  :on-remove="handleRemove"
                  :disabled="propfrom.isNotEdit"
                >
                  <i class="el-icon-plus" />
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
              </el-col>
            </el-row>
          </div>

          <div v-if="form.qwhz == '0'" class="fire_building_describe">
            <h2 class="title">其他</h2>
            <el-row :gutter="0">
              <el-col :span="24">
                <el-form-item label="其他说明">
                  <span>{{ form.qtsm || '-' }}</span>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="相关附件上传">
                  <el-input v-model="form.ygfjscName" placeholder="请上传文件" style="width:70%" readonly :disabled="propfrom.isNotEdit">
                    <div slot="suffix">
                      <div class="upload">
                        <i class="iconfont icon-shangchuan" />
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
                          <i class="el-icon-upload el-icon--right" />
                        </el-button>
                      </el-upload>
                    </div>
                  </el-input>
                  <el-button v-if="form.ygfjsc" type="primary" @click="downloadFires(form.ygfjsc, form.ygfjscName)">下载</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </div>
    </div>
    <audit v-if="propfrom.type == 1 || propfrom.type == 3" :propfrom="propfrom" @auditData="auditData" />

    <!-- 起火场所 -->
    <fireSpaceMul ref="Mulmodel" :qhcs-type="form.qhcslb ? form.qhcslb : ''" @setMulVals="setMulVals" />
    <!-- 起火物 -->
    <fireObjectMul ref="fireObjecMul" @setFireMulVal="setFireMulVal" />
    <!-- 起火原因 -->
    <fireReasonMul ref="fireReasonMul" @setFireReasonMulVal="setFireReasonMulVal" />
    <!-- 不排除起火原因 -->
    <fireBpcMul ref="bpcModel" @setMulVal="setbpcVal" />
    <!-- <div class="bottom-btnGroup">
      <button v-if="!propfrom.isNotEdit" class="btn_back" @click="back">返回</button>
      <button v-if="propfrom.type == '0'" class="btn_orange btn_white" @click="submitForm('ruleForm')">{{propfrom.jqbh==""?"保存":"送审"}}</button>
      <button v-if="propfrom.type == '1' && !propfrom.isNotEdit" class="btn_orange btn_white" @click="submitAudit('ruleForm')">审核</button>
      <button v-if="propfrom.type == '2'" class="btn_orange btn_white" @click="submitEdit('ruleForm')">修改</button>
      <button v-if="propfrom.type == '3'" class="btn_orange btn_white" @click="submitAudit('ruleForm')">修改</button>
    </div> -->
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
    doAduit,
    getHisDataPic,
    updateCaogao,
    deletePicByAvater, // 删除火场图片
    getHisCaogaoDataDetail
  } from '@/api/data/entry/zqxx'
  import fireSpaceMul from './fireSpaceMul.vue'
  import fireObjectMul from './fireObjectMul'
  import fireReasonMul from './fireReasonMul'
  import fireBpcMul from './fireBpcMul'
  import topDetail from './topDetail'
  import { options, treeOptions } from './options'
  import { formList, rulesList, echoCheckData } from './form'
  import { fileDownload } from '@/utils/fileDownload'
  import audit from '@/views/data/aduit/zqxx/components/audit'
  export default {
    name: 'DisasterSituationReport',
    components: {
      fireSpaceMul,
      fireObjectMul,
      fireReasonMul,
      fireBpcMul,
      topDetail,
      audit
    },
    props: ['propfrom'],
    data() {
      return {
        fileList: [

        ],
        dialogImageUrl: '',
        dialogVisible: false,
        name: '', // 起火物选择其他的时候，自定义名称
        content_kv_show: true, // 警情信息
        // rules: rulesList, // 表单验证
        date: [
          {
            type: 'date',
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }
        ],
        xzqydmSj: '', // 行政区域
        zqbh: '', // 火灾编号
        loading: '', // 加载
        hurtDeathNum: '',
        isdisappear: true,
        ishurt: '0', // 人员是否伤亡
        deadNumber: 0, // 死亡人数
        hurtNumber: 0, // 受伤人数
        isLast: false, // 是否有下一项
        jqTopData: {}, // 警情头部信息
        cdTopData: [], // 出动信息
        isRegister: '0', // 处理情况 - 火灾处罚情况 是否立案
        form: {
          zqbh: '', // 火灾编号
          xzqydm: '', // 行政区域代码
          jqbh: '', // 警情编号
          zqlbdm: '', // 灾情类别代码

          qwhz: '', // 轻微火灾
          // 基本信息
          sfdcz: '0', // 是否正在调查
          zqlbdm: '', // 火灾等级
          zqsj: '', // 起火时间
          zqdd: '', // 起火地点
          lxdh: '', // 失火单位/户主联系电话
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

          // 火灾及失火建筑情况描述
          hzsfmydljjz: '0', // 火灾蔓延到邻近建筑
          sffshr: '0', // 发生轰然
          shjzmcsfkq: '0', // 失火建筑门窗在火灾过程中开启
          jzzlcs: '', // 建筑总楼层数
          shlc: '', // 失火楼层

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
          zjccss: '', // 直接财产损失（元)
          hzxcczfy: '', // 火灾现场处置费用（元)
          ryswzc: '', // 人身伤亡支出（元)
          ssly: '', // 损失来源
          ghmj: '', // 过火面积（平方米）
          szhs: '', // 受灾户数（户）
          szrs: '', // 直接受灾人数（人）

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
          ygfjscName:'', // 相关附件名称
          ygfjsc: '', // 相关附件上传

          issueFlag:'',//提交标志状态
        },
        // select数据
        Options: {
          dcfs: [], hylbdm: [], jjlxdm: [], qhcslb: [], sfsjycdm: [], jzlbdm: [],
          jznhdjdm: [], jzjgdm: [], fhfq: [], fhjj: [], sstd: [], sflw: [], sflwItem1: [],
          zdbjxtsfaz: [], zdbjxtsfazItem1: [], zdbjxtsfazItem2: [], zdbjxtsfazItem3: [],
          zdmhxtsfaz: [], zdmhxtsfazItem1: [], zdmhxtsfazItem2: [], zdmhxtsfazItem3: [],
          fpyxtsfaz: [], fpyxtsfazItem1: [], fpyxtsfazItem2: [], fpyxtsfazItem3: [],
          snxhsxtsfaz: [], snxhsxtsfazItem1: [], snxhsxtsfazItem2: [], snxhsxtsfazItem3: [],
          fhjlItem1: [], fhjlItem2: [], fhjlItem3: [], jjck: [], yjsszm: [], yjsszmItem1: [],
          sjycddm: [], jkzkdm: [], ssly: [], xb: [], nl: [], jkzkdm: [], swyydm: [], rklydm: [], rklydm2: [],
          zydm: [], sjycddm: [], swyydm: [], swwzdm: [], swsjdm: [], dwxzcfdm: [], xb: [],
          grxzcfdm: [], qydm: [], jdjcqk: [], jdjcqkItem1: [], jdjcqkItem2: [], sgqtdcbm: [],
          sstdItem1: [], jjckItem1: [], qydmItem2: [], jzsyyt: [], jzsyytItem1: [], swsjItem1: [],
          jzzlcs: '', // 建筑总楼层数
          shlc: '', // 失火楼层
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

        // 暂存图片列表
        imgsList: {}
      }
    },
    computed: {
      easyMessage: function() {
        let peoUnit = '(单位名/户主名)';
        if (this.form.zqxxDwclList.length !== 0) {
          peoUnit = '';
          //   this.form.zqxxDwcList.forEach(item => {
          //       peoUnit = peoUnit + item.dwmc + '/';
          //   })
          peoUnit =
            this.form.zqxxDwclList[0].dwmc + '/' + this.form.zqxxDwclList[0].frdb
        }
        let qhw = '(起火物)';
        if (this.form.qhwms !== '' && this.form.qhwms !== null) {
          qhw = this.form.qhwms
        }
        let ghmj = '(过火面积)';
        if (this.form.ghmj !== 0) {
          ghmj = this.form.ghmj
        }
        let zjccss = '0';
        if (this.form.zjccss !== 0) {
          zjccss = this.form.zjccss
        }
        // const deadNum = this.deadNumber == 0 ? '0' : this.deadNumber
        // const hurtNum = this.hurtNumber == 0 ? '0' : this.hurtNumber
        const qhyy = this.form.hzyyms ? this.form.hzyyms : '(起火原因)';

        return `${this.form.zqsj || '(起火时间)'}，${this.xzqydmSj ||
        '(行政区域)'},【${this.dwmcHzm || '(单位名/户主名)'}】发生火灾，烧毁${this.form.zqdd ||
        '(起火场所)'}内${qhw}等物品，过火面积 ${ghmj} 平方米，造成 ${this.form.swryList.length || 0} 人死亡、${this.form.ssryList.length || 0} 人受伤，直接经济损失 ${zjccss} 元，起火原因系 ${qhyy}`
      }
    },
    watch: {
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
    created() {
      console.log(this.propfrom);
      this.content_kv_show = this.propfrom.state || this.$route.query.state;
      this.form.zqlbdm = this.propfrom.qwhz == 1 ? '10000' : '';
      this.form.qwhz = this.propfrom.qwhz;
      this.form.zqdd = this.propfrom.jqfsdd;
      this.form.jqbh = this.propfrom.jqbh;
      this.form.issueFlag = this.propfrom.type;
      if (this.propfrom.state) {
        // 头部出动查询
        getCdxxList({
          jqbh: this.form.jqbh
        })
          .then(res => {
            this.cdTopData = res.data
          })
          .catch(res => {
            console.error(res)
          })
      }
      // 获取警情头部信息
      getJqxxList({
        jqbh: this.form.jqbh
      })
        .then(res => {
          this.dwmcHzm = res.data.dwmcHzm;
          this.xzqydmSj = res.data.xzqydmSj;
          this.form.xzqydm = res.data.xzqydm; // 获取行政区域代码
          this.jqTopData = res.data
        })
        .catch(res => {
          console.error(res)
        });
      // 获取下拉框的数据
      this.setSelectInfo();
      // },
      // mounted() {

      // 如果是修改 就请求数据来回显
      if (this.propfrom.type == '1' || this.propfrom.type == '3') {
        this.loading = true;
        this.getImageList();// 获取图片列表展示
        lszqDetailList({ zqbh: this.propfrom.zqbh })
          .then(res => {
            // console.log("回显", res.data);
            this.formData = res.data[0];
            this.echoGetTreeOptions();// 回显数据获取消防设施数据
            this.formData.zqxxDwclList.length > 0 || this.formData.zqxxGrclList.length > 0 ? this.isRegister = '1' : this.isRegister = '0';
            this.formData.zqxxRyswList.length > 0 ? this.ishurt = '1' : this.ishurt = '0';
            this.form = echoCheckData(this.formData);
            this.form.issueFlag = this.propfrom.type;
            if (this.formData.swryList != null || this.formData.swryList != []) {
              this.formData.swryList.forEach((item, index) =>{
                getTreeOptions({
                  dictType: "swsj",
                  parentValue: item.swsjdm
                })
                  .then(res => {
                    if(res.code == 200) this.Options.swsjItem1 = res.data;
                  })
              })
            }
            this.loadNext(this.formData.jdjcqk);
            this.loadNext_1(this.formData.jdjcqkItems);
            this.loading = false
          })
          .catch(res => {
            this.loading = false
          })
          .finally(() => {})
      }
      if (this.propfrom.type == '2') {
        this.loading = true;
        this.getImageList();// 获取图片列表展示
        getHisCaogaoDataDetail({ zqbh: this.propfrom.zqbh })
          .then(res => {
            // console.log('haixiang', res.data[0]);
            this.formData = res.data[0];
            this.echoGetTreeOptions();// 回显数据获取消防设施数据
            // console.log(this.formData)
            this.formData.zqxxDwclList.length > 0 || this.formData.zqxxGrclList.length > 0 ? this.isRegister = '1' : this.isRegister = '0';
            this.formData.zqxxRyswList.length > 0 ? this.ishurt = '1' : this.ishurt = '0';
            this.form = echoCheckData(this.formData);
            if (this.formData.swryList != null || this.formData.swryList != []) {
              this.formData.swryList.forEach((item, index) =>{
                getTreeOptions({
                  dictType: "swsj",
                  parentValue: item.swsjdm
                })
                  .then(res => {
                    if(res.code == 200) this.Options.swsjItem1 = res.data;
                  })
              })
            }
            this.loadNext(this.formData.jdjcqk);
            this.loadNext_1(this.formData.jdjcqkItems);
            this.detailDone = true;
            this.loading = false
          })
          .catch(res => {
            this.loading = false
          })
          .finally(() => {})
      }
    },
    methods: {
      downloadFires(url, name){
        let $url = `${process.env.VUE_APP_BASE_API}${url}`;
        fileDownload($url, name);
      },
      beforeHandleRemove(file, fileList) {

      },
      handleRemove(file, fileList) {
        let avatar = '';
        if (file.avatar) {
          avatar = file.avatar
        } else {
          avatar = this.imgsList[file.name]
        }
        deletePicByAvater({ avatar: avatar })
          .then(res => {
            if (res.code == 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              delete this.imgsList[file.name]
            }
          })
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true
      },
      /**
       * 上传火场照片
       * 上传单张不可大于10M
       */
      uploadImage(params) {
        const { file } = params;
        const fileType = file.name.split('.')[1];
        const isLt10M = file.size / 1024 / 1024 < 6;
        if (!isLt10M) {
          this.$message.warning('上传图片大小不能超过 6MB');
          this.$refs.imageUpload.clearFiles();
          return false
        }
        const formData = new FormData();
        formData.append('file', file);// 上传的文件
        formData.append('remark', '');// 图片描述，当前传空，后期修改添加
        formData.append('zqbh', this.form.zqbh);// zqbh火灾编号，
        // 调用上传接口
        UploadPicFile(formData)
          .then(res => {
            this.imgsList[res.data.name] = res.data.avatar;
            this.form.zqbh = res.data.zqbh;
            this.$message({
              message: '成功上传',
              type: 'success'
            })
          })
          .catch(err => {
            console.log(err, 'error')
          })
      },
      /**
       * 获取图片列表数据
       */
      getImageList() {
        getHisDataPic({ bh: this.propfrom.zqbh })
          .then(res => {
            res.data.forEach(el => {
              el.url = `${process.env.VUE_APP_FTP_API}${el.avatar}`
            });
            this.fileList = res.data
          })
          .finally(() => {})
      },
      // 获取审核数据
      auditData(val) {
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
      echo() {
        if (this.propfrom.type == 0) {
          // 填报
          if (this.optionsDone && this.treeOptionsDone) {
            this.loading = false
          }
        } else {
          this.loading = false;
          // 修改
          if (this.optionsDone && this.treeOptionsDone && this.detailDone) {
            this.loading = false
          }
        }
      },
      sfbxItemChange(val) {
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
      delectHurt(index, isdeadType) {
        // console.log(isdeadType);
        // isdeadType == "0" ? this.hurtNumber-- : this.deadNumber--;
        if (isdeadType == '0') {
          this.form.ssryList.splice(index, 1)
        } else {
          this.form.swryList.splice(index, 1)
        }
        // this.form.zqxxRyswList.splice(index, 1);
      },
      /**
       * 重置受伤人员
       * 1 有受伤人员
       * 0 无受伤人员
       */
      resetIshurt(val) {
        if (val == 0) this.form.swryList = this.form.ssryList = []
      },

      // 起火物
      openQhwMul() {
        if (this.propfrom.isNotEdit) {
          return
        }
        this.$refs.fireObjecMul.toggle();
        this.$refs.fireObjecMul.echo(this.form.qhwfldm)
      },
      // 起火原因
      openQhyyMul() {
        if (this.propfrom.isNotEdit) {
          return
        }
        this.$refs.fireReasonMul.toggle()
        // this.$refs.Mulmodel.echo();
      },
      // 起火场所
      openQhcsMul() {
        if (this.propfrom.isNotEdit) {
          return
        }
        this.$refs.Mulmodel.toggle();
        this.$refs.Mulmodel.echo(this.form.zqxxQhcsList)
      },
      // 不排除原因
      openBpcMul() {
        if (this.propfrom.isNotEdit) {
          return
        }
        this.$refs.bpcModel.toggle();
        this.$refs.bpcModel.echo(this.form.zqxxBpchzyyList)
      },
      reset(val) {
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
      setMulVals(arr) {
        this.form.qhcsms = '';
        this.form.qhcsdm = '';
        this.form.zqxxQhcsList = [];
        this.form.zqxxQhcsList = arr;
        this.form.qhcsms = arr[0].dictLabel;
        this.form.qhcsdm = arr[0].dictValue
      },
      // 接受起火物数据
      setFireMulVal(arr) {
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
      // 接受起火原因数据
      setFireReasonMulVal(arr) {
        this.form.zqxxBpchzyyList = [];
        // 判断是否是刑事放火 是刑事放火，则展示刑事放火，否则隐藏刑事放火
        arr[0].dictValue == '0101000000' ? this.form.sfxsfh = '1' : this.form.sfxsfh = '0';
        // 如果起火原因!='不排除原因'，则清空不排除原因数据
        if (arr[0].dictValue != '9900000000') {
          this.form.bpchzyymc = '';
          this.form.zqxxBpchzyyList = []
        }
        this.form.hzyyms = arr[0].dictLabel;
        this.form.hzyyfldm = arr[0].dictValue
      },
      // 接收不排除原因
      setbpcVal(arr) {
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
      // 处理时间格式
      handleName() {
        this.form.zqsj == null || this.form.zqsj == ''
          ? '接警时间'
          : this.form.zqsj.slice(0, 10)
      },
      // 形式犯罪
      /**
       * 移交资料图片上传
       */
      uploadImg(item) {
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
      uploadajjg(item) {
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
      uploadxcqkbg(item) {
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
      uploadzfwj(item) {
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
      uploadxcbg1(item) {
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
      uploadhcpic1(item) {
        const formData = new FormData();

        formData.append('file', item.file);
        formData.append('zqbh', this.form.zqbh);
        // 调用上传接口
        UploadPicFile(formData)
          .then(res => {
            this.form.zqbh = res.data.zqbh;
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
      uploadxgfj(item) {
        const formData = new FormData();
        formData.append('file', item.file);
        formData.append('zqbh', this.form.zqbh);
        // 调用上传接口
        UploadFile(formData)
          .then(res => {
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
      nextItem(index, type, val) {
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
      getNextOption(index, type, val) {
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
      swsjSelect(index,val){
        this.form.swryList[index].swsjdmItem1 = '';
        getTreeOptions({
          dictType: "swsj",
          parentValue: val
        }).then(res => {
          if(res.code == 200) this.form.swryList[index].swsjItem1 = res.data;
        });
      },
      /**
       * 重置火灾处罚情况
       * 选择0时重置
       * 1 立案
       * 0 没有立案
       */
      resetHzcfqkItem(val) {
        if (val == 0) this.form.zqxxDwclList = this.form.zqxxGrclList = []
      },
      /**
       * 删除处罚列表
       * @param index 删除列表的位置信息
       * @param type 删除类型 1 单位， 2 个人
       */
      delectHzcfqkItem(index, type) {
        type == 1 ? this.form.zqxxDwclList.splice(index, 1) : this.form.zqxxGrclList.splice(index, 1)
      },
      //   计数器
      handleChange(value) {},
      //   返回
      back() {
        this.$emit('back', false)
      },
      //   树型结构数据
      loadNext(val) {
        if (val != '1') {
          this.form.jdjcqkItem1 = '';
          this.form.jdjcqkItem2 = '';
          this.form.jdjcqkItems = ''
        }
        getTreeOptions({
          dictType: 'jdjcqk',
          parentValue: this.form.jdjcqk
        }).then(res => {
          this.Options.jdjcqkItem1 = res.data
        })
      },
      /**
       * 监督检查情况
       * 下级菜单
       */
      loadNext_1(val) {
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
       * 	@param val
       * 	1 添加死亡人员
       *  0 添加受伤人员
       */
      impotHurtPeople(val) {
        // val == "1" ? this.deadNumber++ : this.hurtNumber++;
        val == '1'
          ? this.form.swryList.push({
            swfl: '0', xm: '', xb: '', sfzhmm: '', nl: '', jkzkdm: '', swyydm: '', rklydm: '', rklydm2: '',
            zydm: '', sjycddm: '', swwzdm: '', swsjdm: '', swsjdmItem1: '', swyydm: '',swsjItem1:[]})
          : this.form.ssryList.push({
            swfl: '', xm: '', xb: '', sfzhmm: '', nl: '', jkzkdm: '', swyydm: '', rklydm: '', rklydm2: '',
            zydm: '', sjycddm: ''
          })
      },
      /**
       * 添加火灾处罚情况
       * 1 添加单位
       * 2 添加个人
       * */
      addHzcfqkItem(val) {
        val == '1'
          ? this.form.zqxxDwclList.push({ dwmc: '', frdb: '', grxzcfdm: '' })
          : this.form.zqxxGrclList.push({ xm: '', xb: '', grxzcfdm: '' })
      },
      //  提交表单
      reportForm() {
        //   调用提交接口
        saveWrite(this.form).then(res => {
          this.loading = false;
          // this.loading.close();
          this.$notify({
            title: '成功',
            message: '成功提交',
            type: 'success'
          });
          this.back();
          if(this.propfrom.jqbh){
            this.$router.push({
              path:'/data/entry/lszqxx'
            })
          }
        })
          .finally(() => { this.loading = false })
      },
      //  表单验证
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.loading = true;
            // this.loading = this.$loading({
            //   lock: true,
            //   text: "正在提交",
            //   background: "rgba(0, 0, 0, 0.7)"
            // });
            this.reportForm()
          } else {
            this.$notify({
              title: '警告',
              message: '请填写相应信息',
              type: 'warning'
            });
            return false
          }
        })
      },
      submitAudit(formName) {
        switch (this.form.zqlbdm) {
          case '10000':
            this.level = '0';
            break;
          case '10001':
            this.level = '1';
            break;
          case '10002':
            this.level = '3';
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
            this.loading = true;
            doAduit(this.form).then(res => {
              this.loading = false;
              this.$notify({
                title: '成功',
                message: '操作成功',
                type: 'success'
              });
              this.back()
            })
              .finally(() => { this.loading = false })
          } else {
            this.$notify({
              title: '警告',
              message: '请填写相应信息',
              type: 'warning'
            });
            return false
          }
        })
      },
      // 提交修改
      submitEdit(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.loading = true;
            updateCaogao(this.form).then(res => {
              this.loading = false;
              this.$notify({
                title: '成功',
                message: '成功提交',
                type: 'success'
              });
              this.back()
            })
              .finally(() => { this.loading = false })
          } else {
            this.$notify({
              title: '警告',
              message: '请填写相应信息',
              type: 'warning'
            });
            return false
          }
        })
      },
      //   设置数据传入
      setSelectInfo() {
        // 简单的option 请求
        options.forEach((item, index) => {
          // console.log(item)
          getSelectOptions(item)
            .then(res => {
              this.Options[item] = res.data;
              if (index == options.length - 1) {
                this.optionsDone = true
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
      echoGetTreeOptions() {
        const arr = ['zdbjxtsfaz', 'zdbjxtsfazItem1', 'zdbjxtsfazItem2', 'zdbjxtsfazItem3', // 自动报警系统
          'zdmhxtsfaz', 'zdmhxtsfazItem1', 'zdmhxtsfazItem2', 'zdmhxtsfazItem3', // 自动灭火系统
          'fpyxtsfaz', 'fpyxtsfazItem1', 'fpyxtsfazItem2', 'fpyxtsfazItem3', // 防排烟系统
          'fhjl', 'fhjlItem1', 'fhjlItem2', 'fhjlItem3', // 防火卷帘
          'snxhsxtsfaz', 'snxhsxtsfazItem1', 'snxhsxtsfazItem2', 'snxhsxtsfazItem3'// 室内消火栓系统
        ];
        const arrs = { zdbjxtsfaz: 'zdbjxtsfazItem1', zdbjxtsfazItem1: 'zdbjxtsfazItem2', zdbjxtsfazItem2: 'zdbjxtsfazItem3', // 自动报警系统
          zdmhxtsfaz: 'zdmhxtsfazItem1', zdmhxtsfazItem1: 'zdmhxtsfazItem2', zdmhxtsfazItem2: 'zdmhxtsfazItem3', // 自动灭火系统
          fpyxtsfaz: 'fpyxtsfazItem1', fpyxtsfazItem1: 'fpyxtsfazItem2', fpyxtsfazItem2: 'fpyxtsfazItem3', // 防排烟系统
          fhjl: 'fhjlItem1', fhjlItem1: 'fhjlItem2', fhjlItem2: 'fhjlItem3', // 防火卷帘
          snxhsxtsfaz: 'snxhsxtsfazItem1', snxhsxtsfazItem1: 'snxhsxtsfazItem2', snxhsxtsfazItem2: 'snxhsxtsfazItem3'// 室内消火栓系统
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
      // 根据值获取optione里的label
      getLabel(val, code) {
        if (undefined == code || code == "") {
          return null;
        }
        let dictLabel = '';
        /**
         * 特殊处理多选值
         * @param  {Number} code.indexOf(",")> [description]
         * @return {String}                    [description]
         */
        if (code.indexOf(",")>=0) {
          code.split(',').forEach((item) => {
            this.Options[val].map(items => {
              if (item == items.dictValue) {
                dictLabel += items.dictLabel + ' ';
              }
            });
          });
          console.log(dictLabel);
          return dictLabel || "-";
        }
        if (val == 'swsjItem1') { // 特殊处理
          this.Options[val].map(item => {
            if (code == item.dictValue) {
              dictLabel = item.dictLabel;
            }
          });
          return dictLabel || "-";
        }
        if (this.Options[val]) {
          this.Options[val].map(item => {
            if (code == item.dictValue) {
              dictLabel = item.dictLabel;
            }
          });
          return dictLabel || "-";
        }
      },
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../style/style.styl';
  .page_zone {
    .view-title {
      margin: 0px;
      margin-right: auto;
      height: 44px;
      line-height: 32px;
      font-weight: 400;
      color: #393C41;
      font-size: 18px;
      padding-left: 32px;
      background-repeat: no-repeat;
      background-position: 0 50%;
      background-size: 23px;
      border-bottom: 1px solid #e8e8e8;
      padding-bottom: 12px;
      margin-bottom: 15px;
        span{
          font-size:12px;
          margin-left:6px;
        }
    }
    .content .info_description {
      margin-top: 0;

    }
    .el-form-item{
      margin-bottom:0px;
    }
    .fire_building_describe{
      border-bottom: 1px dashed #eaeaea !important;
    }
  }
  .bottom-btnGroup {
    text-align:center;
  }

  .fire_building_describe {
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0) !important;
    border: 0 !important;
    /deep/ .el-form-item__label {
      color: #939eab !important;

    }
  }
</style>
<style lang="stylus">
.fireInfo{
  .el-form-item__label {
    text-align:left;
    // float: none;
    min-height: 32px;
    font-size: 14px;
    font-weight: 500;
    color: #939EAB;
    // white-space: nowrap;
  }
}
</style>
