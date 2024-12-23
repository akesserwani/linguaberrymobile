

import React, { useState } from 'react';
import { ScrollView, Text, View, TextInput, StyleSheet,useWindowDimensions } from 'react-native';

//components
import CustomModal from '@/app/components/CustomModal';
import CustomButton from '@/app/components/CustomButton';
import CustomAlert from '@/app/components/CustomAlert';
import CustomInput from '@/app/components/CustomInput';

//styles
import * as style from '@/assets/styles/styles'
import Icon from '@expo/vector-icons/FontAwesome6';


const AddLanguageModal = ({ languagesSupported, userLanguages, addLanguage, onClose }) => {


    //variable to toggle custom language form
    const [customLangForm, openCustomLangForm] = useState(false);

    //get input from the form
    const [langInput, setLangInput] = useState("");
    //get whether Left to Right or Right to Left is selected
    const [RTL, setRTL] = useState("LTR");

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
                addLanguage(formattedLangInput, RTL);
                
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
            <ScrollView style={{ maxHeight: useWindowDimensions().height * 0.6, paddingRight:20 }} persistentScrollbar={true}>

                {/* CUSTOM LANGUAGE FUNCTIONALITY */}
                {/* Ability to Add Custom Language */}
                <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 10}}>
                    {/* Users Added Languages */}
                    <Text style={{ fontSize:style.text_lg, color: style.gray_600, marginTop:10, fontWeight:"500" }}>
                        Custom Language
                    </Text>

                    {/* Add Icon - Toggle Custom Language Modal */}
                    <CustomButton onPress={()=> openCustomLangForm(!customLangForm)} customStyle={{backgroundColor: style.blue_100, height:50}}>
                        { customLangForm ? (
                            <Icon name={"minus"} size={20} color={style.blue_600}/>
                        ) : (
                            <Icon name={"plus"} size={20} color={style.blue_600}/>
                        )}

                    </CustomButton>
                </View>

                {/* Form that is toggled if add language is clicked */}

                {/* shows if customLangForm == true which is toggled by previous button */}
                { customLangForm && 
                <View style={{ flexDirection: "column", gap: 20, justifyContent: "center", marginTop: 20, marginBottom: 30,}}>
                    {/* Input Form */}
                    <CustomInput 
                        showLabel={false}
                        value={langInput} 
                        onChangeText={setLangInput}
                        placeholder='Type language here...'
                        />
                        
                    {/* Buttons for selecting keyboard direction */}
                    <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>

                        <CustomButton onPress={()=>{setRTL("LTR")}} 
                                      customStyle={{width:120, backgroundColor:style.gray_200,
                                        borderColor: RTL === "LTR" ? style.blue_500 : style.gray_300,
                                        borderWidth: RTL === "LTR" ? 3 : 1,
                                      }}>
                            <Text style={{color: style.gray_500, fontSize: style.text_xs, fontWeight:'600'}}>
                                Left to Right
                            </Text>
                        </CustomButton>

                        <CustomButton onPress={()=>{setRTL("RTL")}} 
                                      customStyle={{width:120, backgroundColor:style.gray_200, 
                                        borderColor: RTL === "RTL" ? style.blue_500 : style.gray_300,
                                        borderWidth: RTL === "RTL" ? 3 : 1,
                                      }}>
                            <Text style={{color: style.gray_500, fontSize: style.text_xs, fontWeight:'600'}}>
                                Right to Left
                            </Text>
                        </CustomButton>

                    </View>

                    {/* Submit Button */}
                    <CustomButton onPress={submitLang} customStyle={null}>
                        <Text style={{color: "white", fontSize: style.text_md,}}>Add Language</Text>
                    </CustomButton>
                </View>
                }
                {/* END CUSTOM LANGUAGE FUNCTIONALITY */}

                {/* Individual Language Box, if trash icon pressed then it will render confirmation and delete */}
                {languagesSupported.map((language) => (
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

 
export default AddLanguageModal;