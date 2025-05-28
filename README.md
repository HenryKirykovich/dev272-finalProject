# dev272-finalproject

A React Native application designed to monitor your mood throughout the day, offering features such as journaling and a to-do list.

## 📱 About

This mood monitoring app helps users track their emotional well-being through:
- **Mood Tracking**: Monitor your mood throughout the day
- **Journaling**: Reflect on your thoughts and experiences
- **To-Do List**: Organize your daily tasks and goals

Built with React Native and Expo for cross-platform compatibility (iOS, Android, and Web).

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/karilaa-dev/dev272-finalProject.git
   cd dev272-finalProject
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

### Running the App

After starting the development server, you can run the app on different platforms:

- **iOS Simulator**: Press `i` in the terminal or run `npm run ios`
- **Android Emulator**: Press `a` in the terminal or run `npm run android`
- **Web Browser**: Press `w` in the terminal or run `npm run web`
- **Physical Device**: Scan the QR code with the Expo Go app

## 🧰 Tech Stack

- **Framework**: [Expo](https://expo.dev/) with [React Native](https://reactnative.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/)
- **Styling**: React Native StyleSheet
- **Code Quality**: ESLint + Prettier
- **Development**: VS Code with recommended extensions

## 📱 Features

### Current Features
- Cross-platform compatibility (iOS, Android, Web)
- Modern navigation with Expo Router
- TypeScript for type safety
- Consistent code formatting with Prettier
- Code quality enforcement with ESLint

### Planned Features
- Mood tracking interface
- Daily journaling functionality
- To-do list management
- Data persistence
- Mood analytics (mood trends, etc.)

## 🛠️ Development

### Code Quality

This project uses ESLint and Prettier for code quality and formatting:

```bash
# Run linting
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Check code formatting
npm run format:check

# Run TypeScript type checking
npm run type-check

# Run all checks (recommended before committing)
npm run check-all
```

### VS Code Setup

For the best development experience with VS Code:

1. Install the recommended extensions (you'll be prompted when opening the project)
2. Code will auto-format on save
3. ESLint errors will be highlighted in real-time

## 🔧 Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android emulator/device
- `npm run ios` - Run on iOS simulator/device
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check if code is formatted correctly
- `npm run type-check` - Run TypeScript type checking
- `npm run check-all` - Run all quality checks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run quality checks (`npm run check-all`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Style

This project follows strict code formatting and linting rules:
- Always run `npm run check-all` before committing
- Use meaningful commit messages
- Follow TypeScript best practices
- Write self-documenting code


## 🆘 Troubleshooting

### Common Issues

**Metro bundler issues**
```bash
npx expo start --clear
```

**Node modules issues**
```bash
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors**
```bash
npm run type-check
```

**Linting/formatting issues**
```bash
npm run lint:fix
npm run format
```

### Getting Help

- Check the [Expo Documentation](https://docs.expo.dev/)
- Review [React Native Documentation](https://reactnative.dev/docs/getting-started)
