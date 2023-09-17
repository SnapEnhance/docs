## Script header

```
// ==SE_module==
// name: Your module name
// description: Your module description
// version: 1.0
// author: You
// ==/SE_module==
```

## Global scope
- **logInfo** (*messages*: ObjectArray)
```js
logInfo("hello", 14, false)
```
- **type** (className: String) gives an interface for static method calls, static fields and instantiation
```js
var logObject = type("android.util.Log").newInstance()
logInfo(logObject) // prints "android.util.Log@000000"
type("java.lang.System").out.println("Hello!") // prints "Hello!"
```
- **findClass** (className: String) returns a java.lang.Class for a given class name
```js
logInfo(findClass("java.lang.System")) // prints "class java.lang.System"
```


## Execution sides

```js
module.onManagerLoad = () => {
  // run code when manager context is started
}

module.onSnapActivity = () => {
  // run code when the main snapchat activity is created
}

```

## IPC
#### Pass event through any execution side

```js
module.onManagerLoad = () => {
  // declare event in manager side
  ipc.on("hello", args => {
    logInfo("Got event from snapchat app! arguments: ", args)
  })
}

module.onSnapActivity = () => {
  // send event to the manager from the snapchat app
  ipc.emit("hello", 1337)
}

```

#### Pass events between other installed scripts

- *script1.js*

```js
module.onManagerLoad = () => {
  ipc.onBroadcast("mychannel", "eventA", (args) => {
    logInfo("eventA called from script1.js => " + args)
  })  
}
```

- *script2.js*
```js
module.onManagerLoad = () => {
  ipc.onBroadcast("mychannel", "eventA", (args) => {
    logInfo("eventA called from script2.js => " + args)
    ipc.broadcast("mychannel", "eventC", "hello")
  })
}
```

- *script3.js*

```js
module.onSnapActivity = () => {
  ipc.onBroadcast("mychannel", "eventC", (args) => {
    logInfo("eventC called from script3.js => " + args)
  })
  // channel, eventName, data
  ipc.broadcast("mychannel", "eventA", "hi")
}
```

result (android logcat)

```
eventA called from script1.js => hi
eventA called from script2.js => hi
eventC called from script3.js => hello
```

## Hooks

### types
- enum HookStage is a string value of "before" or "after"

- class HookCallback : 
	- properties
		- getter/setter result: Object
		- getter thisObject: Object
		- getter method: JavaMember
		- getter args: ObjectArray
	- functions
		- cancel()
		- arg(index: Integer)
		- setArg(index: Integer, value: Object)
		- invokeOriginal()
		- invokeOriginal(args: ObjectArray)
		
- function HookUnhook unhooks hooked members

### public interface
- Find members
	- findMethod (class: JavaClass, methodName: String) => Member
	- findMethod (className: String, methodName: String) => Member
	- findMethodWithParameters (class: JavaClass, methodName: String, types: StringArray) => Member
	- findMethodWithParameters (className: String, methodName: String, types: StringArray) => Member
	- findConstructor (class: JavaClass, types: StringArray) => Member
	- findConstructor (className: String, types: StringArray) => Member

- Hook members
	- hook (member: JavaMember, stage: HookStage, callback: HookCallback) => HookUnhook
	- hookAllMethods (class: JavaClass, methodName: String, stage: HookStage, callback: HookCallback) => HookUnhook
	- hookAllMethods (className: String, methodName: String, stage: HookStage, callback: HookCallback) => HookUnhook
	- hookAllConstructors (class: JavaClass, stage: HookStage, callback: HookCallback) => HookUnhook
	- hookAllConstructors (className: String, stage: HookStage, callback: HookCallback) => HookUnhook

### Example
```js
module.onSnapActivity = () => {
  hooker.hookAllConstructors("com.snapchat.client.messaging.Message", "before", callback => {
    logInfo("Message constructor " + callback.thisObject)
  })

  val hookerUnhook = hooker.hook(
    hooker.findMethod("com.snapchat.client.network_api.NetworkApi$CppProxy", "submit"), 
    "before", 
    (callback) => {
      logInfo("NetworkApi submit " + callback.arg(0))
    }
  )

  // unhook when needed using this call
  hookerUnhook();
}
```
