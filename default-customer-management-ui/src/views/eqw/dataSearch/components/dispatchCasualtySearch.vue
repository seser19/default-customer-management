<style rel="stylesheet/scss" lang="scss">
  .page-dispatch-casualty-search{
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
      //   position: absolute;
      //   top: 0;
      //   left: 0;
      //   width: 100%;
      //   height: 32px;
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
   }
</style>

<template>
    <div class="page-dispatch-casualty-search">
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
                                    :clearable="false"
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
                                    :clearable="false"
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
                          <label class="text">行政区域</label>
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
                    <!-- 119案件编号 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>119案件编号</label>
                            <div class="form-item-ctrl">
                                <el-input  v-model="filterForm.caseNbr" placeholder="请输入" clearable />
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
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
                </el-row>
            </div>
        </section>
        <!-- 伤亡信息筛选 -->
        <section class="filter-section">
            <h4>
                伤亡信息
                <a @click="showCasualtyFilterAll = !showCasualtyFilterAll">{{showCasualtyFilterAll ? '收起' : '展开'}}<i class="el-icon-arrow-down" :class="{'opened': showCasualtyFilterAll}"></i></a>
            </h4>
            <div class="filter-form dispatch-casualty" :class="{'hide-some': !showCasualtyFilterAll}">
                <el-row>
                    <!-- 伤亡情况 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>伤亡情况</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.swfl" placeholder="请选择" clearable>
                                    <el-option label="死亡" value="0" />
                                    <el-option label="轻伤" value="1" />
                                    <el-option label="重伤" value="2" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                    <!-- 人员姓名 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>人员姓名</label>
                            <div class="form-item-ctrl">
                                <el-input  v-model="filterForm.xm" placeholder="请输入" clearable />
                            </div>
                        </div>
                    </el-col>
                    <!-- 人员性别 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>人员性别</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.xb" placeholder="请选择" clearable>
                                    <el-option v-for="o in casualtyOptions.sys_user_sex" :key="o.dictValue" :value="o.dictValue" :label="o.dictLabel" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <!-- 身份证号 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>身份证号</label>
                            <div class="form-item-ctrl">
                                <el-input  v-model="filterForm.sfzhm" placeholder="请输入" clearable />
                            </div>
                        </div>
                    </el-col>
                    <!-- 人员身份 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>人员身份</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.rylbdm" placeholder="请选择" clearable>
                                    <el-option v-for="o in casualtyOptions.tb_dic_rysfxx" :key="o.dictValue" :value="o.dictValue" :label="o.dictLabel" />
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                    <!-- 人员年龄范围 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>人员年龄范围</label>
                            <div class="form-item-ctrl">
                                <el-input-number  :controls="false" v-model="filterForm.nlFrom" placeholder="请输入" clearable />
                                <span class="tilde large">~</span>
                                <el-input-number  :controls="false" v-model="filterForm.nlTo" placeholder="请输入" clearable />
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <!-- 人员职务 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>人员职务</label>
                            <div class="form-item-ctrl">
                                <el-input  v-model="filterForm.position" placeholder="请输入" clearable />
                            </div>
                        </div>
                    </el-col>
                    <!-- 致死伤原因 -->
                    <el-col :span="8">
                        <div class="form-item">
                            <label>致死伤原因</label>
                            <div class="form-item-ctrl">
                                <el-select  v-model="filterForm.swyydm" placeholder="请选择" clearable>
                                    <el-option v-for="o in casualtyOptions.tb_dic_swyy" :key="o.dictValue" :value="o.dictValue" :label="o.dictLabel" />
                                </el-select>
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
        <section class="result" v-loading="querying">
            <h4>查询结果：</h4>
            <p class="summary">共查询到 <span>{{resultSummary.cdcsjl || 0}}</span> 次出动记录，出动车辆 <span>{{resultSummary.cdcl || 0}}</span> 辆，出动警力 <span>{{resultSummary.cdjl || 0}}</span> 人，抢救被困人员 <span>{{resultSummary.qjbkry || 0}}</span> 人，疏散被困人员<span>{{resultSummary.ssbkry || 0}}</span> 人，抢救财产价值 <span>{{resultSummary.qqccjz || 0}}</span> 元，参战人员死亡 <span>{{resultSummary.czrysw || 0}}</span> 人，受伤 <span>{{resultSummary.czryss || 0}}</span> 人。</p>
            <el-table :data="resultList" style="width: 100%" v-loading="listLoading">
                <el-table-column prop="cdbh" sortable label="出动编号" width="140" />
                <el-table-column prop="jjsj" sortable label="接警时间" width="130" />
                <el-table-column prop="xzqy" label="行政区域" width="150" />
                <el-table-column prop="jqfsdd" label="警情地点" show-overflow-tooltip />
                <el-table-column label="伤亡情况" width="100">
                    <template slot-scope="scope">{{scope.row.swdys+'死'+scope.row.ssdys+'伤'}}</template>
                </el-table-column>
                <el-table-column label="责任区大队" show-overflow-tooltip>
                    <template slot-scope="scope">{{scope.row.deptname || '-'}}</template>
                </el-table-column>
                <el-table-column label="报告状态" width="80">
                    <template slot-scope="scope">
                        <div class="pic" v-if="scope.row.shzt === 0">
                            <img src="../../../icons/weisongshen.svg" />
                            <span>未送审</span>
                        </div>
                        <div class="pic" v-if="scope.row.shzt === 1">
                            <img src="../../../icons/shenpizhong.svg" />
                            <span>审核中</span>
                        </div>
                        <div class="pic" v-if="scope.row.shzt === 2">
                            <img src="../../../icons/yishenpi.svg" />
                            <span>已审核</span>
                        </div>
                        <div class="pic" v-if="scope.row.shzt === 3">
                            <img src="../../../icons/guaqi.svg" />
                            <span>被挂起</span>
                        </div>
                        <div class="pic" v-if="scope.row.shzt === 4">
                            <img src="../../../icons/bohui.svg" />
                            <span>被驳回</span>
                        </div>
                        <div class="pic" v-if="scope.row.shzt === -1">
                            <img src="../../../icons/beizhongzhi.svg" />
                            <span>待修改</span>
                        </div>
                        <div class="pic" v-if="scope.row.shzt === -2">
                            <img src="../../../icons/tuihui.svg" />
                            <span>被退回</span>
                        </div>
                        <div class="pic" v-if="scope.row.shzt === -3">
                            <img src="../../../icons/daiwanshan.svg" />
                            <span>待完善</span>
                        </div>
                    </template>
                </el-table-column>
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
    </div>
