import { View, Text, StyleSheet, useWindowDimensions, TouchableOpacity, KeyboardAvoidingView, ScrollView} from 'react-native';
import { useContext, useLayoutEffect, useState, useEffect } from 'react';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';

import { Audio } from 'expo-av'

//styles
import * as style from '@/assets/styles/styles'

//custom components
import CustomButton from '@/app/components/CustomButton';
import CustomInput from '@/app/components/CustomInput';

//import dropdown for tag selection
import TagSelection from '../Study/components/TagSelection';
//import HeaderRight
import HeaderRight from './components/HeaderRight';
//import the completion modal
import CompleteModal from './components/CompleteModal';

//get words from the database
import { getWords } from '../DataDecks';

import { isLanguageRTL } from '../../HomeScreen/LanguageSelection/DataLanguages';

import { shuffleArray, compareIgnoringPunctuationAndAccents } from '@/app/data/Functions';

const Practice = () => {

    const route = useRoute();
    const navigation = useNavigation();

    const { currentLang, deckId, deckName } = route.params; 

    const isRTL = isLanguageRTL(currentLang);

    //Reactive variable for selected tag that will be sent over to the TagSelection component
    const [selectedTag, selectTag] = useState("None");

    //Pull the flashcard data from the database based on the deckID and current lang
    const [wordData, setWordData] = useState([]);

    //current index 
    const [currentIndex, setCurrentIndex] = useState(0);
    
    //FRONT FIRST OR BACK FIRST
    const [frontFirst, setFrontFirst] = useState(true);

    //Random Variable
    const [randomOrder, setRandom] = useState(false);

    //Navigation bar data
    useLayoutEffect(() => {
        navigation.setOptions({
            // Set custom text for the back button          
            headerBackTitle: 'Back',
            headerRight: () => (
                <HeaderRight frontFirst={frontFirst} setFrontFirst={setFrontFirst} randomOrder={randomOrder} setRandom={setRandom}  />
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



    //Load the data here

    //current index 
    const maxIndex = wordData.length - 1;

    //current word data
    //this is the data that is sent to the Card component based on the index
    const [currentWordData, setCurrentWordData] = useState("None");

    //Set variable to make sure data has been loaded
    const [isMounted, setIsMounted] = useState(false);

    // Async function to fetch words
    const [loading, setLoading] = useState(true);
    const fetchWords = () => {
        setLoading(true); // Start loading
        try {
            let data = getWords(currentLang, deckId); 

            //Shuffle the order
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

            //set isMounted to true once the data has been loaded
            setIsMounted(true);

        } catch (error) {
            console.error("Error fetching words:", error);
        } finally {
            setLoading(false); // End loading
        }
    };
    
    
    // Effect to update `currentWordData` when `wordData` or `currentIndex` changes
    useEffect(() => {
        if (wordData.length > 0) {
            setCurrentWordData(wordData[currentIndex]);
        }
    }, [wordData, currentIndex]);

    // Fetch words on component mount or if `currentLang` or `deckId` changes
    useEffect(() => {
        fetchWords();
    }, [currentLang, deckId, selectedTag, frontFirst, randomOrder]);
    


    //define a variable for the input text
    const [userInput, setUserInput] = useState("");
    //Allow form to be editable 
    const [isEditable, setIsEditable] = useState(true);

    //variable to toggle the check button container
    const [buttonContainer, toggleButtonContainer] = useState(true);

    //variable to toggle the incorrect banner
    const [incorrectBanner, toggleIncorrectBanner] = useState(false);

    //variable to toggle the correct banner
    const [correctBanner, toggleCorrectBanner] = useState(false);

    //variable to toggle the modal when the practice is complete
    const [completeModal, toggleCompleteModal] = useState(false);

    //generate next question
    const generateNext = () =>{
        //reset the form data
        setUserInput("");

        //allow users to edit it again
        setIsEditable(true);

        //set the banners to false
        toggleCorrectBanner(false);
        toggleIncorrectBanner(false);

        //set the button container to true
        toggleButtonContainer(true);

    }

    //Render the finish modal if the data has been loaded (isMounted = true)
    //Then if the data is less than 1
    useEffect(() => {
        if (isMounted && wordData.length < 1) {
            //toggle end modal
            toggleCompleteModal(true);
        }  
    }, [wordData]);
    

    const answerCorrect = () =>{
        //If it is true then remove it from the wordData object
        setWordData(prevWordData => prevWordData.filter(word => word.term !== currentWordData.term));

        //Generate Next
        generateNext();

    }

    const answerIncorrect = () =>{

        //Push it to the end of wordData
        setWordData((prevWordData) => {
            // Filter Push it to the end of the array
            const filteredData = prevWordData.filter(word => word.term !== currentWordData.term);
            // Add the current term to the end of the array
            return [...filteredData, currentWordData];
        });
        
        //Generate Next
        generateNext();

    }


    const checkButton = async () =>{

        // Determine the correct answer based on `frontFirst`
        const correctAnswer = frontFirst ? currentWordData.translation : currentWordData.term;

        //Hide the button container for both
        toggleButtonContainer(false);

        //Dont allow users to edit the form input
        setIsEditable(false);

        // Compare `userInput` to the `correctAnswer`
        if (compareIgnoringPunctuationAndAccents(userInput, correctAnswer)) {

            // Play the correct sound
            await playCorrectSound();

            //Render the correct banner
            toggleCorrectBanner(true);

        } else {
            //play incorrect sound
            await playIncorrectSound();

            //Else render the incorrect card
            toggleIncorrectBanner(true);
        }
    }

    //create a variable called starred word count that gets the number of starred words
    const [starredWordCount, setStarredWordCount] = useState(0);
    useEffect(()=>{
        const starWordCountCalculate = wordData.filter(word => word.starred === 1).length;
        setStarredWordCount(starWordCountCalculate);
    }, [wordData])

    
    //AUDIO FUNCTIONALITY 
    const [correctSound, setCorrectSound] = useState(null);
    const [incorrectSound, setIncorrectSound] = useState(null);

    const playCorrectSound = async () => {
        if (correctSound) {
            await correctSound.replayAsync();
        }
    };

    const playIncorrectSound = async () => {
        if (incorrectSound) {
            await incorrectSound.replayAsync();
        }
    };

    // Load sounds once on mount, and unload sounds on cleanup
    useEffect(() => {
        const loadSounds = async () => {
            try {
                // Load the correct sound
                const { sound: loadedCorrectSound } = await Audio.Sound.createAsync(
                    require('@/assets/audio/correct.mp3')
                );
                setCorrectSound(loadedCorrectSound);

                // Load the incorrect sound
                const { sound: loadedIncorrectSound } = await Audio.Sound.createAsync(
                    require('@/assets/audio/incorrect.mp3')
                );
                setIncorrectSound(loadedIncorrectSound);
            } catch (error) {
                console.error('Error loading sounds', error);
            }
        };

        loadSounds();

        // Cleanup sounds on unmount
        return () => {
            if (correctSound) {
                correctSound.unloadAsync();
            }
            if (incorrectSound) {
                incorrectSound.unloadAsync();
            }
        };
    }, []);

    //indicator for text alignment
    //front first false is target language , RTL true is Arabic/Hebrew/RTL language
    const getTextDirection = (isRTL, frontFirst) => {
        if (isRTL && !frontFirst) return 'rtl';
        if (!isRTL) return 'ltr';
        return 'ltr';
    };

    const getTextAlignment = (isRTL, frontFirst) => {
        if (isRTL && !frontFirst) return 'right';
        if (!isRTL) return 'left';
        return 'left';
    };

    

    //SCREEN WIDTH AND RESPONSIVE DESIGNS
    // Get screen width dynamically
    const { width } = useWindowDimensions();
    //responsive padding
    const responsiveHorizontalPadding = width < 600 ? 40 : width < 1000 ? 100 : 200;

    return ( 
        <View style={{flex:1, backgroundColor:style.slate_100}}>
        {/* Main Container */}
        <KeyboardAvoidingView behavior={"padding"} style={{ flex: 5 }} keyboardVerticalOffset={0}>
            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{padding: 20, paddingBottom:100}}>

                <View style={[styles.mainContainer, { paddingHorizontal: responsiveHorizontalPadding }]}>
                    {/* Top Container with Tags */}
                    <View style={{flexDirection:'row', justifyContent:'space-between', borderBottomWidth: style.border_md, borderBottomColor:style.gray_200, paddingBottom: 20, zIndex:1}}>
                        {/* Tags selection Dropdown  */}
                        <TagSelection currentLang={currentLang} deckId={deckId} onTagSelect={selectTag} starredWordCount={starredWordCount}/>      

                        {/* Current Index - Progress Count */}
                        <Text style={{color:style.gray_500, fontSize:style.text_md, fontWeight:'700', margin:10}}>
                            { wordData.length } left
                        </Text>          
                    </View>

                        {/* Middle Container - Text and Input */}
                        {/* Render data only if wordData.length > 1 */}
                        { wordData.length > 0 ? (

                            <View style={{flexDirection:'column', justifyContent:'center', gap:30, paddingTop:50, paddingBottom:50}}>

                                {/* Title to translate */}
                                <Text style={{color:style.gray_700, fontSize:style.text_lg, fontWeight:'500', marginLeft:2}}>
                                    Translate to { !frontFirst ? 'English' : currentLang }:
                                </Text>          

                                {/* Text to Translate - from the data */}
                                <Text style={{color:style.gray_600, fontSize:style.text_md, fontWeight:'400', marginLeft:5,
                                              textAlign: getTextAlignment(isRTL, frontFirst), // Align text based on direction
                                              writingDirection: getTextDirection(isRTL, frontFirst), // Ensure proper 
                                }}>
                                    {loading ? (
                                            "Loading..."
                                        ) : (
                                            //Check if frontFirst is true
                                            frontFirst ? (
                                                currentWordData.term// Show `term` if `frontFirst` is true
                                            ) : (
                                                currentWordData.translation// Show `translation` if `frontFirst` is false
                                            )
                                        )}
                                </Text>          

                                {/* Input Form */}
                                <CustomInput showLabel={false} placeholder={"Begin translating here..."} value={userInput} onChangeText={setUserInput}
                                    maxLength={500} multiline={true} 
                                    customStyle={{alignSelf:'stretch'}}
                                    editable={isEditable}
                                    customFormStyle={{padding:20, color:style.gray_600, backgroundColor:style.slate_100, borderColor:style.gray_300, height:200,
                                                      writingDirection: getTextDirection(isRTL, !frontFirst)
                                    }}/>
                            </View>

                        ) : (
                            <View style={{marginTop:60, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{color:style.gray_500, fontSize:style.text_lg, fontWeight:'500'}}>
                                    Not Enough Words
                                </Text>
                            </View>
                        )}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>

        {/* Bottom Containers - depending on user input */}
        { buttonContainer && 
            // {/* Bottom Container with Buttons - outside of the main container*/}
            <View style={{flex:1, backgroundColor:style.white, borderTopWidth:1.5, borderTopColor:style.gray_200}}>
                {/* Button Spacing */}
                <View style={{paddingHorizontal: responsiveHorizontalPadding, flex: 1,
                            flexDirection:'row', justifyContent:'space-between', alignItems:'center', alignContent:'center'}}>
                    {/* Skip Text Button  */}
                    <TouchableOpacity activeOpacity={0.7} onPress={checkButton}>
                        <Text style={{color:style.blue_500, fontWeight:'500', fontSize:style.text_md}}>Skip</Text>
                    </TouchableOpacity>

                    {/* Check Button */}
                    <CustomButton customStyle={{ borderRadius: style.rounded_md}} 
                        onPress={()=>{
                            //check to see if not empty then allow for button to be checked
                            if (!userInput.trim()) {
                                return;
                            } else {
                                checkButton();
                            }
                        }}>
                        <Text style={{color:style.white, fontWeight:'500', fontSize:style.text_md, padding:3}}>Check</Text>
                    </CustomButton>
                </View>
            </View>
        }

        {/* Incorrect Banner */}
        { incorrectBanner && 
            <View style={{flex:1, backgroundColor:style.red_100, padding:20}}>
                <View style={{paddingHorizontal: responsiveHorizontalPadding, flex: 1,
                            flexDirection:'row', justifyContent:'space-between', alignItems:'center', alignContent:'center'}}>

                    {/* Text */}
                    <View style={{flexDirection:'column', gap:8}}>
                        {/* Incorrect Label */}
                        <Text style={{color:style.red_500, fontWeight:'700', fontSize:style.text_lg}}>Incorrect</Text>
                        {/* Text with Correct */}
                        <View style={{flexDirection:'row', gap:2, width:'80%', flexWrap:'wrap'}}>
                            <Text style={{color:style.red_500, fontWeight:'700', fontSize:style.text_sm}}>Correct Answer: </Text>
                            {/* Correction */}
                            <Text style={{color:style.red_500, fontWeight:'500', fontSize:style.text_sm}}>
                                { 
                                    //Check if frontFirst is true
                                    frontFirst ? (
                                        currentWordData.translation.trim() // Show `term` if `frontFirst` is true
                                    ) : (
                                        currentWordData.term.trim() // Show `translation` if `frontFirst` is false
                                    )
                                 }
                            </Text>
                        </View>
                    </View>

                    {/* Continue Button */}

                    <CustomButton customStyle={{backgroundColor:style.red_500}} onPress={answerIncorrect}>
                        <Text style={{color:style.white, fontWeight:'700'}}>Continue</Text>
                    </CustomButton>
                </View>
            </View>
        }

        {/* Correct Banner */}
        { correctBanner && 
            <View style={{flex:1, backgroundColor:style.emerald_200}}>
                <View style={{paddingHorizontal: responsiveHorizontalPadding, flex: 1,
                        flexDirection:'row', justifyContent:'space-between', alignItems:'center', alignContent:'center'}}>

                    {/* Correct Label */}
                    <Text style={{color:style.emerald_500, fontWeight:'700', fontSize:style.text_lg}}>Correct!</Text>

                    {/* Continue Button */}
                    <CustomButton customStyle={{backgroundColor:style.emerald_500}} onPress={answerCorrect}>
                        <Text style={{color:style.white, fontWeight:'700'}}>Continue</Text>
                    </CustomButton>
                </View>
            </View>
        }




        {/* End Modal */}
        {/* Render this modal at the end */}
        { completeModal &&
            <CompleteModal deckName={deckName} deckId={deckId} onClose={()=>toggleCompleteModal(false)}/>
        }


        </View>
     );
}
 
const styles = StyleSheet.create({
    mainContainer: {
        flex: 5,
        backgroundColor: style.slate_100,
        paddingTop: 30,
    },
});

export default Practice;
