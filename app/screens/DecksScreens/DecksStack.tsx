import { createStackNavigator } from '@react-navigation/stack';

import { useEffect, useContext } from 'react';
import { CurrentLangContext } from '@/app/data/CurrentLangContext.tsx';

import { CommonActions, useNavigation } from '@react-navigation/native';

import DecksHome from './DeckHome/DecksHome';
import UserDeck from './UserDeck/UserDeck';
import Study from './Study/Study'
import Practice from './Practice/Practice';

import * as style from '@/assets/styles/styles'

const Stack = createStackNavigator();


const DecksStack = () => {

    //current language
    const { currentLang } = useContext(CurrentLangContext);

    const navigation = useNavigation();

    // Reset the stack to DecksHome whenever the language changes
    useEffect(() => {
        navigation.dispatch(
        CommonActions.reset({
            index: 0, // Focus on the first screen in the stack
            routes: [{ name: "DecksHome" }], // Reset to DecksHome
        })
        );
    }, [currentLang]);


    return ( 
      <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    ...style.baseHeaderStyle, 
            }
        }}>
          <Stack.Screen name="DecksHome" component={ DecksHome } 
                        options= {{
                            title: 'Decks',
                            headerTitleAlign: 'center',
                            headerTitleStyle: {
                                color: style.gray_500,
                            }
                        }} />
          <Stack.Screen name="UserDeck" component={ UserDeck } 
                        options= {{
                        title: 'Decks',
                        headerShown:true,
                        headerTitleAlign: 'center',
                        headerTitleStyle: {
                            color: style.gray_500,
                        }
                    }} />
            <Stack.Screen name="Study" component={ Study } 
                options= {{
                title: 'Study',
                headerTitleAlign: 'center',
                headerTitleStyle: {
                    color: style.gray_500,
                }
            }} />
            <Stack.Screen name="Practice" component={ Practice } 
                options= {{
                title: 'Practice',
                headerTitleAlign: 'center',
                headerTitleStyle: {
                    color: style.gray_500,
                }
            }} />

      </Stack.Navigator>
       );
}
 
export default DecksStack;