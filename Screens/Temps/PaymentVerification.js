import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import axios from "axios";

const PaymentVerification = () => {
  const [transactionId, setTransactionId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleVerifyPayment = async () => {
    try {
      const authKey = "27df052b0b2a4caa889189aeef210b87";
      const verificationUrl =
        "http://pamodzigatewayv1.olympustech.info:10000/PamodziPayments/V1/Mobile/MobileVerificationPayment";

      const response = await axios.get(verificationUrl, {
        params: {
          InternalTransactionId: transactionId,
          ClientPhoneNumber: phoneNumber,
        },
        headers: {
          Authorization: `Basic ${authKey}`,
        },
      });

      if (response.status === 200) {
        // Handle successful verification
        Alert.alert("Verification Response", response.data);
      } else {
        // Handle other HTTP status codes
        Alert.alert(
          "Error",
          `HTTP ${response.status}. Failed to verify payment.`
        );
      }
    } catch (error) {
      // Handle network errors or other exceptions
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View>
      <Text>ZITFUSE MOBILE MONEY PAYMENT VERIFICATION</Text>
      <TextInput
        placeholder="Transaction ID"
        value={transactionId}
        onChangeText={setTransactionId}
      />
      <TextInput
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <Button title="Verify Payment" onPress={handleVerifyPayment} />
    </View>
  );
};

export default PaymentVerification;
