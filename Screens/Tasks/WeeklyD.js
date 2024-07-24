import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getQuestions } from '../../hooks/Index'
import { useRoute } from '@react-navigation/native';
import ContentHtml from '../Grades/Topics/ContentHtml';
import Colors from '../../hooks/Colors';
import { AntDesign } from '@expo/vector-icons';
import { TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';


const WeeklyD = () => {
  const params = useRoute().params;
  const data = params?.data;
  const width = Dimensions.get("screen").width;
  const [revealSolution, setRevealSolution] = useState(false);


  const Answer = ({answerSubmit}) => {
    const [answer, setAnswer] = useState("");
    const [hideAnswer, setHideAnswer] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [tries, setTries] = useState(1);
    const wrongColors = ["#FF8815", "#FF380A"]
    console.log(answer);


    const checkAnswer = (Answer) => {
      console.log("outside,  ",String(Answer), "    ", answerSubmit)

      if (String(Answer).trim() == answerSubmit){
        setIsCorrect(true)
        setHideAnswer(true)
        console.log("answer is ", answer);
      }
      if (tries >= 3){
        setIsCorrect(false)
        setHideAnswer(true)
      }
      setTries(tries + 1)
    }

    return(
    <View>
      {hideAnswer && <View style={{paddingHorizontal: 20}}>
        {isCorrect && <View >
        <MaterialCommunityIcons name="sticker-check-outline" size={34} color="green" /></View>}
        {!isCorrect && <MaterialCommunityIcons name="sticker-remove-outline" size={34} color="red" />}
      </View>}
      
    {!hideAnswer && <View style={{width: width, paddingHorizontal: 50, flexDirection: "row", justifyContent:"center"}}>
      
            <TextInput style={{width: "80%"}} label={"answer"}
            value={answer}
            onChangeText={(answer) => setAnswer(answer)}
            ></TextInput>
            <View style={{padding: 10}}>
            <TouchableOpacity onPress={() => checkAnswer(answer)} style={{backgroundColor: Colors.PRIMARY, justifyContent: "center", padding: 10, borderRadius: 20}}><Text style={{color: "white"}}>Submit</Text></TouchableOpacity>
            </View>
            </View>}
            {(tries > 1 && tries < 4) && <View style={{padding: 20, width: "100%", alignItems: "center"}}>
        <Text style={{color: wrongColors[tries-2]}}>Try Again</Text></View>}
    </View>
    )
  }
 


  return (
    <View>
      <View style={{width: "100%", alignItems: "center", padding: 10}}>
        <Text style={{fontSize: 20, fontWeight: "500"}}>{params.title}</Text>
      </View>
      <FlatList
      data={data}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View >
          <View style={styles.Question}>
          <ContentHtml sourceC={item?.question?.html} />
          </View>
          <Answer answerSubmit={item?.answer}/>
          <View style={{width: "100%", padding: 10}}>
          <TouchableOpacity onPress={()=> setRevealSolution(!revealSolution)} style={[styles.SignUpButton, {width: 100, paddingVertical: 5, borderRadius: 8}]}>
            <Text style={{color: Colors.WHITE, fontSize: 14, textAlign: "left"}}>solution <AntDesign name="play" size={15} color="white" /></Text>
          </TouchableOpacity>
          </View>
          
          {revealSolution && <View style={[styles.Question, { width: width}]}>
            <View style={{padding: 10, backgroundColor: "grey", borderRadius: 8}}>
          <ContentHtml sourceC={item?.questionSolution?.html} />

          
          <Text>{item?.answer}</Text>
          </View>
          </View>}
        </View>
      )}
    
    />
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
})