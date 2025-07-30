
/** @type {import('tailwindcss').Config} */
const tailwindcssAnimate = require("tailwindcss-animated");

export default {
	darkMode: ["class"],
	content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
	theme: {
		fontFamily: {
			sans: [
				'InterDisplay',
				'sans-serif'
			],
			"sf-compact": [
				'SFCompact',
				'sans-serif'
			]
		},
		screens: {
			xs: '428px',
			sm: '640px',
			md: '790px',
			lg: '1300px',
			xl: '1450px',
			'2xl': '1736px',
			'3xl': '1920px'
		},
		extend: {
			borderColor: {
				DEFAULT: '#E3E8EA',
				primary: '#E9EAEB'
			},
			letterSpacing: {
				base: '0.2px'
			},
			boxShadow: {
				'black-01': 'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px'
			},
			backgroundImage: {
				'gradient-light': 'radial-gradient(63.86% 63.86% at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.1) 100%)',
				'gradient-violet-light': 'radial-gradient(63.86% 63.86% at 50% 50%, rgba(119, 97, 203, 0) 0%, rgba(119, 97, 203, 0.4) 100%)',
				'gradient-violet': 'radial-gradient(63.95% 63.95% at 50% -5.23%, rgba(255, 255, 255, 0.48) 0%, rgba(255, 255, 255, 0) 68.19%), radial-gradient(100% 100% at 50% 100%, rgba(255, 255, 255, 0.48) 0%, rgba(255, 255, 255, 0) 68.19%), linear-gradient(360deg, #6F54E1 0%, #886AF9 100%)',
				'gradient-violet-2': 'radial-gradient(63.86% 63.86% at 50% 50%, rgba(119, 97, 203, 0) 0%, rgba(119, 97, 203, 0.1) 100%);'
			},
			maxWidth: {
				container: '1440px'
			},
			colors: {
				primary: {
					DEFAULT: '#9FE870',
					foreground: 'hsl(var(--primary-foreground))'
				},
				"primary-dark": "#57803E",
				"primary-darker": "#163300",
				"primary-light": "#D3F4BD",
				error: '#FF3D3D',
				rhino: '#7780A1',
				darkGray: '#202225',
				gray: '#2F3136',
				lightGray: '#9CA1AF',
				dark: '#151b11',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			keyframes: {
				slideDownAndFade: {
					from: {
						opacity: '0',
						transform: 'translateY(-2px)'
					},
					to: {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				slideLeftAndFade: {
					from: {
						opacity: '0',
						transform: 'translateX(2px)'
					},
					to: {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				slideUpAndFade: {
					from: {
						opacity: '0',
						transform: 'translateY(2px)'
					},
					to: {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				slideRightAndFade: {
					from: {
						opacity: '0',
						transform: 'translateX(-2px)'
					},
					to: {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				slideDownAndFade: 'slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
				slideLeftAndFade: 'slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
				slideUpAndFade: 'slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
				slideRightAndFade: 'slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	plugins: [
		tailwindcssAnimate,
		function ({ addUtilities }) {
			const newUtilities = {
				".text-gaming-gradient": {
					background: "linear-gradient(90deg, #FFFFFF 0%, #BFC7FD 100%)",
					"-webkit-background-clip": "text",
					"-webkit-text-fill-color": "transparent",
					"background-clip": "text",
					"text-fill-color": "transparent",
				},
			};
			addUtilities(newUtilities, ["responsive", "hover"]);
		},
		require("tailwindcss-animate")
	],
};
