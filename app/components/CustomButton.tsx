import React, { useRef } from 'react';
import { TouchableOpacity, Animated, StyleSheet } from 'react-native';
import * as style from '@/assets/styles/styles';

// CustomButton Component
const CustomButton = ({ children, onPress, customStyle }) => {
    
  // Use Animated for scale effect
  const scaleValue = useRef(new Animated.Value(1)).current;  // Initial scale is 1

  // Function to handle press in (scale down)
  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,  // Scale down to 95%
      useNativeDriver: true,  // Enable native driver for better performance
    }).start();
  };

  // Function to handle press out (scale back to normal)
  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,  // Scale back to normal (100%)
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity
        onPressIn={handlePressIn}  // Trigger scale down
        onPressOut={handlePressOut}  // Trigger scale back to normal
        onPress={onPress}  // Handle the actual button press
        style={[styles.button, customStyle]}  // Merge default and custom styles
        activeOpacity={0.7}>
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

// Default styles for the button
const styles = StyleSheet.create({
  button: {
    backgroundColor: style.blue_400,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: style.rounded_md, 
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CustomButton;
