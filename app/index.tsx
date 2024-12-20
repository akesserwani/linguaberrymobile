
import './gesture-handler'

import { StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

//import styles
import {  useFonts, Nunito_400Regular, Nunito_300Light, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';

//import router
import Router from './screens/Navigation/router';


//Main Entry Point 
export default function App() {


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
    <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar backgroundColor="white"/>

        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor:"#FFFFFF" }}>
              <Router />
            </SafeAreaView>
        </SafeAreaProvider>

        

      </GestureHandlerRootView>

  );
}

