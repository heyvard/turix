/* tailwind.config.js */
const path = require('path')

module.exports = {
    content: [
        './node_modules/flowbite-react/**/*.js',
        path.join(__dirname, './pages/**/*.{js,ts,jsx,tsx}'),
        path.join(__dirname, './components/**/*.{js,ts,jsx,tsx}'),
    ],
    theme: {
        extend: {},
    },
    plugins: [require('flowbite/plugin')],
}
