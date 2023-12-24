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
- **longToast**/**shortToast**(message: String) show a toast on the screen
```js
longToast("Hello!")
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

## Interface builder
Allows to build dynamic interface in the manager
Create a menu:
```js
im.create("settings", builder => {
  builder.text("Hello world!")
}
```

### Node
- setAttribute(key: String, value: Object) -> Node : set a custom attribute of the node
- padding(value: Integer) -> Node : set the padding of the node
- color(value: Integer) -> Node : set the color of the node
- fontSize(value: Integer) -> Node : set the font size of the node
- label(value: String) -> Node : set the label of the node

### enum Arrangement
  start
  end
  top
  bottom
  center
  spaceBetween
  spaceAround
  spaceEvenly

### enum Alignment
  start
  end
  top
  bottom
  centerVertically
  centerHorizontally

### RowColumnNode
- arrangement(value: Arrangement) -> RowColumnNode : set the arrangement of the node
- alignment(value: Alignment) -> RowColumnNode : set the alignment of the node
- spacedBy(value: Integer) -> RowColumnNode : set the spacing of the child nodes


### Builder functions: 
  - row(builderCallback) -> RowColumnNode: create a row	
  - column(builderCallback) -> RowColumnNode: create a column
  - text(content: String) -> Node : create a text view
  - switch(state: Boolean?, callback: (Boolean) -> Void) -> Node : create a switch node
  - button(label: String, callback: () -> Void) : create a button
  - slider(min: Int, max: Int, step: Int, value: Int, callback: (Integer) -> Void): create a integer slider
  - onLaunched(callback) : Trigger callback when the menu appear on the screen

Example: 
```js
im.create("settings", builder => {
  builder.text("My Title").padding(10).color(0xff000000).fontSize(20)
  
  builder.row(builder => {
    var textView = builder.text("myValue : unknown")
    builder.slider(0, 100, 50, 1, value => {
      // set the textview value
      textView.label("myValue : " + value)
    })
  }).spacedBy(10)
  
  builder.row(builder => {
    var mySwitchText = builder.text("mySwitch: unknown")
    builder.switch(false, value => {
      mySwitchText.label("mySwitch: " + switchValue)
    })
  }).arrangement("spaceBetween").alignment("centerVertically")
  
  builder.onLaunched(() => {
    longToast("menu shown!")
  })
}
```
