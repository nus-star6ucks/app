import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { lastValueFrom } from 'rxjs';
import { ElectronService } from '../core/services';
import {
  Coin,
  CoinService,
  Drink,
  DrinkService,
  MachineService,
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
    private titleService: Title
  ) {
    titleService.setTitle('VMCS - Maintainer Panel');
  }

  ngOnInit(): void {}

  password = '';
  valid = false;
  selectedCoin: Coin | null = null;
  selectedDrink: Drink | null = null;
  displayTotalCashHeld = false;
  cashCollected = -1;

  coins$ = this.coinService.coinsGet();
  drinks$ = this.drinkService.drinksGet();
  machines$ = this.machineService.machinesGet();

  get allowToUse(): boolean {
    return this.password.length === 6 && this.valid === true;
  }

  showTotalCashHeld() {
    this.displayTotalCashHeld = true;
  }

  async computeTotalCashHeld() {
    const coins = await lastValueFrom(this.coins$);
    return coins.reduce((acc, prev) => (acc += prev.value * prev.quantity), 0);
  }

  async collectAllCash() {
    this.cashCollected = await this.computeTotalCashHeld();
    const coins = await lastValueFrom(this.coins$);

    const updatedCoins = coins.map(c => {
      c.quantity = 0;
      return c;
    });
    await lastValueFrom(this.coinService.coinsPut(updatedCoins));

    this.electronService.ipcRenderer.invoke('refresh-coin-states');
  }

  async updateDrinkPrice(drink: Drink, $event: Event) {
    drink.price = +($event.target as HTMLInputElement).value;
    await lastValueFrom(this.drinkService.drinksPut([drink]));

    this.electronService.ipcRenderer.invoke('refresh-drink-states');
  }

  async pressHereWhenFinished() {
    const [machine] = await lastValueFrom(this.machines$);

    // if the state of the vending machine door is unlocked, then the log-out request shall be ignored.
    if (!machine.doorLocked) return;

    await lastValueFrom(this.userService.usersLogoutPost());
    this.electronService.ipcRenderer.invoke('refresh-machine-states');
    this.electronService.ipcRenderer.invoke('refresh-user-states');

    // for mock use
    // panel becomes inactive
    // If the state of the vending machine door is locked, then the log-out request shall be successful and the maintenance panel shall become inactive
    this.password = '';
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
        const [machine] = await lastValueFrom(this.machines$);
        machine.doorLocked = false;
        await lastValueFrom(this.machineService.machinesPut([machine]));
      }
    }
  }
}
