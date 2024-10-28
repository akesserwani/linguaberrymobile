

import React, { useState } from 'react';
import { ScrollView, Text, View, TextInput, StyleSheet,useWindowDimensions } from 'react-native';

//components
import CustomModal from '@/components/CustomModal';
import CustomButton from '@/components/CustomButton';
import CustomAlert from '@/components/CustomAlert';

//styles
import * as style from '@/assets/styles/styles'
import Icon from '@expo/vector-icons/FontAwesome6';


const AddLanguageModal = ({ languagesSupported, userLanguages, addLanguage, onClose }) => {


    //variable to toggle custom language form
    const [customLangForm, openCustomLangForm] = useState(false);

    //get input from the form
    const [langInput, setLangInput] = useState("");

    //function to submit the language
    const submitLang = () =>{
        // Trim whitespace and convert to lowercase
        const normalizedLangInput = langInput.trim().toLowerCase();  
        // Check if the input is not empty
        if (normalizedLangInput === "") {
            CustomAlert('Error', 'Language input cannot be empty.', [{ text: 'Retry' }]);
            return;  // Exit the function if the input is empty
        }
        //check if language does not already exist in users languages
        if (!userLanguages.some(language => language.toLowerCase() === normalizedLangInput)) {
            // Check if the language does not exist in the supported languages
            if (!Object.keys(languagesSupported).some(language => language.toLowerCase() === normalizedLangInput)) {
                //if it is not then add it to the current languages 
                //First letter is capital, rest are lowercase
                const formattedLangInput = langInput.charAt(0).toUpperCase() + langInput.slice(1).toLowerCase();

                // Add the formatted language to the list
                addLanguage(formattedLangInput);
                
            } else {
                //alert that language already exists in supported languages
                CustomAlert('This language already exists', 'We support this language!', [{ text: 'Ok' }]);
            }
        } else {
            //alert that language is already being studied by the user
            CustomAlert('This language already exists ', 'You are already studying this language.', [{ text: 'Ok' }]);
        }
    }


    return ( 
        <>

        <CustomModal title='Add a Language' onClose={onClose} >
            {/* Wrap the language items in a ScrollView */}
            <ScrollView style={{ maxHeight: useWindowDimensions().height * 0.6 }} persistentScrollbar={true}>

                {/* CUSTOM LANGUAGE FUNCTIONALITY */}
                {/* Ability to Add Custom Language */}
                <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 10}}>
                    {/* Users Added Languages */}
                    <Text style={{ fontSize:style.text_lg, color: style.gray_600, marginTop:10, fontWeight:"500" }}>
                        Custom Language
                    </Text>

                    {/* Add Icon - Toggle Custom Language Modal */}
                    <CustomButton onPress={()=> openCustomLangForm(!customLangForm)} customStyle={{backgroundColor: style.blue_100, height:50}}>
                        <Icon name={"plus"} size={20} color={style.blue_600}/>
                    </CustomButton>
                </View>

                {/* Form that is toggled if add language is clicked */}
                {/* shows if customLangForm == true which is toggled by previous button */}
                { customLangForm && 
                <View style={{ flexDirection: "column", gap: 40, justifyContent: "center", marginTop: 20, marginBottom: 30,}}>
                    {/* Input Form */}
                    <TextInput style={styles.form} value={langInput} onChangeText={setLangInput}
                        placeholder='Type language here...'
                        autoCorrect={false}
                        autoCapitalize='none'/>

                    {/* Submit Button */}
                    <CustomButton onPress={submitLang} customStyle={null}>
                        <Text style={{color: "white", fontSize: style.text_md,}}>Add Language</Text>
                    </CustomButton>
                </View>
                }
                {/* END CUSTOM LANGUAGE FUNCTIONALITY */}

                {/* Individual Language Box, if trash icon pressed then it will render confirmation and delete */}
                {Object.entries(languagesSupported).map(([language, codes]) => (
                    //if language is in the usersLanguages - it will not render  
                    !userLanguages.includes(language) && (
                        <View key={language} style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 10}}>
                            {/* Users Added Languages */}
                            <Text style={{ fontSize:style.text_lg, color: style.gray_600, marginTop:10 }}>
                                { language }
                            </Text>

                            {/* Plus Icon */}
                            <CustomButton customStyle={{backgroundColor: style.blue_100, height:50}} onPress={()=> addLanguage(language)}>
                                <Icon name={"plus"} size={20} color={style.blue_600}/>
                            </CustomButton>
                        </View>
                    )
                ))}

            </ScrollView>
        </CustomModal>


        </>
     );
}

const styles = StyleSheet.create({
 
    form: {
        backgroundColor: style.white,
        borderWidth: 2,
        borderRadius: style.rounded_md,
        borderColor: style.gray_200,

        height: 50,
        padding: 10,
        color: style.gray_400
    },
    
  
  });

 
export default AddLanguageModal;