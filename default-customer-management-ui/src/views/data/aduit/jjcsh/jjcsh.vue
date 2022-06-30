<template>
    <div class="app-container">
        <div v-show="!show && !hzShow" class="page_zone">
            <div class="reporting-title">
                <h2>{{ '审核列表'}}</h2>
                <!-- <div class="update_time" style="margin-top:8px">数据更新至 <span style="color:red">{{updateTime}}</span></div> -->
            </div>
            

            <div class="content">
                <div class="search_zone">
                    <!-- <h4 class="layout-small-title">自定义搜索</h4> -->
                    <el-form ref="searchForm" :model="form">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item>
                                    <el-input
                                        v-model="form.jqfsdd"
                                        placeholder="警情地址"
                                        clearable
                                        @keyup.enter.native="searchTableDataHandle"
                                    />
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item>
                                    <el-cascader
                                        ref="cascader"
                                        v-model="form.sjlbdm"
                                        :props="props"
                                        placeholder="警情类型"
                                        clearable
                                    />
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item>
                                    <el-input v-model="form.xzqyName" placeholder="行政区域" readonly @focus="openProvModal()">
                                        <i
                                            slot="suffix"
                                            class="iconfont icon-icon-test"
                                            style="line-height:32px;"
                                            @click="openProvModal()"
                                        />
                                        <i
                                            slot="suffix"
                                            v-show="form.xzqyName"
                                            class="el-icon-circle-close"
                                            style="margin-left:5px;cursor: pointer;"
                                            @click="cleanProvModal"
                                        />
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
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
                            <el-col :span="16">
                              <date-time-range ref="dateTimeRange" :format="`date`" @selectTime="dateChange"></date-time-range>
                            </el-col>
                            <!-- <el-col :span="7">
                                <el-form-item>
                                    <el-input v-model="form.xzqyName" placeholder="行政区域" readonly @focus="openProvModal()">
                                        <i
                                            slot="suffix"
                                            class="iconfont icon-icon-test"
                                            style="line-height:32px;"
                                            @click="openProvModal()"
                                        />
                                        <i
                                            slot="suffix"
                                            v-show="form.xzqyName"
                                            class="el-icon-circle-close"
                                            style="margin-left:5px;cursor: pointer;"
                                            @click="cleanProvModal"
                                        />
                                    </el-input>
                                </el-form-item>
                            </el-col> -->
                            <el-col :span="2">
                                <el-button @click="resetForm">重&nbsp;置</el-button>
                            </el-col>
                            <el-col :span="2">
                                <el-button type="primary" @click="searchTableDataHandle(),searchTableDataHandle2()">查&nbsp;询</el-button>
                            </el-col>
                            <!-- <el-col :span="2">
                                <el-button type="success" @click="synchronization" :loading="synchronizationLoading">同&nbsp;步</el-button>
                            </el-col> -->
                            <!-- <el-col :span="7">
                                <el-form-item>
                                    <el-select
                                        v-model="tagValue"
                                        multiple
                                        filterable
                                        default-first-option
                                        placeholder="请选择警情标签">
                                        <el-option
                                          v-for="item in tagOptions"
                                          :key="item.value"
                                          :label="item.label"
                                          :value="item.value">
                                        </el-option>
                                      </el-select>
                                </el-form-item>
                            </el-col> -->
                            <!-- <el-col :span="7">
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
                            </el-col> -->
                        </el-row>
                    </el-form>
                </div>

                <el-tabs v-model="activeName" type="card">
                    <el-tab-pane label="终止审核" name="first">
                        <div class="table_zone">
                            <el-table
                                v-loading="loading"
                                :data="tableData"
                                style="width: 100%"
                                @sort-change="tableSortChangeHandle"
                                :default-sort="{prop: 'tbsj', order: 'descending'}"
                                :row-class-name="tableRowClassName"
                            >
                                <el-table-column type="expand">
                                    <template slot-scope="props">
                                        <el-table :data="props.row.jlist" style="width: 100%" :show-header="false">
                                            <el-table-column prop="xfdwlx" label="出动队伍伍类型">
                                                <template slot-scope="scope">
                                                    <div :class="checkType(scope.row.xfdwlx)">{{ scope.row.xfdwlx }}</div>
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="xfdwmc" label="出动队伍伍名称"/>
                                            <el-table-column prop="zjxgsj" label="完成时间" width="200">
                                                <template slot-scope="scope">
                                                    <div>{{ scope.row.zjxgsj || '完成时间：-'}}</div>
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="trll" label="投入力量"/>
                                            <el-table-column prop="shzt" label="报告状态">
                                                <template slot-scope="scope">
                                                    <!-- 判断状态码 除了 2 和 99 其他全部是红色标记 -->
                                                    <div
                                                        :class="(scope.row.shzt != 2 && scope.row.shzt != 99) ? 'dot dot_error' : 'dot dot_success'"
                                                    >{{ formatShzt(scope.row.shzt) }}
                                                    </div>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="操作" width="100">
                                                <template slot-scope="scope">
                                                    <el-link
                                                        v-if="scope.row.cdbh"
                                                        type="primary"
                                                        @click="handleEdit(scope.row)"
                                                    >详情
                                                    </el-link>
                                                    <!-- <el-link type="primary" disabled>删除</el-link> -->
                                                    <!-- <el-button type="text" size="mini" @click="handleDelete(scope.row)">删除</el-button> -->
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="jqbh" label="接处警编号" min-width="13%" sortable :show-overflow-tooltip="true"/>
                                <!-- <el-table-column prop="jqbh" label="序号" width="180"></el-table-column> -->
                                <el-table-column
                                    label="接警时间"
                                    sortable
                                    :show-overflow-tooltip="true"
                                    min-width="13%"
                                    prop="jjsj">
                                    <template slot-scope="props">
                                        {{props.row.jjsj | formatDate}}
                                    </template>
                                </el-table-column
                                >
                                <!-- <el-table-column
                                    prop="xzqydm"
                                    label="行政区域"
                                    sortable="custom"
                                    width="150"
                                /> -->
                                <el-table-column prop="xzqymc" label="行政区域" :show-overflow-tooltip="true" min-width="8%"/>
                                <el-table-column prop="jqfsdd" label="警情地址" :show-overflow-tooltip="true" min-width="10%"/>
                                <el-table-column prop="sjlbmc" label="警情类型" :show-overflow-tooltip="true" min-width="9%"/>
                                <!-- <el-table-column
                                    prop="sjlbmc"
                                    label="警情类型"
                                    sortable="custom"
                                    :show-overflow-tooltip="true"
                                /> -->
                                <!-- <el-table-column prop="zzxfdw" label="主战队伍" align="left" /> -->
                                <el-table-column prop="zrqddmc" label="责任区大队" width="100" :show-overflow-tooltip="true" min-width="13%"/>
                                <!-- <el-table-column prop="zrqdddm" label="责任区编码" width="100"  :show-overflow-tooltip="true" min-width="13%"/> -->
                                <!-- <el-table-column
                                    prop="tbsj"
                                    label="同步时间"
                                    min-width="13%"
                                    sortable="custom"
                                    show-overflow-tooltip
                                /> -->
                                <el-table-column
                                    label="提交审核时间"
                                    sortable
                                    :show-overflow-tooltip="true"
                                    min-width="13%"
                                    prop="finishDate2">
                                    <template slot-scope="props">
                                        {{props.row.finishDate2}}
                                    </template>
                                </el-table-column
                                >
                                <el-table-column
                                    label="终止原因"
                                    sortable
                                    :show-overflow-tooltip="true"
                                    min-width="10%"
                                    prop="issueType2">
                                    <template slot-scope="props">
                                        {{props.row.issueType2}}
                                    </template>
                                </el-table-column
                                >
                                <el-table-column
                                    label="案件状态"
                                    sortable
                                    :show-overflow-tooltip="true"
                                    min-width="10%"
                                    prop="ajzt">
                                    <template slot-scope="props">
                                        {{props.row.ajzt}}
                                    </template>
                                </el-table-column>
                                <!-- <el-table-column prop="jqmc" label="警情名称" width="500" align="left" show-overflow-tooltip /> -->
                                <!-- <el-table-column label="出动报告" width="110" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <div
                                            :class="!scope.row.cdxxtb.includes('全部')? 'dot dot_error':'dot dot_success'"
                                        >{{ scope.row.cdxxtb }}
                                        </div>
                                    </template>
                                </el-table-column> -->
                                <!-- <el-table-column prop="zqxxtb" label="火灾报告" width="110" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        首先判断是否为 火灾扑救 类型，其次状态的文本是否是 未完成 -->
                                        <!-- <div
                                            v-if="scope.row.sjlbdm.slice(0,2) == '01' || scope.row.sjlbdm == '070400000000'"
                                            :class="scope.row.zqxxtb.includes('未完成') ? 'dot dot_error':'dot dot_success'"
                                        >{{ scope.row.zqxxtb }}
                                        </div>
                                    </template>
                                </el-table-column> --> -->
                                <el-table-column label="操作" min-width="12%">
                                    <template slot-scope="scope">
                                        <!-- <el-button type="text" size="mini" @click="checkDetail(scope.row)">查看</el-button> -->
                                        <!-- 2022/2/16注释 -->
                                        <!-- <el-button type="text" size="mini" @click="editDetail(scope.row)" v-hasPermi="['data:audit:jjxx-jcj:resume']">恢复</el-button>
                                        <el-button
                                            type="text"
                                            size="mini"
                                            @click="handleDelete(scope.row)"
                                            v-hasPermi="['data:entry:jjxx-xq:delete']"
                                        >删除
                                        </el-button> -->
                                        <el-button type="text" size="mini" @click="detailShow(scope.row,1)" v-hasPermi="['data:entry:jjxx-xq:update']">查看</el-button>
                                        <el-button type="text" size="mini" @click="detailShow(scope.row,2)" v-hasPermi="['data:audit:jjxx-jcj:examine']">审核</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="pagination_zone" v-if="tableData.length>0 ">
                                <el-pagination
                                    background
                                    :current-page="form.pageNum"
                                    :page-sizes="pageSizes"
                                    :page-size="form.pageSize"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :total="total"
                                    @size-change="handleSizeChange"
                                    @current-change="handleCurrentChange"
                                />
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="已终止" name="second">
                        <div class="table_zone">
                            <el-table
                                v-loading="loading"
                                :data="tableData2"
                                style="width: 100%"
                                @sort-change="tableSortChangeHandle"
                                :default-sort="{prop: 'tbsj', order: 'descending'}"
                                :row-class-name="tableRowClassName"
                            >
                                <el-table-column type="expand">
                                    <template slot-scope="props">
                                        <el-table :data="props.row.jlist" style="width: 100%" :show-header="false">
                                            <el-table-column prop="xfdwlx" label="出动队伍伍类型">
                                                <template slot-scope="scope">
                                                    <div :class="checkType(scope.row.xfdwlx)">{{ scope.row.xfdwlx }}</div>
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="xfdwmc" label="出动队伍伍名称"/>
                                            <el-table-column prop="zjxgsj" label="完成时间" width="200">
                                                <template slot-scope="scope">
                                                    <div>{{ scope.row.zjxgsj || '完成时间：-'}}</div>
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="trll" label="投入力量"/>
                                            <el-table-column prop="shzt" label="报告状态">
                                                <template slot-scope="scope">
                                                    <!-- 判断状态码 除了 2 和 99 其他全部是红色标记 -->
                                                    <div
                                                        :class="(scope.row.shzt != 2 && scope.row.shzt != 99) ? 'dot dot_error' : 'dot dot_success'"
                                                    >{{ formatShzt(scope.row.shzt) }}
                                                    </div>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="操作" width="100">
                                                <template slot-scope="scope">
                                                    <el-link
                                                        v-if="scope.row.cdbh"
                                                        type="primary"
                                                        @click="handleEdit(scope.row)"
                                                    >详情
                                                    </el-link>
                                                    <!-- <el-link type="primary" disabled>删除</el-link> -->
                                                    <!-- <el-button type="text" size="mini" @click="handleDelete(scope.row)">删除</el-button> -->
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="jqbh" label="接处警编号" min-width="13%" sortable :show-overflow-tooltip="true"/>
                                <!-- <el-table-column prop="jqbh" label="序号" width="180"></el-table-column> -->
                                <el-table-column
                                    label="接警时间"
                                    sortable
                                    :show-overflow-tooltip="true"
                                    min-width="13%"
                                    prop="jjsj">
                                    <template slot-scope="props">
                                        {{props.row.jjsj | formatDate}}
                                    </template>
                                </el-table-column
                                >
                                <!-- <el-table-column
                                    prop="xzqydm"
                                    label="行政区域"
                                    sortable="custom"
                                    width="150"
                                /> -->
                                <el-table-column prop="xzqymc" label="行政区域" :show-overflow-tooltip="true" min-width="8%"/>
                                <el-table-column prop="jqfsdd" label="警情地址" :show-overflow-tooltip="true" min-width="10%"/>
                                <el-table-column prop="sjlbmc" label="警情类型" :show-overflow-tooltip="true" min-width="9%"/>
                                <!-- <el-table-column
                                    prop="sjlbmc"
                                    label="警情类型"
                                    sortable="custom"
                                    :show-overflow-tooltip="true"
                                /> -->
                                <!-- <el-table-column prop="zzxfdw" label="主战队伍" align="left" /> -->
                                <el-table-column prop="zrqddmc" label="责任区大队" :show-overflow-tooltip="true" min-width="16%"/>
                                <!-- <el-table-column prop="zrqdddm" label="责任区编码" width="100"  :show-overflow-tooltip="true" min-width="13%"/> -->
                                <!-- <el-table-column
                                    prop="tbsj"
                                    label="同步时间"
                                    min-width="13%"
                                    sortable="custom"
                                    show-overflow-tooltip
                                /> -->
                                <el-table-column
                                    label="终止时间"
                                    sortable
                                    :show-overflow-tooltip="true"
                                    min-width="16%"
                                    prop="zjxgsj">
                                    <template slot-scope="props">
                                        {{props.row.zjxgsj}}
                                    </template>
                                </el-table-column
                                >
                                <el-table-column
                                    label="案件状态"
                                    sortable
                                    :show-overflow-tooltip="true"
                                    min-width="10%"
                                    prop="ajzt">
                                    <template slot-scope="props">
                                        {{props.row.ajzt}}
                                    </template>
                                </el-table-column>
                                <!-- <el-table-column prop="jqmc" label="警情名称" width="500" align="left" show-overflow-tooltip /> -->
                                <!-- <el-table-column label="出动报告" width="110" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <div
                                            :class="!scope.row.cdxxtb.includes('全部')? 'dot dot_error':'dot dot_success'"
                                        >{{ scope.row.cdxxtb }}
                                        </div>
                                    </template>
                                </el-table-column> -->
                                <!-- <el-table-column prop="zqxxtb" label="火灾报告" width="110" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                         首先判断是否为 火灾扑救 类型，其次状态的文本是否是 未完成 -->
                                        <!-- <div
                                            v-if="scope.row.sjlbdm.slice(0,2) == '01' || scope.row.sjlbdm == '070400000000'"
                                            :class="scope.row.zqxxtb.includes('未完成') ? 'dot dot_error':'dot dot_success'"
                                        >{{ scope.row.zqxxtb }}
                                        </div>
                                    </template>
                                </el-table-column> --> -->
                                <el-table-column label="操作" min-width="12%">
                                    <template slot-scope="scope">
                                        <!-- <el-button type="text" size="mini" @click="checkDetail(scope.row)">查看</el-button> -->
                                        <el-button type="text" size="mini" @click="checkDetail(scope.row)">详情</el-button>
                                        <el-button type="text" size="mini" @click="activate(scope.row)" v-hasPermi="['data:entry:jjxx-jcj:resume']">恢复</el-button>
                                        <!-- <el-button
                                            type="text"
                                            size="mini"
                                            @click="handleDelete(scope.row)"
                                            v-hasPermi="['data:entry:jjxx-xq:delete']"
                                        >删除
                                        </el-button> -->
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="pagination_zone" v-if="tableData2.length>0 ">
                                <el-pagination
                                    background
                                    :current-page="form2.pageNum"
                                    :page-sizes="pageSizes"
                                    :page-size="form2.pageSize"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :total="total2"
                                    @size-change="handleSizeChange2"
                                    @current-change="handleCurrentChange2"
                                />
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
                
            </div>
        </div>

        <!-- 详情 -->
        <detail v-if="show" :detail-id="detailId" @back="toggle"/>

        <!-- 详情 -->
        <disasterSituationReport v-if="hzShow" :propfrom="propfrom" @back="hzToggle"/>
        <!-- 行政区域 -->
        <provModal ref="provModal" @setProv="setProvValue"/>

        <!--主战中队-->
        <!-- <modal ref="modal" :depth="1" @setVal="setDutyValue" /> -->

        <!--责任区大队-->
        <zrModal ref="zrModal" @setVal="setDutyValue"></zrModal>
    </div>
