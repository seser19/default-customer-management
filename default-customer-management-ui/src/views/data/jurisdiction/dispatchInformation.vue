<template lang="pug">
    .app-container
        .title
            h2 {{ $route.meta.title }}
        .hx-body
            //- h4.layout-small-title 自定义搜索
            el-form()
                el-row
                    el-col(:span="7")
                        el-form-item(prop="")
                            el-input(v-model="formData.cdbh" placeholder="出动编号" clearable)
                    el-col(:span="7")
                        el-form-item(prop="")
                            el-input(v-model="formData.jqbh" placeholder="警情编号" clearable)
                    el-col(:span="10")
                        dateTimeRange(ref="dateTimeRange" :format="`date`" :isInit="initStatus" @selectTime="dateChange")
                        //- el-form-item.divIncludeTime(prop="")
                        //-     el-col(:span="11")
                        //-         el-date-picker(v-model="formData.ksrq"
                        //-             :clearable="false"
                        //-         value-format="yyyy-MM-dd"
                        //-             @change="paramTimeChange"
                        //-         type="date")
                        //-     el-col.line(:span="2") -
                        //-     el-col(:span="11")
                        //-         el-date-picker(v-model="formData.jsrq"
                        //-             :clearable="false"
                        //-         value-format="yyyy-MM-dd"
                        //-             @change="paramTimeChange"
                        //-         type="date")
                el-row
                    el-col(:span="7")
                        el-form-item(prop="")
                            el-input(v-model="xfdwdmName" placeholder="主战中队" readonly @focus="openDutyModal")
                                i(slot="suffix" class="iconfont icon-icon-test" style="line-height:32px;"  @click="openDutyModal")
                                i(slot="suffix" class="el-icon-circle-close" style="line-height:30px; cursor: pointer;" @click="cleanDutyModal"  v-show="xfdwdmName")
                    el-col(:span="7")
                        el-form-item(prop="")
                            el-input(v-model="formData.xzqymc" placeholder="行政区域" :readonly="true" @focus="openProvModal()")
                                i(slot="suffix" class="iconfont icon-icon-test" @click="openProvModal()")
                                i(slot="suffix" class="el-icon-circle-close" style="margin-left:5px; cursor: pointer;" @click="clearQhyyMul"  v-show="formData.xzqymc")
                    el-col(:span="7")
                        el-form-item(prop="")
                            el-input(v-model="formData.jqfsdd" placeholder="警情地址" clearable)
                    el-col(:span="3")
                        el-button(type="primary" @click.prevent="submitData()") 查&nbsp;询
                    el-col(:span="7")
                        el-form-item(prop="")
                            el-cascader(class="el-input el-input--small el-input--suffix" ref="cascader" v-model="formData.sjlbdm" :props="props" placeholder="警情类型" clearable)
                            //- el-select(v-model="formData.sjlbdm" placeholder="警情类型" clearable)
                            //- 	el-option(label="火灾扑救" value="010000000000")
                            //- 	el-option(label="抢险救援" value="020000000000")
                    el-col(:span="7")
                        el-form-item(prop="")
                            el-select(v-model="formData.czxsdm" placeholder="参战形式" clearable)
                                el-option(label="主战" value="010000")
                                el-option(label="增援" value="020000")
                    el-col(:span="7")
                        el-form-item(prop="")
                            el-select(v-model="formData.shzt" placeholder="报告状态" clearable)
                                el-option(v-for="item in auditStatusListData"
                                    :key="item.dictValue"
                                        :label="item.dictLabel"
                                        :value="item.dictValue")
                    el-col(:span="3")
                        el-button(@click.prevent="cleanData()") 重&nbsp;置
                    el-col(:span="7")
                        el-form-item(prop="")
                            el-select(v-model="formData.czqkdm" placeholder="处置情况" clearable)
                                el-option(v-for="item in dicCzqk"
                                    :key="item.dictValue"
                                        :label="item.dictLabel"
                                        :value="item.dictValue")
            el-table(:data="listData" 
                    style="width: 100%" 
                    v-loading="listDataLoading"
                    @sort-change="tableSortChangeHandle"
                    :default-sort="{prop: 'tbsj', order: 'descending'}" 
                    :empty-text="querydata == true ? '点击按钮查询':'暂无数据'")
                el-table-column(prop="cdbh" label="出动编号" width="150" show-overflow-tooltip sortable)
                el-table-column(prop="jqbh" label="警情编号" width="150" show-overflow-tooltip sortable)
                el-table-column(prop="jjsj" label="接警时间" width="150" sortable)
                    template(slot-scope="scope") {{scope.row.jjsj || '-'}}
                el-table-column(prop="xzqydm" label="行政区域" width="150"  sortable)
                    template(slot-scope="scope") {{scope.row.xzqydm || '-'}}
                el-table-column(prop="jqfsdd" label="警情地址" show-overflow-tooltip)
                    template(slot-scope="scope") {{scope.row.jqfsdd || '-'}}
                el-table-column(prop="sjlbdm" label="警情类型" width="140" show-overflow-tooltip sortable)
                    template(slot-scope="scope") {{scope.row.sjlbmc || '-'}}
                el-table-column(prop="respondType" label="参战形式" width="100" sortable)
                    template(slot-scope="scope") {{scope.row.respondType=='010000'?'主战':'增援'}}
                el-table-column( label="投入力量" width="80")
                    template(slot-scope="scope") {{scope.row.carCount||0}}车{{scope.row.trrys||0}}人
                el-table-column(prop="xfdwdm" label="参战中队" width="140" :show-overflow-tooltip="true")
                    template(slot-scope="scope") {{scope.row.xfdwdm || '-'}}
                el-table-column(prop="tbsj" label="填报时间" width="160" sortable show-overflow-tooltip)
                el-table-column(prop="shzt" label="报告状态" width="100" sortable)
                    template(slot-scope="scope")
                        .pic(v-if="scope.row.shzt == 0")
                            img(src="@/views/icons/weisongshen.svg")
                            span 待填报
                        .pic(v-if="scope.row.shzt == 1")
                            img(src="@/views/icons/shenpizhong.svg")
                            span 审核中
                        .pic(v-if="scope.row.shzt == 2")
                            img(src="@/views/icons/yishenpi.svg")
                            span 已审核
                        .pic(v-if="scope.row.shzt == -1")
                            img(src="@/views/icons/beizhongzhi.svg")
                            span 待修改
                        .pic(v-if="scope.row.shzt == -2")
                            img(src="@/views/icons/tuihui.svg")
                            span 被退回
                        .pic(v-if="scope.row.shzt == 99")
                            img(src="@/views/icons/yiguidang.svg")
                            span 已归档
                        .pic(v-if="scope.row.shzt == 4")
                            img(src="@/views/icons/tuihui.svg")
                            span 被驳回
                    //- span {{ formatShzt(scope.row.shzt) }}
                el-table-column(prop="state" label="操作" width="100")
                    template(slot-scope="scope")
                        el-button(type="text" @click="jumpXq(scope.row)") 详情
                        //- el-button(type="text" :disabled="!(scope.row.shzt == -2 || scope.row.shzt == -1)" @click="editXq(scope.row)") 修改
                        //- el-button(type="text" ) 删除
            pagination(
            v-show="queryParams.total>0"
                :total="queryParams.total"
                    :page.sync="queryParams.pageNum"
                    :limit.sync="queryParams.pageSize"
                    @pagination="getList")

        prov-modal(ref="provModal" @setProv="setProvValue")
        modal(ref="modal" :depth="1" @setVal="setDutyValue")

