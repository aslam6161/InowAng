import { APP_INITIALIZER, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { GenerateRandomComponent } from './generate-random/generate-random.component';
import { ReportComponent } from './report/report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportService } from './_services/report.service';
import { SignalrService } from './_services/signalr.service';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { AlertifyService } from './_services/alertify.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpErrorInterceptor } from './_common/http-error-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    GenerateRandomComponent,
    ReportComponent,
    NavBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    BrowserAnimationsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    AlertifyService,
    ReportService,
    SignalrService,
    {
      provide: APP_INITIALIZER,
      useFactory: (signalrService: SignalrService) => () => signalrService.initiateSignalrConnection(),
      deps: [SignalrService],
      multi: true,
    },
    {

      provide: HTTP_INTERCEPTORS,

      useClass: HttpErrorInterceptor,

      multi: true

    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
