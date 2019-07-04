"use strict"
var rnlogs = require("../dist/index.js")

var transport = require("../dist/transports/index.js")
  .chromeConsoleAsyncTransport

test("The log function should return true", () => {
  var log = rnlogs.logger.createLogger({ transport: transport })
  log.setLevel("trace")
  expect(log.trace("message")).toBe(true)
})

test("The log function should print string console", done => {
  var log = rnlogs.logger.createLogger({ transport: transport })
  function cb() {
    expect("called").toBe("called")
    done()
  }
  log.trace("message", cb)
})

test("The log function should print functions console", done => {
  var log = rnlogs.logger.createLogger({ transport: transport })
  function cb() {
    expect("called").toBe("called")
    done()
  }
  log.trace(() => {
    return true
  }, cb)
})

test("The log function should print objects console", done => {
  var log = rnlogs.logger.createLogger({ transport: transport })
  function cb() {
    expect("called").toBe("called")
    done()
  }
  log.trace({ message: "message" }, cb)
})
