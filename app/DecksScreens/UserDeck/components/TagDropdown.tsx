
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useState } from "react";

import CustomButton from "@/app/components/CustomButton";
import Icon from '@expo/vector-icons/FontAwesome6'
import * as style from '@/assets/styles/styles'
import { ScrollView } from "react-native-gesture-handler";

const TagDropdown = () => {


    const [dropdownOpen, openDropdown] = useState(false);

    //Tag data
    const [tagData, setTagData] = useState(["Tag 1", "Tag 2", "Tag 3"]);

    //Toggle edit
    const [editVar, toggleEdit] = useState(false);

    return ( 
        <>
        {/* Tag Dropdown Button */}
        <CustomButton onPress={() => openDropdown(!dropdownOpen)} customStyle={styles.tagDropdown}>
            <View style={{flexDirection: 'row', gap: 7}}>           
                <Text style={{color:style.gray_500}}>Tags</Text>
                <Icon name={"tag"} size={15} color={style.gray_500} style={{marginTop: 2}}/>
            </View>
            <Icon name={dropdownOpen ? "caret-down" : "caret-up"} size={15} color={style.gray_500}/>
        </CustomButton>

        {/* Dropdown content */}
        {dropdownOpen && (
            <View style={styles.dropdownBox}>
                <ScrollView>
                    { tagData.map((tag, index) => (
                        // {/* Container with tags */}
                        <TouchableOpacity key={index} activeOpacity={0.7} style={{padding:10, marginTop:10, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                            {/* Name of the Tag */}
                            <Text style={{color:style.gray_500, fontSize:style.text_md, fontWeight:'400'}}>{tag}</Text>

                            {/* Number of words */}
                            { !editVar ? (
                                //Show number of words if editVar is false
                                <Text style={{color:style.gray_500, fontSize:style.text_xs, fontWeight:'500' }}>(20)</Text>

                                ):(
                                    //If edit var is true, show option to delete tag
                                    // {/* Trash Icon */}
                                    <CustomButton customStyle={{backgroundColor: style.red_100, height:40, width:30}} onPress={()=> {}}>
                                        <Icon name={"trash"} width={10} color={style.red_500}/>
                                    </CustomButton>
                                )
                            }


                        </TouchableOpacity>
                    )) }
                </ScrollView>

                {/* <hr> line break */}
                {/* Do not show it if there is no data */}
                { tagData.length > 1 && (
                    <View style={{ borderBottomColor: style.gray_200, borderBottomWidth: 1 }} />
                )}

                {/* Button Views */}
                <View style={{flexDirection:'row', justifyContent:'space-between'}}>    
                    {/* Add Button */}            
                    <CustomButton onPress={()=>{}} customStyle={null}>
                        <Text style={{color:style.white}}>Add</Text>
                    </CustomButton>

                    {/* Edit Button */}
                    <CustomButton onPress={()=>toggleEdit(!editVar)} customStyle={{backgroundColor:style.gray_200}}>
                        <Text style={{color:style.gray_500}}>
                            {editVar ? "Done" : "Edit"}
                        </Text>
                    </CustomButton>
                </View>
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
        borderColor: style.gray_200
    },
    dropdownBox: {
        position: 'absolute', 
        top: 97, 
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

export default TagDropdown;