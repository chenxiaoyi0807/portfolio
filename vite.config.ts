import { copyFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { projects } from './src/data';

export default defineConfig({
  plugins: [{
    name: 'portfolio-static-pages',
    async writeBundle({ dir }) {
      if (!dir) return;
      const index = resolve(dir, 'index.html');
      await Promise.all([
        copyFile(index, resolve(dir, '404.html')),
        copyFile(resolve('node_modules/@fontsource/kanit/LICENSE'), resolve(dir, 'kanit-license.txt')),
        ...projects.map(async ({ slug }) => {
          const directory = resolve(dir, 'projects', slug);
          await mkdir(directory, { recursive: true });
          await copyFile(index, resolve(directory, 'index.html'));
        }),
      ]);
    },
  }],
});
