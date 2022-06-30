<template lang="pug">
.app-container
	.reporting-title
		h2 {{ $route.meta.title }}
		.btn_orange(@click="handleAdd") 新增
	.page-content
		el-table(v-loading="loading" :data="configList")
			el-table-column(type="index" label="序号" width="50")
			el-table-column(label="挂起时间段" width="300")
				template(slot-scope="scope")
					span {{ scope.row.startTime && formatterDate(scope.row.startTime) || '-' }} 至 
					span {{ scope.row.endTime && formatterDate(scope.row.endTime) || '-' }}
			el-table-column(prop="deptName" label="适用单位" width="300" show-overflow-tooltip)
			el-table-column(prop="modelName" label="挂起对象" width="200" show-overflow-tooltip)
			el-table-column(prop="modelCode" label="禁止操作" width="160" show-overflow-tooltip)
			el-table-column(label="状态")
				template(slot-scope="scope")
					el-switch(v-model="scope.row.status"
						:active-value="0"
						:inactive-value="1"
						@change="handleStatusChange(scope.row)")
			el-table-column(label="操作")
				template(slot-scope="scope")
					el-button(size="mini"
						type="text"
						icon="el-icon-edit"
						@click="handleUpdate(scope.row)"
						v-hasPermi="['system:config:edit']") 修改
					el-button(size="mini"
						type="text"
						icon="el-icon-delete"
						@click="handleDelete(scope.row)"
						v-hasPermi="['system:config:remove']") 删除

		pagination(v-show="total>0"
			:total="total"
			:page.sync="queryParams.pageNum"
			:limit.sync="queryParams.pageSize"
			@pagination="getList")

		//- 添加或修改挂起功能配置对话框
		el-dialog(:title="title" :visible.sync="open")
			el-form(ref="form" :model="queryParams" :rules="rules" label-width="100px")
				el-form-item.period-content(label="挂起时间段")
					el-date-picker(
						clearable
						v-model="queryParams.startTime"
						type="date"
						value-format="yyyy-MM-dd"
						placeholder="选择开始时间" @change="paramTimeChange")
					span.connecting-line -
					el-date-picker(clearable
						v-model="queryParams.endTime"
						type="date"
						value-format="yyyy-MM-dd"
						placeholder="选择结束时间" @change="paramTimeChange")
					el-popover(placement="top-start" width="200" trigger="hover" content="可以只选择一个时间；不填写开始时间即代表某日之前；不填写结束时间即代表某日之后；")
						i.el-icon-info(slot="reference")
				el-form-item(label="适用单位")
					identity-tree(@update-component-data="setDeptData"
						:dept-data="queryParams.deptId"
						:is-multiple="true")
				el-form-item(label="挂起对象")
					el-checkbox-group(v-model="queryParams.modelName")
						el-checkbox(v-for="item in modelNameList" :key="item.value" :label="item.value") {{ item.name }}
				el-form-item(label="禁止操作")
					el-checkbox-group(v-model="queryParams.modelCode")
						el-checkbox(v-for="item in modelCodeList" :key="item.value" :label="item.value") {{ item.name }}

			div(slot="footer" class="dialog-footer")
				el-button(type="primary" @click="submitForm") 确 定
				el-button(@click="cancel") 取 消
</template>

<script>
import {
  listConfig,
  getConfig,
  delConfig,
  addConfig,
  updateConfig,
  exportConfig
} from "@/api/businessManagement/reportPending";
import IdentityTree from "@/components/IdentityTree";

