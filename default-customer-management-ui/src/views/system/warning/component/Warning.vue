<!--<template>-->
<!--  <div ref="antvGauge" class="char"></div>-->
<!--</template>-->

<!--<script>-->
<!--import { Gauge } from '@antv/g2plot'-->

<!--export default {-->
<!--  name: 'Warning',-->
<!--  props: {-->
<!--    value: {-->
<!--      type: Number,-->
<!--      default: 0-->
<!--    },-->
<!--    max: {-->
<!--      type: Number,-->
<!--      default: 1000-->
<!--    },-->
<!--    min:{-->
<!--      type:Number,-->
<!--      default:100-->
<!--    },-->
<!--    title: {-->
<!--      type: String,-->
<!--      default: ''-->
<!--    },-->
<!--    content: {-->
<!--      type: String,-->
<!--      default: ''-->
<!--    }-->
<!--  },-->
<!--  mounted() {-->
<!--    this.gauge = new Gauge(this.$refs.antvGauge, this.options)-->
<!--    this.gauge.render()-->
<!--  },-->
<!--  watch: {-->
<!--    options: {-->
<!--      deep: true,-->
<!--      handler() {-->
<!--        this.gauge ? this.gauge.update(this.options) : ''-->
<!--      }-->
<!--    }-->
<!--  },-->
<!--  computed: {-->
<!--    options() {-->
<!--      return {-->
<!--        percent: this.value / this.max,-->
<!--        range: {-->
<!--          // ticks: [0, this.min/(this.max*1.2), this.max/(this.max*1.2), 1],-->
<!--          // color: this.min?['#437FDF', '#2ecc71', '#F4664A']:['#437FDF', '#F4664A'],-->
<!--          color: this.getColor(this.value / this.max)-->
<!--        },-->

<!--        axis: {-->
<!--          label: {-->
<!--            formatter: (text) => `${Math.floor(text * this.max )}`-->
<!--          }-->
<!--        },-->
<!--        indicator: {-->
<!--          pointer: {-->
<!--            style: {-->
<!--              stroke: this.getTextColor(this.value / this.max),-->
<!--              fillOpacity: 0.5,-->
<!--              cursor: 'pointer',-->
<!--              lineWidth: 5,-->
<!--              strokeOpacity: 0.7,-->
<!--              shadowColor: '#437FDF99',-->
<!--              shadowBlur: 3,-->
<!--              shadowOffsetX: 3,-->
<!--              shadowOffsetY: 3,-->
<!--            }-->
<!--          },-->
<!--          pin: {-->
<!--            style: {-->
<!--              stroke: this.getTextColor(this.value / this.max),-->
<!--              shadowColor: '#437FDF99',-->
<!--              shadowBlur: 3,-->
<!--              shadowOffsetX: 2,-->
<!--              shadowOffsetY: 2,-->
<!--            }-->
<!--          }-->
<!--        },-->
<!--        statistic: {-->
<!--          content: {-->
<!--            formatter: () =>`${this.content}: ${(this.value / this.max  * 100).toFixed(0)}%${this.value / this.max > 1 ? '(已超出)' : ''}`,-->
<!--            style: {-->
<!--              fontSize: 15,-->
<!--              color: this.getTextColor(this.value / this.max)-->
<!--            },-->
<!--            offsetY: 15-->
<!--          },-->
<!--          title: {-->
<!--            formatter: () => `${this.title}`,-->
<!--            offsetX: 0,-->
<!--            offsetY: -15,-->
<!--            style: {-->
<!--              fontSize: 15-->
<!--            }-->
<!--          }-->
<!--        },-->
<!--        animation: {-->
<!--          // 配置图表第一次加载时的入场动画-->
<!--          appear: {-->
<!--            animation: 'scale-in-x', // 动画效果-->
<!--            duration: 2000  // 动画执行时间-->
<!--          }-->
<!--        }-->
<!--      }-->
<!--    }-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      gauge: null-->
<!--    }-->
<!--  },-->
<!--  methods: {-->
<!--    getColor(item){-->
<!--      if(this.value===0) return "#F1F1F1"-->
<!--      const color = ['#437FDF', '#2ecc71', '#F4664A']-->
<!--      const min = this.min/this.max-->
<!--      const max = this.max/this.max-->
<!--      return item < min ? color[0] : item < max ? color[1] : color[2];-->
<!--    },-->
<!--    getTextColor(item){-->
<!--      const color = ['#437FDF', '#2ecc71', '#F4664A']-->
<!--      const min = this.min/this.max-->
<!--      const max = this.max/this.max-->
<!--      return item < min ? color[0] : item < max ? color[1] : color[2];-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style lang="scss" scoped>-->
<!--.char {-->
<!--  height: 200px;-->
<!--  margin-bottom: 10px;-->
<!--}-->
<!--</style>-->
<template>
  <div>
    <div ref="chars" class="chars"></div>
  </div>

</template>

<script>
import echarts from 'echarts'

export default {
  name: 'Warning',
  mounted() {
    this.chars = echarts.init(this.$refs.chars)
    this.chars.setOption(this.options)
  },
  props: {
    value: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 1000
    },
    min: {
      type: Number,
      default: 100
    },
    title: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: '总抢险救援'
    }
  },
  watch: {
    options: {
      deep: true,
      handler() {
        this.chars?this.chars.setOption(this.options):'';
      }
    }
  },
  computed: {
    options() {
      return {
        tooltip: {
          show: true,
          formatter: `${this.content} <br/>数量 : ${this.value}<br/>占比 ：${(this.value/this.max*100).toFixed(1)}%<br/>最小值 ：${this.min}<br/>最大值 ：${this.max}`,
          backgroundColor: 'rgba(50,50,50,0.7)',
          trigger: 'item',
          borderColor: '#333', // 提示框浮层的边框颜色。...
          borderWidth: 0, // 提示框浮层的边框宽。...
          padding: 10
        },
        grid: {
          right: 120,
          left: -20,
          top: 30,
          bottom: 40,
          borderWidth: 1
        },
        xAxis: {
          show: false,
          type: 'category',
          data: ['value']
        },
        yAxis: {
          show: false,
          type: 'value'
        },
        series: [
          {
            name: '抢险救援',
            type: 'gauge',
            radius: '100%',
            min: 0,
            max: this.max * 1.2,
            splitNumber: 5,
            startAngle: 225,
            endAngle: -45,
            data: [
              {
                value: this.value,
                name: this.content
              }
            ],
            legend: {
              padding: 0,
              margin: 0
            },
            detail: {
              formatter: `数量：${this.value}${this.value / this.max >= 1 ? '(超出)' : ''}`,
              textStyle: {
                fontSize: 16
              }
            },
            title: {
              // 仪表盘标题。
              show: true, // 是否显示标题,默认 true。
              // offsetCenter: [0, "20%"], //相对于仪表盘中心的偏移位置，数组第一项是水平方向的偏移，第二项是垂直方向的偏移。可以是绝对的数值，也可以是相对于仪表盘半径的百分比。
              color: this.getColor(this.value / this.max), // 文字的颜色,默认 #333。
              fontSize: 14 // 文字的字体大小,默认 15。
            },
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                width: 15,
                color: [
                  [this.min / (this.max * 1.2), '#4D86E1'],
                  [this.max / (this.max * 1.2), '#39CF78'],
                  [1, '#F56E53']
                ]
              }
            },
            axisLabel: {
              fontSize: 10,
              distance: 0,
              formatter:i=>Math.floor(i)
            },
            axisTick: {
              show: false
              // splitNumber: 7,
              // lineStyle: {
              //   color: '#468EFD', //用颜色渐变函数不起作用
              //   width: 11,
              // },
              // length: -8
            }, //刻度样式
            splitLine: {
              show: true

              // lineStyle: {
              //   color: '#468EFD', //用颜色渐变函数不起作用
              // }
            } //分隔线样式
          },
          {
            type: 'bar',
            showBackground: true,
            barWidth: 15,
            data: [(this.value / this.max * 100).toFixed(1)],
            backgroundStyle: {
              color: '#bdc3c7'
            },
            itemStyle: {
              normal: {
                color: this.getColor(this.value / this.max),
                label: {
                  show: true, //开启显示
                  position: 'bottom', //在上方显示
                  textStyle: {
                    //数值样式
                    color: this.getColor(this.value / this.max),
                    fontSize: 13
                  },
                  formatter: function(params) {
                    // console.log(params)
                    return `${params.value}%`
                  }
                }
              }
            }
          },
          {
            name: '抢险救援',
            type: 'bar',
            stack: '总量',
            data: [100],
            itemStyle: {
              barBorderColor: 'rgba(0,0,0,0)',
              color: 'rgba(0,0,0,0)'
            },
            emphasis: {
              itemStyle: {
                barBorderColor: 'rgba(0,0,0,0)',
                color: 'rgba(0,0,0,0)'
              }
            }
          }
        ]
      }
    }
  },
  data() {
    return {
      loading: false,
      chars: null
    }
  },
  methods: {
    getColor(item) {
      if (this.value === 0) return '#a0a0a0'
      const color = ['#437FDF', '#2ecc71', '#F4664A']
      const min = this.min / this.max
      const max = this.max / this.max
      return item < min ? color[0] : item < max ? color[1] : color[2]
    },
    getTextColor(item) {
      const color = ['#437FDF', '#2ecc71', '#F4664A']
      const min = this.min / this.max
      const max = this.max / this.max
      return item < min ? color[0] : item < max ? color[1] : color[2]
    }
  }
}
</script>

<style lang="scss" scoped>
.chars {
  min-height: 250px;
  margin-bottom: 10px;
}
</style>
