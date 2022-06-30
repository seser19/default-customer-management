<template>
  <div class="zone">
    <el-dialog :visible.sync="modal" width="50%">
      <div slot="title" class="search_zone">
        <span>多项选择</span>
        <!-- <el-input placeholder="全局搜索" suffix-icon="el-icon-search" v-model="keyWords"></el-input> -->
      </div>
      <div class="prov_zone">
        <el-row :gutter="20">
          <el-col :span="100">
            <div class="tree_zone">
              <el-tree
                check-strictly
                ref="tree"
                :props="props"
                show-checkbox
                :load="loadNode"
                lazy
                node-key="areaId"
                @check="checkClick"></el-tree>
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
  </div>
</template>

<script>
import { listAreaQuery, roleAreaTreeselect } from "@/api/system/area";

export default {
  name: "provModal",
  data() {
    return {
      selected: [],
      modal: false,
      keyWords: "",
      //每一级的数据
      firstList: [],
      secendList: [],
      thirdList: [],
      lastList: [],
      //每一级的选择项
      firstName: "",
      secondName: "",
      thirdName: "",
      lastName: "",
      checkedProv: [],
      fullPaths: [],
      props: {
        children: "children",
        label: "areaName",
        id: "areaId",
        isLeaf: "leaf"
      },
      loading: false,
      // 用于判断是否是固定报表或数据查询中使用的
      routerFlag: false, //  默认不是报表所需
      isReport:["fixedstatement", "dataquery"],// 报表名单
    };
  },
  mounted(){
    // 判断当前路由是否是 isReport 数组中的
    this.routerFlag = this.isReport.includes(this.$router.currentRoute.name);
  },
  methods: {
    loadNode(node, resolve) {
      if (node.level === 0) {
        // resolve(this.queryArea({
        //     id: 1000000000,
        //     name: "全国",
        //     type: 0,
        //     deptId: this.$store.state.user.deptId
        // }))
        var deptId = this.$store.state.user.deptId;
        console.log(this.$store.state.user)
        listAreaQuery({
          parentId: 1000000000,
          name: "全国",
          type: 0,
          deptId: deptId == 1000000000 ? "" : deptId
        }).then(res => {
          var arr = res.data;
          arr.forEach(each => {
            each.fullPath = each.areaName
          });
          resolve(arr)
        }).catch(err => {
          resolve([])
        })
      } else if (node.level === 4) {
        listAreaQuery({
          parentId: node.data.areaId,
          status:'0',
          routerFlag: this.routerFlag,
          deptId: node.data.deptId == 1000000000 ? "" : node.data.deptId
        }).then(res => {
          var arr = res.data;
          arr.forEach(each => {
            each.fullPath = node.data.fullPath + ' ' + each.areaName
          });
          console.log(arr);
          resolve(this.handleLeaf(arr))
        }).catch(err => {
          console.log(err);
          resolve([])
        });
        resolve(this.handleLeaf(this.queryArea(node.data)))
      } else {
        listAreaQuery({
          parentId: node.data.areaId,
          status:'0',
          routerFlag: this.routerFlag,
          deptId: node.data.deptId == 1000000000 ? "" : node.data.deptId
        }).then(res => {
          var arr = res.data;
          arr.forEach(each => {
            each.fullPath = node.data.fullPath + ' ' + each.areaName
          });
          resolve(this.handleLeaf(arr))
        }).catch(err => {
          console.log(err);
          resolve([])
        })
      }
    },
    queryArea(obj) {
      listAreaQuery({
        parentId: obj.id,
        status:'0',
        areaName: '',
        routerFlag: this.routerFlag,
        deptId: obj.deptId == 1000000000 ? "" : obj.deptId
      }).then(res => {
        var arr = res.data;
        arr.forEach(each => {
          if (obj.areaName) {
            each.fullPath = obj.areaName + ' ' + each.areaName
          } else {
            each.fullPath = each.areaName
          }
        });
        return this.handleLeaf(arr);
      }).catch(err => {
        console.log(err);
        return []
      })
    },
    handleLeaf(res) {
      res.forEach(item => {
        if (!item.hasChildren) {
          item["leaf"] = true;
        }else {
          item["leaf"] = false;
        }
      });
      return res
    },
    // checkClick(data) {
    //     this.checkedProv.push(data)
    //     this.fullPaths.push(data.fullPath)
    // },
    toggle() {
      this.modal = !this.modal;
    },
    // filterNode(value, data) {
    //     if (!value) return true;
    //     return data.label.indexOf(value) !== -1;
    // },
    checkClick(x) {
      this.checkedProv = [];
      this.fullPaths = [];
      this.selected = [];
      let arr = this.$refs.tree.getCheckedNodes();
      arr.forEach(item => {
        this.checkedProv.push(item);
        this.fullPaths.push(item.fullPath);
        this.selected.push(item.fullPaths)
      })
    },
    //点击保存
    modalSubmit() {
      // console.log(this.$route);
      // 数据查询页面特殊处理，直接赋值，每一级都可以选中
      if (this.checkedProv.length == 0 && this.$route.path === "/data/entry/jqxxtb") {
        this.$message({
          message: "请完整选择地区",
          type: "warning"
        });
        return;
      }
      if(this.loading == true){
        return
      }
      this.$emit("setProv", this.checkedProv, this.fullPaths.join(','));
      this.modal = false;
    },
    clear() {
      this.$refs.tree.setCheckedKeys([]);
    }
  },
  watch: {
    keyWords(val) {
      // this.$refs.tree.filter(val);
    }
  }
};
</script>

<style lang="stylus" scoped>
.search_zone
  display flex
  align-items center
  span
    font-size 18px
  .el-input
    margin-left 16px
    width 200px
.prov_zone
  display flex
  max-height 295px
  overflow-y auto
  .list_zone
    width 25%
    height 400px
    overflow-y auto
    padding 10px
    border-right 1px solid #eaeaea
    &:nth-last-of-type(1)
      border none
.zone >>> .el-dialog__body
  padding 0 10px
.zone >>> .el-dialog__footer
  border-top 1px solid #eaeaea
  padding 10px
</style>
