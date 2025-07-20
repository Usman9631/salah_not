import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Modal, Pressable, ScrollView } from 'react-native';
import BackHeader from '../components/BackHeader';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import VolumeSlider from '../components/VolumeSlider';
import { RFValue } from 'react-native-responsive-fontsize';

const turnOffMobileSound = require('../assets/sounds/adhan1.mp3'); // Replace with your actual sound

export default function OtherSettingsScreen({ navigation }: { navigation: any }) {
  // Main toggles
  const [autoStart, setAutoStart] = useState(false);
  const [awakeDevice, setAwakeDevice] = useState(false);

  // Turn-Off-Mobile sound
  const [turnOffMobileModal, setTurnOffMobileModal] = useState(false);
  const [playTurnOffMobileSound, setPlayTurnOffMobileSound] = useState(false);
  const [useDeviceVolume, setUseDeviceVolume] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [testPlaying, setTestPlaying] = useState(false);

  const soundObjectRef = useRef<Audio.Sound | null>(null);

  const disabled = !playTurnOffMobileSound;

  // Test sound logic
  const onTestSound = async () => {
    if (disabled) return;
    try {
      if (soundObjectRef.current) {
        await soundObjectRef.current.stopAsync();
        await soundObjectRef.current.unloadAsync();
        soundObjectRef.current = null;
      }
      const { sound } = await Audio.Sound.createAsync(
        turnOffMobileSound,
        { shouldPlay: true, volume: useDeviceVolume ? 1.0 : volume }
      );
      soundObjectRef.current = sound;
      setTestPlaying(true);
      sound.setOnPlaybackStatusUpdate(async (status) => {
        if ((status as any).didJustFinish) {
          await stopTestSound();
        }
      });
    } catch (error) {
      setTestPlaying(false);
      console.log('Error playing sound:', error);
    }
  };

  const stopTestSound = async () => {
    setTestPlaying(false);
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
      <BackHeader title="Other Settings" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Auto Start */}
        <View style={styles.toggleContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.text}>Auto Start</Text>
            <Text style={styles.desc}>Auto start application on reboot</Text>
          </View>
          <Switch
            trackColor={{ false: '#767577', true: '#7b8728' }}
            thumbColor={autoStart ? '#a7bd32' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => setAutoStart(prev => !prev)}
            value={autoStart}
          />
        </View>

        {/* Awake Device */}
        <View style={styles.toggleContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.text}>Awake Device</Text>
            <Text style={styles.desc}>
              Keep device awake when app is running. Do not turn ON on mobile phones as it will drain your battery.
            </Text>
          </View>
          <Switch
            trackColor={{ false: '#767577', true: '#7b8728' }}
            thumbColor={awakeDevice ? '#a7bd32' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => setAwakeDevice(prev => !prev)}
            value={awakeDevice}
          />
        </View>

        {/* Turn-Off-Mobile Sound */}
        <TouchableOpacity
          style={styles.soundButton}
          onPress={() => setTurnOffMobileModal(true)}
        >
          <View>
            <Text style={styles.soundButtonText}>Turn Off Mobile sound</Text>
            <Text style={styles.desc}>
              Sound is played 45 secs before Adhan and Iqamah as reminders to turn off mobile in masjid.
            </Text>
            <Text style={{
              color: playTurnOffMobileSound ? '#a7bd32' : '#999',
              fontSize : RFValue(13),
              marginTop: 6,
              fontFamily: 'Roboto-Regular'
            }}>
              Status: {playTurnOffMobileSound ? 'Enabled' : 'Disabled'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Disable Battery Optimization */}
        <TouchableOpacity
          style={styles.soundButton}
          onPress={() => {
            // Add your logic here to open battery optimization settings
          }}
        >
          <View>
            <Text style={styles.soundButtonText}>Disable battery optimization</Text>
            <Text style={styles.desc}>
              If you are not getting timely reminders and adhan then disable battery optimization for this app
            </Text>
          </View>
        </TouchableOpacity>

        {/* Allow Overlay */}
        <TouchableOpacity
          style={styles.soundButton}
          onPress={() => {
            // Add your logic here to open overlay permission settings
          }}
        >
          <View>
            <Text style={styles.soundButtonText}>Allow overlay</Text>
            <Text style={styles.desc}>
              If adhan is not showing in locked state of the device then allow this app to draw over other apps
            </Text>
          </View>
        </TouchableOpacity>

        {/* Manage Masjid */}
        <TouchableOpacity
          style={styles.soundButton}
          onPress={() => {
            // Add your logic here to navigate to manage masjid screen
          }}
        >
          <View>
            <Text style={styles.soundButtonText}>Manage Masjid</Text>
            <Text style={styles.desc}>
              Control Panel to manage your masjid data
            </Text>
          </View>
        </TouchableOpacity>

        {/* Modal for Turn-Off-Mobile Sound */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={turnOffMobileModal}
          onRequestClose={() => setTurnOffMobileModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeading}>Turn-Off-Mobile Sound</Text>
              {/* Play sound toggle */}
              <View style={styles.toggleContainer}>
                <Text style={styles.text}>Play sound</Text>
                <Switch
                  trackColor={{ false: '#767577', true: '#7b8728' }}
                  thumbColor={playTurnOffMobileSound ? '#a7bd32' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => setPlayTurnOffMobileSound(prev => !prev)}
                  value={playTurnOffMobileSound}
                />
              </View>

              {/* Use device media volume */}
              <TouchableOpacity
                style={[styles.checkboxContainer, !playTurnOffMobileSound && styles.disabledContainer]}
                onPress={() => playTurnOffMobileSound && setUseDeviceVolume(prev => !prev)}
                disabled={!playTurnOffMobileSound}
              >
                <Text style={[styles.checkboxLabel, !playTurnOffMobileSound && { color: '#999' }]}>
                  Use device media volume
                </Text>
                <Ionicons
                  name={useDeviceVolume ? 'checkbox-outline' : 'square-outline'}
                  size={24}
                  color={!playTurnOffMobileSound ? '#999' : '#a7bd32'}
                  style={{ marginRight: 10 }}
                />
              </TouchableOpacity>

              {/* Volume Slider (component) */}
              <VolumeSlider
                volume={volume}
                setVolume={setVolume}
                useDeviceVolume={useDeviceVolume || !playTurnOffMobileSound}
                styles={styles}
              />

              {/* Test Sound */}
              <TouchableOpacity
                style={[
                  styles.soundButton,
                  (!playTurnOffMobileSound) && styles.disabledContainer
                ]}
                onPress={onTestSound}
                disabled={!playTurnOffMobileSound}
              >
                <Text style={[
                  styles.soundButtonText,
                  { color: '#a7bd32' },
                  (!playTurnOffMobileSound) && { color: '#999' }
                ]}>
                  Test Turn-Off-Mobile Sound
                </Text>
              </TouchableOpacity>

              {/* Overlay to stop adhan while playing */}
              {testPlaying && (
                <View style={styles.overlay}>
                  <View style={styles.overlayContent}>
                    <Text style={styles.overlayTitle}>Playing Turn-Off-Mobile Sound</Text>
                    <TouchableOpacity
                      onPress={stopTestSound}
                      style={styles.overlayStopButton}
                    >
                      <Ionicons name="stop-circle-outline" size={48} color="#a7bd32" />
                      <Text style={styles.overlayStopButtonText}>Stop</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <Pressable style={styles.cancelButton} onPress={() => setTurnOffMobileModal(false)}>
                <Text style={styles.cancelButtonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    backgroundColor: '#ffffff',
    flexGrow: 1,
  },
  text: {
    color: '#000000',
    fontSize : RFValue(13),
    fontFamily: 'Roboto-Regular',
  },
  desc: {
    color: '#aaa',
    fontSize:  RFValue(13),
    marginTop: 2,
    fontFamily: 'Roboto-Regular',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginVertical: 16,
  },
  soundButton: {
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 20,
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 16,
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
    maxHeight: '80%',
    padding: 20,
  },
  modalHeading: {
    fontSize : RFValue(14),
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
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
  volumeValue: {
    textAlign: 'right',
    color: '#a7a5a5',
    fontSize : RFValue(13),
    fontFamily: 'Roboto-Regular',
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
  overlay: {
    position: 'absolute',
    left: 0, right: 0, top: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  overlayContent: {
    backgroundColor: '#f9f9f9',
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    width: '80%',
  },
  overlayTitle: {
    fontSize : RFValue(14),
    fontWeight: 'bold',
    color: '#a7bd32',
    marginBottom: 20,
    fontFamily: 'Roboto-Regular',
  },
  overlayStopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayStopButtonText: {
    color: '#a7bd32',
    fontSize : RFValue(13),
    marginLeft: 10,
     fontFamily: 'Roboto-Regular',
  },
});