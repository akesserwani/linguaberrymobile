import { useState, useEffect } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import Icon from '@expo/vector-icons/FontAwesome6'
import * as style from '@/assets/styles/styles'
import { useNavigation, useRoute } from '@react-navigation/native';

import CustomAlert from "@/app/components/CustomAlert";

import { deleteEntry } from "../../DataReader";

const HeaderRight = ({currentLang, entryId}) => {

    const [buttonClicked, setClick] = useState(false);
    const navigation = useNavigation();

    const deleteEntryFunc = () =>{

        //Make alert to confirm the deletion
        CustomAlert(
            `Are you sure you want to delete this entry?`, 
            'This entire entry and all of its data will be permanently deleted.',  
            [
                { text: 'No',  onPress: () => console.log('Delete canceled'), style: 'cancel', },
                { text: 'Yes', onPress: () => {
                    //delete via database
                    deleteEntry(entryId, currentLang);
                    
                    //Redirect to the ReaderHome view
                    navigation.navigate('ReaderHome'); 
                        
                    }
                }
            ],
            { cancelable: false } // Prevent dismissing the alert by tapping outside
        );

    }

    return (
        <>
            <TouchableOpacity onPress={()=>setClick(!buttonClicked)} style={{marginRight:30, width:30, height: 40, alignItems:'center', justifyContent:'center'}} activeOpacity={0.7}>
                <Icon name={"ellipsis-vertical"} size={20} color={style.gray_500} />
            </TouchableOpacity>

            { buttonClicked && 
                <View style={styles.dropdownBox}>
                    {/* Edit Deck */}
                    <TouchableOpacity onPress={deleteEntryFunc} activeOpacity={0.7}>
                        <Text style={{color:style.gray_500}}>Delete Entry</Text>
                    </TouchableOpacity>                    
                </View>
            }

        </>
      );
}

const styles = StyleSheet.create({
    dropdownBox: {
        position: 'absolute', 
        top: 40, 
        right: 20,
        padding: 15,

        height:50,
        zIndex: 99,

        borderWidth: 1,
        borderColor: style.gray_200,
        borderRadius: style.rounded_md,
        backgroundColor: style.white,
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 4,
        elevation: 2,       

        flexDirection:"column",
        gap: 25,
    },
    
});

export default HeaderRight;