import { Component, OnInit } from '@angular/core';
// import { writeFileSync } from 'fs';

@Component({
  selector: 'app-simulator',
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.css'],
})
export class SimulatorComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  filePath = '';
  fileLoaded: boolean = false;
  blockButtonActiveClass = [
    'btn-solid',
    'bg-purple-100',
    'py-4',
    'rounded-md',
    'font-bold',
    'w-full',
    'with-click',
  ];
  blockButtonInactiveClass = ['w-full', 'uppercase', 'font-semibold', 'py-4'];

  // get fileLoaded(): boolean {
  //   const store = useStore();
  //   return Object.values(store.$state).every(data => data.length > 0);
  // }

  // get machines(): Machine[] {
  //   const store = useStore();
  //   return store.$state.machines;
  // }

  // get users(): User[] {
  //   const store = useStore();
  //   return store.$state.users;
  // }

  // get drinks(): Drink[] {
  //   const store = useStore();
  //   return store.$state.drinks;
  // }

  // get coins(): Coin[] {
  //   const store = useStore();
  //   return store.$state.coins;
  // }

  newWindow(path: string, options?: any) {
    // BrowserWindowConstructorOptions
    // ipcRenderer.invoke('open-win', path, options);
  }

  async onFileSelected(event: Event) {
    // const [{ path }] = e.target.files;
    // this.filePath = `${path}`;
    // const data: IInitialDataFileDto = JSON.parse(readFileSync(path) as any);
    // await coinApi.coinsPost(data.coins);
    // await drinkApi.drinksPost(data.drinks);
    // await userApi.usersPost(data.users);
    // await machineApi.machinesPost(data.machines);
    // ipcRenderer.invoke('refresh-all-states');
  }

  async handleEndSimulation() {
    // const store = useStore();
    // ipcRenderer.invoke('close-other-wins');
    // writeFileSync(this.filePath, JSON.stringify(store.$state), {
    //   flag: 'w',
    // });
    // await coinApi.coinsDelete(this.coins.map(c => c.id));
    // await userApi.usersDelete(this.users.map(u => u.id));
    // await machineApi.machinesDelete(this.machines.map(m => m.id));
    // await drinkApi.drinksDelete(this.machines.map(m => m.id));
    // store.$reset();
  }

  activateMaintainerPanel() {
    // newWindow('/maintainer', {
    //   width: 1035,
    //   height: 660,
    // });
  }
  activateMachineryPanel() {
    // newWindow('/machinery', {
    //   width: 1035,
    //   height: 660,
    // });
  }
  activateCustomerPanel() {
    // newWindow('/customer', {
    //   width: 1035,
    //   height: 660,
    // });
  }
}
