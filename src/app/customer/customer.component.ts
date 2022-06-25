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
} from '../http';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
})
export class CustomerComponent implements OnInit {
  constructor(
    private readonly coinService: CoinService,
    private readonly drinkService: DrinkService,
    private readonly dataService: DataService,
    private readonly titleService: Title
  ) {
    titleService.setTitle('VMCS - Customer Panel');
  }

  ngOnInit(): void {}

  machine = this.dataService.machines$.pipe(map(machines => machines?.[0]));
  drinks = this.dataService.drinks$;
  coins = this.dataService.coins$.pipe(
    map(coins => [
      ...coins,
      {
        id: -1,
        name: 'Invalid',
        value: 999,
        weight: 999,
        quantity: 999,
      },
    ])
  );
  users = this.dataService.users$;

  selectedDrink: Drink | null = null;
  invalidCoin = false;
  collectedCoins: Coin[] = [];
  collectCoinsDisplay = 0;
  collectCanHereDisplay = 'NO CAN';
  noChangeAvailableDisplay = false;

  // get coins(): Coin[] {
  //   return [
  //     ...store.$state.coins,

  //   ];
  // }

  get totalMoneyInserted(): number {
    return this.collectedCoins.reduce(
      (acc, curr) => (acc += curr.value * curr.quantity),
      0
    );
  }

  // mounted() {
  //   const store = useStore();
  //   store.$subscribe((mutation, state) => {
  //     if (
  //       mutation.type === MutationType.patchObject &&
  //       mutation.payload.machines
  //     ) {
  //       const [machine] = mutation.payload.machines;
  //       // When the maintainer successfully logs-in to the system, the system is required to terminate any customer transactions that are in-progress, and refund any money that has been entered during the transaction
  //       if (!machine.doorLocked) this.terminateAndReturnCash();
  //     }
  //   });
  // }

  selectDrink(drink: Drink) {
    if (drink.quantity === 0 || this.selectedDrink) return;
    this.selectedDrink = drink;
  }

  async insertCoin(coin: Coin) {
    this.coinService.coinsCheckCoinPost(coin).subscribe(async ({ isValid }) => {
      if (!isValid) {
        this.invalidCoin = true;
        return;
      }
      this.invalidCoin = false;
      const sameValueCoin = this.collectedCoins.find(
        c => c.value === coin.value
      );
      if (sameValueCoin) {
        sameValueCoin.quantity += 1;
      } else {
        this.collectedCoins.push({ ...coin, quantity: 1 });
      }
      if (this.totalMoneyInserted >= this.selectedDrink.price) {
        this.drinkService
          .drinksPurchasePost({
            drinkId: this.selectedDrink.id,
            coins: this.collectedCoins,
          })
          .subscribe(({ noChangeAvailable, collectCoins }) => {
            this.noChangeAvailableDisplay = noChangeAvailable;
            this.collectCoinsDisplay = collectCoins;
            if (!noChangeAvailable) {
              this.collectCanHereDisplay = this.selectedDrink.name;
            }
          });
      }
    });
  }

  terminateAndReturnCash() {
    this.collectCoinsDisplay = this.collectedCoins.reduce(
      (acc, curr) => (acc += curr.value * curr.quantity),
      0
    );
    this.collectedCoins = [];
    this.invalidCoin = false;
    this.noChangeAvailableDisplay = false;
    this.selectedDrink = null;
  }
}
