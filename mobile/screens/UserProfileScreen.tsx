import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useAuth } from '../context/AuthContext';
import Constants from 'expo-constants';

const BACKEND_API_URL = Constants.expoConfig?.extra?.BACKEND_API_URL;

export default function UserProfileScreen({ navigation }: { navigation: any }) {
  // Get user from AuthContext
  const { user, login, logout } = useAuth();

  // Fallback if user is null
  const initialUser = user || {
    name: 'User Name',
    email: 'your@email.com',
    phoneNumber: '',
    address: '',
    avatar: null,
    id: '',
  };

  // Edit modal state (initialize from context)
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [editFields, setEditFields] = useState({
    name: initialUser.name,
    email: initialUser.email,
    phoneNumber: initialUser.phoneNumber || '',
    address: initialUser.address || '',
  });

  // Dummy static data
  const donations = [
    { id: '1', date: '2024-06-01', amount: 500, masjid: 'Masjid Al-Falah' },
    { id: '2', date: '2024-05-15', amount: 1000, masjid: 'Masjid Noor' },
  ];
  const favouriteMasajids = [
    'Masjid Al-Falah',
    'Masjid Noor',
    'Masjid Rahma',
  ];
  const paymentMethods = [
    { id: 'pm1', type: 'Bank', name: 'Meezan Bank', account: '1234-567890-1' },
    { id: 'pm2', type: 'JazzCash', name: 'JazzCash', account: '03001234567' },
    { id: 'pm3', type: 'EasyPaisa', name: 'EasyPaisa', account: '03007654321' },
  ];

  // Card toggles
  const [showPersonalInfo, setShowPersonalInfo] = useState(true);
  const [showDonations, setShowDonations] = useState(false);
  const [showFavourites, setShowFavourites] = useState(false);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);

  // Other modal states
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [passwordFields, setPasswordFields] = useState({ current: '', new: '' });
  const [changePaymentModal, setChangePaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0].id);
  const [logoutModal, setLogoutModal] = useState(false);

  // ---- EDIT PROFILE ----
  const handleSaveProfile = async () => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id, // yahan id bhejna zaruri hai (backend aisa bana ho)
          name: editFields.name,
          email: editFields.email,
          phoneNumber: editFields.phoneNumber,
          address: editFields.address,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        login(data.user); // context update
        Alert.alert('Success', 'Profile updated successfully!');
      } else {
        Alert.alert('Failed', data.message || 'Profile update failed');
      }
      setEditProfileModal(false);
    } catch (err) {
      Alert.alert('Error', 'Network or server error');
      setEditProfileModal(false);
    }
  };

  
  // Save password
