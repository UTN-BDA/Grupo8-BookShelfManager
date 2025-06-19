/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta de colores personalizada para BookShelf Manager
        primary: {
          DEFAULT: '#A3B18A', // Verde Salvia - Color Principal
          50: '#F3F5F1',
          100: '#E7EDE0',
          200: '#D0DBC2',
          300: '#B9C9A4',
          400: '#A3B18A', // Principal
          500: '#8B9B70',
          600: '#747D5E',
          700: '#5D604C',
          800: '#464539',
          900: '#2F2A27',
        },
        secondary: {
          DEFAULT: '#FFECCC', // Beige Suave - Color Secundario
          50: '#FFFAF5',
          100: '#FFF6EB',
          200: '#FFECCC', // Principal
          300: '#FFE2B3',
          400: '#FFD899',
          500: '#FFCE80',
          600: '#E6B866',
          700: '#CCA24D',
          800: '#B38C33',
          900: '#99761A',
        },
        accent: {
          DEFAULT: '#F28482', // Coral Cálido - Color de Resalte
          50: '#FEF5F5',
          100: '#FDEBEB',
          200: '#F9C6C5',
          300: '#F5A29F',
          400: '#F28482', // Principal
          500: '#ED5E5B',
          600: '#E83835',
          700: '#C02B29',
          800: '#991F1E',
          900: '#721313',
        },
        neutral: {
          DEFAULT: '#F5F5F5', // Gris Claro - Fondo Neutro
          50: '#FFFFFF',
          100: '#FAFAFA',
          200: '#F5F5F5', // Principal
          300: '#E5E5E5',
          400: '#D4D4D4',
          500: '#A3A3A3',
          600: '#737373',
          700: '#525252',
          800: '#404040',
          900: '#262626',
        },
        text: {
          DEFAULT: '#333333', // Gris Oscuro - Texto Principal
          light: '#666666',
          lighter: '#999999',
        },
        sky: {
          DEFAULT: '#8ECAE6', // Azul Cielo Suave - Énfasis Opcional
          50: '#F0F9FD',
          100: '#E1F4FB',
          200: '#C3E9F7',
          300: '#A5DEF3',
          400: '#8ECAE6', // Principal
          500: '#6BB6DB',
          600: '#4A9BD0',
          700: '#3A7BA8',
          800: '#2B5C80',
          900: '#1C3D58',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 30px -5px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
