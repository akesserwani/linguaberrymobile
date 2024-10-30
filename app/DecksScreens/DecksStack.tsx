import { createStackNavigator } from '@react-navigation/stack';
import DecksHome from './DecksHome';
import UserDeck from './UserDeck'

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
                        }} 
                        />
          <Stack.Screen name="UserDeck" component={ UserDeck } />
      </Stack.Navigator>
       );
}
 
export default DecksStack;