
import { View, Text, StyleSheet, useWindowDimensions, TouchableOpacity, KeyboardAvoidingView, ScrollView, Modal} from 'react-native';
import { useContext, useLayoutEffect, useState, useEffect } from 'react';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';

import { Audio } from 'expo-av'

import { CurrentLangContext } from '@/app/data/CurrentLangContext.tsx';

//styles
import * as style from '@/assets/styles/styles'

import { compareIgnoringPunctuationAndAccents } from '@/app/data/Functions';

//custom components
import CustomButton from '@/app/components/CustomButton';
import CustomInput from '@/app/components/CustomInput';


import { shuffleArray, matchSentences } from '@/app/data/Functions';
import React from 'react';

import { isLanguageRTL } from '../HomeScreen/LanguageSelection/DataLanguages';


const PracticeSentence = () => {

    //Variables to pass are text data and translation data
    const route = useRoute();
    const navigation = useNavigation();

    //current language
    const { currentLang } = useContext(CurrentLangContext);

    //Check database to see if the function is RTL (right to left, returns true if it is, false if it is not)
    const isRTL = isLanguageRTL(currentLang);

    const { story, storyTranslation, title, stack, entryId } = route.params; 

    //Functionality to hide the tabBar when it is on the page
    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) {
            // Hide the tab bar when this screen is focused
            navigation.getParent()?.setOptions({
                tabBarStyle: { display: 'none' },
            });
            navigation.setOptions({
                headerBackTitle: 'Back', // Reset the back button title (optional)
            });
    
        } 
    }, [isFocused, navigation]);
                

    //Data variable - this variable will contain the data
    const [sentenceData, setSentenceData] = useState(matchSentences(story, storyTranslation))

    //current index 
    const [currentIndex, setCurrentIndex] = useState(0);

    //current data 
    const [currentSentence, setCurrentSentence] = useState(sentenceData[currentIndex]);
    console.log(currentSentence)

    //Variables 
    //define a variable for the input text
    const [userInput, setUserInput] = useState("");
    //Allow form to be editable 
    const [isEditable, setIsEditable] = useState(true);

    //FRONT FIRST OR BACK FIRST
    const [frontFirst, setFrontFirst] = useState(true);

    //variable to toggle the check button container
    const [buttonContainer, toggleButtonContainer] = useState(true);

    //variable to toggle the incorrect banner
    const [incorrectBanner, toggleIncorrectBanner] = useState(false);

    //variable to toggle the correct banner
    const [correctBanner, toggleCorrectBanner] = useState(false);

    //variable to toggle the modal when the practice is complete
    const [completeModal, toggleCompleteModal] = useState(false);

    //This variable will update the rendered data when it is changed
    useEffect(() => {
        setCurrentSentence(sentenceData[currentIndex]);
    }, [sentenceData, currentIndex]);

    //Render the finish modal if the data has been loaded (isMounted = true)
    //Then if the data is less than 1
    useEffect(() => {
        if (sentenceData.length < 1) {
            //toggle end modal
            toggleCompleteModal(true);
        }  
    }, [sentenceData]);


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

    const answerCorrect = () =>{
        //If it is true then remove it from the data object
        setSentenceData(prevData => prevData.filter(item => item.mainSentence !== currentSentence.mainSentence))

        //Generate Next
        generateNext();

    }

    const answerIncorrect = () =>{

        //Push it to the end of data object
        setSentenceData(prevData => {
            // Filter out the current sentence
            const filteredData = prevData.filter(item => item.mainSentence !== currentSentence.mainSentence);
            // Push the current sentence to the end
            return [...filteredData, currentSentence];
        });
    
        //Generate Next
        generateNext();

    }


    //clock button to check
    const checkButton = async () =>{

        // Determine the correct answer based on `frontFirst`
        const correctAnswer = frontFirst ? currentSentence.translationSentence : currentSentence.mainSentence;

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

                await Audio.setAudioModeAsync({
                    playsInSilentModeIOS: true,
                });

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
        
    
    //Continue click to redirect the complete modal
    const continueClicked = () =>{
        //close the modal
        toggleCompleteModal(false);

        //navigate pages
        if (stack === "Explorer"){
            navigation.navigate('ExplorerReader', {title:title });
        } else {
            //Redirect to reader main story page
            navigation.navigate('ReaderViewer', {entryTitle:title, entryId: entryId });

        }


    }

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

    //UI data for the modal
    //get window width
    const windowWidth = useWindowDimensions().width;
    //if width is mobile < 800, make the width 90%, else make it 80%
    const dynamicWidth = windowWidth < 800 ? '90%' : '80%';  // 90% for mobile, 80% for larger screens

    return ( 
        <View style={{flex:1, backgroundColor:style.slate_100}}>
            {/* Main Container */}
            <KeyboardAvoidingView behavior={"padding"} style={{ flex: 5 }} keyboardVerticalOffset={0}>
                <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{padding: 20, paddingBottom:100}}>

                    <View style={[styles.mainContainer, { paddingHorizontal: responsiveHorizontalPadding }]}>
                        {/* Top Container with Tags */}
                        <View style={{flexDirection:'row', justifyContent:'space-between', borderBottomWidth: style.border_md, borderBottomColor:style.gray_200, paddingBottom: 20, zIndex:1}}>
                            
                            {/* Button here to toggle language to translate to */}
                            <CustomButton onPress={()=>setFrontFirst(!frontFirst)} customStyle={null}>
                                <Text style={{color:style.white}}>Translate to { frontFirst ? 'English' : currentLang }</Text>
                            </CustomButton>

                            {/* Current Index - Progress Count */}
                            <Text style={{color:style.gray_500, fontSize:style.text_md, fontWeight:'700', margin:10}}>
                                {sentenceData.length} left
                            </Text>          
                        </View>

                            {/* Middle Container - Text and Input */}
                            {/* Render data only if wordData.length > 1 */}
                            { sentenceData.length > 0 ? (

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
                                        {
                                            //Check if frontFirst is true
                                            frontFirst ? (
                                                currentSentence.mainSentence // Show `term` if `frontFirst` is true
                                            ) : (
                                                currentSentence.translationSentence// Show `translation` if `frontFirst` is false
                                            )
                                        }
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
                                        Not Enough Sentences
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
                    <TouchableOpacity activeOpacity={0.7} onPress={answerCorrect}>
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
                                        currentSentence.translationSentence 
                                    ) : (
                                        currentSentence.mainSentence
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
            <Modal transparent={true} >
                {/* Backdrop with black opacity */}
                <View style={styles.modalOverlay} >
                    {/* Main Content - White Div */}
                    <View style={[styles.modalContainer, { width: dynamicWidth }]}>
                        {/* Main Content Below - Children Content Here */}
                        <View style={{ paddingHorizontal: 40, paddingTop:30, alignSelf:"stretch", justifyContent:'center', gap:30, alignContent:'center', alignItems:'center' }}>

                            <Text style={{color:style.blue_400, fontSize:style.text_xl, fontWeight:'700'}}>Complete!</Text>
                            <Text style={{color:style.gray_500, textAlign:'center', fontSize:style.text_md, fontWeight:'500'}}>
                                You have succesfully practiced "{ title }"
                            </Text>
                            {/* Continue Button */}
                            <CustomButton onPress={continueClicked} customStyle={null}>
                                <Text style={{color:style.white, fontWeight:'600'}}>Continue</Text>
                            </CustomButton>

                        </View>
                    </View>

                </View>
            </Modal>
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

export default PracticeSentence;