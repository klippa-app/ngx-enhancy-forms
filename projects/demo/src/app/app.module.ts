import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {NgxEnhancyFormsModule} from "@klippa/ngx-enhancy-forms";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		NgxEnhancyFormsModule,
	],
	declarations: [
    AppComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
