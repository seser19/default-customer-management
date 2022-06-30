<template lang="pug">
    .app-container
        .title
            h2 {{ $route.meta.title }}
        .hx-body
            el-form()
                el-row
                    el-col(:span="7")
                        el-form-item(prop="")
                            el-input(v-model="formData.cdbh" clearable placeholder="出动编号")
                    el-col(:span="7")
                        el-form-item(prop="")
                            el-input(v-model="formData.jqbh" clearable placeholder="警情编号")
                    el-col(:span="7")
                        el-form-item(prop="")
                            el-select(v-model="formData.czxsdm" clearable placeholder="参战形式")
                                el-option(label="主战" value="010000")
                                el-option(label="增援" value="020000")
                    el-col(:span="3")
                        el-button(@click.prevent="cleanData()") 重&nbsp;置
                    //el-col(:span="7")
                        el-form-item.divIncludeTime(prop="")
                            el-col(:span="11")
                                el-date-picker(v-model="formData.ksrq"
                            //        :clearable="false"
                            //    value-format="yyyy-MM-dd"
                            //        @change="paramTimeChange"
                            //    type="date")
                            //el-col.line(:span="2") -
                            //el-col(:span="11")
                            //    el-date-picker(v-model="formData.jsrq"
                            //        :clearable="false"
                            //    value-format="yyyy-MM-dd"
                            //        @change="paramTimeChange"
                            //    type="date")
                el-row
                    el-col(:span="7")
                        el-form-item(prop="")
                            el-input(:value='xzqymc' clearable @input='xzqyChange' placeholder="行政区域" @focus="openProvModal()")
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
                            //- 	el-option(label="火灾扑救" value="010000000000")
                            //- 	el-option(label="抢险救援" value="020000000000")
                    el-col(:span="3")
                        el-button(type="primary" @click.prevent="submitData()") 查&nbsp;询
                    el-col(:span="7")
                        el-form-item(prop="")
                            el-select(v-model="formData.shzt" placeholder="报告状态" clearable)
                                el-option(v-for="item in auditStatusListData"
                                    :key="item.dictValue"
                                        :label="item.dictLabel"
                                        :value="item.dictValue")
                    el-col(:span="10")
                        dateTimeRange(ref="dateTimeRange" :format="`date`" @selectTime="dateChange")
            el-table(:data="listData" style="width: 100%" v-loading="listDataLoading" @sort-change="tableSortChangeHandle" :default-sort="{prop: 'jjsj', order: 'descending'}")
                el-table-column(prop="cdbh" label="出动编号" width="150" sortable="custom")
                el-table-column(prop="jqbh" label="警情编号" width="150" sortable="custom")
                el-table-column(prop="jjsj" label="接警时间" width="150" sortable="custom")
                    template(slot-scope="scope") {{scope.row.jjsj || '-'}}
                el-table-column(prop="xzqydm" label="行政区域" width="150"  sortable="custom")
                    template(slot-scope="scope") {{scope.row.xzqydm || '-'}}
                el-table-column(prop="jqfsdd" label="警情地址" show-overflow-tooltip)
                    template(slot-scope="scope") {{scope.row.jqfsdd || '-'}}
                el-table-column(prop="sjlbdm" label="警情类型" width="140" show-overflow-tooltip sortable="custom")
                    template(slot-scope="scope") {{scope.row.sjlbmc || '-'}}
                el-table-column(prop="respondType" label="参战形式" width="100" sortable="custom")
                    template(slot-scope="scope") {{scope.row.respondType=='010000'?'主战':'增援'}}
                el-table-column( label="投入力量" width="80")
                    template(slot-scope="scope") {{scope.row.carCount||0}}车{{scope.row.trrys||0}}人
                el-table-column(prop="shzt" label="报告状态" width="100" sortable="custom")
                    template(slot-scope="scope")
                        .pic(v-if="scope.row.shzt == 0")
                            img(src="../../../icons/weisongshen.svg")
                            span 未送审
                        .pic(v-if="scope.row.shzt == 1")
                            img(src="../../../icons/shenpizhong.svg")
                            span 审核中
                        .pic(v-if="scope.row.shzt == 2")
                            img(src="../../../icons/yishenpi.svg")
                            span 已审核
                        .pic(v-if="scope.row.shzt == -1")
                            img(src="../../../icons/beizhongzhi.svg")
                            span 待修改
                        .pic(v-if="scope.row.shzt == -2")
                            img(src="../../../icons/tuihui.svg")
                            span 被退回
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

</template>

<script>
    import {getAssigneeList} from "@/api/common";
    import {getJqcdlb} from "@/api/data/entry/jqxx";
    import provModal from "@/views/data/entry/jqxx/components/provModal";
    import {getNearlyRecentDays} from "@/utils/dateTimeUtils.js";
    import dateTimeRange from "@/views/components/dateTime/dateTimeRange.vue"

    export default {
        name: "audited",
        components: {
            provModal,
            dateTimeRange
        },
      computed:{
        xzqymc(){
          let str = ''
          if(this.formData.xzqymc){
            const {first,second,third,last} = this.formData.xzqymc
            str = first+second+third+last
          }
          return str
        }
      },
        data() {
            return {
                // 新增 审核状态字典 列表数据
                auditStatusListData: [],
                listData: [],
                listDataLoading: false,
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
                        sortField: "jjsj",
                        sortOrder: "desc"
                    }
                }
            };
        },
        created() {
            // this.queryCdxxAudit();
            // 新需求：注释掉 2020.2.25
            this.formData.ksrq = getNearlyRecentDays(30)[0].substr(0,10);
            this.formData.jsrq = getNearlyRecentDays(30)[1].substr(0,10);
            // 审核状态字典 列表数据
            this.getDicts("audit_status").then(response => {
                this.auditStatusListData = response.data;
            });
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
                this.queryCdxxAudit();
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
                    ksrq: "", //查询开始日期
                    jsrq: "", //查询结束日期
                    params: {
                        beginTime: "",
                        endTime: "",
                        // 依据排序的属性名称（从 table 返回的数据中获取）
                        sortField: "jjsj",
                        sortOrder: "desc"
                    }
                };
                this.$refs.dateTimeRange.clear();
            },
            jumpXq({cdbh, shzt}) {
                this.$router.push({
                    name: "出动信息详情",
                    query: {
                        cdbh,
                        shzt
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
                this.queryCdxxAudit();
            },
            queryCdxxAudit() {
                const $this = this;
                $this.listDataLoading = true;
                // 组装数据
                let {pageNum, pageSize} = this.queryParams;
                let params = {...$this.formData};
                // 查询列表类型(respond:出动；disaster:灾情)
                params.instType = "respond";
                params.pageNum = pageNum;
                params.pageSize = pageSize;
                params.params.beginTime = $this.formData.ksrq;
                params.params.endTime = $this.formData.jsrq;

                getAssigneeList(params)
                    .then(res => {
                        if (res.code === 200 && res.data.rows) {
                            this.listData = res.data.rows;
                            this.queryParams.total = res.data.total;
                        } else {
                            this.listData = [];
                            this.queryParams.total = 0;
                        }
                    })
                    .finally(() => {
                        $this.listDataLoading = false;
                    });
            },
            openProvModal() {
                this.$refs.provModal.toggle();
            },
            setProvValue(obj, name) {
                this.formData.xzqydm = obj.id;
                this.formData.xzqymc = name;
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
                    this.queryCdxxAudit();
                }
            },
            dateChange(data) {
              this.formData.ksrq = data.ksrq;
              this.formData.jsrq = data.jsrq;
            },
          xzqyChange(data){
              if(!data){
                this.formData.xzqymc='';
                this.formData.xzqydm = '';
              }
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
                // height: 32px;
                line-height: 32px;
                font-weight: 400;
                color: $titleColor;
                font-size: 18px;
                padding-left: 32px;
                background-image: url("../../entry/cdxx/image/icon-hx.png");
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
