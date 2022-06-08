import Vue from 'vue'
import Vuex from 'vuex'
import createSharedMutations from '../utils/shared-mutations'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createSharedMutations()],
  state: {},
  mutations: {},
  actions: {},
  modules: {},
})
