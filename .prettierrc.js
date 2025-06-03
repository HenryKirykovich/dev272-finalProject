module.exports = {
  // Use single quotes instead of double quotes
  singleQuote: true,

  // Print semicolons at the ends of statements
  semi: true,

  // Use 2 spaces for indentation
  tabWidth: 2,

  // Print trailing commas wherever possible when multi-line
  trailingComma: 'es5',

  // Print spaces between brackets in object literals
  bracketSpacing: true,

  // Put > of a multi-line JSX element at the end of the last line
  bracketSameLine: false,

  // Include parentheses around a sole arrow function parameter
  arrowParens: 'avoid',

  // Line length that the printer will wrap on
  printWidth: 80,

  // Use single quotes in JSX
  jsxSingleQuote: true,

  // Specify which parser to use
  parser: 'typescript',

  // File patterns to format
  overrides: [
    {
      files: '*.{js,jsx,ts,tsx}',
      options: {
        parser: 'typescript',
      },
    },
    {
      files: '*.json',
      options: {
        parser: 'json',
      },
    },
  ],
};
