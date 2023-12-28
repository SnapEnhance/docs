// ==SE_module==
// name: networking_test
// displayName: Networking Test
// version: 1.0
// author: SnapEnhance
// ==/SE_module==

var networking = require('networking')
var interfaces = require('java-interfaces')

module.onSnapMainActivityCreate = activity => {
    var targetUrl = "https://example.com"

    // async request

    networking.enqueue(networking.newRequest().url(targetUrl), (error, response) => {
        if (error != null) {
            logInfo("Failed to make request: " + error)
            return
        }
        logInfo("ContentType : " + response.getHeader("Content-Type"))
        logInfo("Response: " + response.bodyAsString)
    })

    // sync request in background thread

    type("java.lang.Thread").newInstance(
        interfaces.runnable(() => {
            var response = networking.execute(networking.newRequest().url(targetUrl))
            logInfo("Response: " + response.bodyAsString)
        })
    ).start()

    // websocket 
    
    networking.newWebSocket(networking.newRequest().url("wss://echo.websocket.org"), {
        onOpen: (ws, response) => {
            logInfo("WebSocket open: " + response.statusMessage)
            ws.send("Hello")
        },
        onMessageText: (ws, text) => {
            logInfo("message: " + text)
        },
        onMessageBytes: (ws, bytes) => {
            logInfo("message bytes: " + bytes)
        },
        onClosing: (ws, code, reason) => {
            logInfo("Closing: " + code + " " + reason)
        },
    })
}
