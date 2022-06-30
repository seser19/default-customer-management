<template>
	<div class="detail_page">
		<div class="detail_content">
			<div class="detail_title">
				<div>{{taskDetail.taskName}}</div>
			</div>
			<div class="detail_describe">
				<el-form label-width="160px" class="demo-ruleForm" label-position="right">
					<el-row :gutter="0">
						<el-col :xs="24" :sm="12" :lg="8" :span="8">
							<el-form-item label="任务名称">
								<span>{{taskDetail.taskName}}</span>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :lg="8" :span="8">
							<el-form-item label="开始时间">
								<span>{{taskDetail.taskStartTime}}</span>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :lg="8" :span="8">
							<el-form-item label="结束时间">
								<span>{{taskDetail.taskEndTime}}</span>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="0">
						<el-col :xs="24" :sm="12" :lg="8" :span="8">
							<el-form-item label="任务对象">
								<span v-if="taskDetail.checkType">{{checktypeList[taskDetail.checkType].name}}</span>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :lg="8" :span="8">
							<el-form-item label="转派给下级">
								<span v-if="taskDetail.isDownSend == '1'">允许</span>
								<span v-if="taskDetail.isDownSend == '0'">不允许</span>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :lg="8" :span="8">
							<el-form-item label="报告类型">
								<span>{{taskDetail.reportType}}</span>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="0">
						<el-col :xs="24" :sm="12" :lg="6" :span="8">
							<el-form-item label="检查要求">
								<span>{{taskDetail.checkRequirement}}</span>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="0">
						<el-col :xs="24" :sm="12" :lg="6" :span="8">
							<el-form-item label="任务进度">
								<span>{{taskDetail.taskRate}}</span>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
			<div class="report">				
				<div class="report_list">
					<div class="report_list_tab">
						<div :class="{'on': queryParams.checkStatus === 0}" @click="changeTab(0)">未检查</div>
						<div :class="{'on': queryParams.checkStatus === 2 && queryParams.shzt === 2}" @click="changeTab(2,2)">通过</div>
						<div :class="{'on': queryParams.checkStatus === 2 && queryParams.shzt === 4}" @click="changeTab(2,4)">驳回</div>
					</div>
					<el-table :data="tableData" style="width: 100%">
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
						<el-table-column prop="deptName" label="提交单位" sortable>

						</el-table-column>
						<el-table-column prop="" width="80" label="操作">
							<template slot-scope="scope">
								<el-button type="text"  @click="jumpXq(scope.row)">查看</el-button>
							</template>
						</el-table-column>
					</el-table>
		            <div class="pagination_zone" v-if="total>0 ">
                        <el-pagination
                            background
                            :current-page="queryParams.pageNum"
                            :page-sizes="pageSizes"
                            :page-size="queryParams.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                        />
                    </div>
				</div>
			</div>
		</div>
	
	</div>

</template>

<script>
	import {
		getDealTaskTeamById
	} from "@/api/check/deal";
	export default {
		name: "checkDetails",
		data() {
			return {
				taskDetail: {},
				tableData: [],
				total:0,
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
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					taskId: '',
					checkStatus:0
				},
				 // 每页显示条数
                pageSizes: [10, 20, 30, 50],
			}
		},
		methods: {
			/** 查询任务列表 */
			getDetail() {
				this.loading = true;
				getDealTaskTeamById(this.queryParams)
					.then(res => {
						this.taskDetail = res.data.taskinfo[0];
						this.tableData = res.data.teamlist;
						this.total = res.data.total;
					})
					.finally(() => {
						this.loading = false;
					});
			},
			changeTab(type, shzt) {
				this.queryParams.checkStatus = type;
				this.queryParams.shzt = shzt;
				this.getDetail();
			},
			 // 分页
            handleSizeChange(val) {
                this.queryParams.pageSize = val;
                this.getDetail();
            },
            // 翻页
            handleCurrentChange(val) {
                this.queryParams.pageNum = val;
                this.getDetail();
            },
            jumpXq(item) {
            	    if(item.reportType == 1){
	            	    	this.$router.push({
	                    path: '/showDetail/cdxxShowDetail',
	                    query: {
	                        cdbh:item.reportId,
	                        shzt:item.shzt,
	                        taskId:this.$route.query.taskId,
	                        source: 'deal'
	                    }
	                });
            	    }else if(item.reportType == 2){
	            	    this.$router.push({
                        path: "/deal/fire",
                        query: {
                            zqbh: item.reportId,
                            jqbh: item.jqbh,
                            qwhz: item.qwhz,
                            taskId:this.$route.query.taskId,
                            source: 'deal'
                        }
                    });
            	    }
            }
		},
		created() {
			this.queryParams.taskId = this.$route.query.taskId;
			this.getDetail();
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