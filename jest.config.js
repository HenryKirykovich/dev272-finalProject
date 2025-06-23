module.exports = {
    preset: 'jest-expo',
    transformIgnorePatterns: [
        'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|expo-router)',
    ],
    collectCoverage: true,
    collectCoverageFrom: [
        'app/**/*.{ts,tsx}',
        'components/**/*.{ts,tsx}',
        '!**/node_modules/**',
        '!app/_layout.tsx',
        '!app/+not-found.tsx',
        '!**/*.styles.ts',
        '!**/*.config.js',
        '!**/*.d.ts',
        '!**/constants/**',
        '!**/scripts/**',
        '!**/coverage/**',
        '!**/wireframes/**',
        '!**/retrospectives/**',
        '!**/assets/**',
        '!app/(auth)/_layout.tsx',
        '!app/(tabs)/_layout.tsx',
        '!app/index.tsx', // This file is just a redirect
        '!components/ui/IconSymbol.ios.tsx',
        '!components/ui/IconSymbol.tsx', // These are platform specific and hard to test without mocking.
        '!components/ExternalLink.tsx',
        '!components/HapticTab.tsx',
        '!components/HelloWave.tsx',
        '!components/Collapsible.tsx',
        '!hooks/**',
        '!lib/supabase.ts', // Don't test supabase client
    ],
    coverageReporters: ['json', 'lcov', 'text', 'clover'],
    coverageThreshold: {
        global: {
            branches: 20,
            functions: 20,
            lines: 20,
            statements: 20,
        },
    },
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                babelConfig: true,
            },
        ],
        '^.+\\.svg$': 'jest-transformer-svg',
    },
}; 