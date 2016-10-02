const electron = require('electron')
const Application = require('spectron').Application
const test = require('tape')
const path = require('path')

module.exports = async function createApp (t) {
  try {
    const app = new Application({
      path: electron,
      args: [ path.resolve(__dirname, '..', 'runner') ],
      nodeIntegration: true
    })
    await app.start()
    await app.client.waitUntilWindowLoaded()
    await app.browserWindow.isVisible()
    return app
  } catch (e) {
    t.fail('failed to create app:', e.message)
  }
}
