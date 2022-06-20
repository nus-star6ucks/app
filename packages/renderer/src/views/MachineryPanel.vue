<script lang="ts">
import { CheckCorrect, Checkbox, CoffeeMachine, Cola, Finance } from '@icon-park/vue'
import Vue from 'vue'
import Component from 'vue-class-component'
import KeyboardSection from '../components/KeyboardSection.vue'
import type { Coin, Drink } from '../openapi'
import { useStore } from '../stores/machine'
import { coinApi, drinkApi, machineApi } from '../utils'

@Component({
  components: { CoffeeMachine, Cola, Finance, KeyboardSection, Checkbox, CheckCorrect },
})
export default class CustomerPanel extends Vue {
  get machine() {
    const store = useStore()
    return store.$state.machines[0]
  }

  get drinks() {
    const store = useStore()
    return store.$state.drinks
  }

  get coins() {
    const store = useStore()
    return store.$state.coins
  }

  async switchDoorLocked() {
    const store = useStore()
    const machine = store.$state.machines[0]
    machine.doorLocked = !machine.doorLocked

    await machineApi.machinesPut([machine])

    // mock use
    store.$patch({
      machines: [machine],
    })
  }

  async updateCoinQuantity(coin: Coin, quantity: number) {
    const store = useStore()

    coin.quantity = quantity
    await coinApi.coinsPut([coin])

    // mock use
    // store.$patch({
    //   coins: store.$state.coins.map(c => c.id === coin.id ? coin : c),
    // })
  }

  async updateDrinkQuantity(drink: Drink, quantity: number) {
    const store = useStore()

    drink.quantity = quantity
    await drinkApi.drinksPut([drink])

    // mock use
    store.$patch({
      drinks: store.$state.drinks.map(d => d.id === drink.id ? drink : d),
    })
  }

  mounted() {
    document.title = 'VMCS - Machinery Panel'
  }
}
</script>

<template>
  <div>
    <div class="px-6 mb-4 flex items-center space-x-2 -ml-1">
      <coffee-machine theme="outline" :size="48" stroke-width="3" stroke-linejoin="bevel" stroke-linecap="butt" />
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
              v-for="coin in coins"
              :key="coin.id"
              class="border-2 border-black rounded-md p-4 uppercase flex justify-between items-center"
            >
              <div class="flex items-center space-x-2 font-semibold">
                <finance :size="36" :stroke-width="2" />
                <div class="flex items-center space-x-2">
                  <h2 class="text-2xl tracking-tighter" v-text="coin.name" />
                </div>
              </div>
              <input type="number" min="0" max="40" class="led-small" :value="coin.quantity" @input="(e) => updateCoinQuantity(coin, +e.target.value)">
            </div>
          </div>
        </section>
      </div>
      <aside class="space-y-6">
        <section>
          <h2 class="font-bold text-lg tracking-tighter mb-2 uppercase">
            Quantity of Cans
          </h2>
          <div class="grid grid-cols-2 gap-2">
            <div
              v-for="drink in drinks"
              :key="drink.id"
              class="border-2 border-black rounded-md p-4 uppercase flex justify-between items-center"
            >
              <div class="flex items-center space-x-2 font-semibold">
                <cola :size="36" :stroke-width="2" />
                <div class="flex items-center space-x-2">
                  <h2 class="text-xl tracking-tighter" v-text="drink.name" />
                </div>
              </div>
              <input type="number" min="0" max="20" class="led-small" :value="drink.quantity" @input="(e) => updateDrinkQuantity(drink, +e.target.value)">
            </div>
          </div>
        </section>
        <section>
          <div class="flex justify-between items-center mb-2">
            <h2 class="font-bold text-lg tracking-tighter uppercase">
              Misc
            </h2>
          </div>
          <div>
            <button class="font-semibold text-lg flex items-center" @click="switchDoorLocked">
              <checkbox v-if="!machine.doorLocked" theme="outline" size="36" :stroke-width="2" stroke-linejoin="bevel" stroke-linecap="butt" />
              <check-correct v-else theme="outline" size="36" :stroke-width="2" stroke-linejoin="bevel" stroke-linecap="butt" />
              <span class="ml-2">Door Locked?</span>
            </button>
          </div>
        </section>
      </aside>
    </section>
  </div>
</template>
