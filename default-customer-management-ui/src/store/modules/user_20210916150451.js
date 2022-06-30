import {
  login,
  logout,
  getInfo
} from '@/api/login'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    permissions: [],
    nickName: '',
    // 部门/单位 级别字段，判断进入具体哪个首页 deptLevel：1,2,3的时候进去支队首页，4的时候进入大队首页，5的时候进入中队首页
    deptLevel: null,
    // 部门/单位 id
    deptId: null,
    //区域信息
    areaId:'',
    areaName: '',
    areaLevel:''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_NICKNAME: (state, nickName) => {
      state.nickName = nickName
    },
    SET_DEPTLEVEL: (state, deptLevel) => {
      state.deptLevel = deptLevel
    },
    SET_DEPTID: (state, deptId) => {
      state.deptId = deptId
    },
    SET_AREAID: (state, areaId) => {
      state.areaId = areaId
    },
    SET_AREANAME: (state, areaName) => {
      state.areaName = areaName
    },
    SET_AREALEVEL: (state, areaLevel) => {
      state.areaLevel = areaLevel
    },
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim();
      const password = userInfo.password;
      const code = userInfo.code;
      const uuid = userInfo.uuid;
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid).then(res => {
          setToken(res.token);
          commit('SET_TOKEN', res.token);
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(res => {
          const area = res.area;  // 存放区域信息
          const user = res.user;
          const avatar = user.avatar == null ? require("@/assets/image/profile.jpg") : process.env.VUE_APP_FTP_API + user.avatar;
          if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', res.roles);
            commit('SET_PERMISSIONS', res.permissions)
          } else {
            commit('SET_ROLES', ['ROLE_DEFAULT'])
          }
          commit('SET_NAME', user.userName);
          commit('SET_AVATAR', avatar);
          commit('SET_NICKNAME', user.nickName);
          user.dept && commit('SET_DEPTLEVEL', user.dept.deptLevel);
          commit('SET_DEPTID', user.deptId);
          // 存放区域信息
          commit('SET_AREAID', area.areaId);
          commit('SET_AREANAME', area.areaName);
          commit('SET_AREALEVEL', area.areaLevel);

          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '');
          commit('SET_ROLES', []);
          commit('SET_PERMISSIONS', []);
          removeToken();
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        removeToken();
        resolve()
      })
    }
  }
};

export default user
