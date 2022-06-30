<template lang="pug">
.app-container
	.filter-main
		.reporting-title
			h2 {{ $route.meta.title }}
			//- 判断如果当前单位直属下级的级别不是中队级显示
			el-button(v-if="lowerLevel !== 5" type="primary" @click="$router.push({ name: 'checkNewTask', query: { lowerLevel } })") 新建任务
		.examineBody
			el-form(ref="filterForm" :model="queryParams")
				el-row
					el-col(:span="9")
						el-form-item(prop="")
							el-input(v-model="queryParams.taskName" placeholder="任务名称")
					el-col(:span="9")
						el-form-item.divIncludeTime(prop="")
							el-col(:span="11")
								el-date-picker(v-model="queryParams.taskStartTime"
									:clearable="false"
									value-format="yyyy-MM-dd"
									@change="paramTimeChange"
									placeholder="开始时间"
									type="date"
                  :picker-options="pickerOptions")
							el-col.line(:span="2") -
							el-col(:span="11")
								el-date-picker(v-model="queryParams.taskEndTime"
									:clearable="false"
									value-format="yyyy-MM-dd"
									@change="paramTimeChange"
									placeholder="结束时间"
									type="date"
                  :picker-options="pickerOptions")
					el-col(:span="4")
						button(class="btn_back" @click.prevent="resetSearchForm()") 重置
					el-col(:span="9")
						el-form-item(prop="")
							el-select(v-model="queryParams.dispatchWay" placeholder="派发方式")
								el-option(v-for="item in distributionMethodList" :key="item.value" :label="item.name" :value="item.value")
					el-col(:span="9")
						el-form-item(prop="")
							el-select(v-model="queryParams.taskStatus" placeholder="任务状态")
								el-option(v-for="item in statusSelectList" :key="item.value" :label="item.name" :value="item.value")
					el-col(:span="4")
						button(class="btn_orange" @click.prevent="getList") 查询

			.page-main(v-loading="loading")
				el-table(:data="tableData.data" style="width: 100%" :empty-text="querydata == true ? '点击按钮查询':'暂无数据'")
					el-table-column(prop="taskName" label="任务名称" width="180" show-overflow-tooltip sortable)
					el-table-column(prop="taskStartTime" label="开始时间" sortable)
					el-table-column(prop="taskEndTime" label="结束时间" sortable)
					el-table-column(prop="dispatchWay" label="派发方式" sortable)
						template(slot-scope="scope")
							span {{ scope.row.dispatchWay && distributionMethodList[scope.row.dispatchWay - 1].name  }}
					el-table-column(prop="" label="任务进度" align="center" width="200")
						template(slot-scope="scope")
							.progress-list
								.progress-item #[span(:class="{ 'bg-color-main-red': scope.row.taskStatus === 0, 'bg-color-yellow': scope.row.taskStatus === 1, 'bg-color-cyan': scope.row.taskStatus === 2 }") ] {{ scope.row.taskRate }}
								.progress-item #[span.color-cyan {{ scope.row.pass }}] 通过
								.progress-item #[span.color-main-red {{ scope.row.reject }}] 驳回
					el-table-column(prop="status" label="任务状态" sortable)
						template(slot-scope="scope")
							.status-text #[span(:class="{ 'bg-color-main-red': scope.row.taskStatus === 0, 'bg-color-yellow': scope.row.taskStatus === 1, 'bg-color-cyan': scope.row.taskStatus === 2 }") ] {{ statusSelectList[scope.row.taskStatus].name }}
					el-table-column(prop="state" label="操作" width="100")
						template(slot-scope="scope")
							el-button(type="text" @click="jumpDetails(scope.row)") 查看
							el-button(v-if="scope.row.taskStatus === 0" type="text" @click="handleDelete(scope.row)") 删除
				pagination(v-if="tableData.total > 0"
								:total="tableData.total"
								:page.sync="queryParams.pageNum"
								:limit.sync="queryParams.pageSize"
								@pagination="getList")
</template>

<script>
import {
  getTasksInitiatedList,
  delTaskById,
  tbTaskListShow
} from "@/api/check/create";
import {getNearlyRecentDays} from "@/utils/dateTimeUtils.js";

export default {
  name: "initiatesupervision",
  data() {
    return {
      //初始显示
      querydata:true,
      // 遮罩层
      loading: false,
      // 任务表格数据
      tableData: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        taskId: undefined,
        taskName: "",
        taskStartTime: "",
        taskEndTime: "",
        dispatchWay: "",
        taskStatus: undefined
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
      // 派发方式下拉列表
      distributionMethodList: [
        {
          name: "等量派发",
          value: "1"
        },
        {
          name: "等比派发",
          value: "2"
        },
        {
          name: "自定义派发",
          value: "3"
        }
      ],
      /*****************当前单位直属下级的级别 */
      lowerLevel: undefined,
      pickerOptions:{
        shortcuts:[{
          text:'即刻',
          onClick(picker){
            const date = new Date();
            picker.$emit('pick', date);
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
    this.tbTaskListShow();
  },
  methods: {
    /** 查询任务列表 */
    getList() {
      this.loading = true;
      getTasksInitiatedList(this.queryParams)
        .then(res => {
          this.tableData = res;
          console.log("----",this.tableData);
          if(this.tableData.data.length == 0){
            this.querydata = false;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 获取当前单位直属下级的级别
    tbTaskListShow() {
      tbTaskListShow().then(res => {
        const { data } = res;
        data && (this.lowerLevel = data);
      });
    },
    // 表单重置
    resetSearchForm() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        taskId: undefined,
        taskName: "",
        taskStartTime: "",
        taskEndTime: "",
        dispatchWay: "",
        taskStatus: undefined
      };
      this.getList();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.resetSearchForm();
      this.open = true;
      this.title = "新建检查任务";
    },
    /** 删除按钮操作 */
    handleDelete(row = {}) {
      const { taskName, taskId } = row;
      taskName &&
        this.$confirm('是否确认删除 "' + taskName + '" 任务?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            delTaskById({ taskId }).then(() => {
              this.msgSuccess("删除成功");
              this.getList();
            });
          })
          .catch(() => {});
    },
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
    /**
     * 跳转至详情页面
     */
    jumpDetails(row) {
    	  const {taskId} = row;
      if (taskId) {
        this.$router.push({
          name: "checkDetails",
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
      background url('./image/create.png') left center no-repeat
      background-size 30px
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
