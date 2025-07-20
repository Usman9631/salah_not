import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, GestureResponderEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';

type HeaderProps = {
  title: string;
  onLocationPress: (event: GestureResponderEvent) => void;
  onReminderPress: (event: GestureResponderEvent) => void;
};

const Header: React.FC<HeaderProps> = ({
  title,
  onLocationPress,
  onReminderPress,
}) => {
  return (
    <View style={styles.header}>
      {/* Left: Location Icon */}
      <TouchableOpacity onPress={onLocationPress} style={styles.leftIcon}>
        <Ionicons name="location" size={30} color="#a7bd32" />
      </TouchableOpacity>

      <Text style={styles.headerText}>{title}</Text>

      {/* Right: Reminder Icon */}
      <TouchableOpacity onPress={onReminderPress} style={styles.rightIcon}>
        <Ionicons name="notifications-outline" size={30} color="#000000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    backgroundColor: '#ffffff',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  leftIcon: {
    width: 32,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerText: {
    color: '#000000',
    fontSize : RFValue(14),
    fontFamily: 'Inter-Bold',
    flex: 1,
    textAlign: 'left',
  },
  rightIcon: {
    width: 32,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});

export default Header;