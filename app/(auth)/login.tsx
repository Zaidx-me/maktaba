import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator,
  Alert, TextInput, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../src/context/ThemeContext';
import { Spacing, FontSize, FontWeight, BorderRadius, Shadows } from '../../src/constants/theme';
import { signInWithEmail, signUpWithEmail, resetPassword } from '../../src/services/auth';
import { useAuth } from '../../src/context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setSkipped } = useAuth();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const goToTabs = () => {
    setNavigating(true);
    setSkipped(false);
    setTimeout(() => router.replace('/(tabs)'), 500);
  };

  const handleEmailAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      let user;
      if (isSignUp) {
        user = await signUpWithEmail(email.trim(), password, name.trim() || undefined);
      } else {
        user = await signInWithEmail(email.trim(), password);
      }
      setLoading(false);
      if (user) goToTabs();
    } catch (e: any) {
      setLoading(false);
      let msg = 'Something went wrong';
      if (e?.code === 'auth/user-not-found') msg = 'No account found with this email';
      else if (e?.code === 'auth/wrong-password') msg = 'Incorrect password';
      else if (e?.code === 'auth/email-already-in-use') msg = 'An account with this email already exists';
      else if (e?.code === 'auth/invalid-email') msg = 'Invalid email address';
      else if (e?.code === 'auth/weak-password') msg = 'Password is too weak';
      else if (e?.code === 'auth/invalid-credential') msg = 'Invalid email or password';
      Alert.alert('Error', msg);
    }
  };

  const handleSkip = () => {
    setSkipped(true);
    router.replace('/(tabs)');
  };

  const handleForgotPassword = async () => {
    if (!resetEmail.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    setResetLoading(true);
    try {
      await resetPassword(resetEmail.trim());
      setResetLoading(false);
      setShowForgotPassword(false);
      setResetEmail('');
      Alert.alert('Email Sent', 'Check your inbox for a password reset link.');
    } catch (e: any) {
      setResetLoading(false);
      let msg = 'Something went wrong';
      if (e?.code === 'auth/user-not-found') msg = 'No account found with this email';
      else if (e?.code === 'auth/invalid-email') msg = 'Invalid email address';
      Alert.alert('Error', msg);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + Spacing.xxxl, paddingBottom: insets.bottom + Spacing.xxl }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo + Brand */}
        <View style={styles.brandSection}>
          <View style={[styles.logoCircle, { backgroundColor: colors.accentSoft }]}>
            <MaterialIcons name="menu-book" size={32} color={colors.accentBright} />
          </View>
          <Text style={[styles.appName, { color: colors.textPrimary }]}>Maktaba</Text>
          <Text style={[styles.tagline, { color: colors.textSecondary }]}>
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formSection}>
          {isSignUp && (
            <View style={[styles.inputWrap, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              <MaterialIcons name="person-outline" size={18} color={colors.textMuted} />
              <TextInput
                style={[styles.input, { color: colors.textPrimary }]}
                placeholder="Full name"
                placeholderTextColor={colors.textMuted}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={[styles.inputWrap, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
            <MaterialIcons name="mail-outline" size={18} color={colors.textMuted} />
            <TextInput
              style={[styles.input, { color: colors.textPrimary }]}
              placeholder="Email"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View style={[styles.inputWrap, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
            <MaterialIcons name="lock-outline" size={18} color={colors.textMuted} />
            <TextInput
              style={[styles.input, { color: colors.textPrimary }]}
              placeholder="Password"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <MaterialIcons name={showPassword ? 'visibility-off' : 'visibility'} size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {!isSignUp && (
            <TouchableOpacity onPress={() => { setResetEmail(email); setShowForgotPassword(true); }} style={styles.forgotRow}>
              <Text style={[styles.forgotText, { color: colors.accentBright }]}>Forgot Password?</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: colors.buttonPrimary }, Shadows.elevated]}
            onPress={handleEmailAuth}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.buttonPrimaryText} />
            ) : (
              <Text style={[styles.submitText, { color: colors.buttonPrimaryText }]}>
                {isSignUp ? 'Create Account' : 'Sign In'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Toggle */}
        <TouchableOpacity style={styles.toggleRow} onPress={() => setIsSignUp(!isSignUp)} activeOpacity={0.7}>
          <Text style={[styles.toggleText, { color: colors.textSecondary }]}>
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          </Text>
          <Text style={[styles.toggleText, { color: colors.accentBright, fontWeight: FontWeight.bold }]}>
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </Text>
        </TouchableOpacity>

        {/* Skip */}
        <TouchableOpacity style={styles.skipRow} onPress={handleSkip} activeOpacity={0.7}>
          <Text style={[styles.skipText, { color: colors.textMuted }]}>Skip for now</Text>
        </TouchableOpacity>

        {/* Terms */}
        <Text style={[styles.terms, { color: colors.textTertiary }]}>
          By continuing, you agree to our Terms and Privacy Policy
        </Text>
      </ScrollView>

      {(loading || navigating) && (
        <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
          <ActivityIndicator size="large" color={colors.buttonPrimary} />
        </View>
      )}

      {showForgotPassword && (
        <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={[styles.resetModal, { backgroundColor: colors.surface }]}
          >
            <Text style={[styles.resetTitle, { color: colors.textPrimary }]}>Reset Password</Text>
            <Text style={[styles.resetSub, { color: colors.textSecondary }]}>
              Enter your email and we'll send you a reset link.
            </Text>
            <TextInput
              style={[styles.resetInput, { backgroundColor: colors.inputBg, color: colors.textPrimary, borderColor: colors.border }]}
              placeholder="Email address"
              placeholderTextColor={colors.textMuted}
              value={resetEmail}
              onChangeText={setResetEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoFocus
            />
            <View style={styles.resetBtns}>
              <TouchableOpacity
                style={[styles.resetBtn, { backgroundColor: colors.buttonSecondary }]}
                onPress={() => { setShowForgotPassword(false); setResetEmail(''); }}
              >
                <Text style={[styles.resetBtnText, { color: colors.buttonSecondaryText }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.resetBtn, { backgroundColor: colors.buttonPrimary, opacity: resetLoading || !resetEmail.trim() ? 0.5 : 1 }]}
                onPress={handleForgotPassword}
                disabled={resetLoading || !resetEmail.trim()}
              >
                {resetLoading ? (
                  <ActivityIndicator size="small" color={colors.buttonPrimaryText} />
                ) : (
                  <Text style={[styles.resetBtnText, { color: colors.buttonPrimaryText }]}>Send Link</Text>
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing.xxl },
  brandSection: { alignItems: 'center', marginBottom: Spacing.xxxl + 20 },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.xxl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  appName: {
    fontSize: FontSize.heading1,
    fontWeight: FontWeight.extrabold,
    letterSpacing: -0.5,
    marginBottom: Spacing.xs,
  },
  tagline: { fontSize: FontSize.bodyMd },
  formSection: { gap: Spacing.md, marginBottom: Spacing.xl },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    borderWidth: 1,
    height: 52,
  },
  input: { flex: 1, fontSize: FontSize.bodyMd, height: '100%' },
  submitBtn: {
    paddingVertical: Spacing.md + 4,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  submitText: { fontSize: FontSize.bodyMdMedium, fontWeight: FontWeight.bold },
  toggleRow: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.lg },
  toggleText: { fontSize: FontSize.bodyMd },
  skipRow: { alignItems: 'center', marginTop: Spacing.md },
  skipText: { fontSize: FontSize.bodySm, fontWeight: FontWeight.medium },
  terms: { fontSize: FontSize.xs, textAlign: 'center', marginTop: Spacing.xl, lineHeight: 18 },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  forgotRow: { alignItems: 'flex-end', marginTop: -Spacing.xs },
  forgotText: { fontSize: FontSize.bodySm, fontWeight: FontWeight.semibold },
  resetModal: {
    marginHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
  },
  resetTitle: { fontSize: FontSize.heading4, fontWeight: FontWeight.bold, marginBottom: Spacing.xs },
  resetSub: { fontSize: FontSize.bodySm, marginBottom: Spacing.lg, lineHeight: 20 },
  resetInput: {
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 48,
    fontSize: FontSize.bodyMd,
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  resetBtns: { flexDirection: 'row', gap: Spacing.sm },
  resetBtn: { flex: 1, paddingVertical: Spacing.md, borderRadius: BorderRadius.md, alignItems: 'center' },
  resetBtnText: { fontSize: FontSize.bodyMd, fontWeight: FontWeight.semibold },
});
