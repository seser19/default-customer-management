import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/**
 * Note: 路由配置项
 *
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: 'noRedirect'           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，这个名称得是英文的，且与相应的页面 .vue 文件中的 name 属性保持一致，这样 <keep-alive> 组件的 include 属性才会识别
 * meta : {
    roles: ['admin','editor']    // 设置该路由进入的权限，支持多个权限叠加
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
    noCache: false // 是否不需要缓存当前页面，默认 无参数视为需要缓存
  }
 */

// 公共路由
export const constantRoutes = [{
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [{
      path: "/redirect/:path*",
      component: () => import("@/views/redirect")
    }]
  },
  {
    path: "/eqw",
    component: Layout,
    hidden: true,
    children: [{
      path: "dataReport",
      component: () => import("@/views/eqw/dataSearch/dataReport.vue"),
      name: "数据报表",
      meta: {
        title: "数据报表",
        icon: ""
      }
    }, {
      path: "customReport/add",
      component: () => import("@/views/eqw/customReport/add.vue"),
      name: "customReportAdd",
      meta: {
        title: "新建自定义报表",
        icon: ""
      }
    }, {
      path: "customReport/update/:id",
      component: () => import("@/views/eqw/customReport/update.vue"),
      name: "customReportUpdate",
      meta: {
        title: "修改自定义报表",
        icon: ""
      }
    }, {
      path: 'generalSearch',
      component: () => import('@/views/eqw/generalSearch/generalSearch.vue'),
      name: 'generalSearch',
      meta: {
        title: '综合查询'
      }
    }]
  },
  {
    path: "/dataEntry",
    component: Layout,
    hidden: true,
    children: [{
        path: "lsjqxq",
        component: () =>
          import("@/views/data/entry/jqxx/components/detail.vue"),
        name: "警情信息",
        meta: {
          title: "警情信息",
          icon: ""
        }
      },
      {
        path: "jqxxEdit",
        component: () =>
          import("@/views/data/entry/jqxx/jqxxEdit.vue"),
        name: "警情修改",
        meta: {
          title: "警情修改",
          icon: ""
        }
      },
      {
        path: "jqxxPerfect",
        component: () =>
          import("@/views/data/entry/jqxx/jqxxPerfect.vue"),
        name: "警情完善",
        meta: {
          title: "警情完善",
          icon: ""
        }
      },
      {
        path: "kqyjqxxEdit",
        component: () =>
          import("@/views/data/entry/kqyjqlr/jqxxEdit.vue"),
        name: "跨区域警情修改",
        meta: {
          title: "跨区域警情修改",
          icon: ""
        }
      },
      {
        path: "kqyjqxxEditNew",
        component: () =>
          import("@/views/data/entry/kqyjqlrNew/jqxxAdd.vue"),
        name: "跨区域警情修改(新)",
        meta: {
          title: "跨区域增援",
          icon: ""
        }
      },
      {
        path: "lshzxq",
        component: () =>
          import("@/views/data/entry/zqxx/components/detail.vue"),
        name: "火灾信息详情",
        meta: {
          title: "火灾信息详情",
          icon: ""
        }
      },
      {
        path: "modify",
        component: () =>
          import("@/views/data/entry/zqxx/components/modify.vue"),
        name: "火灾信息修改",
        meta: {
          title: "火灾信息修改",
          icon: ""
        }
      },
      {
        path: "cdxxModify",
        component: () =>
          import("@/views/data/entry/cdxx/components/modify.vue"),
        name: "出动信息修改",
        meta: {
          title: "出动信息修改",
          icon: ""
        }
      }
    ]
  },
  // 报表
  {
    path: "/report",
    component: Layout,
    hidden: true,
    children: [{
        path: "reportList",
        component: () => import("@/views/data/reportList/index.vue"),
        name: "报表列表",
        meta: {
          title: "报表列表",
          icon: ""
        }
      },
      {
        path: "outsideWeb",
        component: () => import("@/views/data/reportList/outsideWeb.vue"),
        name: "报表",
        meta: {
          title: "报表详情",
          icon: ""
        }
      }
    ]
  },
  {
    path: "/showDetail",
    component: Layout,
    hidden: true,
    children: [{
        path: "cdxxShowDetail",
        component: () => import("@/views/data/aduit/cdxx/cdxxShowDetail.vue"),
        name: "出动信息详情",
        meta: {
          title: "出动信息详情",
          icon: ""
        }
      },
      {
        path: "jqxxShowDetail",
        component: () => import("@/views/eqw/dataSearch/components/jqxxDetail"),
        name: "警情信息详情",
        meta: {
          title: "警情信息详情",
          icon: ""
        }
      },
      {
        path: "jjcshShowDetail",
        component: () => import("@/views/data/entry/jqxx/jjcshDetail"),
        name: "接处警审核信息详情",
        meta: {
          title: "接处警审核信息详情",
          icon: ""
        }
      },
      {
        path: "fireDetailInfo",
        component: () => import("@/views/data/entry/zqxx/components/fireDetailInfo"),
        name: "火灾信息详情",
        meta: {
          title: "火灾信息详情",
          icon: ""
        }
      }
    ]
  },
  // 统计监督
  {
    path: "/inspect",
    redirect: "noRedirect",
    component: Layout,
    hidden: true,
    meta: {
      title: "统计监督",
      icon: "检查"
    },
    children: [{
      name: "checkNewTask",
      path: "/create/newTask",
      component: () => import("@/views/check/create/newTask"),
      hidden: true,
      meta: {
        title: "新建检查任务"
      }
    },
    {
      name: "checkDetails",
      path: "/create/details",
      component: () => import("@/views/check/create/details"),
      hidden: true,
      meta: {
        title: "检查任务详情"
      }
    },{
      name: "dealDetails",
      path: "/deal/details",
      component: () => import("@/views/check/deal/details"),
      hidden: true,
      meta: {
        title: "处理监督详情"
      }
    },{
      name: "dealfire",
      path: "/deal/fire",
      component: () => import("@/views/check/deal/components/zqDetail"),
      hidden: true,
      meta: {
        title: "灾情处理监督"
      }
    }]
  },
  {
    path: "/login",
    component: () => import("@/views/login"),
    hidden: true
  },
  {
    path: "",
    component: Layout,
    redirect: "index",
    children: [{
      path: "index",
      component: () => import("@/views/home/index"),
      name: "Index",
      meta: {
        title: "系统首页",
        icon: "dashboard",
        noCache: true,
        affix: true
      }
    }]
  },
  // {
  //   path: "",
  //   component: Layout,
  //   children: [{
  //     name: "开始录入",
  //     path: "jqxxtb",
  //     component: () => import("@/views/data/entry/jqxx/index"),
  //     meta: {
  //       title: "开始录入",
  //       icon: "edit"
  //     }
  //   }]
  // },
  {
    path: "/user",
    component: Layout,
    hidden: true,
    redirect: "noredirect",
    children: [{
      path: "profile",
      component: () => import("@/views/system/user/profile/index"),
      name: "个人中心",
      meta: {
        title: "个人中心",
        icon: "user"
      }
    }]
  },
  {
    path: "/dict",
    component: Layout,
    hidden: true,
    children: [{
      path: "type/data/:dictId(\\d+)",
      component: () => import("@/views/system/dict/data"),
      name: "字典数据",
      meta: {
        title: "字典数据",
        icon: ""
      }
    }]
  },
  {
    path: "/system",
    component: Layout,
    hidden: true,
    redirect: "noredirect",
    children: [{
      path: "mystar",
      component: () => import("@/views/system/star/index"),
      name: "我的关注",
      meta: {
        title: "我的关注",
        icon: "user"
      }
    }]
  },
  {
    path: "/404",
    component: () => import("@/views/error/404"),
    hidden: true
  },
  {
    path: "/401",
    component: () => import("@/views/error/401"),
    hidden: true
  },
  {
    path: "/gen",
    component: Layout,
    hidden: true,
    children: [{
      path: "edit",
      component: () => import("@/views/tool/gen/editTable"),
      name: "GenEdit",
      meta: {
        title: "修改生成配置"
      }
    }]
  },
  {
    path:'/testsql',
    component: ()=>import('@/views/data/entry/hzdj/test')
  }
];

export default new Router({
  mode: "history", // 去掉url中的#
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
});
