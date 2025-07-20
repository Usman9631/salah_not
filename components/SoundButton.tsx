import React from 'react';
import { TouchableOpacity, View, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

type SoundButtonProps = {
  label: string;
  selectedSound?: string;
  onPress: () => void;
  styles: {
    soundButton: StyleProp<ViewStyle>;
    soundButtonText: StyleProp<TextStyle>;
  };
  disabled?: boolean;
};

const SoundButton: React.FC<SoundButtonProps> = ({
  label,
  selectedSound,
  onPress,
  styles,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.soundButton,
        disabled && { opacity: 0.5 }
      ]}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.7}
    >
      <View>
        <Text style={styles.soundButtonText}>{label}</Text>
        <Text style={{ color: '#999', fontSize : RFValue(12), fontFamily: 'Inter-Regular' }}>
          {selectedSound ? selectedSound : 'Select Sound'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default SoundButton;