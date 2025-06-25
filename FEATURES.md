# Application Features

This document outlines the features available on each screen of the WellMind application and the technologies used to implement them.

## Navigation
The application uses **Expo Router** for all navigation purposes. This file-based routing system allows for a clean and organized structure, handling everything from simple screen transitions to complex nested navigation and authentication-based redirects.

## Global State Management: Background Color
The app's background color is managed globally using React's Context API, allowing for a consistent theme across all screens. A custom `useBackgroundColor` hook provides components with access to the color state, which is persisted across sessions using AsyncStorage to remember the user's preference.

## Authentication Screens (`app/(auth)`)

### 1. Login (`login.tsx`)
- **Feature:** Allows existing users to sign in using their email and password.
  - **Technology:** Implemented using **Supabase Authentication** for credential verification.
- **Feature:** Provides a link to the registration screen for new users.

### 2. Register (`register.tsx`)
- **Feature:** Allows new users to create an account by providing an email and password.
  - **Technology:** User creation is managed through **Supabase Authentication**.
- **Feature:** Redirects to the login screen after successful registration.

### 3. Profile Form (`profile-form.tsx` & `(tabs)/profile.tsx`)
- **Feature: User Profile:** Allows users to view and update their full name.
  - **Technology:** User data is stored and retrieved from a **Supabase PostgreSQL** database.
- **Feature: Password Management:** Provides a secure way to change the account password.
  - **Technology:** Secure password updates are handled by **Supabase Authentication**.
- **Feature: Theme Customization:** Users can select a new background color for the app.
  - **Technology:** The selected color is persisted across sessions using **AsyncStorage**, and the state is managed globally with **React Context API**.
- **Feature: Logout:** A button to sign out of the application securely.
  - **Technology:** Session termination is managed by **Supabase Authentication**.

## Main Application Screens (`app/(tabs)`)

### 1. Home (`home.tsx`)
- **Feature: Personalized Greeting:** Displays a welcome message that includes the user's name.
  - **Technology:** The user's name is fetched from the **Supabase** database.
- **Feature: Main Goal Display:** Shows the user's primary daily goal.
  - **Technology:** The main goal is queried from the **Supabase** database.
- **Feature: Mood Logging:** Allows the user to log their current mood for the day.
  - **Technology:** Mood data is stored in the **Supabase** database.

### 2. Mood Graph (`mood-graph.tsx`)
- **Feature: Mood Visualization:** Displays a line chart representing the user's mood history.
  - **Technology:** The chart is rendered using the **react-native-chart-kit** library.
- **Feature: Date Range Filtering:** The chart can be filtered by week, month, or all time.
  - **Technology:** Mood data is fetched from **Supabase** with dynamic date range queries.
- **Feature: Clear Legend:** Includes a legend to explain the mood-to-value mapping.
  - **Technology:** Implemented with standard **React Native** components.

### 3. Journal (`journal/index.tsx`)
- **Feature: Entry Listing:** Shows a list of all journal entries created by the user.
  - **Technology:** Entries are displayed in a `FlatList` component, with data fetched from **Supabase**.
- **Feature: Navigation:** Tapping on an entry navigates to the edit screen.
- **Feature: Create New Entry:** A floating action button to create new entries.
  - **Technology:** Implemented using a `TouchableOpacity` component from **React Native**.

#### New Journal Entry (`journal/new-entry.tsx`)
- **Feature: Simple Form:** A form to write and save a new journal entry.
  - **Technology:** The form is built with **React Native** components (`TextInput`, `TouchableOpacity`).
- **Feature: Actions:** Buttons to save the new entry or go back.
  - **Technology:** Saving sends data to **Supabase**.

#### Edit Journal Entry (`journal/edit-entry.tsx`)
- **Feature: Edit Form:** Allows for the modification of an existing entry.
  - **Technology:** The form is built with **React Native** components and interacts with **Supabase** for updates.
- **Feature: Update and Delete:** Provides options to save changes or delete the entry.
  - **Technology:** Both actions perform operations against the **Supabase** database.

### 4. Goals (`goals/index.tsx`)
- **Feature: Goal Management:** Displays a list of the user's daily goals.
  - **Technology:** Goals are rendered in a `FlatList`, with data managed by **Supabase**.
- **Feature: Status Tracking & Prioritization:** Goals can be marked as "Done" or set as the "Main" goal.
  - **Technology:** Status updates are sent to the **Supabase** database.
- **Feature: Filtering:** Users can toggle between today's goals and all goals.
  - **Technology:** Implemented using **React State** to manage the filtered list.
- **Feature: Create New Goal:** A floating action button for adding new goals.
  - **Technology:** Implemented with a `TouchableOpacity` from **React Native**.

#### New Goal (`goals/new-goals.tsx`)
- **Feature: Goal Creation Form:** A simple form to define a new daily goal.
  - **Technology:** The form is composed of **React Native** components, and new goals are saved to **Supabase**.
- **Feature: Actions:** Buttons to save the goal or return to the list.
  - **Technology:** Saving interacts with **Supabase**.

## Core App Files

### 1. Not Found (`+not-found.tsx`)
- **Feature: 404 Handling:** A user-friendly screen for non-existent routes.
- **Feature: Home Link:** Provides a link to navigate back to the home screen.

### 2. Index (`index.tsx`)
- **Feature: App Entry Point:** The initial screen that loads when the app starts.
- **Feature: Authentication Redirect:** Automatically redirects users based on their authentication status.
  - **Technology:** **Supabase Auth** is used to check the user's session. 