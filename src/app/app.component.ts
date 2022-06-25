import { Component } from '@angular/core';
import { ElectronService } from './core/services';
import { DataService } from './data.service';
import { MachineService } from './http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(
    private readonly electronService: ElectronService,
    private readonly dataService: DataService
  ) {
    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Run in electron');
      console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
      console.log('NodeJS childProcess', this.electronService.childProcess);
    } else {
      console.log('Run in browser');
    }

    this.electronService.ipcRenderer.on('refresh-all-states', () => {
      dataService.loadAll();
    });
    this.electronService.ipcRenderer.on('refresh-user-states', () => {
      dataService.loadUsers();
    });
    this.electronService.ipcRenderer.on('refresh-machine-states', () => {
      dataService.loadMachines();
    });
    this.electronService.ipcRenderer.on('refresh-drink-states', () => {
      dataService.loadDrinks();
    });
    this.electronService.ipcRenderer.on('refresh-coin-states', () => {
      dataService.loadCoins();
    });
  }
}
