<template>
    <div class="app-container">
        <div v-if="show" class="page_zone">
            <div class="reporting-title">
                <h2>{{ $route.meta.title }}</h2>
            </div>
            <div class="content">
                <div class="search">
                    <!-- <h4 class="layout-small-title">自定义搜索</h4> -->
                    <el-form ref="searchForm" :model="form">
                        <el-row>
                            <el-col :span="7">
                                <el-form-item>
                                    <el-input v-model="form.zqbh" placeholder="火灾编号" clearable/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7">
                                <el-form-item>
                                    <el-input v-model="xzqyName" placeholder="行政区域" readonly @focus="openProvModal()">
                                        <i slot="suffix" class="iconfont icon-icon-test" @click="openProvModal()"/>
                                        <i
                                            slot="suffix"
                                            class="el-icon-circle-close"
                                            style="margin-left:5px; cursor: pointer;"
                                            @click="clearProvModal"
                                            v-show="xzqyName"
                                        />
                                    </el-input>
                                    <input v-model="form.xzqydmSj" type="hidden"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                               <date-time-range ref="dateTimeRange" :format="`date`" :isInit="initStatus" @selectTime="dateChange"></date-time-range>
                            </el-col>
                            <el-col :span="7">
                                <el-form-item>
                                    <el-input v-model="form.jqbh" placeholder="警情编号" clearable/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7">
                                <el-form-item>
                                    <el-input v-model="form.qhdd" placeholder="起火地点" clearable/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7">
                                <el-form-item>
                                    <el-input
                                        v-model="zrqdddmName"
                                        placeholder="责任区大队"
                                        :readonly="true"
                                        ref="dutyInput"
                                        @focus="openDutyModal"
                                        :disabled="isdeptLevel"
                                    >
                                        <i slot="suffix" class="iconfont icon-icon-test" @click="openDutyModal"
                                           v-show="isdepEvent"></i>
                                        <i slot="suffix" class="el-icon-circle-close"
                                           style="line-height:30px; cursor: pointer;" @click="cleanDutyModal"
                                           v-show="zrqdddmName"></i>
                                    </el-input>
                                    <input type="hidden" v-model="form.zrqdddm"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="3">
                                <el-button type="primary" @click="search">查&nbsp;询</el-button>
                            </el-col>
                            <el-col :span="7">
                                <el-form-item>
                                    <el-select v-model="form.qwhz" placeholder="轻微火灾" clearable>
                                        <el-option label="是" value="1"/>
                                        <el-option label="否" value="0"/>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7">
                                <el-form-item>
                                    <el-input v-model="qhw" placeholder="起火物" @focus="openQhwMul" clearable>
                                        <i slot="suffix" class="iconfont icon-icon-test" @click="openQhwMul"/>
                                        <i
                                            slot="suffix"
                                            class="el-icon-circle-close"
                                            style="margin-left:5px; cursor: pointer;"
                                            @click="clearQhwMul"
                                            v-show="qhw"
                                        />
                                    </el-input>
                                    <input v-model="form.qhwfldm" type="hidden"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7">
                                <el-form-item>
                                    <el-input v-model="hzyyname" placeholder="起火原因" @focus="openQhyyMul">
                                        <i slot="suffix" class="iconfont icon-icon-test" @click="openQhyyMul"/>
                                        <i
                                            slot="suffix"
                                            class="el-icon-circle-close"
                                            style="margin-left:5px; cursor: pointer;"
                                            @click="clearQhyyMul"
                                            v-show="hzyyname"
                                        />
                                    </el-input>
                                    <input v-model="form.hzyyfldm" type="hidden"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="3">
                                <el-button @click="resetForm">重&nbsp;置</el-button>
                            </el-col>
                            <el-col :span="7" v-if="activeName==='first'">
                                <el-form-item>
                                    <el-select v-model="form.shzt" placeholder="报告状态" clearable>
                                        <el-option
                                            v-for="item in option2"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                        />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="14">
                                <el-form-item>
                                  <el-select style="width:103.6%;"
                                      v-model="tagValue"
                                      multiple
                                      filterable
                                      default-first-option
                                      placeholder="请选择火灾标签">
                                      <el-option
                                        v-for="item in tagOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                      </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="3" v-show="tableData01.length>0 && activeName==='first' && form.ksrq && form.jsrq">
                                <el-button type="primary" @click="downloadResult()" :loading="downloadLoading">导&nbsp;出</el-button>
                            </el-col>
                            <el-col :span="3" v-show="tableData02.length>0 && activeName==='second' &&form.ksrq && form.jsrq">
                                <el-button type="primary" @click="downloadResult()" :loading="downloadLoading">导&nbsp;出</el-button>
                            </el-col>
                            
                            <!-- <el-col :span="7">
                              <el-form-item>
                                  <el-select v-model="form.ydwcd" placeholder="是否出动" clearable>
                                      <el-option label="是" value="0"/>
                                      <el-option label="否" value="1"/>
                                  </el-select>
                              </el-form-item>
                            </el-col> -->
                        </el-row>
                    </el-form>
                </div>
            </div>
            <el-tabs v-model="activeName" type="card" style="width:100%">
                <el-tab-pane label="火灾填报超时" name="first">
                    <el-table
                        v-loading="loading01"
                        :data="tableData01"
                        style="width: 100%;margin-top: 14px;"
                        @sort-change="tableSortChangeHandle"
                        :default-sort="{prop: 'tbsj', order: 'descending'}"
                        :empty-text="querydata01 == true ? '点击按钮查询':'暂无数据'"
                    >
                        <el-table-column
                            prop="zqbh"
                            label="火灾编号"
                            width="150"
                            sortable
                            show-overflow-tooltip
                        />
                        <el-table-column
                            prop="jqbh"
                            label="警情编号"
                            width="150"
                            sortable
                            show-overflow-tooltip
                        />
                        <!--  :formatter="dateFormat" -->
                        <el-table-column
                            prop="zqsj"
                            label="起火时间"
                            sortable
                            width="150"
                            show-overflow-tooltip
                        />
                        <el-table-column
                            prop="xzqydmsj"
                            label="行政区域"
                            width="150"
                            sortable
                        />
                        <el-table-column prop="jqfsdd" label="警情地址" width="140" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <div>{{ scope.row.jqfsdd || '-' }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="qwhz" label="轻微火灾" width="100" sortable>
                            <template slot-scope="scope">
                                <div v-if="scope.row.qwhz == 0" class="pic">否</div>
                                <div v-if="scope.row.qwhz == 1" class="pic">是</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="qhcslb" label="起火场所" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <div>{{ scope.row.qhcslb || '-' }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="qhwfldm" label="起火物" show-overflow-tooltip/>
                        <el-table-column prop="hzyyfldm" label="起火原因" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <div>{{ scope.row.hzyyfldm || '-' }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="num" label="伤亡情况" width="80" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <div>{{ scope.row.swnum }}死{{ scope.row.ssnum }}伤</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="tbsj"
                            label="填报时间"
                            sortable
                            width="150"
                            show-overflow-tooltip
                        />
                        <el-table-column
                            prop="zrqddName"
                            label="责任区大队"
                            width="100"
                            :show-overflow-tooltip="true"
                        />
                        <el-table-column
                            prop="shzt"
                            label="报告状态"
                            width="100"
                            sortable
                            show-overflow-tooltip
                        >
                            <template slot-scope="scope">
                                <div v-if="scope.row.shzt == 0" class="pic">
                                    <img src="@/views/icons/weisongshen.svg"/>待填报
                                </div>
                                <div v-if="scope.row.shzt == 1" class="pic">
                                    <img src="@/views/icons/shenpizhong.svg"/>审核中
                                </div>
                                <div v-if="scope.row.shzt == 2" class="pic">
                                    <img src="@/views/icons/yishenpi.svg"/>已审核
                                </div>
                                <div v-if="scope.row.shzt == -1" class="pic">
                                    <img src="@/views/icons/beizhongzhi.svg"/>待修改
                                </div>
                                <div v-if="scope.row.shzt == -2" class="pic">
                                    <img src="@/views/icons/tuihui.svg"/>被退回
                                </div>
                                <div v-if="scope.row.shzt == -3" class="pic">
                                    <img src="@/views/icons/daiwanshan.svg"/>待完善
                                </div>
                                <div v-if="scope.row.shzt == 99" class="pic">
                                    <img src="@/views/icons/yiguidang.svg"/>已归档
                                </div>
                                <div v-if="scope.row.shzt == 4" class="pic">
                                    <img src="@/views/icons/bohui.svg"/>被驳回
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="130">
                            <template slot-scope="scope">
                                <el-button type="text" size="mini" @click="handleEdit(scope.row)">详情</el-button>
                                <!-- <el-button
                                size="mini"
                                type="text"
                                :disabled="!(scope.row.shzt == -2 || scope.row.shzt == -1 || scope.row.shzt == -3)"
                                @click="handleEditData(scope.row)"
                                >修改</el-button>
                                <el-button
                                size="mini"
                                type="text"
                                :disabled="!(scope.row.shzt == 0 || scope.row.shzt == -1)"
                                @click="handleDelete(scope.row.zqbh)"
                                >删除</el-button>-->
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- 分页 -->
                    <div class="pagination_zone">
                        <pagination
                            v-show="queryParams.total01>0"
                            :total="queryParams.total01"
                            :page.sync="queryParams.pageNum01"
                            :limit.sync="queryParams.pageSize01"
                            @pagination="getList01"
                        />
                        <!-- <el-pagination
                            background
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-sizes="pageSizes"
                            :page-size="form.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total"
                        ></el-pagination>-->
                    </div>
                </el-tab-pane>
                <el-tab-pane label="火灾审核超时" name="second">
                    <el-table
                        v-loading="loading02"
                        :data="tableData02"
                        style="width: 100%;margin-top: 14px;"
                        @sort-change="tableSortChangeHandle"
                        :default-sort="{prop: 'tbsj', order: 'descending'}"
                        :empty-text="querydata02 == true ? '点击按钮查询':'暂无数据'"
                    >
                        <el-table-column
                            prop="zqbh"
                            label="火灾编号"
                            width="150"
                            sortable
                            show-overflow-tooltip
                        />
                        <el-table-column
                            prop="jqbh"
                            label="警情编号"
                            width="150"
                            sortable
                            show-overflow-tooltip
                        />
                        <!--  :formatter="dateFormat" -->
                        <el-table-column
                            prop="zqsj"
                            label="起火时间"
                            sortable
                            width="150"
                            show-overflow-tooltip
                        />
                        <el-table-column
                            prop="xzqydmsj"
                            label="行政区域"
                            width="150"
                            sortable
                        />
                        <el-table-column prop="zqdd" label="警情地址" width="140" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <div>{{ scope.row.zqdd || '-'}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="qwhz" label="轻微火灾" width="100" sortable>
                            <template slot-scope="scope">
                                <div v-if="scope.row.qwhz == 0" class="pic">否</div>
                                <div v-if="scope.row.qwhz == 1" class="pic">是</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="qhcslb" label="起火场所" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <div>{{ scope.row.qhcslb || '-' }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="qhwfldm" label="起火物" show-overflow-tooltip/>
                        <el-table-column prop="hzyyfldm" label="起火原因" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <div>{{ scope.row.hzyyfldm || '-' }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="num" label="伤亡情况" width="80" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <div>{{ scope.row.swnum }}死{{ scope.row.ssnum }}伤</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="tbsj"
                            label="填报时间"
                            sortable
                            width="150"
                            show-overflow-tooltip
                        />
                        <el-table-column
                            prop="zrqddName"
                            label="责任区大队"
                            width="100"
                            :show-overflow-tooltip="true"
                        />
                        <el-table-column
                            prop="shzt"
                            label="报告状态"
                            width="100"
                            sortable
                            show-overflow-tooltip
                        >
                            <template slot-scope="scope">
                                <div v-if="scope.row.shzt == 0" class="pic">
                                    <img src="@/views/icons/weisongshen.svg"/>待填报
                                </div>
                                <div v-if="scope.row.shzt == 1" class="pic">
                                    <img src="@/views/icons/shenpizhong.svg"/>审核中
                                </div>
                                <div v-if="scope.row.shzt == 2" class="pic">
                                    <img src="@/views/icons/yishenpi.svg"/>已审核
                                </div>
                                <div v-if="scope.row.shzt == -1" class="pic">
                                    <img src="@/views/icons/beizhongzhi.svg"/>待修改
                                </div>
                                <div v-if="scope.row.shzt == -2" class="pic">
                                    <img src="@/views/icons/tuihui.svg"/>被退回
                                </div>
                                <div v-if="scope.row.shzt == -3" class="pic">
                                    <img src="@/views/icons/daiwanshan.svg"/>待完善
                                </div>
                                <div v-if="scope.row.shzt == 99" class="pic">
                                    <img src="@/views/icons/yiguidang.svg"/>已归档
                                </div>
                                <div v-if="scope.row.shzt == 4" class="pic">
                                    <img src="@/views/icons/bohui.svg"/>被驳回
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="130">
                            <template slot-scope="scope">
                                <el-button type="text" size="mini" @click="handleEdit(scope.row)">详情</el-button>
                                <!-- <el-button
                                size="mini"
                                type="text"
                                :disabled="!(scope.row.shzt == -2 || scope.row.shzt == -1 || scope.row.shzt == -3)"
                                @click="handleEditData(scope.row)"
                                >修改</el-button>
                                <el-button
                                size="mini"
                                type="text"
                                :disabled="!(scope.row.shzt == 0 || scope.row.shzt == -1)"
                                @click="handleDelete(scope.row.zqbh)"
                                >删除</el-button>-->
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- 分页 -->
                    <div class="pagination_zone">
                        <pagination
                            v-show="queryParams.total02>0"
                            :total="queryParams.total02"
                            :page.sync="queryParams.pageNum02"
                            :limit.sync="queryParams.pageSize02"
                            @pagination="getList02"
                        />
                        <!-- <el-pagination
                            background
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-sizes="pageSizes"
                            :page-size="form.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total"
                        ></el-pagination>-->
                    </div>
                </el-tab-pane>
            </el-tabs>

            
        </div>
        <!-- 详情 -->
        <detail v-else :propfrom="propfrom" @back="toggle"/>
        <!-- 行政区域 -->
        <provModal ref="provModal" @setProv="setProvValue"/>
        <modal ref="modal1" :type="types.type1" @setVal="setValue1"/>
        <modal ref="modal2" :type="types.type2" @setVal="setValue2"/>
        <modal ref="modal3" :type="types.type3" @setVal="setValue3"/>
        <zrModal ref="zrModal" @setVal="setDutyValue"></zrModal>
    </div>
</template>

<script>
    // import detail from './components/detail'
    import modal from "@/views/components/searchModal/modal";
    import detail from "@/views/data/entry/zqxx/components/disasterInfomation";
    import {
      targetNameTarget
    } from "@/api/system/dict/target";
    // 责任区大队
    import zrModal from "@/views/components/dataSeach/modal";
    // 地区选择
    import provModal from "@/views/data/entry/jqxx/components/provModal";
    import {formatterDate} from "@/utils/index";
    import {getNearlyRecentDays} from "@/utils/dateTimeUtils.js";
    import {
        getHjlb,
        queryDeptHisData,
        lszqscList,
        queryHzxxByTime,
        queryHzxxAuditByTime
        // getQhcs,
        // lszqDetailList,
        // getFirePlaceOptions,
        // getFireObjectOptions,
        // getFireReasonOptions
    } from "@/api/data/entry/zqxx";
    import {hzxxByTimeDownload, hzxxAuditByTimeDownload} from "@/api/data/entry/jqxx";
    import {getInfo} from '@/api/login';
    import dateTimeRange from "@/views/components/dateTime/dateTimeRange.vue"
    import { downloadFile } from '@/utils/download-file';

    export default {
        name: "fireTimerangeList",
        components: {
            detail,
            modal,
            provModal,
            zrModal,
            dateTimeRange
        },
        data() {
            return {
                activeName: 'first',
                //初始显示
                querydata01:true,
                querydata02:true,
                downloadLoading:false,//控制导出按钮loading
                // 模态框字典类别
                types: {
                    type1: "",
                    type2: "qhw",
                    type3: "qhyy"
                },
                hzyyname: "",
                qhw: "",
                qhcsname: "",
                option: [],
                option1: [
                    {
                        value: "Y",
                        label: "有"
                    },
                    {
                        value: "N",
                        label: "无"
                    }
                ],
                option2: [
                    {
                        value: '0',
                        label: '待填报'
                    },
                    {
                        value: "1",
                        label: "审核中"
                    },
                    {
                        value: "2",
                        label: "已审核"
                    },
                    {
                        value: "-1",
                        label: "待修改"
                    },
                    {
                        value: "-2",
                        label: "被退回"
                    },
                    {
                        value: "-3",
                        label: "待完善"
                    },
                    {
                        value: "4",
                        label: "被驳回"
                    }
                ],
                zqsj: "",
                option3: [],
                option4: [],
                option5: [],
                xzqydmName: "",
                form: {
                    zqbh: "",
                    xzqydmSj: "",
                    zqdd: "",
                    // 火警类别
                    jqdj: "",
                    // 起火时间
                    // zqsj: "",
                    // 起火地点
                    qhdd: "",
                    // 起火场所
                    qhcslb: "",
                    // 起火物
                    qhwfldm: "",
                    // 起火原因
                    hzyyfldm: "",
                    // 人员伤亡
                    qwhz: "",
                    // 报告状态
                    shzt: "",
                    ksrq: "", //查询开始日期
                    jsrq: "", //查询结束日期
                    params: {
                        beginTime: "",
                        endTime: "",
                        // 依据排序的属性名称（从 table 返回的数据中获取）
                        sortField: "tbsj",
                        sortOrder: "desc"
                    },
                    // 警情编号
                    jqbh: "",
                    // 责任区大队代码
                    zrqdddm: "",
                    ydwcd: "0" //是否未出动火灾
                },
                zrqdddmName: "", //责任区大队名称
                tableData01: [],
                tableData02: [],
                // 详情开关
                show: true,
                // loading层
                loading01: false,
                loading02: false,
                // zqbh
                curzqbh: "",
                queryParams: {
                    total01: 0,
                    pageNum01: 1,
                    pageSize01: 10,
                    total02: 0,
                    pageNum02: 1,
                    pageSize02: 10
                },
                props: {
                    lazy: true,
                    lazyLoad: this.lazyLoad,
                    children: "children",
                    label: "dictLabel",
                    value: "dictValue",
                    isLeaf: "isLeaf",
                    // 是否返回由该节点所在的各级菜单的值所组成的数组
                    emitPath: false
                },
                propfrom: {
                    state: true, // 是否显示警情头部信息
                    jqbh: "", // 警情编号
                    zqlbdm: "", // 火灾编号
                    zqbh: "",
                    jqfsdd: "", // 警情发生地点
                    // 类型 0填报 1审核 2草稿修改
                    type: "1",
                    qwhz: "1",
                    isNotEdit: true // 判断当前是否是编辑态
                },
                xzqyName: "", // 行政区域名称
                isdeptLevel: false,
                isdepEvent: true,
                tagOptions: [],
                tagValue: [],
                list: [],
                loading1: false,
                initStatus:false

            };
        },
        created() {
            this.form.ksrq = getNearlyRecentDays(30)[0].substr(0,10);
            this.form.jsrq = getNearlyRecentDays(30)[1].substr(0,10);
            if(this.$route.query.shzt){
              this.form.shzt = this.$route.query.shzt;
              this.form.ksrq = "";
              this.form.jsrq = "";
              this.initStatus = true;
              this.$router.push({query:{}});
            }
            // this.search();
            // 字段数据
            this.getOptions();
            getInfo().then(response => {
                if (response.code === 200) {
                    if (response.user.dept.deptLevel >= 5) {
                        this.isdeptLevel = true;
                        this.isdepEvent = false;
                    } else {
                        this.isdeptLevel = false;
                        this.isdepEvent = true;
                    }
                }
            })
          this.getAllTag();
        },
        watch: {
            '$route' (to, from) {
              if(from.name == 'Index' && this.$route.query.shzt){
                this.form.ksrq = "";
                this.form.jsrq = "";
                this.initStatus = true;
                // 新增一个是否有从首页跳转过来的审核状态字段 shzt
                this.form.shzt = this.$route.query.shzt;
                this.search();
                this.$router.push({query:{}});
              }else{
                this.initStatus = false;
              }
            }
        },
        methods: {
          downloadResult(){//导出列表
            this.downloadLoading = true

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
                if(this.activeName==='first'){
                    hzxxByTimeDownload(params).then(response => {
                        console.log(response);
                        downloadFile(`火灾填报超时(${this.form.ksrq}至${this.form.jsrq})`, response.data.stream);
                    }).finally(() => {
                        this.downloadLoading = false
                    });
                }else if(this.activeName==='second'){
                    hzxxAuditByTimeDownload(params).then(response => {
                        console.log(response);
                        downloadFile(`火灾审核超时(${this.form.ksrq}至${this.form.jsrq})`, response.data.stream);
                    }).finally(() => {
                        this.downloadLoading = false
                    });
                }
               
          },
          getAllTag() {
            let _params = {
              "tagName": "",
              "tagType": "Z"
            }
            targetNameTarget(_params).then(res=>{
              this.tagOptions = res.data.map(item=> {
                return {
                  label: item.tagName,
                  value: item.tagId
                }
              });
            });
          },
            // 清空行政区域
            clearProvModal() {
                this.form.xzqydmSj = this.xzqyName = "";
            },
            // 清空起火场所
            clearQhcsMul() {
                this.form.qhcslb = this.qhcsname = "";
            },
            // 清空起火物
            clearQhwMul() {
                this.form.qhwfldm = this.qhw = "";
            },
            // 清空起火原因
            clearQhyyMul() {
                this.form.hzyyfldm = this.hzyyname = "";
            },
            // 起火场所模态框显示
            openQhcsMul() {
                this.$refs.modal1.toggle();
                this.$refs.modal1.echo(this.form.qhcslb);
            },
            // 接收起火场所数据
            setValue1(item) {
                this.form.qhcslb = item[0].dictValue;
                this.qhcsname = item[0].dictLabel;
            },

            openQhwMul() {
                this.$refs.modal2.toggle();
                this.$refs.modal2.echo(this.form.qhwfldm);
            },
            // 接受起火物数据
            setValue2(item) {
                this.form.qhwfldm = item[0].dictValue;
                this.qhw = item[0].dictLabel;
            },

            // 起火原因的模态框,并回显
            openQhyyMul() {
                this.$refs.modal3.toggle();
                this.$refs.modal3.echo(this.form.hzyyfldm);
            },

            // 接受起火原因数据
            setValue3(item) {
                this.form.hzyyfldm = item[0].dictValue;
                this.hzyyname = item[0].dictLabel;
            },
            // 修改
            handleEditData(val) {
                this.$router.push({
                    path: "/dataEntry/modify",
                    query: {
                        zqbh: val.zqbh,
                        jqbh: val.jqbh,
                        qwhz: val.qwhz
                    }
                });
            },
            // 详情页
            handleEdit(item) {
                // console.log(item);
                // this.propfrom.zqbh = item.zqbh;
                // this.propfrom.jqbh = item.jqbh;
                // this.toggle();
                // this.$router.push({
                //   path: "/dataEntry/lshzxq",
                //   query: {
                //     zqbh: item.zqbh,
                //     jqbh: item.jqbh,
                //     qwhz: item.qwhz
                //   }
                // });
                this.$router.push({
                    path: "/showDetail/jqxxShowDetail",
                    query: {
                        jqbh: item.jqbh
                    }
                });
            },
            // 开关
            toggle() {
                this.show = !this.show;
            },
            // 删除
            handleDelete(index) {
                this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        lszqscList({zqbh: index}).then(res => {
                            if (res.code == 200) {
                                this.$message({
                                    type: "success",
                                    message: "删除成功!"
                                });
                                this.search();
                            }
                        });
                    })
                    .catch(() => {
                        this.$message({
                            type: "info",
                            message: "已取消删除"
                        });
                    });
            },
            // 分页
            getList01(val) {
                const {limit, page} = val;
                this.search();
            },
            getList02(val) {
                const {limit, page} = val;
                this.search();
            },
            // 获取火警类别options
            getOptions() {
                getHjlb({
                    dictType: "tb_dic_zqdj",
                    parentValue: ""
                }).then(res => {
                    this.option = res.data;
                });
            },
            // 查询
            search() {
                const $this = this;
                if (this.activeName === 'first'){
                    $this.loading01 = true;
                    // 组装数据
                    let params = {...$this.form};
                    let {pageNum01, pageSize01} = this.queryParams;
                    params.pageNum = pageNum01;
                    params.pageSize = pageSize01;
                    if(this.tagValue) {
                        this.form.tagIds = this.tagValue.join(",");
                    } else {
                        this.form.tagIds = "";
                    }
                    params.params.beginTime = $this.form.ksrq;
                    params.params.endTime = $this.form.jsrq;

                    // 新增一个是否是从首页跳转过来的字段 pageFlag = 1
                    // params.pageFlag = this.$route.query.pageFlag;

                    queryHzxxByTime(params).then(res => {
                        // console.log(res);
                        this.loading01 = false;
                        this.queryParams.total01 = res.total;
                        this.tableData01 = res.rows;
                        // console.log("----",this.tableData);
                        if(this.tableData01.length == 0){
                            this.querydata01 = false;
                        }
                        console.log(this.tableData01)
                    });
                }else if(this.activeName === 'second'){
                    $this.loading02 = true;
                    // 组装数据
                    let params = {...$this.form};
                    let {pageNum02, pageSize02} = this.queryParams;
                    params.pageNum = pageNum02;
                    params.pageSize = pageSize02;
                    if(this.tagValue) {
                        this.form.tagIds = this.tagValue.join(",");
                    } else {
                        this.form.tagIds = "";
                    }
                    params.params.beginTime = $this.form.ksrq;
                    params.params.endTime = $this.form.jsrq;

                    // 新增一个是否是从首页跳转过来的字段 pageFlag = 1
                    // params.pageFlag = this.$route.query.pageFlag;

                    queryHzxxAuditByTime(params).then(res => {
                        // console.log(res);
                        this.loading02 = false;
                        this.queryParams.total02 = res.total;
                        this.tableData02 = res.rows;
                        // console.log("----",this.tableData);
                        if(this.tableData02.length == 0){
                            this.querydata02 = false;
                        }
                        console.log(this.tableData02)
                    });
                }
                
            },
            // 重置按钮回调
            resetForm() {
                this.form = {
                    zqbh: "",
                    xzqydmSj: "",
                    zqdd: "",
                    // 火警类别
                    jqdj: "",
                    // 起火时间
                    zqsj: "",
                    // 起火地点
                    qhdd: "",
                    // 起火场所
                    qhcslb: "",
                    // 起火物
                    qhwfldm: "",
                    // 起火原因
                    hzyyfldm: "",
                    // 人员伤亡
                    isSw: "",
                    // 报告状态
                    shzt: "",
                    pageNum: 1,
                    pageSize: 10,
                    ksrq: "", //查询开始日期
                    jsrq: "", //查询结束日期
                    params: {
                        beginTime: "",
                        endTime: "",
                        // 依据排序的属性名称（从 table 返回的数据中获取）
                        sortField: "tbsj",
                        sortOrder: "desc"
                    },
                    // 警情编号
                    jqbh: "",
                    // 责任区大队代码
                    zrqdddm: "",
                    ydwcd: "0" //是否未出动火灾
                };
                this.xzqyName = "";
                this.qhcsname = "";
                this.hzyyname = "";
                this.qhw = "";
                this.zrqdddmName = ""; //责任区大队名称
                // this.search();
                this.$refs.dateTimeRange.clear();
            },
            // 前端处理时间格式
            dateFormat(row, column, cellValue, index) {
                var date = row[column.property];
                return formatterDate(date);
            },
            // 打开行政区域的模态框
            openProvModal() {
                this.$refs.provModal.toggle();
            },
            setProvValue(obj, {first, second, third, last}) {
                this.form.xzqydmSj = obj.id;
                this.xzqyName = `${first} ${second} ${third} ${last}`;
            },
            paramTimeChange(val) {
                let nowChangeGettime = new Date(val).getTime();
                if (this.form.ksrq && this.form.jsrq) {
                    let ksrqGettime = new Date(this.form.ksrq).getTime();
                    let jsrqGettime = new Date(this.form.jsrq).getTime();
                    if (ksrqGettime > jsrqGettime) {
                        this.$message.warning("开始时间不能大于结束时间");
                        if (nowChangeGettime == ksrqGettime) {
                            //如果当前选的是开始时间，开始时间恢复到初始时间
                            this.form.ksrq = getNearlyRecentDays(30)[0].substr(0,10); // 接警起止时间
                        } else if (nowChangeGettime == jsrqGettime) {
                            //如果当前选的是结束时间，结束时间恢复到初始时间
                            this.form.jsrq = getNearlyRecentDays(30)[1].substr(0,10); // 接警截止时间
                        }
                    }
                }
            },
            /**
             * 表格 单列排序改变回调
             */
            tableSortChangeHandle({column, prop, order}) {
                if (prop && order) {
                    const dictionaries = {
                        ascending: "asc",
                        descending: "desc"
                    };
                    // 特殊字段进行处理
                    if (prop === "xzqydmsj") {
                        prop = "xzqydm";
                    }
                    // 转换数据
                    this.form.params.sortField = prop;
                    this.form.params.sortOrder = dictionaries[order];
                    // this.search();
                }
            },
            //打开责任大区模态框 并 回显
            openDutyModal() {
                this.$refs.zrModal.echo(this.zrqdddmName);
                this.$refs.zrModal.toggle();
            },
            // 将树形中的值赋值给责任大区 input id 付给hidden input
            setDutyValue(data) {
                this.form.zrqdddm = data.deptId;
                this.zrqdddmName = data.deptName;
                this.$refs.dutyInput.focus();
                this.$refs.dutyInput.blur();
            },
            cleanDutyModal() {
                this.form.zrqdddm = "";
                this.zrqdddmName = "";
            },
            dateChange(data) {
              this.form.ksrq = data.ksrq;
              this.form.jsrq = data.jsrq;
            }
        }
    };
</script>

<style lang="stylus" scoped>
    .app-container
        .reporting-title
            h2
                background-image url('~@/views/data/entry/zqxx/image/lszqxx.png')
                background-repeat no-repeat
                background-position 0 50%
                background-size 23px
        .content
            .search
                h4
                    font-size 16px
                .el-row
                    .el-col
                        height 50px
                        .el-form-item
                            width 93%
                            height 32px
                            line-height 32px
                            .el-input, .el-select
                                width 100%
                        .divIncludeTime
                            line-height 32px
                            position relative
                            display inline-block
                            .line
                                text-align center

    .pic
        position relative
        padding-left 18px

    .pic img
        width 14px
        height 14px
        position absolute
        left 0px
        top 4px

    .pagination_zone
        margin-top 20px
        text-align right

    .none
        cursor not-allowed
</style>
