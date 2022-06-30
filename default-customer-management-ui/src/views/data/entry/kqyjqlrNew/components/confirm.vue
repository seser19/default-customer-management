<template>
  <el-dialog class="dialog" :visible.sync="modal" width="70%">
    <div slot="title" class="search_zone">
      <span>提交预览</span>
    </div>
    <div class="modal_tree">
      <el-form label-position="top" inline>
        <el-row :gutter="0">
          <el-col :span="24">
            <el-form-item label="警情名称：">
              <span class="item">{{data.jqmc || "-"}}</span>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :lg="8" :span="8">
            <el-form-item label="接警时间：">
              <span class="item">{{data.jjsj || "-"}}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="16" :span="16">
            <el-form-item label="警情类型：">
              <span class="item">{{showLabels.sjlbdm || "-"}}{{showLabels.qtsjlbsm?"/"+showLabels.qtsjlbsm : ""}}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="8" :span="8">
            <el-form-item label="119案件编号：">
              <span class="item">{{showLabels.caseNbr || "-"}}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="16" :span="16">
            <el-form-item label="警情等级：">
              <span class="item">{{showLabels.jqdj || "-"}}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24" :span="24">
            <el-form-item label="单位名称/户主名：">
              <span class="item">{{data.dwmcHzm || "-"}}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24" :span="24">
            <el-form-item label="行政区域：">
              <span class="item">{{showLabels.provName || "-"}}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="16" :lg="24" :span="24">
            <el-form-item label="责任区大队：">
              <span class="item">{{showLabels.duty || "-"}}</span>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :lg="24" :span="24">
            <el-form-item label="警情地址：">
              <span class="item">{{data.jqfsdd || "-"}}</span>
            </el-form-item>
          </el-col>

          <!-- <el-col :xs="24" :sm="12" :lg="16" :span="16">
            <el-form-item label="警情类型：">
              <span class="item">{{showLabels.sjlbdm || "-"}}</span>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :lg="8" :span="8" class="zebra-bg-color">
            <el-form-item label="警情等级：">
              <span class="item">{{showLabels.jqdj || "-"}}</span>
            </el-form-item>
          </el-col>-->

          <!-- <el-col :xs="24" :sm="12" :lg="8" :span="8" v-if="data.sjlbdm =='010000000000'">
            <el-form-item label="火警类型：">
              <span class="item">{{showLabels.zqdjdm || "-"}}</span>
            </el-form-item>
          </el-col>-->

          <!-- <el-col :xs="24" :sm="12" :lg="8" :span="8" class="zebra-bg-color">
            <el-form-item label="责任区大队：">
              <span class="item">{{showLabels.duty || "-"}}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="8" :span="8" class="zebra-bg-color">
            <el-form-item label="是否有队伍出动：">
              <span class="item">{{data.isYdwcd ==0?'否':'是' || "-"}}</span>
            </el-form-item>
          </el-col>-->
        </el-row>
        <el-row v-if="data.jqxxCdxfdws.length" :gutter="0">
          <el-col :xs="24" :sm="24" :lg="24" :span="24">
            <el-form-item label="出动中队：">
              <div v-for="(item,index) in showLabels.setOff" :key="index">
                <span class="item">{{item || "-"}}</span>
                <!-- 需求变更：所有的警情类型都有 主战和增援 2020.1.4 sxc
                  v-if="showLabels.jqlx === '010000000000' ||
        showLabels.jqlx.substr(0, 3) === '020'"
                -->
                <span
                  :class="{ 'tip_one': data.jqxxCdxfdws[index].sfzzxfd === 'Y', 'tip_ones': data.jqxxCdxfdws[index].sfzzxfd !== 'Y' }"
                >{{ data.jqxxCdxfdws[index].sfzzxfd === 'Y' ? "主战" : "增援" }}</span>
                <span v-if="data.jqxxCdxfdws[index].sfsddw=='Y'" class="tip_second">首到</span>
                <span
                  v-if="data.jqxxCdxfdws[index].sfzzxfd=='Y'"
                  class="tip_third"
                >{{ data.sfzrqzz == 'Y' ? '责任区' : '非责任区' }}</span>
              </div>
            </el-form-item>
          </el-col>
          <!-- <el-col :xs="24" :sm="12" :lg="8" :span="8">
            <el-form-item label="是否主战消防队：">
              <span class="item">{{data.jqxxCdxfdws[index].sfzzxfd=="Y"?"是":"否" || "-"}}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="8" :span="8">
            <el-form-item label="是否首到队伍：">
              <span class="item">{{data.jqxxCdxfdws[index].sfsddw=="Y"?"是":"否" || "-"}}</span>
            </el-form-item>
          </el-col>-->
        </el-row>

        <el-row :gutter="0">
          <el-col :xs="24" :sm="24" :lg="24" :span="24">
            <el-form-item label="增援总队：">
              <div v-for="item in data.jqxxKqyDepts" :key="item.deptId">
                <span class="item">{{item.deptName || "-"}}</span>
              </div>
            </el-form-item>
          </el-col>
          <!-- <el-col :xs="24" :sm="12" :lg="8" :span="8">
            <el-form-item label="是否主战消防队：">
              <span class="item">{{data.jqxxCdxfdws[index].sfzzxfd=="Y"?"是":"否" || "-"}}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="8" :span="8">
            <el-form-item label="是否首到队伍：">
              <span class="item">{{data.jqxxCdxfdws[index].sfsddw=="Y"?"是":"否" || "-"}}</span>
            </el-form-item>
          </el-col>-->
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="备注：">
              <span class="item">{{data.bz || "-"}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <button class="btn_back" @click="modal = false">取 消</button>
      <button class="btn_orange" @click="modalSubmit">发 送</button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "confirm",
  props: ["data", "labels"],
  data() {
    return {
      modal: false,
      showLabels: ""
    };
  },
  created() {},
  methods: {
    toggle() {
      this.showLabels = { ...this.labels };
      // console.log(this.labels);
      // console.log(this.showLabels.setOff);
      this.showLabels.setOff =
        this.showLabels.setOff.indexOf(",") === -1 &&
        !this.showLabels.setOff.length
          ? []
          : this.showLabels.setOff.split(",");
      // console.log(this.showLabels.setOff);
      this.modal = !this.modal;
    },
    //点击保存
    modalSubmit() {
      this.$emit("onSubmit");
      this.modal = false;
    }
  }
};
</script>

