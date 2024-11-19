import { useState, useEffect, useContext } from "react";
import { TouchableOpacity, View, Text, StyleSheet, ScrollView, FlatList } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';

import Icon from '@expo/vector-icons/FontAwesome6'
import * as style from '@/assets/styles/styles'

import CustomModal from "@/app/components/CustomModal";
import CustomInput from "@/app/components/CustomInput";
import CustomButton from "@/app/components/CustomButton";
import CustomAlert from "./CustomAlert";

//data for context
import { CurrentLangContext } from '@/app/data/CurrentLangContext.tsx';

import { getAllDecks, createNewWord } from "../screens/DecksScreens/DataDecks";

const AddWordToDeck = ({onClose, wordToAdd}) => {

    //current language context
    const { currentLang } = useContext(CurrentLangContext);


    const [dropdownOpen, openDropdown] = useState(false);


    //deck data - it will hold the names of the decks
    const [deckData, setDeckData] = useState(null);

    //selected deck, this will hold the deck name that has been selected
    const [selectedDeck, setSelectedDeck] = useState("");
    const [selectedDeckId, setSelectedDeckId] = useState(null);

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
            createNewWord(wordToAdd[0], wordToAdd[1], "None", "None", selectedDeckId, currentLang)
            //close the modal
            onClose();

            //make an alert
            CustomAlert("Word Added!");
        }
    }

    return ( 
        <CustomModal title="Add Word to Deck" onClose={onClose}>

            {/* Tag Dropdown Button */}
            <CustomButton onPress={() => openDropdown(!dropdownOpen)} customStyle={styles.tagDropdown}>
                <Text style={{color:style.gray_500}}>
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
            <Text style={{margin:5, marginBottom: 20, color: style.gray_600, fontWeight:'500', fontSize: style.text_md}}>
                Word Selected: {wordToAdd[0]}
            </Text>

            {/* Button to add to deck */}
            <CustomButton onPress={addWordToDeckFunc} customStyle={null}>
                <Text style={{color:style.white, fontSize:style.text_sm, fontWeight:'500'}}>Add to Deck</Text>
            </CustomButton>
            
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
        borderWidth: style.border_sm, 
        borderColor: style.gray_200
    },

    dropdownBox: {
        position: 'absolute', 
        top: 80, 
        left: 30,
        right: 0,
        padding: 15,
        maxHeight:'80%',

        zIndex: 99,
        width:300,

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