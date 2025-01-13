import { useState, useEffect, useContext } from "react";
import { TouchableOpacity, View, Text, StyleSheet, ScrollView, useWindowDimensions, KeyboardAvoidingView, Share } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';

import Icon from '@expo/vector-icons/FontAwesome6'
import * as style from '@/assets/styles/styles'

import CustomModal from "@/app/components/CustomModal";
import CustomInput from "@/app/components/CustomInput";
import CustomButton from "@/app/components/CustomButton";
import CustomAlert from "@/app/components/CustomAlert";

import BookmarkDropdown from "../../ReaderHome/components/BookmarkDropdown";

//data for context
import { CurrentLangContext } from '@/app/data/CurrentLangContext.tsx';

//import data functions from DataReader
import { getWordData, updateWordData, getTranslationData, updateTranslationData, getEntryContents, updateTagInStory, getTagOfStory } from "../../DataReader";
//data functions
import { validateCSVFormat, CSVToObject, ObjectToCSV } from "@/app/data/Functions";

import * as Clipboard from 'expo-clipboard';
import { deleteEntry } from "../../DataReader";


const EditDataModal = ({onClose, entryId, setRefresh}) => {

    //current language
    const { currentLang } = useContext(CurrentLangContext);


    //variables for input forms
    const [wordDataInput, setWordDataInput] = useState(null);
    const [textTranslation, setTextTranslation] = useState(null);

    //reactive variable for the content
    const [entryContents, setEntryContents] = useState(null);

    //selected tag dropdown
    const [selectedTag, selectTag] = useState(getTagOfStory(entryId, currentLang));

    // create useEffect to get data and insert in form
    useEffect(()=>{
        //set the word data
        const wordData = getWordData(entryId, currentLang);
        setWordDataInput(ObjectToCSV(wordData));

        //set the sentence data
        const translation_data = getTranslationData(entryId, currentLang);
        setTextTranslation(translation_data);

        //get the word entry contents
        const contentsData = getEntryContents(entryId, currentLang);
        setEntryContents(contentsData);


    },[entryId, currentLang])

    //reactive variable to render error messages for word data
    const [wordError, setWordError] = useState("");
    const [textError, setTextError] = useState("");


    //Function to push data
    const loadData = () =>{
        //If the Data input is valid
        const validation = validateCSVFormat(wordDataInput);

        if (validation.valid){

            //functionalities to update the word_data to the database
            const csvData = CSVToObject(wordDataInput); // Convert the CSV to an object/array
            updateWordData(csvData, entryId, currentLang); // Push the data to the database

            //function to push the translation into wordData 
            updateTranslationData(textTranslation, entryId, currentLang); 

            //refresh the variable
            setRefresh((prev) => !prev); 
            
            //close the modal
            onClose();

        } else{
            setWordError(validation.error);   
        }

    } 

    //create a useEffect to update the Entries tag
    useEffect(()=>{
        updateTagInStory(selectedTag, entryId, currentLang);
    }, [selectedTag])

    //Copy AI prompt for Word Data
    //** Goal of the word prompt is to go through the entire text and generate key value pairs in CSV format for the word and translation in the text
    // Data to pass in: Text content, target language
    const wordPrompt = async () =>{


        const format = "term 1, translation 1 \n word 2, translation 2 "

        const prompt = `We are learning ${currentLang}. We want to generate translation values for this text: "${entryContents}". Generate the term translation values in this CSV format ${format}. All lowercase. Make sure term is in English, then translation is the ${currentLang} translation. You can keep the notes column empty (so just term 1, translation 1). No repetition of words. `;

        //go through the full text and 
        await Clipboard.setStringAsync(prompt);

        CustomAlert("Data copied to clipboard");

    }

    //Copy AI prompt for Translation
    const translationPrompt = async () =>{

        const prompt = `If this text is in English, translate it to ${currentLang}. If in ${currentLang} translate to English. Here is the text: "${entryContents}". Make it in a copyable format.`;

        //go through the full text and 
        await Clipboard.setStringAsync(prompt);

        CustomAlert("Data copied to clipboard");

    }

    //share word data
    const shareWordData = async() =>{
        const result = await Share.share({message:wordDataInput});
    }


    //share translation
    const shareTranslation = async() =>{
        const result = await Share.share({message:textTranslation});
    }

    //function to copy full text
    const copyFullText = async () =>{

        await Clipboard.setStringAsync(entryContents);

        CustomAlert("Full text copied to clipboard");

    }

    //function to copy data from the forms
    const copyWordData = async () =>{

        //go through the full text and 
        await Clipboard.setStringAsync(wordDataInput);

        CustomAlert("Word data copied to clipboard");

    }

    //copy the translation
    const copyTranslation = async ()=>{

        //go through the full text and 
        await Clipboard.setStringAsync(textTranslation);

        CustomAlert("Translation copied to clipboard");

    }

    //paste button
    const pasteData = async() =>{
        //get the text
        const text = await Clipboard.getStringAsync()

        //set the text to the input data prompt
        setWordDataInput(text)
    }
    
    const pasteTranslation = async() =>{
        //get the text
        const text = await Clipboard.getStringAsync()

        //set the text to the input data prompt
        setTextTranslation(text)

    }

    //delete story functionality
    const navigation = useNavigation();
    
    const deleteEntryFunc = () =>{

        //Make alert to confirm the deletion
        CustomAlert(
            `Are you sure you want to delete this story?`, 
            'This entire story and all of its data will be permanently deleted.',  
            [
                { text: 'No',  onPress: () => console.log('Delete canceled'), style: 'cancel', },
                { text: 'Yes', onPress: () => {
                    //delete via database
                    deleteEntry(entryId, currentLang);

                    //close the modal
                    onClose()

                
                    //Redirect to the ReaderHome view
                    navigation.navigate('ReaderHome'); 
                        
                    }
                }
            ],
            { cancelable: false } // Prevent dismissing the alert by tapping outside
        );

    }


    const { width } = useWindowDimensions(); // Get screen width

    return ( 
        <CustomModal title="Edit Data" onClose={onClose} horizontalPadding={0} overrideStyle={{maxHeight:'80%'}} allowBackdropClose={false}>
            {/* Main Content here */}
            <KeyboardAvoidingView behavior={'padding'} keyboardVerticalOffset={50} style={{maxHeight:'95%'}} >
                <ScrollView contentContainerStyle={{ gap: 20, padding:35, flexDirection:'column' }}>
                    <TouchableOpacity activeOpacity={1} style={{gap: 20, padding:5, flexDirection:'column'}}>

                        {/* Bookmark Dropdown */}
                        <BookmarkDropdown onTagSelect={selectTag} currentTag={selectedTag} filter={false}/>

                        {/* Copy Text Button */}
                        <CustomButton onPress={copyFullText} customStyle={{flexDirection:'row', gap:5, backgroundColor:style.gray_200}}> 
                            <Text style={{color:style.gray_500, fontSize:style.text_xs, fontWeight:'500'}}>Copy full text</Text>
                            <Icon name={"copy"} size={15} color={style.gray_500} />
                        </CustomButton>

                        {/* Column 1 - Word Data */}
                        <View style={{flexDirection:'column', gap:10, marginTop:20}}>

                            {/* Form Label */}
                            <Text style={{color:style.gray_500, fontSize: style.text_md, fontWeight: '500'}}> Word data: </Text>

                            {/* Word Data input form */}
                            <View style={{ backgroundColor:style.gray_300, borderRadius:style.rounded_md}}>
                                <View style={{borderTopLeftRadius:style.rounded_md, borderTopRightRadius:style.rounded_md, backgroundColor:style.gray_300, height:50, padding:15, paddingTop:20}}>
                                    <Text style={{color:style.gray_600, fontWeight:'500'}}>Term, Translation, Notes (optional)</Text>
                                </View>
                                <CustomInput showLabel={false} placeholder={"Write csv data here..."} value={wordDataInput} 
                                                onChangeText={setWordDataInput} maxLength={50000} multiline={true} customFormStyle={{height:180, borderTopLeftRadius:0, borderTopRightRadius:0, borderTopWidth:0}}/>
                            </View>

                            {/* Button Container below the form */}
                            <View style={{flexDirection:'row', gap:5, flexWrap:'wrap'}}>
                                    {/* Copy Text Button */}
                                    <CustomButton onPress={copyWordData} customStyle={{flexDirection:'row', gap:5}}> 
                                        <Text style={{color:style.white, fontSize:style.text_xs, fontWeight:'500'}}>Copy Data</Text>
                                        <Icon name={"copy"} size={15} solid={true} color={style.white} />
                                    </CustomButton>
                                    {/* AI prompt button for word data */}
                                    <CustomButton onPress={wordPrompt} customStyle={{flexDirection:'row', gap:5}}> 
                                        <Text style={{color:style.white, fontSize:style.text_xs, fontWeight:'500'}}>Copy Prompt</Text>
                                        <Icon name={"copy"} size={15} solid={true} color={style.white} />
                                    </CustomButton>

                                    {/* Paste Data Button */}
                                    <CustomButton onPress={pasteData} customStyle={{flexDirection:'row', gap:5, height:35, backgroundColor:style.blue_200}}>
                                        <Text style={{color:style.blue_500, fontSize:style.text_xs, fontWeight:'600'}}>Paste</Text>
                                        <Icon name={"paste"} width={10} solid={true} height={10} color={style.blue_500} />
                                    </CustomButton>

                                    {/* Share button */}
                                    <CustomButton onPress={shareWordData} customStyle={{flexDirection:'row', gap:5, height:35, backgroundColor:style.blue_200}}>
                                        <Text style={{color:style.blue_500, fontSize:style.text_xs, fontWeight:'600'}}>Share</Text>
                                        <Icon name={"share"} width={12} height={10} color={style.blue_500} />
                                    </CustomButton>
                            </View>

                            {/* Print the errors of the CSV word input */}
                            <Text style={{color:style.red_500, fontWeight:"400", position: "relative", left:5, top:10}}>
                                { wordError }
                            </Text>

                        </View>

                        {/* Column 2 - Translation Data */}
                        <View style={{flexDirection:'column', gap:10, marginTop:20}}>

                            
                            {/* Translation Data input form */}
                            <CustomInput showLabel={true} label={"Full Translation"} placeholder={"Write translation here..."} value={textTranslation} 
                                            onChangeText={setTextTranslation} maxLength={50000} multiline={true} customFormStyle={{height:120}}/>

                            {/*Button container below the form*/}
                            <View style={{flexDirection:'row', gap:5, flexWrap:'wrap'}}>
                                {/* Copy Text Button */}
                                <CustomButton onPress={copyTranslation} customStyle={{flexDirection:'row', gap:5}}> 
                                    <Text style={{color:style.white, fontSize:style.text_xs, fontWeight:'500'}}>Copy Data</Text>
                                    <Icon name={"copy"} size={15} solid={true} color={style.white} />
                                </CustomButton>

                                {/* AI prompt button for word data */}
                                <CustomButton onPress={translationPrompt} customStyle={{flexDirection:'row', gap:5}}> 
                                    <Text style={{color:style.white, fontSize:style.text_xs, fontWeight:'500'}}>Copy Prompt</Text>
                                    <Icon name={"copy"} size={15} solid={true} color={style.white} />
                                </CustomButton>

                                {/* Paste Translation Button */}
                                <CustomButton onPress={pasteTranslation} customStyle={{flexDirection:'row', gap:5, height:35, backgroundColor:style.blue_200}}>
                                    <Text style={{color:style.blue_500, fontSize:style.text_xs, fontWeight:'600'}}>Paste</Text>
                                    <Icon name={"paste"} width={10} solid={true} height={10} color={style.blue_500} />
                                </CustomButton>

                                {/* Share button */}
                                <CustomButton onPress={shareTranslation} customStyle={{flexDirection:'row', gap:5, height:35, backgroundColor:style.blue_200}}>
                                    <Text style={{color:style.blue_500, fontSize:style.text_xs, fontWeight:'600'}}>Share</Text>
                                    <Icon name={"share"} width={12} height={10} color={style.blue_500} />
                                </CustomButton>

                            </View>

                            {/* Print the errors of the CSV sentence input */}
                            <Text style={{color:style.red_500, fontWeight:"400", paddingVertical:5}}>
                                { textError }
                            </Text>

                        </View>

                        {/* Submission button to submit data */}
                        <CustomButton onPress={loadData} customStyle={null}> 
                            <Text style={{color:style.white, fontSize:style.text_sm, fontWeight:'600'}}>Load Data</Text>
                        </CustomButton>

                        {/* Delete button */}
                        <View style={{flexDirection:'column', alignItems:'center',justifyContent:'center', marginTop: 10}}>
                            <TouchableOpacity onPress={deleteEntryFunc} style={{ marginTop:20 }} activeOpacity={0.7}>
                                        <Text style={{color:style.red_400, fontSize:style.text_md}}>Delete Story</Text>
                            </TouchableOpacity>
                        </View>
                        


                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>

        </CustomModal>
     );
}
 
export default EditDataModal;