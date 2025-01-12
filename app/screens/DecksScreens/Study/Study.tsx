import { View, Text, StyleSheet, useWindowDimensions, TouchableOpacity, Modal} from 'react-native';
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
import React from 'react';

const Study = () => {

    const route = useRoute();
    const navigation = useNavigation();

    const { currentLang, deckId, deckName } = route.params; 


    //Important variables for the process

    //Flashcard mode - either STUDY MODE or FLASHCARD MODE
    const [mode, setMode] = useState(true);
    
    //FRONT FIRST OR BACK FIRST
    const [frontFirst, setFrontFirst] = useState(true);

    //Random variables
    const [randomOrder, setRandom] = useState(false);
    
    //functionality to hide the navbar
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


    //Logic for the spaced repetition

    //if the study button is clicked, detect the change and generate the words in a structure
    //Each word index in the structure will be matched with a number 
    //each index (key) will have a second value in the key/value pair which is by default 0. If easy is clicked first time it will increment to 1. 
    // (continue off of previous line) Card will only become easy (1) if the second value is 1, meaning it has been clicked twice 
    //1 - easy
    //2 - medium
    //3 - hard

    //spaced repition index frequency
    const [srsData, setSrsData] = useState([]);
    const [dataLoaded, setLoaded] = useState(false);

    useEffect(()=>{
        if (mode === false){
            //generate structure here if mode has been switched to flashcard mode

            //base the data structure off of the wordData
            const newDataStructure = wordData.map((_, index) => ({ [index]: [3,0] }));
            setSrsData(newDataStructure);

            setLoaded(true);

        }
    }, [mode, selectedTag])


    //function to rearrange the cards based on the first index of the value in the key value pair
    const rearrange = () => {
        setSrsData((prevData) => {
          const sortedData = [...prevData].sort((a, b) => {
            const aValue = Object.values(a)[0]; // Access the array value of the current object
            const bValue = Object.values(b)[0];
      
            if (bValue[0] === aValue[0]) {
              return aValue[1] - bValue[1]; // Secondary sort by the second value in ascending order
            }
            return bValue[0] - aValue[0]; // Primary sort by the first value in descending order
          });
      
          return sortedData; // Return the sorted data
        });
      
        console.log("srsData after sorting:", srsData);
    };
            
    //Next card function
    const nextCardSRS = () => {

        //rearrange the data
        rearrange();

        setCurrentIndex((prevIndex) => {
            let newIndex = prevIndex;
    
            // Loop to find the next card that is not easy (currentCard[key][0] !== 1)
            do {
                newIndex = (newIndex + 1) % srsData.length; // Increment index and wrap around if needed
                const currentCard = srsData[newIndex];
                const key = Object.keys(currentCard)[0];
    
                // Check if the card is not easy
                if (currentCard[key][0] !== 1) {
                    break; // Exit the loop when a valid card is found
                }
            } while (newIndex !== prevIndex); // Stop if we've looped back to the original card
    
            return newIndex; // Return the index of the next valid card
        });
    };
      
    //button functions
    const hardButton = () => {
        setSrsData((prevData) => {
          const updatedData = [...prevData]; // Create a shallow copy
          const currentCard = updatedData[currentIndex]; // Get the current card
          const key = Object.keys(currentCard)[0]; // Extract the key as a string (e.g., "0")
      
          if (currentCard[key]) {
            currentCard[key][0] = 3; // Update the first index in the value array
          }
      
          return updatedData; // Return updated array
        });
      
        // Go to the next card
        nextCardSRS();
    };
      
    const mediumButton = () => {
        setSrsData((prevData) => {
            const updatedData = [...prevData];
            const currentCard = updatedData[currentIndex];
            const key = Object.keys(currentCard)[0];
        
            if (currentCard[key]) {
            currentCard[key][0] = 2; // Update the first index in the value array to 2
            }
        
            return updatedData;
        });
        
        nextCardSRS();
    };
      
    const easyButton = () => {
        setSrsData((prevData) => {
          const updatedData = [...prevData];
          const currentCard = updatedData[currentIndex];
          const key = Object.keys(currentCard)[0];
      
        if (currentCard[key]) {
            currentCard[key][0] = 1; // Update the first index in the value array to 2
        }
        


        //   if (currentCard[key]) {
        //     if (currentCard[key][1] === 0) {
        //       currentCard[key][1] = 1; // Update the second index in the value array to 1
        //     } else if (currentCard[key][1] === 1) {
        //       currentCard[key][0] = 1; // Update the first index in the value array to 1
        //     }
        //   }
      
          return updatedData;
        });
      
        nextCardSRS();
    };

    //function counts
    const countHard = () => {
        const count = srsData.filter((item) => {
          const value = Object.values(item)[0]; // Get the value array from the object
          return value[0] === 3; // Check if the first index is 3
        }).length;
      
        return count;
      };
      
    //count medium
    const countMedium = () => {
        const count = srsData.filter((item) => {
            const value = Object.values(item)[0]; // Get the value array from the object
            return value[0] === 2; // Check if the first index is 3
        }).length;
        
        return count;
    };
      
    //count medium
    const countEasy = () => {
        const count = srsData.filter((item) => {
            const value = Object.values(item)[0]; // Get the value array from the object
            return value[0] === 1; // Check if the first index is 3
        }).length;
        
        return count;
    };
    

    //trigger the completion modal when the number of easy words reaches the number of words in the object
    const [modalComplete, setComplete] = useState(false);

    //useEffect to check if the number of easy words reaches the number of words in the object
    useEffect(()=>{
        if (dataLoaded){
            if (srsData.length === countEasy()){
                setComplete(true);
            }
        }

    }, [srsData])

    const continueClicked = () =>{
        //close the modal
        setComplete(false);

        //navigate pages
        navigation.navigate("UserDeck", { deckName: deckName, deckId: deckId });

    }
  

    
    //SCREEN WIDTH AND RESPONSIVE DESIGNS
    // Get screen width dynamically
    const { width } = useWindowDimensions();
    //responsive padding
    const responsiveHorizontalPadding = width < 600 ? 40 : width < 1000 ? 100 : 200;


    //if width is mobile < 800, make the width 90%, else make it 80%
    const dynamicWidth = width < 800 ? '90%' : '80%';  // 90% for mobile, 80% for larger screens

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
            <View style={{flex:2, alignItems:'center', justifyContent:'center', zIndex:0}}>

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
                    <View style={{flexDirection:'column', gap:15}}>
                        {/* Button */}
                        <CustomButton customStyle={{backgroundColor:style.red_400}} onPress={hardButton}>
                            <Text style={{fontSize:style.text_lg, color:style.white, fontWeight:"500"}}>Hard</Text>
                        </CustomButton>
                        {/* Cards left */}
                        <Text style={{color: style.red_400, fontSize: style.text_lg, fontWeight: '600', textAlign:'center'}}>
                            {countHard()}
                        </Text>
                    </View>
                    {/* Medium Button */}
                    <View style={{flexDirection:'column', gap:15}}>
                        {/* Button */}
                        <CustomButton customStyle={{backgroundColor:"#2dd4bf"}} onPress={mediumButton}>
                            <Text style={{fontSize:style.text_lg, color:style.white, fontWeight:"500"}}>Medium</Text>
                        </CustomButton>
                        {/* Cards left */}
                        <Text style={{color: '#2dd4bf', fontSize: style.text_lg, fontWeight: '600', textAlign:'center'}}>
                            {countMedium()}
                        </Text>
                    </View>

                    {/* Easy Button */}
                    <View style={{flexDirection:'column', gap:15}}>
                        {/* Button */}
                        <CustomButton customStyle={null} onPress={easyButton}>
                            <Text style={{fontSize:style.text_lg, color:style.white, fontWeight:"500"}}>Easy</Text>
                        </CustomButton>
                        {/* Cards left */}
                        <Text style={{color: style.blue_400, fontSize: style.text_lg, fontWeight: '600', textAlign:'center'}}>
                            {countEasy()}
                        </Text>
                    </View>
                </View>
            )
            }




        </View>

        {/* Completion Modal for the spaced repition */}
        { modalComplete &&
            <Modal transparent={true} supportedOrientations={['portrait', 'landscape']}>
                {/* Backdrop with black opacity */}
                <View style={styles.modalOverlay} >
                    {/* Main Content - White Div */}
                    <View style={[styles.modalContainer, { width: dynamicWidth }]}>

                        {/* Main Content Below - Children Content Here */}
                        <View style={{ paddingHorizontal: 40, paddingTop:30, alignSelf:"stretch", justifyContent:'center', gap:30, alignContent:'center', alignItems:'center' }}>

                            <Text style={{color:style.blue_400, fontSize:style.text_xl, fontWeight:'700'}}>Complete!</Text>
                            <Text style={{color:style.gray_500, textAlign:'center', fontSize:style.text_md, fontWeight:'500'}}>
                                You have succesfully practiced "{deckName}"!
                            </Text>

                            {/* Continue Button */}
                            <CustomButton onPress={continueClicked} customStyle={null}>
                                <Text style={{color:style.white, fontWeight:'600'}}>Back to Deck</Text>
                            </CustomButton>

                        </View>
                    </View>

                </View>
            </Modal>
        }


        </>
     );
}
 
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: style.slate_100,
        paddingTop: 30,
        flexDirection:'column',
        gap:30
    },
    flashcardButtons:{
        backgroundColor: style.gray_200, 
        borderWidth:style.border_sm, 
        borderColor:style.gray_300,
        width:60,
        height: 50
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)', 
    },
    modalContainer: {
        backgroundColor: style.white,
        borderRadius: 20,
        width: '80%',
        alignItems: 'center',
        paddingBottom: 30
    },
    
});

export default Study;
