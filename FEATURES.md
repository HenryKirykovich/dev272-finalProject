# Application Features

This document outlines the features available on each screen of the WellMind application.

## Authentication Screens (`app/(auth)`)

### 1. Login (`login.tsx`)
- Allows existing users to sign in using their email and password.
- Provides a link to the registration screen for new users.

### 2. Register (`register.tsx`)
- Allows new users to create an account by providing an email and password.
- Redirects to the login screen after successful registration.

### 3. Profile Form (`profile-form.tsx` & `(tabs)/profile.tsx`)
- **User Profile:** Allows users to view and update their full name.
- **Password Management:** Provides a secure way to change the account password.
- **Theme Customization:** Users can select a new background color for the app, which is persisted across sessions.
- **Logout:** A button to sign out of the application securely.

## Main Application Screens (`app/(tabs)`)

### 1. Home (`home.tsx`)
- **Personalized Greeting:** Displays a welcome message that includes the user's name.
- **Main Goal Display:** Shows the user's primary daily goal for quick reference.
- **Mood Logging:** Allows the user to log their current mood (Happy, Neutral, or Sad) for the day.

### 2. Mood Graph (`mood-graph.tsx`)
- **Mood Visualization:** Displays a line chart representing the user's mood history over time.
- **Date Range Filtering:** The chart can be filtered to show data from the last week, month, or all time.
- **Clear Legend:** Includes a legend to explain the mood-to-value mapping on the chart.

### 3. Journal (`journal/index.tsx`)
- **Entry Listing:** Shows a list of all journal entries created by the user, sorted by date.
- **Quick Preview:** Each entry in the list displays the creation date and a snippet of the content.
- **Navigation:** Tapping on an entry navigates to the edit screen.
- **Create New Entry:** A floating action button allows for the creation of new journal entries.

### 4. New Journal Entry (`journal/new-entry.tsx`)
- **Simple Form:** A clean and straightforward form to write and save a new journal entry.
- **Content Input:** A multi-line text area for composing the journal entry.
- **Actions:** Buttons to either save the new entry or go back to the journal list.

### 5. Edit Journal Entry (`journal/edit-entry.tsx`)
- **Edit Form:** Allows for the modification of an existing journal entry.
- **Creation Timestamp:** Displays the original creation date of the entry.
- **Update and Delete:** Provides options to save the changes or permanently delete the entry.

### 6. Goals (`goals/index.tsx`)
- **Goal Management:** Displays a comprehensive list of the user's daily goals.
- **Status Tracking:** Each goal can be marked as "Done" or "Undo".
- **Prioritization:** A goal can be designated as the "Main" goal, which will then be displayed on the home screen.
- **Deletion:** Individual goals can be deleted.
- **Filtering:** Users can switch between viewing only today's goals or all goals.
- **Create New Goal:** A floating action button for adding new goals.

### 7. New Goal (`goals/new-goals.tsx`)
- **Goal Creation Form:** A simple form to define a new daily goal.
- **Title Input:** A text input field for the goal's description.
- **Actions:** Buttons to save the new goal or return to the goals list.

## Core App Files

### 1. Not Found (`+not-found.tsx`)
- **404 Handling:** A user-friendly screen that is displayed whenever a route is not found.
- **Home Link:** Provides a convenient link to navigate back to the home screen.

### 2. Index (`index.tsx`)
- **App Entry Point:** The initial screen that loads when the app starts.
- **Authentication Redirect:** Automatically redirects users to the login screen if they are not authenticated, or to the home screen if they are. 