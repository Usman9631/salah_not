import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, GestureResponderEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';

type BackHeaderProps = {
  title: string;
  onBack: (event: GestureResponderEvent) => void;
};

const BackHeader: React.FC<BackHeaderProps> = ({ title, onBack }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={26} color="#000000" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <View style={{ width: 40 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffffff8',
    paddingVertical: 14,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backBtn: {
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  title: {
    color: '#000000',
    fontSize : RFValue(14),
    fontFamily: 'Roboto-Bold', // Use Roboto font for the title
    flex: 1,
    textAlign: 'center',
  },
});

export default BackHeader;