import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  concatMap,
  from,
  interval,
  map,
  Observable,
  retry,
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
    private readonly dataService: DataService,
    private readonly cdr: ChangeDetectorRef
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

  apiReady = false;
  healthValidationSubscription: Subscription;
  healthValidationSubject = new BehaviorSubject('');

  _initElectronIPCListeners() {
    this.electronService.ipcRenderer.on('refresh-all-states', () => {
      console.log('[Refresh States] All');
      this.dataService.loadAll(this.cdr);
    });
    this.electronService.ipcRenderer.on('refresh-user-states', () => {
      console.log('[Refresh States] Users');
      this.dataService.loadUsers(this.cdr);
    });
    this.electronService.ipcRenderer.on('refresh-machine-states', () => {
      console.log('[Refresh States] Machines');
      this.dataService.loadMachines(this.cdr);
    });
    this.electronService.ipcRenderer.on('refresh-drink-states', () => {
      console.log('[Refresh States] Drinks');
      this.dataService.loadDrinks(this.cdr);
    });
    this.electronService.ipcRenderer.on('refresh-coin-states', () => {
      console.log('[Refresh States] Coins');
      this.dataService.loadCoins(this.cdr);
    });
  }

  ngOnInit(): void {
    this._healthValidateAndLoadAll();
    this._initElectronIPCListeners();
  }

  private _healthValidateAndLoadAll() {
    this.healthValidationSubscription = this.healthValidationSubject
      .pipe(
        switchMap(_ =>
          timer(0, 1000).pipe(
            concatMap(_ => this.defaultService.actuatorHealthGet()),
            retry()
          )
        )
      )
      .subscribe(() => {
        this.apiReady = true;
        this.dataService.loadAll(this.cdr);
        this.healthValidationSubscription.unsubscribe();
      });
  }
}
