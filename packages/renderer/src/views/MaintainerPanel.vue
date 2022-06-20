<script lang="ts">
import Vue from 'vue'
import { CoffeeMachine, Cola, Finance } from '@icon-park/vue'
import Component from 'vue-class-component'
import type { Coin, Drink, Machine } from '../openapi'
import { useStore } from '../stores/machine'
import { coinApi, drinkApi, userApi } from '../utils'

@Component({
  components: {
    CoffeeMachine,
    Cola,
    Finance,
  },
})
export default class CustomerPanel extends Vue {
  password = ''
  valid = false
  selectedCoin: Coin | null = null
  selectedDrink: Drink | null = null
  displayTotalCashHeld = false
  cashCollected = -1

  get coins(): Coin[] {
    const store = useStore()
    return store.$state.coins
  }

  get drinks(): Drink[] {
    const store = useStore()
    return store.$state.drinks
  }

  get machine(): Machine {
    const store = useStore()
    return store.$state.machines[0]
  }

  get allowToUse(): boolean {
    return this.password.length === 6 && this.valid === true
  }

  get totalCashHeld(): number {
    return this.computeTotalCashHeld()
  }

  showTotalCashHeld() {
    this.displayTotalCashHeld = true
  }

  computeTotalCashHeld() {
    return this.coins.reduce((acc, prev) => acc += prev.value * prev.quantity, 0)
  }

  async collectAllCash() {
    const store = useStore()

    this.cashCollected = this.computeTotalCashHeld()

    const updatedCoins = this.coins.map((c) => {
      c.quantity = 0
      return c
    })
    await coinApi.coinsPut(updatedCoins)

    // for mock use
    store.$patch({
      coins: updatedCoins,
    })
  }

  async updateDrinkPrice(drink: Drink, price: number) {
    const store = useStore()

    drink.price = price
    await drinkApi.drinksPut([drink])

    // mock use
    store.$patch({
      drinks: store.$state.drinks.map(d => d.id === drink.id ? d : d),
    })
  }

  async pressHereWhenFinished() {
    await userApi.authLogoutPost()

    // for mock use
    const store = useStore()
    const [machine] = store.$state.machines
    if (machine.doorLocked) {
      // panel become inactive
      this.password = ''
    }
  }

  async validate(e: any) {
    const store = useStore()
    this.password = e.target.value

    if (this.password.length === 6) {
      try {
        await userApi.authLoginPost({ password: this.password })
        // should update machine status
        this.valid = true
      }
      catch (e) {
        this.valid = false
      }
      // for mock use
      this.valid = store.$state.users[0].password === this.password
      if (this.valid) {
        const [machine] = store.$state.machines
        machine.doorLocked = false
        store.$patch({
          machines: [machine],
        })
      }
    }
  }

  mounted() {
    document.title = 'VMCS - Maintainer Panel'
  }
}
</script>

