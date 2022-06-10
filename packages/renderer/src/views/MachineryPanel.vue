<template>
  <div>
    <div class="px-6 mb-4 flex items-center space-x-2 -ml-1">
      <coffee-machine
        theme="outline"
        :size="48"
        stroke-width="3"
        stroke-linejoin="bevel"
        stroke-linecap="butt"
      />
      <span class="uppercase font-medium">Machinery Panel</span>
    </div>
    <section class="px-6 grid gap-12 grid-cols-2">
      <div class="space-y-6">
        <section>
          <h2 class="font-bold text-lg tracking-tighter mb-2 uppercase">
            Quantity of Coins
          </h2>
          <div class="grid grid-cols-2 gap-2">
            <div
              v-for="q in quantities"
              :key="q.title"
              class="border-2 border-black rounded-md p-4 uppercase flex justify-between items-center"
            >
              <div class="flex items-center space-x-2 font-semibold">
                <finance :size="36" :stroke-width="2" />
                <div class="flex items-center space-x-2">
                  <h2 class="text-2xl tracking-tighter" v-text="q.title" />
                </div>
              </div>
              <span class="led-small" v-text="q.quantity" />
            </div>
          </div>
        </section>
        <section>
          <h2 class="font-bold text-lg tracking-tighter mb-2 uppercase">
            Quantity of Cans
          </h2>
          <div class="grid grid-cols-2 gap-2">
            <div
              v-for="brand in brands"
              :key="brand.title"
              class="border-2 border-black rounded-md p-4 uppercase flex justify-between items-center"
            >
              <div class="flex items-center space-x-2 font-semibold">
                <cola :size="36" :stroke-width="2" />
                <div class="flex items-center space-x-2">
                  <h2 class="text-xl tracking-tighter" v-text="brand.title" />
                </div>
              </div>
              <span class="led-small" v-text="brand.quantity" />
            </div>
          </div>
        </section>
      </div>
      <aside class="space-y-6">
        <section>
          <div class="flex justify-between items-center mb-2">
            <h2 class="font-bold text-lg tracking-tighter uppercase">Misc</h2>
          </div>
          <div>
            <label class="font-semibold text-lg flex items-center">
              <!-- <Checkbox />
              <CheckboxFill /> -->
              <span class="ml-2">Door Locked?</span>
            </label>
          </div>
        </section>
        <section>
          <div class="flex justify-between items-center mb-2">
            <h2 class="font-bold text-lg tracking-tighter uppercase">State</h2>
          </div>
        </section>
        <keyboard-section disabled />
      </aside>
    </section>
  </div>
</template>

<script lang="ts">
import { CoffeeMachine, Cola, Finance } from '@icon-park/vue'
import Vue from 'vue'
import KeyboardSection from '../components/KeyboardSection.vue'

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

const brands = [
  {
    title: 'Coca-Cola',
    quantity: 5,
  },
  {
    title: 'Sarsi',
    quantity: 7,
  },
  {
    title: 'Soya Bean',
    quantity: 12,
  },
  {
    title: 'Sevenup',
    quantity: 1,
  },
]

export default Vue.extend({
  components: { CoffeeMachine, Cola, Finance, KeyboardSection },
  data() {
    return {
      brands,
      quantities,
    }
  },
})
</script>
