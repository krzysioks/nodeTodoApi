module.exports = {
    env: {
        es6: true,
        browser: true,
        node: true,
        amd: true
    },
    globals: {
        all: true
    },
    extends: ['eslint:recommended'],
    parser: 'babel-eslint',
    parserOptions: {
        ecmaFeatures: {
            experimentalObjectRestSpread: true,
            experimentalDecorators: true
        },
        sourceType: 'module'
    },
    plugins: ['prettier', 'mocha'],
    rules: {
        'prettier/prettier': [
            'warn',
            {
                singleQuote: true,
                bracketSpacing: false,
                jsxBracketSameLine: true,
                tabWidth: 4,
                printWidth: 120
            }
        ],
        'mocha/no-exclusive-tests': 'error',
        semi: ['error', 'always'],
        'no-unused-vars': ['none'],
        'no-undef': ['warn'],
        'no-console': ['warn'],
        'no-debugger': ['error']
    }
};
