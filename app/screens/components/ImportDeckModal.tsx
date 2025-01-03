
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

import { CurrentLangContext } from '@/app/data/CurrentLangContext.tsx';
import { addWebDataToDeck } from '../DecksScreens/DataDecks';
import { apiLink } from '@/app/data/LangData';

const ImportDeck = ({onClose, refresh}) => {

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
  const importDeckFromWeb = async () => {

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
    if (!formInput.trim() || !formInput.trim().startsWith('D')) {
        setError("Please enter a valid code.");
        return;
    }


    // Update the last request time and increment click counter
    lastRequestTime.current = currentTime;
    clickCounter.current += 1;


    try {

        const apiKey = "3cc22320-678d-43ca-8614-ca1fd458ce02"; 
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
            `This will be added to your ${currentLang} decks`,  
            [
                { text: 'No',  onPress: () => console.log('Delete canceled'), style: 'cancel', },
                { text: 'Yes', onPress: () => {

                        //run the function here
                        addWebDataToDeck(currentLang, data)

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
    
    }

  };


    return ( 
        <CustomModal onClose={onClose} title="Import from Web" >

            {/* Input form */}
            <CustomInput label={ "Enter Code"} placeholder={"Type code here..." } value={formInput} onChangeText={setFormInput} maxLength={20}/>

            {/* Submission button */}
            <CustomButton onPress={importDeckFromWeb} customStyle={{marginTop: 40, height:45}}>
                <Text style={{color:style.white, fontSize: style.text_md}}>Import</Text>
            </CustomButton>

            {/* Error code */}
            <Text style={{color:style.red_500, fontSize: style.text_md, margin:10}}>{error}</Text>

        </CustomModal>
     );
}
 
export default ImportDeck;