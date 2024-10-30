import { View, StyleSheet } from 'react-native';

import * as style from '@/assets/styles/styles'
import Icon from '@expo/vector-icons/FontAwesome6'

import CustomButton from './CustomButton'


const CustomFab = ({icon='plus', onPress}) => {
    return ( 
    <View style={{position: 'absolute', bottom: 0, right:0, height: 80, width: 80, margin:30,}}>
        <CustomButton onPress={onPress} customStyle={ styles.buttonStyle }>
            <Icon name={icon} solid={true} size={25} color={style.white} />
        </CustomButton>
    </View>

     );
}

const styles = StyleSheet.create({
    buttonStyle: {
        width: 80, 
        height: 80, 
        borderRadius: style.rounded_full,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 3,  
        elevation: 5
    
    },
 
});

 
export default CustomFab;