<template lang="pug">
.modify
	disasterSituationReport(:propfrom="propfrom" @back="back")

</template>

<script>
import disasterSituationReport from '@/views/data/entry/zqxx/components/disasterInfomation'
export default {
	name:'modify',
	components: {
    disasterSituationReport
  },
	data(){
		return{
			propfrom: {
        state: true, // 是否显示警情头部信息
        jqbh: '', // 警情编号
        zqlbdm: '', // 火灾编号
        zqbh: '',
        jqfsdd: '', // 警情发生地点
        // 类型 0填报 1审核 2草稿修改
        type: '3',
        qwhz: '0',
        isNotEdit: false // 判断当前是否是编辑态
      }
		}
	},
	created(){
		this.propfrom.jqbh = this.$route.query.jqbh;
    this.propfrom.zqbh = this.$route.query.zqbh;
    this.propfrom.qwhz = this.$route.query.qwhz
	},
	methods:{
		back(val) {
			this.$store.dispatch('tagsView/delView', this.$route).then(({ visitedViews }) => {
				this.toLastView(visitedViews, this.$route)
      })
		},
		toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0];
      if (latestView) {
        this.$router.push(latestView)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
          // to reload home page
          this.$router.replace({ path: '/redirect' + view.fullPath })
        } else {
          this.$router.push('/')
        }
      }
    },
	}
}
</script>

<style lang="scss" scoped>

</style>
