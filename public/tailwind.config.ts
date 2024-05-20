import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/flowbite-react/lib/esm/**/*.js',
  ],
  theme: {
    extend: {
      fontFamily: {
        animeace: ['Animeace', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        courier: ['Courier', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        whatsapp: {
          default: '#25d366',
          hover: '#128C7E',
        },
        facebook: {
          default: '#1877f2',
          hover: '#0e5a9b',
        },
        instagram: {
          default: '#e1306c',
          hover: '#c13584',
        },
        bitcoinOrange: '#FF9900',
      },
    },
  },
  plugins: [

]
}
export default config
