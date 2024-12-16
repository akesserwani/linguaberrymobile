import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, FlatList, Alert } from 'react-native';
import { useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';

//data for context
import { CurrentLangContext } from '@/app/data/CurrentLangContext.tsx';

import * as style from '@/assets/styles/styles'
import Icon from '@expo/vector-icons/FontAwesome6'

//import data file
import {wordFiles, storyFiles} from './ExplorerData';

import CustomAlert from '@/app/components/CustomAlert';

//import components
import ViewWordModal from '../../components/ViewWordModal';

const ExplorerHome = () => {

    //current language
    const { currentLang } = useContext(CurrentLangContext);

    //Navigation variable
    const navigation = useNavigation();

    // Get screen width dynamically
    const { width } = useWindowDimensions();

    // State to track the active tab
    const [activeTab, setActiveTab] = useState('Words');

    //reactive variable to view the word modal
    const [wordModal, toggleWordModal] = useState(false);

    //Functionality here to pull the data from the respective JSON file 
    const [data, setData] = useState(null);

    //word data - this data will be converted into a format that will be fed to ViewWordModal
    const [wordData, setWordData] = useState(null);
      

    //no data trigger
    const [noData, setNoData] = useState(false);

    useEffect(() => {

        //set the variable to false everytime language refreshes
        setNoData(false);

        const loadData = () => {

            //Check to see what the active tab is
            //If activeTab === "Words" then render words
            if (activeTab === "Words"){
                //get the JSON data from words
                const json = wordFiles[currentLang]; 
                if (json) {
                    const transformedData = json.map((item) => ({
                        title: item.title,
                        wordCount: Object.keys(item.words).length,
                    }));
                    setData(transformedData); 
                } else {
                    //This will trigger text to appear
                    setNoData(true);
                }

            } else if (activeTab === "Fiction"){
                // Load the JSON data to get only fiction stories
                const json = storyFiles[currentLang]; // Access stories for the current language
                if (json) {
                    const transformedData = json
                        .filter((item) => item.fiction) // Filter only fiction stories
                        .map((item) => ({
                            title: item.title, // Extract the title
                        }));
                    setData(transformedData);
                } else {
                    //This will trigger text to appear
                    setNoData(true);
                }

            } else if (activeTab === "Nonfiction"){
                // Load the JSON data to get only nonfiction stories
                const json = storyFiles[currentLang]; // Access stories for the current language
                if (json) {
                    const transformedData = json
                        .filter((item) => !item.fiction) // Filter only nonfiction stories
                        .map((item) => ({
                            title: item.title, // Extract the title
                        }));
                    setData(transformedData);
                } else {
                    //This will trigger text to appear
                    setNoData(true);
                }
            }
        };
    
        loadData();
    }, [currentLang, activeTab]); // Re-run whenever `currentLang` changes
    

    //This function will transform the structures so that it may be passed to the ViewWordModal
    const convertDeckWords = (data, title) => {
        // Find the deck by its title
        const deck = data.find((item) => item.title === title);
      
        // If the deck exists, transform its words
        if (deck && deck.words) {
          return Object.entries(deck.words).map(([term, translation]) => ({
            term,
            translation,
            notes: "none", // Automatically set notes to "none"
          }));
        } else {
          console.log(`Deck with title "${title}" not found or has no words.`);
          return [];
        }
      };

    //selected title
    const [selectedTitle, setSelectedTitle] = useState("");
    //this function is run when a vocabulary entry is clicked
    const triggerItem = (title) =>{

        //toggle the modal and set the data if activeTab === "Words" 
        if (activeTab === "Words"){
            //convert the data of the clicked title        
            const json = wordFiles[currentLang]; 
            if (json) {
                //run the data conversion function
                const convertedData = convertDeckWords(json, title);
                //set it to the reactive wordData variable
                setWordData(convertedData);

                //set the selected title
                setSelectedTitle(title);

                //toggle the modal
                toggleWordModal(true);
                
            } else {
                console.log("Error");
            }
        } else {

            //If it is not "Words", redirect the page to the interactive reader component
            navigation.navigate('ExplorerReader', {title:title});

        }
    };

    


    //responsive variable for container padding
    //if width is less than 600 then padding is 40, if between 600 and 1000 then padding is 100, 1k+, padding is 200
    //40 < 100 < 200
    const responsiveHorizontalPadding = width < 600 ? 20 : width < 1000 ? 100 : 200;

    return ( 
        <>
        
        <View style={[styles.mainContainer, { paddingHorizontal: responsiveHorizontalPadding }]}>

            {/* White card container that holds the content */}
            <View style={{ flex:1, backgroundColor:style.white, paddingTop:20, paddingRight:15, paddingLeft:15, borderColor:style.gray_200, borderWidth:style.border_sm, borderTopRightRadius:style.rounded_lg, borderTopLeftRadius:style.rounded_lg}}>
                {/* Top Container with Tabs - All and Bookmarks */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity onPress={() => setActiveTab('Words')} style={[styles.individualTab, activeTab === 'Words' && styles.activeTab]} activeOpacity={0.7}>
                        {/*Icon */}
                        <Icon name={'table-list'} solid={true} size={20} color={style.gray_400} style={[activeTab === 'Words' && styles.activeTab]}/>
                        {/* Text */}
                        <Text style={[styles.tabText, activeTab === 'Words' && styles.activeTab]} >
                            Decks
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setActiveTab('Fiction')} style={[styles.individualTab, activeTab === 'Fiction' && styles.activeTab]} activeOpacity={0.7}>
                        {/*Icon */}
                        <Icon name={'wand-sparkles'} solid={true} size={20} color={style.gray_400} style={[activeTab === 'Fiction' && styles.activeTab]}/>

                        <Text style={[styles.tabText, activeTab === 'Fiction' && styles.activeTab]} >
                            Fiction
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setActiveTab('Nonfiction')} style={[styles.individualTab, activeTab === 'Nonfiction' && styles.activeTab]} activeOpacity={0.7}>
                        {/*Icon */}
                        <Icon name={'landmark-dome'} solid={true} size={20} color={style.gray_400} style={[activeTab === 'Nonfiction' && styles.activeTab]}/>
                        <Text style={[styles.tabText, activeTab === 'Nonfiction' && styles.activeTab]} >
                            Non-fiction
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Container for The Rendered Content  */}
                <View style={{ flexDirection: 'column', flex:1, paddingHorizontal:15}} >

                    {/* If there is no data, render the message here */}
                    { noData ? (
                        <Text style={{ color: style.gray_400, fontSize: style.text_md, fontWeight:'600', textAlign: 'center', marginTop: 40 }}>
                            No Data
                        </Text>
                    ) : (
                        // {/* If language is detected, generate the flatlist */}
                        <FlatList data={data}
                                keyExtractor={(item, index) => index.toString()}
                                contentContainerStyle={{ paddingBottom: 150, paddingTop: 20, paddingRight:10 }} 
                                renderItem={({ item, index }) => (
                                    // Individual Box being rendered
                                    <TouchableOpacity 
                                        onPress={() => triggerItem(item.title)}
                                        style={[
                                            styles.wordCard, 
                                            { 
                                                marginBottom: 10, 
                                                borderBottomWidth: index === data.length - 1 ? 0 : style.border_sm
                                            }
                                        ]} activeOpacity={0.7}>
                                        <View style={{ flexDirection: 'row', gap: 15, alignItems: 'center' }}>
                                            {/* Index Number for the Card */}
                                            <Text style={{ color: style.gray_300, fontSize: style.text_md }}>
                                                {index + 1}
                                            </Text>

                                            {/* Title for Deck */}
                                            <View style={{ width: activeTab === "Words" ? '65%' : '90%' }}>
                                                <Text style={{ color: style.gray_500, fontWeight: '500', fontSize: style.text_md }}>
                                                    {item.title.trim()}
                                                </Text>
                                            </View>
                                        </View>

                                        {/* Word Count - only show if active tab is Words */}
                                        { activeTab === "Words" &&
                                            <Text style={{ color: style.gray_400, fontWeight: '400' }}>
                                                {item.wordCount} words
                                            </Text>
                                        }

                                    </TouchableOpacity>
                                )}
                            />
                        )}

                </View>
            </View>

        </View>    

        {/* Render modal that shows the words in the deck */}
        { wordModal &&
            <ViewWordModal onClose={()=>toggleWordModal(false)} 
                           json={true} dataProp={wordData} 
                           modalTitle={selectedTitle} />
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
        fontSize: style.text_sm,
        color: style.gray_400,
        fontWeight: "600",
        paddingVertical: 15,
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
        borderBottomWidth: style.border_sm,

        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal: 10,
    }

});

 
export default ExplorerHome;