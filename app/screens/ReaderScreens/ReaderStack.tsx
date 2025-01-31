
import { createStackNavigator } from '@react-navigation/stack';
import ReaderHome from './ReaderHome/ReaderHome'
import ReaderEditor from './ReaderEditor/ReaderEditor';
import ReaderViewer from './ReaderViewer/ReaderView';
import PracticeSentence from '@/app/screens/components/PracticeSentences/PracticeSentence';

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
      <Stack.Screen name="ReaderHome" component={ ReaderHome } 
                        options= {{
                        title: 'Reader',
                        headerTitleAlign: 'center',
                        headerTitleStyle: {
                            color: style.gray_500,
                        }
                    }} />
          <Stack.Screen name="ReaderEditor" component={ ReaderEditor }
                        options= {{
                        title: 'Editor',
                        headerTitleAlign: 'center',
                        headerTitleStyle: {
                            color: style.gray_500,
                        }
                    }} />
            <Stack.Screen name="ReaderViewer" component={ ReaderViewer }
                options= {{
                title: 'View Story',
                headerTitleAlign: 'center',
                headerTitleStyle: {
                    color: style.gray_500,
                }
            }} />
            <Stack.Screen name="PracticeReader" component={ PracticeSentence }
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