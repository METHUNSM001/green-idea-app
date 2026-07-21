import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EquipmentScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Equipment Rental</Text>
      <Text style={styles.description}>Find equipment providers coming soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  description: { fontSize: 16, textAlign: 'center', color: '#666' },
});
