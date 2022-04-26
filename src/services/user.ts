/**
 * 用户相关请求模块
 */

import request from '@/utils/request'
import qs from 'qs'
import store from '@/store'

interface User {
  phone: string,
  password: string
}
export const login = (data: User) => {
  return request({
    method: 'POST',
    // headers: { 'content-type': 'application/x-www-form-urlencoded' },
    url: '/front/user/login',
    data: qs.stringify(data)
  })
}

export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/front/user/getInfo'
  })
}
