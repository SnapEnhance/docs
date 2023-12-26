// ==SE_module==
// name: unsafe_classloader
// displayName: Unsafe classloader
// version: 1.0
// author: John Doe
// permissions: unsafe-classloader
// ==/SE_module==

var interfaces = require('java-interfaces')

module.onSnapMainActivityCreate = () => {
    type("java.lang.Thread").newInstance(
        interfaces.runnable(() => {
            try {
                var okHttpClient = type("okhttp3.OkHttpClient$Builder", true).newInstance()
                .followRedirects(false)
                .build()
    
                var response = okHttpClient.newCall(type("okhttp3.Request$Builder", true).newInstance().url("https://github.com/").build()).execute()
                logInfo("response: " + response.body().string())
            } catch (e) {
                logError(e)
            }
        })
    ).start()
}