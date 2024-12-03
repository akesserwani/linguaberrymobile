
import { createStackNavigator } from '@react-navigation/stack';
import ExplorerHome from './ExplorerHome/ExplorerHome';
import ExplorerReader from './ExplorerReader/ExplorerReader';

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
        <Stack.Screen name="ExplorerReader" component={ ExplorerReader } 
                        options= {{
                        title: 'Interactive Story',
                        headerTitleAlign: 'center',
                        headerTitleStyle: {
                            color: style.gray_500,
                        }
                    }} />

      </Stack.Navigator>
       );
}
 
export default ReaderStack;