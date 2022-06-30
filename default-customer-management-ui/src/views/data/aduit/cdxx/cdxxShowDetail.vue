<template lang="pug">
  .app-container.cdxxShowDetail
    .title
      h2 {{ $route.meta.title }}
        span (出动编号：{{$route.query.cdbh}})
      //.print
      //  el-button(type="primary" @click="printf") 打印
    .historyInfo(v-loading="infoLoading")
      //- 警情信息详情组件
      top-detail(v-if="listData.jqxx" :isShow="true" :jq-top-data="listData.jqxx")
      .cdInfo(v-if="listData.cdxx")
        el-form(label-position="right")
          el-row(:gutter="60")
            el-col(:span="24")
              .shadow-box
                .shadow-title 简要情况
                el-row(:gutter="60")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="处置情况")
                      span.item {{ getLabel("dicCzqk", listData.cdxx.czqkdm) }}
                  el-col(:span="24" v-if="listData.cdxx.czqkdm=='01'")
                    el-row(:gutter="60")

                      el-col(:xs="24" :sm="12" :lg="8" :span="8" )
                        el-form-item(label="出动时间")
                          span.item {{ listData.cdxx.cdsj || '-' }}

                      el-col(:xs="24" :sm="12" :lg="8" :span="8" )
                        el-form-item(label="中返时间")
                          span.item {{ listData.cdxx.zlsj || '-' }}

                      el-col(:xs="24" :sm="12" :lg="8" :span="8" )
                        el-form-item(label="归队时间")
                          span.item {{ listData.cdxx.fdsj || '-' }}

                  el-col(:span="24" v-else-if="listData.cdxx.czqkdm=='02'")
                    el-row(:gutter="60")

                      el-col(:xs="24" :sm="12" :lg="8" :span="8" )
                        el-form-item(label="出动时间")
                          span.item {{ listData.cdxx.cdsj || '-' }}

                      el-col(:xs="24" :sm="12" :lg="8" :span="8" )
                        el-form-item(label="到场时间")
                          span.item {{ listData.cdxx.dcsj || '-' }}

                      el-col(:xs="24" :sm="12" :lg="8" :span="8" )
                        el-form-item(label="撤离时间")
                          span.item {{ listData.cdxx.clsj || '-' }}

                      el-col(:xs="24" :sm="12" :lg="8" :span="8" )
                        el-form-item(label="归队时间")
                          span.item {{ listData.cdxx.fdsj || '-' }}

                  el-col(:span="24" v-else)
                    el-row(:gutter="60")

                      el-col(:xs="24" :sm="12" :lg="8" :span="8" )
                        el-form-item(label="出动时间")
                          span.item {{ listData.cdxx.cdsj || '-' }}

                      el-col(:xs="24" :sm="12" :lg="8" :span="8" )
                        el-form-item(label="到场时间")
                          span.item {{ listData.cdxx.dcsj || '-' }}

                      el-col(:xs="24" :sm="12" :lg="8" :span="8" )
                        el-form-item(label="展开时间")
                          span.item {{ listData.cdxx.zksj || '-' }}

                      el-col(:xs="24" :sm="12" :lg="8" :span="8" )
                        el-form-item(label="出水时间")
                          span.item {{ listData.cdxx.cssj || '-' }}

                      el-col(:xs="24" :sm="12" :lg="8" :span="8" v-if="listData.cdxx.sjlbdm.substr(0,3) !== '020'")
                        el-form-item(label="控制时间")
                          span.item {{ listData.cdxx.kzsj || '-' }}

                      //- 处置情况 为 "到场实施处置" 且 警情类型为 火灾扑救 时才显示
                      el-col(:xs="24" :sm="12" :lg="8" :span="8" v-if="listData.cdxx.czqkdm==3 && isFireFighting")
                        el-form-item(label="熄灭时间")
                          span.item {{ listData.cdxx.xmsj || '-' }}

                      //- 处置情况 为 "到场实施处置" 且 警情类型为 抢险救援/危险化学品事故 时才显示
                      el-col(:xs="24" :sm="12" :lg="8" :span="8" v-if="listData.cdxx.czqkdm==3 && listData.cdxx.sjlbdm.substr(0,3) === '020'")
                        el-form-item(label="洗消时间")
                          span.item {{ listData.cdxx.xxsj || '-' }}

                      el-col(:xs="24" :sm="12" :lg="8" :span="8" )
                        el-form-item(label="结束时间")
                          span.item {{ listData.cdxx.jssj || '-' }}

                      el-col(:xs="24" :sm="12" :lg="8" :span="8" )
                        el-form-item(label="撤离时间")
                          span.item {{ listData.cdxx.clsj || '-' }}

                      el-col(:xs="24" :sm="12" :lg="8" :span="8" )
                        el-form-item(label="归队时间")
                          span.item {{ listData.cdxx.fdsj || '-' }}

            el-col(:span="24" class="baseInfo")
              .shadow-box
                .shadow-title 基本信息
                el-row(:gutter="60")
                  //- el-col(:xs="24" :sm="12" :lg="8" :span="8")
                      el-form-item(label="是否正在核实")
                          span.item {{ listData.cdxx.isChecked=='1'?"是":"否" }}

                  //- el-col(:xs="24" :sm="12" :lg="8" :span="8" v-if="listData.cdxx.isFirstarrive=='Y'")
                      el-form-item(label="首到时间")
                          span.item {{ listData.cdxx.arriveTime || '-' }}

                  //- 警情类型为 火灾扑救 ，且 处置情况 不是 中途返回 时才显示
                  el-col(:xs="24" :sm="12" :lg="8" :span="8" v-if="isFireFighting && listData.cdxx.czqkdm !== '01'")
                    el-form-item(label="到场时火灾情况")
                      span.item {{ getLabel("dicHzqk", listData.cdxx.dcshzqkdm) || '-' }}

                el-row(:gutter="60")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8"  v-if="listData.cdxx.respondType=='010000'")
                    el-form-item(label="行业主管部门")
                      span.item {{getLabel("dicHyzgbm", listData.cdxx.hyzgbm) || '-'}}

                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="距离现场")
                      span.item {{ listData.cdxx.sjlc || '-' }} 公里
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="消防车道是否堵塞")
                      span.item(v-if="listData.cdxx.isBlock == '1'") {{ '是' }}
                      span.item(v-else-if="listData.cdxx.isBlock == '0'") {{ '否' }}
                      span.item(v-else) {{ '-' }}
                  el-col(:xs="24" :sm="12" :lg="8" :span="8" v-if="listData.cdxx.isBlock == '1'")
                    el-form-item(label="疏通耗时")
                      span.item {{ listData.cdxx.dredgeTime || '-' }} 分钟
                  //- 处置情况 是 到场实施处置 时才显示
                  el-col(:xs="24" :sm="12" :lg="8" :span="8"  v-if="listData.cdxx.respondType=='010000' && listData.cdxx.czqkdm === '03'")
                    el-form-item(label="现场人员被困人数")
                      span.item {{ listData.cdxx.xcrybkqkdm || '-'}} 人被困

                el-row(:gutter="60")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8"  v-if="listData.cdxx.respondType=='010000' && listData.cdxx.czqkdm === '03'")
                    el-form-item(label="是否采用公用消防栓供水")
                      span.item {{ listData.cdxx.useHydrant==1?'是':'否' }}

                  el-col(:xs="24" :sm="12" :lg="8" :span="8" v-if="listData.cdxx.useHydrant==1&&listData.cdxx.respondType=='010000' && listData.cdxx.czqkdm === '03'")
                    el-form-item(label="公用消防栓供水情况")
                      span.item {{ getLabel("dicGgxhs", listData.cdxx.hydrantSupply) }}
                  el-col(:xs="24" :sm="12" :lg="8" :span="8" v-if="listData.cdxx.useHydrant!=1&&listData.cdxx.respondType=='010000' && listData.cdxx.czqkdm === '03'")
                    el-form-item(label="不使用公用消防栓原因")
                      span.item {{ getLabel("dicBsyyy", listData.cdxx.hydrantNotuse) }}
                  el-col(:xs="24" :sm="12" :lg="8" :span="8"  v-if="listData.cdxx.respondType=='010000' && listData.cdxx.czqkdm === '03'")
                    el-form-item(label="固定消防设施使用情况")
                      span.item {{ getLabel("dicGdxfss", listData.cdxx.gdxfssyyqkdm) }}

                //- 带队指挥员 列表
                el-row(v-if="listData.cdxx.respondType=='010000'" :gutter="60" v-for="(item, index) in listData.ddzhy" :key="item.zhy")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(:label="`带队指挥员姓名${index + 1}`")
                      span.item {{ item.zhy || '-' }}
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="带队指挥员职务")
                      span.item {{ getLabel("dicDdzhzw", item.zhyzw) || '-' }}

                //- el-row(:gutter="60")
                //- 	el-col(:xs="24" :sm="12" :lg="8" :span="8" v-if="listData.cdxx.respondType=='010000'")
                //- 		el-form-item(label="带队指挥员姓名")
                //- 			span.item {{ listData.cdxx.zhy || '-' }}
                //- 	el-col(:xs="24" :sm="12" :lg="8" :span="8" v-if="listData.cdxx.respondType=='010000'")
                //- 		el-form-item(label="带队指挥员职务")
                //- 			span.item {{ getLabel("dicDdzhzw", listData.cdxx.zhiwu) || '-' }}

                //- 全勤指挥部 列表
                el-row(v-if="listData.cdxx.respondType=='010000'" :gutter="60" v-for="(item, index) in listData.qqzhb" :key="item.qqzhbZhcddm")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="全勤指挥部")
                      span.item {{ getLabel("dicXczh", item.qqzhbZhcddm) || '-' }}

                  //- 全勤指挥部 选择的不是无("5")，才显示
                  el-col(:xs="24" :sm="12" :lg="8" :span="8" v-if="item.qqzhbZhcddm !== '5'")
                    el-form-item(label="带队领导")
                      span.item {{ item.ddld || '-' }}

                  //- 全勤指挥部 选择的是 总队 或者 支队才显示
                  el-col(:xs="24" :sm="12" :lg="8" :span="8" v-if="item.qqzhbZhcddm === '1' || item.qqzhbZhcddm === '2'")
                    el-form-item(label="指挥长")
                      span.item {{ item.zhz || '-' }}

            el-col(:span="24")
              .shadow-box
                .shadow-title 本队投入力量
                el-row(:gutter="60")
                  el-col(:xs="24" :sm="12" :lg="6" :span="6")
                    el-form-item(label="车辆（车）")
                      span.item 共 {{ listData.cdxx.carCount || ' 0 ' }} 车

                  el-col(:xs="24" :sm="12" :lg="6" :span="6")
                    el-form-item(label="人员（人）")
                      span.item 共 {{ listData.cdxx.trrys || ' - ' }} 人

                  el-col(:xs="24" :sm="12" :lg="6" :span="6")
                    el-form-item(label="指挥员（人）")
                      span.item {{ listData.cdxx.inCommander || '-' }}

                  el-col(:xs="24" :sm="12" :lg="6" :span="6")
                    el-form-item(label="消防员（人）")
                      span.item {{ listData.cdxx.inFireman || '-' }}

                  el-col(:xs="24" :sm="12" :lg="16" :span="16")
                    el-form-item(label="消防车辆信息")
                      span.item(v-html="getCarLabel('syscar', listData.cdxx.fireEngine)")

                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="艇（艘）")
                      span.item {{ listData.cdxx.trcts }}

                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="消防直升机（架）")
                      span.item {{ listData.cdxx.trxfzsjs }}

                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="搜救犬（只）")
                      span.item {{ listData.cdxx.inDog }}

                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="无人机（架）")
                      span.item {{ listData.cdxx.inUav }}


                  //el-col(:xs="24" :sm="12" :lg="6" :span="6")
                  // 	el-form-item(label="其他救援力量（人）")
                  // 		span.item {{ listData.cdxx.inOther || '-' }}

                  //- el-col(:xs="24" :sm="12" :lg="6" :span="6")
                  //- 	el-form-item(label="社会力量（人）")
                  //- 		span.item {{ listData.cdxx.inSociety || '-' }}

            el-col(:span="24")
              .shadow-box
                .shadow-title 联动单位
                el-row(:gutter="60")
                  el-col(:span="24")
                    el-form-item(label="是否有联动单位")
                      span.item {{ listData.lddw.length==0?'否':'是' }}

                el-row(v-if="listData.lddw.length>0" :gutter="60" v-for="(item, index) in listData.lddw" :key="item.lddwmc")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(:label="`联动单位名称${index + 1}`")
                      span.item {{ item.lddwmc || '-' }}
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="所属行业部门")
                      span.item {{ getLabel("dicHybm", item.belongDept) || '-' }}

                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="联动单位所属等级")
                      span.item {{ getLabel("dicSsdj", item.belongLevel) || '-' }}

            el-col(:span="24" v-if="listData.mjjyd.length||listData.qyzzd.length")
              .shadow-box
                .shadow-title 其他救援力量
                el-row(v-for="i in listData.mjjyd")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="队伍性质")
                      span.item {{getZyd(i.qtxfjyllFlBranch) || '-'}}
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="队伍名称")
                      span.item {{i.qtxfjyllMc || '-'}}
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="人数")
                      span.item {{i.renSl || '-'}}
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="车（辆）")
                      span.item {{i.cheSl || '-'}}
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="艇（艘）")
                      span.item {{i.tingSl || '-'}}
                el-row(v-for="i in listData.qyzzd")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="队伍性质")
                      span.item {{getZzd(i.qtxfjyllFlBranch) || '-'}}
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="队伍名称")
                      span.item {{i.qtxfjyllMc || '-'}}
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="人数")
                      span.item {{i.renSl || '-'}}
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="车（辆）")
                      span.item {{i.cheSl || '-'}}
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="艇（艘）")
                      span.item {{i.tingSl || '-'}}

            //- 处置情况 是 到场实施处置；且 警情类型 是 火灾扑救 或者 抢险救援 时才显示
            el-col(:span="24" v-if="listData.cdxx.czqkdm === '03' && (isFireFighting || listData.cdxx.sjlbdm.substr(0,3) === '020')")
              .shadow-box
                .shadow-title 主要战术措施
                el-row
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="内攻情况")
                      span.item(v-if="listData.cdxx.insideAttack == '1'") {{ '是' }}
                      span.item(v-else-if="listData.cdxx.insideAttack == '0'") {{ '否' }}
                      span.item(v-else) {{ '-' }}
                  el-col(:xs="24" :sm="12" :lg="8" :span="8" v-if="isFireFighting")
                    el-form-item(label="火灾技战术措施")
                      span.item {{ getListLabel('dicHzjzscs', listData.cdxx.hzJzscsdm) }}
                  el-col(:xs="24" :sm="12" :lg="8" :span="8" v-else)
                    el-form-item(label="抢险救援技战术措施")
                      span.item {{ getListLabel('dicQxjyjzscs', listData.cdxx.qxjyJzscsdm) }}

            el-col(:span="24")
              .shadow-box
                .shadow-title 当日气象
                el-row
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="气温")
                      span.item {{listData.cdxx.qw || '-'}}℃
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="风向")
                      span.item {{getLabel("dicFx", listData.cdxx.fxdm) || '-'}}
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="风力")
                      span.item {{listData.cdxx.windForce || '-'}}级
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="天气")
                      span.item {{getLabel("dicQh", listData.cdxx.weather) || '-'}}

            el-col(:span="24" v-if="listData.cdxx.respondType=='010000' && listData.gov.length>0")
              .shadow-box
                .shadow-title 政府指挥
                el-row(v-for="(item, index) in listData.gov" :key="item.name")
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="姓名")
                      span.item {{ item.name || '-' }}
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="职务")
                      span.item {{ item.position || '-' }}
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="所属分类")
                      span.item {{ getLabel("dicLdzhcd", item.classify) }}

            el-col(:span="24" v-if="listData.wxxfz.length")
              .shadow-box
                .shadow-title 其他消防救援力量
                el-row(:gutter="60" v-for="(item, index) in listData.wxxfz" :key="item.qtxfjyllMc")
                  el-col(:xs="24" :sm="12" :lg="24" :span="24")
                    el-form-item(:label="`微型消防站名称${index+1}：`")
                      span.item {{ item.qtxfjyllMc || '-' }}
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="车（辆）")
                      span.item {{ item.cheSl || '-' }}
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="艇（艘）")
                      span.item {{ item.tingSl || '-' }}
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="人（人）")
                      span.item {{ item.renSl || '-' }}

                el-row(:gutter="60" v-for="(item, index) in listData.mjjyd" :key="item.qtxfjyllMc")
                  el-col(:xs="24" :sm="12" :lg="24" :span="24")
                    el-form-item(:label="`民间救援队名称${index+1}：`")
                      span.item {{ item.qtxfjyllMc || '-' }}
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="车（辆）")
                      span.item {{ item.cheSl || '-' }}
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="艇（艘）")
                      span.item {{ item.tingSl || '-' }}
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="人（人）")
                      span.item {{ item.renSl || '-' }}

                el-row(:gutter="60" v-for="(item, index) in listData.qyzzd" :key="item.qtxfjyllMc")
                  el-col(:xs="24" :sm="12" :lg="24" :span="24")
                    el-form-item(:label="`企业专职队名称${index+1}：`")
                      span.item {{ item.qtxfjyllMc || '-' }}
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="车（辆）")
                      span.item {{ item.cheSl || '-' }}
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="艇（艘）")
                      span.item {{ item.tingSl || '-' }}
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="人（人）")
                      span.item {{ item.renSl || '-' }}

            el-col(:span="24")
              .shadow-box
                .shadow-title 参战人员伤亡情况
                el-row(:gutter="60")
                  el-col(:span="24")
                    el-form-item(label="是否有人员伤亡")
                      span.item {{ listData.cdxx.isCzrysw==2?'无':'有' }}

            el-col(:span="24" v-if="listData.czryswInjured.length>0")
              .shadow-box
                .shadow-title 受伤人员
                .people-box(v-for="(item, index) in listData.czryswInjured" :key="index")
                  el-row
                    el-col(:span="24")
                      el-form-item(:label="`人员伤亡情况 ${index + 1}`")
                        span.item {{ item.swfl == "0" ? '死亡': '受伤' }}

                    el-col(:xs="24" :sm="12" :lg="8" :span="8")
                      el-form-item(label="人员姓名")
                        span.item {{ item.xm }}

                    el-col(:xs="24" :sm="12" :lg="8" :span="8")
                      el-form-item(label="人员性别")
                        span.item {{ getLabel("userSex", item.sex) }}

                    el-col(:xs="24" :sm="12" :lg="8" :span="8")
                      el-form-item(label="人员年龄")
                        span.item {{ item.age }}

                    el-col(:span="24")
                      el-form-item(label="人员身份")
                        span.item {{ getLabel("dicRysfxx", item.rylbdm) }}

                    el-col(:xs="24" :sm="12" :lg="8" :span="8")
                      el-form-item(label="身份证号")
                        span.item {{ item.personalId }}

                    el-col(:xs="24" :sm="12" :lg="8" :span="8")
                      el-form-item(label="人员编号")
                        span.item {{ item.personalCode }}

                    //- el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    //- 	el-form-item(label="入伍年月")
                    //- 		span.item {{ item.rwny }}

                    //- el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    //- 	span 入职年月：
                    //- 	span {{item.rzny}}

                    el-col(:xs="24" :sm="12" :lg="8" :span="8")
                      el-form-item(label="衔级")
                        span.item {{ item.ryxj }}

                    el-col(:xs="24" :sm="12" :lg="8" :span="8")
                      el-form-item(label="职级")
                        span.item {{ item.ryzj }}

                    el-col(:xs="24" :sm="12" :lg="8" :span="8")
                      el-form-item(label="职务")
                        span.item {{ item.position }}

                    el-col(:xs="24" :sm="12" :lg="8" :span="8")
                      el-form-item(label="受伤部位")
                        span.item {{ getLabel("dicSsbw", item.ssbwdm) }}

                    el-col(:xs="24" :sm="12" :lg="8" :span="8")
                      el-form-item(label="事发位置")
                        span.item {{ item.location }}

                    el-col(:xs="24" :sm="12" :lg="8" :span="8")
                      el-form-item(label="事发时段")
                        span.item {{ getLabel("dicSwdd", item.swdddm) }}

                    el-col(:xs="24" :sm="12" :lg="8" :span="8")
                      el-form-item(label="受伤原因")
                        span.item {{ getLabel("dicSwyy", item.swyydm) }}

                    el-col(:xs="24" :sm="12" :lg="8" :span="8")
                      el-form-item(label="防护装备")
                        span.item {{ getLabel("dicFhzb", item.equipt) }}

            el-col(:span="24" v-if="listData.czryswDead.length>0")
              .shadow-box
                .shadow-title 死亡人员
                .people-box(v-for="(item, index) in listData.czryswDead" :key="index")
                  el-row
                    el-col(:span="24")
                      el-form-item(:label="`人员伤亡情况 ${index + 1}`")
                        span.item {{ item.swfl == "0" ? '死亡': '受伤' }}

                    el-col(:xs="24" :sm="12" :lg="8" :span="8")
                      el-form-item(label="人员姓名")
                        span.item {{ item.xm }}

                    el-col(:xs="24" :sm="12" :lg="8" :span="8")
                      el-form-item(label="人员性别")
                        span.item {{ getLabel("userSex", item.sex) }}

                    el-col(:xs="24" :sm="12" :lg="8" :span="8")
                      el-form-item(label="人员年龄")
                        span.item {{ item.age }}

                    el-col(:span="24")
                      el-form-item(label="人员身份")
                        span.item {{ getLabel("dicRysfxx", item.rylbdm) }}

                    el-col(:xs="24" :sm="12" :lg="8" :span="8")
                      el-form-item(label="身份证号")
                        span.item {{ item.personalId }}

                    el-col(:xs="24" :sm="12" :lg="8" :span="8")
                      el-form-item(label="人员编号")
                        span.item {{ item.personalCode }}

                    el-col(:xs="24" :sm="12" :lg="8" :span="8")
                      el-form-item(label="衔级")
                        span.item {{ item.ryxj }}

                    el-col(:xs="24" :sm="12" :lg="8" :span="8")
                      el-form-item(label="职级")
                        span.item {{ item.ryzj }}

                    el-col(:xs="24" :sm="12" :lg="8" :span="8")
                      el-form-item(label="职务")
                        span.item {{ item.position }}

                    el-col(:xs="24" :sm="12" :lg="8" :span="8")
                      el-form-item(label="致命受伤部位")
                        span.item {{ getLabel("dicSsbw", item.ssbwdm) }}

                    el-col(:xs="24" :sm="12" :lg="8" :span="8")
                      el-form-item(label="事发位置")
                        span.item {{ item.location }}

                    el-col(:xs="24" :sm="12" :lg="8" :span="8")
                      el-form-item(label="事发时段")
                        span.item {{ getLabel("dicSwdd", item.swdddm) }}

                    el-col(:xs="24" :sm="12" :lg="8" :span="8")
                      el-form-item(label="死亡原因")
                        span.item {{ getLabel("dicSwyy", item.swyydm) }}

                    el-col(:xs="24" :sm="12" :lg="8" :span="8")
                      el-form-item(label="防护装备")
                        span.item {{ getLabel("dicFhzb", item.equipt) }}

                    el-col(:xs="24" :sm="12" :lg="8" :span="8")
                      el-form-item(label="当场死亡")
                        span.item {{ item.sceneDead=='1'?"是":"否" }}

            el-col(:span="24")
              .shadow-box
                .shadow-title 战斗结果
                el-row
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="抢救人员（人）")
                      span.item {{ listData.cdxx.rescueNum }}

                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="生还（人）")
                      span.item {{ listData.cdxx.shrs }}

                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="死亡（人）")
                      span.item {{ listData.cdxx.deadNum }}

                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="疏散（人）")
                      span.item {{ listData.cdxx.ssrs }}

                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="抢救财产（元）")
                      span.item {{ listData.cdxx.qjccjz }}

                  el-col(:xs="24" :sm="12" :lg="8" :span="8" v-if="listData.cdxx.respondType=='010000'")
                    el-form-item(label="保护财产价值（元）")
                      span.item {{ listData.cdxx.protectPropVal  || '-' }}

            //- el-col(:span="24")
            //- 	.shadow-box
            //- 		.shadow-title 战斗损耗
            //- 		el-row
            //- 			el-col(:span="24")
            //- 				el-form-item(label="车辆损耗")
            //- 					span.item {{ getListLabel('syscar', listData.cdxx.damageEngine) || '-' }}

            el-col(:span="24" class="consumables")
              .shadow-box
                .shadow-title 战斗损耗
                  span.arrowBtn(@click="consumablesShow=!consumablesShow") {{consumablesShow?'收起':'展开'}} #[i(:class="consumablesShow?'el-icon-arrow-down':'el-icon-arrow-right'")]
                .show-body(v-if="consumablesShow")
                  .h4 —— 车辆损耗 ——
                  el-row
                    el-col(:span="24")
                      el-form-item(label="")
                        span.item {{ getListLabel('syscar', listData.cdxx.damageEngine) || '-' }}
                  .h4 —— 消耗用品 - 灭火器材 ——
                  el-row
                    el-col(:xs="24" :sm="12" :lg="6" :span="6")
                      el-form-item(label="机动消防泵(含浮艇泵)（台）")
                        span.item {{ listData.cdxx.xhjdxfb }}

                    el-col(:xs="24" :sm="12" :lg="6" :span="6")
                      el-form-item(label="移动式水带卷盘或水带槽（个）")
                        span.item {{ listData.cdxx.xhydssdjp }}

                    el-col(:xs="24" :sm="12" :lg="6" :span="6")
                      el-form-item(label="移动式消防炮（个）")
                        span.item {{ listData.cdxx.xhydsxfp }}

                    el-col(:xs="24" :sm="12" :lg="6" :span="6")
                      el-form-item(label="空气泡沫枪（个）")
                        span.item {{ listData.cdxx.xhkqpmq }}

                    el-col(:xs="24" :sm="12" :lg="6" :span="6")
                      el-form-item(label="泡沫液桶（个）")
                        span.item {{ listData.cdxx.xhpmyt }}

                    el-col(:xs="24" :sm="12" :lg="6" :span="6")
                      el-form-item(label="梯子（把）")
                        span.item {{ listData.cdxx.xhtz }}

                    el-col(:xs="24" :sm="12" :lg="6" :span="6")
                      el-form-item(label="水带（米）")
                        span.item {{ listData.cdxx.xhsd }}

                    el-col(:xs="24" :sm="12" :lg="6" :span="6")
                      el-form-item(label="消防栓扳手（把）")
                        span.item {{ listData.cdxx.xhxfsbs }}

                    el-col(:xs="24" :sm="12" :lg="6" :span="6")
                      el-form-item(label="水枪（个）")
                        span.item {{ listData.cdxx.xhsq }}

                    el-col(:xs="24" :sm="12" :lg="6" :span="6")
                      el-form-item(label="分水器（只）")
                        span.item {{ listData.cdxx.xhfsq }}

                    el-col(:xs="24" :sm="12" :lg="6" :span="6")
                      el-form-item(label="破拆工具（个）")
                        span.item {{ listData.cdxx.xhpcgj }}

                    el-col(:xs="24" :sm="12" :lg="6" :span="6")
                      el-form-item(label="灭火机（只）")
                        span.item {{ listData.cdxx.xhmhq }}

                    el-col(:xs="24" :sm="12" :lg="6" :span="6")
                      el-form-item(label="手抬泵（个）")
                        span.item {{ listData.cdxx.xhstb }}

                    el-col(:span="24" v-for="(item, index) in listData.mhqcOther" :key="item.content")
                      el-form-item(:label="`其他物品${index + 1}`")
                        span.item {{ item.content }}：{{ item.num || '-' }}

                  .h4 —— 消耗用品 - 个人装备 ——
                  el-row
                    el-col(:xs="24" :sm="12" :lg="6" :span="6")
                      el-form-item(label="消防头盔（个）")
                        span.item {{ listData.cdxx.xhxftk }}

                    el-col(:xs="24" :sm="12" :lg="6" :span="6")
                      el-form-item(label="消防员灭火防护服（套）")
                        span.item {{ listData.cdxx.xhxfymhfhf }}

                    el-col(:xs="24" :sm="12" :lg="6" :span="6")
                      el-form-item(label="消防手套（副）")
                        span.item {{ listData.cdxx.xhxfst }}

                    el-col(:xs="24" :sm="12" :lg="6" :span="6")
                      el-form-item(label="消防安全腰带（根）")
                        span.item {{ listData.cdxx.xhxfaqyd }}

                    el-col(:xs="24" :sm="12" :lg="6" :span="6")
                      el-form-item(label="消防员灭火防护靴（双）")
                        span.item {{ listData.cdxx.xhxfymhfhx }}

                    el-col(:xs="24" :sm="12" :lg="6" :span="6")
                      el-form-item(label="双正式压消防空气呼吸器（个）")
                        span.item {{ listData.cdxx.xhzysxfkqhxq }}

                    el-col(:xs="24" :sm="12" :lg="6" :span="6")
                      el-form-item(label="佩戴式防爆照灯（个）")
                        span.item {{ listData.cdxx.xhpdsfbzmd }}

                    el-col(:xs="24" :sm="12" :lg="6" :span="6")
                      el-form-item(label="消防员呼救器（个）")
                        span.item {{ listData.cdxx.xhxfyhxq }}

                    el-col(:xs="24" :sm="12" :lg="6" :span="6")
                      el-form-item(label="方位灯（个）")
                        span.item {{ listData.cdxx.xhsxhfwdtb }}

                    el-col(:xs="24" :sm="12" :lg="6" :span="6")
                      el-form-item(label="消防安全绳（根）")
                        span.item {{ listData.cdxx.xhxfqxaqs }}

                    el-col(:xs="24" :sm="12" :lg="6" :span="6")
                      el-form-item(label="消防腰斧（个）")
                        span.item {{ listData.cdxx.xhxfyf }}

                    el-col(:xs="24" :sm="12" :lg="6" :span="6")
                      el-form-item(label="通信装备（个）")
                        span.item {{ listData.cdxx.xhtxsb }}

                    el-col(:span="24" v-for="(item, index) in listData.grzbOther" :key="item.content")
                      el-form-item(:label="`其他物品${index + 1}`")
                        span.item {{ item.content }}：{{ item.num || '-' }}

                  .h4 —— 消耗用品 - 灭火药剂 ——
                  el-row
                    el-col(:xs="24" :sm="12" :lg="6" :span="6")
                      el-form-item(label="泡沫液（千克）")
                        span.item {{ listData.cdxx.xhpmy }}

                    el-col(:xs="24" :sm="12" :lg="6" :span="6")
                      el-form-item(label="干粉（千克）")
                        span.item {{ listData.cdxx.xhgf }}

                    el-col(:xs="24" :sm="12" :lg="6" :span="6")
                      el-form-item(label="二氧化碳（千克）")
                        span.item {{ listData.cdxx.xheyht }}

                    el-col(:xs="24" :sm="12" :lg="6" :span="6")
                      el-form-item(label="卤代烷（升）")
                        span.item {{ listData.cdxx.xhldw }}

                    el-col(:span="24" v-for="(item, index) in listData.mhyjOther" :key="item.content")
                      el-form-item(:label="`其他物品${index + 1}`")
                        span.item {{ item.content }}：{{ item.num || '-' }}

                  .h4 —— 消防用水量情况 ——
                  el-row
                    el-col(:xs="24" :sm="12" :lg="6" :span="6")
                      el-form-item(label="总流量（升/秒）")
                        span.item {{ listData.cdxx.zll }}

                    el-col(:xs="24" :sm="12" :lg="6" :span="6")
                      el-form-item(label="灭火用水（吨）")
                        span.item {{ listData.cdxx.mhys }}

                    el-col(:xs="24" :sm="12" :lg="6" :span="6")
                      el-form-item(label="冷却水（吨）")
                        span.item {{ listData.cdxx.lqs }}

                    el-col(:xs="24" :sm="12" :lg="6" :span="6")
                      el-form-item(label="用水总量（吨）")
                        span.item {{ listData.cdxx.yszl }}

                    el-col(:xs="24" :sm="12" :lg="6" :span="6")
                      el-form-item(label="无故供水中断（次）")
                        span.item {{ listData.cdxx.gszd }}

                    el-col(:xs="24" :sm="12" :lg="6" :span="6")
                      el-form-item(label="水渍损失")
                        span.item {{ listData.cdxx.szss=='0100'?'有':'无' }}

            //- 处置情况 是 到场实施处置 时才显示
            el-col(:span="24" v-if="listData.cdxx.czqkdm === '03'")
              .shadow-box
                .shadow-title 处置（执勤）经过
                el-row(:gutter="60")
                  el-col(:span="24")
                    el-form-item(label="")
                      span.item {{ listData.cdxx.czjg || '-' }}
            //- 处置情况 不是 中途返回 时才显示
            el-col(:span="24" v-if="listData.cdxx.czqkdm !== '01'")
              .shadow-box
                .shadow-title 现场照片
                el-row(:gutter="60")
                  el-col(:span="24")
                    el-form-item.show-images(label="出动现场照片")
                      //- 多选属性 multiple
                      el-upload.show-images-component(
                      ref="imageUpload"
                      action="#"
                      accept=".jpg,.png"
                      list-type="picture-card"
                        :limit="6"
                          :on-preview="handleImagePreview"
                          :file-list="listData.imgs"
                      disabled
                      )
                        //- i.el-icon-plus
                        //- el-button(slot="trigger" size="small" type="primary") 选取文件
                        //- el-button(style="margin-left: 10px;" size="small" type="success" @click="submitImageUpload") 上传
                        i.el-icon-plus(slot="trigger")
                        div(slot="file" slot-scope="data")
                          img.el-upload-list__item-thumbnail(:src="data.file.url" alt="")
                          span.el-upload-list__item-actions
                            span.el-upload-list__item-preview(@click="handleImagePreview(data.file)")
                              i.el-icon-zoom-in
                            //- span.el-upload-list__item-delete(@click="handleDownload(data.file)")
                                i.el-icon-download
                            //- span.el-upload-list__item-delete(@click="handleImageRemove(data.file)")
                            //- 	i.el-icon-delete
                          div.depict(:title="data.file.depict") {{ data.file.depict }}

            el-col(:span="24")
              .shadow-box
                .shadow-title 其他
                el-row(:gutter="60")
                  el-col(:span="24")
                    el-form-item(label="相关附件")
                      //- 附件新增下载查看功能 2019.12.28
                      a.item(:href="listData.cdxx.annex" :download="listData.cdxx.annexName") {{ listData.cdxx.annexName || '-' }}
            el-col(:span="24" v-if="listData.cdxx.shzt == 4")
              .shadow-box
                .shadow-title 驳回信息
                el-row
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="要求完成时间")
                      span.item {{ listData.cdxx.finishDate }}
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="问题类型")
                      span.item {{ getLabel("issueType", listData.cdxx.issueType) }}
                  el-col(:xs="24" :sm="12" :lg="8" :span="8")
                    el-form-item(label="问题描述")
                      span.item {{  listData.cdxx.issueDesc }}

            //- 审核专用
            audit(v-if="$route.query.shzt" :propfrom="propfrom")

             //- 处理监督审核专用
            auditDeal(v-if="$route.query.source =='deal'" :propfrom="propfrom")

    //- 图片列表 单个图片预览弹窗
    //el-dialog(:visible.sync="dialogVisible")
      img(width="100%" :src="dialogImageUrl" alt="")
    el-image-viewer(v-if="dialogVisible" :on-close="closeViewer"  :url-list="[dialogImageUrl]" )
