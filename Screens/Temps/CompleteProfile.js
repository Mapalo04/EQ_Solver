import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Modal,
} from "react-native";
import { getDatabase, ref, set, get } from "firebase/database";
import { getAuth } from "firebase/auth";

const CompleteProfile = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("1");
  const [school, setSchool] = useState("");
  const [snumber, setSnumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const schools = [
    { label: "Select School", value: "" },
    { label: "NQ / NS", value: "NQ" },
    { label: "School of Business & Humanities", value: "Business" },
    { label: "School of Natural Resources", value: "NQ" },
    { label: "School of Engineering", value: "NQ" },
    { label: "School of Mathematics and Natural Sciences", value: "NQ" },
    { label: "School of Mines and Mineral Sciences", value: "NQ" },
    { label: "School of the Built Environment", value: "built_environment" },
    { label: "School of Medicine", value: "NQ" },
    {
      label: "School of Information and Communication Technology",
      value: "NQ",
    },
    {
      label: "School of Humanities and Social Sciences",
      value: "Business",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getDatabase();
        const userId = getAuth().currentUser.uid;
        const userRef = ref(db, `users/${userId}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setFirstName(userData.firstName);
          setLastName(userData.lastName);
          setYearOfStudy(userData.yearOfStudy || "1");
          setSchool(userData.school);
          setSnumber(userData.snumber);
        }
      } catch (error) {
        console.error("Error fetching user details: ", error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    switch (step) {
      case 1:
        if (!firstName || !lastName) {
          Alert.alert("Error", "Please fill in all fields");
          return;
        }
        break;
      case 2:
        if (!yearOfStudy || !school) {
          Alert.alert("Error", "Please fill in all fields");
          return;
        }
        break;
      case 3:
        if (!snumber) {
          Alert.alert("Error", "Please fill in all fields");
          return;
        }
        break;
      default:
        break;
    }

    if (step === 3) {
      try {
        setLoading(true);
        const db = getDatabase();
        const userId = getAuth().currentUser.uid;
        const userRef = ref(db, `users/${userId}`);
        await set(userRef, {
          userId,
          firstName,
          lastName,
          yearOfStudy,
          school,
          snumber,
        });
        Alert.alert("Success", "Profile details submitted successfully");
        navigation.replace("HomeScreen");
      } catch (error) {
        console.error("Error adding user details: ", error);
        Alert.alert("Error", "Failed to submit profile details");
      } finally {
        setLoading(false);
      }
    } else {
      setStep(step + 1);
    }
  };

  const handleSchoolSelect = (selectedSchoolValue) => {
    setSchool(selectedSchoolValue);
    setModalVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Complete Your Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        onChangeText={(text) => setFirstName(text)}
        value={firstName}
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        onChangeText={(text) => setLastName(text)}
        value={lastName}
        placeholderTextColor="#aaa"
      />
      <View style={styles.dropdownContainer}>
        <Text style={styles.dropdownLabel}>Year of Study</Text>
        <TextInput
          style={styles.input}
          placeholder="Year"
          value={yearOfStudy}
          editable={false}
          placeholderTextColor="#aaa"
        />
      </View>
      <View style={styles.dropdownContainer}>
        <Text style={styles.dropdownLabel}>School</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.selectedSchool}>{school || "Select School"}</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Enter Email"
        onChangeText={(text) => setSnumber(text)}
        value={snumber}
        placeholderTextColor="#aaa"
      />
      <View style={styles.buttonContainer}>
        {step > 1 && (
          <TouchableOpacity
            style={[styles.button, styles.backButton]}
            onPress={() => setStep(step - 1)}
          >
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {step === 3 ? "Submit" : "Next"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {schools.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.modalItem}
                onPress={() => handleSchoolSelect(item.value)}
              >
                <Text style={styles.modalItemText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#ffd700",
    textTransform: "uppercase",
  },
  input: {
    width: "100%",
    height: 55,
    backgroundColor: "#333",
    marginBottom: 20,
    paddingHorizontal: 15,
    borderRadius: 25,
    color: "#fff",
    fontSize: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownContainer: {
    width: "100%",
    marginBottom: 20,
  },
  dropdownLabel: {
    color: "#ffd700",
    marginBottom: 8,
    marginLeft: 5,
    fontSize: 16,
  },
  selectedSchool: {
    color: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#ffd700",
    width: "48%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backButton: {
    backgroundColor: "#444",
  },
  buttonText: {
    color: "#1a1a1a",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    maxHeight: "80%",
  },
  modalItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#555",
  },
  modalItemText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default CompleteProfile;
