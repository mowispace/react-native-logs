"use strict"
var rnlogs = require("../dist/index.js")

var transport = require("../dist/transports/index.js")
  .chromeConsoleAsyncTransport

test("The log function should return true", () => {
  var log = rnlogs.logger.createLogger({ transport: transport })
  log.setLevel("trace")
  expect(log.trace("message")).toBe(true)
})

test("The log function should print string, objects, functions in console", done => {
  var log = rnlogs.logger.createLogger({ transport: transport })
  function cb1() {
    expect("called").toBe("called")
    done()
  }
  log.trace("message", cb1)
  function cb2() {
    expect("called").toBe("called")
    done()
  }
  log.trace({ message: "message" }, cb2)
  function cb3() {
    expect("called").toBe("called")
    done()
  }
  log.trace(() => {
    return true
  }, cb3)
})
