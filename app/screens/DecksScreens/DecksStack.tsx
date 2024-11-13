import { createStackNavigator } from '@react-navigation/stack';
import DecksHome from './DeckHome/DecksHome';
import UserDeck from './UserDeck/UserDeck';
import Study from './Study/Study'
import Practice from './Practice/Practice';

import * as style from '@/assets/styles/styles'

const Stack = createStackNavigator();


const DecksStack = () => {
    return ( 
      <Stack.Navigator>
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