</template>
<script>
    import {historyCdxx} from "@/api/data/entry/cdxx.js";
    import provModal from "@/views/data/entry/jqxx/components/provModal";
    import {getJqcdlb} from "@/api/data/entry/jqxx";
    import {getNearlyRecentDays,getNearlyRecentYear} from "@/utils/dateTimeUtils.js";
    // 主战
    import modal from "@/views/components/dataSeach/modal";
    import dateTimeRange from "@/views/components/dateTime/dateTimeRange.vue"

    export default {
        name: "districtdispatched",
        components: {
            provModal,
            modal,
            dateTimeRange
        },
        props: [],
        data() {
            return {
                //初始显示
                querydata:true,
                // 新增 审核状态字典 列表数据
                auditStatusListData: [],
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
                listData: [],
                listDataLoading: false,
                queryParams: {
                    total: 0,
                    pageNum: 1,
                    pageSize: 10
                },
                formData: {
                    cdbh: "",
                    jqbh: "",
                    xzqymc: "",
                    xzqydm: "",
                    timeLong: [],
                    jqfsdd: "",
                    sjlbdm: "",
                    czxsdm: "",
                    shzt: "",
                    czqkdm: "",
                    ksrq: "", //查询开始日期
                    jsrq: "", //查询结束日期
                    params: {
                        beginTime: "",
                        endTime: "",
                        // 依据排序的属性名称（从 table 返回的数据中获取）
                        sortField: "tbsj",
                        sortOrder: "desc"
                    },
                    xfdwdm: "" //主战中队代码
                },
                xfdwdmName: "",//主战中队名称
                dicCzqk: [],
                initStatus:false
            };
        },
        created() {
            // 新需求：注释掉 2020.2.25
            // this.formData.ksrq = getNearlyRecentDays(30)[0].substr(0,10);
            // this.formData.jsrq = getNearlyRecentDays(30)[1].substr(0,10);
            if(this.$route.query.shzt){
              this.formData.shzt = this.$route.query.shzt;
              this.formData.ksrq = "";
              this.formData.jsrq = "";
              this.initStatus = true;
              this.$router.push({query:{}});
            }
            // this.searchCdxxHistoryDown();
            //获取查询条件，处置情况 下拉框option
            this.getDictsData();
            // 审核状态字典 列表数据
            this.getDicts("audit_status").then(response => {
                this.auditStatusListData = response.data;
            });
        },
        watch: {
            '$route' (to, from) {
              if(from.name == 'Index' && this.$route.query.shzt){
                this.formData.ksrq = "";
                this.formData.jsrq = "";
                // 新增一个是否有从首页跳转过来的审核状态字段 shzt
                this.formData.shzt = this.$route.query.shzt;
                this.initStatus = true;
                this.searchCdxxHistoryDown();
                this.$router.push({query:{}});
              }else{
                this.initStatus = false;
              }
            }
        },
        methods: {
            //处置情况
            getDictsData() {
                this.getDicts("tb_dic_czqk").then(res => {
                    if (res.code == 200) {
                        this.dicCzqk = res.data;
                    } else {
                        this.dicCzqk = [];
                    }
                });
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
            // 分页
            getList(val) {
                const {limit, page} = val;
                this.searchCdxxHistoryDown();
            },
            // 清空表单数据
            cleanData() {
                this.formData = {
                    cdbh: "",
                    jqbh: "",
                    xzqymc: "",
                    xzqydm: "",
                    timeLong: [],
                    jqfsdd: "",
                    sjlbdm: "",
                    czxsdm: "",
                    shzt: "",
                    czqkdm: "",
                    ksrq: getNearlyRecentYear(2019)[0], //查询开始日期
                    jsrq: getNearlyRecentYear(2019)[1], //查询结束日期
                    // ksrq: "", //查询开始日期
                    // jsrq: "", //查询结束日期
                    params: {
                        beginTime: getNearlyRecentYear(2019)[0],
                        endTime: getNearlyRecentYear(2019)[1],
                        // ksrq: "", //查询开始日期
                        // jsrq: "", //查询结束日期
                        // 依据排序的属性名称（从 table 返回的数据中获取）
                        sortField: "tbsj",
                        sortOrder: "desc"
                    },
                    xfdwdm: "" //主战中队代码
                };
                this.xfdwdmName = "";//主战中队名称
                this.$refs.dateTimeRange.clear();
            },
            jumpXq({cdbh, shzt}) {
                this.$router.push({
                    // path: '/dataEntry/lscdxq',
                    name: "出动信息详情",
                    query: {
                        cdbh,
                        shzt
                        //  cdbh:123123123
                    }
                });
            },
            //修改
            editXq(val) {
                this.$router.push({
                    path: "/dataEntry/cdxxModify",
                    query: {
                        cdbh: val.cdbh,
                        respondType: val.respondType,
                        isFirstarrive: val.isFirstarrive == "Y" ? true : false
                    }
                });
            },
            submitData() {
                this.searchCdxxHistoryDown();
            },
            searchCdxxHistoryDown() {
                const $this = this;
                $this.listDataLoading = true;
                // 组装数据
                let {pageNum, pageSize} = this.queryParams;
                let params = {...$this.formData};
                params.pageNum = pageNum;
                params.pageSize = pageSize;
                params.params.beginTime = $this.formData.ksrq;
                params.params.endTime = $this.formData.jsrq;
                // 新增一个是否是从首页跳转过来的字段 pageFlag = 1
                // params.pageFlag = this.$route.query.pageFlag;
                historyCdxx
                    .searchCdxxHistoryDown(params)
                    .then(res => {
                        if (res.code == 200) {
                            if (!res.data.hasresult) {
                                this.listData = [];
                                this.queryParams.total = 0;
                                 if(this.listData.length == 0){
                                this.querydata = false;}
                                return;
                            }
                            // console.log(res.data.table.rows)
                            this.listData = res.data.table.rows;
                            this.queryParams.total = res.data.table.total;

                        }
                    })
                    .finally(() => {
                        $this.listDataLoading = false;
                    });
            },
            openProvModal() {
                this.$refs.provModal.toggle();
            },
            setProvValue(obj, {first, second, third, last}) {
                this.formData.xzqydm = obj.id;
                this.formData.xzqymc = `${first} ${second} ${third} ${last}`;
            },
            // setProvValue(obj, name) {
            // 	this.formData.xzqydm = obj.id;
            // 	this.formData.xzqymc = name;
            // },
            clearQhyyMul() {
                this.formData.xzqydm = this.formData.xzqymc = "";
            },
            formatShzt(val) {
                const filterData = this.auditStatusListData.find(
                    element => element.dictValue == val
                );
                return filterData ? filterData.dictLabel : "-";
            },
            paramTimeChange(val) {
                let nowChangeGettime = new Date(val).getTime();
                if (this.formData.ksrq && this.formData.jsrq) {
                    let ksrqGettime = new Date(this.formData.ksrq).getTime();
                    let jsrqGettime = new Date(this.formData.jsrq).getTime();
                    if (ksrqGettime > jsrqGettime) {
                        this.$message.warning("开始时间不能大于结束时间");
                        if (nowChangeGettime == ksrqGettime) {
                            //如果当前选的是开始时间，开始时间恢复到初始时间
                            this.formData.ksrq = getNearlyRecentDays(30)[0].substr(0,10); // 起止时间
                        } else if (nowChangeGettime == jsrqGettime) {
                            //如果当前选的是结束时间，结束时间恢复到初始时间
                            this.formData.jsrq = getNearlyRecentDays(30)[1].substr(0,10); // 截止时间
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
                    if (prop === "respondType") {
                        prop = "respond_type";
                    }
                    // 转换数据
                    this.formData.params.sortField = prop;
                    this.formData.params.sortOrder = dictionaries[order];
                    // this.searchCdxxHistoryDown();
                }
            },
            // 将树形中的值赋值给责任大区 input id 付给hidden input
            setDutyValue(data) {
                this.formData.xfdwdm = data.deptId;
                this.xfdwdmName = data.deptName;
            },
            // 打开责任大区模态框 并 回显
            openDutyModal() {
                this.$refs.modal.echo(this.xfdwdmName);
                this.$refs.modal.toggle();
            },
            cleanDutyModal() {
                this.formData.xfdwdm = "";
                this.xfdwdmName = "";
            },
            dateChange(data) {
              this.formData.ksrq = data.ksrq;
              this.formData.jsrq = data.jsrq;
            }
        }
    };
</script>
<style lang="scss" scoped>
    @import "~@/assets/styles/variables.scss";

    .app-container {
        .title {
            border-bottom: 1px solid $borderColor;
            padding-bottom: 12px;
            margin-bottom: 15px;
            h2 {
                margin: 0px;
                margin-right: auto;
                height: 32px;
                line-height: 32px;
                font-weight: 400;
                color: $titleColor;
                font-size: 18px;
                padding-left: 32px;
                background-image: url("~@/views/data/entry/cdxx/image/icon-hx.png");
                background-repeat: no-repeat;
                background-position: 0 50%;
                background-size: 23px;
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
        .hx-body {
            .el-row {
                .el-col {
                    .el-form-item {
                        width: 93%;
                        height: 32px;
                        line-height: 32px;
                        .el-input,
                        .el-select {
                            width: 100%;
                        }
                    }
                    .divIncludeTime {
                        height: 32px;
                        position: relative;
                        display: inline-block;
                        .line {
                            text-align: center;
                        }
                    }
                }
            }
        }
    }
</style>
