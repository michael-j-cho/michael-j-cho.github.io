// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import yaml from '@rollup/plugin-yaml'; // Imported here

// Import the V4 Vite plugin
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://michael-j-cho.github.io',

  // Standard Astro integrations
  integrations: [mdx(), sitemap()],

  // The new v4 way: Use Vite plugins
  vite: {
    plugins: [
      tailwindcss(),
      yaml() // <--- You must add this here to make it work!
    ],
  },
});
