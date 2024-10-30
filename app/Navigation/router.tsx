
//import basics
import * as React from 'react';
import {  useWindowDimensions } from 'react-native'

//import provider data
import { useState } from 'react';
import { CurrentLangContext } from '@/app/data/CurrentLangContext.tsx';

//import data from the Data file
import { getCurrentLangStorage } from '../HomeScreen/LanguageSelection/DataLanguages'; 

//import navigation components
import MobileNav from './MobileNav';


const Router = () => {

    //import provider for useContext for the currentLanguage to be accessible throughout the application
    //set the language based on the variable in the local storage

    const [currentLang, setCurrentLang] = useState(getCurrentLangStorage());


    //While the width of the screen is mobile < 800, will render MobileNav
    //If the width is > 800, render SideNav for larger screens 
    const windowWidth = useWindowDimensions().width;

    return ( 
        <>
          <CurrentLangContext.Provider value={{ currentLang, setCurrentLang }} >
            <MobileNav />
          </CurrentLangContext.Provider>

        </>
      );
}
 
export default Router;