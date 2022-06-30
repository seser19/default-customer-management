<template>
	<div class="detail_page">
		<div class="detail_content">
			<div class="detail_title">
				<div>{{taskDetail.taskname}}</div>
			</div>
			<div class="detail_describe">
				<el-form label-width="160px" class="demo-ruleForm" label-position="right">
					<el-row :gutter="0">
						<el-col :xs="24" :sm="12" :lg="8" :span="8">
							<el-form-item label="任务名称">
								<span>{{taskDetail.taskname}}</span>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :lg="8" :span="8">
							<el-form-item label="开始时间">
								<span>{{taskDetail.taskstarttime}}</span>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :lg="8" :span="8">
							<el-form-item label="结束时间">
								<span>{{taskDetail.taskendtime}}</span>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="0">
						<el-col :xs="24" :sm="12" :lg="8" :span="8">
							<el-form-item label="任务对象">
								<span v-if="taskDetail.checktype">{{checktypeList[taskDetail.checktype].name}}</span>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :lg="8" :span="8">
							<el-form-item label="转派给下级">
								<span v-if="taskDetail.isdownsend == '1'">允许</span>
								<span v-if="taskDetail.isdownsend == '0'">不允许</span>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :lg="8" :span="8">
							<el-form-item label="报告类型">
								<span>{{taskDetail.reporttype}}</span>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="0">
						<el-col :xs="24" :sm="12" :lg="6" :span="8">
							<el-form-item label="检查要求">
								<span>{{taskDetail.checkrequirement}}</span>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="0">
						<el-col :xs="24" :sm="12" :lg="6" :span="8">
							<el-form-item label="任务进度">
								<span>{{taskDetail.taskrate}}</span>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
				<div class="task-progress">
					<ul>
						<li v-for="item in taskDetail.resultlist">
							<div class="text"><span>{{item.deptName}}</span><em>{{item.finishNum}}/{{item.totalNum}}</em></div>
							<el-progress :show-text="false" :percentage="item.percent" color="#72b522" :stroke-width="18"></el-progress>
						</li>
					</ul>
				</div>
			</div>
			<div class="report">
				<div class="report_query">
					<el-row :gutter="0">
						<el-col :span="8">
							<span class="text">提交单位</span>
							<el-input v-model="submitDeptName" placeholder="请输入" readonly>
								<i slot="suffix" class="iconfont icon-icon-test" style="line-height:32px;" @click="openSubmitModal"></i>
								<i slot="suffix" class="el-icon-circle-close" style="line-height:30px; cursor: pointer;" @click="cleanSubmitModal" v-show="submitDeptName"></i>
							</el-input>
						</el-col>
						<el-col :span="8">
							<span class="text">检查单位</span>
							<el-input v-model="checkDeptName" placeholder="请输入" readonly>
								<i slot="suffix" class="iconfont icon-icon-test" style="line-height:32px;" @click="openCheckModal"></i>
								<i slot="suffix" class="el-icon-circle-close" style="line-height:30px; cursor: pointer;" @click="cleanCheckModal" v-show="checkDeptName"></i>
							</el-input>

						</el-col>
						<el-col :span="3">
							<el-button type="primary" @click="getReportList()">查&nbsp;询</el-button>
						</el-col>
					</el-row>
				</div>
				<div class="report_list">
					<div class="report_list_tab">
						<div :class="{'on': queryParams.checkStatus === 0}" @click="changeTab(0)">未检查</div>
						<div :class="{'on': queryParams.checkStatus === 2 && queryParams.shzt === 2}" @click="changeTab(2,2)">通过</div>
						<div :class="{'on': queryParams.checkStatus === 2 && queryParams.shzt === 4}" @click="changeTab(2,4)">驳回</div>
					</div>
					<el-table :data="tableData.list" style="width: 100%">
						<el-table-column label="序号" type="index" width="80" sortable>
						</el-table-column>
						<el-table-column prop="" label="报告类型" sortable>
							<template slot-scope="scope">
								{{reportTypeList[scope.row.reportType-1].name}}
							</template>
						</el-table-column>
						<el-table-column prop="reportId" label="报告编码" sortable>

						</el-table-column>
						<el-table-column prop="areaName" label="行政区域" sortable>

						</el-table-column>
						<el-table-column prop="eventAddress" label="事件地址" sortable>

						</el-table-column>
						<el-table-column prop="submitTime" label="提交时间" sortable>

						</el-table-column>
						<el-table-column prop="submitDept" label="提交单位" sortable>

						</el-table-column>
						<el-table-column prop="checkDept" label="检查单位" sortable>

						</el-table-column>
						<el-table-column prop="" width="80" label="操作">
							<template slot-scope="scope">
								<el-button type="text"  @click="jumpXq(scope.row)">查看</el-button>
							</template>
						</el-table-column>
					</el-table>
		            <div class="pagination_zone" v-if="tableData.total>0 ">
                        <el-pagination
                            background
                            :current-page="queryParams.pageNum"
                            :page-sizes="pageSizes"
                            :page-size="queryParams.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="tableData.total"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                        />
                    </div>
				</div>
			</div>
		</div>
		<modal ref="modalSubmit" @setVal="setSubmitValue" />
		<modal ref="modalCheck" @setVal="setCheckValue" />
	</div>

</template>

