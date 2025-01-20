
import React from 'react';
import { ScrollView, Text, View, useWindowDimensions, TouchableOpacity } from 'react-native';

//components
import CustomModal from '@/app/components/CustomModal';
import CustomButton from '@/app/components/CustomButton';

//styles
import * as style from '@/assets/styles/styles'
import Icon from '@expo/vector-icons/FontAwesome6';


const EditLanguageModal = ({ userLanguages, deleteLanguage, onClose }) => {
    return ( 
        <CustomModal title='Edit Languages' onClose={onClose} >
        {/* Wrap the language items in a ScrollView */}
        <ScrollView style={{ maxHeight: useWindowDimensions().height * 0.6, paddingRight:20 }} persistentScrollbar={true}>
        <TouchableOpacity activeOpacity={1}>

            {/* Individual Language Box, if trash icon pressed then it will render confirmation and delete */}
            {userLanguages.map((language, index) => (
                <View key={index} style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 10}}>
                    {/* Users Added Languages */}
                    <Text style={{ fontSize:style.text_lg, color: style.gray_600, marginTop:10 }}>
                        { language }
                    </Text>

                    {/* Trash Icon */}
                    <CustomButton customStyle={{backgroundColor: style.red_100, height:50}} onPress={()=> deleteLanguage(language)}>
                        <Icon name={"trash"} size={20} color={style.red_500}/>
                    </CustomButton>
                </View>
            ))}
            </TouchableOpacity>
        </ScrollView>
    </CustomModal>

     );
}
 
export default EditLanguageModal;