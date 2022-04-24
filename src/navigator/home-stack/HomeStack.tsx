import { createStackNavigator } from '@react-navigation/stack'
import React  from 'react'
import { WebViewPage } from '../../screens'
import { DiscussionRoomDetailScreen } from '../../screens/discussions/DiscussionRoomDetailScreen'
import { EventDetailScreen } from '../../screens/event-detail'

const Stack = createStackNavigator()

const homeStack = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}
    >
      <Stack.Screen name = {'EventDetailScreen'} component = {EventDetailScreen}/>
      <Stack.Screen name = {'DiscussionDetailScreen'} component = {DiscussionRoomDetailScreen}/>
      <Stack.Screen name = {'WebViewPage'} component = {WebViewPage} />

    </Stack.Navigator>
  )
}

export {
  homeStack
}