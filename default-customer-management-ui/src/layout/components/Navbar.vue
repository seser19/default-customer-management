<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container"/> -->

    <div class="right-menu">
      <!-- <el-popover
        placement="bottom"
        width="400"
        trigger="click">
        <i slot="reference" class="el-icon-message-solid animated up"></i>
      </el-popover>-->
      <!-- <svg-icon class-name="bell" icon-class="bell" /> -->
      <template v-if="device!=='mobile'">
        <!-- <search id="header-search" class="right-menu-item"/> -->

        <!--        <el-tooltip content="下载源码" effect="dark" placement="bottom">-->
        <!--          <ruo-yi id="ruoyi" class="right-menu-item hover-effect" />-->
        <!--        </el-tooltip>-->

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <!-- <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect"/>
        </el-tooltip>-->
      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          {{nickName}}，欢迎您
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/profile">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <el-dropdown-item>
            <div @click="setting = true">布局设置</div>
          </el-dropdown-item>
          <el-dropdown-item v-if="showFlag">
            <el-checkbox v-model="checked" @change="toggleRowSelect">次级轻微火灾</el-checkbox>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <div @click="logout">退出登录</div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
import Search from "@/components/HeaderSearch";
import RuoYi from "@/components/RuoYi";
import { personalSettings,switchFireSeting,showFlag} from "@/api/system/user";

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    SizeSelect,
    Search,
    RuoYi
  },
  computed: {
    ...mapGetters(["sidebar", "device", "avatar", "nickName"]),
    setting: {
      get() {
        return this.$store.state.settings.showSettings;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "showSettings",
          value: val
        });
      }
    }
  },
  data(){
    return{
      checked:false,
      value:'',
      showFlag:false
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      this.$confirm("确定注销并退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //登出之后重置路由
          // this.$store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
          //   this.$router.push('/')
          // });
          this.$store.dispatch("LogOut").then(() => {
            location.reload();
          });
        })
        .catch(function() {});
    },
    toggleRowSelect(val){
      if(val){
        this.value = 0;
      }else {
        this.value = 1;
      }
      let params = {
        code:'secondary_fire',
        value:this.value
      }
      switchFireSeting(params).then(res =>{
        if(res.code == '200'){
          this.$message.success('设置成功');
        }
      })
    }
  },
  created(){
    showFlag().then(res => {
      if(res.code == '200'){
        this.showFlag = res.data;
        console.log(this.showFlag)
        if(res.data == true){
          personalSettings(1).then(res =>{
            if(res.code == '200'){
              if(res.data){
                this.value = res.data;
                if(res.data == 0){
                  this.checked = true;
                }else {
                  this.checked = false;
                }
              }else {
                this.checked = false;
              }
            }
          })
        }
      }
    })
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  background: linear-gradient(90deg, #2b2f3a 0%, #194a86 100%);
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }
    .up {
      animation-name: upAnimation; /*动画的名称*/
      transform-origin: center top; /*设置动画旋转元素的基点为*/
      cursor: pointer;
      color: #fff;
      font-size: 20px;
      top: -14px;
      position: relative;
      // float: left;
    }

    .animated {
      animation-duration: 0.5s; /*动画时间*/
      animation-fill-mode: both; /*播放后的状态*/
    }
    .animated {
      animation-iteration-count: 5; /*动作循环的次数：infinite 无限循环*/
    }
    @keyframes upAnimation {
      0%,
      20%,
      50%,
      80% {
        // transition-timing-function: cubic-bezier(0.215,.61,.355,1);
        // transform: translate3d(0,0,0);
        transform: rotate(10deg);
        -ms-transform: rotate(10deg); /* IE 9 */
        -webkit-transform: rotate(10deg); /* Safari and Chrome */
      }
      40% {
        // transition-timing-function: cubic-bezier(0.755,0.50,0.855,0.060);
        // transform: translate3d(-10px,0,0);
        transform: rotate(-10deg);
        -ms-transform: rotate(-10deg); /* IE 9 */
        -webkit-transform: rotate(-10deg); /* Safari and Chrome */
      }
      70% {
        // transition-timing-function: cubic-bezier(0.755,0.050,0.855,0.060);
        // transform: translate3d(-10px,0px,0);
        transform: rotate(10deg);
        -ms-transform: rotate(10deg); /* IE 9 */
        -webkit-transform: rotate(10deg); /* Safari and Chrome */
      }
      90% {
        // transform: translate3d(20px,0,0);
        transform: rotate(-10deg);
        -ms-transform: rotate(-10deg); /* IE 9 */
        -webkit-transform: rotate(-10deg); /* Safari and Chrome */
      }
      100% {
        transform: rotate(0deg);
        -ms-transform: rotate(0deg); /* IE 9 */
        -webkit-transform: rotate(0deg); /* Safari and Chrome */
      }
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #fff;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        font-size: 14px;
        // margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 20px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
