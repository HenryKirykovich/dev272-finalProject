// app/(auth)/login.tsx
// Login screen for user authentication with Supabase

import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import WellMindLogo from '../../assets/images/WellMind_logo_svg.svg';
import { supabase } from '../../lib/supabase';

// Regular expression to validate email format
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function LoginForm() {
  // State variables for form input and validation
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const router = useRouter();

  // Validates email with regex
  const validateEmail = (email: string) => {
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  // Validates password length
  const validatePassword = (password: string) => {
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return false;
    }
    setPasswordError('');
    return true;
  };

  // Handles login button press
  const handleLogin = async () => {
    if (!validateEmail(email) || !validatePassword(password)) return;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setPasswordError(error.message);
    } else {
      router.replace('/(main)/wellmind');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <ImageBackground
        source={require('../../assets/images/velvet.jpg')}
        style={{ flex: 1 }}
        resizeMode='cover'
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          keyboardShouldPersistTaps='handled'
        >
          <View style={styles.container}>
            <WellMindLogo
              width={100}
              height={100}
              style={{ alignSelf: 'center', marginBottom: 20 }}
            />
            <Text style={styles.title}>Login to WellMind</Text>

            {/* Email input */}
            <TextInput
              placeholder='Email'
              value={email}
              onChangeText={text => {
                setEmail(text);
                validateEmail(text);
              }}
              autoCapitalize='none'
              keyboardType='email-address'
              style={styles.input}
              placeholderTextColor='#000'
            />
            {emailError && <Text style={styles.errorText}>{emailError}</Text>}

            {/* Password input */}
            <TextInput
              placeholder='Password'
              value={password}
              onChangeText={text => {
                setPassword(text);
                validatePassword(text);
              }}
              secureTextEntry
              style={styles.input}
              placeholderTextColor='#000'
            />
            {passwordError && (
              <Text style={styles.errorText}>{passwordError}</Text>
            )}

            {/* Login button */}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            {/* Navigation to registration */}
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.link}>
                Don&apos;t have an account?{' '}
                <Text style={styles.linkBold}>Register</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

// Stylesheet for login form
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    margin: 24,
    padding: 24,
    borderRadius: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#e8e6f2',
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
    color: '#000',
  },
  button: {
    backgroundColor: '#6a66a3',
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 10,
    marginBottom: 18,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  link: {
    textAlign: 'center',
    color: '#000',
  },
  linkBold: {
    fontWeight: 'bold',
    color: '#6a66a3',
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
    textAlign: 'center',
  },
});
