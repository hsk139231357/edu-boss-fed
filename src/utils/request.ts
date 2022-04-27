import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
import qs from 'qs'

const request = axios.create({
  // 配置选项
})

// Add a request interceptor
request.interceptors.request.use(function (config: any) {
  // Do something before request is sent
  const { user } = store.state
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

function redirectLogin () {
  router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

function refreshToken () {
  return axios.create()({
    method: 'POST',
    url: '/front/user/refresh_token',
    data: qs.stringify({
      refreshtoken: store.state.user.refresh_token
    })
  })
}

// Add a response interceptor
let isRefreshing = false // 控制刷新 token 的状态
let requests: any[] = [] // 储存刷新token期间的401请求，在刷新token成功之后，再次请求
request.interceptors.response.use(function (response) {
  // 所有状态码为2开头的都会进入这里
  return response
}, async function (error) {
  // 非2开头的状态码会进入这里
  if (error.response) { // 请求成功相应，但是状态码为非2开头的
    const { status } = error.response
    if (status === 400) {
      Message.error('请求参数错误')
    } else if (status === 401) {
      // 无效token
      if (!store.state.user) {
        redirectLogin()
        // 将请求失败的错误对象抛出，扔给下一个调用者
        return Promise.reject(error)
      }
      if (!isRefreshing) {
        isRefreshing = true
        return refreshToken().then((response) => {
          if (!response.data.success) {
            throw new Error('刷新Token失败')
          }
          store.commit('setUser', response.data.content)
          // 把requests中的请求重新调用
          requests.forEach(ev => ev())
          requests = []
          return request(error.config)
        }).catch(() => {
          store.commit('setUser', null)
          redirectLogin()
          return Promise.reject(error)
        }).finally(() => {
          isRefreshing = false
        })
      }
      // 刷新状态下，把请求挂起，存储在requests中
      return new Promise(resolve => {
        requests.push(() => {
          resolve(request(error.config))
        })
      })
      // try {
      //   const { data } = await axios.create()({
      //     method: 'POST',
      //     url: '/front/user/refresh_token',
      //     data: qs.stringify({
      //       refreshtoken: store.state.user.refresh_token
      //     })
      //   })
      //   // 把新的token更新到容器和本地存储中
      //   store.commit('setUser', data.content)
      //   // 将失败的请求重新发送
      //   return request(error.config) // error.config 就是报错接口的所有配置信息
      // } catch (e) {
      //   // 把当前用户登录状态清除
      //   store.commit('setUser', null)
      //   // 失败 -》 跳转登录页面进行登录流程获取token
      //   redirectLogin()
      //   return Promise.reject(error)
      // }
    } else if (status === 403) {
      Message.error('无权限，请联系管理员')
    } else if (status === 404) {
      Message.error('请求资源不存在')
    } else {
      Message.error('内部错误！')
    }
  } else if (error.request) { // 请求发出后未收到相应
    Message.error('请求超时，请刷新重试')
  } else { // 在设置请求时发生未知错误
    Message.error(`请求失败${error.message}`)
  }
})

export default request
