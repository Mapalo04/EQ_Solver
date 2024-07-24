import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './Screens/HomeScreen';
import Profile from './Screens/Profile';
import Settings from './Screens/Settings';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import LoginScreen from './Screens/Accounts/LoginScreen';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
import { SafeAreaView } from 'react-native-safe-area-context';
import SignUpScreen from './Screens/Accounts/SignupScreen';
import Header from './Screens/Header';
import { ApolloProvider } from '@apollo/client';
import client from './hooks/ApolloClientSetup';
import PaymentScreen from './Screens/PaymentScreen';
import { useEffect } from 'react';
import TopicLists from './Screens/Grades/Topics/TopicLists';
import TermTopics from './Screens/Grades/TermTopics';
import TopicContent from './Screens/Grades/Topics/TopicContent';
import WeeklyD from './Screens/Tasks/WeeklyD';


const Stack = createStackNavigator();

const tokenCache = {
  async getToken(key) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

const App = () => {

  return (
    <PaperProvider>
      <StatusBar hidden={true}/>
    <ApolloProvider client={client}>
    <ClerkProvider publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY} >
        <SignedIn>
        <NavigationContainer style={styles.container}>
          
          <Stack.Navigator initialRouteName='HomeScreen' screenOptions={{
            headerShown: false
          }}>
            <Stack.Screen name='HomeScreen' component={HomeScreen} />
            <Stack.Screen name='Payments' component={PaymentScreen} />
            <Stack.Screen name='Topics' component={TermTopics} />
            <Stack.Screen name='TopicContent' component={TopicContent} />
            <Stack.Screen name='WeekT' component={WeeklyD}/>
          </Stack.Navigator>
          </NavigationContainer>
        </SignedIn>
        <SignedOut>
          <NavigationContainer style={styles.container}>
          <Stack.Navigator initialRouteName='Login' screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name='Signup' component={SignUpScreen}/>
          <Stack.Screen name='Login' component={LoginScreen}/>
          </Stack.Navigator>
          </NavigationContainer>
        </SignedOut>
    </ClerkProvider>
    </ApolloProvider>
    
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7ef5d',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
