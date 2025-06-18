// app//(tabs)/_layout.tsx

import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#6a66a3',
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: 'absolute',
          overflow: 'hidden',
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name='home'
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='home-outline' size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='mood-graph'
        options={{
          title: 'Mood Chart',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='stats-chart-outline' size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='journal/index'
        options={{
          title: 'Journal',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='book-outline' size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='goals/index'
        options={{
          title: 'Goals',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='checkmark-done-outline' size={size} color={color} />
          ),
        }}
      />
      {/* Hide nested creation screens from the tab bar */}
      <Tabs.Screen name='journal/new-entry' options={{ href: null }} />
      <Tabs.Screen name='goals/new-goals' options={{ href: null }} />
      <Tabs.Screen name='journal/edit-entry' options={{ href: null }} />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='person-outline' size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
