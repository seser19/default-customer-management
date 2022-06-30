// 首页 接口
import request from '@/utils/request'

// // 获取 指标预警 列表数据
// export function getIndexWarning(params) {
//   return request({
//     url: '/home/page/getIndexWarning',
//     method: 'post',
//     params
//   })
// }

// // 获取 柱状图表 列表数据
// export function getBarChartDatas(params) {
//   return request({
//     url: '/home/page/getBarChartDatas',
//     method: 'post',
//     params
//   })
// }

// // 获取 柱状图表下面的一行文字描述 列表数据
// export function getBarTitleDatas(params) {
//   return request({
//     url: '/home/page/getBarTitleDatas',
//     method: 'post',
//     params
//   })
// }

// 总队首页接口
const corpsHome = {
    /**
     * 获取 顶部 重点指标列表 数据
     * @param {*} params
     *  cyc 指标周期(D:日指标;M:月指标； Y:年度指标)
     *  areaId 区域ID
     */
    getIndexWarning(params) {
        return request({
            url: '/home/morePage/getIndexWarning',
            method: 'post',
            params
        })
    },
    /**
     * 获取 地图列表 数据
     * @param {*} params
     *  cyc 指标周期(D:日指标;M:月指标； Y:年度指标)
     *  areaId 区域ID
     */
    getMapChartDatas(params) {
        return request({
            url: '/home/morePage/getMapChartDatas',
            method: 'post',
            params
        })
    },
    /**
     * 获取 主要统计指标列表 数据
     * @param {*} params
     *  cyc 指标周期(D:日指标;M:月指标； Y:年度指标)
     *  areaId 区域ID
     */
    getBarChartDatas(params) {
        return request({
            url: '/home/morePage/getBarChartDatas',
            method: 'post',
            params
        })
    },
    /**
     * 获取 主要统计指标列表下面的描述文字 数据
     * @param {*} params
     *  cyc 指标周期(D:日指标;M:月指标； Y:年度指标)
     *  areaId 区域ID
     */
    getBarTitleDatas(params) {
        return request({
            url: '/home/morePage/getBarTitleDatas',
            method: 'post',
            params
        })
    },
    /**
     * 获取 警情类型图表 数据
     * @param {*} params
     *  cyc 指标周期(D:日指标;M:月指标； Y:年度指标)
     *  areaId 区域ID
     *  kpiId 指标ID（10001：警情；10002：火灾扑救；10003：抢险救援）pagePostData.cyc + 后面的编号
     */
    getPieChartDatas(params) {
        return request({
            url: '/home/morePage/getPieChartDatas',
            method: 'post',
            params
        })
    },
    // 获取指标排名
    getKpiRanking(params) {
        return request({
            url: '/home/morePage/getPoliceSituationKpiRanking',
            method: 'post',
            params
        })
    }
};

// 支队首页接口
const detachmentHome = {
    /**
     * 获取 顶部 重点指标列表 数据
     * @param {*} params
     *  cyc 指标周期(D:日指标;M:月指标； Y:年度指标)
     *  deptId 单位ID
     */
    getIndexWarning(params) {
        return request({
            url: '/home/branchPage/getIndexWarning',
            method: 'post',
            params
        })
    },
    /**
     * 获取 汇总数据 数据
     * @param {*} params
     *  cyc 指标周期(D:日指标;M:月指标； Y:年度指标)
     *  deptId 单位ID
     */
    getSummaryDatas(params) {
        return request({
            url: '/home/branchPage/getSummaryDatas',
            method: 'post',
            params
        })
    },
    /**
     * 获取 清单明细 数据
     * @param {*} params
     *  cyc 指标周期(D:日指标;M:月指标； Y:年度指标)
     *  deptId 单位ID(默认为当前单位，也可以手动传递 大队 deptId)
     */
    getListDetailDatas(params) {
        return request({
            url: '/home/branchPage/getListDetailDatas',
            method: 'post',
            params
        })
    },
    /**
     * 获取 主要统计指标列表 数据
     * @param {*} params
     *  cyc 指标周期(D:日指标;M:月指标； Y:年度指标)
     *  deptId 单位ID
     */
    getBarChartDatas(params) {
        return request({
            url: '/home/branchPage/getBarChartDatas',
            method: 'post',
            params
        })
    },
    /**
     * 获取 主要统计指标列表下面的描述文字 数据
     * @param {*} params
     *  cyc 指标周期(D:日指标;M:月指标； Y:年度指标)
     *  deptId 单位ID
     */
    getBarTitleDatas(params) {
        return request({
            url: '/home/branchPage/getBarTitleDatas',
            method: 'post',
            params
        })
    },
    /**
     * 获取 警情类型图表 数据
     * @param {*} params
     *  cyc 指标周期(D:日指标;M:月指标； Y:年度指标)
     *  deptId 单位ID
     *  kpiId 指标ID（10001：警情；10002：火灾扑救；10003：抢险救援）pagePostData.cyc + 后面的编号
     */
    getPieChartDatas(params) {
        return request({
            url: '/home/branchPage/getPieChartDatas',
            method: 'post',
            params
        })
    }
};

