import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  Platform,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useDrawer } from '@/lib/drawer-context';
import { router } from 'expo-router';
import Colors from '@/constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = SCREEN_WIDTH * 0.78;

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}

export default function DrawerMenu() {
  const { isOpen, closeDrawer } = useDrawer();
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          damping: 20,
          stiffness: 200,
        }),
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: -DRAWER_WIDTH,
          useNativeDriver: true,
          damping: 20,
          stiffness: 200,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen]);

  const navigate = (route: string) => {
    closeDrawer();
    setTimeout(() => {
      if (route === 'home') {
        router.push('/(tabs)');
      } else if (route === 'favorites') {
        router.push('/(tabs)/favorites');
      } else if (route === 'about') {
        router.push('/about');
      }
    }, 100);
  };

  const openWhatsApp = () => {
    closeDrawer();
    const phone = '+258849275780';
    const message = 'Ola! Estou a contactar atraves do app Apokalipsi.';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  const menuItems: MenuItem[] = [
    {
      icon: <Ionicons name="home-outline" size={22} color={Colors.primary} />,
      label: 'Inicio',
      onPress: () => navigate('home'),
    },
    {
      icon: <Ionicons name="heart-outline" size={22} color={Colors.primary} />,
      label: 'Favoritos',
      onPress: () => navigate('favorites'),
    },
    {
      icon: <Ionicons name="information-circle-outline" size={22} color={Colors.primary} />,
      label: 'Sobre Nos',
      onPress: () => navigate('about'),
    },
    {
      icon: <Ionicons name="logo-whatsapp" size={22} color="#25D366" />,
      label: 'Contacto',
      onPress: openWhatsApp,
    },
  ];

  if (!isOpen) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Animated.View
        style={[
          styles.overlay,
          { opacity: overlayAnim },
        ]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={closeDrawer} />
      </Animated.View>

      <Animated.View
        style={[
          styles.drawer,
          {
            width: DRAWER_WIDTH,
            transform: [{ translateX: slideAnim }],
            paddingTop: insets.top + 20,
            paddingBottom: insets.bottom + 20,
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <MaterialCommunityIcons name="book-open-page-variant" size={32} color={Colors.accent} />
          </View>
          <Text style={styles.appName}>Apokalipsi</Text>
          <Text style={styles.appSubtitle}>Nhlavutelo ya Yesu Kriste</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.menuList}>
          {menuItems.map((item, index) => (
            <Pressable
              key={index}
              style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.menuItemPressed,
              ]}
              onPress={item.onPress}
            >
              <View style={styles.menuIconContainer}>
                {item.icon}
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Feather name="chevron-right" size={18} color={Colors.textMuted} />
            </Pressable>
          ))}
        </View>

        <View style={styles.footer}>
          <View style={styles.divider} />
          <Text style={styles.footerText}>Desenvolvido por Nhlavutelo</Text>
          <Text style={styles.footerYear}>2025</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(45, 31, 14, 0.4)',
    zIndex: 100,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: Colors.surface,
    zIndex: 101,
    borderRightWidth: 1,
    borderRightColor: Colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  logoContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.warmCream,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.goldLight,
  },
  appName: {
    fontSize: 24,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: Colors.text,
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginHorizontal: 24,
    marginVertical: 8,
  },
  menuList: {
    flex: 1,
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginHorizontal: 12,
    borderRadius: 12,
  },
  menuItemPressed: {
    backgroundColor: Colors.surfaceElevated,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.warmCream,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: Colors.text,
  },
  footer: {
    paddingHorizontal: 24,
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 12,
  },
  footerYear: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
});
