
import { View, Text, StyleSheet, Modal, useWindowDimensions, Image } from "react-native";
import { useEffect, useState } from "react";


import * as style from "@/assets/styles/styles";
import Icon from '@expo/vector-icons/FontAwesome6'
import CustomButton from "@/app/components/CustomButton";
import { TouchableOpacity } from "react-native-gesture-handler";

import { db } from "@/app/data/Database";

const WelcomeModal = () => {


    const [showModal, toggleModal] = useState(false);

    useEffect(()=>{
        //Check to see if the onboarding value is 1, if it is 0 then showModal set to true, else set to false
        db.withTransactionSync(() => {
            let result = db.getFirstSync(`SELECT onboarding FROM general WHERE id = 1;`);
            if (result?.onboarding === 0 || !result){
                toggleModal(true);
            }else{
                toggleModal(false);
            }
        })
    },[])


    const beginLearning = () =>{
        //close the modal
        toggleModal(false);
        //update the onboarding function so it does not repeat
        db.withTransactionSync(() => {
            db.runSync(
                `UPDATE general SET onboarding = 1 WHERE id = 1;`
            );
        })

    }


    //Width logic
    //get window width
    const windowWidth = useWindowDimensions().width;
    //if width is mobile < 800, make the width 90%, else make it 80%
    const dynamicWidth = windowWidth < 800 ? '90%' : '80%';  // 90% for mobile, 80% for larger screens
    
    return ( 
        <Modal transparent={true} visible={showModal} onRequestClose={() => toggleModal(false)}>
            <View style={styles.modalOverlay} >
                <View style={[styles.modalContainer, { width: dynamicWidth }]}>
                    {/* Logo image container */}
                    <Image source={require('@/assets/images/logo.png')} style={{ width:280, height:60 }}/>

                    {/* Button Container On Bottom */}
                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                        {/* Start Learning Button */}
                        <CustomButton onPress={beginLearning} customStyle={null}>
                            <Text style={{color:style.white}}>Begin Learning</Text>
                        </CustomButton>

                        {/* Watch tutorial Buttom */}
                        <TouchableOpacity style={{marginTop:10}} activeOpacity={0.7}>
                            <Text style={{color:style.blue_500, fontWeight:'500'}}>Watch Tutorial</Text>
                        </TouchableOpacity>
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
      flexDirection:'column',
      gap:40,

      backgroundColor: style.white,
      borderRadius: 20,

      padding:40,
      paddingVertical:50,
    },
  });

 
export default WelcomeModal;