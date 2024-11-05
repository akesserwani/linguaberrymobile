
import { View, Text, StyleSheet, useWindowDimensions, TouchableOpacity, ScrollView} from 'react-native';
import { useContext, useLayoutEffect, useState, useEffect, useRef } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

//data for context
import { CurrentLangContext } from '@/app/data/CurrentLangContext.tsx';

//get data from the database
import { getWords } from '../DataDecks';

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

    const { deckName } = route.params;
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            // Set custom text for the back button          
            headerBackTitle: 'All',
            headerRight: () => (
                <HeaderRight />
              ),
          
        });
      }, [navigation]);
    
    //current language
    const { currentLang } = useContext(CurrentLangContext);

    //functionality to pull the words from the database in the respective deck

    //data for the words
    const [wordData, setWordData] = useState([]);

    //send it as a prop during CRUD functionalities 
    const fetchDecks = () => {
        const data = getWords(currentLang, deckName); // Assume synchronous data retrieval
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
                {/* Deck Name */}
                <View>
                    <Text style={{color:style.gray_500, fontWeight:'500', fontSize: style.text_lg}}>{ deckName }</Text>
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
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setActiveTab('Starred')} style={[styles.individualTab, activeTab === 'Starred' && styles.activeTab]} activeOpacity={0.7}>
                    <Text style={[styles.tabText, activeTab === 'Starred' && styles.activeTab]} >Starred</Text>
                </TouchableOpacity>
            </View>

            {/* Content Area */}
            <ScrollView ref={scrollViewRef} style={styles.contentContainer} contentContainerStyle={{ paddingBottom: 200 }}>
                {/* Individual Bookmarked box */}
                {/* Click on a word and triggle modal with word data */}
                {wordData.map((item, index) => (

                    <TouchableOpacity onPress={() => {
                        setSelectedWord(item); // Set the selected word data
                        openWordModal(true);   // Open the modal
                       }} key={index} style={styles.item} activeOpacity={0.7}>

                        <Text style={{ color: style.gray_400, fontSize: style.text_md}}> 
                            { index + 1 } 
                        </Text> 

                        {/* Container for Term */}
                        <View style={{ width:'40%', height: 60, justifyContent:'center' }}>
                            <Text style={{ color: style.gray_500, fontSize: style.text_md, padding:1}}> 
                                {item.term} 
                            </Text>
                        </View>

                        {/* Container for Translation */}
                        <View style={{ width:'40%', height: 60, justifyContent:'center' }}>
                            <Text style={{ color: style.gray_400, fontSize: style.text_md}}> 
                                {item.translation} 
                            </Text>
                        </View>



                    </TouchableOpacity>

                ))}
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
                <WordModal onClose={()=> openWordModal(false)} wordData={selectedWord}  deckName={deckName}  />

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
        alignItems: 'center'
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