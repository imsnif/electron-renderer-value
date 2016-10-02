const createApp = require('../util/create-app')
const test = require('tape')

const proxyquire = require('proxyquire')

const { EventEmitter } = require('events')

function applyMocks (emitter) {
  return proxyquire('../..', {
    electron: {ipcMain: emitter},
    uuid: {v4: () => 1}
  })
}

function bridgePayload (app, emitter) {
  // bridge between ipcMain of app and mocked ipcMain of test
  return new Promise(async resolve => {
    const payload = await app.electron.remote.getGlobal('__payload__')
    emitter.emit('1', null, payload)
    resolve()
  })
}

test('bad parameters', async t => {
  t.plan(1)
  try {
    const emitter = new EventEmitter()
    const rendererVal = applyMocks(emitter)
    t.throws(
      () => rendererVal('notWebContents', 'window.val'),
      'notWebContents is not a webContents object',
      'cannot call with bad webContents'
    )
  } catch (e) {
    t.fail(e)
  }
})

test('can get value from renderer window object', async t => {
  t.plan(1)
  const app = await createApp(t)
  try {
    const val = 'foo'
    const emitter = new EventEmitter()
    const rendererVal = applyMocks(emitter)
    const webContents = app.webContents
    await webContents.executeJavaScript(`window.val = '${val}'`)
    // place value so we can get it later
    const [ valFromWindow ] = await Promise.all([
      rendererVal(webContents, 'window.val'),
      bridgePayload(app, emitter)
    ])
    await app.stop()
    t.equal(valFromWindow, val, 'value returned properly from renderer process')
  } catch (e) {
    await app.stop()
    t.fail(e)
  }
})