<template>
  <div>
    <div class="px-6 mb-4 flex items-center space-x-2 -ml-1">
      <coffee-machine theme="outline" size="48" stroke-width="3" stroke-linejoin="bevel" stroke-linecap="butt" />
      <span class="uppercase font-medium">Maintainer Panel</span>
    </div>
    <section class="px-6 grid gap-12 grid-cols-2">
      <div class="space-y-6">
        <section>
          <h2 class="font-bold text-lg tracking-tighter mb-2 uppercase">
            Quantity of Coins Available
          </h2>
          <div class="space-y-3">
            <button
              v-for="coin in coins"
              :key="coin.id"
              :class="{ 'with-click': allowToUse }"
              class="btn-solid w-full flex items-center justify-between space-x-2 px-4 py-2"
              :disabled="!allowToUse"
              @click="selectedCoin = coin"
            >
              <div class="flex items-center space-x-2">
                <finance :size="36" :stroke-width="2" />
                <h2 class="text-2xl tracking-tighter" v-text="coin.name" />
              </div>
              <span v-if="selectedCoin && selectedCoin.id === coin.id" class="led-small" v-text="coin.quantity" />
            </button>
          </div>
        </section>
        <section>
          <h2 class="font-bold text-lg tracking-tighter mb-2 uppercase">
            Quantity of brands Available
          </h2>
          <div class="space-y-3">
            <button
              v-for="drink in drinks"
              :key="drink.id"
              :disabled="!allowToUse"
              :class="{ 'with-click': allowToUse }"
              class="w-full btn-solid flex items-center justify-between space-x-2 px-4 py-2"
              @click="selectedDrink = drink"
            >
              <div class="flex items-center space-x-2">
                <Cola size="36" stroke-width="2" />
                <div class="flex items-center space-x-2">
                  <h2 class="text-2xl tracking-tighter" v-text="drink.name" />
                </div>
              </div>
              <span v-if="selectedDrink && selectedDrink.id === drink.id" class="led-small" v-text="drink.quantity" />
            </button>
          </div>
        </section>
      </div>
      <aside class="space-y-6">
        <section class="space-y-2">
          <div class="flex justify-between items-center">
            <h2 class="font-bold text-lg tracking-tighter uppercase">
              Misc
            </h2>
          </div>
          <section class="grid grid-cols-2 gap-2">
            <div class="border-2 border-black rounded-md p-4 uppercase">
              <p class="font-bold tracking-tighter">
                Brand Price
              </p>
              <span class="flex font-bold space-x-2 w-24">
                <input
                  type="number"
                  class="px-1 text-sm w-full font-bold border-2 border-black rounded-md transition-all"
                  width="100%"
                  min="0"
                  :value="selectedDrink?.price"
                  :readonly="!allowToUse"
                  @input="(e) => updateDrinkPrice(selectedDrink, +e.target.value)"
                >
                <span>c</span>
              </span>
            </div>
            <div class="border-2 border-black rounded-md p-4 uppercase">
              <span class="font-bold">
                <span class="tracking-tighter">Collect Cash</span>
                <span v-if="cashCollected > -1" class="ml-2 led-small" v-text="`${cashCollected}c`" />
              </span>

              <p class="font-bold mt-1">
                <button
                  class="w-full btn-solid-small text-xs p-1"
                  :class="{ 'with-click': allowToUse }"
                  :disabled="!allowToUse"
                  @click="collectAllCash"
                >
                  Press to Collect All Cash
                </button>
              </p>
            </div>
            <div class="border-2 border-black rounded-md p-4 uppercase">
              <span class="font-bold">
                <span class="tracking-tighter">Total Cash</span>
                <span
                  v-if="displayTotalCashHeld"
                  class="ml-2 led-small"
                  v-text="`${totalCashHeld}c`"
                />
              </span>
              <p class="font-bold mt-1">
                <button
                  :disabled="!allowToUse"
                  :class="{ 'with-click': allowToUse }"
                  class="w-full btn-solid-small text-xs p-1"
                  @click="showTotalCashHeld"
                >
                  Show Total Cash Held
                </button>
              </p>
            </div>
            <button
              :disabled="!allowToUse"
              :class="{ 'with-click': allowToUse }"
              class="btn-solid bg-purple-100 py-4 rounded-md font-bold w-full"
              @click="pressHereWhenFinished"
            >
              Press Here When Finished
            </button>
          </section>
        </section>
        <section class="space-y-2">
          <div class="flex justify-between items-center">
            <h2 class="font-bold text-lg tracking-tighter uppercase">
              Password
            </h2>
          </div>
          <div class="flex justify-between items-center">
            <span
              class="led bg-teal-600" :class="{
                'opacity-30': !valid || password.length < 6,
              }"
            >Valid Password</span>
            <span
              class="led bg-red-600" :class="{
                'opacity-30': valid || password.length < 6,
              }"
            >Invalid Password</span>
          </div>
          <input
            type="password"
            maxLength="6"
            class="p-1 w-full font-bold border-2 border-black rounded-md transition-all"
            width="100%"
            @input="validate"
          >
        </section>
      </aside>
    </section>
  </div>
</template>
