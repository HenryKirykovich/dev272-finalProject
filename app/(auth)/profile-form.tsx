// app/(auth)/profile-form.tsx
import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function ProfileForm() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [alreadyExists, setAlreadyExists] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) return;

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

    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    let profileError = null;

    if (!alreadyExists) {
      const { error } = await supabase.from('users').insert({
        id: user.id,
        full_name: fullName,
        phone_number: phone,
        email: user.email,
      });
      profileError = error;
    } else {
      const { error } = await supabase
        .from('users')
        .update({ full_name: fullName, phone_number: phone })
        .eq('id', user.id);
      profileError = error;
    }

    if (profileError) {
      Alert.alert('Error', profileError.message);
    } else {
      Alert.alert('✅ Success', 'Profile updated successfully!');
      setFullName('');
      setPhone('');
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters.');
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('✅ Success', 'Password changed successfully!');
      setNewPassword('');
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert('Are you sure?', 'This will permanently delete your account.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) return;

          const { error: dbError } = await supabase.from('users').delete().eq('id', user.id);
          const { error: authError } = await supabase.auth.admin.deleteUser(user.id);

          if (dbError || authError) {
            Alert.alert('Error', dbError?.message || authError?.message || 'Unknown error');
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

      <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
        <Text style={styles.buttonText}>Save Profile</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="New Password (min 6 characters)"
        placeholderTextColor="#999"
        secureTextEntry
        onChangeText={setNewPassword}
        value={newPassword}
      />

      <TouchableOpacity style={styles.secondary} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.danger} onPress={handleDeleteAccount}>
        <Text style={styles.buttonText}>❌ Delete Account</Text>
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
    marginBottom: 20,
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
});
