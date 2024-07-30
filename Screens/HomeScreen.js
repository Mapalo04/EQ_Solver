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
import { LeaderboardContext, ScoreContext } from '../Context/Score'
import { PaidContext, PaidDateContext, PaymentIdContext } from '../Context/Paid'
import { useIsFocused } from '@react-navigation/native'
import { app } from '../config/firebase'
import { child, get, getDatabase, onValue, push, ref, set, update } from 'firebase/database'

const Tab = createBottomTabNavigator();
const db = getDatabase(app);
const dbRef = ref(db);
const HomeScreen = () => {
  const {isLoaded, isSignedIn, user} = useUser();
  const Email = user.primaryEmailAddress.emailAddress;
  const {scores, setScores} = useContext(ScoreContext);
  const {paidS, setPaidS} = useContext(PaidContext);
  const {paidDateC, setPaidDateC} = useContext(PaidDateContext);
  const {paymentId, setPaymentId} = useContext(PaymentIdContext);
  const {leaderBoardData, setLeaderBoardData} = useContext(LeaderboardContext);
  const isFocused = useIsFocused();
  const [creatingUser, setCreateUser] = useState(false);
  const [paidStatus, setPaidStatus] = useState("No");
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const T = new Date();
  const timeStamp = Math.round(T.getTime()/day);
  let students = [];


  //get info from the realtime database
  try {
  useEffect(()=>{
  get(child(dbRef, `users/${user.id}`)).then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      setScores(data.score);
      setPaidS(data.paidStatus);
      setPaidDateC(data.paidDate);
      setPaymentId(data.transId);
      console.log(scores)
      if (remainingDays <= 0){
        updateUserData("No", "NotPaid", data.paidDate, data.score)
      }

    } else {
      writeUserData();
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
  get(child(dbRef, `users/`)).then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
    for (const key in data){
      students.push(data[key]);
    }
    setLeaderBoardData(students);
    } else {
      writeUserData();
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });

    

  /* const userRef = ref(db, 'users/' + user.id);
  onValue(userRef, (snapshot) => {
      const data = snapshot.val();
}); */
  }, [100])

} catch (e) {
  console.log(e)
}

//write data to the realtime database
function writeUserData() {
  set(ref(db, 'users/' + user.id), {
    fullName: user.fullName,
    email: Email,
    paidDate: 0,
    paidStatus: "No",
    profilePic: user.imageUrl,
    score: 0,
    transId: "id"
  });
}

function updateUserData(paidStatus, transId, paidDate, score) {
  // A post entry.
  const userData = {
    fullName: user.fullName,
    email: Email,
    paidDate: paidDate,
    paidStatus: paidStatus,
    profilePic: user.imageUrl,
    score: score,
    transId: transId
  };

  return update(ref(db, 'users/' + user.id), userData);
}


  

  const remainingDays = 30 - (timeStamp - paidDateC);
  

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