import request from "@/utils/request";

const dataSearch = {

    //火灾查询
    queryZqxxData(data) {
        return request({
            url: `/data/entry/zqxx/queryZqxxData`,
            method: "post",
            data
        });
    },
    //火灾查询下载
    queryZqxxDataDownload(data) {
        return request({
            url: `/data/entry/zqxx/queryZqxxDataDownload`,
            method: "post",
            data
        });
    },
    //火灾、伤亡概览查询
    queryZqxxDataCommon(data) {
        return request({
            url: `/data/entry/zqxx/queryZqxxDataCommon`,
            method: "post",
            data
        });
    },
    // 人员伤亡查询
    queryRyswData(data) {
        return request({
            url: `/data/entry/zqxx/queryRyswData`,
            method: "post",
            data
        });
    },

    // 人员伤亡查询列表下载
    queryRyswDataDownload(data) {
        return request({
            url: `/data/entry/zqxx/queryRyswDataDownload`,
            method: "post",
            data
        });
    },

    // 火灾综合查询 (列表)
    fireGeneralSearchList(data) {
        return request({
            url: '/data/entry/zqxx/integratedQueryZqxxDataZh',
            method: 'post',
            data
        });
    },

    // 火灾综合查询 (汇总)
    fireGeneralSearchSummary(data) {
        return request({
            url: '/data/entry/zqxx/integratedQueryZqxxDataCommon',
            method: 'post',
            data
        });
    },

    // 火灾综合查询 (下载)
    fireGeneralSearchDownload(data) {
        return request({
            url: '/data/entry/zqxx/integratedQueryZqxxDataDownload',
            method: 'post',
            data
        });
    },

    // 出动伤亡查询 (列表)
    dispatchCasualtySearchList(data) {
        return request({
            url: '/dataAduit/queryCdxxRyswData',
            method: 'post',
            data
        });
    },

    // 出动伤亡查询 (汇总)
    dispatchCasualtySearchSummary(data) {
        return request({
            url: '/dataAduit/queryCdxxDataCommon',
            method: 'post',
            data
        });
    },

    // 出动伤亡查询 (下载)
    dispatchCasualtySearchDownload(data) {
        return request({
            url: '/dataAduit/queryCdxxRyswDownload',
            method: 'post',
            data
        });
    }

};

export default dataSearch;
