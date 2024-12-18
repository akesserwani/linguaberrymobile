
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";

import * as style from "@/assets/styles/styles";
import Icon from '@expo/vector-icons/FontAwesome6'

//import components
import LanguageSelection from "./LanguageSelection/LanguageSelection";
import BookmarksList from "./components/BookmarksList";

import WelcomeModal from "./components/WelcomeModal";
import React from "react";
import UpdateModal from "./components/UpdateModal";

const Home = () => {


    //While the width of the screen is mobile < 800, will render mobile features
    //If the width is > 800, render for larger screens
    const windowWidth = useWindowDimensions().width;


    return (
        <>

        <View style={{ flex: 1, backgroundColor: style.slate_100, paddingTop: 25, paddingLeft: 25, paddingRight: 25 }}>


            {/* Drop down for language selection, only render out of main container if in mobile view < 800 */}
            { windowWidth < 700 &&
                <LanguageSelection />
              }

            {/* Main White Container for Content */}
            <View style={styles.main_container}>
                {/* Top Horizontal Container with Bookmarks label and Drop Down (only if screen > 800)*/}
                <View style={{ flexDirection: 'row', paddingVertical:20, marginTop:10, justifyContent:'space-between' }}>
                    {/* Bookmarks label */}
                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center", gap:10}}>
                      <Icon name={'bookmark'} solid={true} size={15} color={style.gray_500} />
                      <Text style={{fontSize: style.text_lg, fontWeight: "600", color:style.gray_500}}>Bookmarks</Text>
                    </View>
                    {/* Dropdown if screen > 800 label */}
                    { windowWidth > 700 &&
                        <LanguageSelection />
                    }
                </View>

                {/* Main Content Here */}

                <BookmarksList />

            </View>
        </View>


        {/* Welcome Modal - toggles only once */}
        <WelcomeModal />

        {/* Update modal - will render if triggered via the API */}
        <UpdateModal />

        </>

      );
}
 
const styles = StyleSheet.create({
    main_container: {
      flex: 1,
      flexDirection: 'column',
      gap: 5,
      backgroundColor: style.white, 
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
      borderWidth: style.border_sm,
      borderBottomWidth: 0,
      borderColor: style.gray_200,
      marginTop: 20,

      //add padding to contents in container
      paddingHorizontal: 50,
    },
});
  
export default Home;