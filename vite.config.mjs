import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import autoprefixer from 'autoprefixer'

export default defineConfig(({ command, mode }) => {
  // Carga las variables de entorno según el modo
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    base: '/',
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['react', 'react-dom', 'react-router-dom', 'react-redux'],
            'coreui': ['@coreui/react', '@coreui/icons-react', '@coreui/icons'],
          },
        },
      },
    },
    css: {
      postcss: {
        plugins: [
          autoprefixer({}), // add options if needed
        ],
      },
      preprocessorOptions: {
        scss: {
          quietDeps: true,
          silenceDeprecations: ['import', 'legacy-js-api'],
        },
      },
    },
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.jsx?$/,
      exclude: [],
    },
    optimizeDeps: {
      force: true,
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'react-redux',
        '@coreui/react',
        '@coreui/icons-react',
        '@coreui/icons'
      ],
    },
    plugins: [
      react({
        babel: {
          presets: ['@babel/preset-react'],
          plugins: [
            ['@babel/plugin-transform-react-jsx', { 
              runtime: 'automatic',
              throwIfNamespace: false
            }],
          ],
        },
      }),
    ],
    resolve: {
      alias: [
        {
          find: 'src/',
          replacement: `${path.resolve(__dirname, 'src')}/`,
        },
      ],
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.scss'],
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
      hmr: {
        overlay: true,
      },
    },
    define: {
      'process.env': env
    }
  }
})
