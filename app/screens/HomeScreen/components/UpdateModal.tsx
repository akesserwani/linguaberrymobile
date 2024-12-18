
import { View, Text, StyleSheet, Modal, useWindowDimensions, Image } from "react-native";
import { useEffect, useState } from "react";


import * as style from "@/assets/styles/styles";
import Icon from '@expo/vector-icons/FontAwesome6'
import CustomButton from "@/app/components/CustomButton";
import { TouchableOpacity } from "react-native-gesture-handler";


const UpdateModal = () => {


    const [showModal, toggleModal] = useState(false);
    const [message, setMessage] = useState("");


    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('http://linguaberry.com/api/update_modal');
          const json = await response.json();

          //set the showModal variable
          toggleModal(json.showModal)
          
          //set the message
          setMessage(json.message)


        } catch (error) {
          console.log(error);
        }
      };
  
      fetchData();
    }, []);
  


    const closeButton = () =>{
        //close the modal
        toggleModal(false);
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
                    <View style={{alignItems:'center'}}>
                        <Image source={require('@/assets/images/logo.png')} style={{ width:250, height:60 }}/>
                    </View>

                    {/* Message here */}
                    <Text style={{color:style.blue_500, fontWeight:'500', fontSize:style.text_lg, textAlign:'center'}}>
                        {message}
                    </Text>
                

                    {/* Button Container On Bottom */}
                    <View style={{flexDirection:'row', justifyContent:'flex-end', marginTop:20}}>
                        {/* Start Learning Button */}
                        <CustomButton onPress={closeButton} customStyle={null}>
                            <Text style={{color:style.white}}>Close</Text>
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
      flexDirection:'column',
      gap:40,

      backgroundColor: style.white,
      borderRadius: 20,

      padding:40,
      paddingVertical:30,
    },
  });

 
export default UpdateModal;