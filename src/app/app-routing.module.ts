import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './customer/customer.component';
import { MachineryComponent } from './machinery/machinery.component';
import { MaintainerComponent } from './maintainer/maintainer.component';
import { SimulatorComponent } from './simulator/simulator.component';

const routes: Routes = [
  {
    path: 'simulator',
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
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
