# WellMind App Testing Guide

This guide provides instructions on how to run the automated tests for the WellMind mobile application. The tests are built using Jest and the React Native Testing Library to ensure the application's components and features work as expected.

Before running the tests, please ensure you have completed the project setup as described in the `README.md` file.

## Running the Tests

The project includes unit, integration, and form interaction tests to validate the application's functionality.

### Standard Test Run

To execute the full test suite, run the following command in your terminal:

```bash
npm test
```

This command runs Jest in watch mode, which is useful for development as it automatically re-runs tests when files are changed.

### Running a Single Test

To run a specific test file, you can use the following command:

```bash
npm test -- <path-to-test-file>
```

For example, to run the tests for the `LoginForm` component:

```bash
npm test -- __tests__/components/LoginForm.test.tsx
```

## Test Coverage

The project is configured to generate a test coverage report, which shows the percentage of code that is covered by the test suite. The goal is to maintain at least 20% coverage.

To run the tests and generate a coverage report, use this command:

```bash
npm test -- --coverage
```

After the tests complete, a `coverage/` directory will be created at the root of the project. You can open the `coverage/lcov-report/index.html` file in your browser to view a detailed, interactive report.

## Mocking

-   **Supabase**: The application uses Supabase for its backend services. To isolate the tests from the actual backend, the Supabase client is mocked in the test files where it is needed.

-   **AsyncStorage**: `AsyncStorage` is mocked automatically by Jest. The mock is located at `__mocks__/@react-native-async-storage/async-storage.js`. 