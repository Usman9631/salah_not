import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../context/AuthContext';
import { RFValue } from 'react-native-responsive-fontsize';
import { MasjidContext } from '../context/MasjidContext';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: DEVICE_WIDTH } = Dimensions.get('window');
const BACKEND_API_URL = Constants.expoConfig?.extra?.BACKEND_API_URL || 'http://192.168.18.96:4000';

type Masjid = {
  _id: string;
  name: string;
  address: string;
  imam: string;
  contact: string;
  image: string | null;
  description: string;
  timings: {
    Fajr: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
    Jummah: string;
  };
};

export default function FavouriteMasajidScreen({ navigation }: { navigation: any }) {
  const [favourites, setFavourites] = useState<Masjid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCustomAlert, setShowCustomAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    type: 'info', // 'info', 'success', 'error', 'warning'
    onConfirm: () => {},
    onCancel: () => {},
    showCancel: true
  });

  const { user, login } = useAuth();
  const masjidContext = React.useContext(MasjidContext);

  // Fetch from backend on mount or on focus
  useEffect(() => {
    const fetchFavourites = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (!user?.id) {
          // Load local favorites for non-logged-in users
          const localFavourites = await AsyncStorage.getItem('localFavourites');
          if (localFavourites) {
            const favourites = JSON.parse(localFavourites);
            setFavourites(favourites);
          } else {
            setFavourites([]);
          }
        } else {
          // Load server favorites for logged-in users
          console.log('Fetching favourites for user:', user.id);
          const res = await fetch(`${BACKEND_API_URL}/api/user/${user.id}/favourite-masjids`);
          console.log('Response status:', res.status);
          
          if (res.ok) {
            const data = await res.json();
            console.log('Favourites data:', data);
            setFavourites(data.favouriteMasajids || []);
          } else {
            console.error('Failed to fetch favourites:', res.status);
            setError('Failed to load favourites');
          }
        }
      } catch (err) {
        console.error('Error fetching favourites:', err);
        setError('Failed to load favourites');
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, [user?.id]);

  // Add or Remove
  const handleUnfavourite = async (masjid: Masjid) => {
    if (!user?.id) {
      // Handle local favorites removal
      try {
        const localFavourites = await AsyncStorage.getItem('localFavourites');
        if (localFavourites) {
          let favourites = JSON.parse(localFavourites);
          favourites = favourites.filter((fav: any) => fav._id !== masjid._id);
          await AsyncStorage.setItem('localFavourites', JSON.stringify(favourites));
          setFavourites(favourites);
          
          showAlert({
            title: '✅ Success!',
            message: `${masjid.name} has been removed from your favourites.`,
            type: 'success',
            onConfirm: () => {},
            onCancel: () => {},
            showCancel: false
          });
        }
      } catch (err) {
        console.error('Error removing local favourite:', err);
        showAlert({
          title: '❌ Error',
          message: 'Failed to remove from favourites. Please try again.',
          type: 'error',
          onConfirm: () => {},
          onCancel: () => {},
          showCancel: false
        });
      }
      return;
    }

    // Show beautiful confirmation dialog
    showAlert({
      title: '💔 Remove from Favourites',
      message: `Are you sure you want to remove "${masjid.name}" from your favourites?\n\nThis action cannot be undone.`,
      type: 'warning',
      onConfirm: async () => {
        try {
          console.log('Removing favourite:', masjid.name, 'for user:', user.id);
          
          const res = await fetch(`${BACKEND_API_URL}/api/user/favourite-masjid`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, masjidId: masjid._id }),
          });
          
          console.log('Response status:', res.status);
          const data = await res.json();
          console.log('Response data:', data);
          
          if (res.ok && data.success) {
            // Update local state immediately
            setFavourites(prev => prev.filter(fav => fav._id !== masjid._id));
            // Optionally update context
            if (login) {
              // Update user's favourites in context
              const updatedFavourites = user.favourites?.filter(id => id !== masjid._id) || [];
              login({ ...user, favourites: updatedFavourites });
            }
            
            // Show success message
            showAlert({
              title: '✅ Success!',
              message: `${masjid.name} has been removed from your favourites.`,
              type: 'success',
              onConfirm: () => {},
              onCancel: () => {},
              showCancel: false
            });
          } else {
            showAlert({
              title: '❌ Failed',
              message: data.message || 'Failed to remove from favourites. Please try again.',
              type: 'error',
              onConfirm: () => {},
              onCancel: () => {},
              showCancel: false
            });
          }
        } catch (e) {
          console.error('Error removing favourite:', e);
          showAlert({
            title: '🌐 Network Error',
            message: 'Unable to connect to server. Please check your internet connection and try again.',
            type: 'error',
            onConfirm: () => {},
            onCancel: () => {},
            showCancel: false
          });
        }
      },
      onCancel: () => {},
      showCancel: true
    });
  };

  const handlePress = (masjid: Masjid) => {
    try {
      console.log('Navigating to MasjidProfile with masjid:', masjid.name);
      
      // Set the masjid in context
      if (masjidContext?.setMasjid) {
        masjidContext.setMasjid(masjid);
      }
      
      // Navigate to Home stack first, then to MasjidProfile
      navigation.navigate('Home', {
        screen: 'MasjidProfile',
        params: { masjid }
      });
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Error', 'Failed to open masjid profile');
    }
  };

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
                  <Text style={styles.cancelButtonText}>
                    {alertConfig.type === 'info' ? 'Sign Up' : 'Cancel'}
                  </Text>
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
                   alertConfig.type === 'warning' ? 'Remove' : 
                   alertConfig.type === 'info' ? 'Login' : 'Confirm'}
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

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={['top', 'left', 'right']}>
        <StatusBar style="dark" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: RFValue(13), fontFamily: 'Roboto-Regular', color: '#a7bd32' }}>
            Loading favourites...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9f9f9' }} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Text style={styles.heading}>Favourite Masajid</Text>
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <FlatList
            data={favourites}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.masjidCard}
                onPress={() => {
                  if (masjidContext?.setMasjid) {
                    masjidContext.setMasjid(item);
                  }
                  navigation.navigate('MasjidProfile', { masjid: item });
                }}
              >
                <View style={styles.masjidInfo}>
                  <Text style={styles.masjidName}>{item.name}</Text>
                  <Text style={styles.masjidAddress}>{item.address}</Text>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleUnfavourite(item)}
                >
                  <Ionicons name="heart-dislike" size={20} color="#e53e3e" />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="heart-outline" size={60} color="#a7bd32" />
                <Text style={styles.emptyText}>No favourite masajid yet</Text>
                <Text style={styles.emptySubText}>Add masajid to your favourites to see them here</Text>
              </View>
            }
          />
        )}
      </View>
      <CustomAlert />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  alertOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  alertContainer: {
    width: DEVICE_WIDTH * 0.8,
    borderRadius: 10,
    padding: 20,
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
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  alertTitle: {
    fontSize: RFValue(18),
    fontFamily: 'Roboto-Bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  alertMessage: {
    fontSize: RFValue(14),
    fontFamily: 'Roboto-Regular',
    color: '#666',
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
    fontSize: RFValue(16),
    fontFamily: 'Roboto-Medium',
    color: '#333',
  },
  confirmButton: {
    backgroundColor: '#a7bd32',
  },
  confirmButtonText: {
    fontSize: RFValue(16),
    fontFamily: 'Roboto-Medium',
    color: '#fff',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  heading: {
    fontSize: RFValue(24),
    fontFamily: 'Roboto-Bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorText: {
    fontSize: RFValue(16),
    fontFamily: 'Roboto-Regular',
    color: '#e53e3e',
    textAlign: 'center',
    marginBottom: 20,
  },
  masjidCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  masjidInfo: {
    flex: 1,
  },
  masjidName: {
    fontSize: RFValue(18),
    fontFamily: 'Roboto-Bold',
    color: '#333',
    marginBottom: 4,
  },
  masjidAddress: {
    fontSize: RFValue(14),
    fontFamily: 'Roboto-Regular',
    color: '#666',
  },
  removeButton: {
    padding: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: RFValue(18),
    fontFamily: 'Roboto-Medium',
    color: '#a7bd32',
    marginTop: 10,
  },
  emptySubText: {
    fontSize: RFValue(14),
    fontFamily: 'Roboto-Regular',
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
});