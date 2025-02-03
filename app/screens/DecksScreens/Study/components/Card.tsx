import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import * as style from '@/assets/styles/styles';
import Icon from '@expo/vector-icons/FontAwesome6'

//import custom modal
import CustomModal from '@/app/components/CustomModal';

import { toggleStar, getStarred } from '../../DataDecks';
import { ScrollView } from 'react-native-gesture-handler';

const Card = ({wordData, setWordData, currentLang, deckId, frontFirst, currentIndex}) => {
    const rotation = useRef(new Animated.Value(0)).current;
    const [flipped, setFlipped] = useState(false);

    const flipCard = () => {
        const toValue = flipped ? 0 : 180;
        setFlipped(!flipped);

        Animated.timing(rotation, {
            toValue,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const rotateY = rotation.interpolate({
        inputRange: [0, 180],
        outputRange: ['0deg', '180deg'],
    });


    //starred functionalities 
    const [starred, setStarred] = useState(null);

    //Toggle notes modal
    const [modalOpen, toggleModal] = useState(false);

    useEffect(()=>{
        setStarred(getStarred(currentLang, deckId, wordData.term));
    })

    //toggle starred
    const toggleStarred = () =>{
        //toggle the variable in the database
        toggleStar(currentLang, deckId, wordData.term);
        
        //edit the word data to toggle the starred word in wordData  
        setWordData(prevWordData =>
            prevWordData.map(word =>
                word.term === wordData.term
                    ? { ...word, starred: word.starred === 1 ? 0 : 1 } // Toggle starred value
                    : word // Leave other words unchanged
            )
        );    

        //toggle the reactive variable
        setStarred(!starred);
    }

    //function to get part of speech from notes
    const getPartOfSpeech = (text) => {
        // Use a regular expression to match content between brackets
        const match = text.match(/\[([a-zA-Z]+)\]/);
        // Return the first group match truncated to 5 characters or null if not found
        return match ? match[1].substring(0, 5) : null;
    };

    //check to see if currentIndex was changed, if it was changed then set flipped to true
    useEffect(()=>{
        if (flipped){
            flipCard();
        }
    },[currentIndex])


    return (
        <>
        <TouchableOpacity onPress={flipCard} activeOpacity={0.7} style={{ width: '100%' }}>
            <View style={styles.cardContainer}>
                {/* Flipping background card */}
                <Animated.View style={[styles.card, { transform: [{ rotateY }], borderColor: starred ? '#facc15' : style.gray_200 }]}>
                    {/* This is just the background, no text here */}
                </Animated.View>
                
                {/* Stationary text overlay */}
                <View style={styles.textContainer}>
                    {/* Top Container with the Star Button on top right, notes button on left */}
                    <View style={{flexDirection:'row', justifyContent:'space-between', padding:15}}>
                        {/* Notes Buton- toggle modal */}
                        <TouchableOpacity onPress={()=>toggleModal(true)} activeOpacity={0.7}>
                            <Icon name={"list"} solid={true} size={20} color={style.gray_300}/>     
                        </TouchableOpacity>

                        {/* Only show starred button if practice mode is off */}
                        {/* Star Button */}
                        <TouchableOpacity onPress={toggleStarred} activeOpacity={0.7}>
                            { starred ? (
                                <Icon name={"star"} solid={true} size={20} color={"#facc15"}/>     
                            ) : (
                                <Icon name={"star"} solid={true} size={20} color={style.gray_300}/>     
                            )                            
                            }
                        </TouchableOpacity>

                    </View>

                    {/* CARD TEXT HERE */}
                    {/* Bottom Container with full text */}
                    <View style={{flex:1, alignItems:'center', justifyContent:'center', marginTop:10, padding:20, flexDirection:'row', gap:10}}>
                        <Text style={{fontSize:style.text_md, color:style.gray_600, fontWeight:'600'}}>
                            {/* Change value based on whether card and front first variable */}
                            { (!flipped && frontFirst) || (flipped && !frontFirst) ? (
                                wordData.term
                            ) : (
                                wordData.translation
                            ) }

                        </Text>

                        {/* Part of Speech */}
                        <Text style={{fontSize:style.text_md, color:style.gray_400, fontWeight:'500', fontStyle:'italic'}}>
                            { getPartOfSpeech(wordData.notes) }
                        </Text>

                    </View>

                </View>
            </View>
        </TouchableOpacity>


        {/* Notes information modal */}
        { modalOpen && 
            <CustomModal title='Notes' onClose={()=>toggleModal(false)} >

                <ScrollView style={{position:'relative', bottom:15}}>
                    <Text style={{color:style.gray_600, fontSize: style.text_md, fontWeight: '600', marginTop: 20}}>Term: </Text>
                    <Text style={{color:style.gray_500, fontSize: style.text_md, fontWeight: '500', marginTop: 20}}>
                        { wordData.term }
                    </Text>

                    <Text style={{color:style.gray_600, fontSize: style.text_md, fontWeight: '600', marginTop: 20}}>Translation: </Text>
                    <Text style={{color:style.gray_500, fontSize: style.text_md, fontWeight: '500', marginTop: 20}}>
                        { wordData.translation }
                    </Text>

                    <Text style={{color:style.gray_600, fontSize: style.text_md, fontWeight: '600', marginTop: 20}}>Notes: </Text>
                    <Text style={{color:style.gray_500, fontSize: style.text_md, fontWeight: '500', marginTop: 20}}>
                        { wordData.notes }

                    </Text>
                </ScrollView>

            </CustomModal>
        }
        

    </>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        width: '100%', // Full width of parent
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        position: 'absolute',
        backgroundColor: style.white,
        borderWidth: style.border_md,
        height: '100%',
        width: '100%',
        borderRadius: style.rounded_md

    },
    textContainer: {
        height: '100%',
        width: '100%',
        flexDirection:'column',
    },
});

export default Card;
