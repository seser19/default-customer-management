<template lang="pug">
    .disasterInfomation
        .list(v-if="show === 'A'")
            .box
                .title
                    h2 {{ $route.meta.title }}
                    //- el-dropdown(trigger="click" @command="handleCommand")
                    //- el-button(@click="creatJqAndZq") 未出动火灾填报
                    //- el-button(type="primary" @click="handleCommand") 新建草稿
                .body
                    .report-loading-cover(v-loading="reportLoading" element-loading-text="正在下载,请稍后...")
                    .listTable
                        el-table(:data="tabledata" style="width: 100%" @sort-change="tableSortChangeHandle"
                            :default-sort="{prop: 'createTime', order: 'descending'}")
                            el-table-column(type="index" label="序号" width="50")
                            el-table-column(prop="title" label="标题" show-overflow-tooltip  width="140")
                            el-table-column(prop="details" label="详情" show-overflow-tooltip)
                            el-table-column(prop="type" label="类型" show-overflow-tooltip)
                            el-table-column(prop="status" label="状态" width="140")

                            el-table-column( label="操作" width="160")
                                template(slot-scope="scope")
                                    //- 再次可分为轻微 一般 填报方式 根据zqlbdm 判断
                                    //- el-button(type="text" @click="writeReport(scope.row)") 填报
                                    el-button(type="text" @click="openHook(scope.row)") 导出报告
                                    //- el-button(type="text" @click="sendOtherPart(scope.row.jqbh)" :disabled='isgrade(scope.row)') 转派
                        el-pagination(v-show="total_yet > 0" @current-change="handleCurrentChange"  :page-size="pageSize" :current-page="currentPage" :total="total_yet" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" :page-sizes="pageSizes"  style="text-align:right" background)

</template>

<script>
import {downloadWord} from "@/utils/download-word.js";
import request from '@/utils/request';
import {getYpbgList} from "@/api/data/yp/ypbg";


export default {
    name: "reporttemplate",
    components: {
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
                // 类型 0填报 1审核 2草稿修改
                type: "0",
                qwhz: "1",
                isNotEdit: false // 判断当前是否是编辑态
            },
            iszd: false //是否是中队
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
        // validateIsZd().then(res => {
        //     if (res.code == 200) {
        //         this.iszd = !res.data;
        //     }
        // });
    },
    mounted() {},
    methods: {
        // 编辑
        editData(val) {
            this.propfrom.state = false;
            this.propfrom.zqbh = val.zqbh;
            this.propfrom.type = "2";
            this.show = "B";
        },
        // 删除草稿信息
        delData(val) {
            this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                deleteCaogao({ cgbh: val }).then(res => {
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
        handleClick(tab) {},
        // 警情传递警情地点 jqbh
        writeReport(item) {
            this.$confirm("请选择火灾等级?", "提示", {
                distinguishCancelAndClose: true,
                confirmButtonText: "非轻微火灾",
                cancelButtonText: "轻微火灾",
                showConfirmButton: this.iszd,
                type: "warning",
                center: true
            })
                .then(() => {
                    this.jqfsdd = item.jqfsdd;
                    this.jqbh = item.jqbh;
                    this.propfrom.jqfsdd = item.jqfsdd;
                    this.propfrom.jqbh = item.jqbh;
                    this.propfrom.state = true;
                    this.propfrom.qwhz = "0";
                    this.show = "B";
                    // this.selectInfo = true;
                })
                .catch(action => {
                    if (action === "cancel") {
                        this.jqfsdd = item.jqfsdd;
                        this.jqbh = item.jqbh;
                        this.propfrom.jqfsdd = item.jqfsdd;
                        this.propfrom.jqbh = item.jqbh;
                        this.propfrom.state = true;
                        this.propfrom.qwhz = "1";
                        this.show = "B";
                    }
                });
        },
        // 翻页
        handleCurrentChange(val) {
            this.tabledataPage.pageNum = val;
            this.queryYetFill();
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
        },
        // 1.打开导入框并且渲染列表  2.并且获取当前警情编号 jqbh
        openHook(val) {
            // this.xzqydm = val.xzqydm;
            // this.curjqbh = val.jqbh;
            // this.dialogVisible = true;
            this.reportLoading = true;
            request({
			    url: val.exportLink,//"wordReport/getReportInfos?year=2020",
			    method: 'post'
			  }).then((res)=>{
			  	this.reportLoading = false;
			  	console.log(res);
			  	downloadWord(val.title,res.data.stream,val.extend2);
			  }).catch(res=>{
			  	this.reportLoading = false;
			  });

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
        loadOptions({ action, parentNode, callback }) {
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
                    .catch(res => {});
            });
            // getMiddleInfo().then(res => {
            // 	this.zdForm = res.data
            // })
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
            let res = {
                total: 36,
                rows: [
                    {
                        title: "综合研判报告",
                        details:"警情、出动、火灾数据的综合研判数据",
                        type: "综合",
                        status: "正常"
                    }
                ],
                code: 200,
                msg: 0
            };
            this.tabledata = res.rows;
        },
        // 获取列表数据
        getTabList() {
          	//  this.queryYetFill();
			//  类型 type : 1 综合  2 警情  3 出动 4 火灾
			//	状态 status： 1 正常
            getYpbgList(this.tabledataPage).then(res => {
                // 数据初始化
               this.total = res.total;

				this.tabledata = res.rows.map(item=>{
					if(item.type == 1) {
						item.type = "综合";
					} else if(item.type == 2) {
						item.type = "警情";
					} else if(item.type == 3) {
						item.type = "出动";
					} else if(item.type == 4) {
						item.type = "火灾";
					}
					if(item.status == 1) {
						item.status = "正常";
					} else {
						item.status = "";
					}
					return item;
				});

//             this.tabledata = res.rows;
               this.loading = false;
            });

            // 导入弹出All列表
            // queryhook(this.yetReportDataPag).then(res => {
            //     // 数据初始化
            //     this.yetAllData = [];
            //     this.yetAllData = res.rows;
            //     this.total_hook = res.total;
            //     this.paperLoading = false;
            // });
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
        handleSizeChange(val) {
            this.tabledataPage.pageSize = val;
            this.queryYetFill();
        },
        handleSizeChangehook(val) {
            this.yetReportDataPag.pageSize = val;
            this.getTabList();
        }
    }
};
</script>

<style lang="stylus" scoped>
.disasterInfomation {
    margin: 0px auto;
    padding: 10px;
    background-color: #F4F6F8;

    .list {
        .box {
            background-color: white;
            min-height: calc(100vh - 84px);
            padding: 10px;
            border-radius: 3px;
            border: 1px solid #dae2ed;

            .title {
                display: flex;
                // justify-content: flex-end;
                border-bottom: 1px solid rgba(218, 226, 237, 1);
                padding-left: 32px;
                padding-bottom: 12px;
                background-image: url('./image/zqxx.png');
                background-repeat: no-repeat;
                background-size: 22px;

                h2 {
                    margin: 0px;
                    margin-right: auto;
                    line-height: 32px;
                    font-weight: 400;
                    color: rgba(57, 60, 65, 1);
                    font-size: 18px;
                }

                .btn_orange_zq {
                    line-height: 32px;
                    width: 86px;
                    color: #fff;
                    cursor: pointer;
                    text-align: center;
                    border-radius: 3px;
                    background: linear-gradient(90deg, rgba(255, 164, 102, 1) 0%, rgba(251, 89, 56, 1) 100%);
                }
            }

            .body {
                .el-table {
                    .sign:before {
                        content: '·';
                        font-size: 16px;
                        font-weight: bolder;
                        color: red;
                    }
                }
                .report-loading-cover {
            		    width: 100%;
				    top: 150px;
				    left: 0;
				    height: 100%;
				    background: transparent;
				    position: absolute;

                }
                .el-loading-spinner {
                		top: 20%;
                		margin-top: 0;
                }
            }
        }
    }
}

.el-dialog__wrapper {
    .el-dialog {
        background-color: #000000;

        .el-dialog__header {
            border-bottom: 1px solid rgba(218, 226, 237, 1);
        }
    }
}
</style>

<style lang="stylus">
.el-button--warning {
    // color #fff;
    // background:linear-gradient(90deg,rgba(255,164,102,1) 0%,rgba(251,89,56,1) 100%);
    .el-dialog__header {
        border: 1px solid rgba(218, 226, 237, 1);

        .dialog-title {
            .table_title {
                height: 36px;
                font-size: 18px;
                font-weight: 600;
                color: rgba(57, 60, 65, 1);
                line-height: 36px;
                margin-right: 39px;
            }
        }
    }

    .el-pagination {
        margin-top: 15px !important;
        margin-bottom: 21px;

        .el-pagination__total {
            float: right;
        }
    }

    .btn_white_long {
        display: inline-block;
        line-height: 32px;
        color: #37394C;
        cursor: pointer;
        text-align: center;
        border-radius: 3px;
        border: 1px solid rgba(196, 205, 213, 1);
        width: 120px;
        height: 32px;
        background: linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(241, 243, 245, 1) 100%);
        border-radius: 3px;
    }
}
</style>
<style lang="stylus">
.disasterInfomation {
    .body {
        .el-tabs {
            .el-tabs__header {
                .el-tabs__nav-wrap:after {
                    background-color: #fff !important;
                }
            }
        }

        .el-pagination {
            margin-top: 15px !important;
            margin-bottom: 21px;

            .el-pagination__total {
                float: right;
            }
        }

        .report-loading-cover {
        		.el-loading-mask {
        			background: rgba(255,255,255,0.6);
        			.circular {
        				border: 1px solid #1890ff;
        				circle {
        					display: none;
        				}
        			}
        			.el-loading-text {
        				margin-top: 18px;
        			}
        		}
        	}
        	.listTable {
        		position: absolute;
        		top: 150px;
        		right: 20px;
    			left: 20px;
        	}
    }
}
</style>
