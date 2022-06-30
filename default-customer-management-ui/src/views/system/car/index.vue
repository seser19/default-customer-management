<template>
  <div class="app-container">
    <el-row :gutter="0">
      <!--部门数据-->
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
            :indent="10"
            :default-expanded-keys="[defaultOpenKey]"
            ref="tree"
            lazy
            :load="loadNode"
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--车辆数据-->
      <el-col :span="18" :xs="24">
        <el-form :inline="true" label-width="80px">
          <el-form-item label="车辆牌照">
            <el-input
              v-model="queryParams.carName"
              placeholder="请输入车辆牌照"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <!--<el-form-item label="手机号码">-->
          <!--<el-input-->
          <!--v-model="queryParams.phonenumber"-->
          <!--placeholder="请输入手机号码"-->
          <!--clearable-->
          <!--size="small"-->
          <!--style="width: 240px"-->
          <!--@keyup.enter.native="handleQuery"-->
          <!--/>-->
          <!--</el-form-item>-->
          <el-form-item label="类型">
            <el-select
              v-model="queryParams.carType"
              placeholder="车辆类型"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option
                v-for="(dict,index) in carTypeOptions"
                :key="index"
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
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['system:car:add']"
            >新增</el-button>
          </el-form-item>
        </el-form>
        <el-table v-loading="loading" :data="carList">
<!--          <el-table-column label="车辆编号" align="left" prop="carId" />-->
          <el-table-column label="车辆牌照" align="left" prop="carName" />
          <el-table-column label="部门" align="left" prop="dept.deptName" width="150" />
          <!--<el-table-column label="手机号码" align="center" prop="phonenumber" width="120"/>-->
          <el-table-column label="车辆类型" align="left" prop="carTypeName" show-overflow-tooltip />
          <el-table-column label="购入时间" align="left" prop="buyDate" width="120" />
          <!-- <el-table-column label="创建时间" align="left" prop="createTime" width="150">
						<template slot-scope="scope">
							<span>{{ scope.row.createTime }}</span>
						</template>
          </el-table-column>-->
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
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['system:car:edit']"
              >修改</el-button>
              <el-button
                v-if="scope.row.carId !== 1"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasRole="['system:car:remove']"
              >删除</el-button>
              <!--<el-button-->
              <!--size="mini"-->
              <!--type="text"-->
              <!--icon="el-icon-key"-->
              <!--@click="handleResetPwd(scope.row)"-->
              <!--v-hasPermi="['system:car:resetPwd']"-->
              <!--&gt;重置-->
              <!--</el-button>-->
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            align="center"
            width="120"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-switch
                :value="scope.row.status==='0'" @change="()=>changeStatus(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-if="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" @close="cancel">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :xs="21" :sm="21" :lg="8" :span="8">
            <el-form-item label="车辆大类" prop="carBigType">
              <el-select v-model="form.carBigType" placeholder="请选择车辆大类" style="width: 100%">
                <el-option
                  v-for="(dict,index) in carBigTypeOptions"
                  :key="index"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="3" :sm="3" :lg="4" :span="4">
            <el-form-item label="无牌">
              <el-checkbox :value="form.sfwp" :true-label="'1'" :false-label="'0'" @input="wpChange"></el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="12" :span="12">
            <el-form-item label="车辆牌照" prop="carSimpleName" v-if="form.carBigType">
              <el-input v-model="form.carSimpleName" placeholder="请输入车辆牌照" class="input-with-input">
                <!-- 判断 carBigType 的值，展示不用的模块  -->

                <!-- 应急执勤车 || 无牌执勤车  -->
                <div v-if="!parseInt(form.sfwp) && form.carBigType === '1' || form.carBigType === '3'" slot="prepend">
                  {{ carProvinceName }}·
                  <span class="color-main-red">X</span>
                </div>

                <!-- 应急摩托车  -->
                <div v-else-if="!parseInt(form.sfwp) && form.carBigType === '2'" slot="prepend">
                  <span class="color-main-red">应</span>·
                  <span class="color-main-red">急</span>
                  {{ carProvinceName }}
                </div>

                <!-- 地方执勤车  -->
                <div v-else-if="!parseInt(form.sfwp) && form.carBigType === '4'" slot="prepend">{{ carProvinceName }}·</div>

                <!-- carAfterText 有值才显示 -->
                <div
                  v-if="!parseInt(form.sfwp) &&carAfterText"
                  slot="append"
                  :class="{'color-main-red': form.carBigType !== '2'}"
                >{{ carAfterText }}</div>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="24" :lg="12" :span="12">
            <el-form-item label="车辆类型" prop="carType">
              <el-select v-model="form.carType" placeholder="请选择车辆类型" style="width: 100%">
                <el-option
                  v-for="(dict,index) in carTypeOptions"
                  :key="index"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="24" :lg="12" :span="12">
            <el-form-item label="归属单位" prop="deptId">
              <treeselect
                v-model="form.deptId"
                :options="deptOptions"
                :load-options="loadOptions"
                placeholder="请选择归属单位"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="12" :span="12">
            <el-form-item label="购入时间" prop="buyDate">
              <el-date-picker
                v-model="form.buyDate"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="购入时间"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="24" :lg="12" :span="12">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="车辆图片">
              <carAvatar :carForm="form" ref="carAvatar" />
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
import carAvatar from "./carAvatar";

