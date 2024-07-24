import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ProgressBar = () => {
    const widthW = Dimensions.get('screen').width
  return (
    <View style={{width: width}}>
      <Text>ProgressBar</Text>
    </View>
  )
}

export default ProgressBar

const styles = StyleSheet.create({})