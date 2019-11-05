import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    spin: false,
    cancelTokenArr: [] // 取消请求token数组
  },
  mutations: {
    showSpin (state, flag) {
      state.spin = flag
    },
    pushToken (state, payload) {
      state.cancelTokenArr.push(payload.cancelToken)
    },
    clearToken ({ cancelTokenArr }) {
      cancelTokenArr.forEach(item => {
        item('路由跳转取消请求')
      })
      cancelTokenArr = []
    }
  },
  actions: {

  }
})
