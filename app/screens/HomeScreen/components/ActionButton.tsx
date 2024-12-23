import { View, Text, StyleSheet, useWindowDimensions } from "react-native";

import React, { useState, useContext, useEffect} from 'react';

import { CurrentLangContext } from "@/app/data/CurrentLangContext.tsx";

import * as style from "@/assets/styles/styles";
import Icon from '@expo/vector-icons/FontAwesome6'

import CustomFab from "@/app/components/CustomFab";
import CustomModal from "@/app/components/CustomModal";
import CustomButton from "@/app/components/CustomButton";

import { storyFiles } from "../../../../assets/data/ExplorerData";

import { useNavigation} from "@react-navigation/native";

const ActionButton = () => {

    //current language
    const { currentLang } = useContext(CurrentLangContext);

    const [modalActive, toggleModal] = useState(false);


    //random index

    const [storyTitles, setTitles] = useState([]);
    const [selectedStory, setStory] = useState("");

    //set selectedStory to a random title
    const generateRandomStory = () => {
      const index = Math.floor(Math.random() * storyTitles.length);
      setStory(storyTitles[index]);
  };
  

    //load a random story from the explorer
      useEffect(() => {
  
          //get the JSON data 
          const json = storyFiles[currentLang]; 
          if (json) {
            //if there is data, get all the titles of the story in that language
            const titles = json.map(item => item.title);

            //set it to the storyTitles variable
            setTitles(titles);

            //set the selectedStory to a random title in the array
            generateRandomStory();
          
          } 
      

      }, [currentLang, modalActive]); // Re-run whenever `currentLang` changes
  
    
    //go to the practice interface
    const navigation = useNavigation();
    
    const goToPractice = () =>{

        //close the modal
        toggleModal(false);

        // First, navigate to the Decks stack and DecksHome
        navigation.navigate("Explorer", { screen: "ExplorerHome" });

        // Second, navigate to the Reader page of the selected story
        navigation.navigate("Explorer", {
          screen: "ExplorerReader", // Target screen inside Stack
          params: { title:selectedStory }, // Pass any params
        })

        //get the story data
          const json = storyFiles[currentLang]; 
          let storyData;
          let storyTranslation;
          if (json) {
              const filteredStory = json.filter(item => item.title === selectedStory);
              storyData = filteredStory[0].story;
              storyTranslation = filteredStory[0].story_translation;
          } 


        // Lastly go to the practice page 
        setTimeout(() => {
            navigation.navigate('Explorer', {
              screen: "PracticeSentence",
              params:  {story: storyData, storyTranslation: storyTranslation, title: selectedStory, stack:"Explorer" }
            })
        }, 0); // Delay ensures Reader stack is fully loaded


    }
  


    return ( 
      <>
        {/* FAB button */}
        <CustomFab icon={"dumbbell"} onPress={()=>toggleModal(true)}/>

        {/* Modal Toggled after clicked */}
        { modalActive &&
          <CustomModal title={"Start Learning"} onClose={()=>toggleModal(false)} >
            <View style={{flexDirection:'column', gap:30}}>

              {/* Name of the story */}
              <View style={{flexDirection:'column', gap:20}}>
                <Text style={{color:style.blue_500, fontSize:style.text_xl, fontWeight:'600'}}>Practice:</Text>
                <Text style={{color:style.gray_600, fontSize:style.text_md, fontWeight:'500'}}>
                  { selectedStory ? selectedStory : "Loading" }
                </Text>
              </View>

              {/* Button container */}
              <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                {/* Generate another story button */}
                <CustomButton onPress={generateRandomStory} customStyle={{backgroundColor:style.gray_300}}>
                    <Text style={{color:style.gray_600, fontWeight:'500'}}>Another story</Text>
                </CustomButton>

                {/* Start button */}
                <CustomButton onPress={goToPractice} customStyle={{width:120}}>
                    <Text style={{color:style.white, fontWeight:'500'}}>Go</Text>
                </CustomButton>
              </View>
            </View>
          </CustomModal>
        }
      </>
     );
}

 
const styles = StyleSheet.create({
    main_container: {
      flexDirection: 'row',
      alignItems:'center',
      backgroundColor: style.white, 
      borderRadius: 15,
      borderWidth: style.border_sm,
      borderColor: style.gray_200,
      height:70,

      paddingHorizontal:25

    },
});

 
export default ActionButton;