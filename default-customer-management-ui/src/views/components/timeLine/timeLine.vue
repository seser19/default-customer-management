<style lang="scss" scoped>

    @keyframes radiation {
        from { background-color: #437FDF; -webkit-box-shadow: 0 0 0 2px rgba(58,168,240,.34); }
        50% { background-color: #0657D3; -webkit-box-shadow: 0 0 0 6px rgba(58,168,240,.5); }
        to { background-color: #437FDF; -webkit-box-shadow: 0 0 0 2px rgba(58,168,240,.34); }
    }
    @-webkit-keyframes radiation {
        from { background-color: #437FDF; -webkit-box-shadow: 0 0 0 2px rgba(58,168,240,.34); }
        50% { background-color: #0657D3; -webkit-box-shadow: 0 0 0 6px rgba(58,168,240,.5); }
        to { background-color: #437FDF; -webkit-box-shadow: 0 0 0 2px rgba(58,168,240,.34); }
    }

    .component-timeline {
        ul {
            list-style-type:none;
            overflow-x: auto;
            white-space: nowrap;
            display: block;
            font-size: 0;
            li {
                display: inline-block;
                min-width: 100px;
                height: 105px;
                position: relative;
                .date {
                    position: absolute;
                    top: 0;
                    left: -40px;
                    height: 20px;
                    display: flex;
                    span {
                        font-size: 16px;
                        font-weight: 500;
                        line-height: 20px;
                        color: #333333;
                    }
                }
                .time {
                    position: absolute;
                    top: 33px;
                    left: -12px;
                    font-size:14px;
                    font-weight: 500;
                    color:rgba(67,127,223,1);
                }
                .period {
                    position: absolute;
                    top: 50px;
                    left: 20px;
                    right: 7px;
                    font-size: 12px;
                    text-align: center;
                    color: #ffa500;
                }
                .node {
                    position: absolute;
                    top: 60px;
                    left: 0;
                    z-index: 2;
                    width: 12px;
                    height: 12px;
                    -webkit-border-radius: 50%;
                    -moz-border-radius: 50%;
                    border-radius: 50%;
                    background-color: #fff;
                    border: 1px solid #437FDF;
                    &.milestone {
                        -webkit-animation: radiation;
                        -o-animation: radiation;
                        animation: radiation;
                        -webkit-animation-duration: 2s;
                        -moz-animation-duration: 2s;
                        -o-animation-duration: 2s;
                        animation-duration: 2s;
                        -webkit-animation-iteration-count: infinite;
                        -moz-animation-iteration-count: infinite;
                        -o-animation-iteration-count: infinite;
                        animation-iteration-count: infinite;
                    }
                }
                .axis-line {
                    position: absolute;
                    top: 65px;
                    left: 2px;
                    right: 0;
                    height: 2px;
                    background: #437FDF;
                    z-index: 1;
                }
                .arrow{
                    position: absolute;
                    top: 56px;
                    left: -17px;
                    border-top: 10px solid transparent;
                    border-left: 10px solid #437FDF;
                    border-bottom: 10px solid transparent;
                    font-size: 0;
                    line-height: 0;
                }
                .text{
                    position: absolute;
                    top: 80px;
                    left: -20px;
                    font-size: 13px;
                    font-weight:400;
                }
            }
        }
    }
</style>

<template>
    <div class="component-timeline">
        <ul>
            <li v-for="(item, index) in timeline" :key="index" :style="{'width': item.width}">
                <div class="date" v-if="item.date">
                    <img src="./icon/date.svg" height="20" width="21" />
                    <span>{{item.date || ''}}</span>
                </div>
                <div class="time">{{item.time || ''}}</div>
                <span class="period" v-if="item.period">{{item.period}}</span>
                <div :class="['node', {'milestone': item.isNode}]"></div>
                <div class="axis-line" v-if="index < timeline.length - 1"></div>
                <span class="arrow" v-if="index === timeline.length - 1"></span>
                <div class="text">{{item.timeName || ''}}</div>
            </li>
        </ul>
    </div>
</template>

<script>
    export default{
        name: 'timeline',
        props: {
            /* 警情数据 */
            timeLineData: {
                type: Array,
                default: () => {
                    return [];
                }
            }
        },
        data(){
            return{

            }
        },
        computed:{
            timeline() {
                let arr = [];
                let date = ''; // 记录时间轴日期
                this.timeLineData.forEach((item, index) => {
                    // 如果节点的日期是新日期，则需要展示，否则隐藏
                    if (date === item.date) {
                        item.date = null;
                    } else {
                        date = item.date;
                    }
                    if (index < this.timeLineData.length - 1) {
                        // 计算耗时
                        const nextNodeTimestamp = this.timeLineData[index + 1].timestamp;
                        const totalPeriodSeconds = nextNodeTimestamp - item.timestamp;
                        const hours = Math.floor(totalPeriodSeconds / 3600);
                        const reduceHourTime = totalPeriodSeconds - hours * 3600;
                        const minutes = Math.floor(reduceHourTime / 60);
                        const seconds = reduceHourTime - minutes * 60;
                        let period = minutes + '\'' + seconds +'\"';
                        if (hours > 0) {
                            period = hours + ':' + period;
                        }
                        item.period = period;
                        // 根据耗时确定时间轴长度
                        if (totalPeriodSeconds <= 5 * 60) {
                            item.width = '100px';
                        } else if (totalPeriodSeconds > 5 * 60 && totalPeriodSeconds <= 10 * 60) {
                            item.width = '130px';
                        } else if (totalPeriodSeconds > 10 * 60 && totalPeriodSeconds <= 30 * 60) {
                            item.width = '170px';
                        } else if (totalPeriodSeconds > 30 * 60 && totalPeriodSeconds <= 60 * 60) {
                            item.width = '220px';
                        } else if (totalPeriodSeconds > 60 * 60 && totalPeriodSeconds <= 120 * 60) {
                            item.width = '280px';
                        } else if (totalPeriodSeconds > 120 * 60) {
                            item.width = '370px';
                        }
                    }
                    arr.push(item);
                });
                return arr;
            }
        }
    }
</script>
