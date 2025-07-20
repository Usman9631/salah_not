import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';

const CLOCK_SIZE = 320;
const CENTER = CLOCK_SIZE / 2;
const HAND_LENGTHS = { hour: 90, minute: 125, second: 140 };
const HAND_WIDTHS = { hour: 10, minute: 6, second: 2 };

type PrayerTime = {
  name: string;
  time: string;
};

const PRAYER_TIMES: PrayerTime[] = [
  { name: 'Fajr', time: '04:15' },
  { name: 'Dhuhr', time: '12:30' },
  { name: 'Asr', time: '16:15' },
  { name: 'Maghrib', time: '19:45' },
  { name: 'Isha', time: '21:00' },
];

function getPrayerAngle(time: string): number {
  const [h, m] = time.split(':').map(Number);
  const totalMinutes = ((h % 12) * 60) + m;
  return (totalMinutes * 0.5) - 90;
}
function getHourMinute(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

type ClockProps = {
  prayerTimes?: PrayerTime[];
  isNight?: boolean;
};

export default function Clock({ prayerTimes = PRAYER_TIMES, isNight }: ClockProps) {
  const [time, setTime] = useState<Date>(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { hour, minute, second } = getRotation(time);

  // Get minutes for now, Fajr, and Isha
  const nowMinutes = time.getHours() * 60 + time.getMinutes();
  const fajrMinutes = getHourMinute(prayerTimes[0].time);
  const ishaMinutes = getHourMinute(prayerTimes[prayerTimes.length - 1].time);

  // If Isha has passed and before Fajr, show only Fajr
  // Otherwise, show all except Fajr if Fajr has passed
  let visiblePrayers: PrayerTime[];
  if (nowMinutes > ishaMinutes && nowMinutes < 24 * 60) {
    // After Isha and before midnight
    visiblePrayers = [prayerTimes[0]]; // Only Fajr
  } else if (nowMinutes < fajrMinutes) {
    // After midnight but before Fajr
    visiblePrayers = [prayerTimes[0]]; // Only Fajr
  } else {
    // After Fajr, show all except Fajr if it has passed
    visiblePrayers = prayerTimes.slice(1);
  }

  // Find the next upcoming prayer among visiblePrayers
  let nextPrayerIdx = -1;
  for (let i = 0; i < visiblePrayers.length; i++) {
    const [h, m] = visiblePrayers[i].time.split(':').map(Number);
    if (h * 60 + m > nowMinutes) {
      nextPrayerIdx = i;
      break;
    }
  }
  // If all have passed, highlight the last one
  if (nextPrayerIdx === -1 && visiblePrayers.length > 0) {
    nextPrayerIdx = visiblePrayers.length - 1;
  }

  // Colors for day/night mode
  const bgColor = isNight ? '#181b1b' : '#d4d9d9';
  const handColor = isNight ? '#d4d9d9' : '#858585';
  const minuteMarkColor = isNight ? '#bbb' : '#858585';
  const hourMarkColor = isNight ? '#d4d9d9' : '#858585';
  const labelColor = isNight ? '#d4d9d9' : '#b0b0b0';
  const nextLabelColor = '#fff';
  const nextLabelBg = isNight ? '#14a1b1' : '#14a1b1';
  const dotColor = isNight ? '#14a1b1' : '#14a1b1';
  const centerDotBg = isNight ? '#d4d9d9' : '#333232';
  const centerDotBorder = isNight ? '#14a1b1' : '#fff';
  const secondHandColor = isNight ? '#14a1b1' : '#e63946';

  // Hour marks
  const hourMarks = Array.from({ length: 12 }).map((_, i) => {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const markLength = 32;
    const markWidth = 6;
    const radius = CENTER - 24;
    const x = CENTER + Math.cos(angle) * radius;
    const y = CENTER + Math.sin(angle) * radius;
    return (
      <View
        key={i}
        style={[
          styles.hourMark,
          {
            width: markWidth,
            height: markLength,
            left: x - markWidth / 2,
            top: y - markLength / 2,
            backgroundColor: hourMarkColor,
            transform: [{ rotate: `${i * 30}deg` }],
          },
        ]}
      />
    );
  });

  // Minute marks
  const minuteMarks = Array.from({ length: 60 }).map((_, i) => {
    if (i % 5 === 0) return null;
    const angle = (i * 6 - 90) * (Math.PI / 180);
    const radius = CENTER - 16;
    const x = CENTER + Math.cos(angle) * radius;
    const y = CENTER + Math.sin(angle) * radius;
    return (
      <View
        key={i}
        style={[
          styles.minuteMark,
          {
            left: x - 2,
            top: y - 2,
            backgroundColor: minuteMarkColor,
          },
        ]}
      />
    );
  });

  // Show all visible prayers, but only highlight the next one
  const dotWidth = 20;
  const dotHeight = 5;
  const borderWidth = 2;
  const safeMargin = 10;
  const dotRadius = CENTER - dotWidth / 2 - borderWidth - safeMargin;
  const labelDistance = 60; // Increased to bring labels closer to center

  const prayerDots = visiblePrayers.map((prayer, idx) => {
    const angleDeg = getPrayerAngle(prayer.time);
    const angleRad = angleDeg * (Math.PI / 180);
    const x = CENTER + Math.cos(angleRad) * dotRadius;
    const y = CENTER + Math.sin(angleRad) * dotRadius;
    const labelX = CENTER + Math.cos(angleRad) * (dotRadius - labelDistance);
    const labelY = CENTER + Math.sin(angleRad) * (dotRadius - labelDistance);

    const isNextPrayer = idx === nextPrayerIdx;

    // For Isha, keep label upright (facing downward for user)
    const isIsha = prayer.name.toLowerCase() === 'isha';
    const labelRotation = isIsha ? '0deg' : `${angleDeg}deg`;

    return (
      <React.Fragment key={prayer.name}>
        <Text
          style={{
            position: 'absolute',
            left: labelX - 30,
            top: labelY - 12,
            width: 65,
            textAlign: 'center',
            color: isNextPrayer ? nextLabelColor : labelColor,
            fontWeight: 'bold',
            fontSize: 13,
            backgroundColor: isNextPrayer ? nextLabelBg : 'transparent',
            borderRadius: isNextPrayer ? 8 : 0,
            paddingHorizontal: isNextPrayer ? 6 : 0,
            paddingVertical: isNextPrayer ? 2 : 0,
            zIndex: 6,
            fontFamily: 'Inter-Regular',
            transform: [{ rotate: labelRotation }],
            letterSpacing: 0.8,
          }}
        >
          {prayer.name}
        </Text>
        <View
          style={{
            position: 'absolute',
            width: dotWidth,
            height: dotHeight,
            borderRadius: dotHeight / 2,
            backgroundColor: dotColor,
            left: x - dotWidth / 2,
            top: y - dotHeight / 2,
            borderWidth: borderWidth,
            borderColor: dotColor,
            zIndex: 5,
            transform: [{ rotate: `${angleDeg}deg` }],
          }}
        />
      </React.Fragment>
    );
  });

  function getRotation(date: Date) {
    const sec = date.getSeconds();
    const min = date.getMinutes();
    const hour = date.getHours() % 12;
    return {
      second: sec * 6,
      minute: min * 6 + sec * 0.1,
      hour: hour * 30 + min * 0.5,
    };
  }

  // Set high zIndex for hands to ensure they are always on top
  const renderHand = (
    length: number,
    width: number,
    color: string,
    deg: number,
    zIndex = 100
  ) => (
    <View
      style={[
        styles.hand,
        {
          width,
          height: length,
          backgroundColor: color,
          zIndex,
          top: CENTER - length,
          left: CENTER - width / 2,
          transform: [
            { translateY: length / 2 },
            { rotate: `${deg}deg` },
            { translateY: -length / 2 },
          ],
        },
      ]}
    />
  );

  return (
    <View style={styles.container}>
      <View style={[styles.clockFace, { backgroundColor: bgColor }]}>
        {hourMarks}
        {minuteMarks}
        {prayerDots}
        {/* Hour hand */}
        {renderHand(HAND_LENGTHS.hour, HAND_WIDTHS.hour, handColor, hour, 100)}
        {/* Minute hand */}
        {renderHand(HAND_LENGTHS.minute, HAND_WIDTHS.minute, handColor, minute, 101)}
        {/* Second hand */}
        {renderHand(HAND_LENGTHS.second, HAND_WIDTHS.second, secondHandColor, second, 102)}
        {/* Center dot */}
        <View
          style={[
            styles.centerDot,
            { backgroundColor: centerDotBg, borderColor: centerDotBorder },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  clockFace: {
    width: CLOCK_SIZE,
    height: CLOCK_SIZE,
    borderRadius: CLOCK_SIZE / 2,
    backgroundColor: '#d4d9d9',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  hourMark: {
    position: 'absolute',
    backgroundColor: '#858585',
    borderRadius: 3,
  },
  minuteMark: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#858585',
  },
  hand: {
    position: 'absolute',
    borderRadius: 4,
  },
  centerDot: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#333232',
    top: CENTER - 11,
    left: CENTER - 11,
    zIndex: 110,
    borderWidth: 2,
    borderColor: '#fff',
    },
});