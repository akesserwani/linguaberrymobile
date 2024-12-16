import React, { useState, useContext, useEffect, useRef, useLayoutEffect} from 'react';
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

import { isLanguageRTL } from '../../HomeScreen/LanguageSelection/DataLanguages';

//Database files from ExplorerData
import { storyFiles, createStoryInstance, toggleBookmarkStory, getBookmarkedStatus } from '../ExplorerHome/ExplorerData';

import TooltipComponent from './components/TooltipComponent';
import HeaderRight from './components/HeaderRight';

//Import the audio player
import AudioPlayer from './components/AudioPlayer';

const ExplorerReader = ({route}) => {

    //current language
    const { currentLang } = useContext(CurrentLangContext);
    //Check database to see if the function is RTL (right to left, returns true if it is, false if it is not)
    const isRTL = isLanguageRTL(currentLang);


    //get data from the route
    const { title } = route.params;


    //Add a HeaderRight dropdown component to the Header
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            // Set custom text for the back button          
            headerBackTitle: 'Back',
            headerRight: () => (
                <HeaderRight title={title} currentLang={currentLang}/>
            ),
            
        });
    }, [navigation]);


    //Functionality to hide the tabBar when it is on the page
    const isFocused = useIsFocused();
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



    //Make useEffect to see if the bookmark is toggled or not based on the isBookmarked 
    const [isBookmarked, setBookmarked] = useState(false);

    //check the status of the bookmark then set it
    useEffect(()=>{
        const bookmarkedStatus = getBookmarkedStatus(title, currentLang);
        setBookmarked(bookmarkedStatus);
    }, [])

    //function to toggle the bookmark
    const toggleBookmark = () =>{

        //toggle the variable so it shows in UI
        setBookmarked(!isBookmarked);

        //update it in the database 
        toggleBookmarkStory(title, currentLang);
    }


    //get the story audio type to send it to the audiofile 
    const [audioFile, setAudioFile] = useState("");
    //audio loaded - only render the audio player when the audio has loaded
    const [audioLoaded, setAudioLoaded] = useState(false);

    //This is the use effect that gets the story file and loads the audio
    useEffect(()=>{
        if (storyData && storyData[0]?.audio_file){

            //remove the .wav extension
            setAudioFile(storyData[0].audio_file.replace('.wav', ''));

            //render the audioLoaded to true to render the audio player
            setAudioLoaded(true);
        }
    },[storyData])

    //Reactive variables for User interaction
    //for toggling trasnlation 
    const [showTranslation, setTranslation] = useState(false);

    //scroll view to scroll to the bottom when translation is toggled to true
    const scrollViewRef = useRef(null);
    const handleScrollToBottom = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    };



    const { width } = useWindowDimensions();
    const responsiveHorizontalPadding = width < 600 ? 40 : width < 1000 ? 100 : 200;
    

    return ( 
        <>
        <View style={[styles.mainContainer, { paddingHorizontal: responsiveHorizontalPadding }]}>

            {/* Audio Player - only render when the audio has loaded*/}
            { audioLoaded && 
                <AudioPlayer currentLang={currentLang} audioId={audioFile}/>
            }

            {/* Button Container for the Show English and Practice functionaities*/}
            <View style={{flexDirection:'row', gap:10, paddingBottom:10, paddingTop:20}}>
                {/* Show English Button */}
                <CustomButton onPress={() => {
                    //Only scroll if translation is false
                    if (!showTranslation){
                        handleScrollToBottom();
                    }
                    //Toggle translation
                    setTranslation(!showTranslation);

                }} customStyle={null}>
                    <Text style={{color:style.white, fontWeight:'600'}}>
                        {showTranslation ? 'Hide Translation' : 'Show Translation'}
                    </Text>
                </CustomButton>

                {/* Practice Button */}
                <CustomButton onPress={()=>{ navigation.navigate('PracticeSentence', {story: storyData[0].story, storyTranslation: storyData[0].story_translation, title: title, stack:"Explorer" });}} 
                              customStyle={{backgroundColor:style.blue_200, flexDirection:'row', gap:8}}>
                        <Text style={{color:style.blue_500, fontWeight:'600'}}>
                            Practice
                        </Text>
                        <Icon name={'dumbbell'} solid={true} width={15} color={style.blue_400} />
                </CustomButton>

            </View>

            {/* Container for title and bookmarked status */}
            <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:20, borderBottomColor:style.gray_300, borderBottomWidth:style.border_md, paddingBottom:20}}>
                {/* Container for title and created_at */}
                <View style={{flexDirection:'column', width:'80%', 
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
                <TouchableOpacity onPress={toggleBookmark} 
                    style={{marginRight:20}}
                    activeOpacity={0.7}>
                    { isBookmarked ? (
                        <Icon name={'bookmark'} solid={true} size={25} color={style.red_400} />
                        ) : (
                            <Icon name={'bookmark'} size={25} color={style.gray_400} />
                        )
                    }
                </TouchableOpacity>
            </View>

            {/* Container for the main text with interactive functionalities */}
            <ScrollView style={{ flex:1}} contentContainerStyle={{marginTop:20, paddingRight:15, paddingBottom:200}} ref={scrollViewRef} >
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
        </View>

        {/* Bottom footer that adds top border */}
        <View style={style.baseFooterStyle} />

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