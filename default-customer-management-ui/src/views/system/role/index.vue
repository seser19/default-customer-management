<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="角色名称">
        <el-input
          v-model="queryParams.roleName"
          placeholder="请输入角色名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="权限字符">
        <el-input
          v-model="queryParams.roleKey"
          placeholder="请输入权限字符"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="queryParams.status"
          placeholder="角色状态"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
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


      <!-- 菜单权限下拉框 -->
      <el-form-item label="菜单权限">
            <el-cascader
            style="width:450px"
            v-model="queryParams.menuIds"
            :options="menuOptions2"
            :props="propstree"
            clearable></el-cascader>
      </el-form-item>


      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
           v-hasPermi="['system:role:add']"
        >新增</el-button>
         <!--  -->
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="roleList">
      <el-table-column label="角色编号" prop="roleId" width="100" />
      <el-table-column
        label="角色名称"
        align="left"
        prop="roleName"
        :show-overflow-tooltip="true"
        width="250"
      />
      <el-table-column
        label="权限字符"
        align="left"
        prop="roleKey"
        :show-overflow-tooltip="true"
        width="100"
      />
      <el-table-column label="显示顺序" align="center" prop="roleSort" width="140" />
      <el-table-column label="状态" align="center" width="120">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="left" prop="createTime" width="180" :formatter="dateFormat">
        <!--<template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>-->
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding">
        <template slot-scope="scope">

          <el-button
            size="mini"
            type="text"
            icon="el-icon-share"
            @click="handleUpdate1(scope.row)"
            v-hasPermi="['system:role:see']"
          >查看</el-button>

          <el-button
            v-if="scope.row.sysRoleFlag == 2 || role == false  "
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:role:edit']"
          >修改</el-button>
          <el-button
            v-if="scope.row.sysRoleFlag == 2 || role == false   "
            size="mini"
            :type="buttonColor(scope.row.dataScope)"
            icon="el-icon-circle-check"
            @click="handleDataScope(scope.row)"
            v-hasPermi="['system:role:edit']"
          >数据权限</el-button>
          <el-button
            v-if="scope.row.sysRoleFlag == 2 || role == false   "
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:role:remove']"
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

    <!-- 查看角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open1" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称" :disabled="true"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :disabled="true"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-tree
            :data="menuOptions1"
            show-checkbox
            ref="menu"
            node-key="id"
            empty-text="加载中，请稍后"
            :props="defaultProps1"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button type="primary" @click="submitForm">确 定</el-button> -->
        <el-button type="primary" @click="cancel1">返  回</el-button>
      </div>
    </el-dialog>


    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="权限字符" prop="roleKey">
          <el-input v-model="form.roleKey" placeholder="请输入权限字符" />
        </el-form-item>
        <el-form-item label="角色顺序" prop="roleSort">
          <el-input-number v-model="form.roleSort" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-tree
            :data="menuOptions"
            show-checkbox
            ref="menu"
            node-key="id"
            empty-text="加载中，请稍后"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色数据权限对话框 -->
    <el-dialog :title="title" :visible.sync="openDataScope" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="form.roleName" :disabled="true" />
        </el-form-item>
        <el-form-item label="权限字符">
          <el-input v-model="form.roleKey" :disabled="true" />
        </el-form-item>
        <el-form-item label="权限范围">
          <el-select v-model="form.dataScope">
            <el-option
              v-for="item in dataScopeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据权限" v-show="form.dataScope == 2">
          <el-tree
            :data="deptOptions"
            show-checkbox
            ref="dept"
            node-key="id"
            empty-text="加载中，请稍后"
            lazy
            :load="loadNode"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDataScope">确 定</el-button>
        <el-button @click="cancelDataScope">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
 // listRole,
  listRoleByUserId,
  getRole,
  delRole,
  addRole,
  updateRole,
  dataScope,
  changeRoleStatus
} from "@/api/system/role";
import {
  queryMenuTreeForRoleManage as menuTreeselect,
  roleMenuTreeselect
} from "@/api/system/menu";
import {
  treeselect as deptTreeselect,
  roleDeptTreeselect
} from "@/api/system/dept";

import { getUserProfile } from "@/api/system/user";
import { formatterDate } from "@/utils/index";

