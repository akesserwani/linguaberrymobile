
import { createStackNavigator } from '@react-navigation/stack';
import ExplorerHome from './ExplorerHome/ExplorerHome';

import * as style from '@/assets/styles/styles'

const Stack = createStackNavigator();


const ReaderStack = () => {
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
      </Stack.Navigator>
       );
}
 
export default ReaderStack;