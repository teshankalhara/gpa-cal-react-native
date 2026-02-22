import { useGPA } from '@/contexts/GPAContext';
import { useTheme } from '@/contexts/ThemeContext';
import * as Haptics from 'expo-haptics';
import { Download, Plus, Trash2, X } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import {
    Alert,
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

export default function GradeScaleScreen() {
  const { colors } = useTheme();
  const { gradeScale, updateGradeScale, importGradeScale } = useGPA();
  const [showImport, setShowImport] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [showAddGrade, setShowAddGrade] = useState(false);
  const [newGrade, setNewGrade] = useState('');
  const [newPoints, setNewPoints] = useState('');

  const handleUpdatePoints = useCallback(
    (index: number, value: string) => {
      const num = parseFloat(value);
      if (isNaN(num) && value !== '') return;
      const updated = [...gradeScale];
      updated[index] = { ...updated[index], points: isNaN(num) ? 0 : num };
      updateGradeScale(updated);
    },
    [gradeScale, updateGradeScale]
  );

  const handleDeleteGrade = useCallback(
    (index: number) => {
      const grade = gradeScale[index];
      Alert.alert('Delete Grade', `Remove "${grade.grade}" from scale?`, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updated = gradeScale.filter((_, i) => i !== index);
            updateGradeScale(updated);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          },
        },
      ]);
    },
    [gradeScale, updateGradeScale]
  );

  const handleAddGrade = useCallback(() => {
    if (!newGrade.trim() || !newPoints.trim()) return;
    const points = parseFloat(newPoints);
    if (isNaN(points)) return;
    if (gradeScale.some((g) => g.grade === newGrade.trim())) {
      Alert.alert('Duplicate', 'This grade already exists.');
      return;
    }
    const updated = [...gradeScale, { grade: newGrade.trim(), points }];
    updated.sort((a, b) => b.points - a.points);
    updateGradeScale(updated);
    setNewGrade('');
    setNewPoints('');
    setShowAddGrade(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [newGrade, newPoints, gradeScale, updateGradeScale]);

  const handleImport = useCallback(() => {
    const success = importGradeScale(importJson);
    if (success) {
      setShowImport(false);
      setImportJson('');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Grade scale imported successfully.');
    } else {
      Alert.alert(
        'Invalid JSON',
        'Please provide a valid JSON array like:\n[{"grade":"A+","points":4.0},{"grade":"A","points":4.0}]'
      );
    }
  }, [importJson, importGradeScale]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.topActions}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.accent }]}
            onPress={() => setShowAddGrade(true)}
          >
            <Plus size={16} color="#fff" />
            <Text style={styles.actionBtnText}>Add Grade</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}
            onPress={() => setShowImport(true)}
          >
            <Download size={16} color={colors.text} />
            <Text style={[styles.actionBtnText, { color: colors.text }]}>Import JSON</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.headerRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.headerCell, styles.gradeCol, { color: colors.textSecondary }]}>Grade</Text>
          <Text style={[styles.headerCell, styles.pointsCol, { color: colors.textSecondary }]}>Points</Text>
          <View style={styles.actionCol} />
        </View>

        {gradeScale.map((item, index) => (
          <View
            key={item.grade}
            style={[styles.row, { borderBottomColor: colors.border }]}
          >
            <View style={[styles.gradeBadge, { backgroundColor: colors.accentLight }]}>
              <Text style={[styles.gradeText, { color: colors.accent }]}>{item.grade}</Text>
            </View>
            <TextInput
              style={[
                styles.pointsInput,
                {
                  backgroundColor: colors.surfaceAlt,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              value={String(item.points)}
              onChangeText={(val) => handleUpdatePoints(index, val)}
              keyboardType="decimal-pad"
              selectTextOnFocus
            />
            <TouchableOpacity
              onPress={() => handleDeleteGrade(index)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Trash2 size={16} color={colors.danger} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <Modal visible={showAddGrade} transparent animationType="fade" onRequestClose={() => setShowAddGrade(false)}>
        <TouchableWithoutFeedback onPress={() => setShowAddGrade(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <View style={[styles.modal, { backgroundColor: colors.surface }]}>
                  <View style={styles.modalHeader}>
                    <Text style={[styles.modalTitle, { color: colors.text }]}>Add Grade</Text>
                    <TouchableOpacity onPress={() => setShowAddGrade(false)}>
                      <X size={22} color={colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Grade Name</Text>
                  <TextInput
                    style={[styles.modalInput, { backgroundColor: colors.surfaceAlt, color: colors.text, borderColor: colors.border }]}
                    placeholder="e.g. A+"
                    placeholderTextColor={colors.textTertiary}
                    value={newGrade}
                    onChangeText={setNewGrade}
                    autoCapitalize="characters"
                  />
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Points</Text>
                  <TextInput
                    style={[styles.modalInput, { backgroundColor: colors.surfaceAlt, color: colors.text, borderColor: colors.border }]}
                    placeholder="e.g. 4.0"
                    placeholderTextColor={colors.textTertiary}
                    value={newPoints}
                    onChangeText={setNewPoints}
                    keyboardType="decimal-pad"
                  />
                  <TouchableOpacity
                    style={[styles.saveBtn, { backgroundColor: colors.accent }]}
                    onPress={handleAddGrade}
                  >
                    <Text style={styles.saveBtnText}>Add</Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal visible={showImport} transparent animationType="fade" onRequestClose={() => setShowImport(false)}>
        <TouchableWithoutFeedback onPress={() => setShowImport(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <View style={[styles.modal, { backgroundColor: colors.surface }]}>
                  <View style={styles.modalHeader}>
                    <Text style={[styles.modalTitle, { color: colors.text }]}>Import Grade Scale</Text>
                    <TouchableOpacity onPress={() => setShowImport(false)}>
                      <X size={22} color={colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                  <Text style={[styles.hint, { color: colors.textSecondary }]}>
                    Paste a JSON array:{'\n'}[{`{"grade":"A+","points":4.0}`}, ...]
                  </Text>
                  <TextInput
                    style={[
                      styles.modalInput,
                      styles.jsonInput,
                      { backgroundColor: colors.surfaceAlt, color: colors.text, borderColor: colors.border },
                    ]}
                    placeholder='[{"grade":"A+","points":4.0}]'
                    placeholderTextColor={colors.textTertiary}
                    value={importJson}
                    onChangeText={setImportJson}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                  />
                  <TouchableOpacity
                    style={[styles.saveBtn, { backgroundColor: colors.accent }]}
                    onPress={handleImport}
                  >
                    <Text style={styles.saveBtnText}>Import</Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  topActions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    marginBottom: 4,
  },
  headerCell: {
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  gradeCol: {
    flex: 1,
  },
  pointsCol: {
    width: 90,
    textAlign: 'center',
  },
  actionCol: {
    width: 32,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  gradeBadge: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginRight: 10,
  },
  gradeText: {
    fontSize: 15,
    fontWeight: '700' as const,
  },
  pointsInput: {
    width: 80,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    textAlign: 'center',
    borderWidth: 1,
    fontWeight: '600' as const,
    marginRight: 12,
  },
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    marginBottom: 6,
    marginTop: 8,
  },
  modalInput: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 16,
    borderWidth: 1,
  },
  jsonInput: {
    minHeight: 120,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 13,
  },
  hint: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  saveBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
