module.exports = {
    root: true,
    extends: ['universe/native'],
    plugins: ['react-native'],
    rules: {
        // Add custom rules here
        'prettier/prettier': 'off',
        'react-native/no-inline-styles': 'warn',
    },
};
