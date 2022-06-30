<style lang="scss" scoped>
    .indexPage {
        .content {
            .section {
                .line_zone {
                    height: 410px;
                }
            }
        }
    }
</style>

<template lang="pug">
    //- 中队首页
    .indexPage
        .top
            div
                el-radio-group(v-model="dateData" @change="getPageData()")
                    el-radio-button(v-for="item in dateListData" :label="item" :key="item.value") {{ item.name }}
            .etlTime
                span 数据更新至
                span.time {{etlTime || '-'}}
            //- div
            //-   el-select(v-model="value" placeholder="请选择")
            //-     el-option(v-for="item in options" :key="item.value" :label="item.label" :value="item.value")

        el-row.content.section.panel_group(v-loading="warningListDataLoading")
            el-col.panel_item(v-for="item in warningListData" :key="item.title" :xs="24" :sm="12" :lg="4" :span="4")
                .label
                    img(:src="item.img")
                    h5 {{ item.title }}
                .statistic-num
                    b {{ item.num || 0 }}
                    span.unit {{ item.unit }}
                .trend(:class="item.percent > 0 ? 'up' : 'down'")
                    i(:class="{'el-icon-top': item.percent > 0, 'el-icon-bottom': item.percent < 0}")
                    b {{ Math.abs(item.percent || 0) }}
                    span % {{ isTb }}

        el-row.content(:gutter="20")
            el-col(:xs="24" :sm="24" :lg="14" :span="14" v-loading="warningListDataLoading")
                .section
                    .section_title
                        .chart_title 处置情况分布
                    .cycle_container
                        .cycle_item
                            .cycle_title 中途返回
                            el-progress(type="circle" :percentage="ringListData.ztfhCnt" :color="ringColors" :stroke-width="10 || 0" :width="150" :format="ringTextFormat")
                        .cycle_item
                            .cycle_title 到场未实施处置
                            el-progress(type="circle" :percentage="ringListData.dcwczCnt || 0" :color="ringColors" :stroke-width="10" :width="150" :format="ringTextFormat")
                        .cycle_item
                            .cycle_title 到场实施处置
                            el-progress(type="circle" :percentage="ringListData.dcczCnt || 0" :color="ringColors" :stroke-width="10" :width="150" :format="ringTextFormat")

                    el-row.timeLine_container
                        el-col
                            span.doit
                            span.line
                            span.doit.secondDoit
                            span.line
                            span.doit.thirdDoit
                            span.line
                            span.doit.fourthDoit

                    el-row.timeLine_container
                        el-col.timeLine_content
                            div.card_content
                                div.doitTitle 平均到场时间
                                div.timeSpan {{ ringListData.avgDcsj || '-' }}
                            div.card_content
                                div.doitTitle 平均出水时间
                                div.timeSpan {{ ringListData.avgCssj || '-' }}
                            div.card_content
                                div.doitTitle 平均结束时间
                                div.timeSpan {{ ringListData.avgJssj || '-' }}
                            div.card_content
                                div.doitTitle 平均归队时间
                                div.timeSpan {{ ringListData.avgGdsj || '-' }}

            el-col(:xs="24" :sm="24" :lg="10" :span="10")
                .section
                    notice-todo-list

        el-row.content(:gutter="20")
            el-col(:xs="24" :sm="24" :lg="14" :span="14")
                el-row.section.section_spe
                    .section_title
                        .chart_title 主要统计指标
                        el-radio-group(v-model="targetData" @change="targetDataChange")
                            el-radio-button(v-for="item in targetListData" :label="item" :key="item") {{ item }}
                    .line_zone(v-loading="lineListDataLoading")
                        v-chart(v-if="chartsOption.line.xAxis.data.length" :options="chartsOption.line" autoresize)
                        .data-none(v-else) 暂无数据
                    //- .txt_zone(v-if="barTextData.deptName" v-loading="barTextDataLoading")
                        span 今{{ dateData.name }}以来{{ barTextData.areaName }}共发生警情
                        span.orange {{ barTextData.zqsCnt }}
                        span 起，同比{{ barTextData.tbZqsValue < 0 ? '下降' : '上升' }}
                        span.orange {{ barTextData.tbZqsValue && Math.abs(barTextData.tbZqsValue) }}%
                        span ；火灾
                        span.orange {{ barTextData.hzqsCnt }}
                        span 起，同比{{ barTextData.tbHzqsValue < 0 ? '下降' : '上升' }}
                        span.orange {{ barTextData.tbHzqsValue && Math.abs(barTextData.tbHzqsValue) }}%
                        span ；死亡
                        span.orange {{ barTextData.swrsCnt }}
                        span 人，同比{{ barTextData.tbSwrsValue < 0 ? '下降' : '上升' }}
                        span.orange {{ barTextData.tbSwrsValue && Math.abs(barTextData.tbSwrsValue) }}%
                        span  ；受伤
                        span.orange {{ barTextData.ssrsCnt }}
                        span 人，同比{{ barTextData.tbSsrsValue < 0 ? '下降' : '上升' }}
                        span.orange {{ barTextData.tbSsrsValue && Math.abs(barTextData.tbSsrsValue) }}%
                        span ；直接经济损失
                        span.orange {{  barTextData.zjssFee && (barTextData.zjssFee / 10000).toFixed(1) }}
                        span 万元，同比{{ barTextData.tbZjssValue < 0 ? '下降' : '上升' }}
                        span.orange {{ barTextData.tbZjssValue && Math.abs(barTextData.tbZjssValue) }}%
                        span ；其中较大火灾
                        span.orange {{ barTextData.jdhzCnt }}
                        span 起，重大火灾
                        span.orange {{ barTextData.zdhzCnt }}
                        span 起，特大火灾
                        span.orange {{ barTextData.tdhzCnt }}
                        span 起。

            el-col(:xs="24" :sm="24" :lg="10" :span="10")
                el-row.section.section_spe(v-loading="pieListDataLoading")
                    .section_title
                        .chart_title 参战形式分布
                        el-radio-group(v-model="typeData" @change="typeDataChange")
                            el-radio-button(v-for="item in typeListData" :label="item" :key="item.value") {{ item.name }}
                    .pie_zone
                        v-chart(v-if="JSON.stringify(pieListData) !== '{}'" :options="chartsOption.pie" autoresize)
                        .data-none(v-else) 暂无数据
                    el-row
                        el-col(:span="12").car_container
                            div.imgMargin
                                img(src="@/assets/image/index/icon_cars.svg")
                            div
                                div.car_title {{ pieListData.zcdclCnt || 0 }} 辆次
                                div.car_span 总出动车辆
                        el-col(:span="12").person_container
                            div.imgMargin
                                img(src="@/assets/image/index/icon_person.svg")
                            div
                                div.person_title {{ pieListData.zcdryCnt || 0 }} 人次
                                div.person_span 总出动人员
