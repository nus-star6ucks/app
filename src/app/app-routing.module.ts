import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './customer/customer.component';
import { ApiModule } from './http';
import { MachineryComponent } from './machinery/machinery.component';
import { MaintainerComponent } from './maintainer/maintainer.component';
import { SimulatorComponent } from './simulator/simulator.component';

const routes: Routes = [
  {
    path: '',
    component: SimulatorComponent,
  },
  {
    path: 'customer',
    component: CustomerComponent,
  },
  {
    path: 'machinery',
    component: MachineryComponent,
  },
  {
    path: 'maintainer',
    component: MaintainerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true }), ApiModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
