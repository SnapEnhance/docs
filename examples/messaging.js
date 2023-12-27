// ==SE_module==
// name: messaging_test
// displayName: Messaging Test
// version: 1.0
// author: SnapEnhance
// ==/SE_module==

var im = require('interface-manager')
var messaging = require('messaging')

module.onSnapApplicationLoad = context => {
    im.create("conversationToolbox", (builder, args) => {
        if (!messaging.isPresent()) {
            builder.text("Messaging isn't loaded!")
            return
        }

        var text1 = builder.text("Fetching conversation...")

        messaging.fetchConversationWithMessages(args["conversationId"], (error, messageList) => {
            if (error != null) {
                text1.setAttribute("label", "Failed to fetch conversation: " + error)
                return
            }

            messageList.forEach(message => {
                logInfo("message : " + message.serialize())
            })

            text1.setAttribute("label", "This conversation has " + messageList.size() + " recent messages")
        })

        builder.button("Send Hello World", () => {
            messaging.sendChatMessage(args["conversationId"], "Hello World!", (error) => {
                if (error != null) {
                    longToast("Failed to send message: " + error)
                    return
                }

                shortToast("Message sent!")
            })
        })
    })
}