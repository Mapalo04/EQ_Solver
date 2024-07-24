import { Alert, SafeAreaView, StyleSheet, Text,  TouchableOpacity,  View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { PaperProvider, TextInput } from 'react-native-paper'
import { initiatePayment } from '../hooks/paymentCall'
import { getStudentInfo, updatePayment } from '../hooks/Index';
import { useUser } from '@clerk/clerk-expo';
import { useRoute } from '@react-navigation/native';

export default function PaymentScreen() {
  const params = useRoute().params;
  const {isLoaded, isSignedIn, user} = useUser();
  const Email = user.primaryEmailAddress.emailAddress;
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isp, setisp] = useState("mtn");
  const isPaid = params.paid;
  const remainingDays = params.remainingDays;
  


  
  const pay = ()=>{
    const f3 = phoneNumber.substring(0, 3)
    
if (f3 == "076" || f3 == "096"){
  setisp('mtn')
} else if (f3 == "077" || f3 == "097"){
  setisp('airtel')
} else if (f3 == "075" || f3 == "095"){
  Alert.alert("use an airtel or mtn")
}
console.log("helo", isp)
    initiatePayment(updatePaymentinfo, phoneNumber, isp).then(resp=>{
      console.log(resp)
    });
  }

  
  
  const updatePaymentinfo = (paidDate, transId) => {
  
  updatePayment(Email, paidDate, transId).then(resp => {
    console.log("paying", paidDate)
  }).catch((err)=>{
    console.log(err)
  })

}  


   
  return (

    <SafeAreaView style={styles.PaymentScreenContainer}>
      {!(isPaid == "yes" ? false : true) && <View style={[{width: "100%"}, styles.PaymentScreenContainer]}>
      <Text style={styles.PaymentText}>PaymentScreen</Text>
      <TextInput label={"Enter phone number"} style={styles.PaymentInput} 
        value={phoneNumber}
        onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
      ></TextInput>
      <TouchableOpacity style={styles.PaymentButton} onPress={()=>pay()}>
        <Text style={{fontSize: 25, color: "white"}}>Pay</Text>
      </TouchableOpacity>
      </View>}
      {!(isPaid == "yes" ? true : false) &&
        <Text style={styles.PaymentText}>You have {remainingDays} Days Remaining</Text>
      }

    </SafeAreaView>

  )
}

const styles = StyleSheet.create({
    PaymentScreenContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    
    PaymentText: {
        fontSize: 20,
        padding: 20,
    },
    PaymentInput: {
        width: "90%"
    },
    PaymentButton: {
        backgroundColor: "tomato",
        width: 240,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        borderRadius: 5,
    }
})