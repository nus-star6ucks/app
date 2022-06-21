import 'vue-class-component/hooks'
import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import './index.css'
import { PiniaVuePlugin, createPinia } from 'pinia'

Vue.use(VueCompositionAPI)
Vue.use(PiniaVuePlugin)

Vue.config.productionTip = false
axios.defaults.baseURL = 'http://localhost:8081/api'

const pinia = createPinia()

new Vue({
  router,
  pinia,
  render: h => h(App),
}).$mount('#app')

let healthTimer = setInterval(async () => {
  axios.get('/actuator/health').then(() => {
    if (window.removeLoading)
      window.removeLoading()
    clearInterval(healthTimer)
    healthTimer = null
  }).catch(() => {
    // do nothing
  })
}, 1000)

if (window.ipcRenderer) {
  window.ipcRenderer.on('main-process-message', (_event, ...args) => {
    console.log('[Receive Main-process message]:', ...args)
  })
}
