<template lang="pug">
.app-container
	ReportingPolice(:draft="draft" @back="back")

</template>

<script>
import ReportingPolice from '@/views/data/entry/cdxx/components/ReportingPolice'
export default {
	name:'modify',
	components: {
    ReportingPolice
  },
	data(){
		return{
      draft: {
        // 出动编号
        cdbh: "",
        // 是否展示顶部列表
        isNew: true,
        // 是否首到
        isFirstarrive: false,
        // 主战 || 增援
        respondType: "010000",
        // 审核时专用的 boolean 值
        reviewing: true,
        //退回修改不限时审核框
        isBox:'3',
      },
		}
	},
	created(){
    this.draft.cdbh = this.$route.query.cdbh;
    this.draft.isFirstarrive = this.$route.query.isFirstarrive;
    this.draft.respondType = this.$route.query.respondType;
	},
	methods:{
		back(val) {
			this.$store.dispatch('tagsView/delView', this.$route).then(({ visitedViews }) => {
				this.toLastView(visitedViews, this.$route)
      })
		},
		toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0]
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
@import "~@/assets/styles/variables.scss";
.app-container{
  margin: 10px;
  padding: 10px;
  box-shadow: 0 0 0 1px #dae2ed inset;
  background-color: #fff;
  border-radius: 3px;
  min-height: calc(100vh - 104px);
  position: relative;
}
</style>