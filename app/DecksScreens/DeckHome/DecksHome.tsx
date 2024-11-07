
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useContext, useState, useEffect, useRef, useCallback } from 'react';

//data for context
import { CurrentLangContext } from '@/app/data/CurrentLangContext.tsx';

//import database functions to fetch data
import { getAllDecks } from '../DataDecks'; 

//styles and custom components
import CustomFab from '@/app/components/CustomFab';

//Import Modal component to create a deck
import CreateDeckModal from './Components/CreateDeckModal';

import * as style from '@/assets/styles/styles'
import Icon from '@expo/vector-icons/FontAwesome6'


const DecksHome = ({ navigation }) => {


    //current language
    const { currentLang, setCurrentLang } = useContext(CurrentLangContext);

    // Get screen width dynamically
    const { width } = useWindowDimensions();

    // State to track the active tab
    const [activeTab, setActiveTab] = useState('All');

    // Word data from object
    const [deckData, setDeckData] = useState([]);
    // bookmarked deck data
    const [bookmarkedDeckData, setBookmarkedDeckData] = useState([]);

    //rendered data
    //this is the data that is rendered in the dropdown
    const [ renderedData, setRenderedData ] = useState([])


    // Function to fetch decks
    const fetchDecks = () => {
        //Initialize all the data
        //call the function to get all decks
        const data = getAllDecks(currentLang); 

        //set all the deck data
        setDeckData(data);    

        //set bookmarked deck data
        const bookmarkedData = data.filter(deck => deck.bookmarked === 1);
        setBookmarkedDeckData(bookmarkedData);  

        //get the current tab then set to the rendered data
        if (activeTab === "All"){
            setRenderedData(data);
        } else if (activeTab === "Bookmarks"){
            setRenderedData(bookmarkedData);
        }
    };


    // Fetch data every time the component is focused
    useFocusEffect(
        useCallback(() => {
            fetchDecks(); // Fetch decks whenever the screen is focused
        }, [currentLang, activeTab]) // Add any dependencies if needed
    );
      

    //LOGIC TO CREATE NEW DECK
    //variable to toggle the modal
    const [newDeckModal, setnewDeckModal] = useState(false);


    // Function to scroll to the bottom, send as prop for the CreateDeckModal
    const scrollViewRef = useRef(null);
    const scrollToBottom = () => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    };
  
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
                        <Text style={{fontSize: style.text_xs }}>{'\u00A0'} ({deckData.length})</Text>
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setActiveTab('Bookmarks')} style={[styles.individualTab, activeTab === 'Bookmarks' && styles.activeTab]} activeOpacity={0.7}>
                    <Text style={[styles.tabText, activeTab === 'Bookmarks' && styles.activeTab]} >
                        Bookmarks
                        {/* Count of Bookmarks */}
                        <Text style={{fontSize: style.text_xs }}>{'\u00A0'} ({ bookmarkedDeckData.length })</Text>
                    </Text>
                </TouchableOpacity>
            </View>


            {/* Container for Individual Decks rendered as cards  */}
            <ScrollView ref={scrollViewRef} style={{ paddingTop: 30, flexDirection: 'column'  }} contentContainerStyle={{ paddingBottom: 200 }}  >

                {/* Display no decks text if deckData is empty, else render everything  */}
                {renderedData.length === 0 ? (
                    <Text style={{ color: style.gray_400, fontSize: style.text_md, textAlign: 'center', marginTop: 20 }}>
                        {activeTab === "All" ? "No decks" : "No Bookmarked decks"}
                    </Text>

                    ) : (

                    // Mapping the deck data for each individual box
                    renderedData.map((deck, index) => (
                        // Individual Deck
                        <TouchableOpacity 
                            onPress={() => navigation.navigate("UserDeck", { deckName: deck.name, deckId: deck.id })}
                            key={index}
                            style={[styles.wordCard, { marginBottom: 10 }]}
                            activeOpacity={0.7}
                        > 
                            <View style={{ flexDirection: 'row', gap: 15 }}> 
                                {/* Index Number for the Card */}
                                <Text style={{ color: style.gray_300, fontSize: style.text_md }}>
                                    {index + 1}
                                </Text>

                                {/* Title for Deck */}
                                <Text style={{ color: style.gray_500, fontWeight: '500', fontSize: style.text_md }}>
                                    {/* Render only the first 20 characters */}
                                    {deck.name.length > 20 ? `${deck.name.slice(0, 20)}...` : deck.name}
                                </Text>
                            </View>

                            {/* Word Count */}
                            <Text style={{ color: style.gray_400, fontWeight: '400' }}>
                                { deck.word_count } words
                            </Text>
                        </TouchableOpacity>
                    ))
                )}

            </ScrollView>

            {/* Add Button - Absolute positioning from bottom */}
            <CustomFab onPress={() => setnewDeckModal(true)} />
        </View>    



        {/* Modal to create a new deck */}
        { newDeckModal &&
            <CreateDeckModal onClose={() => setnewDeckModal(false)} refresh={fetchDecks} scrollToBottom={scrollToBottom} />
        }

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
        height: 60, 
        borderRadius: style.rounded_md, 
        borderColor: style.gray_200,
        borderWidth: style.border_sm,

        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal: 20,
    }

});


export default DecksHome;