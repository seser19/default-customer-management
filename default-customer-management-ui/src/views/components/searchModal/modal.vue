<template>
  <el-dialog :visible.sync="modal">
    <div slot="title" class="search_zone">
      <span>单项选择</span>
      <el-input placeholder="全局搜索" suffix-icon="el-icon-search" v-model="keyWords"></el-input>
    </div>
    <div class="modal_tree" v-loading="loading">
      <div class="tree_zone">
        <el-tree
          ref="tree"
          :props="props"
          :load="loadNode"
          lazy
          show-checkbox
          node-key="dictValue"
          :filter-node-method="filterNode"
          @check="checkClick"
        ></el-tree>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="modal = false">取 消</el-button>
      <el-button type="primary" @click="modalSubmit">保 存</el-button>
      <!-- <button class="btn_orange" @click="modalSubmit">保 存</button> -->
    </span>
  </el-dialog>
</template>

<script>
import { getTree } from "@/api/system/tree";
export default {
  name: "modal",
  props: ["type"],
  data() {
    return {
      loading: false,
      treeData: "",
      modal: false,
      keyWords: "",
      props: {
        children: "children",
        label: "dictLabel",
        id: "dictValue",
        isLeaf: "leaf"
      },
      // 列表查询参数
      queryParams: {
        dictType: this.type,
        parentValue: ""
      },
      //当前被选中的节点
      checkNode: ""
    };
  },
  created() {
    // console.log(this.queryParams);
  },
  methods: {
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
        // console.log(this.queryParams);
        getTree(this.queryParams)
          .then(res => {
            resolve(this.handleData(res.data));
            this.loading = false;
          })
          .catch(res => {
            resolve([]);
            this.loading = false;
          });
      } else {
        this.queryParams.parentValue = node.data.dictValue;
        getTree(this.queryParams)
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
      // console.log(id);
      if (id !== "") {
        this.$refs.tree.setCheckedKeys([id]);
        this.checkNode = this.$refs.tree.getCheckedNodes()[0];
      } else {
        this.$nextTick(_ => {
          this.$refs.tree && this.$refs.tree.setCheckedKeys([]);
          this.checkNode = "";
        });
      }
    },
    // 设置父节点不可被选中设置disabled 和是否为leaf节点
    handleData(arr) {
      arr.forEach(item => {
        if (item.isLast == 0) {
          item.disabled = true;
        } else {
          item["leaf"] = true;
        }
      });
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
      var arr = this.$refs.tree.getCheckedNodes();
      this.$emit("setVal", arr);
      this.modal = false;
    },
    checkClick(clicked, y) {
      //变成单选
      let node = [clicked];
      if (this.checkNode !== "") {
        if (this.checkNode.dictValue == clicked.dictValue) {
          //选择一样的情况下
          node = [];
          this.checkNode = "";
        } else {
          this.checkNode = clicked;
        }
      } else {
        this.checkNode = clicked;
      }
      // console.log(node);
      this.$refs.tree && this.$refs.tree.setCheckedKeys([]);
      if (node.length == 0) {
        return;
      }
      this.$refs.tree.setCheckedKeys([node[0].dictValue]);
    }
  },
  watch: {
    keyWords(val) {
      this.$refs.tree.filter(val);
    }
  }
};
</script>

<style lang="stylus" scoped>
.search_zone {
  display: flex;
  align-items: center;

  span {
    font-size: 18px;
  }

  .el-input {
    margin-left: 16px;
    width: 200px;
  }
}

.modal_tree {
  height: 350px;
  overflow-y: auto;

  h5 {
    font-size: 14px;
    font-weight: 500;
    color: rgba(8, 8, 8, 1);
    margin: 0 0 15px 0;
  }
}
</style>