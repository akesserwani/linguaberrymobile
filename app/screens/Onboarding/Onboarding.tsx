
import { View, Text, StyleSheet, useWindowDimensions} from "react-native";
import { useState } from "react";

import CustomButton from '@/app/components/CustomButton';

//styles
import * as style from '@/assets/styles/styles'
import React from "react";

const Onboarding = () => {
    return ( 
    <>
    {/* Background */}
    <View style={{flex:1, backgroundColor:style.slate_100, padding:50, justifyContent:'center'}}>

        {/* Logo */}

        {/* Main Card Container */}
        <View style={styles.cardContainer}>
            {/* Title */}
            <Text>Get Started</Text>

            {/* Dropdown Selection */}


            {/* Get started button */}
            

        </View>


    </View> 
    
    {/* Bottom footer that adds top border */}
    <View style={style.baseFooterStyle} />
    </>
    );
}
 
const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: style.white,
        flexDirection:'column',
        height:'75%',
        borderWidth:style.border_sm,
        borderRadius:style.rounded_md,
        borderColor:style.gray_200
    },    

});


export default Onboarding;