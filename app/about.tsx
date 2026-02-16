import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  const openWhatsApp = () => {
    const phone = '+258849275780';
    const message = 'Ola! Estou a contactar atraves do app Apokalipsi.';
    Linking.openURL(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: (insets.top || webTopInset) + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Sobre Nos</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <LinearGradient
            colors={[Colors.warmCream, Colors.background]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.logoContainer}>
            <MaterialCommunityIcons name="book-open-page-variant" size={48} color={Colors.accent} />
          </View>
          <Text style={styles.appName}>Apokalipsi</Text>
          <Text style={styles.appVersion}>Versao 1.0.0</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SOBRE O APP</Text>
          <View style={styles.card}>
            <Text style={styles.cardText}>
              Apokalipsi e um aplicativo dedicado ao estudo do Livro do Apocalipse (Nhlavutelo) na lingua Tsonga. 
              O app oferece todos os 22 capitulos com texto completo, resumos, audio para ouvir cada capitulo 
              e a possibilidade de comentar e partilhar reflexoes.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>FUNCIONALIDADES</Text>
          <View style={styles.featureList}>
            {[
              { icon: 'book-open-variant', text: '22 capitulos completos do Apocalipse em Tsonga' },
              { icon: 'headphones', text: 'Player de audio para ouvir cada capitulo' },
              { icon: 'heart-outline', text: 'Sistema de favoritos para guardar capitulos' },
              { icon: 'magnify', text: 'Busca rapida de capitulos' },
              { icon: 'comment-text-outline', text: 'Comentarios em cada capitulo via Firebase' },
              { icon: 'share-variant-outline', text: 'Contacto directo via WhatsApp' },
            ].map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <MaterialCommunityIcons name={feature.icon as any} size={20} color={Colors.primary} />
                </View>
                <Text style={styles.featureText}>{feature.text}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>CONTACTO</Text>
          <Pressable
            style={({ pressed }) => [
              styles.contactCard,
              pressed && styles.contactCardPressed,
            ]}
            onPress={openWhatsApp}
          >
            <View style={styles.whatsappIcon}>
              <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>WhatsApp</Text>
              <Text style={styles.contactSubtitle}>Fale connosco</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Desenvolvido com dedicacao por</Text>
          <Text style={styles.footerDev}>Nhlavutelo</Text>
          <Text style={styles.footerYear}>2025</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
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
  heroSection: {
    alignItems: 'center',
    paddingVertical: 40,
    position: 'relative',
  },
  logoContainer: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: Colors.gold,
    shadowColor: '#8B6914',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  appName: {
    fontSize: 30,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: Colors.text,
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: Colors.textMuted,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.accent,
    letterSpacing: 2,
    marginBottom: 12,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: '#8B6914',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardText: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  featureList: {
    gap: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: '#8B6914',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.warmCream,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.text,
    lineHeight: 20,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: '#8B6914',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  contactCardPressed: {
    backgroundColor: Colors.surfaceElevated,
  },
  whatsappIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.warmCream,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
  },
  contactSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: Colors.textMuted,
    marginBottom: 4,
  },
  footerDev: {
    fontSize: 16,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: Colors.primary,
    marginBottom: 2,
  },
  footerYear: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: Colors.textMuted,
  },
});
