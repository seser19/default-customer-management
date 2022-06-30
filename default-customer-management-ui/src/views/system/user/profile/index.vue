<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div class="text-center">
              <userAvatar :user="user" />
            </div>
            <div class="list-group list-group-striped">
              <el-row class="list-group-item">
                <el-col :span="2">
                  <svg-icon icon-class="user" />
                </el-col>
                <el-col :span="8">用户账号</el-col>
                <el-col :span="14" class="text-right">{{ user.userName }}</el-col>
              </el-row>
              <el-row class="list-group-item">
                <el-col :span="2">
                  <svg-icon icon-class="phone" />
                </el-col>
                <el-col :span="6">手机号码</el-col>
                <el-col :span="16" class="text-right">{{ user.phonenumber }}</el-col>
              </el-row>
              <el-row class="list-group-item">
                <el-col :span="2">
                  <svg-icon icon-class="email" />
                </el-col>
                <el-col :span="6">用户邮箱</el-col>
                <el-col :span="16" class="text-right">{{ user.email }}</el-col>
              </el-row>
              <el-row class="list-group-item">
                <el-col :span="2">
                  <svg-icon icon-class="tree" />
                </el-col>
                <el-col :span="6">所属部门</el-col>
                <el-col :span="16" class="text-right" v-if="user.dept">{{ user.dept.deptName }} / {{ postGroup }}</el-col>
              </el-row>
              <el-row class="list-group-item">
                <el-col :span="2">
                  <svg-icon icon-class="peoples" />
                </el-col>
                <el-col :span="6">所属角色</el-col>
                <el-col :span="16">{{roleGroup }}</el-col>
              </el-row>
              <el-row class="list-group-item">
                <el-col :span="2">
                  <svg-icon icon-class="date" />
                </el-col>
                <el-col :span="6">创建日期</el-col>
                <el-col :span="16" class="text-right">2018-08-23 09:11:56</el-col>
              </el-row>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>基本资料</span>
          </div>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="userinfo">
              <userInfo :user="user" />
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd :user="user" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import userAvatar from "./userAvatar";
import userInfo from "./userInfo";
import resetPwd from "./resetPwd";
import { getUserProfile } from "@/api/system/user";

export default {
  name: "Profile",
  components: { userAvatar, userInfo, resetPwd },
  data() {
    return {
      user: {},
      roleGroup: {},
      postGroup: {},
      activeTab: "userinfo"
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {
      getUserProfile().then(response => {
        this.user = response.data;
        this.roleGroup = response.roleGroup;
        this.postGroup = response.postGroup;
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.avatar-uploader-icon {
  font-size: 28px;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
</style>
