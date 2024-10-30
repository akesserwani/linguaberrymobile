

import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useContext, useState } from 'react';

//data for context
import { CurrentLangContext } from '@/app/data/CurrentLangContext.tsx';

//styles and custom components
import CustomButton from '../components/CustomButton';
import CustomFab from '../components/CustomFab';
import CustomModal from '../components/CustomModal';
import CustomInput from '../components/CustomInput';

import * as style from '@/assets/styles/styles'
import Icon from '@expo/vector-icons/FontAwesome6'


const DecksHome = ({ navigation }) => {


    //current language
    const { currentLang, setCurrentLang } = useContext(CurrentLangContext);

    // Get screen width dynamically
    const { width } = useWindowDimensions();

    // State to track the active tab
    const [activeTab, setActiveTab] = useState('All');


    //word data from object
    const deckData = {
        'Deck 1': [36],
        'Deck 2': [37],
        'Deck 3': [38],
        'Deck 4': [38],
        'Deck 5': [38],
        'Deck 6': [38],
        'Deck 7': [38],
        'Deck 8': [38],
        'Deck 9': [38],
        'Deck 10': [38]
    }


    //LOGIC TO CREATE NEW DECK
    //variable to toggle the modal
    const [newDeckModal, setnewDeckModal] = useState(false);

    //fab action
    const newDeck = () =>{
        console.log("Hello world - creating new deck");
    }


    //responsive variable for container padding
    //if width is less than 600 then padding is 40, if between 600 and 1000 then padding is 100, 1k+, padding is 200
    //40 < 100 < 200
    const responsiveHorizontalPadding = width < 600 ? 40 : width < 1000 ? 100 : 200;

    return ( 
        <>
        <View style={[styles.mainContainer, { paddingHorizontal: responsiveHorizontalPadding }]}>
            {/* Top Container with Tabs - All and Bookmarks */}
            <View style={styles.tabContainer}>
                <TouchableOpacity onPress={() => setActiveTab('All')} style={[styles.individualTab, activeTab === 'All' && styles.activeTab]} activeOpacity={0.7}>
                    <Text style={[styles.tabText, activeTab === 'All' && styles.activeTab]} >
                        All

                        {/* Count of All */}
                        <Text style={{fontSize: style.text_xs, marginLeft: 5 }}>(16)</Text>
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setActiveTab('Bookmarks')} style={[styles.individualTab, activeTab === 'Bookmarks' && styles.activeTab]} activeOpacity={0.7}>
                    <Text style={[styles.tabText, activeTab === 'Bookmarks' && styles.activeTab]} >
                        Bookmarks

                        {/* Count of Bookmarks */}
                        <Text style={{fontSize: style.text_xs, marginLeft: 5}}>(16)</Text>
                    </Text>
                </TouchableOpacity>
            </View>


            {/* Container for Individual Decks rendered as cards  */}
            <ScrollView style={{ paddingTop: 30, paddingBottom: 150, flexDirection: 'column'  }} >

                {/* Mapping the deck data for each individual box */}
                {Object.entries(deckData).map(([deckName, words], index) => (
                    // {/* Individual Deck */}
                    <TouchableOpacity onPress={ ()=> navigation.navigate("UserDeck") } key={index} style={[styles.wordCard, { marginBottom: 10 }]} activeOpacity={0.7}> 
                        <View style={{ flexDirection: 'row', gap:15 }}> 
                                    {/* Index Number for the Card */}
                            <Text style={{color: style.gray_300, fontSize: style.text_md,}}>
                                {index + 1}
                            </Text>

                            {/* Title for Deck */}
                            <Text style={{color: style.gray_500, fontWeight: '500', fontSize: style.text_md,}}>
                                {deckName}
                            </Text>
                        </View>

                        {/* Word Count */}
                        <Text style={{color: style.gray_400, fontWeight: '400'}}>
                            { words[0] } words
                        </Text>
                    </TouchableOpacity>
                ))}

            </ScrollView>

            {/* Add Button - Absolute positioning from bottom */}
            <CustomFab onPress={newDeck} />
        </View>    



        {/* Modal to create a new deck */}
        <CustomModal title='New Deck' onClose={()=>{}} >
                <CustomInput label={ "Deck name"} placeholder={"Type deck name here..." }/>
                

        </CustomModal>


        </>
    );
}
 


const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: style.slate_100,
        paddingTop: 30
        
    },
    tabContainer: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',
    },
    
    tabText: {
        fontSize: style.text_md,
        color: style.gray_400,
        fontWeight: "500",
        paddingVertical: 10,
        flexDirection: 'row',
    },

    individualTab:{
        width:"50%",
        borderBottomWidth: 3,
        borderBottomColor: style.gray_200,
        alignItems: 'center'
    },

    activeTab: {
        color: style.blue_500,
        borderBottomColor: style.blue_500,
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
        height: 70, 
        borderRadius: style.rounded_md, 
        borderColor: style.gray_200,
        borderWidth: style.border_md,

        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal: 20,
    }

});


export default DecksHome;