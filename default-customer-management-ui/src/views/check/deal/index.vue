<template>
	<div class="app-container">
		<div class="filter-main">
			<div class="reporting-title">
				<h2>{{ $route.meta.title }}</h2>
			</div>
			<div class="examineBody">
				<el-form ref="filterForm" :model="queryParams">
				  <el-row>
					<el-col :span="9">
						<el-form-item prop="">
							<el-input v-model="queryParams.taskName" placeholder="任务名称"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="9">
						<el-form-item class="divIncludeTime" prop="">
							<el-col :span="11">
								<el-date-picker v-model="queryParams.taskStartTime"
									:clearable="false"
									value-format="yyyy-MM-dd"
									@change="paramTimeChange"
									placeholder="开始时间"
									type="date"
                                    :picker-options="pickerOptions">
								</el-date-picker>
							</el-col>
							<el-col class="line" :span="2"> -
							</el-col>
							<el-col :span="11">
								<el-date-picker v-model="queryParams.taskEndTime"
									:clearable="false"
									value-format="yyyy-MM-dd"
									@change="paramTimeChange"
									placeholder="结束时间"
									type="date"
                                    :picker-options="pickerOptions">
								</el-date-picker>
							</el-col>
						</el-form-item>
					</el-col>
					<el-col :span="4">
						<button class="btn_back" @click.prevent="resetSearchForm()">重置</button>
					</el-col>
					<el-col :span="9">
						<el-form-item prop="">
							<el-input v-model="initiatorDeptName" placeholder="发送单位" readonly @focus="openDutyModal">
                                 <i slot="suffix" class="iconfont icon-icon-test" style="line-height:32px;"  @click="openDutyModal"></i>
						    </el-input>
						</el-form-item>
					</el-col>
					<el-col :span="9">
						<el-form-item prop="">
							<el-select v-model="queryParams.taskStatus" placeholder="任务状态">
								<el-option v-for="item in statusSelectList" :key="item.value" :label="item.name" :value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="4">
						<button class="btn_orange" @click.prevent="getList">查询</button>
					</el-col>
					</el-row>
				</el-form>


			<el-table  :data="taskList" :empty-text="querydata == true ? '点击按钮查询':'暂无数据'">
				<el-table-column label="任务名称" align="center" prop="taskName" />
				<el-table-column label="开始时间" align="center" prop="taskStartTime" />
				<el-table-column label="结束时间" align="center" prop="taskEndTime" />
				<el-table-column label="发送单位" align="center" prop="deptName" />
				<el-table-column label="转派下级" align="center">
					<template slot-scope="scope">
						<span v-if="scope.row.isDownSend == 1">允许</span>
						<span v-if="scope.row.isDownSend == 0">不允许</span>
					</template>
				</el-table-column>
				<el-table-column prop="" label="任务进度" align="center" width="200">
						<template slot-scope="scope">
							<div class="progress-list">
								<div class="progress-item"><span :class="{ 'bg-color-main-red': scope.row.taskStatus === 0, 'bg-color-yellow': scope.row.taskStatus === 1, 'bg-color-cyan': scope.row.taskStatus === 2 }"></span> {{ scope.row.taskRate }} </div>
								<div class="progress-item"><span class="color-cyan"> {{ scope.row.pass }} </span>通过</div>
								<div class="progress-item"><span clas="color-main-red">{{ scope.row.reject }} </span> 驳回</div>
							</div>
						</template>
				</el-table-column>
				<el-table-column prop="status" label="任务状态" sortable>
						<template slot-scope="scope">
							<div class="status-text">
								<span :class="{ 'bg-color-main-red': scope.row.taskStatus === 0, 'bg-color-yellow': scope.row.taskStatus === 1, 'bg-color-cyan': scope.row.taskStatus === 2 }"></span>{{ statusSelectList[scope.row.taskStatus].name }}
							</div>
				        </template>
				</el-table-column>
				<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
					<template slot-scope="scope">
						<el-button type="text" @click="jumpDetails(scope.row)">查看</el-button>
					</template>
				</el-table-column>
			</el-table>

			<pagination v-if="total > 0"
						:total="total"
						:page.sync="queryParams.pageNum"
						:limit.sync="queryParams.pageSize"
						@pagination="getList">
					  </pagination>
					  </div>
		</div>
		<modal ref="modal" @setVal="setDutyValue"></modal>
	</div>
</template>

