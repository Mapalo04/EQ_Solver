import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./Screens/HomeScreen";
import * as SecureStore from "expo-secure-store";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import LoginScreen from "./Screens/Accounts/LoginScreen";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import SignUpScreen from "./Screens/Accounts/SignupScreen";
import { ApolloProvider } from "@apollo/client";
import client from "./hooks/ApolloClientSetup";
import PaymentScreen from "./Screens/PaymentScreen";
import TermTopics from "./Screens/Grades/TermTopics";
import TopicContent from "./Screens/Grades/Topics/TopicContent";
import WeeklyD from "./Screens/Tasks/WeeklyD";
import { LeaderboardContext, ScoreContext } from "./Context/Score";
import { PaidContext, PaidDateContext, PaymentIdContext } from "./Context/Paid";
import { useState } from "react";

const Stack = createStackNavigator();

const tokenCache = {
  getToken: (key) => {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  saveToken: (key, token) => {
    try {
      return SecureStore.setItemAsync(key, token);
    } catch (err) {
      return null;
    }
  },
};

const App = () => {
  const [scores, setScores] = useState(0);
  const [paidS, setPaidS] = useState("No");
  const [paidDateC, setPaidDateC] = useState(0);
  const [paymentId, setPaymentId] = useState("");
  const [leaderBoardData, setLeaderBoardData] = useState([]);

  return (
    <PaperProvider>
      <StatusBar hidden={true} />
      <ApolloProvider client={client}>
        <ClerkProvider
          tokenCache={tokenCache}
          publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
        >
          <ScoreContext.Provider value={{ scores, setScores }}>
            <PaidContext.Provider value={{ paidS, setPaidS }}>
              <PaidDateContext.Provider value={{ paidDateC, setPaidDateC }}>
                <PaymentIdContext.Provider value={{ paymentId, setPaymentId }}>
                  <LeaderboardContext.Provider
                    value={{ leaderBoardData, setLeaderBoardData }}
                  >
                    <SignedIn>
                      <NavigationContainer style={styles.container}>
                        <Stack.Navigator
                          initialRouteName="HomeScreen"
                          screenOptions={{
                            headerShown: false,
                          }}
                        >
                          <Stack.Screen
                            name="HomeScreen"
                            component={HomeScreen}
                          />
                          <Stack.Screen
                            name="Payments"
                            component={PaymentScreen}
                          />
                          <Stack.Screen name="Topics" component={TermTopics} />
                          <Stack.Screen
                            name="TopicContent"
                            component={TopicContent}
                          />
                          <Stack.Screen name="WeekT" component={WeeklyD} />
                        </Stack.Navigator>
                      </NavigationContainer>
                    </SignedIn>
                    <SignedOut>
                      <NavigationContainer style={styles.container}>
                        <Stack.Navigator
                          initialRouteName="Login"
                          screenOptions={{
                            headerShown: false,
                          }}
                        >
                          <Stack.Screen
                            name="Signup"
                            component={SignUpScreen}
                          />
                          <Stack.Screen name="Login" component={LoginScreen} />
                        </Stack.Navigator>
                      </NavigationContainer>
                    </SignedOut>
                  </LeaderboardContext.Provider>
                </PaymentIdContext.Provider>
              </PaidDateContext.Provider>
            </PaidContext.Provider>
          </ScoreContext.Provider>
        </ClerkProvider>
      </ApolloProvider>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7ef5d",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
