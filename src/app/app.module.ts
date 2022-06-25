import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { CustomerComponent } from './customer/customer.component';
import { ApiModule, Configuration, ConfigurationParameters } from './http';
import { MachineryComponent } from './machinery/machinery.component';
import { MaintainerComponent } from './maintainer/maintainer.component';
import { SimulatorComponent } from './simulator/simulator.component';

export function apiConfigFactory(): Configuration {
  const params: ConfigurationParameters = {
    basePath: 'http://localhost:8081',
  };
  return new Configuration(params);
}

@NgModule({
  declarations: [
    AppComponent,
    CustomerComponent,
    MachineryComponent,
    MaintainerComponent,
    SimulatorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    ApiModule.forRoot(apiConfigFactory),
    HttpClientModule,
    AngularSvgIconModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
