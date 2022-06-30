<template lang="pug">
//- 批量归档
.bulkArchive.app-container(v-loading="allLoading")
	.bulkArchive-title
		h2 {{ $route.meta.title }}
	.bulkArchive-form
		el-form(:inline="true" label-width="80px" class="demo-form-inline")
			el-form-item(label="报告类型")
				el-select(v-model="paramsData.bglx" @change="bglxChange" placeholder="请选择报告类型")
					el-option(
						v-for="item in reportTypeOptions"
						:key="item.dictValue"
						:label="item.dictLabel"
						:value="item.dictValue")
			el-form-item(label="归档方式")
				el-select(v-model="paramsData.archiveMethod" @change="archiveMethodChange" placeholder="请选择归档方式")
					el-option(
						v-for="item in archiveMethodOptions"
						:key="item.dictValue"
						:label="item.dictLabel"
						:value="item.dictValue")
			el-form-item(v-show="paramsData.archiveMethod==='1'" label="月份选择")
				el-select(v-model="paramsData.archiveMonth" placeholder="请选择月份")
					el-option(
						v-for="item in monthListOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value")
			el-form-item(v-show="paramsData.archiveMethod==='2'" label="年度选择")
				el-select(v-model="paramsData.archiveYear" placeholder="请选择年度")
					el-option(
						v-for="item in yearListOptions"
						:key="item.dictValue"
						:label="item.dictLabel"
						:value="item.dictValue")
			//- el-form-item(v-show="paramsData.archiveMethod==='2'" label="年度选择")
			//- 	el-date-picker(
			//- 		v-model="paramsData.archiveYear"
			//- 		:picker-options="pickerOptions"
			//- 		:default-value="Date.now()- 24 * 3600 * 1000 * 365"
			//- 		type="year"
			//- 		style="width:194px;"
			//- 		value-format="yyyy"
			//- 		placeholder="选择年份")
			el-form-item
				el-button(type="primary" @click="queryData") 查  询
	.bulkArchive-text(v-show="total>0")
		span 查询结果：
		span 共查询到 #[span.number {{total || 0}}] 起{{paramsData.bglx==='1'?'出动记录':'火灾记录'}}可进行归档
		el-button(type="primary" :disabled="isDisabled" @click="batchArchive") 归 档
	//- 出动列表
	.bulkArchive-list(v-show="paramsData.bglx==='1'" v-loading="listLoading")
		el-table(
			:data="cdListData"
			ref="multipleTable"
			max-height="500px"
			tooltip-effect="dark"
			style="width: 100%"
			@selection-change="handleSelectionChange")
			el-table-column(type="selection" width="50")
			el-table-column(prop="cdbh" label="出动编号" width="140")
			el-table-column(prop="jqbh" label="警情编号" width="130")
			el-table-column(prop="jjsj" label="接警时间" width="130")
			el-table-column(prop="xzqydmSj" label="行政区域" width="150")
			el-table-column(prop="jqfsdd" label="警情地址" show-overflow-tooltip)
			el-table-column(prop="sjlbmc" label="警情类型")
			el-table-column(prop="zrqddmc" label="出动队伍" show-overflow-tooltip)
			el-table-column(prop="respondType" label="参战形式" width="80")
			el-table-column( label="投入力量" width="80")
				template(slot-scope="scope") {{scope.row.carCount||0}}车{{scope.row.trrys||0}}人
	//- 灾情列表
	.bulkArchive-list(v-show="paramsData.bglx==='2'" v-loading="listLoading")
		el-table(
			:data="zqListData"
			ref="multipleTable"
			max-height="500px"
			tooltip-effect="dark"
			style="width: 100%"
			@selection-change="handleSelectionChange")
			el-table-column(type="selection" width="50")
			el-table-column(prop="zqbh" label="火灾编号" width="140")
			el-table-column(prop="zqsj" label="起火时间" width="130")
			el-table-column(prop="xzqy" label="行政区域" width="150")
			el-table-column(prop="jqfsdd" label="警情地址" show-overflow-tooltip)
			el-table-column(prop="qwhz" label="轻微火灾" width="75")
				template(slot-scope="scope") {{scope.row.qwhz===0?'否':'是'}}
			el-table-column(prop="zqdd" label="起火场所" show-overflow-tooltip)
			el-table-column(prop="hzyyms" label="起火原因" show-overflow-tooltip)
			el-table-column(label="伤亡情况" width="100")
				template(slot-scope="scope") {{ scope.row.swrs }}死  {{ scope.row.ssrs }}伤
			el-table-column(prop="deptname" label="调查单位" show-overflow-tooltip)
	pagination(
		v-show="total>0"
		:total="total"
		:page.sync="paramsData.pageNum"
		:limit.sync="paramsData.pageSize"
		@pagination="getdraftList")
