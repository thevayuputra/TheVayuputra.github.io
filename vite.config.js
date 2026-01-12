import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from "url";

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = {
    ...process.env,
    ...loadEnv(mode, process.cwd())
  };

  return defineConfig({
    plugins: [
      vue(),
      // Rewrite requests like /WebGL/ArrowEscape -> /WebGL/ArrowEscape/index.html
      {
        name: 'vite-plugin-webgl-index-rewrite',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            try {
              const orig = req.url.split('?')[0];
              // match /WebGL/<folder> with no trailing slash and no file extension
              if (/^\/WebGL\/[^/.]+$/.test(orig)) {
                req.url = orig + '/index.html';
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
        // thanks to https://stackoverflow.com/a/67676242/22296059 :)
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