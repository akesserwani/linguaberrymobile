import React, { useState, useContext, useEffect, useRef} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, FlatList } from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome6';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation, useRoute, useFocusEffect, useIsFocused } from '@react-navigation/native';

import CustomButton from '@/app/components/CustomButton';

//styles
import * as style from '@/assets/styles/styles'

//Data
import { CurrentLangContext } from '@/app/data/CurrentLangContext.tsx';
import { RTLlanguages } from '@/app/data/LangData';

import { storyFiles, createStoryInstance } from '../ExplorerHome/ExplorerData';

import TooltipComponent from './components/TooltipComponent';

const ExplorerReader = ({route}) => {

    //current language
    const { currentLang } = useContext(CurrentLangContext);
    const isRTL = RTLlanguages.includes(currentLang);


    //get data from the route
    const { title } = route.params;

    //Functionality to hide the tabBar when it is on the page
    const isFocused = useIsFocused();
    const navigation = useNavigation();
    useEffect(() => {
        if (isFocused) {
            // Hide the tab bar when this screen is focused
            navigation.getParent()?.setOptions({
                tabBarStyle: { display: 'none' },
            });
        } else {
            // Show the tab bar again when leaving this screen
            navigation.getParent()?.setOptions({
                tabBarStyle: { 
                    ...style.baseTabBarStyle, // Spread base styles here
                    display: 'flex',
                },
            });
        }
    }, [isFocused, navigation]);
    

    //use the JSON to get the story from the file 
    const [storyData, setStoryData] = useState(null);

    useEffect(() => {
        const loadData = () => {

            //get the JSON data 
            const json = storyFiles[currentLang]; 
            if (json) {
                const filteredStory = json.filter(item => item.title === title);
                setStoryData(filteredStory);
            } 
        };
    
        loadData();

        //if user logs onto the page it checks to see if instance of that story has been created
        createStoryInstance(title, currentLang); 


    }, [currentLang]); // Re-run whenever `currentLang` changes


    //Reactive variables for User interaction
    //for toggling trasnlation 
    const [showTranslation, setTranslation] = useState(false);

    const { width } = useWindowDimensions();
    const responsiveHorizontalPadding = width < 600 ? 40 : width < 1000 ? 100 : 200;


    

    return ( 
        <>
        <View style={[styles.mainContainer, { paddingHorizontal: responsiveHorizontalPadding }]}>

            {/* Audio Player Goes Here */}
            <View>


            </View>

            {/* Button Container for the Show English and Practice functionaities*/}
            <View style={{flexDirection:'row', gap:10, paddingBottom:10}}>
                {/* Show English Button */}
                <CustomButton onPress={() => setTranslation(!showTranslation)} customStyle={null}>
                    <Text style={{color:style.white, fontWeight:'500', fontSize:style.text_xs}}>
                        {showTranslation ? 'Hide Translation' : 'Show Translation'}
                    </Text>
                </CustomButton>
            </View>

            {/* Container for title and bookmarked status */}
            <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:20}}>

                {/* Container for title and created_at */}
                <View style={{flexDirection:'column', width:'100%', borderBottomColor:style.gray_300, borderBottomWidth:style.border_md, paddingBottom:20,
                              alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                        {/* Title Text */}
                        <View style={{marginRight:15}}>
                            { storyData ?  (
                                <Text style={{color:style.gray_600, fontSize:style.text_lg, fontWeight:'600'}}>
                                    { storyData[0].title_translation }
                                </Text>
                            ) : (
                                <Text style={{color:style.gray_500, fontSize:style.text_md, fontWeight:'500'}}>Loading...</Text>
                            )}

                        </View>
                </View>

                {/* Bookmark icon and functionality goes here */}
                {/* <TouchableOpacity onPress={
                    ()=>{
                        //update the database
                        toggleBookmark(currentLang, entryId);
                        //toggle the variable so it shows in UI
                        setBookmarked(!isBookmarked);
                    }
                    } activeOpacity={0.7}>
                    { isBookmarked ? (
                        <Icon name={'bookmark'} solid={true} size={25} color={style.red_400} />
                        ) : (
                            <Icon name={'bookmark'} size={25} color={style.gray_400} />
                        )
                    }
                </TouchableOpacity> */}
            </View>

                {/* Container for the main text with interactive functionalities */}
                <ScrollView style={{ flex:1}} contentContainerStyle={{marginTop:20, paddingRight:15}}>
                    {storyData ? (
                        <>
                            {/* Main Text here in the Target Language */}
                            <TooltipComponent title={title}/>

                            {/* Show the translation here */}
                            { showTranslation && (
                                <View style={{flexDirection:'column', gap:10, marginBottom:50}}>
                                    <Text style={{color:style.gray_700, fontSize:style.text_lg, fontWeight:'600', fontStyle:'italic'}}>
                                        { storyData[0].title }
                                    </Text>
                                    <Text style={{color:style.gray_700, fontSize:style.text_lg, fontWeight:'400'}}>
                                        { storyData[0].story }
                                    </Text>
                                </View>    
                            )}
                        </>
                    ) : (
                        <Text style={{color:style.gray_500, fontSize:style.text_md, fontWeight:'500'}}>Loading...</Text>

                    )}

            </ScrollView>

            
            {/* Bottom footer that adds top border */}
            <View style={style.baseFooterStyle} />


        </View>
        </>
     );
}
 
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: style.slate_100,
        paddingTop: 30,
        flexDirection:'column',
    },    
});

export default ExplorerReader;