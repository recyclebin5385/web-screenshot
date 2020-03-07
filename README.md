# web-screenshot

[![License](https://img.shields.io/badge/License-BSD%202--Clause-blue.svg)](https://opensource.org/licenses/BSD-2-Clause)

A command line tool to take a screenshot of a web page.

## Install

With [Node.js](http://nodejs.org):

    npm install -g web-screenshot

It can also be installed as a dependency of another Node.js package.

    npm install -S web-screenshot

## Usage

### As a command line tool

```sh
web-screenshot http://example.org
web-screenshot example.html
```

You can specify a configuration file with option -c.
Below is an example of a configuration file.

```yaml
puppeteer: # Puppeteer options; see [Puppeteer document](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions).
  args: ["--proxy-server", "http://proxy.example.org:8080/"] # specify proxy server
render: # rendering options
  width: 1000 # width of the rendered image
  height: 500 # height of the rendered image
  outputPath: "out/img-{{count}}.png" # path of the output image file
```

You can specify a {@link https://handlebarsjs.com/ Handlebars} template for "render.outputPath" and embed some variables.
Below is the list of available variables.

- count: The number of URLs which have been rendered
- url: The URL
- urlBasename: The base name of the URL

### As a module

```javascript
const webScreenshot = require('web-screenshot')

async function main () {
  const renderer = webScreenshot.newRenderer()
  await renderer.render('http://yahoo.co.jp')
  await renderer.render('http://google.co.jp')
  await renderer.dispose()
}

main()
```

## History

### version 0.1.0

Released on yyyy-MM-dd

- Initial release

## Development

This project uses [npm](https://www.npmjs.com/) for development.

Try these commands on the top folder of the project.

```sh
npm install
npm run build
```

## Author

 -  recyclebin5385
     - [github](https://github.com/recyclebin5385)
     - [twitter](https://twitter.com/recyclebin5385)

## License

Copyright (c) 2020, recyclebin5385

Released under the [BSD 2-Clause License](LICENSE.txt).
