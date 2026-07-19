import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AgricultureScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Smart Farming</Text>
      <Text style={styles.description}>
        AI-powered crop recommendations and agricultural assistance coming soon...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
});
