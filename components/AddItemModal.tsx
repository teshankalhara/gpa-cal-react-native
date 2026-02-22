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

interface AddItemModalProps {
  visible: boolean;
  title: string;
  placeholder: string;
  onClose: () => void;
  onSubmit: (value: string) => void;
  initialValue?: string;
}

export default function AddItemModal({
  visible,
  title,
  placeholder,
  onClose,
  onSubmit,
  initialValue = '',
}: AddItemModalProps) {
  const { colors } = useTheme();
  const { width } = useResponsiveDimensions();
  const [value, setValue] = useState(initialValue);
  const modalMaxWidth = Math.min(420, width * 0.92);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (trimmed) {
      onSubmit(trimmed);
      setValue('');
      onClose();
    }
  };

  const handleClose = () => {
    setValue('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
              <View style={[styles.modal, { backgroundColor: colors.surface, maxWidth: modalMaxWidth }]}>
                <View style={styles.header}>
                  <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                  <TouchableOpacity onPress={handleClose}>
                    <X size={22} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.surfaceAlt,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  placeholder={placeholder}
                  placeholderTextColor={colors.textTertiary}
                  value={value}
                  onChangeText={setValue}
                  autoFocus
                  onSubmitEditing={handleSubmit}
                  returnKeyType="done"
                />
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: colors.accent, opacity: value.trim() ? 1 : 0.5 }]}
                  onPress={handleSubmit}
                  disabled={!value.trim()}
                >
                  <Text style={styles.buttonText}>Save</Text>
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
    padding: 24,
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
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600' as const,
  },
});