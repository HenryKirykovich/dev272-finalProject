// app/(tabs)/goals/index.tsx
// Goals Screen: Daily goal tracking for authenticated users

import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '../../../lib/supabase';

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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ImageBackground
        source={require('../../../assets/images/velvet.jpg')}
        style={styles.background}
        resizeMode='cover'
      >
        <View style={styles.container}>
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
          <View style={styles.contentSection}>
            {filteredGoals.length === 0 ? (
              <View style={styles.emptyStateContainer}>
                <Text style={styles.emptyStateText}>
                  {showAll ? 'No goals yet' : 'No goals for today'}
                </Text>
                <Text style={styles.emptyStateSubtext}>
                  {showAll
                    ? 'Tap the + button to create your first goal'
                    : 'Tap the + button to add a goal for today'}
                </Text>
              </View>
            ) : (
              <FlatList
                data={filteredGoals}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={[
                  styles.listContentContainer,
                  filteredGoals.length <= 5 && styles.centeredListContent,
                ]}
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
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2d1b69',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(106, 102, 163, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  toggleButton: {
    backgroundColor: '#6a66a3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    shadowColor: '#6a66a3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  goalBox: {
    backgroundColor: '#f2e9f4',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  goalTextContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    alignSelf: 'stretch',
  },
  goalText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  goalDone: {
    backgroundColor: '#c5e1a5',
  },
  statusButton: {
    backgroundColor: '#6a66a3',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginRight: 10,
  },
  mainButton: {
    backgroundColor: '#ffb347',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  statusDone: {
    backgroundColor: '#a67db8',
  },
  statusButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#aa3333',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  addButton: {
    backgroundColor: '#6a66a3',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    maxWidth: 250,
  },
  floatingAddButton: {
    position: 'absolute',
    bottom: 90,
    alignSelf: 'center',
    backgroundColor: '#6a66a3',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentWrapper: {
    flex: 1,
  },
  goalsList: {
    flex: 1,
  },
  listContentContainer: {
    paddingBottom: 20,
  },
  centeredListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  headerSection: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 24,
    shadowColor: '#6a66a3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  contentSection: {
    flex: 1,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleEmoji: {
    fontSize: 28,
    marginRight: 10,
  },
});
