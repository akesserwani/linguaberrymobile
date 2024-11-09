import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import * as style from '@/assets/styles/styles';
import Icon from '@expo/vector-icons/FontAwesome6'

import { toggleStar, getStarred } from '../../DataDecks';

const Card = ({wordData, currentLang, deckId, frontFirst}) => {
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

    useEffect(()=>{
        setStarred(getStarred(currentLang, deckId, wordData.term));
    })

    //toggle starred
    const toggleStarred = () =>{
        //toggle the variable in the database
        toggleStar(currentLang, deckId, wordData.term);

        //toggle the reactive variable
        setStarred(!starred);
    }


    return (
        <TouchableOpacity onPress={flipCard} activeOpacity={0.7} style={{ width: '100%' }}>
            <View style={styles.cardContainer}>
                {/* Flipping background card */}
                <Animated.View style={[styles.card, { transform: [{ rotateY }], borderColor: starred ? '#facc15' : style.gray_200 }]}>
                    {/* This is just the background, no text here */}
                </Animated.View>
                
                {/* Stationary text overlay */}
                <View style={styles.textContainer}>
                    {/* Top Container with the Star Button on top right */}
                    <View style={{flex:1, alignItems:'flex-end', padding:15}}>
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
                    <View style={{flex:4, alignItems:'center', marginTop:20}}>
                        <Text style={{fontSize:style.text_md, color:style.gray_600, fontWeight:'400'}}>
                            {/* Change value based on whether card and front first variable */}
                            { (!flipped && frontFirst) || (flipped && !frontFirst) ? (
                                wordData.term
                            ) : (
                                wordData.translation
                            ) }

                        </Text>
                    </View>

                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        width: '100%', // Full width of parent
        aspectRatio: 1.5, // Optional: controls height relative to width
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        position: 'absolute',
        backgroundColor: style.white,
        borderWidth: style.border_sm,
        height: '100%',
        width: '100%',
        borderRadius: style.rounded_md

    },
    textContainer: {
        height: '100%',
        width: '100%',
        flexDirection:'column'
    },
});

export default Card;