// 大队首页接口
const brigadeHome = {
    /**
     * 获取 顶部 重点指标列表 数据
     * @param {*} params
     *  cyc 指标周期(D:日指标;M:月指标； Y:年度指标)
     *  deptId 单位ID
     */
    getIndexWarning(params) {
        return request({
            url: '/home/lessPage/getIndexWarning',
            method: 'post',
            params
        })
    },
    /**
     * 获取 柱状图列表 数据
     * @param {*} params
     *  cyc 指标周期(D:日指标;M:月指标； Y:年度指标)
     *  deptId 单位ID
     */
    getSquadronDatas(params) {
        return request({
            url: '/home/lessPage/getSquadronDatas',
            method: 'post',
            params
        })
    },
    /**
     * 获取 主要统计指标列表 数据
     * @param {*} params
     *  cyc 指标周期(D:日指标;M:月指标； Y:年度指标)
     *  deptId 单位ID
     */
    getBarChartDatas(params) {
        return request({
            url: '/home/lessPage/getBarChartDatas',
            method: 'post',
            params
        })
    },
    /**
     * 获取 主要统计指标列表下面的描述文字 数据
     * @param {*} params
     *  cyc 指标周期(D:日指标;M:月指标； Y:年度指标)
     *  deptId 单位ID
     */
    getBarTitleDatas(params) {
        return request({
            url: '/home/lessPage/getBarTitleDatas',
            method: 'post',
            params
        })
    },
    /**
     * 获取 警情类型图表 数据
     * @param {*} params
     *  cyc 指标周期(D:日指标;M:月指标； Y:年度指标)
     *  deptId 单位ID
     *  kpiId 指标ID（10001：警情；10002：火灾扑救；10003：抢险救援）pagePostData.cyc + 后面的编号
     */
    getPieChartDatas(params) {
        return request({
            url: '/home/lessPage/getPieChartDatas',
            method: 'post',
            params
        })
    }
};

// 中队首页接口
const squadronHome = {
    /**
     * 获取 顶部 重点指标列表 数据
     * @param {*} params
     *  cyc 指标周期(D:日指标;M:月指标； Y:年度指标)
     *  deptId 单位ID
     */
    getIndexWarning(params) {
        return request({
            url: '/home/squadronPage/getIndexWarning',
            method: 'post',
            params
        })
    },
    /**
     * 获取 主要统计指标列表 数据
     * @param {*} params
     *  cyc 指标周期(D:日指标;M:月指标； Y:年度指标)
     *  deptId 单位ID
     */
    getBarChartDatas(params) {
        return request({
            url: '/home/squadronPage/getBarChartDatas',
            method: 'post',
            params
        })
    },
    /**
     * 获取 主要统计指标列表下面的描述文字 数据
     * @param {*} params
     *  cyc 指标周期(D:日指标;M:月指标； Y:年度指标)
     *  deptId 单位ID
     */
    getBarTitleDatas(params) {
        return request({
            url: '/home/squadronPage/getBarTitleDatas',
            method: 'post',
            params
        })
    },
    /**
     * 获取 参战形式图表 数据
     * @param {*} params
     *  cyc 指标周期(D:日指标;M:月指标； Y:年度指标)
     *  deptId 单位ID
     *  kpiId 指标ID（10001：警情；10002：火灾扑救；10003：抢险救援）pagePostData.cyc + 后面的编号
     */
    getPieChartDatas(params) {
        return request({
            url: '/home/squadronPage/getPieChartDatas',
            method: 'post',
            params
        })
    }
};

// 多个首页通用接口
const commonHome = {
    /**
     * 获取 通知公告列表 数据
     */
    getHomeNoticeList(query) {
        return request({
            url: '/system/notice/getHomeNoticeList',
            method: 'get',
            params:query
        })
    },
    /**
     * 获取 待办事项列表 数据
     */
    queryWork() {
        return request({
            url: '/message/queryWork',
            method: 'post'
        })
    },
    /**
     * 获取 提醒事项列表 数据
     */
    xqQueryWork() {
        return request({
            url: '/message/xqQueryWork',
            method: 'post'
        })
    },
    /**
     * [getEtlTimeDatas 加载数据更新时间]
     * @Author       Miliky
     * @DateTime     2020-01-22T22:36:54+0800
     * @Description: [一行代码一行诗]
     * @return       {void}
     */
    getEtlTimeDatas() {
        return request({
            url: '/home/morePage/getEtlTimeDatas',
            method: 'post'
        })
    },
    /**
     * 提交是否已读状态
     * @param params
     */
    getRecordSysNoticeStatus(params){
        return request({
            url:'/system/notice/recordSysNoticeStatus',
            method: 'post',
            data:params
        })
    }
};

export {
    corpsHome,
    detachmentHome,
    brigadeHome,
    squadronHome,
    commonHome
}
