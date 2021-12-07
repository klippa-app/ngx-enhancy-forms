# NgxEnhancyForms

Enhancy Forms is the forms framework used for klippa frontend applications.

Known Issues:
- ngx-date-fns-adapter is not compatible with Angular 12. The date picker can be used, but cannot be internationalised.

# How to install

Install using npm/yarn: 

```bash
$ yarn add @klippa/ngx-enhancy-forms
```

Import the `NgxEnhancyFormsModule` into your module.

```js
// my.module.js
/* ... */
import {NgxEnhancyFormsModule} from "@klippa/ngx-enhancy-forms";

@NgModule({
	declarations: [/* ... */],
	imports: [
		/* ... */,
		NgxEnhancyFormsModule,
	],

	exports: [
		/* ... */
		NgxEnhancyFormsModule, // Export it if you wish to use it in parent modules.
	],
})
export class MyModule {
}
```

# Usage

## Example form

```html
<klp-form>
	<klp-form-element caption="Username">
		<klp-form-text-input formControlName='username'></klp-form-text-input>
	</klp-form-element>
	<klp-form-element caption="Password">
		<klp-form-password-field formControlName="password"></klp-form-password-field>
	</klp-form-element>
	<klp-form-submit-button fullWidth [submitCallback]="onSubmit">
		Login
	</klp-form-submit-button>
</klp-form>
```

```ts
@Component({
	selector: 'app-login-form',
	templateUrl: './login-form.component.html',
	styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent {
	loginForm: FormGroup = this.fb.group({
		username: [null, Validators.required],
		password: [null, [Validators.required, Validators.minLength(8)]],
	});

	constructor( private fb: FormBuilder ) {}

	/** onSubmit must be a lambda function **/
	onSubmit = (value: any): Promise<void> => console.log(value);
}
```

## Notable elements and features

### `<klp-form-submit-button>`

The `submitCallback` is an input rather than a output. As such it _must_ be a lambda function to maintain the correct scope.

### Providing alternative error messages

The `<klp-form-element>` uses some default error messages for the internal validations. If you wish to use different messages,
for example if you wish to translate them, you can do so by providing `FORM_ERROR_MESSAGES` somewhere in your application.

The `FORM_ERROR_MESSAGES` should be of type `CustomErrorMessages` as exported from [types.ts](./src/lib/types.ts).

The `min`, `max`, `minLength`, and `maxLength` messages will substitute `%min%`, `%max%`, `%minLength%`, and `%maxLength%`
with their respective limits.

Here is an example of how you might provide translations for the example login form:

```js
@Component({
	selector: 'app-login-form',
	templateUrl: './login-form.component.html',
	styleUrls: ['./login-form.component.scss'],
	providers: [
		{
			provide: FORM_ERROR_MESSAGES,
			deps: [TranslateService],
			useFactory: (translate: TranslateService) => {
				return {
					min: () => translate.instant(_("use a number larger than %min%")),
					/* ... */
				};
			},
		},
	],
})
export class LoginFormComponent {
 /* ... */
}
```

### Providing locale preferences for the date picker

The DatePicker uses the @Angular/material date picker, but uses standard `Date`s internally
so is only compatible with `DateAdapters` that also use `Date`.

#### Angular 10/11

For Angular 10 and 11, the `Date` restriction means that only the `MatNativeDateAdapter` or a custom adapter
such as [NgxMatDatefnsDateAdapter](https://www.npmjs.com/package/ngx-mat-datefns-date-adapter) can be used.
The former provides no localization capabilities and so is not very useful.

Here is an example of how to provide a customised NgxMatDatefnsDateAdapter that accepts multiple date formats for input

```js
// custom DateAdapter
class MultiParseDateFnsDateAdapter extends NgxDateFnsDateAdapter {
	// override the parse function to take arrays of parseFormats and try each in turn.
	parse(value: any, parseFormat: any) {
		if (typeof value === 'string') {
			if (value.length === 0) {
				return null;
			}
			// replace all '/' and '.' with '-' for locales that use '/' or '.' seperated dates.
			value = value.replace(/[\/.]/g, '-');
		}
		if (Array.isArray(parseFormat)) {
			for (const format of parseFormat) {
				if (isMatch(value, format)) {
					return super.parse(value, format);
				}
			}
		}
		return null;
	}
}
```
git
```ts
@Component({
	selector: 'app-login-form',
	templateUrl: './login-form.component.html',
	styleUrls: ['./login-form.component.scss'],
	providers: [
		{ provide: DateAdapter, useClass: MultiParseDateFnsDateAdapter, deps: [MAT_DATE_LOCALE] },
		{
			provide: KLP_DATE_FORMATS,
			useValue: (format?: string) => { // format is the format provided as an input to the date field.
				const preferred = format ?? 'dd-MM-yyyy';
				return {
					parse: { // formats to parse.
						// if the selected format fails to parse try all supported and all long locale formats.
						dateInput: [preferred, 'dd-MM-yyyy', 'MM-dd-yyyy', 'PP', 'PPP', 'PPPP'],
					},
					display: { // format to display.
						dateInput: preferred, // Display as prefered format.
						monthLabel: 'MMM', // Month label in the date picker.
						monthYearLabel: 'MMM yyyy', // month and year label in the date picker.
						dateA11yLabel: 'MMM dd, yyyy', // Accessability variant for screen readers etc.
						monthYearA11yLabel: 'MMMM yyyy', // same as above.
					},
				};
			},
		},
	],
})
export class LoginFormComponent {
    /** **/
}

```

Here we provide a function for `KLP_DATE_FORMATS` to the LoginFormComponent, you can also do this in a module for project wide config.

#### Angular 12

[NgxMatDatefnsDateAdapter](https://www.npmjs.com/package/ngx-mat-datefns-date-adapter) currently does not
support Angular 12, so localization is not possible.

#### Angular 13

Angular 13 introduces a new date adapter, @angular/material-date-fns-adapter.

TODO: work out how to use the `MatDateFnsAdapter`.
