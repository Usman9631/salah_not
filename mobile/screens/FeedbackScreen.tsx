import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ScrollView, Alert } from 'react-native';
import BackHeader from '../components/BackHeader';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';

const feedbackTypes = ['Suggestion', 'Complaint', 'Bug'];

export default function FeedbackScreen({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState('');
  const [type, setType] = useState(feedbackTypes[0]);
  const [typeModal, setTypeModal] = useState(false);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (!email || !comment) {
      Alert.alert('Please fill in your email and comments.');
      return;
    }
    // Here you would send feedback to your backend or email service.
    Alert.alert('Thank you for your feedback!');
    setEmail('');
    setComment('');
    setType(feedbackTypes[0]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <BackHeader title="Feedback" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Email Input */}
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Feedback Type Selector */}
        <TouchableOpacity
          style={styles.selector}
          onPress={() => setTypeModal(true)}
        >
          <Text style={styles.selectorText}>{type}</Text>
          <Ionicons name="chevron-down" size={20} color="#aaa" />
        </TouchableOpacity>

        {/* Modal for feedback type */}
        <Modal
          visible={typeModal}
          transparent
          animationType="fade"
          onRequestClose={() => setTypeModal(false)}
        >
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setTypeModal(false)}>
            <View style={styles.modalContent}>
              {feedbackTypes.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={styles.modalOption}
                  onPress={() => {
                    setType(t);
                    setTypeModal(false);
                  }}
                >
                  <Text style={[
                    styles.modalOptionText,
                    t === type && styles.selectedOptionText
                  ]}>
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Comments */}
        <Text style={styles.commentsTitle}>Comments</Text>
        <View style={styles.commentsContainer}>
          <TextInput
            style={styles.commentsInput}
            placeholder="Type your comments here..."
            placeholderTextColor="#aaa"
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 32,
    backgroundColor: '#ffffff',
    flexGrow: 1,
    alignItems: 'center',
  },
  heading: {
    fontSize: 22,
    color: '#000000',
    fontFamily: 'Roboto-Bold',
    marginBottom: 28,
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    padding: 14,
    fontSize : RFValue(16),
    marginBottom: 18,
    color: '#000000',
    backgroundColor: '#ffffff',
    fontFamily: 'Roboto-Regular',
  },
  selector: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    padding: 14,
    marginBottom: 18,
    backgroundColor: '#f9f9f9',
    justifyContent: 'space-between',
  },
  selectorText: {
    fontSize : RFValue(16),
    color: '#000000',
    fontFamily: 'Roboto-Regular',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    width: 260,
    elevation: 5,
  },
  modalOption: {
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalOptionText: {
    fontSize : RFValue(16),
    color: '#000000',
    fontFamily: 'Roboto-Regular',
  },
  selectedOptionText: {
    color: '#a7bd32',
    fontWeight: 'bold',
    fontFamily: 'Roboto-Bold',
  },
  commentsTitle: {
    fontSize : RFValue(16),
    color: '#000000',
    fontFamily: 'Roboto-Bold',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  commentsContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    marginBottom: 24,
    padding: 4,
  },
  commentsInput: {
    minHeight: 80,
    fontSize : RFValue(13),
    color: '#000000',
    fontFamily: 'Roboto-Regular',
    padding: 8,
  },
  submitButton: {
    width: '100%',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#a7bd32',
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
    },
});