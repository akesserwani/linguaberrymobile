import { View, Text, StyleSheet, useWindowDimensions, TouchableOpacity, ScrollView} from 'react-native';
import { useContext, useLayoutEffect, useState, useEffect, useRef } from 'react';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';

//data for context
import { CurrentLangContext } from '@/app/data/CurrentLangContext.tsx';

//styles
import * as style from '@/assets/styles/styles'
import Icon from '@expo/vector-icons/FontAwesome6'

//custom components
import CustomButton from '@/app/components/CustomButton';
import CustomInput from '@/app/components/CustomInput';

//import dropdown for tag selection
import TagSelection from '../Study/components/TagSelection';
//import HeaderRight
import HeaderRight from './components/HeaderRight';

const Practice = () => {

    const route = useRoute();
    const navigation = useNavigation();

    const { currentLang, deckId } = route.params; 


    //Reactive variable for selected tag that will be sent over to the TagSelection component
    const [selectedTag, selectTag] = useState("None");

    //Pull the flashcard data from the database based on the deckID and current lang
    const [wordData, setWordData] = useState([]);

    //current index 
    const [currentIndex, setCurrentIndex] = useState(0);
    
    //FRONT FIRST OR BACK FIRST
    const [frontFirst, setFrontFirst] = useState(true);
    //Random variables
    const [randomOrder, setRandom] = useState(false);

    //Navigation bar data
    useLayoutEffect(() => {
        navigation.setOptions({
            // Set custom text for the back button          
            headerBackTitle: 'Back',
            headerRight: () => (
                <HeaderRight currentLang={currentLang} deckId={deckId} frontFirst={frontFirst} setFrontFirst={setFrontFirst} 
                             randomOrder={randomOrder} setRandom={setRandom} />
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
            
    

    
    //define a variable for the input text
    const [userInput, setUserInput] = useState("");



    //SCREEN WIDTH AND RESPONSIVE DESIGNS
    // Get screen width dynamically
    const { width } = useWindowDimensions();
    //responsive padding
    const responsiveHorizontalPadding = width < 600 ? 40 : width < 1000 ? 100 : 200;

    return ( 
        <>
        {/* Main Container */}
        <View style={[styles.mainContainer, { paddingHorizontal: responsiveHorizontalPadding }]}>
            {/* Top Container with Tags */}
            <View style={{flexDirection:'row', justifyContent:'space-between', borderBottomWidth: style.border_md, borderBottomColor:style.gray_200, paddingBottom: 20, zIndex:1}}>
                {/* Tags selection Dropdown  */}
                <TagSelection currentLang={currentLang} deckId={deckId} onTagSelect={selectTag}/>      

                {/* Current Index - Progress Count */}
                <Text style={{color:style.gray_500, fontSize:style.text_md, fontWeight:'700', margin:10}}>10 / 20</Text>          
            </View>

            {/* Middle Container - Text and Input */}
            <View style={{flexDirection:'column', gap:30, paddingTop:30, paddingBottom:50}}>

                {/* Title to translate */}
                <Text style={{color:style.gray_700, fontSize:style.text_lg, fontWeight:'500', marginLeft:2}}>
                    Translate to English:
                </Text>          

                {/* Text to Translate - from the data */}
                <Text style={{color:style.gray_600, fontSize:style.text_md, fontWeight:'400', marginLeft:5}}>Blah Blah Blah</Text>          


                {/* Input Form */}
                <CustomInput showLabel={false} placeholder={"Begin translating here..."} value={userInput} onChangeText={setUserInput}
                    maxLength={100} multiline={true} 
                    customStyle={{alignSelf:'stretch'}}
                    customFormStyle={{color:style.gray_600, backgroundColor:style.slate_100, borderColor:style.gray_300, height:200}}/>

            </View>

            {/* Bottom Container with Buttons - outside of the main container*/}
            <View style={{flex: 1, flexDirection:'row', justifyContent: 'space-between', alignItems:'center', alignContent:'center', paddingHorizontal:5, borderWidth:1}}>


                {/* Skip Text Button  */}
                <TouchableOpacity activeOpacity={0.7}>
                    <Text style={{color:style.blue_500, fontWeight:'500', fontSize:style.text_md}}>Skip</Text>
                </TouchableOpacity>

                {/* Check Button */}
                <CustomButton customStyle={{ borderRadius: style.rounded_md}} onPress={()=>{}}>
                    <Text style={{color:style.white, fontWeight:'500', fontSize:style.text_md, padding:3}}>Check</Text>
                </CustomButton>

            </View>

        </View>


        </>
     );
}
 
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: style.slate_100,
        paddingTop: 30,
    }
});

export default Practice;
