import React from "react";
import * as WebBrowser from "expo-web-browser";
import { Button, Image, View, TouchableOpacity, Text, Alert } from "react-native";
import { useOAuth } from "@clerk/clerk-expo";
import { useWarmUpBrowser } from "../../hooks/useWarmUpBrowser";
import FacebookICon from "../../assets/facebook-icon.png";
import Colors from "../../hooks/Colors";

WebBrowser.maybeCompleteAuthSession();

const SignInWithOAuthF = () => {
  // Warm up the android browser to improve UX
  // https://docs.expo.dev/guides/authentication/#improving-user-experience
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_facebook" });



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
    <View style={{paddingVertical: 20}}>
    <TouchableOpacity
      title="Sign in with Google"
      onPress={()=> onPress()} 
      style={{backgroundColor: Colors.SECONDARY, width: 280, flexDirection: "row", justifyContent: "center", alignItems: "center", borderRadius: 20, paddingVertical: 10}} 
    >
      <Image source={FacebookICon} style={{width: 20, height: 20}} resizeMode="contain"/> 
    <Text style={{fontWeight: "bold", color: Colors.WHITE}}> Facebook</Text>
    </TouchableOpacity>
    </View>
  );

  
}


export default SignInWithOAuthF;
