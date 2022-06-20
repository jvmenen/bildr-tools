module.exports = {
    // [...]
    // Replace `ts-jest` with the preset you want to use
    // from the above list
    preset: 'ts-jest',
    //keep TypeScript default options and skip the settings in tsconfig
    globals: {
        'ts-jest': {
            tsconfig: {
                "strict": true,
                types: ["jest"]
            }
        }
    }
};