import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>👋 Welcome!</Text>
      <Text style={styles.subtitle}>
        This is the start of your Mood Tracker App.
      </Text>
      <Text style={styles.text}>
        From here you can log moods, set goals, and write journal entries.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00bfff',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginTop: 8,
  },
});
