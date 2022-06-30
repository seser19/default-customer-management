<template>
  <div class="zone">
    <el-dialog :visible.sync="modal" width="50%">
      <div slot="title" class="search_zone">
        <span>单项选择</span>
        <!-- <el-input placeholder="全局搜索" suffix-icon="el-icon-search" v-model="keyWords"></el-input> -->
      </div>
      <div class="prov_zone">
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
        <listItem :listTitle="'乡镇（街道）'" ref="last" :data="lastList" @change="changeNext" :type="3"></listItem>
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
import listItem from "./listItem";
export default {
  name: "provModal",
  components: { listItem },
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
      checkedProv: ""
    };
  },
  created() {
    this.changeNext({
      id: 1000000000,
      name: "全国",
      type: 0
    });
  },
  methods: {
    // 请求下一层级的数据，如果没有就把所选id至为最后选中项
    changeNext(obj) {
      // 置空后若干级的列表与选中项
      this.reset(obj);
      // 置空后若干级的列表与选中项
      listAreaQuery({ parentId: obj.id,status:'0' }).then(res => {
        if (res.data.length == 0) {
          this.checkedProv = obj;
          return;
        }
        this.checkedProv = "";
        if (obj.type == 0) {
          this.firstList = res.data;
        } else if (obj.type == 1) {
          this.secendList = res.data;
        } else if (obj.type == 2) {
          this.thirdList = res.data;
        } else {
          this.lastList = res.data;
        }
      });
    },
    reset(obj) {
      if (obj.type == 1) {
        this.secendList = [];
        this.thirdList = [];
        this.lastList = [];
        this.$refs.second.empty();
        this.$refs.third.empty();
        this.$refs.last.empty();
      } else if (obj.type == 2) {
        this.thirdList = [];
        this.lastList = [];
        this.$refs.third.empty();
        this.$refs.last.empty();
      } else if (obj.type == 3) {
        this.lastList = [];
        this.$refs.last.empty();
      }
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
      // console.log(this.checkedProv);
      if (this.checkedProv == "") {
        this.$message({
          message: "请完整选择地区",
          type: "warning"
        });
        return;
      };
      let first = this.$refs.first.active.areaName ? this.$refs.first.active.areaName : "";
      let second = this.$refs.second.active.areaName ? this.$refs.second.active.areaName : "";
      let third = this.$refs.third.active.areaName ? this.$refs.third.active.areaName : "";
      let last = this.$refs.last.active.areaName ? this.$refs.last.active.areaName : "";
      this.$emit(
        "setProv",
        this.checkedProv,
        `${first} ${second} ${third} ${last}`
      );
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

.prov_zone {
  display: flex;

  .list_zone {
    width: 25%;
    height: 400px;
    overflow-y: auto;
    padding: 10px;
    border-right: 1px solid #eaeaea;

    &:nth-last-of-type(1) {
      border: none;
    }
  }
}

.zone >>> .el-dialog__body {
  padding: 0 10px;
}

.zone >>> .el-dialog__footer {
  border-top: 1px solid #eaeaea;
  padding: 10px;
}
</style>