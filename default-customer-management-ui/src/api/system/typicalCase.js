import request from '@/utils/request'

// 查询典型案例列表
export function listTypicalCase(query) {
    return request({
        url: '/typicalCase/list',
        method: 'get',
        params: query
    })
}

// 根据字典类型查询字典数据信息
export function getTypicalDicts() {
    return request({
        url: '/typicalCase/queryDictType',
        method: 'get'
    })
}

export function getDeptLevel() {
    return request({
        url: '/typicalCase/getDeptLevel',
        method: 'get'
    })
}

// 上传图片
export function UploadPicFile(data) {
    return request({
        url: '/typicalCase/uploadAttachment',
        method: 'post',
        data: data,
        headers: { 'Content-Type': 'multipart/form-data' }
    })
}

// 删除图片
export function deletePicByFilePath(params) {
    return request({
        url: '/typicalCase/deletePicByFilePath',
        method: 'post',
        params
    })
}

// 新增典型案例
export function addTypicalCase(data) {
    return request({
        url: '/typicalCase',
        method: 'post',
        data: data
    })
}

// 修改公告
export function updateTypicalCase(data) {
    return request({
        url: '/typicalCase',
        method: 'put',
        data: data
    })
}

// 删除典型案例
export function delTypicalCase(typicalCaseId) {
    return request({
        url: '/typicalCase/' + typicalCaseId,
        method: 'delete'
    })
}

// 查询典型案例详细
export function getTypicalCase(typicalCaseId) {
    return request({
        url: '/typicalCase/' + typicalCaseId,
        method: 'get'
    })
}
