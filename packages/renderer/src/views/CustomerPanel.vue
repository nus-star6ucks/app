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
      <span class="uppercase font-medium">Soft Drink Dispenser</span>
    </div>
    <section class="px-6 grid gap-12 grid-cols-2">
      <div class="space-y-6">
        <section>
          <h2 class="font-bold text-lg tracking-tighter mb-2 uppercase">
            Brands
          </h2>
          <div class="space-y-3">
            <button
              v-for="brand in brands"
              :key="brand.title"
              :disabled="!brand.inStock"
              :class="{
                'w-full cursor-pointer btn-solid flex items-center justify-between space-x-2 p-4': true,
                active: brand.title === selectedBrand,
              }"
              @click="() => selectBrand(brand)"
            >
              <div class="flex items-center space-x-2">
                <cola size="36" stroke-width="2" />
                <div class="flex items-center space-x-2">
                  <h2 class="text-2xl tracking-tighter" v-text="brand.title" />
                  <span class="led-small" v-text="brand.price" />
                </div>
              </div>
              <span
                :class="{
                  'led bg-red-600': true,
                  'opacity-30': brand.inStock,
                }"
              >
                NOT IN STOCK
              </span>
            </button>
          </div>
        </section>
      </div>
      <aside class="space-y-6">
        <section>
          <div class="flex justify-between items-center mb-2">
            <h2 class="font-bold text-lg tracking-tighter uppercase">
              Enter Coins Here
            </h2>
            <span
              :class="{
                'led bg-red-600': true,
              }"
            >
              INVALID COIN
            </span>
          </div>
          <div class="flex space-x-2 justify-between">
            <button
              v-for="coin in ['5c', '10c', '20c', '50c', '$1', 'Invalid']"
              :key="coin"
              class="btn-solid-small px-2 h-10"
              :disabled="!selectedBrand"
              v-text="coin"
            />
          </div>
        </section>
        <section class="grid grid-cols-2 gap-2">
          <div class="border-2 border-black rounded-md p-4 uppercase">
            <span class="led bg-red-600 opacity-30">No Change Available</span>
            <p class="font-bold mt-1">
              <button class="btn-solid-small text-xs p-1">
                Terminate and Return Cash
              </button>
            </p>
          </div>
          <div class="border-2 border-black rounded-md p-4 uppercase">
            <span class="led-small">No Can</span>
            <p class="font-bold">Collect Can Here</p>
          </div>
          <div class="border-2 border-black rounded-md p-4 uppercase">
            <span class="led-small">0c</span>
            <p class="font-bold">Collect Coins</p>
          </div>
          <div class="border-2 border-black rounded-md p-4 uppercase">
            <span class="led-small">30c</span>
            <p class="font-bold">Total Money Inserted</p>
          </div>
        </section>
        <keyboard-section />
      </aside>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { CoffeeMachine, Cola } from '@icon-park/vue'
import KeyboardSection from '../components/KeyboardSection.vue'

export default Vue.extend({
  components: {
    KeyboardSection,
    CoffeeMachine,
    Cola,
  },
  data() {
    return {
      selectedBrand: '',
    }
  },
  computed: {
    brands() {
      return [
        {
          title: 'Coca-Cola',
          price: '75c',
          inStock: true,
        },
        {
          title: 'Sarsi',
          price: '70c',
          inStock: true,
        },
        {
          title: 'Soya Bean',
          price: '60c',
          inStock: false,
        },
        {
          title: 'Sevenup',
          price: '75c',
          inStock: true,
        },
      ]
    },
  },
  methods: {
    selectBrand(brand: any) {
      if (!brand.inStock) return
      if (this.selectedBrand === brand.title) {
        this.selectedBrand = ''
        return
      }
      this.selectedBrand = brand.title
    },
  },
})
</script>
