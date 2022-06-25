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
    this.coins
      .pipe(map(coins => coins.find(c => c.id === coin.id)))
      .subscribe(data => {
        data.quantity = +($event.target as HTMLInputElement).value;
        this.coinService.coinsPut([data]).subscribe(() => {
          this.electronService.ipcRenderer.invoke('refresh-coin-states');
        });
      })
      .unsubscribe();
  }

  async updateDrinkQuantity(drink: Drink, $event: Event) {
    this.drinks
      .pipe(map(drinks => drinks.find(d => d.id === drink.id)))
      .subscribe(data => {
        data.quantity = +($event.target as HTMLInputElement).value;
        this.drinkService.drinksPut([data]).subscribe(() => {
          this.electronService.ipcRenderer.invoke('refresh-drink-states');
        });
      })
      .unsubscribe();
  }
}
