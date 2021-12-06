# NgxEnhancyForms

This is the readme for developers. For information on how to use the library,
[see this readme](./projects/klippa/ngx-enhancy-forms/README.md).

# Double `Package.json`

You might have noticed that there are two `package.json` files in this repo. The top one (`./package.json`), is for
building and developing the library. The inner one (`./projects/klippa/ngx-enhancy-forms/package.json`) is what is
distributed with the library to end users.

## Adding dependencies

To add a development dependency, such as prettier, simply add it to `devDependencies` in the top `package.json`.
To add a dependency to the library, add it to the inner `package.json`'s `peerDependencies` __AND__ to the outer
`package.json`'s `dependencies`. Only ever run `yarn install` with the top `package.json`.

# Building

Always run `yarn build:prod`, `ng build --prod`, or `ng build --configuration=production`.

The normal build does not build the library for distribution and it will not work.

# Testing

There are several ways to test the library after building locally, the most direct way is add the built library to your
project as a _file_ dependency.

For example, if you cloned this repo in your home directory:

```json
{
	"name": "my-awesome-app",
	"dependencies": {
		"@klippa/ngx-enhancy-forms": "file:$HOME/dist/klippa/ngx-enhancy-forms"
	}
}
```

Whenever you make changes to the library, run `yarn build:prod`, and then in the application:

```
$ yarn update @klippa/ngx-enhancy-forms
```

You can also try using `link:` instead of `file:`, or using `yarn link` however your millage may vary.
I have personally noticed that this preserves the references to _this_ repo's `node_packages` which will
break the build of the application using it. `file:` will not preserve symlinks, but will not dynamically
update after building the library (hence why you need to run `yarn update`).

