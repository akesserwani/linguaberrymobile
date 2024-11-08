
import { Text, View, StyleSheet, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import { useState, useEffect } from "react";

{/* Custom Components */}
import CustomButton from "@/app/components/CustomButton";
import CustomModal from "@/app/components/CustomModal";
import CustomInput from "@/app/components/CustomInput";
import CustomAlert from "@/app/components/CustomAlert";

import Icon from '@expo/vector-icons/FontAwesome6'
import * as style from '@/assets/styles/styles'
import { ScrollView } from "react-native-gesture-handler";

//import database functions
import { getAllTagsInDeck, getTagOfWord, updateWordTag } from "../../DataDecks";



const EditTagSelection = ({currentLang, deckId, wordData }) => {

    const [dropdownOpen, openDropdown] = useState(false);

    //Tag data
    const [tagData, setTagData] = useState({});
    // function to get all the tags in the deck
    const getTagData = () =>{
        //call the function
        const data = getAllTagsInDeck(deckId, currentLang);
        //set the data to the deckId
        setTagData(data);
    }


    //function to get the tag of the selected word
    const [selectedTag, selectTag] = useState("");
    //Load the respective tag into selectedTag
    const getTagOfWordFunc = () =>{
        //get it from the database
        const data = getTagOfWord(wordData.term, deckId, currentLang)
        
        if (data === null){
            selectTag("None")
        } else{
            //set it equal to selected tag 
            selectTag(data);
        }
    }


    //use effect to reload tag data everytime modal closes
    useEffect(()=>{
        getTagData();
        getTagOfWordFunc();
    }, [])


    //select tag function
    const selectTagFunc = (tag_name) =>{
        //set the reactive variable to the tag name
        selectTag(tag_name);

        //update the word tag in the database
        updateWordTag(wordData.term, tag_name, deckId, currentLang)

        //close the dropdown
        openDropdown(false);
    }


    return ( 
    <>

        {/* Tag Dropdown Button */}
        <CustomButton onPress={() => openDropdown(!dropdownOpen)} customStyle={styles.tagDropdown}>
            <View style={{flexDirection: 'row', gap: 7}}>           
                <Text style={{color:style.gray_500}}>
                    { selectedTag }
                </Text>
                <Icon name={"tag"} size={15} color={style.gray_500} style={{marginTop: 2}}/>
            </View>
            <Icon name={dropdownOpen ? "caret-down" : "caret-up"} size={15} color={style.gray_500}/>
        </CustomButton>

                {/* Dropdown content */}
                {dropdownOpen && (
            <View style={styles.dropdownBox}>
                <ScrollView>


                    {/* Generic select a tag dropdown - do not render if user already has selected none */}
                    { selectedTag !== "None" && (
                        <TouchableOpacity onPress={()=>selectTagFunc("None")} activeOpacity={0.7} style={{padding:10, marginTop:10, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                            {/* Name of the Tag */}
                            <Text style={{color:style.gray_400, fontSize:style.text_md, fontWeight:'400'}}>None</Text>
                        </TouchableOpacity>
                    )}

                    { tagData.map((tag, index) => (
                        // {/* Container with tags */}

                        // Only render if selectedTag is not equal to the current tag
                        selectedTag !== tag.name && (

                        <TouchableOpacity onPress={()=>selectTagFunc(tag.name)}
                            key={tag.id} activeOpacity={0.7} style={{padding:10, marginTop:10, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                            {/* Name of the Tag */}
                            <Text style={{color:style.gray_500, fontSize:style.text_md, fontWeight:'400'}}>{ tag.name }</Text>

                        </TouchableOpacity>

                        )
                    )) }
                </ScrollView>

            </View>
         )}



    </>
    );
}
 
const styles = StyleSheet.create({
    tagDropdown:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor:style.white, 
        borderWidth: style.border_md, 
        borderColor: style.gray_200,
        marginBottom:30,
        marginTop:10
    },
    dropdownBox: {
        position: 'absolute', 
        top: 110, 
        left: 1,
        right: 0,
        padding: 15,

        maxHeight:400,
        zIndex: 99,

        borderWidth: 1,
        borderColor: style.gray_200,
        borderRadius: style.rounded_lg,
        backgroundColor: style.white,
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 4,
        elevation: 2,       

        flexDirection:"column",
        gap: 20,
    },

    
});

export default EditTagSelection;