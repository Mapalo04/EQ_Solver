import React from "react";
import * as WebBrowser from "expo-web-browser";
import { Button, Image, View, TouchableOpacity, Text, Alert } from "react-native";
import { useOAuth } from "@clerk/clerk-expo";
import { useWarmUpBrowser } from "../../hooks/useWarmUpBrowser";
import GoogleIcon from "../../assets/google-icon.png";
import Colors from "../../hooks/Colors";

WebBrowser.maybeCompleteAuthSession();

const SignInWithOAuthG = () => {
  // Warm up the android browser to improve UX
  // https://docs.expo.dev/guides/authentication/#improving-user-experience
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });



  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();

      if (createdSessionId) {
        setActive({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
      Alert.alert(err.errors[0].message)
    }
  }, []);

  return (
    <View>
    <TouchableOpacity
      title="Sign in with Google"
      onPress={() => onPress()} 
      style={{backgroundColor: Colors.SECONDARY, justifyContent: "center", flexDirection: "row", width: 280, alignItems: "center", borderRadius: 20, paddingVertical: 15}} 
    >
    <Image source={GoogleIcon} style={{width: 20, height: 20}} resizeMode="contain"/> 
    <Text style={{color: Colors.WHITE}}> login with google account</Text>
    </TouchableOpacity>
    </View>
  );

  
}


export default SignInWithOAuthG;
