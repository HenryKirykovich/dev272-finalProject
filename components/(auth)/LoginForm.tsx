// app/(auth)/login.tsx
// Login screen for user authentication with Supabase

import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useBackgroundColor } from '../../app/_layout';
import WellMindLogo from '../../assets/images/WellMind.svg';
import { supabase } from '../../lib/supabase';
import { authStyles as styles } from './auth.styles';

// Regular expression to validate email format
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function LoginForm() {
  // State variables for form input and validation
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const router = useRouter();
  const { backgroundColor } = useBackgroundColor();

  // Redirect already authenticated users to main page
  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace('/(tabs)/home');
      }
    });
  }, []);

  // Validates email with regex
  const validateEmail = (email: string) => {
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  // Handles login button press
  const handleLogin = async () => {
    if (!validateEmail(email) || password.length < 6) {
      if (password.length < 6) {
        setPasswordError('Password must be at least 6 characters');
      }
      return;
    }
    setPasswordError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setPasswordError(error.message);
    } else {
      router.replace('/(tabs)/home');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.keyboardAvoidingView, { backgroundColor }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContainer, { backgroundColor }]}
        keyboardShouldPersistTaps='handled'
        style={{ backgroundColor }}
      >
        <View
          style={[
            styles.container,
            { backgroundColor: 'rgba(255, 255, 255, 0.8)' },
          ]}
        >
          <View style={styles.headerSection}>
            <WellMindLogo width={100} height={100} style={styles.logo} />
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Login to your WellMind account</Text>
          </View>

          {/* Email input */}
          <TextInput
            placeholder='Email'
            value={email}
            onChangeText={text => {
              setEmail(text.trim());
              validateEmail(text.trim());
            }}
            autoCapitalize='none'
            keyboardType='email-address'
            style={styles.input}
            placeholderTextColor='#999'
          />
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}

          {/* Password input */}
          <TextInput
            placeholder='Password'
            value={password}
            onChangeText={text => {
              setPassword(text);
              if (text.length > 0 && text.length < 6) {
                setPasswordError('Password must be at least 6 characters');
              } else {
                setPasswordError('');
              }
            }}
            secureTextEntry
            style={styles.input}
            placeholderTextColor='#999'
          />
          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}

          {/* Login button */}
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          {/* Navigation to registration */}
          <TouchableOpacity
            style={styles.linkContainer}
            onPress={() => router.push('/(auth)/register')}
          >
            <Text style={styles.linkText}>
              Don&apos;t have an account?{' '}
              <Text style={styles.linkTextBold}>Register</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
