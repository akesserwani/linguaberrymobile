
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as style from '@/assets/styles/styles';
import CustomButton from '@/app/components/CustomButton';
import Icon from '@expo/vector-icons/FontAwesome6'



const BookmarksList = () => {

    // State to track the active tab
    const [activeTab, setActiveTab] = useState('Decks');


    const items = ['Item 1', 'Item 2', 'Item 3'];


    return ( 
        <>
        <View style={styles.tabContainer}>

            <TouchableOpacity onPress={() => setActiveTab('Decks')} style={[styles.individualTab, activeTab === 'Decks' && styles.activeTab]} activeOpacity={0.7}>
                <Text style={[styles.tabText, activeTab === 'Decks' && styles.activeTab]} >Decks</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setActiveTab('Entries')} style={[styles.individualTab, activeTab === 'Entries' && styles.activeTab]} activeOpacity={0.7}>
                <Text style={[styles.tabText, activeTab === 'Entries' && styles.activeTab]} >Entries</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setActiveTab('Stories')} style={[styles.individualTab, activeTab === 'Stories' && styles.activeTab]} activeOpacity={0.7}>
                <Text style={[styles.tabText, activeTab === 'Stories' && styles.activeTab]} >Stories</Text>
            </TouchableOpacity>

        </View>

        {/* Content Area */}
        <View style={styles.contentContainer}>

            {/* Individual Bookmarked box */}
            {items.map((item, index) => (
                <View key={index} style={[styles.item, index === items.length - 1 && styles.lastItem]}>
                    <Text style={{ color: style.gray_500, fontSize: style.text_md, marginLeft: 10}}>{item}</Text>

                    {/* Buttons show if activeTab == "Decks" */}
                    {activeTab == "Decks" ? (
                        
                        <View style={{flexDirection: "row", gap:10, position: 'relative', bottom: 7,}}>
                            {/* Button to redirect to study the deck */}
                            <CustomButton onPress={()=>{}} customStyle={{height: 40, width: 40}}>
                                <Icon name={'rectangle-list'} solid={true} width={15} color={style.white} />
                            </CustomButton>
                            {/* Button to redirect to practice the deck */}
                            <CustomButton onPress={()=>{}} customStyle={{height: 40, width: 40, backgroundColor: style.blue_100}}>
                                <Icon name={'dumbbell'} solid={true} width={15} color={style.blue_400} />
                            </CustomButton>
                        </View>

                    ) : (
                        //If it is not Decks,  render a book open to open the story 
                        <CustomButton onPress={()=>{}} customStyle={{height: 40, width: 40, position: 'relative', bottom: 7,}}>
                            <Icon name={'book-open'} solid={true} width={15} color={style.white} />
                        </CustomButton>
                    )} 
                </View>
            ))}
        </View>
        </>
     );
}

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: "row",
        zIndex: -1,
    },
    
    tabText: {
        fontSize: style.text_md,
        color: style.gray_400,
        fontWeight: "500",
        paddingVertical: 10,

    },

    individualTab:{
        width: "33%",
        borderBottomWidth: 3,
        borderBottomColor: style.gray_200,
        alignItems: 'center'
    },

    activeTab: {
        color: style.blue_500,
        borderBottomColor: style.blue_500,
    },
    contentContainer: {
        flexDirection: 'column',
        gap: 20,
        zIndex: -1,

    },
    item: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: style.gray_200, 
        flexDirection:'row',
        justifyContent: 'space-between',
    },
    lastItem: {
        borderBottomWidth: 0, // Remove bottom border for the last item
    }


});



export default BookmarksList;