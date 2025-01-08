
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { useContext, useState } from 'react';

import CustomModal from '@/app/components/CustomModal';
import CustomInput from '@/app/components/CustomInput';
import CustomButton from '@/app/components/CustomButton';

//import styles
import * as style from '@/assets/styles/styles'

//import current language
import { CurrentLangContext } from '@/app/data/CurrentLangContext.tsx';

//import data functions
import { newEntry } from '../../DataReader';
import React from 'react';

const CreateEntryModal = ({onClose, refresh, scrollToBottom, setImportWeb}) => {

    //get the current language
    const { currentLang } = useContext(CurrentLangContext);

    // Get screen width dynamically
    const { width } = useWindowDimensions();

    //make responsive width for the modal size 
    const dynamicWidth = width < 800 ? '80%' : '50%';  // 80% for mobile, 50% for larger screens

    //get the data from the form
    const [formInput, setFormInput] = useState("");


    //function to create a new deck
    const createEntry = () =>{
        if (formInput.trim() !== ""){
            newEntry(formInput, currentLang);
            //function to refresh to deck
            refresh();

            //function to scroll to the bottom
            scrollToBottom(); 

            //close the modal
            onClose();

        }        
    }
    
    //toggle the import deck modal
    const toggleImportStory = () =>{
        //close the current modal
        onClose()

        //open the toggle deck modal
        setTimeout (() => setImportWeb(), Platform.OS ==="ios" ? 200 : 0);
        
    }
    
    
    return ( 
        <>
            <CustomModal title='New Story' onClose={onClose} overrideStyle={{width: dynamicWidth }}>
                {/* Input form here */}
                <CustomInput label={ "Story name"} placeholder={"Type story name..." } value={formInput} onChangeText={setFormInput} maxLength={50}/>

                {/* Submit button */}
                <CustomButton onPress={createEntry} customStyle={{marginTop: 40, height:45}}>
                    <Text style={{color:style.white, fontSize: style.text_md}}>Create Story</Text>
                </CustomButton>

                {/* Import Story button */}
                <CustomButton onPress={toggleImportStory} customStyle={{marginTop: 20, marginBottom:20, height:40, backgroundColor:style.blue_200}}>
                    <Text style={{color:style.blue_500, fontSize: style.text_sm, fontWeight:'500'}}>Import from Web</Text>
                </CustomButton>

            </CustomModal>
        </>
     );
}
 
export default CreateEntryModal;