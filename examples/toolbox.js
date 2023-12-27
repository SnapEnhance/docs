// ==SE_module==
// name: toolbox_test
// displayName: Toolbox Test
// version: 1.0
// author: SnapEnhance
// ==/SE_module==

var im = require('interface-manager')

module.onSnapApplicationLoad = context => {
    im.create("conversationToolbox", (builder, args) => {
        builder.text("Conversation id: " + args["conversationId"])
        builder.button("Dismiss Dialog", () => {
            args["alertDialog"].dismiss()
        })
    })
}