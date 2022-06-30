<template>
  <div class="app-container">
    <el-row :gutter="5">
      <!--单位数据-->
      <el-col :span="6" :xs="24">
        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="请输入单位名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            node-key="id"
            accordion
            :default-expanded-keys="[defaultOpenKey]"
            ref="tree"
            lazy
            :load="loadNode"
            @node-click="handleNodeClick"
          >
            <span slot-scope="{ node, data }">
              <span :title="node.label">{{ node.label }}</span>
            </span>
          </el-tree>
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="18" :xs="24">
        <el-form :inline="true" label-width="80px">
          <el-form-item label="用户账号">
            <el-input
              v-model="queryParams.userName"
              placeholder="请输入用户账号"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input
              v-model="queryParams.phonenumber"
              placeholder="请输入手机号码"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="queryParams.queryLevelFlag" true-label="1" false-label="0">仅本单位用户</el-checkbox>
          </el-form-item>
          <el-form-item label="状态">
            <el-select
              v-model="queryParams.status"
              placeholder="用户状态"
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

          <el-form-item label="角色">
            <el-select v-model="queryParams.roleIds" multiple placeholder="请选择" style="width:450px">
              <el-option
                v-for="item in roleOptions"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId"
                :disabled="item.status == 1"
              ></el-option>
            </el-select>
          </el-form-item>

          <!-- 菜单权限下拉框 -->
          <el-form-item label="菜单权限">
                <el-cascader
                style="width:450px"
                v-model="queryParams.menuIds"
                :options="menuOptions"
                ref="form2"
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
              v-hasPermi="['system:user:add']"
            >新增</el-button>
          </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="userList">
          <!-- <el-table-column label="用户编号" align="center" prop="userId"/> -->
          <el-table-column label="用户账号" align="left" prop="userName" show-overflow-tooltip />
          <el-table-column label="用户名称" align="left" prop="nickName" show-overflow-tooltip />
          <el-table-column label="单位" align="left" prop="dept.deptName" show-overflow-tooltip />
          <el-table-column label="手机号码" align="left" prop="phonenumber" width="100" />
          <el-table-column label="状态" align="center" width="60">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="0"
                inactive-value="1"
                @change="handleStatusChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="left" prop="createTime" width="145" :formatter="dateFormat">
