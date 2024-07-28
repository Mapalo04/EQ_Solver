import { Dimensions, FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import Colors from '../../../hooks/Colors';
import * as Progress from 'react-native-progress';
import RenderHTML from 'react-native-render-html';
import ContentHtml from './ContentHtml';
import SolutionR from './SolutionR';
import { getStudentInfo, updateScore } from '../../../hooks/Index';
import { useUser } from '@clerk/clerk-expo';
import { ScoreContext } from '../../../Context/Score';
import { PaidContext } from '../../../Context/Paid';

const Tab = createMaterialTopTabNavigator()

const TopicContent = () => {
    const params = useRoute().params;
    const orientation = Dimensions.get('window').width;
    const orientationh = Dimensions.get('window').height;
    const navigation = useNavigation();
    const [isFinished, setIsFinished] = useState(false);
    const {isLoaded, isSignedIn, user} = useUser();
    const {scores, setScores} = useContext(ScoreContext);
    const [score, setScore] = useState(0);
    let ContentRef;
    

    const data = params.content;


    const updateScores = () => {
      console.log("score before ", score)
      updateScore(user?.primaryEmailAddress.emailAddress, score + (5*data.length)).then(resp =>{
          console.log("updating score", resp.publishStudent.score);
          setScores(resp.publishStudent.score);
      }
      )
      navigation.goBack();
    }
    const getInfo = () => {
      getStudentInfo(user?.primaryEmailAddress.emailAddress).then(resp =>{
          console.log("theee score ", resp.student.score)
          setScore(resp.student.score);
  
      }
      )
    }
  
    useEffect (()=>{
      getInfo();
    }, [3]);

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
          
          <SolutionR solution={item?.example2?.markdown}/>
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
        <Text style={{textAlign: "center", lineHeight: 25, fontSize: 17}}>{"Get your points 🔥🙌"} </Text>
        
        <View style={{width: "80%", alignItems: "center", justifyContent: "center", flexDirection: "row"}}>

          <TouchableOpacity onPress={()=> updateScores()} style={[styles.SignUpButton, {width: "70%"}]}>
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