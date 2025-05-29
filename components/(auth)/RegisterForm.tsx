import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

// Регулярное выражение для проверки email
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const router = useRouter();

  const validateEmail = (email: string) => {
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address (e.g., user@example.com)');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      setIsPasswordValid(false);
      setPasswordError('Password must be at least 6 characters long');
      return false;
    }
    setIsPasswordValid(true);
    setPasswordError('');
    return true;
  };

  const handleRegister = async () => {
    if (!validateEmail(email) || !validatePassword(password)) return;

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setPasswordError(error.message);
    } else {
      Alert.alert('Success', 'Check your email to confirm.');
      router.replace('/(tabs)');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <ImageBackground
        source={require('../../assets/images/velvet.jpg')}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <Text style={styles.title}>WellMind</Text>
            <Text style={styles.subtitle}>mental health</Text>
            <Text style={styles.subtitle}>journal</Text>

            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                validateEmail(text);
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
              placeholderTextColor="#000"
            />
            {emailError && <Text style={styles.errorText}>{emailError}</Text>}

            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                validatePassword(text);
              }}
              secureTextEntry
              style={styles.input}
              placeholderTextColor="#000"
            />
            {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 18,
    margin: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#c9a6c4',
    textAlign: 'center',
    marginBottom: 2,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#a18fa4',
    textAlign: 'center',
    marginBottom: 2,
  },
  input: {
    height: 48,
    backgroundColor: '#c9a6c4',
    color: '#fff',
    borderRadius: 16,
    paddingHorizontal: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e0d6e2',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#6a66a3',
    paddingVertical: 14,
    borderRadius: 18,
    marginBottom: 20,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
    textAlign: 'center',
  },
});
