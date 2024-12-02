import { useState, useEffect } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import Icon from '@expo/vector-icons/FontAwesome6'
import * as style from '@/assets/styles/styles'
import { useNavigation, useRoute } from '@react-navigation/native';

import CustomAlert from "@/app/components/CustomAlert";

import { deleteEntry } from "../../DataReader";
import EditDataModal from "./EditDataModal";
import ViewWordModal from "../../../../components/ViewWordModal";

const HeaderRight = ({currentLang, entryId, setRefresh}) => {

    const [buttonClicked, setClick] = useState(false);

    //triggers for the modals
    const [viewDataModal, setViewDataModal] = useState(false);
    const [editDataModal, setEditDataModal] = useState(false);

    return (
        <>
            <TouchableOpacity onPress={()=>setClick(!buttonClicked)} style={{marginRight:30, width:30, height: 40, alignItems:'center', justifyContent:'center'}} activeOpacity={0.7}>
                <Icon name={"ellipsis-vertical"} size={20} color={style.gray_500} />
            </TouchableOpacity>

            { buttonClicked && 
                <View style={styles.dropdownBox}>
                    {/* View Data Modal */}
                    <TouchableOpacity onPress={()=>{
                        setClick(false);
                        setViewDataModal(true);
                    }} activeOpacity={0.7}>
                        <Text style={{color:style.gray_500}}>View Words</Text>
                    </TouchableOpacity>   

                    {/* Edit Data Modal */}
                    <TouchableOpacity onPress={()=>{
                        setClick(false);
                        setEditDataModal(true);
                    }} activeOpacity={0.7}>
                        <Text style={{color:style.gray_500}}>Edit Data</Text>
                    </TouchableOpacity>                    
                
                </View>
            }

        {/* Call Each of the Modals */}
        { viewDataModal &&
            <ViewWordModal onClose={()=> setViewDataModal(false)} entryId={entryId}/>
        }

        {   editDataModal &&
            <EditDataModal onClose={()=> setEditDataModal(false)} entryId={entryId} setRefresh={setRefresh}/>
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