
import { Text, View, StyleSheet, TouchableOpacity, useWindowDimensions, ScrollView } from 'react-native'
import { useState, useContext } from 'react';

//styles
import * as style from '@/assets/styles/styles'
import Icon from '@expo/vector-icons/FontAwesome6'

//Custom Components
import CustomButton from '@/app/components/CustomButton';
import CustomModal from '@/app/components/CustomModal';
import CustomAlert from '@/app/components/CustomAlert';

//data 
import { languagesSupported } from '@/app/data/LangData';
//data for context
import { CurrentLangContext } from '@/app/data/CurrentLangContext.tsx';

//data from the datafile to get the current language
import { setCurrentLangStorage } from './Data';

//get the data from the data file for all the users languages 
import { getLangStorage, setLangStorage } from './Data'; 

//import modal components
import AddLanguageModal from './AddLanguageModal';
import EditLanguageModal from './EditLanguageModal';


const LanguageSelection = () => {

    //reactive variable for dropdown
    const [dropdownOpen, openDropdown] = useState(false);
    //get window width
    const windowWidth = useWindowDimensions().width;


    //users languages data
    const [userLanguages, editUserLanguages] = useState(getLangStorage());

    //function to open dropdown
    const toggleDropdown = () =>{
        openDropdown(!dropdownOpen);
    }

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

                                //save the newly set updated language(s) to the newly created variable
                                setLangStorage(updatedLanguages);

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
    const addLanguage = (language) =>{

        //add the selected language to the usersLanguages array
        const updatedLanguages = [...userLanguages, language];  // This has the new language

        //set it to the reactive variable so it is refleced in the UI
        editUserLanguages(updatedLanguages);

        //update the database here with the updatedLanguages variable
        setLangStorage(updatedLanguages);

        //close the modal
        openAddModal(false);

        //set as the current language
        setCurrentLanguage(language);
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
                                <Text style={{fontSize: style.text_md, fontWeight: "500", color: style.gray_500}}>
                                    {language}
                                </Text>
                            </TouchableOpacity>
                        )
                    ))}
                </ScrollView>

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
    
        height: 50,
        flexDirection: "row",
        justifyContent: "space-between",
    },
  
    dropdownBox: {
        position: 'absolute', 
        top: 55, 
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