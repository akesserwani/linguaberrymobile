
import { Text, View, StyleSheet, TouchableOpacity, useWindowDimensions, ScrollView } from 'react-native'
import { useState, useContext } from 'react';

//styles
import * as style from '@/assets/styles/styles'
import Icon from '@expo/vector-icons/FontAwesome6'

//Custom Components
import CustomButton from '@/components/CustomButton';
import CustomModal from '@/components/CustomModal';
import CustomAlert from '@/components/CustomAlert'

//data 
import { languagesSupported } from '@/assets/data/CurrentLangContext';
//data for context
import { CurrentLangContext } from '@/assets/data/data';

//import modal components
import AddLanguageModal from './AddLanguageModal';
import EditLanguageModal from './EditLanguageModal';

const LanguageSelection = () => {

    //reactive variable for dropdown
    const [dropdownOpen, openDropdown] = useState(false);
    //get window width
    const windowWidth = useWindowDimensions().width;


    //users languages data
    const [userLanguages, editUserLanguages] = useState(["French", "Spanish", "German", "Swedish", "Esperanto", "Japanese"]);


    //function to open dropdown
    const toggleDropdown = () =>{
        openDropdown(!dropdownOpen);
    }

    //current language
    const { currentLang, setCurrentLang } = useContext(CurrentLangContext);

    //function to set active language
    const setCurrentLanguage = (language) =>{
        setCurrentLang(language);

        //close the dropdown
        openDropdown(false);
    } 

    //reactive variable to toggle modal
    const [editModalOpen, openEditModal] = useState(false);
    //functionality to open Edit Modal
    const toggleEditModal = () =>{
        openEditModal(true);
        //close dropdown
        openDropdown(false);
    }

    //function to open add modal 
    const [addModalOpen, openAddModal] = useState(false);
    //functionality to open Edit Modal
    const toggleAddModal = () =>{
        openAddModal(true);
        //close dropdown
        openDropdown(false);
    }


    //function to delete individual language
    const deleteLanguage = (language) => {

        // Show an alert with "Yes" and "No" buttons
        CustomAlert(
            `Are you sure you want to delete ${language}?`, // Title with language name
            'You will not be able to recover this data.',     // Message
            [
                { text: 'No',  onPress: () => console.log('Delete canceled'), style: 'cancel', },
                { text: 'Yes', onPress: () => {
                        // If "Yes" is pressed, delete the language
                        editUserLanguages((prevLanguages) => {
                            const updatedLanguages = prevLanguages.filter((lang) => lang !== language);
    
                            // If the current language is the one being deleted, set the next language
                            if (currentLang === language) {
                                setCurrentLang(updatedLanguages[0]);  
                            }
                            return updatedLanguages;
                        });
                        // Close the edit modal
                        openEditModal(false);
                    }
                }
            ],
            { cancelable: false } // Prevent dismissing the alert by tapping outside
        );
    };
          
    //function to add a language
    const addLanguage = (language) =>{
        //add the selected language, languageToAdd, to the usersLanguages array
        editUserLanguages([...userLanguages, language]);

        //close the modal
        openAddModal(false);

        //set as the current language
        setCurrentLang(language);
    }

    return ( 

        <View style={{ position: 'relative', zIndex: 10, }}>

            {/* BUTTON */}
            {/* Main Dropdown Button  */}
            <CustomButton customStyle={[styles.dropdownBtn, { width: windowWidth > 700 ? 250 : null }]} onPress={toggleDropdown}>
                {/* Current Language */}
                <Text style={{ fontSize: style.text_md, fontWeight: "500", color:style.gray_500 }}> { currentLang } </Text>
                {/* Dropdown Icon */}
                <Icon name={dropdownOpen ? "caret-up" : "caret-down"} size={15} color={style.gray_500}/>
            </CustomButton>


            {/* DROPDOWN */}
            {/* Dropdown to view users added languages */}
            {dropdownOpen && (
            <View style={styles.dropdownBox}>

                {/* Create scrollview */}
                <ScrollView style={{ maxHeight: 400 }} persistentScrollbar={true}>
                    {/* Users Added Languages */}
                    {userLanguages.map((language, index) => (
                        //if language is currently selected - it will NOT show in the dropdown 
                        language !== currentLang && (

                            <TouchableOpacity onPress={() => setCurrentLanguage(language)}
                                key={index} style={{ paddingVertical: 15, paddingHorizontal: 10, borderRadius: style.rounded_md }} activeOpacity={0.5}>
                                <Text style={{fontSize: style.text_md, fontFamily: "500", color: style.gray_500}}>
                                    {language}
                                </Text>
                            </TouchableOpacity>
                        )
                    ))}
                </ScrollView>

                {/* <hr> line break */}
                <View style={{ borderBottomColor: style.gray_200, borderBottomWidth:1 }} />

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
            )}


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
 
    dropdownBtn: {
        backgroundColor: style.white,
        borderColor: style.gray_200,
        borderWidth: style.border_md,
        borderRadius: 16,
    
        height: 60,
        flexDirection: "row",
        justifyContent: "space-between",
    },
  
    dropdownBox: {
        position: 'absolute', 
        top: 75, 
        left: 1,
        right: 0,
        padding: 15,

        maxHeight:400,
        zIndex: 99,

        borderWidth: 1,
        borderColor: style.gray_200,
        borderRadius: style.rounded_lg,
        backgroundColor: style.white,
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 4,
        elevation: 2,       

        flexDirection:"column",
        gap: 20,
    },
    bottomSection: {
        alignItems: 'center', 
        paddingHorizontal: 30,

        height: "40%",
        marginTop: 70,

        flexDirection: "column",
        gap: 20,
        borderRadius: 20,
      }
    
  
  });

 
export default LanguageSelection;