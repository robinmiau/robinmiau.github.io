import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
            },
            output: {
                entryFileNames: 'assets/js/[name]-[hash].js',
                chunkFileNames: 'assets/js/[name]-[hash].js',
                assetFileNames: (asset) => {
                    const name = asset.names[0] || '';
                    const folder = name.endsWith('.css')
                        ? 'css'
                        : /\.(woff2?|ttf|otf)$/.test(name)
                          ? 'fonts'
                          : /\.(ogg|mp3|wav)$/.test(name)
                            ? 'audio'
                            : 'images';
                    return 'assets/' + folder + '/[name]-[hash][extname]';
                },
            },
        },
    },
    base: './',
});
