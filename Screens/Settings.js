import { View, Text, Touchable, TouchableOpacity  } from 'react-native'
import React from 'react'
import {useNavigation} from '@react-navigation/native'

export default function Settings() {
  const navigation = useNavigation();
  return (
    <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
      <TouchableOpacity style={{backgroundColor: "blue", padding: 20}} onPress={() => navigation.navigate("Home")}><Text>Home</Text></TouchableOpacity>
    </View>
  )
}