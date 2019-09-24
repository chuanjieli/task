import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    spin: false
  },
  mutations: {
    showSpin (state, flag) {
      state.spin = flag
    }
  },
  actions: {

  }
})