</template>

<script>
  import { cdxxApi } from "@/api/data/entry/cdxx.js";

  // 顶部 警情信息 组件
  import topDetail from "@/views/data/entry/zqxx/components/topDetail.vue";
  // 审核组件
  import audit from "@/views/data/aduit/zqxx/components/audit";
  import { checkSlightFire } from "@/api/data/entry/zqxx";
   // 处理监督审核组件
  import auditDeal from "@/views/check/deal/components/audit";
  // 导入组件
  import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
  //导入其他消防救援力量
  import {getZzd,getZyd} from '@/views/data/aduit/cdxx/qtjyll'

  export default {
    name: "cdxxShowDetail",
    components: {
      topDetail,
      audit,
      auditDeal,
      ElImageViewer
    },
    data() {
      return {
        infoLoading: false,
        consumablesShow: false,
        consumptionShow: false,
        isFireFighting: false,
        listData: {},
        getZzd,getZyd,
        /**
         * 下拉框信息
         */
        dicInfo: {
          dicDdzhzw: [], //带队指挥职务
          dicXczh: [], //全勤指挥部
          dicFx: [], //风向
          dicQh: [], //天气
          dicHybm: [], //所属行业部门
          dicSsdj: [], //联动单位所属等级
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
          dicRysfxx: [], //-人员身份信息
          userSex: [], //-用户性别
          dicRynl: [], //-人员年龄
          dicSsbw: [], //-受伤部位
          dicSwdd: [], //-伤亡地点
          dicSwyy: [], //-伤亡原因
          dicFhzb: [], //-防护装备
          dicSzss: [], //-水渍损失
          syscar: [], //
          issueType: [] //问题类型
        },
        // examineArr: [{name: 1}, {name: 2}, {name: 3}],
        // historyCount: 2,
        examineArr: [],
        historyCount: 0,
        // 单个图片预览弹窗
        dialogVisible: false,
        dialogImageUrl: "",
        /***************************审核组件专用 */
        propfrom: {
          // 出动编号
          cdbh: "",
          // 是否不可编辑
          isNotEdit: false,
          //任务编号
          taskId:""
        }
      };
    },
    computed: {
      heightStyle() {
        let style = "";
        let height = (this.historyCount + 2) * 70;

        return { height: height + "px" };
      }
    },
    created() {
      const { cdbh, shzt } = this.$route.query;
      const source = this.$route.query.source;
      this.getJqxx(cdbh);
      this.getDictsData();
      // this.getRecord();
      // 判断是否需要请求设置审核相关的数据
      if (shzt) {
        this.propfrom.cdbh = cdbh;
        this.propfrom.isNotEdit = true;
      }
      if(source == 'deal'){
        this.propfrom.taskId = this.$route.query.taskId;
      }
    },
    methods: {
      // 判断是否火灾扑救
      checkFireFighting(sjlbdm) {
        if (sjlbdm.startsWith('01')) {
          this.isFireFighting = true;
        } else {
          checkSlightFire().then(response => {
            this.isFireFighting = sjlbdm === '070400000000' && response.data;
          }).catch(error => {
            this.isFireFighting = false;
          });
        }
      },
      getJqxx(cdbh) {
        this.infoLoading = true;
        cdxxApi.getJqxx(cdbh).then(res => {
          this.listData = this.transformPageShowData(res.data);
          let paramsObj = {
            carListStr: this.listData.cdxx.fireEngine
          }
          if(this.listData.cdxx.fireEngine){
            cdxxApi.addNewInit(paramsObj).then(res => {
              if (res.code == 200) {
                for (let item of res.data.syscar) {
                  item.dictValue = item.carId;
                  item.dictLabel = (item.carTypeName || "") + "[" + item.carName + "]";
                }
                this.dicInfo.syscar = res.data.syscar;
              }
            });
          }
        }).finally(() => {
          this.infoLoading = false;
        });
      },
      getLabel(val, code) {
        let dictLabel;
        this.dicInfo[val].map(item => {
          if (code == item.dictValue) {
            dictLabel = item.dictLabel;
          }
        });
        return dictLabel || "-";
      },
      getListLabel(val, code) {
        // 判断是否非空;
        if (code != null) {
          let list = code
            .replace(/\"/g, "")
            .replace("[", "")
            .replace("]", "")
            .split(",");
          let dictLabel = "";
          for (let index of list) {
            this.dicInfo[val].map(item => {
              if (index == item.dictValue) {
                dictLabel += item.dictLabel + "、";
              }
            });
          }
          return dictLabel.substring(0, dictLabel.lastIndexOf("、"));
        } else {
          return "";
        }
      },
      getCarLabel(val, code) {
        // 判断是否非空;
        if (code != null) {
          let list = code
            .replace(/\"/g, "")
            .replace("[", "")
            .replace("]", "")
            .split(",");
          let dictLabel = "";
          for (let index of list) {
            this.dicInfo[val].map(item => {
              if (index == item.dictValue) {
                let dictValueCar = item.dictLabel;
                if(dictValueCar.indexOf("·X") > -1){
                  let dictValueRed = "";
                  let strIndex = dictValueCar.indexOf("X");
                  dictValueRed = dictValueCar.substring(0,strIndex) + '<span style="color: red">'+dictValueCar.substring(strIndex,strIndex+1)+'</span>' + dictValueCar.substring(strIndex+1);
                  if(dictValueCar.indexOf("应急") > -1){
                    let strIndexYing = dictValueCar.indexOf("应急");
                    dictValueRed = dictValueCar.substring(0,strIndex) + '<span style="color: red">'+dictValueCar.substring(strIndex,strIndex+1)+'</span>' + dictValueCar.substring(strIndex+1,strIndexYing)+ '<span style="color: red">'+dictValueCar.substring(strIndexYing,strIndexYing+2)+'</span>'+dictValueCar.substring(strIndexYing+2);
                  }else if(dictValueCar.indexOf("临时") > -1){
                    let strIndexLin = dictValueCar.indexOf("临时");
                    dictValueRed = dictValueCar.substring(0,strIndex) + '<span style="color: red">'+dictValueCar.substring(strIndex,strIndex+1)+'</span>' + dictValueCar.substring(strIndex+1,strIndexLin)+ '<span style="color: red">'+dictValueCar.substring(strIndexLin,strIndexLin+2)+'</span>'+dictValueCar.substring(strIndexLin+2);
                  }
                  dictLabel += dictValueRed + "、";
                }else if(dictValueCar.indexOf("应·急") > -1){
                  let dictValueRed = "";
                  let strIndexJi = dictValueCar.indexOf("应·急");
                  dictValueRed = dictValueCar.substring(0,strIndexJi)+'<span style="color: red">'+ dictValueCar.substring(strIndexJi,strIndexJi+1)+'</span>'+dictValueCar.substring(strIndexJi+1,strIndexJi+2)+'<span style="color: red">'+dictValueCar.substring(strIndexJi+2,strIndexJi+3)+'</span>'+dictValueCar.substring(strIndexJi+3);
                  dictLabel += dictValueRed + "、";
                }else {
                  dictLabel += item.dictLabel + "、";
                }
              }
            });
          }
          return dictLabel.substring(0, dictLabel.lastIndexOf("、"));
        } else {
          return "";
        }
      },
      /**
       * 获取下拉框信息
       */
      getDictsData() {
        //获取带队指挥职务
        this.getDicts("tb_dic_ddzhzw").then(res => {
          if (res.code == 200) {
            this.dicInfo.dicDdzhzw = res.data;
          } else {
            this.dicInfo.dicDdzhzw = [];
          }
        });
        //获取全勤指挥部
        this.getDicts("tb_dic_xczh").then(res => {
          if (res.code == 200) {
            this.dicInfo.dicXczh = res.data;
          } else {
            this.dicInfo.dicXczh = [];
          }
        });
        //获取风向信息
        this.getDicts("tb_dic_fx").then(res => {
          if (res.code == 200) {
            this.dicInfo.dicFx = res.data;
          } else {
            this.dicInfo.dicFx = [];
          }
        });
        //获取天气信息
        this.getDicts("tb_dic_qh").then(res => {
          if (res.code == 200) {
            this.dicInfo.dicQh = res.data;
          } else {
            this.dicInfo.dicQh = [];
          }
        });
        //行业主管部门
        this.getDicts("tb_dic_hyzgbm").then(res => {
          if (res.code == 200) {
            this.dicInfo.dicHyzgbm = res.data;
          } else {
            this.dicInfo.dicHyzgbm = [];
          }
        });
        //政府领导指挥出动
        this.getDicts("tb_dic_ldzhcd").then(res => {
          if (res.code == 200) {
            this.dicInfo.dicLdzhcd = res.data;
          } else {
            this.dicInfo.dicLdzhcd = [];
          }
        });
        //火灾技战术措施
        this.getDicts("tb_dic_hzjzscs").then(res => {
          if (res.code == 200) {
            this.dicInfo.dicHzjzscs = res.data;
          } else {
            this.dicInfo.dicHzjzscs = [];
          }
        });
        //抢险救援技战术措施
        this.getDicts("tb_dic_qxjyjzscs").then(res => {
          if (res.code == 200) {
            this.dicInfo.dicQxjyjzscs = res.data;
          } else {
            this.dicInfo.dicQxjyjzscs = [];
          }
        });
        //处置情况
        this.getDicts("tb_dic_czqk").then(res => {
          if (res.code == 200) {
            this.dicInfo.dicCzqk = res.data;
          } else {
            this.dicInfo.dicCzqk = [];
          }
        });
        //火灾情况
        this.getDicts("tb_dic_hzqk").then(res => {
          if (res.code == 200) {
            this.dicInfo.dicHzqk = res.data;
          } else {
            this.dicInfo.dicHzqk = [];
          }
        });
        //公共消火栓使用情况
        this.getDicts("tb_dic_ggxhs").then(res => {
          if (res.code == 200) {
            this.dicInfo.dicGgxhs = res.data;
          } else {
            this.dicInfo.dicGgxhs = [];
          }
        });
        //不使用公用消防栓原因
        this.getDicts("tb_dic_bsyyy").then(res => {
          if (res.code == 200) {
            this.dicInfo.dicBsyyy = res.data;
          } else {
            this.dicInfo.dicBsyyy = [];
          }
        });
        //固定消防设施使用情况
        this.getDicts("tb_dic_gdxfss").then(res => {
          if (res.code == 200) {
            this.dicInfo.dicGdxfss = res.data;
          } else {
            this.dicInfo.dicGdxfss = [];
          }
        });
        //车辆类型（地方救援）
        this.getDicts("tb_dic_dfjycllx").then(res => {
          if (res.code == 200) {
            this.dicInfo.dicDfjycllx = res.data;
          } else {
            this.dicInfo.dicDfjycllx = [];
          }
        });
        //人员身份信息
        this.getDicts("tb_dic_rysfxx").then(res => {
          if (res.code == 200) {
            this.dicInfo.dicRysfxx = res.data;
          } else {
            this.dicInfo.dicRysfxx = [];
          }
        });
        //用户性别
        this.getDicts("sys_user_sex").then(res => {
          if (res.code == 200) {
            this.dicInfo.userSex = res.data;
          } else {
            this.dicInfo.userSex = [];
          }
        });
        //人员年龄
        this.getDicts("tb_dic_rynl").then(res => {
          if (res.code == 200) {
            this.dicInfo.dicRynl = res.data;
          } else {
            this.dicInfo.dicRynl = [];
          }
        });
        //受伤部位
        this.getDicts("tb_dic_ssbw").then(res => {
          if (res.code == 200) {
            this.dicInfo.dicSsbw = res.data;
          } else {
            this.dicInfo.dicSsbw = [];
          }
        });
        //伤亡地点
        this.getDicts("tb_dic_swdd").then(res => {
          if (res.code == 200) {
            this.dicInfo.dicSwdd = res.data;
          } else {
            this.dicInfo.dicSwdd = [];
          }
        });
        //伤亡原因
        this.getDicts("tb_dic_swyy").then(res => {
          if (res.code == 200) {
            this.dicInfo.dicSwyy = res.data;
          } else {
            this.dicInfo.dicSwyy = [];
          }
        });
        //防护装备
        this.getDicts("tb_dic_fhzb").then(res => {
          if (res.code == 200) {
            this.dicInfo.dicFhzb = res.data;
          } else {
            this.dicInfo.dicFhzb = [];
          }
        });
        //水渍损失
        this.getDicts("tb_dic_szss").then(res => {
          if (res.code == 200) {
            this.dicInfo.dicSzss = res.data;
          } else {
            this.dicInfo.dicSzss = [];
          }
        });
        //行业部门
        this.getDicts("tb_dic_hybm").then(res => {
          if (res.code == 200) {
            this.dicInfo.dicHybm = res.data;
          } else {
            this.dicInfo.dicHybm = [];
          }
        });
        //所属等级
        this.getDicts("tb_dic_ssdj").then(res => {
          if (res.code == 200) {
            this.dicInfo.dicSsdj = res.data;
          } else {
            this.dicInfo.dicSsdj = [];
          }
        });
        //问题类型
        this.getDicts("issue_type").then(res => {
          if (res.code == 200) {
            this.dicInfo.issueType = res.data;
          } else {
            this.dicInfo.issueType = [];
          }
        });
        // cdxxApi.addNewInit().then(res => {
        //   if (res.code == 200) {
        //     for (let item of res.data.syscar) {
        //       item.dictValue = item.carId;
        //       item.dictLabel =
        //         (item.carTypeName || "") + "[" + item.carName + "]";
        //     }
        //     this.dicInfo.syscar = res.data.syscar;
        //   }
        // });
      },
      // 获取审核历史流程
      // getRecord() {
      //   getRecord({ businessEventId: "respond." + this.$route.query.cdbh }).then(
      //     res => {
      //       if (res.code == 200) {
      //         let dataArr = res.data;
      //         // 记录有多少历史记录
      //         this.historyCount = dataArr.length;
      //         // 如果有历史审核流程，先把历史放到arr里
      //         if (this.historyCount.length > 0) {
      //           this.examineArr = this.examineArr.concat(dataArr);
      //         }
      //         // 获取当前审核流程
      //         // this.getTask();
      //       }
      //     }
      //   );
      // },
      // 获取当前审核流程
      // getTask() {
      //   getTask({ businessKey: "respond." + this.$route.query.cdbh }).then(
      //     res => {
      //       if (res.code == 200) {
      //         let dataArr = res.data;
      //         if (dataArr.length > 0) {
      //           this.examineArr = this.examineArr.concat(dataArr);
      //           console.log(this.examineArr);
      //         }
      //       }
      //     }
      //   );
      // }
      /**
       * 出动现场照片 文件点击回调
       */
      handleImagePreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      /**
       * 转换一些修改页面需要的数据
       */
      transformPageShowData(saveData) {
        // 判断是否火灾扑救
        const sjlbdm = saveData.cdxx.sjlbdm;
        if (sjlbdm.startsWith('01')) {
          this.isFireFighting = true;
        } else {
          checkSlightFire().then(response => {
            this.isFireFighting = sjlbdm === '070400000000' && response.data;
          }).catch(error => {
            this.isFireFighting = false;
          });
        }
        // 需要手动赋值的字段
        saveData.imgs.forEach(element => {
          element.url = `${process.env.VUE_APP_FTP_API + element.avatar}`;
        });

        saveData.cdxx.annex &&
        (saveData.cdxx.annex = `${process.env.VUE_APP_FTP_API +
        saveData.cdxx.annex}`);

        // 审核专用
        if (this.$route.query.reviewing) {
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
            level: dictionary[this.jqxxData.jqdj] || "",
            // 用处未知
            hasNull: false
          };
        }
        return saveData;
      },
      // 关闭查看器
      closeViewer() {
        this.dialogVisible = false;
      },
      printf(){
        let subOutputRankPrint = document.getElementsByClassName('cdxxShowDetail')[0];
        console.log(subOutputRankPrint.innerHTML);
        let newContent =subOutputRankPrint.innerHTML;
        let oldContent = document.body.innerHTML;
        document.body.innerHTML = newContent;
        window.print();
        window.location.reload();
        document.body.innerHTML = oldContent;
        return false;
      }
    },
  };
</script>
<style lang="scss" scoped>
  @import "~@/assets/styles/variables.scss";
  .app-container {
    .el-form-item__label {
      min-width: 150px;
    }
    /deep/ .el-form-item__content {
      // height: 32px;
      min-height: 32px !important;
      line-height: 32px !important;
    }
    .show-images /deep/ .el-form-item__content {
      height: auto;
      min-height: auto !important;
      line-height: auto !important;
      .el-upload--picture-card, .el-upload-list__item {
        width: 176px;
        height: 120px;
        line-height: 118px;
      }
    }
    .people-box {
      border-bottom: 1px solid $borderColor;
      margin: 0 0 15px 0;
    }

    .el-form-item {
      margin-bottom: 0px;
    }

    .h4 {
      margin: 6px 0px;
      text-align: center;
    }
    .title {
      border-bottom: 1px solid $borderColor;
      padding-bottom: 12px;
      margin-bottom: 15px;
      display: flex;
      justify-content: space-between;
      h2 {
        margin: 0px;
        margin-right: auto;
        height: 32px;
        line-height: 32px;
        font-weight: 400;
        color: $titleColor;
        font-size: 18px;
        padding-left: 32px;
        // background-image: url("../../entry/cdxx/image/icon-hx.png");
        background-repeat: no-repeat;
        background-position: 0 50%;
        background-size: 23px;
        span {
          font-size: 12px;
          margin-left: 6px;
        }
      }
    }
    .historyInfo {
      .el-row {
        .el-col {
          & > span:first-child {
            display: inline-block;
            width: 170px;
            text-align: right;
            font-weight: 400;
            font-size: 14px;
            color: $font-textTitle-color;
          }
          & > span:last-child {
            font-size: 14px;
            font-weight: 400;
            color: $font-text-color;
          }
        }
      }
      .jqInfo,
      .cdInfo {
        padding: 0 30px;
        margin-bottom: 15px;
        border-bottom: 1px dashed $borderColor;
        .item {
          color: #37394c;
        }
      }
      .cdInfo {
        .el-row {
          .el-col {
            padding: 6px 0;
            .shadow-box {
              padding: 0 15px;
              width: 100%;
              // background: #fff;
              // box-shadow: 0px 3px 14px 0px $shadowColor;
              // border-radius: 3px;
              border-bottom: 1px dashed $borderColor;
              .shadow-title {
                font-size: 16px;
                font-weight: 600;
                padding-left: 10px;
                color: $font-title-color;
                margin-bottom: 5px;
                border-left: 6px solid $orgColor;
                .arrowBtn {
                  font-size: 14px;
                  float: right;
                  font-weight: 400;
                  cursor: pointer;
                  color: $menuActiveText;
                }
              }
            }
          }
        }
      }
      .examine-info {
        padding-bottom: 48px;
        .examine-line {
          // height: 300px;
          padding: 20px 130px;
          position: relative;
        }
        // .examine-line /deep/ .el-step__icon-inner {
        // 	color: #67c23a;
        // }
        .examine-card {
          position: relative;
          margin-bottom: 63px;
          .examine-name {
            margin-left: 120px;
          }
          .examine-time {
            margin-left: 80px;
          }
        }
      }
    }
  }
</style>
<style lang="scss">
  .cdxxShowDetail {
    .el-form-item__label {
      min-width: 125px;
      text-align: left;
      color: #939eab;
    }
    .consumables {
      .el-form-item__label {
        min-width: 208px;
      }
    }
    .baseInfo {
      .el-form-item__label {
        min-width: 168px;
      }
    }
  }
  .el-image-viewer__wrapper{
    .el-image-viewer__close{
      top:130px
    }
    .el-image-viewer__prev{
      display: none;
    }
    .el-image-viewer__next{
      display: none;
    }
  }
</style>
