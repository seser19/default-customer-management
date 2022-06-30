<template>
  <div class="app-container">
    <el-form :inline="true" label-width="80px">
      <el-form-item label="标签类别">
        <el-select
          v-model="form.tagType"
          placeholder="标签类别"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in tagTypeList"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="标签名称">
        <el-input
          v-model="form.tagName"
          placeholder="请输入标签名称"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>

      <el-form-item label="使用范围">
        <el-select
          v-model="form.visibleRange"
          placeholder="使用范围"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="form.time"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :clearable="false"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
        <el-button type="default" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增标签</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="typeList" style="width: 100%;">
      <el-table-column label="序号" align="center" type="index" />
      <el-table-column label="标签名称" align="center" prop="tagName" :show-overflow-tooltip="true" />
      <el-table-column label="标签类别" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.tagType == 'J'">警情</span>
          <span v-else-if="scope.row.tagType == 'C'">出动</span>
          <span v-else-if="scope.row.tagType == 'Z'">灾情</span>
        </template>
      </el-table-column>
      <el-table-column label="使用范围" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.visibleRange == 1">本级可见</span>
          <span v-else-if="scope.row.visibleRange == 2">本级及下级可见</span>
        </template>
      </el-table-column>

      <el-table-column label="创建人" align="center" prop="userName" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180" :formatter="dateFormat">
        <!--<template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>-->
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form1" :rules="rules" label-width="80px">
        <el-form-item label="标签名称">
          <el-input v-model="form1.tagName" placeholder="请输入标签名称"/>
        </el-form-item>
        <el-form-item label="标签类别">
          <el-select
            v-model="form1.tagType"
            placeholder="标签类别"
            clearable
            style="width: 240px">
            <el-option
              v-for="t in tagTypeList"
              :key="t.value"
              :label="t.label"
              :value="t.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="使用范围">
          <el-select
            v-model="form1.visibleRange"
            placeholder="使用范围"
            clearable
            style="width: 240px"
          >
            <el-option
              v-for="dict in statusOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listTarget,
  addTarget,
  updateTarget,
  delTarget,
  targetNameTarget
} from "@/api/system/dict/target";
import { formatterDate } from "@/utils/index";

export default {
  name: "dictionarymanagement",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 字典表格数据
      typeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [{
        value: 1,
        label: "本级可见"
      },{
        value: 2,
        label: "本级及下级可见"
      }],
      //  标签类别列表
      tagTypeList: [{
        value:"J",
        label: "警情"
      },{
        value: "Z",
        label: "灾情"
      }],
      
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        dictName: undefined,
        dictType: undefined,
        status: undefined
      },
      // 表单参数
      form: {
        tagName: "",
        visibleRange: "",
        time: ["",""],
        tagType: ""
      },
      form1: {
        tagName: "",
        visibleRange: "",
        tagType: ""
      },
      // 表单校验
      rules: {
        dictName: [
          { required: true, message: "标签名称不能为空", trigger: "blur" }
        ],
        dictType: [
          { required: true, message: "使用范围不能为空", trigger: "blur" }
        ]
      },
      addOrUpdateFlag: true
    };
  },
  created() {
    this.getList();
    // this.getDicts("sys_normal_disable").then(response => {
    //   this.statusOptions = response.data;
    // });
  },
  methods: {
    /** 查询字典类型列表 */
    getList() {
      this.loading = true;
      let _params = {
        tagName: this.form.tagName,
        visibleRange: this.form.visibleRange,
        tagType: this.form.tagType,
        beginTime: this.form.time[0],
        endTime: this.form.time[1],
        pageSize: this.queryParams.pageSize,
        pageNum: this.queryParams.pageNum
      }
      listTarget(_params).then(
        response => {
          this.loading = false;
          if (response.code === 200) {
            this.typeList = response.data.rows;
            this.total = response.data.total;
          } else {
            this.msgError(response.msg);
          }

        }
      );
    },
    // 字典状态字典翻译
    // statusFormat(row, column) {
    //   return this.selectDictLabel(this.statusOptions, row.status);
    // },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        tagName: "",
        visibleRange: "",
        time: ["",""]
      };
      this.form1 = {
        tagName: "",
        visibleRange: "",
        tagType: ""
      }
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      this.queryParams.pageNum = 1;
      this.reset();
      this.getList();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增标签";
      this.addOrUpdateFlag = true;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      console.log(row);
      // getType(row.dictId).then(response => {
      //   this.form = response.data;
      this.form1.tagId = row.tagId;
      this.form1.tagName = row.tagName;
      this.form1.visibleRange = row.visibleRange;
      this.form1.tagType = row.tagType;
        this.open = true;
        this.title = "修改标签";
        this.addOrUpdateFlag = false;
      // });
    },
    /** 提交按钮 */
    submitForm: function() {
      // this.$refs["form"].validate(valid => {
        // if (valid) {
          if(!this.addOrUpdateFlag) {
            // let _params = (({tagName, visibleRange}) =>({tagName, visibleRange}))(this.form);
            updateTarget(this.form1).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            // let _params = (({tagName, visibleRange}) =>({tagName, visibleRange}))(this.form);
            addTarget(this.form1).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        // }
      // });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm(
        '是否确认删除名称为"' + row.tagName + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delTarget({"tagId": row.tagId});
        })
        .then((res) => {
          if(res.code == 200) {
            this.msgSuccess("删除成功");
            this.getList();
          }
        })
        .catch(function() {});
    },
    // 前端处理时间格式
    dateFormat(row, column, cellValue, index) {
      var date = row[column.property];
      return formatterDate(date);
    }
  }
};
</script>
