import React, {useState} from 'react'
import { Alert, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import Colors from '../../hooks/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SignInWithOAuthG from './SignInWithOAuthG';
import SignInWithOAuthF from './SignInWithOAuthF';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';

export default function SignInScreen() {
  const navigation = useNavigation();
  const { signIn, setActive, isLoaded } = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = React.useState(true);
  const heightOrientation = Dimensions.get('screen').height
  const [loading, setLoading] = useState(false)

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      setLoading(true);
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });
      // This is an important step,
      // This indicates the user is signed in
      
      await setActive({ session: completeSignIn.createdSessionId });
    } catch (err) {
      console.log(err.errors[0].message);
      Alert.alert(err.errors[0].message)
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <ScrollView >
      <SafeAreaView style={{alignItems: "center", justifyContent: "center", paddingVertical: 0.12 * heightOrientation}}>
        <Text style={[{fontSize: 25},styles.Title]}>Welcome to EQ-Solutions</Text>
            <Text style={[styles.Title, {fontWeight: "light", fontSize: 15}]}>Login to start learning?</Text>
    <View style={styles.InputSpacing}>
      <View style={styles.TextInputContainer}>
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Email..."
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        />

      </View>
      </View>
      <View style={styles.InputSpacing}>
      <View style={[{flexDirection: "row", justifyContent: "space-between"},styles.TextInputContainer]}>
        <TextInput
          value={password}
          placeholder="Password..."
          secureTextEntry={showPassword}
          onChangeText={(password) => setPassword(password)}
          style={{flex: 1}}
        />
        <MaterialCommunityIcons name={showPassword ? 'eye-off' : 'eye'} size={24} color="white" style={styles.icon} onPress={toggleShowPassword}/>
      </View>
      </View>

      <TouchableOpacity onPress={onSignInPress} style={styles.SignUpButton}>
        <Text style={{color: Colors.WHITE, fontWeight: "bold"}}>{loading ? "Sign in ....." : "Sign in"}</Text>
      </TouchableOpacity>

      <View style= {{flexDirection: "row", paddingVertical: 30}}>
      <Text style={{color: "black",}}> Don't have an account? </Text>
      <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={[styles.Title, {marginTop: -10}]}>
            <Text style={{color: Colors.SECONDARY_LIGHT,}}> Create an account</Text>
          </TouchableOpacity>
        </View>

        <SignInWithOAuthG />
        <SignInWithOAuthF />
        </SafeAreaView>
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