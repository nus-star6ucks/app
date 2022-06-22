import { CoinApi, DrinkApi, MachineApi, UserApi } from './openapi'
import { useStore } from './stores/machine'

const baseUrl = 'http://localhost:8081'
// const baseUrl = 'https://mock.apifox.cn/m1/1108102-0-default'

export const coinApi = new CoinApi({}, baseUrl)
export const machineApi = new MachineApi({}, baseUrl)
export const drinkApi = new DrinkApi({}, baseUrl)
export const userApi = new UserApi({}, baseUrl)

export const refreshCoinStates = async () => {
  const store = useStore()
  const { data: coins } = await coinApi.coinsGet()
  store.$patch({
    coins,
  })
}

export const refreshDrinkStates = async () => {
  const store = useStore()
  const { data: drinks } = await drinkApi.drinksGet()
  store.$patch({
    drinks,
  })
}

export const refreshUserStates = async () => {
  const store = useStore()
  const { data: users } = await userApi.usersGet()
  store.$patch({
    users,
  })
}

export const refreshMachineStates = async () => {
  const store = useStore()
  const { data: machines } = await machineApi.machinesGet()
  store.$patch({
    machines,
  })
}

