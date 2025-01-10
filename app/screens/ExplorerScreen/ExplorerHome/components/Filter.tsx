
import { Text, View, StyleSheet, TouchableOpacity, FlatList, Platform, Modal } from 'react-native'
import { useState, useContext, useRef} from 'react';

import * as style from '@/assets/styles/styles'
import Icon from '@expo/vector-icons/FontAwesome6'

import React from 'react';

import CustomButton from '@/app/components/CustomButton';


const ExplorerFilter = ({selectedLevel, setLevel, getColorLevel}) => {

    //reactive variable for dropdown
    const [dropdownOpen, openDropdown] = useState(false);

    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 150 }); // Default width
    const dropdownRef = useRef(null); // Ref to capture the position of the icon

    //data variable for the levels
    const levels = ["All", "Beginner", "Intermediate", "Advanced"]

    //function to select a level
    const selectLevel = (level) =>{
        //set it to setLevel - reactive prop
        setLevel(level)
        //close dropwdown
        openDropdown(false);
    }


    //Set dropdown based on position of the target ref
    const handleOpenDropdown = () => {
        if (dropdownRef.current) {
            dropdownRef.current.measure((fx, fy, width, height, px, py) => {

                // Ensure fallback values to avoid NaN
                const baseTop = py + height + 5 || 100; // Default to 100 if NaN

                // Adjust top based on the platform
                const safeTop = Platform.OS === 'ios' ? baseTop : baseTop - 5; // Adjust for Android

                const safeLeft = px || 30; // Default to 30 if NaN
                const safeWidth = width || 150; // Default width
    
                setDropdownPosition({
                    top: safeTop,
                    left: safeLeft,
                    width: safeWidth,
                });
                openDropdown(true);
            });
        }
    };


    return ( 
        <>
            {/* button */}
            <View ref={dropdownRef} collapsable={false}>
                <CustomButton customStyle={[styles.dropdownBtn]} onPress={handleOpenDropdown}>
                    {/* Current Language */}
                    <Text style={{ fontSize: style.text_md, fontWeight: "500", color:style.gray_500 }}> { selectedLevel } </Text>
                    {/* Dropdown Icon */}
                    <Icon name={dropdownOpen ? "caret-up" : "caret-down"} size={15} color={style.gray_500}/>
                </CustomButton>
            </View>

            {/* Dropdown */}

            {/* DROPDOWN */}
            {/* Dropdown to view users added languages */}
            <Modal transparent={true} visible={dropdownOpen} onRequestClose={() => openDropdown(false)} supportedOrientations={['portrait', 'landscape']}>
                {/* Invisible Overlay that can be clicked  */}
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} 
                                onPress={() => {
                                    openDropdown(false);
                                }}>
                    {/* Main Content of the dropdown */}
                    <View style={[styles.dropdownBox, { top: dropdownPosition.top, left: dropdownPosition.left, width: dropdownPosition.width }]}>
                    {/* Render Each Individual Language  */}
                        <FlatList
                                data={levels} 
                                keyExtractor={(item, index) => index.toString()}
                                style={{ maxHeight: 400 }}
                                persistentScrollbar={true}
                                contentContainerStyle={{ paddingVertical: 10 }}
                                renderItem={({ item }) => (

                                <TouchableOpacity
                                    onPress={()=>selectLevel(item)}
                                    style={{paddingVertical: 15, paddingHorizontal: 20, borderRadius: style.rounded_md, flexDirection:'row', justifyContent:'space-between'}}
                                    activeOpacity={0.7}>
                                        {/* Text */}
                                        <Text style={{fontSize: style.text_md, fontWeight: "500", color: style.gray_500}}>
                                            {item}
                                        </Text>

                                        {/* Level Indicator */}
                                        { item !== "All" &&
                                            <Icon name={'chart-simple'} solid={true} size={15} color={getColorLevel(item.toLowerCase())}/>
                                        }

                                </TouchableOpacity>
                        )}/>
                        </View>
                </TouchableOpacity>
            </Modal>


        </>
        
     );
}
 
const styles = StyleSheet.create({
    
    dropdownBox: {
        position: 'absolute', 
        top: 205, 
        left: 30,
        padding: 15,

        zIndex: 99,

        borderWidth: 1,
        borderColor: style.gray_200,
        borderRadius: style.rounded_lg,
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

    dropdownBtn: {
        backgroundColor: style.white,
        borderColor: style.gray_200,
        borderWidth: style.border_md,
        borderRadius: 12,
    
        height: 50,
        flexDirection: "row",
        justifyContent: "space-between",
    },
  
    bottomSection: {
        alignItems: 'center', 
        paddingHorizontal: 30,

        height: "40%",
        marginTop: 70,

        flexDirection: "column",
        gap: 20,
        borderRadius: 20,
      },    
    
  
  });

export default ExplorerFilter;