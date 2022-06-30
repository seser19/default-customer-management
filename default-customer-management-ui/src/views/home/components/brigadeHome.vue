<template lang="pug">
    //- 大队首页
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
            el-col(:xs="24" :sm="24" :lg="14" :span="14")
                el-row.section
                    el-col
                        .chart_title 辖区中队出动次数统计
                        .swipe_zone
                            .bar_zone(v-loading="barListDataLoading")
                                v-chart(:options="chartsOption.bar" autoresize)


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
                    .txt_zone(v-if="barTextData.deptName" v-loading="barTextDataLoading")
                        span 今{{ dateData.name }}以来{{ barTextData.deptName }}共接报警情
                        span.orange {{ barTextData.zqsCnt }}
                        span 起，{{ isTb }}{{ barTextData.tbZqsValue < 0 ? '下降' : '上升' }}
                        span.orange {{ barTextData.tbZqsValue && Math.abs(barTextData.tbZqsValue) }}%
                        span ；火灾
                        span.orange {{ barTextData.hzqsCnt }}
                        span 起，{{ isTb }}{{ barTextData.tbHzqsValue < 0 ? '下降' : '上升' }}
                        span.orange {{ barTextData.tbHzqsValue && Math.abs(barTextData.tbHzqsValue) }}%
                        span ；死亡
                        span.orange {{ barTextData.swrsCnt }}
                        span 人，{{ isTb }}{{ barTextData.tbSwrsValue < 0 ? '下降' : '上升' }}
                        span.orange {{ barTextData.tbSwrsValue && Math.abs(barTextData.tbSwrsValue) }}%
                        span  ；受伤
                        span.orange {{ barTextData.ssrsCnt }}
                        span 人，{{ isTb }}{{ barTextData.tbSsrsValue < 0 ? '下降' : '上升' }}
                        span.orange {{ barTextData.tbSsrsValue && Math.abs(barTextData.tbSsrsValue) }}%
                        span ；直接经济损失
                        span.orange {{  barTextData.zjssFee && (barTextData.zjssFee / 10000).toFixed(1) }}
                        span 万元，{{ isTb }}{{ barTextData.tbZjssValue < 0 ? '下降' : '上升' }}
                        span.orange {{ barTextData.tbZjssValue && Math.abs(barTextData.tbZjssValue) }}%
                        span ；其中较大火灾
                        span.orange {{ barTextData.jdhzCnt }}
                        span 起，重大火灾
                        span.orange {{ barTextData.zdhzCnt }}
                        span 起，特大火灾
                        span.orange {{ barTextData.tdhzCnt }}
                        span 起。
            el-col(:xs="24" :sm="24" :lg="10" :span="10")
                el-row.section.section_spe
                    .section_title
                        .chart_title 警情类型
                        el-radio-group(v-model="typeData" @change="typeDataChange")
                            el-radio-button(v-for="item in typeListData" :label="item" :key="item.value") {{ item.name }}
                    .pie_zone(v-loading="pieListDataLoading")
                        v-chart(v-if="chartsOption.pie.series[0].data.length" :options="chartsOption.pie" autoresize)
                        .data-none(v-else) 暂无数据
</template>

