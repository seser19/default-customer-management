<style lang="scss" scoped>
.datetime-range {
  .form-item {
    display: flex;
  }
  .form-item-ctrl {
    display: inline-flex;
    height: 32px;
    flex-grow: 1;
    .el-date-editor.el-input{
        width: 30.5% !important;
      }
    .tilde{
      width: 4%;
      height: 32px;
      line-height: 32px;
      font-size: 15px;
      text-align: center;
    }
    .select-item{
      width: 23%;
      margin-left: 10px;
    }
  }
}
</style>
<template>
  <div class="datetime-range">
    <div v-if="format == 'dateTime'">
      <div class="form-item-ctrl">
        <el-date-picker
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="['00:00:00']"
          v-model="startTime"
          placeholder="接警时间(起)"
          :clearable = "false"
          @change="checkJjsj()"
        ></el-date-picker>
        <span class="tilde">~</span>
        <el-date-picker
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="['00:00:00']"
          v-model="endTime"
          placeholder="接警时间(止)"
          :clearable = "false"
          @change="checkJjsj()"
        ></el-date-picker>
        <el-select
          v-model="selectDate"
          placeholder="请选择"
          @change="dateRangeBtn(selectDate)"
          class="form-item-ctrl"
        >
          <el-option
            v-for="item in dateList"
            :key="item.value"
            :value="item.value"
          >
          <span @click="dateRangeBtn(selectDate)">{{item.name}}</span>
          </el-option>
        </el-select>
      </div>
    </div>
    <div v-if="format == 'date'">
      <div class="form-item">
        <div class="form-item-ctrl">
          <el-date-picker
            type="date"
            value-format="yyyy-MM-dd"
            v-model="form.ksrq"
            placeholder="接警时间(起)"
            :clearable = "false"
            :editable="false"
            @change="checkStart"
            :picker-options="pickerOptions"
          ></el-date-picker>
          <span class="tilde">~</span>
          <el-date-picker
            type="date"
            value-format="yyyy-MM-dd"
            v-model="form.jsrq"
            :editable="false"
            placeholder="接警时间(止)"
            :clearable = "false"
            @change="checkEnd"
          ></el-date-picker>
          <el-select
            v-model="selectDate"
            placeholder="请选择"
            @change="dateRangeBtn(selectDate)"
            class="select-item"
          >
            <el-option
              v-for="item in dateList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { formdate, getNearlyRecentDays } from "@/utils/dateTimeUtils.js";
export default {
  name: "dateTimeRange",
  props: ["format","isInit"],
  data() {
    return {
      pickerOptions: {
          disabledDate(time) {
          const timeLimit = new Date('2022.1.1').getTime();
          return time.getTime() > Date.now() || time.getTime() < timeLimit;
          }
      },
      form: {
        ksrq: "",
        jsrq: ""
      },
      startTime: "",
      endTime: "",
      dateList: [
        {
          value: 1,
          name: "最近一周",
        },
        {
          value: 2,
          name: "最近一个月",
        },
        {
          value: 3,
          name: "本月",
        },
        {
          value: 4,
          name: "本年",
        },
        {
          value: 5,
          name: "上个月",
        },
        // {
        //   value: 6,
        //   name: '上年',
        // }
      ],
      selectDate: 2,
    };
  },
  methods: {
    dateRangeBtn(date) {
      this.dateRange = [];
      let end = new Date();
      let start = new Date();
      let year = start.getFullYear();
      let month = start.getMonth();
      start.setHours(0, 0, 0, 0);
      end.setHours(23,59,59)
      if(month==0)
      {
          month=12;
          year=year-1;
      }
      if (month < 10) {
          month = "0" + month;
      }
      switch (date) {
        case 1:
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
          break;
        case 2:
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
          break;
        case 3:
          start.setDate(1);
          break;
        case 4:
          start.setMonth(0);
          start.setDate(1);
          break;
        case 5:
          if(month == 0){
            month = 12;
            year = year-1;
          }else if(month < 10){
            month = '0' + month;
          }
          let myDate = new Date(year, month, 0);
          start = year + '-' + month + "-" + "01";
          end = year + '-' + month + '-' +  myDate.getDate();
          break;
        case 6:
          let yearNow = new Date().getFullYear()-1;
          start = yearNow + '-01-01';
          end = yearNow + '-12-31';
          break;
      }
      if(this.format == 'date'){
        this.form.ksrq = formdate(new Date(start)).substr(0,10);
        this.form.jsrq = formdate(new Date(end)).substr(0,10);
      }else {
        this.form.ksrq = formdate(new Date(start));
        this.form.jsrq = formdate(new Date(end));
      }
      this.$emit("selectTime", {...this.form});
    },
    checkStart(data) {
      this.form.ksrq = data;
      let nowChangeGettime = new Date(data).getTime();
      if (this.form.ksrq && this.form.jsrq) {
          let ksrqGettime = new Date(this.form.ksrq).getTime();
          let jsrqGettime = new Date(this.form.jsrq).getTime();
          if (ksrqGettime > jsrqGettime) {
              this.$message.warning("开始时间不能大于结束时间");
              if (nowChangeGettime == ksrqGettime) {
                  //如果当前选的是开始时间，开始时间恢复到初始时间
                  this.form.ksrq = getNearlyRecentDays(30)[0]; // 接警起止时间
              } else if (nowChangeGettime == jsrqGettime) {
                  //如果当前选的是结束时间，结束时间恢复到初始时间
                  this.form.jsrq = getNearlyRecentDays(30)[1]; // 接警截止时间
              }
          }
      }
      this.$emit("selectTime", {...this.form});
    },
    checkEnd(data){
      this.form.jsrq = data;
      let nowChangeGettime = new Date(data).getTime();
      if (this.form.ksrq && this.form.jsrq) {
          let ksrqGettime = new Date(this.form.ksrq).getTime();
          let jsrqGettime = new Date(this.form.jsrq).getTime();
          if (ksrqGettime > jsrqGettime) {
              this.$message.warning("开始时间不能大于结束时间");
              if (nowChangeGettime == ksrqGettime) {
                  //如果当前选的是开始时间，开始时间恢复到初始时间
                  this.form.ksrq = getNearlyRecentDays(30)[0]; // 接警起止时间
              } else if (nowChangeGettime == jsrqGettime) {
                  //如果当前选的是结束时间，结束时间恢复到初始时间
                  this.form.jsrq = getNearlyRecentDays(30)[1]; // 接警截止时间
              }
          }
      }
      this.$emit("selectTime",{...this.form});
    },
    clear(){
      // let start = new Date("2022-01-01");
      let start = getNearlyRecentDays(30)[0].substr(0,10);
      let end = new Date();
      this.form.ksrq = formdate(new Date(start)).substr(0,10);
      this.form.jsrq = formdate(new Date(end)).substr(0,10);
      // this.selectDate = "";
      this.selectDate = 2;
    }
  },
  created(){
    this.form.ksrq = getNearlyRecentDays(30)[0].substr(0,10);
    this.form.jsrq = getNearlyRecentDays(30)[1].substr(0,10);
    if(this.isInit){
      this.clear();
    }
    this.$emit("selectTime", {
      ...this.form
      });
  }
};
</script>
