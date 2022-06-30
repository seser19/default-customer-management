<style lang="stylus">
    @import '~@/assets/styles/mixin.styl'
    .summary-data
        .summary-des
            display flex
            justify-content space-around
            .des-item
                flex 1
                padding 0 5%
                .des-count
                    font-size 14px
                    margin 0 0 20px 0
                    span
                        font-size 18px
                        font-weight bold
                        position relative
                        top 1px
                .des-pro
                    .pro-title
                        font-size 12px
                        margin 0 0 3px 0
                    .el-progress
                        width 85%
                        font-size 0
                        .el-progress-bar
                            padding 0
                        .el-progress__text
                            position absolute
                            top 0
                            left 0
                            width 100%
                            height 100%
                            margin 0 0 0 2px
                            display flex
                            align-items center
                            justify-content center
                            font-size 12px !important

    .list-detail-data
        overflow hidden
        .el-collapse
            max-height 360px
            overflow-y auto
            .el-collapse-item__content
                padding-bottom 5px
            .list-item, .content-item
                width 100%
                display flex
                align-items center
                .item-name
                    max-width 25%
                    color $dark-font-color
                    flex-grow 1
                    textoneline()
                .item-pro
                    padding 0 15px
                    flex-grow 1
                    .el-progress
                        position relative
                        .el-progress-bar
                            padding 0
                        .el-progress__text
                            position absolute
                            top 0
                            left 0
                            width 100%
                            height 100%
                            font-size 12px !important
                            color #333333
                            display flex
                            align-items center
                            justify-content center
                            margin 0 0 0 2px
                .item-text
                    width 290px
                    color $dark-font-color
                    font-size 12px
                    flex-shrink 0
                    text-align right
            .list-item
                .item-name
                    color $light-font-color
                .item-pro
                    width 190px
            .content-item
                padding 0 0 10px 10px
                .item-des
                    flex-grow 1
                    .des-item
                        display flex
                        align-items center
                        .item-pro
                            width 180px
                [class*='data-none'], [class^='data-none']
                    line-height 20px
                    font-size 14px

    @media only screen and (max-width: 768px)
        .list-detail-data
            .item-name
                font-size 12px !important
            .item-pro
                display none
            .item-text
                font-size 10px !important
</style>

