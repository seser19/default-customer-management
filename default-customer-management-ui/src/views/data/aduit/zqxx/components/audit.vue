<template>
	<!-- 审核部分 -->
	<div class="audit_zone" v-loading="timeLineLoading">
		<div class="audit_top">
			<div>
				<img src="../../image/person.png" />
				<span>
					创建人：
					<b>{{deptname || '-'}}</b>
				</span>
			</div>
			<div>
				<img src="../../image/time.png" />
				<span>
					创建时间：
					<b>{{tbsj || '-'}}</b>
				</span>
			</div>
		</div>

		<div class="timeline_zone">
			<el-timeline>
				<el-timeline-item
					v-for="(item, index) in timeline"
					:key="index"
					placement="top"
					:icon="item.icon"
					type="primary"
					color="#FB5938"
					size="large"
					:timestamp="item.endTime"
					:class="item.operation=='待审核'?'noActive':(item.operation=='审核中'?'nowActive':'')"
				>
					<el-card>
						<h4>{{item.taskName}}</h4>
						<!-- v-if="index== 0" -->
						<!-- if taskName 包含‘填写’字段说明该条时填写时或者被终止再次发起的
						火灾数据，这时显示填报人不显示审核人 -->
						<ul v-if="item.taskName.includes('填写')">
							<li style="float:left;">
								<label>填报人：</label>
								<span>{{item.approveUserName}}</span>
							</li>
						</ul>
						<ul v-else>
							<li style="float:left;">
								<label>审核人：</label>
								<span>{{item.approveUserName}}</span>
							</li>
							<li v-if="item.operation" style="float:left;">
								<label>操作：</label>
								<span>{{item.operation}}</span>
							</li>
							<li v-if="item.advice" style="clear:both">
								<label>审核意见：</label>
								<span>{{item.advice}}</span>
							</li>
						</ul>
					</el-card>
				</el-timeline-item>
			</el-timeline>
		</div>

		<el-row v-if="isNotEdit" style="margin-top:15px;">
			<el-col :span="2">
				<label>审核意见：</label>
			</el-col>
			<el-col :span="22">
				<el-input type="textarea" placeholder="请输入审核意见" v-model="comment" @change="emitData" resize="none"></el-input>
			</el-col>
			<el-col :span="22" :offset="2">
				<el-radio-group v-model="radio" @change="emitData">
					<el-row>
						<el-col :span="22">
							<el-radio label="0">核查通过</el-radio>
						</el-col>
						<el-col :span="22">
							<el-radio label="1">退回</el-radio>
						</el-col>
						<el-col :span="22">
							<el-radio label="2">终止</el-radio>
						</el-col>
					</el-row>
				</el-radio-group>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import axios from "axios";
import { formatDate } from "@/utils/index.js";
import {
	getRecord,
	getTask,
	processPreview,
	findTask,
	getCreateDeptAndDate
} from "@/api/data/aduit/zqxx";

