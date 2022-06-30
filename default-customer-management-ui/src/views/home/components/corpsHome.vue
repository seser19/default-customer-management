<style lang="scss" scoped>
::v-deep {
  .el-carousel__item {
    height: auto;
  }
}

.indexPage {
  .content {
    .section_spe {
      min-height: auto;
    }

    .section {
      height: auto;

      &.map-sec {
        height: 450px;
      }

      &.notice-sec {
        height: 450px;
      }

      .swipe_zone {
        height: 390px;
        margin: 22px 0 0 0;
      }

      .line_zone {
        height: 300px;
      }

      .txt_zone {
        padding: 35px 25px 22px;
      }

      .pie_zone {
        height: 400px;
      }
    }
  }
}
.enpty{
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: #6b717b;
}
</style>

<template>
  <div class="indexPage">
    <!-- 顶部 -->
    <div class="top">
      <div>
        <el-radio-group v-model="dateData" @change="getPageData()">
          <el-radio-button v-for="item in dateListData" :label="item" :key="item.value">{{
              item.name
            }}
          </el-radio-button>
        </el-radio-group>
      </div>
      <div>
        <area-tree @update-component-data="getPageData"/>
      </div>
      <div class="etlTime">
        <span>数据更新至</span>
        <span class="time">{{ etlTime || '-' }}</span>
      </div>
    </div>
    <!-- 重要指标 -->
    <el-row class="content section panel_group" v-loading="warningListDataLoading">
      <el-col class="panel_item" v-for="item in warningListData" :key="item.title" :xs="12" :sm="8" :md="6" :lg="4"
              :xl="4" :span="4"
      >
        <div class="label">
          <img :src="item.img"/>
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
    <!-- 地图图表&通知待办 -->
    <el-row class="content" :gutter="20">
      <!-- 地图图表 -->
      <el-col :xs="24" :sm="24" :lg="14" :span="14" v-loading="mapListDataLoading">
        <el-row class="section map-sec">
          <el-col :xs="24" :sm="17" :lg="17" :span="17">
            <div class="map_zone">
              <v-chart v-if="mapListData.length" ref="mapChart" :options="chartsOption.map" autoresize
                       :manual-update="true" @click="mapClickHandle"
              />
              <div v-else class="data-none">暂无数据</div>
              <el-button class="show-china-map" v-if="deptLevel === 1" plain
                         @click="mapClickHandle({ data: mapsSaveChinaData }, 'china')"
              >返回全国
              </el-button>
            </div>
          </el-col>
          <el-col :xs="24" :sm="7" :lg="7" :span="7">
            <div class="chart_title">火灾分布</div>
            <div v-if="mapListData.length" class="swipe_zone">
              <el-carousel trigger="click" height="300px" arrow="never" indicator-position="outside" :loop="false"
                           :autoplay="false"
              >
                <el-carousel-item v-for="(item,index) in mapListData" :key="index">
                  <div class="carousel-content" v-for="progress in item" :key="progress.areaId">
                    <div class="carousel-name" :title="progress.areaName">{{ progress.areaName }}</div>
                    <div class="carousel-line">
                      <div class="line-active"
                           :style="{width: (progress.hzqsCnt / chartsOption.map.visualMap.max) * 100 + '%' }"
                      ></div>
                    </div>
                    <div class="carousel-num">{{ progress.hzqsCnt }}</div>
                  </div>
                </el-carousel-item>
              </el-carousel>
            </div>
            <div v-else class="data-none">暂无数据</div>
          </el-col>
        </el-row>
      </el-col>
      <!-- 通知待办 -->
      <el-col :xs="24" :sm="24" :lg="10" :span="10">
        <div class="section notice-sec">
          <notice-todo-list/>
        </div>
      </el-col>
    </el-row>
    <!-- 柱状图&汇总说明 -->
    <el-row class="content" :gutter="20">
      <el-col :xs="24" :sm="24" :lg="24" :span="24">
        <el-row class="section section_spe">
          <div class="section_title">
            <div class="chart_title">主要统计指标</div>
            <el-radio-group v-model="targetData" @change="targetDataChange">
              <el-radio-button v-for="item in targetListData" :label="item" :key="item">{{ item }}</el-radio-button>
            </el-radio-group>
          </div>
          <div class="line_zone" v-loading="lineListDataLoading">
            <v-chart v-if="chartsOption.line.xAxis.data.length" :options="chartsOption.line" autoresize/>
            <div v-else class="data-none">暂无数据</div>
          </div>
          <div class="txt_zone" v-loading="barTextDataLoading" v-if="barTextData.areaName">
            <span>今{{ dateData.name }}以来{{ barTextData.areaName === '中国' ? '我国' : barTextData.areaName }}共接报警情</span>
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
    </el-row>
    <!-- 饼状图&警情排名 -->
    <el-row class="content" :gutter="20">
      <el-col :xs="24" :sm="24" :lg="14" :span="14">
        <el-row class="section section_spe">
          <div class="section_title">
            <div class="chart_title">警情类型</div>
            <el-radio-group v-model="typeData" @change="typeDataChange">
              <el-radio-button v-for="item in typeListData" :label="item" :key="item.value">{{
                  item.name
                }}
              </el-radio-button>
            </el-radio-group>
          </div>
          <div class="pie_zone" v-loading="pieListDataLoading">
            <v-chart v-if="chartsOption.pie.series[0].data.length" :options="chartsOption.pie" autoresize/>
            <div v-else class="data-none">暂无数据</div>
          </div>
        </el-row>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="10" :span="10">
        <el-row class="section section_spe">
          <div class="section_title">
            <div class="chart_title">警情和出动榜单</div>
            <el-radio-group v-model="rankType" @change="rankList = rankListCollect[rankType.value];">
              <el-radio-button v-for="o in rankTypeOption" :label="o" :key="o.value">{{ o.name }}</el-radio-button>
            </el-radio-group>
          </div>
          <div class="rank-list">
            <ul>
              <li v-for="(r, index) in rankList" :key="r.count">
                <span class="rank-num"
                      :class="{'medal-gold': index === 0, 'medal-silver': index === 1, 'medal-bronze': index === 2}"
                >{{ index > 2 ? index + 1 : '' }}</span>
                <div class="team"><span>{{ r.name }}</span></div>
                <span class="count">{{ r.qsCnt + '次' }}</span>
              </li>
            </ul>
          </div>
        </el-row>
      </el-col>
    </el-row>
    <el-row class="content" :gutter="20" v-loading="dataLoading">
      <el-col :span="24">
        <div class="section">
          <div class="section_title">
            <div class="chart_title">阈值预警</div>
            <el-button type="primary" @click="$router.push({path:'warninglist'})" round icon="el-icon-warning-outline">更多</el-button>
          </div>
          <div class="enpty" v-if="!list.length">无数据</div>
          <el-row :gutter="24" v-else>
            <el-col v-for="(item,i) in list" :key="i" :xs="12" :sm="8" :lg="6" :xl="6" :span="6">
              <warning :content="item.content" :max="item.max" :min="item.min" :value="item.value" :title="item.title"/>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// 基于 el-cascader 组件，自定义一个区域结构树组件
