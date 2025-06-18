// app/(auth)/register.tsx
// Registration screen for new users using Supabase authentication

import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
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

  // Redirect already authenticated users to main page
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        router.replace('/(main)/wellmind');
      }
    });
  }, []);

  // Email validation function
  const validateEmail = (email: string) => {
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  // Password validation function
  const validatePassword = (password: string) => {
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return false;
    }
    setPasswordError('');
    return true;
  };

  // Handles user registration via Supabase
  const handleRegister = async () => {
    if (!fullName.trim()) {
      setNameError('Please enter your name');
      return;
    }
    setNameError('');

    if (!validateEmail(email) || !validatePassword(password)) return;

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setPasswordError(error.message);
      return;
    }

    const user = data?.user;
    if (user) {
      // Insert initial profile row
      const { error: insertError } = await supabase.from('users').insert({
        id: user.id,
        full_name: fullName,
        email,
      });

      if (insertError) {
        Alert.alert('Profile Error', insertError.message);
        // We don't return here so user can still proceed
      }
    }

    Alert.alert('Success', 'Check your email to confirm.');
    router.replace('/(main)/wellmind');
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
            <Text style={styles.title}>Create Your Account</Text>

            {/* Name input field */}
            <TextInput
              placeholder='Full Name'
              value={fullName}
              onChangeText={text => {
                setFullName(text);
                if (text.trim()) {
                  setNameError('');
                }
              }}
              style={styles.input}
              placeholderTextColor='#000'
            />
            {nameError && <Text style={styles.errorText}>{nameError}</Text>}

            {/* Email input field */}
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

            {/* Password input field */}
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

            {/* Submit button */}
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>

            {/* Link back to login */}
            <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
              <Text style={styles.link}>
                Already have an account?{' '}
                <Text style={styles.linkBold}>Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

// Style definitions
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
