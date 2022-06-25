import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BrowserWindowConstructorOptions } from 'electron/renderer';
import { firstValueFrom, map } from 'rxjs';
import { ElectronService } from '../core/services';
import { DataService } from '../data.service';
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
    private machineService: MachineService,
    private coinService: CoinService,
    private drinkService: DrinkService,
    private userService: UserService,
    private dataService: DataService,
    private titleService: Title
  ) {
    titleService.setTitle('VMCS - Simulator Control Panel');
  }

  ngOnInit(): void {
    this.dataService.coins$.subscribe(coins => {
      this.dataService.drinks$.subscribe(drinks => {
        this.dataService.machines$.subscribe(machines => {
          this.dataService.users$.subscribe(users => {
            this.fileLoaded =
              coins.length > 0 &&
              drinks.length > 0 &&
              machines.length > 0 &&
              users.length > 0;
          });
        });
      });
    });
  }

  fileLoaded = false;

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
    this.machineService.machinesStartPost(path).subscribe(data => {
      this.fileLoaded = true;
      this.electronService.ipcRenderer.invoke('refresh-all-states');
    });
  }

  async handleEndSimulation() {
    this.electronService.ipcRenderer.invoke('close-other-wins');
    this.machineService.machinesStopPost().subscribe(async () => {
      this.dataService.coins$.subscribe(coins => {
        this.coinService.coinsDelete(coins.map(c => c.id)).subscribe();
      });
      this.dataService.machines$.subscribe(machines => {
        this.machineService.machinesDelete(machines.map(c => c.id)).subscribe();
      });
      this.dataService.drinks$.subscribe(drinks => {
        this.drinkService.drinksDelete(drinks.map(c => c.id)).subscribe();
      });
      this.dataService.users$.subscribe(users => {
        this.userService.usersDelete(users.map(c => c.id)).subscribe();
      });
    });
    this.electronService.ipcRenderer.invoke('refresh-all-states');
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
