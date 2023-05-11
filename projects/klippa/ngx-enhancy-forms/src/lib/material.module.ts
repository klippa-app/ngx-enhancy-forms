// material.module.ts

import { NgModule } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';

@NgModule({
	imports: [MatDatepickerModule, MatFormFieldModule, MatNativeDateModule, MatInputModule, MatButtonModule],
	exports: [MatDatepickerModule, MatFormFieldModule, MatNativeDateModule, MatInputModule, MatButtonModule],
	providers: [MatDatepickerModule],
})
export class MaterialModule {}
