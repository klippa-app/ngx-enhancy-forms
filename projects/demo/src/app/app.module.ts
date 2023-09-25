import {BrowserModule} from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';
import {NgxEnhancyFormsModule} from '@klippa/ngx-enhancy-forms';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SubFormExampleComponent} from './subForm/sub-form-example.component';
import DeepInputComponent from './deep-input/deep-input.component';
import { DemoComponent } from './demo/demo.component';
import { OnSubmitErrorsComponent } from './on-submit-errors/on-submit-errors.component';

const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		component: DemoComponent,
	},
	{
		path: 'submit-errors',
		component: OnSubmitErrorsComponent,
	}
];

@NgModule({
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		RouterModule.forRoot(routes),
		FormsModule,
		ReactiveFormsModule,
		NgxEnhancyFormsModule,
	],
	declarations: [
		AppComponent,
		SubFormExampleComponent,
		DeepInputComponent,
		DemoComponent,
		OnSubmitErrorsComponent,
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {
}
