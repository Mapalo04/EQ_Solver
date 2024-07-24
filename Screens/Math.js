import { StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity, FlatList, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as ScreenCapture from "expo-screen-capture";
import GradeLists from './Grades/GradeLists';
import { useIsFocused } from '@react-navigation/native';





export default function Maths() {
    const [Display, setDisplay] = useState([]);
    const isFocused = useIsFocused();
    
    
    const preventScreenCapture = async () => {
      try {
        await ScreenCapture.preventScreenCaptureAsync(); // Prevent screen capture
      } catch (error) {
        Alert.alert("Error", "Failed to prevent screen capture");
      }
    };
  
    useEffect(() => {
      if (isFocused) {
        preventScreenCapture(); // Call the function to prevent screen capture on component mount
         // Check user's payment status
      } else {
        ScreenCapture.allowScreenCaptureAsync(); // Allow screen capture when the screen is out of focus
      }
    }, [isFocused]);
    
  
  return (

    <SafeAreaView style={styles.MainContainer}>
      
    
    <GradeLists />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  flatList: {
    width: "100%"
  },
    MainContainer: {
        flex: 1,
        alignItems: 'center',
    },
    GradeContainer: {
      paddingVertical: 20,
    },
    GradeImage: {
      width: "100%",
      height: 200,
    },
    
})