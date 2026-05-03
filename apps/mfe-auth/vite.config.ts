import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'mfe_auth',
      filename: 'remoteEntry.js',
      exposes: {
        './LoginPage':     './src/pages/LoginPage.tsx',
        './RegisterPage':  './src/pages/RegisterPage.tsx',
        './DashboardPage': './src/pages/DashboardPage.tsx',
      },
      shared: {
        react:            { singleton: true, requiredVersion: '^18.3.0' },
        'react-dom':      { singleton: true, requiredVersion: '^18.3.0' },
        'react-router-dom': { singleton: true },
      },
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
  },
  server: { port: 3001, cors: true },
  preview: { port: 3001, cors: true },
});
