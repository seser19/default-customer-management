<template>
    <div class="app-container">
        <div v-show="!show && !hzShow" class="page_zone">
            <div class="reporting-title">
                <h2>{{ $route.meta.title }}</h2>
            </div>

            <div class="content">
                <div class="search_zone">
                    <!-- <h4 class="layout-small-title">自定义搜索</h4> -->
                    <el-form ref="searchForm" :model="form">
                        <el-row>
                            <el-col :span="7">
                                <el-form-item>
                                    <el-input
                                        v-model="form.jqbh"
                                        placeholder="警情编码"
                                        clearable
                                        @keyup.enter.native="searchTableDataHandle"
                                    />
                                </el-form-item>
                            </el-col>
                            <el-col :span="7">
                                <el-form-item>
                                    <el-input v-model="zzxfdwName" placeholder="主战中队" readonly @focus="openDutyModal" >
                                        <i slot="suffix" class="iconfont icon-icon-test" style="line-height:32px;"  @click="openDutyModal"></i>
                                        <i slot="suffix" class="el-icon-circle-close" style="line-height:30px; cursor: pointer;" @click="cleanDutyModal"  v-show="zzxfdwName"></i>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                              <date-time-range ref="dateTimeRange" :format="`date`" @selectTime="dateChange"></date-time-range>
                            </el-col>
                            <el-col :span="7">
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
                            <el-col :span="7">
                                <el-form-item>
                                    <el-input
                                        v-model="form.jqfsdd"
                                        placeholder="警情地址"
                                        clearable
                                        @keyup.enter.native="searchTableDataHandle"
                                    />
                                </el-form-item>
                            </el-col>
                            <el-col :span="7">
                                <el-form-item>
                                    <el-input
                                        v-model="form.dwmcHzm"
                                        placeholder="单位名称/户主名"
                                        clearable
                                        @keyup.enter.native="searchTableDataHandle"
                                    />
                                </el-form-item>
                            </el-col>
                            <el-col :span="1" style="margin-left: -15px;">
                                <el-button type="primary" @click="searchTableDataHandle">查&nbsp;询</el-button>
                            </el-col>
                            <el-col :span="1" style="margin-left: 15px;">
                                <el-button @click="resetForm">重&nbsp;置</el-button>
                            </el-col>
                            <el-col :span="7">
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
                            </el-col>
                        </el-row>
                    </el-form>
                </div>

                <div class="table_zone">
                    <el-table
                        v-loading="loading"
                        :data="tableData"
                        style="width: 100%"
                        @sort-change="tableSortChangeHandle"
                        :default-sort="{prop: 'tbsj', order: 'descending'}"
                        :empty-text="querydata == true ? '点击按钮查询':'暂无数据'"
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
                                    <el-table-column label="操作">
                                        <template slot-scope="scope">
                                            <el-link
                                                v-if="scope.row.cdbh"
                                                type="primary"
                                                @click="handleEdit(scope.row)"
                                            >详情
                                            </el-link>
                                            <!-- <el-link type="primary" @click="handleDelete(scope.row)">删除</el-link> -->
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </template>
                        </el-table-column>
                        <el-table-column prop="jqbh" label="警情编码" width="150" sortable />
                        <!-- <el-table-column prop="jqbh" label="序号" width="180"></el-table-column> -->
                        <el-table-column
                            prop="jjsj"
                            label="接警时间"
                            sortable
                            :show-overflow-tooltip="true"
                        />
                        <el-table-column
                            prop="xzqydm"
                            label="行政区域"
                            sortable
                            width="150"
                        />
                        <el-table-column prop="jqfsdd" label="警情地址" :show-overflow-tooltip="true"/>
                        <el-table-column
                            prop="sjlbmc"
                            label="警情类型"
                            sortable
                            :show-overflow-tooltip="true"
                        />
                        <!-- <el-table-column prop="zzxfdw" label="主战队伍" align="left" /> -->
                        <el-table-column prop="trll" label="投入力量" width="80" :show-overflow-tooltip="true"/>
                        <el-table-column
                            prop="tbsj"
                            label="发送时间"
                            width="140"
                            sortable
                            show-overflow-tooltip
                        />
                        <!-- <el-table-column prop="jqmc" label="警情名称" width="500" align="left" show-overflow-tooltip /> -->
                        <el-table-column label="出动报告" width="110" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <div
                                    :class="!scope.row.cdxxtb.includes('全部')? 'dot dot_error':'dot dot_success'"
                                >{{ scope.row.cdxxtb }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="zqxxtb" label="火灾报告" width="110" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <div
                                    v-if="(scope.row.specialSlightFire && scope.row.isCorps !== '1')"
                                    :class="scope.row.zqxxtb.includes('未完成')? 'dot dot_error':'dot dot_success'"
                                >{{ scope.row.zqxxtb }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="100">
                            <template slot-scope="scope">
                                <el-button type="text" size="mini" @click="checkDetail(scope.row)">查看</el-button>
                                <!-- <el-button
                                    type="text"
                                    size="mini"
                                    :disabled="!(scope.row.shCount == 0)"
                                    @click="handleDelete(scope.row)"
                                >删除</el-button>-->
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
            </div>
        </div>

        <!-- 详情 -->
        <detail v-if="show" :detail-id="detailId" @back="toggle"/>

        <!-- 详情 -->
        <disasterSituationReport v-if="hzShow" :propfrom="propfrom" @back="hzToggle"/>
        <!--主战中队-->
        <modal ref="modal" :depth="1" @setVal="setDutyValue" />
    </div>
</template>

<script>
    import detail from "./components/detail";
    import disasterSituationReport from "@/views/data/entry/zqxx/components/disasterInfomation";
    import {getJqcdlb, jqxxList, deleteJqxx} from "@/api/data/entry/jqxx";
    import {getNearlyRecentDays,getNearlyRecentYear} from "@/utils/dateTimeUtils.js";
    // 主战中队
    import modal from "@/views/components/dataSeach/modal";
    import dateTimeRange from "@/views/components/dateTime/dateTimeRange.vue"
    import { targetNameTarget } from "@/api/system/dict/target";

    export default {
        name: "recordedalarm",
        components: {detail, disasterSituationReport,modal, dateTimeRange},
        props: [],
        data() {
            return {
                //初始显示
                querydata:true,
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

                    jqfsdd: "",
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
                        sortField: "tbsj",
                        sortOrder: "desc"
                    }
                },
                // 接警时间
                jjsj: "",
                tableData: [],
                // 总条数
                total: 0,
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
                zzxfdwName:'', //主战中队名称
                tagOptions: [],
                tagValue: [],
                pickerOptions: {
                  shortcuts: [{
                    text: '即刻',
                    onClick(picker) {
                      const date = new Date();
                      picker.$emit('pick', date);
                    }
                  },{
                    text: '一周前',
                    onClick(picker) {
                      const date = new Date();
                      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                      picker.$emit('pick', date);
                    }
                  },{
                    text: '本月',
                    onClick(picker) {
                      const date = new Date();
                      date.setTime(date.setDate(1));
                      picker.$emit('pick', date);
                    }
                  }]
                }
            };
        },
        created() {
            // this.getOptions();
            // 设置默认时间 新需求：注释掉 2020.2.25
            // this.form.ksrq = getNearlyRecentDays(30)[0];
            // this.form.jsrq = getNearlyRecentDays(30)[1];
            // 审核状态字典 列表数据
            this.getDicts("audit_status").then(response => {
                this.auditStatusListData = response.data;
            });
            this.getAllTag();
        },
        methods: {
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
            /**
             * 组装数据并获取表格数据
             */
            searchTableDataHandle() {
                this.loading = true;
                // this.form.pageNum = this.currentPage = 1;
                // this.form.pageSize = 10;
                // 组装数据 将日期加到 form 中
                this.form.params.beginTime = this.form.ksrq;
                this.form.params.endTime = this.form.jsrq;
                if(this.tagValue) {
                  this.form.tagIds = this.tagValue.join(",");
                } else {
                  this.form.tagIds = "";
                }
                // 数据初始化
                this.tableData = [];
                this.total = 0;
                jqxxList(this.form)
                    .then(res => {
                        res.rows.forEach(item => {
                            let arr = item.cdxxtb.split("/");
                            if (arr[0] == arr[1]) {
                                item.cdxxtb = "全部已完成";
                            } else {
                                item.cdxxtb += "已完成";
                            }
                        });
                        this.total = res.total;
                        this.tableData = res.rows;
                        this.loading = false;
                        // console.log("----",this.tableData);
                        if(this.tableData.length == 0){
                            this.querydata = false;
                        }
                    })
                    .finally(res => {
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
                    pageNum: 1,
                    pageSize: 10,
                    ksrq: getNearlyRecentYear(2019)[0], //查询开始日期
                    jsrq: getNearlyRecentYear(2019)[1], //查询结束日期
                    // ksrq: "", //查询开始日期
                    // jsrq: "", //查询结束日期
                    params: {
                        beginTime: getNearlyRecentYear(2019)[0],
                        endTime: getNearlyRecentYear(2019)[1],
                        // beginTime: "",
                        // endTime: "",
                        // 依据排序的属性名称（从 table 返回的数据中获取）
                        sortField: "tbsj",
                        sortOrder: "desc"
                    }
                };
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
            // 查看详情
            checkDetail(data) {
                // this.detailId = data.jqbh
                // this.toggle()
                this.$router.push({
                    // path: '/dataEntry/lsjqxq',
                    path: "/showDetail/jqxxShowDetail",
                    query: {
                        jqbh: data.jqbh,
                        jqmc: data.jqmc
                    }
                });
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
            // 翻页
            handleCurrentChange(val) {
                this.form.pageNum = val;
                this.searchTableDataHandle();
            },
            formatShzt(val) {
                const filterData = this.auditStatusListData.find(
                    element => element.dictValue == val
                );
                return filterData ? filterData.dictLabel : "-";
            },
            /**
             * 跳转至单条警情相应的详情页面
             */
            handleEdit(item) {
                console.log(item);
                const {xfdwlx, cdbh, jqbh, qwhz, shzt} = item;
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
            /**
             * 删除单条警情
             */
            // handleDelete(item) {
            //   const { jqbh } = item;
            //   this.$confirm(
            //     "确定删除该条警情吗？关联的出动和火灾报告会一并删除。",
            //     "提示",
            //     {
            //       confirmButtonText: "确定",
            //       cancelButtonText: "取消",
            //       type: "warning"
            //     }
            //   )
            //     .then(() => {
            //       this.loading = true;
            //       deleteJqxx({
            //         jqbh
            //       })
            //         .then(res => {
            //           res.code === 200 && this.msgSuccess(res.msg);
            //         })
            //         .finally(() => {
            //           this.searchTableDataHandle();
            //         });
            //     })
            //     .catch(function() {});
            // },
            paramTimeChange(val) {
                let nowChangeGettime = new Date(val).getTime();
                if (this.form.ksrq && this.form.jsrq) {
                    let ksrqGettime = new Date(this.form.ksrq).getTime();
                    let jsrqGettime = new Date(this.form.jsrq).getTime();
                    if (ksrqGettime > jsrqGettime) {
                        this.$message.warning("开始时间不能大于结束时间");
                        if (nowChangeGettime == ksrqGettime) {
                            //如果当前选的是开始时间，开始时间恢复到初始时间
                            this.form.ksrq = getNearlyRecentDays(30)[0]; // 接警起止时间
                        } else if (nowChangeGettime == jsrqGettime) {
                            //如果当前选的是结束时间，结束时间恢复到初始时间
                            this.form.jsrq = getNearlyRecentDays(30)[1]; // 接警截止时间
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
                this.form.zzxfdw = data.deptId;
                this.zzxfdwName = data.deptName;
            },
            // 打开责任大区模态框 并 回显
            openDutyModal() {
                this.$refs.modal.echo(this.zzxfdwName);
                this.$refs.modal.toggle();
            },
            cleanDutyModal() {
                this.form.zzxfdw = "";
                this.zzxfdwName = "";
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
              targetNameTarget(_params).then(res=>{
                this.tagOptions = res.data.map(item=> {
                  return {
                    label: item.tagName,
                    value: item.tagId
                  }
                });
              });
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
