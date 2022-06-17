<script lang="ts">
import Vue from 'vue'
import Store from 'electron-store'
import { MutationType } from 'pinia'
import { useStore } from './stores/machine'

const electronStore = new Store({ watch: true })

export default Vue.extend({
  setup() {
    const store = useStore()
    Object.keys(store.$state).forEach((key) => {
      store.$patch({
        [key]: electronStore.get(key) || [],
      })
    })
  },
  mounted() {
    const store = useStore()
    // sync electron-store <-> pinia
    Object.keys(store.$state).forEach((key) => {
      electronStore.onDidChange(key, (value) => {
        store.$patch({
          [key]: value,
        })
      })
    })

    // listen pinia change
    store.$subscribe(
      (mutation) => {
        if (mutation.type === MutationType.patchObject) {
          Object.entries(mutation.payload).forEach(([key, value]) => {
            const prev = electronStore.get(key)
            if (JSON.stringify(prev || []) === JSON.stringify(value || []))
              return
            electronStore.set(key, value)
          })
        }
      },
      { detached: true },
    )
  },
})
</script>

<template>
  <main class="py-4">
    <router-view />
  </main>
</template>
