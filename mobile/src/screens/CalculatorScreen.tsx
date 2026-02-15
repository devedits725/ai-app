import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import PageHeader from '@/components/layout/PageHeader';
import BannerAdPlaceholder from '@/components/layout/BannerAdPlaceholder';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import BasicCalculator from '@/components/calculators/BasicCalculator';
import PercentageCalculator from '@/components/calculators/PercentageCalculator';
import DiscountCalculator from '@/components/calculators/DiscountCalculator';
import AgeCalculator from '@/components/calculators/AgeCalculator';
import ExamScoreCalculator from '@/components/calculators/ExamScoreCalculator';
import { useTheme } from '@/contexts/ThemeContext';

const tabs = [
  { value: 'basic', label: 'Basic' },
  { value: 'percent', label: '%' },
  { value: 'discount', label: 'Discount' },
  { value: 'age', label: 'Age' },
  { value: 'exam', label: 'Exam' },
];

export default function CalculatorScreen() {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState('basic');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <PageHeader title="Calculator Tools" />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <View style={styles.tabsListWrap}>
          <TabsList style={styles.tabsList}>
            {tabs.map((t) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                activeValue={activeTab}
                onPress={setActiveTab}
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </View>
        <View style={styles.content}>
          <TabsContent value="basic" activeValue={activeTab}>
            <BasicCalculator />
          </TabsContent>
          <TabsContent value="percent" activeValue={activeTab}>
            <PercentageCalculator />
          </TabsContent>
          <TabsContent value="discount" activeValue={activeTab}>
            <DiscountCalculator />
          </TabsContent>
          <TabsContent value="age" activeValue={activeTab}>
            <AgeCalculator />
          </TabsContent>
          <TabsContent value="exam" activeValue={activeTab}>
            <ExamScoreCalculator />
          </TabsContent>
        </View>
      </Tabs>
      <BannerAdPlaceholder />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabsListWrap: { paddingHorizontal: 16, paddingTop: 8 },
  tabsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  content: { flex: 1, padding: 16 },
});
