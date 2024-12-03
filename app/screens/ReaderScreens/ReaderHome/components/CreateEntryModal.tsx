
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, KeyboardAvoidingView } from 'react-native';
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

const CreateEntryModal = ({onClose, refresh, scrollToBottom}) => {

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
        newEntry(formInput, currentLang);

        //function to refresh to deck
        refresh();

        //function to scroll to the bottom
        scrollToBottom(); 

        //close the modal
        onClose();
        
    }
    
    
    
    return ( 
        <>
            <CustomModal title='New Entry' onClose={onClose} overrideStyle={{width: dynamicWidth, height: 330 }}>
                {/* Input form here */}
                <CustomInput label={ "Entry name"} placeholder={"Type entry name..." } value={formInput} onChangeText={setFormInput} maxLength={50}/>

                {/* Submit button */}
                <CustomButton onPress={createEntry} customStyle={{marginTop: 40, height:45}}>
                    <Text style={{color:style.white, fontSize: style.text_md}}>Create Entry</Text>
                </CustomButton>

            </CustomModal>
        </>
     );
}
 
export default CreateEntryModal;