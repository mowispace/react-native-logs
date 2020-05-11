"use strict"
var rnlogs = require("../dist/index.js")

var transport = require("../dist/transports/consoleSync.js").consoleSync;

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

test("When set transportOptions={hideDate:false, hideLevel:false} and empty msg, should not print in console", () => {
  var log = rnlogs.logger.createLogger({ transport: transport, transportOptions:{ hideDate:true, hideLevel:true } })
  var outputData = ""
  var storeLog = inputs => (outputData += inputs)
  console["log"] = jest.fn(storeLog)
  log.debug("")
  expect(outputData).toBe("")
})

test("When set transportOptions={dateFormat:'utc'}, should output toUTCString dateformat", () => {
  var log = rnlogs.logger.createLogger({ transport: transport, transportOptions:{ dateFormat:'utc' } })
  var outputData = ""
  var storeLog = inputs => (outputData += inputs)
  console["log"] = jest.fn(storeLog)
  log.debug("message")
  var pattern = /\d\d:\d\d:\d\d GMT \| DEBUG \| message$/
  expect(outputData).toMatch(pattern)
})

test("When set transportOptions={dateFormat:'iso'}, should output toISOString dateformat", () => {
  var log = rnlogs.logger.createLogger({ transport: transport, transportOptions:{ dateFormat:'iso' } })
  var outputData = ""
  var storeLog = inputs => (outputData += inputs)
  console["log"] = jest.fn(storeLog)
  log.debug("message")
  var pattern = /T\d\d:\d\d:\d\d\.\d\d\dZ \| DEBUG \| message$/
  expect(outputData).toMatch(pattern)
})

test("The log function should print expected output", () => {
  var log = rnlogs.logger.createLogger({ transport: transport, transportOptions:{ hideDate:true } })
  var outputData = ""
  var storeLog = inputs => (outputData += inputs)
  console["log"] = jest.fn(storeLog)
  log.debug("message") 
  var levelTxt = `DEBUG | `
  var outputExp = `${levelTxt}message`
  expect(outputData).toBe(outputExp)
})
