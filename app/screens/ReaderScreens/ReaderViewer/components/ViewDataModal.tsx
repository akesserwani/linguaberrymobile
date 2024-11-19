import { useState, useEffect } from "react";
import { TouchableOpacity, View, Text, StyleSheet, ScrollView, useWindowDimensions } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';

import Icon from '@expo/vector-icons/FontAwesome6'
import * as style from '@/assets/styles/styles'

import CustomModal from "@/app/components/CustomModal";
import CustomInput from "@/app/components/CustomInput";
import CustomButton from "@/app/components/CustomButton";


const ViewDataModal = ({onClose}) => {



    return ( 
        <CustomModal title="Edit Data" onClose={onClose}>
                {/* Main Content here */}
                <View>
                    <Text>Hello world</Text>
                </View>
        </CustomModal>
     );
}
 
export default ViewDataModal;