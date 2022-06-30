<template>
  <el-dialog :visible.sync="mulModal">
    <div slot="title" class="search_zone">
      <span>多项选择</span>
      <!-- <el-input placeholder="全局搜索" suffix-icon="el-icon-search" v-model="keyWords"></el-input> -->
    </div>
    <div class="modal_tree">
      <el-row :gutter="20">
        <el-col :span="15">
          <h5>不排除起火原因</h5>
          <div class="tree_zone">
            <el-tree
              v-if="treeSwitch"
              ref="tree"
              :props="props"
              show-checkbox
              :load="loadNode"
              lazy
              node-key="dictValue"
              :filter-node-method="filterNode"
              @check="checkClick"
            ></el-tree>
          </div>
        </el-col>
        <el-col :span="9" class="tag_zone">
          <div>
            <h5>已选择</h5>
            <div class="tag_group">
              <div :key="index" v-for="(tag,index) in tags">
                <el-tag closable @close="handleClose(tag)">{{tag.dictLabel}}</el-tag>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="mulModal = false">取 消</el-button>
      <el-button type="primary" @click="modalSubmit">保 存</el-button>
      <!-- <div class="btn_orange" @click="modalSubmit">保 存</div> -->
    </span>
  </el-dialog>
</template>

<script>
import { getFireReasonOptions } from "@/api/data/entry/zqxx";
export default {
  name: "bpcMul",
  data() {
    return {
      //多选模态框
      mulModal: false,
      treeSwitch: true,
      keyWords: "",
      props: {
        children: "children",
        label: "dictLabel",
        id: "dictValue",
        isLeaf: "leaf"
      },
      tags: []
    };
  },
  methods: {
    loadNode(node, resolve) {
      if (node.level === 0) {
        getFireReasonOptions()
          .then(res => {
            // console.log(res.data);
            res.data.splice(res.data.length-1,1);
            res.data.splice(0,1);
            resolve(this.handleData(res.data));
          })
          .catch(res => {
            resolve([]);
          });
      } else {
        getFireReasonOptions({ parentValue: node.data.dictValue })
          .then(res => {
            // console.log(res.data);
            resolve(this.handleData(res.data));
          })
          .catch(res => {
            resolve([]);
          });
      }
    },
    // 设置是否为leaf节点
    handleData(arr) {
      /**
       * [description 第一次遍历清除不排除火灾]
       * @param  {[type]} (item, index         [description]
       * @return {[type]}        [description]
       */
      arr.forEach((item, index) => {
        if (item.dictLabel == "不排除原因") {
          arr.splice(index, 1);
        }
      });
      /**
       * [description 判断是否是叶子结点]
       * @param  {[type]} (item, index         [description]
       * @return {[type]}        [description]
       */
      arr.forEach((item, index) => {
        if (item.isLast == 0) {
          item.disabled = true;
        } else {
          item["leaf"] = true;
        }
      });
      return arr;
    },
    //回显
    echo(idArrStr) {
      if (idArrStr.length > 0) {
        let arr = [];
        idArrStr.forEach(item => {
          arr.push(item.hzyydm);
        });
        this.$refs.tree.setCheckedKeys(arr);
        this.tags = this.getLastNodes();
      } else {
        this.$nextTick(() => {
          this.$refs.tree && this.$refs.tree.setCheckedKeys([]);
          this.tags = [];
        });
      }
    },
    //控制显示隐藏
    toggle() {
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
          message: "请至少选择一个不排除原因",
          type: "warning"
        });
        return;
      }
      console.log(this.tags);
      this.$emit("setMulVal", this.tags);
      this.mulModal = false;
    },
    //删除tag并且取消左侧的tree
    handleClose(tag) {
      let index = this.tags.findIndex(item => {
        return item.dictValue == tag.dictValue;
      });
      this.tags.splice(index, 1);
      this.$refs.tree.setCheckedNodes(this.tags);
    },
    //点击checkbox 选中末端节点赋给tags
    checkClick(x) {
      this.tags = this.getLastNodes();
      this.$refs.tree.setCheckedNodes(this.tags);
    },
    // 获取末端节点数组
    getLastNodes() {
      let arr = this.$refs.tree.getCheckedNodes(),
        tagArr = arr.filter(item => {
          return item.isLast == 1;
        });
      // console.log(tagArr);
      return tagArr;
    }
  },
  // computed: {
  //   ChangestatusData:function(){
  //     return this.qhcsType
  //   }
  // },

  watch: {
    keyWords(val) {
      this.$refs.tree.filter(val);
    },
    qhcsType(val) {
      this.treeSwitch = false;
      this.$nextTick(_ => {
        this.treeSwitch = true;
      });
      return val;
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
  margin: 0 25px;

  h5 {
    font-size: 14px;
    font-weight: 500;
    color: rgba(8, 8, 8, 1);
    margin: 15px 0;
  }

  ul, li {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .tree_zone {
    overflow-y: auto;
    max-height: 295px;
  }

  .tag_zone {
    padding: 0 10px;
    height: 350px;
    background: rgba(243, 244, 250, 1);
    overflow: hidden;

    .tag_group {
      overflow-y: auto;
      max-height: 295px;

      div {
        margin-bottom: 22px;
      }
    }
  }
}
</style>