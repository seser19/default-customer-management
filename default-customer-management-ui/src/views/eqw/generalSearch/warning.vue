<style rel="stylesheet/scss" lang="scss">
    .page-general-search-warning {
        .form-item-ctrl{
            width: 50%;
            height: 32px;
          }
        .form-item-ctrl-on{
            width: 50%;
            display: inline-flex;
            height: 32px;
            flex-grow: 1;
            // input {
            //     position: absolute;
            //     top: 0;
            //     left: 0;
            //     width: 100%;
            //     height: 32px;
            // }
        }
        .form-item-ctrl-date{
          display: inline-flex;
          height: 32px;
          flex-grow: 1;
          width: 75%;
          .el-date-editor{
            width: 37%;
            height: 32px;
          }
          .tilde {
            width: 4%;
            height: 32px;
            line-height: 32px;
            font-size: 15px;
            text-align: center;
          }
        }
      .form-item-ctrl-trly{
        display: inline-flex;
        height: 32px;
        flex-grow: 1;
        .tilde {
          width: 4%;
          height: 32px;
          line-height: 32px;
          font-size: 15px;
          text-align: center;
        }
      }
    }
</style>

<template>
    <div class="page-general-search-warning">
        <!-- 警情信息筛选 -->
        <section class="filter-section">
            <h4>
                警情信息
                <a @click="showWarningFilterAll = !showWarningFilterAll">{{showWarningFilterAll ? '收起' : '展开'}}<i class="el-icon-arrow-down" :class="{'opened': showWarningFilterAll}"></i></a>
            </h4>
            <div class="filter-form warning" :class="{'hide-some': !showWarningFilterAll}">
                <el-row>
                    <!-- 警情编码 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>警情编码</label>
                            <div class="form-item-ctrl">
                                <el-input  v-model="filterForm.jqbh" placeholder="请输入" clearable />
                            </div>
                        </div>
                    </el-col>
                    <!-- 接警时间 -->
                    <el-col :span="16">
                        <div class="form-item">
                            <label>接警时间</label>
                            <div class="form-item-ctrl-date">
                                <el-date-picker
                                    type="datetime"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    default-time="['00:00:00']"
                                    v-model="filterForm.paramJjsjFrom"
                                    placeholder="接警时间(起)"
                                    :clearable = "false"
                                    @change="checkJjsj('start')"
                                ></el-date-picker>
                                <span class="tilde">~</span>
                                <el-date-picker
                                    type="datetime"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    default-time="['00:00:00']"
                                    v-model="filterForm.paramJjsjTo"
                                    placeholder="接警时间(止)"
                                    :clearable = "false"
                                    @change="checkJjsj('end')"
                                ></el-date-picker>
                                <el-select v-model="selectDate" placeholder="请选择" @change="dateRangeBtn(selectDate)" style="margin-left:2%;width: 20%;">
                                    <el-option
                                      v-for="item in dateList"
                                      :key="item.value"
                                      :label="item.name"
                                      :value="item.value">
                                      <span @click="dateRangeBtn(selectDate)" style="display: inline-block;">{{item.name}}</span>
                                    </el-option>
                                 </el-select>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <!-- 行政区域 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>行政区域</label>
                            <div class="form-item-ctrl-on">
                                <el-input v-model="selectedAreaLabel" placeholder="请选择" readonly @focus="$refs.areaSelect.toggle()">
                                <i slot="suffix" class="iconfont icon-icon-test" @click="$refs.areaSelect.toggle()" style="line-height:32px;"></i>
                                <i slot="suffix" class="el-icon-circle-close" style="margin-left:5px; cursor: pointer;" @click="clearArea()" v-show="selectedAreaLabel"></i>
                                </el-input>
                            </div>
                        </div>
                    </el-col>
                    <!-- 警情地址 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>警情地址</label>
                            <div class="form-item-ctrl">
                                <el-input  v-model="filterForm.jqfsdd" placeholder="请输入" clearable />
                            </div>
                        </div>
                    </el-col>
                    <!-- 警情类型 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>警情类型</label>
                            <div class="form-item-ctrl">
                                <el-cascader  v-model="selectedWarningTypeValue" :props="warningTypeCascaderOption" @change="filterForm.sjlbdm = selectedWarningTypeValue.join(',')" placeholder="请选择" clearable multiple collapse-tags />
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <!-- 警情等级 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>警情等级</label>
                            <div class="form-item-ctrl">
                                <el-select v-model="filterForm.jqdj" placeholder="请选择" clearable>
                                    <el-option v-for="o in jqdj" :key="o.dictValue" :value="o.dictValue" :label="o.dictLabel"  />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                    <!-- 发送单位 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>发送单位</label>
                            <div class="form-item-ctrl-on">
                                <el-input v-model="selectedSenderLabel" readonly placeholder="请选择" @focus="$refs.senderSelect.toggle()">
                                    <i slot="suffix" class="iconfont icon-icon-test" @click="$refs.senderSelect.toggle()" style="line-height:32px;"></i>
                                    <i slot="suffix" class="el-icon-circle-close" style="margin-left:5px; cursor: pointer;" @click="clearSender()" v-show="selectedSenderLabel"></i>
                                </el-input>
                            </div>
                        </div>
                    </el-col>
                    <!-- 单位名称/户主名 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>单位名称/户主名</label>
                            <div class="form-item-ctrl">
                                <el-input  v-model="filterForm.dwmcHzm" placeholder="请输入" clearable />
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <!-- 119案件编号 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>119案件编号</label>
                            <div class="form-item-ctrl">
                                <el-input  v-model="filterForm.caseNbr" placeholder="请输入" clearable />
                            </div>
                        </div>
                    </el-col>
                    <!-- 出动队伍 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>出动队伍</label>
                            <div class="form-item-ctrl-on">
                                <el-input v-model="selectedDispatchLabel" readonly placeholder="请选择" @focus="$refs.dispatchSelect.toggle()">
                                    <i slot="suffix" class="iconfont icon-icon-test" @click="$refs.dispatchSelect.toggle()" style="line-height:32px;"></i>
                                    <i slot="suffix" class="el-icon-circle-close" style="margin-left:5px; cursor: pointer;" @click="clearDispatch()" v-show="selectedDispatchLabel"></i>
                                </el-input>
                            </div>
                        </div>
                    </el-col>
                    <!-- 责任区大队 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>责任区大队</label>
                            <div class="form-item-ctrl-on">
                                <el-input v-model="selectedDutyLabel" readonly placeholder="请选择" @focus="$refs.dutySelect.toggle()">
                                    <i slot="suffix" class="iconfont icon-icon-test" @click="$refs.dutySelect.toggle()" style="line-height:32px;"></i>
                                    <i slot="suffix" class="el-icon-circle-close" style="margin-left:5px; cursor: pointer;" @click="clearDuty()" v-show="selectedDutyLabel"></i>
                                </el-input>
                            </div>
                        </div>
                    </el-col>
                    <!-- 主战队伍 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>主战队伍</label>
                            <div class="form-item-ctrl-on">
                                <el-input v-model="selectedMainForceLabel" readonly placeholder="请选择" @focus="$refs.mainForceSelect.toggle()">
                                    <i slot="suffix" class="iconfont icon-icon-test" @click="$refs.mainForceSelect.toggle()" style="line-height:32px;"></i>
                                    <i slot="suffix" class="el-icon-circle-close" style="margin-left:5px; cursor: pointer;" @click="clearMainforce()" v-show="selectedMainForceLabel"></i>
                                </el-input>
                            </div>
                        </div>
                    </el-col>
                  <el-col :span="8">
                    <div class="form-item">
                      <label>投入人员总数</label>
                      <div class="form-item-ctrl">
                        <el-input-number v-model="filterForm.allTrrysMin" clearable :controls="false" :precision="0"  placeholder="请输入"></el-input-number>
                        <span class="tilde large">~</span>
                        <el-input-number v-model="filterForm.allTrrysMax" clearable :controls="false" :precision="0" placeholder="请输入"></el-input-number>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="form-item">
                      <label>投入车辆总数</label>
                      <div class="form-item-ctrl">
                        <el-input-number v-model="filterForm.allCarCountMin" clearable :controls="false" :precision="0"  placeholder="请输入"></el-input-number>
                        <span class="tilde large">~</span>
                        <el-input-number v-model="filterForm.allCarCountMax" clearable :controls="false" :precision="0" placeholder="请输入"></el-input-number>
                      </div>
                    </div>
                  </el-col>
                </el-row>
            </div>
        </section>
        <!-- 出动信息筛选 -->
        <section class="filter-section">
            <h4>
                出动信息
                <a @click="showDispatchFilterAll = !showDispatchFilterAll">{{showDispatchFilterAll ? '收起' : '展开'}}<i class="el-icon-arrow-down" :class="{'opened': showDispatchFilterAll}"></i></a>
            </h4>
            <div class="filter-form dispatch" :class="{'hide-some': !showDispatchFilterAll}">
                <el-row>
                    <!-- 参战形式 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>参战形式</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.respondType" placeholder="请选择" clearable>
                                    <el-option value="010000" label="主战" />
                                    <el-option value="020000" label="增援" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                    <!-- 处置情况 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>处置情况</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.czqkdm" placeholder="请选择" clearable>
                                    <el-option v-for="o in dispatchOptions.tb_dic_czqk" :key="o.dictValue" :value="o.dictValue" :label="o.dictLabel" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                    <!-- 到场时火灾情况 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>到场时火灾情况</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.dcshzqkdm" placeholder="请选择" clearable>
                                    <el-option v-for="o in dispatchOptions.tb_dic_hzqk" :key="o.dictValue" :value="o.dictValue" :label="o.dictLabel" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <!-- 行业主管部门 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>行业主管部门</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.hyzgbm" placeholder="请选择" clearable>
                                    <el-option v-for="o in dispatchOptions.tb_dic_hyzgbm" :key="o.dictValue" :value="o.dictValue" :label="o.dictLabel" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                    <!-- 距离现场 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>距离现场 (公里)</label>
                            <div class="form-item-ctrl">
                                <el-input-number :controls="false" v-model="filterForm.jlxcjldmMin"  placeholder="请输入" clearable />
                                <span class="tilde large">~</span>
                                <el-input-number :controls="false" v-model="filterForm.jlxcjldmMax" placeholder="请输入" clearable />
                            </div>
                        </div>
                    </el-col>
                    <!-- 现场被困人数 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>现场被困人数</label>
                            <div class="form-item-ctrl">
                                <el-input-number :controls="false" :precision="0" v-model="filterForm.xcrybkqkdmMin" placeholder="请输入" clearable />
                                <span class="tilde large">~</span>
                                <el-input-number :controls="false" :precision="0" v-model="filterForm.xcrybkqkdmMax" placeholder="请输入" clearable />
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <!-- 是否采用公用消防栓供水 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>是否采用公用消防栓供水</label>
                            <div class="form-item-ctrl">
                                <el-select v-model="filterForm.useHydrant" placeholder="请选择" clearable>
                                    <el-option value="1" label="是" />
                                    <el-option value="0" label="否" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                    <!-- 带队指挥员姓名 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>带队指挥员姓名</label>
                            <div class="form-item-ctrl">
                                <el-input  v-model="filterForm.zhy" placeholder="请输入" clearable />
                            </div>
                        </div>
                    </el-col>
                    <!-- 带队指挥员职务 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>带队指挥员职务</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.zhyzw" placeholder="请选择" clearable>
                                    <el-option v-for="o in dispatchOptions.tb_dic_ddzhzw" :key="o.dictValue" :value="o.dictValue" :label="o.dictLabel" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <!-- 全勤指挥部 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>全勤指挥部</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.qqzhbZhcddm" placeholder="请选择" clearable>
                                    <el-option v-for="o in dispatchOptions.tb_dic_xczh" :key="o.dictValue" :value="o.dictValue" :label="o.dictLabel" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                    <!-- 是否有联动单位 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>是否有联动单位</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.isLddw" placeholder="请选择" clearable>
                                    <el-option value="1" label="是" />
                                    <el-option value="0" label="否" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                    <!-- 气温 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>气温 (℃)</label>
                            <div class="form-item-ctrl">
                                <el-input-number  :controls="false" :precision="1" v-model="filterForm.qwMin" placeholder="请输入" clearable />
                                <span class="tilde large">~</span>
                                <el-input-number  :controls="false" :precision="1" v-model="filterForm.qwMax" placeholder="请输入" clearable />
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <!-- 风向 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>风向</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.fxdm" placeholder="请选择" clearable>
                                    <el-option v-for="o in dispatchOptions.tb_dic_fx" :key="o.dictValue" :value="o.dictValue" :label="o.dictLabel" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                    <!-- 风力 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>风力</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.windForce" placeholder="请选择" clearable>
                                    <el-option v-for="o in windForceOption" :key="o.value" :value="o.value" :label="o.label" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                    <!-- 天气 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>天气</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.weather" placeholder="请选择" clearable>
                                    <el-option v-for="o in dispatchOptions.tb_dic_qh" :key="o.dictValue" :value="o.dictValue" :label="o.dictLabel" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <!-- 是否内攻 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>是否内攻</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.insideAttack" placeholder="请选择" clearable>
                                    <el-option value="1" label="是" />
                                    <el-option value="0" label="否" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                    <!-- 火灾技战术措施 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>火灾技战术措施</label>
                            <div class="form-item-ctrl">
                                <el-input  v-model="filterForm.hzJzscsdm" placeholder="请输入" clearable />
                            </div>
                        </div>
                    </el-col>
                    <!-- 抢险救援战术措施 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>抢险救援战术措施</label>
                            <div class="form-item-ctrl">
                                <el-input  v-model="filterForm.qxjyJzscsdm" placeholder="请输入" clearable />
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <!-- 投入车辆数 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>投入车辆数</label>
                            <div class="form-item-ctrl">
                                <el-input-number  :controls="false" :precision="0" v-model="filterForm.carCountMin" placeholder="请输入" clearable />
                                <span class="tilde large">~</span>
                                <el-input-number  :controls="false" :precision="0" v-model="filterForm.carCountMax" placeholder="请输入" clearable />
                            </div>
                        </div>
                    </el-col>
                    <!-- 投入人员数 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>投入人员数</label>
                            <div class="form-item-ctrl">
                                <el-input-number  :controls="false" :precision="0" v-model="filterForm.trrysMin" placeholder="请输入" clearable />
                                <span class="tilde large">~</span>
                                <el-input-number  :controls="false" :precision="0" v-model="filterForm.trrysMax" placeholder="请输入" clearable />
                            </div>
                        </div>
                    </el-col>
                  <!-- 民间救援队 -->
                  <el-col :span="8">
                    <div class="form-item">
                      <label>志愿队</label>
                      <div class="form-item-ctrl">
                        <el-input  v-model="filterForm.mjjydMc" placeholder="请输入" clearable />
                      </div>
                    </div>
                  </el-col>
                </el-row>
                <el-row>
                    <!-- 企业专职队 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>专职队</label>
                            <div class="form-item-ctrl">
                                <el-input  v-model="filterForm.qyzzdMc" placeholder="请输入" clearable />
                            </div>
                        </div>
                    </el-col>
                    <!-- 是否有消防人员伤亡 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>是否有消防人员伤亡</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.isCzrysw" placeholder="请选择" clearable>
                                    <el-option value="1" label="是" />
                                    <el-option value="0" label="否" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                  <!-- 报告状态 -->
                  <el-col :span="8">
                    <div class="form-item">
                      <label>报告状态</label>
                      <div class="form-item-ctrl">
                        <el-select  v-model="selectedDispatchStatus" placeholder="请选择" clearable multiple collapse-tags @change="filterForm.cdShzts = selectedDispatchStatus.join(',')">
                          <el-option v-for="o in dispatchStatusOption" :key="o.value" :value="o.value" :label="o.label" />
                        </el-select>
                      </div>
                    </div>
                  </el-col>
                </el-row>
                <el-row>
                    <!-- 保护财产价值 -->
                    <el-col :span="8">
                      <div class="form-item">
                        <label>保护财产价值（元）</label>
                        <div class="form-item-ctrl">
                            <el-input-number  :controls="false" :precision="0" v-model="filterForm.protectPropValMin" placeholder="请输入" clearable />
                            <span class="tilde large">~</span>
                            <el-input-number  :controls="false" :precision="0" v-model="filterForm.protectPropValMax" placeholder="请输入" clearable />
                        </div>
                      </div>
                    </el-col>
                </el-row>
            </div>
        </section>
        <!-- 火灾信息筛选 -->
        <section class="filter-section">
            <h4>
                火灾信息
                <a @click="showFireFilterAll = !showFireFilterAll">{{showFireFilterAll ? '收起' : '展开'}}<i class="el-icon-arrow-down" :class="{'opened': showFireFilterAll}"></i></a>
            </h4>
            <div class="filter-form fire" :class="{'hide-some': !showFireFilterAll}">
                <el-row>
                    <!-- 是否正在调查 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>是否正在调查</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.sfzzdc" placeholder="请选择" clearable>
                                    <el-option value="1" label="是" />
                                    <el-option value="0" label="否" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                    <!-- 起火时间 -->
                    <el-col :span="16">
                        <div class="form-item">
                            <label>起火时间</label>
                            <div class="form-item-ctrl-date">
                                <el-date-picker
                                    type="datetime"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    default-time="['00:00:00']"
                                    v-model="filterForm.paramZqsjFrom"
                                    placeholder="起火时间(起)"
                                    clearable
                                    @change="checkZqsj('start')"
                                ></el-date-picker>
                                <span class="tilde">~</span>
                                <el-date-picker
                                    type="datetime"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    default-time="['23:59:59']"
                                    v-model="filterForm.paramZqsjTo"
                                    placeholder="起火时间(止)"
                                    clearable
                                    @change="checkZqsj('end')"
                                ></el-date-picker>
                                <el-select v-model="selectDateQh" placeholder="请选择" @change="dateRangeBtn(selectDateQh,'qh')" style="margin-left:2%;width: 20%;">
                                    <el-option
                                      v-for="item in dateList"
                                      :key="item.value"
                                      :label="item.name"
                                      :value="item.value">
                                      <span @click="dateRangeBtn(selectDateQh,'qh')" style="display: inline-block;">{{item.name}}</span>
                                    </el-option>
                                 </el-select>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <!-- 起火地点 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>起火地点</label>
                            <div class="form-item-ctrl">
                                <el-input  v-model="filterForm.zqdd" placeholder="请输入" clearable />
                            </div>
                        </div>
                    </el-col>
                    <!-- 火灾等级 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>火灾等级</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.zqlbdm" placeholder="请选择" clearable>
                                    <el-option v-for="o in fireOptions.tb_dic_zqdj" :key="o.dictValue" :value="o.dictValue" :label="o.dictLabel" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                    <!-- 是否轻微火灾 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>是否轻微火灾</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.qwhz" placeholder="请选择" clearable>
                                    <el-option value="1" label="是" />
                                    <el-option value="0" label="否" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <!-- 失火单位/户主联系电话 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>失火单位/户主联系电话</label>
                            <div class="form-item-ctrl">
                                <el-input  v-model="filterForm.lxdh" placeholder="请输入" clearable />
                            </div>
                        </div>
                    </el-col>
                    <!-- 单位统一社会信用代码 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>单位统一社会信用代码</label>
                            <div class="form-item-ctrl">
                                <el-input  v-model="filterForm.dwtyshxydm" placeholder="请输入" clearable />
                            </div>
                        </div>
                    </el-col>
                    <!-- 区域类型 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>区域类型</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.qydm" placeholder="请选择" clearable>
                                    <el-option v-for="o in fireOptions.qydm" :key="o.dictValue" :value="o.dictValue" :label="o.dictLabel" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <!-- 监督检查情况 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>监督检查情况</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.jdjcqk" placeholder="请选择" clearable>
                                    <el-option v-for="o in fireOptions.jdjcqk" :key="o.dictValue" :value="o.dictValue" :label="o.dictLabel" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                    <!-- 事故调查牵头部门 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>事故调查牵头部门</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.sgqtdcbm" placeholder="请选择" clearable>
                                    <el-option v-for="o in fireOptions.sgqtdcbm" :key="o.dictValue" :value="o.dictValue" :label="o.dictLabel" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                    <!-- 经济类型 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>经济类型</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.jjlxdm" placeholder="请选择" clearable>
                                    <el-option v-for="o in fireOptions.tb_dic_jjlx" :key="o.dictValue" :value="o.dictValue" :label="o.dictLabel" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <!-- 所属行业 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>所属行业</label>
                            <div class="form-item-ctrl">
                                <el-input v-model="filterForm.hylbdm" placeholder="请输入" clearable />
                            </div>
                        </div>
                    </el-col>
                    <!-- 起火场所类型 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>起火场所类型</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.qhcslb" placeholder="请选择" clearable @change="clearFirePlace()">
                                    <el-option v-for="o in fireOptions.tb_dic_qhcslb" :key="o.dictValue" :value="o.dictValue" :label="o.dictLabel" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                    <!-- 起火场所 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>起火场所</label>
                            <div class="form-item-ctrl-on">
                                <el-input v-model="selectedFirePlaceLabel" readonly placeholder="请选择" @focus="openFirePlaceSelect()">
                                    <i slot="suffix" class="iconfont icon-icon-test" @click="openFirePlaceSelect()" style="line-height:32px;"></i>
                                    <i slot="suffix" class="el-icon-circle-close" style="margin-left:5px; cursor: pointer;" @click="clearFirePlace()" v-show="selectedFirePlaceLabel"></i>
                                </el-input>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <!-- 是否属世界遗产 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>是否属世界遗产</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.sfsjycdm" placeholder="请选择" clearable>
                                    <el-option value="1" label="是" />
                                    <el-option value="0" label="否" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                    <!-- 建筑使用用途 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>建筑使用用途</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.jzsyyt" placeholder="请选择" clearable>
                                    <el-option v-for="o in fireOptions.jzyt" :key="o.dictValue" :value="o.dictValue" :label="o.dictLabel" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                    <!-- 建筑类别 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>建筑类别</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.jzlbdm" placeholder="请选择" clearable>
                                    <el-option v-for="o in fireOptions.tb_dic_jzlb" :key="o.dictValue" :value="o.dictValue" :label="o.dictLabel" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <!-- 建筑耐火等级 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>建筑耐火等级</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.jznhdjdm" placeholder="请选择" clearable>
                                    <el-option v-for="o in fireOptions.tb_dic_jzwnhdj" :key="o.dictValue" :value="o.dictValue" :label="o.dictLabel" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                    <!-- 建筑结构 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>建筑结构</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.jzjgdm" placeholder="请选择" clearable>
                                    <el-option v-for="o in fireOptions.tb_dic_jzjg" :key="o.dictValue" :value="o.dictValue" :label="o.dictLabel" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                    <!-- 火灾是否蔓延到临近建筑 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>火灾是否蔓延到临近建筑</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.hzsfmydljjz" placeholder="请选择" clearable>
                                    <el-option value="1" label="是" />
                                    <el-option value="0" label="否" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <!-- 是否发生轰燃 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>是否发生轰燃</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.sffshr" placeholder="请选择" clearable>
                                    <el-option value="1" label="是" />
                                    <el-option value="0" label="否" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                    <!-- 门窗是否开启 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>门窗是否开启</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.shjzmcsfkq" placeholder="请选择" clearable>
                                    <el-option value="1" label="是" />
                                    <el-option value="0" label="否" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                    <!-- 自动报警系统 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>自动报警系统</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.zdbjxtsfaz" placeholder="请选择" clearable>
                                    <el-option v-for="o in fireOptions.xfssqk" :key="o.dictValue" :value="o.dictValue" :label="o.dictLabel" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <!-- 自动灭火系统 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>自动灭火系统</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.zdmhxtsfaz" placeholder="请选择" clearable>
                                    <el-option v-for="o in fireOptions.xfssqk" :key="o.dictValue" :value="o.dictValue" :label="o.dictLabel" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                    <!-- 防排烟系统 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>防排烟系统</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.fpyxtsfaz" placeholder="请选择" clearable>
                                    <el-option v-for="o in fireOptions.xfssqk" :key="o.dictValue" :value="o.dictValue" :label="o.dictLabel" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                    <!-- 防火卷帘 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>防火卷帘</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.fhjl" placeholder="请选择" clearable>
                                    <el-option v-for="o in fireOptions.xfssqk" :key="o.dictValue" :value="o.dictValue" :label="o.dictLabel" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <!-- 室内消火栓系统 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>室内消火栓系统</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.snxhsxtsaz" placeholder="请选择" clearable>
                                    <el-option v-for="o in fireOptions.xfssqk" :key="o.dictValue" :value="o.dictValue" :label="o.dictLabel" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                    <!-- 防火分区 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>防火分区</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.fhfq" placeholder="请选择" clearable>
                                    <el-option v-for="o in fireOptions.tb_dic_fhty" :key="o.dictValue" :value="o.dictValue" :label="o.dictLabel" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                    <!-- 防火间距 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>防火间距</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.fhjj" placeholder="请选择" clearable>
                                    <el-option v-for="o in fireOptions.tb_dic_fhty" :key="o.dictValue" :value="o.dictValue" :label="o.dictLabel" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <!-- 疏散通道 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>疏散通道</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.sstd" placeholder="请选择" clearable>
                                    <el-option v-for="o in fireOptions.sstd" :key="o.dictValue" :value="o.dictValue" :label="o.dictLabel" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                    <!-- 紧急出口 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>紧急出口</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.yjck" placeholder="请选择" clearable>
                                    <el-option v-for="o in fireOptions.yjck" :key="o.dictValue" :value="o.dictValue" :label="o.dictLabel" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                    <!-- 应急疏散照明 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>应急疏散照明</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.yjsszm" placeholder="请选择" clearable>
                                    <el-option v-for="o in fireOptions.yjsszm" :key="o.dictValue" :value="o.dictValue" :label="o.dictLabel" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <!-- 联网情况 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>联网情况</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.sflw" placeholder="请选择" clearable>
                                    <el-option v-for="o in fireOptions.sflw" :key="o.dictValue" :value="o.dictValue" :label="o.dictLabel" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                    <!-- 是否保险 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>是否保险</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.sfbx" placeholder="请选择" clearable>
                                    <el-option value="1" label="是" />
                                    <el-option value="0" label="否" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                    <!-- 是否单方火灾事故 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>是否单方火灾事故</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.sfdfhzsh" placeholder="请选择" clearable>
                                    <el-option value="1" label="是" />
                                    <el-option value="0" label="否" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <!-- 起火物 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>起火物</label>
                            <div class="form-item-ctrl-on">
                                <el-input v-model="selectedFireObjectLabel" readonly placeholder="请选择" @focus="$refs.fireObjectSelect.toggle()">
                                    <i slot="suffix" class="iconfont icon-icon-test" @click="$refs.fireObjectSelect.toggle()" style="line-height:32px;"></i>
                                    <i slot="suffix" class="el-icon-circle-close" style="margin-left:5px; cursor: pointer;" @click="clearFireObject()" v-show="selectedFireObjectLabel"></i>
                                </el-input>
                            </div>
                        </div>
                    </el-col>
                    <!-- 起火原因 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>起火原因</label>
                            <div class="form-item-ctrl-on">
                                <el-input v-model="selectedFireCauseLabel" readonly placeholder="请选择" @focus="$refs.fireCauseSelect.toggle()">
                                    <i slot="suffix" class="iconfont icon-icon-test" @click="$refs.fireCauseSelect.toggle()" style="line-height:32px;"></i>
                                    <i slot="suffix" class="el-icon-circle-close" style="margin-left:5px; cursor: pointer;" @click="clearFireCause()" v-show="selectedFireCauseLabel"></i>
                                </el-input>
                            </div>
                        </div>
                    </el-col>
                    <!-- 调查方式 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>调查方式</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.dcfs" placeholder="请选择" clearable>
                                    <el-option v-for="o in fireOptions.tb_dic_dcfs" :key="o.dictValue" :value="o.dictValue" :label="o.dictLabel" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <!-- 有无人员伤亡 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>有无人员伤亡</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.sfyrsw" placeholder="请选择" clearable>
                                    <el-option value="1" label="有" />
                                    <el-option value="0" label="无" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                    <!-- 是否立案 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>是否立案</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.sfla" placeholder="请选择" clearable>
                                    <el-option value="0" label="是" />
                                    <el-option value="1" label="否" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                    <!-- 是否刑事放火 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>是否刑事放火</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.sfxsfh" placeholder="请选择" clearable>
                                    <el-option value="1" label="是" />
                                    <el-option value="0" label="否" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <!-- 是否属安全生产事故 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>是否属安全生产事故</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.sfaqscsg" placeholder="请选择" clearable>
                                    <el-option value="1" label="是" />
                                    <el-option value="0" label="否" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                    <!-- 报告状态 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>报告状态</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="selectedFireStatus" placeholder="请选择" clearable multiple collapse-tags @change="filterForm.zqShtzs = selectedFireStatus.join(',')">
                                    <el-option v-for="o in fireStatusOption" :key="o.value" :value="o.value" :label="o.label" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                  <!--建筑总楼层数-->
                  <el-col :span="8">
                    <div class="form-item">
                      <label>建筑总楼层数</label>
                      <div class="form-item-ctrl">
                        <el-input v-model="filterForm.beginJzzlcs" placeholder="最低层数"/>
                        <span style="margin: 0 5px;" class="tilde">~</span>
                        <el-input v-model="filterForm.endJzzlcs" placeholder="最高层数"/>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              <el-row>
                <!--                  失火楼层数-->
                <el-col :span="8">
                  <div class="form-item">
                    <label>失火楼层数</label>
                    <div class="form-item-ctrl">
                      <el-input v-model="filterForm.beginShlc" placeholder="最低层数"/>
                      <span style="margin: 0 5px;" class="tilde">~</span>
                      <el-input v-model="filterForm.endShlc" placeholder="最高层数"/>
                    </div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="form-item">
                    <label>死亡人数</label>
                    <div class="form-item-ctrl">
                      <el-input v-model="filterForm.sirsMin" placeholder="人数（起）"/>
                      <span style="margin: 0 5px;" class="tilde">~</span>
                      <el-input v-model="filterForm.sirsMax" placeholder="人数（止）"/>
                    </div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="form-item">
                    <label>受灾户数</label>
                    <div class="form-item-ctrl">
                      <el-input v-model="filterForm.szhsMin" placeholder="户数（起）"/>
                      <span style="margin: 0 5px;" class="tilde">~</span>
                      <el-input v-model="filterForm.szhsMax" placeholder="户数（止）"/>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <div class="form-item">
                    <label>受灾人数</label>
                    <div class="form-item-ctrl">
                      <el-input v-model="filterForm.szrsMin" placeholder="人数（起）"/>
                      <span style="margin: 0 5px;" class="tilde">~</span>
                      <el-input v-model="filterForm.szrsMax" placeholder="人数（止）"/>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
        </section>
        <!-- 查询&重置&数据同步 -->
        <section class="operations">
            <el-button type="primary" @click="query()" :loading="querying">查&nbsp;询</el-button>
            <el-button type="default" @click="reset()">重&nbsp;置</el-button>
            <el-button type="primary" @click="toReport()">生成报表</el-button>
            <el-button type="primary" v-show="resultList.length > 0" @click="downloadResult()" :loading="downloading">清单导出</el-button>

            <!-- <el-button class="synchronize-btn" type="primary" v-if="deptLevel === 2" @click="synchronize()" :loading="synchronizing">数据同步</el-button>
            <p class="synchronize-timestamp" v-if="deptLevel !== 1">数据统计时间截止至 <span>{{synchronizeTimestamp || '-'}}</span></p> -->
        </section>
        <!-- 查询结果列表 -->
        <section class="result" v-loading="listLoading">
            <h4>查询结果：</h4>
            <p class="summary">共查询到 <span>{{resultSummary['总警情数'] || 0}}</span> 起警情记录，其中火灾扑救 <span>{{resultSummary['火灾扑救'] || 0}}</span> 起，抢险救援 <span>{{resultSummary['抢险救援'] || 0}}</span> 起，社会救助 <span>{{resultSummary['社会救助'] || 0}}</span> 起，公务执勤 <span>{{resultSummary['公务执勤'] || 0}}</span> 起，反恐排爆 <span>{{resultSummary['反恐排爆'] || 0}}</span> 起，其他 <span>{{resultSummary['其他出动'] || 0}}</span> 起，共出动队伍 <span>{{resultSummary['出动次数'] || 0}}</span> 队次，出动车辆 <span>{{resultSummary['出动车辆次'] || 0}}</span> 辆次，出动人员 <span>{{resultSummary['出动人次'] || 0}}</span> 人次。</p>
            <el-table :data="resultList" style="width: 100%" v-loading="querying">
                <el-table-column prop="jqbh" label="警情编码" width="135" />
                <el-table-column prop="jjsj" label="接警时间" width="130" />
                <el-table-column prop="xzqydmSj" label="行政区域" width="150" />
                <el-table-column prop="jqfsdd" label="警情地址" show-overflow-tooltip />
                <el-table-column prop="sjlbmc" label="警情类型" width="100" show-overflow-tooltip />
                <el-table-column label="投入力量" width="100">
                    <template slot-scope="scope">
                        <div>{{scope.row.carCount}} 车 {{scope.row.trrys}} 人</div>
                    </template>
                </el-table-column>
                <el-table-column prop="xfdwdm" label="派发单位" show-overflow-tooltip />
                <el-table-column label="操作" width="60">
                    <template slot-scope="scope">
                        <el-button type="text" @click="toDetail(scope.row)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination" v-show="total > 0">
                <pagination :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
            </div>
        </section>

        <!-- 弹出层：选择地区 -->
        <area-select ref="areaSelect" @setProv="selectArea"></area-select>
        <!-- 弹出层：选择发送单位 -->
        <sender-select ref="senderSelect" @setMulVal="selectSender"></sender-select>
        <!-- 弹出层：选择出动队伍 -->
        <dispatch-select ref="dispatchSelect" @setMulVal="selectDispatch"></dispatch-select>
        <!-- 弹出层：选择责任区大队 -->
        <duty-select ref="dutySelect" @setMulVal="selectDuty"></duty-select>
        <!-- 弹出层：选择主战队伍 -->
        <dispatch-select ref="mainForceSelect" @setMulVal="selectMainForce"></dispatch-select>
        <!-- 弹出层：选择起火场所 -->
        <fire-place-select ref="firePlaceSelect" :qhcs-type="filterForm.qhcslb ? filterForm.qhcslb : ''" @setMulVals="selectFirePlace"></fire-place-select>
        <!-- 弹出层：选择起火物 -->
        <fire-object-select ref="fireObjectSelect" @setFireMulVal="selectFireObject"></fire-object-select>
        <!-- 弹出层：选择起火原因 -->
        <fire-cause-select ref="fireCauseSelect" :multiple="true" @setFireReasonMulVal="selectFireCause"></fire-cause-select>
    </div>
