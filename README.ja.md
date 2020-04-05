# webpage2image

[![License](https://img.shields.io/badge/License-BSD%202--Clause-blue.svg)](https://opensource.org/licenses/BSD-2-Clause)

ウェブページのスクリーンショットを作成するコマンドラインツール。

## インストール

[Node.js](http://nodejs.org)の場合:

    npm install -g webpage2image

他のNode.jsパッケージの依存先としてインストールすることも可能です。

    npm install -S webpage2image

## 使用法

### コマンドラインツールとして

コマンドライン引数としてURLまたはローカルファイルのパスを指定してください。

```sh
webpage2image http://example.org
webpage2image file:///C:/path/to/example.html
webpage2image example1.html C:\\path\\to\\example2.html
```

コマンドラインオプションで動作を設定することができます。
詳細は "webpage2image -h" を実行してください。

設定ファイルを用いることもできます。
".webpage2imagerc"という名称 (ピリオドに注意) のファイルをカレントディレクトリかその上位のディレクトリに配置します。
オプション-cによって任意の設定ファイルを指定することも可能です。
以下は設定ファイルの例です。

```yaml
puppeteer: # Puppeteerのオプション、[Puppeteerのドキュメント](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions)を参照
  args: ["--proxy-server", "http://proxy.example.org:8080/"] # プロキシサーバを指定する
render: # レンダリングのオプション
  width: 1000 # 出力ファイルの幅
  height: 500 # 出力ファイルの高さ
  outputPath: "out/img-{{count}}.png" # 出力画像ファイルのパス
```

出力画像ファイルのパスとして、
[https://handlebarsjs.com/](Handlebars)のテンプレートを指定して変数を埋め込むことができます。
以下は利用可能な変数の一覧です。

- count: これまでに出力された画像の数
- location: 指定されたURLまたはローカルファイルのパス
- basename: URLまたはローカルファイルのパスのベース名

### モジュールとして

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

## 履歴

### バージョン0.1.0

リリース日: 2020年4月5日

- 初期リリース

## 開発者向け情報

ソースコードは[GitHub](https://github.com/recyclebin5385/webpage2image)から取得することができます。

このプロジェクトでは開発用に[npm](https://www.npmjs.com/)を使用しています。

以下のコマンドをプロジェクトのトップのディレクトリで実行してください。

```sh
npm install
npm run build
```

## 作成者

- recyclebin5385
  - [github](https://github.com/recyclebin5385)
  - [twitter](https://twitter.com/recyclebin5385)

## ライセンス情報

Copyright (c) 2020, recyclebin5385

[BSD 2-Clause License](LICENSE.txt)のもとでリリースされています。
