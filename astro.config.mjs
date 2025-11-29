// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { ghPagesPostprocessor } from "./gh-pages-postprocessor";
import { linkResolver } from './src/remark-plugins/link-resolver';

// https://astro.build/config
export default defineConfig({
	site: 'https://boraini.com/deepworld-2025-website',
	outDir: './docs',
	base: '/deepworld-2025-website',
	markdown: {
		remarkPlugins: [[linkResolver, {
			base: "/deepworld-2025-website",
			resolution: {
				"./src/articles": {
					base: "./blog/",
					customPrefixes: {
						"blog/": "."
					},
				},
			},
		}]]
	},
	integrations: [mdx(), sitemap()],
	vite: {
		plugins: [tailwindcss(), ghPagesPostprocessor()],
	},
});
