import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function BasicCalculator() {
  const { colors } = useTheme();
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState<string[]>([]);
  const [prevVal, setPrevVal] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [fresh, setFresh] = useState(true);

  const input = (val: string) => {
    if (fresh) {
      setDisplay(val);
      setFresh(false);
    } else {
      setDisplay((d) => (d === '0' ? val : d + val));
    }
  };

  const decimal = () => {
    if (!display.includes('.')) setDisplay(display + '.');
    setFresh(false);
  };

  const clear = () => {
    setDisplay('0');
    setPrevVal(null);
    setOp(null);
    setFresh(true);
  };

  const calc = (a: number, b: number, o: string) => {
    if (o === '+') return a + b;
    if (o === '-') return a - b;
    if (o === '×') return a * b;
    if (o === '÷') return b !== 0 ? a / b : 0;
    return b;
  };

  const operate = (nextOp: string) => {
    const cur = parseFloat(display);
    if (prevVal !== null && op) {
      const result = calc(prevVal, cur, op);
      setHistory((h) => [...h.slice(-4), `${prevVal} ${op} ${cur} = ${result}`]);
      setDisplay(String(result));
      setPrevVal(result);
    } else {
      setPrevVal(cur);
    }
    setOp(nextOp);
    setFresh(true);
  };

  const equals = () => {
    if (prevVal === null || !op) return;
    const cur = parseFloat(display);
    const result = calc(prevVal, cur, op);
    setHistory((h) => [...h.slice(-4), `${prevVal} ${op} ${cur} = ${result}`]);
    setDisplay(String(result));
    setPrevVal(null);
    setOp(null);
    setFresh(true);
  };

  const btnStyle = (bg: string) => ({
    backgroundColor: bg,
    flex: 1,
    minHeight: 56,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderRadius: 12,
    margin: 4,
  });

  return (
    <View style={styles.container}>
      {history.length > 0 && (
        <ScrollView style={styles.history} nestedScrollEnabled>
          {history.map((h, i) => (
            <Text key={i} style={[styles.historyText, { color: colors.mutedForeground }]}>
              {h}
            </Text>
          ))}
        </ScrollView>
      )}
      <View style={[styles.display, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.displayText, { color: colors.foreground }]} numberOfLines={1}>
          {display}
        </Text>
      </View>
      <View style={styles.grid}>
        <View style={styles.row}>
          <TouchableOpacity onPress={clear} style={[styles.cell, btnStyle(colors.destructiveLight ?? colors.destructive)]} activeOpacity={0.8}>
            <Text style={[styles.btnText, { color: colors.destructive }]}>C</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setDisplay((d) => d.slice(0, -1) || '0')} style={[styles.cell, btnStyle(colors.secondary)]} activeOpacity={0.8}>
            <Text style={[styles.btnText, { color: colors.foreground }]}>⌫</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => operate('÷')} style={[styles.cell, btnStyle(colors.primaryLight ?? colors.primary)]} activeOpacity={0.8}>
            <Text style={[styles.btnText, { color: colors.primary }]}>÷</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => operate('×')} style={[styles.cell, btnStyle(colors.primaryLight ?? colors.primary)]} activeOpacity={0.8}>
            <Text style={[styles.btnText, { color: colors.primary }]}>×</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          {['7', '8', '9'].map((n) => (
            <TouchableOpacity key={n} onPress={() => input(n)} style={[styles.cell, btnStyle(colors.secondary)]} activeOpacity={0.8}>
              <Text style={[styles.btnText, { color: colors.foreground }]}>{n}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={() => operate('-')} style={[styles.cell, btnStyle(colors.primaryLight ?? colors.primary)]} activeOpacity={0.8}>
            <Text style={[styles.btnText, { color: colors.primary }]}>−</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          {['4', '5', '6'].map((n) => (
            <TouchableOpacity key={n} onPress={() => input(n)} style={[styles.cell, btnStyle(colors.secondary)]} activeOpacity={0.8}>
              <Text style={[styles.btnText, { color: colors.foreground }]}>{n}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={() => operate('+')} style={[styles.cell, btnStyle(colors.primaryLight ?? colors.primary)]} activeOpacity={0.8}>
            <Text style={[styles.btnText, { color: colors.primary }]}>+</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          {['1', '2', '3'].map((n) => (
            <TouchableOpacity key={n} onPress={() => input(n)} style={[styles.cell, btnStyle(colors.secondary)]} activeOpacity={0.8}>
              <Text style={[styles.btnText, { color: colors.foreground }]}>{n}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={equals} style={[styles.cell, styles.cellTall, btnStyle(colors.primary)]} activeOpacity={0.8}>
            <Text style={[styles.btnText, { color: colors.primaryForeground }]}>=</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => input('0')} style={[styles.cell, styles.cellWide, btnStyle(colors.secondary)]} activeOpacity={0.8}>
            <Text style={[styles.btnText, { color: colors.foreground }]}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={decimal} style={[styles.cell, btnStyle(colors.secondary)]} activeOpacity={0.8}>
            <Text style={[styles.btnText, { color: colors.foreground }]}>.</Text>
          </TouchableOpacity>
          <View style={[styles.cell, { backgroundColor: 'transparent' }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  history: { maxHeight: 64 },
  historyText: { fontSize: 12 },
  display: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    alignItems: 'flex-end',
  },
  displayText: { fontSize: 28, fontWeight: '700', fontVariant: ['tabular-nums'] },
  grid: { gap: 0 },
  row: { flexDirection: 'row', margin: -2 },
  cell: { flex: 1, margin: 2 },
  cellWide: { flex: 2 },
  cellTall: { minHeight: 56 * 2 + 8 },
  btnText: { fontSize: 18, fontWeight: '500' },
});
