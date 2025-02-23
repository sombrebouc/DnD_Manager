import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path';

// Configuration principale
export default defineConfig({
  // Définit la racine du projet (par défaut, le dossier contenant vite.config.ts)
  // root: './',
  root: resolve(__dirname, './'),
  
  // Plugins utilisés
  plugins: [
    react(), // Plugin React pour supporter JSX et TypeScript
    VitePWA({  // Plugin pour ajouter la Progressive Web App (PWA)
      registerType: 'autoUpdate',
      manifest: {
        name: 'DnD Manager',
        short_name: 'DnD',
        description: 'Application de gestion de personnages D&D',
        theme_color: '#4A90E2',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],

  // Résolution des modules
  resolve: {
    alias: {
      '@': '/src',
      "@components": "/src/components",
      "@pages": "/src/pages", // Simplifie les imports, par exemple: `import Component from '@/components/Component'`
      "@styles": "/src/styles",
      "@scss": "/src/styles/scss",
      "@utils": "/src/utils",
      "@hooks": "/src/hooks",
      "@services": "/src/services",
      "@assets": "/src/assets",
      "@context": "/src/context",
      "@types": "/src/types",
    },
  },

  // Configuration du serveur de développement
  server: {
    port: 8080, // Définit le port pour le serveur local
    open: true, // Ouvre automatiquement le navigateur
    strictPort: true, // Gère les conflits si le port est déjà utilisé
  },

  // Options de compilation
  build: {
    outDir: '../dist', // Dossier de sortie pour les fichiers compilés
    sourcemap: true, // Génère les sourcemaps pour le débogage
    rollupOptions: {
      // Options spécifiques à Rollup
      input: {
        main: './index.html', // Point d'entrée
      },
    },
  },

  // Optimisation des dépendances
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios',
    ],
  },
});
