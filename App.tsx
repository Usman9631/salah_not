// File: App.tsx

import React, { useEffect, useState, ComponentProps } from 'react';
import { View, StyleSheet } from 'react-native';
import * as Font from 'expo-font';

import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MasjidProvider } from './context/MasjidContext';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import HomeStack from './screens/HomeStack';
import LiveStreamingScreen from './screens/LiveStreamingScreen';
import Dashboard from './screens/DashboardScreen';
import FavouriteMasajidScreen from './screens/FavouriteMasajidScreen';
import RemindersScreen from './screens/RemindersScreen';
import SettingsStack from './screens/SettingsStack';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: '#ffffff',
          height: 85 + insets.bottom,
          borderTopWidth: 1,
          borderTopColor: '#d9d9d9',
          elevation: 12,
          paddingTop: 10,
          paddingBottom: 10 + insets.bottom,
        },
        tabBarActiveTintColor: '#a7bd32',
        tabBarInactiveTintColor: '#000000',
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: 'Roboto-Regular',
          paddingBottom: 5,
        },
        tabBarIcon: ({ color, size }) => {
          // Ab iconName ko sahi union type mil rahi hai:
          let iconName: ComponentProps<typeof Ionicons>['name'];

          switch (route.name) {
            case 'Home':
              iconName = 'home-outline';
              break;
            case 'Favourite Masajid':
              iconName = 'heart-outline';
              break;
            case 'Reminders':
              iconName = 'notifications-outline';
              break;
            case 'Settings':
              iconName = 'settings-outline';
              break;
            case 'Live Streaming':
              iconName = 'videocam-outline';
              break;
            default:
              iconName = 'ellipse-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Favourite Masajid" component={FavouriteMasajidScreen} />
      <Tab.Screen name="Reminders" component={RemindersScreen} />
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Settings" component={SettingsStack} />
      <Tab.Screen name="Live Streaming" component={LiveStreamingScreen} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { isLoggedIn, hasAccount } = useAuth();

  // Allow access to main app without login
  // Login will only be required for donations and favorites
  return <MainTabs />;
}

async function registerForPushNotificationsAsync() {
  let token;
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return null;
  }
  token = (await Notifications.getExpoPushTokenAsync()).data;
  return token;
}

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      'Roboto-Regular': require('./assets/fonts/Roboto/Roboto-Regular.ttf'),
      'Roboto-Bold': require('./assets/fonts/Roboto/Roboto-Bold.ttf'),
    }).then(() => setFontsLoaded(true));
  }, []);

  useEffect(() => {
    async function setupPushNotifications() {
      console.log('🔧 Starting push notification setup...');
      const token = await registerForPushNotificationsAsync();
      console.log('📱 Push token received:', token);
      
      if (token) {
        try {
          const backendUrl = Constants.expoConfig?.extra?.BACKEND_API_URL || '';
          console.log('🌐 Backend URL:', backendUrl);
          console.log('📤 Registering token with backend...');
          
          const response = await fetch(`${backendUrl}/api/register-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
          });
          
          console.log('📥 Backend response status:', response.status);
          const data = await response.json();
          console.log('📥 Backend response data:', data);
          
          if (data.success) {
            console.log('✅ Push token registered successfully!');
            alert('Push token registered successfully!');
          } else {
            console.log('❌ Failed to register push token:', data.message);
            alert('Failed to register push token.');
          }
        } catch (err) {
          console.log('❌ Error registering push token:', err);
          alert('Error registering push token.');
        }
      } else {
        console.log('❌ No push token received');
      }
    }
    setupPushNotifications();
  }, []);

  if (!fontsLoaded) return <View />;

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <MasjidProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <RootNavigator />
          </NavigationContainer>
        </MasjidProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  appName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 1,
    fontFamily: 'Roboto-Bold',
  },
});
