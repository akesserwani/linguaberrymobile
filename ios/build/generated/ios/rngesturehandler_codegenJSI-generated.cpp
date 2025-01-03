/**
 * This code was generated by [react-native-codegen](https://www.npmjs.com/package/react-native-codegen).
 *
 * Do not edit this file as changes may cause incorrect behavior and will be lost
 * once the code is regenerated.
 *
 * @generated by codegen project: GenerateModuleCpp.js
 */

#include "rngesturehandler_codegenJSI.h"

namespace facebook::react {

static jsi::Value __hostFunction_NativeRNGestureHandlerModuleCxxSpecJSI_handleSetJSResponder(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  static_cast<NativeRNGestureHandlerModuleCxxSpecJSI *>(&turboModule)->handleSetJSResponder(
    rt,
    count <= 0 ? throw jsi::JSError(rt, "Expected argument in position 0 to be passed") : args[0].asNumber(),
    count <= 1 ? throw jsi::JSError(rt, "Expected argument in position 1 to be passed") : args[1].asBool()
  );
  return jsi::Value::undefined();
}
static jsi::Value __hostFunction_NativeRNGestureHandlerModuleCxxSpecJSI_handleClearJSResponder(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  static_cast<NativeRNGestureHandlerModuleCxxSpecJSI *>(&turboModule)->handleClearJSResponder(
    rt
  );
  return jsi::Value::undefined();
}
static jsi::Value __hostFunction_NativeRNGestureHandlerModuleCxxSpecJSI_createGestureHandler(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  static_cast<NativeRNGestureHandlerModuleCxxSpecJSI *>(&turboModule)->createGestureHandler(
    rt,
    count <= 0 ? throw jsi::JSError(rt, "Expected argument in position 0 to be passed") : args[0].asString(rt),
    count <= 1 ? throw jsi::JSError(rt, "Expected argument in position 1 to be passed") : args[1].asNumber(),
    count <= 2 ? throw jsi::JSError(rt, "Expected argument in position 2 to be passed") : args[2].asObject(rt)
  );
  return jsi::Value::undefined();
}
static jsi::Value __hostFunction_NativeRNGestureHandlerModuleCxxSpecJSI_attachGestureHandler(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  static_cast<NativeRNGestureHandlerModuleCxxSpecJSI *>(&turboModule)->attachGestureHandler(
    rt,
    count <= 0 ? throw jsi::JSError(rt, "Expected argument in position 0 to be passed") : args[0].asNumber(),
    count <= 1 ? throw jsi::JSError(rt, "Expected argument in position 1 to be passed") : args[1].asNumber(),
    count <= 2 ? throw jsi::JSError(rt, "Expected argument in position 2 to be passed") : args[2].asNumber()
  );
  return jsi::Value::undefined();
}
static jsi::Value __hostFunction_NativeRNGestureHandlerModuleCxxSpecJSI_updateGestureHandler(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  static_cast<NativeRNGestureHandlerModuleCxxSpecJSI *>(&turboModule)->updateGestureHandler(
    rt,
    count <= 0 ? throw jsi::JSError(rt, "Expected argument in position 0 to be passed") : args[0].asNumber(),
    count <= 1 ? throw jsi::JSError(rt, "Expected argument in position 1 to be passed") : args[1].asObject(rt)
  );
  return jsi::Value::undefined();
}
static jsi::Value __hostFunction_NativeRNGestureHandlerModuleCxxSpecJSI_dropGestureHandler(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  static_cast<NativeRNGestureHandlerModuleCxxSpecJSI *>(&turboModule)->dropGestureHandler(
    rt,
    count <= 0 ? throw jsi::JSError(rt, "Expected argument in position 0 to be passed") : args[0].asNumber()
  );
  return jsi::Value::undefined();
}
static jsi::Value __hostFunction_NativeRNGestureHandlerModuleCxxSpecJSI_install(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<NativeRNGestureHandlerModuleCxxSpecJSI *>(&turboModule)->install(
    rt
  );
}
static jsi::Value __hostFunction_NativeRNGestureHandlerModuleCxxSpecJSI_flushOperations(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  static_cast<NativeRNGestureHandlerModuleCxxSpecJSI *>(&turboModule)->flushOperations(
    rt
  );
  return jsi::Value::undefined();
}

NativeRNGestureHandlerModuleCxxSpecJSI::NativeRNGestureHandlerModuleCxxSpecJSI(std::shared_ptr<CallInvoker> jsInvoker)
  : TurboModule("RNGestureHandlerModule", jsInvoker) {
  methodMap_["handleSetJSResponder"] = MethodMetadata {2, __hostFunction_NativeRNGestureHandlerModuleCxxSpecJSI_handleSetJSResponder};
  methodMap_["handleClearJSResponder"] = MethodMetadata {0, __hostFunction_NativeRNGestureHandlerModuleCxxSpecJSI_handleClearJSResponder};
  methodMap_["createGestureHandler"] = MethodMetadata {3, __hostFunction_NativeRNGestureHandlerModuleCxxSpecJSI_createGestureHandler};
  methodMap_["attachGestureHandler"] = MethodMetadata {3, __hostFunction_NativeRNGestureHandlerModuleCxxSpecJSI_attachGestureHandler};
  methodMap_["updateGestureHandler"] = MethodMetadata {2, __hostFunction_NativeRNGestureHandlerModuleCxxSpecJSI_updateGestureHandler};
  methodMap_["dropGestureHandler"] = MethodMetadata {1, __hostFunction_NativeRNGestureHandlerModuleCxxSpecJSI_dropGestureHandler};
  methodMap_["install"] = MethodMetadata {0, __hostFunction_NativeRNGestureHandlerModuleCxxSpecJSI_install};
  methodMap_["flushOperations"] = MethodMetadata {0, __hostFunction_NativeRNGestureHandlerModuleCxxSpecJSI_flushOperations};
}


} // namespace facebook::react