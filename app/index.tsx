
import './gesture-handler'

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { useEffect, useState } from 'react';

//import styles
import {  useFonts, Nunito_400Regular, Nunito_300Light, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
//import styles from style file 
import * as styles from '@/assets/styles/styles'

//import router
import Router from './screens/Navigation/router';
import Onboarding from './screens/Onboarding/Onboarding';

import { db } from './data/Database';


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

  //Check to see if onboarding value in the "general" table is 0
  const checkOnboarding = () => {

    let result = null;

    db.withTransactionSync(() => {
      // Query the database to get the onboarding value
      result = db.getFirstSync(`SELECT onboarding FROM general WHERE id = 1;`);
    })
  
    // Check if the result is 0 or 1
    if (result?.onboarding === 0) {
      console.log("Onboarding is set to 0 (not completed).");
      return false; // Return false if onboarding is 0
    } else {
      console.log("Onboarding is set to 1 (completed).");
      return true; // Return true if onboarding is 1
    } 

  };

  

  return (
      <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1, backgroundColor:styles.white }}>
            { checkOnboarding() ? (
              <Router />
            ) : (
              <Onboarding />
            )}

          </SafeAreaView>
      </SafeAreaProvider>

  );
}

