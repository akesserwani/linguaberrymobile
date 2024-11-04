
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { useContext, useState } from 'react';

import CustomModal from '@/app/components/CustomModal';
import CustomInput from '@/app/components/CustomInput';
import CustomButton from '@/app/components/CustomButton';

//import styles
import * as style from '@/assets/styles/styles'

//import data
import { createNewDeck } from '../../DataDecks';

//import current language
import { CurrentLangContext } from '@/app/data/CurrentLangContext.tsx';


const CreateDeckModal = ({onClose, refresh, scrollToBottom}) => {

    //get the current language
    const { currentLang } = useContext(CurrentLangContext);


    // Get screen width dynamically
    const { width } = useWindowDimensions();

    //make responsive width for the modal size 
    const dynamicWidth = width < 800 ? '80%' : '50%';  // 80% for mobile, 50% for larger screens

    //get the data from the form
    const [formInput, setFormInput] = useState("");


    //function to create a new deck
    const createDeck = () =>{
        //call the database function
        createNewDeck(formInput, currentLang);
        
        //function to refresh to deck
        refresh();

        //function to scroll to the bottom
        scrollToBottom(); 

        //close the modal
        onClose();
    }

    return ( 
        <CustomModal title='New Deck' onClose={onClose} overrideStyle={{width: dynamicWidth, height: 330 }}>

                {/* Input form here */}
                <CustomInput label={ "Deck name"} placeholder={"Type deck name..." } value={formInput} onChangeText={setFormInput} maxLength={30}/>
                

                {/* Submit button */}
                <CustomButton onPress={createDeck} customStyle={{marginTop: 40, height:45}}>
                    <Text style={{color:style.white, fontSize: style.text_md}}>Create Deck</Text>
                </CustomButton>


        </CustomModal>

        
     );
}
 
export default CreateDeckModal;