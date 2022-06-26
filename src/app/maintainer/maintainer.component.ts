import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { firstValueFrom, lastValueFrom, map, Observable } from 'rxjs';
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
    titleService.setTitle('VMCS - Maintenance Panel');
  }

  machine = this.dataService.machines$.pipe(map(machines => machines?.[0]));
  drinks = this.dataService.drinks$;
  coins = this.dataService.coins$;
  users = this.dataService.users$;

  ngOnInit(): void {}

  password = '';
  valid = false;
  selectedCoin: Coin | null = null;
  selectedDrink: Drink | null = null;
  displayTotalCashHeld = false;
  cashCollected = -1;
  totalCashHeld = -1;

  get allowToUse(): boolean {
    return this.password.length === 6 && this.valid === true;
  }

  showTotalCashHeld() {
    this.computeTotalCashHeld();
    this.displayTotalCashHeld = true;
  }

  async computeTotalCashHeld() {
    this.coins
      .subscribe(coins => {
        const total = coins.reduce(
          (acc, prev) => (acc += prev.value * prev.quantity),
          0
        );
        this.totalCashHeld = total;
      })
      .unsubscribe();
  }

  async collectAllCash() {
    this.computeTotalCashHeld();
    this.cashCollected = this.totalCashHeld;
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
        this.computeTotalCashHeld();
      })
      .unsubscribe();
  }

  async updateDrinkPrice(drink: Drink, $event: Event) {
    const inputValue = +($event.target as HTMLInputElement).value;
    if (inputValue < 1) return;

    this.drinks
      .pipe(map(drinks => drinks.find(d => d.id === drink.id)))
      .subscribe(data => {
        drink.price = inputValue;
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

  async validate($event: Event) {
    this.password = ($event.target as HTMLInputElement).value;

    if (this.password.length === 6) {
      const currentUser = await firstValueFrom(
        this.dataService.users$.pipe(map(users => users?.[0]))
      );
      currentUser.password = this.password;
      this.userService.usersLoginPost(currentUser).subscribe({
        complete: () => {
          this.valid = true;
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
        },
        error: () => (this.valid = false),
      });
    }
  }
}
