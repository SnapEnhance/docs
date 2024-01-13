// ==SE_module==
// name: toasts
// displayName: Toasts
// description: Shows various toast messages
// version: 1.0
// author: John Doe
// ==/SE_module==

module.onSnapMainActivityCreate = activity => {
    shortToast("Snapchat opened!")
}

module.onSnapApplicationLoad = context => {
    shortToast("Snapchat loaded!")
}

module.onSnapEnhanceLoad = context => {
    shortToast("SnapEnhance loaded!")
}

module.onUnload = () => {
    shortToast("Script unloaded!")
}
