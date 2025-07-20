import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { RFValue } from 'react-native-responsive-fontsize';
import Constants from 'expo-constants';

const BACKEND_API_URL = Constants.expoConfig?.extra?.BACKEND_API_URL;

const LoginScreen = ({ navigation }: { navigation: any }) => {
  const { login, startSignup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;``
    }
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log('LOGIN API RESPONSE:', data);
      if (response.ok) {
        login(data.user); // Pass user data to login
        // navigation nahi lagana, context RootNavigator sab kuch handle karega
      } else {
        Alert.alert('Login Failed', data.message || 'Invalid email or password');
      }
    } catch (err) {
      Alert.alert('Network Error', 'Unable to connect to server');
    }
    setLoading(false);
  };

  const goToSignup = () => {
    // Navigate directly to signup screen
    if (navigation && navigation.navigate) {
      navigation.navigate('SignupScreen');
    }
  };

  return (
    <ImageBackground source={require('../assets/images/LSBack.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <View style={styles.inputCard}>
          <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />
          <TextInput placeholder="Password" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
            <Text style={styles.loginButtonText}>{loading ? 'Logging in...' : 'Login'}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={goToSignup} style={styles.signupLinkContainer}>
          <Text style={styles.signupLinkText}>Don't have an account? </Text>
          <Text style={styles.signupLinkBold}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: 'cover', justifyContent: 'center' },
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#303800ca', borderRadius: 12 },
  title: { fontSize: RFValue(18), marginBottom: 24, textAlign: 'center', marginHorizontal: 20, fontFamily: 'Roboto-Bold', color: '#ffffff', marginVertical: 20 },
  input: { borderBottomWidth: 1, borderColor: '#ccc', borderRadius: 12, padding: 5, marginBottom: 14, marginHorizontal: 27, fontFamily: 'Roboto-Regular', backgroundColor: '#ffffff', marginVertical: 12 },
  link: { color: '#ffffff', marginTop: 16, textAlign: 'center' },
  inputCard: { backgroundColor: '#ffffff', borderRadius: 12, marginHorizontal: 20, padding: 2, marginBottom: 20, marginTop: 0, paddingTop: 10 },
  loginButton: { backgroundColor: '#a7bd32', borderRadius: 18, paddingVertical: 5, marginHorizontal: 16, marginTop: 10, alignItems: 'center', marginBottom: 20 },
  loginButtonText: { color: '#fff', fontSize: RFValue(18), fontWeight: 'bold', fontFamily: 'Roboto-Bold' },
  signupLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  signupLinkText: {
    color: '#ffffff',
    fontSize: RFValue(16),
    fontFamily: 'Roboto-Regular',
  },
  signupLinkBold: {
    color: '#ffffff',
    fontSize: RFValue(16),
    fontWeight: 'bold',
    fontFamily: 'Roboto-Bold',
  },
});

export default LoginScreen;
