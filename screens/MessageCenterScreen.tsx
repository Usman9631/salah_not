import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import BackHeader from '../components/BackHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

type Message = {
  id: string;
  title: string;
  body: string;
};

const DUMMY_MESSAGES: Message[] = [
  { id: '1', title: 'Welcome', body: 'Thank you for using our app!' },
  { id: '2', title: 'Update', body: 'A new version is available.' },
  { id: '3', title: 'Reminder', body: "Don't forget to check your prayer times." },
  // You can comment out all items above to test the "no messages" state
];

type MessageCenterScreenProps = {
  navigation: any;
};

export default function MessageCenterScreen({ navigation }: MessageCenterScreenProps) {
  const [messages] = useState<Message[]>(DUMMY_MESSAGES);

  const renderItem = ({ item }: { item: Message }) => (
    <View style={styles.messageCard}>
      <Text style={styles.messageTitle}>{item.title}</Text>
      <Text style={styles.messageBody}>{item.body}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <BackHeader title="Message Center" onBack={() => navigation.goBack()} />
      <View style={styles.container}>
        {messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No messages to show</Text>
          </View>
        ) : (
          <FlatList
            data={messages}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingVertical: 16 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  text: {
    color: '#000000',
    fontSize: 18,
    marginTop: 24,
    fontFamily: 'Roboto-Regular',
  },
  messageCard: {
    backgroundColor: '#232323',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  messageTitle: {
    color: '#a7bd32',
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    marginBottom: 6,
  },
  messageBody: {
    color: '#000000',
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#aaa',
    fontSize: 18,
    fontFamily: 'Roboto-Regular',
  },
  });