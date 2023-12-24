// ==SE_module==
// name: IPC Test
// version: 1.0
// author: John Doe
// ==/SE_module==

var ipc = require("ipc")

module.onSnapEnhanceLoad = context => {
    ipc.on("myEvent", (args) => {
        longToast("received event: " + args)
    })
}

module.onSnapMainActivityCreate = activity => {
    ipc.emit("myEvent", "hello", 255, activity.packageName)
}