</template>
<script>
import { batchArchiveCdQuery, batchArchiveZqQuery, batchArchive } from '@/api/businessManagement/archive.js';

export default {
	data(){
		return{
			allLoading:false,
			listLoading:false,
			paramsData:{
				bglx:'1',              // 报告类型 1:出动报告 2:火灾报告
				archiveMethod:'1',     // 归档方式 1:月度归档 2:年度归档
				archiveMonth: null,    // 归档月份 默认 null
				archiveYear: null,     // 归档年份 默认 null
				pageNum: 1,
				pageSize: 10,
			},
			isDisabled: true,      //
			cdbh: [],              // 归档出动编号列表
			zqbh: [],							 // 归档灾情编号列表
			// 列表总数
			total: 0,
			// 出动列表数据
			cdListData: [],
			// 灾情列表数据
			zqListData: [],
			// 报告类型选择列表
			reportTypeOptions:[],
			// 归档方式选择列表
			archiveMethodOptions:[],
			// 月份选择列表
			monthListOptions:[],
			// 年度选择列表
			yearListOptions:[],
			// 年份选择限制
			pickerOptions:{
	    	disabledDate(time) {
	      	return time.getTime() > Date.now()- 24 * 3600 * 1000 * 365;   
	      },
     },
		}
	},
	created(){
		this.getMonthList();
		this.getDictsData();
	},
	methods:{
		/**
		 * 报告类型修改
		 * > 重置分页数据
		 * > 重置出动和火灾列表数据
		 * > 重置出动和火灾选择列表
		 */
		bglxChange(val){
			// 重置出动和火灾列表数据
			this.cdListData = this.zqListData = [];
			// 重置分页数据
			this.paramsData.pageNum = 1;
			this.paramsData.pageSize = 10;
			this.total = 0;
			// 重置出动和火灾选择列表
			this.cleanList();
		},

		/**
		 * 归档方式更改时，重置月份或年份数据为 null
		 */
		archiveMethodChange(val){
			// 重置出动和火灾列表数据
			this.cdListData = this.zqListData = [];
			// 重置分页数据
			this.paramsData.pageNum = 1;
			this.paramsData.pageSize = 10;
			this.total = 0;
			// 重置出动和火灾选择列表
			this.cleanList();
			val === '1' ? this.paramsData.archiveYear = null : this.paramsData.archiveMonth = null;
		},

		/**
		 * 查询数据
		 * 查询之前先要判断要查询的报告类型
		 * 根据不同的报告类型调用不同的接口
		 */
		queryData(){
			if (this.paramsData.archiveMethod==='1') {
				if (this.paramsData.archiveMonth===null) {
					this.$message({
						type: 'warning',
						message: '请选择月份!'
					});
					return;
				}
			}else{
				if (this.paramsData.archiveYear===null) {
					this.$message({
						type: 'warning',
						message: '请选择年度!'
					});
					return;
				}
			};
			// 重置出动和火灾选择列表
			this.cleanList();
			this.listLoading = true;
			if (this.paramsData.bglx === '1') {
				// 调用出动查询
				this.getBatchArchiveCdQuery(this.paramsData);
			} else {
				// 调用灾情查询
				this.getBatchArchiveZqQuery(this.paramsData);
			}
		},

		/**
		 * 分页数据
		 */
		getdraftList({page: pageNum, limit: pageSize}){
			this.paramsData.pageNum = pageNum;
			this.paramsData.pageSize = pageSize;
			// 查询数据
			this.queryData();
		},

		/**
		 * 选中列表数据
		 * paramsData.bglx === 1 选中为出动数据
		 * paramsData.bglx === 2 选中为火灾数据
		 */
		handleSelectionChange(val){
			this.isDisabled = val.length == 0;
			this.paramsData.bglx === '1' ? this.cdbh = val : this.zqbh = val;
		},

		/**
		 * 归档操作
		 */
		batchArchive(){
			let text = "";
			if(this.paramsData.bglx === '1')
				text = `确认归档${this.cdbh.length}条出动数据`;
			else
				text = `确认归档${this.zqbh.length}条火灾数据`;
			this.$confirm( text, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(async () => {
				this.allLoading = true;
				// 组合传输数据
				let data = this.paramsData;
				data.cdbhList = this.cdbh;
				data.zqbhList = this.zqbh;
				const arr = await	batchArchive(data);
				if(arr.code == 200){
					this.$message({
						type: 'success',
						message: '归档成功!'
					});
					// 成功之后重置以选择的数据列表
					this.cleanList();
					this.paramsData.pageNum = 1;
					this.paramsData.pageSize = 10;
					// 调用查询接口，重新加载
					this.queryData();
				}
				this.allLoading = false;
			}).catch(() => {
			});
		},

		/**
		 * 出动查询接口
		 */
		async getBatchArchiveCdQuery(paramsData){
			const res = await batchArchiveCdQuery(paramsData);
			if(res.code === 200){
				this.total = res.data.table.total || 0;
				this.cdListData = res.data.table.rows || [];
			}
			this.listLoading = false;
		},

		/**
		 * 灾情查询接口
		 */
		async getBatchArchiveZqQuery(paramsData){
			const res = await batchArchiveZqQuery(paramsData);
			if(res.code === 200){
				this.total = res.data.table.total || 0;
				this.zqListData = res.data.table.rows || [];
			}
			this.listLoading = false;
		},

		/**
		 * 重置已选择的数据列表
		 * >清空选择列表
		 * >将按钮变成不可点击
		 * >清空列表已选择的数据
		 */
		cleanList(){
			this.cdbh = this.zqbh = [];
			this.isDisabled = true;
			this.$refs.multipleTable.clearSelection();
		},
		/**
		 * 获取字典表信息
		 * >报告类型
		 * >归档方式
		 * >年度选择
		 */
		async getDictsData(){
			const reportType = await this.getDicts("archive_report_type");
			const archiveMethod = await this.getDicts("archive_method");
			const yearList = await this.getDicts("archive_year");
			if(reportType.code === 200) this.reportTypeOptions = reportType.data;
			if(archiveMethod.code === 200) this.archiveMethodOptions = archiveMethod.data;
			if(yearList.code === 200) this.yearListOptions = yearList.data;
		},

		/**
		 * 获取本年月份
		 */
		getMonthList(){
			const month = new Date().getMonth();
			// let nums = 12;
			// if(month != 0) nums = month;
			for (let index = 1; index <= month; index++) {
				this.monthListOptions.push({
					label : index + "月",
					value : index
				})
			}
		}
	}
}
</script>
<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
.bulkArchive{
	h3{
		padding-left: 10px;
		margin-bottom: 15px;
		border-left: 5px solid $menuActiveText;
	}
	.bulkArchive-title{
		height: 45px;
		line-height: 45px;
		margin-bottom: 20px;
		h2{
			font-weight: 400;
			color: #393c41;
			font-size: 18px;
			background-image: url("../image/icon-archive.png");
			background-repeat: no-repeat;
			background-position: 0 50%;
			background-size: 23px;
			padding-left: 30px;
			border-bottom: 1px solid #dae2ed;
		}
	}
	.bulkArchive-text{
		display: flex;
		height: 30px;
		line-height: 30px;
		margin-bottom: 10px;
		&>:first-child{
			font-size:16px;
			font-weight:500;
			color:rgba(66,69,74,1);
		}
		&>:nth-child(2){
			font-size:14px;
			font-weight:400;
			color:#777777;
			margin-right: auto;
			.number{
				font-weight:500;
				color:#F77006;
			}
		}
	}
	.bulkArchive-form{
		margin-bottom: 25px;
		.el-button{
			margin-left: 30px;
		}
	}
}
</style>
