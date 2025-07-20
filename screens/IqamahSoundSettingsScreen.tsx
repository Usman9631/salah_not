import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Modal, ScrollView, Pressable } from 'react-native';
import BackHeader from '../components/BackHeader';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import SoundButton from '../components/SoundButton';
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

type IqamahSoundSettingsScreenProps = {
  navigation: any;
};

export default function IqamahSoundSettingsScreen({ navigation }: IqamahSoundSettingsScreenProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [playingSound, setPlayingSound] = useState<string | null>(null);

  const [selectedIqamahSound, setSelectedIqamahSound] = useState('Default Adhan');
  const [useDeviceVolume, setUseDeviceVolume] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const [testOverlayVisible, setTestOverlayVisible] = useState(false);

  const soundObjectRef = useRef<Audio.Sound | null>(null);

  const disabled = !isEnabled;

  const onTestSoundPress = async () => {
    if (disabled) return;
    const label = selectedIqamahSound;
    if (!label) {
      alert('Please select an Iqamah sound first.');
      return;
    }
    try {
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

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setPlayingSound(null);
    setModalVisible(false);
  };

  const selectSound = (sound: string) => {
    setSelectedIqamahSound(sound);
    closeModal();
  };

  const togglePlay = async (sound: string) => {
    if (disabled) return;
    if (soundObjectRef.current) {
      await soundObjectRef.current.stopAsync();
      await soundObjectRef.current.unloadAsync();
      soundObjectRef.current = null;
      setPlayingSound(null);
    }
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
      <BackHeader title="Iqamah Sound" onBack={() => navigation.goBack()} />
      <View style={styles.container}>
        <View style={styles.toggleContainer}>
          <Text style={styles.text}>Play sound at Iqamah time</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#7b8728' }}
            thumbColor={isEnabled ? '#a7bd32' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => setIsEnabled(prev => !prev)}
            value={isEnabled}
          />
        </View>

        {/* Iqamah Sound (never disabled) */}
        <SoundButton
          label="Iqamah sound"
          selectedSound={selectedIqamahSound}
          onPress={openModal}
          styles={styles}
          disabled={disabled}
        />

        {/* Everything else is disabled and greyed out if !isEnabled */}
        <View style={disabled ? styles.disabledSection : undefined}>
          <TouchableOpacity
            style={[styles.soundButton, { marginTop: -10, marginBottom: 10 }]}
            onPress={onTestSoundPress}
            disabled={disabled}
          >
            <Text style={[styles.soundButtonText, { color: disabled ? '#999' : '#a7bd32' }]}>Test Iqamah Sound</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => !disabled && setUseDeviceVolume(prev => !prev)}
            disabled={disabled}
          >
            <Text style={[styles.checkboxLabel, disabled && { color: '#999' }]}>Use device media volume</Text>
            <Ionicons
              name={useDeviceVolume ? 'checkbox-outline' : 'square-outline'}
              size={24}
              color={disabled ? '#999' : '#a7bd32'}
              style={{ marginRight: 10 }}
            />
          </TouchableOpacity>

          {/* Volume Slider */}
          <View style={[styles.soundButton, (useDeviceVolume || disabled) && styles.disabledContainer]}>
            <Text style={[styles.text, (useDeviceVolume || disabled) && { color: '#999' }]}>Volume</Text>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor={useDeviceVolume || disabled ? '#ccc' : '#a7bd32'}
              maximumTrackTintColor={useDeviceVolume || disabled ? '#ddd' : '#888'}
              thumbTintColor={useDeviceVolume || disabled ? '#bbb' : '#a7bd32'}
              value={volume}
              onValueChange={setVolume}
              disabled={useDeviceVolume || disabled}
            />
            <Text style={[styles.volumeValue, (useDeviceVolume || disabled) && { color: '#999' }]}>
              {Math.round(volume * 100)}%
            </Text>
          </View>
        </View>

        {/* Test Sound Overlay Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={testOverlayVisible}
          onRequestClose={closeTestOverlay}
        >
          <View style={styles.testOverlay}>
            <View style={styles.testOverlayContent}>
              <Text style={styles.testOverlayTitle}>
                Playing {selectedIqamahSound}
              </Text>
              <TouchableOpacity
                onPress={async () => { await closeTestOverlay(); }}
                style={styles.testOverlayButton}
              >
                <Ionicons name="stop-circle-outline" size={48} color="#a7bd32" />
                <Text style={styles.testOverlayButtonText}>Stop</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal */}
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
                  const isSelected = selectedIqamahSound === sound;
                  const isPlaying = playingSound === sound;
                  return (
                    <View key={index} style={styles.soundOptionRow}>
                      <TouchableOpacity
                        style={[
                          styles.soundOption,
                          isSelected && styles.selectedOption,
                          { flex: 1, flexDirection: 'row', alignItems: 'center' }
                        ]}
                        onPress={() => selectSound(sound)}
                        disabled={false}
                      >
                        {isSelected ? (
                          <Ionicons name="checkmark" size={20} color="#a7bd32" style={styles.selectionIcon} />
                        ) : (
                          <View style={{ width: 20, marginRight: 8 }} />
                        )}
                        <Text
                          style={[
                            styles.soundOptionText,
                            isSelected && styles.selectedOptionText
                          ]}
                        >
                          {sound}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.playButton}
                        onPress={() => togglePlay(sound)}
                        disabled={false}
                      >
                        {isPlaying ? (
                          <Ionicons name="stop-circle-outline" size={28} color="#a7bd32" />
                        ) : (
                          <Ionicons name="play-circle-outline" size={28} color="#a7bd32" />
                        )}
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </ScrollView>
              <Pressable style={styles.cancelButton} onPress={closeModal}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
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
    backgroundColor: '#ffffff',
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
  selectedOption: {
    backgroundColor: '#eaf3c3',
  },
  soundOptionText: {
    fontSize : RFValue(13),
    color: '#110f0f',
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
    fontSize : RFValue(13),
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
    fontSize : RFValue(13),
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
    fontSize : RFValue(13),
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
    backgroundColor: '#ffffff',
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    width: '80%',
  },
  testOverlayTitle: {
    fontSize: 20,
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
    fontSize: 18,
    marginLeft: 10,
    fontFamily: 'Roboto-Regular',
  },
  disabledSection: {
    opacity: 0.5,
    pointerEvents: 'none',
  },
  disabledContainer: {
    opacity: 0.5,
  },
});