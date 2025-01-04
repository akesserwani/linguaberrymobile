
import { View, Text, StyleSheet, useWindowDimensions, KeyboardAvoidingView, ScrollView, TextInput} from 'react-native';
import { useContext, useLayoutEffect, useState, useEffect, useRef } from 'react';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
//data for context
import { CurrentLangContext } from '@/app/data/CurrentLangContext.tsx';
import { isLanguageRTL } from '../../HomeScreen/LanguageSelection/DataLanguages';

import * as style from '@/assets/styles/styles'

import CustomFab from '@/app/components/CustomFab';
import HeaderRight from './components/HeaderRight';

import { updateEntry, getEntryContents } from '../DataReader';
import React from 'react';

const ReaderStory = ({route}) => {

    //current language
    const { currentLang } = useContext(CurrentLangContext);
    //Check to see direction of language
    const isRTL = isLanguageRTL(currentLang);

    //get the data from the navigator
    const { entryTitle, entryId } = route.params;
    const navigation = useNavigation();


    //Navigation bar data
    //HeaderRight dropdown has only 1 function - DELETE ENTRY
    // useLayoutEffect(() => {
    //     navigation.setOptions({
    //         // Set custom text for the back button          
    //         headerBackTitle: 'View',
    //         headerRight: () => (
    //             <HeaderRight currentLang={currentLang} entryId={entryId} />
    //             ),
            
    //     });
    //     }, [navigation]);
    

    //reactive variable for titleForm
    //load it with the entryTitle that was passed via the navigator
    const [titleForm, setTitleForm] = useState(entryTitle) 

    //reactive variable for contents
    //load it with database fetch function from DataReader.tsx 
    const entryContents = getEntryContents(entryId, currentLang);
    const [contentsForm, setContentsForm] = useState(entryContents);

    //Make functionality to auto save everytime a change is made to titleForm or contentsForm
    useEffect(() => {
        if (titleForm !== entryTitle) { // Only update if there's a change
            updateEntry(entryId, titleForm, contentsForm);
        }
    }, [titleForm]);

    useEffect(() => {
        updateEntry(entryId, titleForm, contentsForm);
    }, [contentsForm]);



    //Finally, handle form input changes to update titleForm and contentsForm:
    const handleTitleChange = (text) => {
        setTitleForm(text);
    };
    
    const handleContentsChange = (text) => {
        setContentsForm(text);
    };
    

    //responsive variable for container padding
    //if width is less than 600 then padding is 40, if between 600 and 1000 then padding is 100, 1k+, padding is 200
    //40 < 100 < 200
    const { width } = useWindowDimensions();
    const responsiveHorizontalPadding = width < 600 ? 40 : width < 1000 ? 100 : 200;


    return ( 
    <>
    <View style={{flex:1, backgroundColor:style.slate_100}}>
        <KeyboardAvoidingView behavior={'padding'} keyboardVerticalOffset={20}>
            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{paddingRight:10, paddingBottom:100}}>

                {/* title form - can be edited */}
                <TextInput  style={[ styles.titleContainer, {writingDirection: isRTL ? 'rtl' : 'ltr', paddingHorizontal: responsiveHorizontalPadding + 10} ]}
                            placeholder= { "Enter title..." }
                            value={ titleForm } 
                            onChangeText={ handleTitleChange }
                            autoCorrect={ false }
                            autoCapitalize='none'
                            multiline={true}
                            maxLength={50}/>

                <View style={[styles.mainContainer, { paddingHorizontal: responsiveHorizontalPadding }]}>

                    {/* Main body data here */}
                    <TextInput  style={{fontSize:style.text_lg, color: style.gray_500, fontWeight:'500', width:'100%', flexWrap:'wrap', paddingBottom:100,
                        writingDirection: isRTL ? 'rtl' : 'ltr', padding:10
                    }}
                                placeholder= { "Start writing here..." }
                                value={ contentsForm } 
                                onChangeText={ handleContentsChange }
                                autoCorrect={ false }
                                autoCapitalize='none'
                                multiline={true}
                                maxLength={10000}/>


                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    </View>
    </>
     );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: style.slate_100,
        marginTop:20
    },
    titleContainer:{
        fontSize:style.text_lg, 
        color: style.gray_600, 
        backgroundColor:style.slate_100, 
        fontWeight:'600', 

        width:'100%', 

        flexWrap:'wrap',

        padding:20,

        borderBottomWidth:style.border_md,
        borderBottomColor:style.gray_200
    }
    
});

export default ReaderStory;