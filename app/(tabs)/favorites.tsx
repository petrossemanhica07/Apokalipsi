import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useDrawer } from '@/lib/drawer-context';
import { chapters } from '@/lib/chapters';
import { getFavorites, toggleFavorite } from '@/lib/favorites';
import Colors from '@/constants/colors';

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const { openDrawer } = useDrawer();
  const [favorites, setFavorites] = useState<number[]>([]);
  const webTopInset = Platform.OS === 'web' ? 67 : 0;
  const webBottomInset = Platform.OS === 'web' ? 84 : 0;

  const loadFavorites = useCallback(async () => {
    const favs = await getFavorites();
    setFavorites(favs);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

  const favoriteChapters = chapters.filter(c => favorites.includes(c.id));

  const handleRemoveFavorite = async (chapterId: number) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await toggleFavorite(chapterId);
    loadFavorites();
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: (insets.top || webTopInset) + 8 }]}>
        <Pressable onPress={openDrawer} style={styles.headerButton}>
          <Ionicons name="menu" size={26} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Favoritos</Text>
        <View style={styles.headerButton}>
          <Ionicons name="heart" size={22} color={Colors.danger} />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: (insets.bottom || webBottomInset) + 90 }}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        {favoriteChapters.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="heart-outline" size={48} color={Colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>Sem Favoritos</Text>
            <Text style={styles.emptyText}>
              Os capitulos que marcar como favoritos aparecerao aqui
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {favoriteChapters.map((chapter) => (
              <Pressable
                key={chapter.id}
                style={({ pressed }) => [
                  styles.card,
                  pressed && styles.cardPressed,
                ]}
                onPress={() => {
                  if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push({ pathname: '/chapter/[id]', params: { id: String(chapter.id) } });
                }}
              >
                <View style={styles.cardLeft}>
                  <View style={styles.numberBadge}>
                    <Text style={styles.numberText}>{chapter.id}</Text>
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle} numberOfLines={1}>{chapter.title}</Text>
                    <Text style={styles.cardSubtitle} numberOfLines={1}>{chapter.subtitle}</Text>
                  </View>
                </View>
                <View style={styles.cardRight}>
                  <Pressable
                    onPress={(e) => {
                      e.stopPropagation();
                      handleRemoveFavorite(chapter.id);
                    }}
                    style={styles.removeButton}
                    hitSlop={10}
                  >
                    <Ionicons name="heart-dislike" size={18} color={Colors.danger} />
                  </Pressable>
                  <Feather name="chevron-right" size={18} color={Colors.textMuted} />
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  headerButton: {
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
  },
  scrollView: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: Colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  list: {
    padding: 16,
    gap: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  cardPressed: {
    backgroundColor: Colors.surfaceElevated,
    transform: [{ scale: 0.98 }],
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  numberBadge: {
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
  numberText: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: Colors.primary,
  },
  cardInfo: {
    flex: 1,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: Colors.softBrown,
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
