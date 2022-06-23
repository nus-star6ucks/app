<script lang="ts">
import Vue from 'vue'
import { ipcRenderer } from 'electron'
import { refreshCoinStates, refreshDrinkStates, refreshMachineStates, refreshUserStates } from './utils'

export default Vue.extend({
  async mounted() {
    await refreshCoinStates()
    await refreshDrinkStates()
    await refreshMachineStates()
    await refreshUserStates()

    ipcRenderer.on('refresh-all-states', async () => {
      await refreshCoinStates()
      await refreshDrinkStates()
      await refreshMachineStates()
      await refreshUserStates()
    })
    ipcRenderer.on('refresh-user-states', async () => {
      await refreshUserStates()
    })
    ipcRenderer.on('refresh-machine-states', async () => {
      await refreshMachineStates()
    })
    ipcRenderer.on('refresh-drink-states', async () => {
      await refreshDrinkStates()
    })
    ipcRenderer.on('refresh-coin-states', async () => {
      await refreshCoinStates()
    })
  },
})
</script>

<template>
  <main class="py-4">
    <router-view />
  </main>
</template>
