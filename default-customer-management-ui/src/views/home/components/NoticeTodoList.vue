<style lang="scss" scoped>
    .notice-todo-list {
        .data-list {
            height: 360px;
            overflow-y: auto;
            padding: 0 5px;
            line-height: 100;
            &.pagination {
                height: 327px;
            }
            .list_group{
                padding: 0px;
            }
            .list_item{
                padding: 0px !important;
            }
        }

        .sorter{
                margin-top: 20px;
        }
        > > > .el-tabs__header {
            margin: 0;
        }
        .pageInfo {
            margin: 10px 0 0 0;
            text-align: center;
        }
    }
</style>

<template lang="pug">
    //- 首页通用通知公告和待办事项组件
    .notice-todo-list(v-loading="noticeListDataLoading && todoListDataLoading && remindListDataLoading")
        el-tabs(v-model="activeName" type="card")
            el-tab-pane(name="通知公告")
                span(slot="label")
                    el-badge(:value="noticeRedNum" :hidden="noticeCountShow") 通知公告
                .data-list.pagination(v-if="noticeCount")
                    ul.list_group
                        li.list_item.list_item_cursor(v-for="(item,index) in noticeListData" :key="index" @click="noticeDataClickHandle(item,index)" title="点击查看详情")
                            .list_title {{ item.noticeTitle }}
                                span.tag_dot(v-if="item.isRecode == '0'") 未读
                            .list_detail
                                //-  :title="item.noticeText"
                                span.overFlow(v-html="item.noticeContent") {{ item.noticeContent }}
                                span {{ item.createTime }}
                .data-none(v-else) 暂无数据
                .sorter
                    el-pagination(layout="prev, pager, next" :total="noticeCount" :page-size="noticeListParams.pageSize" @current-change="handleCurrentChange")
                .pageInfo
                    //- el-pagination(v-show="noticeCount > 0" :total="noticeCount" :page-size="noticeListParams.pageSize" layout="prev, pager, next" @current-change="handleCurrentChange")
            el-tab-pane(name="待办事项")
                span(slot="label")
                    el-badge(:value="todoCount" :hidden="todoCountShow") 待办事项
                .data-list(v-if="todoCount")
                    ul.list_group(v-for="(value, name, index) in todoListData" :key="name")
                        li.list_item.list_item_link(v-if="value" @click="jumpDetails(name)")
                            .list_title 您有 #[span.color-main-red {{ value }}] 条 {{ name }}
                .data-none(v-else) 暂无数据
            el-tab-pane(name="提醒事项" v-if="deptLevel == 3 || deptLevel == 4 || deptLevel == 5")
                span(slot="label")
                    el-badge(:value="remindCount" :hidden="remindCountShow") 提醒事项
                .data-list(v-if="remindCount")
                    ul.list_group(v-for="(value, name, index) in remindListData" :key="name")
                        li.list_item.list_item_link(v-if="value" @click="jumpDetails(name)")
                            .list_title 您有 #[span.color-main-red {{ value }}] 条 {{ name }}
                            //- .list_title(v-if="name === '辖区出动填报'") 您辖区共有 #[span.color-main-red {{ value }}] 条已填报的出动报告未审批通过，请知悉
                            //- .list_title(v-else-if="name === '辖区火灾填报'") 您辖区共有 #[span.color-main-red {{ value }}] 条已填报的火灾报告未审批通过，请知悉
                            //- .list_title(v-else-if="name === '辖区警情派发'") 您辖区共有 #[span.color-main-red {{ value }}] 条 已派发的警情未完成，请知悉
                .data-none(v-else) 暂无数据
            view-announcement(v-if="selectNoticeData.noticeId" @close-view-announcement="resetSelectNoticeData" :dialog-data="selectNoticeData")
</template>

