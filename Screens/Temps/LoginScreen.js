import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  BackHandler,
  loading,
} from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = getAuth(); // Initialize Firebase Auth
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );
    return () => backHandler.remove();
  }, []);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    // Validation
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Login successful, navigate to profile check screen with user ID
      navigation.replace("ProfileCheckScreen", {
        userId: userCredential.user.uid,
      });
    } catch (error) {
      // Handle login errors
      Alert.alert(
        "Wrong password or email",
        "Please check your email or password \n or \nMake sure you have a stable network connection",
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to EQ Solver</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#aaa" // Placeholder text color
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={!showPassword}
          placeholderTextColor="#aaa" // Placeholder text color
        />

        <MaterialCommunityIcons
          name={showPassword ? "eye-off" : "eye"}
          size={24}
          color="white"
          style={styles.icon}
          onPress={toggleShowPassword}
        />
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate("Forgotpassword")}
        style={styles.signupButton}
      >
        <Text style={styles.signupText}>Forgot password?</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading} // Disable button when loading
      >
        <Text style={styles.buttonText}>
          {loading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Signup")}
        style={styles.signupButton}
      >
        <Text style={styles.signupText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a", // Dark background color
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#ffd700", // Gold color for text
    textTransform: "uppercase", // Uppercase text
  },
  input: {
    width: "80%",
    height: 50,
    backgroundColor: "#333", // Dark gray input background
    marginBottom: 20,
    padding: 15,
    borderRadius: 25,
    color: "#fff", // White text color
    fontSize: 16,
  },
  inputPassword: {
    width: "75%",
    height: 50,
    backgroundColor: "#333", // Dark gray input background
    marginBottom: 20,
    padding: 15,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    color: "#fff", // White text color
    fontSize: 16,
  },
  icon: {
    marginBottom: 20,
    backgroundColor: "#333",
    padding: 12.5,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
  },
  button: {
    backgroundColor: "#ffd700", // Gold color for button background
    width: "80%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    marginTop: 10,
    opacity: loading ? 0.5 : 1, // Dim button when loading
  },
  buttonText: {
    color: "#1a1a1a", // Dark background color
    fontSize: 18,
    fontWeight: "bold",
  },
  signupButton: {
    marginTop: 20,
  },
  signupText: {
    color: "#ffd700", // Gold color for signup text
    fontSize: 16,
  },
});

export default LoginScreen;
