import { useState, useEffect, useContext } from "react";
import { TouchableOpacity, View, Text, StyleSheet, ScrollView, useWindowDimensions } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';

import Icon from '@expo/vector-icons/FontAwesome6'
import * as style from '@/assets/styles/styles'

import CustomModal from "@/app/components/CustomModal";
import CustomInput from "@/app/components/CustomInput";
import CustomButton from "@/app/components/CustomButton";

//data for context
import { CurrentLangContext } from '@/app/data/CurrentLangContext.tsx';

//import data functions from DataReader
import { getWordData, updateWordData, getTranslationData, updateTranslationData } from "../../DataReader";
//data functions
import { validateCSVFormat, CSVToObject, ObjectToCSV } from "@/app/data/Functions";

const EditDataModal = ({onClose, entryId, setRefresh}) => {

    //current language
    const { currentLang } = useContext(CurrentLangContext);


    //variables for input forms
    const [wordDataInput, setWordDataInput] = useState(null);
    const [textTranslation, setTextTranslation] = useState(null);


    // create useEffect to get data and insert in form
    useEffect(()=>{
        //set the word data
        const wordData = getWordData(entryId, currentLang);
        setWordDataInput(ObjectToCSV(wordData));

        //set the sentence data
        const translation_data = getTranslationData(entryId, currentLang);
        setTextTranslation(translation_data);

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

    const { width } = useWindowDimensions(); // Get screen width

    return ( 
        <CustomModal title="Edit Data" onClose={onClose}>
                {/* Main Content here */}
                <ScrollView contentContainerStyle={[{ gap: 20 },{ flexDirection: width > 1000 ? 'row' : 'column' } ]}>

                    {/* Column 1 - Word Data */}
                    <View style={{flexDirection:'column', gap:10, width: width > 800 ? '50%' : '100%'}}>
                        {/* Title and Button in a row */}    
                        <View style={{flexDirection:'row', justifyContent:'space-between', alignContent:'center', alignItems:'center', margin:5}}>
                            {/* Title */}
                            <Text style={{color:style.gray_500, fontSize: style.text_md, fontWeight: '500'}}>Word Data:</Text>

                            {/* AI prompt button for word data */}
                            <CustomButton onPress={()=>{}} customStyle={{flexDirection:'row', gap:5, backgroundColor:style.gray_200}}> 
                                <Text style={{color:style.gray_500, fontSize:style.text_xs, fontWeight:'500'}}>AI Prompt</Text>
                                <Icon name={"copy"} size={15} color={style.gray_500} />
                            </CustomButton>
                        </View>       

                        {/* Word Data input form */}
                        <CustomInput showLabel={false} placeholder={"Write csv data here..."} value={wordDataInput} 
                                        onChangeText={setWordDataInput} maxLength={50000} multiline={true} customFormStyle={{height:120}}/>

                        {/* Print the errors of the CSV word input */}
                        <Text style={{color:style.red_500, fontWeight:"400", position: "relative", left:5, top:10}}>
                            { wordError }
                        </Text>

                    </View>

                    {/* Column 2 - Sentence Data */}
                    <View style={{flexDirection:'column', gap:5, width: width > 800 ? '50%' : '100%'}}>
                        <View style={{flexDirection:'row', justifyContent:'space-between', alignContent:'center', alignItems:'center', margin:5}}>
                            {/* Title */}
                            <Text style={{color:style.gray_500, fontSize: style.text_md, fontWeight: '500'}}>Full Translation:</Text>

                            {/* AI prompt button for word data */}
                            <CustomButton onPress={()=>{}} customStyle={{flexDirection:'row', gap:5, backgroundColor:style.gray_200}}> 
                                <Text style={{color:style.gray_500, fontSize:style.text_xs, fontWeight:'500'}}>AI Prompt</Text>
                                <Icon name={"copy"} size={15} color={style.gray_500} />
                            </CustomButton>
                        </View>       

                        {/* Sentence Data input form */}
                        <CustomInput showLabel={false} placeholder={"Write translation here..."} value={textTranslation} 
                                        onChangeText={setTextTranslation} maxLength={50000} multiline={true} customFormStyle={{height:120}}/>

                        {/* Print the errors of the CSV sentence input */}
                        <Text style={{color:style.red_500, fontWeight:"400", position: "relative", left:5, top:10}}>
                            { textError }
                        </Text>

                    </View>

                    {/* Submission button to submit data */}
                    <CustomButton onPress={loadData} customStyle={null}> 
                        <Text style={{color:style.white, fontSize:style.text_sm, fontWeight:'600'}}>Load Data</Text>
                    </CustomButton>

                    {/* Help Link */}
                    <TouchableOpacity activeOpacity={0.7} style={{alignItems:'center'}}>
                        <Text style={{color:style.blue_500, fontSize:style.text_sm, fontWeight:'500'}}>
                            Need help? 
                        </Text>
                    </TouchableOpacity>

                </ScrollView>

        </CustomModal>
     );
}
 
export default EditDataModal;