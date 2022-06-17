<script lang="ts">
import { fstat, readFileSync, writeFileSync } from 'fs'
import type { BrowserWindowConstructorOptions } from 'electron'
import { ipcRenderer } from 'electron'
import Vue from 'vue'
import Component from 'vue-class-component'
import type { Coin, Drink, Machine, User } from '../openapi'
import { useStore } from '../stores/machine'
import { baseApi } from '../utils'

interface IInitialDataFileDto {
  coins: Coin[]
  drinks: Drink[]
  users: User[]
  machines: Machine[]
}

@Component({})
export default class CustomerPanel extends Vue {
  filePath = ''

  $refs!: {
    input: HTMLInputElement
  }

  get fileLoaded(): boolean {
    const store = useStore()
    return Object.values(store.$state).every(data => data.length > 0)
  }

  newWindow(path: string, options?: BrowserWindowConstructorOptions) {
    ipcRenderer.invoke('open-win', path, options)
  }

  async handleFileInput(e: any) {
    const store = useStore()
    const [{ path }] = e.target.files
    this.filePath = `${path}`
    const data: IInitialDataFileDto = JSON.parse(readFileSync(path) as any)

    await baseApi.coinsPost(data.coins)
    await baseApi.drinksPost(data.drinks)
    await baseApi.usersPost(data.users)
    await baseApi.machinesPost(data.machines)

    store.$patch(data)
  }

  async handleEndSimulation() {
    const store = useStore()
    writeFileSync(this.filePath, JSON.stringify(store.$state), {
      flag: 'w',
    })

    store.$reset()
  }
}
</script>

<template>
  <div class="mx-auto max-w-md">
    <header class="text-black py-6 mb-2">
      <p class="text-center font-bold text-3xl tracking-tighter">
        Simulator Control Panel
      </p>
    </header>
    <div class="space-y-4 px-4">
      <div class="grid grid-cols-2 gap-4">
        <button
          :disabled="!fileLoaded"
          :class="[fileLoaded ? 'with-click' : '']"
          class="btn-solid bg-white py-4 aspect-square w-full" @click="
            () =>
              newWindow('/customer', {
                width: 1035,
                height: 660,
              })
          "
        >
          Activate Customer Panel
        </button>
        <button
          :disabled="!fileLoaded"
          class="btn-solid bg-teal-100 py-4 aspect-square w-full"
          :class="[fileLoaded ? 'with-click' : '']"
          @click="
            () =>
              newWindow('/maintainer', {
                width: 1035,
                height: 660,
              })
          "
        >
          Activate Maintainer Panel
        </button>
        <button
          :disabled="!fileLoaded"
          class="btn-solid bg-red-50 py-4 aspect-square w-full"
          :class="[fileLoaded ? 'with-click' : '']"
          @click="
            () =>
              newWindow('/machinery', {
                width: 1035,
                height: 660,
              })
          "
        >
          Activate Machinery Panel
        </button>
      </div>
    </div>
    <footer class="fixed bottom-0 left-0 px-4 pb-2 space-y-2 max-w-md w-full mx-auto">
      <button
        :class="{
          'btn-solid bg-purple-100 py-4 rounded-md font-bold w-full with-click': !fileLoaded,
          'w-full uppercase font-semibold py-4': fileLoaded,
        }"
        :disabled="fileLoaded"
        @click="() => $refs.input.click()"
      >
        Begin Simulation
      </button>
      <button
        :class="{
          'w-full uppercase font-semibold py-4': !fileLoaded,
          'btn-solid bg-purple-100 py-4 rounded-md font-bold w-full with-click': fileLoaded,
        }"
        :disabled="!fileLoaded"
        @click="handleEndSimulation"
      >
        End Simulation
      </button>
    </footer>
    <input ref="input" accept="application/JSON" :multiple="false" class="hidden" type="file" @change="handleFileInput">
  </div>
</template>
