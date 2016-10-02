const electron = require('electron')
const Application = require('spectron').Application
const test = require('tape')
const path = require('path')

const istanbul = require('istanbul')
const collector = new istanbul.Collector()
const reporter = new istanbul.Reporter()

const recordCoverage = !!process.env.coverage

async function getCoverage (app) {
  await app.webContents.executeJavaScript(`
    const ipcRenderer = require('electron').ipcRenderer
    ipcRenderer.send('reportCoverage', window.__coverage__)
  `)
  const coverage = await app.electron.remote.getGlobal('__coverage__')
  collector.add(coverage)
}

module.exports = async function createApp (t) {
  try {
    const app = new Application({
      path: electron,
      args: [ path.resolve(__dirname, '..', recordCoverage ? 'runner-coverage' : 'runner') ],
      nodeIntegration: true
    })
    await app.start()
    await app.client.waitUntilWindowLoaded()
    await app.browserWindow.isVisible()
    return (recordCoverage
      ? Object.assign({}, app, {stop: async () => {
        await getCoverage(app)
        return app.stop()
      }})
      : app
    )
  } catch (e) {
    t.fail('failed to create app:', e.message)
  }
}

test.onFinish(() => {
  if (recordCoverage) {
    reporter.addAll([ 'text', 'html', 'lcov' ])
    reporter.write(collector, false, () => {}) // no-op
  }
})
