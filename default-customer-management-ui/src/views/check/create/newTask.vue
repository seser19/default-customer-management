<template>
 <!--新建任务 组件-->
<div class="check-new-task app-container" v-loading="pageLoading">
	<div class="reporting-title">
		<h2>新建检查任务</h2>
		<div class="btn_back" @click="$router.push({path: '/inspect/create'})">返回</div>
		<div class="btn_orange" @click="sendTask">发送</div>
	</div>
	<div class="task-form">
		<el-form ref="taskForm" :model="taskForm" :rules="taskFormRules" label-position="right" label-width="100px">
			<el-row>
				<el-col :span="8">
					<el-form-item prop="taskName" label="任务名称">
						<el-input v-model="taskForm.taskName" placeholder="任务名称"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item prop="taskStartTime" label="开始时间">
						<el-date-picker v-model="taskForm.taskStartTime"
							:clearable="false"
							value-format="yyyy-MM-dd"
							@change="paramTimeChange"
							placeholder="开始时间"
							type="date" :picker-options="pickerOptions">
						</el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item prop="taskEndTime" label="结束时间">
						<el-date-picker v-model="taskForm.taskEndTime"
							:clearable="false"
							value-format="yyyy-MM-dd"
							@change="paramTimeChange"
							placeholder="结束时间"
							type="date" :picker-options="pickerOptions">
						</el-date-picker>
					</el-form-item>
			    </el-col>
				<el-col :span="8">
					<el-form-item label="任务对象">
						<span> {{ $route.query.lowerLevel && lowerLevelDictionaries[$route.query.lowerLevel] }}</span>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item prop="" label="转派给下级">
						<el-radio-group v-model="taskForm.is_down_send" placeholder="转派给下级">
							<el-radio v-for="item in subordinateBooleanList" :key="item.value" :label="item.value"> {{ item.name }}</el-radio>
						</el-radio-group>
				    </el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item prop="" label="检查要求">
						<el-input v-model="taskForm.checkRequirement" type="textarea" placeholder="请输入检查要求"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item prop="distributionMethod" label="派发方式">
						<el-select v-model="taskForm.distributionMethod" placeholder="派发方式">
							<el-option v-for="item in distributionMethodList" :key="item.value" :label="item.name" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="8" v-if="taskForm.distributionMethod === '1'">
					<el-form-item label="随机分派给各单位" label-width="150px">
						<el-input-number class="iconfont icon-xiang" v-model="taskForm.sendNum" style="width:87%" :min="1" label="描述文字" :controls="false"></el-input-number>
					</el-form-item>
				</el-col>
				<el-col :span="8" v-else-if="taskForm.distributionMethod === '2'">
					<el-form-item label="随机分派给各单位" label-width="150px">
						<el-input-number class="iconfont icon-baifenbi" v-model="taskForm.sendNum" style="width:87%" :min="0.1" :step="0.1" label="描述文字" :controls="false"></el-input-number>
					</el-form-item>
				</el-col>
				<el-col :span="8" v-else-if="taskForm.distributionMethod === '3'">
					<el-form-item label="">
						<span> 此次任务将派发</span> <span class="color-main-red">0</span>条报告 ，<span class="jump-link">查看报告列表</span>
					</el-form-item>
				</el-col>
			</el-row>
	     </el-form>
     </div>

     <!--三个不同类型的条件表单-->
     <div class="task-type-form">
		<div class="type-title">
			<el-radio-group v-model="typeRadio">
				<el-radio v-for="item in typeRadioList" :key="item.value" :label="item.value">{{ item.name }}</el-radio>
			</el-radio-group>
			<el-checkbox-group v-model="typeSelect">
				<el-checkbox v-for="item in typeSelectList" :key="item.value" :label="item.value">{{ item.name }}</el-checkbox>
			</el-checkbox-group>
			<button class="btn_back" @click="resetTypeForm">重置</button>
		</div>
		<div class="type-form">
			<police-sentiment-search v-if="typeRadio === '1'" :isCheckNewTask="true" ref="policeSentimentSearch"></police-sentiment-search>
			<dispatch-sentiment-search v-else-if="typeRadio === '2'" :isCheckNewTask="true" ref="dispatchSentimentSearch"></dispatch-sentiment-search>
			<fire-sentiment-search v-else-if="typeRadio === '3'" :isCheckNewTask="true" ref="fireSentimentSearch"></fire-sentiment-search>
		</div>
     </div>

	<!--任务确认弹窗-->
	<el-dialog title="任务确认" :visible.sync="dialogVisible" :fullscreen="true">
		<div class="numlist">
			<div class="numlist-name">
				<span>单位名称</span>
				<span>任务数量</span>
			</div>
			<div class="numlist-con">
				<div class="numlist-con-item" v-for="item in tableData.checknumlist">
					<span>{{ item.deptName }}</span>
					<span>{{ item.checkNum }}</span>
				</div>
			</div>
		</div>
		<div class="center-text">此次任务共派发
			<span class="color-main-red">{{tableData.reportlist && tableData.reportlist.length || 0}}</span>条
			<span v-if="typeRadio === '1'">警情,列表如下：</span>
			<span v-else-if="typeRadio === '2'">出动报告,报告列表如下：</span>
			<span v-else-if="typeRadio === '3'">火灾报告,报告列表如下：</span>
		</div>
		<!--报告列表-->
		<el-table :data="tableData.reportlist" style="width: 100%">
			<el-table-column label="序号" type="index" width="80" sortable>
			</el-table-column>
			<el-table-column prop="reportId" label="报告编号" sortable>
			</el-table-column>
			<el-table-column prop="areaName" label="行政区域" sortable>
			</el-table-column>
			<el-table-column prop="eventAddress" label="事件地点" sortable>
			</el-table-column>
			<el-table-column prop="submitTime" label="提交时间" sortable>
			</el-table-column>
			<el-table-column prop="submitDeptName" label="提交机构名称" sortable>
			</el-table-column>
			<el-table-column prop="checkDeptName" label="检查机构名称" sortable>
			</el-table-column>
		</el-table>

		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="saveTask">保 存</el-button>
			<el-button @click="dialogVisible = false"> 取 消 </el-button>
		</div>
	</el-dialog>

	<el-dialog
	  title="提示"
	  :visible.sync="noPassVisible"
	  width="50%!important">
	  <div class="nopassList">
	     根据所设置的筛选条件,
	     <div v-for="item in nopasslist">
	     	<span>{{ item.deptName }}</span>最多仅可派发<span>{{ item.checkNum }}</span>条信息,
	     </div>
	     请重新设置筛选条件或修改分派给各单位的数量。
	  </div>
	  <span slot="footer" class="dialog-footer">
	    <el-button @click="noPassVisible = false">取 消</el-button>
	    <el-button type="primary" @click="noPassVisible = false">确 定</el-button>
	  </span>
	</el-dialog>

