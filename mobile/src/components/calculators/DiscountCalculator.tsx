import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Input } from '@/components/ui/Input';

export default function DiscountCalculator() {
  const { colors } = useTheme();
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');

  const original = parseFloat(price);
  const disc = parseFloat(discount);
  const saved = original && disc ? (original * disc) / 100 : null;
  const finalPrice = saved !== null ? original - saved : null;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.foreground }]}>
        Discount Calculator
      </Text>
      <View style={styles.inputs}>
        <Input
          value={price}
          onChangeText={setPrice}
          placeholder="Original price"
          keyboardType="numeric"
        />
        <Input
          value={discount}
          onChangeText={setDiscount}
          placeholder="Discount (%)"
          keyboardType="numeric"
        />
      </View>
      {finalPrice !== null && saved !== null && (
        <View style={[styles.result, { backgroundColor: colors.successLight ?? colors.success }]}>
          <Text style={[styles.resultLabel, { color: colors.mutedForeground }]}>
            You save
          </Text>
          <Text style={[styles.saved, { color: colors.success }]}>
            ${saved.toFixed(2)}
          </Text>
          <Text style={[styles.final, { color: colors.foreground }]}>
            Final price: <Text style={styles.finalBold}>${finalPrice.toFixed(2)}</Text>
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
  resultLabel: { fontSize: 14 },
  saved: { fontSize: 24, fontWeight: '700' },
  final: { fontSize: 14 },
  finalBold: { fontWeight: '600' },
});
