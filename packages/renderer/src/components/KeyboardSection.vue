<template>
  <section>
    <div class="flex justify-between items-center mb-2">
      <h2 class="font-bold text-lg tracking-tighter uppercase">
        KEYBOARD
      </h2>
    </div>
    <div :class="{ 'grid grid-cols-3 gap-2': true, 'opacity-30': disabled }">
      <button
        v-for="num in [1, 2, 3, 4, 5, 6, 7, 8, 9, 'RESET', 0, 'CONFIRM']"
        :key="num"
        :disabled="disabled"
        class="btn-solid-small px-2 h-10"
        v-text="num"
      />
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    disabled: {
      type: Boolean,
      default: () => false,
    },
    onType: {
      type: Function,
      default: () => ({}),
    },
  },
})
</script>
