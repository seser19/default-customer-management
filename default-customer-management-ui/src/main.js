import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css' // a modern alternative to CSS resets

import '@/assets/iconfont/iconfont.css'

import Element from 'element-ui'
import './assets/styles/element-variables.scss'

import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css
import '@/assets/styles/common.styl'

import App from './App'
import store from './store'
import router from './router'
import permission from './directive/permission'

import './assets/icons' // icon
import './permission' // permission control
import {
    getDicts
} from "@/api/system/dict/data";
import {
    getConfigKey
} from "@/api/system/config";
import {
    transformDateFormat,
    resetForm,
    addDateRange,
    selectDictLabel
} from "@/utils/ruoyi";
import {
    formatterDate
} from "@/utils/index";
import Pagination from "@/components/Pagination";

import qs from 'qs'

// https://github.com/ecomfe/vue-echarts/blob/master/README.zh_CN.md#%E4%BD%BF%E7%94%A8%E6%96%B9%E6%B3%95
import ECharts from 'vue-echarts/components/ECharts' // 在 webpack 环境下指向 components/ECharts.vue

// 手动引入 ECharts 各模块来减小打包体积
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/map'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/heatmap';

import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/legendScroll'
import 'echarts/lib/component/dataZoom'
import 'echarts/lib/component/visualMap';


// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.transformDateFormat = transformDateFormat
Vue.prototype.formatterDate = formatterDate
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.$qs = qs

Vue.prototype.$echarts = ECharts

Vue.prototype.msgSuccess = function (msg) {
    this.$message({
        showClose: true,
        message: msg,
        type: "success"
    });
}

Vue.prototype.msgError = function (msg) {
    this.$message({
        showClose: true,
        message: msg,
        type: "error"
    });
}

Vue.prototype.msgInfo = function (msg) {
    this.$message.info(msg);
}

// 全局组件挂载
Vue.component('Pagination', Pagination)

// 注册 echarts 组件
Vue.component('v-chart', ECharts)

Vue.use(permission)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
// 修改 el-dialog 默认点击遮照为不关闭
Element.Dialog.props.closeOnClickModal.default = false;
// 修改 el-dialog ：自身是否插入至 body 元素上。嵌套的 Dialog 必须指定该属性并赋值为 true
Element.Dialog.props.appendToBody.default = true;

Vue.use(Element, {
    size: Cookies.get('size') || 'small' // set element-ui default size
})

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
