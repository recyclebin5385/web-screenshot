#!/usr/bin/env node

const webScreenshot = require('./index')
const program = require('commander')
const { cosmiconfig } = require('cosmiconfig')

async function main () {
  program
    .version('@@pkg.version')
    .usage('[options] URLs_or_files...')
    .option('-w, --width <number>', 'Width of the screenshot', (value, previous) => parseInt(value))
    .option('-h, --height <number>', 'Height of the screenshot, 0 for unlimited', (value, previous) => parseInt(value))
    .option('-o, --out <pattern>', 'Pattern of the output image file path', value => value)
    .option('-c, --config <file>', 'Configuration file path')
    .helpOption('--help')
  program.parse(process.argv)

  const explorer = cosmiconfig('@@pkg.name')
  const result = await program.config ? explorer.load(program.config) : explorer.search()
  let options
  if (result) {
    console.error('Configuration file: %s', result.filepath)
    options = result.config
  } else {
    console.error('No configuration file has been found.')
    options = {}
  }

  if (!options.render) {
    options.render = {}
  }

  if (program.width != null) {
    options.render.width = program.width
  }
  if (program.height != null) {
    options.render.height = program.height
  }
  if (program.out != null) {
    options.render.outputPath = program.out
  }

  const renderer = webScreenshot.newRenderer(options)

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
