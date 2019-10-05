const webScreenshot = require('./index')
const program = require('commander')

async function main () {
  program
    .version('@@pkg.version')
    .usage('[options] URLs...')
    .option('-w, --width <number>', 'Width of the screenshot', (value, previous) => parseInt(value), 1024)
    .option('-h, --height <number>', 'Height of the screenshot, 0 for unlimited', (value, previous) => parseInt(value), 0)
    .option('-o, --out <pattern>', 'Pattern of the output image file path', value => value, 'image{{count}}.png')
    // .option('-c, --config <file>', 'Configuration file path')
    .helpOption('--help')
  program.parse(process.argv)

  const renderer = webScreenshot.newRenderer({
    render: {
      width: program.width,
      height: program.height,
      outputPath: program.out
    }
  })

  try {
    for (const url of program.args) {
      await renderer.render(url)
      console.error('%s has been rendered.', url)
    }
  } finally {
    await renderer.dispose()
  }
}

main().catch(e => {
  console.error(e)
})
