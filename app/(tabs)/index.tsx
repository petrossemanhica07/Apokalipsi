import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useDrawer } from '@/lib/drawer-context';
import { chapters } from '@/lib/chapters';
import { getFavorites } from '@/lib/favorites';
import Colors from '@/constants/colors';

function GlassHeader() {
  const insets = useSafeAreaInsets();
  const { openDrawer } = useDrawer();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  return (
    <View style={[styles.glassHeader, { paddingTop: (insets.top || webTopInset) + 8 }]}>
      <LinearGradient
        colors={['rgba(253, 248, 242, 0.97)', 'rgba(253, 248, 242, 0.88)']}
        style={StyleSheet.absoluteFill}
      />
      <Pressable
        onPress={() => {
          if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          openDrawer();
        }}
        style={styles.menuButton}
      >
        <Ionicons name="menu" size={26} color={Colors.text} />
      </Pressable>
      <Text style={styles.headerTitle}>Apokalipsi</Text>
      <View style={styles.menuButton}>
        <MaterialCommunityIcons name="book-open-page-variant-outline" size={22} color={Colors.primary} />
      </View>
    </View>
  );
}

function HeroBanner() {
  return (
    <View style={styles.heroBanner}>
      <Image
        source={require('@/assets/images/hero-banner.png')}
        style={styles.heroImage}
        contentFit="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(253, 248, 242, 0.3)', 'rgba(253, 248, 242, 0.85)', Colors.background]}
        locations={[0, 0.35, 0.7, 1]}
        style={styles.heroGradient}
      />
      <View style={styles.heroContent}>
        <Text style={styles.heroLabel}>NHLAVUTELO</Text>
        <Text style={styles.heroTitle}>Xibuku xa Nhlavutelo</Text>
        <Text style={styles.heroSubtitle}>Livro do Apocalipse</Text>
      </View>
    </View>
  );
}

interface ChapterCardProps {
  chapter: typeof chapters[0];
  isFav: boolean;
}

function ChapterCard({ chapter, isFav }: ChapterCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.chapterCard,
        pressed && styles.chapterCardPressed,
      ]}
      onPress={() => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push({ pathname: '/chapter/[id]', params: { id: String(chapter.id) } });
      }}
    >
      <View style={styles.chapterNumberContainer}>
        <Text style={styles.chapterNumber}>{chapter.id}</Text>
      </View>
      <View style={styles.chapterInfo}>
        <Text style={styles.chapterTitle} numberOfLines={1}>{chapter.title}</Text>
        <Text style={styles.chapterSubtitle} numberOfLines={1}>{chapter.subtitle}</Text>
        <Text style={styles.chapterSummary} numberOfLines={2}>{chapter.summary}</Text>
      </View>
      <View style={styles.chapterActions}>
        {isFav && (
          <Ionicons name="heart" size={16} color={Colors.danger} style={{ marginBottom: 4 }} />
        )}
        <Feather name="chevron-right" size={18} color={Colors.textMuted} />
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [favorites, setFavorites] = useState<number[]>([]);
  const webBottomInset = Platform.OS === 'web' ? 84 : 0;

  useFocusEffect(
    useCallback(() => {
      getFavorites().then(setFavorites);
    }, [])
  );

  return (
    <View style={styles.container}>
      <GlassHeader />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: (insets.bottom || webBottomInset) + 90 }}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        <HeroBanner />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Capitulos</Text>
          <Text style={styles.sectionCount}>{chapters.length} capitulos</Text>
        </View>

        <View style={styles.chapterList}>
          {chapters.map((chapter) => (
            <ChapterCard
              key={chapter.id}
              chapter={chapter}
              isFav={favorites.includes(chapter.id)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  glassHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    overflow: 'hidden',
  },
  menuButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: Colors.text,
    letterSpacing: 1,
  },
  scrollView: {
    flex: 1,
  },
  heroBanner: {
    height: 280,
    width: '100%',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  heroLabel: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.accent,
    letterSpacing: 3,
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 26,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: Colors.text,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'PlayfairDisplay_600SemiBold',
    color: Colors.text,
  },
  sectionCount: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: Colors.textMuted,
  },
  chapterList: {
    paddingHorizontal: 16,
    gap: 10,
  },
  chapterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: '#8B6914',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  chapterCardPressed: {
    backgroundColor: Colors.surfaceElevated,
    transform: [{ scale: 0.98 }],
  },
  chapterNumberContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.warmCream,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: Colors.goldLight,
  },
  chapterNumber: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: Colors.primary,
  },
  chapterInfo: {
    flex: 1,
    marginRight: 8,
  },
  chapterTitle: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
    marginBottom: 2,
  },
  chapterSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: Colors.softBrown,
    marginBottom: 4,
  },
  chapterSummary: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
    lineHeight: 17,
  },
  chapterActions: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
