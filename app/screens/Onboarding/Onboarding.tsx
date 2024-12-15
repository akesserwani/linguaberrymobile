
import { Text, View, StyleSheet, Image, FlatList, Modal, TouchableOpacity } from 'react-native'
import { useState, useContext, useRef} from 'react';
import { db } from '@/app/data/Database';

//styles
import * as style from '@/assets/styles/styles'
import Icon from '@expo/vector-icons/FontAwesome6'

//Custom Components
import CustomButton from '@/app/components/CustomButton';
import CustomModal from '@/app/components/CustomModal';
import CustomAlert from '@/app/components/CustomAlert';
import React from 'react';

//data 
import { languagesSupported, RTLlanguages } from '@/app/data/LangData';
import { ScrollView } from 'react-native-gesture-handler';

const Onboarding = () => {

    const [dropdown, openDropdown] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 150 }); // Default width
    const dropdownRef = useRef(null); // Ref to capture the position of the icon


    //Set dropdown based on position of the target ref
    const handleOpenDropdown = () => {
        if (dropdownRef.current) {
            dropdownRef.current.measure((fx, fy, width, height, px, py) => {
                // Ensure fallback values to avoid NaN
                const safeTop = py + height + 5 || 100; // Default to 100 if NaN
                const safeLeft = px || 30; // Default to 30 if NaN
                const safeWidth = width || 150; // Default width
    
                setDropdownPosition({
                    top: safeTop,
                    left: safeLeft,
                    width: safeWidth,
                });
                openDropdown(true);
            });
        }
    };


    //Selected language
    const [selectedLanguage, setLanguage] = useState("Select a language");

    //get started button pressed
    const getStarted = () =>{

        db.withTransactionSync(() => {
                //add the language to the database
                db.runSync(
                    `INSERT OR IGNORE INTO user_languages (language) VALUES (?);`, [selectedLanguage]
                );

                // Set the selected language as the current language in the general table
                // Use UPSERT to update the row if it already exists
                db.runSync(
                    `INSERT INTO general (id, current_language, onboarding) 
                    VALUES (?, ?, ?) 
                    ON CONFLICT(id) 
                    DO UPDATE SET current_language = excluded.current_language, onboarding = excluded.onboarding;`,
                    [1, selectedLanguage, 1]
                );
        });

        //Lastly, redirect to home page
        console.log("Button clicked");


    }
    
    
    return ( 
    <>
    <View style={style.baseHeaderStyle} />

    {/* Background */}
    <View style={{flex:1, backgroundColor:style.slate_100, padding:50, flexDirection:'column', gap:40, paddingTop:100}}>

        {/* Logo */}
        <Image source={require('@/assets/images/logo.png')} style={{ width:250, height:60 }}/>

        {/* Main Card Container */}
        <View style={styles.cardContainer}>
            {/* Title */}
            <Text style={{fontSize:style.text_lg, fontWeight:'600', color:style.gray_500}}>Get Started</Text>

            {/* Dropdown Selection */}
            <View ref={dropdownRef} >
                <CustomButton customStyle={styles.dropdownBtn} onPress={handleOpenDropdown}>
                        {/* Current Language */}
                        <Text style={{ fontSize: style.text_md, fontWeight: "500", color:style.gray_500 }}> 
                            { selectedLanguage } 
                         </Text>
                        {/* Dropdown Icon */}
                        <Icon name={dropdown ? "caret-up" : "caret-down"} size={15} color={style.gray_500}/>
                </CustomButton>
             </View>


            {/* Get started button */}
            <CustomButton onPress={getStarted}>
                    <Text style={{ fontSize: style.text_md, fontWeight: "500", color:style.white }}> Get Started </Text>
             </CustomButton>


        </View>


    </View> 



    {/* Drop down with the languages */}
    <Modal transparent={true} visible={dropdown} onRequestClose={() => openDropdown(false)}>
        {/* Invisible Overlay that can be clicked  */}
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} 
                        onPress={() => {
                            openDropdown(false);
                        }}>
            {/* Main Content of the dropdown */}
            <View style={[styles.dropdownBox, { top: dropdownPosition.top, left: dropdownPosition.left, width: dropdownPosition.width }]}>
                {/* Render All Individual Language  */}
                <ScrollView contentContainerStyle={{ padding: 10 }} style={{ maxHeight: 300 }}>
                    {Object.entries(languagesSupported).map(([language, codes]) => (
                            <TouchableOpacity key={language} onPress={()=>{
                                    setLanguage(language);
                                    openDropdown(false);
                                }}>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 10}}>
                                    {/* Users Added Languages */}
                                    <Text style={{ fontSize:style.text_lg, color: style.gray_600, marginTop:10 }}>
                                        { language }
                                    </Text>
                                </View>
                            </TouchableOpacity>

                        ))}

                </ScrollView>
            </View>
        </TouchableOpacity>
    </Modal>

    
    {/* Bottom footer that adds top border */}
    <View style={style.baseFooterStyle} />
    </>
    );
}
 
const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: style.white,
        flexDirection:'column',
        gap: 40,
        padding:40,
        borderWidth:style.border_md,
        borderRadius:style.rounded_lg,
        borderColor:style.gray_200
    },    
    dropdownBox: {
        position: 'absolute', 
        top: 205, 
        left: 30,
        padding: 15,

        zIndex: 99,

        borderWidth: 1,
        borderColor: style.gray_200,
        borderRadius: style.rounded_lg,
        backgroundColor: style.white,
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 4,
        elevation: 2,       

        flexDirection:"column",
        gap: 25,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0)',
    },

    dropdownBtn: {
        backgroundColor: style.white,
        borderColor: style.gray_200,
        borderWidth: style.border_sm,
        borderRadius: style.rounded_md,
    
        height: 50,
        flexDirection: "row",
        justifyContent: "space-between",
    },


});


export default Onboarding;