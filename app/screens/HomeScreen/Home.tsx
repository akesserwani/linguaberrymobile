
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";

import * as style from "@/assets/styles/styles";
import Icon from '@expo/vector-icons/FontAwesome6'

//import components
import LanguageSelection from "./LanguageSelection/LanguageSelection";
import BookmarksList from "./components/BookmarksList";


import WelcomeModal from "./components/WelcomeModal";
import React from "react";
import UpdateModal from "./components/UpdateModal";
import ActionButton from "./components/ActionButton";

const Home = () => {


    //While the width of the screen is mobile < 800, will render mobile features
    //If the width is > 800, render for larger screens
    const width = useWindowDimensions().width;

    //responsive variable for container padding
    //if width is less than 600 then padding is 20, if between 600 and 1000 then padding is 100, 1k+, padding is 200
    //padding: 40 < 100 < 200
    //width: 600 < 1000 < x 
    const responsiveHorizontalPadding = width < 600 ? 20 : width < 1000 ? 100 : 120;

    return (
        <>

        <View style={{ flex: 1, backgroundColor: style.slate_100, paddingTop: 25, paddingHorizontal:responsiveHorizontalPadding, flexDirection:'column', gap:20 }}>

            {/* Drop down for language selection, only render out of main container if in mobile view < 800 */}
              <LanguageSelection />

            {/* Main White Container for Content */}
            <View style={styles.main_container}>
                {/* Top Horizontal Container with Bookmarks label and Drop Down (only if screen > 800)*/}
                <View style={{ flexDirection: 'row', paddingVertical:20, paddingHorizontal:40, marginTop:10, justifyContent:'space-between' }}>
                    {/* Bookmarks label */}
                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center", gap:10}}>
                      <Icon name={'bookmark'} solid={true} size={15} color={style.gray_500} />
                      <Text style={{fontSize: style.text_lg, fontWeight: "600", color:style.gray_500}}>Bookmarks</Text>
                    </View>
                </View>

                {/* Main Content Here */}

                <BookmarksList />
                
                {/* Practice Buttons */}
                {/* <ActionButton /> */}

            </View>
        </View>


        {/* Welcome Modal - toggles only once */}
        <WelcomeModal />

        {/* Update modal - will render if triggered via the API */}
        {/* <UpdateModal /> */}
        </>

      );
}
 
const styles = StyleSheet.create({
    main_container: {
      flex: 1,
      flexDirection: 'column',
      gap: 5,
      backgroundColor: 'white', 
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
      borderWidth: style.border_md,
      borderBottomWidth: 0,
      borderColor: style.gray_200,
    },
});
  
export default Home;