<script>
import {
	getDealTaskList,
} from "@/api/check/deal";
import modal from "@/views/components/dataSeach/modal";
import {getNearlyRecentDays} from "@/utils/dateTimeUtils.js";
import {
	listDept,
	getDept,
	treeselect,
	delDept,
	addDept,
	updateDept
} from "@/api/system/dept";

export default {
	name: "processsupervision",
	components: {
		modal
	},
	data() {
		return {
			//初始显示
            querydata:true,
			// 遮罩层
			loading: true,
			// 总条数
			total: 0,
			// 任务表格数据
			taskList: [],
			//发送单位名称
			initiatorDeptName:'',
			// 查询参数
			queryParams: {
				pageNum: 1,
				pageSize: 10,
				taskStartTime:undefined, //任务开始时间
				taskEndTime:undefined, //任务结束时间
				taskName: undefined, //任务名称
				initiatorDept: undefined, //发送单位
				taskStatus: undefined,  //抽查状态
			},
			/*****************下拉列表 */
	      // 状态下拉列表
	       statusSelectList: [
	         {
	           name: "未开始",
	           value: 0
	         },
	        {
	           name: "进行中",
	           value: 1
	        },
	        {
	           name: "已完成",
	           value: 2
	        }
	      ],
        pickerOptions: {
          shortcuts: [{
            text: '即刻',
            onClick(picker){
              const date = new Date();
              picker.$emit('pick',date);
            }
          },{
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          },{
            text: '本月',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.setDate(1));
              picker.$emit('pick', date);
            }
          }]
        }
		};
	},
	created() {
    //初始化时间
    this.queryParams.taskStartTime = getNearlyRecentDays(30)[0];
    this.queryParams.taskEndTime = getNearlyRecentDays(30)[1];
		// this.getList();
	},
	methods: {
		/**
	     * 开始时间 和 结束时间验证
	     */
	    paramTimeChange(val) {
	      let nowChangeGettime = new Date(val).getTime();
	      if (this.queryParams.taskStartTime && this.queryParams.taskEndTime) {
	        let ksrqGettime = new Date(this.queryParams.taskStartTime).getTime();
	        let jsrqGettime = new Date(this.queryParams.taskEndTime).getTime();
	        if (ksrqGettime > jsrqGettime) {
	          this.$message.warning("开始时间不能大于结束时间");
	          this.queryParams.taskStartTime = this.queryParams.taskEndTime;
	        }
	      }
	    },
		/** 查询任务列表 */
		getList() {
			this.loading = true;
			getDealTaskList(this.queryParams).then(
				response => {
					this.taskList = response.data.list;
					this.total = response.data.total;
					this.loading = false;
					// console.log("----",this.taskList);
					if(this.taskList.length == 0){
                         this.querydata = false;
                     }
				}
			);
		},
		// 打开责任大区模态框 并 回显
        openDutyModal() {
            this.$refs.modal.echo(this.queryParams.initiatorDept);
            this.$refs.modal.toggle();
        },
		// 将树形中的值赋值给责任大区 input id 付给hidden input
        setDutyValue(data) {
            this.queryParams.initiatorDept = data.deptId;
            this.initiatorDeptName = data.deptName;
        },
		// 表单重置
	    resetSearchForm() {
	      this.queryParams = {
	        pageNum: 1,
			pageSize: 10,
			taskStartTime:undefined, //任务开始时间
			taskEndTime:undefined, //任务结束时间
			taskName: undefined, //任务名称
			initiatorDept: undefined, //发送单位
			taskStatus: undefined,  //抽查状态
	      };
	      this.getList();
	    },
	    /**
	     * 跳转至详情页面
	     */
	    jumpDetails(row) {
	    	  const {taskId} = row;
	      if (taskId) {
	        this.$router.push({
	          name: "dealDetails",
	          query: {
	            taskId
	          }
	        });
	      }
	    }
	}
};
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/mixin.styl'
.app-container
  .reporting-title
    h2
      padding-left 0
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
    .progress-list
      display flex
      justify-content space-around
      .progress-item
        display flex
        align-items center
  .status-text
    display flex
    align-items center
  .el-table
    [class*='bg-']
      width 6px
      height 6px
      border-radius 50%
      margin 0 10px 0 0
    .bg-color-main-red
      color $default-main-color
      background-color @color
    .bg-color-yellow
      color $default-yellow-color
      background-color @color
    .bg-color-cyan
      color $default-cyan-color
      background-color @color
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
