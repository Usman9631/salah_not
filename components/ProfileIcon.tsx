import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ProfileIconProps = {
  image?: string | null;
  size?: number;
  onPress?: () => void;
};

export default function ProfileIcon({ image, size = 48, onPress }: ProfileIconProps) {
  const content = image ? (
    <Image
      source={{ uri: image }}
      style={{ width: size, height: size, borderRadius: size / 2 }}
      resizeMode="cover"
    />
  ) : (
    <Ionicons name="person" size={size * 0.6} color="#000" />
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});