<style lang="stylus" scoped>
.app-container
  // background-color #F4F6F8
  // padding 10px
  // min-height calc(100vh - 84px)

  .page_zone
    // background rgba(255, 255, 255, 1)
    // border-radius 3px
    // border 1px solid rgba(218, 226, 237, 1)
    // padding 0px 22px 15px 22px
    font-size 14px
    font-weight 400
    color rgba(55, 57, 76, 1)

    .title
      font-size 18px
      font-weight 400
      display flex
      height 45px
      align-items center
      justify-content space-between
      border-bottom 1px solid rgba(218, 226, 237, 1)
      margin 0 0 18px 0
      padding-bottom 15px
      border-left none

      img
        width 26px
        margin-right 15px

      div
        flex 1
        text-align left

    .content
      .search
        h4
          font-size 16px

        .row
          display flex
          justify-content space-between

          .btn_orange, .btn_back
            padding 0 30px

          .el-form-item
            flex 1
            margin-right 20px
            width 30%

            .el-select, .el-input, .el-range-editor, .el-cascader
              width 100%

          .hidden
            visibility hidden

  .pic
    position relative
    padding-left 18px

  .pic img
    width 14px
    height 14px
    position absolute
    left 0px
    top 4px

  .pagination_zone
    margin-top 20px
    text-align right

  .none
    cursor not-allowed
</style>
<style lang="scss">
.table-d {
  width: 97%;
  min-height: 200px;
  overflow: auto;
  margin: 30px auto 0;

  p {
    margin: 0;

    table {
      border-collapse: collapse;
      margin: 0 auto;
      text-align: center;

      tr:nth-child(2) {
        text-align: right;
      }

      th {
        word-break: keep-all;
        white-space: nowrap;
      }

      td {
        padding: 7px 12px;
        border: solid 1px #c6c6c6;
        word-break: keep-all;
        white-space: nowrap;
      }
    }
  }
}

.synchronize-timestamp {
  display: inline-block;
  margin: 0 15px 0 0;
  font-size: 13px;

  span {
    color: #e1374c;
  }
}
</style>

<template>
  <div class="app-container">
    <div class="page_zone">
      <div class="title">
        <div>{{ $route.meta.title }}</div>
        <!-- <div v-if="subdivisionParams.deptLevel!='1'" style="text-align: right;">
          <p class="synchronize-timestamp">数据统计时间截止至&nbsp;<span>{{synchronizationTime || "-"}}</span></p>
          <el-button v-if="subdivisionParams.deptLevel=='2'" class="btn_orange" @click.prevent="dataSynchronize()" :loading="btnLoading">数据同步</el-button>
        </div> -->
      </div>
    </div>
    <div class="content" v-loading="loading">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="固定报表" name="first">
          <fixed-report></fixed-report>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {listDept, getDept, treeselect, delDept, addDept, updateDept} from "@/api/system/dept";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {getUserProfile} from "@/api/system/user";
import {listDeptCheck} from "@/api/system/dept";
import provModal from '@/views/data/entry/jqxx/components/provModal';
import mulModal from '@/views/data/entry/jqxx/components/mulModal';
import XLSX from 'xlsx';
import {getInfo} from '@/api/login';
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {
  getReportTemplateLv1,
  getReportTemplateLv2,
  getFireReport,
  synchronizeData,
  getSynchronizeDataTime,
  getLastEtlTime
} from '@/api/report/report';
//*****************固定报表查询
import FixedReport from "./component/fireReport";
// import CustomReport from "./component/customReport";
export default {
  name: 'fixedstatement',
  components: {provModal, mulModal, Treeselect, FixedReport},
  data() {
    return {
      activeName: 'first',
      isLyao: '',
      isBJ: false,
      loading: false,
      subdivisionParams: {
        deptLevel: 0,
        parentId: null,
        type: 0
      },
      zdForm: [],
      normalizer(node) {
        return {
          id: node.deptId,
          label: node.deptName,
          children: node.children
        };
      },
      synchronizationTime: '',
      btnLoading: false //按钮loading
    };
  },
  methods: {
    // 同步数据
    async dataSynchronize() {
      this.btnLoading = true;
      const res1 = await synchronizeData().finally(() => {
        this.btnLoading = false;
      });
      if (res1.code === 200) {
        this.$message.success('数据同步成功！');
        const res2 = await getSynchronizeDataTime();
        if (res2.code === 200) {
          this.synchronizationTime = res2.data.cdtime;
          // TODO 将返回的同步时间填到页面上
        } else {
          this.$message.error(res2.msg);
        }
      } else {
        this.$message.error(res1.msg);
      }
    },
    /**
     * [getLastTime 获取最后一次同步时间]
     * @Author       Miliky
     * @DateTime     2020-01-21T23:31:45+0800
     * @Description: [一行代码一行诗]
     * @return       {void}
     */
    getLastTime() {
      getLastEtlTime().then(res => {
        if (res.code == 200) this.synchronizationTime = res.data.cdtime || '';
      })
    },
    handleClick(tab) {
    }

  },
  async created() {
    this.isLyao = this.$store.state.user.name;
    this.isBJ = this.$store.state.user.deptId === 1000000000;
    //this.getLastTime();
    //获取用户账号
    let deptLevel = 0;
    // 获取用户所属组织层级
    const res1 = await getInfo();
    if (res1.code === 200) {
      deptLevel = res1.user.dept.deptLevel;
      this.deptId = res1.user.dept.deptId;
      this.subdivisionParams.deptLevel = deptLevel;
    } else {
      this.$message.error(res1.msg);
    }
  }
};
</script>
