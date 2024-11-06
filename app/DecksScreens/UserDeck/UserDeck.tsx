
import { View, Text, StyleSheet, useWindowDimensions, TouchableOpacity, ScrollView} from 'react-native';
import { useContext, useLayoutEffect, useState, useEffect, useRef } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

//data for context
import { CurrentLangContext } from '@/app/data/CurrentLangContext.tsx';

//get data from the database
import { getWords, getStarred, getBookmarkedStatus, toggleBookmark } from '../DataDecks';

//styles
import * as style from '@/assets/styles/styles'
import Icon from '@expo/vector-icons/FontAwesome6'

//custom components
import CustomButton from '@/app/components/CustomButton';
import CustomFab from '@/app/components/CustomFab';
import CustomModal from '@/app/components/CustomModal';

//import relative components
import TagDropdown from './components/TagDropdown';
import HeaderRight from './components/HeaderRight';
import CreateWordModal from './components/CreateWordModal';
import WordModal from './components/WordModal';

const UserDeck = ({route}) => {

    //current language
    const { currentLang } = useContext(CurrentLangContext);

    const { deckName } = route.params;
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            // Set custom text for the back button          
            headerBackTitle: 'All',
            headerRight: () => (
                <HeaderRight currentLang={currentLang} deckName={deckName}/>
              ),
          
        });
      }, [navigation]);
    

    //functionality to pull the words from the database in the respective deck

    //data for the words
    const [wordData, setWordData] = useState([]);

    //send it as a prop during CRUD functionalities 
    const fetchDecks = () => {
        const data = getWords(currentLang, deckName); 
        setWordData(data);

    };

    // Initialize user data from the database and update it when component mounts
    useEffect(() => {
        fetchDecks(); // Call `fetchDecks` when the component mounts
    }, []); 
    

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

        fetchDecks(); // Refresh data when the modal closes
    };

    //WORD DATA MANAGEMENT FOR RENDERING
    //Set the data to what it will render based on the tab selected
    //This is what sets words to render
    const [renderedWords, setRenderWords] = useState(wordData);
    //Checks the tab and renders based off of that
    useEffect(()=>{
        if (activeTab == "All"){
            //Set word data to just the starred words
            setRenderWords(wordData);
        } else {
            //reset word decks to normal data
            setRenderWords(starredWords);
        }
    },[activeTab, wordData, starredWords])


    //Logic for rendering bookmarked logo
    const [isBookmarked, setBookmarked] = useState(getBookmarkedStatus(currentLang, deckName));

    useEffect(()=>{
        //set it to the reactive vairable
        setBookmarked(getBookmarkedStatus(currentLang, deckName));


    },[wordData])



    //SCREEN WIDTH AND RESPONSIVE DESIGNS
    // Get screen width dynamically
    const { width } = useWindowDimensions();
    //responsive padding
    const responsiveHorizontalPadding = width < 600 ? 40 : width < 1000 ? 100 : 200;

    // Function to scroll to the bottom, send as prop for the CreateDeckModal
    const scrollViewRef = useRef(null);
    const scrollToBottom = () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    };
    
    return ( 
        <View style={[styles.mainContainer, { paddingHorizontal: responsiveHorizontalPadding }]}>
            {/* Top Container with title, buttons, and tag dropdown */}
            <View style={{flexDirection:"column", gap: 20}}>
                {/* Deck Name and top container with bookmark icon*/}
                <View style={{flexDirection:'row', justifyContent:'space-between', padding:5}}>
                    {/* Deck name */}
                    <Text style={{color:style.gray_500, fontWeight:'500', fontSize: style.text_lg}}>{ deckName }</Text>

                    {/* Bookmark Button */}
                    <TouchableOpacity onPress={
                        ()=>{
                            //update the database
                            toggleBookmark(currentLang, deckName);
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
                <TagDropdown />

                {/* Container with study and practice butons */}
                <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                    <CustomButton onPress={()=>{}} customStyle={{flexDirection:'row', gap:8}}>
                        <Text style={{color:style.white, fontWeight:'500'}}>Study</Text>
                        <Icon name={'book-open'} solid={true} width={15} color={style.white} />
                    </CustomButton>

                    <CustomButton onPress={()=>{}} customStyle={{backgroundColor:style.blue_100, flexDirection:'row', gap:8}}>
                        <Text style={{color:style.blue_500, fontWeight:'500'}}>Practice</Text>
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
            <ScrollView ref={scrollViewRef} style={styles.contentContainer} contentContainerStyle={{ paddingBottom: 200 }}>

                {/* Check if there are no words in renderedWords */}
                {renderedWords.length === 0 ? (
                    <Text style={{ color: style.gray_400, fontSize: style.text_md, textAlign: 'center', marginTop: 20 }}>
                        No words
                    </Text>
                ) : (
                    /* Render words if available */
                    renderedWords.map((item, index) => (
                        <TouchableOpacity 
                            onPress={() => {
                                setSelectedWord(item); // Set the selected word data
                                openWordModal(true);   // Open the modal
                            }} 
                            key={index} 
                            activeOpacity={0.7}
                            style={[
                                styles.item, 
                                getStarred(currentLang, deckName, item.term) === 1 && { borderWidth: 1, borderColor: '#facc15' }
                            ]}>

                            <Text style={{ color: style.gray_400, fontSize: style.text_md }}> 
                                { index + 1 } 
                            </Text> 

                            {/* Container for Term */}
                            <View style={{ width: '40%', height: 60, justifyContent: 'center' }}>
                                <Text style={{ color: style.gray_500, fontSize: style.text_md, padding: 1 }}> 
                                    {item.term} 
                                </Text>
                            </View>

                            {/* Container for Translation */}
                            <View style={{ width: '40%', height: 60, justifyContent: 'center' }}>
                                <Text style={{ color: style.gray_400, fontSize: style.text_md }}> 
                                    {item.translation} 
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))
                )}
                </ScrollView>

            {/*COMPONENTS */}

            {/* FAB button to create new word */}
            <CustomFab onPress={() => openCreateModal(!createModal)} />

            {/* Create Word Modal - Triggered by FAB  */}
            { createModal && 
                <CreateWordModal onClose={()=> openCreateModal(false)} deckName={deckName} refresh={fetchDecks} scrollToBottom={scrollToBottom} />

            }

            {/* Modal to show information about the selected word */}
            {  wordModal &&
                <WordModal onClose={()=> handleModalClose()} wordData={selectedWord}  deckName={deckName}  />

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
        fontWeight: "500",
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
    },
    contentContainer: {
        flexDirection: 'column',
        gap: 10,
        zIndex: -1,
        marginTop:20

    },
    item: {
        backgroundColor: style.white, 
        height: 60, 
        borderRadius: style.rounded_md, 
        borderColor: style.gray_200,
        borderWidth: style.border_sm,

        flexDirection: 'row',
        gap: 20,
        alignItems:'center',
        paddingHorizontal: 15,
        marginBottom: 10
    },


});



export default UserDeck;