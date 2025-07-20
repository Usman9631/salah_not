import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

type IqamahTiming = {
  name: string;
  iqamah: string; // "HH:mm"
};

type IqamahTimingWithDate = IqamahTiming & { iqamahDate: Date };

type FooterIqamahProps = {
  timings: IqamahTiming[];
};

export default function FooterIqamah({ timings }: FooterIqamahProps) {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Find the next iqamah time
  const nextIqamah = useMemo<IqamahTimingWithDate>(() => {
    const today = new Date(now);
    for (let t of timings) {
      const [h, m] = t.iqamah.split(':').map(Number);
      const iqamahDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), h, m, 0);
      if (iqamahDate > now) {
        return { ...t, iqamahDate };
      }
    }
    // If all iqamahs have passed, return the first of tomorrow
    const [h, m] = timings[0].iqamah.split(':').map(Number);
    const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, h, m, 0);
    return { ...timings[0], iqamahDate: tomorrow };
  }, [now, timings]);

  // Calculate minutes left
  const diffMs = nextIqamah.iqamahDate.getTime() - now.getTime();
  const diffMin = Math.max(0, Math.ceil(diffMs / 60000));

  // Format time left as "X hr Y min" if more than 60 min, else "X min"
  let timeLeftText;
  if (diffMin > 60) {
    const hours = Math.floor(diffMin / 60);
    const mins = diffMin % 60;
    timeLeftText = `${hours} hr${hours > 1 ? 's' : ''}${mins > 0 ? ` ${mins} min` : ''}`;
  } else {
    timeLeftText = `${diffMin} min`;
  }

  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>
        {nextIqamah.name} Iqamah in {timeLeftText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    width: '100%',
    padding: 16,
    backgroundColor: '#1c2833',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  footerText: {
    color: '#14a1b1',
    fontSize: 22,
    fontFamily: 'Urbanist-Bold',
    textAlign: 'center',
  }});