/* eslint-disable */
// app/(tabs)/home.tsx
// Home screen (WellMind) inside tabs navigator

import React, { useEffect, useState } from 'react';
import {
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import WellMindLogo from '../../assets/images/WellMind_logo_svg.svg';
import { supabase } from '../../lib/supabase';

export default function HomeScreen() {
    const [selectedMood, setSelectedMood] = useState('');
    const [mainGoal, setMainGoal] = useState<string | null>(null);

    const today = new Date().toISOString().split('T')[0];
    const todayISO = new Date(today).toISOString();

    useEffect(() => {
        loadTodayMood();
        loadMainGoal();
    }, []);

    const loadTodayMood = async () => {
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser();

        if (error || !user) return;

        const { data } = await supabase
            .from('mood_logs')
            .select('mood')
            .eq('logged_at', todayISO)
            .eq('user_id', user.id)
            .single();

        if (data?.mood) {
            setSelectedMood(data.mood);
        }
    };

    const loadMainGoal = async () => {
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser();

        if (error || !user) return;

        const { data } = await supabase
            .from('daily_goals')
            .select('title')
            .eq('show_on_home', true)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (data) {
            setMainGoal(data.title);
        }
    };

    const handleMoodSelect = async (mood: string) => {
        setSelectedMood(mood);

        const {
            data: { user },
            error,
        } = await supabase.auth.getUser();

        if (error || !user) return;

        const { data: existing } = await supabase
            .from('mood_logs')
            .select('id')
            .eq('logged_at', todayISO)
            .eq('user_id', user.id)
            .single();

        if (existing?.id) {
            await supabase.from('mood_logs').update({ mood }).eq('id', existing.id);
        } else {
            await supabase.from('mood_logs').insert({
                mood,
                user_id: user.id,
                logged_at: todayISO,
            });
        }
    };

    const moodDescription: Record<string, string> = {
        '😐': 'Feeling neutral',
        '🙂': 'Feeling happy',
        '😔': 'Feeling sad',
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ImageBackground
                source={require('../../assets/images/velvet.jpg')}
                style={styles.background}
                resizeMode='cover'
            >
                <View style={styles.container}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps='handled'
                        showsVerticalScrollIndicator={false}
                    >
                        {/* HEADER */}
                        <View style={styles.logoWrapper}>
                            <WellMindLogo width={140} height={140} />
                            <Text style={styles.title}>WellMind</Text>
                            <Text style={styles.subtitle}>Your mental wellness center</Text>
                        </View>

                        {mainGoal && (
                            <View style={styles.goalBox}>
                                <Text style={styles.goalText}>🎯 Today's Goal: {mainGoal}</Text>
                            </View>
                        )}

                        <Text style={styles.moodPrompt}>How are you feeling today?</Text>
                        <View style={styles.emojiRow}>
                            {['😐', '🙂', '😔'].map(emoji => (
                                <TouchableOpacity
                                    key={emoji}
                                    onPress={() => handleMoodSelect(emoji)}
                                >
                                    <Text
                                        style={[
                                            styles.emoji,
                                            selectedMood === emoji && styles.emojiSelected,
                                        ]}
                                    >
                                        {emoji}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {selectedMood && (
                            <Text style={styles.moodLabel}>
                                {moodDescription[selectedMood]}
                            </Text>
                        )}
                    </ScrollView>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    background: { flex: 1 },
    container: { flex: 1, justifyContent: 'space-between', padding: 20 },
    scrollContent: { flexGrow: 1, alignItems: 'center' },
    logoWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        width: '100%',
    },
    title: { fontSize: 36, fontWeight: 'bold', color: '#000' },
    subtitle: { fontSize: 16, color: '#000' },
    goalBox: {
        backgroundColor: '#ffffffcc',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 16,
        marginBottom: 20,
        width: '100%',
    },
    goalText: { fontSize: 18, color: '#333', fontWeight: 'bold' },
    moodPrompt: { fontSize: 20, color: '#000', marginBottom: 10 },
    emojiRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '60%',
    },
    emoji: { fontSize: 40 },
    emojiSelected: { transform: [{ scale: 1.2 }] },
    moodLabel: { fontSize: 16, color: '#333', marginTop: 10 },
});
