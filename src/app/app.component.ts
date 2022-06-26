import { Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  concatMap,
  from,
  interval,
  map,
  Observable,
  Subject,
  Subscription,
  switchMap,
  takeWhile,
  timer,
} from 'rxjs';
import { ElectronService } from './core/services';
import { DataService } from './data.service';
import { DefaultService } from './http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    private readonly electronService: ElectronService,
    private readonly defaultService: DefaultService,
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

  apiReady = false;
  healthValidationSubscription: Subscription;
  healthValidationSubject$ = new BehaviorSubject('');

  ngOnInit(): void {
    this.healthValidationSubscription = this.healthValidationSubject$
      .pipe(
        switchMap(_ =>
          timer(0, 1000).pipe(
            concatMap(_ => this.defaultService.actuatorHealthGet())
          )
        )
      )
      .subscribe(() => {
        this.apiReady = true;
        this.healthValidationSubscription.unsubscribe();
      });
  }
}
