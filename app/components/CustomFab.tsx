import { View } from 'react-native';

import * as style from '@/assets/styles/styles'
import Icon from '@expo/vector-icons/FontAwesome6'

import CustomButton from './CustomButton'


const CustomFab = ({icon='plus', onPress}) => {
    return ( 
    <View style={{position: 'absolute', bottom: 0, right:0, height: 80, width: 80, margin:30,}}>
        <CustomButton onPress={onPress} customStyle={{ width: 80, height: 80, borderRadius: style.rounded_full} }>
            <Icon name={icon} solid={true} size={25} color={style.white} />
        </CustomButton>
    </View>

     );
}
 
export default CustomFab;