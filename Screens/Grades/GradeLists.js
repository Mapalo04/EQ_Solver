import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev"
import { View, Text, FlatList, StyleSheet, Image, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import Colors from '../../hooks/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../Header';
import TopicLists from './Topics/TopicListsGrade';



if (__DEV__){
  loadDevMessages();
  loadErrorMessages();
}

const GradeLists = () => {
  const orientation = Dimensions.get('window').width;
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");
  const GET_ITEMS = gql`
  query Grades {

    
    gradeLevels {
      gradeIn
      gradePic {
        url
      }
      topicNumbers
    }
  }
  `;
  const { loading, error, data } = useQuery(GET_ITEMS);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error :</Text>;


  const topicListNavigation = (grade, searchText) => {
    navigation.navigate('Topics', {
      grade: grade,
      searchText: searchText
      
    }
    )
  }

  const topicData = data.gradeLevels.filter((item, index) => {
    return searchText.toLowerCase() === '' ? item: item?.gradeIn.toLowerCase().includes(searchText.toLowerCase());
  })

  const TopicLC = ({grade}) => {
    return (
      <View style={styles.Container}>
        <TopicLists grade={grade} searchText={searchText}/>
      </View>
    )
  }


  return (
    <>
    <Header searchText={searchText} setSearchText={setSearchText} />
    {!searchText == "" &&<ScrollView style={{height: "100%", width: "100%"}}>
    <View style={[styles.Container, ]}>
        <Text style={styles.TermTitle}>Grade 10</Text>
        <TopicLC grade={"Grade10"} />
      </View>
      <View style={styles.Container}>
        <Text style={styles.TermTitle}>Grade 11</Text>
        <TopicLC grade={"Grade10"} />
      </View>
      <View style={styles.Container}>
        <Text style={styles.TermTitle}>Grade 12</Text>
        <TopicLC grade={"Grade10"} />
      </View>
    </ScrollView>}
    {searchText == "" &&
    <View style={{flex: 1, width: "100%", padding: 20}}>
      
      <FlatList
      data={data.gradeLevels}
      
      renderItem={({ item }) => (
        <TouchableOpacity style={{width: "51%", paddingVertical: 9, paddingHorizontal: 5}} onPress={()=> topicListNavigation(item.gradeIn, searchText)}>
        <View style={[styles.Contents, styles.elevation] }>
          
          <Image source={{uri: item.gradePic.url}} style={{width: 0.41 * orientation, height: 0.32 * orientation, borderRadius: 15}} resizeMode='contain' />
          <Text >{item.gradeIn}</Text>
          <View style={{flexDirection: "row", justifyContent: "space-between", width: "95%", padding: 5}}>
            <Text>Topics:</Text>
          <Text><MaterialCommunityIcons name='book-open'/> {item.topicNumbers}</Text>
          </View> 
        </View>
        </TouchableOpacity>
      )}

      numColumns={2}
      keyExtractor={item => item.id}
      style={styles.container}
    />
    </View>}
    </>
  );
      }

export default GradeLists

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "105%",
    marginLeft: -15,
  },
  TermTitle: {
    padding: 5,
    fontWeight: "bold",
    fontSize: 20
},
  Contents: {
    backgroundColor: Colors.GREY,
     width: "95%", 
     borderRadius: 10, 
     alignItems: "center"},
  elevation: {
      elevation: 20,
      shadowColor: '#52006A',
    },
     
});