import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
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

export default function ProfileForm() {
  const [fullName, setFullName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [alreadyExists, setAlreadyExists] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      // If not authenticated, redirect to login page
      if (!user || userError) {
        router.replace('/(auth)/login');
        return;
      }

      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setFullName(data.full_name || '');
        setAlreadyExists(true);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Full Name cannot be empty.');
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    let profileError = null;

    if (!alreadyExists) {
      const { error } = await supabase.from('users').insert({
        id: user.id,
        full_name: fullName,
        email: user.email,
      });
      profileError = error;
    } else {
      const { error } = await supabase
        .from('users')
        .update({ full_name: fullName })
        .eq('id', user.id);
      profileError = error;
    }

    if (profileError) {
      Alert.alert('Error', profileError.message);
    } else {
      setProfileSuccess('✅ Profile updated successfully!');
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.trim() === '') {
      setPasswordError('Password cannot be empty');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    setPasswordError('');

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setPasswordError(error.message || 'Unable to change password');
      return;
    }

    // Success path
    setNewPassword('');
    setPasswordSuccess('✅ Password changed successfully!');
    setTimeout(() => setPasswordSuccess(''), 4000);
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

          const { error: dbError } = await supabase
            .from('users')
            .delete()
            .eq('id', user.id);
          const { error: authError } = await supabase.auth.admin.deleteUser(
            user.id
          );

          if (dbError || authError) {
            Alert.alert(
              'Error',
              dbError?.message || authError?.message || 'Unknown error'
            );
          } else {
            Alert.alert('Deleted', 'Your account has been deleted');
            router.replace('/(auth)/login');
          }
        },
      },
    ]);
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
        resizeMode='cover'
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          keyboardShouldPersistTaps='handled'
        >
          <View style={styles.container}>
            <View style={styles.logoWrapper}>
              <WellMindLogo width={120} height={120} />
              <Text style={[styles.title, { color: '#000' }]}>WellMind</Text>
              <Text style={[styles.subtitle, { color: '#000' }]}>
                mental health
              </Text>
              <Text style={[styles.subtitle, { color: '#000' }]}>journal</Text>
            </View>

            <TextInput
              style={styles.input}
              placeholder='Full Name'
              placeholderTextColor='#999'
              onChangeText={setFullName}
              value={fullName}
            />

            <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
              <Text style={styles.buttonText}>Save Profile</Text>
            </TouchableOpacity>

            {profileSuccess !== '' && (
              <Text style={styles.successText}>{profileSuccess}</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder='New Password (min 6 characters)'
              placeholderTextColor='#999'
              secureTextEntry
              onChangeText={text => {
                setNewPassword(text);
                if (text.length < 6) {
                  setPasswordError('Password must be at least 6 characters');
                } else {
                  setPasswordError('');
                }
              }}
              value={newPassword}
            />
            {passwordError !== '' && (
              <Text style={styles.errorText}>{passwordError}</Text>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={handleChangePassword}
            >
              <Text style={styles.buttonText}>Change Password</Text>
            </TouchableOpacity>

            {passwordSuccess !== '' && (
              <Text style={styles.successText}>{passwordSuccess}</Text>
            )}

            <TouchableOpacity
              style={styles.danger}
              onPress={handleDeleteAccount}
            >
              <Text style={styles.buttonText}>❌ Delete Account</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#6a66a3' }]}
              onPress={() => router.replace('/(main)/wellmind')}
            >
              <Text style={styles.buttonText}>Home Page</Text>
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
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    width: '100%',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 2,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    marginBottom: 2,
  },
  input: {
    height: 48,
    backgroundColor: '#fff',
    color: '#333',
    borderRadius: 16,
    paddingHorizontal: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e0d6e2',
  },
  button: {
    backgroundColor: '#6a66a3',
    paddingVertical: 14,
    borderRadius: 18,
    marginBottom: 20,
    marginTop: 10,
  },
  danger: {
    backgroundColor: '#aa3333',
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 20,
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
  successText: {
    color: 'green',
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
