import { Alert, SafeAreaView, StyleSheet, Text,  TouchableOpacity,  View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { TextInput } from 'react-native-paper'
import { initiatePayment } from '../hooks/paymentCall'
import {  getPrice, updatePaidDate, updatePayment, updateTransId } from '../hooks/Index';
import { useUser } from '@clerk/clerk-expo';
import { useNavigation, useRoute } from '@react-navigation/native';
import { PaidContext, PaymentIdContext } from '../Context/Paid';
import { verifyPayment } from '../hooks/VerifyPayment';

export default function PaymentScreen() {
  const params = useRoute().params;
  const {isLoaded, isSignedIn, user} = useUser();
  const navigation = useNavigation();
  const {paidS, setPaidS} = useContext(PaidContext);
  const {paymentId, setPaymentId} = useContext(PaymentIdContext);
  const Email = user.primaryEmailAddress.emailAddress;
  const [phoneNumber, setPhoneNumber] = useState('');
  const [price, setPrice] = useState(0.5);
  const [paying, setPaying] = useState(false);
  const [isp, setisp] = useState("mtn");
  const remainingDays = params.remainingDays;
  

  const getPriceS = () => {
    getPrice().then(resp=>{
      setPrice(resp.companies[0].price);
      console.log("Price is ...", price);
    }).catch((err)=>{
      console.log(err)
    })
  } 

  
  const pay = ()=>{
    getPriceS();
    if (paying){
      Alert.alert("You have Already made a payment querry", "Go back to the previous screen to start over")
    } else{
    const f3 = phoneNumber.substring(0, 3)
    
if (f3 == "076" || f3 == "096"){
  setisp('mtn')
} else if (f3 == "077" || f3 == "097"){
  setisp('airtel')
} else if (f3 == "075" || f3 == "095"){
  Alert.alert("use an airtel or mtn")
}

console.log("helo", isp)
try {
    console.log(paying)
    initiatePayment(updatePaymentId, setPaying, phoneNumber, isp, price).then(resp=>{
      console.log(resp)
    });
  } catch (err) {
    console.log(err.errors[0].message);
    Alert.alert(err.errors[0].message)
  }
  }
}

   
  const updatePaymentDate = (paidDate) => {
  
  updatePaidDate(Email, paidDate).then(resp => {
    console.log("paying", paidDate)
  }).catch((err)=>{
    console.log(err)
  })

}  
const updatePaymentId = (transid) => {
  setPaymentId(transid);
  updateTransId(Email, transid).then(resp => {
    console.log("paying", transid)
  }).catch((err)=>{
    console.log(err)
  })

} 

useEffect(()=>{
  getPriceS();
}, [2])

console.log("paying", paidS);
  return (

    <SafeAreaView style={styles.PaymentScreenContainer}>
      {(paidS != "Yes" ? true : false) && <View style={[{width: "100%"}, styles.PaymentScreenContainer]}>
      <Text style={styles.PaymentText}>{"PaymentScreen ("+ String(price) +")"}</Text>
      <View style={{width: "100%", flexDirection: "row", backgroundColor: "blue", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20}}>
        <TextInput label={"Enter phone number"} style={styles.PaymentInput}
        value={phoneNumber}
        onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
      ></TextInput>
      <TouchableOpacity style={styles.PaymentButton} onPress={()=>pay()} >
        <Text style={{fontSize: 25, color: "white"}}>{paying ? "Paying ..." : "Pay"}</Text>
      </TouchableOpacity></View>
      {paying && <View style={{paddingTop: 15}}>
        <Text style={{fontWeight: "bold"}}>Verify Below 👇👇👇</Text>
      </View>}
      <TouchableOpacity style={[styles.PaymentButton, {margin: 15}]} onPress={()=>verifyPayment(updatePaymentDate, navigation, paymentId)}>
        <Text style={{fontSize: 25, color: "white"}}>{"Verify"}</Text>
      </TouchableOpacity>
      </View>}
      {(paidS == "Yes" ? true : false) &&
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
        width: "60%"
    },
    PaymentButton: {
        backgroundColor: "tomato",
        width: 140,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
    }
})