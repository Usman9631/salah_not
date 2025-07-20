import { View, Text, StyleSheet, Switch, TouchableOpacity, Modal, ScrollView } from 'react-native';
import React, { useState, useRef } from 'react';
import BackHeader from '../components/BackHeader';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import { RFValue } from 'react-native-responsive-fontsize';

const soundOptions = [
  'Default Adhan',
  'Makkah Adhan',
  'Medina Adhan',
  'Custom Sound 1',
  'Custom Sound 2',
  'Custom Sound 3',
];

const soundFiles: Record<string, any> = {
  'Default Adhan': require('../assets/sounds/adhan1.mp3'),
  'Makkah Adhan':   require('../assets/sounds/adhan1.mp3'),
  'Medina Adhan':   require('../assets/sounds/adhan1.mp3'),
  'Custom Sound 1': require('../assets/sounds/adhan1.mp3'),
  'Custom Sound 2': require('../assets/sounds/adhan1.mp3'),
  'Custom Sound 3': require('../assets/sounds/adhan1.mp3'),
};

export default function RemindersSettingsScreen({ navigation }: { navigation: any }) {
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [vibrateOnReminder, setVibrateOnReminder] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReminderSound, setSelectedReminderSound] = useState('Default Adhan');
  const [playingSound, setPlayingSound] = useState(false);

  const soundObjectRef = useRef<Audio.Sound | null>(null);
  const disabled = !reminderEnabled;

  // Play adhan sound
  const playAdhanSound = async () => {
    try {
      if (soundObjectRef.current) {
        await soundObjectRef.current.stopAsync();
        await soundObjectRef.current.unloadAsync();
        soundObjectRef.current = null;
      }
      const fileOrUri = soundFiles[selectedReminderSound];
      const { sound } = await Audio.Sound.createAsync(
        fileOrUri,
        { shouldPlay: true }
      );
      soundObjectRef.current = sound;
      setPlayingSound(true);
      sound.setOnPlaybackStatusUpdate(async (status: any) => {
        if (status.didJustFinish) {
          setPlayingSound(false);
          if (soundObjectRef.current) {
            await soundObjectRef.current.unloadAsync();
            soundObjectRef.current = null;
          }
        }
      });
    } catch (error) {
      setPlayingSound(false);
      console.log('Error playing adhan sound:', error);
    }
  };

  // Stop adhan sound
  const stopAdhanSound = async () => {
    try {
      if (soundObjectRef.current) {
        await soundObjectRef.current.stopAsync();
        await soundObjectRef.current.unloadAsync();
        soundObjectRef.current = null;
      }
      setPlayingSound(false);
    } catch (e) {
      setPlayingSound(false);
      console.log('Error stopping adhan sound:', e);
    }
  };

  // Vibrate logic
  const handleVibrate = () => {
    if (vibrateOnReminder && !disabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  // Reminder Sound Modal logic
  const openModal = () => {
    if (disabled) return;
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const selectSound = (sound: string) => {
    setSelectedReminderSound(sound);
    closeModal();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <BackHeader title="Reminders" onBack={() => navigation.goBack()} />
      <View style={{ flex: 1, padding: 16 }}>
        {/* Enable Reminders Toggle */}
        <View style={styles.toggleContainer}>
          <Text style={styles.text}>Enable Reminders</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#7b8728' }}
            thumbColor={reminderEnabled ? '#a7bd32' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={setReminderEnabled}
            value={reminderEnabled}
          />
        </View>

        {/* Vibrate on Reminder Toggle */}
        <View style={[styles.toggleContainer, disabled && styles.disabledContainer]}>
          <Text style={[styles.text, disabled && { color: '#999' }]}>Vibrate on Reminder</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#7b8728' }}
            thumbColor={vibrateOnReminder && !disabled ? '#a7bd32' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={setVibrateOnReminder}
            value={vibrateOnReminder && !disabled}
            disabled={disabled}
          />
        </View>

        {/* Reminder Sound Button */}
        <TouchableOpacity
          style={[styles.soundButton, disabled && styles.disabledContainer]}
          onPress={openModal}
          disabled={disabled}
        >
          <View>
            <Text style={[styles.soundButtonText, disabled && { color: '#999' }]}>Reminder Sound</Text>
            <Text style={{
              color: disabled ? '#999' : '#9a9999',
              fontSize : RFValue(13),
              fontFamily: 'Roboto-Regular'
            }}>
              {selectedReminderSound ? selectedReminderSound : 'Select Sound'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Test Reminder Button */}
        <TouchableOpacity
          style={[
            styles.soundButton,
            { marginTop: -10, marginBottom: 10 },
            disabled && styles.disabledContainer,
            playingSound && { backgroundColor: '#f9f9f9' }
          ]}
          onPress={async () => {
            if (disabled) return;
            if (playingSound) {
              await stopAdhanSound();
            } else {
              handleVibrate();
              await playAdhanSound();
            }
          }}
          disabled={disabled}
        >
          <Text style={[
            styles.soundButtonText,
            { color: playingSound ? '#e74c3c' : '#a7bd32' },
            disabled && { color: '#999' }
          ]}>
            {playingSound ? 'Stop Reminder' : 'Test Reminder'}
          </Text>
        </TouchableOpacity>

        {/* Modal for selecting sound */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeading}>Select Sound</Text>
              <ScrollView style={styles.scrollView}>
                {soundOptions.map((sound, index) => {
                  const isSelected = selectedReminderSound === sound;
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.soundOption,
                        isSelected && styles.selectedOption,
                        { flexDirection: 'row', alignItems: 'center' },
                        disabled && styles.disabledContainer
                      ]}
                      onPress={() => !disabled && selectSound(sound)}
                      disabled={disabled}
                    >
                      {isSelected ? (
                        <Ionicons name="checkmark" size={20} color={disabled ? "#999" : "#a7bd32"} style={styles.selectionIcon} />
                      ) : (
                        <View style={{ width: 20, marginRight: 8 }} />
                      )}
                      <Text
                        style={[
                          styles.soundOptionText,
                          isSelected && styles.selectedOptionText,
                          disabled && { color: '#999' }
                        ]}
                      >
                        {sound}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
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
  heading: {
    fontSize : RFValue(13),
    color: '#000000',
    marginBottom: 18,
    textAlign: 'center',
    fontFamily: 'Roboto-Bold',
  },
  reminderItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 18,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  prayerName: {
    fontSize : RFValue(13),
    color: '#000000',
    fontFamily: 'Roboto-Bold',
  },
  arabic: {
    fontSize : RFValue(13),
    color: '#000000',
    marginLeft: 8,
    fontFamily: 'Roboto-Regular',
  },
  adhanTime: {
    fontSize : RFValue(13),
    color: '#000000',
    fontFamily: 'Roboto-Regular',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  text: {
    color: '#000000',
    fontSize : RFValue(13),
    fontFamily: 'Roboto-Regular',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    maxHeight: '70%',
    padding: 20,
  },
  modalHeading: {
    fontSize : RFValue(14),
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
    fontFamily: 'Roboto-Regular',
  },
  scrollView: {
    marginBottom: 20,
  },
  soundOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  selectedOption: {
    backgroundColor: '#eaf3c3',
  },
  soundOptionText: {
    fontSize : RFValue(13),
    color: '#000000',
    fontFamily: 'Roboto-Regular',
  },
  selectedOptionText: {
    fontWeight: 'bold',
    color: '#a7bd32',
    fontFamily: 'Roboto-Regular',
  },
  selectionIcon: {
    marginRight: 8,
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
});