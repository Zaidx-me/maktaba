import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, PanResponder, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Spacing, FontSize, FontWeight, BorderRadius, Shadows } from '../src/constants/theme';
import { useTheme } from '../src/context/ThemeContext';
import { getDismissedNotifications, dismissNotification } from '../src/services/localDb';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  icon: string;
}

const ALL_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'Welcome to Maktaba', message: 'Discover thousands of free Urdu and PDF books.', time: '2 min ago', icon: 'menu-book' },
  { id: '2', title: 'New Urdu Collection', message: '2,138+ Urdu books just added. Explore classics, poetry, and more.', time: '1 hour ago', icon: 'translate' },
  { id: '3', title: 'Reading Reminder', message: 'Continue where you left off. Your books are waiting!', time: '3 hours ago', icon: 'history' },
];

const { width: SCREEN_W } = Dimensions.get('window');
const SWIPE_THRESHOLD = -SCREEN_W * 0.3;

function SwipeableNotif({ notif, onDismiss, colors }: { notif: Notification; onDismiss: () => void; colors: any }) {
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 10 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderMove: (_, g) => { if (g.dx < 0) translateX.setValue(g.dx); },
      onPanResponderRelease: (_, g) => {
        if (g.dx < SWIPE_THRESHOLD) {
          Animated.parallel([
            Animated.timing(translateX, { toValue: -SCREEN_W, duration: 250, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
          ]).start(() => onDismiss());
        } else {
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  return (
    <Animated.View style={[styles.notifAnimated, { opacity, transform: [{ translateX }] }]}>
      <View style={[styles.deleteBg, { backgroundColor: colors.error }]}>
        <MaterialIcons name="delete-outline" size={18} color={colors.white} />
        <Text style={[styles.deleteText, { color: colors.white }]}>Dismiss</Text>
      </View>
      <Animated.View {...panResponder.panHandlers} style={[styles.notifCard, {
        backgroundColor: colors.surfaceElevated,
        borderLeftColor: colors.accent,
      }, Shadows.card]}>
        <View style={[styles.iconCircle, { backgroundColor: colors.accentSoft }]}>
          <MaterialIcons name={notif.icon as any} size={20} color={colors.accent} />
        </View>
        <View style={styles.notifContent}>
          <Text style={[styles.notifTitle, { color: colors.textPrimary }]}>{notif.title}</Text>
          <Text style={[styles.notifMessage, { color: colors.textSecondary }]} numberOfLines={2}>{notif.message}</Text>
          <Text style={[styles.notifTime, { color: colors.textMuted }]}>{notif.time}</Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    const dismissed = await getDismissedNotifications();
    setNotifications(ALL_NOTIFICATIONS.filter(n => !dismissed.includes(n.id)));
  };

  const dismissNotif = async (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    await dismissNotification(id);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="chevron-left" size={24} color={colors.accent} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Notifications</Text>
        {notifications.length > 0 ? (
          <TouchableOpacity onPress={async () => {
            for (const n of notifications) await dismissNotification(n.id);
            setNotifications([]);
          }}>
            <Text style={[styles.clearAll, { color: colors.accent }]}>Clear all</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.backBtn} />
        )}
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIconCircle, { backgroundColor: colors.accentSoft }]}>
            <MaterialIcons name="notifications-off" size={48} color={colors.accent} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>All caught up!</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>No new notifications</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {notifications.map((notif) => (
            <SwipeableNotif key={notif.id} notif={notif} onDismiss={() => dismissNotif(notif.id)} colors={colors} />
          ))}
          <Text style={[styles.swipeHint, { color: colors.textMuted }]}>Swipe left to dismiss</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xxl, paddingBottom: Spacing.lg },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: FontSize.heading4, fontWeight: FontWeight.bold },
  clearAll: { fontSize: FontSize.bodyMd, fontWeight: FontWeight.semibold },
  list: { paddingHorizontal: Spacing.xxl, paddingBottom: 100 },
  notifAnimated: { marginBottom: Spacing.sm },
  deleteBg: { position: 'absolute', right: 0, top: 0, bottom: 0, width: '100%', borderRadius: BorderRadius.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingRight: Spacing.xl, gap: Spacing.sm },
  deleteText: { fontWeight: FontWeight.semibold, fontSize: FontSize.bodySm },
  notifCard: { flexDirection: 'row', alignItems: 'flex-start', padding: Spacing.lg, borderRadius: BorderRadius.lg, borderLeftWidth: 3 },
  iconCircle: { width: 44, height: 44, borderRadius: BorderRadius.xl, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  notifContent: { flex: 1 },
  notifTitle: { fontSize: FontSize.bodyMdMedium, fontWeight: FontWeight.semibold, marginBottom: Spacing.xxs },
  notifMessage: { fontSize: FontSize.bodySm, lineHeight: 20, marginBottom: Spacing.xs },
  notifTime: { fontSize: FontSize.caption },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyIconCircle: { width: 96, height: 96, borderRadius: BorderRadius.xxxl, justifyContent: 'center', alignItems: 'center' },
  emptyTitle: { fontSize: FontSize.heading3, fontWeight: FontWeight.semibold, marginTop: Spacing.xl },
  emptySubtitle: { fontSize: FontSize.bodyMd, marginTop: Spacing.sm },
  swipeHint: { fontSize: FontSize.caption, textAlign: 'center', marginTop: Spacing.xl },
});
