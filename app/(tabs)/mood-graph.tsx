// MoodGraphScreen displays the user's mood history as a line chart.
// It allows filtering by week, month, or all time.

import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { supabase } from '../../lib/supabase';
import { useBackgroundColor } from '../_layout';
import { moodGraphStyles as styles } from './mood-graph.styles';

// Converts mood emoji string to a numeric value for graph plotting
function mapMoodToValue(mood: string): number {
  switch (mood) {
    case '🙂':
      return 3;
    case '😐':
      return 2;
    case '😔':
      return 1;
    default:
      return 0;
  }
}

// Formats a date string into MM/DD for chart labels
function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export default function MoodGraphScreen() {
  const [labels, setLabels] = useState<string[]>([]);
  const [values, setValues] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<'week' | 'month' | 'all'>('week');
  const { backgroundColor } = useBackgroundColor();

  // Fetch mood logs from Supabase for the selected date range
  const fetchMoodLogs = useCallback(async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    let dateFrom = new Date();
    if (range === 'week') {
      dateFrom.setDate(dateFrom.getDate() - 7);
    } else if (range === 'month') {
      dateFrom.setMonth(dateFrom.getMonth() - 1);
    } else {
      dateFrom = new Date(0); // Full history
    }

    const { data, error } = await supabase
      .from('mood_logs')
      .select('mood, logged_at')
      .eq('user_id', user.id)
      .gte('logged_at', dateFrom.toISOString())
      .order('logged_at', { ascending: true });

    if (data && !error) {
      const xLabels = data.map(entry => formatDateLabel(entry.logged_at));
      const yValues = data.map(entry => mapMoodToValue(entry.mood));
      setLabels(xLabels);
      setValues(yValues);
    }

    setLoading(false);
  }, [range]);

  // Fetch data when range changes
  useEffect(() => {
    fetchMoodLogs();
  }, [range]);

  // Refetch data each time screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchMoodLogs();
    }, [fetchMoodLogs])
  );

  // Reduce labels for wider datasets (month/all) to prevent clutter
  const reducedLabels = labels.map((label, i, arr) => {
    if (arr.length <= 7) return label; // Show all for a week or less
    if (range === 'month') {
      const mid = Math.floor(arr.length / 2);
      // Show first, middle, and last labels
      return i === 0 || i === mid || i === arr.length - 1 ? label : '';
    }
    if (range === 'all') {
      // Show only first and last
      return i === 0 || i === arr.length - 1 ? label : '';
    }
    return label; // Default to showing label if logic gets complex
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={[styles.scrollContent, { backgroundColor }]}
        contentContainerStyle={[styles.container, { backgroundColor }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerSection}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleEmoji}>📈</Text>
            <Text style={styles.title}>Mood Chart</Text>
          </View>
          <Text style={styles.subtitle}>Track your mood over time</Text>
        </View>

        {/* Range Selector */}
        <View style={styles.rangeSelectorContainer}>
          {['week', 'month', 'all'].map(r => (
            <TouchableOpacity
              key={r}
              style={[
                styles.rangeButton,
                range === r && styles.rangeButtonSelected,
              ]}
              onPress={() => setRange(r as any)}
            >
              <Text
                style={
                  range === r
                    ? styles.rangeButtonTextSelected
                    : styles.rangeButtonText
                }
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Mood Chart */}
        <View style={styles.chartWrapper}>
          {loading ? (
            <ActivityIndicator
              size='large'
              style={styles.loadingIndicator}
              color='#6a66a3'
            />
          ) : values.length === 0 ? (
            <Text style={styles.noDataText}>No data for selected range</Text>
          ) : (
            <LineChart
              data={{
                labels: reducedLabels,
                datasets: [{ data: values }],
              }}
              width={Dimensions.get('window').width - 40}
              height={240}
              yLabelsOffset={8}
              yAxisInterval={1}
              yAxisLabel=''
              yAxisSuffix=''
              fromZero
              withInnerLines={false}
              withOuterLines={false}
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#e0caff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(106, 102, 163, ${opacity})`,
                labelColor: () => '#333',
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                  stroke: '#6a66a3',
                },
                fillShadowGradient: '#6a66a3',
                fillShadowGradientOpacity: 0.2,
              }}
              bezier
              style={{ borderRadius: 16, marginTop: 10 }}
              segments={3}
              formatYLabel={val => {
                if (val === '1') return 'Sad';
                if (val === '2') return 'Neutral';
                if (val === '3') return 'Happy';
                return '';
              }}
            />
          )}
        </View>

        {/* Mood Scale Explanation */}
        <View style={styles.moodLegendWrapper}>
          <Text style={styles.moodLegendTitle}>Mood Scale:</Text>
          <View style={styles.moodLegendRow}>
            <Text style={styles.moodLegendLabel}>😔 = Sad</Text>
            <Text style={styles.moodLegendLabel}>😐 = Neutral</Text>
            <Text style={styles.moodLegendLabel}>🙂 = Happy</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
