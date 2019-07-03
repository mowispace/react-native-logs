"use strict"
var rnlogs = require("../dist/index.js")

var transport = require("../dist/transports/index.js").consoleSyncTransport

test("he log function should return true", () => {
  var log = rnlogs.logger.createLogger({ transport: transport })
  log.setLevel("trace")
  expect(log.trace("message")).toBe(true)
})

test("The log function should print string, objects, functions in console", () => {
  var log = rnlogs.logger.createLogger({ transport: transport })
  var outputData = ""
  var storeLog = inputs => (outputData += inputs)
  console["log"] = jest.fn(storeLog)
  log.trace("message")
  expect(outputData.length).toBeGreaterThan(0)
  outputData = ""
  log.trace({ message: "message" })
  expect(outputData.length).toBeGreaterThan(0)
  outputData = ""
  log.trace(() => {
    return true
  })
  expect(outputData.length).toBeGreaterThan(0)
})

test("When set higher power level, the lover power level, should not print in console", () => {
  var log = rnlogs.logger.createLogger({ transport: transport })
  log.setLevel("info")
  var outputData = ""
  var storeLog = inputs => (outputData += inputs)
  console["log"] = jest.fn(storeLog)
  log.trace("message")
  expect(outputData.length).toBe(0)
})

test("When passed the optional callback should be defined", done => {
  var log = rnlogs.logger.createLogger({ transport: transport })
  function cb() {
    expect("ok").toBe("ok")
    done()
  }
  log.info("message", cb)
})
