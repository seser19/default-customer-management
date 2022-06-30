<template>
  <div v-loading="mapListDataLoading" class="chars">
    <v-chart v-if="mapListData.length" ref="mapChart" :options="options" autoresize
             :manual-update="true" @click="mapClickHandle"
    />
    <div class="none" v-else>暂无数据</div>
  </div>
</template>

<script>
import { corpsHome } from '@/api'
import { chunk } from 'lodash-es'
import { getCityMap, getMapJSONData, getProvincesMap } from '@/utils/mapDictionary'
import { getArea } from '@/api/system/area'
import { getWarningList } from '@/api/system/warning'

export default {
  name: 'chinaChars',
  props: {
    areaId: {
      default: ''
    },
    dateKey: {
      default: 'Y'
    }
  },
  watch: {
    areaId: {
      handler(v) {
        this.$nextTick(() => {
          if (v) {
            this.getMapChartDatas()
          }
        })
      }
    },
    dateKey() {
      this.getMapChartDatas()
    }
  },
  data() {
    return {
      mapListData: [],
      mapListDataLoading: false,
      options: {
        tooltip: {
          formatter: params => {
            let { data } = params
            return `${params.name}<br/>火灾起数：${data.hzqsCnt}<br/>${data.max ? `最大值：${data.max}<br/>最小值：${data.min}` : '未设置阈值'}`
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
              areaColor: '#6FACFD',
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
              areaColor: '#2980b9',
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
      }
    }
  },
  methods: {
    mapClickHandle(data) {
      this.$emit('clickArea', data)
    },
    getMapChartDatas() {
      this.mapListDataLoading = true

      corpsHome.getMapChartDatas({ cyc: this.dateKey, areaId: this.areaId }).then(async res => {
        let { code, data } = res
        if (code === 200 && data && data.length) {
          // 转换数据
          this.mapListData = chunk(data, 8)
          const fireWarning = await getWarningList({ areaIds: data.map(r => r.areaId).join(',') })
          data.forEach(element => {
            element.max = 0
            element.min = 0
            const s = fireWarning[element.areaId][0].warning
            if (s.length && s[0].thresholdType === 12) {
              element.max = parseInt(s[0].thresholdValueMax) || 0
              element.min = parseInt(s[0].thresholdValueMin) || 0
            }
            element.name = element.areaName
            element.value = element.hzqsCnt
          })
          const color = (value,max,min)=>{
            if(!max&&!min) return "#bdc3c7"
            else if (value>=min&&value<max) return "#2ecc71"
            else if(value>=max) return "#e74c3c"
            else return "#6FACFD"
          }
          this.options.series[0].data = data.map(r=>({
            ...r,
            itemStyle: {
              color: color(r.value,r.max,r.min),
              areaColor:color(r.value,r.max,r.min),
            }
          }))
          this.transformMapData()
        } else {
          this.mapListDataLoading = false
          this.mapListData = []
          this.options.series[0].data = []
        }
      })
    },
    async transformMapData() {
      const area = (await getArea(this.areaId)).data
      this.options.series[0].map = area.areaName
      // 等待接口请求完成，再执行下面的代码
      this.options.series[0].itemStyle.normal.label.show = true
      // areaLevel（区域级别字段）字段是否是1（中国）,2（省份）,3（地市）
      let mapJson = {}
      switch (area.areaLevel) {
        case 1:
          this.options.series[0].itemStyle.normal.label.show = false
          mapJson = (await getMapJSONData(`/china.json`)) || {}
          break
        case 2:
          const provinceName = getProvincesMap(area.areaName)
          mapJson =
            (await getMapJSONData(`/province/${provinceName}.json`)) || {}
          break
        case 3:
          const cityName = getCityMap(area.areaName)
          mapJson = (await getMapJSONData(`/city/${cityName}.json`)) || {}
          break
        default:
          break
      }
      this.$refs.mapChart && this.$refs.mapChart.clear()
      // 容错处理
      if (mapJson.features) {
        mapJson.features.forEach(element => {
          delete element.properties.cp
        })
        // 手动注册地图，需要主要的地方：这里一定得是中文名称才行
        this.$echarts.registerMap(`${area.areaName}`, mapJson)
        // 手动设置数据
        this.$refs.mapChart &&
        this.$refs.mapChart.mergeOptions(this.options, true)
      }
      this.mapListDataLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.chars {
  height: 300px;
}

.none {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 25px;
  color: #6b717b;
}
</style>
