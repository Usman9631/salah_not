import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';

type PrayerTiming = {
  name: string;
  azan: string;
  iqamah: string;
  nameAr?: string;
};

type PrayerTimingsTableProps = {
  timings?: PrayerTiming[];
};

// Arabic names without "ال"
const arabicNames: Record<string, string> = {
  Fajr: 'فجر',
  Dhuhr: 'ظهر',
  Asr: 'عصر',
  Maghrib: 'مغرب',
  Isha: 'عشاء',
  Jummah: 'جمعة',
};

// Prayer icons mapping
const prayerIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  Fajr: 'cloudy-night-outline',
  Dhuhr: 'sunny-outline',
  Asr: 'partly-sunny-outline',
  Maghrib: 'moon-outline',
  Isha: 'moon-sharp',
  Jummah: 'people-outline',
};

// Helper to get minutes from "HH:mm AM/PM"
function getMinutes(time: string): number {
  if (!time) return 0;
  const parts = time.trim().split(' ');
  const timePart = parts[0];
  const ampm = (parts[1] || '').toUpperCase();
  let [h, m] = timePart.split(':').map(Number);

  if (ampm === 'PM' && h !== 12) h += 12;
  if (ampm === 'AM' && h === 12) h = 0;

  if (isNaN(h) || isNaN(m)) return 0;
  return h * 60 + m;
}

// Helper to display as "h:mm AM/PM"
function to12Hour(time: string): string {
  if (!time) return '';
  const parts = time.trim().split(' ');
  const timePart = parts[0];
  const ampm = (parts[1] || '').toUpperCase();
  let [h, m] = timePart.split(':').map(Number);

  if (isNaN(h) || isNaN(m)) return time;
  return `${h}:${m.toString().padStart(2, '0')} ${ampm}`;
}

const PrayerTimingsTable: React.FC<PrayerTimingsTableProps> = ({ timings }) => {
  // If timings is empty or not provided, use dummy data
  const dummy: PrayerTiming[] = [
    { name: 'Fajr', azan: '05:00 AM', iqamah: '05:30 AM', nameAr: arabicNames.Fajr },
    { name: 'Dhuhr', azan: '01:15 PM', iqamah: '01:30 PM', nameAr: arabicNames.Dhuhr },
    { name: 'Asr', azan: '05:00 PM', iqamah: '05:15 PM', nameAr: arabicNames.Asr },
    { name: 'Maghrib', azan: '07:30 PM', iqamah: '07:40 PM', nameAr: arabicNames.Maghrib },
    { name: 'Isha', azan: '09:00 PM', iqamah: '09:15 PM', nameAr: arabicNames.Isha },
  ];

  const timingsWithArabic: PrayerTiming[] = (timings && timings.length > 0 ? timings : dummy).map(t => ({
    ...t,
    nameAr: t.nameAr || arabicNames[t.name] || ''
  }));

  // Find the next upcoming prayer (whose azan time is after now)
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  let nextIdx = timingsWithArabic.findIndex(t => getMinutes(t.azan) > nowMinutes);
  if (nextIdx === -1 && timingsWithArabic.length > 0) nextIdx = timingsWithArabic.length - 1;

  return (
    <View style={styles.table}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={[styles.prayerCol, styles.headerCell]}>
          <Text style={styles.headerText}>Prayer</Text>
        </View>
        <View style={[styles.arabicCol, styles.headerCell]}>
          <Text style={styles.headerText}></Text>
        </View>
        <View style={[styles.timeCol, styles.headerCell]}>
          <Text style={styles.headerText}>Azan</Text>
        </View>
        <View style={[styles.timeCol, styles.headerCell]}>
          <Text style={styles.headerText}>Iqamah</Text>
        </View>
      </View>
      <View style={styles.horizontalLine} />
      {/* Data Rows */}
      {timingsWithArabic.map((row, idx) => (
        <View
          style={styles.dataRow}
          key={row.name + idx}
        >
          <View style={styles.prayerCol}>
            <View style={styles.prayerNameIconWrap}>
              <Ionicons
                name={prayerIcons[row.name] || 'ellipse-outline'}
                size={18}
                color={idx === nextIdx ? "#a7bd32" : "#000"}
                style={{ marginRight: 6 }}
              />
              <Text style={[
                styles.prayerNameCell,
                idx === nextIdx ? styles.upcomingCell : styles.greyCell
              ]}>{row.name}</Text>
            </View>
          </View>
          <View style={styles.arabicCol}>
            <Text style={[
              styles.arabic,
              idx === nextIdx ? styles.upcomingCell : styles.greyCell
            ]}>{row.nameAr}</Text>
          </View>
          <View style={styles.timeCol}>
            <Text style={[
              styles.timeCell,
              idx === nextIdx ? styles.upcomingCell : styles.greyCell
            ]}>{to12Hour(row.azan)}</Text>
          </View>
          <View style={styles.timeCol}>
            <Text style={[
              styles.timeCell,
              idx === nextIdx ? styles.upcomingCell : styles.greyCell
            ]}>{to12Hour(row.iqamah)}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};
export default PrayerTimingsTable;

const styles = StyleSheet.create({
  table: {
    marginTop: 24,
    overflow: 'hidden',
    minWidth: 360,
    width: '85%',
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
  },
  dataRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff',
    minHeight: 60,
    alignItems: 'center',
  },
  prayerCol: {
    flex: 2,
    justifyContent: 'center',
  },
  arabicCol: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeCol: {
    flex: 1.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCell: {
    paddingVertical: 16,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 16,
  },
  headerText: {
    color: '#b1b1b1',
    fontSize : RFValue(12),
    fontFamily: 'Inter-Regular',
    textAlign: 'left',
  },
  prayerNameIconWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
  },
  prayerNameCell: {
    fontSize : RFValue(11),
    fontFamily: 'Inter-Regular',
    textAlign: 'left',
    color: '#333',
    paddingVertical: 6,
  },
  arabic: {
    fontFamily: 'Inter-Regular',
    fontSize : RFValue(12),
    color: '#333',
    textAlign: 'center',
    paddingVertical: 6,
  },
  timeCell: {
    fontFamily: 'Inter-Regular',
    fontSize : RFValue(11),
    color: '#333',
    textAlign: 'center',
    paddingVertical: 6,
  },
  upcomingCell: {
    color: '#a7bd32',
    fontFamily: 'Inter-Bold',
  },
  greyCell: {
    color: '#000000',
    fontFamily: 'Inter-Regular',
  },
  horizontalLine: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 2,
    width: '94%',
    marginHorizontal: 20,
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
});