
import React, { useState, useContext, useEffect, useRef, useLayoutEffect} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, FlatList, Modal } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';

import Slider from '@react-native-community/slider';

import { Audio } from 'expo-av';
import { audioPaths } from '@/assets/data/AudioData';

//styles
import * as style from '@/assets/styles/styles'
import Icon from '@expo/vector-icons/FontAwesome6';

import { Platform } from 'react-native';


const AudioPlayer = ({audioId, currentLang}) => {

    //variable to set the audio to it
    const [audioSound, setAudioSound] = useState(null);

    //dummy values
    const [audioSize, setAudioSize] = useState(127);

    //current audio time
    const [audioTime, setAudioTime] = useState(0);

    // Track whether the user is dragging
    const [isDragging, setIsDragging] = useState(false);

    //Play button toggled
    const [play, setPlay] = useState(false);

    //UseEffect to load the audio 
    useEffect(() => {

        //get the respective audio link
        const loadAudio = async () => {
            try {
                //get the audio path by inserting current language and audioId from the parent component

                const audioUrl = audioPaths[currentLang][audioId];

                if (audioUrl){

                    await Audio.setAudioModeAsync({
                        playsInSilentModeIOS: true,
                      });
                
                    const { sound } = await Audio.Sound.createAsync(
                        audioUrl
                    );    
                    setAudioSound(sound);    

                    // Set the playback status update to track progress
                    sound.setOnPlaybackStatusUpdate((status) => {
                        if (status.isLoaded && !isDragging) {
                            setAudioTime(status.positionMillis / 1000); // Convert from ms to seconds
                            setAudioSize(status.durationMillis / 1000 || 0); // Convert from ms to seconds
                        }
                    });



                } else {
                    console.log("No data");
                }
            
            } catch (error) {
                console.error("Error loading audio:", error);
            }
        };

        loadAudio();

        return () => {
            if (audioSound) {
                audioSound.unloadAsync();
            }
        };
    }, [audioId, currentLang]);



    //function to toggle audio
    const togglePlay = async () => {
        if (audioSound) {
            if (play) {
                // Pause the audio if currently playing
                await audioSound.pauseAsync();
            } else {
                // Play the audio if currently paused
                await audioSound.playAsync();
            }

            // Toggle the play state
            setPlay(!play);
        } 
    };
    

    //stop the audio if user leaves screen
    useFocusEffect(
        React.useCallback(() => {
            // Cleanup function to stop the audio when leaving the page
            return () => {
                if (audioSound) {
                    audioSound.pauseAsync();
                }
            };
        }, [audioSound])
    );
    
    //Rate and rate dropdown
    //rate dropdown toggled
    const [dropdown, toggleDropdown] = useState(false);

    //dropdown position for the rate dropdown
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const dropdownRef = useRef(null); // Ref to capture the position of the icon
    
    //rates available
    const [rateData, setRateData] = useState([0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2]);
    //Variable will render selected rate
    const [selectedRate, setRate] = useState(1.0);

    //Set dropdown based on position of the target ref
    const handleOpenDropdown = () => {
        if (dropdownRef.current) {
            dropdownRef.current.measure((fx, fy, width, height, px, py) => {
                // Base top position
                const baseTop = py + height;
    
                // Platform-specific adjustments for top
                const adjustedTop = baseTop + 10 // Add offset for Android if needed
    
                // Set the adjusted top and left
                setDropdownPosition({
                    top: adjustedTop,
                    left: px - 70, // Keep left unchanged
                });
    
                toggleDropdown(true);
            });
        }
    };
    

    const rateSelected = async (rate) =>{
        //update selected rate to show in the UI
        setRate(rate);

        //Adjust the rate
        await audioSound.setRateAsync(rate, true); // Adjust the rate

        //close dropdown
        toggleDropdown(false);
    }



    return ( 
        <>
        {/* Main Audio Player Container */}
        <View style={styles.mainPlayer}>

            {/* Player Button */}
            <TouchableOpacity style={styles.playButton} activeOpacity={0.7} onPress={togglePlay}>
                { play ? (
                    <Icon name={'pause'} solid={true} size={18} color={style.white} />
                ) : (
                    <Icon name={'play'} solid={true} size={18} color={style.white} />
                )}
            </TouchableOpacity>


            {/* Time Left */}
            <Text style={{color:style.gray_500, fontWeight:'500'}}>
            {`${Math.floor(Math.round(audioSize - audioTime) / 60)}:${(Math.round(audioSize - audioTime) % 60).toString().padStart(2, '0')}`}
            </Text>

            {/* Scrolling Button */}
            <Slider
                style={{flex: 1, height: 40, width: '100%'}}
                minimumValue={0}
                step={1} // Smaller step for smoother transitions
                maximumValue={audioSize}
                minimumTrackTintColor={style.blue_400}
                thumbTintColor={style.white}
                maximumTrackTintColor={style.gray_400}
                value={audioTime || 0} 
                onValueChange={(value) => {
                    setIsDragging(true); // Set dragging to true
                    setAudioTime(value); // Update audio time while dragging
                }}
                onSlidingComplete={async (value) => {
                    setIsDragging(false); // Reset dragging state when user releases
                    if (audioSound) {
                        await audioSound.setPositionAsync(value * 1000); // Seek to the selected position
                    }
                }}
            />


            {/* Speed - Text Button */}
            <TouchableOpacity ref={dropdownRef} activeOpacity={0.7} onPress={handleOpenDropdown}>
                <Text style={{color:style.gray_500, fontWeight:'500'}}>{selectedRate.toFixed(2)}x</Text>
            </TouchableOpacity>


        </View>


        {/* Select a rate via the dropdown */}
        <Modal transparent={true} visible={dropdown} onRequestClose={() => toggleDropdown(false)} supportedOrientations={['portrait', 'landscape']}>
                {/* Invisible Overlay that can be clicked  */}
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} 
                                onPress={() => {
                                    toggleDropdown(false);
                                }}>
                    {/* Drop down itself */}
                    <View style={[styles.dropdown, dropdownPosition]}>
                        {/* Drop down contents here  */}
                        {rateData.map((rate, index) => (
                            <TouchableOpacity 
                                key={index} 
                                activeOpacity={0.7}
                                onPress={()=>rateSelected(rate)}>
                                <Text style={{ color:style.gray_500, fontWeight:'500', fontSize:style.text_md }}>
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

        paddingLeft:2,

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