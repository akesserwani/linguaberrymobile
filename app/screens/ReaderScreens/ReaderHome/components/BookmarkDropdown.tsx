import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, FlatList, Modal, KeyboardAvoidingView } from 'react-native';
import { useContext, useState, useEffect, useRef, useCallback } from 'react';

//data for context
import { CurrentLangContext } from '@/app/data/CurrentLangContext.tsx';
import { getAllReaderTags, createNewTag, deleteTagByName } from '../../DataReader';

import CustomButton from '@/app/components/CustomButton';
import CustomModal from '@/app/components/CustomModal';
import CustomInput from '@/app/components/CustomInput';
import CustomAlert from '@/app/components/CustomAlert';

import Icon from '@expo/vector-icons/FontAwesome6'
import * as style from '@/assets/styles/styles'

import React from 'react';

import { Platform } from 'react-native';

const BookmarkDropdown = ({onTagSelect, currentTag = null, filter=true}) => {

    //current language
    const { currentLang } = useContext(CurrentLangContext);
    

    const [dropdownOpen, openDropdown] = useState(false);

    //render the selected tag based on what is selected
    const [selectedTag, selectTag] = useState(currentTag);
    
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
    const iconRef = useRef(null); // Ref to capture the position of the icon
    
    //Toggle edit
    const [editVar, toggleEdit] = useState(false);

    //toggle creation modal 
    const [tagModal, openTagModal] = useState(false);
    
    //create tag input
    const [createTagInput, setTagInput] = useState("");

    //tag exists warning
    const [tagExists, setTagExists] = useState(false);

    //Tag data
    const [tagData, setTagData] = useState({});

    //useEffect to get all the tag data 
    const getTagData = () =>{
        //call the function
        const data = getAllReaderTags(currentLang);
        //set the data to the function
        setTagData(data);
    }

//use effect to reload tag data everytime modal closes
    useFocusEffect(
        useCallback(() => {
            getTagData();
        }, [tagModal]) // Add any dependencies if needed
    );
        
    
    // Set dropdown based on position of the target ref
    const handleOpenDropdown = () => {
        if (iconRef.current) {
            iconRef.current.measure((fx, fy, width, height, px, py) => {
                // Base top calculation
                let adjustedTop = py + height;
    
                // Add platform-specific adjustments
                if (Platform.OS === 'android') {
                    adjustedTop -= 20; // Adjust for Android if needed
                } else {
                    adjustedTop += 5;
                }
    
                // Update dropdown position
                setDropdownPosition({ 
                    top: adjustedTop, 
                    left: px, 
                    width 
                });
    
                openDropdown(true);
            });
        }
    };
    
    const selectTagFunc = (tag) => {
        //function to select the tag
        //call it in the callback function
        if (onTagSelect) {
            onTagSelect(tag); 
        }

        //close the dropdown
        openDropdown(false);

        //select tag so it renders in the UI
        selectTag(tag);
    }


    //function to open the tag creation modal
    const openTagCreation = () =>{
        //close the dropdown
        openDropdown(false);
        //open the modal
        openTagModal(true);
    }

    //function to close the tag modal
    const closeTagModal = () =>{
        //close the modal
        openTagModal(false);

        //reset the form
        setTagInput("");

        //set error to false
        setTagExists(false);
    }

    //function to create a new tag
    const createTagFunc = () =>{

        //check if input already exists in the database        
        if (createNewTag(createTagInput, currentLang) && createTagInput !== "None" && createTagInput !== ""){
            //if the tag does not exist create it 
            //close the creation modal
            openTagModal(false);

            //reset the form
            setTagInput("");

            //set error to false
            setTagExists(false);

        } else {
            //if it does already exist, render the message
            setTagExists(true);
        }

    }
    
    //Function to delete tag
    const deleteTagFunc = (name) =>{
        //Make alert to confirm the deletion
        CustomAlert(
            `Are you sure you want to delete this tag?`, 
            'You will not be able to recover it.',  
            [
                { text: 'No',  onPress: () => console.log('Delete canceled'), style: 'cancel', },
                { text: 'Yes', onPress: () => {
                        // If "Yes" is pressed, delete the word
                        deleteTagByName(name, currentLang);

                        //reload tags
                        getTagData();

                    }
                }
            ],
            { cancelable: false } // Prevent dismissing the alert by tapping outside
        );
    }
    


    return ( 
        <>
        {/* Tag Dropdown Button */}
        <View ref={iconRef} collapsable={false}>
            <CustomButton onPress={handleOpenDropdown} customStyle={styles.tagDropdown}>
                <View style={{flexDirection: 'row', gap: 7}}>           
                    <Text style={{color:style.gray_500}}>
                        {selectedTag === null ? "Select a tag" : selectedTag}
                    </Text>
                    <Icon name={"tag"} size={15} color={style.gray_500} style={{marginTop: 2}}/>
                </View>
                <Icon name={dropdownOpen ? "caret-down" : "caret-up"} size={15} color={style.gray_500}/>
            </CustomButton>
        </View>

        {/* Dropdown Modal */}
        <Modal transparent={true} visible={dropdownOpen} onRequestClose={() => openDropdown(false)}>
                {/* Invisible Overlay that can be clicked  */}
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} 
                            onPress={() => {
                                openDropdown(false);
                            }}>
                    {/* Dropdown content */}
                    <View style={[styles.dropdownBox, dropdownPosition]}>

                        {/* List of Tags */}
                        <FlatList data={tagData}
                                keyExtractor={(item) => item.id.toString()} // Ensure each item has a unique key
                                contentContainerStyle={{ paddingRight: 10, paddingTop: 10 }}
                                ListHeaderComponent={
                                        // Render show all button
                                        <TouchableOpacity onPress={() => {
                                            if (filter){
                                                selectTagFunc(null);
                                            } else {
                                                selectTagFunc("none");
                                            }
                                        }} activeOpacity={0.7} style={{ padding: 10, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Text style={{ color: style.gray_400, fontSize: style.text_md, fontWeight: '400' }}> 
                                                {filter ? "Show All" : "No tag"}
                                            </Text>
                                        </TouchableOpacity>
                                }
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={()=>selectTagFunc(item.name)} 
                                        activeOpacity={0.7}
                                        style={{ padding: 10, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        {/* Name of the Tag */}
                                        <Text style={{ color: style.gray_500, fontSize: style.text_md, fontWeight: '400' }}>
                                            {item.name}
                                        </Text>

                                        {/* Number of words or delete option */}
                                        {editVar &&
                                            // Show delete button if editVar is true
                                            <CustomButton onPress={() => deleteTagFunc(item.name)} customStyle={{ backgroundColor: style.red_100, height: 40, width: 30 }}>
                                                <Icon name={"trash"} width={10} color={style.red_500} />
                                            </CustomButton>
                                        }
                                    </TouchableOpacity>
                                )}
                            />


                        {/* Add and edit button containers */}
                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>    
                            {/* Add Button */}            
                            <CustomButton onPress={openTagCreation} customStyle={null}>
                                <Text style={{color:style.white}}>Add</Text>
                            </CustomButton>
                
                            {/* Edit Button */}
                            <CustomButton onPress={()=>toggleEdit(!editVar)} customStyle={{backgroundColor:style.gray_200}}>
                                <Text style={{color:style.gray_500}}>
                                    {editVar ? "Done" : "Edit"}
                                </Text>
                            </CustomButton>

                        </View>
                        

                    </View>
                </TouchableOpacity>
        </Modal>


    {/* Create Tag Modal */}
    { tagModal &&
        <CustomModal onClose={closeTagModal} title="New Tag" overrideStyle={null}>
            <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={100}  >
            {/* Form to input tag name  */}
                <CustomInput label={"Tag Name"} placeholder={"Type name here"} value={createTagInput} onChangeText={setTagInput}
                    maxLength={20} />

                {/* Warning if tag already exists */}
                { tagExists &&
                    <Text style={{color:style.red_500, fontWeight:"400", position: "relative", left:5, top:10}}>Tag already exists in this deck</Text>
                }

                {/* Create button */}
                <CustomButton onPress={createTagFunc} customStyle={{marginTop:20}}>
                    <Text style={{color:style.white}}>Create Tag</Text>
                </CustomButton>
            </KeyboardAvoidingView>
        </CustomModal>
        }

        </>
     );
}
 
const styles = StyleSheet.create({
    tagDropdown:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor:style.white, 
        borderWidth: style.border_md, 
        borderColor: style.gray_200,
        paddingVertical:15
    },
    dropdownBox: {
        position: 'absolute', 
        top: 90, 
        right: 20,
        padding: 15,

        maxHeight:400,

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

export default BookmarkDropdown;