import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MasjidContext } from '../context/MasjidContext';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ProfileIcon from '../components/ProfileIcon';
import { RFValue } from "react-native-responsive-fontsize";
import Constants from 'expo-constants';


type PrayerTiming = {
  name: string;
  azan: string;
  iqamah: string;
};
type Announcement = {
  message: string;
  imam?: string;
  date?: string;
  _id: string;
};

type PrayerChecks = {
  Fajr: boolean;
  Dhuhr: boolean;
  Asr: boolean;
  Maghrib: boolean;
  Isha: boolean;
};

function getNextPrayer(timings: PrayerTiming[]): (PrayerTiming & { diff: number }) | null {
  if (!timings || timings.length === 0) return null;
  
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  let minDiff = Infinity;
  let next: (PrayerTiming & { diff: number }) | null = null;
  
  timings.forEach(prayer => {
    if (!prayer.azan) return;
    
    // Parse prayer time (assuming format like "06:30" or "18:30")
    const timeParts = prayer.azan.split(':');
    if (timeParts.length !== 2) return;
    
    let hours = parseInt(timeParts[0]);
    let minutes = parseInt(timeParts[1]);
    
    // Handle 12-hour format if needed
    if (hours < 12 && prayer.azan.includes('PM')) {
      hours += 12;
    } else if (hours === 12 && prayer.azan.includes('AM')) {
      hours = 0;
    }
    
    const prayerMinutes = hours * 60 + minutes;
    let diff = prayerMinutes - nowMinutes;
    
    // If prayer time has passed today, check for tomorrow
    if (diff <= 0) {
      diff += 24 * 60; // Add 24 hours
    }
    
    // Find the prayer with the smallest positive difference
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

type DashboardProps = {
  navigation: any;
  route?: any;
};

const mainPrayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;



export default function Dashboard({ navigation, route }: DashboardProps) {
  const masjidContext = useContext(MasjidContext);
  const { user, isLoggedIn } = useAuth();
  const contextMasjid = masjidContext?.masjid;
  const masjid = route?.params?.masjid || contextMasjid;


  const [timings, setTimings] = useState<PrayerTiming[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [now, setNow] = useState(new Date());
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [description, setDescription] = useState('');
  // Prayer tracker state
  const [prayerChecks, setPrayerChecks] = useState<PrayerChecks>({
    Fajr: false,
    Dhuhr: false,
    Asr: false,
    Maghrib: false,
    Isha: false,
  });

  const togglePrayerCheck = (prayer: keyof PrayerChecks) => {
    setPrayerChecks((prev) => ({
      ...prev,
      [prayer]: !prev[prayer],
    }));
  };

  // Handle Prayer Together button
  const handlePrayerTogether = () => {
    setPrayerChecks({
      Fajr: true,
      Dhuhr: true,
      Asr: true,
      Maghrib: true,
      Isha: true,
    });
  };
 
  const BACKEND_API_URL = Constants.expoConfig?.extra?.BACKEND_API_URL || 'http://192.168.100.145:4000';
  
  useEffect(() => {
  const fetchMasjidDetails = async () => {
    console.log('🔍 masjid ID:', masjid?._id);

    if (!masjid?._id) {
      setLoading(false);
      setError('Please select a masjid first');
      setTimings([]);
      setAnnouncements([]);
      setDescription('');
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

        // Set announcements
        console.log('📢 Announcements:', m.announcements);
        setAnnouncements(m.announcements || []);
        
        // Set description
        setDescription(m.masjid?.description || '');
      } else {
        setError('Failed to load masjid details');
      }
    } catch (err) {
      console.log('❌ Error fetching masjid details:', err);
      setError('Failed to load masjid details');
    } finally {
      setLoading(false);
    }
  };

  fetchMasjidDetails();
}, [masjid?._id]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);



  // For prayer icons
  const prayerIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
    Fajr: 'cloudy-night-outline',
    Dhuhr: 'sunny-outline',
    Asr: 'partly-sunny-outline',
    Maghrib: 'moon-outline',
    Isha: 'moon-sharp',
    Jummah: 'people-outline',
  };

  // --- Top icons row ---
  const getSelectedMasjidName = () => {
    // Get masjid name from context
    if (contextMasjid) {
      if (typeof contextMasjid === 'object' && contextMasjid.name) {
        return contextMasjid.name;
      } else if (typeof contextMasjid === 'string') {
        return contextMasjid;
      }
    }
    return 'No masjid selected';
  };

  const handleLocationPress = () => {
    if (navigation && navigation.navigate) {
      navigation.navigate('SelectionScreen');
    }
  };
  const handleReminderPress = () => {
    if (navigation && navigation.navigate) {
      navigation.navigate('Reminders');
    }
  };

  // Example profile image URL (replace with real user image if available)
  const profileImage = null; // or a string URL

  const handleTodaysPrayersPress = () => {
    if (navigation && navigation.navigate) {
      navigation.navigate('TodaysPrayer');
    }
  };

  const handleProfilePress = () => {
    if (!isLoggedIn) {
      Alert.alert(
        '🔐 Login Required',
        'Please login to access your profile.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Login', 
            style: 'default',
            onPress: () => navigation.navigate('LoginScreen')
          }
        ]
      );
      return;
    }
    
    if (navigation && navigation.navigate) {
      navigation.navigate('UserProfileScreen');
    }
  };

  // --- Digital Info Card ---
  const [islamicDate, setIslamicDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      let h = now.getHours();
      let m = now.getMinutes();
      let hour12 = h % 12;
      if (hour12 === 0) hour12 = 12;
      setCurrentTime(`${hour12}:${m.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    fetch(`https://api.aladhan.com/v1/gToH?date=${day}-${month}-${year}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.data && data.data.hijri) {
          const hijri = data.data.hijri;
          setIslamicDate(`${hijri.day} ${hijri.month.en} ${hijri.year} AH`);
        } else {
          setIslamicDate('Islamic date unavailable');
        }
      })
      .catch(() => setIslamicDate('Islamic date unavailable'));
  }, [now.getDate(), now.getMonth(), now.getFullYear()]);

  // Add type annotation to nextPrayer
  const nextPrayer = getNextPrayer(timings) as (PrayerTiming & { diff: number }) | null;
  const nextPrayerText = !masjid?._id 
    ? 'Please select a masjid first'
    : nextPrayer
    ? `${nextPrayer.name} is in ${formatDiff(nextPrayer.diff)}`
    : '';



  // FlatList data: everything is a card/section
  const flatListData = [
    {
      key: 'topIcons',
      render: () => (
        <View style={styles.topIconsRow}>
          <TouchableOpacity onPress={handleLocationPress} style={[styles.iconButton, { flexDirection: 'row', padding: 6, backgroundColor: '#ffffff', borderRadius: 12, justifyContent: 'center' }]}>
            <Ionicons name="location" size={24} color="#a7bd32" />
            <Text style={styles.topTitle}> {getSelectedMasjidName() || 'No masjid selected'}</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={handleReminderPress} style={[styles.iconButton, { flexDirection: 'row', padding: 2, marginRight: 8 }]}>
              <Ionicons name="notifications-outline" size={24} color="#000" />
            </TouchableOpacity>
            <ProfileIcon image={profileImage} size={36} onPress={handleProfilePress} />
          </View>
        </View>
      ),
    },
    {
      key: 'todaysPrayersCard',
      render: () => (
        <TouchableOpacity style={styles.todaysPrayersCard}
          onPress={handleTodaysPrayersPress}
          activeOpacity={0.7}>
          <Text style={styles.todaysPrayersText}>Today's Prayers</Text>
          <Ionicons name="chevron-forward-circle" size={30} color="#d6d6d6" />
        </TouchableOpacity>
      ),
    },
    {
      key: 'digitalCard',
      render: () => (
        <View style={styles.digitalCard}>
          <View>
            <View style={styles.digitalIconWrap}>
              <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }}>
                <Text style={styles.islamicDate}>{islamicDate}</Text>
                <Text style={styles.currentTime}>{currentTime}</Text>
                <Text style={styles.nextPrayer}>{nextPrayerText}</Text>
              </View>
              <Ionicons name="notifications" size={38} color="#a7bd32" />
            </View>
            <View style={styles.horizontalLine} />
            {/* Prayer sections */}
            <View style={styles.prayerRow}>
              {mainPrayers.map(prayerName => {
                const prayer = timings.find(p => p.name === prayerName);
                let icon = prayerIcons[prayerName] || 'ellipse-outline';
                let time = prayer && prayer.azan ? prayer.azan : '--:--';

                return (
                  <View style={styles.prayerSection} key={prayerName}>
                    <Text style={styles.prayerName}>{prayerName}</Text>
                    <Ionicons name={icon} size={24} color="#000000" style={{ marginVertical: 2 }} />
                    <Text style={styles.prayerTime}>{time}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      ),
    },
    {
      key: 'trackerCard',
      render: () => (
        <View style={styles.trackerCard}>
          <View style={styles.trackerHeader}>
            <Ionicons name="alarm-outline" size={28} color="#000000" style={{ marginRight: 8 }} />
            <Text style={styles.trackerTitle}>Prayer Tracker</Text>
          </View>
          <View style={styles.trackerRow}>
            {mainPrayers.map(prayer => (
              <TouchableOpacity
                key={prayer}
                style={styles.trackerSection}
                onPress={() => togglePrayerCheck(prayer as keyof PrayerChecks)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={prayerChecks[prayer as keyof PrayerChecks] ? 'checkmark-circle' : 'ellipse-outline'}
                  size={24}
                  color={prayerChecks[prayer as keyof PrayerChecks] ? '#a7bd32' : '#a7bd32'}
                  style={{ marginBottom: 2 }}
                />
                <Text style={styles.trackerPrayerName}>{prayer}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Prayer Together Button */}
          <TouchableOpacity style={styles.prayerTogetherBtn} activeOpacity={0.8} onPress={handlePrayerTogether}>
            <Text style={styles.prayerTogetherBtnText}>Prayer Together</Text>
          </TouchableOpacity>
        </View>
      ),
    },
    {
      key: 'announcements',
      render: () => (
        <>
          <View style={styles.announcementHeader}>
            <Ionicons name="megaphone-outline" size={26} color="#000000" style={{ marginRight: 8 }} />
            <Text style={styles.announcementTitle}>Announcements</Text>
          </View>
          <View style={styles.announcementCard}>
           <View style={styles.announcementBody}>
  {!masjid?._id ? (
    <Text style={styles.announcementText}>Please select a masjid to view announcements.</Text>
  ) : announcements.length === 0 ? (
    <Text style={styles.announcementText}>No announcements at this time.</Text>
  ) : (
    announcements.map((ann, index) => (
      <View key={index} style={{ marginBottom: 10 }}>
        <Text style={styles.announcementText}>📢 {ann.message}</Text>
        {ann.imam && (
          <Text style={{ fontSize: 12, color: '#999' }}>— {ann.imam}</Text>
        )}
      </View>
    ))
  )}
</View>

          </View>
        </>
      ),
    },
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar style="dark" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: RFValue(13), fontFamily: 'Roboto-Regular', color: '#a7bd32' }}>
            Loading masjid details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show message when no masjid is selected
  if (!masjid?._id) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar style="dark" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Ionicons name="location-outline" size={64} color="#a7bd32" style={{ marginBottom: 20 }} />
          <Text style={{ fontSize: RFValue(16), fontFamily: 'Roboto-Bold', color: '#000', textAlign: 'center', marginBottom: 10 }}>
            No Masjid Selected
          </Text>
          <Text style={{ fontSize: RFValue(13), fontFamily: 'Roboto-Regular', color: '#666', textAlign: 'center', marginBottom: 30 }}>
            Please select a masjid from the location button to view prayer timings and announcements.
          </Text>
          <TouchableOpacity 
            style={{ 
              backgroundColor: '#a7bd32', 
              paddingHorizontal: 20, 
              paddingVertical: 12, 
              borderRadius: 8 
            }}
            onPress={handleLocationPress}
          >
            <Text style={{ color: '#fff', fontFamily: 'Roboto-Bold', fontSize: RFValue(13) }}>
              Select Masjid
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <FlatList
        data={flatListData}
        renderItem={({ item }) => item.render()}
        keyExtractor={item => item.key}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 2,
  },
  topIconsRow: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingTop: 4,
    paddingBottom: 6,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 9
  },
  topTitle: {
    fontSize: RFValue(12),
    fontFamily: 'Roboto-Regular',
    color: '#000000',
    textAlign: 'center',
    marginLeft: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 4,
    paddingRight: 8,
  },
  iconButton: {
    padding: 4,
  },
  todaysPrayersCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 18,
    marginTop: 10,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  todaysPrayersText: {
    fontSize : RFValue(13),
    fontFamily: 'Roboto-Regular',
    color: '#000',
  },
  digitalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowOpacity: 0.02,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    marginHorizontal: 18,
    marginTop: 12,
    marginBottom: 12,
    paddingVertical: 15,
  },
  islamicDate: {
    fontSize: RFValue(12),
    color: '#000',
    fontFamily: 'Roboto-Regular',
    marginBottom: 2,
  },
  currentTime: {
    fontSize: RFValue(26),
    color: '#000',
    fontFamily: 'Roboto-Bold',
    marginBottom: 2,
  },
  nextPrayer: {
    fontSize: RFValue(12),
    color: '#000000',
    fontFamily: 'Roboto-Regular',
    marginTop: 2,
    marginBottom: 8,
  },
  digitalIconWrap: {
    marginLeft: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  horizontalLine: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
    width: '94%',
    marginHorizontal: 20,
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  prayerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
    width: '100%',
  },
  prayerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prayerName: {
    fontSize: RFValue(10),
    color: '#000',
    fontFamily: 'Roboto-Regular',
    marginBottom: 2,
  },
  prayerTime: {
    fontSize: RFValue(10),
    color: '#000000',
    fontFamily: 'Roboto-Bold',
    marginTop: 2,
  },
  trackerCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    marginHorizontal: 18,
    marginBottom: 16,
    paddingVertical: 15,
    paddingHorizontal: 5,
  },
  trackerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingLeft: 2,
  },
  trackerTitle: {
    fontSize: RFValue(12),
    fontFamily: 'Roboto-Regular',
    color: '#000000',
  },
  trackerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
    width: '100%',
    paddingHorizontal: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
  },
  trackerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  trackerPrayerName: {
    fontSize: RFValue(11),
    color: '#000',
    fontFamily: 'Roboto-Regular',
    marginVertical: 2,
  },
  prayerTogetherBtn: {
    marginTop: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 18,
    borderWidth: 1.5,
    borderColor: '#efefef',
  },
  prayerTogetherBtnText: {
    color: '#a7bd32',
    fontSize: RFValue(12),
    fontFamily: 'Roboto-Bold',
    letterSpacing: 0.5,
  },
  announcementCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 18,
    marginBottom: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  announcementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginLeft: 18,
  },
  announcementTitle: {
    fontSize : RFValue(13),
    fontFamily: 'Roboto-Regular',
    color: '#000000',
  },
  announcementBody: {
    marginTop: 4,
  },
  announcementText: {
    fontSize : RFValue(13),
    color: '#333',
    fontFamily: 'Roboto-Regular',
  },
  content: {
    paddingVertical: 24,
    paddingBottom: 64,
  },
});