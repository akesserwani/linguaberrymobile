
import { createStackNavigator } from '@react-navigation/stack';

import { useEffect, useContext } from 'react';
import { CurrentLangContext } from '@/app/data/CurrentLangContext.tsx';

import { CommonActions, useNavigation } from '@react-navigation/native';

import ExplorerHome from './ExplorerHome/ExplorerHome';
import ExplorerReader from './ExplorerReader/ExplorerReader';
import PracticeSentence from '@/app/screens/components/PracticeSentences/PracticeSentence';

import * as style from '@/assets/styles/styles'

const Stack = createStackNavigator();


const ReaderStack = () => {

    //current language
    const { currentLang } = useContext(CurrentLangContext);

    const navigation = useNavigation();

    // Reset the stack to DecksHome whenever the language changes
    useEffect(() => {
        navigation.dispatch(
        CommonActions.reset({
            index: 0, // Focus on the first screen in the stack
            routes: [{ name: "ExplorerHome" }], // Reset to DecksHome
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
      <Stack.Screen name="ExplorerHome" component={ ExplorerHome } 
                        options= {{
                        title: 'Explorer',
                        headerTitleAlign: 'center',
                        headerTitleStyle: {
                            color: style.gray_500,
                        }
                    }} />
        <Stack.Screen name="ExplorerReader" component={ ExplorerReader } 
                        options= {{
                        title: 'Interactive Story',
                        headerTitleAlign: 'center',
                        headerTitleStyle: {
                            color: style.gray_500,
                        }
                    }} />
        <Stack.Screen name="PracticeSentence" component={ PracticeSentence } 
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
 
export default ReaderStack;