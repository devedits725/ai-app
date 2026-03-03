import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/contexts/ThemeContext';

export default function NotFoundScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.muted },
      ]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.foreground }]}>404</Text>
        <Text
          style={[
            styles.message,
            { color: colors.mutedForeground },
          ]}
        >
          Oops! Page not found
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={[styles.link, { color: colors.primary }]}>
            Return to Home
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: { alignItems: 'center' },
  title: { fontSize: 40, fontWeight: '700', marginBottom: 16 },
  message: { fontSize: 20, marginBottom: 16 },
  link: { fontSize: 16, textDecorationLine: 'underline' },
});
