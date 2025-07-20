import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions, FlatList, Modal, TextInput, KeyboardAvoidingView, Platform, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { MasjidContext } from '../context/MasjidContext';
import axios from 'axios';
import { RFValue } from 'react-native-responsive-fontsize';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const BG_HEIGHT = height * 0.6;
const CARD_TOP = BG_HEIGHT * 0.7;

const BACKEND_API_URL = Constants.expoConfig?.extra?.BACKEND_API_URL || 'http://192.168.18.96:4000';

// Interface for announcement type
interface Announcement {
  _id?: string;
  message: string;
  imam?: string;
  date?: string;
}

const masjidBackground = require('../assets/images/masajid/masjid1.png');

export default function MasjidProfileScreen({ route, navigation }: { route: any; navigation: any }) {
  const masjidContext = React.useContext(MasjidContext);
  const { user } = useAuth();
  const [isFavourite, setIsFavourite] = useState(false);
  const [donateModal, setDonateModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorContact, setDonorContact] = useState('');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);
  const [showCustomAlert, setShowCustomAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    type: 'info', // 'info', 'success', 'error', 'warning'
    onConfirm: () => {},
    onCancel: () => {},
    showCancel: true
  });

  // Custom Alert Component
  const CustomAlert = () => {
    if (!showCustomAlert) return null;

    const getIconAndColor = () => {
      switch (alertConfig.type) {
        case 'success':
          return { icon: 'checkmark-circle', color: '#38a169', bgColor: '#f0fff4' };
        case 'error':
          return { icon: 'close-circle', color: '#e53e3e', bgColor: '#fff5f5' };
        case 'warning':
          return { icon: 'warning', color: '#d69e2e', bgColor: '#fffbeb' };
        default:
          return { icon: 'information-circle', color: '#3182ce', bgColor: '#f0f9ff' };
      }
    };

    const { icon, color, bgColor } = getIconAndColor();

    return (
      <Modal
        visible={showCustomAlert}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCustomAlert(false)}
      >
        <View style={styles.alertOverlay}>
          <View style={[styles.alertContainer, { backgroundColor: bgColor }]}>
            <View style={styles.alertIconContainer}>
              <Ionicons name={icon as any} size={40} color={color} />
            </View>
            
            <Text style={styles.alertTitle}>{alertConfig.title}</Text>
            <Text style={styles.alertMessage}>{alertConfig.message}</Text>
            
            <View style={styles.alertButtons}>
              {alertConfig.showCancel && (
                <TouchableOpacity
                  style={[styles.alertButton, styles.cancelButton]}
                  onPress={() => {
                    setShowCustomAlert(false);
                    alertConfig.onCancel();
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={[styles.alertButton, styles.confirmButton, { backgroundColor: color }]}
                onPress={() => {
                  setShowCustomAlert(false);
                  alertConfig.onConfirm();
                }}
              >
                <Text style={styles.confirmButtonText}>
                  {alertConfig.type === 'success' ? 'OK' : 
                   alertConfig.type === 'error' ? 'Try Again' :
                   alertConfig.type === 'warning' ? 'Remove' : 'Confirm'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  // Show custom alert
  const showAlert = (config: any) => {
    setAlertConfig(config);
    setShowCustomAlert(true);
  };

  // Get masjid from route params or context
  const masjid = route?.params?.masjid || masjidContext?.masjid || {
    _id: 'default-id',
    name: 'Masjid Al-Falah',
    address: '123 Main Street, Karachi',
    city: 'Karachi',
    country: 'Pakistan',
    imam: 'Imam Ahmed',
    contact: '+92 300 1234567',
    image: null,
    description: 'A central masjid serving the local community with daily prayers, Jummah, and Islamic classes.',
    timings: {
      Fajr: '04:30 AM',
      Dhuhr: '01:15 PM',
      Asr: '05:00 PM',
      Maghrib: '07:20 PM',
      Isha: '08:45 PM',
      Jummah: '01:30 PM',
    },
    miles: 2.3,
  };

  // Get announcements from masjid data
  // const [announcements, setAnnouncements] = useState<any[]>([]);
  // const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);

  // Fetch announcements for the masjid
  useEffect(() => {
    const fetchAnnouncements = async () => {
      if (!masjid?._id) {
        setAnnouncements([]);
        return;
      }
      
      setLoadingAnnouncements(true);
      try {
        const res = await axios.get(`${BACKEND_API_URL}/api/masjid/${masjid._id}/namaz-timings`);
        console.log('📢 Announcements API Response:', res.data);
        if (res.data && res.data.success) {
          const apiAnnouncements = res.data.announcements || [];
          console.log('📢 API Announcements:', apiAnnouncements);
          
          // Add sample announcements if none exist (for testing)
          if (apiAnnouncements.length === 0) {
            const sampleAnnouncements = [
              {
                _id: '1',
                message: 'Jummah prayer will be at 1:30 PM today.',
                imam: 'Imam Ahmed',
                date: new Date().toISOString()
              },
              {
                _id: '2',
                message: 'Taraweeh prayers will begin after Isha prayer.',
                imam: 'Imam Bilal',
                date: new Date().toISOString()
              }
            ];
            setAnnouncements(sampleAnnouncements);
          } else {
            setAnnouncements(apiAnnouncements);
          }
        } else {
          console.log('❌ No announcements in API response');
          setAnnouncements([]);
        }
      } catch (err) {
        console.error('Error fetching announcements:', err);
        // Add sample announcements on error (for testing)
        const sampleAnnouncements = [
          {
            _id: '1',
            message: 'Jummah prayer will be at 1:30 PM today.',
            imam: 'Imam Ahmed',
            date: new Date().toISOString()
          },
          {
            _id: '2',
            message: 'Taraweeh prayers will begin after Isha prayer.',
            imam: 'Imam Bilal',
            date: new Date().toISOString()
          }
        ];
        setAnnouncements(sampleAnnouncements);
      } finally {
        setLoadingAnnouncements(false);
      }
    };

    fetchAnnouncements();
  }, [masjid?._id]);

  // Announcement and donation data
  const ANNOUNCEMENTS = [
    {
      id: 'construction',
      type: 'donation',
      title: 'Masjid Under Construction',
      description: 'Support the construction of our new masjid building.',
      total: 1000000,
      collected: 350000,
      icon: 'construct',
    },
  ];

  // Check if this masjid is already in favourites
  React.useEffect(() => {
    const checkFavourite = async () => {
      if (!user?.id) {
        // Check local storage for favorites when not logged in
        try {
          const localFavourites = await AsyncStorage.getItem('localFavourites');
          if (localFavourites) {
            const favourites = JSON.parse(localFavourites);
            setIsFavourite(favourites.some((fav: any) => fav._id === masjid._id));
          } else {
            setIsFavourite(false);
          }
        } catch (err) {
          console.error('Error checking local favourites:', err);
          setIsFavourite(false);
        }
        return;
      }
      
      try {
        console.log('Checking favourites for user:', user.id);
        const res = await axios.get(`${BACKEND_API_URL}/api/user/${user.id}/favourite-masjids`);
        const data = res.data;
        console.log('Favourites response:', data);
        const favouriteMasajids = data.favouriteMasajids || [];
        setIsFavourite(favouriteMasajids.some((m: any) => m._id === masjid._id));
      } catch (err: any) {
        console.error('Error checking favourite status:', err);
        if (err.response) {
          console.error('Response status:', err.response.status);
          console.error('Response data:', err.response.data);
        }
        setIsFavourite(false);
      }
    };
    checkFavourite();
  }, [masjid._id, user?.id]);

  // Toggle favourite
  const handleToggleFavourite = async () => {
    if (!user?.id) {
      // Handle local favorites for non-logged-in users
      try {
        const localFavourites = await AsyncStorage.getItem('localFavourites');
        let favourites = localFavourites ? JSON.parse(localFavourites) : [];
        
        if (isFavourite) {
          // Remove from local favorites
          favourites = favourites.filter((fav: any) => fav._id !== masjid._id);
          setIsFavourite(false);
          showAlert({
            title: '💔 Removed',
            message: `${masjid.name} has been removed from your favourites.`,
            type: 'success',
            onConfirm: () => {},
            onCancel: () => {},
            showCancel: false
          });
        } else {
          // Add to local favorites
          favourites.push(masjid);
          setIsFavourite(true);
          showAlert({
            title: '❤️ Added to Favourites',
            message: `${masjid.name} has been added to your favourites!\n\nNote: Login to sync across devices.`,
            type: 'success',
            onConfirm: () => {},
            onCancel: () => {},
            showCancel: false
          });
        }
        
        await AsyncStorage.setItem('localFavourites', JSON.stringify(favourites));
      } catch (err) {
        console.error('Error managing local favourites:', err);
        showAlert({
          title: '❌ Error',
          message: 'Failed to update favourites. Please try again.',
          type: 'error',
          onConfirm: () => {},
          onCancel: () => {},
          showCancel: false
        });
      }
      return;
    }

    try {
      console.log('Toggling favourite for user:', user.id, 'masjid:', masjid._id);
      if (isFavourite) {
        // Remove from favourites
        const res = await axios.delete(`${BACKEND_API_URL}/api/user/favourite-masjid`, {
          data: { userId: user.id, masjidId: masjid._id }
        });
        console.log('Remove favourite response:', res.data);
        if (res.data.success) {
          setIsFavourite(false);
          showAlert({
            title: '💔 Removed',
            message: `${masjid.name} has been removed from your favourites.`,
            type: 'success',
            onConfirm: () => {},
            onCancel: () => {},
            showCancel: false
          });
        }
      } else {
        // Add to favourites
        const res = await axios.post(`${BACKEND_API_URL}/api/user/favourite-masjid`, {
          userId: user.id,
          masjidId: masjid._id
        });
        console.log('Add favourite response:', res.data);
        if (res.data.success) {
          setIsFavourite(true);
          showAlert({
            title: '❤️ Added to Favourites',
            message: `${masjid.name} has been added to your favourites!`,
            type: 'success',
            onConfirm: () => {},
            onCancel: () => {},
            showCancel: false
          });
        }
      }
    } catch (err: any) {
      console.error('Error toggling favourite:', err);
      if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
      }
      showAlert({
        title: '❌ Error',
        message: 'Failed to update favourites. Please try again.',
        type: 'error',
        onConfirm: () => {},
        onCancel: () => {},
        showCancel: false
      });
    }
  };

  // When user navigates to this screen, set the selected masjid in context
  React.useEffect(() => {
    if (masjidContext && masjid) {
      masjidContext.setMasjid && masjidContext.setMasjid(masjid);
    }
  }, [masjid, masjidContext]);

  // Check if this masjid is already selected (from context)
  const isSelected = masjidContext?.masjid?._id === masjid._id;

  // Handler to select/unselect this masjid
  const handleSelectMasjid = () => {
    if (masjidContext && masjid) {
      if (isSelected) {
        // Unselect if already selected
        masjidContext.setMasjid && masjidContext.setMasjid(null);
      } else {
        // Select this masjid
        masjidContext.setMasjid && masjidContext.setMasjid(masjid);
      }
    }
  };

  // Floating Card as a component
  const FloatingCard = () => {
    return (
      <View style={styles.floatingCard}>
        {/* Selected Icon at top right */}
        <TouchableOpacity
          style={styles.selectedIcon}
          onPress={handleSelectMasjid}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isSelected ? 'checkmark-circle' : 'checkmark-circle-outline'}
            size={28}
            color={isSelected ? '#a7bd32' : '#bdbdbd'}
          />
        </TouchableOpacity>
        <Text style={styles.floatingMasjidName} numberOfLines={1}>{masjid.name}</Text>
        <View style={styles.milesCard}>
          <Text style={styles.milesText}>{masjid.miles ?? '2.3'} miles</Text>
        </View>
        <View style={styles.row}>
          <Ionicons name="location" size={16} color="#666" style={{ marginRight: 6 }} />
          <Text style={styles.floatingAddress} numberOfLines={2}>{masjid.address}</Text>
        </View>
        <View style={styles.row}>
          <Ionicons name="call-outline" size={16} color="#666" style={{ marginRight: 6 }} />
          <Text style={styles.floatingPhone}>
            {masjid.contact || 'No contact info'}
          </Text>
        </View>
        <View style={styles.iconRow}>
          <TouchableOpacity style={styles.iconBtn} onPress={handlePhoneCall}>
            <Ionicons name="call-outline" size={22} color="#000000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="map-outline" size={22} color="#000000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={handleToggleFavourite}>
            <Ionicons name={isFavourite ? "heart" : "heart-outline"} size={22} color={isFavourite ? "#a7bd32" : "#000000"} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="ellipsis-vertical" size={22} color="#000000" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // FlatList render function for horizontal cards
  const renderItem = ({ item }: { item: any }) => {
    if (item.type === 'donation') {
      const remaining = item.total - item.collected;
      return (
        <View style={styles.announcementCard}>
          <Ionicons name={item.icon} size={28} color="#a7bd32" style={{ marginBottom: 6 }} />
          <Text style={styles.announcementTitle}>{item.title}</Text>
          <Text style={styles.announcementDesc}>{item.description}</Text>
          <View style={styles.donationRow}>
            <Text style={styles.donationLabel}>Total Needed:</Text>
            <Text style={styles.donationValue}>Rs {item.total.toLocaleString()}</Text>
          </View>
          <View style={styles.donationRow}>
            <Text style={styles.donationLabel}>Collected:</Text>
            <Text style={styles.donationValue}>Rs {item.collected.toLocaleString()}</Text>
          </View>
          <View style={styles.donationRow}>
            <Text style={styles.donationLabel}>Remaining:</Text>
            <Text style={styles.donationValue}>Rs {remaining.toLocaleString()}</Text>
          </View>
        </View>
      );
    }
    return null;
  };

  // Render announcements from masjid data
  const renderAnnouncements = () => {
    if (!masjid?._id) {
      return (
        <View style={styles.announcementCard}>
          <Ionicons name="megaphone-outline" size={28} color="#a7bd32" style={{ marginBottom: 6 }} />
          <Text style={styles.announcementTitle}>No Masjid Selected</Text>
          <Text style={styles.announcementDesc}>Please select a masjid to view announcements.</Text>
        </View>
      );
    }

    if (loadingAnnouncements) {
      return (
        <View style={styles.announcementCard}>
          <Ionicons name="hourglass-outline" size={28} color="#a7bd32" style={{ marginBottom: 6 }} />
          <Text style={styles.announcementTitle}>Loading...</Text>
          <Text style={styles.announcementDesc}>Fetching announcements...</Text>
        </View>
      );
    }

    if (announcements.length === 0) {
      return (
        <View style={styles.announcementCard}>
          <Ionicons name="megaphone-outline" size={28} color="#a7bd32" style={{ marginBottom: 6 }} />
          <Text style={styles.announcementTitle}>No Announcements</Text>
          <Text style={styles.announcementDesc}>No announcements at this time.</Text>
        </View>
      );
    }

    return announcements.map((announcement, index) => (
      <View key={index} style={styles.announcementCard}>
        <Ionicons name="megaphone-outline" size={28} color="#a7bd32" style={{ marginBottom: 6 }} />
        <Text style={styles.announcementTitle}>Announcement</Text>
        <Text style={styles.announcementDesc}>{announcement.message}</Text>
        {announcement.imam && (
          <Text style={styles.announcementImam}>— {announcement.imam}</Text>
        )}
      </View>
    ));
  };

  // Modal submit handler (dummy)
  const handleDonate = () => {
    setDonateModal(false);
    setDonationAmount('');
    setDonorName('');
    setDonorContact('');
  };

  // Handle donate button press
  const handleDonatePress = () => {
    if (!user?.id) {
      // User not logged in, navigate to login screen
      navigation.navigate('LoginScreen');
    } else {
      // User is logged in, show donate modal
      setDonateModal(true);
    }
  };

  // Handle phone call
  const handlePhoneCall = () => {
    if (masjid?.contact) {
      // Clean the phone number - remove spaces, dashes, and other characters
      let cleanPhone = masjid.contact.replace(/[\s\-\(\)\.]/g, '');
      
      // Remove any non-numeric characters except +
      cleanPhone = cleanPhone.replace(/[^\d+]/g, '');
      
      // Check if it's a valid phone number
      if (cleanPhone.length >= 10) {
        console.log('Calling phone number:', cleanPhone);
        Linking.openURL(`tel:${cleanPhone}`).catch((err) => {
          console.error('Error opening phone dialer:', err);
          Alert.alert(
            'Phone Call',
            `Call ${masjid.contact}?`,
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Call', onPress: () => Linking.openURL(`tel:${cleanPhone}`) }
            ]
          );
        });
      } else {
        Alert.alert('Invalid Phone Number', 'The phone number format is invalid.');
      }
    } else {
      Alert.alert('No Contact Info', 'Contact information is not available for this masjid.');
    }
  };

  return (
    <View style={styles.flex1}>
      <StatusBar style="light" />
      <ImageBackground
        source={masjidBackground}
        style={styles.bgImage}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          <View>
            <TouchableOpacity onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else {
                navigation.navigate('SelectionScreen');
              }
            }} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={25} color="#fff" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.85)', '#fff']}
          style={styles.fadeBottom}
          pointerEvents="none"
        />
        {/* Debug info for development */}
        {__DEV__ && (
          <View style={{ backgroundColor: '#f0f0f0', padding: 10, marginBottom: 10, borderRadius: 8 }}>
            <Text style={{ fontSize: 10, color: '#666' }}>
              User ID: {user?.id || 'Not logged in'}
            </Text>
            <Text style={{ fontSize: 10, color: '#666' }}>
              Masjid ID: {masjid._id}
            </Text>
            <Text style={{ fontSize: 10, color: '#666' }}>
              Is Favourite: {isFavourite ? 'Yes' : 'No'}
            </Text>
          </View>
        )}

        {/* Floating Card */}
        <FloatingCard />
        {/* Horizontal FlatList for announcements, below floating card */}
        <View style={styles.horizontalListContainer}>
          {!masjid?._id ? (
            <View style={styles.announcementCard}>
              <Ionicons name="megaphone-outline" size={28} color="#a7bd32" style={{ marginBottom: 6 }} />
              <Text style={styles.announcementTitle}>No Masjid Selected</Text>
              <Text style={styles.announcementDesc}>Please select a masjid to view announcements.</Text>
            </View>
          ) : loadingAnnouncements ? (
            <View style={styles.announcementCard}>
              <Ionicons name="hourglass-outline" size={28} color="#a7bd32" style={{ marginBottom: 6 }} />
              <Text style={styles.announcementTitle}>Loading...</Text>
              <Text style={styles.announcementDesc}>Fetching announcements...</Text>
            </View>
          ) : announcements.length === 0 ? (
            <View style={styles.announcementCard}>
              <Ionicons name="megaphone-outline" size={28} color="#a7bd32" style={{ marginBottom: 6 }} />
              <Text style={styles.announcementTitle}>No Announcements</Text>
              <Text style={styles.announcementDesc}>No announcements at this time.</Text>
            </View>
          ) : (
            <FlatList
              data={announcements}
              keyExtractor={(item, index) => item._id || `announcement-${index}`}
              renderItem={({ item }) => (
                <View style={styles.announcementCard}>
                  <Ionicons name="megaphone-outline" size={28} color="#a7bd32" style={{ marginBottom: 6 }} />
                  <Text style={styles.announcementTitle}>Announcement</Text>
                  <Text style={styles.announcementDesc}>{item.message}</Text>
                  {item.imam && (
                    <Text style={styles.announcementImam}>— {item.imam}</Text>
                  )}
                </View>
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          )}
        </View>
      </ImageBackground>
      {/* Donate Button fixed above tab bar */}
      <View style={styles.donateBtnContainer}>
        <TouchableOpacity style={styles.donateBtn} onPress={handleDonatePress}>
          <Ionicons name="cash-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.donateBtnText}>Donate</Text>
        </TouchableOpacity>
      </View>
      {/* Donate Modal */}
      <Modal
        visible={donateModal}
        animationType="slide"
        transparent
        onRequestClose={() => setDonateModal(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Donate to Masjid Construction</Text>
            <TextInput
              style={styles.input}
              placeholder="Your Name"
              value={donorName}
              onChangeText={setDonorName}
            />
            <TextInput
              style={styles.input}
              placeholder="Contact Number"
              value={donorContact}
              onChangeText={setDonorContact}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="Donation Amount (Rs)"
              value={donationAmount}
              onChangeText={setDonationAmount}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.modalDonateBtn} onPress={handleDonate}>
              <Text style={styles.modalDonateBtnText}>Donate Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setDonateModal(false)}>
              <Text style={styles.modalCloseBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      {/* Custom Alert */}
      <CustomAlert />
    </View>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1, backgroundColor: '#f9f9f9' },
  bgImage: {
    width: '100%',
    height: BG_HEIGHT,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
  },
  fadeBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 160,
    width: '100%',
    zIndex: 2,
  },
  safeArea: {
    flex: 1,
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  backBtn: {
    marginRight: 13,
    padding: 4,
    marginTop: 6,
    marginLeft: 8,
  },
  floatingCard: {
    position: 'absolute',
    top: CARD_TOP,
    width: width * 0.85,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    zIndex: 10,
    alignItems: 'flex-start',
    alignSelf: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
  },
  selectedIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
  },
  floatingMasjidName: {
    fontSize : RFValue(12),
    fontFamily: 'Roboto-Bold',
    color: '#000000',
    marginBottom: 9,
    maxWidth: '90%',
    paddingVertical: 4,
  },
  milesCard: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eeeeee',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },
  milesText: {
    color: '#000000',
    fontFamily: 'Roboto-Regular',
    fontSize : RFValue(12),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    paddingVertical: 4,
  },
  floatingAddress: {
    fontSize : RFValue(12),
    color: '#666',
    fontFamily: 'Roboto-Regular',
    flex: 1,
    flexWrap: 'wrap',
  },
  floatingPhone: {
    fontSize : RFValue(12),
    color: '#666',
    fontFamily: 'Roboto-Regular',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 2,
    width: '100%',
  },
  iconBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  horizontalListContainer: {
    position: 'absolute',
    top: CARD_TOP + width * 0.85 / 2 + 95,
    left: 0,
    right: 0,
    zIndex: 5,
    paddingVertical: 1,
  },
  horizontalList: {
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  announcementCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingBottom: 12,
    paddingTop: 9,
    paddingHorizontal: 12,
    marginRight: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    minWidth: width * 0.9,
    maxWidth: width * 0.8,
    marginBottom: 15,
    marginLeft: 12,
  },
  announcementTitle: {
    fontSize : RFValue(12),
    fontFamily: 'Roboto-Bold',
    color: '#222',
    marginBottom: 4,
  },
  announcementDesc: {
    fontSize : RFValue(12),
    color: '#666',
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
    marginBottom: 6,
  },
  announcementImam: {
    fontSize : RFValue(10),
    color: '#666',
    fontFamily: 'Roboto-Regular',
    marginTop: 4,
  },
  donationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 2,
  },
  donationLabel: {
    fontSize : RFValue(11),
    color: '#a7bd32',
    fontFamily: 'Roboto-Bold',
  },
  donationValue: {
    fontSize : RFValue(11),
    color: '#222',
    fontFamily: 'Roboto-Regular',
  },
  donateBtnContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 10,
    alignItems: 'center',
    zIndex: 100,
    marginTop: 5
  },
  donateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#a7bd32',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 38,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
  },
  donateBtnText: {
    color: '#fff',
    fontFamily: 'Roboto-Bold',
    fontSize : RFValue(12),
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: width * 0.88,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    elevation: 6,
  },
  modalTitle: {
    fontSize : RFValue(12),
    fontFamily: 'Roboto-Bold',
    color: '#a7bd32',
    marginBottom: 18,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize : RFValue(12),
    fontFamily: 'Roboto-Regular',
    color: '#222',
    backgroundColor: '#fafafa',
  },
  modalDonateBtn: {
    backgroundColor: '#a7bd32',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 8,
    marginBottom: 6,
  },
  modalDonateBtnText: {
    color: '#fff',
    fontFamily: 'Roboto-Bold',
    fontSize : RFValue(12),
  },
  modalCloseBtn: {
    marginTop: 2,
    padding: 8,
  },
  modalCloseBtnText: {
    color: '#a7bd32',
    fontFamily: 'Roboto-Bold',
    fontSize : RFValue(12),
  },
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    width: width * 0.8,
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  alertIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  alertTitle: {
    fontSize : RFValue(14),
    fontFamily: 'Roboto-Bold',
    color: '#222',
    marginBottom: 8,
    textAlign: 'center',
  },
  alertMessage: {
    fontSize : RFValue(12),
    color: '#666',
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
    marginBottom: 20,
  },
  alertButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  alertButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  cancelButtonText: {
    color: '#333',
    fontFamily: 'Roboto-Bold',
    fontSize : RFValue(12),
  },
  confirmButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: '#fff',
    fontFamily: 'Roboto-Bold',
    fontSize : RFValue(12),
  },
});