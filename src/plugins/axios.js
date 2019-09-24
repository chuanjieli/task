'use strict'

import Vue from 'vue'
import axios from 'axios'
import router from '../router'
// import store from '../store'
import { Message } from 'iview'
Vue.component('Message', Message)
// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  baseURL: process.env.VUE_APP_BASE_API || process.env.VUE_APP_URL || '',
  timeout: 60 * 1000, // Timeout
  withCredentials: true // Check cross-site Access-Control
}

const _axios = axios.create(config)

_axios.interceptors.request.use(
  function (config) {
    // if (config.method === 'get' && config.url.startsWith('/report/list')) {
    //   store.commit('showSpin', false)
    // } else if (config.method === 'get' && config.url.startsWith('/task/result')) {
    //   store.commit('showSpin', false)
    // } else if (config.method === 'get') {
    //   console.log(1)

    //   store.commit('showSpin', true)
    // } else {
    //   console.log(2)

    //   store.commit('showSpin', false)
    // }
    // Do something before request is sent
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
_axios.interceptors.response.use(
  function (response) {
    // store.commit('showSpin', false)
    // Do something with response data
    return response
  },
  function (error) {
    if (error.response.status === 401) {
      Message.error({
        content: '登录时间过期',
        duration: 5,
        closable: true
      })
      router.push('/login')
    } else if (error.response.status === 400) {
      Message.error({
        content: error.response.data.reason,
        duration: 5,
        closable: true
      })
    } else if (error.response.status >= 500) {
      Message.error({
        content: '服务器忙，请稍后重试',
        duration: 5,
        closable: true
      })
    }
    // Do something with response error
    return Promise.reject(error)
  }
)

Plugin.install = function (Vue, options) {
  Vue.axios = _axios
  window.axios = _axios
  Object.defineProperties(Vue.prototype, {
    axios: {
      get () {
        return _axios
      }
    },
    $axios: {
      get () {
        return _axios
      }
    }
  })
}

Vue.use(Plugin)

export default Plugin
