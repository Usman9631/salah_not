import React from 'react';
import { View, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';
import Slider from '@react-native-community/slider';

type VolumeSliderProps = {
  volume: number;
  setVolume: (value: number) => void;
  useDeviceVolume: boolean;
  styles: {
    soundButton: StyleProp<ViewStyle>;
    disabledContainer?: StyleProp<ViewStyle>;
    text: StyleProp<TextStyle>;
    volumeValue: StyleProp<TextStyle>;
  };
  disabled?: boolean; // <-- Add this line
};

const VolumeSlider: React.FC<VolumeSliderProps> = ({
  volume,
  setVolume,
  useDeviceVolume,
  styles,
  disabled = false, // <-- Add default value
}) => {
  return (
    <View style={[styles.soundButton, useDeviceVolume && styles.disabledContainer]}>
      <Text style={[styles.text, useDeviceVolume && { color: '#999' }]}>Volume</Text>
      <Slider
        style={{ width: '100%', height: 40 }}
        minimumValue={0}
        maximumValue={1}
        minimumTrackTintColor={useDeviceVolume ? '#ccc' : '#a7bd32'}
        maximumTrackTintColor={useDeviceVolume ? '#ddd' : '#888'}
        thumbTintColor={useDeviceVolume ? '#bbb' : '#a7bd32'}
        value={volume}
        onValueChange={setVolume}
        disabled={useDeviceVolume || disabled}
      />
      <Text style={[styles.volumeValue, useDeviceVolume && { color: '#999' }]}>
        {Math.round(volume * 100)}%
      </Text>
    </View>
  );
};

export default VolumeSlider;