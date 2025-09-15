export default {
  content: ['./index.html','./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        jungle: { 50:'#ecf8f3',100:'#d5efe3',200:'#b7e0cf',300:'#93cfb7',400:'#6dbf9e',500:'#49ae86',600:'#2e8f6a',700:'#1f6e52',800:'#15533f',900:'#0e3b2d' },
        earth:  { 50:'#fbf7f1',100:'#f5eadb',200:'#ead2b3',300:'#ddb78a',400:'#cf9b64',500:'#b67c3f',600:'#9a6533',700:'#7b4f28',800:'#5d3c20',900:'#432c17' },
        sun: { 400: '#f0c85a' }
      },
      fontFamily: {
        display: ['Outfit','ui-sans-serif','system-ui'],
        sans: ['Inter','ui-sans-serif','system-ui']
      }
    }
  },
  plugins: [],
}
