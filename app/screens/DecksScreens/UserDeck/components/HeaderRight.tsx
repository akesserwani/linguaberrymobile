
import { useState, useEffect, useRef } from "react";
import { TouchableOpacity, View, Text, StyleSheet, Modal, Platform } from "react-native";
import Icon from '@expo/vector-icons/FontAwesome6'
import * as style from '@/assets/styles/styles'

import EditDeckModal from "./EditDeckModal";
import React from "react";

const HeaderRight = ({currentLang, deckId, deckName, refreshDeck, refreshWords }) => {

    const [buttonClicked, setClick] = useState(false);

    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const iconRef = useRef(null); // Ref to capture the position of the icon

    //Modal open
    const [modalActive, openModal] = useState(false);
    
    const openModalFunc = () =>{
        //close the dropdown
        setClick(false);

        //open the Edit Deck modal
        setTimeout (() => openModal(true), Platform.OS ==="ios" ? 200 : 0);
   
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

            {/* Trigger button */}
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
                    {/* Dropdown content */}
                    <View style={[styles.dropdownBox, dropdownPosition]}>
                        {/* Edit Deck */}
                        <TouchableOpacity onPress={openModalFunc} activeOpacity={0.7}>
                            <Text style={{color:style.gray_500}}>Edit</Text>
                        </TouchableOpacity>                    
                    </View>
                </TouchableOpacity>
            </Modal>




            {/* Modal to edit Deck */}
            {   modalActive &&
                <EditDeckModal onClose={()=>openModal(false)} currentLang={currentLang} deckId={deckId} deckName={deckName} refreshDeck={refreshDeck} refreshWords={refreshWords} />
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

        width:100,

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