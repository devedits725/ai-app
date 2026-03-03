import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import {
  differenceInYears,
  differenceInMonths,
  differenceInDays,
  isValid,
} from 'date-fns';
import { useTheme } from '@/contexts/ThemeContext';
import { Input } from '@/components/ui/Input';

export default function AgeCalculator() {
  const { colors } = useTheme();
  const [dob, setDob] = useState('');
  const today = new Date();
  const birthDate = dob ? new Date(dob) : null;
  const valid =
    birthDate && isValid(birthDate) && birthDate.getTime() < today.getTime();

  const years = valid ? differenceInYears(today, birthDate!) : 0;
  const months = valid ? differenceInMonths(today, birthDate!) % 12 : 0;
  const days = valid
    ? differenceInDays(
        today,
        new Date(
          today.getFullYear(),
          today.getMonth() - differenceInMonths(today, birthDate!),
          birthDate!.getDate()
        )
      )
    : 0;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.foreground }]}>
        Age Calculator
      </Text>
      <Input
        value={dob}
        onChangeText={setDob}
        placeholder={Platform.OS === 'ios' ? 'YYYY-MM-DD' : 'Date of birth'}
        keyboardType="default"
      />
      {valid && (
        <View style={[styles.result, { backgroundColor: colors.primaryLight ?? colors.primary }]}>
          <Text style={[styles.resultValue, { color: colors.primary }]}>
            {years} years
          </Text>
          <Text style={[styles.resultLabel, { color: colors.mutedForeground }]}>
            {months} months, {Math.max(0, days)} days
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16 },
  title: { fontSize: 16, fontWeight: '600' },
  result: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 4,
  },
  resultValue: { fontSize: 24, fontWeight: '700' },
  resultLabel: { fontSize: 14 },
});
