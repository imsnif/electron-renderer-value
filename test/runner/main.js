'use strict'

const { app, BrowserWindow, ipcMain } = require('electron')

app.on('ready', () => {
  const win = new BrowserWindow({
    height: 400,
    width: 600,
    frame: false
  })
  win.loadURL(`file://${__dirname}/index.html`)
  ipcMain.on('1', (e, p) => global.__payload__ = p)
})
