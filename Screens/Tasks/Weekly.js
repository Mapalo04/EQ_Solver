import React, { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev"
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import Colors from '../../hooks/Colors';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DropdownComponent from '../Components/DropdownComponent';
import { getQuestions, getStudentInfo } from '../../hooks/Index';




if (__DEV__){
  loadDevMessages();
  loadErrorMessages();
}

const Weekly = () => {
  const orientation = Dimensions.get('window').width;
  const [data, setData] = useState([]);


  const navigation = useNavigation();



  const getQuestion =() => {
    getQuestions("Algebra").then(
      resp=>{
        setData(resp)
      }
    ).catch((err)=>{
      console.log(err)
    })
  }

  useEffect(()=>{
    getQuestion();
  }, [])

  


  return (
    <View style={{ width: "100%", paddingLeft: 10, paddingVertical: 20}}>
        <View>
            
        </View>
        <FlatList
      data={data?.assessments}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <DropdownComponent title={item?.questionCategory} data={item?.questions}/>
      )}

    />
    
    </View>
  );
      }

export default Weekly

const styles = StyleSheet.create({
  Contents: {
    backgroundColor: Colors.GREY,
     width: "95%", 
     borderRadius: 10, 
     alignItems: "center"},
     topicTitle: {
      fontWeight: "bold"
     },
  elevation: {
    elevation: 20,
    shadowColor: '#52006A',
  },
});