</template>

<script>
    import zrModal from "@/views/components/dataSeach/modal";
    import {getInfo} from '@/api/login';
    import {formatDate} from '@/common/JS/date.js'
    import detail from "@/views/data/entry/jqxx/components/detail";
    import disasterSituationReport from "@/views/data/entry/zqxx/components/disasterInfomation";
    import {
        getJqcdlb,
        jqxxUpList,
        getUnallocatedList,
        getLastSynTime,
        delUnallocatedBatch,
        synchronization,
        jqxxList,
        deleteJqxx
    } from "@/api/data/entry/jqxx";
    import provModal from "@/views/data/entry/jqxx/components/provModal";
    import {getNearlyRecentDays} from "@/utils/dateTimeUtils.js";
    import {getUserProfile} from "@/api/system/user";

    // 主战中队
    import modal from "@/views/components/dataSeach/modal";
    import { getOptions,getListByZt,updateZtByIdBatch } from "@/api/data/entry/jqxx";
    import dateTimeRange from "@/views/components/dateTime/dateTimeRange.vue"
    import { targetNameTarget } from "@/api/system/dict/target";
import { log } from '_@antv_g2plot@2.3.40@@antv/g2plot/lib/utils';

    export default {
        name: "districtpolicesituation",
        components: {detail, disasterSituationReport, provModal,modal, dateTimeRange,zrModal,},
        props: [],
        filters:{
            formatDate(time){
                let date = new Date(time)
                return formatDate(date,'yyyy-MM-dd hh:mm')
            }
        },
        data() {
            return {
                activeName:'first',
                synchronizationLoading:false,
                updateTime:'',
                // 新增 审核状态字典 列表数据
                auditStatusListData: [],
                loading: false,
                option: [],
                // 警情类型级联懒加载
                props: {
                    lazy: true,
                    checkStrictly: true,
                    lazyLoad: this.lazyLoad,
                    children: "children",
                    label: "dictLabel",
                    value: "dictValue",
                    isLeaf: "isLeaf",
                    // 是否返回由该节点所在的各级菜单的值所组成的数组
                    emitPath: false
                },

                zrqdddmName: "", //责任区大队名称
                isdeptLevel: false,
                isdepEvent: true,
                
                // 详情开关
                show: false,
                hzShow: false, // 火灾详情开关
                // 用于详情查询的id
                detailId: "",
                form: {
                    // 警情名称
                    jqmc: "",
                    // 主战队伍
                    zzxfdw: "",
                    // 行政区域编号
                    xzqydmSj: "",
                    // 行政区域名称
                    xzqyName: "",

                    jqfsdd: "",
                    jqdj: "", //警情等级
                    dwmcHzm: "",
                    // 警情类型
                    sjlbdm: "",
                    isYdwcd: "1",
                    pageNum: 1,
                    pageSize: 10,
                    ksrq: "", //查询开始日期
                    jsrq: "", //查询结束日期
                    params: {
                        beginTime: "",
                        endTime: "",
                        // 依据排序的属性名称（从 table 返回的数据中获取）
                        sortField: "tbsj,zjxgsj,id",
                        sortOrder: "desc"
                    },
                    shzt: '', //报告状态
                    tagIds: '',
                    zrqdddm: "",
                },
                form2: {
                    // 警情名称
                    jqmc: "",
                    // 主战队伍
                    zzxfdw: "",
                    // 行政区域编号
                    xzqydmSj: "",
                    // 行政区域名称
                    xzqyName: "",

                    jqfsdd: "",
                    jqdj: "", //警情等级
                    dwmcHzm: "",
                    // 警情类型
                    sjlbdm: "",
                    isYdwcd: "1",
                    pageNum: 1,
                    pageSize: 10,
                    ksrq: "", //查询开始日期
                    jsrq: "", //查询结束日期
                    params: {
                        beginTime: "",
                        endTime: "",
                        // 依据排序的属性名称（从 table 返回的数据中获取）
                        sortField: "tbsj,zjxgsj,id",
                        sortOrder: "desc"
                    },
                    shzt: '', //报告状态
                    tagIds: '',
                    zrqdddm: "",
                },
                // 接警时间
                jjsj: "",
                tableData: [],
                tableData2: [],
                // 总条数
                total: 0,
                total2: 0,
                // 当前页数
                currentPage: 1,
                // 每页显示条数
                pageSizes: [10, 20, 30, 50],
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
                option2: [
                    {
                        value: "-4",
                        label: "未完成"
                    },
                    {
                        value: "99",
                        label: "已完成"
                    }
                ],
                zzxfdwName:'', //主战单位名称
                jqdj:[],
                tagOptions: [],
                tagValue: []
            };
        },
        watch:{
          form: {
            handler(newName, oldName) {
              this.form2.sjlbdm = this.form.sjlbdm
              this.form2.xzqydmSj = this.form.xzqydmSj
              this.form2.zrqdddm = this.form.zrqdddm
            },
            // immediate: true
            deep:true
          }
        },
        created() {
            this.initUpdateTime()
            this.searchTableDataHandle()
            this.searchTableDataHandle2()
            // this.getOptions();
            getUserProfile().then(response => {
                this.deptLevel = response.data.dept.deptLevel;
            });
            // 新需求：注释掉 2020.2.25
            this.form.ksrq = getNearlyRecentDays(30)[0].substr(0,10);
            this.form.jsrq = getNearlyRecentDays(30)[1].substr(0,10);
            if(this.$route.query.shzt){
              this.form.ksrq = "";
              this.form.jsrq = "";
            }
            // this.searchTableDataHandle();
            // 审核状态字典 列表数据
            this.getDicts("audit_status").then(response => {
                this.auditStatusListData = response.data;
            });
            //警情等级
            getOptions("tb_dic_jqdj").then(res => {
            if (res.code !== 200) {
                return;
            }
            this.jqdj = res.data;
            });
            //警情标签
            this.getAllTag();

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
        },
        methods: {
          activate(row){//激活
            const { id } = row;
                this.loading = true;
                updateZtByIdBatch({ids:[id+''],
                  zt:'1'
                })
                  .then(res => {
                    if(res.code === 200){
                      this.msgSuccess(res.msg);
                      this.loading = false
                    }
                    // res.code === 200 && this.msgSuccess(res.msg);
                  })
                  .finally(() => {
                    this.loading = false
                    this.searchTableDataHandle();
                    this.searchTableDataHandle2();
                  });
          },
          detailShow(row,type){
            console.log('xx',row)
              const { jqbh,isKqy,id } = row;
              this.$router.push({
                path: '/showDetail/jjcshShowDetail',
                query: {
                  jqbh,
                  id,
                  type
                }
              })
            },
            synchronization(){//点击同步按钮
                let now = new Date().getTime()
                let last =new Date(`${this.updateTime}`).getTime()
                console.log(now,last);
                if(now - last - 3600000 > 0){
                    this.synchronizationLoading = true
                    synchronization().then(res => {
                        this.synchronizationLoading = false
                        this.$confirm('已同步成功, 点击确定将刷新页面?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                            }).then(() => {
                            // this.$message({
                            //     type: 'success',
                            //     message: '刷新成功!'
                            // });
                            this.$router.go(0)
                            }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消刷新'
                            });          
                        });
                    }).finally(() => {
                        this.synchronizationLoading = false
                    })
                }else{
                    this.$message('同步点击间隔必须大于1小时')
                }
            },
            initUpdateTime(){
                getLastSynTime().then(res => {
                    this.updateTime = res
                })
            },
          // 打开行政区域的模态框
          openProvModal() {
            this.$refs.provModal.toggle();
          },
          setProvValue(obj, { first, second, third, last }) {
            this.form.xzqydmSj = obj.id;
            this.form.xzqyName = `${first} ${second} ${third} ${last}`;
          },
          // 清空行政区域数据
          cleanProvModal() {
            this.form.xzqydmSj = "";
            this.form.xzqyName = "";
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
              if (item.isLast == "1") {
                item["leaf"] = true;
              }
            });
            return arr;
          },
          searchTableDataHandle() {
            this.loading = true;
            // 新增一个是否有从首页跳转过来的审核状态字段 shzt
            // const { shzt } = this.$route.query;
            // shzt && (this.form.shzt = shzt);
            // 组装数据
            // const { ksrq, jsrq } = this.form2;
            // if (this.tagValue) {
            //   this.form.tagIds = this.tagValue.join(",");
            // } else {
            //   this.form.tagIds = "";
            // }
            let params = { ...this.form };
            params.zt = '-1'
            // params.params.beginTime = ksrq;
            // params.params.endTime = jsrq;

            // 新增一个是否是从首页跳转过来的字段 pageFlag = 1
            // params.pageFlag = this.$route.query.pageFlag;
            // 数据初始化
            this.tableData = [];
            this.total = 0;

            getListByZt(params)
              .then(res => {
                console.log(res);
                // res.rows.forEach(item => {
                //   let arr = item.cdxxtb.split("/");
                //   if (arr[0] == arr[1]) {
                //     item.cdxxtb = "全部已完成";
                //   } else {
                //     item.cdxxtb += "已完成";
                //   }
                // });
                this.total = res.total;
                this.tableData = res.rows;
                this.loading = false;
              })
              .catch(res => {
                // console.error(res);
                this.loading = false;
              });
          },
          searchTableDataHandle2() {
            this.loading = true;
            // 新增一个是否有从首页跳转过来的审核状态字段 shzt
            // const { shzt } = this.$route.query;
            // shzt && (this.form.shzt = shzt);
            // 组装数据
            // const { ksrq, jsrq } = this.form2;
            // if (this.tagValue) {
            //   this.form.tagIds = this.tagValue.join(",");
            // } else {
            //   this.form.tagIds = "";
            // }
            let params = { ...this.form2 };
            params.zt = '-99'
            // params.params.beginTime = ksrq;
            // params.params.endTime = jsrq;

            // 新增一个是否是从首页跳转过来的字段 pageFlag = 1
            // params.pageFlag = this.$route.query.pageFlag;
            // 数据初始化
            this.tableData2 = [];
            this.total2 = 0;

            getListByZt(params)
              .then(res => {
                console.log(res);
                // res.rows.forEach(item => {
                //   let arr = item.cdxxtb.split("/");
                //   if (arr[0] == arr[1]) {
                //     item.cdxxtb = "全部已完成";
                //   } else {
                //     item.cdxxtb += "已完成";
                //   }
                // });
                this.total2 = res.total;
                this.tableData2 = res.rows;
                this.loading = false;
              })
              .catch(res => {
                // console.error(res);
                this.loading = false;
              });
          },
          // 重置
          resetForm() {
            this.form = {
              jqmc: "",
              jjsj: "",
              zzxfdw: "",
              sjlbdm: "",
              jqfsdd: "",
              dwmcHzm: "",
              xzqydmSj: "",
              // 行政区域名称
              xzqyName: "",
              pageNum: 1,
              pageSize: 10,
              ksrq: "", //查询开始日期
              jsrq: "", //查询结束日期
              params: {
                beginTime: "",
                endTime: "",
                // 依据排序的属性名称（从 table 返回的数据中获取）
                sortField: "tbsj,zjxgsj,id",
                sortOrder: "desc"
              },
              zrqdddm: "",
            };
            this.zrqdddmName = ""; //责任区大队名称
            this.jjsj = "";
            this.$refs.dateTimeRange.clear();
          },
          // 获取警情类型options
          // getOptions() {
          //   getJqcdlb({
          //     dictType: "jqcjlb",
          //     parentValue: "0"
          //   }).then(res => {
          //     this.option = res.data;
          //   });
          // },
          formatter(row, column) {
            return row.address;
          },
          checkType(text) {
            let className = "";
            if (text == "主战") {
              className = "tag tag_primary";
            } else if (text == "增援") {
              className = "tag tag_info";
            } else if (text == "火灾报告") {
              className = "tag tag_warning";
            }
            return className;
          },
          /**
           * 跳转编辑页面
           */
          editDetail(row) {
              const { id } = row;
                this.loading = true;
                updateZtByIdBatch({ids:[id+''],
                  zt:'1'
                })
                  .then(res => {
                    if(res.code === 200){
                      this.msgSuccess(res.msg);
                      this.loading = false
                    }
                    // res.code === 200 && this.msgSuccess(res.msg);
                  })
                  .finally(() => {
                    this.loading = false
                    this.searchTableDataHandle();
                    this.searchTableDataHandle2();
                  });
            // const { jqbh,isKqy } = row;
            // if(parseInt(isKqy)){
            //   this.$router.push({
            //     path: '/dataEntry/kqyjqxxEdit',
            //     query: {
            //       jqbh,
            //     }
            //   })
            // }else {
            //   this.$router.push({
            //     path: '/dataEntry/jqxxEdit',
            //     query: {
            //       jqbh,
            //     }
            //   })
            // }
          },
          // 查看详情
          checkDetail(row) {
            // this.detailId = data.jqbh
            // this.toggle()
            // this.$router.push({
            //   // path: '/dataEntry/lsjqxq',
            //   path: "/showDetail/jjcshShowDetail",
            //   query: {
            //     jqbh: data.jqbh,
            //     jqmc: data.jqmc
            //   }
            // });

            const { jqbh,isKqy,id } = row;
              this.$router.push({
                path: '/showDetail/jjcshShowDetail',
                query: {
                  jqbh,
                  id
                }
              })
          },
          toggle() {
            this.show = !this.show;
          },
          hzToggle() {
            this.hzShow = !this.hzShow;
          },
          // 分页
          handleSizeChange(val) {
            this.form.pageSize = val;
            this.searchTableDataHandle();
          },
          handleSizeChange2(val) {
            this.form2.pageSize = val;
            this.searchTableDataHandle2();
          },
          // 翻页
          handleCurrentChange(val) {
            this.form.pageNum = val;
            this.searchTableDataHandle();
          },
          handleCurrentChange2(val) {
            this.form2.pageNum = val;
            this.searchTableDataHandle2();
          },
          formatShzt(val) {
            const filterData = this.auditStatusListData.find(
              element => element.dictValue == val
            );
            return filterData ? filterData.dictLabel : "-";
          },
          handleEdit(item) {
            const { xfdwlx, cdbh, jqbh, qwhz, shzt } = item;
            if (xfdwlx === "火灾报告") {
              // this.propfrom.zqbh = item.zqbh
              // this.propfrom.jqbh = item.jqbh
              // this.hzToggle()
              this.$router.push({
                path: "/showDetail/fireDetailInfo",
                query: {
                  zqbh: cdbh,
                  jqbh: jqbh,
                  qwhz: qwhz
                }
              });
            } else {
              this.$router.push({
                // path: '/dataEntry/lscdxq',
                name: "出动信息详情",
                query: {
                  cdbh: cdbh,
                  shzt: shzt
                }
              });
            }
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
                  this.form.ksrq = getNearlyRecentDays(30)[0].substr(0, 10); // 接警起止时间
                } else if (nowChangeGettime == jsrqGettime) {
                  //如果当前选的是结束时间，结束时间恢复到初始时间
                  this.form.jsrq = getNearlyRecentDays(30)[1].substr(0, 10); // 接警截止时间
                }
              }
            }
          },
          /**
           * 删除单条警情
           */
          handleDelete(item) {
            const { id } = item;
            this.$confirm(
              "确定删除该条警情吗？",
              "提示",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              }
            )
              .then(() => {
                this.loading = true;
                updateZtByIdBatch({
                  ids:[id+''],
                  zt:'-99'
                })
                  .then(res => {
                    res.code === 200 && this.msgSuccess(res.msg);
                  })
                  .finally(() => {
                    this.searchTableDataHandle();
                    this.searchTableDataHandle2();
                  });
              })
              .catch(function() {
              });
          },
          /**
           * 表格 单列排序改变回调
           */
          tableSortChangeHandle({ column, prop, order }) {
            if (prop && order) {
              const dictionaries = {
                ascending: "asc",
                descending: "desc"
              };
              // 特殊字段进行处理
              if (prop === "sjlbmc") {
                prop = "sjlbdm";
              }
              // 转换数据
              this.form.params.sortField = prop;
              this.form.params.sortOrder = dictionaries[order];
              // this.searchTableDataHandle();
            }
          },
          // 将树形中的值赋值给责任大区 input id 付给hidden input
          setDutyValue(data) {
            // this.form.zzxfdw = data.deptId;
            // this.zzxfdwName = data.deptName;
            this.form.zrqdddm = data.deptId;
            this.zrqdddmName = data.deptName;
            this.$refs.dutyInput.focus();
            this.$refs.dutyInput.blur();
          },
          // 打开责任大区模态框 并 回显
          openDutyModal() {
            // this.$refs.modal.echo(this.zzxfdwName);
            // this.$refs.modal.toggle();
            this.$refs.zrModal.echo(this.zrqdddmName);
            this.$refs.zrModal.toggle();
          },
          cleanDutyModal() {
            // this.form.zzxfdw = "";
            // this.zzxfdwName = "";
            this.form.zrqdddm = "";
            this.zrqdddmName = "";
          },
          dateChange(data) {
            this.form.ksrq = data.ksrq;
            this.form.jsrq = data.jsrq;
          },
          getAllTag() {
            let _params = {
              "tagName": "",
              "tagType": "J"
            }
            targetNameTarget(_params).then(res => {
              this.tagOptions = res.data.map(item => {
                return {
                  label: item.tagName,
                  value: item.tagId
                }
              });
            });
          },
          tableRowClassName({ row, rowIndex }) {
            return row.zt==="4"?'row_zt_4':''
          }
        }
    };
