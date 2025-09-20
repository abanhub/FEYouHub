import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { fileURLToPath } from 'url';
import { componentTagger } from 'lovable-tagger';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Keep for future use
  const invidiousBase = env.VITE_INVIDIOUS_BASE || 'https://yewtu.be';
  const DEV_HOST = env.DEV_HOST || '::';
  const DEV_PORT = Number(env.DEV_PORT || 8080);
  const DEFAULT_API_ORIGIN = 'https://youtubei-proxy.bangngo1509a.workers.dev';
  const API_ORIGIN = (env.VITE_API_ORIGIN?.trim() || DEFAULT_API_ORIGIN).replace(/\/+$/, '');
  const createProxyTarget = () => ({
    target: API_ORIGIN,
    changeOrigin: true,
    secure: true,
  });

  // Resolve ESM-friendly __dirname
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  return {
    server: {
      host: DEV_HOST,
      port: DEV_PORT,
      watch: {
        // OneDrive/Windows can be flaky with native FS events
        usePolling: true,
        interval: 200,
      },
      proxy: {
        '^/api/.*': createProxyTarget(),
        '^/yt/.*': createProxyTarget(),
        '^/yig/.*': createProxyTarget(),
        '^/youtubei/.*': createProxyTarget(),
      },
    },
    plugins: [
      tsconfigPaths(),
      react(),
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    },
  };
});
