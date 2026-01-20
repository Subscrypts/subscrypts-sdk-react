/** @type {import('tailwindcss').Config} */
export default {
  prefix: 'subscrypts-',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#3B82F6',
          secondary: '#10B981',
          error: '#EF4444',
          success: '#10B981',
          warning: '#F59E0B'
        }
      },
      borderRadius: {
        DEFAULT: '0.5rem'
      }
    }
  },
  plugins: []
};
