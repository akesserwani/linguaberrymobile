
import { useState, useRef } from "react";
import { TouchableOpacity, View, Text, StyleSheet, Modal } from "react-native";
import Icon from '@expo/vector-icons/FontAwesome6'
import * as style from '@/assets/styles/styles'
import React from "react";

import { Platform } from 'react-native';

const HeaderRight = ({frontFirst, setFrontFirst, randomOrder, setRandom }) => {

    const [buttonClicked, setClick] = useState(false);

    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const iconRef = useRef(null); // Ref to capture the position of the icon


    const [displayFirst, setDisplayFirst] = useState(frontFirst);
    const setFrontFirstFunc = () =>{
        setFrontFirst(prevMode => !prevMode); 
        setDisplayFirst(!displayFirst);

        //close the dropdown
        setClick(false)
    }


    const [randomOrderVar, setRandomOrderVar] = useState(randomOrder);
    const setRandomOrderFunc = () =>{
        setRandom(prevMode => !prevMode); 
        setRandomOrderVar(!randomOrderVar);

        //close the dropdown
        setClick(false)
    }

    //Set dropdown based on position of the target ref
    const handleOpenDropdown = () => {
        if (iconRef.current) {
            iconRef.current.measure((fx, fy, width, height, px, py) => {
                // Base top position
                const baseTop = py + height;
    
                // Platform-specific adjustments for top
                const adjustedTop = Platform.OS === 'ios' ? baseTop : baseTop - 17; // Add offset for Android if needed
    
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
        <View ref={iconRef} collapsable={false}>
            <TouchableOpacity onPress={handleOpenDropdown} style={{marginRight:30, width:30, height: 40, alignItems:'center', justifyContent:'center'}} activeOpacity={0.7}>
                <Icon name={"ellipsis-vertical"} size={20} color={style.gray_500} />
            </TouchableOpacity>
        </View>

            {/* Main Dropdown in the form of a modal */}
            <Modal transparent={true} visible={buttonClicked} onRequestClose={() => setClick(false)}>
                {/* Invisible Overlay that can be clicked  */}
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} 
                                onPress={() => {
                                    setClick(false);
                                }}>

                    <View style={[styles.dropdownBox, dropdownPosition]}>
                        {/* Front First */}
                        <TouchableOpacity onPress={setFrontFirstFunc} activeOpacity={0.7}>
                            <Text style={{color:style.gray_500}}>
                                { displayFirst ? 'Back First' : 'Front First' }
                            </Text>
                        </TouchableOpacity>           

                        {/* Random order */}
                        <TouchableOpacity onPress={setRandomOrderFunc} activeOpacity={0.7}>
                            <Text style={{color:style.gray_500}}>
                                { randomOrderVar ? 'In Order' : 'Shuffle' }
                            </Text>
                        </TouchableOpacity>           
                    </View>
                </TouchableOpacity>
            </Modal>


        </>
     );
}
const styles = StyleSheet.create({
    dropdownBox: {
        position: 'absolute', 
        top: 40, 
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