import { StyleSheet, Text, View, Image, ScrollView, FlatList, Dimensions, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from '../hooks/Colors'
import { useUser } from '@clerk/clerk-expo'
import { gql, useQuery } from '@apollo/client'
import { leaderBoardInfo } from '../hooks/Index'
import { useIsFocused } from '@react-navigation/native'



const LeaderBoard = () => {
    const {isLoaded, user} = useUser();
    const widthW = Dimensions.get('screen').width;
    const [leaderBoardData, setLeaderBoardData] = useState([])
    const isFocused =useIsFocused();
    
    useEffect(()=>{
      updateLeaderBoard()
    }, [isFocused])
    const updateLeaderBoard = () => {
      leaderBoardInfo().then(resp => {
        resp&&setLeaderBoardData(resp.students);
        /* console.log("respons...", resp) */
      }).catch((err)=>{
        console.log(err)
      })
    
  }

 

  
 /*  console.log("hiii ", leaderBoardData) */
  return (
    <View >
      <SafeAreaView style={[styles.MainContainer, {width: widthW}]}>
    <View style={{paddingHorizontal: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
      <View style={{alignItems: "center", width:"100%"}}>
        <Text style={{fontWeight: "bold", padding: 20, fontSize: 20}}>LEADERBOARD</Text>
        <Text style={{color: "white"}}>Check how your friends are doing</Text>
      </View>
      
    </View>
    </SafeAreaView>
    <View style={{height: "82.5%"}}>
      <FlatList
      data={leaderBoardData}
      keyExtractor={item => item.id}
      renderItem={({ item, index }) => (
    <View style={{alignItems: "center", paddingTop: 10, width: widthW * 0.99, }} >
      <View style={[{borderRadius: 3}, styles.Position, styles.elevation]}>
        <View style={styles.PlayerInfo}>
            <Text style={styles.number}>{index+1}. </Text>
            <Image style={{width: 50, height: 50, borderRadius: 99}} source={{uri: item.profilePic}} resizeMode='contain' />
            <Text> {item?.fullName}</Text>
        </View>
        <Text style={{fontWeight: "500"}}>{item?.score}</Text>
        </View>
    </View>
    )}
    showsVerticalScrollIndicator={false}
    refreshing={true}
    refreshControl={""}
    />
    </View>
    </View>
  )
}

export default LeaderBoard

const styles = StyleSheet.create({
  MainContainer: {
    paddingVertical: 20,
    backgroundColor: Colors.PRIMARY,
},
    Position: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 8,
        width: "95%",
        alignItems: "center",
        
    },
    number: {
        fontWeight: "900",
        fontSize: 20,
    },
    PlayerInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    elevation: {
          backgroundColor: 'white',
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 0},
          shadowOpacity: 0.1,
          shadowRadius: 5,
        
      },
})