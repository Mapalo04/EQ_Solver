import { StyleSheet } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import Profile from './Profile'
import Maths from './Math'
import Colors from '../hooks/Colors'
import LeaderBoard from './LeaderBoard'
import Tasks from './Tasks'
import { useUser } from '@clerk/clerk-expo'
import { getStudentInfo, updateIsPaid, updateProfileInfo, updateTransId } from '../hooks/Index'
import { gql, useQuery } from '@apollo/client'
import { ScoreContext } from '../Context/Score'
import { PaidContext, PaidDateContext, PaymentIdContext } from '../Context/Paid'
import { useIsFocused } from '@react-navigation/native'

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  const {isLoaded, isSignedIn, user} = useUser();
  const {scores, setScores} = useContext(ScoreContext);
  const {paidS, setPaidS} = useContext(PaidContext);
  const {paidDateC, setPaidDateC} = useContext(PaidDateContext);
  const {paymentId, setPaymentId} = useContext(PaymentIdContext);
  const [creatingUser, setCreateUser] = useState(false);
  const [paidStatus, setPaidStatus] = useState("No");
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const T = new Date();
  const timeStamp = Math.round(T.getTime()/day);
  const isFocused =useIsFocused();
  

  const updateInfo = (paidUpdate) => {
    console.log(paidStatus)
    updateProfileInfo(paidUpdate, paidStatus, user, user.fullName).then(resp => {
    }).catch((err)=>{
      console.log(err)
    })
  
}

  const getInfo = () => {
    getStudentInfo(user?.primaryEmailAddress.emailAddress).then(resp =>{
        updateInfo(false);
        console.log("home", resp.student);
        setScores(resp.student.score);
        setPaidS(resp.student.paidStatus);
        setPaidDateC(resp.student.paidDate);
        setPaymentId(resp.student.transId);
    }
    )
  }
  const updatePaidStatus = (Paid) => {
    updateIsPaid(user?.primaryEmailAddress.emailAddress, Paid).then(resp =>{

    }
    )
  }
  const updatePaymentId = () => {
    setPaymentId("");
    updateTransId(Email, "notpaid").then(resp => {
      console.log("paying", transid)
    }).catch((err)=>{
      console.log(err)
    })
  
  }
  

  const remainingDays = 30 - (timeStamp - paidDateC);
  

  
  useEffect(()=>{
    setPaidStatus(paidS)
    getInfo()
    if (remainingDays <= 0){
      setPaidS("No");
      updatePaidStatus("No");
      updatePaymentId();
    } else {
      setPaidS("Yes");
      updatePaidStatus("Yes");
    }
  }, [isFocused])
  
  return (
    <>
    
      <Tab.Navigator screenOptions={{ 
        headerShown: false,
        headerMode: 'screen',
        headerTintColor: 'white',
        headerStyle: { backgroundColor: Colors.PRIMARY }, }} >
        <Tab.Screen name="Home" component={Maths}
        options={{
            tabBarLabel: 'Learn',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome6 name="graduation-cap" size={size} color={color} />
            ),
          }} />
          <Tab.Screen name="LeaderBoard" component={LeaderBoard}
        options={{
          tabBarLabel: 'LeaderBoard',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="leaderboard" color={color} size={size}/>
          ),
        }} />
       
        
        <Tab.Screen name="Tasks" component={Tasks}
        options={{
          tabBarLabel: 'Tasks',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="tasks" size={size} color={color} />
          ),
          tabBarBadge: 4,
        }} />
         <Tab.Screen name="Profile" component={Profile} 
        options={{
          tabBarLabel: 'Me',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size}/>
          ),
          tabBarBadge: 2,
          
        }} />
      </Tab.Navigator>
      </>
  )
}

export default HomeScreen;

const styles = StyleSheet.create({
  BadgeStyle: {
    marginTop: -4, 
    marginLeft: 3, 
    color: "white", 
    backgroundColor: "black", 
    height: 10,
    textAlign: "center",
    paddingHorizontal: 5,
    borderRadius: 99,
    fontSize: 10
  }
})