<template>
  <el-dialog :visible.sync="modal" @close="closeDialogHandle">
    <div slot="title" class="search_zone">
      <span>单项选择</span>
      <el-input
        placeholder="全局搜索"
        suffix-icon="el-icon-search"
        v-model="keyWords"
        @keyup.enter.native="globalSearch(keyWords)"
      ></el-input>
      <el-button type="primary" @click="globalSearch(keyWords)">查询</el-button>
    </div>
    <div class="modal_tree" v-loading="loading">
      <el-row>
        <el-col :span="15">
      <h5>消防队名称</h5>
      <div class="tree_zone" v-if="!keyWords && !searchResultList.length">
        <el-tree
          ref="tree"
          :props="props"
          :load="loadNode"
          lazy

          node-key="deptId"
          :filter-node-method="filterNode"
          @node-click="checkClick"
        ></el-tree>
      </div>
      <div class="name-list" v-else>
        <el-radio-group v-model="checkNode" v-if="searchResultList.length">
          <el-radio
            v-for="item in searchResultList"
            :key="item.deptId"
            :label="item"
          >{{ item.deptName }}</el-radio>
        </el-radio-group>
        <div class="data-none" v-else>暂无数据</div>
         </div>
        </el-col>
         <el-col :span="9" class="tag_zone">
          <div>
            <h5>已选择</h5>
            <div class="tag_group">
              <!-- <div :key="index" v-for="(tag,index) in tags"> -->
                <!-- <el-tag closable @close="handleClose(tag)">{{tag.deptName}}</el-tag> -->
              <!-- </div> -->
              <el-tag closable v-show="checkNode.deptName" @close="handleClose()">{{checkNode.deptName}}</el-tag>
            </div>
          </div>
        </el-col>
        </el-row>

    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="modal = false">取 消</el-button>
      <el-button type="primary" @click="modalSubmit">保 存</el-button>
      <!-- <button class="btn_orange" @click="modalSubmit">保 存</button> -->
    </span>
  </el-dialog>
</template>

<script>
import { ksList } from "@/api/system/dept";
export default {
  name: "modal",
  props: ['depth'], //是否选到中队
  data() {
    return {
      loading: false,
      treeData: "",
      modal: false,
      keyWords: "",
      props: {
        children: "children",
        label: "deptName",
        id: "deptId",
        isLeaf: "leaf"
      },
      // 列表查询参数
      queryParams: {
        deptName: undefined
      },
      //当前被选中的节点
      checkNode: {},
      // 检索结果列表
      searchResultList: []
    };
  },
  created() {},
  methods: {
    handleClose(){
      this.checkNode = {};
    },
    /**
     *
     * 懒加载树获取组织机构子节点
     * element-tree使用方法
     * @param node:当前点击节点信息
     * @param resolve:传递参数方法
     * deptRoots: 1000000000
     deptLevel: 1
     * */

    loadNode(node, resolve) {
      if (node.level === 0) {
        this.loading = true;
        //根据登录员工来获取树根节点
        this.queryParams.deptRoots = '1000000000'
        this.queryParams.deptLevel = '1'
        this.loading = true;
        ksList(this.queryParams)
            .then(res => {
              resolve(this.handleData(res.data));
              this.loading = false;
            })
            .catch(res => {
              resolve([]);
              this.loading = false;
            });
      } else {
        ksList({ parentId: node.data.deptId,deptLevel:node.data.deptLevel})
          .then(res => {
            resolve(this.handleData(res.data));
          })
          .catch(res => {
            resolve([]);
          });
      }
    },
    //回显
    echo(id) {
      if (id !== "") {
        // this.$refs.tree && this.$refs.tree.setCheckedKeys([id]);
        // this.checkNode =
        //   this.$refs.tree && this.$refs.tree.getCheckedNodes()[0];
      } else {
        this.$nextTick(_ => {
          this.$refs.tree && this.$refs.tree.setCheckedKeys([]);
          this.checkNode = {};
        });
      }
    },
    // 设置父节点不可被选中设置disabled 和是否为leaf节点
    handleData(arr) {
        if(this.depth){
            arr.forEach(item => {
                if (!item.hasChildren) {
                    item["leaf"] = true;
                }
            });
        }else {
            arr.forEach(item => {
                if (item.ancestors.split(",").length < 5) {
                  // item.disabled = true;
                } else {
                  item["leaf"] = true;
                }
            });
        }
        return arr;
    },
    toggle() {
      this.modal = !this.modal;
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    //点击保存
    modalSubmit() {
      // 判断是否选择过
      if (JSON.stringify(this.checkNode) === "{}") {
        this.$message({
          message: "请至少选择一支消防队",
          type: "warning"
        });
        return;
      }
      // console.log(this.checkNode);
      this.$emit("setVal", this.checkNode);
      this.closeDialogHandle();
    },
    checkClick(clicked, y) {
      //变成单选
      this.checkNode = clicked;
      // let node = [clicked];
      // if (JSON.stringify(this.checkNode) !== "{}") {
      //   if (this.checkNode.deptId == clicked.deptId) {
      //     //选择一样的情况下
      //     node = [];
      //     this.checkNode = {};
      //   } else {
      //     this.checkNode = clicked;
      //   }
      // } else {
      //   this.checkNode = clicked;
      // }
      // // console.log(node);
      // this.$refs.tree && this.$refs.tree.setCheckedKeys([]);
      // if (node.length == 0) {
      //   return;
      // }
      // this.$refs.tree && this.$refs.tree.setCheckedKeys([node[0].deptId]);
    },
    /**
     * 全局搜索 回调
     */
    globalSearch(val) {
      // 清空已选中的节点数据
      this.checkNode = {};
      val &&
      ksList({
          deptName: val,
          deptRoots: this.queryParams.deptRoots
        }).then(res => {
          // 过滤掉非(大队)节点
          this.searchResultList = res.data.filter(element => {
            return element.ancestors.split(",").length === 5;
          });
        });
    },
    /**
     * 弹窗关闭回调
     */
    closeDialogHandle() {
      // 清空数据
      // this.keyWords = "";
      // this.searchResultList = [];
      // this.checkNode = {};
      this.modal = false;
    }
  },
  watch: {
    keyWords(val) {
      // this.$refs.tree.filter(val);
      if (val) {
      } else {
        this.searchResultList = [];
        this.checkNode = {};
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
  height 350px
  // overflow-y auto
  h5
    font-size 14px
    font-weight 500
    color rgba(8, 8, 8, 1)
    margin 0 0 15px 0
.tree_zone
  height 350px
  overflow-y auto
.tag_zone
    padding 0 10px
    height 350px
    background rgba(243, 244, 250, 1)
    .tag_group
      max-height 290px
      div
        margin-bottom 22px
</style>
