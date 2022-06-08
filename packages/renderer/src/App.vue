<template>
  <main class="py-4">
    <router-view />
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import useSWRV from 'swrv'
import { getHeartbeatService } from './services/heartbeat'
export default Vue.extend({
  setup() {
    useSWRV('/heartbeats', getHeartbeatService, {
      refreshInterval: 3000,
    })
  },
})
</script>