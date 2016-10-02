const electron = require('electron')
const uuid = require('uuid')

module.exports = function (win, val) {
  return new Promise((resolve, reject) => {
    const eventId = uuid.v4()
    const ipcMain = electron.ipcMain
    ipcMain.once(eventId, (e, payload) => {
      resolve(payload)
    })
    win.openDevTools()
    win.webContents.executeJavaScript(`(() => {
      const renderer = require('electron').ipcRenderer
      renderer.send('${eventId}', ${val})
    })()`)
  })
}
