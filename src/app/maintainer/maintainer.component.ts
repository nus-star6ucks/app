import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { lastValueFrom, map, Observable } from 'rxjs';
import { ElectronService } from '../core/services';
import { DataService } from '../data.service';
import {
  Coin,
  CoinService,
  Drink,
  DrinkService,
  Machine,
  MachineService,
  User,
  UserService,
} from '../http';

@Component({
  selector: 'app-maintainer',
  templateUrl: './maintainer.component.html',
  styleUrls: ['./maintainer.component.css'],
})
export class MaintainerComponent implements OnInit {
  constructor(
    private electronService: ElectronService,
    private coinService: CoinService,
    private machineService: MachineService,
    private drinkService: DrinkService,
    private userService: UserService,
    private readonly dataService: DataService,
    private titleService: Title
  ) {
    titleService.setTitle('VMCS - Maintainer Panel');
  }

  machine: Observable<Machine>;
  drinks: Observable<Drink[]>;
  coins: Observable<Coin[]>;
  users: Observable<User[]>;

  ngOnInit(): void {
    this.drinks = this.dataService.drinks;
    this.coins = this.dataService.coins;
    this.users = this.dataService.users;
    this.machine = this.dataService.machines.pipe(
      map(machines => machines?.[0])
    );

    this.dataService.loadAll();
  }

  password = '';
  valid = false;
  selectedCoin: Coin | null = null;
  selectedDrink: Drink | null = null;
  displayTotalCashHeld = false;
  cashCollected = -1;

  get allowToUse(): boolean {
    return this.password.length === 6 && this.valid === true;
  }

  showTotalCashHeld() {
    this.displayTotalCashHeld = true;
  }

  async computeTotalCashHeld() {
    this.coins
      .subscribe(coins => {
        const total = coins.reduce(
          (acc, prev) => (acc += prev.value * prev.quantity),
          0
        );
        this.cashCollected = total;
      })
      .unsubscribe();
  }

  async collectAllCash() {
    this.computeTotalCashHeld();
    this.coins
      .subscribe(coins => {
        const updatedCoins = coins.map(c => {
          c.quantity = 0;
          return c;
        });
        this.coinService
          .coinsPut(updatedCoins)
          .subscribe(() => {
            this.electronService.ipcRenderer.invoke('refresh-coin-states');
          })
          .unsubscribe();
      })
      .unsubscribe();
  }

  async updateDrinkPrice(drink: Drink, $event: Event) {
    this.drinks
      .pipe(map(drinks => drinks.find(d => d.id === drink.id)))
      .subscribe(data => {
        drink.price = +($event.target as HTMLInputElement).value;
        this.drinkService
          .drinksPut([data])
          .subscribe(() => {
            this.electronService.ipcRenderer.invoke('refresh-drink-states');
          })
          .unsubscribe();
      })
      .unsubscribe();
  }

  async pressHereWhenFinished() {
    this.machine
      .subscribe(machine => {
        // if the state of the vending machine door is unlocked, then the log-out request shall be ignored.
        if (!machine.doorLocked) return;

        this.userService
          .usersLogoutPost()
          .subscribe(() => {
            this.electronService.ipcRenderer.invoke('refresh-machine-states');
            this.electronService.ipcRenderer.invoke('refresh-user-states');
          })
          .unsubscribe();

        // for mock use
        // panel becomes inactive
        // If the state of the vending machine door is locked, then the log-out request shall be successful and the maintenance panel shall become inactive
        this.password = '';
      })
      .unsubscribe();
  }

  async validate(e: any) {
    this.password = e.target.value;

    if (this.password.length === 6) {
      try {
        await lastValueFrom(
          this.userService.usersLoginPost({ password: this.password } as any)
        );
        // should update machine status
        this.valid = true;
      } catch (e) {
        this.valid = false;
      }
      // for mock use
      const [currentUser] = await lastValueFrom(this.userService.usersGet());
      this.valid = currentUser.password === this.password;
      if (this.valid) {
        this.machine
          .subscribe(machine => {
            machine.doorLocked = false;
            this.machineService
              .machinesPut([machine])
              .subscribe(() => {
                this.electronService.ipcRenderer.invoke(
                  'refresh-machine-states'
                );
              })
              .unsubscribe();
          })
          .unsubscribe();
      }
    }
  }
}
