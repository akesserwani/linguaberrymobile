import { useState, useContext } from "react";
import { TouchableOpacity, Text, useWindowDimensions, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import Icon from '@expo/vector-icons/FontAwesome6'
import * as style from '@/assets/styles/styles'

//import components 
import CustomModal from "@/app/components/CustomModal";
import CustomButton from "@/app/components/CustomButton";
import CustomInput from "@/app/components/CustomInput";

import TagSelection from "../tag_components/TagSelection";

//database functionality 
import { createNewWord, wordExistsInDeck } from "../../DataDecks";

//get current language from provider
import { CurrentLangContext } from "@/app/data/CurrentLangContext.tsx";


const CreateWordModal = ({ onClose, refresh, scrollToBottom, deckId }) => {

    //current language
    const { currentLang } = useContext(CurrentLangContext);

    // Get screen width dynamically
    const { width } = useWindowDimensions();
    //make responsive width for the modal size 
    const dynamicWidth = width < 800 ? '80%' : '50%';  // 80% for mobile, 50% for larger screens

    //get the data from the form for different values
    //get form data for the word
    const [formWord, setFormWord] = useState("");
    //get form data for the translation
    const [formTransl, setFormTransl] = useState("");
    //get form data for etymology
    const [formEty, setFormEty] = useState("");

    //var to toggle etymology form
    const [etyShow, toggleEty] = useState(false);

    //check to see if term already exists in deck
    const [termExist, setTermExist] = useState(false);

    // Callback to handle selected tag change
    const [selectedTag, setSelectedTag] = useState(null); // State to store the selected tag

    //this function will be set in TagSelection.tsx
    const handleTagSelection = (tag) => {
        if (tag === "Select a tag" || tag === "None"){
            setSelectedTag("None");
        } else {
            setSelectedTag(tag);
        }
    };
    

    //function to create a new word
    const createWord = () =>{

        //check if the word already exists
        if (wordExistsInDeck(currentLang, deckId, formWord)){
            //set warning to true therefore rendering it
            setTermExist(true);
        } else{
            //If the word doesnt already exist then allow it to be added

            //call the database function and pass the values
            const etymologyValue = formEty === "" ? "none" : formEty;
            
            createNewWord(formWord, formTransl, etymologyValue, selectedTag, deckId, currentLang );

            //function to refresh to deck
            refresh();

            //function to scroll to the bottom
            scrollToBottom(); 

            //close the modal
            onClose();
        }
 
    }
    
    
    return ( 
        <CustomModal title='New Word' onClose={onClose} overrideStyle={{width: dynamicWidth,  }}>

            <KeyboardAvoidingView behavior={'padding'} keyboardVerticalOffset={50} >
                <ScrollView>

                    {/* Dropdown to add a tag */}
                    <TagSelection currentLang={currentLang} deckId={deckId} onTagSelect={handleTagSelection}/>

                    {/* Form to add a word */}
                    <CustomInput label={ "Word"} placeholder={"Type word..." } value={formWord} onChangeText={setFormWord} 
                            maxLength={100} multiline={true} customFormStyle={{height: 80}}/>
                    
                    {/* term already exists in deck */}
                    { termExist && 
                        <Text style={{color:style.red_500, fontWeight:"400", position: "relative", left:5, top:10}}>Term already exists in this deck</Text>
                    }

                    {/* Form to add a translation */}
                    <CustomInput label={ "Translation"} placeholder={"Type translation..." } value={formTransl} onChangeText={setFormTransl} 
                                maxLength={100} customStyle={{marginTop: 25}} multiline={true} customFormStyle={{height: 80}}/>

                    <TouchableOpacity onPress={()=>toggleEty(!etyShow)} activeOpacity={0.6}>
                    <Text style={{color:style.blue_500, fontWeight:'500', fontSize:style.text_md, marginLeft: 5, marginTop:25}}>
                            { etyShow ? "Close Notes" : "Add Notes"  }
                        </Text>
                    </TouchableOpacity>


                    { etyShow &&
                        //Add etymology input, multiline form
                        <CustomInput showLabel={false} placeholder={"Type notes..." } value={formEty} 
                                onChangeText={setFormEty} maxLength={1000} multiline={true} customStyle={{marginTop:25}}
                                customFormStyle={{height:100}} />
                        
                    }

                    {/* Submit button */}
                    <CustomButton onPress={createWord} customStyle={{marginTop: 40, height:45}}>
                        <Text style={{color:style.white, fontSize: style.text_md}}>Add Word</Text>
                    </CustomButton>
                </ScrollView>

            </KeyboardAvoidingView>

        </CustomModal>


    );
}

export default CreateWordModal;