</div>
</template>

<script>
import {
	getReportFilterResult,  //发送报告
	addReportFilterResult, //保存报告
	jqinfoCount,
	jqxxCommomSearch,
	cdInfoCount,
	cdxxCommomSearch,
	zqxxInfoCount,
	queryZqxxData
} from "@/api/check/create";
import { asyncValidateForm } from "@/utils/validate";

//*****************警情查询
import policeSentimentSearch from "@/views/eqw/dataSearch/components/policeSentimentSearch";
//*****************出动查询
import dispatchSentimentSearch from "@/views/eqw/dataSearch/components/dispatchSentimentSearch";
//*****************火灾查询
import fireSentimentSearch from "@/views/eqw/dataSearch/components/fireSentimentSearch";

export default {
	name: "checkNewTask",
	components: {
		policeSentimentSearch,
		dispatchSentimentSearch,
		fireSentimentSearch
	},
	data() {
		return {
			pageLoading: false,
			tableData:[],
			// 时间选择规则
			pickerOptions: {
				disabledDate(time) {
					return time.getTime() < Date.now() - 1000 * 60 * 60 * 24;
				}
			},
			// 表单字段
			taskForm: {
				is_down_send: "1",
				distributionMethod: "1",
				sendNum: 1
			},
			// 表单规则
			taskFormRules: {
				taskName: [
					{ required: true, message: "任务名称不能为空", trigger: "blur" }
				],
				taskStartTime: [
					{
						required: true,
						message: "开始时间不能为空",
						trigger: ["blur", "change"]
					}
				],
				taskEndTime: [
					{
						required: true,
						message: "结束时间不能为空",
						trigger: ["blur", "change"]
					}
				],
				distributionMethod: [
					{
						required: true,
						message: "派发方式不能为空",
						trigger: ["blur", "change"]
					}
				],
				sendNum: [
					{
						required: true,
						message: "随机派发数量不能为空",
						trigger: ["blur", "change"]
					}
				]
			},
			// 转派给下级单选列表
			subordinateBooleanList: [
				{
					name: "允许",
					value: "1"
				},
				{
					name: "不允许",
					value: "0"
				}
			],
			// 派发方式下拉列表
			distributionMethodList: [
				{
					name: "等量派发",
					value: "1"
				},
//				{
//					name: "等比派发",
//					value: "2"
//				},
//				{
//					name: "自定义派发",
//					value: "3"
//				}
			],
			/*****************当前单位直属下级的级别 */
			// 列表字典
			lowerLevelDictionaries: {
				1: "部局级",
				2: "总队级",
				3: "支队级",
				4: "大队级",
				5: "中队级"
			},
			/*****************三种单选查询类型 */
			typeRadio: "1",
			// 列表
			typeRadioList: [
				{
					name: "整起警情",
					value: "1"
				},
				{
					name: "仅出动报告",
					value: "2"
				},
				{
					name: "仅火灾报告",
					value: "3"
				}
			],
			/*****************两种多选查询条件 */
			typeSelect: [],
			// 列表
			typeSelectList: [
				// {
				//   name: "包含审批中的报告",
				//   value: "1"
				// },
				{
					name: "包含已检查的报告",
					value: "1"
				}
			],
			nopasslist:[],
			/*****************任务确认弹窗 */
			dialogVisible: false,
			noPassVisible: false
		};
	},
	methods: {
		/**
		 * 开始时间 和 结束时间验证
		 */
		paramTimeChange(val) {
			let nowChangeGettime = new Date(val).getTime();
			if (this.taskForm.taskStartTime && this.taskForm.taskEndTime) {
				let ksrqGettime = new Date(this.taskForm.taskStartTime).getTime();
				let jsrqGettime = new Date(this.taskForm.taskEndTime).getTime();
				if (ksrqGettime > jsrqGettime) {
					this.$message.warning("开始时间不能大于结束时间");
					this.taskForm.taskStartTime = this.taskForm.taskEndTime;
				}
			}
		},
		//发送
		async sendTask() {
			// 先校验表单
			const validateForm = await asyncValidateForm(this, "taskForm");
			if (validateForm) {
			    this.pageLoading = true;
			    const params = {
			    	    "taskTarget":this.$route.query.lowerLevel-1,
			    	    "dispatchWay":this.taskForm.distributionMethod,
			    	    "reportType":this.typeRadio,
			    	    "checkNum":this.taskForm.sendNum
			    };
			    	const dictionaries = {
					1: "policeSentimentSearch",
					2: "dispatchSentimentSearch",
					3: "fireSentimentSearch"
				};
				this.$refs[dictionaries[this.typeRadio]].formData.pageNum = undefined;
				this.$refs[dictionaries[this.typeRadio]].formData.pageSize = undefined;
				let typeParams = {
					...this.$refs[dictionaries[this.typeRadio]].formData
				};
				Object.assign(params, typeParams);
				getReportFilterResult(params)
					.then(res => {
						if(res.data.status == 0){
							this.nopasslist = res.data.nopasslist;
                             this.noPassVisible = true;
							return;
						}
						this.dialogVisible = true;
						this.pageLoading = false;
						this.tableData = res.data;
					})
					.finally(() => {
						this.pageLoading = false;
					});
			}
		},

		//保存任务
		saveTask(){
			    if(!this.tableData.reportlist){
			    	    this.$message({
						type: 'warning',
						message: '报告列表为空!'
					});
			    	   return;
			    }
				this.pageLoading = true;
				const params = {
					"taskName":this.taskForm.taskName,
					"taskStartTime":this.taskForm.taskStartTime,
					"taskEndTime":this.taskForm.taskEndTime,
					"checkType":this.$route.query.lowerLevel-2,
					"isDownSend":this.taskForm.is_down_send,
					"checkRequirement":this.taskForm.checkRequirement,
					"dispatchWay":this.taskForm.distributionMethod,
					"checkNum":this.taskForm.sendNum,
					"taskType":0,
					"reportlist":this.tableData.reportlist
				};
				addReportFilterResult(params)
					.then(res => {
						this.pageLoading = false;
						this.$message({
	                        message: "保存成功！",
	                        type: "success"
	                    });
	                    this.$router.push({path: '/inspect/create'});
					})
					.finally(() => {
						this.pageLoading = false;
					});
		},

		//旧接口方法

		/**
		 * 重置底部三个类型中当前类型的条件
		 */
		async resetTypeForm() {
			const dictionaries = {
				1: "policeSentimentSearch",
				2: "dispatchSentimentSearch",
				3: "fireSentimentSearch"
			};
			this.$refs[dictionaries[this.typeRadio]].resetBtn();
		},

		/**
		 * 判断当前（共三种）查询类型等量检查任务是否可行
		 */
		judgeCheckTask() {
			const dictionaries = {
				1: "policeSentimentSearch",
				2: "dispatchSentimentSearch",
				3: "fireSentimentSearch"
			};
			this.pageLoading = true;
			// 组装数据
			this.taskForm.checkStatus = this.typeSelect[0] ? 1 : 0;
			this.taskForm.checkType = this.$route.query.lowerLevel;

			return new Promise(resolve => {
				let params = {
					...this.$refs[dictionaries[this.typeRadio]].formData
				};
				Object.assign(params, this.taskForm);

				// 根据不同的查询类型请求不同的接口
				switch (this.typeRadio) {
					case "1":
						// 警情
						jqinfoCount(params)
							.then(res => {
								resolve(res);
							})
							.finally(() => {
								this.pageLoading = false;
							});
						break;
					case "2":
						// 出动
						cdInfoCount(params)
							.then(res => {
								resolve(res);
							})
							.finally(() => {
								this.pageLoading = false;
							});
						break;
					case "3":
						// 火灾
						zqxxInfoCount(params)
							.then(res => {
								resolve(res);
							})
							.finally(() => {
								this.pageLoading = false;
							});
						break;

					default:
						break;
				}
			});
		},
		/**
		 * 查询当前（共三种）类型的列表数据
		 */
		async searchCheckTask() {
			// 先校验表单
			const validateForm = await asyncValidateForm(this, "taskForm");
			// 再判断等量
			if (validateForm) {
				const resultList = await this.judgeCheckTask();
				console.log(resultList);
				if (resultList && resultList.data) {
					// 失败时组装多个队伍名称和数量
					let errorMessage = "",
						errorCount = 0;
					// 还要先判断等量接口返回的数据，是否正确
					const validateCount = resultList.data.every(element => {
						if (element) {
							const { lvCount, lvName } = element;
							// 如果每一条数据返回的数量都大于等于设置的值，便认为其成功
							const isOk = element.lvCount >= this.taskForm.sendNum;
							if (!isOk) {
								errorMessage += `${lvName}、`;
								errorCount = lvCount;
							}
							return isOk;
						}
					});
					if (!!validateCount) {
						const dictionaries = {
							1: "policeSentimentSearch",
							2: "dispatchSentimentSearch",
							3: "fireSentimentSearch"
						};
						// 组装数据
						this.pageLoading = true;
						let params = {
							...this.$refs[dictionaries[this.typeRadio]].formData
						};
						Object.assign(params, this.taskForm, {
							list: resultList.data
						});
						// 根据不同的查询类型请求不同的接口
						switch (this.typeRadio) {
							case "1":
								// 警情
								jqxxCommomSearch(params)
									.then(res => {
										console.log(res);
									})
									.finally(() => {
										this.pageLoading = false;
									});
								break;
							case "2":
								// 出动
								cdxxCommomSearch(params)
									.then(res => {
										console.log(res);
									})
									.finally(() => {
										this.pageLoading = false;
									});
								break;
							case "3":
								// 火灾
								queryZqxxData(params)
									.then(res => {
										console.log(res);
									})
									.finally(() => {
										this.pageLoading = false;
									});
								break;

							default:
								break;
						}
					} else {
						// 失败提示语
						this.$alert(
							`根据所设置的筛选条件，${errorMessage} 最多仅可派发 ${errorCount} 条信息。\r请重新设置筛选条件或修改分派给各单位的数量。`,
							"提示",
							{
								confirmButtonText: "确定",
								callback: action => {}
							}
						);
					}
				}
			}
		},
		/**
		 * 等量判断结果成功时的回调函数
		 */

	}
};
</script>

