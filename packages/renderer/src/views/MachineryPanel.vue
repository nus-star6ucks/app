<script lang="ts">
import { CheckCorrect, Checkbox, CoffeeMachine, Cola, Finance } from '@icon-park/vue'
import Vue from 'vue'
import Component from 'vue-class-component'
import KeyboardSection from '../components/KeyboardSection.vue'
import { useStore } from '../stores/machine'

@Component({
  components: { CoffeeMachine, Cola, Finance, KeyboardSection, Checkbox, CheckCorrect },
})
export default class CustomerPanel extends Vue {
  get drinks() {
    const store = useStore()
    return store.$state.drinks
  }

  get coins() {
    const store = useStore()
    return store.$state.coins
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
              <span class="led-small" v-text="coin.quantity" />
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
              <span class="led-small" v-text="drink.quantity" />
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
            <button class="font-semibold text-lg flex items-center">
              <checkbox theme="outline" size="36" :stroke-width="2" stroke-linejoin="bevel" stroke-linecap="butt" />
              <check-correct theme="outline" size="36" :stroke-width="2" stroke-linejoin="bevel" stroke-linecap="butt" />
              <span class="ml-2">Door Locked?</span>
            </button>
          </div>
        </section>
      </aside>
    </section>
  </div>
</template>
