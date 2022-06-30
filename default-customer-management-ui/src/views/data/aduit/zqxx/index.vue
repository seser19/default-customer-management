<template lang="pug">
    .app-container
        .cdxxToExamine(v-if="!show")
            .title
                h2 {{ $route.meta.title }}
            .examineBody
                .search_zone
                    el-form(ref="searchForm" :model="formData")
                        el-row
                            el-col(:span="7")
                                el-form-item(prop="")
                                    el-input(v-model="xzqymc" placeholder="行政区域" clearable readonly @focus="openProvModal()")
                                        i(slot="suffix" class="iconfont icon-icon-test" @click="openProvModal()")
                            el-col(:span="7")
                                el-form-item(prop="")
                                    el-input(v-model="formData.jqmc" placeholder="警情名称" clearable)
                            el-col(:span="7")
                                el-form-item(prop="")
                                    el-input(v-model="showValue.hzyyname" placeholder="起火原因" clearable readonly @focus="openQhyy")
                                        i(slot="suffix" class="iconfont icon-icon-test" @click="openQhyy")
                            el-col(:span="3")
                                el-button(@click.prevent="cleanData()") 重&nbsp;置
                        el-row
                            el-col(:span="7")
                                el-form-item(prop="")
                                    el-select(v-model="formData.qwhz" placeholder="轻微火灾")
                                        el-option(label="是" value="1")
                                        el-option(label="否" value="0")
                            el-col(:span="14")
                                dateTimeRange(ref="dateTimeRange" :format="`date`" :isInit="initStatus" @selectTime="dateChange")
                            el-col(:span="0")
                                el-form-item(prop="" style="visibility:hidden")
                                    el-input(v-model="formData.hzyyfldm")
                            el-col(:span="3")
                                el-button(type="primary" @click.prevent="getData()") 查&nbsp;询
                .table_zone
                    el-table( style="width: 100%" :data="tableData" v-loading="loading" @sort-change="tableSortChangeHandle" :default-sort="{prop: 'tbsj', order: 'descending'}")
                        el-table-column(prop="zqbh" label="火灾编号" width="150" sortable show-overflow-tooltip)
                        el-table-column(prop="zqsj"
                        label="起火时间"
                        sortable
                        width="150"
                        show-overflow-tooltip)
                        el-table-column(prop="xzqydmsj" label="行政区域" width="150" sortable)
                            template(slot-scope="scope") {{scope.row.xzqydmsj || '-'}}
                            //- template(slot-scope="scope") {{scope.row.jqmc || '-'}}
                        el-table-column(prop="jqfsdd" label="警情地址" show-overflow-tooltip)
                            //- template(slot-scope="scope") {{scope.row.xzqydmsj || '-'}}
                        el-table-column(prop="qwhz" label="轻微火灾" sortable)
                            template(slot-scope="scope") {{scope.row.qwhz==1?'是':'否'}}
                        el-table-column(prop="qhcslb" label="起火场所" show-overflow-tooltip)
                            template(slot-scope="scope") {{scope.row.qhcslb||'-'}}
                        el-table-column(prop="qhwfldm" label="起火物" show-overflow-tooltip)
                        el-table-column(prop="hzyyfldm" label="起火原因" show-overflow-tooltip)
                            template(slot-scope="scope") {{scope.row.hzyyfldm || '-'}}
                        el-table-column(label="伤亡情况" width="80" show-overflow-tooltip)
                            template(slot-scope="scope") {{ scope.row.swnum }}死{{ scope.row.ssnum }}伤
                        el-table-column(prop="tbsj" label="填报时间" show-overflow-tooltip sortable)
                            template(slot-scope="scope") {{handleTime(scope.row.tbsj) || '-'}}
                        el-table-column(prop="state" label="操作" width="50")
                            template(slot-scope="scope")
                                el-link(type="primary" :underline="false" @click="goto(scope.row)") 审核
                                //- el-link(type="primary" :underline="false" disabled) 删除
                    .pagination_zone
                        el-pagination(v-show="total > 0" background
                        @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                                :current-page="currentPage"
                                :page-sizes="pageSizes"
                                :page-size="formData.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                            :total="total")
        modal(ref="qhcsModal" @setVal="setQhcs" :type="types.type1")
        modal(ref="qhyyModal" @setVal="setQhyy" :type="types.type2")
        prov-modal(ref="provModal" @setProv="setProvValue")
        detail(v-if="show" :propfrom="propfrom" @back='back')
</template>
<script>
    import {getList} from "@/api/data/aduit/zqxx";
    import modal from "@/views/components/searchModal/modal";
    import provModal from "@/views/data/entry/jqxx/components/provModal";
    // import provModal from '@/views/components/selectArea/provModal'
    import detail from "@/views/data/entry/zqxx/components/disasterInfomation";
    import {getNearlyRecentDays} from "@/utils/dateTimeUtils.js";
    import dateTimeRange from "@/views/components/dateTime/dateTimeRange.vue"

    export default {
        name: "fireauditing",
        components: {
            modal,
            provModal,
            detail,
            dateTimeRange
        },
        data() {
            return {
                loading: false,
                time: "", // 组件的时间数组
                xzqymc: "", // 行政区域名称
                showValue: {
                    qhcsname: "",
                    hzyyname: ""
                },
                formData: {
                    xzqydmSj: "", // 行政区域
                    qhcslb: "", // 起火场所
                    hzyyfldm: "", // 火灾原因
                    jqmc: "", // 警情名称
                    param: "", // 灾情时间(时间区间，参考用户管理界面)
                    pageNum: 1,
                    pageSize: 10,
                    ksrq: "", //查询开始日期
                    jsrq: "", //查询结束日期
                    qwhz: "", //轻微火灾
                    params: {
                        beginTime: "",
                        endTime: "",
                        // 依据排序的属性名称（从 table 返回的数据中获取）
                        sortField: "zjxgsj",
                        sortOrder: "desc"
                    }
                },
                // 模态框字典类别
                types: {
                    type1: "qhcs",
                    type2: "qhyy"
                },
                tableData: [],
                jqbh: "", // 传到详情页的编号
                show: false,
                // 总条数
                total: 0,
                // 当前页数
                currentPage: 1,
                // 每页显示条数
                pageSizes: [10, 20, 30, 50],
                propfrom: {
                    state: true,
                    jqbh: "", // 警情编号
                    zqlbdm: "", // 火灾编号
                    jqfsdd: "", // 警情发生地点
                    type: "1", // 填报为0；修改为1；
                    isNotEdit: false // 判断当前是否是编辑态
                },
                initStatus: false
            };
        },
        created() {
            // this.getData();
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
          this.getData()
      },
      methods: {
            // 切换详情页
            goto(item) {
                this.propfrom.jqbh = item.jqbh;
                this.propfrom.zqbh = item.zqbh;

                // 待定
                // this.propfrom.jqfsdd = item.jqfsdd;
                this.propfrom.zqlbdm = "10000";

                this.show = true;
            },
            back(val) {
                this.show = false;
                this.getData();
                // this.getTabList();
            },
            openQhcs() {
                this.$refs.qhcsModal.toggle();
                this.$refs.qhcsModal.echo(this.formData.qhcslb);
            },
            setQhcs(arr) {
                this.formData.qhcslb = arr[0].dictValue;
                this.showValue.qhcsname = arr[0].dictLabel;
            },
            openQhyy() {
                this.$refs.qhyyModal.toggle();
                this.$refs.qhyyModal.echo(this.formData.hzyyfldm);
            },
            setQhyy(arr) {
                this.formData.zrqdddm = arr[0].dictValue;
                this.showValue.hzyyname = arr[0].dictLabel;
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
                    qwhz: "", //轻微火灾
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
            handleTime(str) {
                let time = str;
                if (str !== undefined) {
                    time = str.slice(0, 10) + " " + str.slice(11, 16);
                }
                return time;
            },
            /**
             * 获取当前页面数据
             */
            getData() {
                this.loading = true;
                // 组装数据
                let params = {...this.formData};
                params.params.beginTime = this.formData.ksrq;
                params.params.endTime = this.formData.jsrq;

                getList(this.formData)
                    .then(res => {
                        // console.log(res);
                        this.total = res.total;
                        this.tableData = res.rows;
                        this.loading = false;
                    })
                    .catch(res => {
                        // console.error(res);
                        this.loading = false;
                    });
            },
            // 打开行政区域选择框
            openProvModal() {
                this.$refs.provModal.toggle();
            },
            // setProvValue(obj, name) {
            //   this.formData.xzqydmSj = obj.id
            //   this.xzqymc = name
            // },
            setProvValue(obj, {first, second, third, last}) {
                this.formData.xzqydmSj = obj.id;
                this.xzqymc = `${first} ${second} ${third} ${last}`;
            },
            // 分页
            handleSizeChange(val) {
                this.formData.pageSize = val;
                this.getData();
            },
            // 翻页
            handleCurrentChange(val) {
                this.formData.pageNum = val;
                this.getData();
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
                    if (prop === "xzqydmsj") {
                        prop = "xzqydm";
                    }
                    // 转换数据
                    this.formData.params.sortField = prop;
                    this.formData.params.sortOrder = dictionaries[order];
                    this.getData();
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
        // background-color: #F4F6F8;
        // padding: 10px;
        // min-height: calc(100vh - 84px);
        .cdxxToExamine
            // background: rgba(255, 255, 255, 1);
            // border-radius: 3px;
            // border: 1px solid rgba(218, 226, 237, 1);
            // padding: 15px 22px;
            font-size 14px
            font-weight 400
            color rgba(55, 57, 76, 1)
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
                    background-image url('../image/icon-zqxxsh.png')
                    background-repeat no-repeat
                    background-position 0 50%
                    background-size 24px
            .examineBody
                .search_zone
                    h4
                        font-size 16px
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
                .table_zone
                    font-size 14px
                    thead
                        background rgba(240, 244, 247, 1)
                    .pagination_zone
                        margin-top 20px
                        text-align right
</style>
