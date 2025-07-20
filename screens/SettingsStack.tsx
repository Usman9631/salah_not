import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SettingsScreen from './SettingsScreen';
import AdhanSoundSettingsScreen from './AdhanSoundSettingsScreen';
import IqamahSoundSettingsScreen from './IqamahSoundSettingsScreen';
import OtherSettingsScreen from './OtherSettingsScreen';
import SilentSettingsScreen from './SilentSettingsScreen';
import RemindersSettingsScreen from './RemindersSettingsScreen';
import FajrWakeUpAlarmScreen from './FajrWakeUpAlarmScreen';

const Stack = createStackNavigator();

export default function SettingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingHome" component={SettingsScreen} />
      <Stack.Screen
        name="AdhanSoundSettings"
        component={AdhanSoundSettingsScreen}
        options={{
          animation: 'fade',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="IqamahSoundSettings"
        component={IqamahSoundSettingsScreen}
        options={{
          animation: 'fade',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="SilentSettings"
        component={SilentSettingsScreen}
        options={{
          animation: 'fade',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="RemindersSettings"
        component={RemindersSettingsScreen}
        options={{
          animation: 'fade',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="FajrWakeUpAlarmSettings"
        component={FajrWakeUpAlarmScreen}
        options={{
          animation: 'fade',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="OtherSettings"
        component={OtherSettingsScreen}
        options={{
          animation: 'fade',
          presentation: 'card',
        }}
      />
    </Stack.Navigator>
  );
}