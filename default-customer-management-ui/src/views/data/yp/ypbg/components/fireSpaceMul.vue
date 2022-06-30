<template>
  <el-dialog :visible.sync="mulModal">
    <div slot="title" class="search_zone">
      <span>起火场所选择</span>
      <!-- <el-input placeholder="全局搜索" suffix-icon="el-icon-search" v-model="keyWords"></el-input> -->
    </div>
    <div class="modal_tree">
      <el-row :gutter="20">
        <el-col :span="24">
          <h5>起火场所</h5>
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
        <!-- <el-col :span="9" class="tag_zone">
          <div>
            <h5>已选择</h5>
            <div class="tag_group">
              <div :key="index" v-for="(tag,index) in tags">
                <el-tag closable @close="handleClose(tag)">{{tag.dictLabel}}</el-tag>
              </div>
            </div>
          </div>
        </el-col> -->
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
import { getFirePlaceOptions } from "@/api/data/entry/zqxx";
export default {
  name: "fireSpaceMul",
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
      //tagzone
      tags: [],
      checkNode: "",
      listData:{
        1:'qhcsfjgzw',
        2:'qhcsjtgj',
        3:'qhcsjgzw',
        4:'qhcsljfwhs'
      }
      // StatusData: this.qhcsType
    };
  },
  props: ["qhcsType"],
  methods: {
    // qhcsjtgj 起火场所-交通工具2
    // qhcsjgzw 起火场所-建构筑物3
    // qhcsfjgzw 起火场所-非建构筑物1
    // qhcsljfwhs 垃圾废弃物回收处理存放场所4
    loadNode(node, resolve) {
      if(this.qhcsType){
        if (node.level === 0) {
          getFirePlaceOptions({
            dictType: this.listData[this.qhcsType],
            // parentValue: this.qhcsType
          })
            .then(res => {
              // console.log(res);
              resolve(this.handleData(res.data));
            })
            .catch(res => {
              resolve([]);
            });
        } else {
          getFirePlaceOptions({
            dictType: this.listData[this.qhcsType],
            parentValue: node.data.dictValue
          })
            .then(res => {
              // console.log(this.handleData(res.data));
              resolve(this.handleData(res.data));
            })
            .catch(res => {
              resolve([]);
            });
        }
      }
    },
    // 设置是否为leaf节点
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
    //回显
    echo(idArrStr) {
      if (idArrStr !== "") {
        // let arr = [];
        // idArrStr.forEach(item => {
        //   console.log(item.qhcsdm);
        //   arr.push(item.qhcsdm);
        // });
        /**
         * 延时5毫秒触发
         * 防止树形dom没有加载完成
         * setCheckedKeys()报错问题
         */
        setTimeout(()=>{
          if(Array.isArray(idArrStr)){
            this.$refs.tree.setCheckedNodes(idArrStr);
          }else {
            this.$refs.tree.setCheckedKeys([idArrStr]);
          }
        },500)

        // this.tags = this.getLastNodes();
      } else {
        this.$nextTick(() => {
          this.$refs.tree && this.$refs.tree.setCheckedKeys([]);
          this.tags = [];
        });
      }
    },
    // echo(id) {
    //   if (id !== "") {
    //     // this.$refs.tree.setCheckedKeys([id]);
    //     this.checkNode = this.$refs.tree.getCheckedNodes()[0];
    //   } else {
    //     this.$nextTick(() => {
    //       this.$refs.tree && this.$refs.tree.setCheckedKeys([]);
    //     });
    //   }
    // },
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
      let arr = this.$refs.tree.getCheckedNodes();
      if (arr.length == 0) {
        this.$message({
          message: "请至少选择一个起火场所",
          type: "warning"
        });
        return;
      }
      // console.log(arr);
      this.$emit("setMulVals", arr);
      this.mulModal = false;
    },
    //删除tag并且取消左侧的tree
    // handleClose(tag) {
    //   let index = this.tags.findIndex(item => {
    //     return item.dictValue == tag.dictValue;
    //   });
    //   this.tags.splice(index, 1);
    //   this.$refs.tree.setCheckedNodes(this.tags);
    // },
    // //点击checkbox 选中末端节点赋给tags
    // checkClick(x) {
    //   this.$refs.tree.setCheckedKeys([]);
    //   this.tags = [];
    //   this.tags = this.getLastNodes();
    //   this.$refs.tree.setCheckedNodes(this.tags);
    // },
    // 获取末端节点数组
    // getLastNodes() {
    //   let arr = this.$refs.tree.getCheckedNodes(),
    //     tagArr = arr.filter(item => {
    //       return item.isLast == 1;
    //     });
    //   // console.log(tagArr);
    //   return tagArr;
    // },
    checkClick(clicked) {
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
