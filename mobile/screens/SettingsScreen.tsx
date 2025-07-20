import { View, Text, TouchableOpacity, Dimensions, Modal, Pressable, Alert } from 'react-native';
import React, { useState, useCallback } from 'react';
import BackHeader from '../components/BackHeader';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useAuth } from '../context/AuthContext';

const { width: DEVICE_WIDTH } = Dimensions.get('window');

export default function SettingsScreen({ navigation }: { navigation: any }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSoundMode, setSelectedSoundMode] = useState('Custom Sounds');

  const options = ['Standard Sounds', 'Custom Sounds', 'No Sounds'];

  // Callbacks for navigation and state updates
  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const openModal = useCallback(() => {
    setModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const handleSelectSoundMode = useCallback((option: string) => {
    setSelectedSoundMode(option);
    setModalVisible(false);
  }, []);

  const goToAdhanSoundSettings = useCallback(() => {
    navigation.navigate('AdhanSoundSettings');
  }, [navigation]);

  const goToIqamahSoundSettings = useCallback(() => {
    navigation.navigate('IqamahSoundSettings');
  }, [navigation]);

  const handleOtherSettingsPress = useCallback(() => {
    navigation.navigate('OtherSettings');
  }, [navigation]);

  const goToReminders = useCallback(() => {
    navigation.navigate('RemindersSettings');
  }, [navigation]);

  const goToSilentSettings = useCallback(() => {
    navigation.navigate('SilentSettings');
  }, [navigation]);

  const goToFajrAlarm = useCallback(() => {
    navigation.navigate('FajrWakeUpAlarmSettings');
  }, [navigation]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
       <BackHeader title="" onBack={() => navigation.navigate('Home')} />
      <ScrollView>
        <View>
          {/* APP SOUND MODE */}
          <TouchableOpacity
            onPress={openModal}
            style={{
              width: DEVICE_WIDTH - 40,
              marginBottom: 5,
              padding: 15,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 20,
            }}
          >
            <Ionicons name="volume-high-outline" size={25} color="#a7bd32" style={{ marginRight: 10 }} />
            <View>
              <Text style={{ color: '#000000', fontSize : RFValue(13), marginLeft: 8, fontFamily: 'Roboto-Bold' }}>
                APP SOUND MODE
              </Text>
              <Text style={{ color: '#000000', fontSize : RFValue(12), marginLeft: 8, fontFamily: 'Roboto-Regular' }}>
                {selectedSoundMode}
              </Text>
            </View>
          </TouchableOpacity>

          {/* ADHAN SOUND */}
          <TouchableOpacity
            onPress={goToAdhanSoundSettings}
            style={{
              width: DEVICE_WIDTH - 40,
              marginBottom: 5,
              padding: 15,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 20,
            }}
          >
            <View style={{ width: 35 }} />
            <View>
              <Text style={{ color: '#000000', fontSize : RFValue(13), marginLeft: 8, fontFamily: 'Roboto-Bold' }}>
                ADHAN SOUND
              </Text>
              <Text style={{ color: '#000000', fontSize : RFValue(12), marginLeft: 8, paddingRight: 20, fontFamily: 'Roboto-Regular' }}>
                Caution: Do not turn ON this setting on your mobile phone if you pray in masjid.
              </Text>
              <Text style={{ color: '#000000', fontSize : RFValue(12), marginLeft: 8, paddingRight: 20, marginTop: 20, fontFamily: 'Roboto-Regular' }}>
                Adhan Sound Settings.
              </Text>
            </View>
          </TouchableOpacity>

          {/* IQAMAH SOUND */}
          <TouchableOpacity
            onPress={goToIqamahSoundSettings}
            style={{
              width: DEVICE_WIDTH - 40,
              marginBottom: 20,
              padding: 15,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 20,
            }}
          >
            <View style={{ width: 35 }} />
            <View>
              <Text style={{ color: '#000000', fontSize : RFValue(13), marginLeft: 8, fontFamily: 'Roboto-Bold' }}>
                IQAMAH SOUND
              </Text>
              <Text style={{ color: '#000000', fontSize : RFValue(12), marginLeft: 8, paddingRight: 20, fontFamily: 'Roboto-Regular' }}>
                Caution: Do not turn ON this setting on your mobile phone if you pray in masjid.
              </Text>
              <Text style={{ color: '#000000', fontSize : RFValue(12), marginLeft: 8, paddingRight: 20, marginTop: 20, fontFamily: 'Roboto-Regular' }}>
                Adhan Sound Settings.
              </Text>
            </View>
          </TouchableOpacity>

          {/* REMINDERS */}
          <TouchableOpacity
            onPress={goToReminders}
            style={{
              marginBottom: 5,
              padding: 15,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
              borderTopWidth: 1,
              borderBottomWidth: 1,
              paddingHorizontal: 30,
              borderColor: '#444',
            }}
          >
            <Ionicons name="notifications-outline" size={25} color="#a7bd32" style={{ marginRight: 10 }} />
            <View>
              <Text style={{ color: '#000000', fontSize : RFValue(13), marginLeft: 8, fontFamily: 'Roboto-Bold' }}>
                REMINDERS
              </Text>
              <Text style={{ color: '#000000', fontSize : RFValue(12), marginLeft: 8, fontFamily: 'Roboto-Regular' }}>
                Reminder Settings
              </Text>
            </View>
          </TouchableOpacity>

          {/* SILENT SETTINGS */}
          <TouchableOpacity
            onPress={goToSilentSettings}
            style={{
              marginBottom: 5,
              padding: 15,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomWidth: 1,
              paddingHorizontal: 30,
              borderColor: '#444',
            }}
          >
            <Ionicons name="notifications-off-outline" size={25} color="#a7bd32" style={{ marginRight: 10 }} />
            <View>
              <Text style={{ color: '#000000', fontSize : RFValue(13), marginLeft: 8, fontFamily: 'Roboto-Bold' }}>
                SILENT SETTINGS
              </Text>
             
            </View>
          </TouchableOpacity>

          {/* FAJR WAKE UP ALARM */}
          <TouchableOpacity
            onPress={goToFajrAlarm}
            style={{
              marginBottom: 5,
              padding: 15,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomWidth: 1,
              paddingHorizontal: 30,
              borderColor: '#444',
            }}
          >
            <Ionicons name="alarm-outline" size={25} color="#a7bd32" style={{ marginRight: 10 }} />
            <View>
              <Text style={{ color: '#000000', fontSize : RFValue(13), marginLeft: 8, fontFamily: 'Roboto-Bold' }}>
                FAJR WAKE UP ALARM
              </Text>
              <Text style={{ color: '#000000', fontSize : RFValue(12), marginLeft: 8, fontFamily: 'Roboto-Regular' }}>
                Wake up alarm for Fajr on the daily Fajr times or custom time.
              </Text>
              <Text style={{ color: '#000000', fontSize : RFValue(13), marginLeft: 8, paddingRight: 20, marginTop: 20, fontFamily: 'Roboto-Regular' }}>
                Fajr Alarm Settings.
              </Text>
            </View>
          </TouchableOpacity>

          {/* OTHER SETTINGS */}
          <TouchableOpacity
            onPress={handleOtherSettingsPress}
            style={{
              width: DEVICE_WIDTH - 40,
              marginBottom: 20,
              padding: 15,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 20,
            }}
          >
            <View style={{ width: 35 }} />
            <View>
              <Text style={{ color: '#000000', fontSize : RFValue(13), marginLeft: 8, fontFamily: 'Roboto-Bold' }}>
                OTHER SETTINGS
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* MODAL */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.45)',
              paddingHorizontal: 20,
            }}
          >
            <View
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 10,
                padding: 20,
                width: DEVICE_WIDTH * 0.85,
                alignSelf: 'center',
                shadowColor: '#000',
                shadowOpacity: 0.1,
                elevation: 5,
              }}
            >
              <Text style={{ color: '#000000', fontSize : RFValue(13), fontFamily: 'Roboto-Bold', marginBottom: 5 }}>
                APP SOUND MODE
              </Text>

              {options.map((option) => {
                const isSelected = option === selectedSoundMode;
                return (
                  <Pressable
                    key={option}
                    onPress={() => handleSelectSoundMode(option)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 7,
                    }}
                  >
                    <Ionicons
                      name={isSelected ? 'radio-button-on-outline' : 'radio-button-off-outline'}
                      size={22}
                      color={isSelected ? '#a7bd32' : '#888'}
                      style={{ marginRight: 12 }}
                    />
                    <Text style={{ color: '#000000', fontSize : RFValue(12), fontFamily: 'Roboto-Regular' }}>{option}</Text>
                  </Pressable>
                );
              })}

              <Pressable
                onPress={closeModal}
                style={{
                  padding: 12,
                  alignItems: 'flex-end',
                }}
              >
                <Text style={{ color: '#a7bd32', fontSize : RFValue(13), fontFamily: 'Roboto-Bold' }}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}