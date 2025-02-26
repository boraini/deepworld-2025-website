// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { ghPagesPostprocessor } from "./gh-pages-postprocessor";

// https://astro.build/config
export default defineConfig({
	site: 'https://boraini.com/deepworld-2025-website',
	outDir: './docs',
	base: '/deepworld-2025-website',
	integrations: [mdx(), sitemap()],
	vite: {
		plugins: [tailwindcss(), ghPagesPostprocessor()],
	},
});
