<template lang="pug">
//- 首页通用查看公告组件
.view-announcement
	el-dialog(:title="dialogData.noticeTitle" :visible.sync="dialogVisible" @close="closeHandle")
		//- 内容
		.dialog-content
			//- 文本
			.dialog-text(v-html="dialogData.noticeContent")
				
			//- 附件
			.dialog-file(v-if="dialogData.accessoryName")
				.file-text(title="点击可下载" @click="fileDownload(dialogData.accessoryPath,dialogData.accessoryName)") {{ dialogData.accessoryName }}
		span(slot="footer" class="dialog-footer")
			el-button(type="primary" @click="closeHandle") 确 定
</template>

<script>
import { fileDownload } from "@/utils/fileDownload";

export default {
	name: "ViewAnnouncement",
	props: ["dialogData"],
	data() {
		return {
			dialogVisible: true
		};
	},
	methods: {
		closeHandle() {
			this.$emit("close-view-announcement");
		},
		fileDownload(url, name) {
			url = `${process.env.VUE_APP_FTP_API + url}`;
			fileDownload(url, name);
		}
	}
};
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/mixin.styl'
.dialog-text
	height 260px
	max-height 260px
	overflow-y auto
.dialog-file
	padding 10px 0
	.file-text
		cursor pointer
		&:hover
			color $default-blue-color
		&:before
			content '附件：'
</style>