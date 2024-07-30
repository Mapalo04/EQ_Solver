import React, { useContext, useEffect, useState } from 'react';
  import { Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
  import { Dropdown } from 'react-native-element-dropdown';
  import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { getStudentInfo } from '../../hooks/Index';
import { useUser } from '@clerk/clerk-expo';
import { PaidContext, PaidDateContext } from '../../Context/Paid';


  const DropdownComponent = ({title, data}) => {
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(true);
    const widthS= Dimensions.get("screen").width;
    const navigation = useNavigation();
    const {paidS, setPaidS} = useContext(PaidContext);
    const {paidDateC, setPaidDateC} = useContext(PaidDateContext);
    const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const T = new Date();
  const timeStamp = Math.round(T.getTime()/day);
  const remainingDays = 30 - (timeStamp - paidDateC);


  

    /* console.log("name.... ", title, "\ndata=>", data) */
    const renderLabel = () => {
      if (value || isFocus) {
        return (
          <Text style={[styles.label, isFocus && { color: 'blue' }]}>
            Dropdown label
          </Text>
        );
      }
      return null;
    };

    const weeklyNavigation = (Title, Data) => {
      if (paidS == "Yes" || remainingDays > 0){
      navigation.navigate('WeekT', {
        title: Title,
        data: Data
      }
      )} else{
        Alert.alert("Cannot access this Exercise because you have not paid");
        }
    }
    


    return (
      <View style={[styles.container, {width: widthS*0.95}]}>
        <TouchableOpacity onPress={()=> setIsFocus(!isFocus)}  style={{flexDirection: "row", justifyContent: "space-between"}}>
        <Text style={{fontWeight: "bold", marginTop: -10, paddingVertical: 5}}>{title}</Text>
        <View>
        {!isFocus ? <AntDesign name="rightcircleo" size={24} color="black" /> :
        <AntDesign name="downcircleo" size={24} color="black" />}
        </View>
        </TouchableOpacity>
 
        {isFocus && <TouchableOpacity style={{paddingVertical: 5}} onPress={()=>weeklyNavigation(title, data)}>
          <View style={{borderWidth: 0.5, borderRadius: 5, alignItems: "center", padding: 5}}>
            <Text>Exercise</Text>
          </View>
        </TouchableOpacity>}
      </View>
    );
  };

  export default DropdownComponent;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      padding: 16,
    },
    dropdown: {
      height: 50,
      borderColor: 'gray',
      borderWidth: 0.5,
      borderRadius: 8,
      paddingHorizontal: 8,
    },
    icon: {
      marginRight: 5,
    },
    label: {
      position: 'absolute',
      backgroundColor: 'white',
      left: 22,
      top: 8,
      zIndex: 999,
      paddingHorizontal: 8,
      fontSize: 14,
    },
    placeholderStyle: {
      fontSize: 16,
    },
    selectedTextStyle: {
      fontSize: 16,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
  });