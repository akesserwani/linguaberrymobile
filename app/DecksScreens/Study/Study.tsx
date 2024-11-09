import { View, Text, StyleSheet, useWindowDimensions, TouchableOpacity, ScrollView} from 'react-native';
import { useContext, useLayoutEffect, useState, useEffect, useRef } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

//styles
import * as style from '@/assets/styles/styles'
import Icon from '@expo/vector-icons/FontAwesome6'

//custom components
import CustomButton from '@/app/components/CustomButton';
import CustomFab from '@/app/components/CustomFab';
import CustomModal from '@/app/components/CustomModal';

//import components
import HeaderRight from './components/HeaderRight';
import TagSelection from './components/TagSelection';
import Card from './components/Card';

//database functionality
import { getWords } from '../DataDecks';

const Study = () => {

    const route = useRoute();
    const navigation = useNavigation();

    const { currentLang, deckId } = route.params; 


    //Important variables for the process

    //Flashcard mode - either STUDY MODE or FLASHCARD MODE
    const [mode, setMode] = useState(true);
    
    //FRONT FIRST OR BACK FIRST
    const [frontFirst, setFrontFirst] = useState(true);


    //Navigation bar data
    useLayoutEffect(() => {
        navigation.setOptions({
            // Set custom text for the back button          
            headerBackTitle: 'Back',
            headerRight: () => (
                <HeaderRight currentLang={currentLang} deckId={deckId} mode={mode} setMode={setMode} frontFirst={frontFirst} setFrontFirst={setFrontFirst}/>
            ),
        });
        }, [navigation]);
    

    //Reactive variable for selected tag that will be sent over to the TagSelection component
    const [selectedTag, selectTag] = useState("");
    //toggle whether starred will be activated or not
    const [starred, setStarred] = useState(false);

    //Pull the flashcard data from the database based on the deckID and current lang
    const [wordData, setWordData] = useState([]);

    //current index 
    const [currentIndex, setCurrentIndex] = useState(0);
    const maxIndex = wordData.length - 1;

    //current word data
    //this is the data that is sent to the Card component based on the index
    const [currentWordData, setCurrentWordData] = useState("None")

    // Async function to fetch words
    const [loading, setLoading] = useState(true);
    const fetchWords = () => {
        setLoading(true); // Start loading
        try {
            const data = getWords(currentLang, deckId); // Await async fetch

            //Logic based on which words to fetch
            //Filters are starred and tags
            



            setWordData(data);

        } catch (error) {
            console.error("Error fetching words:", error);
        } finally {
            setLoading(false); // End loading
        }
    };

    // Fetch words on component mount or if `currentLang` or `deckId` changes
    useEffect(() => {
        fetchWords();
    }, [currentLang, deckId]);

    // Update `currentWordData` whenever `wordData` or `currentIndex` changes
    useEffect(() => {
        if (wordData.length > 0 && currentIndex < wordData.length) {
            setCurrentWordData(wordData[currentIndex]);
        }
    }, [wordData, currentIndex]); // Depend on both `wordData` and `currentIndex`

    

    const prevCard = () => {
        // Decrements the currentIndex by 1, or wraps it to the last index (maxIndex)
        // if currentIndex is currently at the first element (index 0).
        setCurrentIndex(prevIndex => (prevIndex === 0 ? maxIndex : prevIndex - 1));
    };
    
    const nextCard = () => {
        // Increments the currentIndex by 1, or wraps it to the first index (0)
        // if currentIndex is currently at the last element (maxIndex).
        setCurrentIndex(prevIndex => (prevIndex === maxIndex ? 0 : prevIndex + 1));
    };
    
    //SCREEN WIDTH AND RESPONSIVE DESIGNS
    // Get screen width dynamically
    const { width } = useWindowDimensions();
    //responsive padding
    const responsiveHorizontalPadding = width < 600 ? 40 : width < 1000 ? 100 : 200;

    return ( 
        <>
        {/* Main Container */}
        <View style={[styles.mainContainer, { paddingHorizontal: responsiveHorizontalPadding }]}>
            {/* Top Container with Tags and starred button*/}
            <View style={{flexDirection:'row', justifyContent:'space-between', borderBottomWidth: style.border_md, borderBottomColor:style.gray_200, paddingBottom: 20, zIndex:1}}>
                {/* Tags selection Dropdown  */}
                <TagSelection currentLang={currentLang} deckId={deckId} onTagSelect={selectTag}/>                

                {/* Starred Button */}
                <CustomButton customStyle={{backgroundColor: style.white, borderWidth:style.border_sm, borderColor:style.gray_200, aspectRatio: 1, borderRadius:8}} 
                    onPress={()=>setStarred(!starred)}>
                    { starred ? (
                        <Icon name={"star"} solid={true} width={15} color={"#facc15"}/>         
                    ) : (
                        <Icon name={"star"} solid={true} width={15} color={style.gray_300}/>         
                    )
                    }
                </CustomButton>
            </View>

            {/* Card Container */}
            <View style={{flex:2, alignItems:'center', justifyContent:'center', zIndex:0}}>

                {/*Card Component */}
                {loading ? (
                    <Text>Loading...</Text>
                ) : currentWordData ? (
                    <Card wordData={currentWordData} currentLang={currentLang} deckId={deckId} frontFirst={frontFirst}/> // Pass `currentWordData` as a prop to `Card`
                ) : (
                    <Text>No data available</Text>
                )}
                
            </View>

            {   mode ? (
                    // {/* Button Container for Flashcard Mode */}
                    <View style={{flex:1, flexDirection:'row', justifyContent: 'space-between', padding:20, alignItems:'flex-start'}}>
                        {/* Previous Button */}
                        <CustomButton customStyle={styles.flashcardButtons} onPress={prevCard}>
                            <Icon name={"caret-left"} solid={true} size={20} color={style.gray_500}/>         
                        </CustomButton>

                        {/* Text for Flashcard Progress */}
                        <Text style={{color:style.gray_500, fontSize:style.text_lg, fontWeight:'600', marginTop:10}}>
                            { currentIndex + 1 } / {wordData.length}
                        </Text>


                        {/* Next Button */}
                        <CustomButton customStyle={styles.flashcardButtons} onPress={nextCard}>
                            <Icon name={"caret-right"} solid={true} size={20} color={style.gray_500}/>         
                        </CustomButton>
                </View>

            ) : (
                // {/* Button Container for Study Mode */}
                <View style={{flex:1, flexDirection:'row', justifyContent: 'space-between', alignItems:'flex-start'}}>
                        {/* Hard Button */}
                        <CustomButton customStyle={{backgroundColor:style.red_400}} onPress={()=>{}}>
                            <Text style={{fontSize:style.text_lg, color:style.white, fontWeight:"500"}}>Hard</Text>
                        </CustomButton>

                        {/* Medium Button */}
                        <CustomButton customStyle={{backgroundColor:"#2dd4bf"}} onPress={()=>{}}>
                            <Text style={{fontSize:style.text_lg, color:style.white, fontWeight:"500"}}>Medium</Text>
                        </CustomButton>


                        {/* Easy Button */}
                        <CustomButton customStyle={null} onPress={()=>{}}>
                            <Text style={{fontSize:style.text_lg, color:style.white, fontWeight:"500"}}>Easy</Text>
                        </CustomButton>
                </View>
            )
            }




        </View>
        </>
     );
}
 
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: style.slate_100,
        paddingTop: 30,
        flexDirection:'column',
    },
    flashcardButtons:{
        backgroundColor: style.gray_200, 
        borderWidth:style.border_sm, 
        borderColor:style.gray_300,
        width:60,
        height: 50
    },
});

export default Study;
