
import { useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import Icon from '@expo/vector-icons/FontAwesome6'
import * as style from '@/assets/styles/styles'

const HeaderRight = () => {

    const [buttonClicked, setClick] = useState(false);

    return ( 
        <>
            <TouchableOpacity onPress={()=>setClick(!buttonClicked)} style={{marginRight:30}} activeOpacity={0.7}>
                <Icon name={"ellipsis-vertical"} size={20} color={style.gray_500} />
            </TouchableOpacity>

            { buttonClicked && 
                <View style={styles.dropdownBox}>
                    {/* Edit Deck */}
                    <TouchableOpacity activeOpacity={0.7}>
                        <Text style={{color:style.gray_500}}>Edit</Text>
                    </TouchableOpacity>
                    
                    {/* Bookmark the deck  */}
                    <TouchableOpacity activeOpacity={0.7}>
                        <Text style={{color:style.gray_500}}>Bookmark</Text>
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

        height:100,
        width: 100,
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
        gap: 25,
    },
    
});


export default HeaderRight;