<template>
  <el-dialog :visible.sync="mulModal" @close="closeDialogHandle">
    <div slot="title" class="search_zone">
      <span>多项选择</span>
      <el-input
        placeholder="全局搜索"
        suffix-icon="el-icon-search"
        v-model="keyWords"
        @keyup.enter.native="globalSearch(keyWords)"
      ></el-input>
      <el-button type="primary" @click="globalSearch(keyWords)">查询</el-button>
    </div>
    <div class="modal_tree" v-loading="loading">
      <el-row :gutter="20">
        <el-col :span="15">
          <h5>消防队名称</h5>
          <div class="tree_zone" v-if="!keyWords && !searchResultList.length">
            <el-tree
              ref="tree"
              :props="props"
              show-checkbox
              :load="loadNode"
              lazy
              node-key="deptId"
              :filter-node-method="filterNode"
              @check="checkClick"
            ></el-tree>
          </div>
          <div class="name-list" v-else>
            <el-checkbox-group v-model="tags" v-if="searchResultList.length">
              <el-checkbox
                v-for="item in searchResultList"
                :key="item.deptId"
                :label="item"
              >{{ item.deptName }}</el-checkbox>
            </el-checkbox-group>
            <div class="data-none" v-else>暂无数据</div>
          </div>
        </el-col>
        <el-col :span="9" class="tag_zone">
          <div>
            <h5>已选择</h5>
            <div class="tag_group">
              <div :key="index" v-for="(tag,index) in tags">
                <el-tag closable @close="handleClose(tag)">{{tag.deptName}}</el-tag>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="mulModal = false">取 消</el-button>
      <el-button type="primary" @click="modalSubmit">保 存</el-button>
      <!-- <button class="btn_orange" @click="modalSubmit">保 存</button> -->
    </span>
  </el-dialog>
</template>

<script>
import { getUserProfile } from "@/api/system/user";
import { listDeptCheck, listDept } from "@/api/system/dept";
export default {
  name: "mulModal",
  data() {
    return {
      loading: false,
      //多选模态框
      mulModal: false,
      keyWords: "",
      props: {
        children: "children",
        label: "deptName",
        id: "deptId",
        isLeaf: "leaf"
      },
      // 选中的列表
      tags: [],
      // 列表查询参数
      queryParams: {
        deptName: undefined
      },
      // 检索结果列表
      searchResultList: []
    };
  },
  methods: {
    loadNode(node, resolve) {
      if (node.level === 0) {
        this.loading = true;
        getUserProfile().then(response => {
          this.queryParams.deptRoots = response.deptRoots;
          if (response.data.admin) {
            this.queryParams.deptRoots = 1000000000;
          }
          this.queryParams.deptLevel = response.data.dept.deptLevel;
          listDept(this.queryParams)
            .then(res => {
              resolve(this.handleData(res.data));
              this.loading = false;
            })
            .catch(res => {
              resolve([]);
              this.loading = false;
            });
        });
      } else {
        listDept({ parentId: node.data.deptId,deptLevel:node.data.deptLevel})
          .then(res => {
            resolve(this.handleData(res.data));
          })
          .catch(res => {
            resolve([]);
          });
      }
    },
    // 设置是否为leaf节点
    handleData(arr) {
      arr.forEach(item => {
        if (item.ancestors.split(",").length < 6) {
          item.disabled = true;
        }
        if (!item.hasChildren) {
          item["leaf"] = true;
        }
      });
      return arr;
    },
    //回显
    echo(idArrStr) {
      if (idArrStr !== "") {
        this.$refs.tree && this.$refs.tree.setCheckedKeys(idArrStr);
        this.getLastNodes() && (this.tags = this.getLastNodes());
      } else {
        this.$nextTick(() => {
          this.$refs.tree &&
            this.$refs.tree &&
            this.$refs.tree.setCheckedKeys([]);
          this.tags = [];
        });
      }
    },
    clear() {
      this.tags = [];
      this.$refs.tree.setCheckedNodes(this.tags);
    },
    //控制显示隐藏
    toggle() {
      this.closeDialogHandle();
      this.mulModal = !this.mulModal;
    },
    //关键字搜索
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    //提交
    modalSubmit() {
      if (this.tags.length == 0) {
        this.$message({
          message: "请至少选择一支消防队",
          type: "warning"
        });
        return;
      }
      // console.log(this.tags);
      this.$emit("setMulVal", this.tags);
      this.closeDialogHandle();
    },
    //删除tag并且取消左侧的tree
    handleClose(tag) {
      let index = this.tags.findIndex(item => {
        return item.deptId == tag.deptId;
      });
      this.tags.splice(index, 1);
      this.$refs.tree && this.$refs.tree.setCheckedNodes(this.tags);
    },
    //点击checkbox 选中末端节点赋给tags
    checkClick(x) {
      this.tags = this.getLastNodes();
      this.$refs.tree && this.$refs.tree.setCheckedNodes(this.tags);
    },
    // 获取末端节点数组
    getLastNodes() {
      if (this.$refs.tree) {
        let arr = this.$refs.tree.getCheckedNodes(),
          tagArr = arr.filter(item => {
            return item.hasChildren == undefined || item.hasChildren == false;
          });
        // console.log(tagArr);
        return tagArr;
      } else {
        return false;
      }
    },
    /**
     * 全局搜索 回调
     */
    globalSearch(val) {
      // 清空已选中的队伍
      this.tags = [];
      val &&
        listDeptCheck({
          deptRoots:this.queryParams.deptRoots,
          deptName: val
        }).then(res => {
          // 过滤掉非末级节点(中队)
          this.searchResultList = res.data;
          // this.searchResultList = res.data.filter(element => {
          //   return !element.hasChildren;
          // });
        });
    },
    /**
     * 弹窗关闭回调
     */
    closeDialogHandle() {
      // 清空数据
      // this.keyWords = "";
      // this.searchResultList = [];
      // this.tags = [];
      this.mulModal = false;
    }
  },
  watch: {
    keyWords(val) {
      // this.$refs.tree.filter(val);
      if (val) {
      } else {
        this.searchResultList = [];
        this.tags = [];
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.name-list
  max-height 300px
  overflow-y auto
.search_zone
  display flex
  align-items center
  span
    font-size 18px
  .el-input
    margin 0 16px
    width 200px
.modal_tree
  margin 0 25px
  h5
    font-size 14px
    font-weight 500
    color rgba(8, 8, 8, 1)
    margin 15px 0
  ul, li
    list-style none
    margin 0
    padding 0
  .tree_zone
    overflow-y auto
    max-height 295px
  .tag_zone
    padding 0 10px
    height 350px
    background rgba(243, 244, 250, 1)
    .tag_group
      overflow-y auto
      max-height 295px
      div
        margin-bottom 22px
</style>
