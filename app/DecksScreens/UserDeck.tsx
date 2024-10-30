
import { View, Text } from 'react-native';
import { useContext } from 'react';

//data 
import { languagesSupported } from '../data/LangData';
//data for context
import { CurrentLangContext } from '@/app/data/CurrentLangContext.tsx';

const UserDeck = () => {

    //current language
    const { currentLang, setCurrentLang } = useContext(CurrentLangContext);


    return ( 
        <View>
            <Text>Decks Home</Text>
            <Text>Currently Learning { currentLang } </Text>

        </View>
     );
}
 
export default UserDeck;