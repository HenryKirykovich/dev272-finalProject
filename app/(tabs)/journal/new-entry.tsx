import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../../lib/supabase';

export default function NewEntryScreen() {
  const [text, setText] = useState('');
  const router = useRouter();

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      Alert.alert('Error', 'User not authenticated.');
      return;
    }

    const { error } = await supabase
      .from('journal_entries')
      .insert({ content: text, user_id: user.id });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      router.push('/(tabs)/journal');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <ImageBackground
        source={require('../../../assets/images/velvet.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.textBgWrapper}>
              <View style={styles.textBgContent}>
                <Text style={styles.title}>New Entry</Text>
                <Text style={styles.subtitle}>Write your thoughts below</Text>
              </View>
            </View>

            <View style={styles.inputBox}>
              <TextInput
                value={text}
                onChangeText={setText}
                placeholder="Type here..."
                placeholderTextColor="#fff"
                style={styles.input}
                multiline
              />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
  },
  textBgWrapper: {
    position: 'relative',
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    minHeight: 140,
    justifyContent: 'center',
    width: '100%',
  },
  textBgContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    zIndex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 2,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    marginBottom: 2,
  },
  inputBox: {
    backgroundColor: '#6a66a3',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    minHeight: 160,
    marginBottom: 30,
  },
  input: {
    color: '#fff',
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 120,
  },
  saveButton: {
    backgroundColor: '#6a66a3',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 16,
    alignSelf: 'center',
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});