const naviktTailwindPreset = require('@navikt/ds-tailwind')

/** @type {import('tailwindcss').Config} */
module.exports = {
    presets: [naviktTailwindPreset],
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            spacing: {
                '2xl': '42rem',
            },
            colors: {
                strava: '#FC4C02',
            },
        },
    },
    plugins: [],
}
