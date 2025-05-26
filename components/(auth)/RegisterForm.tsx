import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';

// Регулярное выражение для проверки email
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(''); // Для хранения ошибки email
  const [passwordError, setPasswordError] = useState(''); // Для хранения ошибки пароля
  const [isPasswordValid, setIsPasswordValid] = useState(true); // Флаг для пароля
  const router = useRouter();

  // Функция для проверки email
  const validateEmail = (email: string) => {
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address (e.g., user@example.com)');
      return false;
    }
    setEmailError('');
    return true;
  };

  // Функция для проверки пароля
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
    // Проверка email и пароля перед отправкой
    if (!validateEmail(email) || !validatePassword(password)) return;

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setPasswordError(error.message); // Если ошибка при регистрации, показываем
    } else {
      Alert.alert('Success', 'Check your email to confirm.');
      router.replace('/(tabs)/placeholder');
    }
  };

  return (
    <View style={styles.container}>
      {/* Email Input */}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          validateEmail(text); // Проверяем email каждый раз при изменении
        }}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      {/* Email Error */}
      {emailError && <Text style={styles.errorText}>{emailError}</Text>}

      {/* Password Input */}
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          validatePassword(text); // Проверяем пароль каждый раз при изменении
        }}
        secureTextEntry
        style={styles.input}
      />
      {/* Password Error */}
      {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

      <Button title="Register" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});
