
import { Text, View, StyleSheet, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import { useState, useEffect } from "react";

{/* Custom Components */}
import CustomButton from "@/app/components/CustomButton";

import Icon from '@expo/vector-icons/FontAwesome6'
import * as style from '@/assets/styles/styles'
import { ScrollView } from "react-native-gesture-handler";

//import database functions
import { getAllTagsInDeck, getWordsWithTag} from "../../DataDecks";


const TagSelection = ({currentLang, deckId, onTagSelect, starredWordCount }) => {

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
    //use effect to reload tag data everytime modal closes
    useEffect(()=>{
        getTagData();
    }, [])
    
    //create selection to select tag
    const [selectedTag, selectTag] = useState('Select a tag');
    //select tag function
    const selectTagFunc = (tag_name) =>{
        //set the reactive variable to the tag name
        selectTag(tag_name);

        // call it in the callback function
        if (onTagSelect) {
            onTagSelect(tag_name); // Call the parent's callback with the selected tag
        }

        //close the dropdown
        openDropdown(false);

    }


    return ( 
    <>

        {/* Tag Dropdown Button */}
        <CustomButton onPress={() => openDropdown(!dropdownOpen)} customStyle={styles.tagDropdown}>
            <View style={{flexDirection: 'row', gap: 7}}>  
                <Icon name={"tag"} size={15} color={style.gray_500} style={{marginTop: 2}}/>         
                <Text style={{color:style.gray_500, marginLeft:3, marginTop:1, fontWeight:'400'}}>
                    { selectedTag }
                </Text>
            </View>
            <Icon name={dropdownOpen ? "caret-down" : "caret-up"} size={15} color={style.gray_500} style={{marginLeft:15, marginTop:2}}/>
        </CustomButton>


        {/* Dropdown content */}
        {dropdownOpen && (
            <View style={styles.dropdownBox}>
                <ScrollView>

                    {/* Dropdown option if user wants to select None */}
                    <TouchableOpacity onPress={()=>selectTagFunc("None")} activeOpacity={0.7} style={{padding:10, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                            {/* Name of the Tag */}
                            <Text style={{color:style.gray_400, fontSize:style.text_md, fontWeight:'400'}}>None</Text>
                    </TouchableOpacity>

                    {/* Dropdown option if user wants to select Starred */}
                    <TouchableOpacity onPress={()=>selectTagFunc("Starred")} activeOpacity={0.7} style={{padding:10, marginTop:5, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                            
                            {/* Name of the Tag */}
                            <View style={{flexDirection:'row', gap:5}}>
                                <Text style={{color:style.gray_500, fontSize:style.text_md, fontWeight:'500'}}>Starred</Text>
                                {/* Starred Icon */}
                                <Icon name={"star"} solid={true} size={10} color={style.gray_500} style={{marginTop:4, marginLeft:2}}/>         
                            </View>

                            {/* Count of starred words */}
                            <Text style={{color:style.gray_400, fontSize:style.text_sm, fontWeight:'500'}}>
                                { starredWordCount }
                            </Text>

                    </TouchableOpacity>

                    { tagData.map((tag, index) => (
                        // {/* Container with tags */}
                        <TouchableOpacity onPress={()=>selectTagFunc(tag.name)}
                            key={tag.id} activeOpacity={0.7} style={{padding:10, marginTop:10, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>

                            {/* Name of the Tag */}
                            <Text style={{color:style.gray_500, fontSize:style.text_md, fontWeight:'500'}}>{ tag.name }</Text>

                            {/* Tag Count */}
                            <Text style={{color:style.gray_400, fontSize:style.text_sm, fontWeight:'500'}}>
                                { getWordsWithTag(tag.name, deckId, currentLang).length }
                            </Text>

                        </TouchableOpacity>
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
        borderWidth: style.border_sm, 
        borderColor: style.gray_200,
        width: 165,
        maxWidth:165

    },
    dropdownBox: {
        position: 'absolute', 
        top: 42, 
        left: 1,
        right: 0,
        padding: 15,

        maxHeight:400,
        maxWidth: 165,
        zIndex: 99,

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

export default TagSelection;