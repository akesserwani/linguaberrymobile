
import { View, Text } from 'react-native';
import { useContext } from 'react';

//data 
import { languagesSupported } from '@/assets/data/CurrentLangContext';
//data for context
import { CurrentLangContext } from '@/assets/data/data';

const DecksHome = () => {


    //current language
    const { currentLang, setCurrentLang } = useContext(CurrentLangContext);


    return ( 
        <View>
            <Text>Decks Home</Text>
            <Text>Currently Learning { currentLang } </Text>

        </View>
     );
}
 
export default DecksHome;