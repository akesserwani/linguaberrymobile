import React, { useState, useContext, useEffect } from 'react';
import { Text, View, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import * as style from '@/assets/styles/styles';
import Icon from '@expo/vector-icons/FontAwesome6';
import { ScrollView } from 'react-native-gesture-handler';

import { CurrentLangContext } from '@/app/data/CurrentLangContext.tsx';

//database functions
import { getWordData } from '../../DataReader';

const TooltipComponent = ({ entryId, contents, refresh }) => {

    //current language
    const { currentLang } = useContext(CurrentLangContext);

    //function to get the word_data from the database
    const [entryData, setEntryData] = useState(null);
    
    useEffect(()=>{
        const word_data = getWordData(entryId, currentLang);
        setEntryData(word_data);
    },[refresh])

    //function to clean the string
    const cleanString = (str) => {
        return str.trim().replace(/[^\w\s]/g, ""); 
    };
        
    const [visibleTooltip, setVisibleTooltip] = useState(null);

    // Split the contents into words
    const words = contents.split(' ');

    // Set the selected word
    const [selectedWord, setWord] = useState("");

    // Modal state
    const [bottomPopup, setPopup] = useState(false);

    // Get the translation for the selected word
    const getTranslation = (term) => {
        if (!entryData || !Array.isArray(entryData)) {
            return "Translation not found"; 
        }
    
        const foundItem = entryData.find(item => item.term === selectedWord);
        return foundItem ? cleanString(foundItem.translation) : "Translation not found";
    };

    // Get the notes for the selected word
    const getNotes = (term) => {
        if (!entryData || !Array.isArray(entryData)) {
            return "none"; 
        }
    
        const foundItem = entryData.find(item => item.term === selectedWord);
        return foundItem ? cleanString(foundItem.notes) : "none";
    };
        
    
    return (
        <>
            {/* Render the Text */}
            <View style={{ flexWrap: 'wrap', flexDirection: 'row', marginBottom:200 }}>
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
                            <View style={[visibleTooltip === index && styles.highlightedWordWrapper]}>
                                <Text style={styles.word}>{word}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>


            {/* Bottom Popup for the Word Data */}
            <Modal transparent={true} visible={bottomPopup} onRequestClose={() => setPopup(false)} >

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
                    <ScrollView contentContainerStyle={{paddingBottom:80, marginTop:20}}>
                        {/* Modal Header */}
                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                            {/* Title Text */}
                            <View style={{width:'60%'}}>
                                <Text style={{fontSize: style.text_lg, color: style.gray_600, fontWeight:'600', marginTop:10}}>
                                    { cleanString(selectedWord) }
                                </Text>
                            </View>

                            {/* Button container on far right */}
                            <View style={{flexDirection:'row', gap: 20, padding:5, marginRight:20}}>
                                {/* Button To Add Card to Deck */}
                                <TouchableOpacity activeOpacity={0.7}>
                                    <Icon name={'highlighter'} size={25} color={style.gray_400} />
                                </TouchableOpacity>

                                {/* Button to highlight word */}
                                <TouchableOpacity activeOpacity={0.7}>
                                    <Icon name={'plus'} size={25} color={style.gray_400} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {/* Translation here */}
                        <Text style={{fontSize: style.text_lg, color: style.gray_600, marginTop:20}}>
                            { getTranslation(selectedWord) }
                        </Text>
                        {/* notes here */}
                        <View style={{marginTop:20, borderTopWidth: 1, borderTopColor:style.gray_300, paddingTop:20, flexDirection:'row', gap:5}}>
                            <Text style={{fontSize: style.text_md, color: style.gray_600, fontWeight:'600'}}>
                                Notes: 
                            </Text>
                            <Text style={{fontSize: style.text_md, color: style.gray_600}}>
                               {getNotes(selectedWord)} 
                            </Text>
                        </View>
                    </ScrollView>

                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    wordContainer: {
        marginRight: 4,
        position: 'relative',
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
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.2)', // Semi-transparent overlay

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
