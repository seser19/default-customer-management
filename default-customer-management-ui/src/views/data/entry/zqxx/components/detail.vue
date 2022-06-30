<template>

  <div class="detail_page">
    <disasterSituationReport :propfrom="propfrom" />
  </div>
</template>

<script>
import disasterSituationReport from '@/views/data/entry/zqxx/components/disasterInfomation'
export default {
  name: "lshzxxxq",
  components: {
    disasterSituationReport
  },
  data() {
    return {
      propfrom: {
        state: true, // 是否显示警情头部信息
        jqbh: '', // 警情编号
        zqlbdm: '', // 火灾编号
        zqbh: '',
        jqfsdd: '', // 警情发生地点
        // 类型 0填报 1审核 2草稿修改
        type: '1',
        qwhz: '0',
        isNotEdit: true // 判断当前是否是编辑态
      }
    };
  },
  created() {
    this.propfrom.jqbh = this.$route.query.jqbh
    this.propfrom.zqbh = this.$route.query.zqbh
    this.propfrom.qwhz = this.$route.query.qwhz
  },
  mounted() {},
  methods: {

  }
};
</script>
<style lang='stylus' scoped>

</style>