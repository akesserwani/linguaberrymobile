
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, FlatList } from 'react-native';
import { useContext, useState, useEffect, useRef, useCallback } from 'react';

//data for context
import { CurrentLangContext } from '@/app/data/CurrentLangContext.tsx';

//styles and custom components
import CustomFab from '@/app/components/CustomFab';

//import the entry creation modal 
import CreateEntryModal from './components/CreateEntryModal';

import BookmarkDropdown from './components/BookmarkDropdown';

import * as style from '@/assets/styles/styles'

//import data from reader data file
import { getEntriesByLanguage } from '../DataReader';

//import miscellanous functions
import { formatDate, limitLength } from '@/app/data/Functions';
import React from 'react';
import ImportDeck from '../../components/ImportStoryModal';
import ImportStoryModal from '../../components/ImportStoryModal';


const ReaderHome = ({ navigation }) => {

    //current language
    const { currentLang } = useContext(CurrentLangContext);

    // State to track the active tab
    const [activeTab, setActiveTab] = useState('All');

    // Word data from object
    const [entryData, setEntryData] = useState([]);
    // bookmarked deck data
    const [bookmarkedEntryData, setBookmarkedEntryData] = useState([]);
    //filtered tag data
    const [filteredEntryData, setFilteredEntryData] = useState([]);

    //selected tag
    const [selectedTag, selectTag] = useState(null);

    //created first
    const [createdFirst, toggleCreatedFirst] = useState(true);

    //rendered data
    //this is the data that is rendered in the dropdown
    const [ renderedData, setRenderedData ] = useState([])

    // Function to fetch entries
    const fetchData = () => {
        //Initialize all the data
        //call the function to get all entries
        const data = getEntriesByLanguage(currentLang);
        //set all the entry data
        setEntryData(data);    

        //set bookmarked deck data
        const bookmarkedData = data.filter(entry => entry.bookmarked === 1);
        setBookmarkedEntryData(bookmarkedData);  

        //set bookmarked deck data
        const filteredTagData = data.filter(entry => entry.tag === selectedTag);
        

        //get the current tab then set to the rendered data
        if (activeTab === "All"){
            //render the filtered tags under all
            if (selectedTag === null){
                setRenderedData(data);
            } else {
                setRenderedData(filteredTagData);
            }

        } else if (activeTab === "Bookmarks"){
            setRenderedData(bookmarkedData);
        }
            
    };


    // Fetch data every time the component is focused
    useFocusEffect(
        useCallback(() => {
            fetchData(); // Fetch decks whenever the screen is focused
        }, [currentLang, selectedTag, activeTab]) // Add any dependencies if needed
    );
    

    //Reactive variable to toggle the entry creation modal
    const [newEntryModal, setnewEnryModal] = useState(false);

    //modal for the Import Story function
    const [importWebModal, setImportWeb] = useState(false);

    // Function to scroll to the bottom
    const flatListRef = useRef(null);
    const scrollToBottom = () => {
        const totalHeight = 60 * renderedData.length + 150;
        flatListRef.current?.scrollToOffset({ offset: totalHeight, animated: true });
      };

    //responsive variable for container padding
    //if width is less than 600 then padding is 40, if between 600 and 1000 then padding is 100, 1k+, padding is 200
    //40 < 100 < 200
    // Get screen width dynamically
    const { width } = useWindowDimensions();
    const responsiveHorizontalPadding = width < 600 ? 40 : width < 1000 ? 100 : 200;

    return (
        <>
        <View style={[styles.mainContainer, { paddingHorizontal: responsiveHorizontalPadding }]}>

            {/* Tag Dropdown */}
            <View style={{marginTop:10, marginBottom:15}}>
                <BookmarkDropdown onTagSelect={selectTag} />
            </View>

            {/* Top Container with Tabs - All and Bookmarks */}
            <View style={styles.tabContainer}>
                <TouchableOpacity onPress={() => setActiveTab('All')} style={[styles.individualTab, activeTab === 'All' && styles.activeTab]} activeOpacity={0.7}>
                    <Text style={[styles.tabText, activeTab === 'All' && styles.activeTab]} >
                        All
                        {/* Count of All */}
                        <Text style={{fontSize: style.text_sm }}>{'\u00A0'} ({entryData.length})</Text>
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setActiveTab('Bookmarks')} style={[styles.individualTab, activeTab === 'Bookmarks' && styles.activeTab]} activeOpacity={0.7}>
                    <Text style={[styles.tabText, activeTab === 'Bookmarks' && styles.activeTab]} >
                        Bookmarks
                        {/* Count of Bookmarks */}
                        <Text style={{fontSize: style.text_sm }}>{'\u00A0'} ({ bookmarkedEntryData.length })</Text>
                    </Text>
                </TouchableOpacity>
            </View>


            {/* Container for Individual Decks rendered as cards  */}
            <View style={{ flexDirection: 'column', flex:1  }} >

                {/* Display no decks text if entryData is empty, else render everything  */}
                {renderedData.length === 0 ? (
                    <Text style={{ color: style.gray_400, fontSize: style.text_md, fontWeight:'600', textAlign: 'center', marginTop: 80 }}>
                        {activeTab === "All" ? "No stories" : "No Bookmarked stories"}
                    </Text>

                    ) : (
                        <FlatList
                        ref={flatListRef}
                        data={renderedData.reverse()}
                        keyExtractor={(item, index) => item.id.toString()}
                        contentContainerStyle={{ paddingBottom: 150, paddingTop:20, paddingRight:10 }} 
                        ListHeaderComponent={
                            //this text will appear on top prompting the user whether to render decks by created first or created last
                            <TouchableOpacity style={{paddingVertical:10, paddingHorizontal:5, marginBottom:5}} onPress={()=>toggleCreatedFirst(!createdFirst)}>
                                <Text style={{color:style.blue_500, fontWeight:'500', fontSize:style.text_sm}}>
                                    {createdFirst ? 'Oldest' : 'Newest'} First
                                </Text>
                            </TouchableOpacity>
                        }                        

                        renderItem={({ item, index }) => (
                        //Individual Box being rendered

                        <TouchableOpacity onPress={() => navigation.navigate("ReaderViewer", { entryTitle: item.title, entryId: item.id })}
                            style={[styles.itemCard, { marginBottom: 10 }]} activeOpacity={0.7}>
                            <View style={{ flexDirection: 'row', gap: 15 }}>
                                {/* Index Number for the Card */}
                                <View style={{ width: 'auto',justifyContent: 'center' }}>
                                    <Text style={{ color: style.gray_300, fontSize: style.text_md }}>
                                    {index + 1}
                                    </Text>
                                </View>
                                {/* Title for Deck */}
                                <View style={{ width: '60%', justifyContent: 'center' }}>
                                    <Text style={{ color: style.gray_500, fontWeight: '500', fontSize: style.text_md }}>
                                        {item.title && item.title.trim() !== "" ? limitLength(item.title, 20) : "No Title"}
                                    </Text>
                                </View>
                            </View>

                            {/* Created At */}
                            <Text style={{ color: style.gray_400, fontWeight: '400' }}>
                                { formatDate(item.created_at) } 
                            </Text>
                        </TouchableOpacity>
                        )}/>

                    )}

            </View>


            {/* Add Button - Absolute positioning from bottom */}
            <CustomFab onPress={() => setnewEnryModal(true)} />
        </View>    


        {/* Modal to create a new deck */}
        { newEntryModal &&
            <CreateEntryModal onClose={() => setnewEnryModal(false)} refresh={fetchData} scrollToBottom={scrollToBottom} setImportWeb={()=>setImportWeb(true)}/>
        }

        {/* Import story Modal */}
        { importWebModal && 
            <ImportStoryModal onClose={()=>setImportWeb(false)} refresh={fetchData}/>

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
        fontWeight: "600",
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
    itemCard: {
        backgroundColor: style.white, 
        height: 60, 
        borderRadius: style.rounded_md, 
        borderColor: style.gray_200,
        borderWidth: style.border_sm,

        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal: 15,
    }

});

export default ReaderHome;