import AreaTree from '@/components/AreaTree'
// 通知公告和待办事项组件
import NoticeTodoList from './NoticeTodoList'
// api
import { corpsHome, commonHome } from '@/api/index'
// 省市字典
import {
  getProvincesMap,
  getCityMap,
  getMapJSONData
} from '@/utils/mapDictionary'
// chunk 将数组（array）拆分成多个 size 长度的区块，并将这些区块组成一个新数组。 如果array 无法被分割成全部等长的区块，那么最后剩余的元素将组成一个区块。
// maxBy 取数组中某个属性值最大的元素
import { chunk, maxBy } from 'lodash-es'
import Warning from '@/views/system/warning/component/Warning'
import BulletWarning from '@/views/system/warning/component/BulletWarning'
import { getWarningData, getWarningList } from '@/api/system/warning'

export default {
  name: 'corpsHome',
  components: {
    BulletWarning,
    Warning,
    AreaTree,
    NoticeTodoList
  },
  data() {
    return {
      //仪表盘
      list:[],
      dataLoading:false,
      // 更新时间
      etlTime: '',
      // 页面通用的接口入参
      pagePostData: {
        cyc: 'Y',
        areaId: null,
        // 指标ID（10001：警情；10002：火灾扑救；10003：抢险救援）pagePostData.cyc + 后面的编号
        kpiId: '10001'
      },
      // 页面使用的图表配置
      chartsOption: {
        map: {
          tooltip: {
            formatter: params => {
              let { data } = params
              return (
                params.name +
                '<br/>火灾起数：' +
                (data ? data.hzqsCnt : '-') +
                '<br/>占比：' +
                (data ? data.hzqszb : '-') +
                '%' +
                '<br/>同比：' +
                (data ? data.tbHzqsValue : '-') +
                '%' +
                (!!(data && data.tbHzqsValue > 0)
                  ? '<span style=\'color:white\' class=\'el-icon-top\'></span>'
                  : '<span style=\'color:white\' class=\'el-icon-bottom\'></span>')
              )
            }
          },
          series: [{
            name: '火灾起数',
            type: 'map',
            // 默认展示的比例
            zoom: 1.2,
            // 是否开启平游或缩放
            roam: true,
            // 滚轮缩放的极限控制
            scaleLimit: {
              min: 1,
              max: 10
            },
            map: '',
            // left: "10%",
            itemStyle: {
              normal: {
                // 未选中状态
                borderWidth: 1, // 边框大小
                areaColor: '#A3A3A3',
                borderColor: '#fff',
                label: {
                  show: true, // 显示名称
                  textStyle: {
                    color: '#fff'
                  }
                }
              },
              emphasis: {
                // 悬停样式
                borderWidth: 2,
                areaColor: '#0F76FD',
                shadowBlur: 10,
                shadowColor: 'rgba(79, 167, 225, 0.8)',
                label: {
                  show: true,
                  textStyle: {
                    color: '#fff'
                  }
                }
              }
            },
            data: []
          }]
        },
        line: {
          backgroundColor: '#fff',
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: params => {
              let tooltipContent = params[0].name + '<br>'
              tooltipContent += params[0].seriesName + '：' + params[0].data + '<br>'
              if (params.length > 1) {
                tooltipContent += params[1].seriesName + '：' + params[1].data + '<br>'
                tooltipContent += '同比：' + this.lineListData[this.currentBarData]['同比'][params[0].dataIndex] + '%'
              }
              return tooltipContent
            }
          },
          grid: {
            left: '2%',
            right: '3%',
            bottom: 0,
            top: '16%',
            containLabel: true
          },
          legend: {
            data: ['本年', '上年'],
            top: 12,
            textStyle: {
              color: '#333333'
            },
            itemWidth: 10,
            itemHeight: 10
          },
          xAxis: {
            type: 'category',
            data: [],
            axisLine: {
              lineStyle: {
                color: '#E6E6E6'
              }
            },
            axisLabel: {
              interval: 0,
              textStyle: {
                color: '#333333'
              }
            },
            axisTick: {
              show: false
            }
          },
          yAxis: {
            type: 'value',
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
                color: '#333333'
              }
            }
          },
          series: [{
            name: '本年',
            type: 'bar',
            barWidth: 15,
            itemStyle: {
              normal: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0,
                    color: '#F59A00' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: '#FE1313' // 100% 处的颜色
                  }],
                  global: false // 缺省为 false,
                },
                barBorderRadius: 7
              }
            },
            data: []
          }, {
            name: '上年',
            type: 'bar',
            barWidth: 15,
            barGap: '70%',
            itemStyle: {
              normal: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0,
                    color: '#2BA9FF' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: '#1370FE' // 100% 处的颜色
                  }],
                  global: false // 缺省为 false,
                },
                barBorderRadius: 7
              }
            },
            data: []
          }]
        },
        pie: {
          color: [
            '#7613FE',
            '#1890FF',
            '#00C2C3',
            '#7ED321',
            '#FF801D',
            '#FFC41D',
            '#00C41D'
          ],
          backgroundColor: '#fff',
          title: {
            text: '',
            subtext: '总数',
            textAlign: 'center',
            itemGap: 3,
            textStyle: {
              color: '#000000',
              fontSize: 27,
              fontWeight: 'bold'
            },
            subtextStyle: {
              color: '#333333',
              fontSize: 13
            },
            left: '27%',
            top: '42%'
          },
          tooltip: {
            show: true
          },
          series: [{
            name: '警情',
            type: 'pie',
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
            name: 'shadow',
            hoverAnimation: false,
            type: 'pie',
            radius: [99, 111],
            center: ['28%', '47%'],
            avoidLabelOverlap: false,
            legendHoverLink: false,
            silent: true,
            label: {
              normal: {
                show: false,
                position: 'center'
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
            orient: 'vertical',
            show: true,
            left: '59%',
            right: '3%',
            top: '7%',
            bottom: '7%',
            y: 'center',
            itemWidth: 10,
            itemHeight: 10,
            radius: 0,
            itemGap: 25,
            pageButtonGap: 30,
            textStyle: {
              color: '#333333',
              fontSize: 13,
              lineHeight: 20,
              rich: {
                percent: {
                  color: '#fff',
                  fontSize: 16
                }
              }
            },
            formatter: params => {
            }
          }
        }
      },
      // 时间筛选列表 (D:日指标;M:月指标； Y:年度指标)
      dateListData: [{
        value: 'Y',
        name: '年'
      }, {
        value: 'M',
        name: '月'
      }, {
        value: 'D',
        name: '日'
      }],
      dateData: {
        value: 'Y',
        name: '年'
      },
      // 顶部 重点指标列表
      warningListData: [{
        title: '总警情数',
        img: require('@/assets/image/index/icon_zjqs.svg'),
        num: '',
        unit: '起',
        percent: ''
      }, {
        title: '火灾起数 (含未填报)',
        img: require('@/assets/image/index/icon_hzqs.svg'),
        num: '',
        unit: '起',
        percent: ''
      }, {
        title: '轻微火灾',
        img: require('@/assets/image/index/icon_qwhz.svg'),
        num: '',
        unit: '起',
        percent: ''
      }, {
        title: '死亡人数',
        img: require('@/assets/image/index/icon_swrs.svg'),
        num: '',
        unit: '人',
        percent: ''
      }, {
        title: '受伤人数',
        img: require('@/assets/image/index/icon_ssrs.svg'),
        num: '',
        unit: '人',
        percent: ''
      }, {
        title: '直接经济损失',
        img: require('@/assets/image/index/icon_jjss.svg'),
        num: '',
        unit: '万元',
        percent: ''
      }],
      warningListDataLoading: false,
      // 地图列表 数据
      mapListData: [],
      mapListDataLoading: false,
      // 储存全国地图的数据
      mapsSaveChinaData: {},
      // 储存地图点击下钻时回调的数据
      mapSaveData: {},
      // 柱状图列表 指标
      targetData: '总警情',
      targetListData: ['总警情', '火灾', '死亡', '受伤', '直接损失'],
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
        value: '10001',
        name: '警情'
      },
      typeListData: [{
        value: '10001',
        name: '警情'
      }, {
        value: '10002',
        name: '火灾'
      }, {
        value: '10003',
        name: '抢险救援'
      }],
      rankTypeOption: [{
        name: '中队出动',
        value: 'setOff'
      }, {
        name: '警情数',
        value: 'warning'
      }],
      rankType: {
        name: '中队出动',
        value: 'setOff'
      },
      rankListCollect: {
        setOff: [{
          label: '杭州市上城区近江消防救援站A',
          count: 1557
        }, {
          label: '杭州市上城区近江消防救援站B',
          count: 1369
        }, {
          label: '杭州市上城区近江消防救援站C',
          count: 1099
        }, {
          label: '杭州市上城区近江消防救援站D',
          count: 1023
        }, {
          label: '杭州市上城区近江消防救援站E',
          count: 983
        }, {
          label: '杭州市上城区近江消防救援站F',
          count: 943
        }, {
          label: '杭州市上城区近江消防救援站G',
          count: 921
        }, {
          label: '杭州市上城区近江消防救援站H',
          count: 899
        }, {
          label: '杭州市上城区近江消防救援站I',
          count: 733
        }, {
          label: '杭州市上城区近江消防救援站J',
          count: 650
        }],
        warning: [{
          label: '杭州市滨江区',
          count: 109
        }, {
          label: '南京市玄武区',
          count: 107
        }, {
          label: '杭州市滨江区',
          count: 100
        }, {
          label: '杭州市滨江区',
          count: 95
        }, {
          label: '杭州市滨江区',
          count: 87
        }, {
          label: '杭州市滨江区',
          count: 86
        }, {
          label: '杭州市滨江区',
          count: 79
        }, {
          label: '杭州市滨江区',
          count: 52
        }, {
          label: '杭州市滨江区',
          count: 33
        }, {
          label: '杭州市滨江区',
          count: 19
        }]
      },
      rankList: []
    }
  },
  computed: {
    ...mapGetters(['deptLevel']),
    isTb() {
      return this.dateData.value === 'Y' ? '同比' : '环比'
    }
  },
  created() {
    const me = this
    me.getEtlTimeDatas()
  },
  methods: {
    /**
     * 获取页面基本数据
     */
    async getPageData(data) {
      const me = this
      me.pagePostData.cyc = me.dateData.value
      if (data) {
        const { areaId, areaName, areaLevel } = data
        me.pagePostData.areaId = areaId

        // 地图数据特殊处理
        me.getWarningData();
        me.transformMapData(data)
      } else {
        // 如果不是区域发生改变的话，只需要请求一下数据即可
        const mapResolve = await me.getMapChartDatas()
        me.$refs.mapChart.mergeOptions(me.chartsOption.map, true)
      }
      me.getIndexWarning()
      me.getBarChartDatas()
      me.getBarTitleDatas()
      me.getPieChartDatas()
      me.getKpiRanking()
    },
    async getWarningData() {
      this.dataLoading = true
      const data =await getWarningData(this.pagePostData.areaId, this.dateData.value)
      let list = await getWarningList({ areaIds: this.pagePostData.areaId, thresholdCyc: this.dateData.value })
      if (list) {
        list = list[this.pagePostData.areaId][0].warning
        this.list = list.map(r => ({
          ...r,
          value: data[r.thresholdType],
          max: Math.floor(r.thresholdValueMax),
          min: Math.floor(r.thresholdValueMin),
          title: r.areaName,
          content: r.thresholdName
        })).splice(0,4)
      }
      this.dataLoading = false
    },
    /**
     * 获取 顶部 重点指标列表 数据
     */
    getIndexWarning() {
      const me = this
      me.warningListDataLoading = true
      // 转换 kpiId 字段
      let params = { ...me.pagePostData }
      let { cyc, kpiId } = params
      params.kpiId = cyc + kpiId
      corpsHome.getIndexWarning(params).then(res => {
        const { code, data } = res
        if (code === 200 && data && data[0]) {
          const saveData = data[0]
          me.warningListData.forEach((element, index) => {
            switch (index) {
              case 0:
                element.num = saveData.zqsCnt
                element.percent = saveData.tbZqsValue
                break
              case 1:
                element.num = saveData.hzqsCnt
                element.percent = saveData.tbHzqsValue
                break
              case 2:
                element.num = saveData.qwhzCnt
                element.percent = saveData.tqQwhzValue
                break
              case 3:
                element.num = saveData.swrsCnt
                element.percent = saveData.tbSwrsValue
                break
              case 4:
                element.num = saveData.ssrsCnt
                element.percent = saveData.tbSsrsValue
                break
              case 5:
                element.num =
                  saveData.zjssFee && (saveData.zjssFee / 10000).toFixed(1)
                element.percent = saveData.tbZjssValue
                break

              default:
                break
            }
          })
        } else {
          me.warningListData.forEach((element, index) => {
            element.num = 0
            element.percent = 0
          })
        }
      }).finally(() => {
        me.warningListDataLoading = false
      })
    },
    /**
     * 获取 地图列表 数据
     */
    getMapChartDatas(areaId) {
      const me = this
      me.mapListDataLoading = true
      let params = { ...me.pagePostData }
      if (areaId) {
        params.areaId = areaId
        me.pagePostData.areaId = areaId
      }
      // 转换 kpiId 字段
      let { cyc, kpiId } = params
      params.kpiId = cyc + kpiId
      return new Promise(resolve => {
        corpsHome.getMapChartDatas(params).then(res => {
          let { code, data } = res
          if (code === 200 && data && data.length) {
            // 转换数据
            me.mapListData = chunk(data, 8)
            data.forEach(element => {
              element.name = element.areaName
              element.value = element.hzqsCnt
            })

            me.chartsOption.map.series[0].data = data

            // 设置左下角映射柱
            const maxNum = maxBy(data, o => {
              return o.hzqsCnt
            }).hzqsCnt

            me.chartsOption.map.visualMap = {
              min: 0,
              max: maxNum,
              realtime: false,
              calculable: false, // 拖拽手柄
              align: 'left',
              splitNumber: 4,
              precision: 1,
              inRange: {
                color: ['#6FACFD', '#E8E80F', '#F29617', '#CE2C33']
              },
              itemWidth: 10,
              text: [maxNum, 0], // 两端文本
              textStyle: {
                color: '#777777'
              }
            }
          } else {
            me.mapListData = []
            me.chartsOption.map.series[0].data = []
          }
        }).finally(() => {
          resolve('ok')
          me.mapListDataLoading = false
        })
      })
    },
    /**
     * 获取 主要统计指标列表 数据
     */
    getBarChartDatas() {
      const me = this
      me.lineListDataLoading = true
      // 转换 kpiId 字段
      let params = { ...me.pagePostData }
      let { cyc, kpiId } = params
      params.kpiId = cyc + kpiId
      corpsHome.getBarChartDatas(params).then(res => {
        let { code, data } = res
        // 数据初始化
        me.lineListData = {
          '总警情': {},
          '火灾': {},
          '死亡': {},
          '受伤': {},
          '直接损失': {}
        }
        me.chartsOption.line.xAxis.data = []
        me.chartsOption.line.legend.data = []
        if (code === 200 && data && data.length) {
          const dateType = me.dateData.name
          // 自定义筛选字段
          for (let key in me.lineListData) {
            me.lineListData[key][`本${dateType}`] = []
            me.lineListData[key][`上${dateType}`] = []
            me.lineListData[key][`同比`] = []
          }
          // 柱状图数据
          data.forEach(element => {
            me.chartsOption.line.xAxis.data.push(element.areaName)

            me.lineListData['总警情'][`本${dateType}`].push(element.zqsCnt)
            me.lineListData['总警情'][`上${dateType}`].push(element.tqZqsZnt)
            me.lineListData['总警情'][`同比`].push(element.tbZqsValue)

            me.lineListData['火灾'][`本${dateType}`].push(element.hzqsCnt)
            me.lineListData['火灾'][`上${dateType}`].push(element.tqHzqsCnt)
            me.lineListData['火灾'][`同比`].push(element.tbHzqsValue)

            me.lineListData['死亡'][`本${dateType}`].push(element.swrsCnt)
            me.lineListData['死亡'][`上${dateType}`].push(element.tqSwrdCnt)
            me.lineListData['死亡'][`同比`].push(element.tbSwrsValue)

            me.lineListData['受伤'][`本${dateType}`].push(element.ssrsCnt)
            me.lineListData['受伤'][`上${dateType}`].push(element.tqSsrsCnt)
            me.lineListData['受伤'][`同比`].push(element.tbSsrsValue)

            me.lineListData['直接损失'][`本${dateType}`].push(element.zjssFee)
            me.lineListData['直接损失'][`上${dateType}`].push(element.tqZjssFee)
            me.lineListData['直接损失'][`同比`].push(element.tbZjssValue)
          })
          // 根据行政区域数量自适应柱的粗细和x轴标签的旋转
          if (this.chartsOption.line.xAxis.data.length < 21) {
            this.chartsOption.line.xAxis.axisLabel.rotate = 0
            this.chartsOption.line.series.map(barConfig => {
              barConfig.barWidth = 15
            })
          } else {
            this.chartsOption.line.xAxis.axisLabel.rotate = 45
            this.chartsOption.line.series.map(barConfig => {
              barConfig.barWidth = 6
            })
          }
          // 设置默认值
          me.targetDataChange('总警情')
        }
      }).finally(() => {
        me.lineListDataLoading = false
      })
    },
    /**
     * 获取 主要统计指标列表下面的描述文字 数据
     */
    getBarTitleDatas() {
      const me = this
      me.barTextDataLoading = true
      // 转换 kpiId 字段
      let params = { ...me.pagePostData }
      let { cyc, kpiId } = params
      params.kpiId = cyc + kpiId
      corpsHome.getBarTitleDatas(params).then(res => {
        let { code, data } = res
        if (code === 200 && data && data[0]) {
          me.barTextData = data[0]
        } else {
          me.barTextData = {}
        }
      }).finally(() => {
        me.barTextDataLoading = false
      })
    },
    /**
     * 获取 警情类型图表 数据
     */
    getPieChartDatas() {
      const me = this
      me.pieListDataLoading = true
      // 转换 kpiId 字段
      let params = { ...me.pagePostData }
      let { cyc, kpiId } = params
      params.kpiId = cyc + kpiId
      corpsHome.getPieChartDatas(params).then(res => {
        let { code, data } = res
        // 数据初始化
        me.chartsOption.pie.title.text = ''
        me.chartsOption.pie.title.subtext = me.typeData.name + '总数'
        if (me.typeData.name === '火灾') {
          me.chartsOption.pie.title.subtext += ' (含未填报)'
        }
        me.chartsOption.pie.series[0].name = me.typeData.name
        me.chartsOption.pie.series[0].data = me.chartsOption.pie.series[1].data = []
        if (code === 200 && data && data.length) {
          let total = 0
          data.forEach(element => {
            total += element.indexValue || 0
            element.name = element.indexName
            element.value = element.indexValue
          })
          me.chartsOption.pie.series[0].data = me.chartsOption.pie.series[1].data = data
          me.chartsOption.pie.title.text = total
          // 生成 legend 文本
          me.chartsOption.pie.legend.formatter = name => {
            const index = data.findIndex(item => {
              return item.name === name
            })
            if (index !== -1) {
              const currentData = data[index]
              return `${name}\n起数：${currentData.value}  占比：${currentData.indexZb}%`
            } else {
              return '-'
            }
          }
        }
      }).finally(() => {
        me.pieListDataLoading = false
      })
    },
    /**
     * 柱状图 列表 指标改变回调
     */
    targetDataChange(data) {
      const me = this
      const dateType = me.dateData.name
      me.currentBarData = data
      me.chartsOption.line.series.forEach((element, index) => {
        switch (index) {
          case 0:
            element.name = `本${dateType}`
            break
          case 1:
            element.name = `上${dateType}`
            break
          case 2:
            element.name = `同比`
            break

          default:
            break
        }
        me.chartsOption.line.legend.data.push(element.name)
        element.data = me.lineListData[data][element.name]
      })
    },
    /**
     * 饼图 列表 类型改变回调
     */
    typeDataChange(data) {
      const me = this
      if (data && data.value) {
        me.pagePostData.kpiId = data.value
        me.getPieChartDatas()
      }
    },
    /**
     * 单独处理地图数据
     */
    async transformMapData(data) {
      const me = this
      me.mapSaveData = { ...data }
      const { areaId, areaName, areaLevel } = data
      // 储存全国地图的数据
      areaLevel === 1 && (me.mapsSaveChinaData = { ...data })
      me.chartsOption.map.series[0].map = areaName
      // 等待接口请求完成，再执行下面的代码
      const mapResolve = await me.getMapChartDatas(areaId)
      me.chartsOption.map.series[0].itemStyle.normal.label.show = true
      // areaLevel（区域级别字段）字段是否是1（中国）,2（省份）,3（地市）
      let mapJson = {}
      switch (areaLevel) {
        case 1:
          me.chartsOption.map.series[0].itemStyle.normal.label.show = false
          mapJson = (await getMapJSONData(`/china.json`)) || {}
          // mapJson = require("@/utils/map/json/china.json");

          break
        case 2:
          const provinceName = getProvincesMap(areaName)
          mapJson =
            (await getMapJSONData(`/province/${provinceName}.json`)) || {}
          // mapJson = require(`@/utils/map/json/province/${provinceName}.json`);
          break
        case 3:
          const cityName = getCityMap(areaName)
          mapJson = (await getMapJSONData(`/city/${cityName}.json`)) || {}
          // mapJson = require(`@/utils/map/json/city/${cityName}.json`);
          break

        default:
          break
      }
      me.$refs.mapChart && me.$refs.mapChart.clear()
      // 容错处理
      if (mapJson.features) {
        mapJson.features.forEach(element => {
          // 强行让地图中的文字居中 https://github.com/apache/incubator-echarts/issues/4866#issuecomment-270562424
          delete element.properties.cp
        })
        // 手动注册地图，需要主要的地方：这里一定得是中文名称才行
        me.$echarts.registerMap(`${areaName}`, mapJson)
        // 手动设置数据
        me.$refs.mapChart &&
        me.$refs.mapChart.mergeOptions(me.chartsOption.map, true)
      }
    },
    /**
     * 地图图表 单击下钻回调
     *  name 专为上钻回全国时使用的
     */
    mapClickHandle(params, name) {
      const me = this
      let { data } = params

      // 如果无数据或者在地图黑名单中，直接返回
      const mapBlackList = [
        '北京市',
        '重庆市',
        '上海市',
        '天津市',
        '香港特别行政区',
        '澳门特别行政区'
      ]

      if (!data || mapBlackList.indexOf(data.areaName) !== -1) {
        return
      }
      /**
       * 首先判断当前用户级别得是总队及以上的
       * 然后判断 无数据 或者 级别为 4 -> 区县
       * 且不是上钻回全国时
       * 需要 返回上一级
       */
      if (me.deptLevel <= 2 && (!data || data.areaLevel === 4) && !name) {
        data = { ...me.mapSaveData }
        let { parentId, parentAreaName, parentAreaLevel } = me.mapSaveData
        data.areaId = parentId
        data.areaName = parentAreaName
        data.areaLevel = parentAreaLevel
      }
      // 判断一下区域级别，避免出错(杭州支队)
      data.areaName && data.areaLevel !== 4 && me.transformMapData(data)
    },
    /**
     * [getEtlTimeDatas 获取更新时间]
     * @Author       Miliky
     * @DateTime     2020-01-22T22:58:43+0800
     * @return       {void}
     */
    getEtlTimeDatas() {
      const $this = this
      commonHome.getEtlTimeDatas().then(res => {
        if (res.code === 200) {
          $this.etlTime = res.data[0].etlTime || ''
        }
      }).catch(e => {
      }).finally(() => {
      })
    },
    // 获取指标排名
    getKpiRanking() {
      let params = { ...this.pagePostData }
      let { cyc, kpiId } = params
      params.kpiId = cyc + kpiId
      corpsHome.getKpiRanking(params).then(response => {
        if (response.code === 200) {
          this.rankListCollect.setOff = response.data.reslistteam || []
          this.rankListCollect.warning = response.data.reslistarea || []
          this.rankList = this.rankListCollect[this.rankType.value]
        }
      }).catch(e => {
      }).finally(() => {
      })
    }
  }
}
</script>
