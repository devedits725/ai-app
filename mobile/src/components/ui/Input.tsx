import React from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface InputProps {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'number-pad';
  style?: object;
  multiline?: boolean;
  numberOfLines?: number;
}

export function Input({
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  style,
  multiline,
  numberOfLines,
}: InputProps) {
  const { colors } = useTheme();
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.mutedForeground}
      keyboardType={keyboardType}
      multiline={multiline}
      numberOfLines={numberOfLines}
      style={[
        styles.input,
        {
          backgroundColor: colors.background,
          borderColor: colors.input,
          color: colors.foreground,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
});
