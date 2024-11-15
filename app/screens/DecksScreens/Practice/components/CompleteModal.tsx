
import { Modal, Text, View, StyleSheet, useWindowDimensions, KeyboardAvoidingView } from "react-native";
import * as style from '@/assets/styles/styles'
import { useNavigation } from "@react-navigation/native";

//Import styles
import Icon from '@expo/vector-icons/FontAwesome6'

import CustomButton from "@/app/components/CustomButton";

const CompleteModal = ({deckId, deckName, onClose}) => {

    const navigation = useNavigation();

    //Width logic
    //get window width
    const windowWidth = useWindowDimensions().width;

    //if width is mobile < 800, make the width 90%, else make it 80%
    const dynamicWidth = windowWidth < 800 ? '90%' : '80%';  // 90% for mobile, 80% for larger screens

    const continueClicked = () =>{
        //close the modal
        onClose();
        //navigate pages
        navigation.navigate("UserDeck", { deckName: deckName, deckId: deckId });

    }

    return ( 
        <Modal transparent={true} >
            {/* Backdrop with black opacity */}
            <View style={styles.modalOverlay} >
                {/* Main Content - White Div */}
                <View style={[styles.modalContainer, { width: dynamicWidth }]}>

                    {/* Main Content Below - Children Content Here */}
                    <View style={{ paddingHorizontal: 40, paddingTop:30, alignSelf:"stretch", justifyContent:'center', gap:30, alignContent:'center', alignItems:'center' }}>

                        <Text style={{color:style.blue_400, fontSize:style.text_xl, fontWeight:'700'}}>Complete!</Text>
                        <Text style={{color:style.gray_500, textAlign:'center', fontSize:style.text_md, fontWeight:'500'}}>
                            You have succesfully practiced "{ deckName }"
                        </Text>

                        {/* Continue Button */}
                        <CustomButton onPress={continueClicked} customStyle={null}>
                            <Text style={{color:style.white, fontWeight:'600'}}>Continue</Text>
                        </CustomButton>

                    </View>
                </View>

            </View>
        </Modal>
     );
}

const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.6)', 
    },
    modalContainer: {
      backgroundColor: style.white,
      borderRadius: 20,
      width: '80%',
      alignItems: 'center',
      paddingBottom: 30
    },
  });

export default CompleteModal;