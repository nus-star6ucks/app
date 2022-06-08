<template>
  <main class="py-4">
    <router-view />
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import useSWRV from 'swrv'
import { getHeartbeatService } from './services/heartbeat'
import Store from 'electron-store'
import { store } from "./store/index";

const connectElectronStoreToVuex = () => {
    const electronStore = new Store({ watch: true });
    Object.keys(store.state).forEach((key) => {
        console.log("register -> ", key);
        electronStore.onDidChange(key, (value: any) => {
            store.commit("updateByElectronStore", { key, value });
        });
    });
};

export default Vue.extend({
  setup() {
    useSWRV('/heartbeats', getHeartbeatService, {
      refreshInterval: 3000,
    })
  },
  mounted() {
    connectElectronStoreToVuex()
  }
})
</script>