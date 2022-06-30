<template>
  <el-dialog :visible.sync="modal" @close="closeDialogHandle">
    <div slot="title" class="search_zone">
      <span>多项选择</span>
      <!--<el-input
        placeholder="全局搜索"
        suffix-icon="el-icon-search"
        v-model="keyWords"
        @keyup.enter.native="globalSearch(keyWords)"
      ></el-input>
      <el-button type="primary" @click="globalSearch(keyWords)">查询</el-button>-->
    </div>
    <div class="modal_tree" v-loading="loading">
      <el-row>
        <el-col :span="15">
          <h5>单位名称</h5>
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
        <el-col :span="9" class="tag_zone" style="overflow: auto; -webkit-overflow-scrolling: touch">
          <div>
            <h5>已选择</h5>
            <div class="tag_group">
               <div :key="index" v-for="(tag,index) in selectedNode">
                 <el-tag closable @close="handleClose(tag)">{{tag.deptName}}</el-tag>
               </div>
              <!--<el-tag closable v-show="checkNode.deptName" @close="handleClose()">{{checkNode.deptName}}</el-tag>-->
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
  import { getUserProfile } from "@/api/system/user";
  import { listDept } from "@/api/system/dept";
  export default {
    name: "senderMulModal",
    props: ['depth'], //是否选到中队
    data() {
      return {
        loading: false,
        treeData: "",
        selectedNode: [],
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
        // 检索结果列表
        searchResultList: []
      };
    },
    created() {},
    methods: {
      handleClose(tag){
        let index = this.selectedNode.findIndex(item => item.deptId === tag.deptId);
        this.selectedNode.splice(index, 1);
        this.$refs.tree.setCheckedNodes(this.selectedNode);
      },
      /**
       *
       * 懒加载树获取组织机构子节点
       * element-tree使用方法
       * @param node:当前点击节点信息
       * @param resolve:传递参数方法
       * */
      loadNode(node, resolve) {
        if (node.level === 0) {
          this.loading = true;
          //根据登录员工来获取树根节点
          getUserProfile().then(response => {
            this.queryParams.deptRoots = response.deptRoots;
            // console.log(response);
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
      //回显
      echo(id) {
        if (id !== "") {
          // this.$refs.tree && this.$refs.tree.setCheckedKeys([id]);
          // this.checkNode =
          //   this.$refs.tree && this.$refs.tree.getCheckedNodes()[0];
        } else {
          this.$nextTick(_ => {
            this.$refs.tree && this.$refs.tree.setCheckedKeys([]);
            this.selectedNode = [];
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
/*        if (this.selectedNode.length === 0) {
          this.$message({
            message: "请至少选择一支消防队",
            type: "warning"
          });
          return;
        }*/
        this.$emit("setMulVal", this.selectedNode);
        this.closeDialogHandle();
      },
      checkClick() {
        this.selectedNode = this.$refs.tree.getCheckedNodes();
      },
      /**
       * 全局搜索 回调
       */
      globalSearch(val) {
        // 清空已选中的节点数据
        this.selectedNode = [];
        val &&
        listDeptCheck({
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
        this.modal = false;
      },
      //清空选择的值
      clear(){
        this.selectedNode = [];
        this.$refs.tree.setCheckedKeys([]); 
      }
    },
    watch: {
      keyWords(val) {
        // this.$refs.tree.filter(val);
        if (val) {
        } else {
          this.searchResultList = [];
          this.selectedNode = [];
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
