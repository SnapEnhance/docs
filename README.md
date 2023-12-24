# Scripting Documentation
Hello! Here is the long awaited Documentation for the Scripting Engine.<br> 
Contributions and improvements to this Documentation are gladly accepted via PRs. <br>
In case of any questions, feel free to ask via opening an issue or asking on our Telegram Discussions Chat.

## Script Header

Every script written for the Scripting Engine must include a header section at the beginning of the file. The header follows a specific format, as shown below:
```
// ==SE_module==
// name: Script Name
// description: Script description
// version: 1.0
// author: Author
// ==/SE_module==
```
The following fields are required: `name`, `version`<br>
Additionally, there are also optional fields available which are: `description`, `author`, `minSnapchatVersion`, `minSEVersion`, `grantedPermissions`

### Field Description

`name`: Descriptive name for the script.<br>
`author`: Name of the script's creator.<br>
`version`: Version number of the script (e.g., 1.0).<br>
`description`: Brief explanation of the script's functionality.<br>
`minSnapchatVersion`: Minimum required Snapchat version code (e.g., 106822).<br>
`minSEVersion`: Minimum required SnapEnhance version code (e.g., ).<br>
`grantedPermissions`: -

## Examples
To start off, you can find a couple of Example scripts written by us [here](https://github.com/SnapEnhance/docs/tree/main/examples).

### `disable_camera.js`<br>
This scripts main function is, as probably recognizable by the name, to disable the camera.<br>
Conveniently enough, Android offers a great way to do this by using [`getCameraDisabled`](https://developer.android.com/reference/android/app/admin/DevicePolicyManager#getCameraDisabled(android.content.ComponentName)).
```js
var getCameraDisabledMethod = hooker.findMethodWithParameters("android.app.admin.DevicePolicyManager", "getCameraDisabled", ["android.content.ComponentName"])

hooker.hook(getCameraDisabledMethod, hooker.stage.BEFORE, param => {
    param.result = true
})
```
It does this by hooking `getCameraDisabled` in the `android.app.admin.DevicePolicyManager` class and making Snapchat believe the camera is disabled by always returning true.

### `simple_ipc.js`
This script is supposed to demonstrate the use of IPC Events.<br>
It simply emits an IPC Event with specific arguments.<br>
```js
module.onSnapMainActivityCreate = activity => {
    ipc.emit("myEvent", "hello", 255, activity.packageName)
}
```
Which then can get received by other scripts or functions using listeners.
```js
module.onSnapEnhanceLoad = context => {
    ipc.on("myEvent", (args) => {
        longToast("received event: " + args)
    })
}
```

### `toast.js`
This script demonstrates the use of Toast messages, these can be useful to debug or transmit information to the user.
```js
module.onSnapMainActivityCreate = context => {
    longToast("Snapchat opened!")
}

module.onUnload = () => {
    shortToast("Script unloaded!")
}
```
Please note that in most cases a context is required.
