import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import BottomMenu from "./BottomMenu"; // Import the BottomMenu component
import { getDatabase, ref, get } from "firebase/database";
import { getAuth } from "firebase/auth";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [isPaid, setIsPaid] = useState(true);
  const [price, setPrice] = useState("");
  const [daysRemaining, setDaysRemaining] = useState(0);

  const calculateDaysRemaining = (paymentTimestamp) => {
    const now = new Date();
    const paymentDate = new Date(paymentTimestamp);
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const daysDifference = Math.round(
      (now.getTime() - paymentDate.getTime()) / millisecondsPerDay
    );
    return Math.max(0, 30 - daysDifference);
  };

  const checkPaymentStatus = async () => {
    try {
      const userId = getAuth().currentUser.uid;
      if (!userId) return;
      const db = getDatabase();
      const userRef = ref(db, `users/${userId}`);

      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
            if (userData && userData.is_paid === "yes") {
              setIsPaid(true);
              const remainingDays = calculateDaysRemaining(
                userData.payment_timestamp
              );
              setDaysRemaining(remainingDays);
              // Update days remaining
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

  checkPaymentStatus()
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const db = getDatabase();
        const userId = getAuth().currentUser.uid;
        const userRef = ref(db, `users/${userId}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setUserData(userData);
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
        // Handle error if necessary
      }
    };
    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Zitfuse</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="search" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
          >
            <MaterialIcons name="help" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.profileContainer}>
        <View style={styles.profileInfo}>
          <View style={styles.profilePictureContainer}>
            <Image
              source={require("../assets/profile_picture.jpg")}
              style={styles.profilePicture}
            />
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.profileName}>
              {userData
                ? userData.firstName + " " + userData.lastName
                : "Loading..."}
            </Text>
            <Text style={styles.profileDetails}>
              {userData ? userData.school : "Loading..."}
            </Text>
            <Text style={styles.profileDetails}>
              {userData
                ? "Year of Study: " + userData.yearOfStudy
                : "Loading..."}
            </Text>
            <Text style={styles.profileDetails}>
              {userData ? "Email: " + userData.snumber : "Loading..."}
            </Text>
            <Text style={styles.profileDetails}>
              {userData ? "Paid Status: " + userData.is_paid : "Loading..."}
            </Text>
          </View>
        </View>
      </View>
      {isPaid && (
          <Text style={styles.paymentText}>
            Subscription Valid for {daysRemaining} days
          </Text>
        )}
      <View style={styles.tableContainer}>
        {/* Your table content goes here */}
      </View>
      <View style={styles.content}>{/* Your content goes here */}</View>
      
      
      <BottomMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Dark background color
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 40, // Adjusted padding top
    paddingBottom: 10, // Adjusted padding bottom
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 5,
  },
  logoText: {
    color: "gold",
    fontSize: 30,
    fontWeight: "bold",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    paddingHorizontal: 10,
  },
  profileIcon: {
    color: "white",
    fontSize: 24,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  profileInfo: {
    flexDirection: "row",
  },
  profilePictureContainer: {
    marginRight: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50, // to make it a circle
  },
  detailsContainer: {
    flex: 1,
  },
  profileName: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  profileDetails: {
    color: "white",
    fontSize: 16,
  },
  tableContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  content: {
    flex: 1, // Take remaining space
    justifyContent: "center",
    alignItems: "center",
  },
  paymentText: {
    color: "black",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    backgroundColor: "gold",
    paddingVertical: 20,
  },
});

export default ProfileScreen;
