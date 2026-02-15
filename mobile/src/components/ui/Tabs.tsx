import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface TabsProps {
  value: string;
  onValueChange: (v: string) => void;
  children: React.ReactNode;
}

export function Tabs({ value, onValueChange, children }: TabsProps) {
  return <View style={styles.root}>{children}</View>;
}

interface TabsListProps {
  children: React.ReactNode;
  style?: object;
}

export function TabsList({ children, style }: TabsListProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.list, { backgroundColor: colors.muted }, style]}>
      {children}
    </View>
  );
}

interface TabsTriggerProps {
  value: string;
  children: string;
  activeValue: string;
  onPress: (v: string) => void;
  style?: object;
}

export function TabsTrigger({ value, children, activeValue, onPress, style }: TabsTriggerProps) {
  const { colors } = useTheme();
  const isActive = value === activeValue;
  return (
    <TouchableOpacity
      onPress={() => onPress(value)}
      style={[
        styles.trigger,
        {
          backgroundColor: isActive ? colors.card : 'transparent',
          borderColor: colors.border,
        },
        style,
      ]}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.triggerText,
          { color: isActive ? colors.foreground : colors.mutedForeground },
        ]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
}

interface TabsContentProps {
  value: string;
  activeValue: string;
  children: React.ReactNode;
  style?: object;
}

export function TabsContent({ value, activeValue, children, style }: TabsContentProps) {
  if (value !== activeValue) return null;
  return <View style={[styles.content, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  list: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 8,
    flexWrap: 'wrap',
  },
  trigger: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    margin: 2,
  },
  triggerText: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    marginTop: 8,
    flex: 1,
  },
});
