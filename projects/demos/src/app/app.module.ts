import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {AgmxModule} from '@ojtli/agmx';

import { AppComponent } from './app.component';
import {environment as env} from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AgmxModule.forRoot({
      apiKey: env.gmapApiKey,
      libraries: ['places'],
      apiVersion: '3.43',
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
