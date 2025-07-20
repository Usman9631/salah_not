import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MessageCenterScreen from './MessageCenterScreen';

export type MessageCenterStackParamList = {
  MessageCenterHome: undefined;
  // Add more screens here if needed
};

const Stack = createStackNavigator<MessageCenterStackParamList>();

export default function MessageCenterStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MessageCenterHome" component={MessageCenterScreen} />
      {/* Add more screens related to Message Center here if needed */}
    </Stack.Navigator>
    );
}