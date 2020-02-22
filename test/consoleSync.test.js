"use strict"
var rnlogs = require("../dist/index.js")

var transport = require("../dist/transports/index.js").consoleSyncTransport

test("The log function should print string, objects, functions in console", () => {
  var log = rnlogs.logger.createLogger({ transport: transport })
  var outputData = ""
  var storeLog = inputs => (outputData += inputs)
  console["log"] = jest.fn(storeLog)
  log.debug("message")
  expect(outputData.length).toBeGreaterThan(0)
  outputData = ""
  log.debug({ message: "message" })
  expect(outputData.length).toBeGreaterThan(0)
  outputData = ""
  log.debug(() => {
    return true
  })
  expect(outputData.length).toBeGreaterThan(0)
})

test("When set higher power level, the lover power level, should not print in console", () => {
  var log = rnlogs.logger.createLogger({ transport: transport })
  log.setSeverity("info")
  var outputData = ""
  var storeLog = inputs => (outputData += inputs)
  console["log"] = jest.fn(storeLog)
  log.debug("message")
  expect(outputData.length).toBe(0)
})