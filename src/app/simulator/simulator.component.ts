import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BrowserWindowConstructorOptions } from 'electron/renderer';
import { lastValueFrom } from 'rxjs';
import { ElectronService } from '../core/services';
import {
  CoinService,
  DrinkService,
  MachineService,
  UserService,
} from '../http';
@Component({
  selector: 'app-simulator',
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.css'],
  providers: [ElectronService],
})
export class SimulatorComponent implements OnInit {
  constructor(
    private electronService: ElectronService,
    private coinService: CoinService,
    private machineService: MachineService,
    private drinkService: DrinkService,
    private userService: UserService
  ) {}

  ngOnInit(): void {}

  filePath = '';
  fileLoaded = true;

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

  private newWindow(path: string, options?: BrowserWindowConstructorOptions) {
    this.electronService.ipcRenderer.invoke('open-win', path, options);
  }

  async onFileSelected(event: any) {
    const { path } = event.target.files[0];
    this.filePath = `${path}`;
    const data: any = JSON.parse(
      this.electronService.fs.readFileSync(path) as any
    );
    await lastValueFrom(this.coinService.coinsPost(data.coins));
    await lastValueFrom(this.drinkService.drinksPost(data.drinks));
    await lastValueFrom(this.userService.usersPost(data.users));
    await lastValueFrom(this.machineService.machinesPost(data.machines));
    this.fileLoaded = true;
    this.electronService.ipcRenderer.invoke('refresh-all-states');
  }

  async handleEndSimulation() {
    // waits for further impl
    this.electronService.ipcRenderer.invoke('close-other-wins');
    // this.electronService.fs.writeFileSync(
    //   this.filePath,
    //   JSON.stringify(store.$state),
    //   {
    //     flag: 'w',
    //   }
    // );

    // await this.coinService.coinsDelete(this.coins.map(c => c.id));
    // await this.userService.usersDelete(this.users.map(u => u.id));
    // await this.machineService.machinesDelete(this.machines.map(m => m.id));
    // await this.drinkService.drinksDelete(this.machines.map(m => m.id));
  }

  activateMaintainerPanel() {
    this.newWindow('/maintainer', {
      width: 1035,
      height: 660,
    });
  }
  activateMachineryPanel() {
    this.newWindow('/machinery', {
      width: 1035,
      height: 660,
    });
  }
  activateCustomerPanel() {
    this.newWindow('/customer', {
      width: 1035,
      height: 660,
    });
  }
}
