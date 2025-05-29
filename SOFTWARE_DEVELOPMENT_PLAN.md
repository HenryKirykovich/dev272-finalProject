# SOFTWARE DEVELOPMENT PLAN

## 📋 Project Overview

**Project Name:** WellMind
**Project Type:** Mood Monitoring Mobile Application  
**Platform:** Cross-platform (iOS, Android, Web)

---

## 👥 Team Members & Roles

| Name | Primary Role | Secondary Role | Responsibilities |
|------|-------------|----------------|------------------|
| **Henadzi Kirykovich** | Backend Developer | Frontend Developer | Database design, API development, server logic, React Native components |
| **Kyryl Andreiev** | Project Manager | DevOps | Sprint planning, team coordination, CI/CD setup, deployment |
| **Shayla Rohrer** | UI/UX Designer | - | User interface design, user experience research, prototyping, design systems |
| **Tri Nguyen** | QA Engineer | Frontend Developer | Testing strategy, quality assurance, bug tracking, React Native development |

---

## 🎯 Problem Statement

Many people struggle to track and understand their emotional well-being throughout their daily lives. Without proper tools to monitor mood patterns, reflect on experiences, and organize daily tasks, individuals often miss opportunities to:

- Identify emotional triggers and patterns
- Practice mindfulness and self-reflection
- Maintain mental health awareness
- Connect emotional states with daily activities and productivity

Our app addresses this gap by providing an integrated platform for mood tracking, journaling, and task management.

---

## 👤 Target Users & User Personas

### Primary Target Users
- **Age Range:** 18-35 years old
- **Tech Comfort:** Moderate to high smartphone usage
- **Lifestyle:** Students, young professionals, individuals interested in mental wellness

### User Personas

#### Persona 1: "Mindful Maya" - College Student
- **Age:** 20, Psychology major
- **Goals:** Track mood patterns for personal insight and academic research
- **Pain Points:** Forgets to journal regularly, wants data-driven insights
- **Usage:** Daily mood logging, weekly reflection through journaling

#### Persona 2: "Busy Ben" - Young Professional
- **Age:** 28, Marketing manager
- **Goals:** Balance work stress with personal well-being
- **Pain Points:** Limited time, needs quick and efficient tracking
- **Usage:** Quick mood check-ins, task management integration

#### Persona 3: "Wellness Wendy" - Mental Health Enthusiast
- **Age:** 32, Freelance designer
- **Goals:** Comprehensive self-care tracking and improvement
- **Pain Points:** Wants detailed analytics and long-term trend analysis
- **Usage:** Detailed journaling, mood analytics, goal setting

---

## 🚀 MVP Feature List

### Core Features (Must-Have)
1. **Mood Tracking**
   - Daily mood entry with emoji/scale selection
   - Quick mood check-in functionality
   - Basic mood history view

2. **Journaling System**
   - Daily journal entries

3. **Task Management**
   - Add/edit/delete tasks
   - Mark tasks as complete

4. **User Authentication**
   - User registration and login
   - Secure data storage
   - Profile management

### Secondary Features (Nice-to-Have)
5. **Mood Analytics**
   - Weekly/monthly mood trends
   - Basic charts and graphs
   - Pattern recognition insights

6. **Notifications**
   - Daily mood check-in reminders
   - Journaling prompts

7. **Data Export**
   - Export journal entries
   - Mood data export for external analysis

---

## 🛠️ Tech Stack & Third-Party Libraries

### Frontend Framework
- **React Native** with **Expo** - Cross-platform mobile development
- **TypeScript** - Type safety and better developer experience
- **Expo Router** - File-based navigation system

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - Database
  - Authentication

### Development Tools
- **VS Code** - Primary IDE
- **ESLint + Prettier** - Code quality and formatting
- **Git/GitHub** - Version control and collaboration

### Planned Third-Party Libraries

#### UI/UX Libraries
- `react-native-paper` or `native-base` - UI component library
- `react-native-vector-icons` - Icon system
- `react-native-reanimated` - Advanced animations

#### Data & State Management
- `@tanstack/react-query` - Server state management
- `zustand` or `redux-toolkit` - Client state management
- `react-hook-form` - Form handling

#### Charts & Analytics
- `react-native-chart-kit` or `victory-native` - Data visualization
- `date-fns` - Date manipulation

#### Utilities
- `react-native-async-storage` - Local data persistence
- `expo-notifications` - Push notifications

---

## 📅 Timeline

### Week 1: Project Setup
**Goal:** Project and communications settup

### Week 2: First Working Prototype
**Goal:** Basic app structure and core functionality

### Week 3: UI and Most Features Done
**Goal:** Complete UI design and implement major features

### Week 4: MVP
**Goal:** Minimum Viable Product completion

### Week 5: Testing and Polishing
**Goal:** Quality assurance and final refinements

### Week 6: Presentation
**Goal:** Final presentation and project delivery

---