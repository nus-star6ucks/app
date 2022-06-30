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
  OrderService,
} from '../http';
import {
  SCoinInserted,
  SDispensed,
  SDrinkSelected,
  SFault,
  SNoChange,
  SReady,
  STerminated,
} from './state/concreteState';
import { CustomerContext } from './state/state';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
})
export class CustomerComponent implements OnInit {
  constructor(
    private readonly coinService: CoinService,
    private readonly dataService: DataService,
    private readonly machineService: MachineService,
    private readonly orderService: OrderService,
    private readonly electronService: ElectronService,
    private readonly titleService: Title
  ) {
    titleService.setTitle('VMCS - Customer Panel');
  }

  ngOnInit(): void {
    this.machine$.subscribe(machine => {
      if (typeof machine === 'undefined') return;
      if (machine.doorLocked === false) {
        this.terminateAndReturnCash();
      } else if (machine?.status !== 'normal') {
        this.context.State = new SFault();
      }
    });
  }

  context = new CustomerContext(new SReady());

  get isDrinkSelected(): boolean {
    return this.context.State instanceof SDrinkSelected;
  }

  get isDispensed(): boolean {
    return this.context.State instanceof SDispensed;
  }

  get isReady(): boolean {
    return this.context.State instanceof SReady;
  }

  get isTerminated(): boolean {
    return this.context.State instanceof STerminated;
  }

  get isCoinInserted(): boolean {
    return this.context.State instanceof SCoinInserted;
  }

  get isNochange(): boolean {
    return this.context.State instanceof SNoChange;
  }

  get isFault(): boolean {
    return this.context.State instanceof SFault;
  }

  machine$ = this.dataService.machines$.pipe(map(machines => machines?.[0]));
  drinks$ = this.dataService.drinks$;
  coins$ = this.dataService.coins$.pipe(
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
  users$ = this.dataService.users$;

  selectedDrink: Drink | null = null;
  invalidCoin = false;
  collectedCoins: Coin[] = [];
  collectCoinsDisplay = 0;
  collectCanHereDisplay = 'NO CAN';

  faultOnNextTx = false;

  get totalMoneyInserted(): number {
    return this.collectedCoins.reduce(
      (acc, curr) => (acc += curr.value * curr.quantity),
      0
    );
  }

  selectDrink(drink: Drink) {
    if (!(this.context.State instanceof SReady)) return;
    if (drink.quantity === 0 || this.selectedDrink) return;

    this.selectedDrink = drink;
    this.context.State = new SCoinInserted();
  }

  insertCoin(coin: Coin | any) {
    if (!(this.context.State instanceof SCoinInserted)) return;

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
        this.purchase();
      }
    });
  }

  purchase() {
    this.orderService
      .ordersPurchasePost({
        drinkId: this.selectedDrink.id,
        coins: this.collectedCoins,
      })
      .subscribe(({ noChangeAvailable, collectCoins }) => {
        if (noChangeAvailable) this.context.State = new SNoChange();
        this.collectCoinsDisplay = collectCoins;

        if (!noChangeAvailable) {
          this.context.State = new SDispensed();
          this.collectCanHereDisplay = this.selectedDrink.name;
        }

        if (this.faultOnNextTx) {
          this.revertTx();
        }
      });
  }

  revertTx() {
    this.context.State = new SFault();

    this.orderService.ordersPurchaseUndoPost().subscribe(() => {
      this.machine$
        .subscribe(machine => {
          machine.status = 'stuck';
          this.collectCanHereDisplay = 'STUCK';
          this.machineService.machinesPut([machine]).subscribe(() => {
            this.electronService.ipcRenderer.invoke('refresh-machine-states');
            this.collectCoinsDisplay = this.collectedCoins.reduce(
              (acc, curr) => (acc += curr.value * curr.quantity),
              0
            );
            this.selectedDrink = null;
          });
        })
        .unsubscribe();
    });
  }

  terminateAndReturnCash() {
    this.context.State = new STerminated();
    this.collectCoinsDisplay = this.collectedCoins.reduce(
      (acc, curr) => (acc += curr.value * curr.quantity),
      0
    );
    this.collectedCoins = [];
    this.invalidCoin = false;
    this.selectedDrink = null;
  }

  takeout() {
    if (
      !(this.context.State instanceof SDispensed) &&
      !(this.context.State instanceof STerminated)
    )
      return;

    this.collectCanHereDisplay = 'NO CAN';
    this.collectCoinsDisplay = 0;
    this.collectedCoins = [];
    this.invalidCoin = false;
    this.selectedDrink = null;
    this.context.State = new SReady();
  }
}
