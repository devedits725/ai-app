import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Input } from '@/components/ui/Input';

export default function PercentageCalculator() {
  const { colors } = useTheme();
  const [number, setNumber] = useState('');
  const [percent, setPercent] = useState('');

  const result =
    number && percent ? (parseFloat(number) * parseFloat(percent)) / 100 : null;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.foreground }]}>
        Percentage Calculator
      </Text>
      <View style={styles.inputs}>
        <Input
          value={number}
          onChangeText={setNumber}
          placeholder="Enter number"
          keyboardType="numeric"
        />
        <Input
          value={percent}
          onChangeText={setPercent}
          placeholder="Enter percentage (%)"
          keyboardType="numeric"
        />
      </View>
      {result !== null && (
        <View style={[styles.result, { backgroundColor: colors.primaryLight ?? colors.primary }]}>
          <Text style={[styles.resultLabel, { color: colors.mutedForeground }]}>
            {percent}% of {number} is
          </Text>
          <Text style={[styles.resultValue, { color: colors.primary }]}>
            {result.toFixed(2)}
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
  },
  resultLabel: { fontSize: 14 },
  resultValue: { fontSize: 24, fontWeight: '700' },
});
