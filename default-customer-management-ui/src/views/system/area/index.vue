<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="区域名称">
        <el-input
          v-model="queryParams.areaName"
          placeholder="请输入区域名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryParams.status" placeholder="区域状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >搜索</el-button>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd('', '1')"
          v-hasPermi="['system:area:add']"
        >新增</el-button>
        <el-button type="primary" icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="areaList"
      row-key="areaId"
      lazy
      :load="load"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="areaName" label="区域名称" align="left" width="500"></el-table-column>
      <el-table-column prop="orderNum" label="排序" align="left"></el-table-column>
      <el-table-column prop="status" label="状态" :formatter="statusFormat" width="100"></el-table-column>
      <el-table-column label="创建时间" align="left" prop="createTime" width="160" :formatter="dateFormat">
      <!--<template slot-scope="scope">
        <span>{{ scope.row.createTime }}</span>
      </template>-->
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row, '2')"
            v-hasPermi="['system:area:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row, '1')"
            v-hasPermi="['system:area:add']"
            v-if="scope.row.areaId.toString().substr(6,2) == '00'"
          >新增</el-button>
          <el-button
            v-if="scope.row.parentId != 0"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:area:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改区域对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24" v-if="form.parentId !== 0">
            <el-form-item label="上级区域" prop="parentId">
              <treeselect
                v-model="form.parentId"
                :options="areaOptions"
                :load-options="loadOptions"
                @select="nodeClick"
                placeholder="选择上级区域"
                :disabled="state == '2'"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="state=='2'">
            <el-form-item label="区域编码" required>
              <el-input v-model="form.areaId" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="!form.show&&state=='1'">
            <el-form-item label="区域编码" required>
              <span style="color: red;">已是街道级区域不可添加下级单位，请重新选择！</span>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.show&&state=='1'">
            <el-form-item label="区域编码" prop="areaId">
              <input v-model="form.areaId" type="hidden" />
              <span>{{idCode[0] || ""}}</span>
              <el-select v-model="form.num1" @change="deptIdChange" placeholder style="width: 60px">
                <el-option
                  v-for="(item, index) in form.deptNum"
                  :key="item"
                  :label="index+form.offset"
                  :value="index+form.offset"
                ></el-option>
              </el-select>
              <el-select v-model="form.num2" @change="deptIdChange" placeholder style="width: 60px">
                <el-option v-for="(item, index) in 10" :key="item" :label="index" :value="index"></el-option>
              </el-select>
              <span>{{idCode[1] || ""}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="原区域编码">
              <el-input v-model="form.areaIdOld" placeholder="请输入原系统区域编码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="区域名称" prop="areaName">
              <el-input v-model="form.areaName" placeholder="请输入区域名称" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12" v-if="form.parentId !== 0">
						<el-form-item label="显示排序" prop="orderNum">
							<el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
						</el-form-item>
          </el-col>-->
          <el-col :span="12">
            <el-form-item label="负责人" prop="leader">
              <el-input v-model="form.leader" placeholder="请输入负责人" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="区域状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{dict.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
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
  listArea,
  getArea,
  treeselect,
  delArea,
  addArea,
  updateArea,
  exportArea
} from "@/api/system/area";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { getUserProfile } from "@/api/system/user";
import { getCompanyCode } from "@/utils/companyCodeUtils.js";
import { fileDownload } from "@/utils/fileDownload";
import { formatterDate } from "@/utils/index";
export default {
  name: "regionalmanagement",
  components: { Treeselect },
  data() {
    return {
      show: true,
      state: "1",
      idCode: [],
      deptId: "",
      // 遮罩层
      loading: true,
      // 表格树数据
      areaList: [],
      // 区域区域树选项
      areaOptions: undefined,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        areaId: undefined,
        areaName: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: "上级区域不能为空", trigger: "blur" }
        ],
        areaId: [
          {
            required: true,
            message: "请正确填写区域编码",
            trigger: "blur"
          }
        ],
        areaName: [
          { required: true, message: "区域名称不能为空", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "菜单顺序不能为空", trigger: "blur" }
        ],
        email: [
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        phone: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    //根据登录员工来获取树根节点
    getUserProfile().then(response => {
      this.queryParams.deptId = response.data.deptId;
      if (response.data.deptId === 1000000000) {
        this.queryParams.parentId = 0;
        this.queryParams.deptId = null;
      }
      this.getList();
    });
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
    this.deptId = this.$store.state.user.deptId;
  },
  methods: {
    /** 查询区域列表 */
    getList() {
      this.loading = true;
      listArea(this.queryParams).then(response => {
        this.queryParams.deptId = undefined;
        this.areaList = response.data;
        this.loading = false;
      });
    },
    /** 机构列表钻取 */
    load(tree, treeNode, resolve) {
      this.loading = true;
      this.queryParams.parentId = tree.areaId;
      this.queryParams.areaName = undefined;
      this.queryParams.status = undefined;
      listArea(this.queryParams).then(response => {
        var children = response.data;
        resolve(children);
        this.loading = false;
      });
    },
    /** 查询区域下拉树结构 */
    getTreeselect() {
      let params = {};
      if (this.deptId == "1000000000") {
        params = { parentId: 0 };
      } else {
        params = { deptId: this.deptId };
      }
      treeselect(params).then(response => {
        var treeList = response.data;
        for (var index in treeList) {
          if (treeList[index].hasChildren == true) {
            treeList[index].children = null;
          }
        }
        // console.log(JSON.stringify(treeList))
        this.areaOptions = treeList;
      });
    },
    /** 级连区域下拉树结构 */
    loadOptions({ action, parentNode, callback }) {
      if (action === "LOAD_CHILDREN_OPTIONS") {
        treeselect({ parentId: parentNode.id }).then(response => {
          var treeList = response.data;
          for (var index in treeList) {
            if (treeList[index].hasChildren == true) {
              treeList[index].children = null;
            }
          }
          parentNode.children = treeList;
          callback();
        });
      } else {
        callback();
      }
    },
    // 字典状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    /**
     * [deptIdChange deptId修改]
     * @return {[type]} [description]
     */
    deptIdChange() {
      if (this.form.num1 != undefined && this.form.num2 != undefined) {
        this.form.areaId =
          this.idCode[0] + this.form.num1 + this.form.num2 + this.idCode[1];
      }
    },
    // 表单重置
    reset() {
      this.form = {
        show: true,
        deptNum: 10,
        offset: 0,
        num1: undefined,
        num2: undefined,
        areaId: undefined,
        areaIdOld: undefined,
        parentId: undefined,
        areaName: undefined,
        orderNum: undefined,
        leader: undefined,
        phone: undefined,
        email: undefined,
        status: "0"
      };
      this.resetForm("form");
    },
    /**
     * 修改用户弹框中的归属单位节点选择
     * 解决归属单位回显修改时单位名称没有显示的bug
     *
     * @author Miliky
     * @date 2020/01/06 21:21
     * @param  {map} node       选择的树形节点
     * @param  {[type]} instanceId [description]
     * @return {[type]}          无返回值
     *
     */
    nodeClick(node, instanceId) {
      if (node.id.toString().substr(6, 2) != "00") {
        this.form.parentId = "";
        this.idCode = [];
        this.form.show = false;
        return;
      } else {
        this.form.show = true;
      }
      this.form.parentId = this.form.parent = node.id;
      this.idCode = getCompanyCode(node.id + "");
      var objs = document.getElementsByTagName("div");
      for (var i = 0; i < objs.length; i++) {
        if (objs[i].className == "vue-treeselect__single-value") {
          objs[i].innerHTML = node.label;
        }
      }
      if (this.idCode[0] == "") {
        if (this.form.num1 == "0") this.form.num1 = "";
        this.form.deptNum = 9;
        this.form.offset = 1;
      } else {
        this.form.deptNum = 10;
        this.form.offset = 0;
      }
      if (this.form.num1 != undefined && this.form.num2 != undefined) {
        this.form.areaId =
          this.idCode[0] + this.form.num1 + this.form.num2 + this.idCode[1];
      }
    },
    /**
     *
     * [handleQuery 搜索按钮]
     * @Date 2020/01/09 20:56
     * @return 无返回值
     *
     */
    handleQuery() {
      this.queryParams.parentId = undefined;
      if (
        this.deptId == "1000000000" &&
        this.queryParams.areaName == undefined &&
        (this.queryParams.status == undefined || this.queryParams.status == "0")
      ) {
        this.queryParams.parentId = 0;
      } else if (
        (this.queryParams.areaName == undefined ||
          this.queryParams.areaName == "") &&
        (this.queryParams.status != undefined || this.queryParams.status == "")
      ) {
        this.queryParams.areaName = "";
        this.queryParams.deptId = this.deptId;
      } else {
        this.queryParams.deptId = this.deptId;
      }
      if (this.deptId == "1000000000") {
        if (
          (this.queryParams.areaName == undefined ||
            this.queryParams.areaName == "") &&
          (this.queryParams.status == undefined ||
            this.queryParams.status == "" ||
            this.queryParams.status == "0")
        ) {
          this.queryParams = {
            areaName: undefined,
            status:
              this.queryParams.status == "0"
                ? this.queryParams.status
                : undefined,
            parentId: 0
          };
        }
      } else {
        if (
          (this.queryParams.areaName == undefined ||
            this.queryParams.areaName == "") &&
          (this.queryParams.status == undefined ||
            this.queryParams.status == "")
        ) {
          this.queryParams = {
            areaName: undefined,
            status: undefined,
            deptId: this.deptId
          };
        }
      }

      this.getList();
    },
    /** 新增按钮操作 */
    handleAdd(row, val) {
      this.state = val;
      this.reset();
      this.getTreeselect();
      if (row != undefined) {
        this.form.parentId = row.areaId;
        this.idCode = getCompanyCode(row.areaId + "") || [];
      }
      this.open = true;
      this.title = "添加区域";

      setTimeout(() => {
        //解决下拉懒加载树无法获取未加载的子节点中文问题
        var objs = document.getElementsByTagName("div");
        for (var i = 0; i < objs.length; i++) {
          if (objs[i].className == "vue-treeselect__single-value") {
            objs[i].innerHTML = row.areaName;
          }
        }
      }, 200);
    },
    /** 修改按钮操作 */
    handleUpdate(row, val) {
      this.state = val;
      this.reset();
      this.getTreeselect();
      getArea(row.areaId).then(response => {
        let id = response.data.parentId + "";
        this.form = response.data;
        this.open = true;
        this.title = "修改区域";
        setTimeout(() => {
          //解决下拉懒加载树无法获取未加载的子节点中文问题
          var objs = document.getElementsByTagName("div");
          for (var i = 0; i < objs.length; i++) {
            if (objs[i].className == "vue-treeselect__single-value") {
              objs[i].innerHTML = response.data.parentName;
            }
          }
        }, 200);
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      if (
        this.form.areaId == undefined ||
        this.form.areaName == undefined ||
        this.form.parentId == undefined
      ) {
        this.$message({
          showClose: true,
          message: "请检查必填选项！",
          type: "warning",
          duration: 1000
        });
        return;
      }
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.title === "修改区域") {
            updateArea(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addArea(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm(
        '是否确认删除名称为"' + row.areaName + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delArea(row.areaId);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有区域数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          exportArea(queryParams)
            .then(response => {
              fileDownload(
                `${process.env.VUE_APP_FTP_API + response.msg}`,
                response.msg
              );
              // this.msgSuccess(response.msg);
            })
            .catch(response => {
              response.msg && this.msgError(response.msg);
            });
        })
        .catch(() => {});
    },
    // 前端处理时间格式
    dateFormat(row, column, cellValue, index) {
      var date = row[column.property];
      return formatterDate(date);
    }
  }
};
</script>
