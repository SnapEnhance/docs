// ==SE_module==
// name: alert_dialog
// displayName: Alert Dialog test
// version: 1.0
// author: John Doe
// ==/SE_module==

var interfaces = require('java-interfaces')
var im = require('interface-manager')

function getMyUserId(context) {
    var database = context.openOrCreateDatabase("arroyo.db", 0, null)
    var cursor = database.rawQuery("SELECT value FROM required_values WHERE key = 'USERID'", null)
    var userId = null

    try {
        if (cursor.moveToFirst()) {
            userId = cursor.getString(0)
        }
    } finally {
        cursor.close()
        database.close()
    }

    return userId
}


module.onSnapMainActivityCreate = activity => {
    var myUserId = getMyUserId(activity)

    activity.runOnUiThread(interfaces.runnable(() => {
        var myDialog = im.createAlertDialog(activity, (builder, dialog) => {
            builder.text("My User Id is : " + myUserId)
        })

        myDialog.show()
    }))
}
