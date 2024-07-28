import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import Colors from '../../../hooks/Colors';

const SolutionR = ({solution}) => {
    const [revealSolution, setRevealSolution] = useState(false);
    
  return (
    <View style={[styles.ExampleContainer, {paddingBottom: 40}]}>
          <View style={{width: "100%", padding: 10}}>
          <TouchableOpacity onPress={()=> setRevealSolution(!revealSolution)} style={[styles.SignUpButton, {width: 100, paddingVertical: 5, borderRadius: 8}]}>
            <Text style={{color: Colors.WHITE, fontSize: 14, textAlign: "left"}}>solution <AntDesign name="play" size={15} color="white" /></Text>
          </TouchableOpacity>
          </View>
          {revealSolution && <View>
            <View style={{padding: 8}}>
              <Text style={[styles.ExplanationText, {fontWeight: "800",}]}>Solution</Text></View>
          <View style={styles.ExampleTextContainer}>
          <Text style={[styles.ExampleText, {color: "white"}]}>
            {solution}
          </Text>
          </View>
          </View>}
          </View>
  )
}

export default SolutionR

const styles = StyleSheet.create({
    mainContainer: {
        alignItems: "center",
        justifyContent: "center",
      },
      Title: {
        fontWeight: "bold",
        fontSize: 20,
        alignItems: "center",
        paddingVertical: 20,
      },
      ExplanationTextContainer: {
        borderRadius: 10,
        padding: 10,
        
      },
      ExampleTextContainer: {
        backgroundColor: "black",
        borderRadius: 10,
        padding: 10,
      },
      ExampleContainer: {
        paddingVertical: 5,
      },
      ExampleText: {
        fontSize: 17
      },
      ExplanationText: {
        fontSize: 18
      },
      SignUpButton: {
        backgroundColor: Colors.SECONDARY,
        padding: 12,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 15,
        marginTop: 20,
        width: 250,
    
    },
    elevation: {
      elevation: 20,
      
    },
})