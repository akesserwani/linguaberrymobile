
import { Text, View, StyleSheet } from "react-native";
import { useState } from "react";

import CustomButton from "@/app/components/CustomButton";
import Icon from '@expo/vector-icons/FontAwesome6'
import * as style from '@/assets/styles/styles'

const TagDropdown = () => {


    const [dropdownOpen, openDropdown] = useState(false);

    return ( 
        <>
        {/* Tag Dropdown Button */}
        <CustomButton onPress={() => openDropdown(!dropdownOpen)} customStyle={styles.tagDropdown}>
            <View style={{flexDirection: 'row', gap: 7}}>           
                <Text style={{color:style.gray_500}}>Tags</Text>
                <Icon name={"tag"} size={15} color={style.gray_500} style={{marginTop: 2}}/>
            </View>
            <Icon name={dropdownOpen ? "caret-down" : "caret-up"} size={15} color={style.gray_500}/>
        </CustomButton>

        {/* Dropdown content */}
        {dropdownOpen && (
            <View style={styles.dropdownBox}>
                <Text>Hello World</Text>
            </View>
         )}


        </>
     );
}
 
const styles = StyleSheet.create({
    tagDropdown:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor:style.white, 
        borderWidth: style.border_sm, 
        borderColor: style.gray_200
    },
    dropdownBox: {
        position: 'absolute', 
        top: 90, 
        left: 1,
        right: 0,
        padding: 15,

        height:400,
        zIndex: 99,

        borderWidth: 1,
        borderColor: style.gray_200,
        borderRadius: style.rounded_lg,
        backgroundColor: style.white,
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 4,
        elevation: 2,       

        flexDirection:"column",
        gap: 20,
    },

    
});

export default TagDropdown;