const handleSavePassword = async () => {
  if (!passwordFields.current || !passwordFields.new) {
    Alert.alert('Error', 'Please enter both current and new password');
    return;
  }
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/auth/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user?.id, // user ki id context se
        currentPassword: passwordFields.current,
        newPassword: passwordFields.new,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      Alert.alert('Success', 'Password updated successfully!');
      setChangePasswordModal(false);
      setPasswordFields({ current: '', new: '' });
    } else {
      Alert.alert('Failed', data.message || 'Could not update password');
    }
  } catch (err) {
    Alert.alert('Error', 'Network or server error');
  }
};


  // Save payment method (still dummy)
  const handleSavePayment = () => {
    setChangePaymentModal(false);
    Alert.alert('Payment Method Changed', 'Your payment method has been updated.');
  };

  // Real logout
  const handleLogout = () => {
    setLogoutModal(false);
    logout();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
        <Ionicons name="arrow-back" size={28} color="#222" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarOuter}>
          <View style={styles.avatarContainer}>
            {initialUser.avatar ? (
              <Image source={{ uri: initialUser.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={54} color="#a7bd32" />
              </View>
            )}
          </View>
          <Text style={styles.profileName}>{initialUser.name}</Text>
        </View>
        {/* Personal Info Card */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.cardTitleRow}
            onPress={() => setShowPersonalInfo((prev) => !prev)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={showPersonalInfo ? 'chevron-down' : 'chevron-forward'}
              size={22}
              color="#a7bd32"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.cardTitle}>Personal Info</Text>
          </TouchableOpacity>
          {showPersonalInfo && (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Name</Text>
                <Text style={styles.infoValue}>{user?.name || '-'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user?.email || '-'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{user?.phoneNumber || '-'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Address</Text>
                <Text style={styles.infoValue}>{user?.address || '-'}</Text>
              </View>
            </>
          )}
        </View>
        {/* Donations Card */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.cardTitleRow}
            onPress={() => setShowDonations((prev) => !prev)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={showDonations ? 'chevron-down' : 'chevron-forward'}
              size={22}
              color="#a7bd32"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.cardTitle}>Donations</Text>
          </TouchableOpacity>
          {showDonations && (
            donations.length > 0 ? (
              donations.map(d => (
                <View style={styles.infoRow} key={d.id}>
                  <Text style={styles.infoLabel}>{d.masjid}</Text>
                  <Text style={styles.infoValue}>Rs {d.amount} - {d.date}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.infoValue}>No donations yet.</Text>
            )
          )}
        </View>
        {/* Favourite Masajids Card */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.cardTitleRow}
            onPress={() => setShowFavourites((prev) => !prev)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={showFavourites ? 'chevron-down' : 'chevron-forward'}
              size={22}
              color="#a7bd32"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.cardTitle}>Favourite Masajids</Text>
          </TouchableOpacity>
          {showFavourites && (
            favouriteMasajids.length > 0 ? (
              favouriteMasajids.map((masjid, idx) => (
                <View style={styles.infoRow} key={masjid + idx}>
                  <Text style={styles.infoValue}>{masjid}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.infoValue}>No favourite masajids.</Text>
            )
          )}
        </View>
        {/* Donation Payment Methods Card */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.cardTitleRow}
            onPress={() => setShowPaymentMethods((prev) => !prev)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={showPaymentMethods ? 'chevron-down' : 'chevron-forward'}
              size={22}
              color="#a7bd32"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.cardTitle}>Donation Payment Methods</Text>
          </TouchableOpacity>
          {showPaymentMethods && (
            paymentMethods.length > 0 ? (
              paymentMethods.map((pm) => (
                <View style={styles.infoRow} key={pm.id}>
                  <Text style={styles.infoLabel}>{pm.type}: {pm.name}</Text>
                  <Text style={styles.infoValue}>{pm.account}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.infoValue}>No payment methods available.</Text>
            )
          )}
        </View>
        {/* Settings Card */}
        <View style={styles.settingsCard}>
          <View style={styles.settingsHeader}>
            <Ionicons name="settings-outline" size={20} color="#a7bd32" style={{ marginRight: 8 }} />
            <Text style={styles.settingsTitle}>Settings</Text>
          </View>
          <TouchableOpacity style={styles.settingsItem} onPress={() => {
            setEditFields({
              name: user?.name || '',
              email: user?.email || '',
              phoneNumber: user?.phoneNumber || '',
              address: user?.address || '',
            });
            setEditProfileModal(true);
          }}>
            <Text style={styles.settingsText}>Edit Profile</Text>
          </TouchableOpacity>
          <View style={styles.settingsDivider} />
          <TouchableOpacity style={styles.settingsItem} onPress={() => setChangePaymentModal(true)}>
            <Text style={styles.settingsText}>Change Payment Method</Text>
          </TouchableOpacity>
          <View style={styles.settingsDivider} />
          <TouchableOpacity style={styles.settingsItem} onPress={() => setChangePasswordModal(true)}>
            <Text style={styles.settingsText}>Change Password</Text>
          </TouchableOpacity>
          <View style={styles.settingsDivider} />
          <TouchableOpacity style={styles.settingsItem} onPress={() => setLogoutModal(true)}>
            <Text style={[styles.settingsText, { color: '#e74c3c' }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={editProfileModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Name"
              value={editFields.name}
              onChangeText={v => setEditFields(f => ({ ...f, name: v }))}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Email"
              value={editFields.email}
              onChangeText={v => setEditFields(f => ({ ...f, email: v }))}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Phone Number"
              value={editFields.phoneNumber}
              onChangeText={v => setEditFields(f => ({ ...f, phoneNumber: v }))}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Address"
              value={editFields.address}
              onChangeText={v => setEditFields(f => ({ ...f, address: v }))}
              autoCapitalize="words"
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 }}>
              <TouchableOpacity onPress={() => setEditProfileModal(false)}>
                <Text style={{ color: '#000000', fontWeight: 'bold' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveProfile}>
                <Text style={{ color: '#a7bd32', fontWeight: 'bold' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal visible={changePasswordModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Current Password"
              value={passwordFields.current}
              onChangeText={v => setPasswordFields(f => ({ ...f, current: v }))}
              secureTextEntry
            />
            <TextInput
              style={styles.modalInput}
              placeholder="New Password"
              value={passwordFields.new}
              onChangeText={v => setPasswordFields(f => ({ ...f, new: v }))}
              secureTextEntry
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 }}>
              <TouchableOpacity onPress={() => setChangePasswordModal(false)}>
                <Text style={{ color: '#000000', fontWeight: 'bold' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSavePassword}>
                <Text style={{ color: '#a7bd32', fontWeight: 'bold' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Change Payment Method Modal */}
      <Modal visible={changePaymentModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Payment Method</Text>
            {paymentMethods.map(pm => (
              <TouchableOpacity
                key={pm.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 10,
                }}
                onPress={() => setSelectedPayment(pm.id)}
              >
                <Ionicons
                  name={selectedPayment === pm.id ? 'radio-button-on' : 'radio-button-off'}
                  size={20}
                  color="#a7bd32"
                  style={{ marginRight: 8 }}
                />
                <Text style={{ fontFamily: 'Roboto-Regular', fontSize: RFValue(14) }}>
                  {pm.type}: {pm.name} ({pm.account})
                </Text>
              </TouchableOpacity>
            ))}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 }}>
              <TouchableOpacity onPress={() => setChangePaymentModal(false)}>
                <Text style={{ color: '#000000', fontWeight: 'bold' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSavePayment}>
                <Text style={{ color: '#a7bd32', fontWeight: 'bold' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal visible={logoutModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Are you sure you want to logout?</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 }}>
              <TouchableOpacity onPress={() => setLogoutModal(false)}>
                <Text style={{ color: '#222', fontWeight: 'bold' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLogout}>
                <Text style={{ color: '#ff0000', fontWeight: 'bold' }}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ...styles code remains unchanged...

// ...styles remain same as above
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: {
    paddingTop: 90,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 48,
    left: 18,
    zIndex: 10,
    padding: 4,
  },
  avatarOuter: {
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: '#a7bd32',
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#a7bd32',
  },
  profileName: {
    fontSize : RFValue(16),
    fontFamily: 'Roboto-Bold',
    color: '#222',
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize : RFValue(14),
    fontFamily: 'Roboto-Regular',
    color: '#000000',
    textAlign: 'left',
  },
  infoRow: {
    marginBottom: 10,
  },
  infoLabel: {
    fontSize : RFValue(13),
    color: '#a7bd32',
    fontFamily: 'Roboto-Bold',
    marginBottom: 2,
    textAlign: 'left',
  },
  infoValue: {
    fontSize : RFValue(12),
    color: '#222',
    fontFamily: 'Roboto-Regular',
    textAlign: 'left',
  },
  settingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  settingsTitle: {
    fontSize : RFValue(14),
    fontFamily: 'Roboto-Bold',
    color: '#a7bd32',
  },
  settingsItem: {
    paddingVertical: 10,
    paddingHorizontal: 2,
  },
  settingsText: {
    fontSize : RFValue(13),
    color: '#222',
    fontFamily: 'Roboto-Regular',
  },
  settingsDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 2,
    width: '100%',
  },
  settingsCard: {
    width: '100%',
    borderRadius: 16,
    padding: 8,
    marginBottom: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize : RFValue(14),
    fontFamily: 'Roboto-Regular',
    color: '#a7bd32',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontFamily: 'Roboto-Regular',
    fontSize : RFValue(12),
    color: '#222',
  },
});