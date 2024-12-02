
import { View, Text, StyleSheet, useWindowDimensions, TouchableOpacity, FlatList} from 'react-native';
import { useContext, useLayoutEffect, useState, useEffect, useRef, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

//data for context
import { CurrentLangContext } from '@/app/data/CurrentLangContext.tsx';

//get data from the database
import { getDeckName, getWords, getStarred, getBookmarkedStatus, toggleBookmark } from '../DataDecks';

//styles
import * as style from '@/assets/styles/styles'
import Icon from '@expo/vector-icons/FontAwesome6'

//custom components
import CustomButton from '@/app/components/CustomButton';
import CustomFab from '@/app/components/CustomFab';
import CustomAlert from '@/app/components/CustomAlert';

//import relative components
import TagDropdown from './tag_components/TagDropdown';
import HeaderRight from './components/HeaderRight';
import CreateWordModal from './components/CreateWordModal';
import WordModal from './components/WordModal';

import { limitLength } from '@/app/data/Functions';

const UserDeck = ({route}) => {

    //current language
    const { currentLang } = useContext(CurrentLangContext);

    const { deckId } = route.params;
    const navigation = useNavigation();


    //FUNCTIONALITY TO REACTIVELY GET THE NAME OF A DECK based on ID 
    //function to fetch the name of the deck based off of the ID - useful if deck name is edited
    const [deckName, setDeckName] = useState(getDeckName(currentLang, deckId));
    //function to update the deck name
    const updateDeckName = () =>{
        setDeckName(getDeckName(currentLang, deckId));
    }
    // Initialize user data from the database and update it when component mounts
    useEffect(() => {
        updateDeckName();
    }, []); 
    

    //Navigation bar data
    useLayoutEffect(() => {
        navigation.setOptions({
            // Set custom text for the back button          
            headerBackTitle: 'All',
            headerRight: () => (
                <HeaderRight currentLang={currentLang} deckId={deckId} deckName={deckName} refreshDeck={updateDeckName} refreshWords={fetchWords} />
              ),
          
        });
      }, [navigation]);

    //functionality to pull the words from the database in the respective deck
    //data for the words
    const [wordData, setWordData] = useState([]);

    //send it as a prop during CRUD functionalities 
    //This function fetches all the words
    const fetchWords = () => {
        const data = getWords(currentLang, deckId); 
        setWordData(data);
    };

    // Initialize user data from the database and update it when component mounts    
    useFocusEffect(
        useCallback(() => {
            fetchWords(); // Call `fetchDecks` when the component mounts
        }, []) 
    )



    // State to track the active tab
    const [activeTab, setActiveTab] = useState('All');

    //Trigger for Create Word Modal
    const [createModal, openCreateModal ] = useState(false);

    //Trigger for Word information modal
    const [wordModal, openWordModal] = useState(false);
    //Store the data for the word information modal
    const [selectedWord, setSelectedWord] = useState(null);

    //create a variable to count number of starred words
    const [starredWords, setStarredWords] = useState(wordData.filter(word => word.starred === 1));

    const fetchStarredWords = () =>{
        setStarredWords(wordData.filter(word => word.starred === 1))
    }
    //Update the starred words if word data changes
    useEffect(()=>{
        fetchStarredWords();
    },[wordData])

    //whenever the modal is closed, it refetches the data to update the starred count
    const handleModalClose = () => {
        //close the modal
        openWordModal(false);

        fetchWords(); // Refresh data when the modal closes
    };

    //WORD DATA MANAGEMENT FOR RENDERING
    //Set the data to what it will render based on the tab selected
    //This is what sets words to render
    const [renderedWords, setRenderWords] = useState(wordData);
    //Checks the tab and renders based off of that

    //create a functionality to get the value of a tag selected in the tag dropdown component
    // Callback to handle selected tag change
    const [selectedTag, setSelectedTag] = useState("None"); // State to store the selected tag

    //this function will be set in TagSelection.tsx
    const handleTagSelection = (tag) => {
        setSelectedTag(tag)
    };


    //Finally, we render the words based on what is selected
    useEffect(()=>{
        if (activeTab == "All"){
            //Allow to be filtered by tags only if activeTab is all 
            if (selectedTag === "None" || selectedTag === null){
                //render all the words
                setRenderWords(wordData);
            } else {
                //If selected tag is not "None" filter word based on the selected tag
                const filteredTags = wordData.filter(word => word.tag === selectedTag);

                //then render that tag
                setRenderWords(filteredTags);
            }

        } else {
            //reset word decks to normal data
            setRenderWords(starredWords);
        }
    },[activeTab, wordData, starredWords, selectedTag])


    //Logic for rendering bookmarked logo
    const [isBookmarked, setBookmarked] = useState(getBookmarkedStatus(currentLang, deckId));

    useEffect(()=>{
        //set it to the reactive vairable
        setBookmarked(getBookmarkedStatus(currentLang, deckId));


    },[wordData])



    //SCREEN WIDTH AND RESPONSIVE DESIGNS
    // Get screen width dynamically
    const { width } = useWindowDimensions();
    //responsive padding
    const responsiveHorizontalPadding = width < 600 ? 40 : width < 1000 ? 100 : 200;

    // Function to scroll to the bottom, send as prop for the CreateDeckModal
    const flatListRef = useRef(null);
    // Function to scroll to the bottom of the FlatList
    const scrollToBottom = () => {
        const totalHeight = 60 * renderedWords.length + 150;
        flatListRef.current?.scrollToOffset({ offset: totalHeight, animated: true });
      };
          
    return ( 
        <View style={[styles.mainContainer, { paddingHorizontal: responsiveHorizontalPadding }]}>
            {/* Top Container with title, buttons, and tag dropdown */}
            <View style={{flexDirection:"column", gap: 20}}>
                {/* Deck Name and top container with bookmark icon*/}
                <View style={{flexDirection:'row', justifyContent:'space-between', padding:5}}>
                    {/* Deck name */}
                    <View style={{width:'90%', marginTop:2}}>
                        <Text style={{color:style.gray_500, fontWeight:'500', fontSize: style.text_md}}>
                        { deckName}
                        </Text>
                    </View>

                    {/* Bookmark Button */}
                    <TouchableOpacity onPress={
                        ()=>{
                            //update the database
                            toggleBookmark(currentLang, deckId);
                            //toggle the variable so it shows in UI
                            setBookmarked(!isBookmarked);
                        }
                        } activeOpacity={0.7}>
                        { isBookmarked ? (
                            <Icon name={'bookmark'} solid={true} size={25} color={style.red_400} />
                            ) : (
                                <Icon name={'bookmark'} size={25} color={style.gray_400} />
                            )
                        }
                    </TouchableOpacity>

                </View>

                {/* Tag dropdown */}
                <TagDropdown currentLang={currentLang} deck_id={deckId} onTagSelect={handleTagSelection}/>

                {/* Container with study and practice butons */}
                <View style={{flexDirection:"row", justifyContent:"space-between"}}>

                    {/* Button to go to Study.tsx */}
                    <CustomButton onPress={()=>{
                                //Do not allow redirect if renderedWords.length < 2 
                                if (wordData.length < 2){
                                    //Render alert
                                    CustomAlert(`Not enough words.`, 'Add more words to study.');
                                    return;
                                }{
                                    //Else allow it to renavigate
                                    navigation.navigate('Study', {currentLang: currentLang, deckId: deckId });
                                }
                            ;}} 
                            customStyle={{flexDirection:'row', gap:8}}>
                                
                        <Text style={{color:style.white, fontWeight:'600'}}>
                            Study
                        </Text>
                        <Icon name={'rectangle-list'} solid={true} width={15} color={style.white} />
                    </CustomButton>

                    {/* Button to go to Practice.tsx */}
                    <CustomButton onPress={()=>{
                            //Do not allow redirect if renderedWords.length < 2 
                            if (wordData.length < 2){
                                //Render alert
                                CustomAlert(`Not enough words.`, 'Add more words to practice.');
                                return;
                            }{
                                //Else allow it to renavigate
                                navigation.navigate('Practice', {currentLang: currentLang, deckId: deckId, deckName:deckName });
                            }
                        ;}} 
                    customStyle={{backgroundColor:style.blue_200, flexDirection:'row', gap:8}}>
                        <Text style={{color:style.blue_500, fontWeight:'600'}}>
                            Practice
                        </Text>
                        <Icon name={'dumbbell'} solid={true} width={15} color={style.blue_400} />
                    </CustomButton>

                </View>
            </View>


            {/* Container for the tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity onPress={() => setActiveTab('All')} style={[styles.individualTab, activeTab === 'All' && styles.activeTab]} activeOpacity={0.7}>
                    <Text style={[styles.tabText, activeTab === 'All' && styles.activeTab]} >All</Text>
                    {/* Text for count of of wordData */}
                    <Text style={[{fontSize:10, marginTop: 2, color: style.gray_400 }, activeTab === 'All' && styles.activeTab]} >
                        ({wordData.length})
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setActiveTab('Starred')} style={[styles.individualTab, activeTab === 'Starred' && styles.activeTab]} activeOpacity={0.7}>
                    <Text style={[styles.tabText, activeTab === 'Starred' && styles.activeTab]} >Starred</Text>
                    {/* Text for count of STARRED words in wordData */}
                    <Text style={[{fontSize:10, marginTop: 2, color: style.gray_400 }, activeTab === 'Starred' && styles.activeTab]} >
                        ({starredWords.length})
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Content Area */}
            <View style={styles.contentContainer}>

                {/* Check if there are no words in renderedWords */}
                {renderedWords.length === 0 ? (
                    <Text style={{ color: style.gray_400, fontSize: style.text_md, fontWeight:'600', textAlign: 'center', marginTop: 80 }}>
                        No words
                    </Text>
                ) : (
                    /* Render words if available */
                    <FlatList ref={flatListRef}
                        data={renderedWords}
                        keyExtractor={(item, index) => index.toString()} 
                        contentContainerStyle={{ paddingBottom: 150, paddingTop:20 }} 
                        renderItem={({ item, index }) => (
                            <TouchableOpacity onPress={() => {
                                setSelectedWord(item); 
                                openWordModal(true);   
                                }} activeOpacity={0.7}
                                style={[
                                    styles.item, 
                                    getStarred(currentLang, deckId, item.term) === 1 && { borderWidth: 1, borderColor: '#facc15' }
                                ]}>

                                <View style={{ width: '10%',justifyContent: 'center' }}>
                                    <Text style={{ color: style.gray_300, fontSize: style.text_md }}>
                                        {index + 1}
                                    </Text>
                                </View>

                                {/* Container for Term */}
                                <View style={{ width: '40%', height: 60, justifyContent: 'center' }}>
                                    <Text style={{ color: style.gray_500, fontSize: style.text_md, padding: 1 }}> 
                                    { limitLength(item.term, 15) } 
                                    </Text>
                                </View>

                                {/* Container for Translation */}
                                <View style={{ width: '40%', height: 60, justifyContent: 'center' }}>
                                    <Text style={{ color: style.gray_400, fontSize: style.text_md }}> 
                                    { limitLength(item.translation, 20) } 
                                    </Text>
                                </View>

                            </TouchableOpacity>
                        )}/>
                )}

            </View>

            {/*COMPONENTS */}

            {/* FAB button to create new word */}
            <CustomFab onPress={() => openCreateModal(!createModal)} />

            {/* Create Word Modal - Triggered by FAB  */}
            { createModal && 
                <CreateWordModal onClose={()=> openCreateModal(false)} deckId={deckId} refresh={fetchWords} scrollToBottom={scrollToBottom} />

            }

            {/* Modal to show information about the selected word */}
            {  wordModal &&
                <WordModal onClose={()=> handleModalClose()} wordData={selectedWord} deckId={deckId} deckName={deckName}  />

            }


        </View>
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
        zIndex: -1,
        marginTop: 20
    },
    
    tabText: {
        fontSize: style.text_md,
        color: style.gray_400,
        fontWeight: "600",
        paddingVertical: 10,
        

    },

    individualTab:{
        width: "50%",
        borderBottomWidth: 3,
        borderBottomColor: style.gray_200,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 5

    },

    activeTab: {
        color: style.blue_500,
        borderBottomColor: style.blue_500,
        fontWeight: "600",

    },
    contentContainer: {
        flexDirection: 'column',
        flex: 1,
        gap: 10,
        zIndex: -1,

    },
    item: {
        backgroundColor: style.white, 
        height: 60, 
        borderRadius: style.rounded_md, 
        borderColor: style.gray_200,
        borderWidth: style.border_sm,

        flexDirection: 'row',
        alignItems:'center',
        paddingHorizontal: 15,
        marginBottom: 10
    },


});



export default UserDeck;