<style lang="stylus" scoped>
.search_zone
  display flex
  align-items center
  span
    font-size 18px
  .el-input
    margin-left 16px
    width 200px
.modal_tree
  height 350px
  overflow-y auto
  overflow-x hidden
  // padding 0 30px
  .el-form--inline.el-form--label-top .el-form-item__content
    display none !important
  h5
    font-size 14px
    font-weight 500
    color rgba(8, 8, 8, 1)
    margin 0 0 15px 0
  .tag
    margin-left 10px
    font-size 14px
    padding 0px 5px
    border-radius 50px
  .tip_one
    font-size 12px
    color #fb3e2d
    border-radius 12px
    display inline-block
    height 20px
    border 1px solid #fb3e2d
    line-height 18px
    padding 0 8px
    margin-left 20px
  .tip_ones
    font-size 12px
    color #7ED321
    border-radius 12px
    display inline-block
    height 20px
    border 1px solid #7ED321
    line-height 18px
    padding 0 8px
    margin-left 20px
  .tip_second
    font-size 12px
    color #437FDF
    border-radius 12px
    display inline-block
    height 20px
    border 1px solid #437FDF
    line-height 18px
    padding 0 8px
    margin-left 12px
  .tip_third
    font-size 12px
    color #6C0AAB
    border-radius 12px
    display inline-block
    height 20px
    border 1px solid #6C0AAB
    line-height 18px
    padding 0 8px
    margin-left 12px
  .redTag
    color #FB3E2D
    border 1px solid #FB3E2D
  .blueTag
    color #437FDF
    border 1px solid #437FDF
  .greenTag
    color #7ED321
    border 1px solid #7ED321
</style>

<style lang="stylus">
.dialog
  .el-dialog__body
    padding 0px 20px 20px 20px
.modal_tree
  .el-form-item
    margin 0px
    padding 10px 0px
  .el-col
    border-bottom 1px dashed #E8E8E8
  .el-form--inline.el-form--label-top .el-form-item__content
    display inline-block !important
</style>
