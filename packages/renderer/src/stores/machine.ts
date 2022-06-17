import { defineStore } from 'pinia'
import type { Coin, Drink, Machine, User } from '../openapi'

export const useMachineStore = defineStore('machine', {
  state: () => {
    return {
      machines: [] as Machine[],
      users: [] as User[],
      coins: [] as Coin[],
      drinks: [] as Drink[],
    }
  },
})
