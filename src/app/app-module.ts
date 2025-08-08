import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core'
import { BrowserModule, provideClientHydration, withIncrementalHydration } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing-module'
import { App } from './app'
import { NgApexchartsModule } from 'ng-apexcharts'
import { provideHttpClient } from '@angular/common/http'

@NgModule({
  declarations: [
    App
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgApexchartsModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideClientHydration(withIncrementalHydration()),
    provideHttpClient()
  ],
  bootstrap: [App]
})
export class AppModule {
}
