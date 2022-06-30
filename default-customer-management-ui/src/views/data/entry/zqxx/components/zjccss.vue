<template>
  <transition>
    <div class="moveBox" :style="position" v-show="show">
      <div
        class="moveHead"
        @mousedown="mousedown"
        @mousemove="mousemove"
        @mouseleave="mousemove"
        @mouseup="mouseup"
      ></div>
      <div class="close" @click="toggleShow">×</div>
      <div class="contentBox">
        <div v-for="(data,index) in list" :key="data.eventId">
          <div class="reporting-title">
            <h2>第{{index+1}}条，共{{list.length}}条 <span class="bh">(编号：{{ data.eventId }})</span></h2>
          </div>
          <div class="content fireInfo">
            <div class="info_description">
              <el-form
                label-width="160px"
                class="demo-ruleForm"
                label-position="right"
              >
                <div class="fire_building_describe">
                  <h2 class="title">简要情况</h2>
                  <el-row :gutter="0">
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="姓名">
                        <span>{{ data.name || '-' }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="公民身份证">
                        <span>{{ data.idCard || '-' }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="填报时间">
                        <span>{{ data.tbsj || '-' }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :lg="8" :span="8">
                      <el-form-item label="地区">
                        <span>{{ `${data.provinceName || ''} ${data.cityName || ''} ${data.countyName || ''} ${data.roadName || ''} ` }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :lg="8" :span="8">
                      <el-form-item label="详细地址">
                        <span>{{ data.address || '-' }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :lg="8" :span="8">
                      <el-form-item label="火灾发生时间">
                        <span>{{ data.hzsj || '-' }}</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
                <div class="fire_building_describe" v-if="data.filingShwps&&data.filingShwps.length">
                  <h2 class="title">财产损失物品</h2>
                  <div class="fire_building_describe" v-for="item in data.filingShwps">
                    <el-row>
                      <!--                <el-col :xs="24" :sm="12" :lg="12" :span="12">-->
                      <!--                  <el-form-item label="物品类型">-->
                      <!--                    <span>{{ type[item.type] || '-' }}</span>-->
                      <!--                  </el-form-item>-->
                      <!--                </el-col>-->
                      <el-col :xs="24" :sm="24" :lg="24" :span="24">
                        <el-form-item label="物品名称">
                          <span>{{ item.shwpName || '-' }}</span>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="24" :sm="12" :lg="12" :span="12">
                        <el-form-item label="数量">
                          <span>{{ item.amount || '-' }}</span>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="24" :sm="12" :lg="12" :span="12">
                        <el-form-item label="单价">
                          <span>{{ item.price || '-' }}</span>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="24" :sm="12" :lg="12" :span="12">
                        <el-form-item label="使用年限">
                          <span>{{ item.useYear || '-' }}</span>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="24" :sm="12" :lg="12" :span="12">
                        <el-form-item label="合计">
                          <span class="itemTotal">{{ item.subtotal || '-' }}</span>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                  <p class="total">
                    总计：<span>{{data.filingShwps.reduce((total,r)=>total+r.subtotal,0)}}</span>
                  </p>
                </div>
                <div class="fire_building_describe" v-if="data.sysUploads&&data.sysUploads.length">
                  <h2 class="title">附件</h2>
                  <el-row :gutter="0">
                    <el-col :span="24">
                      <el-upload
                        action=""
                        list-type="picture-card"
                        multiple
                        :file-list="data.sysUploads.map(r=>({url:r.avatar,name:r.name}))"
                        disabled
                        :on-preview="handlePictureCardPreview"
                      >
                        <i class="el-icon-plus"/>
                      </el-upload>
                    </el-col>
                  </el-row>
                </div>
              </el-form>
            </div>
          </div>
        </div>
      </div>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
      <el-button class="inputZjccss" type="text" size="medium" @click="totalPrice">计算并填入财产损失</el-button>
    </div>
  </transition>
</template>

<script>
export default {
  name: "moveBox",
  props:{
    list:{
      default:[]
    }
  },
  data() {
    return {
      show: false,
      x: 300,
      y: 50,
      leftOffset: 0,
      topOffset: 0,
      isMove: false,
      dialogVisible:false,
      dialogImageUrl:''
    };
  },
  computed: {
    //top与left加上px
    position() {
      return `top:${this.y}px;left:${this.x}px;`;
    }
  },
  methods: {
    //控制打开关闭
    toggleShow() {
      this.x = 300;
      this.y = 50;
      this.show = !this.show;
    },
    mousedown(event) {
      this.leftOffset = event.offsetX;
      this.topOffset = event.offsetY;
      this.isMove = true;
    },
    mousemove(event) {
      if (!this.isMove) {
        return;
      }
      this.x = event.clientX - this.leftOffset;
      this.y = event.clientY - this.topOffset;
    },
    mouseup() {
      this.isMove = false;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true
    },
    totalPrice(){
      const total = this.list.reduce((t,r)=>{
        if(r.filingShwps) t += r.filingShwps.reduce((s,a)=>s+a.subtotal,0);
        return t;
      },0)
      this.$emit('total',total);
      this.toggleShow();
    }
  },
};
</script>

<style lang="scss" scoped>
.moveBox {
  width: 900px;
  height: 400px;
  position: fixed;
  box-shadow: 0 0 5px 3px #95a5a6;
  z-index: 999;
  background-color: white;
  .moveHead {
    height: 30px;
    background-color: #bdc3c7;
    cursor: move;
  }
  .close {
    position: absolute;
    right: 0;
    top: 0;
    line-height: 30px;
    font-size: 24px;
    cursor: pointer;
    display: block;
    width: 30px;
    height: 30px;
    text-align: center;
  }
}
.v-enter,
.v-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
.contentBox {
  padding: 10px;
  height: 360px;
  overflow: auto;
}
.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease;
}
@import "../../zqxx/style/style.styl";


.bh {
    font-size: 13px;
}

.itemTotal{
  color: #e74c3c;
}
.total{
  text-align: right;
  margin-top: 15px;
  padding: 0 30px;
  span{
    color: #e74c3c;
    font-size: 20px;
  }
}
.inputZjccss{
  position: absolute;
  top: 40px;
  right: 30px;
}
</style>
