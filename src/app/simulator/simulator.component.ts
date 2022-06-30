import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BrowserWindowConstructorOptions } from 'electron/renderer';
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

  coins$ = this.dataService.coins$;
  drinks$ = this.dataService.drinks$;
  machines$ = this.dataService.machines$;
  users$ = this.dataService.users$;

  ngOnInit(): void {
    this.coins$.subscribe(coins => {
      const coinsLoaded = coins.length > 0;
      this.drinks$.subscribe(drinks => {
        const drinksLoaded = drinks.length > 0;
        this.machines$.subscribe(machines => {
          const machinesLoaded = machines.length > 0;
          this.users$.subscribe(users => {
            const usersLoaded = users.length > 0;
            this.fileLoaded =
              coinsLoaded && drinksLoaded && machinesLoaded && usersLoaded;
          });
        });
      });
    });
  }

  fileLoaded = false;
  filePath = '';

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

  private _newWindow(path: string, options?: BrowserWindowConstructorOptions) {
    this.electronService.ipcRenderer.invoke('open-win', path, options);
  }

  async onFileSelected($event: Event) {
    const target = $event.target as HTMLInputElement;
    if (target.files.length < 1) return;

    const { path } = target.files[0];
    this.filePath = path;
    this.handleStartSimulation();
  }

  handleStartSimulation() {
    this.machineService.machinesStartPost(this.filePath).subscribe(data => {
      this.fileLoaded = true;
      this.electronService.ipcRenderer.invoke('refresh-all-states');
    });
  }

  async handleEndSimulation() {
    this.electronService.ipcRenderer.invoke('close-other-wins');
    this.machineService.machinesStopPost().subscribe(() => {
      this.fileLoaded = false;
      this.coins$
        .subscribe(coins => {
          this.coinService.coinsDelete(coins.map(c => c.id)).subscribe(() => {
            this.electronService.ipcRenderer.invoke('refresh-coin-states');
          });
        })
        .unsubscribe();
      this.machines$
        .subscribe(machines => {
          this.machineService
            .machinesDelete(machines.map(c => c.id))
            .subscribe(() => {
              this.electronService.ipcRenderer.invoke('refresh-machine-states');
            });
        })
        .unsubscribe();
      this.drinks$
        .subscribe(drinks => {
          this.drinkService
            .drinksDelete(drinks.map(c => c.id))
            .subscribe(() => {
              this.electronService.ipcRenderer.invoke('refresh-drink-states');
            });
        })
        .unsubscribe();
      this.users$
        .subscribe(users => {
          this.userService.usersDelete(users.map(c => c.id)).subscribe(() => {
            this.electronService.ipcRenderer.invoke('refresh-user-states');
          });
        })
        .unsubscribe();
    });
  }

  activateMaintenancePanel() {
    this._newWindow('/maintainer', {
      width: 1035,
      height: 660,
    });
  }
  activateMachineryPanel() {
    this._newWindow('/machinery', {
      width: 1035,
      height: 660,
    });
  }
  activateCustomerPanel() {
    this._newWindow('/customer', {
      width: 1035,
      height: 660,
    });
  }
}