</template>

<script>

    import { formdate as datetimeFormat } from '@/utils/dateTimeUtils';
    import areaSelect from '@/views/eqw/customSearch/components/multiProvModal.vue';
    import { getJqcdlb, getOptions } from '@/api/data/entry/jqxx';
    import senderSelect from '@/views/components/dataSeach/senderMulModal.vue';
    import dispatchSelect from '@/views/components/dataSeach/cdMulModal.vue';
    import dutySelect from '@/views/components/dataSeach/dutyModal.vue';
    import { getSelectOptions, getTreeOptions } from '@/api/data/entry/zqxx';
    import { cdOptions, cdOptionsList, fireOption as zqOptions, optionsList as zqOptionsList, fireTreeOption as zqTreeOption } from '../dataSearch/components/option';
    import firePlaceSelect from '@/views/eqw/customSearch/components/fireSpaceModal.vue';
    import fireObjectSelect from '@/views/eqw/customSearch/components/fireObjectModal.vue';
    import fireCauseSelect from '@/views/data/entry/zqxx/components/fireReasonMul.vue';
    import { synchronizeData, getSynchronizeDataTime } from '@/api/report/report';
    import { jqxxCommomSearch, selectJqxxCommonCount, jqxxCommomDownload} from '@/api/data/entry/jqxx';
    import { downloadFile } from '@/utils/download-file';
    import {getNearlyRecentDays} from "@/utils/dateTimeUtils";

    export default {
        name: 'generalSearchWarning',
        components: {
            areaSelect,
            senderSelect,
            dispatchSelect,
            dutySelect,
            firePlaceSelect,
            fireObjectSelect,
            fireCauseSelect
        },
        data() {
            return {
                showWarningFilterAll: false, // 是否完全展开警情信息筛选
                showDispatchFilterAll: false, // 是否完全展开出动信息筛选
                showFireFilterAll: false, // 是否完全展开火灾信息筛选
                filterForm: {
                    /*** 警情信息筛选 ***/
                    jqbh: '', // 警情编号
                    paramJjsjFrom: '', // 接警时间 (起)
                    paramJjsjTo: '', // 接警时间 (止)
                    xzqydmSj: '', // 行政区域编码
                    jqfsdd: '', // 警情地址
                    sjlbdm: '', // 警情类型编码 (多)
                    jqtbzh: '', // 发送单位编码 (多)
                    dwmcHzm: '', // 单位名称/户主名
                    caseNbr: '', // 119案件编号
                    xfdwdm: '', // 出动队伍编码 (多)
                    zrqdddm: '', // 责任区大队编码 (多)
                    zzdw: '', // 主战队伍编码 (多),
                    jqdj: '', // 警情等级
                    /*** 出动信息筛选 ***/
                    respondType: '', // 参战形式
                    czqkdm: '', // 处置情况
                    jlxcjldmMin: undefined, // 距离现场 (起)
                    jlxcjldmMax: undefined, // 距离现场 (止)
                    xcrybkqkdmMin: undefined, // 现场被困人数 (起)
                    xcrybkqkdmMax: undefined, // 现场被困人数 (止)
                    useHydrant: '', // 是否采用公用消防栓供水
                    zhy: '', // 带队指挥员姓名
                    zhyzw: '', // 带队指挥员职务
                    qqzhbZhcddm: '', // 全勤指挥部
                    isLddw: '', // 是否有联动单位
                    qwMax: undefined, // 气温 (起)
                    qwMin: undefined, // 气温 (止)
                    fxdm: '', // 风向
                    windForce: '', // 风力
                    weather: '', // 天气
                    insideAttack: '', // 是否内攻
                    hzJzscsdm: '', // 火灾技战术措施
                    qxjyJzscsdm: '', // 抢险救援战术措施
                    carCountMin: undefined, // 投入车辆数 (起)
                    carCountMax: undefined, // 投入车辆数 (止)
                    trrysMin: undefined, // 投入人员数 (起)
                    trrysMax: undefined, // 投入人员数 (止)
                    mjjydMc: '', // 志愿队
                    qyzzdMc: '', // 专职队
                    isCzrysw: '', // 是否有消防人员伤亡
                    cdShzts: '', // 报告状态 (多)
                    protectPropValMin: undefined, //保护财产价值（起）
                    protectPropValMax: undefined, //保护财产价值（止）
                    /*** 火灾信息筛选 ***/
                    sfzzdc: '', // 是否正在调查
                    paramZqsjFrom: '', // 起火时间 (起)
                    paramZqsjTo: '', // 起火时间 (止)
                    zqdd: '', // 起火地点
                    zqlbdm: '', // 火灾等级
                    qwhz: '', // 是否轻微火灾
                    lxdh: '', // 失火单位/户主联系电话
                    dwtyshxydm: '', // 单位统一社会信用代码
                    qydm: '', // 区域类型
                    jdjcqk: '', // 监督检查情况
                    sgqtdcbm: '', // 事故调查牵头部门
                    jjlxdm: '', // 经济类型
                    hylbdm: '', // 所属行业
                    qhcslb: '', // 起火场所类型
                    qhcsdm: '', // 起火场所编码 (多)
                    sfsjycdm: '', // 是否属世界遗产
                    jzsyyt: '', // 建筑使用用途
                    jzlbdm: '', // 建筑类别
                    jznhdjdm: '', // 建筑耐火等级
                    jzjgdm: '', // 建筑结构
                    hzsfmydljjz: '', // 火灾是否蔓延到临近建筑
                    sffshr: '', // 是否发生轰燃
                    shjzmcsfkq: '', // 门窗是否开启
                    zdbjxtsfaz: '', // 自动报警系统
                    zdmhxtsfaz: '', // 自动灭火系统
                    fpyxtsfaz: '', // 防排烟系统
                    fhjl: '', // 防火卷帘
                    snxhsxtsaz: '', // 室内消火栓系统
                    fhfq: '', // 防火分区
                    fhjj: '', // 防火间距
                    sstd: '', // 疏散通道
                    yjck: '', // 紧急出口
                    yjsszm: '', // 应急疏散照明
                    sflw: '', // 联网情况
                    sfbx: '', // 是否保险
                    sfdfhzsh: '', // 是否单方火灾事故
                    qhwfldm: '', // 起火物编码 (多)
                    hzyydm: '', // 起火原因编码 (多)
                    dcfs: '', // 调查方式
                    sfyrsw: '', // 有无人员伤亡
                    sfla: '', // 是否立案
                    sfxsfh: '', // 是否刑事放火
                    sfaqscsg: '', // 是否属安全生产事故
                    zqShtzs: '', // 报告状态 (多)
                    beginJzzlcs:'',//建筑总楼层数头
                    endJzzlcs:'',//建筑总楼层数尾
                    beginShlc:'',//失火楼层头
                    endShlc:'',//失火楼层尾
                    allTrrysMin:undefined,//投入人员总数最少
                    allTrrysMax:undefined,//投入人员总数最大
                    allCarCountMin:undefined,//投入车辆数最小值
                    allCarCountMax:undefined,//投入车辆数最大值
                    sirsMin:'',//死亡人数
                    sirsMax:'',//死亡人数
                    szhsMin:'',//受灾户数
                    szhsMax:'',//受灾户数
                    szrsMin:'',//受灾人数
                    szrsMax:''//受灾人数
                },
                queryParams: {
                    pageNum: 1,
                    pageSize: 20
                },
                selectedAreaLabel: '', // 已选的行政区域名称
                // 警情类型级联选择控件配置参数
                warningTypeCascaderOption: {
                    multiple: true,
                    lazy: true,
                    lazyLoad: this.warningTypeCascaderLazyLoad,
                    children: 'children',
                    label: 'dictLabel',
                    value: 'dictValue',
                    isLeaf: 'isLeaf',
                    emitPath: false,
                    checkStrictly: true
                },
                selectedWarningTypeValue: [], // 已选的警情类型值
                selectedSenderLabel: '', // 已选的发送单位名称
                selectedDispatchLabel: '', // 已选的出动队伍名称
                selectedDutyLabel: '', // 已选的责任区大队名称
                selectedMainForceLabel: '', // 已选的主战队伍名称
                // 出动信息筛选选项
                dispatchOptions: cdOptionsList,
                // 风力选项
                windForceOption: [
                    {label: '1级', value: '1'},
                    {label: '2级', value: '2'},
                    {label: '3级', value: '3'},
                    {label: '4级', value: '4'},
                    {label: '5级', value: '5'},
                    {label: '6级', value: '6'},
                    {label: '7级', value: '7'},
                    {label: '8级', value: '8'},
                    {label: '9级', value: '9'},
                    {label: '10级', value: '10'},
                    {label: '11级', value: '11'},
                    {label: '12级', value: '12'},
                    {label: '13级', value: '13'},
                    {label: '14级', value: '14'},
                    {label: '15级', value: '15'},
                    {label: '16级', value: '16'}
                ],
                // 出动报告状态选项
                dispatchStatusOption: [
                    {label: '待填报', value: '0'},
                    {label: '审核中', value: '1'},
                    {label: '被退回', value: '-2'},
                    {label: '待修改', value: '-1'},
                    {label: '已审核', value: '2'},
                    {label: '被驳回', value: '4'},
                    {label: '待完善', value: '-3'},
                    {label: '被挂起', value: '3'},
                    {label: '已归档', value: '99'}
                ],
                // 已选的出动报告状态
                selectedDispatchStatus: [],
                // 火灾信息筛选选项
                fireOptions: zqOptionsList,
                selectedFirePlaceLabel: '', // 已选的起火场所名称
                selectedFireObjectLabel: '', // 已选的起火物名称
                selectedFireCauseLabel: '', // 已选的起火原因名称
                // 火灾报告状态选项
                fireStatusOption: [
                    {label: '待填报', value: '0'},
                    {label: '审核中', value: '1'},
                    {label: '被退回', value: '-2'},
                    {label: '被终止', value: '-1'},
                    {label: '已审核', value: '2'},
                    {label: '被驳回', value: '4'},
                    {label: '待完善', value: '-3'},
                    {label: '已归档', value: '99'}
                ],
                // 已选的火灾报告状态
                selectedFireStatus: [],
                synchronizing: false, // 是否正在同步数据
                synchronizeTimestamp: '', // 数据同步时间
                resultSummary: {
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
                }, // 结果汇总
                resultList: [], // 结果列表
                total: 0, // 结果总数
                querying: false, // 是否正在查询
                listLoading: false,
                downloading: false, // 是否正在下载
                // 日期选择控件配置
                dateList:[{
                    value: 0,
                    name:'本日'
                  }, {
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
                selectDateQh:""
            }
        },
        computed: {
            deptLevel() {
                return this.$store.getters.deptLevel;
            }
        },
        methods: {
            // 选择接警时间时校验合法性
            checkJjsj(type) {
                let startTimeMilis = this.filterForm.paramJjsjFrom ? new Date(this.filterForm.paramJjsjFrom).getTime() : 0;
                let endTimeMilis = this.filterForm.paramJjsjTo ? new Date(this.filterForm.paramJjsjTo).getTime() : 0;
                // 起止时间都选择了的情况下判断合法性
                if (startTimeMilis && endTimeMilis && startTimeMilis >= endTimeMilis) {
                    if (type === 'start') {
                        // 将起始时间设置到截止时间之前30天
                        startTimeMilis = endTimeMilis - 30 * 24 * 60 * 60 * 1000;
                    } else {
                        // 将截止时间设置到起始时间之后30天
                        endTimeMilis = startTimeMilis + 30 * 24 * 60 * 60 * 1000;
                    }
                    this.filterForm.paramJjsjFrom = datetimeFormat(new Date(startTimeMilis));
                    this.filterForm.paramJjsjTo = datetimeFormat(new Date(endTimeMilis));
                }
            },
            // 选择行政区域
            selectArea(data, path) {
                // this.filterForm.xzqydmSj = data[0].areaId;
                // this.selectedAreaLabel = path;
                const selectedValue = [];
                const selectedLabel = [];
                data.map(d => {
                    selectedValue.push(d.areaId);
                    selectedLabel.push(d.areaName);
                });
                this.filterForm.xzqydmSj = selectedValue.join(',');
                this.selectedAreaLabel = selectedLabel.join('，');
            },
            // 警情类型级联选择懒加载
            warningTypeCascaderLazyLoad(node, resolve) {
                const parentValue = node.value ? node.value : '0';
                getJqcdlb({ dictType: 'jqcjlb', parentValue: parentValue }).then(response => {
                    const children = response.data || [];
                    children.forEach(item => {
                        if (item.isLast === '1') {
                            item.leaf = true;
                        }
                    });
                    resolve(children);
                }).catch(() => {
                    resolve([]);
                });
            },
            // 选择发送单位
            selectSender(data) {
                const selectedValue = [];
                const selectedLabel = [];
                data.map(d => {
                    selectedValue.push(d.deptId);
                    selectedLabel.push(d.deptName);
                });
                this.filterForm.jqtbzh = selectedValue.join(',');
                this.selectedSenderLabel = selectedLabel.join('，');
            },
            // 选择出动队伍
            selectDispatch(data) {
                const selectedValue = [];
                const selectedLabel = [];
                data.map(d => {
                    selectedValue.push(d.deptId);
                    selectedLabel.push(d.deptName);
                });
                this.filterForm.xfdwdm = selectedValue.join(',');
                this.selectedDispatchLabel = selectedLabel.join('，');
            },
            // 选择责任区大队
            selectDuty(data) {
                const selectedValue = [];
                const selectedLabel = [];
                data.map(d => {
                    selectedValue.push(d.deptId);
                    selectedLabel.push(d.deptName);
                });
                this.filterForm.zrqdddm = selectedValue.join(',');
                this.selectedDutyLabel = selectedLabel.join('，');
            },
            // 选择主战队伍
            selectMainForce(data) {
                const selectedValue = [];
                const selectedLabel = [];
                data.map(d => {
                    selectedValue.push(d.deptId);
                    selectedLabel.push(d.deptName);
                });
                this.filterForm.zzdw = selectedValue.join(',');
                this.selectedMainForceLabel = selectedLabel.join('，');
            },
            // 选择起火时间时校验合法性
            checkZqsj(type) {
                let startTimeMilis = this.filterForm.paramZqsjFrom ? new Date(this.filterForm.paramZqsjFrom).getTime() : 0;
                let endTimeMilis = this.filterForm.paramZqsjTo ? new Date(this.filterForm.paramZqsjTo).getTime() : 0;
                // 起止时间都选择了的情况下判断合法性
                if (startTimeMilis && endTimeMilis && startTimeMilis >= endTimeMilis) {
                    if (type === 'start') {
                        // 将起始时间设置到截止时间之前30天
                        startTimeMilis = endTimeMilis - 30 * 24 * 60 * 60 * 1000;
                    } else {
                        // 将截止时间设置到起始时间之后30天
                        endTimeMilis = startTimeMilis + 30 * 24 * 60 * 60 * 1000;
                    }
                    this.filterForm.paramZqsjFrom = datetimeFormat(new Date(startTimeMilis));
                    this.filterForm.paramZqsjTo = datetimeFormat(new Date(endTimeMilis));
                }
            },
            // 打开起火场所选择框
            openFirePlaceSelect() {
                if (!this.filterForm.qhcslb) {
                    this.$message.warning('请先选择起火场所类型');
                    return;
                }
                this.$refs.firePlaceSelect.toggle();
            },
            // 选择起火场所
            selectFirePlace(data) {
                const selectedValue = [];
                const selectedLabel = [];
                data.map(d => {
                    selectedValue.push(d.dictValue);
                    selectedLabel.push(d.dictLabel);
                });
                this.filterForm.qhcsdm = selectedValue.join(',');
                this.selectedFirePlaceLabel = selectedLabel.join('，');
            },
            // 选择起火物
            selectFireObject(data) {
                const selectedValue = [];
                const selectedLabel = [];
                data.map(d => {
                    selectedValue.push(d.dictValue);
                    selectedLabel.push(d.dictLabel);
                });
                this.filterForm.qhwfldm = selectedValue.join(',');
                this.selectedFireObjectLabel = selectedLabel.join('，');
            },
            // 选择起火原因
            selectFireCause(data) {
                const selectedValue = [];
                const selectedLabel = [];
                data.map(d => {
                    selectedValue.push(d.dictValue);
                    selectedLabel.push(d.dictLabel);
                });
                this.filterForm.hzyydm = selectedValue.join(',');
                this.selectedFireCauseLabel = selectedLabel.join('，');
            },
            // 获取数据同步时间
            getSynchronizeTimestamp() {
                getSynchronizeDataTime().then(response => {
                    this.synchronizeTimestamp = response.data.cdtime;
                });
            },
            // 数据同步
            async synchronize() {
                this.synchronizing = true;
                const synchronizeResponse = await synchronizeData();
                this.synchronizing = false;
                if (synchronizeResponse.code === 200) {
                    this.$message.success('数据同步成功！');
                    this.getSynchronizeTimestamp();
                } else {
                    this.$message.error(synchronizeResponse.msg);
                }
            },
            // 获取列表
            getList() {
                this.querying = true;
                jqxxCommomSearch(this.queryParams).then(response => {
                    if (response.data.hasresult) {
                        this.total = response.data.table.total || 0;
                        this.resultList = response.data.table.rows || [];
                    } else {
                        this.total = 0;
                        this.resultList = [];
                    }
                }).finally(() => {
                    this.querying = false;
                });
            },
            // 获取汇总
            getSummary() {
                this.listLoading = true;
                selectJqxxCommonCount(this.queryParams).then(response => {
                    this.listLoading = false;
                    if (response.data && response.data.length > 0) {
                        this.resultSummary = response.data[0];
                    }
                }).finally(() => {
                   this.listLoading = false;
                });
            },
            // 筛选查询
            query() {
                this.queryParams.pageNum = 1;
                for (const item in this.filterForm) {
                    if (this.filterForm[item] || this.filterForm[item] == '0') {
                        this.queryParams[item] = this.filterForm[item];
                    } else {
                        delete this.queryParams[item];
                    }
                }
                this.getList();
                this.getSummary();
            },
            // 重置筛选
            reset() {
                this.filterForm = {
                    /*** 警情信息筛选 ***/
                    jqbh: '', // 警情编号
                    paramJjsjFrom: '', // 接警时间 (起)
                    paramJjsjTo: '', // 接警时间 (止)
                    xzqydmSj: '', // 行政区域编码
                    jqfsdd: '', // 警情地址
                    sjlbdm: '', // 警情类型编码 (多)
                    jqtbzh: '', // 发送单位编码 (多)
                    dwmcHzm: '', // 单位名称/户主名
                    caseNbr: '', // 119案件编号
                    xfdwdm: '', // 出动队伍编码 (多)
                    zrqdddm: '', // 责任区大队编码 (多)
                    zzdw: '', // 主战队伍编码 (多)
                    jqdj: '', //警情等级
                    /*** 出动信息筛选 ***/
                    respondType: '', // 参战形式
                    czqkdm: '', // 处置情况
                    jlxcjldmMin: undefined, // 距离现场 (起)
                    jlxcjldmMax: undefined, // 距离现场 (止)
                    xcrybkqkdmMin: undefined, // 现场被困人数 (起)
                    xcrybkqkdmMax: undefined, // 现场被困人数 (止)
                    useHydrant: '', // 是否采用公用消防栓供水
                    zhy: '', // 带队指挥员姓名
                    zhyzw: '', // 带队指挥员职务
                    qqzhbZhcddm: '', // 全勤指挥部
                    isLddw: '', // 是否有联动单位
                    qwMax: undefined, // 气温 (起)
                    qwMin: undefined, // 气温 (止)
                    fxdm: '', // 风向
                    windForce: '', // 风力
                    weather: '', // 天气
                    insideAttack: '', // 是否内攻
                    hzJzscsdm: '', // 火灾技战术措施
                    qxjyJzscsdm: '', // 抢险救援战术措施
                    carCountMin: undefined, // 投入车辆数 (起)
                    carCountMax: undefined, // 投入车辆数 (止)
                    trrysMin: undefined, // 投入人员数 (起)
                    trrysMax: undefined, // 投入人员数 (止)
                    mjjydMc: '', // 民间救援队
                    qyzzdMc: '', // 企业专职队
                    isCzrysw: '', // 是否有消防人员伤亡
                    cdShzts: '', // 报告状态 (多)
                    protectPropValMin: undefined, //保护财产价值（起）
                    protectPropValMax: undefined, //保护财产价值（止）
                    /*** 火灾信息筛选 ***/
                    sfzzdc: '', // 是否正在调查
                    paramZqsjFrom: '', // 起火时间 (起)
                    paramZqsjTo: '', // 起火时间 (止)
                    zqdd: '', // 起火地点
                    zqlbdm: '', // 火灾等级
                    qwhz: '', // 是否轻微火灾
                    lxdh: '', // 失火单位/户主联系电话
                    dwtyshxydm: '', // 单位统一社会信用代码
                    qydm: '', // 区域类型
                    jdjcqk: '', // 监督检查情况
                    sgqtdcbm: '', // 事故调查牵头部门
                    jjlxdm: '', // 经济类型
                    hylbdm: '', // 所属行业
                    qhcslb: '', // 起火场所类型
                    qhcsdm: '', // 起火场所编码 (多)
                    sfsjycdm: '', // 是否属世界遗产
                    jzsyyt: '', // 建筑使用用途
                    jzlbdm: '', // 建筑类别
                    jznhdjdm: '', // 建筑耐火等级
                    jzjgdm: '', // 建筑结构
                    hzsfmydljjz: '', // 火灾是否蔓延到临近建筑
                    sffshr: '', // 是否发生轰燃
                    shjzmcsfkq: '', // 门窗是否开启
                    zdbjxtsfaz: '', // 自动报警系统
                    zdmhxtsfaz: '', // 自动灭火系统
                    fpyxtsfaz: '', // 防排烟系统
                    fhjl: '', // 防火卷帘
                    snxhsxtsaz: '', // 室内消火栓系统
                    fhfq: '', // 防火分区
                    fhjj: '', // 防火间距
                    sstd: '', // 疏散通道
                    yjck: '', // 紧急出口
                    yjsszm: '', // 应急疏散照明
                    sflw: '', // 联网情况
                    sfbx: '', // 是否保险
                    sfdfhzsh: '', // 是否单方火灾事故
                    qhwfldm: '', // 起火物编码 (多)
                    hzyydm: '', // 起火原因编码 (多)
                    dcfs: '', // 调查方式
                    sfyrsw: '', // 有无人员伤亡
                    sfla: '', // 是否立案
                    sfxsfh: '', // 是否刑事放火
                    sfaqscsg: '', // 是否属安全生产事故
                    zqShtzs: '', // 报告状态 (多)
                };
                this.selectedAreaLabel = ''; // 已选的行政区域名称
                this.selectedWarningTypeValue = []; // 已选的警情类型值
                this.selectedSenderLabel = ''; // 已选的发送单位名称
                this.selectedDispatchLabel = ''; // 已选的出动队伍名称
                this.selectedDutyLabel = ''; // 已选的责任区大队名称
                this.selectedMainForceLabel = ''; // 已选的主战队伍名称
                this.selectedDispatchStatus = []; // 已选的出动报告状态
                this.selectedFirePlaceLabel = ''; // 已选的起火场所名称
                this.selectedFireObjectLabel = ''; // 已选的起火物名称
                this.selectedFireCauseLabel = ''; // 已选的起火原因名称
                this.selectedFireStatus = []; // 已选的火灾报告状态
                this.filterForm.paramJjsjFrom = getNearlyRecentDays(30)[0]; //初始化接警开始时间
                this.filterForm.paramJjsjTo = getNearlyRecentDays(30)[1]; //初始化接警结束时间
                this.selectDate = 2;
                this.selectDateQh = "";
            },
            // 前往报表
            toReport() {
                sessionStorage.setItem('dataSearch_to_dataReport_params', JSON.stringify(this.filterForm));
                this.$router.push({path: '/eqw/dataReport', query: { rptSource: 'jq' }});
            },
            // 下载查询结果
            downloadResult() {
                this.downloading = true;
                const downloadParams = { ...this.queryParams };
                delete downloadParams.pageNum;
                delete downloadParams.pageSize;
                jqxxCommomDownload(downloadParams).then(response => {
                    downloadFile('警情综合查询-', response.data.stream);
                }).finally(() => {
                    this.downloading = false;
                });
            },
            // 查看详情
            toDetail(data) {
                this.$router.push({
                    path: '/showDetail/jqxxShowDetail',
                    query: { jqbh: data.jqbh }
                });
            },
            //清除行政区域
            clearArea(){
              this.selectedAreaLabel = '';
              this.filterForm.xzqydmSj = '';
              this.$refs.areaSelect.clear();
            },
             //清除发送单位
            clearSender(){
                this.filterForm.jqtbzh = '';
                this.selectedSenderLabel = '';
                this.$refs.senderSelect.clear();
            },
            //清除出动队伍
            clearDispatch(){
                this.filterForm.xfdwdm = '';
                this.selectedDispatchLabel = '';
                this.$refs.dispatchSelect.clear();
            },
            //清除责任区大队
            clearDuty(){
                this.selectedDutyLabel = '';
                this.filterForm.zrqdddm = '';
                this.$refs.dutySelect.clear();
            },
            //清除主战队伍
            clearMainforce(){
                this.selectedMainForceLabel = '';
                this.filterForm.zzdw = '';
                this.$refs.mainForceSelect.clear();
            },
            //清除起火物
            clearFireObject(){
                this.selectedFireObjectLabel = '';
                this.filterForm.qhwfldm = '';
                this.$refs.fireObjectSelect.clear();
            },
            //清除起火原因
            clearFireCause(){
                this.selectedFireCauseLabel = '';
                this.filterForm.hzyydm = '';
                this.$refs.fireCauseSelect.clear();
            },
            //清除火灾起火场所
            clearFirePlace(){
                this.selectedFirePlaceLabel = '';
                this.filterForm.qhcsdm = '';
                this.$refs.firePlaceSelect.clear();
            },
            dateRangeBtn(date,type){
              this.dateRange = [];
              let end = new Date();
              let start = new Date();
              start.setHours(0,0,0,0);
              end.setHours(23,59,59,0);
              let year = new Date().getFullYear();
              let month = new Date().getMonth();
              switch(date) {
                case 0:
                  start.setTime(start.getTime());
                  break;
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
              if(type == 'qh'){
                this.filterForm.paramZqsjFrom = datetimeFormat(new Date(start));
                this.filterForm.paramZqsjTo = datetimeFormat(new Date(end));
              }else{
                this.filterForm.paramJjsjFrom = datetimeFormat(new Date(start));
                this.filterForm.paramJjsjTo = datetimeFormat(new Date(end));
              }
            }
        },
        created() {
            // 初始化出动信息筛选的可选项
            cdOptions.forEach(item => {
                getSelectOptions(item).then(response => {
                    this.dispatchOptions[item] = response.data || [];
                });
            });
            // 初始化火灾信息筛选的可选项
            zqOptions.forEach(item => {
                getSelectOptions(item).then(response => {
                    this.fireOptions[item] = response.data || [];
                });
            });
            zqTreeOption.forEach(item => {
                getTreeOptions({ dictType: item.dictType, parentValue: item.parentValue }).then(response => {
                    this.fireOptions[item.dictType] = response.data || [];
                });
            });
            //警情等级
            getOptions("tb_dic_jqdj").then(res => {
              if (res.code !== 200) {
                return;
              }
              this.jqdj = res.data;
            });
            // 初始化数据同步时间
            this.getSynchronizeTimestamp();
            this.filterForm.paramJjsjFrom = getNearlyRecentDays(30)[0]; //初始化接警开始时间
            this.filterForm.paramJjsjTo = getNearlyRecentDays(30)[1]; //初始化接警结束时间
        }
    }
</script>
