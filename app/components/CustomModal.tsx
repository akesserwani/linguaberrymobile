
import { Modal, Text, View, StyleSheet, useWindowDimensions } from "react-native";
import * as style from '@/assets/styles/styles'

//Import styles
import Icon from '@expo/vector-icons/FontAwesome6'

//import components
import CustomButton from "./CustomButton";


//Props: title, function to close, function to toggle, children  
const CustomModal = ({title="My Modal", onClose, children, overrideStyle ={} }) => {

    //Width logic
    //get window width
    const windowWidth = useWindowDimensions().width;

    //if width is mobile < 800, make the width 90%, else make it 80%
    const dynamicWidth = windowWidth < 800 ? '90%' : '80%';  // 90% for mobile, 80% for larger screens



    return ( 
        <Modal transparent={true} >
            {/* Backdrop with black opacity */}
            <View style={styles.modalOverlay} >
                {/* Main Content - White Div */}
                <View style={[styles.modalContainer, { width: dynamicWidth }, overrideStyle ]}>

                    {/* Top Bar with Title and exit button */}
                    <View style ={styles.topBar}>
                        {/* Modal Title */}
                        <Text style={{ fontSize: style.text_xl, color: style.gray_600, margin: 5, fontWeight:"500" }}>
                            { title }
                        </Text>
                        
                        {/* Button to Close */}
                        <CustomButton onPress={onClose} customStyle={{ width:40, height: 40, borderRadius: 40, backgroundColor: style.gray_300, padding: 15, }}>
                            <Icon name={"xmark"} size={20} color={style.gray_500}/>
                        </CustomButton>
                    </View>


                    {/* Main Content Below - Children Content Here */}
                    <View style={{ paddingHorizontal: 40, paddingTop:30, alignSelf:"stretch" }}>
                        { children }
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
      height: '80%',
      alignItems: 'center',
    },
    topBar: {
        alignSelf: 'stretch', 
        height: 75, 

        flexDirection: "row", 
        justifyContent: "space-between", 
        backgroundColor: style.gray_200,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,

        borderBottomWidth: 1.5,
        borderBottomColor: style.gray_300,

        paddingVertical: 20,
        paddingHorizontal: 30,

    }
  });
  
 
export default CustomModal;