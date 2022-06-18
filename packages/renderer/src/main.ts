import 'vue-class-component/hooks';
import Vue from 'vue';
import VueCompositionAPI from '@vue/composition-api';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import './index.css';
import { createPinia, PiniaVuePlugin } from 'pinia';

Vue.use(VueCompositionAPI);
Vue.use(PiniaVuePlugin);

Vue.config.productionTip = false;
axios.defaults.baseURL = 'http://localhost:8081/api';

const pinia = createPinia();

new Vue({
  router,
  pinia,
  render: (h) => h(App),
}).$mount('#app');

if (window.removeLoading) window.removeLoading();

if (window.ipcRenderer)
  window.ipcRenderer.on('main-process-message', (_event, ...args) => {
    console.log('[Receive Main-process message]:', ...args);
  });