<script>
    // api
    import {brigadeHome, commonHome} from "@/api/index";
    // 通知公告和待办事项组件
    import NoticeTodoList from "./NoticeTodoList";
    // maxBy 取数组中某个属性值最大的元素
    import {maxBy} from "lodash-es";

    export default {
        name: "brigadeHome",
        components: {NoticeTodoList},
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
                    bar: {
                        title: {
                            text: "{a|今年以来，上城大队下属中队共出动}{b|878}{a|次。总计出动车辆}{b|536}{a|次，出动人员}{b|1356}{a|人次。}",
                            textStyle: {
                                rich: {
                                    a: {
                                        fontSize: 14,
                                        color: "#777777",
                                        lineHeight: 24,
                                        fontWeight: "bold"
                                    },
                                    b: {
                                        color: "#437FDF",
                                        fontSize: 14,
                                        lineHeight: 24,
                                        fontWeight: "bold"
                                    }
                                }
                            }
                        },
                        grid: [{
                            left: "3%",
                            top: "12%",
                            right: "5%",
                            bottom: "2%",
                            containLabel: true
                        }],
                        xAxis: {
                            show: true,
                            type: "value",
                            boundaryGap: [0, 200],
                            splitLine: {show: false},
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    color: "#E6E6E6"
                                }
                            },
                            axisTick: {
                                show: true,
                                inside: true
                            },
                            axisLabel: {
                                color: "#777777"
                            }
                        },
                        yAxis: [{
                            axisLine: {
                                show: false
                            },
                            axisTick: {
                                show: false
                            },
                            axisLabel: {
                                show: true,
                                inside: true,
                                textStyle: {
                                    fontSize: 14
                                },
                                align: "top",
                                verticalAlign: "top",
                                color: "#333333",
                                fontSize: 14,
                                padding: [-30, 0, 0, 0],
                                fontWeight: 400,
                                lineHeight: 20,
                                position: "top"
                            },
                            splitLine: {
                                show: false
                            },
                            type: "category",
                            data: []
                        }],
                        series: [{
                            type: "bar",
                            barWidth: 12,
                            itemStyle: {
                                normal: {
                                    color: "rgba(0,0,0,0.05)",
                                    barBorderRadius: 20
                                }
                            },
                            barGap: "-100%",
                            barCategoryGap: "70%",
                            data: [],
                            animation: false
                        }, {
                            type: "bar",
                            barWidth: 12,
                            label: {
                                show: true,
                                position: [400, -25],
                                distance: 5,
                                color: "#437FDF",
                                formatter: function (params) {
                                    if (params.data.percent > 0) {
                                        return (
                                            "{a|出动次数:} {b|" +
                                            params.data.value +
                                            "}   {a|同比:} {d|" +
                                            params.data.percent +
                                            "%} {f|}"
                                        );
                                    } else {
                                        return (
                                            "{a|出动次数:} {b|" +
                                            params.data.value +
                                            "}   {a|同比:} {e|" +
                                            params.data.percent +
                                            "%} {f|}"
                                        );
                                    }
                                },
                                rich: {
                                    a: {
                                        color: "#777777",
                                        fontWeight: 400,
                                        lineHeight: 20,
                                        fontSize: 14
                                    },
                                    b: {
                                        color: "#424242",
                                        fontWeight: 600,
                                        lineHeight: 20,
                                        fontSize: 14
                                    },
                                    d: {
                                        color: "#FB360E",
                                        fontWeight: 400,
                                        lineHeight: 20,
                                        fontSize: 14
                                    },
                                    e: {
                                        color: "#437FDF",
                                        fontWeight: 400,
                                        lineHeight: 20,
                                        fontSize: 14
                                    }
                                }
                            },
                            itemStyle: {
                                normal: {
                                    barBorderRadius: 20,
                                    color: {
                                        type: "linear",
                                        x: 0,
                                        y: 0,
                                        x2: 1,
                                        y2: 0,
                                        colorStops: [{
                                            offset: 0,
                                            color: "rgba(43,169,255,1)" // 0% 处的颜色
                                        }, {
                                            offset: 1,
                                            color: "rgba(19,112,254,1)" // 100% 处的颜色
                                        }],
                                        global: false // 缺省为 false
                                    }
                                }
                            },
                            data: []
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
                // 辖区中队出动次数统计列表 数据
                barListData: [],
                barListDataLoading: false,
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
                me.getSquadronDatas();
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
                brigadeHome.getIndexWarning(params).then(res => {
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
                                    element.num =
                                        saveData.zjssFee &&
                                        (saveData.zjssFee / 10000).toFixed(1);
                                    element.percent = saveData.tbZjssValue;
                                    break;

                                default:
                                    break;
                            }
                        });
                        // 设置下方柱状图顶部的文本
                        me.chartsOption.bar.title.text = `{a|今${me.dateData.name}以来，下属中队共出动} {b|${saveData.cdqsCnt}} {a|次。总计出动车辆} {b|${saveData.cdclCnt}} {a|次，出动人员} {b|${saveData.cdryCnt}} {a|人次。}`;
                    } else {
                        me.warningListData.forEach((element, index) => {
                            element.num = 0;
                            element.percent = 0;
                        });
                        // 设置下方柱状图顶部的文本
                        me.chartsOption.bar.title.text = `{a|今${me.dateData.name}以来，下属中队共出动} {b|0} {a|次。总计出动车辆} {b|0} {a|次，出动人员} {b|0} {a|人次。}`;
                    }
                }).finally(() => {
                    me.warningListDataLoading = false;
                });
            },
            /**
             * 获取 柱状图列表 数据
             */
            getSquadronDatas() {
                const me = this;
                me.barListDataLoading = true;
                // 转换 kpiId 字段
                let params = {...me.pagePostData};
                let {cyc, kpiId} = params;
                params.kpiId = cyc + kpiId;
                brigadeHome.getSquadronDatas(params).then(res => {
                    let {code, data} = res;
                    // 数据初始化
                    me.chartsOption.bar.xAxis.max = 0;
                    me.chartsOption.bar.yAxis[0].data = [];
                    me.chartsOption.bar.series[0].data = [];
                    me.chartsOption.bar.series[1].data = [];
                    me.chartsOption.bar.dataZoom = [];
                    if (code === 200 && data && data.length) {
                        // 转换数据
                        // 设置最大值作为阴影
                        let maxNum = maxBy(data, o => {
                            return o.cdqsCnt;
                        }).cdqsCnt;
                        maxNum &&
                        maxNum > 10 &&
                        (maxNum = Math.ceil(maxNum / 10) * 10);
                        me.chartsOption.bar.xAxis.max = maxNum;
                        data.forEach(element => {
                            me.chartsOption.bar.series[0].data.push(maxNum);
                            me.chartsOption.bar.yAxis[0].data.push(
                                element.deptName
                            );
                            element.name = element.deptName;
                            element.value = element.cdqsCnt;
                            element.percent = element.tbCdqsCntValue;
                        });
                        me.chartsOption.bar.series[1].data = data;
                        // 设置数据量过多设置滚动条
                        data.length > 5 &&
                        (me.chartsOption.bar.dataZoom[0] = {
                            show: true,
                            width: 12,
                            yAxisIndex: 0,
                            top: "8%",
                            start: 0,
                            end: (100 / data.length) * 3,
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
                        });
                    }
                }).finally(() => {
                    me.barListDataLoading = false;
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
                brigadeHome.getBarChartDatas(params).then(res => {
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
                brigadeHome.getBarTitleDatas(params).then(res => {
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
                brigadeHome.getPieChartDatas(params).then(res => {
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
                        $this.etlTime = res.data[0].etlTime || '';
                    }
                }).catch(e => {
                }).finally(() => {
                });
            }
        }
    };
</script>
