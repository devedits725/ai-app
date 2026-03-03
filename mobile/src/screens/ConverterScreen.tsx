import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import PageHeader from '@/components/layout/PageHeader';
import BannerAdPlaceholder from '@/components/layout/BannerAdPlaceholder';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Input } from '@/components/ui/Input';
import { useTheme } from '@/contexts/ThemeContext';

type Unit = { name: string; factor: number };
type Converter = { key: string; label: string; units: Unit[]; type?: 'temp' };

const converters: Converter[] = [
  {
    key: 'length',
    label: 'Length',
    units: [
      { name: 'm', factor: 1 },
      { name: 'km', factor: 0.001 },
      { name: 'cm', factor: 100 },
      { name: 'mm', factor: 1000 },
      { name: 'in', factor: 39.3701 },
      { name: 'ft', factor: 3.28084 },
      { name: 'mi', factor: 0.000621371 },
    ],
  },
  {
    key: 'weight',
    label: 'Weight',
    units: [
      { name: 'kg', factor: 1 },
      { name: 'g', factor: 1000 },
      { name: 'mg', factor: 1e6 },
      { name: 'lb', factor: 2.20462 },
      { name: 'oz', factor: 35.274 },
    ],
  },
  {
    key: 'temp',
    label: 'Temp',
    units: [
      { name: '°C', factor: 1 },
      { name: '°F', factor: 1 },
      { name: 'K', factor: 1 },
    ],
    type: 'temp',
  },
  {
    key: 'speed',
    label: 'Speed',
    units: [
      { name: 'm/s', factor: 1 },
      { name: 'km/h', factor: 3.6 },
      { name: 'mph', factor: 2.23694 },
      { name: 'knot', factor: 1.94384 },
    ],
  },
  {
    key: 'area',
    label: 'Area',
    units: [
      { name: 'm²', factor: 1 },
      { name: 'km²', factor: 1e-6 },
      { name: 'ft²', factor: 10.7639 },
      { name: 'acre', factor: 0.000247105 },
      { name: 'ha', factor: 0.0001 },
    ],
  },
  {
    key: 'volume',
    label: 'Volume',
    units: [
      { name: 'L', factor: 1 },
      { name: 'mL', factor: 1000 },
      { name: 'gal', factor: 0.264172 },
      { name: 'm³', factor: 0.001 },
      { name: 'cup', factor: 4.22675 },
    ],
  },
  {
    key: 'data',
    label: 'Data',
    units: [
      { name: 'B', factor: 1 },
      { name: 'KB', factor: 1 / 1024 },
      { name: 'MB', factor: 1 / 1024 ** 2 },
      { name: 'GB', factor: 1 / 1024 ** 3 },
      { name: 'TB', factor: 1 / 1024 ** 4 },
    ],
  },
];

function convertTemp(val: number, from: string, to: string): number {
  let celsius =
    from === '°C' ? val : from === '°F' ? ((val - 32) * 5) / 9 : val - 273.15;
  if (to === '°C') return celsius;
  if (to === '°F') return (celsius * 9) / 5 + 32;
  return celsius + 273.15;
}

function ConverterPanel({
  converter,
  colors,
}: {
  converter: Converter;
  colors: any;
}) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState(converter.units[0].name);
  const numVal = parseFloat(value);

  return (
    <View style={styles.panel}>
      <Input
        value={value}
        onChangeText={setValue}
        placeholder="Enter value"
        keyboardType="numeric"
        style={styles.input}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.unitRow}
      >
        {converter.units.map((u) => (
          <TouchableOpacity
            key={u.name}
            onPress={() => setFromUnit(u.name)}
            style={[
              styles.unitBtn,
              fromUnit === u.name
                ? { backgroundColor: colors.primary }
                : { backgroundColor: colors.secondary },
            ]}
          >
            <Text
              style={[
                styles.unitBtnText,
                { color: fromUnit === u.name ? colors.primaryForeground : colors.foreground },
              ]}
            >
              {u.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {!isNaN(numVal) && value && (
        <View style={styles.results}>
          {converter.units
            .filter((u) => u.name !== fromUnit)
            .map((u) => {
              let result: number;
              if (converter.type === 'temp') {
                result = convertTemp(numVal, fromUnit, u.name);
              } else {
                const fromFactor = converter.units.find(
                  (x) => x.name === fromUnit
                )!.factor;
                result = (numVal / fromFactor) * u.factor;
              }
              return (
                <View
                  key={u.name}
                  style={[
                    styles.resultRow,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[styles.resultLabel, { color: colors.foreground }]}
                  >
                    {u.name}
                  </Text>
                  <Text
                    style={[styles.resultValue, { color: colors.primary }]}
                  >
                    {result.toLocaleString(undefined, {
                      maximumFractionDigits: 6,
                    })}
                  </Text>
                </View>
              );
            })}
        </View>
      )}
    </View>
  );
}

export default function ConverterScreen() {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState('length');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <PageHeader title="Unit Converter" />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll}
          contentContainerStyle={styles.tabsListWrap}
        >
          <TabsList style={styles.tabsList}>
            {converters.map((c) => (
              <TabsTrigger
                key={c.key}
                value={c.key}
                activeValue={activeTab}
                onPress={setActiveTab}
              >
                {c.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollView>
        {converters.map((conv) => (
          <TabsContent
            key={conv.key}
            value={conv.key}
            activeValue={activeTab}
            style={styles.content}
          >
            <ConverterPanel converter={conv} colors={colors} />
          </TabsContent>
        ))}
      </Tabs>
      <BannerAdPlaceholder />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabsScroll: { maxHeight: 52 },
  tabsListWrap: { paddingHorizontal: 16, paddingTop: 8 },
  tabsList: { flexDirection: 'row', flexWrap: 'nowrap' },
  content: { flex: 1, padding: 16 },
  panel: { gap: 16 },
  input: { fontSize: 18 },
  unitRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  unitBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  unitBtnText: { fontSize: 14, fontWeight: '500' },
  results: { gap: 8 },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  resultLabel: { fontSize: 14, fontWeight: '500' },
  resultValue: { fontSize: 16, fontWeight: '600', fontVariant: ['tabular-nums'] },
});
