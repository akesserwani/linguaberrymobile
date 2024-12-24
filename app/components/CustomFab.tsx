import { View, StyleSheet } from 'react-native';

import * as style from '@/assets/styles/styles'
import Icon from '@expo/vector-icons/FontAwesome6'

import CustomButton from './CustomButton'


const CustomFab = ({icon='plus', onPress}) => {
    return ( 
    <View style={{position: 'absolute', bottom: 0, right:0, height: 70, width: 70, margin:30, backgroundColor: style.white, borderRadius: style.rounded_full}}>
        <CustomButton onPress={onPress} customStyle={ styles.buttonStyle }>
            <Icon name={icon} solid={true} size={20} color={style.white} />
        </CustomButton>
    </View>

     );
}

const styles = StyleSheet.create({
    buttonStyle: {
        width: 70, 
        height: 70, 
        borderRadius: style.rounded_full,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 3,  
        elevation: 3
    
    },
 
});

 
export default CustomFab;