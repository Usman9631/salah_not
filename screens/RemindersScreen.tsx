import { View, Text, FlatList, StyleSheet } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import BackHeader from '../components/BackHeader';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import { MasjidContext } from '../context/MasjidContext';
import axios from 'axios';
import Constants from 'expo-constants';

const BACKEND_API_URL = Constants.expoConfig?.extra?.BACKEND_API_URL || 'http://192.168.18.96:4000';

type PrayerTiming = {
  name: string;
  azan: string;
  iqamah: string;
};

const arabicNames: Record<string, string> = {
  Fajr: 'فجر',
  Dhuhr: 'ظهر',
  Asr: 'عصر',
  Maghrib: 'مغرب',
  Isha: 'عشاء'
};

export default function RemindersScreen({ navigation }: { navigation: any }) {
  const masjidContext = useContext(MasjidContext);
  const masjid = masjidContext?.masjid;
  const [timings, setTimings] = useState<PrayerTiming[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch prayer timings for the selected masjid
  useEffect(() => {
    const fetchTimings = async () => {
      if (!masjid?._id) {
        setTimings([]);
        setError('Please select a masjid first');
        return;
      }

      setLoading(true);
      setError('');
      
      try {
        const res = await axios.get(`${BACKEND_API_URL}/api/masjid/${masjid._id}/namaz-timings`);
        console.log('✅ Response:', res.data);
        if (res.data && res.data.success) {
          const m = res.data;

          // Set namaz timings
          const formatted: PrayerTiming[] = [
            { name: 'Fajr', azan: m.namazTiming.Fajr, iqamah: m.iqamah.Fajr },
            { name: 'Dhuhr', azan: m.namazTiming.Dhuhr, iqamah: m.iqamah.Dhuhr },
            { name: 'Asr', azan: m.namazTiming.Asr, iqamah: m.iqamah.Asr },
            { name: 'Maghrib', azan: m.namazTiming.Maghrib, iqamah: m.iqamah.Maghrib },
            { name: 'Isha', azan: m.namazTiming.Isha, iqamah: m.iqamah.Isha },
            { name: 'Jummah', azan: m.namazTiming.Jummah || m.jummah.firstJummah, iqamah: m.jummah.firstJummah },
          ];
          setTimings(formatted);
        } else {
          setError('Failed to load masjid details');
        }
      } catch (err) {
        console.error('Error fetching timings:', err);
        setError('Failed to load prayer timings');
      } finally {
        setLoading(false);
      }
    };

    fetchTimings();
  }, [masjid?._id]);

  if (!masjid?._id) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={['top', 'left', 'right']}>
        <StatusBar style="dark" />
        <BackHeader title="Reminders" onBack={() => navigation.navigate('Home')} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: RFValue(16), fontFamily: 'Roboto-Bold', color: '#000', textAlign: 'center', marginBottom: 10 }}>
            No Masjid Selected
          </Text>
          <Text style={{ fontSize: RFValue(13), fontFamily: 'Roboto-Regular', color: '#666', textAlign: 'center' }}>
            Please select a masjid to view prayer reminders.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={['top', 'left', 'right']}>
        <StatusBar style="dark" />
        <BackHeader title="Reminders" onBack={() => navigation.navigate('Home')} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: RFValue(13), fontFamily: 'Roboto-Regular', color: '#a7bd32' }}>
            Loading prayer timings...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <BackHeader title="Reminders" onBack={() => navigation.navigate('Home')} />
      <View style={{ flex: 1, padding: 16 }}>
        {error ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: RFValue(13), fontFamily: 'Roboto-Regular', color: '#666', textAlign: 'center' }}>
              {error}
            </Text>
          </View>
        ) : (
          <FlatList
            data={timings}
            keyExtractor={item => item.name}
            renderItem={({ item }) => (
              <View style={styles.reminderItem}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.prayerName}>{item.name}</Text>
                  <Text style={styles.arabic}>{arabicNames[item.name]}</Text>
                </View>
                <Text style={styles.adhanTime}>Adhan: {item.azan}</Text>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize : RFValue(13),
    color: '#000000',
    marginBottom: 18,
    textAlign: 'center',
    fontFamily: 'Roboto-Bold',
  },
  reminderItem: {
    backgroundColor: '#f9f9f9',
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
    fontSize: 17,
    color: '#000000',
    marginLeft: 8,
    fontFamily: 'Roboto-Regular',
  },
  adhanTime: {
    fontSize : RFValue(13),
    color: '#000000',
    fontFamily: 'Roboto-Regular',
     },
});