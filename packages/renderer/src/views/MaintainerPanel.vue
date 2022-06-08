<template>
  <div>
    <div class="px-6 mb-4 flex items-center space-x-2 -ml-1">
      <coffee-machine
        theme="outline"
        size="48"
        stroke-width="3"
        stroke-linejoin="bevel"
        stroke-linecap="butt"
      />
      <span class="uppercase font-medium">Maintainer Panel</span>
    </div>
    <section class="px-6 grid gap-12 grid-cols-2">
      <div class="space-y-6">
        <section>
          <h2 class="font-bold text-lg tracking-tighter mb-2 uppercase">
            Quantity of Coins Available
          </h2>
          <div class="space-y-3">
            <div
              v-for="q in quantities"
              :key="q.title"
              class="cursor-pointer btn-solid flex items-center justify-between space-x-2 px-4 py-2"
            >
              <div class="flex items-center space-x-2">
                <finance :size="36" :stroke-width="2" />
                <h2 class="text-2xl tracking-tighter" v-text="q.title"></h2>
              </div>
              <span class="led-small" v-text="q.quantity"></span>
            </div>
          </div>
        </section>
        <section>
          <h2 class="font-bold text-lg tracking-tighter mb-2 uppercase">
            Quantity of Drinks Available
          </h2>
          <div class="space-y-3">
            <div
              v-for="brand in brands"
              :key="brand.title"
              class="cursor-pointer btn-solid flex items-center justify-between space-x-2 px-4 py-2"
            >
              <div class="flex items-center space-x-2">
                <Cola size="36" stroke-width="2" />
                <div class="flex items-center space-x-2">
                  <h2 class="text-2xl tracking-tighter" v-text="brand.title"></h2>
                </div>
              </div>
              <span class="led-small" v-text="brand.quantity"></span>
            </div>
          </div>
        </section>
      </div>
      <aside class="space-y-6">
        <section class="space-y-2">
          <div class="flex justify-between items-center">
            <h2 class="font-bold text-lg tracking-tighter uppercase">Misc</h2>
          </div>
          <section class="grid grid-cols-2 gap-2">
            <div class="border-2 border-black rounded-md p-4 uppercase">
              <p class="font-bold tracking-tighter">Brand Price</p>
              <input
                type="text"
                class="px-1 text-sm w-full font-bold border-2 border-black rounded-md transition-all"
                width="100%"
                value="75c"
              />
            </div>
            <div class="border-2 border-black rounded-md p-4 uppercase">
              <span class="led-small">No Can</span>
              <p class="font-bold tracking-tighter">Collect Can Here</p>
            </div>
            <div class="border-2 border-black rounded-md p-4 uppercase">
              <span class="font-bold">
                <span class="tracking-tighter">Collect Cash</span>
                <span class="ml-2 led-small">2730c</span>
              </span>

              <p class="font-bold mt-1">
                <button class="w-full btn-solid-small text-xs p-1">
                  Press to Collect All Cash
                </button>
              </p>
            </div>
            <div class="border-2 border-black rounded-md p-4 uppercase">
              <span class="font-bold">
                <span class="tracking-tighter">Total Cash</span>
                <span class="ml-2 led-small">4470c</span>
              </span>
              <p class="font-bold mt-1">
                <button class="w-full btn-solid-small text-xs p-1">Show Total Cash Held</button>
              </p>
            </div>
          </section>
          <button class="btn-solid bg-purple-100 py-4 rounded-md font-bold w-full">
            Press Here When Finished
          </button>
        </section>
        <section class="space-y-2">
          <div class="flex justify-between items-center">
            <h2 class="font-bold text-lg tracking-tighter uppercase">Password</h2>
          </div>
          <div class="flex justify-between items-center">
            <span class="led bg-teal-600">Valid Password</span>
            <span class="led bg-red-600 opacity-30">Invalid Password</span>
          </div>
          <input
            type="password"
            maxLength="6"
            class="p-1 w-full font-bold border-2 border-black rounded-md transition-all"
            width="100%"
          />
        </section>
      </aside>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { CoffeeMachine, Cola, Finance } from '@icon-park/vue'

const brands = [
  {
    title: 'Coca-Cola',
    quantity: 75,
  },
  {
    title: 'Sarsi',
    quantity: 13,
  },
  {
    title: 'Soya Bean',
    quantity: 21,
  },
  {
    title: 'Sevenup',
    quantity: 57,
  },
]

const quantities = [
  {
    title: '5c',
    quantity: 22,
  },
  {
    title: '10c',
    quantity: 37,
  },
  {
    title: '20c',
    quantity: 9,
  },
  {
    title: '$1',
    quantity: 10,
  },
]

export default Vue.extend({
  components: {
    CoffeeMachine,
    Cola,
    Finance,
  },
  data() {
    return {
      brands,
      quantities,
    }
  },
})
</script>
