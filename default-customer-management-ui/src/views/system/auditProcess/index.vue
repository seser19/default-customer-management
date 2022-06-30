<template lang="pug">
	//- 审核流程配置
	.auditProcess.app-container
		.auditProcess-title
			h2 {{ $route.meta.title }}
		.auditProcess-body(v-loading="allDataLoading")
			.auditProcess-form
				h3 本省审核流程配置
				div
					el-form(:inline="true" label-width="140px" class="demo-form-inline")
						el-form-item(label="出动审核流程")
							el-select(v-model="formData.cdTmplId" placeholder="请选择出动审核流程")
								el-option(
									v-for="item in selCdOptions"
									:key="item.id"
									:label="item.name"
									:value="item.id")
						el-form-item(label="火灾审核流程")
							el-select(v-model="formData.zqTmplId" placeholder="请选择火灾审核流程")
								el-option(
									v-for="item in selZqOptions"
									:key="item.id"
									:label="item.name"
									:value="item.id")
					div(style="float:right")
						button.btn_orange(@click="commitData") 提交
			.auditProcess-list
				h3 全部审核流程列表
				el-table(v-loading="listDataLoading" :data="tableDataList.tableData" style="width: 100%")
					el-table-column(type="index" label="序号" width="80")
					el-table-column(prop="name" label="流程名称" width="180")
					el-table-column(prop="scene" label="适用场景" width="180")
					el-table-column(prop="desc" label="流程描述")
				pagination(
						v-show="tableDataList.total>0"
						:total="tableDataList.total"
						:page.sync="tableDataList.pageNum"
						:limit.sync="tableDataList.pageSize"
						@pagination="getdraftList")
</template>
<script>
import { actDiyConfigList, saveTmplToConfig } from '@/api/system/auditProcess.js'

export default {
	name:'auditProcess',
	data(){
		return{
			// 数据加载
			allDataLoading:false,
			listDataLoading:false,
			// 列表数据
			tableDataList:{
				tableData:[],
				total: 20,
				pageNum: 1,
				pageSize: 10,
			},
			// 流程配置选择列表
			selCdOptions:[],
			selZqOptions:[],
			// 当前配置流程
			formData:{
				cdTmplId:'',
				zqTmplId:''
			}
		}
	},
	created(){
		this.allDataLoading = true;
		this.getList({pageNum:1, pageSize:20});
	},
	methods:{
		// 分页
		getdraftList(val){
			let { page: pageNum, limit: pageSize } = val;
			this.listDataLoading = true;
			this.getList({pageNum, pageSize});
		},
		/**
		 * 获取数据
		 */
		async getList({pageNum, pageSize}){
			const res = await actDiyConfigList({pageNum, pageSize});
			if(res.code === 200){
				// 全部审核流程列表数据
				this.tableDataList.tableData = res.data.table.rows;
				this.tableDataList.total = res.data.table.total;
				// 本省审核流程选择列表
				this.selCdOptions = res.data.cdtmpllist;
				this.selZqOptions = res.data.zqtmpllist;
				// 本省审核流程配置
				this.formData.cdTmplId = res.data.selcdtmpl.id || "";
				this.formData.zqTmplId = res.data.selzqtmpl.id || "";
				this.allDataLoading = false;
				this.listDataLoading = false;
			}else{
				this.allDataLoading = false;
				this.listDataLoading = false;
			}
		},
		/**
		 * 提交审核流程数据
		 */
		commitData(){
		    console.log(111)
			this.$confirm('确认修改本省审核流程！', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.saveConfig();
			}).catch(() => {
				return ;
			});
		},
		async saveConfig(){
			const res = await saveTmplToConfig(this.formData);
			if(res.code === 200){
				this.$message({
					type: 'success',
					message: '审核流程修改成功!'
				});
			}
			this.allDataLoading = true;
			//重新调用数据查询
			this.getList({
				pageNum:this.tableDataList.pageNum,
				pageSize:this.tableDataList.pageSize
			});
		}
	}
}
</script>
<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
.auditProcess{
	h3{
		padding-left: 10px;
		margin-bottom: 15px;
		border-left: 5px solid $menuActiveText;
	}
	.auditProcess-title{
		height: 45px;
		line-height: 45px;
		h2{
			font-weight: 400;
			color: #393c41;
			font-size: 18px;
			background-image: url("./image/icon-auditProcess.png");
			background-repeat: no-repeat;
      background-position: 0 50%;
			background-size: 23px;
			padding-left: 30px;
			border-bottom: 1px solid #dae2ed;
			.btn_orange{
				margin-top: 5px;
				float: right;
			}
		}
	}
	.auditProcess-form{
		margin-top: 15px;
		overflow: hidden;
		.demo-form-inline{
			width: 80%;
			float: left;
		}
	}
}
</style>
