
//import basics
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';

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

    return ( 

    <Tab.Navigator screenOptions={{
        tabBarLabelPosition: "below-icon",
        //overall style of the the tab bar
        tabBarStyle:style.baseTabBarStyle,
        //indiviual item style
        tabBarItemStyle: {
            justifyContent: 'center',  
            alignItems: 'center',        
            borderRadius: 15,
            padding:5,
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
                            height: 65,
                            borderBottomWidth:1,
                            borderBottomColor: style.gray_200
                        },
                        headerLeftContainerStyle: {
                            padding: 15,
                        },
                        tabBarIcon: ({color}) => <Icon name="house" size={20} color={color} />,
                        //have no header title
                        headerTitle: "",
                        tabBarLabelStyle: { fontWeight: '500', fontSize:style.text_sm }
                    }}/>

        {/* Decks Screen   */}     
        <Tab.Screen name="Decks" component={ DecksStack } 
                    options={{
                        headerShown:false,
                        tabBarIcon: ({color}) => <Icon name="list-ul" size={20} color={color} />,
                        tabBarLabelStyle: { fontWeight: '500', fontSize:style.text_sm },
                    }} />

        {/* Reader Router   */}     
        <Tab.Screen name="Reader" component={ ReaderStack } options={{
                        headerShown:false,
                        tabBarIcon: ({color}) => <Icon name="book" size={20} color={color} />,
                        tabBarLabelStyle: { fontWeight: '500', fontSize:style.text_sm }
                    }} />

        {/* Explorer Router   */}     
        <Tab.Screen name="Explorer" component={ ExplorerStack } 
                    options={{
                        headerShown:false,
                        tabBarIcon: ({color}) => <Icon name="book-atlas" size={20} color={color} />,
                        tabBarLabelStyle: { fontWeight: '500', fontSize:style.text_sm }
                    }} />
        </Tab.Navigator>
     );
}
 
export default MobileNav;