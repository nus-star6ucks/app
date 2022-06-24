import { Component } from '@angular/core';
import { ElectronService } from './core/services';
import { MachineService } from './http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(
    private readonly electronService: ElectronService,
    private readonly machineService: MachineService
  ) {
    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Run in electron');
      console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
      console.log('NodeJS childProcess', this.electronService.childProcess);
    } else {
      console.log('Run in browser');
    }
  }

  machines$ = this.machineService.machinesGet();

  title = 'vmcs-ng';
}
