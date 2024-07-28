import { Image, StyleSheet, Text, View, TouchableOpacity, Dimensions, Alert} from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useAuth, useUser } from '@clerk/clerk-expo';
import * as ImagePicker from 'expo-image-picker';
import { Button, Menu } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import Colors from '../hooks/Colors';
import { AntDesign } from '@expo/vector-icons';
import { updateIsPaid} from '../hooks/Index';
import { useNavigation } from '@react-navigation/native';
import { PaidDateContext } from '../Context/Paid';
import { ScoreContext } from '../Context/Score';


const Profile = () => {
  const {isLoaded, isSignedIn, user} = useUser();
  const {paidDateC, setPaidDateC} = useContext(PaidDateContext);
  const {scores, setScores} = useContext(ScoreContext);
  const Vsize = 14;
  const paidDate = paidDateC;
  const { signOut } = useAuth();
  const widthW = Dimensions.get('screen').width;
  const [visibleMenu, setVisibleMenu] = useState(true);
  const closeMenu = () => setVisibleMenu(false);
  const openMenu = () => setVisibleMenu(true);
  const navigation = useNavigation();

  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const T = new Date();
  const timeStamp = Math.round(T.getTime()/day);
  const remainingDays = 30 - (timeStamp - paidDate);


  if (!isLoaded) {
    // Handle loading state however you like
    return null;
  }

  if (!user) return null;



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

          updateInfo(false);
          updateInfo(false);
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
 


  return (
    <View >
      <View style={{alignItems: "flex-end", width: widthW, padding: 10}}>
      <Menu
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
      </Menu>
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
            <Text style={styles.Type}>Weekly Exercises Completed:</Text>
            <View style={{flexDirection: "row", alignItems: "center"}}>
            <Text style={styles.TypeSecondary}>40 </Text>
            <FontAwesome name="tasks" size={Vsize} color="black" />
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