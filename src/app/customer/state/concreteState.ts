import { State, CustomerContext } from './state';

export class SReady implements State {
  public next(context: CustomerContext): void {
    console.log('`next` method of Ready is being called!');
    context.State = new SDrinkSelected();
  }
  public terminate(context: CustomerContext): void {
    console.log('`terminate` method of Ready is being called!');
    context.State = new STerminated();
  }
}

export class SDrinkSelected implements State {
  public next(context: CustomerContext): void {
    console.log('`next` method of CoinInserted is being called!');
    context.State = new SCoinInserted();
  }
  public terminate(context: CustomerContext): void {
    console.log('`terminate` method of Ready is being called!');
    context.State = new STerminated();
  }
}

export class SCoinInserted implements State {
  public next(context: CustomerContext): void {
    console.log('`next` method of DrinkSelected is being called!');
    context.State = new SDispensed();
  }
  public terminate(context: CustomerContext): void {
    console.log('`terminate` method of Ready is being called!');
    context.State = new STerminated();
  }
  public noChange(context: CustomerContext): void {
    console.log('`noChange` method of Ready is being called!');
    context.State = new SNoChange();
  }
}

export class SDispensed implements State {
  public next(context: CustomerContext): void {
    console.log('`next` method of Dispensed is being called!');
    context.State = new SReady();
  }
}

export class SNoChange implements State {
  public next(context: CustomerContext): void {
    console.log('`next` method of NoChange is being called!');
    context.State = new SReady();
  }
}
export class STerminated implements State {
  public next(context: CustomerContext): void {
    console.log('`next` method of Terminated is being called!');
    context.State = new SReady();
  }
}

export class SFault implements State {
  public next(context: CustomerContext): void {
    console.log('`next` method of Fault is being called!');
    context.State = new SReady();
  }
}
