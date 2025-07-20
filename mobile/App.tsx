// File: App.tsx

import React, { useEffect, useState, ComponentProps, useRef } from 'react';
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
  console.log('🔐 Starting permission check...');
  let token;
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  console.log('📋 Existing permission status:', existingStatus);
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    console.log('🔐 Requesting permissions...');
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
    console.log('📋 New permission status:', finalStatus);
  }
  if (finalStatus !== 'granted') {
    console.log('❌ Permission denied');
    alert('Failed to get push token for push notification!');
    return null;
  }
  console.log('✅ Permission granted, getting token...');
  try {
    // Use Expo's push notification service without projectId
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('🎫 Token received:', token ? token.substring(0, 20) + '...' : 'null');
    return token;
  } catch (error) {
    console.log('❌ Error getting token:', error);
    return null;
  }
}

export default function App() {
  console.log('🚀 App component mounted - TEST');
  alert('🚀 App component is loading!'); // Test if component is loading
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  console.log('🚀 App component mounted');

  useEffect(() => {
    console.log('🔄 Loading fonts...');
    Font.loadAsync({
      'Roboto-Regular': require('./assets/fonts/Roboto/Roboto-Regular.ttf'),
      'Roboto-Bold': require('./assets/fonts/Roboto/Roboto-Bold.ttf'),
    }).then(() => {
      console.log('✅ Fonts loaded successfully');
      setFontsLoaded(true);
    }).catch((error) => {
      console.log('❌ Font loading error:', error);
      setFontsLoaded(true); // Continue anyway
    });
  }, []);

  const sendTestNotification = async (token: string) => {
    try {
      const backendUrl = Constants.expoConfig?.extra?.BACKEND_API_URL || '';
      console.log('🧪 Sending test notification...');
      
      const response = await fetch(`${backendUrl}/api/notifications/send-notification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: '🎉 Success!',
          body: 'Push notification is working!'
        }),
      });
      
      const data = await response.json();
      console.log('🧪 Test notification response:', data);
      
      if (data.success) {
        alert('🎉 Test notification sent! Check your device for the notification!');
      }
    } catch (error) {
      console.log('❌ Error sending test notification:', error);
    }
  };

  const tryRegisterPushToken = async () => {
    console.log(`🔄 Attempt ${retryCount + 1} to register push token...`);
    
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
          alert('✅ Push token registered successfully! Token: ' + token.substring(0, 20) + '...');
          
          // Send test notification automatically
          await sendTestNotification(token);
        } else {
          console.log('❌ Failed to register push token:', data.message);
          alert('❌ Failed to register push token: ' + data.message);
          scheduleRetry();
        }
      } catch (err) {
        console.log('❌ Error registering push token:', err);
        alert('❌ Error registering push token: ' + err);
        scheduleRetry();
      }
    } else {
      console.log('❌ No push token received');
      alert('❌ No push token received - retrying in 10 seconds...');
      scheduleRetry();
    }
  };

  const scheduleRetry = () => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    
    const delay = Math.min(10000 * (retryCount + 1), 60000); // Max 60 seconds
    console.log(`⏰ Scheduling retry in ${delay/1000} seconds...`);
    
    retryTimeoutRef.current = setTimeout(() => {
      setRetryCount(prev => prev + 1);
      tryRegisterPushToken();
    }, delay);
  };

  useEffect(() => {
    console.log('📱 Fonts loaded state:', fontsLoaded);
    if (!fontsLoaded) return; // Wait for fonts to load first
    
    console.log('🔧 Starting push notification setup...');
    alert('🔧 Starting push notification setup...'); // Add visible alert
    
    tryRegisterPushToken();

    // Cleanup on unmount
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [fontsLoaded]); // Run when fonts are loaded

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
