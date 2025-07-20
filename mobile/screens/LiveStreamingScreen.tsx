import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, ActivityIndicator, Platform, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import Constants from 'expo-constants';
import { WebView } from 'react-native-webview';

const BACKEND_API_URL = Constants.expoConfig?.extra?.BACKEND_API_URL;

// Sample YouTube Live Streams
const youtubeLiveStreams = [
  {
    id: '1',
    title: 'Live Jumuah Khutbah - Masjid Al-Falah',
    channel: 'Masjid Al-Falah',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    liveUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    viewers: 1240,
    isLive: true,
  },
  {
    id: '2',
    title: 'Live Taraweeh Prayer - Masjid Noor',
    channel: 'Masjid Noor',
    thumbnail: 'https://img.youtube.com/vi/jNQXAC9IVRw/hqdefault.jpg',
    liveUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    viewers: 856,
    isLive: true,
  },
  {
    id: '3',
    title: 'Live Fajr Prayer - Masjid Rahma',
    channel: 'Masjid Rahma',
    thumbnail: 'https://img.youtube.com/vi/kJQP7kiw5Fk/hqdefault.jpg',
    liveUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
    viewers: 432,
    isLive: true,
  },
];

// Dummy data for Imams
const imams = [
  { id: '1', name: 'Imam Ahmed', image: require('../assets/images/imams/imam1.png') },
  { id: '2', name: 'Imam Bilal', image: require('../assets/images/imams/imam2.png') },
  { id: '3', name: 'Imam Kareem', image: require('../assets/images/imams/imam3.png') },
  { id: '4', name: 'Imam Musa', image: require('../assets/images/imams/imam4.png') },
  { id: '5', name: 'Imam Yasin', image: require('../assets/images/imams/imam5.png') },
];

// Dummy video data array
const videos = [
  {
    id: 'yt1',
    imam: {
      name: 'Imam Ahmed',
      image: require('../assets/images/imams/imam1.png'),
    },
    title: 'Live Jumuah Khutbah - 5th July 2025',
    thumbnail: require('../assets/images/thumbnail/thumbnail1.png'),
    duration: '32:10',
    viewers: 1240,
  },
  {
    id: 'yt2',
    imam: {
      name: 'Imam Ahmed',
      image: require('../assets/images/imams/imam1.png'),
    },
    title: 'Live Jumuah Khutbah - 5th July 2025',
    thumbnail: require('../assets/images/thumbnail/thumbnail1.png'),
    duration: '32:10',
    viewers: 1240,
  },
];

// Helper: Get YouTube videoId from all formats (short, watch, live)
function getYouTubeVideoId(url: string) {
  let videoId = '';
  if (!url) return '';
  if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1].split(/[?&/]/)[0];
  } else if (url.includes('watch?v=')) {
    videoId = url.split('watch?v=')[1].split('&')[0];
  } else if (url.includes('/live/')) {
    videoId = url.split('/live/')[1].split('?')[0];
  }
  videoId = videoId.replace('/', '');
  return videoId;
}

