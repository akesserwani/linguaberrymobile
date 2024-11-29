import { View, Text, StyleSheet, useWindowDimensions, TouchableOpacity, ScrollView} from 'react-native';
import { useContext, useLayoutEffect, useState, useEffect, useRef } from 'react';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';

//styles
import * as style from '@/assets/styles/styles'
import Icon from '@expo/vector-icons/FontAwesome6'

//custom components
import CustomButton from '@/app/components/CustomButton';

//import components
import HeaderRight from './components/HeaderRight';
import TagSelection from './components/TagSelection';
import Card from './components/Card';

//database functionality
import { getWords } from '../DataDecks';

//import function to shuffle
import { shuffleArray } from '@/app/data/Functions';

const Study = () => {

    const route = useRoute();
    const navigation = useNavigation();

    const { currentLang, deckId } = route.params; 


    //Important variables for the process

    //Flashcard mode - either STUDY MODE or FLASHCARD MODE
    const [mode, setMode] = useState(true);
    
    //FRONT FIRST OR BACK FIRST
    const [frontFirst, setFrontFirst] = useState(true);

    //Random variables
    const [randomOrder, setRandom] = useState(false);
    

    //Navigation bar data
    useLayoutEffect(() => {
        navigation.setOptions({
            // Set custom text for the back button          
            headerBackTitle: 'Back',
            headerRight: () => (
                <HeaderRight currentLang={currentLang} deckId={deckId} mode={mode} setMode={setMode} frontFirst={frontFirst} setFrontFirst={setFrontFirst} randomOrder={randomOrder} setRandom={setRandom}/>
            ),
        });
        }, [navigation]);
    
        //Functionality to hide the tabBar when it is on the page
        const isFocused = useIsFocused();
        useEffect(() => {
            if (isFocused) {
                // Hide the tab bar when this screen is focused
                navigation.getParent()?.setOptions({
                    tabBarStyle: { display: 'none' },
                });
            } else {
                // Show the tab bar again when leaving this screen
                navigation.getParent()?.setOptions({
                    tabBarStyle: { 
                        ...style.baseTabBarStyle, // Spread base styles here
                        display: 'flex',
                    },
                });
            }
        }, [isFocused, navigation]);

    //Reactive variable for selected tag that will be sent over to the TagSelection component
    const [selectedTag, selectTag] = useState("None");

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
            let data = getWords(currentLang, deckId); 

            //if random is true, randomize the order of the array
            if (randomOrder){
                data = shuffleArray(data);
            } 

            //Logic based on which words to fetch
            //If starred tag is selected - starred only render 
            if (selectedTag === "Starred"){
                //filter data 
                data = data.filter(word => word.starred === 1)
                setWordData(data);

                //if starred has no data
                if (data.length === 0){
                    setLoading(true);
                }

            } else {
                //logic for tags here
                //else render everything else
                if (selectedTag === "None"){
                    //render all the words
                    setWordData(data);

                } 
                else {
                    //render the words with the selected tag
                    data = data.filter(word => word.tag === selectedTag)
                    setWordData(data);
                }
            }

            //reset current index
            setCurrentIndex(0)

            //set word data
            setCurrentWordData(wordData[currentIndex]);

        } catch (error) {
            console.error("Error fetching words:", error);
        } finally {
            setLoading(false); // End loading
        }
    };

    // Fetch words on component mount or if `currentLang` or `deckId` changes
    useEffect(() => {
        fetchWords();
    }, [currentLang, deckId, selectedTag, randomOrder, mode]);

    // Update `currentWordData` whenever `wordData` or `currentIndex` changes
    useEffect(() => {
        if (wordData.length > 0 && currentIndex < wordData.length) {
            setCurrentWordData(wordData[currentIndex]);
        }
    }, [wordData, currentIndex, selectedTag, randomOrder, mode]); 

    

    const prevCard = () => {
        // Decrements the currentIndex by 1, or wraps it to the last index (maxIndex)
        // if currentIndex is currently at the first element (index 0).
        setCurrentIndex(prevIndex => (prevIndex - 1 + (maxIndex + 1)) % (maxIndex + 1));

        //If current tag is starred - refresh the word data 
        if (selectedTag === "Starred"){
            setWordData(prevData => prevData.filter(word => word.starred === 1));
        }
        
    };
    
    const nextCard = () => {
        // Increments the currentIndex by 1, or wraps it to the first index (0)
        // if currentIndex is currently at the last element (maxIndex).
        setCurrentIndex(prevIndex => (prevIndex + 1) % (maxIndex + 1));

        //If current tag is starred - refresh the word data 
        if (selectedTag === "Starred"){
            setWordData(prevData => prevData.filter(word => word.starred === 1));
        }

    };


    //create a variable called starred word count that gets the number of starred words
    const [starredWordCount, setStarredWordCount] = useState(0);
    useEffect(()=>{
        const starWordCountCalculate = wordData.filter(word => word.starred === 1).length;
        setStarredWordCount(starWordCountCalculate);
    }, [wordData])

    
    //SCREEN WIDTH AND RESPONSIVE DESIGNS
    // Get screen width dynamically
    const { width } = useWindowDimensions();
    //responsive padding
    const responsiveHorizontalPadding = width < 600 ? 40 : width < 1000 ? 100 : 200;

    return ( 
        <>
        {/* Main Container */}
        <View style={[styles.mainContainer, { paddingHorizontal: responsiveHorizontalPadding }]}>
            {/* Top Container with Tags */}
            <View style={{flexDirection:'row', justifyContent:'space-between', borderBottomWidth: style.border_md, borderBottomColor:style.gray_200, paddingBottom: 20, zIndex:1}}>
                {/* Tags selection Dropdown  */}
                <TagSelection currentLang={currentLang} deckId={deckId} onTagSelect={selectTag} starredWordCount={starredWordCount}
                />                
            </View>

            {/* Card Container */}
            <View style={{flex:5, alignItems:'center', justifyContent:'center', zIndex:0}}>

                {/*Card Component */}
                {loading ? (
                    <Text>Loading...</Text>
                ) : wordData.length > 0 && currentWordData ? (
                    <Card 
                        setWordData={setWordData}
                        wordData={currentWordData} 
                        currentLang={currentLang} 
                        deckId={deckId} 
                        frontFirst={frontFirst} 
                    />
                ) : (
                    <Text style={{color:style.gray_500, fontSize:style.text_lg, fontWeight:'600'}}>No words available</Text>
                )}
                
            </View>

            {   mode ? (
                    // {/* Button Container for Flashcard Mode */}
                    <View style={{flex:1, flexDirection:'row', justifyContent: 'space-between', padding:20, alignItems:'flex-start'}}>
                        {/* Previous Button */}
                        <CustomButton customStyle={styles.flashcardButtons} onPress={prevCard}>
                            <Icon name={"caret-left"} solid={true} size={20} color={style.gray_500}/>         
                        </CustomButton>

                        {/* Render 0/0 if there are no words  */}
                        { wordData.length === 0 ? (
                            <Text style={{color: style.gray_500, fontSize: style.text_lg, fontWeight: '600', marginTop: 10}}>
                                0 / 0
                            </Text>
                        ) : (
                            <Text style={{color: style.gray_500, fontSize: style.text_lg, fontWeight: '600', marginTop: 10}}>
                                { currentIndex + 1 } / { wordData.length }
                            </Text>
                        )}


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

        {/* Bottom footer that adds top border */}
        <View style={style.baseFooterStyle} />

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
