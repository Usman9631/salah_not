import React from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity, Pressable, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type AdhanSoundPickerModalProps = {
  visible: boolean;
  onClose: () => void;
  soundOptions: string[];
  activePicker: 'adhan' | 'fajr';
  selectedAdhanSound: string;
  selectedFajrSound: string;
  playingSound: string | null;
  selectSound: (sound: string) => void;
  togglePlay: (sound: string) => void;
  styles: {
    modalOverlay: StyleProp<ViewStyle>;
    modalContent: StyleProp<ViewStyle>;
    modalHeading: StyleProp<TextStyle>;
    scrollView: StyleProp<ViewStyle>;
    soundOptionRow: StyleProp<ViewStyle>;
    soundOption: StyleProp<ViewStyle>;
    selectedOption: StyleProp<ViewStyle>;
    selectionIcon: StyleProp<ViewStyle>;
    soundOptionText: StyleProp<TextStyle>;
    selectedOptionText: StyleProp<TextStyle>;
    playButton: StyleProp<ViewStyle>;
    cancelButton: StyleProp<ViewStyle>;
    cancelButtonText: StyleProp<TextStyle>;
  };
};

const AdhanSoundPickerModal: React.FC<AdhanSoundPickerModalProps> = ({
  visible,
  onClose,
  soundOptions,
  activePicker,
  selectedAdhanSound,
  selectedFajrSound,
  playingSound,
  selectSound,
  togglePlay,
  styles,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalHeading}>Select Sound</Text>
          <ScrollView style={styles.scrollView}>
            {soundOptions.map((sound, index) => {
              const isSelected =
                (activePicker === 'adhan' && selectedAdhanSound === sound) ||
                (activePicker === 'fajr' && selectedFajrSound === sound);
              const isPlaying = playingSound === sound;
              return (
                <View key={index} style={styles.soundOptionRow}>
                  <TouchableOpacity
                    style={[
                      styles.soundOption,
                      isSelected && styles.selectedOption,
                      { flex: 1, flexDirection: 'row', alignItems: 'center' },
                    ]}
                    onPress={() => selectSound(sound)}
                  >
                    {isSelected ? (
                      <Ionicons name="checkmark" size={20} color="#a7bd32" style={styles.selectionIcon} />
                    ) : (
                      <View style={{ width: 20, marginRight: 8 }} />
                    )}
                    <Text
                      style={[
                        styles.soundOptionText,
                        isSelected && styles.selectedOptionText,
                      ]}
                    >
                      {sound}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.playButton}
                    onPress={() => togglePlay(sound)}
                  >
                    {isPlaying ? (
                      <Ionicons name="stop-circle-outline" size={28} color="#a7bd32" />
                    ) : (
                      <Ionicons name="play-circle-outline" size={28} color="#a7bd32" />
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
          <Pressable style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default AdhanSoundPickerModal;