
import { View,  Text, Button } from "react-native";

const ReaderHome = ({ navigation }) => {
    return (
        <View>
            
            <Button onPress={ ()=> navigation.navigate("ReaderStory") }
                title="Go to story">
            </Button> 

        </View>

      );
}
 
export default ReaderHome;