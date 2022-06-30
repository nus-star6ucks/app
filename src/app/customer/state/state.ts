export interface State {
  next(context: CustomerContext): void;
}

export class CustomerContext {
  private state: State;
  constructor(state: State) {
    this.state = state;
  }

  get State(): State {
    return this.state;
  }

  set State(state: State) {
    this.state = state;
  }

  public request(): void {
    this.state.next(this);
  }
}
