
import { useState } from 'react';

import { Text, View, TextInput, StyleSheet } from 'react-native';
import * as style from '@/assets/styles/styles'


const CustomInput = ({showLabel = true, label = "My Form", placeholder, value, onChangeText, maxLength=100, customStyle=null, customFormStyle=null, multiline=false }) => {



    return ( 
        <View style={[{flexDirection: 'column', gap: 15}, customStyle]}>

            {/* Label */}
            {/* Make label dynamic based on the prop insertion, it is true by default though */}
            { showLabel && 

            <Text style={{color:style.gray_500, fontSize: style.text_md, fontWeight: '500'}}> {label}: </Text>

            }
        
            {/* Form */}
            <TextInput style={[styles.form, customFormStyle]} 
                        placeholder= { placeholder }
                        value={ value } 
                        onChangeText={ onChangeText }
                        autoCorrect={ false }
                        autoCapitalize='none'
                        maxLength={maxLength}
                        multiline={multiline} />
                        
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
        padding: 10,
        color: style.gray_400
    },
    
});

 
export default CustomInput;