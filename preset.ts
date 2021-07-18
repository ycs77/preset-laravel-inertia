import { color, Preset } from 'apply'

Preset.setName('Inertia.js for Laravel')
Preset.option('init', true)
Preset.option('tailwind', true)
Preset.option('install', true)

Preset.apply('ycs77/preset-laravel')
  .with('--no-interaction')
  .ifOption('init')

Preset.apply('ycs77/preset-laravel-tailwindcss')
  .with(['--no-interaction', '--no-init', '--no-install'])
  .ifOption('tailwind')

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
    .add('@inertiajs/inertia', '^0.10.0')
    .add('@inertiajs/inertia-vue3', '^0.5.0')
    .add('vue', '^3.0.0')
    .addDev('@vue/compiler-sfc', '^3.0.0')
    .addDev('vue-loader', '^16.0.0')

  // Sort node dependencies...
  preset.edit('package.json')
    .update(original => {
      let content = JSON.parse(original)
      const indent = original.match(/^{\r?\n([ \t]+)/)[1]
      const sortObject = (unsortObj: object, compareFn?: (a: string, b: string) => number) => Object
        .keys(unsortObj).sort(compareFn).reduce((obj, key) => {
          obj[key] = unsortObj[key]
          return obj
        }, {})
      const sortProps = ['dependencies', 'devDependencies']
      content = sortObject(content, (a, b) => a === sortProps[0] && b === sortProps[1] ? -1 : 1)
      sortProps.forEach(prop => {
        if (!content[prop]) return
        content[prop] = sortObject(content[prop])
      })
      return JSON.stringify(content, null, indent)+'\n'
    })

  preset
    .editPhpPackages()
    .add('inertiajs/inertia-laravel', '^0.4.2')
}).withTitle('Updating dependencies...')

Preset.installDependencies('node').withoutTitle().ifOption('install')
Preset.installDependencies('php').withoutTitle().ifOption('install')

Preset.instruct([
  `Run ${color.magenta('npm run dev')} or ${color.magenta('yarn dev')}`,
  `Docs: ${color.magenta('https://inertiajs.com')}`,
])
