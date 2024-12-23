import { useState, useEffect, useContext } from "react";
import { TouchableOpacity, View, Text, StyleSheet, ScrollView, FlatList } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';

import Icon from '@expo/vector-icons/FontAwesome6'
import * as style from '@/assets/styles/styles'

import CustomModal from "@/app/components/CustomModal";
import CustomInput from "@/app/components/CustomInput";
import CustomButton from "@/app/components/CustomButton";

//data for context
import { CurrentLangContext } from '@/app/data/CurrentLangContext.tsx';

import { getSingleEntryData } from "../ReaderScreens/DataReader";

import { limitLength, matchSentences } from "@/app/data/Functions";

import { storyFiles } from "../../../assets/data/ExplorerData";

const ViewSentences = ({onClose, modalTitle, entryId=null}) => {

    //current language
    const { currentLang } = useContext(CurrentLangContext);

    //Get the data from the database
    const [sentenceData, setSentenceData] = useState([]);

    useEffect(()=>{
        //If entryId is null - means that it is being called from Explorer 
        if (entryId === null){
            //Logic to load the sentence data from the files
            const currentStoryFile = storyFiles[currentLang];
            //Find the story based on the title
            const story = currentStoryFile.find(story => story.title === modalTitle);

            //convert the data and set it to reactive variable 
            setSentenceData(matchSentences(story.story, story.story_translation));    

        } 
        //If not null then it is being called from the Reader - since entryId is provided
        else {
            const data = getSingleEntryData(entryId, currentLang);

            //set the sentence data
            setSentenceData(matchSentences(data.contents, data.translation_data));    
        }

    }, [entryId, currentLang])
        


    return ( 
        <CustomModal title={limitLength(modalTitle, 25)} onClose={onClose} overrideStyle={{maxHeight:'80%'}} horizontalPadding={0} topPadding={0}>
            {/* Content Container */}
            <View style={styles.contentContainer}>
                {/* Top bar with labels */}
                <View style={{flexDirection:'row', backgroundColor: style.gray_100 ,borderBottomWidth: style.border_md, gap:20, borderColor: style.gray_200, paddingHorizontal:15, paddingVertical:20, justifyContent:'center' }}>
                    <View style={{width: '40%', justifyContent: 'center'}}>
                        <Text style={{ color: style.gray_600, fontSize: style.text_md, fontWeight:'600' }}>Sentence</Text> 
                    </View>
                    <View style={{width: '40%', justifyContent: 'center'}}>
                        <Text style={{ color: style.gray_600, fontSize: style.text_md, fontWeight:'600' }}>Translation</Text> 
                    </View>
                </View>

                {/* Rendered Sentence Data */}
                {sentenceData.length === 0 ? (
                    <View style={{ height: 100, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: style.gray_400, fontSize: style.text_md, fontWeight: '600', textAlign: 'center', margin: 20 }}>
                            No sentences
                        </Text>
                    </View>
                    ) : (
                    // Render words in a flatlist 
                    <FlatList
                        data={sentenceData}
                        contentContainerStyle={{ paddingRight: 20, paddingTop: 20, paddingBottom: 20, paddingHorizontal: 20, minHeight:'50%' }}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            // Wrap all elements inside a parent container
                            <View style={{ flexDirection: 'row', gap:10, marginBottom: 10 }}>
                                <View style={{ flex:1, minHeight: 60, justifyContent: 'flex-start' }}>
                                    <Text style={{ color: style.gray_400, fontSize: style.text_md, marginRight: 10 }}>
                                        {index + 1}
                                    </Text>
                                </View>
                                {/* Container for Term */}
                                <View style={{ flex:4, minHeight: 60, justifyContent: 'flex-start' }}>
                                    <Text style={{ color: style.gray_500, fontSize: style.text_md }}>
                                        {item.mainSentence}
                                    </Text>
                                </View>

                                {/* Container for Translation */}
                                <View style={{ flex:4, minHeight: 60, justifyContent: 'flex-start' }}>
                                    <Text style={{ color: style.gray_400, fontSize: style.text_md }}>
                                        {item.translationSentence}
                                    </Text>
                                </View>
                            </View>
                        )}
                    />
                )}

            </View>
        </CustomModal>
     );
}
 
const styles = StyleSheet.create({

    contentContainer: {
        flexDirection: 'column',
        maxHeight:'95%',
        minHeight:'50%',
        backgroundColor:style.white,
    },
    item: {
        backgroundColor: style.white, 
        height: 60, 
        borderColor: style.gray_200,
        borderBottomWidth: style.border_md,

        flexDirection: 'row',
        gap: 20,
        alignItems:'center',
        paddingHorizontal: 15,
        marginBottom: 10
    },


});

export default ViewSentences;