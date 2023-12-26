// ==SE_module==
// name: friend_feed_context_menu
// displayName: Friend Feed Contex Menu Test
// version: 1.0
// author: John Doe
// ==/SE_module==

var im = require("interface-manager")
var config = require('config')

module.onSnapMainActivityCreate = () => {
    im.create("friendFeedContextMenu", (builder, args) => {
        builder.text("conversationId: " + args["conversationId"])
        builder.text("userId: " + args["userId"])

        builder.row(builder => {
            builder.text("My Switch")
            builder.switch(config.getBoolean("myBoolean", false), value => {
                config.setBoolean("myBoolean", value, true)
            })
        }).arrangement("spaceBetween").fillMaxWidth().padding(4)
    })
}