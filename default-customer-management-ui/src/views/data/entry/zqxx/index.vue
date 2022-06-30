<template lang="pug">
    .disasterInfomation
        .list(v-if="show === 'A'")
            .box
                .title
                    h2 {{ $route.meta.title }}
                    //- el-dropdown(trigger="click" @command="handleCommand")
                    el-button(@click="creatJqAndZq") 未出动火灾填报
                    el-button(type="primary" @click="handleCommand") 新建草稿
                .body
                    el-tabs(v-model="activeName" @tab-click="handleClick")
                        el-tab-pane(label="待填报清单" name="first")
                            .listTable
                                el-table(:data="tabledata" style="width: 100%" @sort-change="tableSortChangeHandle"
                                    :default-sort="{prop: 'tbsj', order: 'descending'}" v-loading="reportLoading")
                                    el-table-column(type="index" label="序号" width="50")
                                    el-table-column(prop="jjsj" label="接警时间" sortable="custom" width="140")
                                    el-table-column(prop="jqmc" label="警情名称" show-overflow-tooltip)
                                    el-table-column(prop="sender" label="发送单位" show-overflow-tooltip)
                                    el-table-column(prop="tbsj" label="发送时间" sortable="custom" width="140")
                                    //- el-table-column(prop="zqdjdm" label="火警类型" sortable width="120")

                                    //- el-table-column(prop="sjlbmc" label="警情类型" sortable width="120")
                                    el-table-column( label="操作" width="160")
                                        template(slot-scope="scope")
                                            //- 再次可分为轻微 一般 填报方式 根据zqlbdm 判断
                                            el-button(type="text" @click="writeReport(scope.row)") 填报
                                            el-button(type="text" @click="openHook(scope.row)") 导入
                                            el-button(type="text" @click="sendOtherPart(scope.row.jqbh)" :disabled='isgrade(scope.row)') 转派
                                el-pagination(v-show="total_yet > 0" @current-change="handleCurrentChange"  :page-size="pageSize" :current-page="currentPage" :total="total_yet" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" :page-sizes="pageSizes" style="text-align:right" background)
                        el-tab-pane(label="草稿信息列表" name="second")
                            .listTable
                                el-table(:data="yetAllData" style="width: 100%" :default-sort = "{prop: 'date', order: 'descending'}" @row-click="selectRow" v-loading="paperLoading")
                                    el-table-column(type="index" label="序号" width="50")
                                    el-table-column(prop="zqsj" label="起火时间" width="140" align="center")
                                    el-table-column(prop="zqdd" label="起火地点" show-overflow-tooltip)
                                    el-table-column(prop="qhcslb" label="起火场所" show-overflow-tooltip)
                                    el-table-column(prop="qhwms" label="起火物" width="150")
                                    el-table-column(prop="hzyyms" label="起火原因" show-overflow-tooltip)
                                        template(slot-scope="scope") {{scope.row.hzyyms?scope.row.hzyyms:'-'}}
                                    el-table-column(prop="num" label="人员伤亡" width="100")
                                        template(slot-scope="scope") {{scope.row.num==0?'无':'有'}}
                                    el-table-column(label="操作" width="100")
                                        template(slot-scope="scope")
                                            el-button(type="text" @click="editData(scope.row)") 修改
                                            el-button(type="text" @click="delData(scope.row.cgbh)") 删除
                                el-pagination(v-show="total_hook > 0" @current-change="handleCurrentChange_hook"  :page-size="pageSize_hook" :current-page="currentPage_hook" :total="total_hook" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChangehook" :page-sizes="pageSizes" style="text-align:right" background)
                    //- 导入弹出信息 火灾信息
                    el-dialog(title="已填报的火灾信息" :visible.sync="dialogVisible" width="80%" :before-close="handleClose" :append-to-body="true" v-loading="hookLoading")
                        span.dialog-title(slot="title")
                            span.table_title 已填报的火灾信息
                            el-input(v-model="queryInput" placeholder="全局搜索" style="width:40%;margin-left:30px" @keydown.native="hookquery")
                                i(slot="suffix" class="iconfont el-icon-search" style="line-height:32px" )
                        el-table(:data="yetAllData" style="width: 100%" :default-sort = "{prop: 'date', order: 'descending'}"  highlight-current-row @row-click="selectRow")
                            el-table-column(type="index" label="序号" sortable width="50")
                            el-table-column(prop="zqsj" label="接警时间" sortable width="130" align="center")
                            el-table-column(prop="zqdd" label="起火地点" sortable show-overflow-tooltip)
                            el-table-column(prop="qhcslb" label="起火场所" sortable show-overflow-tooltip )
                            el-table-column(prop="qhwms" label="起火物" sortable)
                            el-table-column(prop="hzyyms" label="起火原因" sortable show-overflow-tooltip)
                                template(slot-scope="scope") {{scope.row.hzyyms==undifined?'-':scope.row.hzyyms}}
                            el-table-column(prop="num" label="人员伤亡" sortable width="100")
                                template(slot-scope="scope") {{scope.row.num==0?'无':'有'}}
                            //- el-table-column( label="操作" width="100")
                            //- 		template(slot-scope="scope")
                            //- 			el-button(type="text") 操作
                        span.dialog-footer(slot="footer")
                            el-pagination(v-show="total_hook > 0" @current-change="handleCurrentChange_hook"  :page-size="pageSize_hook" :current-page="currentPage_hook" :total="total_hook" layout="total, prev, pager, next" style="text-align:center")
                            span.btn_back(@click="dialogVisible = false" ) 返 回
                            span.btn_orange(@click="affirmHookBtn" style="margin-left:10px") 确 认
                    //- 转派弹出列表信息 中队信息
                    el-dialog(title="火灾填报转派" :visible.sync="transportdialog" width="30%" :before-close="handleClose" :append-to-body="true" top="30vh")
                        el-form(:label-position="'right'" label-width="60px")
                            //- el-form-item(label="名称" require)
                            //- 	el-select(v-model="zddm" placeholder="请选择中队信息")
                            //- 		el-option(v-for="(item, index) in zdForm" :label="item.deptName" :value="item.deptId" :key="index")
                            //-
                            el-form-item(label="名称")
                                treeselect(
                                v-model="zddm"
                                    :options="zdForm"
                                        :normalizer="normalizer"
                                        :load-options="loadOptions"
                                        :disable-branch-nodes="true"
                                placeholder="选择转派消防救援站")
                        span.dialog-footer(slot="footer")
                            span.btn_orange(@click="confireTranfer") 确 认
        disasterSituationReport(:propfrom="propfrom" @back='back' v-if="show === 'B'")
        enterJqAndZqInfo(:propfrom="propfrom" @back='back' v-if="show === 'C'")
        el-dialog(title="请选择火灾等级" :visible.sync="selectInfo" :close-on-click-modal="false" :before-close="handleCloses"  width="30%!important" center)
            .content_dialog
                el-button(v-if="checked" @click="addNewDraft(2)" plain) 次级轻微火灾
                el-button(@click="addNewDraft(1)" type="primary" plain) 轻微火灾
                el-button(v-if="iszd" @click="addNewDraft(0)" type="success" plain) 非轻微火灾
                el-button(v-if="!iszd&&propfrom.jqbh" @click="backOtherPart()" type="warning" plain) 非轻微火灾(转回大队)
</template>

<script>
    // 查询未填报 转派 查询导入数据 确认导入 获取中队数据列表 导入查询列表
    import {
      queryYetFill,
      zqRedeploy,
      queryhook,
      affirmHook,
      getMiddleInfo,
      deleteCaogao,
      validateIsZd, backToZrqdd
    } from '@/api/data/entry/zqxx'
    import {getUserProfile} from "@/api/system/user";
    import {listDeptCheck} from "@/api/system/dept";
    import Treeselect from "@riophae/vue-treeselect";
    import "@riophae/vue-treeselect/dist/vue-treeselect.css";
    import disasterSituationReport from "./components/disasterInfomation";
    import enterJqAndZqInfo from "./components/enterJqAndZqInfo";
    import { personalSettings,showFlag} from "@/api/system/user";

    export default {
        name: "firereporting",
        components: {
            // 填报页面
            disasterSituationReport,
            enterJqAndZqInfo,
            Treeselect
        },
        data() {
            return {
                selectInfo: false,
                reportLoading: false, // 待填报清单loading
                paperLoading: true, // 草稿信息列表loading
                hookLoading: true, // 导入弹出列表loading
                activeName: "first",
                jqfsdd: "", // 警情地点
                zqlbdm: "", // 火灾类别编码
                zdForm: [], // 转派中队数组
                normalizer(node) {
                    return {
                        id: node.deptId,
                        label: node.deptName,
                        children: node.children
                    };
                },
                xzqydm: "",
                curjqbh: "", // 选择需要导入的jqbhq
                curcgbh: "", // 选择当前火灾信息 cgbh
                curzqlbbm: "", // 选择当前火灾信息zqlbbm
                zddm: null, // 中队dm
                zpjqbh: "", // 转派jqbh
                // 总条数
                total_yet: 0,
                total_hook: 0,
                // 当前页
                currentPage: 1,
                currentPage_hook: 1,
                // 每页显示条数
                pageSize: 10,
                pageSizes: [10, 20, 30, 50], // 每页显示条数
                pageSize_hook: 10,
                show: "A",
                enterJqAndZq: true,
                dialogVisible: false, // 导入dialog
                transportdialog: false, // 火灾转派dialog

                tabledata: [], // 待填报页面清单
                // 待填报页面清单分页
                tabledataPage: {
                    pageNum: 1,
                    pageSize: 10,
                    params: {
                        // 依据排序的属性名称（从 table 返回的数据中获取）
                        sortField: "tbsj",
                        sortOrder: "desc"
                    }
                },

                yetAllData: [], // 导入全部列表
                // 导入列表分页
                yetReportDataPag: {
                    pageNum: 1,
                    pageSize: 10
                },

                queryInput: "", // 查询模块
                state: false,
                propfrom: {
                    state: false, // 是否显示警情头部信息
                    jqbh: "", // 警情编号
                    zqlbdm: "", // 火灾编号
                    jqfsdd: "", // 警情发生地点
                    // 类型 0=新建草稿&新填报 , 1=审核,  2=草稿修改, 3=正式单修改
                    type: "0",
                    qwhz: "1",
                    isNotEdit: false // 判断当前是否是编辑态
                },
                iszd: false, //是否是中队
                undisaster:'', //是否未出动填报
                checked:false
            };
        },
        computed: {
            // yetSelectData(){
            // 	let arr = this.yetAllData.filter(item => {
            // 		return (item.zqdd && item.zqdd.indexOf(this.queryInput) !== -1)
            // 	});
            // 	this.total_hook = arr.length;
            // 	return arr.slice((this.currentPage_hook-1)*this.pageSize_hook,this.currentPage_hook*this.pageSize_hook);
            // }
        },
        created() {
            this.getTabList();
            validateIsZd().then(res => {
                if (res.code == 200) {
                    this.iszd = !res.data;
                }
            });
            showFlag().then(res => {
                if(res.code == '200'){
                    if(res.data == true){
                        personalSettings(1).then(res =>{
                            if(res.code == '200'){
                                if(res.data){
                                    if(res.data == 0){
                                        this.checked = true;
                                    }else {
                                        this.checked = false;
                                    }
                                }else {
                                    this.checked = false;
                                }
                            }
                        })
                    }else {
                        this.checked = false;
                    }
                }
            });
        },
        mounted() {
        },
        methods: {
            // 编辑
            editData(val) {
                this.propfrom.state = false;
                this.propfrom.zqbh = val.zqbh;
                this.propfrom.type = "2";
                // this.show = "B";
                this.selectInfo = true;
            },
            // 删除草稿信息
            delData(val) {
                this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    deleteCaogao({cgbh: val}).then(res => {
                        if (res.code == 200) {
                            this.$message({
                                showClose: true,
                                message: res.msg,
                                type: "success"
                            });
                            this.getTabList();
                        }
                    });
                });
            },
            // 切换table
            handleClick(tab) {
            },
            // 警情传递警情地点 jqbh
            writeReport(item) {
                personalSettings(1).then(res =>{
                    if(res.code == '200'){
                        if(res.data){
                            if(res.data == 0){
                                this.checked = true;
                            }else {
                                this.checked = false;
                            }
                        }else {
                            this.checked = false;
                        }
                    }
                })
                this.jqfsdd = item.jqfsdd;
                this.jqbh = item.jqbh;
                this.propfrom.jqfsdd = item.jqfsdd;
                this.propfrom.jqbh = item.jqbh;
                this.propfrom.state = true;
                this.propfrom.jjsj = item.jjsj;
                this.propfrom.zqbh = item.zqbh;
                this.selectInfo = true;
            },
            // 翻页
            handleCurrentChange(val) {
                this.tabledataPage.pageNum = val;
                this.queryYetFill();
            },
            // 导入翻页
            handleCurrentChange_hook(val) {
                this.currentPage_hook = val;
            },
            handleCloses() {
              this.selectInfo = false;
              this.undisaster = false;
              this.propfrom = {
                  state: false, // 是否显示警情头部信息
                  jqbh: "", // 警情编号
                  zqlbdm: "", // 火灾编号
                  jqfsdd: "", // 警情发生地点
                  // 类型 0=新建草稿&新填报 , 1=审核,  2=草稿修改, 3=正式单修改
                  type: "0",
                  qwhz: "1",
                  isNotEdit: false // 判断当前是否是编辑态
              }
            },
            addNewDraft(data) {
                if(this.data == 2){
                    this.propfrom.qwhz = "1";
                    this.propfrom.secondarySlightly = 0;
                }else {
                    this.propfrom.qwhz = data;
                    this.propfrom.secondarySlightly = 1;
                }
                this.selectInfo = false;
                if(this.undisaster){
                    this.show = "C";
                }else {
                    this.show = "B";
                }
                this.undisaster = false;
            },
            creatJqAndZq() {
              this.propfrom.jqfsdd = "";
              this.propfrom.jqbh = "";
              this.propfrom.state = false;
              this.propfrom.type = "0";
              this.selectInfo = true;
              this.undisaster = true;
            },
            // 判断是否为轻微火灾 1 是 0 否
            handleCommand() {
              this.propfrom.jqfsdd = "";
              this.propfrom.jqbh = "";
              this.propfrom.state = false;
              this.propfrom.type = "0";
              this.selectInfo = true;
            },
            // 时间格式化
            dateFormat(row, column, cellValue, index) {
                if (row.zqsj) {
                    return row.zqsj.substring(0, 9) + " " + row.zqsj.substring(14, 19);
                }
            },
            // 导入全局查询
            hookquery() {
                this.currentPage_hook = 1;
            },
            // 确认导入火灾信息
            affirmHookBtn() {
                if (this.curcgbh == "" || this.curjqbh == "" || this.curzqlbbm == "") {
                    this.$notify({
                        title: "警告",
                        message: "请选择导入火灾信息",
                        type: "warning"
                    });
                    return;
                }
                this.dialogVisible = false;
                affirmHook({
                    jqbh: this.curjqbh,
                    cgbh: this.curcgbh,
                    xzqydm: this.xzqydm,
                    zqlbdm: this.curzqlbbm
                }).then(res => {
                    // 制空
                    this.curjqbh = "";
                    this.curcgbh = "";
                    this.$message({
                        showClose: true,
                        message: "导入成功",
                        type: "success"
                    });
                    this.getTabList();
                });
            },
            // 导入选择火灾并且获取cgbh 和 zqlbdm
            selectRow(row) {
                // console.log(row.cgbh,"确认挂机cgbh数据")
                this.curcgbh = row.cgbh;
                this.curzqlbbm = row.zqlbdm;
            },
            back(val) {
                this.show = "A";
                this.getTabList();
                this.propfrom = {
                    state: false, // 是否显示警情头部信息
                    jqbh: "", // 警情编号
                    zqlbdm: "", // 火灾编号
                    jqfsdd: "", // 警情发生地点
                    // 类型 0=新建草稿&新填报 , 1=审核,  2=草稿修改, 3=正式单修改
                    type: "0",
                    qwhz: "1",
                    isNotEdit: false // 判断当前是否是编辑态
                }
            },
            // 1.打开导入框并且渲染列表  2.并且获取当前警情编号 jqbh
            openHook(val) {
                this.xzqydm = val.xzqydm;
                this.curjqbh = val.jqbh;
                this.dialogVisible = true;
            },
            handleClose(done) {
                done();
            },
            /**
             * [loadOptions 级连区域下拉树结构 ]
             * @Author       Miliky
             * @DateTime     2020-01-10T10:29:03+0800
             * @Description: [一行代码一行诗]
             * @param        {[type]}                 options.action     [description]
             * @param        {[type]}                 options.parentNode [description]
             * @param        {[type]}                 options.callback   [description]
             * @return       {[type]}                                    [description]
             */
            loadOptions({action, parentNode, callback}) {
                if (action === "LOAD_CHILDREN_OPTIONS") {
                    listDeptCheck({
                        parentId: parentNode.deptId,
                        deptLevel: parentNode.deptId.deptLevel
                    }).then(res => {
                        let treeList = res.data;
                        /**
                         * [for description]
                         * 循环遍历数据，判断是否有下级列表
                         * if hasChildren == true
                         * 将 children = null 点击触发加载下级列表动作
                         * if  hasChildren == false 则将 children = undefined
                         * 没有下级列表为叶子结点，点击时不会触发加载动作
                         *
                         * @Author       Miliky
                         * @DateTime     2020-01-10T10:29:58+0800
                         * @Description: [一行代码一行诗]
                         */
                        for (var index in treeList) {
                            if (treeList[index].hasChildren === true) {
                                treeList[index].children = null;
                            } else {
                                treeList[index].children = undefined;
                            }
                        }
                        parentNode.children = treeList;
                        callback();
                    });
                } else {
                    callback();
                }
            },
            // 转派列表渲染
            sendOtherPart(zpjqbh) {
                // 制空防止数字代码
                this.zdForm = [];
                this.transportdialog = true;
                this.zpjqbh = zpjqbh;
                // 获取当前中队中队信息
                let queryParams = {};
                /**
                 * [获取用户的行政区域信息，查询单位列表]
                 * @param  {Function} ).then(response [description]
                 * @return {[type]}                   [description]
                 */
                getUserProfile().then(response => {
                    queryParams.deptRoots = response.deptRoots;
                    if (response.data.admin) {
                        queryParams.deptRoots = 1000000000;
                    }
                    queryParams.deptLevel = response.data.dept.deptLevel;
                    listDeptCheck(queryParams)
                        .then(res => {
                            res.data.forEach(item => {
                                item.children = null;
                            });
                            this.zdForm = res.data;
                        })
                        .catch(res => {
                        });
                });
                // getMiddleInfo().then(res => {
                // 	this.zdForm = res.data
                // })
            },
          backOtherPart(){
              const jqbh = this.jqbh
              this.$confirm('中队不具备非轻微火灾调查权，是否确认转回大队调查填报！','警告',{
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              }).then(()=>{
                this.selectInfo = false;
                this.reportLoading = true;
                backToZrqdd({jqbh}).then(r=>{
                  if(r.code===200){
                    this.$message.success('转回成功！');
                    this.getTabList();
                  }else {
                    this.$message.error('转回失败！');
                    this.reportLoading = false;
                  }
                })
              }).catch(()=>{
              })
          },
            // 确认转派
            confireTranfer() {
                if (this.zddm == "") {
                    alert("请选择转派中队");
                    return;
                }
                this.transportdialog = false;
                zqRedeploy({
                    jqbh: this.zpjqbh,
                    zrqdddm: this.zddm
                }).then(res => {
                    this.$message({
                        showClose: true,
                        message: "转派成功",
                        type: "success"
                    });
                    this.getTabList();
                });
            },
            // 判断大队 or 中队 + 轻微警情判断
            isgrade(item) {
                var arr = item.ancestors.split(",");
                if (arr instanceof Array) {
                    if (arr.length < "6") {
                        //          if (arr.length < '6' && item.zqdjdm == '轻微') {
                        return false;
                    } else {
                        return true;
                    }
                }
            },
            /**
             * 获取待填报清单列表 数据
             */
            queryYetFill() {
                this.reportLoading = true;
                queryYetFill(this.tabledataPage)
                    .then(res => {
                        this.total_yet = res.total;
                        this.tabledata = res.rows;
                    })
                    .finally(() => {
                        this.reportLoading = false;
                    });
            },
            // 获取列表数据
            getTabList() {
                this.queryYetFill();
                // 导入弹出All列表
                queryhook(this.yetReportDataPag).then(res => {
                    // 数据初始化
                    this.yetAllData = [];
                    this.yetAllData = res.rows;
                    this.total_hook = res.total;
                    this.paperLoading = false;
                });
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
                    if (prop === "type") {
                        prop = "respond_type";
                    } else if (prop === "sjlbmc") {
                        prop = "sjlbdm";
                    } else if (prop === "sender") {
                        prop = "tbzh";
                    }
                    // 转换数据
                    this.tabledataPage.params.sortField = prop;
                    this.tabledataPage.params.sortOrder = dictionaries[order];
                    this.queryYetFill();
                }
            },
            handleSizeChange(val){
                this.tabledataPage.pageSize = val;
                this.queryYetFill();
            },
            handleSizeChangehook(val){
                this.yetReportDataPag.pageSize = val;
                this.getTabList();
            }
        }
    };
