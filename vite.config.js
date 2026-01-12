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
      // Serve compressed variants from public (prefer br, then gzip) and rewrite WebGL folder URLs
      {
        name: 'vite-plugin-webgl-compressed-rewrite',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            try {
              let orig = req.url.split('?')[0];

              // match /WebGL/<folder> with no trailing slash and no file extension -> serve index.html
              if (/^\/WebGL\/[^/.]+$/.test(orig)) {
                orig = orig + '/index.html';
                // also update req.url so downstream middlewares see the rewritten path
                req.url = orig + (req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '');
              }

              // only handle GET/HEAD
              if (!/^(GET|HEAD)$/i.test(req.method)) return next();

              const publicRoot = path.join(server.config.root, 'public');
              const targetPath = path.join(publicRoot, decodeURIComponent(orig));

              const acceptEnc = (req.headers['accept-encoding'] || '');
              const supportsBrotli = /\bbr\b/.test(acceptEnc);
              const supportsGzip = /\bgzip\b/.test(acceptEnc) || /\bdeflate\b/.test(acceptEnc);

              const brPath = targetPath + '.br';
              const gzPath = targetPath + '.gz';

              // prefer Brotli when supported
              if (supportsBrotli && fs.existsSync(brPath) && fs.statSync(brPath).isFile()) {
                res.setHeader('Content-Encoding', 'br');
                res.setHeader('Vary', 'Accept-Encoding');
                const ext = path.extname(orig).toLowerCase();
                const contentTypes = {
                  '.js': 'application/javascript',
                  '.wasm': 'application/wasm',
                  '.data': 'application/octet-stream',
                  '.mem': 'application/octet-stream',
                  '.html': 'text/html; charset=utf-8',
                  '.css': 'text/css; charset=utf-8',
                  '.json': 'application/json; charset=utf-8'
                };
                res.setHeader('Content-Type', contentTypes[ext] || 'application/octet-stream');
                fs.createReadStream(brPath).on('error', (e) => next(e)).pipe(res);
                return;
              }

              // then gzip
              if (supportsGzip && fs.existsSync(gzPath) && fs.statSync(gzPath).isFile()) {
                res.setHeader('Content-Encoding', 'gzip');
                res.setHeader('Vary', 'Accept-Encoding');
                const ext = path.extname(orig).toLowerCase();
                const contentTypes = {
                  '.js': 'application/javascript',
                  '.wasm': 'application/wasm',
                  '.data': 'application/octet-stream',
                  '.mem': 'application/octet-stream',
                  '.html': 'text/html; charset=utf-8',
                  '.css': 'text/css; charset=utf-8',
                  '.json': 'application/json; charset=utf-8'
                };
                res.setHeader('Content-Type', contentTypes[ext] || 'application/octet-stream');
                fs.createReadStream(gzPath).on('error', (e) => next(e)).pipe(res);
                return;
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