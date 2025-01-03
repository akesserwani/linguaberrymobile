/**
 * Automatically generated by expo-modules-autolinking.
 *
 * This autogenerated class provides a list of classes of native Expo modules,
 * but only these that are written in Swift and use the new API for creating Expo modules.
 */

import ExpoModulesCore
import Expo
import ExpoAsset
import EXAV
import ExpoClipboard
import EXConstants
import ExpoFileSystem
import ExpoFont
import ExpoKeepAwake
import ExpoLinking
import ExpoLocalization
import ExpoHead
import ExpoScreenOrientation
import ExpoSplashScreen
import ExpoSQLite
import ExpoSystemUI
import ExpoWebBrowser
#if EXPO_CONFIGURATION_DEBUG
import EXDevLauncher
import EXDevMenu
#endif

@objc(ExpoModulesProvider)
public class ExpoModulesProvider: ModulesProvider {
  public override func getModuleClasses() -> [AnyModule.Type] {
    #if EXPO_CONFIGURATION_DEBUG
    return [
      ExpoFetchModule.self,
      AssetModule.self,
      VideoViewModule.self,
      ClipboardModule.self,
      ConstantsModule.self,
      FileSystemModule.self,
      FileSystemNextModule.self,
      FontLoaderModule.self,
      KeepAwakeModule.self,
      ExpoLinkingModule.self,
      LocalizationModule.self,
      ExpoHeadModule.self,
      ScreenOrientationModule.self,
      SplashScreenModule.self,
      SQLiteModule.self,
      ExpoSystemUIModule.self,
      WebBrowserModule.self,
      DevLauncherInternal.self,
      DevLauncherAuth.self,
      RNCSafeAreaProviderManager.self,
      DevMenuModule.self,
      DevMenuInternalModule.self,
      DevMenuPreferences.self,
      RNCSafeAreaProviderManager.self
    ]
    #else
    return [
      ExpoFetchModule.self,
      AssetModule.self,
      VideoViewModule.self,
      ClipboardModule.self,
      ConstantsModule.self,
      FileSystemModule.self,
      FileSystemNextModule.self,
      FontLoaderModule.self,
      KeepAwakeModule.self,
      ExpoLinkingModule.self,
      LocalizationModule.self,
      ExpoHeadModule.self,
      ScreenOrientationModule.self,
      SplashScreenModule.self,
      SQLiteModule.self,
      ExpoSystemUIModule.self,
      WebBrowserModule.self
    ]
    #endif
  }

  public override func getAppDelegateSubscribers() -> [ExpoAppDelegateSubscriber.Type] {
    #if EXPO_CONFIGURATION_DEBUG
    return [
      FileSystemBackgroundSessionHandler.self,
      LinkingAppDelegateSubscriber.self,
      ExpoHeadAppDelegateSubscriber.self,
      ScreenOrientationAppDelegate.self,
      SplashScreenAppDelegateSubscriber.self,
      ExpoDevLauncherAppDelegateSubscriber.self
    ]
    #else
    return [
      FileSystemBackgroundSessionHandler.self,
      LinkingAppDelegateSubscriber.self,
      ExpoHeadAppDelegateSubscriber.self,
      ScreenOrientationAppDelegate.self,
      SplashScreenAppDelegateSubscriber.self
    ]
    #endif
  }

  public override func getReactDelegateHandlers() -> [ExpoReactDelegateHandlerTupleType] {
    #if EXPO_CONFIGURATION_DEBUG
    return [
      (packageName: "expo-screen-orientation", handler: ScreenOrientationReactDelegateHandler.self),
      (packageName: "expo-dev-launcher", handler: ExpoDevLauncherReactDelegateHandler.self),
      (packageName: "expo-dev-menu", handler: ExpoDevMenuReactDelegateHandler.self)
    ]
    #else
    return [
      (packageName: "expo-screen-orientation", handler: ScreenOrientationReactDelegateHandler.self)
    ]
    #endif
  }

  public override func getAppCodeSignEntitlements() -> AppCodeSignEntitlements {
    return AppCodeSignEntitlements.from(json: #"{}"#)
  }
}
