
import LZString from "lz-string";

import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, KeyboardAvoidingView } from 'react-native';
import { useContext, useState, useRef } from 'react';

import CustomModal from '@/app/components/CustomModal';
import CustomInput from '@/app/components/CustomInput';
import CustomButton from '@/app/components/CustomButton';
import CustomAlert from '@/app/components/CustomAlert';

//import styles
import * as style from '@/assets/styles/styles'
import React from 'react';

import * as Clipboard from 'expo-clipboard';

import { CurrentLangContext } from '@/app/data/CurrentLangContext.tsx';
import { addWebDataToDeck } from '../DecksScreens/DataDecks';
import { apiLink, apiKey } from '@/app/data/LangData';

import { newEntryFull } from "../ReaderScreens/DataReader";

const ImportStoryModal = ({onClose, refresh}) => {

    //current language
    const { currentLang } = useContext(CurrentLangContext);


    //get the data from the form
    const [formInput, setFormInput] = useState("");
    const [error, setError] = useState("");
  


    //rate limitations
    const lastRequestTime = useRef(0); 
    //click counter will allow 1 second between first 3 clicks and then 30 seconds after every other click
    const clickCounter = useRef(0); // Track the number of clicks

    // const RATE_LIMIT_INTERVAL = 5000; // 30 seconds in milliseconds
    

  // Function to fetch data from the Django API
  const importStoryFromWeb = async () => {

    const currentTime = Date.now();
    const RATE_LIMIT_SHORT = 3000; // 1 second for the first 3 clicks
    const RATE_LIMIT_LONG = 30000; // 30 seconds after 3 clicks

    // Check if the function is being spammed
    const interval = clickCounter.current < 3 ? RATE_LIMIT_SHORT : RATE_LIMIT_LONG;
 
    if (currentTime - lastRequestTime.current < interval) {
        setError(
          `Please wait ${
            interval === RATE_LIMIT_LONG ? "30 seconds" : "1 second"
          } before trying again.`
        );
        return;
      }
  
    //make sure form not empty
    if (!formInput.trim() || !formInput.trim().startsWith('S')) {
        setError("Please enter a valid code.");
        CustomAlert("Please enter a valid code.");
        return;
    }


    // Update the last request time and increment click counter
    lastRequestTime.current = currentTime;
    clickCounter.current += 1;


    try {
        const response = await fetch(apiLink(formInput), {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            "X-API-Key": apiKey, 
            },
        });


        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.message || "Code not found or invalid.";
            setError(errorMessage); // Display the error message
            throw new Error(errorMessage);
        }

        const compressedData = await response.text(); // Fetch as plain text if compressed
        const cleanedData = compressedData.replace(/^"(.*)"$/, '$1'); // Remove surrounding quotes if present

        //decompress the data
        const decompressedData = LZString.decompressFromBase64(cleanedData);
        //parse as json
        const data = JSON.parse(decompressedData);


        setError(""); // Clear any previous error messages


        //Make alert to confirm the deletion
        CustomAlert(
            `Do you want to add "${data.title}?"`, 
            `This will be added to your ${currentLang} stories`,  
            [
                { text: 'No',  onPress: () => console.log('Delete canceled'), style: 'cancel', },
                { text: 'Yes', onPress: () => {

                        //run the data here to add the story
                        //create the new entry

                        newEntryFull(data.title, data.story, JSON.stringify(data.data), data.translation, currentLang)

                        //refresh
                        refresh();

                        //closeModal
                        onClose();
                    }
                }
            ],
            { cancelable: false } // Prevent dismissing the alert by tapping outside
        );
        


    
    } catch (err) {
        setError(err.message); // Set error message for UI
        CustomAlert("Code not found.");

    }

  };

    const pasteCode = async() =>{
        //get the text
        const text = await Clipboard.getStringAsync()

        //set the text to the input data prompt
        setFormInput(text)

    }


    return ( 
        <CustomModal onClose={onClose} title="Import from Web" >

            {/* Input form */}
            <CustomInput label={ "Enter Code"} placeholder={"Type code here..." } value={formInput} onChangeText={setFormInput} maxLength={20}/>
            
            {/* Paste Button */}
            <TouchableOpacity style={{margin:8}} activeOpacity={0.5} onPress={pasteCode}>
                <Text style={{color:style.blue_500}}>Paste</Text>
            </TouchableOpacity>

            {/* Submission button */}
            <CustomButton onPress={importStoryFromWeb} customStyle={{marginTop: 40, height:45}}>
                <Text style={{color:style.white, fontSize: style.text_md}}>Import</Text>
            </CustomButton>

            {/* Error code */}
            <Text style={{color:style.red_500, fontSize: style.text_md, margin:10}}>{error}</Text>

        </CustomModal>
     );
}
 
export default ImportStoryModal;