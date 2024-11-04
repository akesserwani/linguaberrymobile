
import { View, Text, StyleSheet, useWindowDimensions, TouchableOpacity} from 'react-native';
import { useContext, useLayoutEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

//data for context
import { CurrentLangContext } from '@/app/data/CurrentLangContext.tsx';

//styles
import * as style from '@/assets/styles/styles'
import Icon from '@expo/vector-icons/FontAwesome6'

//custom components
import CustomButton from '@/app/components/CustomButton';
import CustomFab from '@/app/components/CustomFab';

//import relative components
import TagDropdown from './components/TagDropdown';
import HeaderRight from './components/HeaderRight';

const UserDeck = ({route}) => {

    const { deckName } = route.params;
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            // Set custom text for the back button          
            headerBackTitle: 'All',
            headerRight: () => (
                <HeaderRight />
              ),
          
        });
      }, [navigation]);
    
    //current language
    const { currentLang, setCurrentLang } = useContext(CurrentLangContext);

    // State to track the active tab
    const [activeTab, setActiveTab] = useState('All');


    //data for the words
    const [wordData, setWordData] = useState(['Word 1', 'Word 2', 'Word 3']);


    // Get screen width dynamically
    const { width } = useWindowDimensions();
    //responsive padding
    const responsiveHorizontalPadding = width < 600 ? 40 : width < 1000 ? 100 : 200;

    return ( 
        <View style={[styles.mainContainer, { paddingHorizontal: responsiveHorizontalPadding }]}>
            {/* Top Container with title, buttons, and tag dropdown */}
            <View style={{flexDirection:"column", gap: 20}}>
                {/* Deck Name */}
                <View>
                    <Text style={{color:style.gray_500, fontWeight:'500', fontSize: style.text_lg}}>{ deckName }</Text>
                </View>

                {/* Tag dropdown */}
                <TagDropdown />

                {/* Container with study and practice butons */}
                <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                    <CustomButton onPress={()=>{}} customStyle={null}>
                        <Text style={{color:style.white, fontWeight:'500'}}>Study</Text>
                    </CustomButton>

                    <CustomButton onPress={()=>{}} customStyle={{backgroundColor:style.blue_100}}>
                        <Text style={{color:style.blue_500, fontWeight:'500'}}>Practice</Text>
                    </CustomButton>

                </View>
            </View>


            {/* Container for the tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity onPress={() => setActiveTab('All')} style={[styles.individualTab, activeTab === 'All' && styles.activeTab]} activeOpacity={0.7}>
                    <Text style={[styles.tabText, activeTab === 'All' && styles.activeTab]} >All</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setActiveTab('Starred')} style={[styles.individualTab, activeTab === 'Starred' && styles.activeTab]} activeOpacity={0.7}>
                    <Text style={[styles.tabText, activeTab === 'Starred' && styles.activeTab]} >Starred</Text>
                </TouchableOpacity>
            </View>

            {/* Content Area */}
            <View style={styles.contentContainer}>
                {/* Individual Bookmarked box */}
                {wordData.map((item, index) => (
                    <View key={index} style={styles.item}>
                        {/* Text */}
                        <Text style={{ color: style.gray_500, fontSize: style.text_md, marginLeft: 10}}> 
                            {item} 
                        </Text>

                        {/* Word Data Icon */}
                        <TouchableOpacity activeOpacity={0.5} style={{ height:20, width:20}}>
                            <Icon name={"ellipsis-vertical"} size={16} color={style.gray_500} style={{marginLeft:10}} />
                        </TouchableOpacity>

                    </View>
                ))}
            </View>

            {/* FAB button to create new word */}
            <CustomFab onPress={() => {}} />



        </View>
     );
}
 
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: style.slate_100,
        paddingTop: 30,
    },

    tabContainer: {
        flexDirection: "row",
        zIndex: -1,
        marginTop: 20
    },
    
    tabText: {
        fontSize: style.text_md,
        color: style.gray_400,
        fontWeight: "500",
        paddingVertical: 10,

    },

    individualTab:{
        width: "50%",
        borderBottomWidth: 3,
        borderBottomColor: style.gray_200,
        alignItems: 'center'
    },

    activeTab: {
        color: style.blue_500,
        borderBottomColor: style.blue_500,
    },
    contentContainer: {
        flexDirection: 'column',
        gap: 10,
        zIndex: -1,
        marginTop:20

    },
    item: {
        backgroundColor: style.white, 
        height: 60, 
        borderRadius: style.rounded_md, 
        borderColor: style.gray_200,
        borderWidth: style.border_md,

        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal: 15,
    },


});



export default UserDeck;