import {
  listCar,
  getCar,
  delCar,
  addCar,
  updateCar,
  resetCarPwd,
  changeCarStatus,
  getCarPlateInfo
} from "@/api/system/car";
import { treeselect } from "@/api/system/dept";
//    import {listPost} from "@/api/system/post";
import { listRole } from "@/api/system/role";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import { getUserProfile } from "@/api/system/user";
import store from "@/store";
import { VueCropper } from "vue-cropper";
import { uploadAvatar } from "@/api/system/user";

export default {
  name: "vehiclemanagement",
  components: { VueCropper, carAvatar, Treeselect },
  data() {
    return {
      user: {},
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 车辆表格数据
      carList: null,
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: [],
      // 是否显示弹出层
      open: false,
      openPic: false,
      // 单位名称
      deptName: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      options: {
        img: store.getters.avatar, //裁剪图片的地址
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 200, // 默认生成截图框宽度
        autoCropHeight: 200, // 默认生成截图框高度
        fixedBox: true // 固定截图框大小 不允许改变
      },
      previews: {},
      buyDate: undefined,
      // 车辆大类
      carBigTypeOptions: [],
      // 车辆类型
      carTypeOptions: [],
      // 状态数据字典
      statusOptions: [],
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
        carBigType: "",
        // 车辆牌照的全称
        carName: "",
        // 展示在 车辆牌照 文本输入域的内容，根据 车辆大类 的不同，展示不一样格式的值
        carSimpleName: "",
        phonenumber: undefined,
        carType: "",
        status: undefined,
        deptId: undefined
      },
      // 车辆省份的简称
      carProvinceName: "",
      // 车辆牌照前缀文字
      carBeforeText: "",
      // 车辆牌照后缀文字
      carAfterText: "",
      // 车辆类型 carType 对应的文本
      carTypeName: "",
      // 表单校验
      rules: {
        carBigType: [
          {
            required: true,
            message: "车辆大类不能为空",
            trigger: "blur"
          }
        ],
        carSimpleName: [
          { required: true, message: "车辆牌照不能为空", trigger: "blur" }
          // {
          //   //pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/,
          //   message: "请输入正确的车辆牌照",
          //   trigger: "blur"
          // }
        ],
        deptId: [
          { required: true, message: "归属部门不能为空", trigger: "blur" }
        ],
        carType: [
          { required: true, message: "车辆类型不能为空", trigger: "blur" }
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
      defaultOpenKey: {}
    };
  },
  watch: {
    // 根据名称筛选部门树
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
    //监测弹窗中无牌复选框,如果选择则去除表单验证
    "form.sfwp"(val){
      if(val==='1'){
        this.carBeforeText = "";
        this.carAfterText = "";
        this.rules.carSimpleName[1] = {}
      }else {
        switch (this.form.carBigType) {
          // 应急执勤车
          case "1":
            this.carBeforeText = this.carProvinceName + "·X";
            this.carAfterText = "应急";
            this.rules.carSimpleName[1] = {
              min: 4,
              max: 4,
              pattern: /^[A-Z0-9]{4}$/,
              message: "车牌必须有 4 个大写英文字母或数字组成",
              trigger: ["blur", "change"]
            };
            break;
          // 应急摩托车
          case "2":
            this.carBeforeText = "应·急" + this.carProvinceName;
            this.carAfterText = "X";
            this.rules.carSimpleName[1] = {
              min: 3,
              max: 3,
              pattern: /^[A-Z0-9]{3}$/,
              message: "车牌必须有 3 个大写英文字母或数字组成",
              trigger: ["blur", "change"]
            };
            break;
          // 无牌执勤车
          case "3":
            this.carBeforeText = this.carProvinceName + "·X";
            this.carAfterText = "临时";
            this.rules.carSimpleName[1] = {};
            break;
          // 地方执勤车
          case "4":
            this.carBeforeText = this.carProvinceName + "·";
            this.carAfterText = "";
            this.rules.carSimpleName[1] = {};
            break;
          // 专职队车辆或者其他不需要规则的车辆
          default:
            this.carBeforeText = "";
            this.carAfterText = "";
            this.rules.carSimpleName[1] = {};
            break;
        }
      }
    },
    // 监测弹窗中车辆大类改变，修改 carBeforeText 和 carAfterText 的值，改变 carSimpleName 的校验规则
    "form.carBigType"(val) {
      if(this.form.sfwp==='1'){
        this.carBeforeText = "";
        this.carAfterText = "";
        this.rules.carSimpleName[1] = {}
      }else {
        switch (val) {
          // 应急执勤车
          case "1":
            this.carBeforeText = this.carProvinceName + "·X";
            this.carAfterText = "应急";
            this.rules.carSimpleName[1] = {
              min: 4,
              max: 4,
              pattern: /^[A-Z0-9]{4}$/,
              message: "车牌必须有 4 个大写英文字母或数字组成",
              trigger: ["blur", "change"]
            };
            break;
          // 应急摩托车
          case "2":
            this.carBeforeText = "应·急" + this.carProvinceName;
            this.carAfterText = "X";
            this.rules.carSimpleName[1] = {
              min: 3,
              max: 3,
              pattern: /^[A-Z0-9]{3}$/,
              message: "车牌必须有 3 个大写英文字母或数字组成",
              trigger: ["blur", "change"]
            };
            break;
          // 无牌执勤车
          case "3":
            this.carBeforeText = this.carProvinceName + "·X";
            this.carAfterText = "临时";
            this.rules.carSimpleName[1] = {};
            break;
          // 地方执勤车
          case "4":
            this.carBeforeText = this.carProvinceName + "·";
            this.carAfterText = "";
            this.rules.carSimpleName[1] = {};
            break;
          // 专职队车辆或者其他不需要规则的车辆
          default:
            this.carBeforeText = "";
            this.carAfterText = "";
            this.rules.carSimpleName[1] = {};
            break;
        }
      }
    },
    // 监测弹窗中车辆类型改变，修改表单的 carTypeName
    "form.carType"(val) {
      if (val) {
        const carIndex = this.carTypeOptions.findIndex(
          item => item.dictValue === val
        );
        carIndex !== -1 &&
          (this.carTypeName = this.carTypeOptions[carIndex].dictLabel);
      }
    }
  },
  created() {
    this.getList();

    // 根据登录员工来获取树根节点
    getUserProfile().then(response => {
      this.queryTree.deptRoots = response.deptRoots;
      if (response.data.admin) {
        this.queryTree.deptRoots = 1000000000;
      }
      //this.form.deptId=this.queryTree.deptId;
      this.defaultOpenKey = this.queryTree.deptRoots;
      this.getTreeselect();
    });
    // 获取字典
    this.getDicts("sys_car_type").then(response => {
      this.carTypeOptions = response.data;
    });
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("sys_car_big_type").then(response => {
      this.carBigTypeOptions = response.data;
    });
    //            this.getDicts("sys_car_sex").then(response => {
    //                this.sexOptions = response.data;
    //            });
    // 获取车辆省份的简称
    getCarPlateInfo().then(res => {
      const { code, data } = res;
      if (code === 200 && data && data.simple) {
        const { simple } = data;
        this.carProvinceName = simple;
      }
    });
    this.getConfigKey("sys.car.initPassword").then(response => {
      this.initPassword = response.data;
    });
  },
  methods: {
    /** 查询车辆列表 */
    getList() {
      this.loading = true;
      listCar(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.carList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 查询部门下拉树结构 */
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
    /** 级连部门下拉左侧树结构 */
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
    /** 级连部门下拉框树结构 */
    loadOptions({ action, parentNode, callback }) {
      this.form.deptId = undefined;
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
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      // console.log(data)
      this.queryParams.deptId = data.id;
      this.getList();
    },
    /** 查询岗位列表 */
    //            getPosts() {
    //                listPost().then(response => {
    //                    this.postOptions = response.rows;
    //                });
    //            },
    /** 查询角色列表 */
    getRoles() {
      listRole().then(response => {
        this.roleOptions = response.rows;
      });
    },
    // 车辆状态修改
    //            handleStatusChange(row) {
    //                let text = row.status === "0" ? "启用" : "停用";
    //                this.$confirm('确认要"' + text + '""' + row.carName + '"车辆吗?', "警告", {
    //                    confirmButtonText: "确定",
    //                    cancelButtonText: "取消",
    //                    type: "warning"
    //                }).then(function () {
    //                    return changeCarStatus(row.carId, row.status);
    //                }).then(() => {
    //                    this.msgSuccess(text + "成功");
    //                }).catch(function () {
    //                    row.status = row.status === "0" ? "1" : "0";
    //                });
    //            },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        carId: undefined,
        deptId: undefined,
        carBigType: "",
        carName: "",
        carSimpleName: "",
        nickName: undefined,
        password: undefined,
        phonenumber: undefined,
        email: undefined,
        sex: undefined,
        status: "0",
        remark: undefined,
        postIds: [],
        roleIds: [],
        sfwp:'0'
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
      this.reset();
      this.getTreeselect();
      //                this.getPosts();
      this.getRoles();
      this.open = true;
      this.title = "添加车辆";
      this.form.password = this.initPassword;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      //                this.getPosts();
      this.getRoles();
      getCar(row.carId).then(response => {
        this.form = response.data;
        // console.log(response.data.avatar)
        //                    this.form.postIds = response.postIds;
        //                    this.form.roleIds = response.roleIds;
        this.open = true;
        this.title = "修改车辆";
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
      this.$prompt('请输入"' + row.carName + '"的新密码', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          resetCarPwd(row.carId, value).then(response => {
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
    submitForm() {
      // console.log("提交车辆")
      this.$refs["form"].validate(valid => {
        if (valid) {
          // 转换数据
          let params = { ...this.form };
          params.avatar = this.$refs.carAvatar.imgUrl;
          params.carName =
            this.carBeforeText + params.carSimpleName + this.carAfterText;

          params.carTypeName = this.carTypeName;
          if (this.form.carId != undefined) {
            updateCar(params).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addCar(params).then(response => {
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
        '是否确认删除名称为"' + row.carName + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(()=>{
          this.loading = true;
          return delCar(row.carId);
        })
        .then(r => {
          console.log(r)
          if(r.code===200){
            this.getList();
            this.msgSuccess("删除成功");
          }else {
            this.loading = false;
          }

        })
        .catch(function() {});
    },
    changeStatus(item){
      this.loading = true;
      changeCarStatus(item.carId,item.status==='1'?'0':'1').then(r=>{
        if(r.code===200){
          this.getList();
          this.$message.success('状态修改成功!');
        }
      })
    },
    wpChange(e){
      this.form.sfwp = e
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/mixin.styl'
.input-with-input
  /deep/ .el-input-group__prepend, /deep/ .el-input-group__append
    background-color #fff
    font-weight bold
    color $default-font-color
</style>
