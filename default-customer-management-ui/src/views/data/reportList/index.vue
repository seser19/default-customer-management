<template>
  <div class="view">
    <div class="report-list">
      <el-row :gutter="20">
        <el-col :span="6" v-for="(item,index) in reportList" :key="index">
          <div class="list-item" @click="onOpen(item.url)">
            <img src="@/assets/image/report-icon.png" alt />
            <div class="item-name" :title="item.name">{{ item.name }}</div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      reportList: [
        {
          name: "分地区灾害事故综合情况",
          url:
            "http://192.168.11.221:8081/report/sso/union-entry?forwardReportId=REP5D172EEFF9744B928A293987BA918ABA"
        },
        {
          name: "消防总（支、大、中）队接警出动表",
          url:
            "http://192.168.11.221:8081/report/sso/union-entry?forwardReportId=REPE13C79D34D924A8CBF68FCA3FEF382EC"
        },
        {
          name: "消防总（支、大、中）队历年接警出动表",
          url:
            "http://192.168.11.221:8081/report/sso/union-entry?forwardReportId=REP7FA68D2C72814FFFBDD64027F98F0C41"
        },
        {
          name: "死亡1-2人火灾事故分地区情况表",
          url:
            "http://192.168.11.221:8081/report/sso/union-entry?forwardReportId=REP5610D4B98E5E42E884F41563AAAE5405"
        },
        {
          name: "死亡人员分类统计表",
          url:
            "http://192.168.11.221:8081/report/sso/union-entry?forwardReportId=REP15B978D23388416585C3939A80D9C9E8"
        },
        {
          name: "居民、村民火灾分地区情况表",
          url:
            "http://192.168.11.221:8081/report/sso/union-entry?forwardReportId=REP26933EB22C9B46E1B90B9872A60C1E68"
        },
        {
          name: "分地区火灾基本情况",
          url:
            "http://192.168.11.221:8081/report/sso/union-entry?forwardReportId=REP275061B184A244F2BDB84AD1301AD87A"
        },
        {
          name: "24小时火灾基本情况",
          url:
            "http://192.168.11.221:8081/report/sso/union-entry?forwardReportId=REP0E1EA196C3CF4AFCB059C92A83D8B267"
        },
        {
          name: "省火灾原因基本情况",
          url:
            "http://192.168.11.221:8081/report/sso/union-entry?forwardReportId=REP570AC3B553144EDC9CE33811CB2B77ED"
        }
      ]
    };
  },
  methods: {
      onOpen(url) {
          this.$router.push({
              path: "/report/outsideWeb",
              query: {
                url: url
              }
          })
      }
  }
};
</script>

<style lang="scss" scoped>
.view {
    padding: 10px;
    .report-list {
        .list-item {
            margin-bottom: 20px;
            background: #fff;
            text-align: center;
            box-shadow:0px 6px 24px 0px rgba(0,0,0,0.1);
            border-radius:6px;
            cursor: pointer;
            padding: 20px 10px;
            line-height: 30px;
            .item-name {
                width: 250px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                -o-text-overflow: ellipsis;
            }
        }
    }
}
</style>