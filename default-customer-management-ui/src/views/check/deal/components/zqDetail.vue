<template>

  <div class="detail_page">
    <disasterSituationReport :propfrom="propfrom" />
  </div>
</template>

<script>
import disasterSituationReport from '@/views/data/entry/zqxx/components/disasterInfomation'
export default {
  name: "dealfire",
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
        qwhz: '0',
        taskId:'',
        source:'',
        isNotEdit: true // 判断当前是否是编辑态
      }
    };
  },
  created() {
    this.propfrom.jqbh = this.$route.query.jqbh;
    this.propfrom.zqbh = this.$route.query.zqbh;
    this.propfrom.qwhz = this.$route.query.qwhz;
    this.propfrom.taskId = this.$route.query.taskId;
    this.propfrom.source = this.$route.query.source
  },
  mounted() {},
  methods: {

  }
};
</script>
<style lang='stylus' scoped>

</style>
