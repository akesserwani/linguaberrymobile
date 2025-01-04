
import './gesture-handler'

import { StatusBar, StyleSheet  } from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

//import styles
import {  useFonts, Nunito_400Regular, Nunito_300Light, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';

//import router
import Router from './screens/Navigation/router';
import { NavigationContainer } from '@react-navigation/native';


//Main Entry Point 
export default function App() {
  const insets = useSafeAreaInsets(); // Get safe area insets
  
  //load the fonts
  let [fontsLoaded] = useFonts({
    Nunito_300Light,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold
  });
  if (!fontsLoaded) {
    return null;
  }


  return (

        <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <StatusBar backgroundColor="#ffffff" barStyle='dark-content'></StatusBar>
            <SafeAreaProvider >
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
    flex:1,
    backgroundColor:'white'
  },
});