// Helper: Get YouTube thumbnail from videoId
function getYouTubeThumbnail(url: string) {
  const id = getYouTubeVideoId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

export default function LiveStreamingScreen() {
  // State for live link
  const [liveLink, setLiveLink] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedStream, setSelectedStream] = useState<any>(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [useFallbackPlayer, setUseFallbackPlayer] = useState(false);
  const [showCustomAlert, setShowCustomAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    type: 'info',
    onConfirm: () => {},
    onCancel: () => {},
    showCancel: true
  });
  
  // State for real live streams
  const [realLiveStreams, setRealLiveStreams] = useState<any[]>([]);
  const [loadingRealStreams, setLoadingRealStreams] = useState(true);

  useEffect(() => {
    const fetchLiveLink = async () => {
      try {
        // 👇 API URL — apne Mac ka local IP lagao, Expo Go/iPhone pe
        const response = await fetch(`${BACKEND_API_URL}/api/get-live-link`);
        const data = await response.json();
        setLiveLink(data.url);
        setIsLive(data.isLive);
      } catch (err) {
        setLiveLink(null);
        setIsLive(false);
      }
      setLoading(false);
    };

    const fetchRealLiveStreams = async () => {
      try {
        const response = await fetch(`${BACKEND_API_URL}/api/live-streams`);
        const data = await response.json();
        if (data.success) {
          setRealLiveStreams(data.liveStreams || []);
        }
      } catch (err) {
        console.error('Error fetching real live streams:', err);
        setRealLiveStreams([]);
      }
      setLoadingRealStreams(false);
    };

    fetchLiveLink();
    fetchRealLiveStreams();
  }, []);

  const handlePlayYouTube = (stream: any) => {
    // Always try to open in YouTube app first for better video playback
    Linking.canOpenURL(stream.liveUrl).then((supported) => {
      if (supported) {
        Linking.openURL(stream.liveUrl);
      } else {
        // Fallback to in-app player with better configuration
        setSelectedStream(stream);
        setShowVideoPlayer(true);
      }
    }).catch(() => {
      // Fallback to in-app player
      setSelectedStream(stream);
      setShowVideoPlayer(true);
    });
  };

  const handleOpenInYouTube = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open YouTube app');
    });
  };

  const handleInAppPlay = (stream: any) => {
    // Show beautiful custom alert
    showAlert({
      title: '🎥 Watch Live Stream',
      message: 'Choose how you want to watch this video:\n\n📱 YouTube App - Best experience\n🌐 In-App Browser - Watch here',
      type: 'info',
      onConfirm: () => {
        setSelectedStream(stream);
        setShowVideoPlayer(true);
      },
      onCancel: () => {
        handleOpenInYouTube(stream.liveUrl);
      },
      showCancel: true
    });
  };

  // Alternative video player using direct YouTube mobile URL
  const getMobileYouTubeUrl = (url: string) => {
    const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (videoIdMatch) {
      const videoId = videoIdMatch[1];
      return `https://m.youtube.com/watch?v=${videoId}`;
    }
    return url;
  };

  // Custom Alert Component
  const CustomAlert = () => {
    if (!showCustomAlert) return null;

    return (
      <Modal
        visible={showCustomAlert}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCustomAlert(false)}
      >
        <View style={styles.alertOverlay}>
          <View style={styles.alertContainer}>
            <View style={styles.alertIconContainer}>
              <Ionicons name="play-circle" size={50} color="#a7bd32" />
            </View>
            
            <Text style={styles.alertTitle}>{alertConfig.title}</Text>
            <Text style={styles.alertMessage}>{alertConfig.message}</Text>
            
            <View style={styles.alertButtons}>
              {alertConfig.showCancel && (
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setShowCustomAlert(false);
                    alertConfig.onCancel();
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => {
                  setShowCustomAlert(false);
                  alertConfig.onConfirm();
                }}
              >
                <Text style={styles.confirmButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  // Show custom alert
  const showAlert = (config: any) => {
    setAlertConfig(config);
    setShowCustomAlert(true);
  };

  // Convert YouTube URL to embed URL with better parameters
  const getYouTubeEmbedUrl = (url: string) => {
    // Extract video ID from various YouTube URL formats
    const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (videoIdMatch) {
      const videoId = videoIdMatch[1];
      // Use a more compatible embed URL with better parameters
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${encodeURIComponent('https://www.youtube.com')}&widget_referrer=${encodeURIComponent('https://www.youtube.com')}`;
    }
    return url;
  };

  // Alternative approach: Use a simple HTML page with iframe
  const getVideoHTML = (url: string) => {
    const embedUrl = getYouTubeEmbedUrl(url);
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
          <style>
            body { margin: 0; padding: 0; background: #000; }
            iframe { width: 100%; height: 100vh; border: none; }
          </style>
        </head>
        <body>
          <iframe 
            src="${embedUrl}"
            frameborder="0" 
            allowfullscreen
            allow="autoplay; encrypted-media; picture-in-picture"
          ></iframe>
        </body>
      </html>
    `;
  };

  // Use real data if available, otherwise fall back to dummy data
  const displayLiveStreams = realLiveStreams.length > 0 ? realLiveStreams : youtubeLiveStreams;

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
        <StatusBar style="dark" />
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={22} color="#000" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search live streams..."
            placeholderTextColor="#888"
          />
        </View>

        {/* Live Streaming Header */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Live Streaming</Text>
          <TouchableOpacity activeOpacity={0.8} style={{ borderRadius: 14, overflow: 'hidden' }}>
            <LinearGradient
              colors={['#a7bd32', '#8b992f']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.seeAllBtn}
            >
              <Text style={styles.seeAllText}>See All</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Imam List */}
        <FlatList
          data={imams}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.imamList}
          style={{ marginBottom: 0 }}
          renderItem={({ item }) => (
            <View style={styles.imamItem}>
              <View style={styles.imamCircle}>
                <Image
                  source={item.image}
                  style={styles.imamImage}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.imamName}>{item.name}</Text>
            </View>
          )}
        />

        {/* YouTube Live Streams Header */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>YouTube Live Streams</Text>
          <TouchableOpacity activeOpacity={0.8} style={{ borderRadius: 14, overflow: 'hidden' }}>
            <LinearGradient
              colors={['#a7bd32', '#8b992f']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.seeAllBtn}
            >
              <Text style={styles.seeAllText}>See All</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* YouTube Live Streams */}
        {loadingRealStreams ? (
          <ActivityIndicator size="large" style={{ marginVertical: 24 }} />
        ) : (
          <FlatList
            data={displayLiveStreams}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.videoCard}>
                {/* Top Row: Channel name, live indicator, share icon */}
                <View style={styles.videoCardTopRow}>
                  <View style={styles.imamRow}>
                    <Ionicons name="radio-outline" size={22} color="#e53935" style={{ marginRight: 6 }} />
                    <Text style={[styles.videoImamName, { color: '#e53935' }]}>LIVE</Text>
                    <Text style={styles.videoImamName}> • {item.channel}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleOpenInYouTube(item.liveUrl)}>
                    <Ionicons name="logo-youtube" size={20} color="#e53935" />
                  </TouchableOpacity>
                </View>
                
                {/* Thumbnail with overlays */}
                <View style={styles.thumbnailWrap}>
                  <Image 
                    source={{ uri: item.thumbnail || 'https://via.placeholder.com/300x200?text=Live+Stream' }} 
                    style={styles.thumbnailImage} 
                    resizeMode="cover" 
                  />
                  {/* Live badge */}
                  <View style={styles.liveBadge}>
                    <Text style={styles.liveText}>LIVE</Text>
                  </View>
                  {/* Viewers badge */}
                  <View style={styles.viewersBadge}>
                    <Ionicons name="people" size={13} color="#000000" style={{ marginRight: 3 }} />
                    <Text style={styles.viewersText}>{item.viewers}</Text>
                  </View>
                  {/* Play button */}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.centerPlayBtn}
                    onPress={() => handleInAppPlay(item)}
                  >
                    <Ionicons name="play-circle" size={50} color="#fff" />
                  </TouchableOpacity>
                </View>
                
                {/* Video title and play button */}
                <View style={styles.videoBottomRow}>
                  <Text style={styles.videoTitle}>{item.title}</Text>
                  <TouchableOpacity 
                    style={styles.playBtn}
                    onPress={() => handleInAppPlay(item)}
                  >
                    <Ionicons name="play" size={16} color="#fff" style={{ marginRight: 6 }} />
                    <Text style={styles.playBtnText}>Watch</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 10 }}
          />
        )}

        {/* Prayer Online Header */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Prayer Online</Text>
          <TouchableOpacity activeOpacity={0.8} style={{ borderRadius: 14, overflow: 'hidden' }}>
            <LinearGradient
              colors={['#a7bd32', '#8b992f']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.seeAllBtn}
            >
              <Text style={styles.seeAllText}>See All</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* LIVE YOUTUBE CARD */}
        {loading ? (
          <ActivityIndicator size="large" style={{ marginVertical: 24 }} />
        ) : isLive && liveLink ? (
          <View style={styles.videoCard}>
            <View style={styles.videoCardTopRow}>
              <View style={styles.imamRow}>
                <Ionicons name="radio-outline" size={22} color="#e53935" style={{ marginRight: 6 }} />
                <Text style={[styles.videoImamName, { color: '#e53935' }]}>LIVE</Text>
              </View>
              <View />
            </View>
            <View style={[styles.thumbnailWrap, { height: 190 }]}>
              {getYouTubeThumbnail(liveLink) ? (
                <Image
                  source={{ uri: getYouTubeThumbnail(liveLink) || undefined }}
                  style={styles.thumbnailImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.thumbnailImage, { backgroundColor: '#ddd' }]} />
              )}
              {/* Centered Play Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.centerPlayBtn}
                onPress={() => {
                  if (liveLink) Linking.openURL(liveLink);
                }}
              >
                <Ionicons name="logo-youtube" size={50} color="#e53935" />
              </TouchableOpacity>
            </View>
            <View style={styles.videoBottomRow}>
              <Text style={styles.videoTitle}>Live Transmission</Text>
            </View>
          </View>
        ) : null}

        {/* VIDEO CARDS — ONLY SHOW IF NOT LIVE */}
        {!loading && !isLive && (
          <FlatList
            data={videos}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.videoCard}>
                {/* Top Row: Imam image, name, share icon */}
                <View style={styles.videoCardTopRow}>
                  <View style={styles.imamRow}>
                    <Image source={item.imam.image} style={styles.videoImamImage} />
                    <Text style={styles.videoImamName}>{item.imam.name}</Text>
                  </View>
                  <TouchableOpacity>
                    <Ionicons name="share-social-outline" size={20} color="#888" />
                  </TouchableOpacity>
                </View>
                {/* Thumbnail with overlays */}
                <View style={styles.thumbnailWrap}>
                  <Image source={item.thumbnail} style={styles.thumbnailImage} resizeMode="cover" />
                  {/* Duration badge */}
                  <View style={styles.durationBadge}>
                    <Text style={styles.durationText}>{item.duration}</Text>
                  </View>
                  {/* Viewers badge */}
                  <View style={styles.viewersBadge}>
                    <Ionicons name="people" size={13} color="#000000" style={{ marginRight: 3 }} />
                    <Text style={styles.viewersText}>{item.viewers}</Text>
                  </View>
                </View>
                {/* Video title and play button */}
                <View style={styles.videoBottomRow}>
                  <Text style={styles.videoTitle}>{item.title}</Text>
                  <TouchableWithoutFeedback>
                    <View style={styles.playBtn}>
                      <Ionicons name="caret-forward-circle-outline" size={20} color="#fff" style={{ marginRight: 6 }} />
                      <Text style={styles.playBtnText}>Play</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            )}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 10 }}
          />
        )}
      </ScrollView>

      {/* Video Player Modal */}
      <Modal
        visible={showVideoPlayer}
        animationType="slide"
        onRequestClose={() => {
          setShowVideoPlayer(false);
          setUseFallbackPlayer(false);
        }}
      >
        <View style={styles.videoModalContainer}>
          <View style={styles.videoModalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setShowVideoPlayer(false);
                setUseFallbackPlayer(false);
              }}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.videoModalTitle}>
              {selectedStream?.title || 'Live Stream'}
            </Text>
            <TouchableOpacity
              style={styles.switchPlayerButton}
              onPress={() => setUseFallbackPlayer(!useFallbackPlayer)}
            >
              <Ionicons 
                name={useFallbackPlayer ? "phone-portrait" : "desktop"} 
                size={20} 
                color="#fff" 
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.videoContainer}>
            {useFallbackPlayer ? (
              // Fallback: Mobile YouTube URL
              <WebView
                source={{ 
                  uri: getMobileYouTubeUrl(selectedStream?.liveUrl || ''),
                }}
                style={styles.videoPlayer}
                allowsFullscreenVideo={true}
                mediaPlaybackRequiresUserAction={false}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                scalesPageToFit={false}
                allowsInlineMediaPlayback={true}
                onError={(syntheticEvent) => {
                  const { nativeEvent } = syntheticEvent;
                  console.warn('Fallback WebView error: ', nativeEvent);
                  Alert.alert(
                    'Video Error', 
                    'Failed to load video. Please try opening in YouTube app.',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Open in YouTube', onPress: () => handleOpenInYouTube(selectedStream?.liveUrl) }
                    ]
                  );
                }}
                userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1"
              />
            ) : (
              // Primary: Embedded YouTube player
              <WebView
                source={{ 
                  html: getVideoHTML(selectedStream?.liveUrl || ''),
                  baseUrl: 'https://www.youtube.com',
                }}
                style={styles.videoPlayer}
                allowsFullscreenVideo={true}
                mediaPlaybackRequiresUserAction={false}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                scalesPageToFit={false}
                allowsInlineMediaPlayback={true}
                mixedContentMode="compatibility"
                onShouldStartLoadWithRequest={(request) => {
                  return request.url.includes('youtube.com') || 
                         request.url.includes('youtu.be') || 
                         request.url.includes('googlevideo.com') ||
                         request.url.includes('google.com') ||
                         request.url.includes('gstatic.com');
                }}
                onError={(syntheticEvent) => {
                  const { nativeEvent } = syntheticEvent;
                  console.warn('WebView error: ', nativeEvent);
                  Alert.alert(
                    'Video Error', 
                    'Failed to load video. Please try opening in YouTube app.',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Open in YouTube', onPress: () => handleOpenInYouTube(selectedStream?.liveUrl) }
                    ]
                  );
                }}
                onHttpError={(syntheticEvent) => {
                  const { nativeEvent } = syntheticEvent;
                  console.warn('WebView HTTP error: ', nativeEvent);
                }}
                onLoadEnd={() => {
                  console.log('WebView loaded successfully');
                }}
                onMessage={(event) => {
                  console.log('WebView message:', event.nativeEvent.data);
                }}
                userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1"
              />
            )}
          </View>
          
          <View style={styles.videoModalFooter}>
            <Text style={styles.playerModeText}>
              {useFallbackPlayer ? 'Mobile YouTube Mode' : 'Embedded Player Mode'}
            </Text>
            <TouchableOpacity
              style={styles.openYouTubeButton}
              onPress={() => handleOpenInYouTube(selectedStream?.liveUrl)}
            >
              <Ionicons name="logo-youtube" size={20} color="#fff" />
              <Text style={styles.openYouTubeText}>Open in YouTube App</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <CustomAlert />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingTop: 32,
    paddingHorizontal: 18,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 18,
    marginTop: 18,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: '#000',
    fontFamily: 'Roboto-Regular',
    paddingVertical: 0,
    borderWidth: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 2,
  },
  headerTitle: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'Roboto-Bold',
  },
  seeAllBtn: {
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 5,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seeAllText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Roboto-Bold',
  },
  imamList: {
    paddingVertical: 10,
    marginBottom: 10,
  },
  imamItem: {
    alignItems: 'center',
    marginRight: 18,
    width: 74,
  },
  imamCircle: {
    width: 70,
    height: 70,
    borderRadius: 100,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    marginBottom: 6,
  },
  imamImage: {
    width: 70,
    height: 70,
    borderRadius: 100,
  },
  imamName: {
    fontSize: 11,
    color: '#222',
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
  },
  videoCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    marginTop: 10,
    marginBottom: 18,
  },
  videoCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  imamRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  videoImamImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#eee',
  },
  videoImamName: {
    fontSize: 13,
    color: '#222',
    fontFamily: 'Roboto-Bold',
  },
  thumbnailWrap: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 10,
    position: 'relative',
    backgroundColor: '#eee',
    minHeight: 170,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailImage: {
    width: '100%',
    height: 170,
    borderRadius: 14,
  },
  centerPlayBtn: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -25,
    marginTop: -25,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 32,
    padding: 6,
  },
  durationBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#e53935',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    zIndex: 2,
  },
  durationText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Roboto-Regular',
  },
  viewersBadge: {
    position: 'absolute',
    top: 10,
    left: 70,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
    elevation: 2,
  },
  viewersText: {
    color: '#000000',
    fontSize: 11,
    fontFamily: 'Roboto-Regular',
  },
  videoBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  videoTitle: {
    fontSize: 13,
    color: '#222',
    fontFamily: 'Roboto-Bold',
    flex: 1,
    marginRight: 10,
    flexWrap: 'wrap',
  },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  playBtnText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
  },
  closeButton: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
  },
  videoPlayer: {
    flex: 1,
    backgroundColor: '#000',
  },
  liveBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#e53935',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    zIndex: 2,
  },
  liveText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Roboto-Regular',
  },
  videoModalContainer: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
  },
  videoModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  videoModalTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    textAlign: 'center',
    flex: 1,
    marginLeft: 10,
  },
  switchPlayerButton: {
    padding: 10,
  },
  videoContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  videoModalFooter: {
    paddingHorizontal: 15,
    paddingBottom: 20,
    alignItems: 'center',
  },
  playerModeText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    marginBottom: 10,
  },
  openYouTubeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e53935',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  openYouTubeText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    marginLeft: 10,
  },
  alertOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  alertContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    width: '80%',
    elevation: 5,
  },
  alertIconContainer: {
    marginBottom: 15,
  },
  alertTitle: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    color: '#333',
    marginBottom: 10,
  },
  alertMessage: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  alertButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '40%',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: '#a7bd32',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '40%',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    textAlign: 'center',
  },
});

