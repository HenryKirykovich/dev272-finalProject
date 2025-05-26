import { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      Alert.alert('Login failed', error.message);
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔐 Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
        <Text style={styles.linkText}>
          Don’t have an account? <Text style={styles.linkHighlight}>Register</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c2c2c', // ✅ серый фон
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    color: 'white',
    marginBottom: 30,
    alignSelf: 'center',
  },
  input: {
    height: 50,
    backgroundColor: '#3d3d3d',
    color: 'white',
    borderRadius: 12, // ✅ скруглённые поля
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007aff',
    paddingVertical: 14,
    borderRadius: 12, // ✅ скруглённая кнопка
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  linkText: {
    color: '#ccc',
    textAlign: 'center',
    fontSize: 14,
  },
  linkHighlight: {
    color: '#4da6ff',
    fontWeight: 'bold',
  },
});
