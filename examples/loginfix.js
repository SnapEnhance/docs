// ==SE_module==
// name: login_fix
// displayName: Login Fix 
// description: Fix login for devices that flags on COF
// version: 1.0
// author: rhunk
// ==/SE_module==

module.onSnapApplicationLoad = context => {
    const hooker = require('hooker')
    const config = require('config')
    
    function t(context) {
        const classLoader = context.getClassLoader()
    
        const baseDexClassLoaderClass = findClass("dalvik.system.BaseDexClassLoader")
        const pathListField = baseDexClassLoaderClass.getDeclaredField("pathList")
        pathListField.setAccessible(true)
    
        const dexPathList = pathListField.get(classLoader)
        const dexElements = getField(dexPathList, "dexElements");
    
        for (let i = 0; i < 1; i++) {
            const element = dexElements[i];
            const dexFile = getField(element, "dexFile");
            const entries = getField(dexFile.entries(), "mNameList")
    
            for (let entry of entries) {
                try {
                    let c = classLoader.loadClass(entry)
                    if (c == null || getField(c, "superClass").getName() != "java.lang.Object") continue
                    let methods = c.getMethods()
        
                    for (let method of methods) {
                        if (method.getParameterCount() < 6 || method.getReturnType().getName() != "io.reactivex.rxjava3.core.Single") continue
        
                        let params = method.getParameterTypes()
                        if (params[0].getName() != "java.lang.String") continue
                        if (!params[1].isEnum()) continue
                        if (params[2].getName() != "java.util.List") continue
    
                        return {
                            class: c.getName(),
                            method: method.getName()
                        }
                    }
                } catch (e) {
                    logInfo("Error: " + e)
                }
            }
        }
    }

    let versionCode = context.getPackageManager().getPackageInfo(context.getPackageName(), 0).versionCode

    if (config.get("versionCode") != versionCode) {
        config.set("loginMethod", null, true)
        config.set("versionCode", versionCode, true)
    }

    hooker.hookAllMethods(findClass("com.snap.identity.loginsignup.ui.LoginSignupActivity"), "onCreate", hooker.stage.BEFORE, () => {
        let loginMethod = null
        try {
            loginMethod = JSON.parse(config.get("loginMethod"))
        } catch (e) {
            logInfo("Error: " + e)
        }

        if (loginMethod == null) {
            loginMethod = t(context)
        }

        config.set("loginMethod", JSON.stringify(loginMethod), true)
        
        if (loginMethod == null) {
            shortToast("Could not find login method!")
            return
        }

        hooker.hookAllMethods(loginMethod.class, loginMethod.method, hooker.stage.BEFORE, methodParams => {
            methodParams.setArg(5, "")
            shortToast("Bypassed login check!" + loginMethod.method.toString())
        })
    })
}
