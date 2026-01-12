import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from "url";
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = {
    ...process.env,
    ...loadEnv(mode, process.cwd())
  };

  return defineConfig({
    
    plugins: [
      vue(),
      {
        name: 'vite-plugin-webgl-index-rewrite',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            try {
              const orig = req.url.split('?')[0];
              // match /WebGL/<folder> with optional trailing slash and no file extension
              if (/^\/WebGL\/[^/.]+\/?$/.test(orig)) {
                const p = orig.replace(/\/$/, '');
                req.url = p + '/index.html';
              }
            } catch (e) {
              // ignore and continue
            }
            next();
          });
        }
      }
    ],
    base: '/',
    resolve: {
      alias: [
        { find: "@", replacement: fileURLToPath(new URL('./src', import.meta.url)) }
      ]
    },
    css: {
      preprocessorOptions: {
        less: {
          math: "always",
          relativeUrls: true,
          javascriptEnabled: true
        }
      }
    }
  });
} 