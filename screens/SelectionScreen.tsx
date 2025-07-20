import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import axios from 'axios';
import { MasjidContext } from '../context/MasjidContext';
import { useAuth } from '../context/AuthContext';
import Constants from 'expo-constants';

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

type City = {
  name: string;
  masajid: Masjid[];
};

type Country = {
  name: string;
  cities: City[];
};

type SelectionScreenProps = {
  navigation: any;
};

export default function SelectionScreen({ navigation }: SelectionScreenProps) {
  const masjidContext = React.useContext(MasjidContext);
  const { user, login } = useAuth();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'country' | 'city' | 'masjid'>('country');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);

  // Fetch masjids from database
  useEffect(() => {
    const fetchMasjids = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BACKEND_API_URL}/api/masjid/grouped`);
        if (response.data.success) {
          setCountries(response.data.countries);
        } else {
          setError('Failed to load masjids');
        }
      } catch (err) {
        console.error('Error fetching masjids:', err);
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMasjids();
  }, []);

  // Filter logic for each step
  let data: any[] = [];
  if (step === 'country') {
    data = countries.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  } else if (step === 'city' && selectedCountry) {
    data = selectedCountry.cities.filter(city =>
      city.name.toLowerCase().includes(search.toLowerCase())
    );
  } else if (step === 'masjid' && selectedCity) {
    data = selectedCity.masajid.filter(masjid =>
      masjid.name.toLowerCase().includes(search.toLowerCase()) ||
      masjid.address.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Handlers
  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setStep('city');
    setSearch('');
  };

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setStep('masjid');
    setSearch('');
  };

  // When user selects a masjid, navigate to MasjidProfileScreen with full masjid info
  const handleMasjidPress = async (masjid: Masjid) => {
    try {
      // Set masjid in context
      if (masjidContext?.setMasjid) {
        masjidContext.setMasjid(masjid);
      }

      // Add to favourites if user is logged in
      if (user?.id) {
        try {
          const res = await fetch(`${BACKEND_API_URL}/api/user/favourite-masjid`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, masjidId: masjid._id }),
          });

          if (res.ok) {
            // Update user's favourites in context
            const updatedFavourites = [...(user.favourites || []), masjid._id];
            if (login) {
              login({ ...user, favourites: updatedFavourites });
            }
          }
        } catch (error) {
          console.log('Error adding to favourites:', error);
        }
      }

      // Navigate to masjid profile
      navigation.navigate('MasjidProfile', { masjid });
    } catch (error) {
      console.error('Error selecting masjid:', error);
      Alert.alert('Error', 'Failed to select masjid');
    }
  };

  const handleBack = () => {
    if (step === 'masjid') {
      setStep('city');
      setSelectedCity(null);
      setSearch('');
    } else if (step === 'city') {
      setStep('country');
      setSelectedCountry(null);
      setSearch('');
    } else if (step === 'country') {
      // Go back to Dashboard if on country selection
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate('Dashboard');
      }
    }
  };

  // Renderers
  const renderCountry = ({ item }: { item: Country }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleCountrySelect(item)}>
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderCity = ({ item }: { item: City }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleCitySelect(item)}>
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderMasjid = ({ item }: { item: Masjid }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleMasjidPress(item)}>
      <Text style={styles.itemText}>{item.name}</Text>
      <Text style={styles.addressText}>{item.address}</Text>
    </TouchableOpacity>
  );

  let title = 'Select Country';
  if (step === 'city' && selectedCountry) title = `${selectedCountry.name}`;
  if (step === 'masjid' && selectedCity) title = `${selectedCity.name}`;

  // Always show back button, but disable it on the first step
  const isBackDisabled = false;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9f9f9' }} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Text style={styles.heading}>{title}</Text>
        <TouchableOpacity
          style={[styles.backBtn, isBackDisabled && { opacity: 0.5 }]}
          onPress={handleBack}
          disabled={isBackDisabled}
        >
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={
              step === 'country'
                ? 'Search country...'
                : step === 'city'
                ? 'Search city...'
                : 'Search masjid or address...'
            }
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#a7bd32"
          />
        </View>
        {loading ? (
          <ActivityIndicator color="#a7bd32" size="large" style={{ marginTop: 40 }} />
        ) : error ? (
          <Text style={{ color: 'red', marginVertical: 20 }}>{error}</Text>
        ) : (
          <FlatList
            data={data}
            renderItem={
              step === 'country'
                ? renderCountry as any
                : step === 'city'
                ? renderCity as any
                : renderMasjid as any
            }
            keyExtractor={item =>
              step === 'country'
                ? (item as Country).name
                : step === 'city'
                ? (item as City).name
                : (item as Masjid)._id
            }
            ListEmptyComponent={
              <Text style={{ color: '#a7bd32', textAlign: 'center', marginTop: 20 }}>
                {step === 'country'
                  ? 'No countries found.'
                  : step === 'city'
                  ? 'No cities found.'
                  : 'No masajid found.'}
              </Text>
            }
          />
        )}
        {step === 'masjid' && (
          <TouchableOpacity style={styles.registerBtn} onPress={() => navigation.replace('MainApp')}>
            <Text style={styles.registerText}>Register a Masjid</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

// Make sure MasjidProfileScreen is registered in your navigator (e.g. HomeStack.tsx):
// <Stack.Screen name="MasjidProfile" component={MasjidProfileScreen} options={{ title: 'Masjid Profile' }} />

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heading: {
    fontSize : RFValue(13),
    fontFamily: 'Roboto-Bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#000000',
  },
  input: {
    flex: 1,
    paddingBottom: 5,
    borderRadius: 8,
    marginBottom: 10,
    fontFamily: 'Roboto-Regular',
    color: '#000000',
    fontSize : RFValue(13),
  },
  item: {
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize : RFValue(13),
    color: '#000000',
    fontFamily: 'Roboto-Regular',
  },
  addressText: {
    fontSize : RFValue(13),
    color: '#6c6c6c',
    fontFamily: 'Roboto-Regular',
  },
  registerBtn: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    color: '#007bff',
    textDecorationLine: 'underline',
    fontFamily: 'Roboto-Regular',
    fontSize : RFValue(13),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#c1c1c1',
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  backBtnText: {
    color: '#000000',
    fontFamily: 'Roboto-Regular',
    fontSize : RFValue(15),
  },
});