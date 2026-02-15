import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Input } from '@/components/ui/Input';

export default function ExamScoreCalculator() {
  const { colors } = useTheme();
  const [obtained, setObtained] = useState('');
  const [total, setTotal] = useState('');

  const pct =
    obtained && total && parseFloat(total) > 0
      ? (parseFloat(obtained) / parseFloat(total)) * 100
      : null;

  const grade =
    pct !== null
      ? pct >= 90
        ? 'A+'
        : pct >= 80
          ? 'A'
          : pct >= 70
            ? 'B'
            : pct >= 60
              ? 'C'
              : pct >= 50
                ? 'D'
                : 'F'
      : null;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.foreground }]}>
        Exam Score Calculator
      </Text>
      <View style={styles.inputs}>
        <Input
          value={obtained}
          onChangeText={setObtained}
          placeholder="Marks obtained"
          keyboardType="numeric"
        />
        <Input
          value={total}
          onChangeText={setTotal}
          placeholder="Total marks"
          keyboardType="numeric"
        />
      </View>
      {pct !== null && grade && (
        <View style={[styles.result, { backgroundColor: colors.primaryLight ?? colors.primary }]}>
          <Text style={[styles.resultValue, { color: colors.primary }]}>
            {pct.toFixed(1)}%
          </Text>
          <Text style={[styles.grade, { color: colors.foreground }]}>
            Grade: {grade}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16 },
  title: { fontSize: 16, fontWeight: '600' },
  inputs: { gap: 12 },
  result: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 4,
  },
  resultValue: { fontSize: 28, fontWeight: '700' },
  grade: { fontSize: 18, fontWeight: '600' },
});
