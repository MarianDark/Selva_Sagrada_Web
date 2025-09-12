export default {
content: [
'./index.html',
'./src/**/*.{js,ts,jsx,tsx}',
],
theme: {
extend: {
colors: {
jungle: {
50: '#eff8f1',
100: '#dff1e3',
200: '#bfe3c7',
300: '#9fd5ab',
400: '#7fc78f',
500: '#5fb973', // verde naturaleza
600: '#4c945c',
700: '#3a6f45',
800: '#274a2f',
900: '#142519',
},
earth: {
50: '#fbf6f0',
100: '#f6ead9',
200: '#ead2ad',
300: '#ddb981',
400: '#d09f55',
500: '#c4852a',
600: '#9c6a21',
700: '#745018',
800: '#4c3510',
900: '#241b08',
},
},
fontFamily: {
display: ['Outfit', 'ui-sans-serif', 'system-ui'],
body: ['Inter', 'ui-sans-serif', 'system-ui'],
},
boxShadow: {
soft: '0 10px 25px -12px rgba(16, 24, 40, 0.2)',
},
},
},
plugins: [],
}