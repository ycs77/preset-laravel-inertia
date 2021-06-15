import { color, Preset } from 'apply'

Preset.setName('Inertia.js for Laravel')
Preset.option('init', true)

Preset.apply('ycs77/preset-laravel')
  .with('--no-interaction')
  .ifOption('init')

Preset.apply('ycs77/preset-laravel-tailwindcss')
  .with(['--no-interaction', '--no-init', '--no-install'])

Preset.delete(['resources/js', 'resources/views']).withoutTitle()

Preset.extract('default').withTitle('Extracting templates...')

Preset.group((preset) => {
  preset
    .edit('webpack.mix.js')
    .addAfter('.js\\\(\'resources/js/app.js\'', '.vue()')

  preset
    .edit('webpack.mix.js')
    .addAfter('postCss', [
      '.alias({',
      '  \'@\': `${__dirname}/resources/js`,',
      `})`,
      '.webpackConfig(({ DefinePlugin }) => ({',
      '  plugins: [',
      '    new DefinePlugin({',
      '      __VUE_OPTIONS_API__: \'true\',',
      '      __VUE_PROD_DEVTOOLS__: \'false\',',
      '    }),',
      '  ],',
      '}))',
    ])
    .skipLines(5)
}).withTitle(`Updating ${color.magenta('mix config')}...`)

Preset.group((preset) => {
  preset
    .edit('routes/web.php')
    .update((content) => content.replace('view', 'Inertia::render').replace('welcome', 'Home'))
    .addAfter('use Illuminate\\\\Support\\\\Facades\\\\Route;', 'use Inertia\\Inertia;')
}).withTitle(`Updating ${color.magenta('routes')}...`)

Preset.group((preset) => {
  preset
    .editNodePackages()
    .add('@inertiajs/inertia', '^0.9.2')
    .add('@inertiajs/inertia-vue3', '^0.4.7')
    .add('vue', '^3.0.0')
    .addDev('@vue/compiler-sfc', '^3.0.0')
    .addDev('vue-loader', '^16.0.0')

  preset
    .editPhpPackages()
    .add('inertiajs/inertia-laravel', '^0.4.2')
}).withTitle('Updating dependencies...')

Preset.installDependencies('node').ifUserApproves().withoutTitle()
Preset.installDependencies('php').ifUserApproves().withoutTitle()

Preset.instruct([
  `Run ${color.magenta('npm run dev')} or ${color.magenta('yarn dev')}`,
  `Docs: ${color.magenta('https://inertiajs.com')}`,
])
