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
} from '../http';

@Component({
  selector: 'app-machinery',
  templateUrl: './machinery.component.html',
  styleUrls: ['./machinery.component.css'],
})
export class MachineryComponent implements OnInit {
  constructor(
    private readonly coinService: CoinService,
    private readonly drinkService: DrinkService,
    private readonly machineService: MachineService,
    private readonly electronService: ElectronService,
    private titleService: Title
  ) {
    titleService.setTitle('VMCS - Machinery Panel');
  }

  coins$ = this.coinService.coinsGet();
  drinks$ = this.drinkService.drinksGet();
  machines$ = this.machineService.machinesGet();

  ngOnInit(): void {}

  async switchDoorLocked() {
    const machine = (await lastValueFrom(this.machines$))[0];
    machine.doorLocked = !machine.doorLocked;

    await lastValueFrom(this.machineService.machinesPut([machine]));
    this.electronService.ipcRenderer.invoke('refresh-machine-states');
  }

  async updateCoinQuantity(coin: Coin, $event: Event) {
    coin.quantity = +($event.target as HTMLInputElement).value;
    await lastValueFrom(this.coinService.coinsPut([coin]));

    this.electronService.ipcRenderer.invoke('refresh-coin-states');
  }

  async updateDrinkQuantity(drink: Drink, $event: Event) {
    drink.quantity = +($event.target as HTMLInputElement).value;
    await lastValueFrom(this.drinkService.drinksPut([drink]));

    this.electronService.ipcRenderer.invoke('refresh-drink-states');
  }
}
