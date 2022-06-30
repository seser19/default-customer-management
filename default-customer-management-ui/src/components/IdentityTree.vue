<template lang="pug">
//- 基于 el-cascader 组件，自定义一个多选单位结构树组件
.identity-tree
  //- 是否保留清空方法待定 clearable
  el-cascader(ref="identityTree" v-model="selectedOptions" :props="{ checkStrictly: true,lazy: true,lazyLoad: loadHandleNode,leaf: 'isLeaf', label: 'deptName', value: 'deptId' , multiple: isMultiple }" collapse-tags :show-all-levels="false" @change="cascaderHandleChange" filterable placeholder="请选择" style="width: 100%")
</template>

<script>
// api
import { getUserProfile } from "@/api/system/user";
import { checkDeptList } from "@/api/common";

export default {
  name: "IdentityTree",
  props: {
    // 父组件关联的数据字段
    deptData: {
      type: String,
      default: ""
    },
    // 是否多选
    isMultiple: {
      type: Boolean,
      default: false
    },
    /**
     * 可选择单位的 deptLevel 字段的最大值
     * 4 中队
     * 3 大队
     */
    maxDeptLevel: {
      type: Number,
      default: 4
    }
  },
  data() {
    return {
      selectedOptions: [],
      // 储存转换后的当前用户信息
      currentUserInfo: {}
    };
  },
  watch: {
    deptData(val) {
      // 如果清空数据的话，需要设置默认值为当前单位
      if (!val) {
        const { deptId } = this.currentUserInfo;
        this.selectedOptions = [deptId];
        this.$emit("update-component-data", [this.currentUserInfo]);
      }
    }
  },
  methods: {
    /**
     * 查询部门下拉树结构
     * id 如果有传 id 值，表示这里请求的是子级的数据，返回一个 peomise，否则表示是一级数据直接返回
     */
    checkDeptList(id, level) {
      // 判断如果传的是 "" 值，表示这里是需要初始化最初的用户身份，否则正常请求接口
      if (id) {
        // 获取下级的列表数据
        return new Promise(resolve => {
          checkDeptList({
            parentId: id,
            deptLevel: level
          }).then(res => {
            let saveData = res.data;
            // 手动将 isLeaf 字段转换成 Boolean 值，deptLevel > 4 是 中队单位
            saveData.forEach(element => {
              element.isLeaf = element.deptLevel > this.maxDeptLevel;
            });
            resolve(saveData);
          });
        });
      } else {
        // 获取当前用户身份的数据
        return new Promise(resolve => {
          getUserProfile().then(res => {
            if (res.code === 200) {
              let deptRoots = res.data;
              // 手动将 isLeaf 字段转换成 Boolean 值，deptLevel > 4 是 中队单位
              deptRoots.isLeaf = deptRoots.deptLevel > this.maxDeptLevel;
              // 转换数据字段名称
              const { deptId, deptName } = deptRoots;
              deptRoots.value = deptId;
              deptRoots.label = deptName;
              resolve([deptRoots]);

              this.currentUserInfo = deptRoots;

              // 默认选中当前用户身份，并触发页面加载数据
              this.selectedOptions = [deptRoots.deptId];
              this.$emit("update-component-data", [deptRoots]);
            }
          });
        });
      }
    },
    /**
     * 部门节点加载函数
     */
    async loadHandleNode(node, resolve) {
      // console.log(node);
      const data = await this.checkDeptList(
        node.level === 0 ? "" : node.data.deptId,
        node.level === 0 ? "" : node.data.deptLevel
      );
      resolve(data);
    },
    /**
     * 选中弹窗内部的部门节点加载函数
     */
    cascaderHandleChange(value) {
      let $identityTree = this.$refs.identityTree;
      // 由于组件没有单选关闭悬浮窗的回调，所以需要手动关闭
      // $identityTree.toggleDropDownVisible(false);
      if (value) {
        // 判断如果无选中值时，传递当前用户的单位 id
        this.$emit(
          "update-component-data",
          this.selectedOptions.length
            ? $identityTree.getCheckedNodes()
            : this.currentUserInfo
        );
      }
    }
  }
};
</script>
