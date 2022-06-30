<template lang="pug">
//- 基于 el-cascader 组件，自定义一个区域结构树组件
.area-tree
  //- 是否保留清空方法待定 clearable
  el-cascader(ref="areaTree" v-model="selectedOptions" :props="{ checkStrictly: true,lazy: true,lazyLoad: loadHandleNode,leaf: 'isLeaf', label: 'areaName', value: 'areaId'}" :show-all-levels="false" @change="cascaderHandleChange" filterable placeholder="请选择")
</template>

<script>
// api
import { getUserProfile } from "@/api/system/user";
import { listAreaQuery } from "@/api/system/area";

export default {
  name: "AreaTree",
  data() {
    return {
      selectedOptions: [],
      // 储存转换后的当前用户信息
      currentUserInfo: {},
      // 需要特殊处理的直辖市和特别行政区，使用户无法下钻
      mapBlackList: [
        "北京市",
        "重庆市",
        "上海市",
        "天津市",
        "香港特别行政区",
        "澳门特别行政区"
      ]
    };
  },
  methods: {
    /**
     * 查询部门下拉树结构
     * id 如果有传 id 值，表示这里请求的是子级的数据，返回一个 peomise，否则表示是一级数据直接返回
     */
    listAreaQuery(id) {
      // 判断如果传的是 "" 值，表示这里是需要初始化最初的用户身份，否则正常请求接口
      if (id) {
        // 获取下级的列表数据
        return new Promise(resolve => {
          listAreaQuery({
            parentId: id
          }).then(res => {
            let saveData = res.data;
            // 手动将 isLeaf 字段转换成 Boolean 值，areaLevel > 2 是 区县 和 街道
            saveData.forEach(element => {
              // 判断是否在黑名单中，使其不能下钻
              if (this.mapBlackList.indexOf(element.areaName) !== -1) {
                element.isLeaf = true;
              } else {
                element.isLeaf = element.areaLevel > 2;
              }
            });
            resolve(saveData);
          });
        });
      } else {
        // 获取当前用户身份的数据
        return new Promise(resolve => {
          getUserProfile().then(res => {
            if (res.code === 200) {
              let areaRoots = res.areaRoots;
              // 手动将 isLeaf 字段转换成 Boolean 值，areaLevel > 2 是 区县 和 街道
              // 判断是否在黑名单中，使其不能下钻
              if (this.mapBlackList.indexOf(areaRoots.areaName) !== -1) {
                areaRoots.isLeaf = true;
              } else {
                areaRoots.isLeaf = areaRoots.areaLevel > 2;
              }
              resolve([areaRoots]);

              this.currentUserInfo = areaRoots;
              // 默认选中当前用户身份，并触发页面加载数据
              this.selectedOptions = [areaRoots.areaId];

              this.$emit("update-component-data", areaRoots);
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
      const data = await this.listAreaQuery(
        node.level === 0 ? "" : node.data.areaId
      );
      resolve(data);
    },
    /**
     * 选中弹窗内部的部门节点加载函数
     */
    cascaderHandleChange(value) {
      let $areaTree = this.$refs.areaTree;
      // 由于组件没有单选关闭悬浮窗的回调，所以需要手动关闭
      $areaTree.toggleDropDownVisible(false);
      if (value) {
        // 调用父组件方法，传递当前单选选中的身份对象
        const checkedNodes = $areaTree.getCheckedNodes();
        // 判断如果单选无选中值时，传递当前用户信息
        this.$emit(
          "update-component-data",
          checkedNodes.length ? checkedNodes[0].data : this.currentUserInfo
        );
      }
    }
  }
};
</script>