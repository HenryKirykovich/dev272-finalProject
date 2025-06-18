/* eslint-disable */
// app/(tabs)/home.tsx
// Home screen (WellMind) inside tabs navigator

import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import WellMindLogo from '../../assets/images/WellMind_logo_svg.svg';
import { supabase } from '../../lib/supabase';
import { useBackgroundColor } from '../_layout';
import { homeScreenStyles as styles } from './home.styles';

export default function HomeScreen() {
    const [selectedMood, setSelectedMood] = useState('');
    const [mainGoal, setMainGoal] = useState<string | null>(null);
    const [userName, setUserName] = useState('');
    const { backgroundColor } = useBackgroundColor();

    const today = new Date().toISOString().split('T')[0];
    const todayISO = new Date(today).toISOString();

    const loadData = useCallback(() => {
        loadTodayMood();
        loadMainGoal();
        loadUserName();
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    const loadUserName = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (user) {
            const { data } = await supabase
                .from('users')
                .select('full_name')
                .eq('id', user.id)
                .single();

            if (data) {
                setUserName(data.full_name || '');
            }
        }
    };

    const loadTodayMood = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data } = await supabase
            .from('mood_logs')
            .select('mood')
            .eq('user_id', user.id)
            .eq('logged_at', todayISO)
            .single();

        setSelectedMood(data?.mood || '');
    };

    const loadMainGoal = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data } = await supabase
            .from('daily_goals')
            .select('title')
            .eq('user_id', user.id)
            .eq('show_on_home', true)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        setMainGoal(data?.title || null);
    };

    const handleMoodSelect = async (mood: string) => {
        setSelectedMood(mood);

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data: existing } = await supabase
            .from('mood_logs')
            .select('id')
            .eq('user_id', user.id)
            .eq('logged_at', todayISO)
            .single();

        if (existing?.id) {
            await supabase
                .from('mood_logs')
                .update({ mood })
                .eq('id', existing.id);
        } else {
            await supabase.from('mood_logs').insert({
                mood,
                user_id: user.id,
                logged_at: todayISO,
            });
        }
    };

    const moodDescription: Record<string, string> = {
        '🙂': 'Feeling happy',
        '😐': 'Feeling neutral',
        '😔': 'Feeling sad',
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                contentContainerStyle={[styles.container, { backgroundColor }]}
                keyboardShouldPersistTaps='handled'
                showsVerticalScrollIndicator={false}
                style={{ backgroundColor }}
            >
                {/* HEADER */}
                <View style={styles.headerSection}>
                    <View style={styles.logoWrapper}>
                        <WellMindLogo width={140} height={140} />
                        <Text style={styles.title}>WellMind</Text>
                        <Text style={styles.subtitle}>
                            {userName
                                ? `Welcome back, ${userName}!`
                                : 'Your mental wellness center'}
                        </Text>
                    </View>
                </View>

                <View style={styles.contentSection}>
                    {mainGoal && (
                        <View style={styles.goalBox}>
                            <Text style={styles.goalText}>🎯 Today's Goal: {mainGoal}</Text>
                        </View>
                    )}

                    <View style={styles.moodSection}>
                        <Text style={styles.moodPrompt}>How are you feeling today?</Text>
                        <View style={styles.emojiRow}>
                            {['😔', '😐', '🙂'].map(emoji => (
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
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
