import { View, Text, StyleSheet, useWindowDimensions, TouchableOpacity} from 'react-native';
import { useContext, useLayoutEffect, useState, useEffect, useCallback } from 'react';
import { useNavigation, useRoute, useFocusEffect, useIsFocused } from '@react-navigation/native';
//data for context
import { CurrentLangContext } from '@/app/data/CurrentLangContext.tsx';

//styles
import * as style from '@/assets/styles/styles'
import Icon from '@expo/vector-icons/FontAwesome6'

import CustomFab from '@/app/components/CustomFab';
import CustomButton from '@/app/components/CustomButton';
import CustomAlert from '@/app/components/CustomAlert';
import TooltipComponent from './components/TooltipComponent';

//improt data from database
import { getSingleEntryData, getBookmarkedStatus, toggleBookmark} from '../DataReader';

import HeaderRight from './components/HeaderRight';

//import misc functions
import { limitLength, formatDate } from '@/app/data/Functions';
import { ScrollView } from 'react-native-gesture-handler';
import React from 'react';

import { isRTLChar } from '@/app/data/LangData';

const ReaderViewer = ({route}) => {

    //current language
    const { currentLang } = useContext(CurrentLangContext);

    //get the data from the navigator
    const { entryTitle, entryId } = route.params;
    const navigation = useNavigation();

    //functionality to hide the navbar
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
    
    //Navigation bar data
    //To View/Edit Data
    const [refresh, setRefresh] = useState(false);
    useLayoutEffect(() => {
        navigation.setOptions({
            // Set custom text for the back button          
            headerBackTitle: 'All',
            headerRight: () => (
                <HeaderRight currentLang={currentLang} entryId={entryId} entryTitle={entryTitle} setRefresh={setRefresh} />
            ),
            
        });
        }, [navigation]);


    //reactive variable to get all the entry data
    const [entryData, setEntryData] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Track loading state

    useFocusEffect(
        useCallback(() => {
          const fetchEntryData = async () => {
            try {
              setIsLoading(true); // Start loading
              const data = await getSingleEntryData(entryId, currentLang); // Fetch the data
              setEntryData(data); // Set the data to state

            } catch (error) {
              console.error('Error fetching data:', error);
            } finally {
              setIsLoading(false); // End loading
            }
          };
    
          fetchEntryData();
        }, [entryId, currentLang])
      );
    

    //Bookmark functionality here
    const [isBookmarked, setBookmarked] = useState(getBookmarkedStatus(currentLang, entryId));

    useEffect(()=>{
        //set it to the reactive vairable
        setBookmarked(getBookmarkedStatus(currentLang, entryId));
    },[entryData])

    //Reactive variable to show the english translation
    const [showTranslation, setTranslation] = useState(false);


    //Sentence counter to detect how many sentences data has
    const countSentences = (text) => {
        if (!text) return 0; // Handle empty or null text
        const sentenceRegex = /[.!?]+/g; // Matches sentence-ending punctuation
        return (text.match(sentenceRegex) || []).length; // Returns number of matches
      };
  
    
    //responsive variable for container padding
    //if width is less than 600 then padding is 40, if between 600 and 1000 then padding is 100, 1k+, padding is 200
    //40 < 100 < 200
    const { width } = useWindowDimensions();
    const responsiveHorizontalPadding = width < 600 ? 40 : width < 1000 ? 100 : 200;

    return ( 
        <>
        <View style={[styles.mainContainer, { paddingHorizontal: responsiveHorizontalPadding }]}>
            {/* Container for the main text with interactive functionalities */}

                {/* Button Container for the Show English and Practice functionaities*/}
                <View style={{flexDirection:'row', gap:10, paddingBottom:10}}>
                    {/* Show English Button */}
                    <CustomButton onPress={()=>setTranslation(!showTranslation)} customStyle={null}>
                        <Text style={{color:style.white, fontWeight:'500', fontSize:style.text_xs}}>
                            {showTranslation ? 'Hide Translation' : 'Show Translation'}
                        </Text>
                    </CustomButton>

                    {/* Practice Button */}
                    <CustomButton onPress={()=>{ 
                                //Check if it has more than two sentences
                                if (countSentences(entryData.contents) > 2 && countSentences(entryData.translation_data) > 2) {
                                    navigation.navigate('PracticeReader', {story: entryData.contents, storyTranslation: entryData.translation_data, title: entryTitle, entryId: entryId, stack:"Reader"  });
                                } else {
                                    CustomAlert("You do not have enough sentences to practice!", "Minimum of THREE sentences for both the main text and translation to practice.")
                                }
                            }} 
                              customStyle={{backgroundColor:style.blue_200, flexDirection:'row', gap:8}}>
                        <Text style={{color:style.blue_500, fontWeight:'600'}}>
                            Practice
                        </Text>
                        <Icon name={'dumbbell'} solid={true} width={15} color={style.blue_400} />
                    </CustomButton>
                </View>


                {/* Container for title, date, and bookmarked status on top */}
                <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:20, borderBottomColor:style.gray_300, borderBottomWidth:style.border_md}}>
                    {/* Container for title and created_at */}
                    <View style={{flexDirection:'column', gap:10, paddingBottom:15, width:'90%'}}>
                        {entryData ? (
                            <>
                            {/* Title Text */}
                            <View>
                                <Text style={{color:style.gray_600, fontSize:style.text_lg, fontWeight:'600',
                                    textAlign: isRTLChar(entryData.title) ? 'right' : 'left', // Align text
                                    writingDirection: isRTLChar(entryData.title) ? 'rtl' : 'ltr', // Set writing direction                                            
                                }}>
                                    {entryData.title}
                                </Text>
                            </View>
                            
                            {/* Date */}
                            <Text style={{color:style.gray_400, fontSize:style.text_sm, fontWeight:'400', marginTop:10,
                                textAlign: isRTLChar(entryData.title)  ? 'right' : 'left', // Align text
                            }}>
                                Created on {formatDate(entryData.created_at)}
                            </Text>
                            </>
                        ) : (
                            <Text style={{color:style.gray_500, fontSize:style.text_md, fontWeight:'500'}}>
                                Loading...
                            </Text>
                        )}
                    </View>

                    {/* Bookmark icon and functionality goes here */}
                    <TouchableOpacity onPress={
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
                    </TouchableOpacity>
                </View>

                <ScrollView style={{ flex:1}} contentContainerStyle={{ paddingBottom:100, paddingTop:20}}>
                    {entryData ? (
                        <>
                            {/* Main Text here in the Target Language */}
                            <TooltipComponent entryId={ entryId } contents={entryData.contents} refresh={refresh} />

                            {/* Show the translation here */}
                            { showTranslation && (
                                <View style={{flexDirection:'column', gap:10, marginBottom:50}}>
                                    <Text style={{color:style.gray_700, fontSize:style.text_lg, fontWeight:'600', fontStyle:'italic'}}>
                                        Translation:
                                    </Text>
                                    <Text style={{color:style.gray_700, fontSize:style.text_lg, fontWeight:'400'}}>
                                        { entryData.translation_data }
                                    </Text>
                                </View>    
                            )}
                        </>
                    ) : (
                        <Text style={{color:style.gray_500, fontSize:style.text_md, fontWeight:'500'}}>Loading...</Text>
                    )}
                </ScrollView>

            {/* Fab button to go back to the editor */}
            <CustomFab icon='pen' onPress={()=>navigation.navigate("ReaderEditor", { entryTitle: entryData.title, entryId: entryId })}/>

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

export default ReaderViewer;