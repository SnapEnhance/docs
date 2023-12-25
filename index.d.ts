declare interface Class<T> {
    getName(): string;
}

declare interface JavaType {
    newInstance(...args: any[]): any;
}

declare function logInfo(message: any);
declare function logError(message: any, throwable?: any);

declare function shortToast(...messages: string);
declare function longToast(...messages: string);

declare function type(className: string): JavaType | undefined;
declare function findClass(className: string): Class<any> | undefined;
declare function setField(instance: any, fieldName: string, value: any | undefined): void;
declare function getField(instance: any, fieldName: string): any | undefined;

declare module "hooker" {
    enum stage {
        BEFORE = "before",
        AFTER = "after"
    }

    interface ScriptHookCallback {
        result: any;
        readonly thisObject: any;
        readonly method: Member;
        readonly args: any[];

        cancel(): void;
        arg(index: number): any;
        setArg(index: number, value: any): void;
        invokeOriginal(): void;
        invokeOriginal(args: any[]): void;
        toString(): string;
    }

    declare type HookCallback = (scriptHookCallback: ScriptHookCallback) => void;
    declare type HookUnhook = () => void;
    
    function findMethod(clazz: Class<any>, methodName: string): Member | undefined;
    function findMethodWithParameters(clazz: Class<any>, methodName: string, types: string[]): Member | undefined;
    function findMethod(className: string, methodName: string): Member | undefined;
    function findMethodWithParameters(className: string, methodName: string, types: string[]): Member | undefined;
    function findConstructor(clazz: Class<any>, types: string[]): Member | undefined;
    function findConstructorParameters(className: string, types: string[]): Member | undefined;

    function hook(method: Member, stage: stage, callback: HookCallback): HookUnhook;
    function hookAllMethods(clazz: Class<any>, methodName: string, stage: stage, callback: HookCallback): HookUnhook;
    function hookAllConstructors(clazz: Class<any>, stage: stage, callback: HookCallback): HookUnhook;
    function hookAllMethods(className: string, methodName: string, stage: stage, callback: HookCallback): HookUnhook | undefined;
    function hookAllConstructors(className: string, stage: stage, callback: HookCallback): HookUnhook | undefined;
}

declare module "config" {
    function get(key: string): string | undefined;
    function get(key: string, defaultValue: any): string;

    function getInteger(key: string): number | undefined;
    function getInteger(key: string, defaultValue: number): number;

    function getDouble(key: string): number | undefined;
    function getDouble(key: string, defaultValue: number): number;

    function getBoolean(key: string): boolean | undefined;
    function getBoolean(key: string, defaultValue: boolean): boolean;

    function getLong(key: string): number | undefined;
    function getLong(key: string, defaultValue: number): number | undefined;

    function getFloat(key: string): number | undefined;
    function getFloat(key: string, defaultValue: number): number | undefined;

    function getByte(key: string): number | undefined;
    function getByte(key: string, defaultValue: number): number | undefined;

    function getShort(key: string): number | undefined;
    function getShort(key: string, defaultValue: number): number | undefined;

    function set(key: string, value: any): void;
    function set(key: string, value: any, save: boolean): void;

    function setInteger(key: string, value: number): void;
    function setInteger(key: string, value: number, save: boolean): void;

    function setDouble(key: string, value: number): void;
    function setDouble(key: string, value: number, save: boolean): void;

    function setBoolean(key: string, value: boolean): void;
    function setBoolean(key: string, value: boolean, save: boolean): void;

    function setLong(key: string, value: number): void;
    function setLong(key: string, value: number, save: boolean): void;

    function setFloat(key: string, value: number): void;
    function setFloat(key: string, value: number, save: boolean): void;

    function setByte(key: string, value: number): void;
    function setByte(key: string, value: number, save: boolean): void;

    function setShort(key: string, value: number): void;
    function setShort(key: string, value: number, save: boolean): void;

    function save(): void;
    function load(): void;
    function deleteConfig(): void;
}

declare module "interface-manager" {
    type BuilderCallback = (builder: InterfaceBuilder) => void

    interface Node {
        setAttribute(key: string, value: any | undefined): void
        fillMaxWidth(): Node
        fillMaxHeight(): Node
        label(text: string): Node
        padding(padding: number): Node
        fontSize(size: number): Node
        color(color: number): Node
    }

    interface RowColumnNode extends Node {
        arrangement(arrangement: string): RowColumnNode
        alignment(alignment: string): RowColumnNode
        spacedBy(spacing: number): RowColumnNode
    }

    interface InterfaceBuilder {
        onDispose(callback: (() => void)): void;
        onLaunched(callback: (() => void)): void;
        onLaunched(key: any, callback: (() => void));
        row(callback: BuilderCallback): RowColumnNode;
        column(callback: BuilderCallback): RowColumnNode;
        text(label: string): Node;
        switch(state: boolean | undefined, onChange: ((state: boolean) => void)): Node;
        button(label: string, onClick: (() => void)): Node;
        slider(min: number, max: number, step: number, value: number, onChange: ((value: number) => void)): Node;
        list(label: string, items: string[], onClick: ((index: number) => void)): Node;
    }

    function create(name: string, callback: BuilderCallback): void;
}

declare module "ipc" {
    type Listener = (args: any[]) => void;

    function on(channel: string, listener: Listener): void;
    function onBroadcast(channel: string, listener: Listener): void;

    function emit(eventName: string): void;
    function emit(eventName: string, ...args: any[]): void;
    function broadcast(channel: string, eventName: string): void;
    function broadcast(channel: string, eventName: string, ...args: any[]): void;
}

declare const currentSide: "core" | "manager";

declare namespace module {
    interface ModuleInfo {
        readonly name: string;
        readonly displayName: string;
        readonly version: string;
        readonly description: string | undefined;
        readonly author: string | undefined;
        readonly minSnapchatVersion: number | undefined;
        readonly minSEVersion: number | undefined;
        readonly grantedPermissions: string[];
    }

    let exports: any | undefined;

    const info: ModuleInfo;

    // SnapEnhance side
    let onSnapEnhanceLoad: ((context: any) => void) | undefined;

    // Snapchat side
    let onSnapApplicationLoad: ((context: any) => void) | undefined;
    let onSnapMainActivityCreate: ((activity: any) => void) | undefined;

    let onUnload: (() => void) | undefined;
}
