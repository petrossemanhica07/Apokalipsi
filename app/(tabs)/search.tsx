import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { chapters } from '@/lib/chapters';
import Colors from '@/constants/colors';

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const webTopInset = Platform.OS === 'web' ? 67 : 0;
  const webBottomInset = Platform.OS === 'web' ? 84 : 0;

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return chapters.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.subtitle.toLowerCase().includes(q) ||
      c.summary.toLowerCase().includes(q) ||
      c.content.toLowerCase().includes(q) ||
      String(c.id) === q
    );
  }, [query]);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: (insets.top || webTopInset) + 8 }]}>
        <Text style={styles.headerTitle}>Buscar</Text>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar capitulos..."
            placeholderTextColor={Colors.textMuted}
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={20} color={Colors.textMuted} />
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: (insets.bottom || webBottomInset) + 90 }}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        contentInsetAdjustmentBehavior="automatic"
      >
        {query.trim() === '' ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="search-outline" size={48} color={Colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>Buscar Capitulos</Text>
            <Text style={styles.emptyText}>
              Escreva o nome ou numero do capitulo para encontrar
            </Text>
          </View>
        ) : results.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="alert-circle-outline" size={48} color={Colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>Sem Resultados</Text>
            <Text style={styles.emptyText}>
              Nenhum capitulo encontrado para "{query}"
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            <Text style={styles.resultCount}>{results.length} resultado{results.length !== 1 ? 's' : ''}</Text>
            {results.map((chapter) => (
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
                <View style={styles.numberBadge}>
                  <Text style={styles.numberText}>{chapter.id}</Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{chapter.title}</Text>
                  <Text style={styles.cardSubtitle} numberOfLines={1}>{chapter.subtitle}</Text>
                  <Text style={styles.cardSummary} numberOfLines={2}>{chapter.summary}</Text>
                </View>
                <Feather name="chevron-right" size={18} color={Colors.textMuted} />
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
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: Colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: Colors.text,
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
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
  resultCount: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: Colors.textMuted,
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  card: {
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
  cardPressed: {
    backgroundColor: Colors.surfaceElevated,
    transform: [{ scale: 0.98 }],
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
    marginBottom: 4,
  },
  cardSummary: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
    lineHeight: 17,
  },
});
