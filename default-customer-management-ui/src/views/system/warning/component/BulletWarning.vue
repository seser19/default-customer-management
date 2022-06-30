<template>
  <div class="bullet">
    <div ref="bullet"></div>
  </div>
</template>

<script>
import { Bullet } from '@antv/g2plot';
export default {
  name: 'BulletWarning',
  mounted() {
    this.bulletPlot = new Bullet(this.$refs.bullet,this.options);
    this.bulletPlot.render();
  },
  props: {
    list:{
      type:Array,
      default:[]
    }
  },
  watch:{
    list(){
      this.options.data = this.list.map(r=>(
        {
          title:`${r.title}-${r.content}`,
          ranges:[r.min,r.max,r.max*1.3],
          '数量': [r.value],
          '阈值': [r.min,r.max],
        }))
      this.bulletPlot.update(this.options);
    }
  },
  data(){
    return{
      bulletPlot:null,
      options:{
        data:this.list.map(r=>(
          {
            title:`${r.title}-${r.content}`,
            ranges:[r.min,r.max,r.max*1.3],
            '数量': [r.value],
            '阈值': [r.min,r.max],
          })),
        measureField: '数量',
        rangeField: 'ranges',
        targetField: '阈值',
        xField: 'title',
        color: {
          range: ['#FFe0b0','#bfeec8','#FFbcb8'],
          measure: '#5B8FF9',
          target: '#e74c3c',
        },
        label: {
          measure: {
            position: 'middle',
            style: {
              fill: '#fff',
            },
          },
        },
        xAxis: {
          line: null,
        },
        autoFit:false,
        yAxis: {
          tickMethod: ({ max }) => {
            const interval = Math.ceil(max / 5);
            // 自定义刻度 ticks
            return [0, interval, interval * 2, interval * 3, interval * 4, max];
          },
        },
        // 自定义 legend
        legend: {
          custom: true,
          position: 'top',
          items: [
            {
              value: '安全值',
              name: '安全值',
              marker: { symbol: 'square', style: { fill:'#bfeec8' , r: 5 } },
            },
            {
              value: '超出',
              name: '超出',
              marker: { symbol: 'square', style: { fill: '#FFbcb8', r: 5 } },
            },
            {
              value: '实际值',
              name: '实际值',
              marker: { symbol: 'square', style: { fill: '#5B8FF9', r: 5 } },
            },
            {
              value: '阈值',
              name: '阈值',
              marker: { symbol: 'line', style: { stroke: '#e74c3c', r: 5 } },
            },
          ],
        },
      }
    }
  }
}
</script>

<style scoped>
.bullet{
  padding: 10px;
}
</style>
