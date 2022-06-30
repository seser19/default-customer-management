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
                                <el-form-item class="divIncludeTime">
                                    <el-col :span="11">
                                        <el-date-picker
                                            v-model="form.ksrq"
                                            :clearable="false"
                                            value-format="yyyy-MM-dd"
                                            @change="paramTimeChange"
                                            placeholder="起火时间"
                                            type="date"
                                        />
                                    </el-col>
                                    <el-col class="line" :span="2">-</el-col>
                                    <el-col :span="11">
                                        <el-date-picker
                                            v-model="form.jsrq"
                                            :clearable="false"
                                            value-format="yyyy-MM-dd"
                                            @change="paramTimeChange"
                                            placeholder="起火时间"
                                            type="date"
                                        />
                                    </el-col>
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
                            <el-col :span="3">
                                <el-button @click="resetForm">重&nbsp;置</el-button>
                            </el-col>
                            <el-col :span="7">
                                <el-form-item>
                                    <el-input v-model="form.jqfsdd" placeholder="警情地址" clearable/>
                                </el-form-item>
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
                                    <el-input v-model="qhw" placeholder="起火物" clearable>
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
                            <el-col :span="3">
                                <el-button type="primary" @click="search">查&nbsp;询</el-button>
                            </el-col>
                            <el-col :span="7">
                                <el-form-item>
                                    <el-input v-model="hzyyname" placeholder="起火原因">
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
                            <el-col :span="7">
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
                        </el-row>
                    </el-form>
                </div>
            </div>

            <el-table
                v-loading="loading"
                :data="tableData"
                style="width: 100%;"
                @sort-change="tableSortChangeHandle"
                :default-sort="{prop: 'tbsj', order: 'descending'}"
            >
                <el-table-column prop="zqbh" label="火灾编号" width="150" sortable="custom" show-overflow-tooltip/>
                <!--  :formatter="dateFormat" -->
                <el-table-column prop="zqsj" label="起火时间" sortable="custom" width="150" show-overflow-tooltip/>
                <el-table-column prop="xzqydmsj" label="行政区域" width="150" sortable="custom" />
                <el-table-column prop="jqfsdd" label="警情地址" width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div>{{ scope.row.jqfsdd || '-' }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="qwhz" label="轻微火灾" width="100" sortable="custom">
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
                <el-table-column prop="tbsj" label="填报时间" sortable="custom" width="150" show-overflow-tooltip/>
                <el-table-column prop="shzt" label="报告状态" width="100" sortable="custom" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div v-if="scope.row.shzt == 0" class="pic">
                            <img src="../../../icons/weisongshen.svg"/>待填报
                        </div>
                        <div v-if="scope.row.shzt == 1" class="pic">
                            <img src="../../../icons/shenpizhong.svg"/>审核中
                        </div>
                        <div v-if="scope.row.shzt == 2" class="pic">
                            <img src="../../../icons/yishenpi.svg"/>已审核
                        </div>
                        <div v-if="scope.row.shzt == -1" class="pic">
                            <img src="../../../icons/beizhongzhi.svg"/>待修改
                        </div>
                        <div v-if="scope.row.shzt == -2" class="pic">
                            <img src="../../../icons/tuihui.svg"/>被退回
                        </div>
                        <div v-if="scope.row.shzt == -3" class="pic">
                            <img src="../../../icons/daiwanshan.svg"/>待完善
                        </div>
                        <div v-if="scope.row.shzt == 99" class="pic">
                            <img src="../../../icons/yiguidang.svg"/>已归档
                        </div>
                        <div v-if="scope.row.shzt == 4" class="pic">
                            <img src="../../../icons/tuihui.svg"/>被驳回
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="130">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" @click="handleEdit(scope.row)">详情</el-button>
                        <el-button
                            size="mini"
                            type="text"
                            :disabled="!(scope.row.shzt == -2 || scope.row.shzt == -1 || scope.row.shzt == -3 || scope.row.shzt == 4)"
                            @click="handleEditData(scope.row)"
                        >修改
                        </el-button>
                        <el-button
                            size="mini"
                            type="text"
                            :disabled="!(scope.row.shzt == 0 || scope.row.shzt == -1)"
                            @click="handleDelete(scope.row.zqbh)"
                        >删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class="pagination_zone">
                <pagination
                    v-show="total>0"
                    :total="total"
                    :page.sync="form.pageNum"
                    :limit.sync="form.pageSize"
                    @pagination="getList"
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
        </div>
        <!-- 详情 -->
        <detail v-else :propfrom="propfrom" @back="toggle"/>
        <!-- 行政区域 -->
        <provModal ref="provModal" @setProv="setProvValue"/>
        <modal ref="modal1" :type="types.type1" @setVal="setValue1"/>
        <modal ref="modal2" :type="types.type2" @setVal="setValue2"/>
        <modal ref="modal3" :type="types.type3" @setVal="setValue3"/>
    </div>
</template>

<script>
    // import detail from './components/detail'
    import modal from "@/views/components/searchModal/modal";
    import detail from "@/views/data/entry/zqxx/components/disasterInfomation";
    // 地区选择
    import provModal from "@/views/data/entry/jqxx/components/provModal";
    import {formatterDate} from "@/utils/index";
    import {getNearlyRecentDays} from "@/utils/dateTimeUtils.js";
    import {
        getHjlb,
        lszqxxList,
        lszqscList
        // getQhcs,
        // lszqDetailList,
        // getFirePlaceOptions,
        // getFireObjectOptions,
        // getFireReasonOptions
    } from "@/api/data/entry/zqxx";

    export default {
        name: "recordedfire",
        components: {
            detail,
            modal,
            provModal
        },
        data() {
            return {
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
                    // {
                    //   value: '0',
                    //   label: '未送审'
                    // },
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
                    jqfsdd: "",
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
                    // 轻微火灾
                    qwhz: "",
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
                    }
                },
                tableData: [],
                // 详情开关
                show: true,
                // loading层
                loading: false,
                // zqbh
                curzqbh: "",
                // 总条数
                total: 0,
                // 当前页数
                currentPage: 1,
                // 每页显示条数
                pageSizes: [10, 20, 30, 50],
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
                xzqyName: "" // 行政区域名称
            };
        },
        created() {
            // this.form.ksrq = getNearlyRecentDays(30)[0];
            // this.form.jsrq = getNearlyRecentDays(30)[1];
            // this.search();
            // 字段数据
            this.getOptions();
            this.search();
        },
        methods: {
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
            getList(val) {
                this.form.pageNum = val.page;
                this.form.pageSize = val.limit;
                this.search();
            },
            // 分页
            handleSizeChange(val) {
                this.form.pageSize = val;
                this.search();
            },
            // 翻页
            handleCurrentChange(val) {
                this.form.currentPage = val;
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
                this.loading = true;
                // 新增一个是否有从首页跳转过来的审核状态字段 shzt
                const {shzt} = this.$route.query;
                shzt && (this.form.shzt = shzt);
                // 组装数据
                this.form.params.beginTime = this.form.ksrq;
                this.form.params.endTime = this.form.jsrq;

                lszqxxList(this.form).then(res => {
                    // console.log(res);
                    this.loading = false;
                    this.total = res.total;
                    this.tableData = res.rows;
                });
            },
            // 重置
            resetForm() {
                this.form = {
                    zqbh: "",
                    xzqydmSj: "",
                    jqfsdd: "",
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
                    }
                };
                this.xzqyName = "";
                this.qhcsname = "";
                this.hzyyname = "";
                this.qhw = "";
                // this.search();
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
                    if (prop === "xzqydmsj") {
                        prop = "xzqydm";
                    }
                    // 转换数据
                    this.form.params.sortField = prop;
                    this.form.params.sortOrder = dictionaries[order];
                    this.search();
                }
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
                            .el-input, .el-select, .el-cascader
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
