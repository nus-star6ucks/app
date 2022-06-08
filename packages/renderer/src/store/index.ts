import Vue from 'vue'
import Vuex from 'vuex'
import Store from 'electron-store'

Vue.use(Vuex)

const electronStore = new Store({ watch: true })

export const store = new Vuex.Store({
  state: {
    text: '',
  },
  mutations: {
    updateByElectronStore(state, payload: { key: string; value: any }) {
      const curr = electronStore.get(payload.key)
      if (curr && curr == state[payload.key as keyof typeof state]) return
      state[payload.key as keyof typeof state] = payload.value
      electronStore.set(payload.key, payload.value)
    },
  },
})
