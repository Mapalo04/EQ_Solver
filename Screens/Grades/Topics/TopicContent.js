import { Dimensions, FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import Colors from '../../../hooks/Colors';
import * as Progress from 'react-native-progress';
import RenderHTML from 'react-native-render-html';
import ContentHtml from './ContentHtml';

const Tab = createMaterialTopTabNavigator()

const TopicContent = () => {
    const params = useRoute().params;
    const orientation = Dimensions.get('window').width;
    const orientationh = Dimensions.get('window').height;
    const navigation = useNavigation();
    const [isFinished, setIsFinished] = useState(false);
    const [revealSolution, setRevealSolution] = useState(false)
    let ContentRef;

    const data = params.content;

    const finishedTopic = () => {
      navigation.goBack();
    }

  return (
    <SafeAreaView style={styles.mainContainer}>
    <View style={{alignItems: "center", justifyContent: "center"}}>
      
    <FlatList
      data={data}
      keyExtractor={item => item?.id}
      renderItem={({ item, index }) => (
        <View>
          <View style={{padding: 20}}>
      <Progress.Bar progress={data.length > 0 ? index+1/data.length : 0} width={orientation*0.9} />
      </View>
        <ScrollView style={{width:orientation ,padding:15, }} ref={(ref)=>{
          ContentRef = ref;
        }}>
          <View style={{width: "100%", alignItems: "center"}}>
          <Text style={styles.Title}>{item?.title}</Text>
          </View>
          {index == 0 && <View>
            <Image style={{width: orientation, height: orientationh * 0.4}} source={{uri: params.imageUrl}} resizeMode='contain'/>
          </View>}
          <View style={styles.ExplanationTextContainer}>
          <Text style={styles.ExplanationText}>
            <ContentHtml sourceC={item?.explanation?.html} />
            
          </Text>
          </View>
          <View style={styles.ExampleContainer}>
          <View style={{padding: 8}}>
              <Text style={styles.ExplanationText}>Example 1</Text></View>
          <View style={styles.ExampleTextContainer}>
          <Text style={[styles.ExplanationText, {color: "white"}]}>
            <ContentHtml sourceC={item?.example1?.html} colors='#fff' />

          </Text>
          </View>
          </View>
          <View style={styles.ExampleContainer}>
            <View style={{padding: 8}}>
              <Text style={styles.ExplanationText}>Example 2</Text></View>
          <View style={styles.ExampleTextContainer}>
          <Text style={[styles.ExampleText, {color: "white"}]}>
            
            <ContentHtml sourceC={item?.example2?.html} colors="#fff" />
          </Text>
          </View>
          </View>
          
          <View style={[styles.ExampleContainer, {paddingBottom: 40}]}>
          <View style={{width: "100%", padding: 10}}>
          <TouchableOpacity onPress={()=> setRevealSolution(!revealSolution)} style={[styles.SignUpButton, {width: 100, paddingVertical: 5, borderRadius: 8}]}>
            <Text style={{color: Colors.WHITE, fontSize: 14, textAlign: "left"}}>solution <AntDesign name="play" size={15} color="white" /></Text>
          </TouchableOpacity>
          </View>
          {revealSolution && <View>
            <View style={{padding: 8}}>
              <Text style={[styles.ExplanationText, {fontWeight: "800",}]}>Solution</Text></View>
          <View style={styles.ExampleTextContainer}>
          <Text style={[styles.ExampleText, {color: "white"}]}>
            {item?.example2?.markdown}
          </Text>
          </View>
          </View>}
          </View>
          {index+1 >= data.length && <View style={{width: "100%", alignItems: "center", paddingBottom: 50}}>
          <TouchableOpacity onPress={()=> setIsFinished(true)} style={styles.SignUpButton}>
            <Text style={{color: Colors.WHITE, fontSize: 20}}>Finish</Text>
          </TouchableOpacity>
          </View>}
          </ScrollView>
          </View>
        )}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        pagingEnabled
        
        />
        {isFinished && <View style={{width: orientation, height: orientationh,position: "absolute", backgroundColor: "white", alignItems: "center", justifyContent: "center"}}>
          <View style={[{padding: 40, position: "absolute", backgroundColor: "white", borderRadius: 20, alignItems: "center"}, styles.elevation]}>

        <Text style={{textAlign: "center", lineHeight: 25, fontSize: 17}}>{"Congraturations you\n have earned"} </Text>
        <Text style={{textAlign: "center", fontWeight: "bold", fontSize: 25}}>{data.length * 10} 
        <MaterialCommunityIcons name='progress-star' size={24} color= "gold"/></Text>
        <Text style={{textAlign: "center", lineHeight: 25, fontSize: 17}}>{"Like and Get your points"} </Text>
        
        <View style={{width: "80%", alignItems: "center", flexDirection: "row", gap: 20}}>
        <TouchableOpacity onPress={()=> finishedTopic()} style={[styles.SignUpButton, {width: "30%"}]}>
            <Text style={{color: Colors.WHITE, fontSize: 20}}><AntDesign name="like1" size={15} color={"white"} /> </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=> finishedTopic()} style={[styles.SignUpButton, {width: "70%"}]}>
            <Text style={{color: Colors.WHITE, fontSize: 20}}>Get</Text>
          </TouchableOpacity>
          </View>
      </View>
      </View>}
    </View>

    </SafeAreaView>
  )
}

export default TopicContent

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  Title: {
    fontWeight: "bold",
    fontSize: 20,
    alignItems: "center",
    paddingVertical: 20,
  },
  ExplanationTextContainer: {
    borderRadius: 10,
    padding: 10,
    
  },
  ExampleTextContainer: {
    backgroundColor: "black",
    borderRadius: 10,
    padding: 10,
  },
  ExampleContainer: {
    paddingVertical: 5,
  },
  ExampleText: {
    fontSize: 17
  },
  ExplanationText: {
    fontSize: 18
  },
  SignUpButton: {
    backgroundColor: Colors.SECONDARY,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    marginTop: 20,
    width: 250,

},
elevation: {
  elevation: 20,
  
},

})