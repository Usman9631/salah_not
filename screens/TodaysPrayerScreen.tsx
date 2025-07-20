import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ImageBackground, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrayerTimingsTable from '../components/PrayerTimingsTable';
import { MasjidContext } from '../context/MasjidContext';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import Constants from 'expo-constants';

const { width, height } = Dimensions.get('window');
const BG_HEIGHT = height * 0.35;

const masjidBackground = require('../assets/images/MasjidBackground.jpg');

function getNextPrayer(timings: { azan: string; name: string }[]) {
  if (!timings || timings.length === 0) return null;
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  let minDiff = Infinity;
  let next: any = null;
  timings.forEach(prayer => {
    if (!prayer.azan) return;
    const [h, m] = prayer.azan.split(':').map(Number);
    const prayerMinutes = h * 60 + m;
    let diff = prayerMinutes - nowMinutes;
    if (diff < 0) diff += 24 * 60;
    if (diff > 0 && diff < minDiff) {
      minDiff = diff;
      next = { ...prayer, diff };
    }
  });
  return next;
}

function formatDiff(diff: number | undefined) {
  if (diff == null) return '';
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  if (h > 0) {
    return `${h} hour${h > 1 ? 's' : ''} ${m} min${m !== 1 ? 's' : ''}`;
  }
  return `${m} min${m !== 1 ? 's' : ''}`;
}

// Helper to get Islamic (Hijri) date in Arabic
function getArabicDate(date: Date) {
  return date.toLocaleDateString('en-u-ca-islamic', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

type Props = {
  route?: { params?: { masjid?: string } };
  navigation?: any;
};

export default function TodaysPrayerScreen({ route, navigation }: Props) {
  const masjidContext = useContext(MasjidContext);
  const masjid = route?.params?.masjid || masjidContext?.masjid;

  const [timings, setTimings] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [now, setNow] = useState(new Date());
  const [currentTime, setCurrentTime] = useState('');
  const [date, setDate] = useState(new Date());
  const BACKEND_API_URL = Constants.expoConfig?.extra?.BACKEND_API_URL || 'http://192.168.18.96:4000';
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
      const n = new Date();
      let h = n.getHours();
      let m = n.getMinutes();
      let hour12 = h % 12;
      if (hour12 === 0) hour12 = 12;
      setCurrentTime(`${hour12}:${m.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function fetchTimings() {
      setError('');
      try {
        if (!masjid?._id) {
          setTimings([]);
          setError('No masjid selected');
          return;
        }
        
        const res = await fetch(`${BACKEND_API_URL}/api/masjid/${masjid._id}/namaz-timings`);
        const data = await res.json();
        if (data && data.success && data.namazTiming) {
          const t = data.namazTiming;
          const formatted = [
            { name: 'Fajr', azan: t.Fajr, iqamah: t.Fajr },
            { name: 'Dhuhr', azan: t.Dhuhr, iqamah: t.Dhuhr },
            { name: 'Asr', azan: t.Asr, iqamah: t.Asr },
            { name: 'Maghrib', azan: t.Maghrib, iqamah: t.Maghrib },
            { name: 'Isha', azan: t.Isha, iqamah: t.Isha },
            { name: 'Jummah', azan: t.Jummah, iqamah: t.Jummah },
          ];
          setTimings(formatted);
        } else {
          setTimings([]);
          setError('No timings found');
        }
      } catch (e) {
        console.error('Error fetching timings:', e);
        setTimings([]);
        setError('Failed to load prayer timings');
      }
    }
    if (masjid) fetchTimings();
  }, [masjid]);

  const nextPrayer = getNextPrayer(timings);
  const nextPrayerText = nextPrayer
    ? `${nextPrayer.name} is in ${formatDiff(nextPrayer.diff)}`
    : '';

  // Date navigation handlers (dummy, just for UI)
  const handlePrevDate = () => {
    const prev = new Date(date);
    prev.setDate(prev.getDate() - 1);
    setDate(prev);
  };
  const handleNextDate = () => {
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    setDate(next);
  };

  const englishDate = date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const arabicDate = getArabicDate(date);

  return (
    <View style={styles.flex1}>
      <StatusBar style="light" />
      <ImageBackground
        source={masjidBackground}
        style={styles.bgImage}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Back Button at top left, under safe area */}
          <View style={{ width: '100%', alignItems: 'flex-start' }}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation && navigation.goBack()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
          {/* Centered white text on background */}
          <View style={styles.centeredInfo}>
            <Text style={styles.locationText}>
              {masjid ? (typeof masjid === 'object' ? masjid.name : masjid) : 'Location'}
            </Text>
            <Text style={styles.timeText}>{currentTime}</Text>
            <Text style={styles.nextPrayerText}>{nextPrayerText}</Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
      {/* Floating Date Card */}
      <View style={styles.dateCard}>
        <TouchableOpacity onPress={handlePrevDate} style={styles.arrowBtn}>
          <Ionicons name="chevron-back" size={28} color="#a7bd32" />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.dateText}>{englishDate}</Text>
          <Text style={styles.arabicDateText}>{arabicDate}</Text>
        </View>
        <TouchableOpacity onPress={handleNextDate} style={styles.arrowBtn}>
          <Ionicons name="chevron-forward" size={28} color="#a7bd32" />
        </TouchableOpacity>
      </View>
      {/* Prayer Timings Table */}
      <View style={styles.tableWrap}>
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <PrayerTimingsTable timings={timings} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1, backgroundColor: '#f9f9f9' },
  bgImage: {
    width: '100%',
    height: BG_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  backButton: {
    marginTop: 6,
    marginLeft: 8,
  
    padding: 2,
    zIndex: 20,
  },
  centeredInfo: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    width: '100%',
  },
  locationText: {
    color: '#fff',
    fontSize : RFValue(14),
    fontFamily: 'Roboto-Regular',
    marginBottom: 2,
    marginTop: 2,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.18)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  timeText: {
    color: '#fff',
    fontSize: 30,
    fontFamily: 'Roboto-Bold',
    marginBottom: 4,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.18)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  nextPrayerText: {
    color: '#fff',
    fontSize : RFValue(13),
    fontFamily: 'Roboto-Regular',
    marginTop: 2,
    marginBottom: 2,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.18)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  dateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginHorizontal: 18,
    marginTop: -38,
    marginBottom: 10,
    paddingVertical: 12,
    zIndex: 10,
  },
  arrowBtn: {
    padding: 6,
    borderRadius: 20,
  },
  dateText: {
    textAlign: 'center',
    fontSize : RFValue(13),
    color: '#222',
    fontFamily: 'Roboto-Regular',
  },
  arabicDateText: {
    fontSize: RFValue(11),
    color: '#b1b1b1',
    fontFamily: 'Roboto-Bold',
    marginTop: 2,
    textAlign: 'center',
  },
  tableWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 0,
  },
  errorText: {
    color: 'red',
    fontSize : RFValue(13),
    marginVertical: 16,
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
  },
});