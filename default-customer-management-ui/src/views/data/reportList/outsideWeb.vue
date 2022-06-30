<template>
  <iframe :src="urlPath" frameborder="0"></iframe>
</template>

<script>
import {getToken} from "@/utils/auth.js";
export default {
    data() {
        return {
            urlPath: ""
        }
    },
    created() {
        let token = getToken();
        let url = this.$route.query.url;
        this.urlPath = url + "&token=" + token;
        console.log(url, token, this.urlPath)
    }
}
</script>

<style>
iframe {
    width: 100%;
    height: calc(100vh - 87px);;
}
</style>