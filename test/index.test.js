"use strict"
var rnlogs = require("../dist/index.js")

var transports = [
  require("../dist/transports/index.js").consoleSyncTransport,
  require("../dist/transports/index.js").chromeConsoleSyncTransport,
  require("../dist/transports/index.js").chromeConsoleAsyncTransport,
]

test("Module should be defined", () => {
  expect(rnlogs).toBeDefined()
  expect(rnlogs.logger).toBeDefined()
})

test("Logger should be created by createLogger", () => {
  var log = rnlogs.logger.createLogger()
  expect(log).toBeDefined()
})

test("The default log functions should be defined in all transports", () => {
  var log = rnlogs.logger.createLogger()
  expect(log.trace).toBeDefined()
  expect(log.info).toBeDefined()
  expect(log.warn).toBeDefined()
  expect(log.error).toBeDefined()
})

test("When setlevel, the getlevel should be the same", () => {
  var log = rnlogs.logger.createLogger()
  log.setLevel("info")
  expect(log.getLevel()).toBe("info")
  log.setLevel("trace")
  expect(log.getLevel()).toBe("trace")
})

test("When set higher power level then the current level, log function shoud return false", () => {
  var log = rnlogs.logger.createLogger()
  log.setLevel("info")
  expect(log.trace("message")).toBe(false)
})

test("Custom levels should be defined, even with wrong level config", () => {
  var customConfig = {
    level: "wrongLevel",
    levels: { custom: 0 },
  }
  var log = rnlogs.logger.createLogger(customConfig)
  log.setLevel("custom")
  expect(log.getLevel()).toBe("custom")
  expect(log.custom).toBeDefined()
})

test("Set wrong level config should throw error", () => {
  expect.assertions(1)
  var customConfig = {
    level: "wrongLevel",
    levels: { wrongLevel: "thisMustBeANumber" },
  }
  try {
    var log = rnlogs.logger.createLogger(customConfig)
  } catch (e) {
    expect(e.message).toMatch("react-native-logs: [wrongLevel] wrong level config")
  }
})

test("Set undefined level should throw error", () => {
  expect.assertions(1)
  var log = rnlogs.logger.createLogger()
  try {
    log.setLevel("wrongLevel")
  } catch (e) {
    expect(e.message).toMatch("react-native-logs: Level [wrongLevel] not exist")
  }
})

test("Call wrong level should throw error", () => {
  expect.assertions(1)
  var log = rnlogs.logger.createLogger()
  try {
    log.log("wrongLevel", "message")
  } catch (e) {
    expect(e.message).toMatch("react-native-logs: Level [wrongLevel] not exist")
  }
})

test("Initialize with reserved key should throw error", () => {
  expect.assertions(1)
  var customConfig = {
    level: "custom",
    levels: { custom: 0, setLevel: 1 },
  }
  try {
    var log = rnlogs.logger.createLogger(customConfig)
  } catch (e) {
    expect(e.message).toMatch("react-native-logs: [setLevel] is a reserved key, you cannot set it as custom level")
  }
})
