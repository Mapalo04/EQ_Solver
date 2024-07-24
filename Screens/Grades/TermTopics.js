import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import TopicLists from './Topics/TopicLists'
import { useRoute } from '@react-navigation/native'
import { ScrollView } from 'react-native'
import Header from '../Header'

const TermTopics = () => {
    const params = useRoute().params
    const [searchText, setSearchText] = useState("");

  return (
    <>
    <Header searchText={searchText} setSearchText={setSearchText} />
    <ScrollView style={{padding: 10}}>
      <View style={styles.Container}>
        <Text style={styles.TermTitle}>Term One</Text>
        <TopicLists grade={params.grade} term={"Term1"} searchText={searchText}/>
      </View>
      <View style={styles.Container}>
        <Text style={styles.TermTitle}>Term Two</Text>
        <TopicLists grade={params.grade} term={"Term2"} searchText={searchText}/>
      </View>
      <View style={styles.Container}>
        <Text style={styles.TermTitle}>Term Three</Text>
        <TopicLists grade={params.grade} term={"Term3"} searchText={searchText}/>
      </View>
    </ScrollView>
    </>
  )
}

export default TermTopics

const styles = StyleSheet.create({
    Container: {
        paddingVertical: 20
    },
    TermTitle: {
        padding: 5,
        fontWeight: "bold",
        fontSize: 20
    }
})