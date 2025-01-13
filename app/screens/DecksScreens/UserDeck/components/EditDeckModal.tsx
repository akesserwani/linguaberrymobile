import { useState, useEffect } from "react";
import { TouchableOpacity, View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Share } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import * as style from '@/assets/styles/styles'
import Icon from '@expo/vector-icons/FontAwesome6'

import * as Clipboard from 'expo-clipboard';

//custom components
import CustomButton from '@/app/components/CustomButton';
import CustomModal from '@/app/components/CustomModal';
import CustomInput from '@/app/components/CustomInput';
import CustomAlert from '@/app/components/CustomAlert';

//import data from data decks
import { updateDeck, deleteDeck, deckNameExist, getWords, createBulkWords} from "../../DataDecks";
//import object to csv function
import { ObjectToCSV, CSVToObject, validateCSVFormat } from "@/app/data/Functions";



const EditDeckModal = ({onClose, currentLang, deckId, deckName, refreshDeck, refreshWords }) => {

    //Variable for the deck name input
    const [inputName, setInputName] = useState(deckName);
    //Variable for the deck data input
    const [inputData, setInputData] = useState("");

    const navigation = useNavigation();

    //reactive variable to render if deck name already exists
    const [nameExists, setNameExists] = useState(false);

    //reactive variable to render error messages for word data
    const [dataError, setDataError] = useState("");
    useEffect(() => {
        setDataError("");
    }, [currentLang, deckId]);

    //Get the data to render it in the form
    const fetchData = () => {
        //get the words from the database
        const data = getWords(currentLang, deckId); 
        //convert those words in the database into CSV then set it to inputData 
        setInputData(ObjectToCSV(data));
    };

    //call use effect to fetch the data when component is mounted
    useEffect(() => {
        fetchData();
    }, [currentLang, deckId]);
    

    //function to update the deck name and data
    function updateDeckFunc(){
        //Check if deck name already exists
        if (inputName !== deckName && deckNameExist(inputName, currentLang)){
            setNameExists(true);

        } else{

            //If the Data input is valid
            const validation = validateCSVFormat(inputData);
            if (validation.valid) {

                //update the deck name via the database
                updateDeck(currentLang, deckId, inputName);

                //send the inputData to the database
                createBulkWords(CSVToObject(inputData), deckId, currentLang);
                
                //Call the function from - updateDeckName() in UserDeck.tsx 
                refreshDeck();

                //update deck words - fetchWords() in UserDeck.tsx
                refreshWords()

                //close the modal
                onClose();
            } else{
                setDataError(validation.error);
            }

        }        
    }
    

    //function to delete the deck
    function deleteDeckFunc(){

        //Make alert to confirm the deletion
        CustomAlert(
            `Are you sure you want to delete this deck?`, 
            'All of the words will be deleted as well.',  
            [
                { text: 'No',  onPress: () => console.log('Delete canceled'), style: 'cancel', },
                { text: 'Yes', onPress: () => {
                    //delete via database
                    deleteDeck(currentLang, deckId);
                    //close modal;
                    onClose();
                    //redirect to the decks home page
                    navigation.navigate('DecksHome'); 
                        
                    }
                }
            ],
            { cancelable: false } // Prevent dismissing the alert by tapping outside
        );

    }

    //share data button
    const shareData = async() =>{
        const result = await Share.share({message:inputData});
    }


    //copy data button
    const copyData = async() =>{
        await Clipboard.setStringAsync(inputData);

        CustomAlert("Data copied to clipboard");

    }

    //copy data button
    const copyAIPrompt = async() =>{

        const format = "term 1, translation 1 \n word 2, translation 2 "

        const prompt = `We are learning ${currentLang}. We want to generate translation values for these words: "${inputData}". Generate the term translation values in this CSV format ${format}. All lowercase. You can keep the notes column empty (so just term 1, translation 1). No repetition of words. `;

        await Clipboard.setStringAsync(prompt);

        CustomAlert("Data copied to clipboard");

    }

    //paste button
    const pasteButton = async() =>{
        //get the text
        const text = await Clipboard.getStringAsync()

        //set the text to the input data prompt
        setInputData(text)
    }
    

    return ( 
        <CustomModal title="Edit Deck" onClose={onClose} horizontalPadding={0} overrideStyle={{maxHeight:'80%'}} allowBackdropClose={false}>

            <KeyboardAvoidingView behavior={'padding'} keyboardVerticalOffset={50} style={{maxHeight:'95%'}}>
                <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ gap: 10, padding:35, flexDirection:'column' }}>
                    <TouchableOpacity activeOpacity={1}>
                        {/* DECK NAME */}
                        {/* Input to edit the deck */}
                        <CustomInput label={ "Deck Name"} placeholder={"Type deck name..." } value={inputName} onChangeText={setInputName} 
                                    maxLength={30} customFormStyle={{height: 50}}/>

                            {/* Deck name already exists */}
                            { nameExists && 
                                <Text style={{color:style.red_500, fontWeight:"400", position: "relative", left:5, top:10}}>Deck name already exists</Text>
                            }

                        {/* Input for the deck data */}
                            <View style={{marginTop:40, backgroundColor:style.gray_300, borderRadius:style.rounded_md}}>
                                <View style={{borderTopLeftRadius:style.rounded_md, borderTopRightRadius:style.rounded_md, backgroundColor:style.gray_300, height:50, padding:15, paddingTop:20}}>
                                    <Text style={{color:style.gray_600, fontWeight:'500'}}>Term, Translation, Notes (optional)</Text>
                                </View>
                                <CustomInput showLabel={false} placeholder={"Enter data..." } value={inputData} onChangeText={setInputData} 
                                    multiline={true} maxLength={100000} customFormStyle={{height:180, borderTopLeftRadius:0, borderTopRightRadius:0, borderTopWidth:0}}/>
                            </View>

                            {/* Print the errors of the CSV data input */}
                            <Text style={{color:style.red_500, fontWeight:"400"}}>
                                { dataError }
                            </Text>
                        
                        {/* Button Container */}
                        <View style={{flexDirection:'row', gap:5, flexWrap:'wrap'}}>
                            {/* Copy Text Button */}
                            <CustomButton onPress={copyData} customStyle={{flexDirection:'row', gap:5}}> 
                                <Text style={{color:style.white, fontSize:style.text_xs, fontWeight:'500'}}>Copy Data</Text>
                                <Icon name={"copy"} size={15} solid={true} color={style.white} />
                            </CustomButton>

                            {/* AI prompt button for word data */}
                            <CustomButton onPress={copyAIPrompt} customStyle={{flexDirection:'row', gap:5}}> 
                                <Text style={{color:style.white, fontSize:style.text_xs, fontWeight:'500'}}>Copy Prompt</Text>
                                <Icon name={"copy"} size={15} solid={true} color={style.white} />
                            </CustomButton>

                            {/* Paste Data Button */}
                            <CustomButton onPress={pasteButton} customStyle={{flexDirection:'row', gap:5, height:35, backgroundColor:style.blue_200}}>
                                <Text style={{color:style.blue_500, fontSize:style.text_xs, fontWeight:'600'}}>Paste</Text>
                                <Icon name={"paste"} width={10} solid={true} height={10} color={style.blue_500} />
                            </CustomButton>

                            {/* Share Data Button */}
                            <CustomButton onPress={shareData} customStyle={{flexDirection:'row', gap:5, height:35, backgroundColor:style.blue_200}}>
                                <Text style={{color:style.blue_500, fontSize:style.text_xs, fontWeight:'600'}}>Share</Text>
                                <Icon name={"share"} width={12} height={10} color={style.blue_500} />
                            </CustomButton>

                        </View>

                        {/* User warning to use semicolon instead of commas*/}
                        <Text style={{color:style.gray_400, fontWeight:"500", margin:5, marginTop:20}}>
                            Note: Use semicolons instead of commas in the individual terms, translations, and notes
                        </Text>


                        {/* Button to update the deck */}
                        <CustomButton onPress={updateDeckFunc} customStyle={{marginTop: 40, height:45}}>
                                <Text style={{color:style.white, fontSize: style.text_md}}>Update Deck</Text>
                        </CustomButton>


                        {/* Button to delete the deck */}
                        <View style={{flexDirection:'column', alignItems:'center',justifyContent:'center', marginTop: 10}}>
                            <TouchableOpacity onPress={deleteDeckFunc} style={{ marginTop:20 }} activeOpacity={0.7}>
                                        <Text style={{color:style.red_400, fontSize:style.text_md}}>Delete Deck</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </CustomModal>
     );
}
 
export default EditDeckModal;