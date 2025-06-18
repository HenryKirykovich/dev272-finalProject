// MoodGraphScreen displays the user's mood history as a line chart.
// It allows filtering by week, month, or all time.

import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { supabase } from '../../lib/supabase';

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
  const router = useRouter();

  // Fetch mood logs from Supabase for the selected date range
  useEffect(() => {
    const fetchMoodLogs = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      let dateFrom = new Date();
      if (range === 'week') {
        dateFrom.setDate(dateFrom.getDate() - 6);
      } else if (range === 'month') {
        dateFrom.setMonth(dateFrom.getMonth() - 1);
      } else {
        dateFrom = new Date('2024-01-01'); // full history fallback
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
    };

    fetchMoodLogs();
  }, [range]);

  // Reduce labels for wider datasets (month/all)
  const reducedLabels = labels.map((label, i, arr) => {
    if (range === 'week') return label;
    if (range === 'month') {
      const mid = Math.floor(arr.length / 2);
      return i === 0 || i === mid || i === arr.length - 1 ? label : '';
    }
    if (range === 'all') {
      return i === 0 || i === arr.length - 1 ? label : '';
    }
    return '';
  });

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
            {/* Header */}
            <View style={styles.textBgWrapper}>
              <ImageBackground
                source={require('../../assets/images/velvet3.png')}
                style={StyleSheet.absoluteFillObject}
                imageStyle={{ opacity: 0.5, borderRadius: 16 }}
                resizeMode='cover'
              />
              <View style={styles.textBgContent}>
                <Text style={styles.title}>Mood Chart</Text>
                <Text style={styles.subtitle}>Track your mood over time</Text>
              </View>
            </View>

            {/* Range Selector */}
            <View style={{ flexDirection: 'row', marginBottom: 12 }}>
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
            {loading ? (
              <ActivityIndicator size='large' style={{ marginTop: 60 }} />
            ) : values.length === 0 ? (
              <Text style={{ color: '#000' }}>No data for selected range</Text>
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

            {/* Mood Scale Explanation */}
            <View style={styles.moodLegendWrapper}>
              <Text style={styles.moodLegendTitle}>Mood Scale:</Text>
              <View style={styles.moodLegendRow}>
                <Text style={styles.moodLegendLabel}>😐 = Sad</Text>
                <Text style={styles.moodLegendLabel}>😔 = Neutral</Text>
                <Text style={styles.moodLegendLabel}>🙂 = Happy</Text>
              </View>
            </View>
          </ScrollView>

          {/* Footer Navigation */}
          <View style={styles.footerBox}>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={() => router.push('/(main)/wellmind')}
            >
              <Text style={styles.footerButtonText}>Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1, justifyContent: 'space-between', padding: 20 },
  scrollContent: { flexGrow: 1, alignItems: 'center' },
  textBgWrapper: {
    position: 'relative',
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    minHeight: 180,
    justifyContent: 'center',
    width: '100%',
  },
  textBgContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    zIndex: 1,
  },
  title: { fontSize: 30, fontWeight: 'bold', color: '#000' },
  subtitle: { fontSize: 16, color: '#000' },
  rangeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: '#ffffffcc',
    borderWidth: 1,
    borderColor: '#6a66a3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rangeButtonSelected: {
    backgroundColor: '#6a66a3',
  },
  rangeButtonText: {
    color: '#6a66a3',
    fontWeight: 'bold',
    fontSize: 16,
  },
  rangeButtonTextSelected: {
    color: '#fff',
  },
  footerBox: {
    flexDirection: 'row',
    backgroundColor: '#b5838d',
    borderRadius: 20,
    padding: 16,
    justifyContent: 'center',
    marginTop: 20,
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
  moodLegendWrapper: {
    backgroundColor: '#ffffffcc',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  moodLegendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  moodLegendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  moodLegendLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
  },
});
