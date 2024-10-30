
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { useContext, useState } from 'react';

import CustomModal from '@/app/components/CustomModal';
import CustomInput from '@/app/components/CustomInput';
import CustomButton from '@/app/components/CustomButton';

//import styles
import * as style from '@/assets/styles/styles'

//import data
import { createNewDeck } from '../DataDecks';


const CreateDeckModal = ({onClose}) => {

    // Get screen width dynamically
    const { width } = useWindowDimensions();

    //make responsive width for the modal size 
    const dynamicWidth = width < 800 ? '80%' : '50%';  // 80% for mobile, 50% for larger screens

    //get the data from the form
    const [formInput, setFormInput] = useState("");

    //get the data from the deck



    //function to create a new deck
    const createDeck = () =>{
        //call the database function
        createNewDeck(formInput);

        //close the modal
        onClose();
    }

    return ( 
        <CustomModal title='New Deck' onClose={onClose} overrideStyle={{width: dynamicWidth, height: 330 }}>

                {/* Input form here */}
                <CustomInput label={ "Deck name"} placeholder={"Type deck name..." } value={formInput} onChangeText={setFormInput}/>

                {/* Submit button */}
                <CustomButton onPress={createDeck} customStyle={{marginTop: 40}}>
                    <Text style={{color:style.white, fontSize: style.text_md}}>Create Deck</Text>
                </CustomButton>


        </CustomModal>

        
     );
}
 
export default CreateDeckModal;