export default {
	name: "audit",
	components: {},
	props: ["propfrom"],
	data() {
		return {
			timeLineLoading:false,
			tbsj: "",
			deptname: "",
			// 审核意见
			comment: "",
			radio: "0",
			timeline: [],
			// 终止
			isEnd: false,
			// true：核查通过；false：退回；
			flag: true,
			isNotEdit: false,
		};
	},
	watch:{},
	created() {
		this.getAuditInfo();
		this.propfrom.type == '3'?this.isNotEdit = false: this.isNotEdit = !this.propfrom.isNotEdit;
	},
	methods: {
		emitData() {
			this.radio == 2 ? (this.isEnd = true) : (this.isEnd = false);
			this.radio == 0 ? (this.flag = true) : (this.flag = false);
			this.$emit("auditData", {
				comment: this.comment,
				isEnd: this.isEnd,
				flag: this.flag
			});
		},
		/**
		 * 获取数据
		 */
		getAuditInfo() {
			this.timeLineLoading = true;
			// 火灾和出动分开
			if (this.propfrom.cdbh) {
				// 出动
				let id = "respond." + this.propfrom.cdbh;
				axios
					.all([
						getRecord({
							businessEventId: id
						}),
						processPreview({
							businessEventId: id
						}),
						findTask({
							businessKey: id
						})
					])
					.then(
						axios.spread((res1, res2, res3) => {
							let arr = res1.data,   // 存储审核的节点
									arr2 = res2.data,  // 存储总流程节点
									arr3 = res3.data;  // 存储当前审核的节点

							arr.forEach(item => {
								// 添加退回和审核终止的状态图标
								if (item.operation==="退回") {
										item.icon = "el-icon-back";
									}else if (item.operation==="审核终止") {
										item.icon = "el-icon-close";
									} else {
										item.icon = "el-icon-check";
									}
								// item.icon = "el-icon-check";
							});
							if (res2.code == 200) {
								arr2.forEach(item => {
									item.endTime = "待处理";
								});
							}
							/**
							 * 判断是否有数据
							 * 如果为 null 说明全部节点已审核完毕
							 * 则将数组重置为空
							 */
							if (res3.code == 200 && res3.data.approveUserName != null){
								arr3.endTime = "当前处理"
							}else{
								arr3 = [];
							}
							this.tbsj = arr[0] && arr[0].endTime;
							this.deptname = arr[0] && arr[0].approveUserName;

							// let c = arr.concat(arr3).concat(arr2)
              let c = arr.concat(arr3);
							this.timeline = c ;
							this.timeLineLoading = false;
							// this.timeline = arr;
						})
					)
					.finally(()=>{this.timeLineLoading = false;})
			} else {
				// 火灾
				let id = "disaster." + this.propfrom.zqbh;
				axios
					.all([
						getRecord({
							businessEventId: id
						}),
						processPreview({
							businessEventId: id
						}),
						getCreateDeptAndDate({ zqbh: this.propfrom.zqbh }),
						findTask({
							businessKey: id
						})
					])
					.then(
						axios.spread((res1, res2, res3, res4) => {
							let arr = [],   // 存储审核的节点
									arr2 = [],  // 存储总流程节点
									arr3 = res4.data;  // 存储当前审核的节点
							if (res3.code == 200) {
								this.tbsj = res3.data.tbsj;
								this.deptname = res3.data.deptname;
							}
							if (res1.code == 200) {
								res1.data.forEach(item => {
									// 添加退回和审核终止的状态图标
									if (item.operation==="退回") {
										item.icon = "el-icon-back";
									}else if (item.operation==="审核终止") {
										item.icon = "el-icon-close";
									} else {
										item.icon = "el-icon-check";
									}
								});
								arr = res1.data;
							}
							if (res2.code == 200) {
								res2.data.forEach(item => {
									item.endTime = "待处理";
								});
								arr2 = res2.data;
							}
							/**
							 * 判断是否有数据
							 * 如果为 null 说明全部节点已审核完毕
							 * 则将数组重置为空
							 */
							if (res4.code == 200 && res4.data.approveUserName != null){
								arr3.endTime = "当前处理"
							}else{
								arr3 = [];
							}
							// let c = arr.concat(arr3).concat(arr2);
              let c = arr.concat(arr3);
							this.timeline = c ;
							this.timeLineLoading = false;
						})
					)
					.finally(()=>{this.timeLineLoading = false;})
			}
		}
	}
};
</script>
<style lang='stylus' scoped>
// @import url(); 引入公共css类
.audit_zone
	background #fff
	margin 0 21px 12px 23px
	.audit_top
		display flex
		align-items center
		justify-content space-around
		height 62px
		line-height 60px
		background rgba(244, 246, 248, 1)
		border-radius 3px
		border 1px solid rgba(196, 205, 213, 0.22)
		margin-bottom 20px
		div
			display flex
			align-items center
			height 60px
			img
				width 40px
				height 40px
				margin-right 10px
	.timeline_zone
		padding-left: 130px;
		ul
			li
				min-width:300px;

	h4
		color #FB5938
	ul, li
		list-style none
		line-height 30px
	label
		display inline-block
		text-align right
		font-size 14px
		color rgba(55, 57, 76, 1)
	span
		color #939EAB
	.el-radio
		text-align left
		margin 10px 0
.audit_zone >>> .el-timeline-item__tail
	border-left 2px solid #FB5938
.audit_zone >>> .el-timeline-item__timestamp
	margin-left -165px
.audit_zone >>> .el-timeline-item
	padding-bottom: 10px;
	.el-card__body
		padding: 0px 20px;
	.el-timeline-item__content
		margin-top: -23px;
</style>
<style lang="stylus">
.audit_zone
	.noActive
		.el-timeline-item__tail
			border-left:2px solid #dfe4ed;
		.el-timeline-item__node
			background-color: #dfe4ed !important;
		h4
			color: #999;
	.nowActive
		.el-timeline-item__tail
			border-left:2px solid #dfe4ed;
</style>
