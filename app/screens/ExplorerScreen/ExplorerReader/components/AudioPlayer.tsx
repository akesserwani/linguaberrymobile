
import React, { useState, useContext, useEffect, useRef, useLayoutEffect} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, FlatList, Modal } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation, useRoute, useFocusEffect, useIsFocused } from '@react-navigation/native';

import Slider from '@react-native-community/slider';

//styles
import * as style from '@/assets/styles/styles'
import Icon from '@expo/vector-icons/FontAwesome6';


const AudioPlayer = ({title, currentLang}) => {

    //dummy values
    const [audioSize, setAudioSize] = useState(127);

    //current audio time
    const [audioTime, setAudioTime] = useState(0);

    // Track whether the user is dragging
    const [isDragging, setIsDragging] = useState(false);


    //Play button toggled
    const [play, togglePlay] = useState(false);


    //Rate and rate dropdown
    //rate dropdown toggled
    const [dropdown, toggleDropdown] = useState(false);
    //rates available
    const [rateData, setRateData] = useState([0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]);
    //Variable will render selected rate
    const [selectedRate, setRate] = useState(1);
    const rateSelected = (rate) =>{
        //update selected rate
        setRate(rate);

        //close dropdown
        toggleDropdown(false);
    }



    return ( 
        <>
        {/* Main Audio Player Container */}
        <View style={styles.mainPlayer}>

            {/* Player Button */}
            <TouchableOpacity style={styles.playButton} activeOpacity={0.7} onPress={()=>togglePlay(!play)}>
                { play ? (
                    <Icon name={'pause'} solid={true} size={18} color={style.white} />
                ) : (
                    <Icon name={'play'} solid={true} size={18} color={style.white} />
                )}
            </TouchableOpacity>


            {/* Time Left */}
            <Text style={{color:style.gray_500, fontWeight:'500'}}>{(audioSize - audioTime).toFixed(0)}s</Text>

            {/* Scrolling Button */}
            <Slider
                style={{flex:1}}
                minimumValue={0}
                step={1} // Smaller step for smoother transitions
                maximumValue={audioSize}
                minimumTrackTintColor={style.blue_400}
                thumbTintColor={style.white}
                maximumTrackTintColor={style.gray_400}
                value={audioTime}
                onValueChange={(value) => {
                    setIsDragging(true); // Set dragging to true
                    setAudioTime(value); // Update audio time while dragging
                }}
                onSlidingComplete={() => setIsDragging(false)} // Reset dragging state when user releases
                />


            {/* Speed - Text Button */}
            <TouchableOpacity activeOpacity={0.7} onPress={()=>toggleDropdown(true)}>
                <Text style={{color:style.gray_500, fontWeight:'500'}}>{selectedRate.toFixed(2)}x</Text>
            </TouchableOpacity>


        </View>


        {/* Select a rate via the dropdown */}
        <Modal transparent={true} visible={dropdown} onRequestClose={() => toggleDropdown(false)}>
                {/* Invisible Overlay that can be clicked  */}
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} 
                                onPress={() => {
                                    toggleDropdown(false);
                                }}>
                    {/* Drop down itself */}
                    <View style={styles.dropdown}>
                        {/* Drop down contents here  */}
                        {rateData.map((rate, index) => (
                            <TouchableOpacity 
                                key={index} 
                                activeOpacity={0.7}
                                onPress={()=>rateSelected(rate)}>
                                <Text style={{ color:style.gray_500, fontWeight:'500' }}>
                                    {rate.toFixed(2)}x
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>    
                </TouchableOpacity>
            </Modal>

        </>
     );
}

const styles = StyleSheet.create({
    mainPlayer: {
        minHeight:'8%',
        maxHeight:'12%',
        backgroundColor: style.gray_200,
        borderRadius: style.rounded_md,
        borderWidth:style.border_sm,
        borderColor:style.gray_300,

        flexDirection:'row',
        justifyContent:'space-between',
        gap:15,
        alignItems:'center',
        paddingHorizontal:20,

    },    
    playButton:{
        backgroundColor:style.blue_400,
        aspectRatio:1,
        height:40,
        width:40,
        borderRadius: 20,

        justifyContent:'center',
        alignItems:'center',
        alignContent:'center',
    },

    dropdown: {
        position: 'absolute', 
        top: 180, 
        right: 45,
        padding: 15,

        zIndex: 99,

        borderWidth: 1,
        borderColor: style.gray_300,
        borderRadius: style.rounded_md,
        backgroundColor: style.gray_200,
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 4,
        elevation: 2,       

        flexDirection:"column",
        gap: 25,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0)',
    },
});

 
export default AudioPlayer;