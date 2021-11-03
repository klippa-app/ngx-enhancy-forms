import {NgModule} from '@angular/core';
import {
  NgxEnhancyFormsComponent,
} from './ngx-enhancy-forms.component';
import {CommonModule} from "@angular/common";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    NgxEnhancyFormsComponent
  ],
  exports: [
    NgxEnhancyFormsComponent
  ]
})
export class NgxEnhancyFormsModule {
}
