import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { getDatabase, ref, get } from 'firebase/database';

const ProfileCheckScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const db = getDatabase();
        const userId = route.params.userId; // Get user ID from route params
        console.log('User ID:', userId); // Print user ID to the console
        const userRef = ref(db, `users/${userId}`); // Assuming 'users' is the node where user details are stored
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          navigation.replace('ProfileScreen', { userId }); // Navigate to profile screen with user ID
        } else {
          navigation.replace('CompleteProfile');
        }
      } catch (error) {
        console.error('Error checking profile: ', error);
        // Handle error if necessary
      } finally {
        setLoading(false);
      }
    };

    checkProfile();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator animating={loading} size="large" />
    </View>
  );
};

export default ProfileCheckScreen;
