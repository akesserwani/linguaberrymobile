import { View, Text, StyleSheet, useWindowDimensions, TouchableOpacity, ScrollView} from 'react-native';
import { useContext, useLayoutEffect, useState, useEffect, useRef } from 'react';
//data for context
import { CurrentLangContext } from '@/app/data/CurrentLangContext.tsx';

import CustomButton from '@/app/components/CustomButton';
import CustomModal from '@/app/components/CustomModal';
import CustomInput from '@/app/components/CustomInput';
import CustomAlert from '@/app/components/CustomAlert';

//styles
import * as style from '@/assets/styles/styles'
import Icon from '@expo/vector-icons/FontAwesome6'

//import function to toggle the starred value
import { toggleStar, getStarred, updateWord, deleteWord, wordExistsInDeck } from '../../DataDecks';


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
    const [formEty, setFormEty] = useState(wordData.etymology);


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

            updateWord(currentLang, deckId, wordData.term, formWord, formTransl, etymologyValue);

            toggleEdit(false);

            //refresh the data in word data
            wordData.term = formWord;
            wordData.translation = formTransl;
            wordData.etymology = etymologyValue;
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
    

    return ( 
        <CustomModal onClose={onClose} title={ deckName }>
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
                    <Icon name={"star"} size={20} color={style.gray_500} style={{margin: 10}} />

                ) : (
                    <Icon name={"star"} solid={true} size={20} color={'#facc15'} style={{margin: 10}} />
                )}
            </TouchableOpacity>

        </View>

        <ScrollView style={{flexDirection:'column', borderTopWidth: 1, borderTopColor: style.gray_200}}>
             {/* Term */}
             <Text style={{color:style.gray_500, fontSize: style.text_lg, fontWeight: '500', marginTop: 20}}>Term: </Text>
            { !editToggled ? (
                //If edit is not toggled - show the text
                <Text style={{color:style.gray_500, fontSize: style.text_lg, fontWeight: '300', marginTop: 5}}> 
                 { wordData.term }
                </Text>
                ) : (
                    <>
                    {/* if it is toggled, show the edit form */}
                    <CustomInput showLabel={false} placeholder={"Type word..." } value={formWord} onChangeText={setFormWord} 
                    maxLength={100} customStyle={{marginTop: 25}} multiline={true} customFormStyle={{height: 80}}/>
                    {/* term already exists in deck */}
                    { termExist && 
                        <Text style={{color:style.red_500, fontWeight:"400", position: "relative", left:5, top:10}}>Term already exists in this deck</Text>
                    }
                    </>
                )
            }

             {/* Translation */}
             <Text style={{color:style.gray_500, fontSize: style.text_lg, fontWeight: '500', marginTop: 20}}>Translation: </Text>
             { !editToggled ? (
                //If edit is not toggled - show the text
                <Text style={{color:style.gray_500, fontSize: style.text_lg, fontWeight: '300', marginTop: 5}}> 
                    { wordData.translation }
                 </Text>
                ) : (
                    //if it is toggled, show the edit form
                    <CustomInput showLabel={false} placeholder={"Type translation..." } value={formTransl} onChangeText={setFormTransl} 
                    maxLength={150} customStyle={{marginTop: 25}} multiline={true} customFormStyle={{height: 80}}/>
                )
            }
             {/* Etymology */}
             <Text style={{color:style.gray_500, fontSize: style.text_lg, fontWeight: '500', marginTop: 20}}>Etymology: </Text>
             { !editToggled ? (
                //If edit is not toggled - show the text
                <Text style={{color:style.gray_500, fontSize: style.text_lg, fontWeight: '300', marginTop: 5}}> 
                    { wordData.etymology }
                </Text>
                ) : (
                    //if it is toggled, show the edit form
                    <CustomInput showLabel={false} placeholder={"Type Etymology..." } value={formEty} 
                    onChangeText={setFormEty} maxLength={1000} multiline={true} customStyle={{marginTop:25}}
                    customFormStyle={{height:100}} />
                )
            }

        </ScrollView>

        {/* DELETE BUTTON */}
        <View style={{flexDirection:'column', alignItems:'center',justifyContent:'center', borderTopWidth: 1, borderTopColor: style.gray_200, marginTop:15}}>
            <TouchableOpacity onPress={()=>deleteWordFunc()} style={{ marginTop:30 }} activeOpacity={0.7}>
                        <Text style={{color:style.red_400, fontSize:style.text_md}}>Delete</Text>
            </TouchableOpacity>
        </View>

    </CustomModal>

     );
}
 
export default WordModal;