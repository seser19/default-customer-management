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
                            el-input(v-model="formData.jqbh" placeholder="警情编号" clearable)
                    el-col(:span="7")
                        el-form-item(prop="")
                            el-input(v-model="formData.xzqymc" placeholder="行政区域" :readonly="true" @focus="openProvModal()")
                                i(slot="suffix" class="iconfont icon-icon-test" @click="openProvModal()")
                                i(slot="suffix" class="el-icon-circle-close" style="margin-left:5px; cursor: pointer;" @click="clearQhyyMul"  v-show="formData.xzqymc")
                    el-col(:span="10")
                        dateTimeRange(ref="dateTimeRange" :format="`date`" :isInit="initStatus" @selectTime="dateChange")
                el-row
                    el-col(:span="7")
                        el-form-item(prop="")
                            el-input(v-model="formData.jqfsdd" placeholder="警情地址" clearable)
                    el-col(:span="7")
                        el-form-item(prop="")
                            el-cascader(class="el-input el-input--small el-input--suffix" ref="cascader" v-model="formData.sjlbdm" :props="props" placeholder="警情类型" clearable)
                    el-col(:span="7")
                        el-form-item(prop="")
                            el-select(v-model="formData.zt" placeholder="警情状态" clearable)
                                el-option(label="正常" value="1")
                                el-option(label="驳回" value="4")
                el-row
                    el-col(:span="2")
                        el-button(type="primary" @click.prevent="submitData()") 查&nbsp;询
                    el-col(:span="2")
                        el-button(@click.prevent="cleanData()") 重&nbsp;置
                    el-col(:span="7")
                        el-button(type="primary" @click="downloadResult()" v-show="listData.length > 0 && formData.ksrq && formData.jsrq" :loading="downloadLoading") 导&nbsp;出
            el-table(:data="listData" style="width: 100%" v-loading="listDataLoading" @sort-change="tableSortChangeHandle" :default-sort="{prop: 'tbsj', order: 'descending'}" :empty-text="querydata == true ? '点击按钮查询':'暂无数据'")
                el-table-column(prop="jqbh" label="警情编号" width="150" show-overflow-tooltip sortable="custom")
                el-table-column(prop="jjsj" label="接警时间" width="150" sortable="custom")
                    template(slot-scope="scope") {{scope.row.jjsj || '-'}}
                el-table-column(prop="xzqydm" label="行政区域"   sortable="custom"  show-overflow-tooltip)
                    template(slot-scope="scope") {{scope.row.xzqydm || '-'}}
                el-table-column(prop="jqfsdd" label="警情地址"   show-overflow-tooltip)
                    template(slot-scope="scope") {{scope.row.jqfsdd || '-'}}
                el-table-column(prop="sjlbdm" label="警情类型" show-overflow-tooltip sortable="custom")
                    template(slot-scope="scope") {{scope.row.sjlbmc || '-'}}
                el-table-column(prop="tbsj" label="派发时间" width="140" sortable="custom" show-overflow-tooltip)
                el-table-column(prop="fdsj" label="主战归队时间" width="140" sortable="custom" show-overflow-tooltip)
                    template(slot-scope="scope") {{scope.row.fdsj || '-'}}
                el-table-column(prop="zt" label="警情状态" width="100" sortable="custom")
                    //- template(slot-scope="scope")
                    //-     .pic(v-if="scope.row.zt == 0")
                    //-         img(src="@/views/icons/weisongshen.svg")
                    //-         span 待填报
                    //-     .pic(v-if="scope.row.zt == 1")
                    //-         img(src="@/views/icons/shenpizhong.svg")
                    //-         span 审核中
                    //-     .pic(v-if="scope.row.zt == 2")
                    //-         img(src="@/views/icons/yishenpi.svg")
                    //-         span 已审核
                    //-     .pic(v-if="scope.row.zt == -1")
                    //-         img(src="@/views/icons/beizhongzhi.svg")
                    //-         span 待修改
                    //-     .pic(v-if="scope.row.zt == -2")
                    //-         img(src="@/views/icons/tuihui.svg")
                    //-         span 被退回
                    //-     .pic(v-if="scope.row.zt == 99")
                    //-         img(src="@/views/icons/yiguidang.svg")
                    //-         span 已归档
                    //-     .pic(v-if="scope.row.zt == 4")
                    //-         img(src="@/views/icons/tuihui.svg")
                    //-         span 被驳回
                    //- span {{ formatShzt(scope.row.zt) }}
                el-table-column(prop="state" label="操作" width="80")
                    template(slot-scope="scope")
                        el-button(type="text" @click="jumpXq(scope.row)") 详情
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
    import {getJqcdlb,jqxxByTimeDownload,deriveFile} from "@/api/data/entry/jqxx";
    import {getNearlyRecentDays} from "@/utils/dateTimeUtils.js";
    // 主战
    import modal from "@/views/components/dataSeach/modal";
    import dateTimeRange from "@/views/components/dateTime/dateTimeRange.vue"
    import { downloadFile } from '@/utils/download-file';

    export default {
        name: "dispatchTimerangList",
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
                downloadLoading:false,
                queryParams: {
                    total: 0,
                    pageNum: 1,
                    pageSize: 10
                },
                formData: {
                    zt: "",//警情状态
                    jqbh: "",
                    xzqymc: "",
                    xzqydm: "",
                    timeLong: [],
                    jqfsdd: "",
                    sjlbdm: "",
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
                dicCzqk: [],
                initStatus:false
            };
        },
        created() {
            // 新需求：注释掉 2020.2.25
            this.formData.ksrq = getNearlyRecentDays(30)[0].substr(0,10);
            this.formData.jsrq = getNearlyRecentDays(30)[1].substr(0,10);
            if(this.$route.query.zt){
              this.formData.zt = this.$route.query.zt;
              this.formData.ksrq = "";
              this.formData.jsrq = "";
              this.initStatus = true;
              this.$router.push({query:{}});
            }
            // this.searchjqxxHistoryDown();
            //获取查询条件，处置情况 下拉框option
            this.getDictsData();
            // 审核状态字典 列表数据
            this.getDicts("audit_status").then(response => {
                this.auditStatusListData = response.data;
            });
        },
        watch: {
            '$route' (to, from) {
              if(from.name == 'Index' && this.$route.query.zt){
                this.formData.ksrq = "";
                this.formData.jsrq = "";
                // 新增一个是否有从首页跳转过来的审核状态字段 zt
                this.formData.zt = this.$route.query.zt;
                this.initStatus = true;
                this.searchjqxxHistoryDown();
                this.$router.push({query:{}});
              }else{
                this.initStatus = false;
              }
            }
        },
        methods: {
            //导出列表
            downloadResult(){
                // this.downloading = true;
                // const downloadParams = { ...this.queryParams };
                // delete downloadParams.pageNum;
                // delete downloadParams.pageSize;
                this.downloadLoading = true
                jqxxByTimeDownload(this.formData).then(response => {
                    console.log(112233,response);
                    downloadFile(`超时警情(${this.formData.ksrq}至${this.formData.jsrq})`, response.data.stream);
                }).finally(() => {
                    this.downloadLoading = false
                });
                // deriveFile(this.formData).then(response => {
                //     console.log(response);
                //     downloadFile(`超时出动(${this.formData.ksrq}至${this.formData.jsrq})`, response.data.stream);
                // }).finally(() => {
                //     this.downloadLoading = false
                // });
            },

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
                this.searchjqxxHistoryDown();
            },
            // 清空表单数据
            cleanData() {
                this.formData = {
                    zt: "",//警情状态
                    jqbh: "",
                    xzqymc: "",
                    xzqydm: "",
                    timeLong: [],
                    jqfsdd: "",
                    sjlbdm: "",
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
                };
                this.$refs.dateTimeRange.clear();
            },
            jumpXq(item) {
                // console.log(item,111);
                this.$router.push({
                    path: "/showDetail/jqxxShowDetail",
                    query: {
                        jqbh: item.jqbh
                    }
                });
            },
            //修改
            editXq(val) {
                this.$router.push({
                    path: "/dataEntry/cdxxModify",
                    query: {
                        respondType: val.respondType,
                        isFirstarrive: val.isFirstarrive == "Y" ? true : false
                    }
                });
            },
            submitData() {
                this.searchjqxxHistoryDown();
            },
            searchjqxxHistoryDown() {
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
                    .searchJqxxByTime(params)
                    .then(res => {
                        if (res.code == 200) {
                            if (!res.data.hasresult) {
                                this.listData = [];
                                this.queryParams.total = 0;
                                if(this.listData.length == 0){
                                this.querydata = false;
                            }
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
            // formatShzt(val) {
            //     const filterData = this.auditStatusListData.find(
            //         element => element.dictValue == val,
            //     );
            //     return filterData ? filterData.dictLabel : "-";
            // },
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
                    // this.searchjqxxHistoryDown();
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
        .el-button{
            margin-bottom: 10px;
        }
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
