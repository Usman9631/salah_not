import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import React, { useState } from 'react';
import BackHeader from '../components/BackHeader';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CELL_WIDTH = Math.floor((SCREEN_WIDTH - 16 - (8 * 6)) / 7); // 7 columns, 8px marginRight per cell except last
const CELL_HEIGHT = 56; // Increased height for better appearance

const generateMonthData = (month: string, days: number) => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return Array.from({ length: days }, (_, i) => ({
    date: (i + 1).toString(),
    fajrAdhan: `05:${pad((30 + i) % 60)}`,
    fajrIqamah: `05:${pad((45 + i) % 60)}`,
    sunrise: `06:${pad((10 + i) % 60)}`,
    dhuhrAdhan: `12:${pad((30 + i) % 60)}`,
    dhuhrIqamah: `12:${pad((45 + i) % 60)}`,
    asrAdhan: `15:${pad((45 + i) % 60)}`,
    asrIqamah: `16:${pad((0 + i) % 60)}`,
    maghribAdhan: `18:${pad((10 + i) % 60)}`,
    maghribIqamah: `18:${pad((20 + i) % 60)}`,
    ishaAdhan: `19:${pad((30 + i) % 60)}`,
    ishaIqamah: `19:${pad((45 + i) % 60)}`,
  }));
};

const months = [
  { name: 'January', days: 31 },
  { name: 'February', days: 29 },
  { name: 'March', days: 31 },
  { name: 'April', days: 30 },
  { name: 'May', days: 31 },
  { name: 'June', days: 30 },
  { name: 'July', days: 31 },
  { name: 'August', days: 31 },
  { name: 'September', days: 30 },
  { name: 'October', days: 31 },
  { name: 'November', days: 30 },
  { name: 'December', days: 31 },
];

function AdhanIqamahCell({ adhan, iqamah }: { adhan: string; iqamah: string }) {
  return (
    <View style={styles.adhanIqamahCell}>
      <View style={styles.adhanHalf}>
        <Text style={styles.adhanText}>{adhan}</Text>
      </View>
      <View style={styles.iqamahHalf}>
        <Text style={styles.iqamahText}>{iqamah}</Text>
      </View>
    </View>
  );
}

export default function YearlyPrayerScreen({ navigation }: { navigation: any }) {
  const [monthIdx, setMonthIdx] = useState(0);

  const handlePrev = () => {
    setMonthIdx(idx => (idx === 0 ? months.length - 1 : idx - 1));
  };
  const handleNext = () => {
    setMonthIdx(idx => (idx === months.length - 1 ? 0 : idx + 1));
  };

  const month = months[monthIdx];
  const monthData = generateMonthData(month.name, month.days);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#2e2d2d' }} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <BackHeader title="Yearly Prayer" onBack={() => navigation.goBack()} />
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={handlePrev} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={28} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.heading}>{month.name}</Text>
        <TouchableOpacity onPress={handleNext} style={styles.navBtn}>
          <Ionicons name="chevron-forward" size={28} color="#ffffff" />
        </TouchableOpacity>
      </View>
      <ScrollView horizontal={false} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[styles.table, { width: SCREEN_WIDTH - 16 }]}>
            <View style={[styles.row, styles.tableHeaderRow]}>
              <View style={styles.dateCellBg}>
                <Text style={styles.dateCellText}>Date</Text>
              </View>
              <Text style={[styles.headerCell]}>Fajr</Text>
              <Text style={[styles.headerCell, styles.headerCell]}>Sunrise</Text>
              <Text style={[styles.headerCell]}>Dhuhr</Text>
              <Text style={[styles.headerCell]}>Asr</Text>
              <Text style={[styles.headerCell]}>Maghrib</Text>
              <Text style={[styles.headerCell]}>Isha</Text>
            </View>
            {monthData.map((item, idx) => (
              <View key={item.date} style={styles.row}>
                <View style={styles.dateCellBg}>
                  <Text style={styles.dateCellText}>{item.date}</Text>
                </View>
                <AdhanIqamahCell adhan={item.fajrAdhan} iqamah={item.fajrIqamah} />
                <Text style={[styles.cell, styles.sunriseCell]}>{item.sunrise}</Text>
                <AdhanIqamahCell adhan={item.dhuhrAdhan} iqamah={item.dhuhrIqamah} />
                <AdhanIqamahCell adhan={item.asrAdhan} iqamah={item.asrIqamah} />
                <AdhanIqamahCell adhan={item.maghribAdhan} iqamah={item.maghribIqamah} />
                <AdhanIqamahCell adhan={item.ishaAdhan} iqamah={item.ishaIqamah} />
              </View>
            ))}
          </View>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 8,
    paddingBottom: 16,
  },
  heading: {
    fontSize: 18,
    fontFamily: 'Inter-Bold', // Inter Bold for heading
    textAlign: 'center',
    color: '#ffffff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 4,
    backgroundColor: '#000000',
  },
  navBtn: {
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  table: {
    borderRadius: 6,
    overflow: 'hidden',
    width: SCREEN_WIDTH - 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tableHeaderRow: {
    backgroundColor: '#2e2d2d',
    marginBottom: 8,
  },
  headerCell: {
    color: '#ffffff',
    fontFamily: 'Inter-Bold', // Inter Bold for table headers
    textAlign: 'center',
    fontSize: 15,
    width: CELL_WIDTH,
    height: CELL_HEIGHT,
    lineHeight: CELL_HEIGHT,
    backgroundColor: '#000000',
    borderRadius: 8,
    marginRight: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.10,
    shadowRadius: 2,
  },
  cell: {
    color: '#39f200',
    textAlign: 'center',
    fontSize: 14,
    width: CELL_WIDTH,
    height: CELL_HEIGHT,
    lineHeight: CELL_HEIGHT,
    fontFamily: 'Inter-Regular', // Inter Regular for table cells
    backgroundColor: '#fff',
    borderRadius: 8,
    marginRight: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.10,
    shadowRadius: 2,
  },
  dateCellBg: {
    width: CELL_WIDTH,
    height: CELL_HEIGHT,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginRight: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.10,
    shadowRadius: 2,
  },
  dateCellText: {
    color: '#fff',
    fontFamily: 'Inter-Bold', // Inter Bold for date cell
    fontSize: 15,
    textAlign: 'center',
  },
  sunriseCell: {
    color: '#ffffff',
    fontFamily: 'Inter-Bold', // Inter Bold for sunrise cell
    fontSize: 14,
    width: CELL_WIDTH,
    height: CELL_HEIGHT,
    lineHeight: CELL_HEIGHT,
    backgroundColor: '#3e3d3d',
    textAlign: 'center',
    borderRadius: 8,
    marginRight: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.10,
    shadowRadius: 2,
  },
  adhanIqamahCell: {
    width: CELL_WIDTH,
    height: CELL_HEIGHT,
    flexDirection: 'column',
    backgroundColor: '#3e3d3d',
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 8,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1.10,
    shadowRadius: 7,
  },
  adhanHalf: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  iqamahHalf: {
    flex: 1,
    backgroundColor: '#3f3e3e',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  adhanText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    width: '100%',
    fontFamily: 'Inter-Regular', // Inter Regular for adhan text
  },
  iqamahText: {
    color: '#ffffff',
    fontSize: 14,
    textAlign: 'center',
    width: '100%',
    fontFamily: 'Inter-Regular', // Inter Regular for iqamah text
  },
  });