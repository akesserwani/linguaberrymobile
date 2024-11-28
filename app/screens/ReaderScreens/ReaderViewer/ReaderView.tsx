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

//improt data from database
import { getSingleEntryData, getBookmarkedStatus, toggleBookmark} from '../DataReader';

import HeaderRight from './components/HeaderRight';

//import misc functions
import { limitLength, formatDate } from '@/app/data/Functions';
import { ScrollView } from 'react-native-gesture-handler';
import TooltipComponent from './components/TooltipComponent';

const ReaderViewer = ({route}) => {

    //current language
    const { currentLang } = useContext(CurrentLangContext);

    //get the data from the navigator
    const { entryTitle, entryId } = route.params;
    const navigation = useNavigation();

    //Navigation bar data
    //To View/Edit Data
    const [refresh, setRefresh] = useState(false);
    useLayoutEffect(() => {
        navigation.setOptions({
            // Set custom text for the back button          
            headerBackTitle: 'All',
            headerRight: () => (
                <HeaderRight currentLang={currentLang} entryId={entryId} setRefresh={setRefresh} />
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

    //reactive variable to get all the entry data
    const [entryData, setEntryData] = useState(null);

    useFocusEffect(
        useCallback(() => {
        // Define an async function to fetch and set entry data
        const fetchEntryData = async () => {
            try {
                // Await the asynchronous database fetch
                const data = await getSingleEntryData(entryId, currentLang);
                // Set the retrieved data into the state
                setEntryData(data);
                // console.log("Loaded entry data:", data); 
            } catch (error) {
                console.error("Error fetching entry data:", error);
            }
        };
        // Call the async function
        fetchEntryData();
        }, [entryId, currentLang]) // Re-run effect if entryId or currentLang changes
    )


    //Bookmark functionality here
    const [isBookmarked, setBookmarked] = useState(getBookmarkedStatus(currentLang, entryId));

    useEffect(()=>{
        //set it to the reactive vairable
        setBookmarked(getBookmarkedStatus(currentLang, entryId));
    },[entryData])

    
    //responsive variable for container padding
    //if width is less than 600 then padding is 40, if between 600 and 1000 then padding is 100, 1k+, padding is 200
    //40 < 100 < 200
    const { width } = useWindowDimensions();
    const responsiveHorizontalPadding = width < 600 ? 40 : width < 1000 ? 100 : 200;

    return ( 
        <>
        <View style={[styles.mainContainer, { paddingHorizontal: responsiveHorizontalPadding }]}>
            {/* Button Container for the Show English and Practice functionaities*/}
            <View style={{flexDirection:'row', gap:10, borderBottomWidth:style.border_sm, borderBottomColor:style.gray_300, paddingBottom:10}}>
                {/* Show English Button */}
                <CustomButton onPress={()=>{}} customStyle={null}>
                    <Text style={{color:style.white, fontWeight:'500', fontSize:style.text_xs}}>Show English</Text>
                </CustomButton>
                
                {/* Practice Button */}
                <CustomButton onPress={()=>{}} customStyle={{backgroundColor:style.blue_200}}>
                    <Text style={{color:style.blue_500, fontWeight:'500', fontSize:style.text_xs}}>Practice</Text>
                </CustomButton>
            </View>

            {/* Container for title, date, and bookmarked status */}
            <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:20}}>

                {/* Container for title and created_at */}
                <View style={{flexDirection:'column'}}>
                    {entryData ? (
                        <>
                        {/* Title Text */}
                        <View>
                            <Text style={{color:style.gray_600, fontSize:style.text_lg, fontWeight:'600'}}>
                                {entryData.title}
                            </Text>
                        </View>
                        
                        {/* Date */}
                        <Text style={{color:style.gray_400, fontSize:style.text_sm, fontWeight:'400', marginTop:19}}>
                            Created on {formatDate(entryData.created_at)}
                        </Text>
                        </>
                    ) : (
                        <Text style={{color:style.gray_500, fontSize:style.text_md, fontWeight:'500'}}>Loading...</Text>
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

            {/* Container for the main text with interactive functionalities */}
            
            <ScrollView style={{ flex:1}} contentContainerStyle={{marginTop:20}}>
                    {entryData ? (
                        <TooltipComponent entryId={ entryId } contents={entryData.contents} refresh={refresh} />
    
                    ) : (
                        <Text style={{color:style.gray_500, fontSize:style.text_md, fontWeight:'500'}}>Loading...</Text>
                    )}

            </ScrollView>

            {/* Fab button to go back to the editor */}
            <CustomFab icon='pen' onPress={()=>navigation.navigate("ReaderEditor", { entryTitle: entryTitle, entryId: entryId })}/>

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
    }
    
});

export default ReaderViewer;