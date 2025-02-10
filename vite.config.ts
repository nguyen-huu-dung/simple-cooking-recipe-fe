import { defineConfig, PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        (function (): PluginOption[] {
            return [
                {
                    name: 'hot-reload',
                    enforce: 'post',
                    handleHotUpdate({ file, server }) {
                        if (file.endsWith('.json')) {
                            server.ws.send({
                                type: 'full-reload',
                                path: '*'
                            });
                        }
                    }
                }
            ];
        })()
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src') // Alias tương đương
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    build: {
        outDir: 'build'
    }
});
