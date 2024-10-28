
import { createStackNavigator } from '@react-navigation/stack';
import ReaderHome from './ReaderHome'
import ReaderStory from './ReaderStory';

const Stack = createStackNavigator();


const ReaderStack = () => {
    return ( 
      <Stack.Navigator>
          <Stack.Screen name="ReaderHome" component={ ReaderHome }  />
          <Stack.Screen name="ReaderStory" component={ ReaderStory } />
      </Stack.Navigator>
       );
}
 
export default ReaderStack;