</template>

<script>
    // api
    import {squadronHome, commonHome} from "@/api/index";
    // 通知公告和待办事项组件
    import NoticeTodoList from "./NoticeTodoList"

    export default {
        name: "squadronHome",
        components: {
            NoticeTodoList
        },
      computed:{
        isTb(){
          return this.dateData.value==='Y'?'同比':'环比'
        }
      },
        data() {
            return {
                // 更新时间
                etlTime: '',
                // 页面通用的接口入参
                pagePostData: {
                    cyc: "Y",
                    deptId: null,
                    // 指标ID（10001：警情；10002：火灾扑救；10003：抢险救援）pagePostData.cyc + 后面的编号
                    kpiId: "10001"
                },
                // 页面使用的图表配置
                chartsOption: {
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
                            bottom: '12%',
                            top: "20%",
                            containLabel: true
                        },
                        legend: {
                            data: ["本年", "上年"],
                            top: 30,
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
                        dataZoom: [{
                            show: true,
                            height: 20,
                            xAxisIndex: [0],
                            bottom: "3%",
                            start: 0,
                            end: 60,
                            handleIcon:
                                "path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z",
                            handleSize: "110%",
                            handleStyle: {
                                color: "#d3dee5"
                            },
                            textStyle: {
                                color: "transparent"
                            },
                            borderColor: "rgba(241,241,241)"
                        }, {
                            type: "inside",
                            show: true,
                            height: 15,
                            start: 1,
                            end: 35,
                            zoomOnMouseWheel: false
                        }
                        ],
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
                        backgroundColor: "#fff",
                        tooltip: {
                            show: true
                        },
                        series: [{
                            name: "参战形式分布",
                            type: "pie",
                            radius: ["0", "70%"],
                            center: ["50%", "50%"],
                            selectedMode: "single",
                            avoidLabelOverlap: false,
                            label: {
                                show: true,
                                position: "inner",
                                formatter: "{b}\n\n{c} 次",
                                textBorderColor: "#FFFFFF",
                                fontSize: 14,
                                fontWeight: 400,
                                textBorderWidth: 0
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: [{
                                value: 0,
                                name: "主战",
                                selected: true,
                                itemStyle: {
                                    color: {
                                        type: "linear",
                                        x: 0,
                                        y: 0,
                                        x2: 1,
                                        y2: 1,
                                        colorStops: [
                                            {offset: 0.2, color: "#F59A00"}, // 0%处的颜色
                                            {offset: 1, color: "#FE1313"}
                                        ], // 100%处的颜色
                                        globalCoord: true // 缺省为 false
                                    }
                                }
                            }, {
                                value: 0,
                                name: "增援",
                                itemStyle: {
                                    color: {
                                        type: "linear",
                                        x: 0,
                                        y: 0,
                                        x2: 1,
                                        y2: 1,
                                        colorStops: [
                                            {offset: 0.2, color: "#2BA9FF"}, // 0%处的颜色
                                            {offset: 1, color: "#1370FE"}
                                        ], // 100%处的颜色
                                        globalCoord: true // 缺省为 false
                                    }
                                }
                            }]
                        }]
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
                    title: "火灾扑救 (含未填报)",
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
                    title: "抢险救援",
                    img: require("@/assets/image/index/icon_qxjy.svg"),
                    num: "",
                    unit: "起",
                    percent: ""
                }, {
                    title: "社会救助",
                    img: require("@/assets/image/index/icon_shjz.svg"),
                    num: "",
                    unit: "起",
                    percent: ""
                }, {
                    title: "公务执勤",
                    img: require("@/assets/image/index/icon_gwzq.svg"),
                    num: "",
                    unit: "起",
                    percent: ""
                }, {
                    title: "其他类型",
                    img: require("@/assets/image/index/icon_qtlx.svg"),
                    num: "",
                    unit: "起",
                    percent: ""
                }],
                warningListDataLoading: false,
                // 处置情况分布 数据
                ringListData: {},
                ringColors: [
                    {color: "#2BA9FF", percentage: 50},
                    {color: "#1370FE", percentage: 100}
                ],
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
                pieListData: {},
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
                squadronHome.getIndexWarning(params).then(res => {
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
                                    element.num = saveData.hzpjCnt;
                                    element.percent = saveData.tbHzpjValue;
                                    break;
                                case 2:
                                    element.num = saveData.qwhzCnt;
                                    element.percent = saveData.tqQwhzValue;
                                    break;
                                case 3:
                                    element.num = saveData.qxjyCnt;
                                    element.percent = saveData.tbQxjyValue;
                                    break;
                                case 4:
                                    element.num = saveData.shjyCnt;
                                    element.percent = saveData.tbShjyValue;
                                    break;
                                case 5:
                                    element.num = saveData.gwzqCnt;
                                    element.percent = saveData.tbGwzqValue;
                                    break;
                                case 6:
                                    element.num = saveData.qtjyCnt;
                                    element.percent = saveData.tbQtjyValue;
                                    break;

                                default:
                                    break;
                            }
                        });
                        me.ringListData = saveData;
                    } else {
                        me.warningListData.forEach((element, index) => {
                            element.num = 0;
                            element.percent = 0;
                        });
                        me.ringListData = {};
                    }
                }).finally(() => {
                    me.warningListDataLoading = false;
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
                squadronHome.getBarChartDatas(params).then(res => {
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

                            me.lineListData["直接损失"][`本${dateType}`].push(element.zjssFee && (element.zjssFee / 10000).toFixed(1));
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
                squadronHome.getBarTitleDatas(params).then(res => {
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
             * 获取 参战形式图表 数据
             */
            getPieChartDatas() {
                const me = this;
                me.pieListDataLoading = true;
                // 转换 kpiId 字段
                let params = {...me.pagePostData};
                let {cyc, kpiId} = params;
                params.kpiId = cyc + kpiId;
                squadronHome.getPieChartDatas(params).then(res => {
                    let {code, data} = res;
                    // 数据初始化

                    if (code === 200 && data && data[0]) {
                        const saveData = data[0];
                        me.pieListData = saveData;
                        me.chartsOption.pie.series[0].data.forEach((element, index) => {
                            switch (index) {
                                case 0:
                                    element.value = saveData.zzqsCnt;
                                    break;
                                case 1:
                                    element.value = saveData.zyqsCnt;
                                    break;

                                default:
                                    break;
                            }
                        });
                    } else {
                        me.chartsOption.pie.series[0].data.forEach((element, index) => {
                            switch (index) {
                                case 0:
                                    element.value = 0;
                                    break;
                                case 1:
                                    element.value = 0;
                                    break;

                                default:
                                    break;
                            }
                        });
                        me.pieListData = {};
                    }
                }).finally(() => {
                    me.pieListDataLoading = false;
                });
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
             * 处置情况分布 环形图内部文字生成
             */
            ringTextFormat(percent) {
                return `${percent}次`;
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
                        $this.etlTime = res.data[0].etlTime || '';
                    }
                }).catch(e => {
                }).finally(() => {
                });
            }
        }
    };
</script>

<style lang="stylus" scoped>
    .indexPage
        .content
            .section
                .pie_zone
                    width 100%
                    height 350px
            .car_title, .person_title
                font-size 18px
                color #333333
                line-height 24px
                margin-bottom 5px
            .car_span, .person_span
                font-size 14px
                color #777777
                line-height 14px
                font-weight 400
            .car_container
                border-right 1px solid #ACACAC
            .car_container, .person_container
                display flex
                justify-content center
            .car_container div, .person_container div
                text-align center
            .imgMargin
                margin 8px
            .cycle_container
                width 100%
                height 250px
                display flex
                justify-content space-around
                align-items center
                .cycle_item
                    position relative
                    .cycle_title
                        position absolute
                        top 51%
                        left 0
                        right 0
                        text-align center
                        font-size 12px
                        color #777
                    /deep/
                        .el-progress__text
                            font-weight bold
                            color #333
                            top 44%
            .timeLine_container
                width 100%
                margin-top 10px
                text-align center
                .doit
                    display inline-block
                    width 10px
                    height 10px
                    background content-box #53CEFE
                    box-shadow 0 0 0 4px #DAF4FF
                    border-radius 14px
                    position relative
                    box-sizing content-box
                    top 4px
                .secondDoit
                    background #3DADF1
                    box-shadow 0 0 0 4px rgba(58, 168, 240, 0.34)
                .thirdDoit
                    background #298DE6
                    box-shadow 0 0 0 4px rgba(41, 141, 230, 0.38)
                .fourthDoit
                    background #0657D3
                    box-shadow 0 0 0 4px rgba(6, 87, 211, 0.33)
                .line
                    display inline-block
                    width 135px
                    height 2px
                    background linear-gradient(90deg, rgba(204, 204, 204, 1) 0%, rgba(24, 144, 255, 1) 100%)
                    border-radius 4px
                .doitTitle
                    font-size 12px
                    font-weight 400
                    color rgba(153, 153, 153, 1)
                    line-height 17px
                .timeSpan
                    font-size 14px
                    color rgba(66, 66, 66, 1)
                    line-height 16px
                    margin 4px auto
                .timeLine_content
                    display flex
                    justify-content center
                    .card_content
                        margin 0 38px
</style>