<!--            <template slot-scope="scope">-->
<!--              <span>{{ scope.row.createTime }}</span>-->
<!--            </template>-->
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="180"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">

              <el-button
                size="mini"
                type="text"
                icon="el-icon-share"
                @click="handleUpdate1(scope.row)"
                v-hasPermi="['system:user:see']"
              >查看</el-button>

              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['system:user:edit']"
              >修改</el-button>
              <el-button
                v-if="scope.row.userId !== 1"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['system:user:remove']"
              >删除</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-key"
                @click="handleResetPwd(scope.row)"
                v-hasPermi="['system:user:resetPwd']"
              >重置</el-button>
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
      </el-col>
    </el-row>

    <!-- 查看参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open1" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="归属单位" prop="deptId">
              <treeselect
                v-model="form.deptId"
                :options="deptOptions"
                :load-options="loadOptions"
                @select="nodeClick"
                placeholder="请选择归属单位"
                :disabled="true"
                style="height:32px;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户名称" prop="nickName">
              <el-input v-model="form.nickName"  :disabled="true" placeholder="请输入用户名称"/>
            </el-form-item>
          </el-col>

          <el-col :span="12" v-if="form.userId == undefined">
            <el-form-item label="用户账号" prop="userNamePrepend"  >
              <el-input
                v-model="form.userNamePrepend"
                placeholder="请输入用户账号"
                :disabled="true"
                style="width:40%;"
              ></el-input>
              <el-select v-model="form.userNameSuffix" placeholder="请选择" style="width:40%;">
                <el-option
                  v-for="(item, index) in suffixData"
                  :label="item"
                  :value="item"
                  :key="index"
                ></el-option>
              </el-select>
              <el-tooltip
                class="item"
                effect="dark"
                content="说明：支队是.a,大队是.b,救援站（中队）需选择.c，专职队需选择.d"
                placement="right"
              >
                <i class="el-icon-info" style="font-size: 18px;"></i>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-else>
            <el-form-item label="用户账号" prop="userName">
              <el-input v-model="form.userName" placeholder="请输入用户账号" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phonenumber">
              <el-input v-model="form.phonenumber" placeholder="请输入手机号码" maxlength="11" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" :disabled="true"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item v-if="form.userId == undefined" label="用户密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入用户密码" type="password" auto-complete="new-password" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户性别">
              <el-select v-model="form.sex" placeholder="请选择" :disabled="true">
                <el-option
                  v-for="dict in sexOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                  :disabled="true"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                  :disabled="true"
                >{{dict.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="岗位">
              <el-select v-model="form.postIds" multiple placeholder="请选择" :disabled="true">
                <el-option
                  v-for="item in postOptions"
                  :key="item.postId"
                  :label="item.postName"
                  :value="item.postId"
                  :disabled="true"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="角色">
              <el-select v-model="form.roleIds" multiple placeholder="请选择" style="width:100%" :disabled="true">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                  :disabled="true"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" :disabled="true" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button type="primary" @click="submitForm" :loading="inUse">确 定</el-button> -->
        <el-button type="primary" @click="cancel1">返 回</el-button>
      </div>
    </el-dialog>


        <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="归属单位" prop="deptId">
              <treeselect
                v-model="form.deptId"
                :options="deptOptions"
                :load-options="loadOptions"
                @select="nodeClick"
                placeholder="请选择归属单位"
                :disabled="isEdit"
                style="height:32px;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户名称" prop="nickName">
              <el-input v-model="form.nickName" placeholder="请输入用户名称"/>
            </el-form-item>
          </el-col>

          <el-col :span="12" v-if="form.userId == undefined">
            <el-form-item label="用户账号" prop="userNamePrepend"  >
              <el-input
                v-model="form.userNamePrepend"
                placeholder="请输入用户账号"
                :disabled="isEdit"
                style="width:40%;"
              ></el-input>
              <el-select v-model="form.userNameSuffix" placeholder="请选择" style="width:40%;">
                <el-option
                  v-for="(item, index) in suffixData"
                  :label="item"
                  :value="item"
                  :key="index"
                ></el-option>
              </el-select>
              <el-tooltip
                class="item"
                effect="dark"
                content="说明：支队是.a,大队是.b,救援站（中队）需选择.c，专职队需选择.d"
                placement="right"
              >
                <i class="el-icon-info" style="font-size: 18px;"></i>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-else>
            <el-form-item label="用户账号" prop="userName">
              <el-input v-model="form.userName" placeholder="请输入用户账号" :disabled="form.userId != undefined" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phonenumber">
              <el-input v-model="form.phonenumber" placeholder="请输入手机号码" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item v-if="form.userId == undefined" label="用户密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入用户密码" type="password" auto-complete="new-password" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户性别">
              <el-select v-model="form.sex" placeholder="请选择">
                <el-option
                  v-for="dict in sexOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{dict.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="岗位">
              <el-select v-model="form.postIds" multiple placeholder="请选择">
                <el-option
                  v-for="item in postOptions"
                  :key="item.postId"
                  :label="item.postName"
                  :value="item.postId"
                  :disabled="item.status == 1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="角色">
              <el-select v-model="form.roleIds" multiple placeholder="请选择" style="width:100%">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                  :disabled="item.status == 1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" :loading="inUse">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listUser,
  getUser,
  delUser,
  addUser,
  updateUser,
  resetUserPwd,
  changeUserStatus
} from "@/api/system/user";
import { treeselect } from "@/api/system/dept";
import { listRoleForRoleAssignment as listRole } from "@/api/system/role";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { getAccountNumberSuffix } from "@/utils/companyCodeUtils.js";
import { getUserProfile } from "@/api/system/user";
import { formatterDate } from "@/utils/index";
import {queryMenuTreeForRoleManage as menuTreeselect,} from "@/api/system/menu";

export default {
  name: "usermanagement",
  components: { Treeselect },
  data() {
    return {
      keyValue:0,
      propstree: {  multiple: true, checkStrictly: true,value:'id',label:"label",emitPath:false },
      name1:'',
      //菜单列表
      menuOptions: [],
      suffixData: [],
      // 修改时是否可编辑
      isEdit: true,
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: "",
      // 单位树选项
      deptOptions: [],
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层(查看数据)
      open1: false,
      // 单位名称
      deptName: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
      // 性别状态字典
      sexOptions: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "leaf"
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20,
        userName: undefined,
        phonenumber: undefined,
        status: undefined,
        deptId: undefined,
        queryLevelFlag: 0,
        roleIds:[],
        menuIds:[],
      },
      // 表单校验
      rules: {
        userNamePrepend: [
          { required: true, message: "用户账号不能为空", trigger: "blur" }
        ],
        userName: [
          { required: true, message: "用户账号不能为空", trigger: "blur" }
        ],
        nickName: [
          { required: true, message: "用户名称不能为空", trigger: "blur" }
        ],
        deptId: [
          { required: true, message: "归属单位不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "用户密码不能为空", trigger: "blur" }
        ],
        email: [
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        phonenumber: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      },

      timeout: null,
      queryTree: {},
      // 默认打开的树节点
      defaultOpenKey: '',
      inUse: false
    };
  },
  watch: {
    options(newVal) {
      this.keyValue++ //监听到数据源发生变化 ，改变keyValue的值，达到重新渲染的效果
    },
    // 根据名称筛选单位树
    deptName(val) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        this.queryTree.parentId = undefined;
        this.queryTree.deptName = val;
        this.getTreeselect();
      }, 2000); 
    },
    /**
     * [description]
     * @param  {[type]} newVal [description]
     * @param  {[type]} oldVal [description]
     * @return {[type]}        [description]
     */
    "form.userNamePrepend": function(newVal, oldVal) {
      this.form.userName = newVal + this.form.userNameSuffix;
    },
    "form.userNameSuffix": function(newVal, oldVal) {
      this.form.userName = this.form.userNamePrepend + newVal;
    }
  },
  created() {
    // console.log(getAccountNumberSuffix("1000000000"))
    this.getList();
    this.getRoles();
    this.getMenuTreeselect();

    //根据登录员工来获取树根节点
    getUserProfile().then(response => {
      this.queryTree.deptRoots = response.deptRoots;
      if (response.data.admin) {
        this.queryTree.deptRoots = 1000000000;
      }
      this.defaultOpenKey = this.queryTree.deptRoots;
      this.getTreeselect();
    });

    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("sys_user_sex").then(response => {
      this.sexOptions = response.data;
    });
    // this.getConfigKey("sys.user.initPassword").then(response => {
    //   this.initPassword = response.data;
    // });
  },
  methods: {
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      //目前被选中的菜单节点
      this.getMenuTreeselect();
      //  let checkedKeys = this.$refs.form2.getCheckedNodes();
      //半选中的菜单节点
      // let halfCheckedKeys = this.$refs.form.getHalfCheckedKeys();
      // checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      // return checkedKeys;
    },
    //选择权限菜单
    // showtree(){
    //     this.getMenuTreeselect();
    // },
    /** 查询菜单树结构 */
    getMenuTreeselect() {
      menuTreeselect().then(response => {
        this.menuOptions = response.data;
        console.log("====",response)
      });
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 查询用户列表 */
    getList() {
      // console.log('====',this.queryParams)
      this.loading = true;
      listUser(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 查询单位下拉树结构 */
    getTreeselect() {
      treeselect(this.queryTree).then(response => {
        var treeList = response.data;
        for (var index in treeList) {
          if (treeList[index].hasChildren != true) {
            treeList[index].leaf = true;
          } else {
            treeList[index].children = null;
          }
        }
        // console.log(JSON.stringify(treeList));
        this.deptOptions = treeList;
      });
    },
    /** 级连单位下拉左侧树结构 */
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([]);
      }
      treeselect({ parentId: node.data.id }).then(response => {
        var treeList = response.data;
        for (var index in treeList) {
          if (treeList[index].hasChildren != true) {
            treeList[index].leaf = true;
          }
        }

        resolve(treeList);
      });
    },
    /** 级连单位下拉框树结构 */
    loadOptions({ action, parentNode, callback }) {
      if (action === "LOAD_CHILDREN_OPTIONS") {
        treeselect({ parentId: parentNode.id }).then(response => {
          var treeList = response.data;
          for (var index in treeList) {
            if (treeList[index].hasChildren == true) {
              treeList[index].children = null;
            }
          }
          // console.log(JSON.stringify(treeList))
          parentNode.children = treeList;
          callback();
        });
      } else {
        callback();
      }
    },
    /**
     * 修改用户弹框中的归属单位节点选择
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
      this.form.deptId = node.id;
      this.form.deptName = node.label;
      this.suffixData = getAccountNumberSuffix(node.id + "");
      this.form.userNameSuffix = this.suffixData[0];
      var objs = document.getElementsByTagName("div");
      for (var i = 0; i < objs.length; i++) {
        if (objs[i].className == "vue-treeselect__single-value") {
          objs[i].innerHTML = node.label;
        }
      }
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.id;
      this.getList();
    },
    /** 查询角色列表 */
    getRoles() {
      listRole().then(response => {
        this.roleOptions = response.rows;
        // console.log("------",response)
      });
    },
    // 用户状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm(
        '确认要"' + text + '""' + row.userName + '"用户吗?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return changeUserStatus(row.userId, row.status);
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
    // 取消按钮(查看界面)
    cancel1() {
      this.open1 = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        userId: undefined,
        deptId: undefined,
        userName: undefined,
        userNamePrepend: undefined,
        userNameSuffix: undefined,
        nickName: undefined,
        password: undefined,
        phonenumber: undefined,
        email: undefined,
        sex: undefined,
        status: "0",
        remark: undefined,
        postIds: [],
        roleIds: [],
        menuIds: [],
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.suffixData = [];
      this.isEdit = false;
      this.reset();
      this.getTreeselect();
      this.getRoles();
      this.open = true;
      this.title = "添加用户";
      this.form.password = this.initPassword;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      /**
       * 判断当前是否是超级管理员
       * 是则可以修改用户账号和归属单位
       * 否则不可修改
       */
      this.$store.state.user.name === "admin"
        ? (this.isEdit = false)
        : (this.isEdit = true);
      this.getTreeselect();
      this.getRoles();

      getUser(row.userId).then(response => {
        this.form = response.data;
        this.form.postIds = response.postIds;
        this.form.roleIds = response.roleIds;
        this.open = true;
        this.title = "修改用户";
        this.form.password = "";

        setTimeout(() => {
          //解决下拉懒加载树无法获取未加载的子节点中文问题
          var objs = document.getElementsByTagName("div");
          for (var i = 0; i < objs.length; i++) {
            if (objs[i].className == "vue-treeselect__single-value") {
              objs[i].innerHTML = response.data.deptName;
            }
          }
        }, 200);
      });
    },

    /** 查看按钮操作 */
    handleUpdate1(row) {
      this.reset();
      /**
       * 判断当前是否是超级管理员
       * 是则可以修改用户账号和归属单位
       * 否则不可修改
       */
      this.$store.state.user.name === "admin"
        ? (this.isEdit = false)
        : (this.isEdit = true);
      this.getTreeselect();
      this.getRoles();

      getUser(row.userId).then(response => {
        this.form = response.data;
        this.form.postIds = response.postIds;
        this.form.roleIds = response.roleIds;
        this.open1 = true;
        this.title = "查看用户";
        this.form.password = "";

        setTimeout(() => {
          //解决下拉懒加载树无法获取未加载的子节点中文问题
          var objs = document.getElementsByTagName("div");
          for (var i = 0; i < objs.length; i++) {
            if (objs[i].className == "vue-treeselect__single-value") {
              objs[i].innerHTML = response.data.deptName;
            }
          }
        }, 200);
      });
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.$prompt('请输入"' + row.userName + '"的新密码', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          resetUserPwd(row.userId, value).then(response => {
            if (response.code === 200) {
              this.msgSuccess("修改成功，新密码是：" + value);
            } else {
              this.msgError(response.msg);
            }
          });
        })
        .catch(() => {});
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.userId != undefined) {
            this.inUse = true;
            updateUser(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            }).finally(() => {
              this.inUse = false;
            });
          } else {
            this.inUse = true;
            addUser(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            }).finally(() => {
              this.inUse = false;
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm(
        '是否确认删除名称为"' + row.userName + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delUser(row.userId);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
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
