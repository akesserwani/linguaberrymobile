import { useState, useEffect, useContext } from "react";
import { TouchableOpacity, View, Text, StyleSheet, ScrollView, FlatList } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';

import Icon from '@expo/vector-icons/FontAwesome6'
import * as style from '@/assets/styles/styles'

import CustomModal from "@/app/components/CustomModal";
import CustomInput from "@/app/components/CustomInput";
import CustomButton from "@/app/components/CustomButton";
import CustomAlert from "@/app/components/CustomAlert";
import * as Clipboard from 'expo-clipboard'; // Import clipboard for copying

//data for context
import { CurrentLangContext } from '@/app/data/CurrentLangContext.tsx';

import { getAllDecks, createNewWord } from "../DecksScreens/DataDecks";

const AddWordToDeck = ({onClose, wordToAdd}) => {

    //current language context
    const { currentLang } = useContext(CurrentLangContext);


    const [dropdownOpen, openDropdown] = useState(false);


    //deck data - it will hold the names of the decks
    const [deckData, setDeckData] = useState(null);

    //selected deck, this will hold the deck name that has been selected
    const [selectedDeck, setSelectedDeck] = useState("");
    const [selectedDeckId, setSelectedDeckId] = useState(null);

    //text for the the data
    //get form data for the word
    const [formWord, setFormWord] = useState(wordToAdd[0]);
    //get form data for the translation
    const [formTransl, setFormTransl] = useState(wordToAdd[1]);
    //get form data for etymology
    const [formEty, setFormEty] = useState(wordToAdd[2]);
    
    //var to toggle etymology form
    const [etyShow, toggleEty] = useState(false);


    //Function to get names of decks
    useEffect(()=>{
        const data = getAllDecks(currentLang);
        setDeckData(data);
    },[currentLang])

    //function to add the word to the deck
    const addWordToDeckFunc = () =>{
        if (selectedDeck === ""){
            CustomAlert("Need to select a deck!");
        } else {
            //createNewWord
            createNewWord(formWord, formTransl, formEty, "None", selectedDeckId, currentLang)
            //close the modal
            onClose();

            //make an alert
            CustomAlert("Word Added!");
        }
    }

    return ( 
        <CustomModal title="Add Word to Deck" onClose={onClose} overrideStyle={{height:'70%'}}>
            <View style={{flexDirection:'column', gap:15}}>
                {/* Tag Dropdown Button */}
                <CustomButton onPress={() => openDropdown(!dropdownOpen)} customStyle={styles.tagDropdown}>
                    <Text style={{color:style.gray_500, fontSize:style.text_md}}>
                        { selectedDeck === "" ? "Add to Deck" : selectedDeck  }
                    </Text>
                    <Icon name={dropdownOpen ? "caret-down" : "caret-up"} size={15} color={style.gray_500}/>
                </CustomButton>

                {/* Dropdown box */}
                { dropdownOpen && 
                    <View style={styles.dropdownBox}>
                        <FlatList
                            data={deckData}
                            keyExtractor={(item, index) => index.toString()} 
                            renderItem={({ item, index }) => (
                                <TouchableOpacity onPress={()=>{
                                    setSelectedDeck(item.name);
                                    setSelectedDeckId(item.id);
                                    openDropdown(false);
                                }
                                } activeOpacity={0.7} style={{paddingVertical:10}}>
                                    <Text style={{ color: style.gray_500, fontSize: style.text_md }}> 
                                        {item.name}
                                    </Text> 
                                </TouchableOpacity>
                            )}/>

                    </View>
                }

                {/* Text Message that shows selected word */}   
                <ScrollView style={{maxHeight: 400}} contentContainerStyle={{width:'90%', paddingBottom:50}}>

                    {/* Selected Term */}
                    {/* Form to add a word */}
                    <CustomInput label={ "Term"} placeholder={"Type term..." } value={formWord} onChangeText={setFormWord} 
                            maxLength={100} multiline={true} customFormStyle={{height: 80}} customStyle={{marginBottom:10}}/>

                    {/* Form to add a translation */}
                    <CustomInput label={ "Translation"} placeholder={"Type translation..." } value={formTransl} onChangeText={setFormTransl} 
                                maxLength={100}  multiline={true} customFormStyle={{height: 80}}/>

                    <TouchableOpacity onPress={()=>toggleEty(!etyShow)} activeOpacity={0.6}>
                        <Text style={{color:style.blue_500, fontWeight:'500', fontSize:style.text_md, marginLeft: 5, marginTop:25}}>
                                { etyShow ? "Close Notes" : "Add Notes"  }
                        </Text>
                    </TouchableOpacity>


                    { etyShow &&
                        //Add etymology input, multiline form
                        <CustomInput showLabel={false} placeholder={"Type notes..." } value={formEty} 
                                onChangeText={setFormEty} maxLength={1000} multiline={true} customStyle={{marginTop:25}}
                                customFormStyle={{height:100}}/>
                        
                    }

                    {/* Button to add to deck */}
                    <CustomButton onPress={addWordToDeckFunc} customStyle={{marginTop:40}}>
                        <Text style={{color:style.white, fontSize:style.text_md, fontWeight:'500'}}>Add to Deck</Text>
                    </CustomButton>
                </ScrollView>
            </View>
        </CustomModal>     
    );
}
 
const styles = StyleSheet.create({
    tagDropdown:{
        marginTop:5,
        marginBottom:20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor:style.white, 
        borderWidth: style.border_md, 
        borderColor: style.gray_200
    },

    dropdownBox: {
        position: 'absolute', 
        top: 50, 
        padding: 15,

        zIndex: 99,
        width:280,
        maxHeight:'100%',

        borderWidth: 1,
        borderColor: style.gray_200,
        borderRadius: style.rounded_md,
        backgroundColor: style.white,
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 4,
        elevation: 2,       

        flexDirection:"column",
        gap: 20,
    },
    
});

export default AddWordToDeck;