<script>
	import modal from "@/views/components/dataSeach/modal";
	import {
		getTaskById,
		getTaskTeamList
	} from "@/api/check/create";
	export default {
		name: "checkDetails",
		components: {
			modal
		},
		data() {
			return {
				taskDetail: {},
				tableData: {},
				// 任务对象
				checktypeList: [{
					name: "总队级",
					value: 0
				}, {
					name: "支队级",
					value: 1
				}, {
					name: "大队级",
					value: 2
				}],
				//报告类型
				reportTypeList: [{
					name: "出动报告",
					value: 1
				}, {
					name: "灾情报告",
					value: 2
				}],
				submitDeptName: '',
				checkDeptName: '',
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					submitDept: undefined, //填报单位编号
					checkDept: undefined, //检查单位编号
					taskId: '',
					checkStatus: 0, //状态
					shzt: undefined
				},
				 // 每页显示条数
                pageSizes: [10, 20, 30, 50],
			}
		},
		methods: {
			/** 查询任务列表 */
			getDetail() {
				this.loading = true;
				getTaskById({
						'taskId': this.queryParams.taskId
					})
					.then(res => {
						this.taskDetail = res.data;
						if(this.taskDetail.resultlist && this.taskDetail.resultlist.length > 0) {
							this.taskDetail.resultlist.forEach((item, index) => {
								item.percent = (item.finishNum / item.totalNum) * 100;
							})
						}
					})
					.finally(() => {
						this.loading = false;
					});
			},

			/** 查询报表列表 */
			getReportList() {
				this.loading = true;
				getTaskTeamList(this.queryParams)
					.then(res => {
						this.tableData = res.data;
					})
					.finally(() => {
						this.loading = false;
					});
			},
			//提交单位
			// 打开责任大区模态框 并 回显
			openSubmitModal() {
				this.$refs.modalSubmit.echo(this.queryParams.submitDept);
				this.$refs.modalSubmit.toggle();
			},
			// 将树形中的值赋值给责任大区 input id 付给hidden input
			setSubmitValue(data) {
				this.queryParams.submitDept = data.deptId;
				this.submitDeptName = data.deptName;
			},
			cleanSubmitModal() {
				this.queryParams.submitDept = undefined;
				this.submitDeptName = "";
			},
			//检查单位
			// 打开责任大区模态框 并 回显
			openCheckModal() {
				this.$refs.modalCheck.echo(this.queryParams.checkDept);
				this.$refs.modalCheck.toggle();
			},
			// 将树形中的值赋值给责任大区 input id 付给hidden input
			setCheckValue(data) {
				this.queryParams.checkDept = data.deptId;
				this.checkDeptName = data.deptName;
			},
			cleanCheckModal() {
				this.queryParams.checkDept = undefined;
				this.checkDeptName = "";
			},
			changeTab(type, shzt) {
				this.queryParams.checkStatus = type;
				this.queryParams.shzt = shzt;
				this.getReportList();
			},
			 // 分页
            handleSizeChange(val) {
                this.queryParams.pageSize = val;
                this.getReportList();
            },
            // 翻页
            handleCurrentChange(val) {
                this.queryParams.pageNum = val;
                this.getReportList();
            },
            jumpXq(item) {
            	    if(item.reportType == 1){
	            	    	this.$router.push({
	                    path: '/showDetail/cdxxShowDetail',
	                    query: {
	                        cdbh:item.reportId,
	                        shzt:item.shzt
	                    }
	                });
            	    }else if(item.reportType == 2){
	            	    	this.$router.push({
	                    path: "/showDetail/jqxxShowDetail",
	                    query: {
	                        jqbh: item.jqbh
	                    }
	                });
            	    }
            }
		},
		created() {
			this.queryParams.taskId = this.$route.query.taskId;
			this.getDetail();
			this.getReportList();
		}
	};
</script>

<style lang="stylus" scoped>
	.detail_page {
		background #F1F2F4;
		font-size 14px;
		font-weight 400;
		color rgba(55, 57, 76, 1);
		.detail_content {
			background: #fff;
			margin: 10px 15px;
			.detail_title {
				margin: 0px;
				margin-right: auto;
				height: 44px;
				line-height: 32px;
				font-weight: 400;
				color: #393C41;
				font-size: 18px;
				padding-left: 32px;
				background-repeat: no-repeat;
				background-position: 0 50%;
				background-size: 23px;
				border-bottom: 1px solid #e8e8e8;
				padding-top: 6px;
				padding-bottom: 12px;
				margin-bottom: 15px;
				span {
					font-size: 12px;
					margin-left: 6px;
				}
			}
			.detail_describe {
				border-bottom: 1px dashed #eaeaea !important;
				.task-progress {
					width: 80%;
					max-height: 220px;
					overflow-y: scroll;
					margin: 0 auto;
					ul {
						padding: 0;
						margin: 0;
						li {
							width: 29%;
							list-style: none;
							display: inline-block;
							margin-right: 4%;
							margin-bottom: 16px;
							.text {
								margin: 8px 0;
								span {
									font-size 14px;
									font-weight: 500;
									color: #606266;
								}
								em {
									float: right;
									font-style: normal;
									color: #37394c;
								}
							}
						}
					}
				}
			}
			.report {
				padding-left: 32px;
				.report_query {
					margin: 20px 0;
					.el-input {
						width: 68%;
					}
					.text {
						display: inline-block;
						line-height: 32px;
						width: 80px;
					}
				}
				.report_list {
					width: 97%;
					.report_list_tab {
						width: 100%;
						height: 28px;
						border-bottom: 1px solid #e8e8e8;
						div {
							width: 100px;
							height: 28px;
							line-height: 28px;
							background: #f2f2f2;
							float: left;
							text-align: center;
							color: #515a6e;
							font-size: 13px;
							font-weight: bold;
							cursor: pointer;
							&.on {
								background: #d7d7d7;
							}
						}
					}
					.pagination_zone{
						 margin-top 20px;
                          text-align right;
					}
                  
				}
			}
		}
	}
</style>