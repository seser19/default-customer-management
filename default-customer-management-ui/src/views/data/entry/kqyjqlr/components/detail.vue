<template>
  <div class="detail_page">
    <div class="title">
      <img src="../image/lsjqxx.png" />
      <div>{{ $route.meta.title }}</div>
      <!-- <button class="btn_orange" @click="back">返 回</button> -->
    </div>

    <!-- //- 警情信息详情组件 -->
    <top-detail v-loading="loading" :jq-top-data="jqxxData" />
  </div>
</template>

<script>
import { jqxxDatilInfo } from "@/api/data/entry/jqxx";

// 顶部 警情信息 组件
import topDetail from "@/views/data/entry/zqxx/components/topDetail.vue";

export default {
  name: "lsjqxxxq",
  components: {
    topDetail
  },
  //警情信息
  props: ["detailId"],
  data() {
    return {
      jqxxData: {},
      loading: false
    };
  },
  created() {
    this.loading = true;
    this.getDeail();
  },
  methods: {
    back() {
      this.$emit("toggle");
    },
    getDeail() {
      // console.log(this.detailId);
      jqxxDatilInfo({ jqbh: this.detailId || this.$route.query.jqbh })
        .then(res => {
          // console.log(res);
          if (res.code == 200) {
            this.jqxxData = res.data;
            this.loading = false;
          }
        })
        .catch(res => {
          // console.error(res);
          this.loading = false;
        });
    }
  }
};
</script>
<style lang='stylus' scoped>
@import '~@/assets/styles/mixin.styl'
.detail_page>>>.el-form-item__label
  // display: flex;
  // align-items: center;
  // justify-content: flex-end;
  // text-align: right;
  // height 32px
  // padding 10px 0 0
.detail_page
  background rgba(255, 255, 255, 1)
  border-radius 3px
  border 1px solid rgba(218, 226, 237, 1)
  padding 15px 22px
  font-size 14px
  font-weight 400
  color rgba(55, 57, 76, 1)
  .title
    font-size 18px
    font-weight 400
    display flex
    height 60px
    align-items center
    justify-content space-between
    border-bottom 1px solid rgba(218, 226, 237, 1)
    img
      width 26px
      margin-right 15px
    div
      flex 1
      text-align left
  .content
    padding 22px 60px
    .item
      color #37394C
</style>