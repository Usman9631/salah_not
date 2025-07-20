import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

type DigitalInfoProps = {
  isNight?: boolean;
};

export default function DigitalInfo({ isNight }: DigitalInfoProps) {
  const [now, setNow] = useState<Date>(new Date());
  const [islamicDate, setIslamicDate] = useState<string>('Loading...');

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
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

  const timeString = (() => {
    let h = now.getHours();
    let m = now.getMinutes();
    let hour12 = h % 12;
    if (hour12 === 0) hour12 = 12;
    return `${hour12}:${m.toString().padStart(2, '0')}`;
  })();

  const gregorianDate = now.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <View style={styles.container}>
      <Text style={[styles.time, isNight && styles.nightText]}>{timeString}</Text>
      <Text style={[styles.islamic, isNight && styles.nightText]}>{islamicDate}</Text>
      <Text style={[styles.gregorian, isNight && styles.nightText]}>{gregorianDate}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginTop: 12 },
  time: { fontSize: 32, color: '#000000', fontFamily: 'Inter-Bold' },
  islamic: { fontSize : RFValue(18), color: '#000000', marginTop: 2, fontFamily: 'Inter-Regular' },
  gregorian: { fontSize : RFValue(16), color: '#000000', marginTop: 2, fontFamily: 'Inter-Regular' },
  nightText: { color: '#fff' }
});