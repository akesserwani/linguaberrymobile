import { useState, useEffect } from "react";
import { TouchableOpacity, View, Text, StyleSheet, ScrollView, FlatList } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';

import Icon from '@expo/vector-icons/FontAwesome6'
import * as style from '@/assets/styles/styles'

import CustomModal from "@/app/components/CustomModal";
import CustomInput from "@/app/components/CustomInput";
import CustomButton from "@/app/components/CustomButton";
import AddWordToDeck from "@/app/components/AddWordToDeck";


const ViewDataModal = ({onClose}) => {

    // State to track the active tab
    const [activeTab, setActiveTab] = useState('Words');

    //Create reactive variable to trigger whether we want to show AddWordToDeck Component or not
    const [addToDeck, toggleAddWord] = useState(false);
    //Reactive variable that carries the word to add to the modal
    const [wordToAdd, setWordtoAdd] = useState([]);


    //word data
    const [wordData, setWordData] = useState([
        { term: "hello", translation: "salutasdfasfasdfas asdas asdas" },
        { term: "world", translation: "monde" },
        { term: "book", translation: "livre" },
        { term: "water", translation: "eau" },
        { term: "asdsa", translation: "eau" },
        { term: "wasdaskater", translation: "eau" }      
    ])

    //sentence data
    const [sentenceData, setSentenceData] = useState(
        [
            { term: "sentence 1", translation: "sentencesentence" },
            { term: "sentence 2", translation: "sentence asd" },
            { term: "sentence 3", translation: "asdasdas"},
            { term: "sentence 4", translation: "sddsafasdf"},
            { term: "sentence 5", translation: "sddsafasdf"},
            { term: "sentence 6", translation: "sddsafasdf"}     
        ]
    )



    return ( 
        <CustomModal title="View Data" onClose={onClose} overrideStyle={{maxHeight:'80%'}}>

            {/* Add word to deck component will be triggered at top of page  */}
            { addToDeck &&
                <AddWordToDeck onClose={()=>toggleAddWord(false)} wordToAdd={wordToAdd}/>
            }

            {/* Container for the tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity onPress={() => setActiveTab('Words')} style={[styles.individualTab, activeTab === 'Words' && styles.activeTab]} activeOpacity={0.7}>
                    <Text style={[styles.tabText, activeTab === 'Words' && styles.activeTab]} >Words</Text>
                    {/* Text for count of of wordData */}
                    <Text style={[{fontSize:10, marginTop: 2, color: style.gray_400 }, activeTab === 'Words' && styles.activeTab]} >
                        ({wordData.length})
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setActiveTab('Sentences')} style={[styles.individualTab, activeTab === 'Sentences' && styles.activeTab]} activeOpacity={0.7}>
                    <Text style={[styles.tabText, activeTab === 'Sentences' && styles.activeTab]} >Sentences</Text>
                    {/* Text for count of STARRED words in wordData */}
                    <Text style={[{fontSize:10, marginTop: 2, color: style.gray_400 }, activeTab === 'Sentences' && styles.activeTab]} >
                       ({sentenceData.length})
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Content Area */}
            <View style={styles.contentContainer}>
                {/* Render Word DAta */}
                { activeTab === 'Words' && (
                    <>

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
                </>

                )} 

                {/* Render Sentence Data */}
                { activeTab === 'Sentences' && (
                    <Text style={{ color: 'black', fontSize: 16 }}>Sentences</Text>

                )}

            </View>

        </CustomModal>
     );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: style.slate_100,
        paddingTop: 30,
    },

    tabContainer: {
        flexDirection: "row",
        zIndex: -1,
    },
    
    tabText: {
        fontSize: style.text_md,
        color: style.gray_400,
        fontWeight: "600",
        paddingVertical: 10,
        

    },

    individualTab:{
        width: "50%",
        borderBottomWidth: 3,
        borderBottomColor: style.gray_200,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 5

    },

    activeTab: {
        color: style.blue_500,
        borderBottomColor: style.blue_500,
        fontWeight: "600",

    },
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