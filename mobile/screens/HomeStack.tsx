import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Dashboard from './DashboardScreen';
import TodaysPrayerScreen from './TodaysPrayerScreen';
import UserProfileScreen from './UserProfileScreen';
import SelectionScreen from './SelectionScreen';
import MasjidProfileScreen from './MasjidProfileScreen';

export type HomeStackParamList = {
  Dashboard: undefined;
  TodaysPrayer: undefined;
  UserProfileScreen: undefined;
  SelectionScreen: undefined;
  MasjidProfile: { masjid: any };
};

const Stack = createStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen
        name="TodaysPrayer"
        component={TodaysPrayerScreen}
        options={{ title: "Today's Prayers" }}
      />
      <Stack.Screen
        name="UserProfileScreen"
        component={UserProfileScreen}
        options={{ title: "Profile" }}
      />
      <Stack.Screen
        name="SelectionScreen"
        component={SelectionScreen}
        options={{ title: 'Select Masjid' }}
      />
      <Stack.Screen
        name="MasjidProfile"
        component={MasjidProfileScreen}
        options={{ title: 'Masjid Profile', headerShown: false }}
      />
    </Stack.Navigator>
    );
}