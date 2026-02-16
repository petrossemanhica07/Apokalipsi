import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useAudioPlayer, useAudioPlayerStatus, AudioModule } from 'expo-audio';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import Colors from '@/constants/colors';

interface AudioPlayerProps {
  chapterId: number;
  chapterTitle: string;
}

export default function AudioPlayer({ chapterId, chapterTitle }: AudioPlayerProps) {
  const audioUrl = `https://sksalon70.infy.uk/musica${chapterId}`;
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const pulseAnim = useSharedValue(1);

  const player = useAudioPlayer(isLoaded ? audioUrl : null);
  const status = useAudioPlayerStatus(player);

  const isPlaying = status.playing;
  const duration = status.duration || 0;
  const position = status.currentTime || 0;

  useEffect(() => {
    AudioModule.setAudioModeAsync({ playsInSilentModeIOS: true });
  }, []);

  useEffect(() => {
    if (isPlaying) {
      pulseAnim.value = withRepeat(
        withSequence(
          withTiming(1.12, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      pulseAnim.value = withTiming(1, { duration: 300 });
    }
  }, [isPlaying]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  const handlePlayPause = useCallback(async () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (!isLoaded) {
      setLoading(true);
      setError(false);
      setIsLoaded(true);
      setTimeout(() => {
        try {
          player.play();
        } catch (e) {
          setError(true);
        }
        setLoading(false);
      }, 500);
      return;
    }

    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  }, [isLoaded, isPlaying, player]);

  const handleSeek = useCallback(async (direction: 'forward' | 'backward') => {
    if (!isLoaded) return;
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const seekAmount = 15;
    const newPosition = direction === 'forward'
      ? Math.min(position + seekAmount, duration)
      : Math.max(position - seekAmount, 0);
    player.seekTo(newPosition);
  }, [isLoaded, position, duration, player]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Ionicons name="musical-notes" size={18} color={Colors.accent} />
        <Text style={styles.label}>Ouvir Capitulo</Text>
      </View>

      <View style={styles.playerCard}>
        <View style={styles.trackInfo}>
          <View style={styles.waveformContainer}>
            {[0.4, 0.7, 1, 0.6, 0.85, 0.5, 0.9, 0.3, 0.75, 0.55].map((h, i) => (
              <View
                key={i}
                style={[
                  styles.waveBar,
                  {
                    height: 20 * h,
                    backgroundColor: isPlaying
                      ? (i / 10 * 100 < progress ? Colors.accent : Colors.cardBorder)
                      : Colors.cardBorder,
                  },
                ]}
              />
            ))}
          </View>
          <Text style={styles.trackTitle} numberOfLines={1}>{chapterTitle}</Text>
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={16} color={Colors.danger} />
            <Text style={styles.errorText}>Audio indisponivel</Text>
            <Pressable onPress={() => { setError(false); setIsLoaded(false); }} style={styles.retryButton}>
              <Ionicons name="refresh" size={16} color={Colors.primary} />
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.progressContainer}>
              <View style={styles.progressBg}>
                <View style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }]} />
              </View>
              <View style={styles.timeRow}>
                <Text style={styles.timeText}>{formatTime(position)}</Text>
                <Text style={styles.timeText}>{duration > 0 ? formatTime(duration) : '--:--'}</Text>
              </View>
            </View>

            <View style={styles.controls}>
              <Pressable
                onPress={() => handleSeek('backward')}
                style={styles.seekButton}
                disabled={!isLoaded}
              >
                <Ionicons name="play-back" size={22} color={isLoaded ? Colors.text : Colors.textMuted} />
              </Pressable>

              <Pressable onPress={handlePlayPause} disabled={loading}>
                <Animated.View style={[styles.playButton, pulseStyle]}>
                  {loading ? (
                    <ActivityIndicator size="small" color={Colors.white} />
                  ) : (
                    <Ionicons
                      name={isPlaying ? 'pause' : 'play'}
                      size={28}
                      color={Colors.white}
                      style={!isPlaying ? { marginLeft: 3 } : undefined}
                    />
                  )}
                </Animated.View>
              </Pressable>

              <Pressable
                onPress={() => handleSeek('forward')}
                style={styles.seekButton}
                disabled={!isLoaded}
              >
                <Ionicons name="play-forward" size={22} color={isLoaded ? Colors.text : Colors.textMuted} />
              </Pressable>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  label: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.accent,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  playerCard: {
    backgroundColor: Colors.playerBg,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: '#8B6914',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  trackInfo: {
    marginBottom: 14,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    height: 24,
    marginBottom: 10,
  },
  waveBar: {
    width: 4,
    borderRadius: 2,
  },
  trackTitle: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: Colors.text,
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: 14,
  },
  progressBg: {
    height: 4,
    backgroundColor: Colors.cardBorder,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 2,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  timeText: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: Colors.textMuted,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  seekButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceElevated,
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  errorText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: Colors.danger,
  },
  retryButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceElevated,
  },
});
