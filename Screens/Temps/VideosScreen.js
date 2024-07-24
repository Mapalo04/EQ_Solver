import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  Text,
} from "react-native";
import { Video } from "expo-av";
import * as ScreenCapture from "expo-screen-capture"; // Import ScreenCapture module
import { useIsFocused } from "@react-navigation/native";
import { FullWindowOverlay } from "react-native-screens";
import firebase from "firebase/app";
import "firebase/database";
import { getDatabase, ref, get } from "firebase/database";
import { getAuth } from "firebase/auth";

import { TouchableOpacity } from "react-native-gesture-handler";
import ScreenOrientation, { OrientationLock } from 'expo-screen-orientation'
import Orientation, { OrientationLocker } from "react-native-orientation-locker";

const VideosScreen = ({ videoUrls }) => {
  const { videoUrl} = videoUrls;
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const isFocused = useIsFocused();
  console.log("hellooooo");
  useEffect(() => {
    if (isFocused) {
      preventScreenCapture(); // Call the function to prevent screen capture on component mount
      checkPaymentStatus(); // Check user's payment status
    } else {
      ScreenCapture.allowScreenCaptureAsync(); // Allow screen capture when the screen is out of focus
    }
  }, [isFocused]);

  const handleVideoLoad = () => {
    setIsVideoLoading(false);
  };
  
  
  const preventScreenCapture = async () => {
    try {
      await ScreenCapture.preventScreenCaptureAsync(); // Prevent screen capture
    } catch (error) {
      Alert.alert("Error", "Failed to prevent screen capture");
    }
  };

  const checkPaymentStatus = async () => {
    try {
      const userId = getAuth().currentUser.uid;
      const db = getDatabase();
      const userRef = ref(db, `users/${userId}`);

      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
            if (userData && userData.is_paid === "yes") {
              setIsPaid(true);
            } else {
              setIsPaid(false);
            }
          } else {
            console.error("User data not found");
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    } catch (error) {
      console.error("Error checking payment status:", error);
    }
  };

  async function changeScreenOrientation() {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  }


  return (
    <SafeAreaView style={styles.container}>
      {/* Status Bar */}
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Video Player */}
      <View style={styles.videoContainer}>
        {isVideoLoading && (
          <ActivityIndicator
            size="large"
            color="#fff"
            style={styles.loadingIcon}
          />
        )}
        {isPaid ? (
          <Video
            source={{ uri: videoUrl }}
            style={styles.video}
            useNativeControls
            resizeMode="contain"
            shouldPlay
            onLoad={handleVideoLoad}
          />
        ) : (
          <View>
            <Text style={styles.paymentText}>
              Please make a payment to watch this video.
            </Text>
            {/* Add a button or navigation to payment screen */}
          </View>
        )}
        {/* <TouchableOpacity onPress={() => Orientation.lockToLandscape()}>
          <Text style={{color: "white"}}>Rotate</Text>
        </TouchableOpacity> */}
      </View>
      

      {/* Related Videos */}

      {/* Add Bottom Menu */}
      {/* Replace this line with your BottomMenu component import and usage */}
      {/* <BottomMenu /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  videoContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  video: {
    width: "100%",
    height: "90%",
  },
  loadingIcon: {
    position: "absolute",
    alignSelf: "center",
  },
  paymentText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
});

export default VideosScreen;
