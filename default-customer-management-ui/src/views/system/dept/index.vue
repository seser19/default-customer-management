<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="单位名称">
        <el-input
          v-model="queryParams.deptName"
          placeholder="请输入单位名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="queryParams.status"
          placeholder="单位状态"
          clearable
          size="small"
        >
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
          >搜索</el-button
        >
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd('', '1')"
          v-hasPermi="['system:dept:add']"
          >新增</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          >导出</el-button
        >
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="deptList"
      row-key="deptId"
      lazy
      :load="load"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column
        prop="deptName"
        label="单位名称"
        align="left"
        width="500"
      ></el-table-column>
      <el-table-column
        prop="deptId"
        label="编码"
        align="left"
      ></el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        :formatter="statusFormat"
        width="100"
      ></el-table-column>
      <el-table-column
        label="创建时间"
        align="left"
        prop="createTime"
        width="160"
        :formatter="dateFormat"
      >
        <!--<template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>-->
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row, '2')"
            v-hasPermi="['system:dept:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row, '1')"
            v-hasPermi="['system:dept:add']"
            v-if="scope.row.deptId.toString().substr(6, 2) == '00'"
            >新增</el-button
          >
          <el-button
            v-if="scope.row.parentId != 0"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:dept:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改单位对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级单位" prop="parentId">
              <treeselect
                v-model="form.parentId"
                :options="deptOptions"
                :load-options="loadOptions"
                @select="nodeClick"
                placeholder="选择上级单位"
                :disabled="state == '2'"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="单位名称" prop="deptName">
              <el-input v-model="form.deptName" placeholder="请输入单位名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="队伍性质" prop="deptNature">
              <el-cascader
                v-model="form.deptNature"
                :options="deptNatureOption"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-col>

          <el-col :span="12" v-if="state == '2'">
            <el-form-item label="单位编码">
              <el-input v-model="form.deptId" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="!form.show && state == '1'">
            <el-form-item label="单位编码" required>
              <span style="color: red"
                >已是中队级单位不可添加下级单位，请重新选择！</span
              >
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.show && state == '1'">
            <el-form-item label="单位编码" prop="deptId">
              <input v-model="form.deptId" type="hidden" />
              <span>{{ suffixData[0] || "" }}</span>
              <el-select
                v-model="form.num1"
                @change="deptIdChange"
                placeholder
                style="width: 60px"
              >
                <el-option
                  v-for="(item, index) in form.deptNum"
                  :key="item"
                  :label="index + form.offset"
                  :value="index + form.offset"
                ></el-option>
              </el-select>
              <el-select
                v-model="form.num2"
                @change="deptIdChange"
                placeholder
                style="width: 60px"
              >
                <el-option
                  v-for="(item, index) in 10"
                  :key="item"
                  :label="index"
                  :value="index"
                ></el-option>
              </el-select>
              <span>{{ suffixData[1] || "" }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="原单位编码">
              <el-input
                v-model="form.deptIdOld"
                placeholder="请输入原系统单位编码"
              />
            </el-form-item>
          </el-col>
          <!--  <el-col :span="12" v-if="form.parentId !== 0">
						<el-form-item label="显示排序" prop="orderNum">
							<el-input-number v-model="form.orderNum" controls-position="right" :min="0"/>
						</el-form-item>
          </el-col>-->
          <el-col :span="12">
            <el-form-item label="负责人" prop="leader">
              <el-input
                v-model="form.leader"
                placeholder="请输入负责人"
                maxlength="20"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input
                v-model="form.phone"
                placeholder="请输入联系电话"
                maxlength="11"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="form.email"
                placeholder="请输入邮箱"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="对应区域" prop="areaName">
              <el-input
                v-model="form.areaName"
                readonly
                placeholder="请选择对应区域"
              >
                <i
                  slot="suffix"
                  class="iconfont icon-icon-test"
                  @click="openAreaSelect()"
                />
                <i
                  slot="suffix"
                  class="el-icon-circle-close"
                  style="margin-left: 5px; cursor: pointer"
                  @click="clearArea()"
                  v-show="form.areaId && state !== '2'"
                />
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                  >{{ dict.dictLabel }}</el-radio
                >
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
    <!-- 行政区域弹出层 -->
    <provModal ref="areaSelect" @setProv="setSelectedArea"></provModal>
  </div>
</template>

<script>
import {
  listDept,
  listDeptPage,
  getDept,
  treeselect,
  delDept,
  addDept,
  updateDept,
  exportDept,
} from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import provModal from "@/views/data/entry/jqxx/components/provModal";
import { getUserProfile } from "@/api/system/user";
import { getCompanyCode } from "@/utils/companyCodeUtils.js";
import { fileDownload } from "@/utils/fileDownload";
import { formatterDate } from "@/utils/index";

export default {
  name: "unitmanagement",
  components: { Treeselect, provModal },
  data() {
    return {
      state: "1",
      suffixData: [],
      // 遮罩层
      loading: true,
      // 表格树数据
      deptList: [],
      // 单位单位树选项
      deptOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        deptId: "",
        deptName: "",
        status: "",
      },
      deptReadonly: true,
      // 队伍性质选项
      deptNatureOption: [
        {
          value: "3",
          label: "专职队",
          children: [
            {
              value: "301",
              label: "城区县城政府专职消防队",
            },
            {
              value: "302",
              label: "乡镇政府专职消防队",
            },
            {
              value: "303",
              label: "企事业单位专职消防队",
            },
          ],
        },
        {
          value: "5",
          label: "国家队",
        },
        {
          value: "7",
          label: "志愿队",
          children: [
            {
              value: "701",
              label: "城区县城志愿消防队",
            },
            {
              value: "702",
              label: "乡镇志愿消防队",
            },
            {
              value: "703",
              label: "单位志愿消防队",
            },
            {
              value: "704",
              label: "民间志愿消防队",
            },
          ],
        },
      ],
      // 表单参数
      form: {
        areaName: "",
        areaId: "",
      },
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: "上级单位不能为空", trigger: "change" },
        ],
        deptId: [
          {
            required: true,
            message: "单位编码不能为空",
            trigger: ["blur", "change"],
          },
        ],
        deptName: [
          { required: true, message: "单位名称不能为空", trigger: "blur" },
        ],
        orderNum: [
          { required: true, message: "菜单顺序不能为空", trigger: "blur" },
        ],
        areaId: [
          { required: true, message: "菜单顺序不能为空", trigger: "change" },
        ],
        email: [
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        phone: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
        deptNature: [
          { required: true, message: "队伍性质不能为空", trigger: "change" },
        ],
      },
    };
  },
  created() {
    //根据登录员工来获取树根节点
    getUserProfile().then((response) => {
      this.queryParams.deptRoots = response.deptRoots;
      if (response.data.admin) {
        this.queryParams.deptRoots = 1000000000;
      }
      this.getList();
    });

    this.getDicts("sys_normal_disable").then((response) => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    // 打开行政区域的模态框
    openAreaSelect() {
      this.$refs.areaSelect.toggle();
    },
    // 设置所选地区
    setSelectedArea(obj, { first, second, third, last }) {
      this.form.areaId = obj.id;
      // this.form.areaName = obj.name;
      // this.getSubdivision();
      this.form.areaName = `${first} ${second} ${third} ${last}`;
      this.$forceUpdate();
    },
    // 清空所选地区
    clearArea() {
      this.form.areaId = "";
      this.form.areaName = "";
      this.$refs.areaSelect.clear();
      this.$forceUpdate();
    },
    /** 查询单位列表 */
    getList() {
      this.loading = true;
      this.deptList = [];
      listDeptPage(this.queryParams).then((response) => {
        this.deptList = response.data;
        this.loading = false;
      });
    },
    /** 机构列表钻取 */
    load(tree, treeNode, resolve) {
      this.loading = true;
      listDeptPage({ parentId: tree.deptId }).then((response) => {
        var children = response.data;
        resolve(children);
        this.loading = false;
      });
    },
    /** 查询单位下拉树结构 */
    getTreeselect() {
      treeselect(this.queryParams).then((response) => {
        var treeList = response.data;
        for (var index in treeList) {
          if (treeList[index].hasChildren == true) {
            treeList[index].children = null;
          }
        }
        // console.log(JSON.stringify(treeList))
        this.deptOptions = treeList;
      });
    },
    /** 级连单位下拉树结构 */
    loadOptions({ action, parentNode, callback }) {
      if (action === "LOAD_CHILDREN_OPTIONS") {
        treeselect({ parentId: parentNode.id }).then((response) => {
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
      if (
        (this.form.num1 != undefined || this.form.num1 != "") &&
        (this.form.num2 != undefined || this.form.num2 != "")
      ) {
        this.form.deptId =
          this.suffixData[0] +
          this.form.num1 +
          this.form.num2 +
          this.suffixData[1];
      }
    },
    // 表单重置
    reset() {
      this.form = {
        show: true,
        deptNum: 10,
        offset: 0,
        deptIdOld: undefined,
        deptId: undefined,
        num1: undefined,
        num2: undefined,
        parentId: undefined,
        deptName: undefined,
        orderNum: undefined,
        leader: undefined,
        phone: undefined,
        email: undefined,
        status: "0",
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.parentId = undefined;
      this.getList();
    },
    /** 新增按钮操作 */
    handleAdd(row, val) {
      this.state = val;
      this.deptReadonly = false;
      this.reset();

      //根据登录员工来获取树根节点
      getUserProfile().then((response) => {
        this.queryParams.deptRoots = response.deptRoots;
        if (response.data.admin) {
          this.queryParams.deptRoots = 1000000000;
        }
        this.getTreeselect();
      });

      if (row != undefined) {
        this.form.parentId = row.deptId;
        this.suffixData = getCompanyCode(row.deptId + "") || [];
      }
      this.open = true;
      this.title = "添加单位";

      setTimeout(() => {
        //解决下拉懒加载树无法获取未加载的子节点中文问题
        var objs = document.getElementsByTagName("div");
        for (var i = 0; i < objs.length; i++) {
          if (objs[i].className == "vue-treeselect__single-value") {
            objs[i].innerHTML = row.deptName;
          }
        }
      }, 200);
    },
    /**
     * 修改单位弹框中的归属单位节点选择
     * 解决归属单位回显修改时单位名称没有显示的bug
     *
     * @author Miliky
     * @date 2020/01/05 14:27
     * @param  {map} node       选择的树形节点
     * @param  {[type]} instanceId [description]
     * @return {[type]}          无返回值
     *
     */
    nodeClick(node, instanceId) {
      if (node.id.toString().substr(6, 2) != "00") {
        this.form.parentId = "";
        this.form.deptId = "";
        this.suffixData = [];
        this.form.show = false;
        return;
      } else {
        this.form.show = true;
      }
      this.form.deptId = node.id;
      this.suffixData = getCompanyCode(node.id + "");
      let objs = document.getElementsByTagName("div");
      for (var i = 0; i < objs.length; i++) {
        if (objs[i].className == "vue-treeselect__single-value") {
          objs[i].innerHTML = node.label;
        }
      }
      if (this.suffixData[0] == "") {
        if (this.form.num1 == "0") this.form.num1 = "";
        this.form.deptNum = 9;
        this.form.offset = 1;
      } else {
        this.form.deptNum = 10;
        this.form.offset = 0;
      }
      if (this.form.num1 != undefined && this.form.num2 != undefined) {
        this.form.deptId =
          this.suffixData[0] +
          this.form.num1 +
          this.form.num2 +
          this.suffixData[1];
      }
    },
    /** 修改按钮操作 */
    handleUpdate(row, val) {
      this.state = val;
      this.deptReadonly = true;
      this.reset();
      this.form = {
        areaName: "",
        areaId: "",
      };
      //根据登录员工来获取树根节点
      getUserProfile().then((response) => {
        this.queryParams.deptRoots = response.deptRoots;
        if (response.data.admin) {
          this.queryParams.deptRoots = 1000000000;
        }
        this.getTreeselect();
      });

      getDept(row.deptId).then((response) => {
        this.form = response.data;
        // console.log(this.form, 111111111111);
        const { deptNature, deptNatureBranch } = response.data;
        deptNatureBranch
          ? (this.form.deptNature = deptNatureBranch)
          : (this.form.deptNature = deptNature);
        // deptNatureBranch?this.form.deptNature = deptNature:(this.form.deptNature=deptNatureBranch);
        this.open = true;
        this.title = "修改单位";
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
    submitForm: function () {
      // deptId: undefined,
      //      num1:undefined,
      //      num2:undefined,
      //      parentId: 100,
      //      deptName: undefined,
      if (
        this.form.deptId == undefined ||
        this.form.parentId == undefined ||
        this.form.deptName == undefined
      ) {
        this.$message({
          showClose: true,
          message: "请检查必填选项！",
          type: "warning",
          duration: 1000,
        });
        return;
      }
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.title == "修改单位") {
            if (this.form.deptNature.length === 2) {
              console.log("222",this.form.deptNature)
              const deptN = {
                deptNature: this.form.deptNature[0],
                deptNatureBranch:this.form.deptNature[1]
              };
              updateDept({ ...this.form, ...deptN }).then((response) => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                } else {
                  this.msgError(response.msg);
                }
              });
            } else {
              console.log("333",this.form.deptNature)
              const deptN = {
                deptNature: this.form.deptNature[0],
                deptNatureBranch: this.form.deptNature.length == 1 ? null :this.form.deptNature,
              };
              updateDept({ ...this.form, ...deptN }).then((response) => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                } else {
                  this.msgError(response.msg);
                }
              });
            }
          } else {
            const deptN = {
              deptNature: this.form.deptNature[0],
              deptNatureBranch:
                this.form.deptNature.length === 2
                  ? this.form.deptNature[1]
                  : null,
            };
            addDept({ ...this.form, ...deptN }).then((response) => {
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
        '是否确认删除名称为"' + row.deptName + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delDept(row.deptId);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有单位数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          exportDept(queryParams)
            .then((response) => {
              fileDownload(
                `${process.env.VUE_APP_FTP_API + response.msg}`,
                response.msg
              );
              // this.msgSuccess(response.msg);
            })
            .catch((response) => {
              response.msg && this.msgError(response.msg);
            });
        })
        .catch(() => {});
    },
    // 前端处理时间格式
    dateFormat(row, column, cellValue, index) {
      var date = row[column.property];
      return formatterDate(date);
    },
  },
};
</script>
