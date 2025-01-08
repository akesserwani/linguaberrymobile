import "./gesture-handler";

import { Appearance, StyleSheet, useColorScheme, Dimensions, View, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView, useSafeAreaFrame } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

//import styles
import {
  useFonts,
  Nunito_400Regular,
  Nunito_300Light,
  Nunito_600SemiBold,
  Nunito_700Bold,
} from "@expo-google-fonts/nunito";

import { StatusBar } from "expo-status-bar";
//import router
import Router from "./screens/Navigation/router";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { useEffect } from "react";

//Main Entry Point
export default function App() {


  const colorScheme = useColorScheme();
  useEffect(() => {
    Appearance.addChangeListener(({ colorScheme }) => {
      Appearance.setColorScheme('light');
    });
  }, []);

  //load the fonts
  let [fontsLoaded] = useFonts({
    Nunito_300Light,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });
  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <StatusBar backgroundColor="#ffffff" style={"dark"} />
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeArea}>
          <NavigationContainer>
            <Router />
          </NavigationContainer>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>

  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
});
