
import { useState, useEffect } from "react";
import { TouchableOpacity, View, Text, StyleSheet, Modal } from "react-native";
import Icon from '@expo/vector-icons/FontAwesome6'
import * as style from '@/assets/styles/styles'

import { wordStoryData } from "../../ExplorerHome/ExplorerData";
import { convertLangFiletoJSON } from "@/app/data/Functions";

import ViewWordModal from "@/app/components/ViewWordModal";

const HeaderRight = ({title, currentLang}) => {


    const [buttonClicked, setClick] = useState(false);


    const [viewWords, toggleViewWords] = useState(false);

    //Variable to be passed
    const [wordData, setWordData] = useState({});
    let filteredData;

    const toggleViewWordsFunc = () =>{
        //close the dropdown/modal 
        setClick(false)

        //get the wordData and set it to a reactive variable
        const jsonWordData = wordStoryData[currentLang];
        if (jsonWordData) {
            //convert the data into a readeble format for the ViewWordModal
            filteredData = jsonWordData[title];
            filteredData = convertLangFiletoJSON(filteredData);
            setWordData(filteredData);
        } 

        //toggle the view words modal
        toggleViewWords(true);
    }

    return ( 
        <>

            {/* Toggle Word Data Modal If View words is triggered */}
            { viewWords &&
            <ViewWordModal onClose={()=>toggleViewWords(false)} 
                            json={true} 
                            dataProp={wordData} 
                            modalTitle={title} />
            }


            <TouchableOpacity onPress={()=>setClick(!buttonClicked)} style={{marginRight:30, width:30, height: 40, alignItems:'center', justifyContent:'center'}} activeOpacity={0.7}>
                <Icon name={"ellipsis-vertical"} size={20} color={style.gray_500} />
            </TouchableOpacity>

            <Modal transparent={true} visible={buttonClicked} onRequestClose={() => setClick(false)}>
                {/* Invisible Overlay that can be clicked  */}
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} 
                                onPress={() => {
                                    setClick(false);
                                }}>
                    {/* Drop down itself */}
                    <View style={styles.dropdownBox}>
                        {/* Drop down contents here  */}
                            {/* View words button */}
                            <TouchableOpacity onPress={toggleViewWordsFunc} activeOpacity={0.7}>
                                <Text style={{color:style.gray_500}}>
                                    View Words 
                                </Text>
                            </TouchableOpacity>     
                    </View>    
                </TouchableOpacity>
            </Modal>

        </>
     );
}
const styles = StyleSheet.create({
    dropdownBox: {
        position: 'absolute', 
        top: 100, 
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0)',
    },
});



export default HeaderRight;