</script>

<style lang="stylus" scoped>
    .disasterInfomation
        margin 0px auto
        padding 10px
        background-color #F4F6F8
        .list
            .box
                background-color white
                min-height calc(100vh - 84px)
                padding 10px
                border-radius 3px
                border 1px solid #dae2ed
                .title
                    display flex
                    // justify-content: flex-end;
                    border-bottom 1px solid rgba(218, 226, 237, 1)
                    padding-left 32px
                    padding-bottom 12px
                    background-image url('./image/zqxx.png')
                    background-repeat no-repeat
                    background-size 22px
                    h2
                        margin 0px
                        margin-right auto
                        line-height 32px
                        font-weight 400
                        color rgba(57, 60, 65, 1)
                        font-size 18px
                    .btn_orange_zq
                        line-height 32px
                        width 86px
                        color #fff
                        cursor pointer
                        text-align center
                        border-radius 3px
                        background linear-gradient(90deg, rgba(255, 164, 102, 1) 0%, rgba(251, 89, 56, 1) 100%)
                .body
                    .el-table
                        .sign:before
                            content '·'
                            font-size 16px
                            font-weight bolder
                            color red

    .el-dialog__wrapper
        .el-dialog
            background-color #000000
            .el-dialog__header
                border-bottom 1px solid rgba(218, 226, 237, 1)
            .content_dialog
                text-align center
                height  3.5rem
</style>

<style lang="stylus">
    .el-button--warning
        // color #fff;
        // background:linear-gradient(90deg,rgba(255,164,102,1) 0%,rgba(251,89,56,1) 100%);
        .el-dialog__header
            border 1px solid rgba(218, 226, 237, 1)
            .dialog-title
                .table_title
                    height 36px
                    font-size 18px
                    font-weight 600
                    color rgba(57, 60, 65, 1)
                    line-height 36px
                    margin-right 39px
        .el-pagination
            margin-top 15px !important
            margin-bottom 21px
            .el-pagination__total
                float right
        .btn_white_long
            display inline-block
            line-height 32px
            color #37394C
            cursor pointer
            text-align center
            border-radius 3px
            border 1px solid rgba(196, 205, 213, 1)
            width 120px
            height 32px
            background linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(241, 243, 245, 1) 100%)
            border-radius 3px
</style>
<style lang="stylus">
    .disasterInfomation
        .body
            .el-tabs
                .el-tabs__header
                    .el-tabs__nav-wrap:after
                        background-color #fff !important
            .el-pagination
                margin-top 15px !important
                margin-bottom 21px
                .el-pagination__total
                    float right
</style>
