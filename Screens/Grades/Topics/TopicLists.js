import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev"
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import Colors from '../../../hooks/Colors';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';




if (__DEV__){
  loadDevMessages();
  loadErrorMessages();
}

const TopicLists = ({grade, term, searchText}) => {
  const orientation = Dimensions.get('window').width;


  const navigation = useNavigation();


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
  
  const topicDetailNavigation = (Content, ImageUrl) => {
    navigation.navigate('TopicContent', {
      content: Content,
      imageUrl: ImageUrl
    }
    )
  }
  const { loading, error, data } = useQuery(GET_ITEMS);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error :</Text>;


  const topicData = data?.topics.filter((item, index) => {
    return searchText.toLowerCase() === '' ? item: item?.topic.toLowerCase().includes(searchText.toLowerCase());
  });
  console.log(topicData)
  return (
    <View style={{ width: "100%", paddingLeft: 10, paddingVertical: 20}}><FlatList
      data={topicData}
      keyExtractor={item => item?.id}
      renderItem={({ item }) => (
        <TouchableOpacity style={{width: 0.6 * orientation, paddingVertical: 9, paddingHorizontal: 5}} onPress={()=> topicDetailNavigation(item?.topicDetails, item?.banner?.url)}>
        <View style={[styles.Contents, styles.elevation] }>
           
          <Image source={{uri: item?.banner?.url}} style={{width: 0.5 * orientation, height: 0.32 * orientation, borderRadius: 15}} resizeMode='contain' />
          <Text style={styles.topicTitle}>{item?.topic}</Text>
          <View style={{flexDirection: "row",width: "100%", paddingVertical: 10, justifyContent: "center"}}>
            <Text style={{textAlign: "center"}}>{item?.topicDetails.length} SubTopics</Text>
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