export default {
  name: "reportPending",
  components: { IdentityTree },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 数据总数量
      total: 0,
      // 挂起功能配置表格数据
      configList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deptId: "",
        deptName: "",
        modelName: [],
        modelCode: [],
        startTime: "",
        endTime: "",
        status: undefined
      },
      // 表单校验
      rules: {},
      // 挂起对象 列表
      modelNameList: [
        {
          name: "警情派发",
          value: "警情派发"
        },
        {
          name: "未出动火灾",
          value: "未出动火灾"
        }
      ],
      // 禁止操作 列表
      modelCodeList: [
        {
          name: "新增",
          value: "新增"
        },
        {
          name: "修改",
          value: "修改"
        },
        {
          name: "删除",
          value: "删除"
        }
      ]
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询挂起功能配置列表 */
    getList() {
      this.loading = true;
      const { pageNum, pageSize } = this.queryParams;
      listConfig({
        pageNum,
        pageSize
      }).then(response => {
        this.configList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /**
     * 新增/修改 挂起功能配置
     */
    addOrUpdateConfig(changeStatus) {
      let params = { ...this.queryParams };
      // 判断是否是修改状态的，如果不是需要校验/组装数据
      if (!changeStatus) {
        const { startTime, endTime, modelName, modelCode, deptId } = params;
        // 判断 挂起时间段 必须选择一个
        if (!startTime && !endTime) {
          this.$message.warning("开始时间或者结束时间必须选择一个");
          return;
        }
        // 判断 适用单位 不能为空
        if (!deptId) {
          this.$message.warning("适用单位不能为空");
          return;
        }
        params.modelName = modelName.join(",");
        params.modelCode = modelCode.join(",");
      }
      if (params.id) {
        // 修改
        updateConfig(params)
          .then(response => {
            if (response.code === 200) {
              this.msgSuccess("修改成功");
            } else {
              this.msgError(response.msg);
            }
          })
          .finally(() => {
            this.cancel();
            this.getList();
          });
      } else {
        // 新增
        // 手动设置状态字段
        params.status = 0;
        addConfig(params)
          .then(response => {
            if (response.code === 200) {
              this.msgSuccess("新增成功");
            } else {
              this.msgError(response.msg);
            }
          })
          .finally(() => {
            this.cancel();
            this.getList();
          });
      }
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.queryParams = {
        deptId: "",
        deptName: "",
        modelName: [],
        modelCode: [],
        startTime: "",
        endTime: "",
        status: undefined
      };
      this.resetForm("form");
    },
    /**
     * 派发单位 组件选中回调
     */
    setDeptData(data) {
      if (data && data.length) {
        let deptIds = [],
          deptNames = [];
        data.forEach(element => {
          deptIds.push(element.value || "");
          deptNames.push(element.label || "");
        });
        this.queryParams.deptId = deptIds.join(",");
        this.queryParams.deptName = deptNames.join(",");
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.title = "新增挂起";
      this.open = true;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.title = "修改挂起";
      this.queryParams = { ...row };
      // 重置适用单位为当前单位，修复组件选择时产生的问题
      this.queryParams.deptId = this.queryParams.deptName = "";
      // 转换数据
      const { modelName, modelCode } = this.queryParams;
      this.queryParams.modelName = modelName.split(",");
      this.queryParams.modelCode = modelCode.split(",");
      this.open = true;
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.addOrUpdateConfig();
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const { id } = row;
      this.$confirm("是否确认删除该挂起功能?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return delConfig(id);
        })
        .then(() => {
          this.msgSuccess("删除成功");
          this.getList();
        })
        .catch(() => {});
    },
    // 用户状态修改
    handleStatusChange(row) {
      let text = row.status === 0 ? "开启" : "关闭";
      this.$confirm(`确认要${text}吗?`, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.queryParams = { ...row };
          this.addOrUpdateConfig(true);
        })
        .catch(() => {
          row.status = row.status === 0 ? 1 : 0;
        });
    },
    /**
     * 开始时间 和 结束时间验证
     */
    paramTimeChange(val) {
      if (this.queryParams.startTime && this.queryParams.endTime) {
        let ksrqGettime = new Date(this.queryParams.startTime).getTime();
        let jsrqGettime = new Date(this.queryParams.endTime).getTime();
        if (ksrqGettime > jsrqGettime) {
          this.$message.warning("开始时间不能大于结束时间");
          this.queryParams.startTime = this.queryParams.endTime;
        }
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
      background url('~@/assets/image/businessManagement/reportPending/title-icon.png') left center no-repeat
      background-size 24px
>>>.period-content
  .el-form-item__content
    display flex
    justify-content space-between
    .el-date-editor
      width 45%
  span
    width 5%
    text-align center
  .el-icon-info
    font-size 20px
    color $dark-font-color
</style>