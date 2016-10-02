# electron-renderer-view
[![Build Status](https://travis-ci.org/imsnif/electron-renderer-value.svg?branch=master)](https://travis-ci.org/imsnif/electron-renderer-value)
[![Coverage Status](https://coveralls.io/repos/github/imsnif/electron-renderer-value/badge.svg?branch=master)](https://coveralls.io/github/imsnif/electron-renderer-value?branch=master)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)


Easily get a value from an electron renderer instance   
(eg. some attribute on the window object)

### Usage
```javascript
const { BrowserWindow } = require('electron')
const rendererVal = require('electron-renderer-value')

// ...

app.on('ready', () => {
  const ipcMain = electron.ipcMain
  const win = new BrowserWindow()  
  win.loadURL(`file://${__dirname}/someFile.html`)
  rendererVal(win.webContents, 'window.foo')
  .then(param => {
    console.log(param) // value of foo from window object of renderer
  })
}
```
## Contributions / Issues
Please feel free to open an issue or a PR if something's broken, or if you'd like some specific features added.

## License
MIT

