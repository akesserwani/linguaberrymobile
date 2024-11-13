import { useState, useEffect } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import * as style from '@/assets/styles/styles'

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

    return ( 
        <CustomModal title="Edit Deck" onClose={onClose}>

            {/* DECK NAME */}
            {/* Input to edit the deck */}
            <CustomInput label={ "Deck Name"} placeholder={"Type deck name..." } value={inputName} onChangeText={setInputName} 
                        maxLength={30} customFormStyle={{height: 50}}/>

                {/* Deck name already exists */}
                { nameExists && 
                    <Text style={{color:style.red_500, fontWeight:"400", position: "relative", left:5, top:10}}>Deck name already exists</Text>
                }

            {/* Input for the deck data */}
            <CustomInput label={ "Text Data (CSV)"} placeholder={"Enter data..." } value={inputData} onChangeText={setInputData} 
                       multiline={true} maxLength={100000} customStyle={{marginTop:40}} customFormStyle={{height: 120}} />

                {/* Print the errors of the CSV data input */}
                <Text style={{color:style.red_500, fontWeight:"400", position: "relative", left:5, top:10}}>
                    { dataError }
                </Text>

            {/* Button to update the deck */}
            <CustomButton onPress={updateDeckFunc} customStyle={{marginTop: 40, height:45}}>
                    <Text style={{color:style.white, fontSize: style.text_md}}>Update Deck</Text>
            </CustomButton>


            {/* Button to delete the deck */}
            <View style={{flexDirection:'column', alignItems:'center',justifyContent:'center', marginTop: 10}}>
                <TouchableOpacity onPress={deleteDeckFunc} style={{ marginTop:30 }} activeOpacity={0.7}>
                            <Text style={{color:style.red_400, fontSize:style.text_md}}>Delete Deck</Text>
                </TouchableOpacity>
            </View>

        </CustomModal>
     );
}
 
export default EditDeckModal;