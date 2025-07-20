import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Modal, TextInput } from 'react-native';
import BackHeader from '../components/BackHeader';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';

export default function SilentSettingsScreen({ navigation }: { navigation: any }) {
  const [autoSilent, setAutoSilent] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [relativeTo, setRelativeTo] = useState('Adhan');
  const [relativeToModal, setRelativeToModal] = useState(false);

  const [minutesBefore, setMinutesBefore] = useState('5');
  const [minutesBeforeModal, setMinutesBeforeModal] = useState(false);

  const [minutesAfter, setMinutesAfter] = useState('10');
  const [minutesAfterModal, setMinutesAfterModal] = useState(false);

  const disabled = !autoSilent;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <BackHeader title="Silent Settings" onBack={() => navigation.goBack()} />
      <View style={styles.container}>

        {/* Switch to silent profile automatically */}
        <View style={styles.toggleContainer}>
          <Text style={styles.text}>Switch to silent profile automatically</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#7b8728' }}
            thumbColor={autoSilent ? '#a7bd32' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={setAutoSilent}
            value={autoSilent}
          />
        </View>

        {/* Notification toggle */}
        <View style={[styles.toggleContainer, disabled && styles.disabledContainer]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.text, disabled && styles.disabledText]}>Notification</Text>
            <Text style={[styles.description, disabled && styles.disabledText]}>Show notification when profile is switched</Text>
          </View>
          <Switch
            trackColor={{ false: '#767577', true: '#7b8728' }}
            thumbColor={showNotification && !disabled ? '#a7bd32' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={value => {
              if (!disabled) setShowNotification(value);
            }}
            value={showNotification && !disabled}
            disabled={disabled}
          />
        </View>

        {/* Start Silent mode relative to */}
        <TouchableOpacity
          style={[
            styles.soundButton,
            disabled && styles.disabledContainer
          ]}
          onPress={() => !disabled && setRelativeToModal(true)}
          disabled={disabled}
        >
          <View>
            <Text style={[styles.soundButtonText, disabled && styles.disabledText]}>Start Silent mode relative to</Text>
            <Text style={[styles.buttonValue, disabled && styles.disabledText]}>{relativeTo}</Text>
          </View>
        </TouchableOpacity>
        <Modal
          visible={relativeToModal}
          transparent
          animationType="slide"
          onRequestClose={() => setRelativeToModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeading}>Start Silent mode relative to</Text>
              <TouchableOpacity
                style={styles.soundOption}
                onPress={() => { setRelativeTo('Adhan'); setRelativeToModal(false); }}
              >
                <Text style={[
                  styles.soundOptionText,
                  relativeTo === 'Adhan' && styles.selectedOptionText
                ]}>Adhan</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.soundOption}
                onPress={() => { setRelativeTo('Iqamah'); setRelativeToModal(false); }}
              >
                <Text style={[
                  styles.soundOptionText,
                  relativeTo === 'Iqamah' && styles.selectedOptionText
                ]}>Iqamah</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setRelativeToModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Minutes before Iqamah to put mobile to silent mode */}
        <TouchableOpacity
          style={[
            styles.soundButton,
            disabled && styles.disabledContainer
          ]}
          onPress={() => !disabled && setMinutesBeforeModal(true)}
          disabled={disabled}
        >
          <View>
            <Text style={[styles.soundButtonText, disabled && styles.disabledText]}>Minutes before Iqamah to put mobile to silent mode</Text>
            <Text style={[styles.buttonValue, disabled && styles.disabledText]}>{minutesBefore} min</Text>
          </View>
        </TouchableOpacity>
        <Modal
          visible={minutesBeforeModal}
          transparent
          animationType="slide"
          onRequestClose={() => setMinutesBeforeModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeading}>Minutes before Iqamah to put mobile to silent mode</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={minutesBefore}
                onChangeText={setMinutesBefore}
                placeholder="Enter minutes"
                placeholderTextColor="#888"
              />
              <TouchableOpacity style={styles.cancelButton} onPress={() => setMinutesBeforeModal(false)}>
                <Text style={styles.cancelButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Minutes to revert to normal mode after Iqamah */}
        <TouchableOpacity
          style={[
            styles.soundButton,
            disabled && styles.disabledContainer
          ]}
          onPress={() => !disabled && setMinutesAfterModal(true)}
          disabled={disabled}
        >
          <View>
            <Text style={[styles.soundButtonText, disabled && styles.disabledText]}>Minutes to revert to normal mode after Iqamah</Text>
            <Text style={[styles.buttonValue, disabled && styles.disabledText]}>{minutesAfter} min</Text>
          </View>
        </TouchableOpacity>
        <Modal
          visible={minutesAfterModal}
          transparent
          animationType="slide"
          onRequestClose={() => setMinutesAfterModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeading}>Minutes to revert to normal mode after Iqamah</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={minutesAfter}
                onChangeText={setMinutesAfter}
                placeholder="Enter minutes"
                placeholderTextColor="#888"
              />
              <TouchableOpacity style={styles.cancelButton} onPress={() => setMinutesAfterModal(false)}>
                <Text style={styles.cancelButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    justifyContent: 'space-between',
  },
  text: {
    color: '#000000',
    fontSize : RFValue(13),
    fontFamily: 'Roboto-Regular',
    flex: 1,
    flexWrap: 'wrap',
  },
  description: {
    color: '#aaa',
    fontSize : RFValue(12),
    fontFamily: 'Roboto-Regular',
    marginTop: 2,
  },
  soundButton: {
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  soundButtonText: {
    color: '#000000',
    fontSize : RFValue(13),
    fontFamily: 'Roboto-Regular',
  },
  buttonValue: {
    color: '#a7bd32',
    fontSize : RFValue(13),
    fontFamily: 'Roboto-Bold',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 24,
    alignItems: 'stretch',
  },
  modalHeading: {
   fontSize : RFValue(14),
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 18,
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
  },
  soundOption: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  soundOptionText: {
    fontSize : RFValue(13),
    color: '#000000',
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
  },
  selectedOptionText: {
    color: '#a7bd32',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#ffffff',
    color: '#000000',
    borderRadius: 8,
    padding: 12,
    fontSize : RFValue(12),
    fontFamily: 'Roboto-Regular',
    marginBottom: 18,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#a7bd32',
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'flex-end',
  },
  cancelButtonText: {
    color: '#a7bd32',
    fontSize : RFValue(13),
    fontFamily: 'Roboto-Regular',
  },
  disabledContainer: {
    opacity: 0.5,
  },
  disabledText: {
     color: '#999',
  },
});