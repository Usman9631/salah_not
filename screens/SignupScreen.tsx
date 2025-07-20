import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { RFValue } from 'react-native-responsive-fontsize';
import Constants from 'expo-constants';

const BACKEND_API_URL = Constants.expoConfig?.extra?.BACKEND_API_URL;

const SignupScreen = () => {
  const { completeSignup, logout } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          address,
          phoneNumber,
          password,
          confirmPassword,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Signup Successful', 'Account created! You can now log in.');
        completeSignup(); // Show login screen or handle navigation
      } else {
        Alert.alert('Signup Failed', data.message || 'Signup error');
      }
    } catch (err) {
      Alert.alert('Network Error', 'Unable to connect to server');
    }
    setLoading(false);
  };

  const goToLogin = () => logout();

  return (
    <ImageBackground source={require('../assets/images/LSBack.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>
        <View style={styles.inputCard}>
          <TextInput placeholder="Name" style={styles.input} value={name} onChangeText={setName} />
          <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />
          <TextInput placeholder="Address" style={styles.input} value={address} onChangeText={setAddress} />
          <TextInput placeholder="Phone Number" style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" />
          <TextInput placeholder="Password" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
          <TextInput placeholder="Confirm Password" style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
          <TouchableOpacity style={styles.loginButton} onPress={handleSignup} disabled={loading}>
            <Text style={styles.loginButtonText}>{loading ? 'Signing Up...' : 'Sign Up'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.link} onPress={goToLogin}>Already have an account?</Text>
      </View>
    </ImageBackground>
  );
};

// styles code same as before...
const styles = StyleSheet.create({
  background: { 
    flex: 1, 
    resizeMode: 'cover', 
    justifyContent: 'center' 
  },
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 24, 
    backgroundColor: '#303800ca', 
    borderRadius: 12 
  },
  title: { 
    fontSize : RFValue(18),
    marginBottom: 24,
    textAlign: 'center',
    marginHorizontal: 20,
    fontFamily: 'Roboto-Bold',
    color: '#ffffff',
    marginVertical: 20,
  },
  input: { 
    borderBottomWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 12, 
    padding: 5,
    marginBottom: 14 ,
    marginHorizontal: 27,
    fontFamily: 'Roboto-Regular',
    backgroundColor: '#ffffff',
    marginVertical: 12,
  },
  link: { 
    color: '#ffffff', 
    marginTop: 16, 
    textAlign: 'center', 
  },
  inputCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 20,
    padding: 2,
    marginBottom: 20,
    marginTop: 0,
    paddingTop: 10,
  },
  loginButton: {
    backgroundColor: '#a7bd32',
    borderRadius: 18,
    paddingVertical: 5,
    marginHorizontal: 16,
    marginTop: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize : RFValue(18),
    fontWeight: 'bold',
    fontFamily: 'Roboto-Bold',
  },
});

export default SignupScreen;
