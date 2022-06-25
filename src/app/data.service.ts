import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import {
  Coin,
  CoinService,
  Drink,
  DrinkService,
  Machine,
  MachineService,
  User,
  UserService,
} from './http';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private _coins = new BehaviorSubject<Coin[]>([]);
  private _machines = new BehaviorSubject<Machine[]>([]);
  private _users = new BehaviorSubject<User[]>([]);
  private _drinks = new BehaviorSubject<Drink[]>([]);

  private dataStore: {
    coins: Coin[];
    machines: Machine[];
    users: User[];
    drinks: Drink[];
  } = { coins: [], machines: [], users: [], drinks: [] };

  readonly coins = this._coins.asObservable();
  readonly machines = this._machines.asObservable();
  readonly users = this._users.asObservable();
  readonly drinks = this._drinks.asObservable();

  constructor(
    private readonly coinService: CoinService,
    private readonly drinkService: DrinkService,
    private readonly machineService: MachineService,
    private readonly userService: UserService
  ) {}

  loadAll() {
    this.loadCoins();
    this.loadDrinks();
    this.loadMachines();
    this.loadUsers();
  }

  async loadCoins() {
    this.coinService.coinsGet().subscribe(data => {
      this.dataStore.coins = data;
      this._coins.next(Object.assign({}, this.dataStore).coins);
    });
  }

  async loadDrinks() {
    this.drinkService.drinksGet().subscribe(data => {
      this.dataStore.drinks = data;
      this._drinks.next(Object.assign({}, this.dataStore).drinks);
    });
  }

  async loadMachines() {
    this.machineService.machinesGet().subscribe(data => {
      this.dataStore.machines = data;
      this._machines.next(Object.assign({}, this.dataStore).machines);
    });
  }

  async loadUsers() {
    this.userService.usersGet().subscribe(data => {
      this.dataStore.users = data;
      this._users.next(Object.assign({}, this.dataStore).users);
    });
  }
}
