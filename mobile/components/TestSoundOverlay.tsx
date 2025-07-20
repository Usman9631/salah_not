import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type TestSoundOverlayProps = {
  visible: boolean;
  onClose: () => void | Promise<void>;
  testingSoundType: 'adhan' | 'fajr';
  selectedAdhanSound: string;
  selectedFajrSound: string;
  styles: {
    testOverlay: StyleProp<ViewStyle>;
    testOverlayContent: StyleProp<ViewStyle>;
    testOverlayTitle: StyleProp<TextStyle>;
    testOverlayButton: StyleProp<ViewStyle>;
    testOverlayButtonText: StyleProp<TextStyle>;
  };
};

const TestSoundOverlay: React.FC<TestSoundOverlayProps> = ({
  visible,
  onClose,
  testingSoundType,
  selectedAdhanSound,
  selectedFajrSound,
  styles,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.testOverlay}>
        <View style={styles.testOverlayContent}>
          <Text style={styles.testOverlayTitle}>
            Playing {testingSoundType === 'adhan' ? selectedAdhanSound : selectedFajrSound}
          </Text>
          <TouchableOpacity
            onPress={async () => { await onClose(); }}
            style={styles.testOverlayButton}
          >
            <Ionicons name="stop-circle-outline" size={48} color="#a7bd32" />
            <Text style={styles.testOverlayButtonText}>Stop</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default TestSoundOverlay;