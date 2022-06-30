import {
  constantRoutes
} from '@/router'
import {
  getRouters
} from '@/api/menu'
import Layout from '@/layout/index'
import {
  getToken
} from '@/utils/auth'

const permission = {
  state: {
    routes: [],
    addRoutes: []
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    }
  },
  actions: {
    // 生成路由
    GenerateRoutes({
      commit
    }) {
      return new Promise(resolve => {
        // 向后端请求路由数据
        getRouters().then(res => {
          for(var i in res.data){
              if(res.data[i].path ==='/ypbg'){
                res.data.splice(i,1)
            }
              if(res.data[i].path ==='/efs'){
                res.data.splice(i,1)
            }
              if(res.data[i].path ==='/wight'){
                res.data.splice(i,1)
            }
              // if(res.data[i].path ==='/typicalCase'){
              //   res.data.splice(i,1)
            // }
              if(res.data[i].path ==='/gmccss'){
                res.data.splice(i,1)
            }
              if(res.data[i].path ==='/dpzs'){
                res.data.splice(i,1)
            }
          }
          const accessedRoutes = filterAsyncRouter(res.data)
          // console.log('aaaaaa',res.data)
          accessedRoutes.push({
            path: '*',
            redirect: '/404',
            hidden: true
          })
          commit('SET_ROUTES', accessedRoutes)
          resolve(accessedRoutes)
        })
      })
    }
  }
}

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap) {
  return asyncRouterMap.filter(route => {
    // 处理组件
    if (route.component) {
      // Layout组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else {
        route.component = loadView(route.component)
      }
    }

    // 递归子级路由
    if (route.children != null && route.children && route.children.length && route.children != []) {
      //过滤子路由空菜单
      route.children = filterAsyncRouter(route.children.filter(r=>r.component!=='Layout'))
    }

    // 统计报表外部链接特殊处理：url 增加 token 字段
    if (route.path && (route.path.match('10.19.11.37')||route.path.match('120.52.31.129'))) {
      route.path += `?token=${getToken()}`
    }

    // 挂载的一级菜单特殊处理
    if (route.path === "/firstClassMenuPath") {
      // 控制左侧不显示其 一级菜单 名称
      route.alwaysShow = false
      // 控制二级菜单的 path
     route.path =''
    }
    

    // 待开发页面名单
    const codingList = ["任务处理", "任务创建", "评价结果", "评价发起", "报告列表", "报告模板", "典型案例"]
    codingList.indexOf(route.name) !== -1 && (route.disabled = true)

    return true
  })
}

export const loadView = (view) => { // 路由懒加载
  // return () => import(`@/views/${view}`)
  return (resolve) => require([`@/views/${view}`],resolve)
}

export default permission
