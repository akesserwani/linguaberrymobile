
import { useState, useEffect } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import Icon from '@expo/vector-icons/FontAwesome6'
import * as style from '@/assets/styles/styles'


const HeaderRight = ({currentLang, deckId }) => {

    const [buttonClicked, setClick] = useState(false);

    //Modal open
    const [modalActive, openModal] = useState(false);
    

    return ( 
        <>
            <TouchableOpacity onPress={()=>setClick(!buttonClicked)} style={{marginRight:30, width:30, height: 40, alignItems:'center', justifyContent:'center'}} activeOpacity={0.7}>
                <Icon name={"ellipsis-vertical"} size={20} color={style.gray_500} />
            </TouchableOpacity>

            {/* Drop down component */}
            { buttonClicked && 
                <View style={styles.dropdownBox}>
                    {/* Toggle Flashcard/Study Mode */}
                    <TouchableOpacity onPress={()=>{}} activeOpacity={0.7}>
                        <Text style={{color:style.gray_500}}>Flashcard Mode</Text>
                    </TouchableOpacity>    

                    {/* Front First */}
                    <TouchableOpacity onPress={()=>{}} activeOpacity={0.7}>
                        <Text style={{color:style.gray_500}}>Front First</Text>
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