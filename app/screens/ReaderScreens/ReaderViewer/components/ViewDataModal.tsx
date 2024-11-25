import { useState, useEffect, useContext } from "react";
import { TouchableOpacity, View, Text, StyleSheet, ScrollView, FlatList } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';

import Icon from '@expo/vector-icons/FontAwesome6'
import * as style from '@/assets/styles/styles'

import CustomModal from "@/app/components/CustomModal";
import CustomInput from "@/app/components/CustomInput";
import CustomButton from "@/app/components/CustomButton";
import AddWordToDeck from "@/app/components/AddWordToDeck";

//data for context
import { CurrentLangContext } from '@/app/data/CurrentLangContext.tsx';

//get data
import { getWordData, getTranslationData } from "../../DataReader";


const ViewDataModal = ({onClose, entryId}) => {

    //current language
    const { currentLang } = useContext(CurrentLangContext);


    //Create reactive variable to trigger whether we want to show AddWordToDeck Component or not
    const [addToDeck, toggleAddWord] = useState(false);
    //Reactive variable that carries the word to add to the modal
    const [wordToAdd, setWordtoAdd] = useState([]);


    //word data
    const [wordData, setWordData] = useState("");

    useEffect(()=>{
        const wordData = getWordData(entryId, currentLang);
        setWordData(wordData);
    },[])



    return ( 
        <CustomModal title="View Data" onClose={onClose} overrideStyle={{maxHeight:'80%'}}>

            {/* Add word to deck component will be triggered at top of page  */}
            { addToDeck &&
                <AddWordToDeck onClose={()=>toggleAddWord(false)} wordToAdd={wordToAdd}/>
            }

            {/* Content Area */}
            <View style={styles.contentContainer}>
                {/* Top bar with labels */}
                <View style={{flexDirection:'row', borderBottomWidth: style.border_md, gap:20, borderColor: style.gray_200, padding:20, justifyContent:'center' }}>
                    <View style={{width: '40%', justifyContent: 'center'}}>
                        <Text style={{ color: style.gray_600, fontSize: style.text_md, fontWeight:'600' }}>Term</Text> 
                    </View>
                    <View style={{width: '40%', justifyContent: 'center'}}>
                        <Text style={{ color: style.gray_600, fontSize: style.text_md, fontWeight:'600' }}>Translation</Text> 
                    </View>
                </View>

                {/* Individual words in a flatlist */}
                <FlatList
                    data={wordData}
                    keyExtractor={(item, index) => index.toString()} 
                    renderItem={({ item, index }) => (
                    <TouchableOpacity onPress={ 
                        () =>{
                            toggleAddWord(true);
                            setWordtoAdd([ item.term, item.translation ]); 
                        } 
                    } activeOpacity={0.7} style={styles.item}>

                        <Text style={{ color: style.gray_400, fontSize: style.text_md }}> 
                            {index + 1}
                        </Text> 

                        {/* Container for Term */}
                        <View style={{ width: '40%', height: 60, justifyContent: 'center' }}>
                            <Text style={{ color: style.gray_500, fontSize: style.text_md }}> 
                                { item.term } 
                            </Text>
                        </View>

                        {/* Container for Translation */}
                        <View style={{ width: '40%', height: 60, justifyContent: 'center' }}>
                            <Text style={{ color: style.gray_400, fontSize: style.text_md }}> 
                                { item.translation } 
                            </Text>
                        </View>

                    </TouchableOpacity>
                )}/>

            </View>

        </CustomModal>
     );
}

const styles = StyleSheet.create({

    contentContainer: {
        flexDirection: 'column',
        gap: 10,

    },
    item: {
        backgroundColor: style.white, 
        height: 60, 
        borderRadius: style.rounded_md, 
        borderColor: style.gray_200,
        borderBottomWidth: style.border_md,

        flexDirection: 'row',
        gap: 20,
        alignItems:'center',
        paddingHorizontal: 15,
        marginBottom: 10
    },


});


export default ViewDataModal;