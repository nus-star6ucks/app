import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { map } from 'rxjs';
import { DataService } from '../data.service';
import { Coin, CoinService, Drink, DrinkService } from '../http';

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

  ngOnInit(): void {
    this.machine.subscribe(machine => {
      if (!machine?.doorLocked) this.terminateAndReturnCash();
    });
  }

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

  get totalMoneyInserted(): number {
    return this.collectedCoins.reduce(
      (acc, curr) => (acc += curr.value * curr.quantity),
      0
    );
  }

  get txCompleted(): boolean {
    return this.collectCanHereDisplay !== 'NO CAN';
  }

  selectDrink(drink: Drink) {
    if (drink.quantity === 0 || this.selectedDrink) return;
    this.selectedDrink = drink;
  }

  insertCoin(coin: Coin) {
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

  takeout() {
    if (!this.txCompleted) return;

    this.collectCanHereDisplay = 'NO CAN';
    this.collectCoinsDisplay = 0;
    this.collectedCoins = [];
    this.invalidCoin = false;
    this.noChangeAvailableDisplay = false;
    this.selectedDrink = null;
  }
}
