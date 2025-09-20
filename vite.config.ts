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
  const API_HOST = env.API_HOST || 'localhost';
  const API_PORT = Number(env.API_PORT || 3000);

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
        '^/api/.*': {
          target: `http://${API_HOST}:${API_PORT}`,
          changeOrigin: true,
          secure: false,
        },
        '^/yt/.*': {
          target: `http://${API_HOST}:${API_PORT}`,
          changeOrigin: true,
          secure: false,
        },
        '^/yig/.*': {
          target: `http://${API_HOST}:${API_PORT}`,
          changeOrigin: true,
          secure: false,
        },
        '^/youtubei/.*': {
          target: `http://${API_HOST}:${API_PORT}`,
          changeOrigin: true,
          secure: false,
        },
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
