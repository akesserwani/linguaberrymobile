import { useState, useEffect, useContext } from "react";
import { TouchableOpacity, View, Text, StyleSheet, ScrollView, FlatList } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';

import Icon from '@expo/vector-icons/FontAwesome6'
import * as style from '@/assets/styles/styles'

import CustomModal from "@/app/components/CustomModal";
import CustomInput from "@/app/components/CustomInput";
import CustomAlert from "./CustomAlert";
import CustomButton from "@/app/components/CustomButton";
import AddWordToDeck from "@/app/components/AddWordToDeck";

//data for context
import { CurrentLangContext } from '@/app/data/CurrentLangContext.tsx';

//get data
import { getWordData } from "../screens/ReaderScreens/DataReader";

import { limitLength } from "../data/Functions";

import { deckNameExist, createNewDeck, createBulkWordsByDeckName } from "../screens/DecksScreens/DataDecks";


const ViewWordModal = ({onClose, modalTitle, json=false, entryId = null, dataProp = null}) => {

    //current language
    const { currentLang } = useContext(CurrentLangContext);


    //Create reactive variable to trigger whether we want to show AddWordToDeck Component or not
    const [addToDeck, toggleAddWord] = useState(false);
    //Reactive variable that carries the word to add to the modal
    const [wordToAdd, setWordtoAdd] = useState([]);


    //word data
    const [wordData, setWordData] = useState("");

    useEffect(()=>{
        //If the data passed is JSON (json prop is true), use the data from the data prop
        if (json){
            setWordData(dataProp);    
        } else {
            //Else get the word data using the decks ID 
            const word_data = getWordData(entryId, currentLang);
            setWordData(word_data);    
        }
    },[])

    const saveDeck = () =>{

        //This method will create a new deck
        //create new deck name
        //Check if the deckname doesnt exist
        if (deckNameExist(modalTitle, currentLang)){
            //If deck already exists make an alert
            CustomAlert("You have already saved this deck", "Check to see if you already have a deck by this name under 'Decks'");
        } else {
            //If it does not exist, create the name of the deck
            createNewDeck(modalTitle, currentLang);

            //Push the data to the database
            createBulkWordsByDeckName(modalTitle, wordData, currentLang);

            //Make an alert showing that it was successful
            CustomAlert("Deck Saved!", "Look under 'Decks' to find this deck");

            //close the modal
            onClose();

        }
    }


    return ( 
        <CustomModal title={limitLength(modalTitle, 25)} onClose={onClose} overrideStyle={{maxHeight:'80%'}} horizontalPadding={0} topPadding={0}>

            {/* Add word to deck component will be triggered at top of page  */}
            { addToDeck &&
                <AddWordToDeck onClose={()=>toggleAddWord(false)} wordToAdd={wordToAdd}/>
            }

            {/* Content Area */}
            <View style={styles.contentContainer}>

                {/* Top container above the labels */}
                {/* Button here to add entire data to deck */}
                <View style={{flexDirection:'row', justifyContent:'space-between', alignContent:'center', paddingHorizontal:25, paddingVertical:15, backgroundColor:style.gray_100 }}>         
                    
                    {/* Save deck button on the Right */}
                    <CustomButton customStyle={{width:150, flexDirection:'row', gap:15}} onPress={saveDeck}>
                        {/* Text */}
                        <Text style={{color:style.white, fontWeight:'500'}}>Save Deck</Text>
                        {/* Icon */}
                        <Icon name={"download"} size={15} color={style.white}/>
                    </CustomButton>

                    {/* number of words on the left */}
                    <Text style={{color:style.gray_400, fontWeight:'600', margin:15, marginRight:30}}>{ wordData.length } words</Text>

                </View>


                {/* Top bar with labels */}
                <View style={{flexDirection:'row', backgroundColor: style.gray_100 ,borderBottomWidth: style.border_md, gap:20, borderColor: style.gray_200, paddingHorizontal:15, paddingVertical:20, justifyContent:'center' }}>
                    <View style={{width: '40%', justifyContent: 'center'}}>
                        <Text style={{ color: style.gray_600, fontSize: style.text_md, fontWeight:'600' }}>Term</Text> 
                    </View>
                    <View style={{width: '40%', justifyContent: 'center'}}>
                        <Text style={{ color: style.gray_600, fontSize: style.text_md, fontWeight:'600' }}>Translation</Text> 
                    </View>
                </View>

                {/* Check if there are no words in renderedWords */}

                {wordData.length === 0 ? (
                    <View style={{height:100, justifyContent:'center', alignItems:'center'}}>
                        <Text style={{ color: style.gray_400, fontSize: style.text_md, fontWeight:'600', textAlign: 'center', margin: 20 }}>
                            No words
                        </Text>
                    </View>
                ) : (
                    // Render words in a flatlist 
                    <FlatList
                        data={wordData}
                        contentContainerStyle = {{paddingRight:10, paddingTop:10, paddingBottom:20, paddingHorizontal:20 }}
                        keyExtractor={(item, index) => index.toString()} 
                        renderItem={({ item, index }) => (
                        <TouchableOpacity onPress={ 
                            () =>{
                                toggleAddWord(true);
                                setWordtoAdd([ item.term, item.translation, item.notes ]); 
                            } 
                        } activeOpacity={0.7} 
                          style={[styles.item, {borderBottomWidth: index === wordData.length - 1 ? 0 : style.border_sm}]}>

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
        backgroundColor:style.white
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


export default ViewWordModal;