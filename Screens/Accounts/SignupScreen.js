import * as React from "react";
import { Alert, Text, TextInput, TouchableOpacity, View, ScrollView, Dimensions, StyleSheet } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import Colors from "../../hooks/Colors"
import { MaterialCommunityIcons } from '@expo/vector-icons';
import backgroundImage from '../../assets/splash.png';
import SignInWithOAuth from "./SignInWithOAuthG";
import { useNavigation } from "@react-navigation/native";



export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const navigation = useNavigation();

  // start the sign up process.
  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    if (confirmPassword == password){
    try {
      await signUp.create({
        firstName,
        lastName,
        emailAddress,
        password,
      });

      // send the email.
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // change the UI to our pending section.
      setPendingVerification(true);
    } catch (err) {
        console.error(JSON.stringify(err, null, 2));
        Alert.alert(err.errors[0].message, err.errors[0].longMessage)
    }
}   else {
    Alert.alert("Password does not match")
}
  };

  // This verifies the user using email code that is delivered.
  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      await setActive({ session: completeSignUp.createdSessionId });
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ScrollView style={{width: "100%",}} >
    <View style={[{ width: "100%", flex: 1, marginTop: "20%"}, styles.CenterContent]}>
      {!pendingVerification && (
        <View style={{alignItems: "center"}} >
            <Text style={[{fontSize: 25},styles.Title]}>Welcome to EQ-Solutions</Text>
            <Text style={[styles.Title, {fontWeight: "light", fontSize: 15}]}>Are you ready to learn?</Text>
        <View style={styles.InputSpacing}>
        <View style={styles.TextInputContainer}>
            <TextInput
              autoCapitalize="none"
              value={firstName}
              placeholder="First Name..."
              onChangeText={(firstName) => setFirstName(firstName)}
            />
          </View>
          </View>
          <View style={styles.InputSpacing}>
          <View style={[{},styles.TextInputContainer]}>
            <TextInput
              autoCapitalize="none"
              value={lastName}
              placeholder="Last Name..."
              onChangeText={(lastName) => setLastName(lastName)}
            />
          </View>
          </View>
          <View style={styles.InputSpacing}>
          <View style={styles.TextInputContainer}>
            <TextInput
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Email..."
              onChangeText={(email) => setEmailAddress(email)}
            />
            </View>

          </View >

          <View style={styles.InputSpacing}>
          <View style={[{flexDirection: "row", justifyContent: "space-between"},styles.TextInputContainer]}>
            <TextInput
              value={password}
              placeholder="Password..."
              placeholderTextColor="#000"
              secureTextEntry={showPassword}
              onChangeText={(password) => setPassword(password)}
              style={{flex: 1}}
            />
            <MaterialCommunityIcons name={showPassword ? 'eye-off' : 'eye'} size={24} color="white" style={styles.icon} onPress={toggleShowPassword}/>
          </View>
          </View>
          <View style={styles.InputSpacing}>
          <View style={[{flexDirection: "row", justifyContent: "space-between"},styles.TextInputContainer]}>
            <TextInput
              value={confirmPassword}
              placeholder="Confirm Password..."
              placeholderTextColor="#000"
              secureTextEntry={showPassword}
              onChangeText={(confirmPassword) => setConfirmPassword(confirmPassword)}
              style={{flex: 1}}
            />
            <MaterialCommunityIcons name={showPassword ? 'eye-off' : 'eye'} size={24} color="white" style={styles.icon} onPress={toggleShowPassword}/>
          </View>
          </View>

          <TouchableOpacity onPress={onSignUpPress} style={styles.SignUpButton}>
            <Text style={{color: Colors.WHITE,}}>Sign up</Text>
          </TouchableOpacity>
          <View style= {{flexDirection: "row", paddingVertical: 30}}>
      <Text style={{color: "black",}}> You already have an account? </Text>
      <TouchableOpacity onPress={()=> navigation.navigate('Login')} style={[styles.Title, {marginTop: -10}]}>
            <Text style={{color: Colors.SECONDARY_LIGHT,}}> Login </Text>
          </TouchableOpacity>
        </View>
        <SignInWithOAuth />
        </View>
        
      )}
      {pendingVerification && (
        <View style={{alignItems: "center"}}>
            <Text style={[{fontSize: 25},styles.Title]}>Verification</Text>
            <Text style={[styles.Title, {fontWeight: "light", fontSize: 15}]}>Check your email for the verification code sent</Text>
          <View style={styles.TextInputContainer}>
            <TextInput
              value={code}
              placeholder="Verification Code..."
              onChangeText={(code) => setCode(code)}
            />
          </View>
          <TouchableOpacity onPress={onPressVerify} style={styles.SignUpButton}>
            <Text style={{color: Colors.WHITE}}>Verify Email</Text>
          </TouchableOpacity>
        </View>
      )}
      
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    Title: {
        fontWeight: "bold",
        paddingVertical: 10,
    },
    SignUpButton: {
        backgroundColor: Colors.SECONDARY,
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 15,
        marginTop: 20,
        width: 250,

    },
    InputSpacing: {
        padding: 5
    },
    TextInputContainer: {
        padding: 10,
        margintop: 15,
        width: 250,
        borderWidth: 1,
        borderColor: "#ADADAD",
        borderRadius: 10,
    },
    CenterContent: {
        justifyContent: "center",
        alignItems: "center"
    },
    icon: {
        color: "black",
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
      },
})