<template>
    <div class="indexPage">
        <!-- 顶部 -->
        <div class="top">
            <div>
                <el-radio-group v-model="dateData" @change="getPageData()">
                    <el-radio-button v-for="item in dateListData" :label="item" :key="item.value">{{ item.name }}</el-radio-button>
                </el-radio-group>
            </div>
            <div class="etlTime">
                <span>数据更新至</span>
                <span class="time">{{etlTime || '-'}}</span>
            </div>
        </div>
        <!-- 重要指标 -->
        <el-row class="content section panel_group" v-loading="warningListDataLoading">
            <el-col class="panel_item" v-for="item in warningListData" :key="item.title" :xs="24" :sm="12" :lg="4" :span="4">
                <div class="label">
                    <img :src="item.img" />
                    <h5>{{ item.title }}</h5>
                </div>
                <div class="statistic-num">
                    <b>{{ item.num || 0 }}</b>
                    <span class="unit">{{ item.unit }}</span>
                </div>
                <div class="trend" :class="item.percent > 0 ? 'up' : 'down'">
                    <i :class="{'el-icon-top': item.percent > 0, 'el-icon-bottom': item.percent < 0}"></i>
                    <b>{{ Math.abs(item.percent || 0) }}</b><span>% {{ isTb }}</span>
                </div>
            </el-col>
        </el-row>
        <!-- 支队汇总&通知待办 -->
        <el-row class="content" :gutter="20">
            <el-col :xs="24" :sm="24" :lg="14" :span="14" v-loading="summaryDataLoading">
                <div class="section">
                    <div class="section_title">
                        <el-radio-group v-model="switchData">
                            <el-radio-button v-for="item in switchListData" :label="item" :key="item">{{ item }}</el-radio-button>
                        </el-radio-group>
                    </div>
                    <div class="pies_zone">
                        <div class="summary-data" v-show="switchData === '支队汇总'" v-loading="summaryDataLoading">
                            <div class="summary-chart">
                                <v-chart v-if="chartsOption.pies.series[0].data.length" :options="chartsOption.pies" autoresize />
                                <div class="data-none" v-else>暂无数据</div>
                            </div>
                            <div class="summary-des">
                                <div class="des-item">
                                    <div class="des-count">辖区出动报告总数<span class="color-main-red"> {{ summaryData.cdbgzs }}</span></div>
                                    <div class="des-pro">
                                        <div class="pro-title color-gray">辖区出动完成度</div>
                                        <el-progress :text-inside="false" :stroke-width="14" :percentage="summaryData.cdtbwcd" color="#b5e9f1" />
                                    </div>
                                </div>
                                <div class="des-item">
                                    <div class="des-count">辖区火灾报告总数<span class="color-main-red"> {{ summaryData.hzbgzs }}</span></div>
                                    <div class="des-pro">
                                        <div class="pro-title color-gray">辖区火灾完成度</div>
                                        <el-progress :text-inside="false" :stroke-width="14" :percentage="summaryData.hztbwcd" color="#fbd7bb" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="list-detail-data" v-show="switchData === '清单明细'" v-loading="listDetailDataLoading">
                            <el-collapse v-model="listDetailActiveName" accordion @change="listDetailNameChangeHandle" v-if="listDetailData.length">
                                <el-collapse-item v-for="(item,index) in listDetailData" :key="index" :name="item.deptId">
                                    <template slot="title">
                                        <div class="list-item">
                                            <div class="item-name" :title="item.deptName">{{ item.deptName }}</div>
                                            <div class="item-pro">
                                                <el-progress :text-inside="false" :stroke-width="14" :percentage="item.hztbwcd" color="#bdd7fd" />
                                            </div>
                                            <div class="item-text">已填报<span class="color-blue"> {{ item.hzytb }} </span>条火灾报告，还有<span class="color-main-red"> {{ item.hzdtb }} </span>条火灾待填报。</div>
                                        </div>
                                    </template>
                                    <div class="collapse-content" v-loading="lowListDetailDataLoading" v-if="lowListDetailData.length">
                                        <div class="content-list" v-for="(lowItem,index) in lowListDetailData" :key="index">
                                            <div class="content-item">
                                                <div class="item-name" :title="lowItem.deptName">{{ lowItem.deptName }}</div>
                                                <div class="item-des">
                                                    <div class="des-item">
                                                        <div class="item-pro">
                                                            <el-progress :text-inside="false" :stroke-width="14" :percentage="lowItem.cdtbwcd" color="#b5e9f1" />
                                                        </div>
                                                        <div class="item-text">已填报<span class="color-blue"> {{ lowItem.cdytb }} </span>条出动报告，还有<span class="color-main-red"> {{ lowItem.cddtb }} </span>条出动待填报。</div>
                                                    </div>
                                                    <div class="des-item">
                                                        <div class="item-pro">
                                                            <el-progress :text-inside="false" :stroke-width="14" :percentage="lowItem.hztbwcd" color="#fbd7bb" />
                                                        </div>
                                                        <div class="item-text">已填报<span class="color-blue"> {{ lowItem.hzytb }} </span>条火灾报告，还有<span class="color-main-red"> {{ lowItem.hzdtb }} </span>条火灾待填报。</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </el-collapse-item>
                            </el-collapse>
                            <div class="data-none" v-else>暂无数据</div>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :lg="10" :span="10">
                <div class="section">
                    <notice-todo-list />
                </div>
            </el-col>
        </el-row>
        <!-- 指标柱状图&类型饼状图 -->
        <el-row class="content" :gutter="20">
            <el-col :xs="24" :sm="24" :lg="14" :span="14">
                <el-row class="section section_spe">
                    <div class="section_title">
                        <div class="chart_title">主要统计指标</div>
                        <el-radio-group v-model="targetData" @change="targetDataChange">
                            <el-radio-button v-for="item in targetListData" :label="item" :key="item">{{ item }}</el-radio-button>
                        </el-radio-group>
                    </div>
                    <div class="line_zone" v-loading="lineListDataLoading">
                        <v-chart v-if="chartsOption.line.xAxis.data.length" :options="chartsOption.line" autoresize />
                        <div class="data-none" v-else>暂无数据</div>
                    </div>
                    <div class="txt_zone" v-loading="barTextDataLoading" v-if="barTextData.deptName">
                        <span>今{{ dateData.name }}以来{{ userAreaName }}共接报警情</span>
                        <span class="orange">{{ barTextData.zqsCnt }}</span>
                        <span>起，{{ isTb }}{{ barTextData.tbZqsValue < 0 ? '下降' : '上升' }}</span>
                        <span class="orange">{{ barTextData.tbZqsValue && Math.abs(barTextData.tbZqsValue) }}%</span>
                        <span>；火灾</span>
                        <span class="orange">{{ barTextData.hzqsCnt }}</span>
                        <span>起，{{ isTb }}{{ barTextData.tbHzqsValue < 0 ? '下降' : '上升' }}</span>
                        <span class="orange">{{ barTextData.tbHzqsValue && Math.abs(barTextData.tbHzqsValue) }}%</span>
                        <span>；死亡</span>
                        <span class="orange">{{ barTextData.swrsCnt }}</span>
                        <span>人，{{ isTb }}{{ barTextData.tbSwrsValue < 0 ? '下降' : '上升' }}</span>
                        <span class="orange">{{ barTextData.tbSwrsValue && Math.abs(barTextData.tbSwrsValue) }}%</span>
                        <span>；受伤</span>
                        <span class="orange">{{ barTextData.ssrsCnt }}</span>
                        <span>人，{{ isTb }}{{ barTextData.tbSsrsValue < 0 ? '下降' : '上升' }}</span>
                        <span class="orange">{{ barTextData.tbSsrsValue && Math.abs(barTextData.tbSsrsValue) }}%</span>
                        <span>；直接经济损失</span>
                        <span class="orange">{{ barTextData.zjssFee && (barTextData.zjssFee / 10000).toFixed(1) }}</span>
                        <span>万元，{{ isTb }}{{ barTextData.tbZjssValue < 0 ? '下降' : '上升' }}</span>
                        <span class="orange">{{ barTextData.tbZjssValue && Math.abs(barTextData.tbZjssValue) }}%</span>
                        <span>；其中较大火灾</span>
                        <span class="orange">{{ barTextData.jdhzCnt }}</span>
                        <span>起，重大火灾</span>
                        <span class="orange">{{ barTextData.zdhzCnt }}</span>
                        <span>起，特大火灾</span>
                        <span class="orange">{{ barTextData.tdhzCnt }}</span>
                        <span>起</span>
                    </div>
                </el-row>
            </el-col>
            <el-col :xs="24" :sm="24" :lg="10" :span="10">
                <el-row class="section section_spe">
                    <div class="section_title">
                        <div class="chart_title">警情类型</div>
                        <el-radio-group v-model="typeData" @change="typeDataChange">
                            <el-radio-button v-for="item in typeListData" :label="item" :key="item.value">{{ item.name }}</el-radio-button>
                        </el-radio-group>
                    </div>
                    <div class="pie_zone" v-loading="pieListDataLoading">
                        <v-chart v-if="chartsOption.pie.series[0].data.length" :options="chartsOption.pie" autoresize />
                        <div class="data-none" v-else>暂无数据</div>
                    </div>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    // 基于 el-cascader 组件，自定义一个区域结构树组件
    import AreaTree from "@/components/AreaTree";
    // 通知公告和待办事项组件
    import NoticeTodoList from "./NoticeTodoList";
    // api
    import {detachmentHome, commonHome} from "@/api/index";
    // 省市字典
    import {
        getProvincesMap,
        getCityMap,
        getMapJSONData
    } from "@/utils/mapDictionary";

    export default {
        name: "detachmentHome",
        components: {
            AreaTree,
            NoticeTodoList
        },
      computed:{
        isTb(){
          return this.dateData.value==='Y'?'同比':'环比'
        }
      },
        data() {
            return {
                // 所属地区
                userAreaName: this.$store.getters.areaName,
                // 更新时间
                etlTime: "",
                // 页面通用的接口入参
                pagePostData: {
                    cyc: "Y",
                    deptId: null,
                    // 指标ID（10001：警情；10002：火灾扑救；10003：抢险救援）pagePostData.cyc + 后面的编号
                    kpiId: "10001"
                },
                // 页面使用的图表配置
                chartsOption: {
                    pies: {
                        backgroundColor: "#fff",
                        tooltip: {
                            trigger: "item",
                            formatter: "{a}<br>{b} : {c} ({d}%)"
                        },
                        series: [{
                            name: "辖区出动报告",
                            type: "pie",
                            radius: "60%",
                            center: ["25%", "50%"],
                            color: ["#00D5E6", "#26A9FF"],
                            data: [],
                            roseType: "radius",
                            label: {
                                normal: {
                                    formatter: ["{b|{b}{d}%}", "{c|{c}}"].join("\n"),
                                    rich: {
                                        b: {
                                            color: "#333333",
                                            fontSize: 12,
                                            lineHeight: 16
                                        },
                                        c: {
                                            color: "#01BCD5",
                                            fontSize: 16,
                                            fontWeight: "bold",
                                            lineHeight: 24
                                        }
                                    }
                                }
                            },
                            itemStyle: {
                                borderWidth: "2",
                                borderColor: "white"
                            }
                        }, {
                            name: "辖区火灾报告",
                            type: "pie",
                            radius: "60%",
                            center: ["70%", "50%"],
                            color: ["#00D5E6", "#26A9FF"],
                            data: [],
                            roseType: "radius",
                            label: {
                                normal: {
                                    formatter: ["{b|{b}{d}%}", "{c|{c}}"].join("\n"),
                                    rich: {
                                        b: {
                                            color: "#333333",
                                            fontSize: 12,
                                            lineHeight: 16
                                        },
                                        c: {
                                            color: "#01BCD5",
                                            fontSize: 16,
                                            fontWeight: "bold",
                                            lineHeight: 24
                                        }
                                    }
                                }
                            },
                            itemStyle: {
                                borderWidth: "2",
                                borderColor: "white"
                            }
                        }]
                    },
                    line: {
                        backgroundColor: "#fff",
                        tooltip: {
                            trigger: "axis",
                            axisPointer: {
                                // 坐标轴指示器，坐标轴触发有效
                                type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
                            },
                            formatter: params => {
                                let tooltipContent = params[0].name + '<br>';
                                tooltipContent += params[0].seriesName + '：' + params[0].data + '<br>';
                                if (params.length > 1) {
                                    tooltipContent += params[1].seriesName + '：' + params[1].data + '<br>';
                                    tooltipContent += '同比：' + this.lineListData[this.currentBarData]['同比'][params[0].dataIndex] + '%';
                                }
                                return tooltipContent;
                            }
                        },
                        grid: {
                            left: "2%",
                            right: "3%",
                            bottom: 0,
                            top: "16%",
                            containLabel: true
                        },
                        legend: {
                            data: ["本年", "上年"],
                            top: 12,
                            textStyle: {
                                color: "#333333"
                            },
                            itemWidth: 10,
                            itemHeight: 10
                        },
                        xAxis: {
                            type: "category",
                            data: [],
                            axisLine: {
                                lineStyle: {
                                    color: "#E6E6E6"
                                }
                            },
                            axisLabel: {
                                interval: 0,
                                rotate: 45,
                                textStyle: {
                                    color: "#333333"
                                }
                            },
                            axisTick: {
                                show: false
                            }
                        },
                        yAxis: {
                            type: "value",
                            minInterval: 1,
                            axisLine: {
                                show: false
                            },
                            splitLine: {
                                show: false
                            },
                            axisTick: {
                                show: false
                            },
                            axisLabel: {
                                textStyle: {
                                    color: "#333333"
                                }
                            }
                        },
                        series: [{
                            name: "本年",
                            type: "bar",
                            barWidth: "6px",
                            itemStyle: {
                                normal: {
                                    color: {
                                        type: "linear",
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        colorStops: [{
                                            offset: 0,
                                            color: "#F59A00" // 0% 处的颜色
                                        }, {
                                            offset: 1,
                                            color: "#FE1313" // 100% 处的颜色
                                        }],
                                        global: false // 缺省为 false,
                                    },
                                    barBorderRadius: 3
                                }
                            },
                            data: []
                        }, {
                            name: "上年",
                            type: "bar",
                            barWidth: "6px",
                            barGap: '70%',
                            itemStyle: {
                                normal: {
                                    color: {
                                        type: "linear",
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        colorStops: [{
                                            offset: 0,
                                            color: "#2BA9FF" // 0% 处的颜色
                                        }, {
                                            offset: 1,
                                            color: "#1370FE" // 100% 处的颜色
                                        }],
                                        global: false // 缺省为 false,
                                    },
                                    barBorderRadius: 3
                                }
                            },
                            data: []
                        }]
                    },
                    pie: {
                        color: [
                            "#7613FE",
                            "#1890FF",
                            "#00C2C3",
                            "#7ED321",
                            "#FF801D",
                            "#FFC41D",
                            "#00C41D"
                        ],
                        backgroundColor: "#fff",
                        title: {
                            text: "",
                            subtext: "总数",
                            textAlign: "center",
                            itemGap: 3,
                            textStyle: {
                                color: "#000000",
                                fontSize: 27,
                                fontWeight: "bold"
                            },
                            subtextStyle: {
                                color: "#333333",
                                fontSize: 13
                            },
                            left: '27%',
                            top: "42%"
                        },
                        tooltip: {
                            show: true
                        },
                        series: [{
                            name: "警情",
                            type: "pie",
                            radius: [80, 99],
                            center: ['28%', '47%'],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: []
                        }, {
                            name: "shadow",
                            hoverAnimation: false,
                            type: "pie",
                            radius: [99, 111],
                            center: ['28%', '47%'],
                            avoidLabelOverlap: false,
                            legendHoverLink: false,
                            silent: true,
                            label: {
                                normal: {
                                    show: false,
                                    position: "center"
                                },
                                emphasis: {
                                    show: false
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            itemStyle: {
                                opacity: 0.2
                            },
                            data: []
                        }],
                        legend: {
                            type: 'scroll',
                            orient: "vertical",
                            show: true,
                            left: '59%',
                            right: "3%",
                            top : '7%',
                            bottom: "7%",
                            y: "center",
                            itemWidth: 10,
                            itemHeight: 10,
                            radius: 0,
                            itemGap: 25,
                            pageButtonGap: 30,
                            textStyle: {
                                color: "#333333",
                                fontSize: 13,
                                lineHeight: 20,
                                rich: {
                                    percent: {
                                        color: "#fff",
                                        fontSize: 16
                                    }
                                }
                            },
                            formatter: params => {}
                        }
                    }
                },
                // 时间筛选列表 (D:日指标;M:月指标； Y:年度指标)
                dateListData: [{
                    value: "Y",
                    name: "年"
                }, {
                    value: "M",
                    name: "月"
                }, {
                    value: "D",
                    name: "日"
                }],
                dateData: {
                    value: "Y",
                    name: "年"
                },
                // 顶部 重点指标列表
                warningListData: [{
                    title: "总警情数",
                    img: require("@/assets/image/index/icon_zjqs.svg"),
                    num: "",
                    unit: "起",
                    percent: ""
                }, {
                    title: "火灾起数 (含未填报)",
                    img: require("@/assets/image/index/icon_hzqs.svg"),
                    num: "",
                    unit: "起",
                    percent: ""
                }, {
                    title: "轻微火灾",
                    img: require("@/assets/image/index/icon_qwhz.svg"),
                    num: "",
                    unit: "起",
                    percent: ""
                }, {
                    title: "死亡人数",
                    img: require("@/assets/image/index/icon_swrs.svg"),
                    num: "",
                    unit: "人",
                    percent: ""
                }, {
                    title: "受伤人数",
                    img: require("@/assets/image/index/icon_ssrs.svg"),
                    num: "",
                    unit: "人",
                    percent: ""
                }, {
                    title: "直接经济损失",
                    img: require("@/assets/image/index/icon_jjss.svg"),
                    num: "",
                    unit: "万元",
                    percent: ""
                }],
                warningListDataLoading: false,
                // 支队汇总 & 清单明细 数据
                switchData: "支队汇总",
                switchListData: ["支队汇总", "清单明细"],
                summaryData: {},
                summaryDataLoading: false,
                // 大队数据
                listDetailData: [],
                listDetailDataLoading: false,
                listDetailActiveName: "",
                // 中队数据
                lowListDetailData: [],
                lowListDetailDataLoading: false,
                // 柱状图列表 指标
                targetData: "总警情",
                targetListData: ["总警情", "火灾", "死亡", "受伤", "直接损失"],
                // 柱状图列表 数据
                lineListData: {
                    '总警情': {},
                    '火灾': {},
                    '死亡': {},
                    '受伤': {},
                    '直接损失': {}
                },
                // 当前激活的柱状图数据
                currentBarData: '总警情',
                lineListDataLoading: false,
                // 柱状图底部的文本数据
                barTextData: {},
                barTextDataLoading: false,
                // 饼图列表 数据
                pieListDataLoading: false,
                // 指标ID（10001：警情；10002：火灾扑救；10003：抢险救援）pagePostData.cyc + 后面的编号
                typeData: {
                    value: "10001",
                    name: "警情"
                },
                typeListData: [{
                    value: "10001",
                    name: "警情"
                }, {
                    value: "10002",
                    name: "火灾"
                }, {
                    value: "10003",
                    name: "抢险救援"
                }]
            };
        },
        created() {
            const me = this;
            me.pagePostData.deptId = me.$store.getters.deptId;
            me.getPageData();
            me.getEtlTimeDatas();

        },
        methods: {
            /**
             * 获取页面基本数据
             */
            getPageData() {
                const me = this;
                me.pagePostData.cyc = me.dateData.value;
                me.getIndexWarning();
                me.getSummaryDatas();
                me.getListDetailDatas();
                me.getBarChartDatas();
                me.getBarTitleDatas();
                me.getPieChartDatas();

            },
            /**
             * 获取 顶部 重点指标列表 数据
             */
            getIndexWarning() {
                const me = this;
                me.warningListDataLoading = true;
                // 转换 kpiId 字段
                let params = {...me.pagePostData};
                let {cyc, kpiId} = params;
                params.kpiId = cyc + kpiId;
                detachmentHome.getIndexWarning(params).then(res => {
                    const {code, data} = res;
                    if (code === 200 && data && data[0]) {
                        const saveData = data[0];
                        me.warningListData.forEach((element, index) => {
                            switch (index) {
                                case 0:
                                    element.num = saveData.zqsCnt;
                                    element.percent = saveData.tbZqsValue;
                                    break;
                                case 1:
                                    element.num = saveData.hzqsCnt;
                                    element.percent = saveData.tbHzqsValue;
                                    break;
                                case 2:
                                    element.num = saveData.qwhzCnt;
                                    element.percent = saveData.tqQwhzValue;
                                    break;
                                case 3:
                                    element.num = saveData.swrsCnt;
                                    element.percent = saveData.tbSwrsValue;
                                    break;
                                case 4:
                                    element.num = saveData.ssrsCnt;
                                    element.percent = saveData.tbSsrsValue;
                                    break;
                                case 5:
                                    element.num = saveData.zjssFee && (saveData.zjssFee / 10000).toFixed(1);
                                    element.percent = saveData.tbZjssValue;
                                    break;
                                default:
                                    break;
                            }
                        });
                    } else {
                        me.warningListData.forEach((element, index) => {
                            element.num = 0;
                            element.percent = 0;
                        });
                    }
                }).finally(() => {
                    me.warningListDataLoading = false;
                });
            },
            /**
             * 获取 汇总数据 数据
             */
            getSummaryDatas() {
                const me = this;
                me.summaryDataLoading = true;
                // 转换 kpiId 字段
                let params = {...me.pagePostData};
                let {cyc, kpiId} = params;
                params.kpiId = cyc + kpiId;
                detachmentHome.getSummaryDatas(params).then(res => {
                    const {code, data} = res;
                    if (code === 200 && data && data[0]) {
                        const saveData = data[0];
                        me.summaryData = saveData;
                        me.chartsOption.pies.series.forEach((element, index) => {
                            if (!index) {
                                // 辖区出动报告
                                element.data = [{
                                    value: saveData.cdytb,
                                    name: "已填报"
                                }, {
                                    value: saveData.cddtb,
                                    name: "待填报"
                                }].sort((a, b) => {
                                    return a.value - b.value;
                                });
                            } else {
                                // 辖区火灾报告
                                element.data = [{
                                    value: saveData.hzytb,
                                    name: "已填报"
                                }, {
                                    value: saveData.hzdtb,
                                    name: "待填报"
                                }].sort((a, b) => {
                                    return a.value - b.value;
                                });
                            }
                        });
                    } else {
                        me.summaryData = {};
                        me.chartsOption.pies.series.forEach((element, index) => {
                            if (!index) {
                                // 辖区出动报告
                                element.data = [];
                            } else {
                                // 辖区火灾报告
                                element.data = [];
                            }
                        });
                    }
                }).finally(() => {
                    me.summaryDataLoading = false;
                });
            },
            /**
             * 获取 清单明细 数据
             * deptId 这里如果有值，表示请求的是中队的数据
             */
            getListDetailDatas(deptId) {
                const me = this;
                // 是否请求的是中队数据
                if (deptId) {
                    me.lowListDetailDataLoading = true;
                } else {
                    me.listDetailDataLoading = true;
                }
                // 转换 kpiId 字段
                let params = {...me.pagePostData};
                let {cyc, kpiId} = params;
                params.kpiId = cyc + kpiId;
                // 是否请求的是中队数据
                if (deptId) {
                    params.deptId = deptId;
                }
                detachmentHome.getListDetailDatas(params).then(res => {
                                console.log('ccc',res)
                    const {code, data} = res;
                    if (code === 200 && data && data.length) {
                        const saveData = data;
                        // 是否请求的是中队数据
                        if (deptId) {
                            me.lowListDetailData = saveData;
                        } else {
                            me.listDetailData = saveData;
                            // 默认打开第一条数据
                            if (!me.listDetailActiveName) {
                                const activeDeptId = me.listDetailData[0].deptId;
                                me.getListDetailDatas(activeDeptId);
                                me.listDetailActiveName = activeDeptId;
                            }
                        }
                    } else {
                        // 是否请求的是中队数据
                        if (deptId) {
                            me.lowListDetailData = [];
                        } else {
                            me.listDetailData = [];
                            me.listDetailActiveName = "";
                        }
                    }
                }).finally(() => {
                    me.listDetailDataLoading = me.lowListDetailDataLoading = false;
                });
            },
            /**
             * 获取 主要统计指标列表 数据
             */
            getBarChartDatas() {
                const me = this;
                me.lineListDataLoading = true;
                // 转换 kpiId 字段
                let params = {...me.pagePostData};
                let {cyc, kpiId} = params;
                params.kpiId = cyc + kpiId;
                detachmentHome.getBarChartDatas(params).then(res => {
                    let {code, data} = res;
                    // 数据初始化
                    me.lineListData = {
                        '总警情': {},
                        '火灾': {},
                        '死亡': {},
                        '受伤': {},
                        '直接损失': {}
                    };
                    me.chartsOption.line.xAxis.data = [];
                    me.chartsOption.line.legend.data = [];
                    if (code === 200 && data && data.length) {
                        const dateType = me.dateData.name;
                        // 自定义筛选字段
                        for (let key in me.lineListData) {
                            me.lineListData[key][`本${dateType}`] = [];
                            me.lineListData[key][`上${dateType}`] = [];
                            me.lineListData[key][`同比`] = [];
                        }
                        data.forEach(element => {
                            me.chartsOption.line.xAxis.data.push(element.deptName);

                            me.lineListData["总警情"][`本${dateType}`].push(element.zqsCnt);
                            me.lineListData["总警情"][`上${dateType}`].push(element.tqZqsZnt);
                            me.lineListData["总警情"][`同比`].push(element.tbZqsValue);

                            me.lineListData["火灾"][`本${dateType}`].push(element.hzqsCnt);
                            me.lineListData["火灾"][`上${dateType}`].push(element.tqHzqsCnt);
                            me.lineListData["火灾"][`同比`].push(element.tbHzqsValue);

                            me.lineListData["死亡"][`本${dateType}`].push(element.swrsCnt);
                            me.lineListData["死亡"][`上${dateType}`].push(element.tqSwrdCnt);
                            me.lineListData["死亡"][`同比`].push(element.tbSwrsValue);

                            me.lineListData["受伤"][`本${dateType}`].push(element.ssrsCnt);
                            me.lineListData["受伤"][`上${dateType}`].push(element.tqSsrsCnt);
                            me.lineListData["受伤"][`同比`].push(element.tbSsrsValue);

                            me.lineListData["直接损失"][`本${dateType}`].push(element.zjssFee);
                            me.lineListData["直接损失"][`上${dateType}`].push(element.tqZjssFee);
                            me.lineListData["直接损失"][`同比`].push(element.tbZjssValue);
                        });
                        // 设置默认值
                        me.targetDataChange("总警情");
                    }
                }).finally(() => {
                    me.lineListDataLoading = false;
                });
            },
            /**
             * 获取 主要统计指标列表下面的描述文字 数据
             */
            getBarTitleDatas() {
                const me = this;
                me.barTextDataLoading = true;
                // 转换 kpiId 字段
                let params = {...me.pagePostData};
                let {cyc, kpiId} = params;
                params.kpiId = cyc + kpiId;
                detachmentHome.getBarTitleDatas(params).then(res => {
                    let {code, data} = res;
                    if (code === 200 && data && data[0]) {
                        me.barTextData = data[0];
                    } else {
                        me.barTextData = {};
                    }
                }).finally(() => {
                    me.barTextDataLoading = false;
                });
            },
            /**
             * 获取 警情类型图表 数据
             */
            getPieChartDatas() {
                const me = this;
                me.pieListDataLoading = true;
                // 转换 kpiId 字段
                let params = {...me.pagePostData};
                let {cyc, kpiId} = params;
                params.kpiId = cyc + kpiId;
                detachmentHome.getPieChartDatas(params).then(res => {
                    let {code, data} = res;
                    // 数据初始化
                    me.chartsOption.pie.title.text = "";
                    me.chartsOption.pie.title.subtext = me.typeData.name + "总数";
                    if (me.typeData.name === '火灾') {
                        me.chartsOption.pie.title.subtext += ' (含未填报)'
                    }
                    me.chartsOption.pie.series[0].name = me.typeData.name;
                    me.chartsOption.pie.series[0].data = me.chartsOption.pie.series[1].data = [];
                    if (code === 200 && data && data.length) {
                        let total = 0;
                        data.forEach(element => {
                            total += element.indexValue || 0;
                            element.name = element.indexName;
                            element.value = element.indexValue;
                        });
                        me.chartsOption.pie.series[0].data = me.chartsOption.pie.series[1].data = data;
                        me.chartsOption.pie.title.text = total;
                        // 生成 legend 文本
                        me.chartsOption.pie.legend.formatter = name => {
                            const index = data.findIndex(item => {
                                return item.name === name;
                            });
                            if (index !== -1) {
                                const currentData = data[index];
                                return `${name}\n起数：${currentData.value}  占比：${currentData.indexZb}%`;
                            } else {
                                return "-";
                            }
                        };
                    }
                }).finally(() => {
                    me.pieListDataLoading = false;
                });
            },
            /**
             * 清单明细 单个手风琴点击回调
             */
            listDetailNameChangeHandle(deptId) {
                const me = this;
                deptId && me.getListDetailDatas(deptId)
            },
            /**
             * 柱状图 列表 指标改变回调
             */
            targetDataChange(data) {
                const me = this;
                const dateType = me.dateData.name;
                me.currentBarData = data;
                me.chartsOption.line.series.forEach((element, index) => {
                    switch (index) {
                        case 0:
                            element.name = `本${dateType}`;
                            break;
                        case 1:
                            element.name = `上${dateType}`;
                            break;
                        case 2:
                            element.name = `同比`;
                            break;
                        default:
                            break;
                    }
                    me.chartsOption.line.legend.data.push(element.name);
                    element.data = me.lineListData[data][element.name];
                });
            },
            /**
             * 饼图 列表 类型改变回调
             */
            typeDataChange(data) {
                const me = this;
                if (data && data.value) {
                    me.pagePostData.kpiId = data.value;
                    me.getPieChartDatas();
                }
            },
            /**
             * [getEtlTimeDatas 获取更新时间]
             * @Author       Miliky
             * @DateTime     2020-01-22T22:58:43+0800
             * @return       {void}
             */
            getEtlTimeDatas() {
                const $this = this;
                commonHome.getEtlTimeDatas().then(res => {
                    if (res.code === 200) {
                        $this.etlTime = res.data[0].etlTime || "";
                    }
                }).catch(e => {
                }).finally(() => {
                });
            }
        }
    };
</script>
