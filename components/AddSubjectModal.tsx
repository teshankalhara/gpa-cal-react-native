import { useGPA } from '@/contexts/GPAContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Subject } from '@/types';
import { ChevronDown, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useResponsiveDimensions } from '@/utils/responsive';

interface AddSubjectModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (subject: Omit<Subject, 'id'>) => void;
  initialData?: Subject | null;
}

export default function AddSubjectModal({ visible, onClose, onSubmit, initialData }: AddSubjectModalProps) {
  const { colors } = useTheme();
  const { width } = useResponsiveDimensions();
  const { gradeScale } = useGPA();
  const modalMaxWidth = Math.min(420, width * 0.92);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [credits, setCredits] = useState('');
  const [grade, setGrade] = useState('');
  const [showGradePicker, setShowGradePicker] = useState(false);

  useEffect(() => {
    if (initialData) {
      setCode(initialData.code);
      setName(initialData.name);
      setCredits(String(initialData.credits));
      setGrade(initialData.grade);
    } else {
      setCode('');
      setName('');
      setCredits('');
      setGrade('');
    }
  }, [initialData, visible]);

  const handleSubmit = () => {
    if (!code.trim() || !name.trim() || !credits.trim() || !grade) return;
    onSubmit({
      code: code.trim(),
      name: name.trim(),
      credits: parseFloat(credits) || 0,
      grade,
    });
    setCode('');
    setName('');
    setCredits('');
    setGrade('');
    onClose();
  };

  const isValid = code.trim() && name.trim() && credits.trim() && parseFloat(credits) > 0 && grade;

  const handleClose = () => {
    setShowGradePicker(false);
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
                  <Text style={[styles.title, { color: colors.text }]}>
                    {initialData ? 'Edit Subject' : 'Add Subject'}
                  </Text>
                  <TouchableOpacity onPress={handleClose}>
                    <X size={22} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>Subject Code</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.surfaceAlt, color: colors.text, borderColor: colors.border }]}
                    placeholder="e.g. CS101"
                    placeholderTextColor={colors.textTertiary}
                    value={code}
                    onChangeText={setCode}
                    autoCapitalize="characters"
                  />

                  <Text style={[styles.label, { color: colors.textSecondary }]}>Subject Name</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.surfaceAlt, color: colors.text, borderColor: colors.border }]}
                    placeholder="e.g. Data Structures"
                    placeholderTextColor={colors.textTertiary}
                    value={name}
                    onChangeText={setName}
                  />

                  <Text style={[styles.label, { color: colors.textSecondary }]}>Credits</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.surfaceAlt, color: colors.text, borderColor: colors.border }]}
                    placeholder="e.g. 3"
                    placeholderTextColor={colors.textTertiary}
                    value={credits}
                    onChangeText={setCredits}
                    keyboardType="decimal-pad"
                  />

                  <Text style={[styles.label, { color: colors.textSecondary }]}>Grade</Text>
                  <TouchableOpacity
                    style={[styles.input, styles.gradeSelector, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
                    onPress={() => setShowGradePicker(!showGradePicker)}
                  >
                    <Text style={{ color: grade ? colors.text : colors.textTertiary, fontSize: 16 }}>
                      {grade || 'Select grade'}
                    </Text>
                    <ChevronDown size={18} color={colors.textTertiary} />
                  </TouchableOpacity>

                  {showGradePicker && (
                    <View style={[styles.gradeGrid, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
                      {gradeScale.map((g) => (
                        <TouchableOpacity
                          key={g.grade}
                          style={[
                            styles.gradeChip,
                            {
                              backgroundColor: grade === g.grade ? colors.accent : colors.surface,
                              borderColor: grade === g.grade ? colors.accent : colors.border,
                            },
                          ]}
                          onPress={() => {
                            setGrade(g.grade);
                            setShowGradePicker(false);
                          }}
                        >
                          <Text
                            style={[
                              styles.gradeChipText,
                              { color: grade === g.grade ? '#fff' : colors.text },
                            ]}
                          >
                            {g.grade}
                          </Text>
                          <Text
                            style={[
                              styles.gradeChipPoints,
                              { color: grade === g.grade ? 'rgba(255,255,255,0.7)' : colors.textTertiary },
                            ]}
                          >
                            {g.points.toFixed(1)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </ScrollView>

                <TouchableOpacity
                  style={[styles.button, { backgroundColor: colors.accent, opacity: isValid ? 1 : 0.4 }]}
                  onPress={handleSubmit}
                  disabled={!isValid}
                >
                  <Text style={styles.buttonText}>{initialData ? 'Update' : 'Add Subject'}</Text>
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
    padding: 20,
  },
  modal: {
    width: '100%',
    minWidth: 320,
    maxHeight: 560,
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
    marginTop: 12,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 16,
    borderWidth: 1,
  },
  gradeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gradeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  gradeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    minWidth: 54,
  },
  gradeChipText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  gradeChipPoints: {
    fontSize: 10,
    marginTop: 1,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600' as const,
  },
});