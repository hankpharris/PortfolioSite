/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                "bwh-blue": "#00529b",
                "bwh-dark-blue": "#003366",
                "bwh-gray": "#4a4a4a",
            },
        },
    },
    plugins: [],
    darkMode: "class",
};
