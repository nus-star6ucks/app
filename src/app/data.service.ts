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

  readonly coins$ = this._coins.asObservable();
  readonly machines$ = this._machines.asObservable();
  readonly users$ = this._users.asObservable();
  readonly drinks$ = this._drinks.asObservable();

  constructor(
    private readonly coinService: CoinService,
    private readonly drinkService: DrinkService,
    private readonly machineService: MachineService,
    private readonly userService: UserService
  ) {
    this.loadAll();
  }

  loadAll() {
    this.loadCoins();
    this.loadDrinks();
    this.loadMachines();
    this.loadUsers();
  }

  async loadCoins() {
    this.coinService.coinsGet().subscribe(data => {
      this._coins.next(data);
    });
  }

  async loadDrinks() {
    this.drinkService.drinksGet().subscribe(data => {
      this._drinks.next(data);
    });
  }

  async loadMachines() {
    this.machineService.machinesGet().subscribe(data => {
      this._machines.next(data);
    });
  }

  async loadUsers() {
    this.userService.usersGet().subscribe(data => {
      this._users.next(data);
    });
  }
}
