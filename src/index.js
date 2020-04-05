/*!
 * @@pkg.name
 *
 * @@pkg.copyright
 *
 * license: @@pkg.license
 */

const puppeteer = require('puppeteer')
const url = require('url')
const path = require('path')
const mkdirp = require('mkdirp')
const Handlebars = require('handlebars')

/**
 * The module for creating a web page screenshot.
 *
 * @module @@pkg.name
 */

/**
 * @classdesc A class which renders web pages as images.
 * @class
 * @hideconstructor
 */
function Renderer (options) {
  this.options = Object.assign({}, options)
  this.browserPromise = puppeteer.launch(this.options.puppeteer)
  this.renderCount = 0
}

/**
 * Render the specified web page and save the image.
 *
 * A {@link https://handlebarsjs.com/ Handlebars} template can be used in "options.outputPath".
 * Below is the variables available in the template.
 *
 * <dl>
 * <dt>count</dt>
 * <dd>The number of URLs which have been rendered</dd>
 * <dt>url</dt>
 * <dd>The URL</dd>
 * <dt>urlBasename</dt>
 * <dd>The base name of the URL</dd>
 * </dl>
 *
 * @async
 * @param {string} location The URL or local file path
 * @param {Object} [options] The options
 * @param {Number} [options.width] The width of the image
 * @param {Number} [options.height] The height of the image, 0 for unlimited
 * @param {string} [options.outputPath] The file path of the saved image
 * @returns {Promise} The promise object
 */
Renderer.prototype.render = async function (location, options) {
  options = Object.assign({
    width: 1024,
    height: 0,
    outputPath: 'image{{count}}.png'
  }, this.options.render, options)

  const resolvedUrl = /^[a-zA-Z0-9]+:\/\//.test(location) ? location : url.pathToFileURL(location).href
  this.renderCount++
  const outputPath = Handlebars.compile(options.outputPath)({
    count: this.renderCount,
    location: location,
    basename: location.replace(/^(?:.*[\\/])?(.+?)[\\/]?$/, '$1')
  })

  const browser = await this.browserPromise

  const page = await browser.newPage()
  page.setViewport({
    width: options.width,
    height: Math.max(options.height, 1)
  })
  await page.goto(resolvedUrl)
  await mkdirp(path.dirname(outputPath))
  await page.screenshot({
    path: outputPath,
    fullPage: options.height <= 0
  })

  return {
    renderCount: this.renderCount,
    outputPath: outputPath,
    url: resolvedUrl
  }
}

/**
 * Dispose the renderer.
 *
 * @async
 * @returns {Promise} The promise object
 */
Renderer.prototype.dispose = async function () {
  const browser = await this.browserPromise
  await browser.close()
}

/**
 * Create a new renderer.
 *
 * For details of "options.puppeteer", see {@link https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions}.
 *
 * @param {Object} [options] The options
 * @param {Object} [options.puppeteer] The options passed to Puppeteer
 * @param {Object} [options.render] The default options of {@link module:@@pkg.name~Renderer#render}
 * @returns {@link module:@@pkg.name~Renderer} The renderer
 */
exports.newRenderer = function (options) {
  return new Renderer(options)
}
