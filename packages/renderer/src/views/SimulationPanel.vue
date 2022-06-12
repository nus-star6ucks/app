<template>
  <div class="mx-auto max-w-md">
    <header class="text-black py-6 mb-2">
      <p class="text-center font-bold text-3xl tracking-tighter">Simulator Control Panel</p>
    </header>
    <div class="space-y-4 px-4">
      <div class="grid grid-cols-2 gap-4">
        <button
          class="btn-solid with-click bg-white py-4 aspect-square w-full"
          @click="
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
          class="btn-solid with-click bg-teal-100 py-4 aspect-square w-full"
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
          class="btn-solid with-click bg-red-50 py-4 aspect-square w-full"
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
      <button class="btn-solid bg-purple-100 py-4 rounded-md font-bold w-full">Begin Simulation</button>
      <button class="w-full uppercase font-semibold py-4">End Simulation</button>
    </footer>
  </div>
</template>

<script lang="ts">
import { BrowserWindowConstructorOptions, ipcRenderer } from 'electron';
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({})
export default class CustomerPanel extends Vue {
  text = '';

  newWindow(path: string, options?: BrowserWindowConstructorOptions) {
    ipcRenderer.invoke('open-win', path, options);
  }
}
</script>
