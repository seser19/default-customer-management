<template lang="pug">
    .app-container
        .filter-main(v-if="!iSReviewing")
            .title
                h2 {{ $route.meta.title }}
            .examineBody
                //- h4.layout-small-title 自定义搜索

                el-form(ref="filterForm")
                    el-row
                        el-col(:span="7")
                            el-form-item(prop="")
                                el-input(v-model="formData.cdbh" placeholder="出动编号")
                        el-col(:span="7")
                            el-form-item(prop="")
                                el-input(v-model="formData.jqbh" placeholder="警情编号")
                        el-col(:span="10")
                            dateTimeRange(ref="dateTimeRange" :format="`date`" :isInit="initStatus" @selectTime="dateChange")
                        //el-col(:span="7")
                            el-form-item.divIncludeTime(prop="")
                                el-col(:span="11")
                                    el-date-picker(v-model="formData.ksrq"
                                        :clearable="false"
                                    value-format="yyyy-MM-dd"
                                        @change="paramTimeChange"
                                    type="date")
                                el-col.line(:span="2") -
                                el-col(:span="11")
                                    el-date-picker(v-model="formData.jsrq"
                                        :clearable="false"
                                    value-format="yyyy-MM-dd"
                                        @change="paramTimeChange"
                                    type="date")
                    el-row
                        el-col(:span="7")
                            el-form-item(prop="")
                                el-input(v-model="formData.xzqymc" placeholder="行政区域" :readonly="true" @focus="openProvModal()")
                                    i(slot="suffix" class="iconfont icon-icon-test" @click="openProvModal()")
                        el-col(:span="7")
                            el-form-item(prop="")
                                el-input(v-model="formData.jqfsdd" placeholder="警情地址")
                        el-col(:span="7")
                            el-form-item(prop="")
                                el-cascader(
                                style="width:100%"
                                ref="cascader"
                                v-model="formData.sjlbdm"
                                    :props="props"
                                placeholder="警情类型"
                                clearable
                                )
                                //- el-select(v-model="formData.sjlbdm" placeholder="警情类型")
                                //-   el-option(label="火灾扑救" value="010000000000")
                                //-   el-option(label="抢险救援" value="020000000000")
                        el-col(:span="1" style="margin-left: -15px")
                            el-button(type="primary" @click.prevent="submitData()") 查&nbsp;询
                        el-col(:span="1" style="margin-left: 15px")
                            el-button(@click.prevent="cleanData()") 重&nbsp;置
                        el-col(:span="7")
                            el-form-item(prop="")
                                el-select(v-model="formData.czxsdm" placeholder="参战形式")
                                    el-option(label="主战" value="010000")
                                    el-option(label="增援" value="020000")
                        //- el-col(:span="7")
                        //-   el-form-item(prop="")
                        //-     el-select(v-model="formData.shzt" placeholder="报告状态")
                        //-       el-option(label="未送审" value="0")
                        //-       el-option(label="审核中" value="1")
                        //-       el-option(label="已审核" value="2")
                        //-       el-option(label="审核终止" value="-1")
                //- el-form(ref="filterForm")
                  .row
                    el-form-item(prop="")
                      el-input(v-model="formData.cdbh" placeholder="出动编号")
                    el-form-item(prop="")
                      el-input(v-model="formData.xzqymc" placeholder="行政区域" :readonly="true")
                        i(slot="suffix" class="iconfont icon-icon-test" @click="openProvModal()")
                    el-form-item(prop="")
                      el-input(v-model="formData.jqfsdd" placeholder="警情地址")
                    el-form-item(prop="")
                      //- el-date-picker(v-model="formData.jjsj" type="date" placeholder="接警时间" format="yyyy-MM-dd" value-format="yyyy-MM-dd")
                      el-date-picker( v-model="formData.timeLong" value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期")
                    div(class="btn_back" @click="cleanData()") 重置
                  .row
                    el-form-item(prop="")
                      el-input(v-model="formData.cdxfdw" placeholder="出战消防队")
                    el-form-item(prop="")
                      el-select(v-model="formData.respondType" placeholder="参战形式")
                        el-option(label="主战" value="010000")
                        el-option(label="增援" value="020000")
                    el-form-item(prop="")
                    div(class="btn_orange" @click="submitData()") 查询
                el-table(:data="tableData.rows" v-loading="tableDataLoading" style="width: 100%" @sort-change="tableSortChangeHandle" :default-sort="{prop: 'zjxgsj', order: 'descending'}")
                    el-table-column(prop="cdbh" label="出动编号" width="150" sortable="custom")
                    el-table-column(prop="jqbh" label="警情编号" width="150" sortable="custom")
                    el-table-column(prop="jjsj" label="接警时间" width="150" sortable="custom")
                        template(slot-scope="scope") {{scope.row.jjsj || '-'}}
                    el-table-column(prop="xzqydm" label="行政区域" width="150"  sortable="custom")
                        template(slot-scope="scope") {{scope.row.xzqydm || '-'}}
                    el-table-column(prop="jqfsdd" label="警情地址" width="140" show-overflow-tooltip)
                        template(slot-scope="scope") {{scope.row.jqfsdd || '-'}}
                    el-table-column(prop="sjlbdm" label="警情类型" width="140" show-overflow-tooltip sortable="custom")
                        template(slot-scope="scope") {{scope.row.sjlbmc || '-'}}
                    el-table-column(prop="respondType" label="参战形式" width="100" sortable="custom")
                        template(slot-scope="scope") {{scope.row.respondType=='010000'?'主战':'增援'}}
                    el-table-column( label="投入力量" width="80")
                        template(slot-scope="scope") {{scope.row.carCount||0}}车{{scope.row.trrys||0}}人
                    el-table-column(prop="xfdwdm" label="出动队伍" width="100" show-overflow-tooltip sortable="custom")
                    //- el-table-column(prop="respondType" label="参战形式" width="80")
                      template(slot-scope="scope")
                        span(v-show="scope.row.respondType == '010000'") 主战
                        span(v-show="scope.row.respondType == '020000'") 增援
                        span(v-show="scope.row.respondType != '010000' && scope.row.respondType != '020000'") -
                    el-table-column(prop="tbsj" label="填报时间" width="150" sortable="custom")
                    el-table-column(prop="state" label="操作" width="100")
                        template(slot-scope="scope")
                            el-button(type="text" @click="toReviewing(scope.row.cdbh)") 审核
                pagination(v-show="queryParams.total>0"
                    :total="queryParams.total"
                        :page.sync="queryParams.pageNum"
                        :limit.sync="queryParams.pageSize"
                        @pagination="getList")
            //- 行政区域
            prov-modal(ref="provModal" @setProv="setProvValue")
        //- 出动 新增/修改/审核 组件
        reporting-police(:draft="draft" @back="back" v-else)
</template>

<script>
    import {getRespondList} from "@/api/data/aduit/cdxx";
    import {getJqcdlb} from "@/api/data/entry/jqxx";
    // 行政区域 组件
    import provModal from "@/views/data/entry/jqxx/components/provModal";
    // import provModal from "@/views/components/selectArea/provModal";
    // 出动 新增/修改/审核 组件
    import ReportingPolice from "@/views/data/entry/cdxx/components/ReportingPolice.vue";
    import {getNearlyRecentDays} from "@/utils/dateTimeUtils.js";
    import dateTimeRange from "@/views/components/dateTime/dateTimeRange.vue"

    export default {
        name: "dispatchaudit",
        components: {
            provModal,
            ReportingPolice,
            dateTimeRange
        },
        data() {
            return {
                // 是否审核中
                iSReviewing: false,
                // option: [],
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
                // 出动 新增/修改/审核 组件 需要的数据
                draft: {
                    // 出动编号
                    cdbh: "",
                    // 是否展示顶部列表
                    isNew: true,
                    // 是否首到
                    isFirstarrive: false,
                    // 主战 || 增援
                    respondType: "010000",
                    // 审核时专用的 boolean 值
                    reviewing: true
                },
                // 检索表单
                // formData: {
                //   xzqydm: "", // 行政区域代码
                //   xzqymc: "", // 行政区域名称
                //   jqfsdd: "", // 警情地址
                //   cdxfdw: "", // 出动队伍伍代码
                //   respondType: "", // 参战形式代码
                //   timeLong: [],
                //   beginTime: "",
                //   endTime: ""
                // },
                queryParams: {
                    total: 0,
                    pageNum: 1,
                    pageSize: 20
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
                    ksrq: "", //查询开始日期
                    jsrq: "", //查询结束日期
                    params: {
                        beginTime: "",
                        endTime: "",
                        // 依据排序的属性名称（从 table 返回的数据中获取）
                        sortField: "zjxgsj",
                        sortOrder: "desc"
                    }
                },
                tableData: {},
                tableDataLoading: false,
                //跳转详情页面数据
                jumpPageData: {
                    cdbh: ""
                },
                initStatus: false
            };
        },
        created() {
            // this.submitData();
            // 新需求：注释掉 2020.2.25
            this.formData.ksrq = getNearlyRecentDays(30)[0].substr(0,10);
            this.formData.jsrq = getNearlyRecentDays(30)[1].substr(0,10);
            // 新增一个是否有从首页跳转过来的审核状态字段 shzt
            if(this.$route.query.shzt){
              this.formData.ksrq = "";
              this.formData.jsrq = "";
              this.initStatus = true;
            }
        },
      mounted() {
        const query = this.$route.query
        query.shzt? this.cleanData():''
        this.submitData()
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
            // 分页
            getList(val) {
                const {limit, page} = val;
                this.submitData();
            },
            /**
             * 审核组件操作 回调
             */
            back(val) {
                this.iSReviewing = false;
                this.resetForm("filterForm");
                this.submitData();
            },
            //清空表单数据
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
                    ksrq: "", //查询开始日期
                    jsrq: "", //查询结束日期
                    params: {
                        beginTime: "",
                        endTime: "",
                        // 依据排序的属性名称（从 table 返回的数据中获取）
                        sortField: "zjxgsj",
                        sortOrder: "desc"
                    }
                };
                this.$refs.dateTimeRange.clear();
            },
            //提交数据
            submitData() {
                const $this = this;

                $this.tableDataLoading = true;
                // 组装数据
                let {pageNum, pageSize} = this.queryParams;
                let params = {...$this.formData};
                params.pageNum = pageNum;
                params.pageSize = pageSize;
                params.params.beginTime = $this.formData.ksrq;
                params.params.endTime = $this.formData.jsrq;

                getRespondList(params)
                    .then(res => {
                        if (res.data.hasresult && res.data.table.code === 200) {
                            this.tableData = res.data.table;
                            this.queryParams.total = res.data.table.total;
                        } else {
                            this.tableData = {};
                            this.queryParams.total = 0;
                        }
                    })
                    .finally(() => {
                        $this.tableDataLoading = false;
                    });
            },
            /**
             * 打开 审核 组件
             */
            toReviewing(cdbh) {
                this.iSReviewing = true;
                this.draft.cdbh = cdbh;

                // this.$router.push({
                //   path: "/showDetail/cdxxShowDetail",
                //   query: {
                //     cdbh: cdbh
                //   }
                // });
            },
            /**
             * 打开行政区域选择框
             */
            openProvModal() {
                this.$refs.provModal.toggle();
            },
            setProvValue(obj, {first, second, third, last}) {
                this.formData.xzqydm = obj.id;
                this.formData.xzqymc = `${first} ${second} ${third} ${last}`;
            },
            // setProvValue(obj, name) {
            //   this.formData.xzqydm = obj.id;
            //   this.formData.xzqymc = name;
            // },
            /**
             * 详情按钮
             * val 出动编号
             */
            detailsBtn(val) {
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
                            this.formData.ksrq = getNearlyRecentDays(30)[0]; // 起止时间
                        } else if (nowChangeGettime == jsrqGettime) {
                            //如果当前选的是结束时间，结束时间恢复到初始时间
                            this.formData.jsrq = getNearlyRecentDays(30)[1]; // 截止时间
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
                    this.submitData();
                }
            },
            dateChange(data) {
              this.formData.ksrq = data.ksrq;
              this.formData.jsrq = data.jsrq;
            }
        }
    };
</script>

<style lang="stylus" scoped>
    .app-container
        .title
            border-bottom 1px solid rgba(218, 226, 237, 1)
            padding-bottom 12px
            margin-bottom 15px
            h2
                margin 0px
                margin-right auto
                height 32px
                line-height 32px
                font-weight 400
                color rgba(57, 60, 65, 1)
                font-size 18px
                padding-left 32px
                background-image url('../image/icon-cdxxsh.png')
                background-repeat no-repeat
                background-position 0 50%
                background-size 24px
        .examineBody
            h4
                margin-bottom 15px
            .el-row
                .el-col
                    .el-form-item
                        height 32px
                        line-height 32px
                        width 93%
                        .el-input, .el-select
                            width 100%
                    .divIncludeTime
                        height 32px
                        position relative
                        display inline-block
                        .line
                            text-align center

    .row
        display flex
        justify-content space-between
        .btn_orange, .btn_back
            padding 0 30px
        .el-form-item
            flex 1
            margin-right 20px
            width 30%
            .el-select, .el-input, .el-range-editor, .el-cascader
                width 85%
        .hidden
            visibility hidden
</style>
