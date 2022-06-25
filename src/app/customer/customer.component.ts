import { Component, OnInit } from '@angular/core';
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
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
})
export class CustomerComponent implements OnInit {
  constructor(
    private readonly coinService: CoinService,
    private readonly drinkService: DrinkService,
    private readonly machineService: MachineService,
    private readonly electronService: ElectronService
  ) {}

  ngOnInit(): void {}

  selectedDrink: Drink | null = null;
  invalidCoin = false;
  collectedCoins: Coin[] = [];
  collectCoinsDisplay = 0;
  collectCanHereDisplay = 'NO CAN';
  noChangeAvailableDisplay = false;

  drinks$ = this.drinkService.drinksGet();
  coins$ = this.coinService.coinsGet();
  machines$ = this.machineService.machinesGet();

  // get coins(): Coin[] {
  //   return [
  //     ...store.$state.coins,
  //     {
  //       id: -1,
  //       name: 'Invalid',
  //       value: 999,
  //       weight: 999,
  //       quantity: 999,
  //     },
  //   ];
  // }

  get totalMoneyInserted(): number {
    return this.collectedCoins.reduce(
      (acc, curr) => (acc += curr.value * curr.quantity),
      0
    );
  }

  // mounted() {
  //   document.title = 'VMCS - Customer Panel';
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
    try {
      await lastValueFrom(this.coinService.coinsCheckCoinPost(coin));
      const sameValueCoin = this.collectedCoins.find(
        c => c.value === coin.value
      );
      if (sameValueCoin) sameValueCoin.quantity += 1;
      else this.collectedCoins.push({ ...coin, quantity: 1 });
    } catch {
      // coin check failed
      this.invalidCoin = true;
    } finally {
      if (this.totalMoneyInserted >= this.selectedDrink.price) {
        await lastValueFrom(
          this.drinkService.drinksPurchasePost({
            drinkId: this.selectedDrink.id,
            coins: this.collectedCoins,
          })
        );

        // for mock use
        // 1. flat current coins
        // const availableCoins = this.coins
        //   .map(c => {
        //     const customerInsertedCoin = this.collectedCoins.find(
        //       coin => c.id === coin.id
        //     );
        //     return Array(
        //       c.quantity +
        //         (customerInsertedCoin ? customerInsertedCoin.quantity : 0)
        //     ).fill(c.value);
        //   })
        //   .flat()
        //   .sort((a, b) => b - a);

        // // 2. requestChangeSolution
        // const shouldReturnCashValue =
        //   this.totalMoneyInserted - this.selectedDrink.price;
        // if (shouldReturnCashValue > 0) {
        //   const changeSolution = this.requestChange(
        //     shouldReturnCashValue,
        //     availableCoins
        //   );
        //   if (changeSolution.length === 0) {
        //     this.noChangeAvailableDisplay = true;
        //     return;
        //   }

        //   // update coin stock
        //   // store.$patch({
        //   //   coins: this.coins.map(coin => {
        //   //     const customerInsertedCoin = this.collectedCoins.find(
        //   //       c => c.id === coin.id
        //   //     );
        //   //     if (customerInsertedCoin)
        //   //       coin.quantity += customerInsertedCoin.quantity;
        //   //     return coin;
        //   //   }),
        //   // });
        //   // changeSolution.forEach(value => {
        //   //   const coin = this.coins.find(c => c.value === value);
        //   //   coin.quantity -= 1;
        //   //   store.$patch({
        //   //     coins: this.coins.map(c => (c.id === coin.id ? coin : c)),
        //   //   });
        //   // });

        //   // this.collectCoinsDisplay = changeSolution.reduce(
        //   //   (acc, curr) => (acc += curr),
        //   //   0
        //   // );
        // }
        // this.collectCanHereDisplay = this.selectedDrink.name;
      }
    }
  }

  // for mock use
  requestChange(amount: number, availableCoins: number[]): number[] {
    const result: number[][] = [];
    const helper = (path: number[], remain: number, startIdx: number) => {
      if (remain === 0) return result.push([...path]);
      if (remain < 0 || result.length > 0) return;
      for (let i = startIdx; i < availableCoins.length; i += 1) {
        if (remain - availableCoins[i] >= 0)
          helper(
            [...path, availableCoins[i]],
            remain - availableCoins[i],
            startIdx + 1
          );
      }
    };
    helper([], amount, 0);
    return result[0];
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