<style lang="stylus" scoped>
.check-new-task{
	.reporting-title{
		h2{
			background url('./image/create.png') left center no-repeat
			background-size 30px
		}
	}

}
.nopassList{
	text-align: center;
	font-size:15px;
	color: #333;
	line-height:28px;
	span{
		color: red;
	}
}
.el-dialog__footer{
	text-align: center;
}
.task-form{
	.el-select, .el-input{
		width 100%
	}
}
.task-type-form{
	padding 0 20px
	.type-title{
		display flex
		justify-content space-between
		align-items center
		padding 0 15px
		margin 15px 0
		height 50px
		background rgba(244, 246, 248, 1)
		border-radius 6px
		border 1px solid rgba(218, 226, 237, 1);
	 }
}
.center-text{
		width:auto;
		margin:20px 0;
		padding-left:20px;
}
.numlist{
	width:100%;
	height:90px;
	border:1px solid #e8e8e8;
	display: inline-flex;
	.numlist-name{
		width:90px;
		span{
			display: block;
			width:100%;
			height:45px;
			line-height:45px;
			border-bottom: 1px solid #e8e8e8;
			border-right:  1px solid #e8e8e8;
			background:#fafafa;
			font-weight: bold;
			text-align: center;
			&span:last-child{
				border-bottom:none;
			}
		}
	}
	.numlist-con{
		max-width:calc(100% - 90px);;
		height:90px;
		white-space: nowrap;
		overflow-x:auto;
		overflow-y: hidden;
		font-size:0;
		.numlist-con-item{
			display: inline-block;
			span{
				display: block;
			    width:auto;
			    height:45px;
			    line-height:45px;
			    padding:0 15px;
			    border-bottom: 1px solid #e8e8e8;
			    font-size:14px;
			    &:last-child{
			      	border-bottom:none;
			    }
			}
		}
	}
}
</style>
