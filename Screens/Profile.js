import { Image, StyleSheet, Text, View, TouchableOpacity, Dimensions, Alert} from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useAuth, useUser } from '@clerk/clerk-expo';
import * as ImagePicker from 'expo-image-picker';
import { Button, Menu } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import { ScrollView } from 'react-native-gesture-handler';
import Colors from '../hooks/Colors';
import { AntDesign } from '@expo/vector-icons';
import { updateIsPaid} from '../hooks/Index';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { PaidContext, PaidDateContext, PaymentIdContext } from '../Context/Paid';
import { ScoreContext } from '../Context/Score';
import { child, get, getDatabase, ref } from 'firebase/database';
import { app } from '../config/firebase';


const Profile = () => {
  const db = getDatabase(app);
  const dbRef = ref(db);
  const {isLoaded, isSignedIn, user} = useUser();
  const Email = user.primaryEmailAddress.emailAddress;
  const {paidDateC, setPaidDateC} = useContext(PaidDateContext);
  const {scores, setScores} = useContext(ScoreContext);
  const {paidS, setPaidS} = useContext(PaidContext);
  const {paymentId, setPaymentId} = useContext(PaymentIdContext);
  const Vsize = 14;
  const paidDate = paidDateC;
  const { signOut } = useAuth();
  const widthW = Dimensions.get('screen').width;
  const [visibleMenu, setVisibleMenu] = useState(true);
  const closeMenu = () => setVisibleMenu(false);
  const openMenu = () => setVisibleMenu(true);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const T = new Date();
  const timeStamp = Math.round(T.getTime()/day);
  const remainingDays = 30 - (timeStamp - paidDate);


  function updateUserData() {
    // A post entry.
    const userData = {
      fullName: user.fullName,
      email: Email,
      paidDate: paidDateC,
      paidStatus: paidS,
      profilePic: user.imageUrl,
      score: scores,
      transId: paymentId
    };
  
    return update(ref(db, 'users/' + user.id), userData);
  }

  if (!user) return null;


  try {
    
  } catch(e){
    console.error(e);
  }

  const updateProfileImage = async () => {
    // Ensure permissions; Expo's ImagePicker may require permissions to access the gallery
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 0.1,
        base64: true,
      });
  
      if (!result.canceled && result.assets[0].base64) {
        const base64 = result.assets[0].base64;
        const mimeType = result.assets[0].mimeType;
  
        const image = `data:${mimeType};base64,${base64}`;
  
        const successfulUpload = await user?.setProfileImage({
          file: image,
        });

        updateUserData();
          
      }
    } catch (err) {
      alert(err.errors[0].message);
    }
  };

  const LogOutAlert = () =>
    Alert.alert("Confirm", "Do You want to Logout?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "Yes", onPress: () => signOut() },
    ]);
 

    useEffect(()=>{
      get(child(dbRef, `users/${user.id}`)).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setPaidDateC(data.paidDate);
    
        } else {
          writeUserData();
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      });
    }, [isFocused])
  return (
    <View >
      <View style={{alignItems: "flex-end", width: widthW, padding: 10}}>
      {/* <Menu
      visible={visibleMenu}
      onDismiss={closeMenu}
      anchor={
        <TouchableOpacity onPress={openMenu}>
        <AntDesign name="menu-unfold" size={24} color="black" />
        </TouchableOpacity>
      }
      >
        <Menu.Item onPress={()=>navigation.navigate('Payments', {remainingDays: remainingDays })} title="Payments" leadingIcon={()=>
          <FontAwesome name="money" size={24} color="black" />
        }/>
        <Menu.Item onPress={()=>LogOutAlert()} title="Logout" leadingIcon={()=>
          <AntDesign name="logout" size={24} color={"black"} />
        }/>
      </Menu> */}
      <TouchableOpacity onPress={()=>LogOutAlert()} style={{backgroundColor: Colors.SECONDARY, alignItems: "center", padding: 10, borderRadius: 5, flexDirection: "row"}}>
        <AntDesign name="logout" size={24} color={"white"} />
        <Text style={{color: "white"}}>  LogOut</Text>
        </TouchableOpacity>
      </View>
      
      {/* <View style={{width: "100%", padding: 5, flexDirection: "row", justifyContent: "space-between"}}>
        <TouchableOpacity style={{padding: 10, borderRadius: 10, backgroundColor: Colors.PRIMARY, width: "30%", alignItems: "center"}}>
          <View >
          <Text >
          <AntDesign name="like1" size={15} color={Colors.SECONDARY} />
          Favorites
          </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{marginLeft: 20,padding: 10, borderRadius: 10, backgroundColor: Colors.PRIMARY, width: "30%", alignItems: "center"}}
        onPress={()=> signOut()}>
          <View >
          <Text style={{color: Colors.WHITE}}>
          <AntDesign name="logout" size={15} color={Colors.WHITE} />
          Logout
          </Text>
          </View>
        </TouchableOpacity>
      </View> */}
      
      <View style={styles.ProfilePic}>
        <TouchableOpacity onPress={() =>updateProfileImage()}>
        <Image style={{width: 150, height: 150, borderRadius: 99}} source={{uri: user?.imageUrl}}/>
        <Button style={{fontWeight: "bold"}}>Edit Profile <MaterialCommunityIcons name='pencil'/></Button>
        
        </TouchableOpacity>
        <Text style={{fontWeight: "bold", fontSize: 20, }}>{user?.fullName.toUpperCase()}</Text>
      </View>
      
      <ScrollView style={styles.ProfileMainContainer}>
        <View style={styles.InfoContainer}>
          <View style={styles.Content}>
            <Text style={styles.Type}>Score:</Text>
            <View style={{flexDirection: "row", alignItems: "center"}}>
            <Text style={styles.TypeSecondary}>{scores} </Text>
            <MaterialCommunityIcons name='progress-star' size={Vsize} color= "black"/>
            </View>
          </View>
          <View style={styles.Content}>
            <Text style={styles.Type}>Email:</Text>
            <View style={{flexDirection: "row", alignItems: "center"}}>
            <Text style={styles.TypeSecondary}>{Email} </Text>
            <Entypo name="mail" size={24} color="black" />
            </View>
          </View>
          <View style={styles.Content}>
            <Text style={styles.Type}>Monthly Tests Completed:</Text>
            <View style={{flexDirection: "row", alignItems: "center"}}>
            <Text style={styles.TypeSecondary}>40 </Text>
            <FontAwesome name="tasks" size={Vsize} color="black" />
            </View>
          </View>
          <View style={styles.Content}>
            <Text style={styles.Type}>Tests Completed:</Text>
            <View style={{flexDirection: "row", alignItems: "center"}}>
            <Text style={styles.TypeSecondary}>40 </Text>
            <FontAwesome name="tasks" size={Vsize} color="black" />
            </View>
          </View>
          <View style={styles.Content}>
            <Text style={styles.Type}>Remaining Days:</Text>
            <View style={{flexDirection: "row", alignItems: "center"}}>
            <Text style={styles.TypeSecondary}>{remainingDays > 0 ? remainingDays : 0} </Text>
            <FontAwesome5 name="coins" size={Vsize} color="black" />
            </View>
          </View>
          {remainingDays <= 0 && <View style={{width: "100%", backgroundColor: "blue", alignItems: "center", marginTop: 20, borderRadius: 20}}>
          <TouchableOpacity style={[styles.PaymentButton, {margin: 15}]} onPress={()=>navigation.navigate('Payments', {remainingDays: remainingDays })}>
        <Text style={{fontSize: 25, color: "white"}}>{"Pay"}</Text>
      </TouchableOpacity>
          </View>}
        </View>
      </ScrollView>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  ProfilePic: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40
  },
  Type: {
    fontWeight: "450", 
    fontSize: 15}
  ,
  TypeSecondary: {
    fontWeight: "300", 
    fontSize: 15, 
    color: Colors.SECONDARY
  },
  ProfileMainContainer: {
    padding: 20,
  },
  Content: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
    
  },
  PaymentButton: {
    backgroundColor: "tomato",
    width: 210,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
},
  elevation: {
    shadowColor: '#52006A',
    elevation: 1,
shadowOffset: {
	width: 6,
	height: 5,
},
shadowOpacity: 0.34,
shadowRadius: 6.27,


    
  },
})