
import './gesture-handler'

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


//import styles
import {  useFonts, Nunito_400Regular, Nunito_300Light, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
//import styles from style file 
import * as styles from '@/assets/styles/styles'

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
      <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1, backgroundColor:styles.white }}>
            <Router />
          </SafeAreaView>
      </SafeAreaProvider>

  );
}

