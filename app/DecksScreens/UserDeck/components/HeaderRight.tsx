
import { useState, useEffect } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import Icon from '@expo/vector-icons/FontAwesome6'
import * as style from '@/assets/styles/styles'

import EditDeckModal from "./EditDeckModal";

const HeaderRight = ({currentLang, deckName}) => {

    const [buttonClicked, setClick] = useState(false);

    //Modal open
    const [modalActive, openModal] = useState(false);
    
    const openModalFunc = () =>{
        //open the modal
        openModal(true);

        //close dropdown
        setClick(false);
    }

    return ( 
        <>
            <TouchableOpacity onPress={()=>setClick(!buttonClicked)} style={{marginRight:30}} activeOpacity={0.7}>
                <Icon name={"ellipsis-vertical"} size={20} color={style.gray_500} />
            </TouchableOpacity>

            { buttonClicked && 
                <View style={styles.dropdownBox}>
                    {/* Edit Deck */}
                    <TouchableOpacity onPress={openModalFunc} activeOpacity={0.7}>
                        <Text style={{color:style.gray_500}}>Edit</Text>
                    </TouchableOpacity>                    
                </View>
            }

            {/* Modal to edit Deck */}
            {   modalActive &&
                <EditDeckModal onClose={openModal(false)} currentLang={currentLang} deckName={deckName} />
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
        width: 100,
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