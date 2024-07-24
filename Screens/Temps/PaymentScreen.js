import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import axios from "axios";
import firebase from "firebase/app";
import BottomMenu from "./BottomMenu";
import "firebase/database";
import { getDatabase, ref, set, get, serverTimestamp } from "firebase/database";
import { getAuth } from "firebase/auth";

const PaymentScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [paymentResponse, setPaymentResponse] = useState(null);
  const [verificationResponse, setVerificationResponse] = useState(null);
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const isMountedRef = useRef(true);
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState("");
  const [daysRemaining, setDaysRemaining] = useState(0);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const getUserId = async () => {
    try {
      const userId = getAuth().currentUser.uid;
      setUserId(userId);
    } catch (error) {
      console.error("Error getting user ID:", error);
    }
  };

  useEffect(() => {
    getUserId();
  }, []);

  useEffect(() => {
    if (isFocused) {
      checkPaymentStatus();
      fetchPrice();

      console.log(daysRemaining);

      if (daysRemaining <= 0){
        updatePaymentStatus("No", false)
      }
    }
  }, [isFocused]);

  const fetchPrice = async () => {
    try {
      const db = getDatabase();
      const priceRef = ref(db, "price");
      get(priceRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const priceData = snapshot.val();
            const priceValue =
              priceData && priceData.amount ? priceData.amount : "";
            setPrice(priceValue);
          } else {
            console.error("Price data not found");
          }
        })
        .catch((error) => {
          console.error("Error fetching price:", error);
        });
    } catch (error) {
      console.error("Error fetching price:", error);
    }
  };

  const updatePaymentStatus = (paidStatus, paid) => {
    if (!userId) return;
    const db = getDatabase();
    const userRef = ref(db, `users/${userId}`);

    const timestamp = serverTimestamp(); // Get current server timestamp
    console.log("Payment timestamp:", timestamp); // Log payment timestamp

    get(userRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          const updates = {
            ...userData,
            is_paid: paidStatus,
            payment_timestamp: timestamp, // Add payment timestamp
          };

          set(userRef, updates)
            .then(() => {
              console.log("Payment status updated successfully");
              setIsPaid(paid); // Set isPaid to true after payment
              const remainingDays = calculateDaysRemaining(timestamp);
              setDaysRemaining(remainingDays); // Update days remaining
            })
            .catch((error) => {
              console.error("Error updating payment status:", error);
            });
        } else {
          console.error("User data not found");
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  };

  const calculateDaysRemaining = (paymentTimestamp) => {
    const now = new Date();
    const paymentDate = new Date(paymentTimestamp);
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const daysDifference = Math.round(
      (now.getTime() - paymentDate.getTime()) / millisecondsPerDay
    );
    return Math.max(0, 30 - daysDifference);
  };

  const initiatePayment = async () => {
    try {
      setLoading(true);
      const authKey = "27df052b0b2a4caa889189aeef210b87";
      const url =
        "http://pamodzigatewayv1.olympustech.info:10000/PamodziPayments/V1/Mobile/MobileRequestPayment";

      const postData = {
        clientPhoneNumber: phoneNumber,
        clientNarration: "Making Payments",
        amount: price,
      };

      const response = await axios.post(url, postData, {
        headers: {
          Authorization: `Basic ${authKey}`,
        },
      });

      if (isMountedRef.current) {
        if (response.status === 200) {
          const { statusCode, notification, paymentsResponse } = response.data;
          const transationId = paymentsResponse.transationId;
          setTransactionId(transationId);
          setPaymentResponse({ statusCode, notification, transationId });
          setShowVerificationForm(true);
        } else {
          alert(
            "Error: HTTP " + response.status + ". Failed to initiate payment."
          );
          throw new Error("Failed to initiate payment.");
        }
      }
    } catch (error) {
      alert(String(error.message));
      console.error("Error initiating payment:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async () => {
    try {
      setVerificationLoading(true);
      const authKey = "27df052b0b2a4caa889189aeef210b87";
      const verificationUrl =
        "http://pamodzigatewayv1.olympustech.info:10000/PamodziPayments/V1/Mobile/MobileVerificationPayment";

      const url = `${verificationUrl}?InternalTransactionId=${transactionId}&ClientPhoneNumber=${phoneNumber}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Basic ${authKey}`,
        },
      });

      if (isMountedRef.current) {
        if (response.status === 200) {
          setVerificationResponse(response.data);
          updatePaymentStatus("yes", true);
        } else {
          console.error(
            "Error: HTTP " + response.status + ". Failed to verify payment."
          );
          throw new Error("Failed to verify payment.");
        }
      }
    } catch (error) {
      console.error("Error verifying payment:", error.message);
    } finally {
      setVerificationLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    try {
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
              setDaysRemaining(remainingDays); // Update days remaining
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
  checkPaymentStatus();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {!isPaid && (
          <>
            <Text style={{ color: "white", paddingVertical: 25, fontSize: 18 }}>
              Enter Phone Number starting with 260
            </Text>
            <Text style={{ color: "white", paddingVertical: 25, fontSize: 18 }}>
              PRICE: K{price}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Phone Number starting with 260"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
            <TouchableOpacity
              style={styles.button}
              onPress={initiatePayment}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Processing..." : "Make Payment"}
              </Text>
            </TouchableOpacity>

            {showVerificationForm && (
              <View>
                <TouchableOpacity
                  style={styles.button}
                  onPress={verifyPayment}
                  disabled={verificationLoading}
                >
                  <Text style={styles.buttonText}>
                    {verificationLoading ? "Verifying..." : "Verify Payment"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {paymentResponse && (
              <View style={styles.paymentResponse}>
                <Text style={styles.responseText}>Payment Response:</Text>
                <Text>Status Code: {paymentResponse.statusCode}</Text>
                <Text>Notification: {paymentResponse.notification}</Text>
                <Text>Transaction ID: {paymentResponse.transationId}</Text>
              </View>
            )}

            {verificationResponse && (
              <View style={styles.paymentResponse}>
                <Text style={styles.responseText}>Verification Response:</Text>
                <Text>Status Code: {verificationResponse.statusCode}</Text>
                <Text>Notification: {verificationResponse.notification}</Text>
                <Text>Transaction ID: {verificationResponse.transationId}</Text>
              </View>
            )}
          </>
        )}
        {isPaid && (
          <Text style={styles.paymentText}>
            Subscription Valid for {daysRemaining} days
          </Text>
        )}
      </View>
      <BottomMenu navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    backgroundColor: "white",
    width: "80%",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "gold",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  paymentResponse: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  responseText: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  paymentText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
});

export default PaymentScreen;
