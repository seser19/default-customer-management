<template>
  <div class="zone">
    <el-dialog :visible.sync="modal" width="50%">
      <div slot="title" class="search_zone">
        <span>单项选择</span>
        <!-- <el-input placeholder="全局搜索" suffix-icon="el-icon-search" v-model="keyWords"></el-input> -->
      </div>
      <div class="prov_zone" v-loading="loading">
        <listItem
          :listTitle="'省份（区/市）'"
          ref="first"
          :data="firstList"
          @change="changeNext"
          :type="0"
        ></listItem>
        <listItem
          :listTitle="'市（地/州/盟）'"
          ref="second"
          :data="secendList"
          @change="changeNext"
          :type="1"
        ></listItem>
        <listItem
          :listTitle="'县（市/区/旗）'"
          ref="third"
          :data="thirdList"
          @change="changeNext"
          :type="2"
        ></listItem>
<!--        <listItem :listTitle="'乡镇（街道）'" ref="last" :data="lastList" @change="changeNext" :type="3"></listItem>-->
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
import { listAreaQuery, getArea } from "@/api/system/area";
import listItem from '@/views/data/entry/jqxx/components/listItem'

export default {
  name: "provModal",
  components: { listItem },
  props: ['depth'],
  data() {
    return {
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
      checkedProv: "",
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
  created() {
    this.changeNext({
      id: 1000000000,
      name: "全国",
      type: 0,
      deptId: this.$store.state.user.deptId
    });

  },
  methods: {
    // 请求下一层级的数据，如果没有就把所选id至为最后选中项
    changeNext(obj) {
      this.loading = true;
      // 到达当前层级限制，只选中，不再获取下级
      if (this.depth === obj.type) {
        this.checkedProv = obj;
        this.loading = false;
        return;
      }
      // 置空后若干级的列表与选中项
      this.reset(obj);
      // 置空后若干级的列表与选中项
      /**
       * 判断obj.deptId==1000000000
       * 当前为admin帐号时显示全国
       * 否则显示当前账号所在的省市
       */
      listAreaQuery({
        parentId: obj.id,
        status:'0',
        routerFlag: this.routerFlag,
        deptId: obj.deptId == 1000000000 ? "" : obj.deptId
      })
        .then(res => {
          // 数据查询页面特殊处理，直接赋值，每一级都可以选中 this.$route.path === "/eqw/dataSeach"
          if (this.$route.path) {
            this.checkedProv = obj;
          } else if (res.data.length == 0) {
            this.checkedProv = obj;
            return;
          } else {
            this.checkedProv = "";
          }
          if (obj.type == 0) {
            this.firstList = res.data;
          } else if (obj.type == 1) {
            this.secendList = res.data;
          } else if (obj.type == 2) {
            this.thirdList = res.data;
          }
          // else if (obj.type == 3){
          //   this.lastList = res.data;
          // }
        }).catch(res => {
          console.error("res");
        }).finally(() => {
          this.loading = false;
      });
    },
    reset(obj) {
      if (obj.type === 1) {
        this.secendList = [];
        this.thirdList = [];
        this.lastList = [];
        this.$refs.second.empty();
        this.$refs.third.empty();
        // this.$refs.last.empty();
      } else if (obj.type === 2) {
        this.thirdList = [];
        this.lastList = [];
        this.$refs.third.empty();
        // this.$refs.last.empty();
      } else if (obj.type === 3) {
        this.lastList = [];
        // this.$refs.last.empty();
      }
    },
    clear() {
      this.secendList = [];
      this.thirdList = [];
      this.lastList = [];
      if (this.$refs.first) {
        this.$refs.first.active = {};
      }
      if (this.$refs.second) {
        this.$refs.second.empty();
      }
      if (this.$refs.third) {
        this.$refs.third.empty();
      }
      // if (this.$refs.last) {
      //   this.$refs.last.empty();
      // }
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
      // console.log(this.$route);
      // 数据查询页面特殊处理，直接赋值，每一级都可以选中
      if (this.checkedProv.type > 3) {
        this.$message({
          message: "请完整选择地区",
          type: "warning"
        });
        return;
      }

      if(this.loading == true){
        return
      }
      let first = this.$refs.first.active.areaName
        ? this.$refs.first.active.areaName
        : "";
      let second = this.$refs.second.active.areaName
        ? this.$refs.second.active.areaName
        : "";
      let third = this.$refs.third.active.areaName
        ? this.$refs.third.active.areaName
        : "";
      // let last = this.$refs.last.active.areaName
      //   ? this.$refs.last.active.areaName
      //   : "";
      this.$emit("setProv", this.checkedProv, {
        first,
        second,
        third,
        // last
      });
      this.modal = false;
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
  .list_zone
    width 33%
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
