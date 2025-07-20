import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
} from 'react-native';
import BackHeader from '../components/BackHeader';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

import SoundButton from '../components/SoundButton';
import VolumeSlider from '../components/VolumeSlider';
import TestSoundOverlay from '../components/TestSoundOverlay';
import AdhanSoundPickerModal from '../components/AdhanSoundPickerModal';
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

type AdhanSoundSettingsScreenProps = {
  navigation: any;
};

export default function AdhanSoundSettingsScreen({ navigation }: AdhanSoundSettingsScreenProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [playingSound, setPlayingSound] = useState<string | null>(null);

  const [selectedAdhanSound, setSelectedAdhanSound] = useState('Default Adhan');
  const [selectedFajrSound, setSelectedFajrSound]   = useState('Default Adhan');
  const [activePicker, setActivePicker] = useState<'adhan' | 'fajr' | null>(null);
  const [useDeviceVolume, setUseDeviceVolume] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const [testOverlayVisible, setTestOverlayVisible] = useState(false);
  const [testingSoundType, setTestingSoundType] = useState<'adhan' | 'fajr' | null>(null);

  // Keep a ref to the sound object so we can stop/unload it
  const soundObjectRef = useRef<Audio.Sound | null>(null);

  const disabled = !isEnabled;

  const onTestSoundPress = async (type: 'adhan' | 'fajr') => {
    if (disabled) return;
    const label = type === 'adhan' ? selectedAdhanSound : selectedFajrSound;
    if (!label) {
      alert(`Please select a ${type === 'adhan' ? 'Adhan' : 'Fajr Adhan'} sound first.`);
      return;
    }

    try {
      // Stop and unload any previous sound
      if (soundObjectRef.current) {
        await soundObjectRef.current.unloadAsync();
        soundObjectRef.current = null;
      }

      const fileOrUri = soundFiles[label];
      const { sound } = await Audio.Sound.createAsync(
        fileOrUri,
        { shouldPlay: true, volume: useDeviceVolume ? 1.0 : volume }
      );
      soundObjectRef.current = sound;
      setTestingSoundType(type);
      setTestOverlayVisible(true);

      sound.setOnPlaybackStatusUpdate((status) => {
        if ((status as any).didJustFinish) {
          closeTestOverlay();
        }
      });
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  const closeTestOverlay = async () => {
    setTestOverlayVisible(false);
    setTestingSoundType(null);
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

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const openModal = (type: 'adhan' | 'fajr') => {
    if (disabled) return;
    setActivePicker(type);
    setModalVisible(true);
  };

  const closeModal = () => {
    setPlayingSound(null);
    setModalVisible(false);
  };

  const selectSound = (sound: string) => {
    if (activePicker === 'adhan') {
      setSelectedAdhanSound(sound);
    } else if (activePicker === 'fajr') {
      setSelectedFajrSound(sound);
    }
    closeModal();
  };

  const togglePlay = async (sound: string) => {
    if (disabled) return;
    // Stop any currently playing sound
    if (soundObjectRef.current) {
      await soundObjectRef.current.stopAsync();
      await soundObjectRef.current.unloadAsync();
      soundObjectRef.current = null;
      setPlayingSound(null);
    }
    // Play new sound if not already playing
    if (playingSound !== sound) {
      try {
        const fileOrUri = soundFiles[sound];
        const { sound: newSound } = await Audio.Sound.createAsync(
          fileOrUri,
          { shouldPlay: true, volume: useDeviceVolume ? 1.0 : volume }
        );
        soundObjectRef.current = newSound;
        setPlayingSound(sound);
        newSound.setOnPlaybackStatusUpdate((status) => {
          if ((status as any).didJustFinish) {
            setPlayingSound(null);
            soundObjectRef.current && soundObjectRef.current.unloadAsync();
            soundObjectRef.current = null;
          }
        });
      } catch (error) {
        console.log('Error playing sound:', error);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <BackHeader title="Adhan Sound" onBack={() => navigation.goBack()} />
      <View style={styles.container}>
        <View style={styles.toggleContainer}>
          <Text style={styles.text}>Play sound at Adhan time</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#7b8728' }}
            thumbColor={isEnabled ? '#a7bd32' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>

        {/* Adhan Sound */}
        <SoundButton
          label="Adhan sound"
          selectedSound={selectedAdhanSound}
          onPress={() => openModal('adhan')}
          styles={{
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
        <TouchableOpacity
          style={[
            styles.soundButton,
            { marginTop: -10, marginBottom: 10 },
            disabled && styles.disabledContainer
          ]}
          onPress={() => onTestSoundPress('adhan')}
          disabled={disabled}
        >
          <Text style={[
            styles.soundButtonText,
            { color: '#a7bd32' },
            disabled && { color: '#999' }
          ]}>Test Adhan Sound</Text>
        </TouchableOpacity>

        {/* Fajr Adhan Sound */}
        <SoundButton
          label="Fajr Adhan sound"
          selectedSound={selectedFajrSound}
          onPress={() => openModal('fajr')}
          styles={{
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
        <TouchableOpacity
          style={[
            styles.soundButton,
            { marginTop: -10, marginBottom: 10 },
            disabled && styles.disabledContainer
          ]}
          onPress={() => onTestSoundPress('fajr')}
          disabled={disabled}
        >
          <Text style={[
            styles.soundButtonText,
            { color: '#a7bd32' },
            disabled && { color: '#999' }
          ]}>Test Fajr Sound</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.checkboxContainer,
            disabled && styles.disabledContainer
          ]}
          onPress={() => !disabled && setUseDeviceVolume(prev => !prev)}
          disabled={disabled}
        >
          <Text style={[
            styles.checkboxLabel,
            disabled && { color: '#999' }
          ]}>Use device media volume</Text>
          <Ionicons
            name={useDeviceVolume ? 'checkbox-outline' : 'square-outline'}
            size={24}
            color={disabled ? '#999' : '#a7bd32'}
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>

        <VolumeSlider
          volume={volume}
          setVolume={setVolume}
          useDeviceVolume={useDeviceVolume || disabled}
          styles={{
            soundButton: styles.sliderContainer,
            text: styles.text,
            volumeValue: styles.volumeValue,
            disabledContainer: styles.disabledContainer,
          }}
          disabled={disabled}
        />

        {/* Test Sound Overlay Modal */}
        <TestSoundOverlay
          visible={testOverlayVisible}
          onClose={closeTestOverlay}
          testingSoundType={(testingSoundType ?? 'adhan')}
          selectedAdhanSound={selectedAdhanSound}
          selectedFajrSound={selectedFajrSound}
          styles={{
            testOverlay: styles.testOverlay,
            testOverlayContent: styles.testOverlayContent,
            testOverlayTitle: styles.testOverlayTitle,
            testOverlayButton: styles.testOverlayButton,
            testOverlayButtonText: styles.testOverlayButtonText,
          }}
        />

        {/* Modal */}
        <AdhanSoundPickerModal
          visible={modalVisible}
          onClose={closeModal}
          soundOptions={soundOptions}
          activePicker={(activePicker ?? 'adhan')}
          selectedAdhanSound={selectedAdhanSound}
          selectedFajrSound={selectedFajrSound}
          playingSound={playingSound}
          selectSound={disabled ? () => {} : selectSound}
          togglePlay={disabled ? () => {} : togglePlay}
          styles={{
            modalOverlay: styles.modalOverlay,
            modalContent: styles.modalContent,
            modalHeading: styles.modalHeading,
            scrollView: styles.scrollView,
            soundOptionRow: styles.soundOptionRow,
            soundOption: styles.soundOption,
            selectedOption: { backgroundColor: '#eaf3c3' }, // <-- FIX: Use a valid ViewStyle
            selectionIcon: styles.selectionIcon,
            soundOptionText: styles.soundOptionText,
            selectedOptionText: styles.selectedOptionText,
            playButton: styles.playButton,
            cancelButton: styles.cancelButton,
            cancelButtonText: styles.cancelButtonText,
          }}
        />
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
    fontSize : RFValue(14),
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
    fontSize : RFValue(14),
    fontFamily: 'Roboto-Regular',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#f9f9f9f9',
    borderRadius: 12,
    maxHeight: '70%',
    padding: 20,
  },
  modalHeading: {
    fontSize : RFValue(15),
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
    fontFamily: 'Roboto-Regular',
  },
  scrollView: {
    marginBottom: 20,
  },
  soundOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  soundOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  // selectedOption: {
  //   color: '#a7bd32', // <-- REMOVE THIS, not valid for ViewStyle
  // },
  soundOptionText: {
    fontSize : RFValue(14),
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
  playButton: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'flex-end',
  },
  cancelButtonText: {
    color: '#a7bd32',
    fontSize : RFValue(14),
    fontFamily: 'Roboto-Regular',
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 10,
    marginBottom: 20,
  },
  checkboxLabel: {
    color: '#000000',
    fontSize : RFValue(14),
    fontFamily: 'Roboto-Regular',
  },
  sliderContainer: {
    marginTop: -10,
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  volumeValue: {
    textAlign: 'right',
    color: '#a7a5a5',
    fontSize : RFValue(14),
    fontFamily: 'Roboto-Regular',
  },
  disabledVolumeText: {
    color: "#979797"
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
    fontSize : RFValue(15),
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
    fontSize : RFValue(14),
    marginLeft: 10,
    fontFamily: 'Roboto-Regular',
  },
  disabledContainer: {
    opacity: 0.5,
  },
});