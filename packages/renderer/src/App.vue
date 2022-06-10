<template>
  <main class="py-4">
    <router-view />
  </main>
</template>

<script lang="ts">
import Vue from 'vue';
import useSWRV from 'swrv';
import { getHeartbeatService } from './services/heartbeat';
import { store } from './stores/index';
import Store from 'electron-store';

const connectElectronStoreToVuex = () => {
  const electronStore = new Store({ watch: true });
  Object.keys(store.state).forEach((key) => {
    console.log('register -> ', key);
    electronStore.onDidChange(key, (value) => {
      store.commit('updateByElectronStore', { key, value });
    });
  });
};

export default Vue.extend({
  setup() {
    useSWRV('/heartbeats', getHeartbeatService, {
      refreshInterval: 3000,
    });
  },
  mounted() {
    connectElectronStoreToVuex();
  },
});
</script>
