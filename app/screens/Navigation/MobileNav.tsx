
//import basics
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, useWindowDimensions } from 'react-native';

//Import components 
import Home from '../HomeScreen/Home';
import DecksStack from '../DecksScreens/DecksStack';
import ReaderStack from '../ReaderScreens/ReaderStack';
import ExplorerStack from '../ExplorerScreen/ExplorerStack';


//import styles
import * as style from "@/assets/styles/styles"
import Icon from '@expo/vector-icons/FontAwesome6'

const Tab = createBottomTabNavigator();




const MobileNav = () => {

    const { width } = useWindowDimensions();

    //if width < 800, make icon size 20, else 40
    const dynamicIcon = width < 800 ? 15 : 20;  // 90% for mobile, 80% for larger screens

    const dynamicText = width < 800 ? style.text_xs : style.text_sm;
    
    const dynamicWidth = width < 800 ? 80 : 110;

    return ( 

    <Tab.Navigator screenOptions={{
        tabBarLabelPosition: "below-icon",
        //overall style of the the tab bar
        tabBarStyle:style.baseTabBarStyle,
        //indiviual item style
        tabBarItemStyle: {
            justifyContent: 'center',  
            alignContent:'center',
            alignItems: 'center',  
            borderRadius: 15,
            padding:5,
            maxWidth:dynamicWidth,
            minHeight:60, 
            paddingBottom:10,
            marginHorizontal:2
        },
        tabBarActiveBackgroundColor: style.blue_100,
        }}
        >
        
        {/* Home Screen Router and configuration for header on Home screen  */}
        <Tab.Screen name="Home" component={ Home } 
                    options={{
                        //Import LinguaBerry Logo 
                        headerLeft: ()=>(
                            <Image source={require('@/assets/images/logo.png')} 
                                    style={{ width:150, height:40 }}/>
                        ),
                        headerStyle: {
                            height: 120,
                            borderBottomWidth:1,
                            borderBottomColor: style.gray_200,
                        },
                        headerLeftContainerStyle: {
                            padding: 15,
                        },
                        tabBarIcon: ({color}) => <Icon name="house" size={dynamicIcon} color={color} />,
                        //have no header title
                        headerTitle: "",
                        tabBarLabelStyle: { fontWeight: '500', fontSize:dynamicText },
                    }}/>

        {/* Decks Screen   */}     
        <Tab.Screen name="Decks" component={ DecksStack } 
                    options={{
                        headerShown:false,
                        tabBarIcon: ({color}) => <Icon name="table-list" size={dynamicIcon} color={color} />,
                        tabBarLabelStyle: { fontWeight: '500', fontSize:dynamicText },
                    }} />

        {/* Reader Router   */}     
        <Tab.Screen name="Reader" component={ ReaderStack } options={{
                        headerShown:false,
                        tabBarIcon: ({color}) => <Icon name="book" size={dynamicIcon} color={color} />,
                        tabBarLabelStyle: { fontWeight: '500', fontSize:dynamicText }
                    }} />

        {/* Explorer Router   */}     
        <Tab.Screen name="Explorer" component={ ExplorerStack } 
                    options={{
                        headerShown:false,
                        tabBarIcon: ({color}) => <Icon name="book-atlas" size={dynamicIcon} color={color} />,
                        tabBarLabelStyle: { fontWeight: '500', fontSize:dynamicText }
                    }} />
        </Tab.Navigator>
     );
}
 
export default MobileNav;