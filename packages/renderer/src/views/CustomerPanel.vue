<script lang="ts">
import Vue from 'vue'
import { CoffeeMachine, Cola } from '@icon-park/vue'
import Component from 'vue-class-component'
import KeyboardSection from '../components/KeyboardSection.vue'
import type { Coin, Drink, Machine } from '../openapi'
import { useStore } from '../stores/machine'

@Component({
  components: {
    KeyboardSection,
    CoffeeMachine,
    Cola,
  },
})
export default class CustomerPanel extends Vue {
  selectedBrand: Drink | null = null
  invalidCoin = false
  totalMoneyInserted = 0
  collectCoins = 0

  get drinks(): Drink[] {
    const store = useStore()
    return store.$state.drinks
  }

  get coins(): Coin[] {
    const store = useStore()
    return store.$state.coins
  }

  get machine(): Machine {
    const store = useStore()
    return store.$state.machines[0]
  }

  get collectCanHereText(): string {
    if (this.selectedBrand && this.totalMoneyInserted >= this.selectedBrand?.price)
      return this.selectedBrand.name

    return 'NO CAN'
  }

  mounted() {
    document.title = 'VMCS - Customer Panel'
  }

  selectBrand(brand: Drink) {
    if (brand.quantity === 0 || this.selectedBrand)
      return
    this.selectedBrand = brand
  }

  insertCoin(coin: Coin) {
    // if (!AVAILABLE_NOMIALS.includes(nomial)) {
    //   this.invalidCoin = true
    //   return
    // }
    this.invalidCoin = false
    this.totalMoneyInserted += coin.value
  }

  terminateAndReturnCash() {
    this.totalMoneyInserted = 0
    this.invalidCoin = false
    this.collectCoins = 0
    this.selectedBrand = null
  }
}
</script>

<template>
  <div>
    <div class="px-6 mb-4 flex items-center space-x-2 -ml-1">
      <coffee-machine theme="outline" size="48" stroke-width="3" stroke-linejoin="bevel" stroke-linecap="butt" />
      <span class="uppercase font-medium" v-text="machine.name" />
    </div>
    <section class="px-6 grid gap-12 grid-cols-2">
      <div class="space-y-6">
        <section>
          <h2 class="font-bold text-lg tracking-tighter mb-2 uppercase">
            Brands
          </h2>
          <div class="space-y-3">
            <button
              v-for="drink in drinks"
              :key="drink.name"
              :disabled="drink.quantity > 0"
              class="w-full cursor-pointer btn-solid flex items-center justify-between space-x-2 p-4" :class="{
                active: selectedBrand && drink.name === selectedBrand.name,
              }"
              @click="() => selectBrand(drink)"
            >
              <div class="flex items-center space-x-2">
                <cola size="36" stroke-width="2" />
                <div class="flex items-center space-x-2">
                  <h2 class="text-2xl tracking-tighter" v-text="drink.name" />
                  <span class="led-small" v-text="drink.price" />
                </div>
              </div>
              <span
                class="led bg-red-600" :class="{
                  'opacity-30': drink.quantity > 0,
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
              class="led bg-red-600" :class="{
                'opacity-30': !invalidCoin,
              }"
            >
              INVALID COIN
            </span>
          </div>
          <div class="flex space-x-2 justify-between">
            <button
              v-for="coin in coins"
              :key="coin.id"
              class="btn-solid-small px-2 h-10" :class="{ 'with-click': !!selectedBrand }"
              :disabled="!selectedBrand"
              @click="insertCoin(coin)"
              v-text="coin.name"
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
            <span class="led-small" v-text="collectCanHereText" />
            <p class="font-bold">
              Collect Can Here
            </p>
          </div>
          <div class="border-2 border-black rounded-md p-4 uppercase">
            <span class="led-small">0c</span>
            <p class="font-bold">
              Collect Coins
            </p>
          </div>
          <div class="border-2 border-black rounded-md p-4 uppercase">
            <span class="led-small" v-text="totalMoneyInserted" />
            <p class="font-bold">
              Total Money Inserted
            </p>
          </div>
        </section>
      </aside>
    </section>
  </div>
</template>
