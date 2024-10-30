
import { Text, View, TextInput, StyleSheet } from 'react-native';
import * as style from '@/assets/styles/styles'


const CustomInput = ({label, placeholder}) => {
    return ( 
        <View style={{flexDirection: 'column', gap: 20}}>
            {/* Label */}
            <Text style={{color:style.gray_500, fontSize: style.text_lg, fontWeight: '500'}}> {label}: </Text>

            {/* Form */}
            <TextInput style={styles.form} 
                        placeholder= { placeholder }
                        autoCorrect={false}
                        autoCapitalize='none'/>
        </View>
     );
}

const styles = StyleSheet.create({
 
    form: {
        backgroundColor: style.white,
        borderWidth: 2,
        borderRadius: style.rounded_md,
        borderColor: style.gray_200,

        height: 60,
        fontSize: style.text_md,
        padding: 10,
        color: style.gray_400
    },
    
});

 
export default CustomInput;