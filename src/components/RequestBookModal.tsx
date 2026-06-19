import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Modal, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { requestBook } from '../services/requestService';
import { useAuth } from '../context/AuthContext';
import { Spacing, FontSize, FontWeight, BorderRadius } from '../constants/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  prefilledTitle?: string;
}

export function RequestBookModal({ visible, onClose, prefilledTitle }: Props) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [title, setTitle] = useState(prefilledTitle || '');
  const [author, setAuthor] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    if (visible && prefilledTitle) setTitle(prefilledTitle);
  }, [visible, prefilledTitle]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Required', 'Please enter a book title.');
      return;
    }
    setSubmitting(true);
    try {
      await requestBook({
        title: title.trim(),
        author: author.trim() || 'Unknown',
        reason: reason.trim() || undefined,
        requestedBy: user?.uid || null,
        requestedByName: user?.email || undefined,
      });
      Alert.alert('Request Sent', 'We\'ll review your request and add the book if possible.');
      setTitle('');
      setAuthor('');
      setReason('');
      onClose();
    } catch {}
    setSubmitting(false);
  };

  const handleClose = () => {
    setTitle(prefilledTitle || '');
    setAuthor('');
    setReason('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.overlay}>
        <TouchableOpacity style={[styles.overlay, { backgroundColor: colors.overlay }]} activeOpacity={1} onPress={handleClose}>
          <TouchableOpacity activeOpacity={1} onPress={() => {}} style={[styles.modal, { backgroundColor: colors.surface }]}>
            <View style={[styles.handle, { backgroundColor: colors.textMuted }]} />

            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Request a Book</Text>
            <Text style={[styles.modalSub, { color: colors.textSecondary }]}>
              Can't find what you're looking for? Let us know and we'll try to add it.
            </Text>

            <Text style={[styles.label, { color: colors.textSecondary }]}>Book Title *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBg, color: colors.textPrimary, borderColor: colors.border }]}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. The Alchemist"
              placeholderTextColor={colors.textMuted}
              autoFocus
            />

            <Text style={[styles.label, { color: colors.textSecondary }]}>Author</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBg, color: colors.textPrimary, borderColor: colors.border }]}
              value={author}
              onChangeText={setAuthor}
              placeholder="e.g. Paulo Coelho"
              placeholderTextColor={colors.textMuted}
            />

            <Text style={[styles.label, { color: colors.textSecondary }]}>Note (optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: colors.inputBg, color: colors.textPrimary, borderColor: colors.border }]}
              value={reason}
              onChangeText={setReason}
              placeholder="Why do you want this book?"
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={3}
            />

            <View style={styles.btnRow}>
              <TouchableOpacity style={[styles.btn, { backgroundColor: colors.buttonSecondary }]} onPress={handleClose}>
                <Text style={[styles.btnText, { color: colors.buttonSecondaryText }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.primaryBtn, { backgroundColor: colors.accent, opacity: submitting || !title.trim() ? 0.5 : 1 }]}
                onPress={handleSubmit}
                disabled={submitting || !title.trim()}
              >
                <MaterialIcons name="send" size={16} color={colors.white} />
                <Text style={[styles.btnText, { color: colors.white }]}>Send Request</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  modal: {
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxxl,
    paddingTop: Spacing.sm,
  },
  handle: { width: 36, height: 4, borderRadius: BorderRadius.full, alignSelf: 'center', marginBottom: Spacing.lg },
  modalTitle: { fontSize: FontSize.heading4, fontWeight: FontWeight.bold, letterSpacing: -0.3, marginBottom: Spacing.xxs },
  modalSub: { fontSize: FontSize.bodySm, marginBottom: Spacing.lg, lineHeight: 20 },
  label: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: Spacing.xs, marginTop: Spacing.sm },
  input: { borderRadius: BorderRadius.md, paddingHorizontal: Spacing.lg, height: 48, fontSize: FontSize.bodyMd, borderWidth: 1 },
  textArea: { height: 88, paddingTop: Spacing.md, textAlignVertical: 'top' },
  btnRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.xl },
  btn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, paddingVertical: Spacing.md, borderRadius: BorderRadius.md },
  primaryBtn: { borderWidth: 0 },
  btnText: { fontSize: FontSize.bodyMd, fontWeight: FontWeight.semibold },
});
