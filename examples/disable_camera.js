// ==SE_module==
// name: camera_disabler
// description: Camera Disabler
// version: 1.0
// author: SnapEnhance
// ==/SE_module==

var hooker = require("hooker")
var im = require("interface-manager")
var config = require("config")

module.onSnapEnhanceLoad = context => {
    im.create("settings", builder => {
        builder.row(builder => {
            builder.text("Disable camera")
            builder.switch(config.getBoolean("disableCamera", false), value => {
                config.setBoolean("disableCamera", value, true)
            })
        }).spacedBy(10).fillMaxWidth()
    })
}

module.onSnapMainActivityCreate = activity => {
    var getCameraDisabledMethod = hooker.findMethodWithParameters("android.app.admin.DevicePolicyManager", "getCameraDisabled", ["android.content.ComponentName"])
    
    hooker.hook(getCameraDisabledMethod, hooker.stage.BEFORE, param => {
        var shouldDisableCamera = config.getBoolean("disableCamera") == true
        logInfo("getCameraDisabled called! shouldDisableCamera=" + shouldDisableCamera)
        if (shouldDisableCamera) {
            param.result = true
        }
    })
}
