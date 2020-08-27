const { Preset } = require('use-preset')

// prettier-ignore
module.exports = Preset.make('Laravel Inertia')
  .option('vue', true)
  .option('auth', true)
  .option('interaction', true)

  .apply('ycs77/preset-laravel-tailwindcss')
    .title('Install Tailwind CSS from its preset')
    .with('--no-interaction')
    .chain()

  .editJson('package.json')
    .title('Add Node dependencies')
    .merge({
      devDependencies: {
        '@inertiajs/inertia': '^0.2',
        '@inertiajs/inertia-vue': '^0.2',
        'vue-template-compiler': '^2.6.11',
        'vue-meta': '^2.4',
        vue: '^2.6.11'
      }
    })
    .chain()

  .editJson('composer.json')
    .merge({
      require: {
        'inertiajs/inertia-laravel': '^0.2'
      }
    })
    .chain()

  .delete(['resources/js/bootstrap.js', 'resources/views/welcome.blade.php'])
    .title('Remove JavaScript bootstrap file and default view')
    .chain()

  // Always install the default Inertia scaffolding
  .copyDirectory('default')
    .to('/')
    .title('Install default scaffolding')
    .whenConflict('override')
    .chain()

  // Install the Vue base scaffolding
  .copyDirectory('vue')
    .to('/')
    .title('Install Vue scaffolding')
    .if(({ flags }) => Boolean(flags.vue))
    .whenConflict('override')
    .chain()

  // Install the base authentication scaffolding
  .copyDirectory('auth')
    .to('/')
    .title('Install authentication scaffolding')
    .if(({ flags }) => Boolean(flags.auth))
    .whenConflict('override')
    .chain()

  // Install the Vue authentication scaffolding
  .copyDirectory('vue-auth')
    .to('/')
    .title('Install Vue authentication scaffolding')
    .if(({ flags }) => Boolean(flags.vue) && Boolean(flags.auth))
    .whenConflict('override')
    .chain()

  .edit('config/app.php')
    .title('Register service provider')
    .search(/App\\Providers\\RouteServiceProvider::class,/)
      .addAfter('App\\Providers\\InertiaServiceProvider::class,')
      .end()
    .chain()

  .edit('app/Providers/RouteServiceProvider.php')
    .title('Update route configuration')
    .replace(`public const HOME = '/home';`).with(`public const HOME = '/';`)
    .replace(`$namespace = 'App\\Http\\Controllers'`).with(`$namespace = ''`)
    .chain()

  .installDependencies()
    .if(({ flags }) => Boolean(flags.interaction))
    .for('node')
    .title('Install Node dependencies')
    .chain()

  .updateDependencies()
    .if(({ flags }) => Boolean(flags.interaction))
    .withoutAsking()
    .for('node')
    .title('Update node dependencies')
    .chain()

  .updateDependencies()
    .if(({ flags }) => Boolean(flags.interaction))
    .for('php')
    .title('Install PHP dependencies')
    .chain()
