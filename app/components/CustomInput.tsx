
import { useState } from 'react';

import { Text, View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import * as style from '@/assets/styles/styles'

import { isRTLChar } from '../data/LangData';

const CustomInput = ({showLabel = true, label = "My Form", placeholder, value, onChangeText, maxLength=100, customStyle=null, customFormStyle=null, multiline=false, editable=true }) => {

    // const [direction, setDirection] = useState(false);

    const [direction, setDirection] = useState('ltr'); // Default direction is Left-to-Right

    // Function to detect RTL characters
    const detectDirection = (text) => {
        if (isRTLChar(text)) {
            setDirection('rtl'); // Switch to Right-to-Left
        } else {
            setDirection('ltr'); // Default to Left-to-Right
        }
    };


    const handleTextChange = (text) => {
        detectDirection(text); // Detect language direction dynamically
        onChangeText(text); // Call the parent onChangeText handler
    };


    return ( 
        <View style={[{flexDirection: 'column', gap: 15}, customStyle]}>

            <View style={{flexDirection:'row', justifyContent:'space-between'}}>

                {/* Label */}
                {/* Make label dynamic based on the prop insertion, it is true by default though */}
                { showLabel && 

                    <Text style={{color:style.gray_500, fontSize: style.text_md, fontWeight: '500'}}> {label}: </Text>

                }
            </View>

            {/* Form */}
            <TextInput style={[styles.form, customFormStyle, { textAlign: direction === 'rtl' ? 'right' : 'left' }]} 
                        placeholder= { placeholder }
                        placeholderTextColor={'#9ca3af'}
                        value={ value } 
                        onChangeText={ handleTextChange }
                        autoCorrect={ false }
                        autoCapitalize='none'
                        maxLength={maxLength}
                        multiline={multiline}
                        editable={ editable } />
                        
        </View>
     );
}

const styles = StyleSheet.create({
 
    form: {
        backgroundColor: style.white,
        borderWidth: 2,
        borderRadius: style.rounded_md,
        borderColor: style.gray_200,

        height: 60,
        fontSize: style.text_md,
        padding: 12,
        color: style.gray_400,
        textAlignVertical: "top"
    },
    
});

 
export default CustomInput;