<template>
  <div class="gmccssSh page_zone" v-loading="loading" v-show="show">
    <div class="reporting-title">
      <h2>详情 <span class="bh">(事件编号：{{ data.eventId }})</span></h2>
      <el-button type="primary" @click="back">&nbsp;返&nbsp;回&nbsp;</el-button>
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
          <div class="fire_building_describe" v-if="data.filingShwps.length">
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
          <div class="fire_building_describe" v-if="data.sysUploads.length">
            <h2 class="title">附件</h2>
            <el-row :gutter="0">
              <el-col :span="24">
                <el-upload
                  action=""
                  list-type="picture-card"
                  multiple
                  :file-list="picList"
                  disabled
                  :on-preview="handlePictureCardPreview"
                >
                  <i class="el-icon-plus"/>
                </el-upload>
              </el-col>
            </el-row>
          </div>
        </el-form>
        <div class="fire_building_describe">
          <el-row :gutter="0">
            <el-col :span="24">
              <div style="text-align: center;" v-if="data.shzt==='1'">
                <div>
                  <el-radio-group v-model="shzt">
                    <el-radio :label="1">通过</el-radio>
                    <el-radio :label="-1">作废</el-radio>
                  </el-radio-group>
                </div>
                <div class="btn">
                  <el-button type="primary" @click="sub">提&nbsp;交</el-button>
                  <el-button @click="back">&nbsp;返&nbsp;回&nbsp;</el-button>
                </div>
              </div>
              <div style="text-align: center" v-else>
                <div>
                  <el-radio-group :value="data.shzt">
                    <el-radio :label="'2'">通过</el-radio>
                    <el-radio :label="'-1'">作废</el-radio>
                  </el-radio-group>
                </div>
                <div class="btn">
                  <el-button disabled>已检查</el-button>
                  <el-button @click="back">&nbsp;返&nbsp;回&nbsp;</el-button>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <select-jqlist ref="selectJqbh" @sub="sub" :jq-item.sync="jqItem"/>
  </div>
</template>

<script>
import { doAudit, getDetail } from '@/api/data/entry/gmccss'
import SelectJqlist from '@/views/data/entry/gmccss/components/selectJqlist'

export default {
  name: 'gmccssSh',
  components: { SelectJqlist },
  props: {
    id: {
      default: undefined
    }
  },
  computed:{
    picList(){
      return this.data.sysUploads.length?this.data.sysUploads.map(r=>({url:r.avatar,name:r.name})):[]
    }
  },
  data() {
    return {
      show: false,
      data: {
        filingShwps: [],
        sysUploads: []
      },
      loading: false,
      // type: {
      //   1: '建筑物装置设备及设备',
      //   2: '家电家具等物品',
      //   3: '汽车',
      //   4: '产品商品',
      //   5: '保护类财产',
      //   6: '其他财产'
      // },
      dialogImageUrl:'',
      dialogVisible:false,
      shzt:1,
      jqItem:undefined
    }
  },
  watch: {
    id(e) {
      if (e) {
        this.rest()
        this.show = true
        this.getData()
      }
    }
  },
  methods: {
    getData() {
      this.loading = true
      getDetail(this.id).then(r => {
        this.data = r.data
        this.loading = false
      })
    },
    back() {
      this.$emit('update:id', undefined)
      this.show = false
    },
    rest() {
      this.data = {
        filingShwps: [],
        sysUploads: []
      }
      this.shzt = 1
      this.jqItem = undefined
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true
    },
    sub(){
      const formData = new FormData()
      formData.append('eventId',this.id)
      formData.append('operCode',this.shzt)
      if(this.shzt===-1){
        this.loading = true;
        doAudit(formData).then(r=>{
          this.getData();
          this.loading = false;
        })
      }else {
        if(this.jqItem){
          this.loading = true;
          formData.append('jqbh',this.jqItem.jqbh)
          doAudit(formData).then(r=>{
            this.getData();
            this.loading = false;
          })
        }else {
          this.$refs.selectJqbh.toggle();
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../zqxx/style/style.styl";

.gmccssSh {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background: white;
  padding: 10px;
  z-index: 1;

  .bh {
    font-size: 13px;
  }
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
.btn{
  padding: 10px;
  margin-top: 30px;
  text-align: center;
}
</style>
