<script lang="ts">
import Vue from 'vue'
import { CoffeeMachine, Cola, Finance } from '@icon-park/vue'
import Component from 'vue-class-component'
import { formatCentsText } from '../utils'
import type { Coin, Drink } from '../openapi'
import { useMachineStore } from '../stores/machine'

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
  selectedBrand: Drink | null = null
  totalCashHeld = 0

  get formatCentsText() {
    return formatCentsText
  }

  get coins(): Coin[] {
    const machine = useMachineStore()
    return machine.$state.coins
  }

  get drinks(): Drink[] {
    const machine = useMachineStore()
    return machine.$state.drinks
  }

  get allowToUse(): boolean {
    return this.password.length === 6 && this.valid === true
  }

  validate(e: any) {
    const machine = useMachineStore()
    this.password = e.target.value
    // ...
    if (this.password.length === 6)
      this.valid = machine.$state.users[0].password === this.password
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
              class="btn-solid with-click w-full flex items-center justify-between space-x-2 px-4 py-2"
              @click="selectedCoin = coin"
            >
              <div class="flex items-center space-x-2">
                <finance :size="36" :stroke-width="2" />
                <h2 class="text-2xl tracking-tighter" v-text="coin.name" />
              </div>
              <span v-if="selectedCoin === coin" class="led-small" v-text="coin.quantity" />
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
              :key="drink.name"
              class="w-full btn-solid with-click flex items-center justify-between space-x-2 px-4 py-2"
              @click="selectedBrand = drink"
            >
              <div class="flex items-center space-x-2">
                <Cola size="36" stroke-width="2" />
                <div class="flex items-center space-x-2">
                  <h2 class="text-2xl tracking-tighter" v-text="drink.name" />
                </div>
              </div>
              <span v-if="selectedBrand === drink" class="led-small" v-text="drink.quantity" />
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
              <input
                type="text"
                class="px-1 text-sm w-full font-bold border-2 border-black rounded-md transition-all"
                width="100%"
                :value="selectedBrand?.price"
              >
            </div>
            <div class="border-2 border-black rounded-md p-4 uppercase">
              <span class="led-small">No Can</span>
              <p class="font-bold tracking-tighter">
                Collect Can Here
              </p>
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
                <span
                  v-if="totalCashHeld !== null"
                  class="ml-2 led-small"
                  v-text="formatCentsText(totalCashHeld)"
                />
              </span>
              <p class="font-bold mt-1">
                <button class="w-full btn-solid-small text-xs p-1 with-click" @click="totalCashHeld = 123">
                  Show Total Cash Held
                </button>
              </p>
            </div>
          </section>
          <button class="btn-solid bg-purple-100 py-4 rounded-md font-bold w-full">
            Press Here When Finished
          </button>
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
