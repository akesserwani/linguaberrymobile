import { useState, useEffect } from "react";
import { TouchableOpacity, View, Text, StyleSheet, ScrollView, useWindowDimensions } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';

import Icon from '@expo/vector-icons/FontAwesome6'
import * as style from '@/assets/styles/styles'

import CustomModal from "@/app/components/CustomModal";
import CustomInput from "@/app/components/CustomInput";
import CustomButton from "@/app/components/CustomButton";


const EditDataModal = ({onClose}) => {


    //variables for input forms
    const [wordDataInput, setWordDataInput] = useState("");
    const [sentenceDataInput, setSentenceDataInput] = useState("");


    

    const { width } = useWindowDimensions(); // Get screen width

    return ( 
        <CustomModal title="Edit Data" onClose={onClose}>
                {/* Main Content here */}
                <ScrollView contentContainerStyle={[{ gap: 20 },{ flexDirection: width > 1000 ? 'row' : 'column' } ]}>
                    {/* Top Row - with information link */}
                    <View style={{flexDirection:'row', justifyContent:'flex-end'}}>
                        <TouchableOpacity activeOpacity={0.7}>
                            <Text style={{color:style.blue_500, fontSize:style.text_xs, fontWeight:'500'}}>
                                Need help? bloglink.com
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Column 1 - Word Data */}
                    <View style={{flexDirection:'column', gap:20, 
                                   width: width > 800 ? '50%' : '100%'}}>
                        {/* AI prompt button for word data */}
                        <CustomButton onPress={()=>{}} customStyle={{flexDirection:'row', gap:10, maxWidth:200}}> 
                            <Text style={{color:style.white, fontSize:style.text_xs, fontWeight:'500'}}>Copy AI Prompt</Text>
                            <Icon name={"copy"} size={15} color={style.white} />
                        </CustomButton>

                        {/* Word Data input form */}
                        <CustomInput label="Word Data" placeholder={"Enter csv data here..."} value={wordDataInput} 
                                        onChangeText={setWordDataInput} maxLength={50000} multiline={true} customFormStyle={{height:120}}/>


                    </View>

                    {/* Column 2 - Sentence Data */}
                    <View style={{flexDirection:'column', gap:20, 
                                   width: width > 800 ? '50%' : '100%'}}>
                        {/* AI prompt button for sentence data */}
                        <CustomButton onPress={()=>{}} customStyle={{flexDirection:'row', gap:10, maxWidth:200}}> 
                            <Text style={{color:style.white, fontSize:style.text_xs, fontWeight:'500'}}>Copy AI Prompt</Text>
                            <Icon name={"copy"} size={15} color={style.white} />
                        </CustomButton>

                        {/* Sentence Data input form */}
                        {/* Word Data input form */}
                        <CustomInput label="Sentence Data" placeholder={"Enter csv data here..."} value={sentenceDataInput} 
                                        onChangeText={setSentenceDataInput} maxLength={50000} multiline={true} customFormStyle={{height:120}}/>


                    </View>

                    {/* Submission button to submit data */}
                    <CustomButton onPress={()=>{}} customStyle={null}> 
                        <Text style={{color:style.white, fontSize:style.text_sm, fontWeight:'600'}}>Load Data</Text>
                    </CustomButton>
                </ScrollView>

        </CustomModal>
     );
}
 
export default EditDataModal;