import { Alert, Platform } from 'react-native';

// Define a custom alert for web (using window.confirm)
const WebAlert = (title, description, options, extra) => {
    const result = window.confirm([title, description].filter(Boolean).join('\n'));

    if (result) {
        const confirmOption = options.find(({ style }) => style !== 'cancel');
        if (confirmOption && typeof confirmOption.onPress === 'function') {
            confirmOption.onPress();
        } else {
            console.error('confirmOption or onPress is undefined');
        }
    } else {
        const cancelOption = options.find(({ style }) => style === 'cancel');
        if (cancelOption && typeof cancelOption.onPress === 'function') {
            cancelOption.onPress();
        } else {
            console.error('cancelOption or onPress is undefined');
        }
    }
};

// Conditionally use the native Alert for mobile platforms and WebAlert for web
const CustomAlert = Platform.OS === 'web' ? WebAlert : Alert.alert;

export default CustomAlert;
