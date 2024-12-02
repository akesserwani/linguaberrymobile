import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, FlatList } from 'react-native';
import { useContext, useState, useEffect, useRef, useCallback } from 'react';

//data for context
import { CurrentLangContext } from '@/app/data/CurrentLangContext.tsx';

import * as style from '@/assets/styles/styles'
import Icon from '@expo/vector-icons/FontAwesome6'


const ExplorerHome = () => {

    //current language
    const { currentLang } = useContext(CurrentLangContext);

    // Get screen width dynamically
    const { width } = useWindowDimensions();

    // State to track the active tab
    const [activeTab, setActiveTab] = useState('Words');

    //responsive variable for container padding
    //if width is less than 600 then padding is 40, if between 600 and 1000 then padding is 100, 1k+, padding is 200
    //40 < 100 < 200
    const responsiveHorizontalPadding = width < 600 ? 20 : width < 1000 ? 100 : 200;

    return ( 
        <>
        
        <View style={[styles.mainContainer, { paddingHorizontal: responsiveHorizontalPadding }]}>


            {/* White card container that holds the content */}
            <View style={{ flex:1, backgroundColor:style.white, padding:15, borderColor:style.gray_200, borderWidth:style.border_sm, borderTopRightRadius:style.rounded_lg, borderTopLeftRadius:style.rounded_lg}}>
                {/* Top Container with Tabs - All and Bookmarks */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity onPress={() => setActiveTab('Words')} style={[styles.individualTab, activeTab === 'Words' && styles.activeTab]} activeOpacity={0.7}>
                        <Text style={[styles.tabText, activeTab === 'Words' && styles.activeTab]} >
                            Decks
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setActiveTab('Fiction')} style={[styles.individualTab, activeTab === 'Fiction' && styles.activeTab]} activeOpacity={0.7}>
                        <Text style={[styles.tabText, activeTab === 'Fiction' && styles.activeTab]} >
                            Fiction
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setActiveTab('Nonfiction')} style={[styles.individualTab, activeTab === 'Nonfiction' && styles.activeTab]} activeOpacity={0.7}>
                        <Text style={[styles.tabText, activeTab === 'Nonfiction' && styles.activeTab]} >
                            Non-fiction
                        </Text>
                    </TouchableOpacity>

                </View>


                {/* Container for The Rendered Content  */}
                <View style={{ flexDirection: 'column', flex:1, paddingHorizontal:15}} >

                    {/* Individual container */}
                    <TouchableOpacity style={[styles.wordCard, { marginBottom: 10 }]} activeOpacity={0.7}>
                        <View style={{ flexDirection: 'row', gap: 15 }}>
                            {/* Index Number for the Card */}
                            <Text style={{ color: style.gray_300, fontSize: style.text_md }}>
                                1
                            </Text>

                            {/* Title for Deck */}
                            <Text style={{ color: style.gray_500, fontWeight: '500', fontSize: style.text_md }}>
                                Deck 1
                            </Text>
                        </View>

                        {/* Word Count */}
                        <Text style={{ color: style.gray_400, fontWeight: '400' }}>
                            20 words
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

        </View>    


        </>

     );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: style.slate_100,
        paddingTop: 30,
        
    },

    tabContainer: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',

    },
    
    tabText: {
        fontSize: style.text_md,
        color: style.gray_400,
        fontWeight: "600",
        paddingVertical: 10,
        flexDirection: 'row',

    },

    individualTab:{
        width:"30%",
        borderBottomWidth: 3,
        borderBottomColor: style.gray_200,
        alignItems: 'center'
    },

    activeTab: {
        color: style.blue_500,
        borderBottomColor: style.blue_500,
        fontWeight: "600",

    },
    contentContainer: {
        paddingHorizontal: 10,
        flexDirection: 'column',
        gap: 20,
        zIndex: -1,

    },
    item: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: style.gray_200, 
        flexDirection:'row',
        justifyContent: 'space-between',
    },

    wordCard: {
        backgroundColor: style.white, 
        height: 60, 
        borderBottomColor: style.gray_200,
        borderBottomWidth: style.border_md,

        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal: 10,
    }

});

 
export default ExplorerHome;