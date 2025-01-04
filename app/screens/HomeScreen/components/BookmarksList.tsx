
import React, { useState, useContext, useCallback, useEffect  } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import * as style from '@/assets/styles/styles';
import CustomButton from '@/app/components/CustomButton';
import Icon from '@expo/vector-icons/FontAwesome6'
import { useFocusEffect, useNavigation, CommonActions} from "@react-navigation/native";

//data for context
import { CurrentLangContext } from '@/app/data/CurrentLangContext.tsx';

//database 
import { db } from "@/app/data/Database";

import { limitLength } from '@/app/data/Functions';


const BookmarksList = () => {


    //Get the current language
    const { currentLang } = useContext(CurrentLangContext);

    const navigation = useNavigation();

    // State to track the active tab
    const [activeTab, setActiveTab] = useState('Decks');
    //reset active tab to decks if the language changes
    useEffect(()=>{
        setActiveTab("Decks");
    }, [currentLang])


    //Main Data - this data will be set the displayed data
    const [renderedData, setRender] = useState([]);


    const items = ['Item 1', 'Item 2', 'Item 3'];



    //function to get bookmarked decks from the database 
    const getBookmarkedDecks = () => {
        let bookmarked = [];

        db.withTransactionSync(() => {
          const result = db.getAllSync(
            `SELECT * FROM deck 
             WHERE language_id = ? AND bookmarked = ?;`,
            [currentLang, 1]
          );
          // Assign the fetched rows to the array
          bookmarked = result.map((row) => ({
            id: row.id,
            name: row.name,
          }));
        });

        return bookmarked;
    };

    //function to get bookmarked entries
    const getBookmarkedEntries = () =>{
        let bookmarked = [];

        db.withTransactionSync(() => {
            const result = db.getAllSync(
              `SELECT * FROM story WHERE language_id = ? AND bookmarked = 1;`,
              [currentLang]
            );
            // Assign the fetched rows to the array
            bookmarked = result.map((row) => ({
                id: row.id,
                name: row.title,
            }));
        });

        return bookmarked;
    }
    
    //function to get bookmarked entries
    const getBookmarkedStories = () =>{
        let bookmarked = [];

        db.withTransactionSync(() => {
            const result = db.getAllSync(
              `SELECT * FROM explorer WHERE language_id = ? AND bookmarked = 1;`,
              [currentLang]
            );
            // Assign the fetched rows to the array
            bookmarked = result.map((row) => ({
                id: row.id,
                name: row.story_name,
            }));
        });

        return bookmarked;
    }

      //pick up the data
      useFocusEffect(
        useCallback(() => {

            let setData = [];
            //If the user is selected to decks - set the rendered data to respective value
            if (activeTab === "Decks"){
                setData = getBookmarkedDecks();
                setRender(setData);
            } else if (activeTab === "Entries"){
                setData = getBookmarkedEntries();
                setRender(setData);
            } else if (activeTab === "Stories"){
                setData = getBookmarkedStories();
                setRender(setData);
            }
    
    
        }, [currentLang, activeTab]) 
      );
    
    

    //Route functions
    const navigateDecks = (name, id) => {
        // First, navigate to the Decks stack and DecksHome
        navigation.navigate("Decks", { screen: "DecksHome" });
      
        // Then, navigate to UserDeck
        setTimeout(() => {
          navigation.navigate("Decks", {
            screen: "UserDeck",
            params: { deckId: id },
          });
        }, 0); // Delay ensures Decks stack is fully loaded
      };
      
    const navigateEntries = (name, id) =>{

        // First, navigate to the Decks stack and DecksHome
        navigation.navigate("Reader", { screen: "ReaderHome" });
      
        // Then, navigate to ReaderViewer 
        setTimeout(() => {
          navigation.navigate("Reader", {
            screen: "ReaderViewer",
            params: { entryTitle: name, entryId: id }, // Pass any params
          });
        }, 0); // Delay ensures Reader stack is fully loaded

    }

    const navigateStories = (name) =>{
        // First, navigate to the Decks stack and DecksHome
        navigation.navigate("Explorer", { screen: "ExplorerHome" });

        // Then, navigate to ReaderViewer 
        setTimeout(() => {
            navigation.navigate("Explorer", {
                screen: "ExplorerReader", // Target screen inside Stack
                params: { title:name }, // Pass any params
            })
        }, 0); // Delay ensures Reader stack is fully loaded
    }


    return ( 
        <View style={{flex:1}}>
            <View style={styles.tabContainer}>

                <TouchableOpacity onPress={() => setActiveTab('Decks')} style={[styles.individualTab, activeTab === 'Decks' && styles.activeTab]} activeOpacity={0.7}>
                    <Text style={[styles.tabText, activeTab === 'Decks' && styles.activeTab]} >Decks</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setActiveTab('Entries')} style={[styles.individualTab, activeTab === 'Entries' && styles.activeTab]} activeOpacity={0.7}>
                    <Text style={[styles.tabText, activeTab === 'Entries' && styles.activeTab]} >Entries</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setActiveTab('Stories')} style={[styles.individualTab, activeTab === 'Stories' && styles.activeTab]} activeOpacity={0.7}>
                    <Text style={[styles.tabText, activeTab === 'Stories' && styles.activeTab]} >Stories</Text>
                </TouchableOpacity>
            </View>

            {/* Content Area */}
            <View style={styles.contentContainer}>

                {/* Check if there are no words in renderedWords */}
                { renderedData.length === 0 ? (
                    <Text style={{ color: style.gray_400, fontSize: style.text_md, fontWeight:'600', textAlign: 'center', marginTop: 50 }}>
                        No bookmarks
                    </Text>
                ) : (
                    // {/* Individual Bookmarked box */}
                    <FlatList data={renderedData}
                              contentContainerStyle={{ paddingBottom: 150, paddingTop:10 }} 
                              keyExtractor={(item, index) => index.toString()} 
                              renderItem={({ item, index }) => (

                                // {/* Individual Item */}
                                <TouchableOpacity style={[styles.item, index === renderedData.length - 1 && styles.lastItem]} activeOpacity={0.7}
                                                  onPress={()=>{
                                                        if (activeTab === "Decks"){
                                                            navigateDecks(item.name, item.id);
                                                        } else if (activeTab === "Entries"){
                                                            navigateEntries(item.name, item.id);
                                                        } else {
                                                            navigateStories(item.name);
                                                        }
                                                  }}>
                                    {/* Text of the Bookmarked items name */}
                                    <View style={{ flexDirection:'row', gap:15, width: '80%', height: 60 }}>

                                        <View style={{ width: 'auto',justifyContent: 'center' }}>
                                            <Text style={{ color: style.gray_300, fontSize: style.text_md }}>
                                                {index + 1}
                                            </Text>
                                        </View>
                                        
                                        <View style={{ width: '80%', height: 60, justifyContent: 'center' }}>
                                            <Text style={{ color: style.gray_500, fontSize: style.text_md, padding: 1, fontWeight:'500' }}> 
                                                { limitLength(item.name, 30) } 
                                            </Text>
                                        </View>

                                    </View>
                                </TouchableOpacity>

                    )}/>
                )}

            </View>
        </View>
     );
}

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: "row",
    },
    
    tabText: {
        fontSize: style.text_md,
        color: style.gray_400,
        fontWeight: "600",
        paddingVertical: 10,

    },

    individualTab:{
        width: "33%",
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
        flex:1,
        flexDirection: 'column',
        gap: 20,

    },
    item: {
        paddingVertical: 3,
        paddingHorizontal:4,
        borderBottomWidth: 1,
        borderBottomColor: style.gray_200, 
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems:'center', 
    },
    lastItem: {
        borderBottomWidth: 0, // Remove bottom border for the last item
    }


});



export default BookmarksList;