import React, { useContext, useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev"
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Dimensions, Alert } from 'react-native';
import Colors from '../../../hooks/Colors';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getStudentInfo } from '../../../hooks/Index';
import { useUser } from '@clerk/clerk-expo';
import { PaidContext, PaidDateContext } from '../../../Context/Paid';





if (__DEV__){
  loadDevMessages();
  loadErrorMessages();
}

const TopicLists = ({grade, term, searchText}) => {
  const orientation = Dimensions.get('window').width;
  const {isLoaded, isSignedIn, user} = useUser();
  const navigation = useNavigation();
  const [paidStatus, setPaidStatus] = useState("No");
  const {paidS, setPaidS} = useContext(PaidContext);
  const {paidDateC, setPaidDateC} = useContext(PaidDateContext);
    const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const T = new Date();
  const timeStamp = Math.round(T.getTime()/day);
  const remainingDays = 30 - (timeStamp - paidDateC);


  const GET_ITEMS = gql`
  query Grades {
    topics(where: {AND: {grade: ${grade.replace(/\s+/g, '')}, term: ${term}}}) {
      createdBy {
        name
      }
      grade
      banner {
        url
      }
      subtopics
      topic
      topicDetails {
        title
        example1 {
          markdown
          html
        }
        example2 {
          markdown
          html
        }
        exercise {
          markdown
          html
        }
        explanation {
          markdown
          html
        }
        extras {
          markdown
          html
        }
      }
    }
  }
  `;
  const getInfo = () => {
    getStudentInfo(user?.primaryEmailAddress.emailAddress).then(resp =>{
        setPaidStatus(resp.student.paidStatus);

    }
    )
  }

  const topicDetailNavigation = (Content, ImageUrl) => {
    if (paidS == "Yes" || remainingDays > 0){
    navigation.navigate('TopicContent', {
      content: Content,
      imageUrl: ImageUrl
    }
    )} else{
    Alert.alert("Cannot access this material because you have not paid");
    }
  }
  useEffect (()=>{
    getInfo();
  }, [2]);
  const { loading, error, data } = useQuery(GET_ITEMS);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error :</Text>;


  const topicData = data?.topics.filter((item, index) => {
    return searchText.toLowerCase() === '' ? item: item?.topic.toLowerCase().includes(searchText.toLowerCase());
  });

  return (
    <View style={{ width: "100%", paddingLeft: 10, paddingVertical: 20}}><FlatList
      data={topicData}
      keyExtractor={item => item?.id}
      renderItem={({ item }) => (
        <TouchableOpacity style={{width: 0.6 * orientation, paddingVertical: 9, paddingHorizontal: 5}} onPress={()=> topicDetailNavigation(item?.topicDetails, item?.banner?.url)}>
        <View style={[styles.Contents, styles.elevation] }>
           
          <Image source={{uri: item?.banner?.url}} style={{width: 0.5 * orientation, height: 0.32 * orientation, borderRadius: 15}} resizeMode='contain' />
          <Text style={styles.topicTitle}>{item?.topic}</Text>
          <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "95%", padding: 5}}>
            <Text style={{textAlign: "center"}}>SubTopics:</Text>
          <View style={{textAlign: "center", flexDirection: "row"}}><MaterialIcons name="topic" size={20} color="black" /><Text>{item?.topicDetails.length}</Text></View>
          </View>
          </View>
        </TouchableOpacity>
      )}
    showsHorizontalScrollIndicator={false}
    horizontal={true}
    />
    </View>
  );
      }

export default TopicLists

const styles = StyleSheet.create({
  Contents: {
    backgroundColor: Colors.GREY,
     width: "95%", 
     borderRadius: 10, 
     alignItems: "center"},
     topicTitle: {
      fontWeight: "bold"
     },
  elevation: {
    elevation: 20,
    shadowColor: '#52006A',
  },
});