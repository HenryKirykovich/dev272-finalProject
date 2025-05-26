import { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      Alert.alert('Registration failed', error.message);
    } else {
      Alert.alert('Success', 'Please check your email to confirm your account.');
      router.replace('/(auth)/profile-form');

    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Register</Text>

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

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>REGISTER</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
        <Text style={styles.linkText}>
          Already have an account? <Text style={styles.linkHighlight}>Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c2c2c',
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
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#28a745',
    paddingVertical: 14,
    borderRadius: 12,
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
    color: '#00bfff',
    fontWeight: 'bold',
  },
});
