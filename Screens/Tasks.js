import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Weekly from './Tasks/Weekly'
import Monthly from './Tasks/Monthly'
import Tests from './Tasks/Tests'

const Tab = createMaterialTopTabNavigator()
const Tasks = () => {
  

  return (
    <Tab.Navigator>
      <Tab.Screen name='Weekly' component={Weekly} options={{
      }}></Tab.Screen>
      <Tab.Screen name='Monthly' component={Monthly}></Tab.Screen>
      <Tab.Screen name='Tests' component={Tests}></Tab.Screen>
    </Tab.Navigator>
  )
}

export default Tasks

const styles = StyleSheet.create({})