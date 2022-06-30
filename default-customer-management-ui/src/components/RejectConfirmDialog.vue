<template lang="pug">
	//- 驳回通用确认组件
	el-dialog(title="驳回信息" :visible.sync="dialogVisible")
		.dialog-form
			el-form(ref="form" :model="form" :rules="rules" label-width="120px")
				el-form-item(label="要求完成时间" prop="finishDate")
					el-date-picker(
						clearable
						v-model="form.finishDate"
						type="date"
						value-format="yyyy-MM-dd"
						placeholder="请选择" :picker-options="pickerOptions" style="width:100%")
				el-form-item(label="问题类型" prop="issueType")
					el-select(v-model="form.issueType" style="width:100%")
						el-option(v-for="item in issueTypeList"
							:key="item.dictValue"
							:label="item.dictLabel"
							:value="item.dictValue")
				el-form-item(label="问题描述" prop="issueDesc")
					el-input(v-model="form.issueDesc" type="textarea" placeholder="请输入")

		.dialog-footer(slot="footer")
			el-button(type="primary" @click="submitForm") 确 定
			el-button(@click="cancelDialog") 取 消
</template>

<script>
export default {
  name: "RejectConfirmDialog",
  props: {},
  data() {
    return {
      dialogVisible: false,
      /**************************表单部分 */
      form: {
        finishDate: "",
        issueType: "",
        issueDesc: ""
      },
      rules: {
        finishDate: [
          { required: true, message: "要求完成时间不能为空", trigger: "change" }
        ],
        issueType: [
          { required: true, message: "问题类型不能为空", trigger: "change" }
        ],
        issueDesc: [
          { required: true, message: "问题描述不能为空", trigger: "blur" }
        ]
      },
      issueTypeList: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 1000 * 60 * 60 * 24;
        }
      }
    };
  },
  created() {
    // 审核状态字典 列表数据
    this.getDicts("issue_type").then(response => {
      this.issueTypeList = response.data;
    });
  },
  methods: {
    /**
     * 向父级组件回传数据
     */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.$emit("update-component-data", this.form);
        }
      });
    },
    /**
     * 关闭弹窗组件
     */
    cancelDialog() {
      this.dialogVisible = false;
      this.resetForm("form");
    }
  }
};
</script>