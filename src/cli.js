#!/usr/bin/env node

const webScreenshot = require('./index')
const program = require('commander')
const { cosmiconfig } = require('cosmiconfig')

async function main () {
  program
    .version('@@pkg.version')
    .usage('[options] URLs_or_files...')
    .option('-W, --width <number>', 'specify the width of the screenshot', (value, previous) => parseInt(value))
    .option('-H, --height <number>', 'specify the height of the screenshot, 0 for unlimited', (value, previous) => parseInt(value))
    .option('-o, --out <pattern>', 'specify the pattern of the output image file path', value => value)
    .option('-c, --config <file>', 'specify the configuration file path')
  program.parse(process.argv)

  const explorer = cosmiconfig('@@pkg.name')
  const result = program.config ? await explorer.load(program.config) : await explorer.search()
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
    for (const urlOrFile of program.args) {
      await renderer.render(urlOrFile)
      console.error('%s has been rendered.', urlOrFile)
    }
  } finally {
    await renderer.dispose()
  }
}

main().catch(e => {
  console.error(e)
})
