import { View, Text, StyleSheet, useWindowDimensions, TouchableOpacity, ScrollView, KeyboardAvoidingView} from 'react-native';
import { useContext, useLayoutEffect, useState, useEffect, useRef } from 'react';
//data for context
import { CurrentLangContext } from '@/app/data/CurrentLangContext.tsx';

import CustomButton from '@/app/components/CustomButton';
import CustomModal from '@/app/components/CustomModal';
import CustomInput from '@/app/components/CustomInput';
import CustomAlert from '@/app/components/CustomAlert';

import EditTagSelection from '../tag_components/EditTagSelection';

//styles
import * as style from '@/assets/styles/styles'
import Icon from '@expo/vector-icons/FontAwesome6'

//import function to shorten data
import { limitLength } from '@/app/data/Functions';
import { isRTLChar } from '@/app/data/LangData';

//import function to toggle the starred value
import { toggleStar, getStarred, updateWord, deleteWord, wordExistsInDeck } from '../../DataDecks';
import React from 'react';


const WordModal = ({onClose, deckId, wordData, deckName}) => {


    //get the current language
    const { currentLang } = useContext(CurrentLangContext);

    const [editToggled, toggleEdit] = useState(false);


    //Data for the form inputs
    //get form data for the word
    const [formWord, setFormWord] = useState(wordData.term);
    //get form data for the translation
    const [formTransl, setFormTransl] = useState(wordData.translation);
    //get form data for etymology
    const [formEty, setFormEty] = useState(wordData.notes);


    //function to get the value of starred and thus which star to render
    const [starred, setStarred] = useState(getStarred(currentLang, deckId, wordData.term));

    //funcitonality to toggle the star once a change has been made
    const toggleStarredFunc = () =>{

        //send the functionalities to the database
        toggleStar(currentLang, deckId, wordData.term);

        //set the starred variable to rerender the UI
        setStarred(getStarred(currentLang, deckId, wordData.term));

    }

    //check to see if term already exists in deck
    const [termExist, setTermExist] = useState(false);

    //update word
    //function to update the word
    const updateWordFunc = () =>{

        if (formWord !== wordData.term && wordExistsInDeck(currentLang, deckId, formWord)){
            //set warning to true therefore rendering it
            setTermExist(true);
        } else{

            //call function to the database 
            const etymologyValue = formEty === "" ? "none" : formEty;

            //convert all commas in a string into a semicolon
            let cleanFormWord = formWord.replace(/,/g, ';');
            let cleanFormTransl = formTransl.replace(/,/g, ';');
            let cleanFormEty = etymologyValue.replace(/,/g, ';');

            updateWord(currentLang, deckId, wordData.term, cleanFormWord, cleanFormTransl, cleanFormEty);

            toggleEdit(false);

            //refresh the data in word data
            wordData.term = cleanFormWord;
            wordData.translation = cleanFormTransl;
            wordData.notes = cleanFormEty;
        }
    }

    //delete word
    //function to delete the word
    const deleteWordFunc = () =>{

        //Make alert to confirm the deletion
        CustomAlert(
            `Are you sure you want to delete this word?`, 
            'You will not be able to recover it.',  
            [
                { text: 'No',  onPress: () => console.log('Delete canceled'), style: 'cancel', },
                { text: 'Yes', onPress: () => {
                        // If "Yes" is pressed, delete the word
                        deleteWord(currentLang, deckId, wordData.term);
                        //closeModal
                        onClose();
                    }
                }
            ],
            { cancelable: false } // Prevent dismissing the alert by tapping outside
        );
    
    }

    //Switch term/translation functionality
    const switchData = () =>{
        //set formWord to the form translation
        setFormWord(formTransl);

        //set formTranslation to the formWord
        setFormTransl(formWord);
    }
    
    

    return ( 
        <CustomModal onClose={onClose} title= {limitLength(wordData.term, 15)} overrideStyle={{maxHeight:550}}>

            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{paddingRight:15, paddingBottom:200}} style={{ maxHeight: 400 }} >

            {/* Top Panel with Edit Button and Star Button */}
            <View style={{flexDirection:'row', justifyContent:"space-between", paddingBottom: 10}}>

                { !editToggled ? (
                        // {/* Edit Button - pressing it will toggle the forms and it will become the save button*/}
                        <CustomButton onPress={()=>toggleEdit(!editToggled)} customStyle={{flexDirection:'row', gap:8}}>
                            <Text style={{color:style.white}}>Edit</Text>
                            <Icon name={"pencil"} size={12} color={style.white} />
                        </CustomButton>

                    ) : (
                        // {/* Save Button */}
                        <CustomButton onPress={updateWordFunc} customStyle={{flexDirection:'row', gap:8}}>
                            <Text style={{color:style.white}}>Save</Text>
                            <Icon name={"download"} size={12} color={style.white} />
                        </CustomButton>
                    )
                }


                {/*Starred Button - this will toggle the starred button*/}
                <TouchableOpacity onPress={ () => toggleStarredFunc() } 
                    activeOpacity={0.7}>
                    {/* Render the Star based on whether it is starred (1) or not starred (0) */}
                    { starred == 0 ? (
                        <Icon name={"star"} solid={true}  size={20} color={style.gray_300} style={{margin: 10}} />

                    ) : (
                        <Icon name={"star"} solid={true} size={20} color={'#facc15'} style={{margin: 10}} />
                    )}
                </TouchableOpacity>

            </View>

            {/* Tag Selection */}
            {/* Do not render if user is in edit mode */}
            { !editToggled && 
                <EditTagSelection currentLang={currentLang} deckId={deckId} wordData={wordData}/>
            }

            <View style={{flexDirection:'column', borderTopWidth: 1, borderTopColor: style.gray_200}}>
                {/* Term */}
               { !editToggled ? (
                    <>
                        {/* //If edit is not toggled - show the text */}
                        <Text style={{color:style.gray_500, fontSize: style.text_lg, fontWeight: '500', marginTop: 20}}>Term: </Text>
                        <Text style={{color:style.gray_500, fontSize: style.text_lg, fontWeight: '300', marginTop: 5, textAlign: isRTLChar(wordData.term)  ? 'right' : 'left',}}> 
                        { wordData.term }
                        </Text>
                    </>
                    ) : (
                        <>
                        {/* if it is toggled, show the edit form */}
                        <CustomInput showLabel={true} label={"Term"} placeholder={"Type term..." } value={formWord} onChangeText={setFormWord} 
                        maxLength={100} customStyle={{marginTop: 30}} multiline={true} customFormStyle={{height: 80}}/>
                        {/* term already exists in deck */}
                        { termExist && 
                            <Text style={{color:style.red_500, fontWeight:"400", position: "relative", left:5, top:10}}>Term already exists in this deck</Text>
                        }
                        </>
                    )
                }


                {/* Switch term and translation button - only visible if edit toggled */}
                { editToggled &&
                    <View style={{padding:5, flexDirection:'row', justifyContent:'flex-end', paddingTop:30}}>
                        <TouchableOpacity onPress={switchData} activeOpacity={0.7}>
                            <Icon name={"arrows-up-down"} size={20} color={style.gray_500}/>
                        </TouchableOpacity>
                    </View>
                }



                {/* Translation */}
                { !editToggled ? (
                    <>
                    <Text style={{color:style.gray_500, fontSize: style.text_lg, fontWeight: '500', marginTop: 30}}>Translation: </Text>
                    {/* If edit is not toggled - show the text */}
                    <Text style={{color:style.gray_500, fontSize: style.text_lg, fontWeight: '300', marginTop: 5, textAlign: isRTLChar(wordData.translation)  ? 'right' : 'left',}}> 
                        { wordData.translation }
                    </Text>
                    </>
                    ) : (
                        //if it is toggled, show the edit form
                        <CustomInput showLabel={true} label={"Translation"} placeholder={"Type translation..." } value={formTransl} onChangeText={setFormTransl} 
                        maxLength={100} customStyle={{marginTop: 30}} multiline={true} customFormStyle={{height: 80}}/>
                    )
                }

                {/* Etymology */}
                { !editToggled ? (
                    <>
                    <Text style={{color:style.gray_500, fontSize: style.text_lg, fontWeight: '500', marginTop: 30}}>Notes: </Text>
                    {/* //If edit is not toggled - show the text */}
                    <Text style={{color:style.gray_500, fontSize: style.text_lg, fontWeight: '300', marginTop: 5, textAlign: isRTLChar(wordData.term)  ? 'right' : 'left',}}> 
                        { wordData.notes }
                    </Text>
                    </>
                    ) : (
                        //if it is toggled, show the edit form
                        <CustomInput showLabel={true} label={"Notes"} placeholder={"Type notes..." } value={formEty} 
                        onChangeText={setFormEty} maxLength={1000} multiline={true} customStyle={{marginTop:25}}
                        customFormStyle={{height:100}} />
                    )
                }

            </View>

            {/* DELETE BUTTON */}
            <View style={{flexDirection:'column', alignItems:'center',justifyContent:'center', borderTopWidth: 1, borderTopColor: style.gray_200, marginTop:15}}>
                <TouchableOpacity onPress={()=>deleteWordFunc()} style={{ marginTop:30 }} activeOpacity={0.7}>
                            <Text style={{color:style.red_400, fontSize:style.text_md}}>Delete Word</Text>
                </TouchableOpacity>
            </View>
            
        </ScrollView>
    </CustomModal>

     );
}
 
export default WordModal;