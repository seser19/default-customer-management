<template lang="pug">
//- 统计报表内嵌测试
.dashboard
  //- iframe(width="100%" height="100%" :src="getIpAddress('custInfo') + '/custInfo/marketingSupport/tenderView'")
  //亚信云
  //iframe(width="100%" height="100%" :src="'http://'+url+'/datadiscovery/sso/union-entry?forward=/report/myreport/manage/report-list/manage_report?menuFlag=0\@hideMenu=1&token='+token")
  //华为云
  iframe(width="100%" height="100%" :src="'http://'+url+'/datadiscovery/sso/union-entry?forward=/report/myreport/manage/report-list/manage_report?menuFlag=0\@hideMenu=1&token='+token")
</template>

<script>
import {getToken} from "@/utils/auth.js"
export default {
  name: "Report",
  data(){
    return{
      token:'',
      url:'',
    }
  },
  created(){
    this.token = getToken();
    //亚信云
    if(window.location.hostname == "10.19.11.35" || window.location.hostname == "123.59.26.68"){
      this.url = "10.19.11.37:10060";//亚信云
    }else{
       this.url = "120.52.31.129"; //华为云
    }
  }
};
</script>

<style lang="scss" scoped>
.dashboard {
  height: calc(100vh - 84px);
}
</style>