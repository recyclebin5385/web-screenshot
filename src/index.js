/*!
 * @@pkg.name <@@pkg.homepage>
 *
 * @@pkg.copyright
 *
 * license: @@pkg.license
 */

const puppeteer = require('puppeteer')
const path = require('path')
const mkdirp = require('mkdirp')
const Handlebars = require('handlebars')

/**
 * Description of the module.
 *
 * @module @@pkg.name
 */

function Renderer (options) {
  this.options = Object.assign({}, options)
  this.browserPromise = puppeteer.launch(this.options.puppeteer)
  this.renderCount = 0
}

Renderer.create = function (options) {
  return new Renderer(options)
}

Renderer.prototype.render = async function (url, options) {
  options = Object.assign({}, options, this.options.render, {
    width: 1024,
    height: 0,
    outputPath: 'image{{count}}.png'
  })

  this.renderCount++
  const outputPath = Handlebars.compile(options.outputPath)({
    count: this.renderCount,
    url: url,
    urlBasename: url.replace(/^(?:.*[\\/])?(.+?)[\\/]?$/, '$1')
  })

  const browser = await this.browserPromise

  const page = await browser.newPage()
  page.setViewport({
    width: options.width,
    height: Math.max(options.height, 1)
  })
  await page.goto(url)
  await mkdirp(path.dirname(outputPath))
  await page.screenshot({
    path: outputPath,
    fullPage: options.height <= 0
  })
}

Renderer.prototype.dispose = async function () {
  const browser = await this.browserPromise
  await browser.close()
}

/**
 * Do something.
 *
 * @param {Object} options Options
 * @param {string} options.foo FooBar
 */
module.exports = {
  newRenderer: function (options) {
    return new Renderer(options)
  }
}

async function main () {
  const renderer = Renderer.create()
  await renderer.render('http://yahoo.co.jp')
  await renderer.render('http://google.co.jp')
  await renderer.dispose()
}

main()
