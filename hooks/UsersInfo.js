import { View, Text } from 'react-native'
import React from 'react'
import { db } from '../config/firebase';

const UsersInfo = () => {
    const [, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const handleSubmitUser = async ()=> {
        const UserInfo = db.collection('users').doc(UserName);

        await UserInfo.set({
            Firstname: firstName,
            Lastname: Lastname,
            DOB: DOB
        });
    }
  
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up for Zitfuse</Text>
        {/* <TextInput style={styles.input} placeholder="Name" /> */}
        <TextInput style={styles.input} 
        placeholder="Email"
        autoCompleteType="email"
        keyboardType="email-address"
        value= {email}
        onChangeText={value => setEmail(value)} />
  
        <TextInput style={styles.input} placeholder="Password" 
        secureTextEntry={true} 
        autoCompleteType="password"
        value= {password}
        onChangeText={value => setPassword(value)}/>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    input: {
      width: '80%',
      height: 40,
      backgroundColor: '#fff',
      marginBottom: 10,
      padding: 10,
      borderRadius: 5,
    },
    button: {
      backgroundColor: '#007bff',
      width: '80%',
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
      marginTop: 10,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
    },
  });

export default UsersInfo