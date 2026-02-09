/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                engati: {
                    red: '#BD2949',
                    'red-hover': '#A02340',
                },
                input: {
                    border: '#DDDDDD',
                    focus: '#BD2949',
                    bg: '#FFFFFF',
                },
                google: {
                    bg: '#F8F9FA',
                    link: '#1A73E8',
                    url: '#5F6368',
                    desc: '#4D5156',
                    divider: '#DADCE0',
                }
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
