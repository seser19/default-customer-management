<template>
  <el-dialog :visible.sync="mulModal">
    <div slot="title" class="search_zone">
      <span>单项选择</span>
      <!-- <el-input placeholder="全局搜索" suffix-icon="el-icon-search" v-model="keyWords"></el-input> -->
    </div>
    <div class="modal_tree" v-loading="loading">
      <el-row :gutter="20">
        <el-col :span="15">
          <h5>起火场所</h5>
          <div class="tree_zone">
            <el-tree
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
import {getQhcs} from '@/api/data/entry/zqxx'
export default {
  name: "fireSpaceMul",
  data() {
    return {
       loading: false,
      //多选模态框
      mulModal: false,
      keyWords: "",
      props: {
        children: "children",
        label: "dictLabel",
        id: "dictValue",
        isLeaf: "leaf"
      },
      //tagzone
      tags: [],
      // StatusData: this.qhcsType
       //当前被选中的节点
      checkNode: ""
    };
  },
  props:[
    'qhcsType'
  ],
  mounted() {
    
  },
  destroyed() {
    
  },
  updated() {

  },
  methods: {
    loadNode(node, resolve) {
      if (node.level === 0) {
        this.loading = true;
        getQhcs()
          .then(res => {
            // console.log(res);
            resolve(this.handleData(res.data));
            this.loading = false;
          })
          .catch(res => {
            resolve([]);
            this.loading = false;
          });
      } else {
        getQhcs({ parentValue: node.data.dictValue })
          .then(res => {
            // console.log(this.handleData(res.data));
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
        if (item.isLast == 0) {
          item.disabled = true;
        }else{
          item["leaf"] = true;
        }
      });
      return arr;
    },
    //回显
   echo(id) {
      if (id !== "") {
        this.$nextTick(()=>{
        this.$refs.tree.setCheckedKeys([id]);
        this.checkNode = this.$refs.tree.getCheckedNodes()[0];
        })
        
      } else {
        this.$nextTick(() => {
          this.$refs.tree && this.$refs.tree.setCheckedKeys([]);
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
      var arr = this.$refs.tree.getCheckedNodes();
      if (arr.length == 0) {
        this.$message({
          message: "请至少选择一个起火区域",
          type: "warning"
        });
        return;
      }
      this.$emit("setMulVal", arr);
      this.mulModal = false;
    },
  
    // // 获取末端节点数组
    // getLastNodes() {
    //   let arr = this.$refs.tree.getCheckedNodes(),
    //     tagArr = arr.filter(item => {
    //       return item.hasChildren == undefined || item.hasChildren == false;
    //     });
    //   // console.log(tagArr);
    //   return tagArr;
    // },
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
    overflow hidden

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