</template>

<script>

    import { formdate as datetimeFormat } from '@/utils/dateTimeUtils';
    import areaSelect from '@/views/eqw/customSearch/components/multiProvModal.vue';
    import { getJqcdlb } from '@/api/data/entry/jqxx';
    import senderSelect from '@/views/components/dataSeach/senderMulModal.vue';
    import dispatchSelect from '@/views/components/dataSeach/cdMulModal.vue';
    import dutySelect from '@/views/components/dataSeach/dutyModal.vue';
    import { synchronizeData, getSynchronizeDataTime } from '@/api/report/report';
    import dataSearch from '@/api/data/eqw/dataSearch';
    import { cdxxCommomDownload } from '@/api/data/aduit/cdxx';
    import { downloadFile } from '@/utils/download-file';
    import {getInitTime,getNearlyRecentDays} from "@/utils/dateTimeUtils";

    export default {
        name: 'dispatchCasualtySearch',
        components: {
            areaSelect,
            senderSelect,
            dispatchSelect,
            dutySelect
        },
        data() {
            return {
                showWarningFilterAll: false, // 是否完全展开警情信息筛选
                showCasualtyFilterAll: false, // 是否完全展开伤亡信息筛选
                filterForm: {
                    /*** 警情信息筛选 ***/
                    jqbh: '', // 警情编号
                    paramJjsjFrom: '', // 接警时间 (起)
                    paramJjsjTo: '', // 接警时间 (止)
                    xzqydmSj: '', // 行政区域编码
                    jqfsdd: '', // 警情地址
                    sjlbdm: '', // 警情类型编码 (多)
                    jqtbzh: '', // 发送单位编码 (多)
                    hzm: '', // 单位名称/户主名
                    caseNbr: '', // 119案件编号
                    xfdwdm: '', // 出动队伍编码 (多)
                    zrqdddm: '', // 责任区大队编码 (多)
                    zzdw: '', // 主战队伍编码 (多)
                    /*** 伤亡信息筛选 ***/
                    swfl: '', // 伤亡情况
                    xm: '', // 人员姓名
                    xb: '', // 人员性别
                    sfzhm: '', // 身份证号码
                    rylbdm: '', // 人员身份
                    nlFrom: undefined, // 人员年龄范围 (起)
                    nlTo: undefined, // 人员年龄范围 (止)
                    position: '', // 人员职务
                    swyydm: '' // 致死伤原因
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
                // 人员伤亡可选项 (key是字典code)
                casualtyOptions: {
                    sys_user_sex: [], // 人员性别
                    tb_dic_swyy: [], // 致伤亡原因
                    tb_dic_rysfxx: [] // 人员身份
                },
                synchronizing: false, // 是否正在同步数据
                synchronizeTimestamp: '', // 数据同步时间
                resultSummary: {
                  ssbkry: '-',
                  czryss: '-',
                  cdcl: '-',
                  qqccjz: '-',
                  cdcsjl: '-',
                  cdjl: '-',
                  qjbkry: '-',
                  czrysw: '-'
                }, // 结果汇总
                resultList: [], // 结果列表
                total: 0, // 结果总数
                querying: false, // 是否正在查询
                listLoading: false, //列表正在查询
                downloading: false, // 是否正在下载
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
                selectDate:2
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
            selectArea(data) {
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
                this.listLoading = true;
                dataSearch.dispatchCasualtySearchList(this.queryParams).then(response => {
                    this.total = response.total || 0;
                    this.resultList = response.rows || [];
                }).finally(() => {
                    this.listLoading = false;
                });
            },
            // 获取汇总
            getSummary() {
                this.querying = true;
                dataSearch.dispatchCasualtySearchSummary(this.queryParams).then(response => {
                    if (response.data.length > 0) {
                        this.resultSummary = response.data[0];
                    }
                }).finally(() => {
                    this.querying = false;
                });
            },
            // 筛选查询
            query() {
                this.queryParams.pageNum = 1;
                for (const item in this.filterForm) {
                    if (this.filterForm[item]) {
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
                    paramJjsjFrom: this.filterForm.paramJjsjFrom, // 接警时间 (起)
                    paramJjsjTo: this.filterForm.paramJjsjTo, // 接警时间 (止)
                    xzqydmSj: '', // 行政区域编码
                    jqfsdd: '', // 警情地址
                    sjlbdm: '', // 警情类型编码 (多)
                    jqtbzh: '', // 发送单位编码 (多)
                    hzm: '', // 单位名称/户主名
                    caseNbr: '', // 119案件编号
                    xfdwdm: '', // 出动队伍编码 (多)
                    zrqdddm: '', // 责任区大队编码 (多)
                    zzdw: '', // 主战队伍编码 (多)
                    /*** 伤亡信息筛选 ***/
                    swfl: '', // 伤亡情况
                    xm: '', // 人员姓名
                    xb: '', // 人员性别
                    sfzhm: '', // 身份证号码
                    rylbdm: '', // 人员身份
                    nlFrom: undefined, // 人员年龄范围 (起)
                    nlTo: undefined, // 人员年龄范围 (止)
                    position: '', // 人员职务
                    swyydm: '' // 致死伤原因
                };
                this.selectedAreaLabel = ''; // 已选的行政区域名称
                this.selectedWarningTypeValue = []; // 已选的警情类型值
                this.selectedSenderLabel = ''; // 已选的发送单位名称
                this.selectedDispatchLabel = ''; // 已选的出动队伍名称
                this.selectedDutyLabel = ''; // 已选的责任区大队名称
                this.selectedMainForceLabel = ''; // 已选的主战队伍名称
                this.filterForm.paramJjsjFrom = getNearlyRecentDays()[0]; //初始化接警开始时间
                this.filterForm.paramJjsjTo = getNearlyRecentDays()[1]; //初始化接警结束时间
                this.selectDate = 2;
            },
            // 前往报表
            toReport() {
                sessionStorage.setItem('dataSearch_to_dataReport_params', JSON.stringify(this.filterForm));
                this.$router.push({path: '/eqw/dataReport', query: { rptSource: 'cd', isCzrysw: 1 }});
            },
            // 下载查询结果
            downloadResult() {
                this.downloading = true;
                const downloadParams = { ...this.queryParams };
                delete downloadParams.pageNum;
                delete downloadParams.pageSize;
                dataSearch.dispatchCasualtySearchDownload(downloadParams).then(response => {
                    downloadFile('出动伤亡查询-', response.data.stream);
                }).finally(() => {
                    this.downloading = false;
                });
            },
            // 查看详情
            toDetail({cdbh, shzt}) {
                this.$router.push({
                    name: '出动信息详情',
                    query: { cdbh, shzt }
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
              this.filterForm.paramJjsjFrom = datetimeFormat(new Date(start));
              this.filterForm.paramJjsjTo = datetimeFormat(new Date(end));
            }
        },
        created() {
            // 初始化伤亡人员筛选信息的可选项
            for (const dictCode in this.casualtyOptions) {
                this.getDicts(dictCode).then(response => {
                    this.casualtyOptions[dictCode] = response.data || [];
                });
            }
            // 初始化数据同步时间
            this.getSynchronizeTimestamp();
            this.filterForm.paramJjsjFrom = getNearlyRecentDays()[0]; //初始化接警开始时间
            this.filterForm.paramJjsjTo = getNearlyRecentDays()[1]; //初始化接警结束时间
        }
    }
</script>
