import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
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
import { profileFormStyles as styles } from './profile-form.styles';

const BG_COLORS = ['#FCE4EC', '#F3E5F5', '#E1F5FE', '#E8F5E9', '#FFFDE7'];

export default function ProfileForm() {
  const [fullName, setFullName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [alreadyExists, setAlreadyExists] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const router = useRouter();
  const { backgroundColor, setBackgroundColor } = useBackgroundColor();

  console.log('Profile form backgroundColor:', backgroundColor);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

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
    setProfileSuccess('');
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
      setTimeout(() => setProfileSuccess(''), 4000);
    }
  };

  const handleChangePassword = async () => {
    setPasswordSuccess('');
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
    } else {
      setNewPassword('');
      setPasswordSuccess('✅ Password changed successfully!');
      setTimeout(() => setPasswordSuccess(''), 4000);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Error', 'Unable to log out');
    } else {
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
        <View style={[styles.container]}>
          <View style={styles.headerSection}>
            <WellMindLogo width={120} height={120} style={styles.logo} />
            <Text style={styles.title}>Account Settings</Text>
            <Text style={styles.subtitle}>
              Manage your profile and security
            </Text>
          </View>

          <View style={styles.formSection}>
            <TextInput
              style={styles.input}
              placeholder='Full Name'
              placeholderTextColor='#999'
              onChangeText={setFullName}
              value={fullName}
              autoCapitalize='words'
              autoComplete='name'
            />
            <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
              <Text style={styles.buttonText}>Save Profile</Text>
            </TouchableOpacity>
            {profileSuccess ? (
              <Text style={styles.successText}>{profileSuccess}</Text>
            ) : null}
          </View>

          <View style={styles.divider} />

          <View style={styles.formSection}>
            <TextInput
              style={styles.input}
              placeholder='New Password (min 6 characters)'
              placeholderTextColor='#999'
              secureTextEntry
              onChangeText={setNewPassword}
              value={newPassword}
            />
            {passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}
            <TouchableOpacity
              style={styles.button}
              onPress={handleChangePassword}
            >
              <Text style={styles.buttonText}>Change Password</Text>
            </TouchableOpacity>
            {passwordSuccess ? (
              <Text style={styles.successText}>{passwordSuccess}</Text>
            ) : null}
          </View>

          <View style={styles.divider} />

          <View style={styles.formSection}>
            <Text style={styles.subtitle}>Change Background Color</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginVertical: 10,
              }}
            >
              {BG_COLORS.map(color => (
                <TouchableOpacity
                  key={color}
                  style={{
                    backgroundColor: color,
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    borderWidth: color === backgroundColor ? 3 : 1,
                    borderColor: color === backgroundColor ? '#007BFF' : '#ddd',
                  }}
                  onPress={() => {
                    console.log(`Setting background color to: ${color}`);
                    setBackgroundColor(color);
                  }}
                />
              ))}
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.actionSection}>
            <TouchableOpacity
              style={[styles.button, styles.logoutButton]}
              onPress={handleLogout}
            >
              <Text style={styles.buttonText}>🚪 Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
