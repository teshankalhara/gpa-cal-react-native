import { useTheme } from '@/contexts/ThemeContext';
import { X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useResponsiveDimensions } from '@/utils/responsive';

interface AddAccountModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string, program: string) => void;
}

export default function AddAccountModal({ visible, onClose, onSubmit }: AddAccountModalProps) {
  const { colors } = useTheme();
  const { width } = useResponsiveDimensions();
  const [name, setName] = useState('');
  const [program, setProgram] = useState('');

  const handleSubmit = () => {
    const trimmedName = name.trim();
    if (trimmedName) {
      onSubmit(trimmedName, program.trim());
      setName('');
      setProgram('');
      onClose();
    }
  };

  const handleClose = () => {
    setName('');
    setProgram('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
              <View
                style={[
                  styles.modal,
                  {
                    backgroundColor: colors.surface,
                    width: width * 0.95, // almost full screen width
                    maxWidth: 600,       // optional max width for very large screens
                  },
                ]}
              >
                {/* Header */}
                <View style={styles.header}>
                  <Text style={[styles.title, { color: colors.text }]}>Add Account</Text>
                  <TouchableOpacity onPress={handleClose}>
                    <X size={22} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                {/* Account Name */}
                <Text style={[styles.label, { color: colors.textSecondary }]}>Account Name</Text>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: colors.surfaceAlt, color: colors.text, borderColor: colors.border },
                  ]}
                  placeholder="e.g. Peter Parker"
                  placeholderTextColor={colors.textTertiary}
                  value={name}
                  onChangeText={setName}
                  autoFocus
                />

                {/* Program / Degree */}
                <Text style={[styles.label, { color: colors.textSecondary }]}>Program / Degree (optional)</Text>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: colors.surfaceAlt, color: colors.text, borderColor: colors.border },
                  ]}
                  placeholder="e.g. Bsc Hons Information Technology"
                  placeholderTextColor={colors.textTertiary}
                  value={program}
                  onChangeText={setProgram}
                  onSubmitEditing={handleSubmit}
                  returnKeyType="done"
                />

                {/* Submit Button */}
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: colors.accent, opacity: name.trim() ? 1 : 0.4 }]}
                  onPress={handleSubmit}
                  disabled={!name.trim()}
                >
                  <Text style={styles.buttonText}>Add Account</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12, // reduced padding for full-width modal
  },
  modal: {
    width: '100%',
    minWidth: 300,
    borderRadius: 20,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  label: {
    fontSize: 13,
    fontWeight: '600' as const,
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600' as const,
  },
});