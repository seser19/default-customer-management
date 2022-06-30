<template lang="pug">
.approvalProcess
  .ProcessTitle
    el-row
      el-col(:span="8" :offset="6")
        img(src="../icons/icon-create.png" height="42px")
        span 创建人：
        span 菜市口中队
      el-col(:span="8")
        img(src="../icons/icon-time.png" height="42px")
        span 创建时间：
        span 2019-10-10
  el-timeline
    el-timeline-item( v-for="(activity, index) in activities"
      :key="index"    
      :icon="activity.icon"
      :type="activity.type"
      :color="activity.color"
      :size="activity.size"
      :timestamp="activity.timestamp") 
      div {{activity.content}}
      div {{activity.content}}
      div {{activity.content}}
      div {{activity.content}}
      div {{activity.content}}
      div {{activity.content}}
      div {{activity.content}}
      div {{activity.content}}
      div {{activity.content}}
</template>
<script>
export default {
  data(){
    return{

      activities: [{
          content: '支持使用图标',
          timestamp: '2018-04-12 20:46',
          size: 'large',
          // type: 'primary',
          color:'#FB5938',
          icon: 'el-icon-check'
        }, {
          content: '支持自定义颜色',
          timestamp: '2018-04-03 20:46',
          color: '#FB5938',
          icon: 'el-icon-minus'
        }, {
          content: '支持自定义尺寸',
          timestamp: '2018-04-03 20:46',
          color: '#FB5938',
          
        }, {
          content: '默认样式的节点',
          timestamp: '2018-04-03 20:46',
          color: '#FB5938'
        }]
    }
  }
}
</script>
<style lang="stylus" scoped>
.approvalProcess
  .ProcessTitle
    height 62px
    margin 10px 0px 20px 0px
    background:rgba(244,246,248,1);
    border-radius:3px;
    border:1px solid rgba(196,205,213,0.22);
    .el-row
      .el-col
        height 62px
        line-height 62px
        img 
          vertical-align: middle
          margin-right 10px
        span 
          font-size:14px;
          font-weight:400;
          color:rgba(55,57,76,1);
          vertical-align: middle
          &:last-child
            font-size:18px;
            font-weight:500;
            color:rgba(57,60,65,1);
</style>