export default {
  name: "rolemanagement",
  data() {
    return {
      role:true,
      yincang: false,
      keyValue:0,
      propstree: {  multiple: true, checkStrictly: true,value:'id',label:"label",emitPath:false },
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 角色表格数据
      roleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层（查看数据）
      open1: false,
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
      // 数据范围选项
      dataScopeOptions: [
        {
          value: "1",
          label: "全部数据权限"
        },
        {
          value: "2",
          label: "自定义数据权限"
        },
        {
          value: "3",
          label: "本部门数据权限"
        },
        {
          value: "4",
          label: "本部门及以下数据权限"
        },
        {
          value: "5",
          label: "仅本人数据权限"
        }
      ],
      // 菜单列表
      menuOptions: [],
      // 查看页面菜单列表
      menuOptions1: [{ id:1,disabled: true}],
      //菜单权限
      menuOptions2: [],
      // 部门列表
      deptOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        roleName: undefined,
        roleKey: undefined,
        status: undefined,
        menuIds:[],
      },
      // 表单参数
      form: {},
      // 修改角色tree
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "leaf",
      },
      // 查看角色tree
      defaultProps1: {
        children: "children",
        label: "label",
        isLeaf: "leaf",
        disabled: function(){
          return true;
        }
      },
      // 表单校验
      rules: {
        roleName: [
          { required: true, message: "角色名称不能为空", trigger: "blur" }
        ],
        roleKey: [
          { required: true, message: "权限字符不能为空", trigger: "blur" }
        ],
        roleSort: [
          { required: true, message: "角色顺序不能为空", trigger: "blur" }
        ]
      },
      queryTree: {},
      checkedTree: []
    };
  },
  watch: {
    options(newVal) {
      this.keyValue++ //监听到数据源发生变化 ，改变keyValue的值，达到重新渲染的效果
    },
  },
  created() {
    this.getMenuTreeselect();
    this.getList();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      //目前被选中的菜单节点
      this.getMenuTreeselect();
    },
    /** 查询角色列表 */
    getList() {
      this.loading = true;
      listRoleByUserId(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.roleList = response.rows;
          this.total = response.total;
          this.loading = false;
          console.log("11111",this.roleList)
          if(this.$store.state.user.name == 'admin' ){
           this.role = false;
          }
          
        }
      );
    },
    /** 查询菜单树结构 */
    getMenuTreeselect() {
      menuTreeselect().then(response => {
        this.menuOptions = response.data;
        this.menuOptions1 = response.data;
        this.menuOptions2 = response.data;
      });
    },
    /** 查询部门树结构 */
    getDeptTreeselect() {
      deptTreeselect(this.queryTree).then(response => {
        this.deptOptions = response.data;

        this.$refs.dept.setCheckedKeys(this.checkedTree);
      });
    },
    /** 级连部门下拉左侧树结构 */
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([]);
      }
      deptTreeselect({ parentId: node.data.id }).then(response => {
        var treeList = response.data;
        for (var index in treeList) {
          if (treeList[index].hasChildren != true) {
            treeList[index].leaf = true;
          }
        }
        resolve(treeList);

        this.$refs.dept.setCheckedKeys(this.checkedTree);
      });
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      let checkedKeys = this.$refs.menu.getCheckedKeys();
      // 半选中的菜单节点
      let halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    // 所有部门节点数据
    getDeptAllCheckedKeys() {
      // 目前被选中的部门节点
      let checkedKeys = this.$refs.dept.getCheckedKeys();
      // 半选中的部门节点
      let halfCheckedKeys = this.$refs.dept.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      // console.log(JSON.stringify(checkedKeys))
      // console.log(JSON.stringify(halfCheckedKeys))
      return checkedKeys;
    },
    /** 根据角色ID查询菜单树结构 */
    getRoleMenuTreeselect(roleId) {
      roleMenuTreeselect(roleId).then(response => {
        this.getMenuTreeselect();
        this.$refs.menu.setCheckedKeys(response.data);
      });
    },
    /** 根据角色ID查询部门树结构 */
    getRoleDeptTreeselect(roleId) {
      roleDeptTreeselect(roleId).then(response => {
        this.checkedTree = response.data;
        //根据登录员工来获取树根节点
        getUserProfile().then(response => {
          this.queryTree.deptRoots = response.deptRoots;
          if (response.data.admin) {
            this.queryTree.deptRoots = 1000000000;
          }
          this.getDeptTreeselect();
        });
      });
    },
    // 角色状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm(
        '确认要"' + text + '""' + row.roleName + '"角色吗?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return changeRoleStatus(row.roleId, row.status);
        })
        .then(() => {
          this.msgSuccess(text + "成功");
        })
        .catch(function() {
          row.status = row.status === "0" ? "1" : "0";
        });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 取消按钮 （查看界面）
    cancel1() {
      this.open1 = false;
      this.reset();
    },
    // 取消按钮（数据权限）
    cancelDataScope() {
      this.openDataScope = false;
      this.reset();
    },
    // 表单重置
    reset() {
      if (this.$refs.tree != undefined) {
        this.$refs.tree && this.$refs.tree.setCheckedKeys([]);
      }
      this.form = {
        roleId: undefined,
        roleName: undefined,
        roleKey: undefined,
        roleSort: 0,
        status: "0",
        menuIds: [],
        deptIds: [],
        remark: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getMenuTreeselect();
      this.open = true;
      this.title = "添加角色";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      getRole(row.roleId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改角色";
        this.$nextTick(() => {
          this.getRoleMenuTreeselect(row.roleId);
        });
      });
    },
    /** 查看按钮操作 */
    handleUpdate1(row) {
      this.reset();
      getRole(row.roleId).then(response => {
        this.form = response.data;
        this.open1 = true;
        this.title = "查看角色";
        this.$nextTick(() => {
          this.getRoleMenuTreeselect(row.roleId);
        });
      });
    },
    /** 分配数据权限操作 */
    handleDataScope(row) {
      this.reset();
      getRole(row.roleId).then(response => {
        this.form = response.data;
        this.openDataScope = true;
        this.title = "分配数据权限";
        this.$nextTick(() => {
          this.getRoleDeptTreeselect(row.roleId);
        });
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.roleId != undefined) {
            this.form.menuIds = this.getMenuAllCheckedKeys();
            updateRole(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            this.form.menuIds = this.getMenuAllCheckedKeys();
            addRole(this.form).then(response => {
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
    /** 提交按钮（数据权限） */
    submitDataScope: function() {
      if (this.form.roleId != undefined) {
        this.form.deptIds = this.getDeptAllCheckedKeys();
        dataScope(this.form).then(response => {
          if (response.code === 200) {
            this.msgSuccess("修改成功");
            this.openDataScope = false;
            this.getList();
          } else {
            this.msgError(response.msg);
          }
        });
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm(
        '是否确认删除名称为"' + row.roleName + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delRole(row.roleId);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
    buttonColor(val) {
      if (val == null) {
        return "danger";
      } else {
        return "text";
      }
    },
    // 前端处理时间格式
    dateFormat(row, column, cellValue, index) {
      var date = row[column.property];
      return formatterDate(date);
    }
  }
};
</script>
