import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function ProfileForm() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [alreadyExists, setAlreadyExists] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkExisting = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setFullName(data.full_name || '');
        setPhone(data.phone_number || '');
        setAlreadyExists(true);
      }
    };

    checkExisting();
  }, []);

  const handleSave = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    if (alreadyExists) {
      Alert.alert('Error', 'Profile already exists.');
      return;
    }

    const { error } = await supabase.from('users').insert({
      id: user.id,
      full_name: fullName,
      phone_number: phone,
      email: user.email,
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('✅ Success', 'Profile created successfully!');
      router.replace('/(tabs)/');
    }
  };

  const handleChangePassword = async () => {
    Alert.prompt(
      'Change Password',
      'Enter new password:',
      async (newPassword) => {
        if (!newPassword || newPassword.length < 6) {
          Alert.alert('Error', 'Password must be at least 6 characters.');
          return;
        }

        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) {
          Alert.alert('Error', error.message);
        } else {
          Alert.alert('✅ Password changed successfully');
        }
      }
    );
  };

  const handleDeleteAccount = async () => {
    Alert.alert('Are you sure?', 'This will permanently delete your account.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.rpc('delete_user'); // you must create this function
          if (error) {
            Alert.alert('Error', error.message);
          } else {
            Alert.alert('Deleted', 'Your account has been deleted');
            router.replace('/(auth)/login');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Your Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#999"
        onChangeText={setFullName}
        value={fullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#999"
        keyboardType="phone-pad"
        onChangeText={setPhone}
        value={phone}
      />

      {!alreadyExists && (
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Profile</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.secondary} onPress={handleChangePassword}>
        <Text style={styles.linkText}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.danger} onPress={handleDeleteAccount}>
        <Text style={styles.linkText}>❌ Delete Account</Text>
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
    fontSize: 24,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 48,
    backgroundColor: '#3d3d3d',
    color: 'white',
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 20,
  },
  secondary: {
    backgroundColor: '#444',
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  danger: {
    backgroundColor: '#aa3333',
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  linkText: {
    color: 'white',
    textAlign: 'center',
  },
});
