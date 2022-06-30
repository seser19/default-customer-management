<template>
  <div class="fireDistribution" v-loading="loading">
    <v-chart v-if="options.series[0].data.length" :options="options" autoresize/>
    <div v-else class="data-none">暂无数据</div>
  </div>
</template>

<script>
import { corpsHome } from '@/api'

export default {
  name: 'fireDistribution',
  watch:{
    areaId(id){
      if(id){
        setTimeout(()=>{
          this.getPieChartDatas();
        },500)
      }
    },
    cyc(){
      if(this.areaId){
        this.getPieChartDatas();
      }
    }
  },
  props:{
    cyc:{
      default:"Y"
    },
    areaId:{
      default:0
    }
  },
  data(){
    return{
      options: {
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
      },
      loading:false,
      kpild:"Y10002"
    }
  },
  methods:{
    getPieChartDatas() {
      this.loading = true
      corpsHome.getPieChartDatas({cyc:this.cyc,areaId:this.areaId,kpiId:this.kpild}).then(res => {
        let { code, data } = res
        // 数据初始化
        this.options.title.text = ''
        this.options.title.subtext = '火灾总数'
        this.options.title.subtext += ' (含未填报)'
        this.options.series[0].name = '火灾'
        this.options.series[0].data = this.options.series[1].data = []
        if (code === 200 && data && data.length) {
          let total = 0
          data.forEach(element => {
            total += element.indexValue || 0
            element.name = element.indexName
            element.value = element.indexValue
          })
          this.options.series[0].data = this.options.series[1].data = data
          this.options.title.text = total
          // 生成 legend 文本
          this.options.legend.formatter = name => {
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
        this.loading = false
      })
    },
  }
}
</script>

<style scoped>
.fireDistribution{
  height: 300px;
}
</style>
