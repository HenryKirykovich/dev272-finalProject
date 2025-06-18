// app/(tabs)/goals/index.tsx
// Goals Screen: Daily goal tracking for authenticated users

import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '../../../lib/supabase';
import { goalsScreenStyles as styles } from '../../../styles/tabs/goals.styles';
import { useBackgroundColor } from '../../_layout';

interface Goal {
  id: string;
  title: string;
  created_at: string;
  is_done: boolean;
  show_on_home?: boolean;
}

export default function GoalsScreen() {
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAll, setShowAll] = useState(false);
  const { backgroundColor } = useBackgroundColor();

  const today = new Date().toISOString().split('T')[0];

  // 🔄 Fetch user-specific goals from Supabase
  const fetchGoals = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('No authenticated user:', userError);
      return;
    }

    const { data, error } = await supabase
      .from('daily_goals')
      .select('*')
      .eq('user_id', user.id) // ✅ filter by current authenticated user
      .order('created_at', { ascending: false });

    if (!error && data) {
      // Sort so the main goal (shown on home) appears at the top
      const sorted = [...data].sort((a, b) => {
        if (a.show_on_home === b.show_on_home) return 0;
        return a.show_on_home ? -1 : 1;
      });
      setGoals(sorted);
    } else {
      console.error('Error fetching goals:', error);
    }
  };

  // ✅ Toggle goal as done or undone
  const toggleGoalStatus = async (goal: Goal) => {
    const { error } = await supabase
      .from('daily_goals')
      .update({ is_done: !goal.is_done })
      .eq('id', goal.id);

    if (!error) {
      fetchGoals();
    }
  };

  // 🌟 Set a goal as the main one to show on Home screen
  const setAsMainGoal = async (goalId: string) => {
    await supabase
      .from('daily_goals')
      .update({ show_on_home: false })
      .neq('id', goalId);

    await supabase
      .from('daily_goals')
      .update({ show_on_home: true })
      .eq('id', goalId);

    fetchGoals();
  };

  // 🗑️ Delete a goal
  const deleteGoal = async (goalId: string) => {
    await supabase.from('daily_goals').delete().eq('id', goalId);
    fetchGoals();
  };

  // 📆 Filter today's goals unless "Show All" is enabled
  const filteredGoals = showAll
    ? goals
    : goals.filter(g => g.created_at.startsWith(today));

  // 🔧 Goal list item renderer
  const renderItem = ({ item }: { item: Goal }) => (
    <View style={[styles.goalBox, item.is_done && styles.goalDone]}>
      {/* Wrapper to align text width with button row width */}
      <View>
        <View style={styles.goalTextContainer}>
          <Text style={styles.goalText}>{item.title}</Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.statusButton, item.is_done && styles.statusDone]}
            onPress={() => toggleGoalStatus(item)}
          >
            <Text style={styles.statusButtonText}>
              {item.is_done ? 'Undo' : 'Done'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.mainButton}
            onPress={() => setAsMainGoal(item.id)}
          >
            <Text style={styles.statusButtonText}>
              {item.show_on_home ? '✔ Main' : 'Show on Home'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteGoal(item.id)}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // ⏳ Refresh goals when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchGoals();
    }, [])
  );

  // 🧱 UI rendering
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.container, { backgroundColor }]}>
          {/* Enhanced Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleEmoji}>🎯</Text>
              <Text style={styles.title}>Daily Goals</Text>
            </View>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setShowAll(!showAll)}
            >
              <Text style={styles.toggleButtonText}>
                {showAll ? '📅 Today Only' : '🗂️ Show All'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Goals Content - takes remaining space */}
          <View
            style={[
              styles.contentSection,
              filteredGoals.length === 0 && {
                justifyContent: 'center',
                flexGrow: 1,
              },
            ]}
          >
            {filteredGoals.length === 0 ? (
              <View style={styles.emptyStateContainer}>
                <View style={styles.emptyStateBox}>
                  <Text style={styles.emptyStateText}>
                    {showAll ? 'No goals yet' : 'No goals for today'}
                  </Text>
                  <Text style={styles.emptyStateSubtext}>
                    {showAll
                      ? 'Tap the + button to create your first goal'
                      : 'Tap the + button to add a goal for today'}
                  </Text>
                </View>
              </View>
            ) : (
              <FlatList
                data={filteredGoals}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContentContainer}
                showsVerticalScrollIndicator={false}
                style={styles.goalsList}
              />
            )}
          </View>

          {/* Floating plus button */}
          <TouchableOpacity
            style={styles.floatingAddButton}
            onPress={() => router.push('/(tabs)/goals/new-goals' as any)}
          >
            <Text style={styles.addButtonText}>＋</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
