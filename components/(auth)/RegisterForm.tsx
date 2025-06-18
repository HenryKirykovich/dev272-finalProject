// app/(auth)/register.tsx
// Registration screen for new users using Supabase authentication

import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useBackgroundColor } from '../../app/_layout';
import WellMindLogo from '../../assets/images/WellMind_logo_svg.svg';
import { supabase } from '../../lib/supabase';
import { authStyles as styles } from './auth.styles';

// Regular expression for email validation
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function RegisterForm() {
  // State variables for input and error messages
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [fullName, setFullName] = useState('');
  const [nameError, setNameError] = useState('');
  const router = useRouter();
  const { backgroundColor } = useBackgroundColor();

  console.log('Register form backgroundColor:', backgroundColor);

  // Validates email format
  const validateEmail = (email: string) => {
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  // Handles user registration via Supabase
  const handleRegister = async () => {
    const isNameValid = fullName.trim().length > 0;
    const isEmailValid = validateEmail(email);
    const isPasswordValid = password.length >= 6;

    if (!isNameValid) {
      setNameError('Please enter your full name');
    } else {
      setNameError('');
    }

    if (!isPasswordValid) {
      setPasswordError('Password must be at least 6 characters');
    } else {
      setPasswordError('');
    }

    if (!isNameValid || !isEmailValid || !isPasswordValid) return;

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (error) {
      setPasswordError(error.message);
      return;
    }

    if (data.user) {
      await supabase.from('users').insert({
        id: data.user.id,
        full_name: fullName.trim(),
        email: data.user.email,
      });
      Alert.alert(
        'Registration Successful',
        'Please check your email to confirm your account.'
      );
      router.replace('/(auth)/login');
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join WellMind today</Text>
          </View>

          {/* Name input field */}
          <TextInput
            placeholder='Full Name'
            value={fullName}
            onChangeText={text => setFullName(text)}
            style={styles.input}
            placeholderTextColor='#999'
            autoCapitalize='words'
          />
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

          {/* Email input field */}
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

          {/* Password input field */}
          <TextInput
            placeholder='Password (min. 6 characters)'
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            placeholderTextColor='#999'
          />
          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}

          {/* Submit button */}
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>

          {/* Link back to login */}
          <TouchableOpacity
            style={styles.linkContainer}
            onPress={() => router.replace('/(auth)/login')}
          >
            <Text style={styles.linkText}>
              Already have an account?{' '}
              <Text style={styles.linkTextBold}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
