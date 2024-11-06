import { useState, useEffect } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import Icon from '@expo/vector-icons/FontAwesome6'
import * as style from '@/assets/styles/styles'

//custom components
import CustomButton from '@/app/components/CustomButton';
import CustomModal from '@/app/components/CustomModal';
import CustomInput from '@/app/components/CustomInput';
import CustomAlert from '@/app/components/CustomAlert';


const EditDeckModal = ({onClose, currentLang, deckName}) => {



    return ( 
        <CustomModal onClose={onClose}>
            <Text>Hellos</Text>

        </CustomModal>
     );
}
 
export default EditDeckModal;