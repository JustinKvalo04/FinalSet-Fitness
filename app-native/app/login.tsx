import { View, Text, StyleSheet } from 'react-native';
import { useEffect } from 'react';

export default function Login() {
  console.log("BOOT: login screen loaded");

  useEffect(() => {
    console.log("BOOT: login mounted");
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Plain Login Route</Text>
      <Text style={styles.subtitle}>Binary Isolation: No Auth Group</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#aaa',
    fontSize: 16,
  },
});
