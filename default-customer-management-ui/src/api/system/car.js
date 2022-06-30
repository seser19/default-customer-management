import request from '@/utils/request'

// 查询车辆列表
export function listCar(query) {
  return request({
    url: '/system/car/list',
    method: 'get',
    params: query
  })
}

// 查询车辆详细
export function getCar(carId) {
  return request({
    url: '/system/car/' + carId,
    method: 'get'
  })
}

// 新增车辆
export function addCar(data) {
  return request({
    url: '/system/car',
    method: 'post',
    data: data
  })
}

// 修改车辆
export function updateCar(data) {
  return request({
    url: '/system/car',
    method: 'put',
    data: data
  })
}

// 删除车辆
export function delCar(carId) {
  return request({
    url: '/system/car/' + carId,
    method: 'delete'
  })
}

// 车辆密码重置
export function resetCarPwd(carId, password) {
  const data = {
    carId,
    password
  }
  return request({
    url: '/system/car/resetPwd',
    method: 'put',
    data: data
  })
}

// 车辆状态修改
export function changeCarStatus(carId, status) {
  const data = {
    carId,
    status
  }
  return request({
    url: '/system/car/changeStatus',
    method: 'put',
    data: data
  })
}

// 查询车辆个人信息
export function getCarProfile() {
  return request({
    url: '/system/car/profile',
    method: 'get'
  })
}

// 修改车辆个人信息
export function updateCarProfile(data) {
  return request({
    url: '/system/car/profile',
    method: 'put',
    data: data
  })
}

// 车辆密码重置
export function updateCarPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/system/car/profile/updatePwd',
    method: 'put',
    params: data
  })
}

// 车辆头像上传
export function uploadAvatar(data) {
  return request({
    url: '/system/car/avatar',
    method: 'post',
    data: data
  })
}


// 获取车辆省份的简称
export function getCarPlateInfo() {
  return request({
    url: '/system/car/getCarPlateInfo',
    method: 'get'
  })
}
