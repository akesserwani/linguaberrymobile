
//import basics
import * as React from 'react';
import {  useWindowDimensions } from 'react-native'

//import provider data
import { useState } from 'react';
import { CurrentLangContext } from '@/assets/data/data';

//import navigation components
import MobileNav from './MobileNav';

const Router = () => {

    //import provider for useContext for the currentLanguage to be accessible throughout the application
    const [currentLang, setCurrentLang] = useState("Spanish");


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