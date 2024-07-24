import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Colors from '../hooks/Colors'
import { useUser } from '@clerk/clerk-expo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AntDesign } from '@expo/vector-icons';
import { gql, useQuery } from '@apollo/client'
import { useNavigation } from '@react-navigation/native'

const Header = ({searchText, setSearchText}) => {
    const {isLoaded, isSignedIn, user} = useUser();
    const navigation = useNavigation();
    const widthW = Dimensions.get('screen').width;

    const GET_ITEMS = gql`
    query Students {
      student(where: {email: "${user.primaryEmailAddress.emailAddress}"}) {
        paidStatus
        school
        score
      }
    }
  `;
  
  const { loading, error, data } = useQuery(GET_ITEMS);

  const studentData = data?.student;
  return isLoaded && (
    <SafeAreaView style={[styles.MainContainer, {width: widthW}]}>
    <View style={{paddingHorizontal: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
    <TouchableOpacity onPress={()=>navigation.navigate("Profile")} style={{flexDirection: "row", alignItems: "center"}}>
      <Image source={{uri: user?.imageUrl}} style={{width: 50, height: 50, borderRadius: 99}} />
      <View style={{paddingHorizontal: 5}}>
      <Text style={{fontWeight:"bold", color: Colors.GREY}}>Welcome</Text>
      <Text style={{fontWeight:"heavy", color: Colors.GREY}}> {user?.fullName}</Text>
      </View>
      </TouchableOpacity>
      <View style={{flexDirection: "row", alignItems: "center"}}>
        <Text>{studentData?.score} </Text>
        <MaterialCommunityIcons name='progress-star' size={25} style={{color: "gold"}}/>
      </View>
      
    </View>
    <View style={styles.InputSpacing}>
      <View style={[{flexDirection: "row", justifyContent: "space-between"},styles.TextInputContainer]}>
        <TextInput
          value={searchText}
          placeholder="Search..."
          onChangeText={(searchText) => setSearchText(searchText)}
          style={{flex: 1}}
        />
        <AntDesign name="search1" size={24} color="black" />
      </View>
      </View>
    </SafeAreaView>
  )
}

export default Header

const styles = StyleSheet.create({
    MainContainer: {
        paddingVertical: 20,
        backgroundColor: Colors.PRIMARY,
    },
    InputSpacing: {
      paddingTop: 10,
      width: "100%",
      alignItems: "center"
  },
    TextInputContainer: {
      padding: 5,
      margintop: 15,
      width: "85%",
      borderColor: "#ADADAD",
      borderRadius: 10,
      backgroundColor: "white"
  },
})