import React, { useState, useContext, useEffect } from 'react';
import { Text, View, TouchableOpacity, Modal, StyleSheet, Platform } from 'react-native';
import * as style from '@/assets/styles/styles';
import Icon from '@expo/vector-icons/FontAwesome6';
import { ScrollView } from 'react-native-gesture-handler';

import { CurrentLangContext } from '@/app/data/CurrentLangContext.tsx';

import { RTLlanguages } from '@/app/data/LangData';


import AddWordToDeck from '@/app/screens/components/AddWordToDeck';

import { storyFiles, wordStoryData, toggleHighlightedWord, getHighlightedWords } from '../../../../../assets/data/ExplorerData';

const TooltipComponent = ({ title }) => {

    //function to clean the string
    const cleanString = (str) => {
        return str.trim().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
    };
    
    //current language
    const { currentLang } = useContext(CurrentLangContext);
    //Check to see direction of language
    const isRTL = RTLlanguages.includes(currentLang);
    

    //story contents, this text will be broken up and made interactive
    const [storyContents, setContents] = useState("");

    //function to get the word data to be used as translations for the tooltip
    const [wordData, setWordData] = useState(null);

    useEffect(() => {
        const loadData = () => {
            //get the JSON data 

            //Set the storyData 
            const jsonStory = storyFiles[currentLang]; 
            if (jsonStory) {
                const filteredStory = jsonStory.filter(item => item.title === title);

                //set the story contents 
                setContents(filteredStory[0].story_translation)
            } 

            //Set the entryData 
            const jsonWordData = wordStoryData[currentLang];
            if (jsonWordData) {
                const filteredData = jsonWordData[title];

                //set the wordData 
                setWordData(filteredData);

            } 

        };
    
        loadData();
    }, [currentLang]); // Re-run whenever `currentLang` changes

        

    // Split the contents into words in the target language
    const words = storyContents.split(' ');

    const [visibleTooltip, setVisibleTooltip] = useState(null);

    // Set the selected word
    const [selectedWord, setWord] = useState("");

    // Modal state
    const [bottomPopup, setPopup] = useState(false);

    // Get the translation for the selected word
    const getTranslation = (term) => {
        if (!wordData) {
            return "Translation not found"; // Handle case when wordData is null or undefined
        }
    
        const cleanedTerm = cleanString(term); // Clean the input term
        const foundTranslation = wordData[cleanedTerm]; // Access the translation directly
    
        return foundTranslation ? foundTranslation : "Translation not found";
    };
    

    //function to add term, translation, and notes to deck
    //Create reactive variable to trigger whether we want to show AddWordToDeck Component or not
    const [addToDeck, toggleAddWord] = useState(false);


    //reactive variable that gets the higlighted words
    const [highlightedWords, setHiglightedWords] = useState([]);

    //Set highlighted words from dataase to reactive variable
    useEffect(()=>{
        const data = getHighlightedWords(title, currentLang);
        setHiglightedWords(data);

    },[selectedWord, currentLang])
    //update everytime a new word is selected

    //Funciton to highlight word
    const toggleHighlight = () =>{
        
        //function to add the highlighted word
        toggleHighlightedWord(selectedWord, title, currentLang)

        //close the modal
        setPopup(false);
        //deselect the word 
        setWord("");
        setVisibleTooltip(null);
    }
    


    return (
        <>

            {/* Render the Text */}
            <View style={{ flexWrap: 'wrap', flexDirection: 'row', marginBottom:60, direction:isRTL ? 'rtl' : 'ltr' }}>
                {words.map((word, index) => (
                    <View key={index} style={styles.wordContainer}>
                        {/* Individual Word */}
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => {
                                setVisibleTooltip(index);
                                setWord(word);
                                setPopup(true);
                            }}>
                            <View style={[
                                visibleTooltip === index && styles.highlightedWordWrapper, // Highlight the selected word
                                highlightedWords.includes(word) && styles.yellowBackground // Highlight words in the highlightedWords array
                            ]}>
                                <Text style={[styles.word]}>{word}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>


            {/* Trigger the add word to deck Modal */}
            { addToDeck && 
            <AddWordToDeck 
                onClose={()=>toggleAddWord(false)} 
                wordToAdd={
                [ cleanString(selectedWord), 
                    getTranslation(selectedWord),
                    "none"
                ]}/>
            }

            {/* BOTTOM POPUP */}
            {/* Bottom Popup for the Word Data */}
            <Modal transparent={true} visible={bottomPopup} onRequestClose={() => setPopup(false)} supportedOrientations={['portrait', 'landscape']}>
                {/* Opaque overlay will be clickable to dimiss the modal  */}
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} 
                                onPress={() => {
                                    setPopup(false);
                                    setWord("");
                                    setVisibleTooltip(null);
                                }}>
                </TouchableOpacity>
                
                {/* This is the bottom container that will render - takes up 25% screen height */}
                <View style={styles.modalContent}>
                    <ScrollView contentContainerStyle={{paddingBottom:80, marginTop:20}} >
                        {/* Modal Header */}
                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                            {/* Title Text */}
                            <View style={{width:'60%'}}>
                                <Text style={{fontSize: style.text_lg, color: style.gray_600, fontWeight:'600', marginTop:10}}>
                                    { cleanString(selectedWord) }
                                </Text>
                            </View>

                            {/* Button Containers on Right */}
                            <View style={{flexDirection:'row', gap:10, marginRight:10}}>
                                {/* Button to highlight a word */}
                                <TouchableOpacity style={{marginRight:20, marginTop: 5}} 
                                        onPress={toggleHighlight} activeOpacity={0.7}>
                                    <Icon name={'highlighter'} size={28} color={style.gray_400} />
                                </TouchableOpacity>

                                {/* Button to add word to deck  */}
                                <TouchableOpacity style={{marginRight:20, marginTop: 5}} onPress={()=>{
                                    //close the bottom popup to allow the modal to open
                                    setPopup(false);
                                    //toggle the modal
                                    setTimeout (() => toggleAddWord(true), Platform.OS ==="ios" ? 200 : 0);
                                    
                                }
                                } activeOpacity={0.7}>
                                    <Icon name={'plus'} size={28} color={style.gray_400} />
                                </TouchableOpacity>
                            </View>

                        </View>
                        {/* Translation here */}
                        <Text style={{fontSize: style.text_lg, color: style.gray_600, marginTop:20}}>
                            { getTranslation(selectedWord).toLowerCase() }
                        </Text>
                    </ScrollView>

                </View>
            </Modal>

        </>
    );
}

const styles = StyleSheet.create({
    wordContainer: {
        marginRight: 4,
        position: 'relative',
        paddingHorizontal:1,
        paddingVertical:2

    },
    word: {
        color: style.gray_700,
        fontSize: style.text_lg,
        fontWeight: '400',
        zIndex: 0,
    
    },
    highlightedWordWrapper: {
        backgroundColor: style.blue_200, 
        borderRadius: 5, 
        paddingHorizontal: 3,
    },
    yellowBackground: {
        backgroundColor: "#fde047", // Add yellow background for highlighted words
        borderRadius: 5,
        paddingHorizontal: 3,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.1)', // Semi-transparent overlay

    },
    modalContent: {
        flexDirection:'column',
        gap:20,
        backgroundColor: style.white,
        paddingLeft: 20,
        height: '25%',
        borderWidth:1,
        borderColor: style.gray_300,
    },
});

export default TooltipComponent;
