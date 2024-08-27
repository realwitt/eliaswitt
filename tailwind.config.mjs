/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				dark_blue: '#212738',
				subtle_blue: '#5F70A0',
				light_blue: '#9FA9C6',
				accent_pink: '#F75590',
				accent_purple: '#BDB2FF'
			},
		},
	},
	plugins: [],
}
