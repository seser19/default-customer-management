<template>
  <div class="list_zone" v-loading="loading">
    <h5>{{title}}</h5>
    <ul>
      <li
        v-for="item in data"
        :key="item.areaId"
        @click="next(item)"
        :class="{'active': active.areaId == item.areaId}"
      >{{item.areaName}}</li>
    </ul>
  </div>
</template>

<script>
//import …… from '……';

export default {
  name: "",
  components: {},
  props: ["data", "listTitle", "type"],
  data() {
    return {
      loading: false,
      title: this.listTitle,
      active: {}
    };
  },
  mounted() {},
  //监听属性
  computed: {},
  //监控data中的数据变化
  watch: {},
  methods: {
    //点击列表中的一项
    next(item) {
      this.active = item;
      // console.log(item);
      this.$emit("change", {
        id: item.areaId,
        name: item.areaName,
        type: this.type + 1
      });
    },
    // 置空选中项
    empty() {
      this.active = "";
    }
  }
};
</script>
<style lang='stylus' scoped>
ul, li
  list-style none
h5
  font-size 14px
  font-weight 600
  color rgba(8, 8, 8, 1)
  margin 0 0 15px 0
.list_zone
  li
    cursor pointer
    margin-bottom 5px
    &:hover
      text-shadow 0 0 1px #888
  .active
    color #2296F3
    font-weight 600
    &:hover
      text-shadow none !important
</style>
