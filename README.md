# webpage2image

[![License](https://img.shields.io/badge/License-BSD%202--Clause-blue.svg)](https://opensource.org/licenses/BSD-2-Clause)

A command line tool to take a screenshot of a web page.

## Install

With [Node.js](http://nodejs.org):

    npm install -g webpage2image

It can also be installed as a dependency of another Node.js package.

    npm install -S webpage2image

## Usage

### As a command line tool

Specify URLs or local file paths as command line arguments.

```sh
webpage2image http://example.org
webpage2image file:///C:/path/to/example.html
webpage2image example1.html C:\\path\\to\\example2.html
```

You can configure the behavior via command line options.
Execute "webpage2image -h" for details.

You can also use a configuration file.
Place a file named ".webpage2imagerc" (beware of the dot)
in the current directory or its ancestors.
You can also specify an arbitrary configuration file path with option -c.
Below is an example of a configuration file.

```yaml
puppeteer: # Puppeteer options; see [Puppeteer document](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions).
  args: ["--proxy-server", "http://proxy.example.org:8080/"] # specify proxy server
render: # rendering options
  width: 1000 # width of the rendered image
  height: 500 # height of the rendered image
  outputPath: "out/img-{{count}}.png" # path of the output image file
```

As the path of the output image file,
You can specify a [https://handlebarsjs.com/](Handlebars) template
and embed some variables.
Below is the list of available variables.

- count: The number of images which have been rendered
- location: The given URL or local file path
- basename: The base name of the URL or local file path

### As a module

```javascript
const webScreenshot = require('webpage2image')

async function main () {
  const renderer = webScreenshot.newRenderer()
  await renderer.render('http://example.org')
  await renderer.render('path/to/example.html')
  await renderer.dispose()
}

main()
```

## History

### version 0.1.0

Released on April 5, 2020

- Initial release

## Development

The source can be found at [GitHub](https://github.com/recyclebin5385/webpage2image).

This project uses [npm](https://www.npmjs.com/) for development.

Try these commands on the top directory of the project.

```sh
npm install
npm run build
```

## Author

- recyclebin5385
  - [github](https://github.com/recyclebin5385)
  - [twitter](https://twitter.com/recyclebin5385)

## License

Copyright (c) 2020, recyclebin5385

Released under the [BSD 2-Clause License](LICENSE.txt).
