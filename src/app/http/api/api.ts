export * from './coin.service';
import { CoinService } from './coin.service';
export * from './default.service';
import { DefaultService } from './default.service';
export * from './drink.service';
import { DrinkService } from './drink.service';
export * from './machine.service';
import { MachineService } from './machine.service';
export * from './order.service';
import { OrderService } from './order.service';
export * from './user.service';
import { UserService } from './user.service';
export const APIS = [
  CoinService,
  DefaultService,
  DrinkService,
  MachineService,
  OrderService,
  UserService,
];
