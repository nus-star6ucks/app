<script lang="ts">
import Vue from 'vue'
import { CoffeeMachine, Cola } from '@icon-park/vue'
import Component from 'vue-class-component'
import { MutationType } from 'pinia'
import { ipcRenderer } from 'electron'
import type { Coin, Drink, Machine } from '../openapi'
import { useStore } from '../stores/machine'
import { coinApi, drinkApi } from '../utils'

@Component({
  components: {
    CoffeeMachine,
    Cola,
  },
})
export default class CustomerPanel extends Vue {
  selectedDrink: Drink | null = null
  invalidCoin = false
  collectedCoins: Coin[] = []
  collectCoinsDisplay = 0
  collectCanHereDisplay = 'NO CAN'
  noChangeAvailableDisplay = false

  get drinks(): Drink[] {
    const store = useStore()
    return store.$state.drinks
  }

  get coins(): Coin[] {
    const store = useStore()
    return [...store.$state.coins, {
      id: -1,
      name: 'Invalid',
      value: 999,
      weight: 999,
      quantity: 999,
    }]
  }

  get machine(): Machine {
    const store = useStore()
    return store.$state.machines[0]
  }

  get totalMoneyInserted(): number {
    return this.collectedCoins.reduce((acc, curr) => acc += curr.value * curr.quantity, 0)
  }

  mounted() {
    document.title = 'VMCS - Customer Panel'
    const store = useStore()
    store.$subscribe((mutation, state) => {
      if (mutation.type === MutationType.patchObject && mutation.payload.machines) {
        const [machine] = mutation.payload.machines
        // When the maintainer successfully logs-in to the system, the system is required to terminate any customer transactions that are in-progress, and refund any money that has been entered during the transaction
        if (!machine.doorLocked)
          this.terminateAndReturnCash()
      }
    })
  }

  selectDrink(drink: Drink) {
    if (drink.quantity === 0 || this.selectedDrink)
      return
    this.selectedDrink = drink
  }

  async insertCoin(coin: Coin) {
    const store = useStore()
    try {
      await coinApi.coinsCheckCoinPost(coin)
      const sameValueCoin = this.collectedCoins.find(c => c.value === coin.value)
      if (sameValueCoin)
        sameValueCoin.quantity += 1
      else
        this.collectedCoins.push({ ...coin, quantity: 1 })
    }
    catch {
      // coin check failed
      this.invalidCoin = true
    }
    finally {
      if (this.totalMoneyInserted >= this.selectedDrink.price) {
        await drinkApi.drinksPurchasePost({
          drinkId: this.selectedDrink.id,
          coins: this.collectedCoins,
        })

        // for mock use
        // 1. flat current coins
        const availableCoins = this.coins.map((c) => {
          const customerInsertedCoin = this.collectedCoins.find(coin => c.id === coin.id)
          return Array(c.quantity + (customerInsertedCoin ? customerInsertedCoin.quantity : 0)).fill(c.value)
        }).flat().sort((a, b) => b - a)

        // 2. requestChangeSolution
        const shouldReturnCashValue = this.totalMoneyInserted - this.selectedDrink.price
        if (shouldReturnCashValue > 0) {
          const changeSolution = this.requestChange(shouldReturnCashValue, availableCoins)
          if (changeSolution.length === 0) {
            this.noChangeAvailableDisplay = true
            return
          }

          // update coin stock
          store.$patch({
            coins: this.coins.map((coin) => {
              const customerInsertedCoin = this.collectedCoins.find(c => c.id === coin.id)
              if (customerInsertedCoin)
                coin.quantity += customerInsertedCoin.quantity
              return coin
            }),
          })
          changeSolution.forEach((value) => {
            const coin = this.coins.find(c => c.value === value)
            coin.quantity -= 1
            store.$patch({
              coins: this.coins.map(c => c.id === coin.id ? coin : c),
            })
          })

          this.collectCoinsDisplay = changeSolution.reduce((acc, curr) => acc += curr, 0)
        }
        this.collectCanHereDisplay = this.selectedDrink.name
      }
    }
  }

  // for mock use
  requestChange(amount: number, availableCoins: number[]): number[] {
    const result: number[][] = []
    const helper = (path: number[], remain: number, startIdx: number) => {
      if (remain === 0)
        return result.push([...path])
      if (remain < 0 || result.length > 0)
        return
      for (let i = startIdx; i < availableCoins.length; i += 1) {
        if (remain - availableCoins[i] >= 0)
          helper([...path, availableCoins[i]], remain - availableCoins[i], startIdx + 1)
      }
    }
    helper([], amount, 0)
    return result[0]
  }

  terminateAndReturnCash() {
    this.collectCoinsDisplay = this.collectedCoins.reduce((acc, curr) => acc += curr.value * curr.quantity, 0)
    this.collectedCoins = []
    this.invalidCoin = false
    this.noChangeAvailableDisplay = false
    this.selectedDrink = null
  }

  testUpdate() {
    ipcRenderer.invoke('refresh-all-states')
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
              :key="drink.id"
              :disabled="drink.quantity === 0 || !machine.doorLocked"
              class="w-full cursor-pointer btn-solid flex items-center justify-between space-x-2 p-4"
              :class="{
                active: selectedDrink && drink.id === selectedDrink.id,
              }"
              @click="selectDrink(drink)"
            >
              <div class="flex items-center space-x-2">
                <cola size="36" stroke-width="2" />
                <div class="flex items-center space-x-2">
                  <h2 class="text-2xl tracking-tighter" v-text="drink.name" />
                  <span class="led-small" v-text="`${drink.price}c`" />
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
              class="btn-solid-small px-2 h-10" :class="{ 'with-click': !!selectedDrink }"
              :disabled="!selectedDrink || !machine.doorLocked"
              @click="insertCoin(coin)"
              v-text="coin.name"
            />
          </div>
        </section>
        <section class="grid grid-cols-2 gap-2">
          <div class="border-2 border-black rounded-md p-4 uppercase">
            <span class="led bg-red-600" :class="{ 'opacity-30': !noChangeAvailableDisplay }">No Change Available</span>
            <p class="font-bold mt-1">
              <button
                class="btn-solid-small text-xs p-1"
                :class="{ 'with-click': collectCanHereDisplay === 'NO CAN' }"
                :disabled="collectCanHereDisplay !== 'NO CAN' || !machine.doorLocked" @click="terminateAndReturnCash"
              >
                Terminate and Return Cash
              </button>
            </p>
          </div>
          <div class="border-2 border-black rounded-md p-4 uppercase">
            <span class="led-small" v-text="collectCanHereDisplay" />
            <p class="font-bold">
              Collect Can Here
            </p>
          </div>
          <div class="border-2 border-black rounded-md p-4 uppercase">
            <span class="led-small" v-text="`${collectCoinsDisplay}c`" />
            <p class="font-bold">
              Collect Coins
            </p>
          </div>
          <div class="border-2 border-black rounded-md p-4 uppercase">
            <span class="led-small" v-text="`${totalMoneyInserted}c`" />
            <p class="font-bold">
              Total Money Inserted
            </p>
          </div>
        </section>
      </aside>
      <button @click="testUpdate">
        you should update urself!
      </button>
    </section>
  </div>
</template>
