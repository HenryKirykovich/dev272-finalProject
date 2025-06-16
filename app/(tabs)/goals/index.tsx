//app/(tabs)/goals/index.tsx
// Goals Screen for Daily Goals Management  

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { supabase } from '../../../lib/supabase';

interface Goal {
  id: string;
  title: string;
  created_at: string;
  is_done: boolean;
  show_on_home?: boolean;
}

export default function GoalsScreen() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAll, setShowAll] = useState(false);
  const router = useRouter();

  const today = new Date().toISOString().split('T')[0];

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
    .eq('user_id', user.id) // ✅ фильтрация по текущему пользователю
    .order('created_at', { ascending: false });

  if (!error && data) {
    const sorted = [...data].sort((a, b) => {
      if (a.show_on_home === b.show_on_home) return 0;
      return a.show_on_home ? -1 : 1;
    });
    setGoals(sorted);
  } else {
    console.error('Error fetching goals:', error);
  }
};
  
  
  const toggleGoalStatus = async (goal: Goal) => {
    const { error } = await supabase
      .from('daily_goals')
      .update({ is_done: !goal.is_done })
      .eq('id', goal.id);

    if (!error) {
      fetchGoals();
    }
  };

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

  const deleteGoal = async (goalId: string) => {
    await supabase.from('daily_goals').delete().eq('id', goalId);
    fetchGoals();
  };

  const filteredGoals = showAll
    ? goals
    : goals.filter((g) => g.created_at.startsWith(today));

  const renderItem = ({ item }: { item: Goal }) => (
    <View style={[styles.goalBox, item.is_done && styles.goalDone]}>
      <Text style={styles.goalText}>{item.title}</Text>
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
  );

  useFocusEffect(
    useCallback(() => {
      fetchGoals();
    }, [])
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ImageBackground
        source={require('../../../assets/images/velvet.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Daily Goals</Text>
            <TouchableOpacity onPress={() => setShowAll(!showAll)}>
              <Text style={styles.toggleText}>
                {showAll ? 'Show Today Only' : 'Show All Goals'}
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={filteredGoals}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.footerBox}>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={() => router.push('/(main)/wellmind')}
            >
              <Text style={styles.footerButtonText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={() => router.push('/(tabs)/goals/new-goals')}
            >
              <Text style={styles.footerButtonText}>＋</Text>
            </TouchableOpacity>
          </View>
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
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  toggleText: {
    fontSize: 14,
    color: '#6a4c93',
    textDecorationLine: 'underline',
  },
  goalBox: {
    backgroundColor: '#f2e9f4',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  goalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  goalDone: {
    backgroundColor: '#c5e1a5',
  },
  statusButton: {
    backgroundColor: '#6a66a3',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginRight: 10,
  },
  mainButton: {
    backgroundColor: '#ffb347',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'flex-start',
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
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  footerBox: {
    flexDirection: 'row',
    backgroundColor: '#b5838d',
    borderRadius: 20,
    padding: 16,
    justifyContent: 'space-between',
  },
  footerButton: {
    flex: 1,
    backgroundColor: '#6a66a3',
    paddingVertical: 12,
    marginHorizontal: 6,
    borderRadius: 12,
    alignItems: 'center',
  },
  footerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
  },
});