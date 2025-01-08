
import { Text, View, StyleSheet, TouchableOpacity, useWindowDimensions, FlatList, Modal } from 'react-native'
import { useState, useContext, useRef} from 'react';


//styles
import * as style from '@/assets/styles/styles'
import Icon from '@expo/vector-icons/FontAwesome6'

//Custom Components
import CustomButton from '@/app/components/CustomButton';
import CustomModal from '@/app/components/CustomModal';
import CustomAlert from '@/app/components/CustomAlert';

//data 
import { languagesSupported, RTLlanguages } from '@/app/data/LangData';
//data for context
import { CurrentLangContext } from '@/app/data/CurrentLangContext.tsx';


//get the data from the data file for all the users languages 
import { getLangStorage, addLangStorage, deleteLangStorage, setCurrentLangStorage } from './DataLanguages'; 

//import modal components
import AddLanguageModal from './AddLanguageModal';
import EditLanguageModal from './EditLanguageModal';

import { Platform } from 'react-native';

const LanguageSelection = () => {

    //reactive variable for dropdown
    const [dropdownOpen, openDropdown] = useState(false);

    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 150 }); // Default width
    const dropdownRef = useRef(null); // Ref to capture the position of the icon
    
    //get window width
    const windowWidth = useWindowDimensions().width;


    //Get the data of the languages that the user has
    const [userLanguages, editUserLanguages] = useState(getLangStorage());
    
    //current language
    const { currentLang, setCurrentLang } = useContext(CurrentLangContext);

    //function to set active language
    const setCurrentLanguage = (language) =>{

        //update the context variable
        setCurrentLang(language);

        //save it to the JSON data
        setCurrentLangStorage(language);

        //close the dropdown
        openDropdown(false);
    } 

    //reactive variable to toggle modal
    const [editModalOpen, openEditModal] = useState(false);
    //functionality to open Edit Modal
    const toggleEditModal = () =>{
        //close dropdown
        openDropdown(false);

        //open the tag modal
        //wait if on ios 
        setTimeout (() => openEditModal(true), Platform.OS ==="ios" ? 200 : 0);
        
    }

    //function to open add modal 
    const [addModalOpen, openAddModal] = useState(false);
    //functionality to open Edit Modal
    const toggleAddModal = () =>{
        //close dropdown
        openDropdown(false);

        //open the tag modal
        //wait if on ios 
        setTimeout (() => openAddModal(true), Platform.OS ==="ios" ? 200 : 0);
        
    }


    //function to delete individual language
    const deleteLanguage = (language) => {

        //if there are less languages than 2, create an alert warning to prevent deletion of a language
        if (userLanguages.length < 2){
            CustomAlert('Error', 'You cannot delete a language unless you are currently studying at least 2', [{ text: 'Ok' }]);

        //if there are more languages than 1 - allow the language to be deleted
        } else {

            // Show an alert with "Yes" and "No" buttons
            CustomAlert(
                `Are you sure you want to delete ${language}?`, // Title with language name
                'You will not be able to recover this data.',     // Message
                [
                    { text: 'No',  onPress: () => console.log('Delete canceled'), style: 'cancel', },
                    { text: 'Yes', onPress: () => {
                            // If "Yes" is pressed, delete the language
                            //delete languages by using reactive propety of userLanguages to filter out language being deleted
                            editUserLanguages((prevLanguages) => {
                                //filter out the language in updatedLanguages variable
                                const updatedLanguages = prevLanguages.filter((lang) => lang !== language);
        
                                // If the current language is the one being deleted, set the next language
                                if (currentLang === language) {
                                    setCurrentLanguage(updatedLanguages[0]);  
                                }

                                //delete language from storage
                                deleteLangStorage(language);

                                //return updatedLanguages so it is reflected in the reactive variable
                                return updatedLanguages;
                            });
                            // Close the edit modal
                            openEditModal(false);
                        }
                    }
                ],
                { cancelable: false } // Prevent dismissing the alert by tapping outside
            );
        }
    };
          
    //function to add a language
    const addLanguage = (language, direction) =>{

        //add the selected language to the usersLanguages array
        const updatedLanguages = [...userLanguages, language];  // This has the new language

        //set it to the reactive variable so it is refleced in the UI
        editUserLanguages(updatedLanguages);

        //if the direction is undefined, make it check to see what the language currently is, then it sets the direction
        if (direction === undefined){
            //check to see if the selected language is RTL or LTR
            if (RTLlanguages.includes(language)){
                addLangStorage(language, "RTL");
            } else {
                addLangStorage(language, "LTR");
            }

        } else {
            //if it is undefined then that means it is a custom language
            addLangStorage(language, direction);

        }

        //close the modal
        openAddModal(false);

        //set as the current language
        setCurrentLanguage(language);
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

        <View style={{ position: 'relative', zIndex: 10, }}>

            {/* BUTTON */}
            {/* Main Dropdown Button  */}
            <View ref={dropdownRef} collapsable={false}>
                <CustomButton customStyle={[styles.dropdownBtn, { width: windowWidth > 700 ? 250 : null }]} onPress={handleOpenDropdown}>
                    {/* Current Language */}
                    <Text style={{ fontSize: style.text_md, fontWeight: "500", color:style.gray_500 }}> { currentLang } </Text>
                    {/* Dropdown Icon */}
                    <Icon name={dropdownOpen ? "caret-up" : "caret-down"} size={15} color={style.gray_500}/>
                </CustomButton>
            </View>


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
                                data={[...userLanguages.filter(language => language !== currentLang)].sort((a, b) => a.localeCompare(b))} // Filter and sort alphabetically
                                keyExtractor={(item, index) => index.toString()}
                                style={{ maxHeight: 400 }}
                                persistentScrollbar={true}
                                contentContainerStyle={{ paddingVertical: 10 }}
                                renderItem={({ item }) => (

                                <TouchableOpacity
                                    onPress={() => setCurrentLanguage(item)}
                                    style={{paddingVertical: 15, paddingHorizontal: 10, borderRadius: style.rounded_md}}
                                    activeOpacity={0.7}>
                                    <Text style={{fontSize: style.text_md, fontWeight: "500", color: style.gray_500}}>{item}</Text>
                                </TouchableOpacity>
                        )}/>

                        {/* <hr> line break */}
                        {/* Do not show it if there are no languages */}
                        { userLanguages.length > 1 && (
                            <View style={{ borderBottomColor: style.gray_200, borderBottomWidth: 1 }} />
                        )}

                            {/* Buttons on Bottom of Dropdown */}
                            <View style={{ flexDirection:"row", justifyContent:"space-between"}}>
                                {/* Button To Add Languages */}
                                <CustomButton onPress={toggleAddModal} customStyle={{width: 100, height:40,}}>
                                    <Text style={{color: style.white, fontSize: style.text_md}}>Add</Text>
                                </CustomButton>

                                {/* Button To Delete Languages */}
                                <CustomButton onPress={toggleEditModal} customStyle={{width: 100, height:40, backgroundColor:style.gray_200}}>
                                    <Text style={{color: style.gray_600, fontSize: style.text_md}}>Edit</Text>
                                </CustomButton>
                            </View>
                        </View>
                </TouchableOpacity>
            </Modal>


            {/* Edit MODAL */}
            {/* Modal to Toggle to delete languages */}
            { editModalOpen && (
                <EditLanguageModal
                    userLanguages={userLanguages}
                    deleteLanguage={deleteLanguage}
                    onClose={() => openEditModal(false)}
                />
            )}

            {/* ADD MODAL */}
            {addModalOpen && (
                <AddLanguageModal
                    languagesSupported={languagesSupported}
                    userLanguages={userLanguages}
                    addLanguage={addLanguage}
                    onClose={() => openAddModal(false)}
                />
            )}

        </View>

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
        borderWidth: style.border_sm,
        borderRadius: style.rounded_md,
    
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

 
export default LanguageSelection;