<script>
    import {mapGetters} from "vuex";
    import {commonHome} from "@/api/index";
    // 查看公告详情的组件
    import ViewAnnouncement from "./ViewAnnouncement";

    export default {
        name: "noticeTodoList",
        components: {ViewAnnouncement},
        computed: {
            ...mapGetters(["deptLevel"])
        },
        data() {
            return {
                // 标题
                activeName: "通知公告",
                // 通知公告列表 数据
                noticeCount: 0,
                noticeListData: [],
                noticeListDataLoading: false,
                //红点数
                noticeRedNum: 0,
                //通知公告分页
                noticeListParams: {
                    pageNum: 1,
                    pageSize: 4
                },
                noticeCountShow: true,
                // 点击的单条公告
                selectNoticeData: {},

                // 待办事项列表 数据
                todoCount: 0,
                todoListData: {},
                todoListDataLoading: false,
                todoCountShow: true,

                // 提醒事项列表（需要手动从 queryWork 方法中拆分出 辖区出动填报、辖区警情派发 和 辖区火灾填报 数据）
                remindCount: 0,
                remindListData: {},
                remindListDataLoading: false,
                remindCountShow: true
            };
        },
        created() {
            const me = this;
            me.getHomeNoticeList();
            me.queryWork();
            me.xqQueryWork();
        },
        methods: {

            handleCurrentChange(val){//点击翻页
                // console.log(`当前页: ${val}`);
                const me = this;
                me.noticeListDataLoading = true;

                commonHome
                    .getHomeNoticeList({
                        pageNum: val,
                        pageSize: 4
                    })
                    .then(res => {
                        let {code, data} = res;
                        if (code === 200) {
                            me.noticeCount = data.totalNum;
                            me.noticeRedNum = data.remainder;
                            me.noticeListData = data.homeNoticeList;
                            if (me.noticeRedNum > 0) {
                                me.noticeCountShow = false;
                            } else {
                                me.noticeCountShow = true;
                            }
                        }
                    })
                    .finally(() => {
                        me.noticeListDataLoading = false;
                    });
            },
            /**
             * 获取 通知公告列表 数据
             */
            getHomeNoticeList() {
                const me = this;
                me.noticeListDataLoading = true;

                commonHome
                    .getHomeNoticeList(this.noticeListParams)
                    .then(res => {
                        let {code, data} = res;
                        if (code === 200) {
                            me.noticeCount = data.totalNum;
                            me.noticeRedNum = data.remainder;
                            me.noticeListData = data.homeNoticeList;
                            if (me.noticeRedNum > 0) {
                                me.noticeCountShow = false;
                            } else {
                                me.noticeCountShow = true;
                            }
                        }
                    })
                    .finally(() => {
                        me.noticeListDataLoading = false;
                    });
            },
            /**
             * 获取 待办事项列表 数据
             */
            queryWork() {
                const me = this;
                me.todoListDataLoading = true;

                commonHome
                    .queryWork()
                    .then(res => {
                        let {code, data} = res;
                        if (code === 200 && JSON.stringify(data) !== "{}") {
                            for (let key in data) {
                                me.todoListData[key] = data[key];
                                me.todoCount += data[key];
                            }
                            if (me.todoCount > 0) {
                                me.todoCountShow = false;
                            }
                        }
                    })
                    .finally(() => {
                        me.todoListDataLoading = false;
                    });
            },
            /**
             * 获取 提醒事项列表 数据
             */
            xqQueryWork() {
                const me = this;
                me.remindListDataLoading = true;

                commonHome
                    .xqQueryWork()
                    .then(res => {
                        let {code, data} = res;
                        if (code === 200 && JSON.stringify(data) !== "{}") {
                            for (let key in data) {
                                // 暂时去掉这两个提醒事项，加上辖区火灾待填报
                                if (key === "辖区警情派发") continue;
                                me.remindListData[key] = data[key];
                                me.remindCount += data[key];
                            }
                            if (me.remindCount > 0) {
                                me.remindCountShow = false;
                            }
                        }
                    })
                    .finally(() => {
                        me.remindListDataLoading = false;
                    });
            },

            /**
             * 待办事项列表 跳转回调
             * name
             *  出动待填报
             *  火灾待填报
             *  出动待审核
             *  火灾待审核
             *    辖区出动填报
             *    辖区警情派发
             *    辖区火灾填报
             *    出动报告被终止
             *    出动报告被退回
             *    火灾报告待完善
             *    火灾报告被终止
             *    火灾报告被退回
             *    检查任务待处理
             */
            jumpDetails(name) {
                const me = this;
                const routersDictionary = {
                    出动待填报: "dispatchedreport",
                    火灾待填报: "firereporting",
                    出动待审核: "dispatchaudit",
                    火灾待审核: "fireauditing",
                    出动报告被终止: "recorded",
                    出动报告被退回: "recorded",
                    火灾报告待完善: "recordedfire",
                    火灾报告被终止: "recordedfire",
                    火灾报告被退回: "recordedfire",
                    辖区出动待填报: "districtdispatched",
                    辖区出动待修改: "districtdispatched",
                    辖区出动待审核: "districtdispatched",
                    辖区出动待完善: "districtdispatched",
                    辖区出动被退回: "districtdispatched",
                    辖区出动被驳回: "districtdispatched",
                    辖区火灾待填报: "areafire",
                    辖区火灾待修改: "areafire",
                    辖区火灾待审核: "areafire",
                    辖区火灾待完善: "areafire",
                    辖区火灾被退回: "areafire",
                    辖区火灾被驳回: "areafire",
                    辖区警情派发: "districtpolicesituation",
                    辖区警情未完成: "districtpolicesituation"
                };
                const statusDictionary = {
                    待填报: "0",
                    待修改: "-1",
                    待审核: "1",
                    待完善: "-3",
                    被退回: "-2",
                    未完成: "-4",
                    被终止: "-1",
                    被驳回: "4"
                };
                let query = {
                    shzt: undefined
                };
                for (const key in statusDictionary) {
                    if (name.match(key)) {
                        query.shzt = statusDictionary[key];
                    }
                }
                me.$router.push({
                    name: routersDictionary[name],
                    query: query.shzt ? query : {}
                });

                // switch (name) {
                //   case "出动待填报":
                //     me.$router.push({
                //       path: "/data/entry/cdxxtb"
                //     });
                //     break;
                //   case "火灾待填报":
                //     me.$router.push({
                //       path: "/data/entry/zqxxtb"
                //     });
                //     break;
                //   case "出动待审核":
                //     me.$router.push({
                //       path: "/data/aduit/cdxx"
                //     });
                //     break;
                //   case "火灾待审核":
                //     me.$router.push({
                //       path: "/data/aduit/zqxx"
                //     });
                //     break;
                //   case "辖区出动填报":
                //     me.$router.push({
                //       path: "/data/entry/xqcdxx",
                //       query: {
                //         pageFlag: "1"
                //       }
                //     });
                //     break;
                //   case "辖区警情派发":
                //     me.$router.push({
                //       path: "/data/entry/xqjqxx",
                //       query: {
                //         pageFlag: "1"
                //       }
                //     });
                //     break;
                //   case "辖区火灾填报":
                //     me.$router.push({
                //       path: "/data/entry/xqzqxx",
                //       query: {
                //         pageFlag: "1"
                //       }
                //     });
                //     break;
                //   case "出动报告被终止":
                //   case "出动报告被退回":
                //     me.$router.push({
                //       path: "/data/entry/lscdxx"
                //     });
                //     break;
                //   case "火灾报告待完善":
                //   case "火灾报告被终止":
                //   case "火灾报告被退回":
                //     me.$router.push({
                //       path: "/data/entry/lszqxx"
                //     });
                //     break;
                //   // TODO: 路由地址待后端人员提供
                //   // case "检查任务待处理":
                //   //   me.$router.push({
                //   //     path: "/check/deal"
                //   //   });
                //   //   break;

                //   default:
                //     break;
                // }
            },
            /**
             * 公告列表单条公告点击回调，查看详情
             */
            noticeDataClickHandle(data, index) {
                this.selectNoticeData = data;
                if (data.isRecode == "0") {
                    commonHome
                        .getRecordSysNoticeStatus({"noticeId": data.noticeId}).then(res => {
                        if (res.code === 200) {
                            this.noticeListData[index].isRecode = "1";
                            this.noticeRedNum = res.data.remainder;
                            if (this.noticeRedNum > 0) {
                                this.noticeCountShow = false;
                            } else {
                                this.noticeCountShow = true;
                            }
                        }
                    })
                }
            },
            /**
             * 重置公告列表选中的数据
             */
            resetSelectNoticeData() {
                this.selectNoticeData = {};
            },
            //翻页
            handleCurrentChange(val) {
                this.noticeListParams.pageNum = val;
                this.getHomeNoticeList();
            }
        }
    };
</script>
