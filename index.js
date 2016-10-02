const electron = require('electron')
const uuid = require('uuid')
const assert = require('assert')

module.exports = function (webContents, val) {
  assert(
    typeof webContents.executeJavaScript === 'function',
    `${webContents} is not a webContents object`
  )
  return new Promise((resolve, reject) => {
    const eventId = uuid.v4()
    const ipcMain = electron.ipcMain
    ipcMain.once(eventId, (e, payload) => {
      resolve(payload)
    })
    webContents.executeJavaScript(`(() => {
      const renderer = require('electron').ipcRenderer
      renderer.send('${eventId}', ${val})
    })()`)
    setTimeout(resolve, 1000)
  })
}
