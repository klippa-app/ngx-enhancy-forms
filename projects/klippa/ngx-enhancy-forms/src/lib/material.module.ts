// material.module.ts

import { NgModule } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
	imports: [MatDatepickerModule, MatFormFieldModule, MatNativeDateModule, MatInputModule, MatButtonModule],
	exports: [MatDatepickerModule, MatFormFieldModule, MatNativeDateModule, MatInputModule, MatButtonModule],
	providers: [MatDatepickerModule],
})
export class MaterialModule {}
