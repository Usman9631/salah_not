import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import BackHeader from '../components/BackHeader';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import SoundButton from '../components/SoundButton';
import { RFValue } from 'react-native-responsive-fontsize';

const alarmTimeOptions = [
  'Fajr Adhan',
  'Fajr Iqamah',
  'Custom Time',
];

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
  'Makkah Adhan': require('../assets/sounds/adhan1.mp3'),
  'Medina Adhan': require('../assets/sounds/adhan1.mp3'),
  'Custom Sound 1': require('../assets/sounds/adhan1.mp3'),
  'Custom Sound 2': require('../assets/sounds/adhan1.mp3'),
  'Custom Sound 3': require('../assets/sounds/adhan1.mp3'),
};

export default function FajrWakeUpAlarmScreen({ navigation }: { navigation: any }) {
  const [enabled, setEnabled] = useState(false);
  const [alarmTimeModal, setAlarmTimeModal] = useState(false);
  const [selectedAlarmTime, setSelectedAlarmTime] = useState('Fajr Adhan');
  const [minsModal, setMinsModal] = useState(false);
  const [minsBefore, setMinsBefore] = useState('10');
  const [soundModal, setSoundModal] = useState(false);
  const [selectedSound, setSelectedSound] = useState('Default Adhan');
  const [playingSound, setPlayingSound] = useState(false);

  const [testOverlayVisible, setTestOverlayVisible] = useState(false);
  const soundObjectRef = useRef<Audio.Sound | null>(null);

  const disabled = !enabled;

  // Alarm sound test logic
  const onTestAlarm = async () => {
    if (disabled) return;
    try {
      if (soundObjectRef.current) {
        await soundObjectRef.current.stopAsync();
        await soundObjectRef.current.unloadAsync();
        soundObjectRef.current = null;
      }
      const fileOrUri = soundFiles[selectedSound];
      const { sound } = await Audio.Sound.createAsync(
        fileOrUri,
        { shouldPlay: true }
      );
      soundObjectRef.current = sound;
      setPlayingSound(true);
      setTestOverlayVisible(true);
      sound.setOnPlaybackStatusUpdate(async (status) => {
        if ((status as any).didJustFinish) {
          await closeTestOverlay();
        }
      });
    } catch (error) {
      setPlayingSound(false);
      setTestOverlayVisible(false);
      console.log('Error playing sound:', error);
    }
  };

  const closeTestOverlay = async () => {
    setTestOverlayVisible(false);
    setPlayingSound(false);
    try {
      if (soundObjectRef.current) {
        await soundObjectRef.current.stopAsync();
        await soundObjectRef.current.unloadAsync();
        soundObjectRef.current = null;
      }
    } catch (e) {
      console.log('Error stopping sound:', e);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <BackHeader title="Fajr Wake Up Alarm" onBack={() => navigation.goBack()} />
      <View style={styles.container}>
        {/* Enable Toggle */}
        <View style={styles.toggleContainer}>
          <Text style={styles.text}>Enable wake up alarm</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#7b8728' }}
            thumbColor={enabled ? '#a7bd32' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => setEnabled(prev => !prev)}
            value={enabled}
          />
        </View>

        {/* Alarm Time */}
        <TouchableOpacity
          style={[styles.soundButton, disabled && styles.disabledContainer]}
          onPress={() => !disabled && setAlarmTimeModal(true)}
          disabled={disabled}
        >
          <View>
            <Text style={[styles.soundButtonText, disabled && { color: '#999' }]}>Alarm Time</Text>
            <Text style={{
              color: disabled ? '#999' : '#9a9999',
              fontSize : RFValue(13),
              fontFamily: 'Roboto-Regular'
            }}>
              {selectedAlarmTime}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Mins before alarm time */}
        <TouchableOpacity
          style={[styles.soundButton, disabled && styles.disabledContainer]}
          onPress={() => !disabled && setMinsModal(true)}
          disabled={disabled}
        >
          <View>
            <Text style={[styles.soundButtonText, disabled && { color: '#999' }]}>Mins before alarm time</Text>
            <Text style={{
              color: disabled ? '#999' : '#9a9999',
              fontSize : RFValue(13),
              fontFamily: 'Roboto-Regular'
            }}>
              {minsBefore} min(s)
            </Text>
          </View>
        </TouchableOpacity>

        {/* Select Adhan Sound */}
        <SoundButton
          label="Alarm Sound"
          selectedSound={selectedSound}
          onPress={() => !disabled && setSoundModal(true)}
          styles={{
            ...styles,
            soundButton: [
              styles.soundButton,
              disabled && styles.disabledContainer
            ],
            soundButtonText: [
              styles.soundButtonText,
              disabled && { color: '#999' }
            ]
          }}
          disabled={disabled}
        />

        {/* Test Fajr Alarm */}
        <TouchableOpacity
          style={[styles.soundButton, { marginTop: -10, marginBottom: 10 }, disabled && styles.disabledContainer]}
          onPress={onTestAlarm}
          disabled={disabled}
        >
          <Text style={[styles.soundButtonText, { color: '#a7bd32' }, disabled && { color: '#999' }]}>Test Fajr Alarm</Text>
        </TouchableOpacity>

        {/* Alarm Time Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={alarmTimeModal}
          onRequestClose={() => setAlarmTimeModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeading}>Select Time for Fajr</Text>
              <ScrollView style={styles.scrollView}>
                {alarmTimeOptions.map((option, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.soundOption,
                      selectedAlarmTime === option && styles.selectedOption,
                      { flexDirection: 'row', alignItems: 'center' }
                    ]}
                    onPress={() => {
                      setSelectedAlarmTime(option);
                      setAlarmTimeModal(false);
                    }}
                  >
                    {selectedAlarmTime === option ? (
                      <Ionicons name="checkmark" size={20} color="#a7bd32" style={styles.selectionIcon} />
                    ) : (
                      <View style={{ width: 20, marginRight: 8 }} />
                    )}
                    <Text
                      style={[
                        styles.soundOptionText,
                        selectedAlarmTime === option && styles.selectedOptionText
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Pressable style={styles.cancelButton} onPress={() => setAlarmTimeModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Mins Before Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={minsModal}
          onRequestClose={() => setMinsModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeading}>Minutes before alarm time</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#a7bd32',
                  borderRadius: 8,
                  color: '#000000',
                  fontSize : RFValue(13),
                  padding: 10,
                  marginVertical: 20,
                  fontFamily: 'Roboto-Regular',
                  backgroundColor: '#f9f9f9'
                }}
                keyboardType="numeric"
                value={minsBefore}
                onChangeText={setMinsBefore}
                placeholder="Enter minutes"
                placeholderTextColor="#888"
              />
              <Pressable style={styles.cancelButton} onPress={() => setMinsModal(false)}>
                <Text style={styles.cancelButtonText}>Done</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Sound Picker Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={soundModal}
          onRequestClose={() => setSoundModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeading}>Select Alarm Sound</Text>
              <ScrollView style={styles.scrollView}>
                {soundOptions.map((sound, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.soundOption,
                      selectedSound === sound && styles.selectedOption,
                      { flexDirection: 'row', alignItems: 'center' }
                    ]}
                    onPress={() => {
                      setSelectedSound(sound);
                      setSoundModal(false);
                    }}
                  >
                    {selectedSound === sound ? (
                      <Ionicons name="checkmark" size={20} color="#a7bd32" style={styles.selectionIcon} />
                    ) : (
                      <View style={{ width: 20, marginRight: 8 }} />
                    )}
                    <Text
                      style={[
                        styles.soundOptionText,
                        selectedSound === sound && styles.selectedOptionText
                      ]}
                    >
                      {sound}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Pressable style={styles.cancelButton} onPress={() => setSoundModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Test Sound Overlay */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={testOverlayVisible}
          onRequestClose={closeTestOverlay}
        >
          <View style={styles.testOverlay}>
            <View style={styles.testOverlayContent}>
              <Text style={styles.testOverlayTitle}>
                Playing {selectedSound}
              </Text>
              <TouchableOpacity
                onPress={closeTestOverlay}
                style={styles.testOverlayButton}
              >
                <Ionicons name="stop-circle-outline" size={48} color="#a7bd32" />
                <Text style={styles.testOverlayButtonText}>Stop</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
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
    backgroundColor: '#eaf3c3', // Use a valid ViewStyle property
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
  testOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  testOverlayContent: {
    backgroundColor: '#f9f9f9',
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    width: '80%',
  },
  testOverlayTitle: {
    fontSize : RFValue(13),
    fontWeight: 'bold',
    color: '#a7bd32',
    marginBottom: 20,
    fontFamily: 'Roboto-Regular',
  },
  testOverlayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  testOverlayButtonText: {
    color: '#a7bd32',
    fontSize : RFValue(13),
    marginLeft: 10,
    fontFamily: 'Roboto-Regular',
  },
});