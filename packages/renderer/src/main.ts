import Vue from "vue";
import VueCompositionAPI from "@vue/composition-api";
import App from "./App.vue";
import router from "./router";
import { store } from "./stores/index";
import axios from "axios";
import "./index.css";

Vue.use(VueCompositionAPI);

Vue.config.productionTip = false;
axios.defaults.baseURL = "http://localhost:8081/api";

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount("#app");

if (window.removeLoading) window.removeLoading();

if (window.ipcRenderer)
    window.ipcRenderer.on("main-process-message", (_event, ...args) => {
        console.log("[Receive Main-process message]:", ...args);
    });
