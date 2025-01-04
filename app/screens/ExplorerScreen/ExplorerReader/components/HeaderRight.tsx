
import { useState, useEffect, useRef } from "react";
import { TouchableOpacity, View, Text, StyleSheet, Modal } from "react-native";
import Icon from '@expo/vector-icons/FontAwesome6'
import * as style from '@/assets/styles/styles'

import { wordStoryData } from "../../../../../assets/data/ExplorerData";
import { convertLangFiletoJSON } from "@/app/data/Functions";

import ViewWordModal from "@/app/screens/components/ViewWordModal";
import ViewSentences from "@/app/screens/components/ViewSentences";
import React from "react";

import { Platform } from 'react-native';

const HeaderRight = ({title, currentLang}) => {


    const [buttonClicked, setClick] = useState(false);


    const [viewWords, toggleViewWords] = useState(false);
    const [viewSentences, toggleViewSentences] = useState(false);



    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const iconRef = useRef(null); // Ref to capture the position of the icon

    //Variable to be passed
    const [wordData, setWordData] = useState({});
    let filteredData;

    //function to open view words
    const toggleViewWordsFunc = () =>{
        //close the dropdown/modal 
        setClick(false)

        //get the wordData and set it to a reactive variable
        const jsonWordData = wordStoryData[currentLang];
        if (jsonWordData) {
            //convert the data into a readeble format for the ViewWordModal
            filteredData = jsonWordData[title];
            filteredData = convertLangFiletoJSON(filteredData);
            setWordData(filteredData);
        } 

        //toggle the view words modal
        toggleViewWords(true);
    }

    //function to open view sentences
    const toggleViewSentencesFun = () =>{
        //close the dropdown/modal 
        setClick(false)

        //toggle the view words modal
        toggleViewSentences(true);
    }


    //Set dropdown based on position of the target ref
    const handleOpenDropdown = () => {
        if (iconRef.current) {
            iconRef.current.measure((fx, fy, width, height, px, py) => {
                // Base top position
                const baseTop = py + height;
    
                // Platform-specific adjustments for top
                const adjustedTop = Platform.OS === 'ios' ? baseTop : baseTop - 5; // Add offset for Android if needed
    
                // Set the adjusted top and left
                setDropdownPosition({
                    top: adjustedTop,
                    left: px - 70, // Keep left unchanged
                });
    
                setClick(true);
            });
        }
    };


    return ( 
        <>


            {/* This is the header button that renders - vertical dots */}
            <View ref={iconRef} collapsable={false}>
                <TouchableOpacity onPress={handleOpenDropdown} style={{marginRight:30, width:30, height: 40, alignItems:'center', justifyContent:'center'}} activeOpacity={0.7}>
                    <Icon name={"ellipsis-vertical"} size={20} color={style.gray_500} />
                </TouchableOpacity>
            </View>

            {/* Main Dropdown in the form of a modal */}
            <Modal transparent={true} visible={buttonClicked} onRequestClose={() => setClick(false)} supportedOrientations={['portrait', 'landscape']}>
                {/* Invisible Overlay that can be clicked  */}
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} 
                                onPress={() => {
                                    setClick(false);
                                }}>
                    {/* Drop down itself */}
                    <View style={[styles.dropdownBox, dropdownPosition]}>
                        {/* Drop down contents here  */}
                            {/* View words button */}
                            <TouchableOpacity onPress={toggleViewWordsFunc} activeOpacity={0.7}>
                                <Text style={{color:style.gray_500}}>
                                    View Words 
                                </Text>
                            </TouchableOpacity>     

                            {/* View sentences button */}
                            <TouchableOpacity onPress={toggleViewSentencesFun} activeOpacity={0.7}>
                                <Text style={{color:style.gray_500}}>
                                    View Sentences 
                                </Text>
                            </TouchableOpacity>     

                    </View>    
                </TouchableOpacity>
            </Modal>

            {/* Associated Modals */}
            { viewSentences && 
                <ViewSentences onClose={()=>toggleViewSentences(false)} 
                               modalTitle={title} />
            }
            

            {/* Toggle Word Data Modal If View words is triggered */}
            { viewWords &&
                <ViewWordModal onClose={()=>toggleViewWords(false)} 
                                json={true} 
                                dataProp={wordData} 
                                modalTitle={title} />
            }

            

        </>
     );
}

const styles = StyleSheet.create({
    dropdownBox: {
        position: 'absolute', 
        top: 90, 
        right: 20,
        padding: 15,

        zIndex: 99,

        borderWidth: 1,
        borderColor: style.gray_200,
        borderRadius: style.rounded_md,
        backgroundColor: style.white,
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



export default HeaderRight;