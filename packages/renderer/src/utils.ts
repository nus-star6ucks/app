import { CoinApi, DrinkApi, MachineApi, UserApi } from './openapi'

const baseUrl = 'http://localhost:8081'
// const baseUrl = 'https://mock.apifox.cn/m1/1108102-0-default'

export const coinApi = new CoinApi({}, baseUrl)
export const machineApi = new MachineApi({}, baseUrl)
export const drinkApi = new DrinkApi({}, baseUrl)
export const userApi = new UserApi({}, baseUrl)
