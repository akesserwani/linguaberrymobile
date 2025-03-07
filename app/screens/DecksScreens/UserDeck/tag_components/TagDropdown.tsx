
import { Text, View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Modal, Platform, FlatList, useWindowDimensions} from "react-native";
import { useState, useEffect, useRef } from "react";

{/* Custom Components */}
import CustomButton from "@/app/components/CustomButton";
import CustomModal from "@/app/components/CustomModal";
import CustomInput from "@/app/components/CustomInput";
import CustomAlert from "@/app/components/CustomAlert";

import Icon from '@expo/vector-icons/FontAwesome6'
import * as style from '@/assets/styles/styles'
import { ScrollView } from "react-native-gesture-handler";

//import data functions from DataDecks
import { createTag, tagExistsInDeck, getAllTagsInDeck, deleteTagByName, getWordsWithTag } from "../../DataDecks";
import React from "react";

const TagDropdown = ({currentLang, deck_id, onTagSelect}) => {


    const [dropdownOpen, openDropdown] = useState(false);

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
    // function to get all the tags in the deck
    const getTagData = () =>{
        //call the function
        const data = getAllTagsInDeck(deck_id, currentLang);
        //set the data to the function
        setTagData(data);
    }
    //use effect to reload tag data everytime modal closes
    useEffect(()=>{
        getTagData();
    }, [tagModal])

    //Function to create a tag
    const createTagFunc = () =>{

        //check if input already exists in the database
        if (tagExistsInDeck(createTagInput, deck_id, currentLang) || createTagInput === "None" || createTagInput === ""){
            //render the message
            setTagExists(true);
        } else{
            //call the database function
            createTag(createTagInput, deck_id, currentLang)

            //close the creation modal
            openTagModal(false);

            //reset the form
            setTagInput("");

            //set error to false
            setTagExists(false);
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
                        deleteTagByName(name, deck_id, currentLang);
                        //refresh data
                        getTagData();

                    }
                }
            ],
            { cancelable: false } // Prevent dismissing the alert by tapping outside
        );
    }


    //render the selected tag based on what is selected
    const [selectedTag, selectTag] = useState(null);

    //functionality for the selected tag
    //this function will send the value back UserDeck.tsx and allow words to be filtered based off of the selected tag
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

    //function to close the tag modal
    const closeTagModal = () =>{
        //close the modal
        openTagModal(false);

        //reset the form
        setTagInput("");

        //set error to false
        setTagExists(false);
    }

    // Set dropdown based on position of the target ref
    const handleOpenDropdown = () => {
        if (iconRef.current) {
            iconRef.current.measure((fx, fy, width, height, px, py) => {
                // Base top calculation
                let adjustedTop = py + height;
    
                // Add platform-specific adjustments
                if (Platform.OS === 'android') {
                    adjustedTop; // Adjust for Android if needed
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
    
    // Get screen width dynamically
    const { width } = useWindowDimensions();

    //make responsive width for the modal size 
    const dynamicWidth = width < 800 ? '80%' : '50%';  // 80% for mobile, 50% for larger screens


    return ( 
        <>
        {/* Tag Dropdown Button */}
        <View ref={iconRef} collapsable={false}>
            <CustomButton onPress={handleOpenDropdown} customStyle={styles.tagDropdown}>
                <View style={{flexDirection: 'row', gap: 7}}>           
                    <Text style={{color:style.gray_500}}>
                        {selectedTag === null ? "Filter by tag" : selectedTag}
                    </Text>
                    <Icon name={"tag"} size={15} color={style.gray_500} style={{marginTop: 2}}/>
                </View>
                <Icon name={dropdownOpen ? "caret-down" : "caret-up"} size={15} color={style.gray_500}/>
            </CustomButton>
        </View>


        {/* Dropdown Modal */}
        <Modal transparent={true} visible={dropdownOpen} onRequestClose={() => openDropdown(false)} supportedOrientations={['portrait', 'landscape']}>
                {/* Invisible Overlay that can be clicked  */}
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} 
                            onPress={() => {
                                openDropdown(false);
                            }}>
                    {/* Dropdown content */}
                    <View style={[styles.dropdownBox, dropdownPosition]}>

                        <FlatList data={tagData} // Data array
                            keyExtractor={(item, index) => item.id?.toString() || index.toString()} // Unique key for each item
                            contentContainerStyle={{ paddingRight: 10 }}
                            ListHeaderComponent={
                                tagData.length !== 0 && (
                                    <TouchableOpacity
                                        onPress={() => selectTagFunc(null)}
                                        activeOpacity={0.7}
                                        style={{
                                            padding: 10,
                                            marginTop: 10,
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}>
                                        {/* Name of the Tag */}
                                        <Text style={{ color: style.gray_400, fontSize: style.text_md, fontWeight: '400' }}>
                                            Show All
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => selectTagFunc(item.name)} activeOpacity={0.7} style={{
                                        padding: 10,
                                        marginTop: 10,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}>
                                    {/* Name of the Tag */}
                                    <Text style={{ color: style.gray_500, fontSize: style.text_md, fontWeight: '400' }}>
                                        {item.name}
                                    </Text>

                                    {/* Number of words */}
                                    {!editVar ? (
                                        <Text style={{ color: style.gray_500, fontSize: style.text_xs, fontWeight: '500' }}>
                                            ({getWordsWithTag(item.name, deck_id, currentLang).length})
                                        </Text>
                                    ) : (
                                        // If edit var is true, show option to delete tag
                                        <CustomButton
                                            onPress={() => deleteTagFunc(item.name)}
                                            customStyle={{ backgroundColor: style.red_100, height: 40, width: 30 }}>
                                            <Icon name={"trash"} width={10} color={style.red_500} />
                                        </CustomButton>
                                    )}
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={
                                <Text style={{ textAlign: 'center', color: style.gray_400, marginTop:20 }}>
                                    No tags available.
                                </Text>
                            }/>

                    {/* <hr> line break */}
                    {/* Do not show it if there is no data */}
                    { tagData.length > 0 && (
                        <View style={{ borderBottomColor: style.gray_200, borderBottomWidth: 1 }} />
                    )}

                    {/* Button Views */}
                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>    
                        {/* Add Button */}            
                        <CustomButton onPress={()=>{
                            //close the dropdown
                            openDropdown(false);
                            //open the tag modal
                            //wait if on ios 
                            setTimeout (() => openTagModal(true), Platform.OS ==="ios" ? 200 : 0);

                        }} customStyle={null}>
                            <Text style={{color:style.white}}>Add</Text>
                        </CustomButton>

                        
                    {/* Edit Button */}
                    {  tagData.length !== 0 && (
                        //Dont render edit button if there are no tags
                        <CustomButton onPress={()=>toggleEdit(!editVar)} customStyle={{backgroundColor:style.gray_200}}>
                            <Text style={{color:style.gray_500}}>
                                {editVar ? "Done" : "Edit"}
                            </Text>
                        </CustomButton>
                    )}

                    </View>
                </View>
            </TouchableOpacity>
        </Modal>



         {/* Create Tag Modal */}
         { tagModal &&
         <CustomModal onClose={closeTagModal} title="New Tag" overrideStyle={{width:dynamicWidth}}>
            <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={100}  >
            {/* Form to input tag name  */}
                <CustomInput label={"Tag Name"} placeholder={"Type name here"} value={createTagInput} onChangeText={setTagInput}
                    maxLength={20} />

                {/* Warning if tag already exists */}
                { tagExists &&
                    <Text style={{color:style.red_500, fontWeight:"400", position: "relative", left:5, top:10}}>Tag already exists in this deck</Text>
                }

                {/* Create button */}
                <CustomButton onPress={()=>createTagFunc()} customStyle={{marginTop:20}}>
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
        borderWidth: style.border_sm, 
        borderColor: style.gray_200
    },
    dropdownBox: {
        position: 'absolute', 
        top: 97, 
        left: 1,
        right: 0,
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
        gap: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0)',
    },

    
});

export default TagDropdown;