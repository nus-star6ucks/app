import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { map } from 'rxjs';
import { ElectronService } from '../core/services';
import { DataService } from '../data.service';
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
    private readonly dataService: DataService,
    private titleService: Title
  ) {
    titleService.setTitle('VMCS - Machinery Panel');
  }

  machine = this.dataService.machines$.pipe(map(machines => machines?.[0]));
  drinks = this.dataService.drinks$;
  coins = this.dataService.coins$;
  users = this.dataService.users$;

  ngOnInit(): void {}

  switchDoorLocked() {
    this.machine
      .subscribe(machine => {
        machine.doorLocked = !machine.doorLocked;
        this.machineService.machinesPut([machine]).subscribe(() => {
          this.electronService.ipcRenderer.invoke('refresh-machine-states');
        });
      })
      .unsubscribe();
  }

  async updateCoinQuantity(coin: Coin, $event: Event) {
    const inputValue = +($event.target as HTMLInputElement).value;
    if (inputValue > 40 || inputValue < 0) return;

    this.coins
      .pipe(map(coins => coins.find(c => c.id === coin.id)))
      .subscribe(data => {
        data.quantity = inputValue;
        this.coinService.coinsPut([data]).subscribe(() => {
          this.electronService.ipcRenderer.invoke('refresh-coin-states');
        });
      })
      .unsubscribe();
  }

  async updateDrinkQuantity(drink: Drink, $event: Event) {
    const inputValue = +($event.target as HTMLInputElement).value;
    if (inputValue > 20 || inputValue < 0) return;

    this.drinks
      .pipe(map(drinks => drinks.find(d => d.id === drink.id)))
      .subscribe(data => {
        data.quantity = inputValue;
        this.drinkService.drinksPut([data]).subscribe(() => {
          this.electronService.ipcRenderer.invoke('refresh-drink-states');
        });
      })
      .unsubscribe();
  }
}
