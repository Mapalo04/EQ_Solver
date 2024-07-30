import { Alert, SafeAreaView, StyleSheet, Text,  TouchableOpacity,  View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { TextInput } from 'react-native-paper'
import { initiatePayment } from '../hooks/paymentCall'
import {  getPrice, updatePaidDate, updatePayment, updateTransId } from '../hooks/Index';
import { useUser } from '@clerk/clerk-expo';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { PaidContext, PaidDateContext, PaymentIdContext } from '../Context/Paid';
import { verifyPayment } from '../hooks/VerifyPayment';
import { child, get, getDatabase, ref, update } from 'firebase/database';
import { app } from '../config/firebase';
import { ScoreContext } from '../Context/Score';

export default function PaymentScreen() {
  const params = useRoute().params;
  const db = getDatabase(app);
  const dbRef = ref(db);
  const {isLoaded, isSignedIn, user} = useUser();
  const navigation = useNavigation();
  const {paidS, setPaidS} = useContext(PaidContext);
  const {paymentId, setPaymentId} = useContext(PaymentIdContext);
  const {scores, setScores} = useContext(ScoreContext);
  const {paidDateC, setPaidDateC} = useContext(PaidDateContext);
  const Email = user.primaryEmailAddress.emailAddress;
  const [phoneNumber, setPhoneNumber] = useState('');
  const [price, setPrice] = useState(0.5);
  const [paying, setPaying] = useState(false);
  const [isp, setisp] = useState("mtn");
  const remainingDays = params.remainingDays;
  


  
  const pay = ()=>{
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
    updateUserData("Yes", paymentId, paidDate);
    console.log("paid on ", )
    setPaymentId(paidDate);
}  
const updatePaymentId = (transid) => {
  console.log("paying", transid);
  setPaymentId(transid);
  updateUserData("No", transid, paidDateC);

} 

function updateUserData(paidStatus, transId, paidDate) {
  const db = getDatabase(app);
  // A post entry.
  const userData = {
    fullName: user.fullName,
    email: Email,
    paidDate: paidDate,
    paidStatus: paidStatus,
    profilePic: user.imageUrl,
    score: scores,
    transId: transId
  };

  return update(ref(db, 'users/' + user.id), userData);
}



useEffect(()=>{
  get(child(dbRef, `Price`)).then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      setPrice(data)

    } else {
      writeUserData();
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
}, [2])


  return (

    <SafeAreaView style={styles.PaymentScreenContainer}>
      {(remainingDays <= 0 ) && <View style={[{width: "100%"}, styles.PaymentScreenContainer]}>
      <Text style={styles.PaymentText}>{"PaymentScreen ("+ String(price) +")"}</Text>
      <View style={{width: "100%", flexDirection: "row", backgroundColor: "blue", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20}}>
        <TextInput label={"Enter phone number"} style={styles.PaymentInput}
        value={phoneNumber}
        onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
      ></TextInput>
      <TouchableOpacity style={styles.PaymentButton} onPress={()=>pay()} >
        <Text style={{fontSize: 25, color: "white"}}>{paying ? "Paying ..." : "Pay"}</Text>
      </TouchableOpacity></View>
      {paying && <View style={{paddingTop: 15, alignItems: "center"}}>
        <Text style={{fontWeight: "bold"}}>Verify Below 👇👇👇</Text>
        <Text style={{paddingHorizontal: 30}}>  If Verification fails wait for some seconds or go back to previous screen then come back and verify</Text>
      </View>}
      <TouchableOpacity style={[styles.PaymentButton, {margin: 15}]} onPress={()=>verifyPayment(updatePaymentDate, navigation, paymentId)}>
        <Text style={{fontSize: 25, color: "white"}}>{"Verify"}</Text>
      </TouchableOpacity>
      </View>}
      {(remainingDays > 0 ) &&
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