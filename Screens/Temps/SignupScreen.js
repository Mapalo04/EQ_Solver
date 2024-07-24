import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  loading,
} from "react-native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = getAuth(); // Initialize Firebase Auth
  const [showPassword, setShowPassword] = useState(false);


  const toggleShowPassword = () => {
      setShowPassword(!showPassword);
    };
  const handleSignUp = async () => {
    // Validation
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Sign up successful, navigate to login screen
      navigation.navigate("Login");
    } catch (error) {
      // Handle sign up errors
      Alert.alert("Error", error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up for Zitfuse</Text>
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
      <MaterialCommunityIcons name={showPassword ? 'eye-off' : 'eye'} size={24} color="white" style={styles.icon} onPress={toggleShowPassword}/>
      </View>
      <View style={styles.passwordContainer}>
      <TextInput
        style={styles.inputPassword}
        placeholder="Confirm Password"
        onChangeText={(text) => setConfirmPassword(text)}
        value={confirmPassword}
        secureTextEntry={!showPassword}
        placeholderTextColor="#aaa" // Placeholder text color
      />
      <MaterialCommunityIcons name={showPassword ? 'eye-off' : 'eye'} size={24} color="white" style={styles.icon} onPress={toggleShowPassword}/>
      </View>
      
      <TouchableOpacity
        style={styles.button}
        onPress={handleSignUp}
        disabled={loading} // Disable button when loading
      >
        <Text style={styles.buttonText}>
          {loading ? "Signing up..." : "Sign Up"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
        style={styles.signupButton}
      >
        <Text style={styles.signupText}>Have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
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
  button: {
    backgroundColor: "#ffd700", // Gold color for button background
    width: "80%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    marginBottom: 10,
    shadowColor: "#000", // Shadow for button
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    opacity: loading ? 0.5 : 1, // Dim button when loading
  },
  buttonText: {
    color: "#1a1a1a", // Dark background color
    fontSize: 18,
    fontWeight: "bold",
  },
  signupButton: {
    color: "#ffd700",
  },
  signupText: {
    color: "#ffd700", // Gold color for signup text
    fontSize: 16,
  },
});

export default SignupScreen;
