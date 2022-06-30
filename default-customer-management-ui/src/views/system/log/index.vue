<template >
  <router-view />
</template>
<script>
  export default {
    name:'logmanagement',
    created() {
      const route = this.$route.matched.find(item => item.name === this.$options.name)
      this.$store.dispatch('tagsView/addCachedView', route)
    }
  }
</script>
