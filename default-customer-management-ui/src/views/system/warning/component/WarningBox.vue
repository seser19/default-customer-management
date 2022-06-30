<template>
  <div class="warningbox">
    <el-row :gutter="20">
      <el-col :span="6" v-for="(item,i) in list" :key="i">
        <warning :content="item.content" :max="item.max" :min="item.min" :value="item.value" :title="item.title"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Warning from '@/views/system/warning/component/Warning'
export default {
  name: 'WarningBox',
  components: { Warning },
  props:{
    list:{
      default:[]
    }
  }
}
</script>

<style scoped>
.warningbox{
  margin-top: 10px;
}
</style>
