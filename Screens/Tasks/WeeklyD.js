import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { getQuestions, getStudentInfo, updateIsPaid, updateScore } from '../../hooks/Index'
import { useNavigation, useRoute } from '@react-navigation/native';
import ContentHtml from '../Grades/Topics/ContentHtml';
import Colors from '../../hooks/Colors';
import { TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AnswerContainer from '../Components/AnswerContainer';
import { AntDesign } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';
import { ScoreContext } from '../../Context/Score';



const WeeklyD = () => {
  const params = useRoute().params;
  const data = params?.data;
  const width = Dimensions.get("screen").width;
  const [score, setScore] = useState(0);
  const height = Dimensions.get('screen').height;
  const {isLoaded, isSignedIn, user} = useUser();
  const {scores, setScores} = useContext(ScoreContext);
  const navigation = useNavigation();

  const updateScores = () => {
    console.log("score before ", score)
    updateScore(user?.primaryEmailAddress.emailAddress, score).then(resp =>{
        console.log("updating score", resp.publishStudent.score);
        setScores(resp.publishStudent.score);
        
    }
    )
    navigation.goBack();
  }
  const getInfo = () => {
    getStudentInfo(user?.primaryEmailAddress.emailAddress).then(resp =>{
        setScore(resp.student.score+score);

    }
    )
  }

  useEffect (()=>{
    getInfo();
  }, [2]);
 
  return (
    <View>
      <View style={{width: "100%", alignItems: "center", padding: 10}}>
        <Text style={{fontSize: 20, fontWeight: "500"}}>{params.title}</Text>
      </View>
      <FlatList
      data={data}
      keyExtractor={item => item?.id}
      renderItem={({ item }) => (
        <View >
          <View style={[styles.Question]}>
          <ContentHtml sourceC={item?.question?.html} />
          </View>
          <AnswerContainer answerSubmit={item?.answer} solution={item?.questionSolution?.html} score={score} setScore={setScore}/>
          
        </View>
      )}
    
    />
    <TouchableOpacity onPress={()=>updateScores()} style={[styles.finish, {marginTop: height * 0.85, marginLeft: width * 0.8,}]}>
    <AntDesign name="check" size={38} color="white" padding={15}/>
    </TouchableOpacity>
    </View>
  )
}

export default WeeklyD

const styles = StyleSheet.create({
  Question: {
    paddingHorizontal: 20,
    width: "100%"
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
  finish: {
    position: "absolute", 
    backgroundColor: Colors.SECONDARY, 
    alignItems: "center", 
    justifyContent: "center", 
    borderRadius: 99,
  }
})