</script>
<style lang='stylus' scoped>
    .app-container
        .reporting-title
            h2
                background-image url('~@/views/data/entry/jqxx/image/lsjqxx.png')
                background-repeat no-repeat
                background-position 0 50%
                background-size 23px
        .content
            // padding: 10px 0px;
            .search_zone
                h4
                    font-size 16px
                .el-row
                    .el-col
                        height 50px
                        .el-form-item
                            width 93%
                            height 32px
                            line-height 32px
                            .el-input, .el-select, .el-cascader
                                width 100%
                        .divIncludeTime
                            line-height 32px
                            position relative
                            display inline-block
                            .line
                                text-align center
            .table_zone
                font-size 14px
                thead
                    background rgba(240, 244, 247, 1)
                .tag
                    display inline-block
                    width 58px
                    border-radius 3px
                    font-weight 500
                    line-height 20px
                    text-align center
                .tag_primary
                    color #2296F3
                    background rgba(34, 150, 243, 0.2)
                    border 1px solid rgba(34, 150, 243, 1)
                .tag_info
                    color #01BCD5
                    background rgba(1, 188, 213, 0.2)
                    border 1px solid rgba(1, 188, 213, 1)
                .tag_warning
                    color #FF9802
                    background rgba(255, 152, 2, 0.2)
                    border 1px solid rgba(255, 152, 2, 1)
                .dot
                    &:before
                        content '●'
                        display inline-block
                        margin-right 10px
                        font-size 16px
                .dot_success
                    &:before
                        color #27CA3F
                .dot_error
                    &:before
                        color #F54336
                .pagination_zone
                    margin-top 20px
                    text-align right
</style>

<style lang="scss" scoped>
/deep/.row_zt_4{
  color: #e74c3c;
  font-weight: bold;
}
</style>